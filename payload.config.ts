import path from 'path'
import { fileURLToPath } from 'url'
import dns from 'node:dns'

import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import { fr } from '@payloadcms/translations/languages/fr'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { resendAdapter } from '@payloadcms/email-resend'

import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Games } from './payload/collections/Games'
import { Categories } from './payload/collections/Categories'
import { Partners } from './payload/collections/Partners'
import { Actualites } from './payload/collections/Actualites'
import { Events } from './payload/collections/Events'
import { EventSeries } from './payload/collections/EventSeries'
import { CollectivitesPage } from './payload/globals/Collectivites'
import { HomePage } from './payload/globals/Home'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Sur ce poste, le résolveur DNS par défaut de Node échoue par intermittence
// (ECONNREFUSED) sur les requêtes SRV utilisées par les URI mongodb+srv://,
// alors que la résolution système fonctionne. On force des DNS publics avant
// la connexion pour éviter ces coupures.
//
// Strictement local : sur Vercel le résolveur interne est le bon, et le forcer
// vers des DNS publics n'apporte rien tout en ajoutant un point de panne.
if (!process.env.VERCEL) {
  dns.setServers(['1.1.1.1', '8.8.8.8'])
}

/**
 * Origines depuis lesquelles le backoffice peut légitimement être ouvert.
 *
 * Payload ajoute d'office `serverURL` à `config.csrf`, et dès que cette liste
 * n'est pas vide il **refuse le cookie de session** sur toute requête portant un
 * en-tête `Origin` absent de la liste (voir `extractJWT`). Les navigations (GET)
 * n'envoient pas d'`Origin` : l'interface s'affiche donc connectée. Mais toute
 * écriture — server action de l'éditeur, envoi d'image, déconnexion — part en
 * POST, donc avec `Origin`, et se retrouve non authentifiée : 401 côté serveur,
 * chargement infini côté écran, et déconnexion sans effet.
 *
 * On recense donc toutes les URL sous lesquelles le site répond : le domaine
 * public, mais aussi les URL techniques générées par Vercel (déploiement,
 * branche, domaine de production) pour que les préproductions fonctionnent.
 *
 * Tout alias supplémentaire — `www.`, ancien nom de domaine — doit être ajouté à
 * `PAYLOAD_CSRF_ORIGINS`, sans quoi le backoffice ouvert depuis cette URL
 * rejouerait exactement la panne décrite ci-dessus.
 */
const vercelHost = (host?: string) => (host ? `https://${host}` : undefined)

const extraOrigins = (process.env.PAYLOAD_CSRF_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)

const productionURL =
  process.env.PAYLOAD_SERVER_URL ||
  vercelHost(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  vercelHost(process.env.VERCEL_URL) ||
  'http://localhost:3000'

const allowedOrigins = Array.from(
  new Set(
    [
      productionURL,
      vercelHost(process.env.VERCEL_PROJECT_PRODUCTION_URL),
      vercelHost(process.env.VERCEL_BRANCH_URL),
      vercelHost(process.env.VERCEL_URL),
      ...extraOrigins,
    ].filter((origin): origin is string => Boolean(origin)),
  ),
)

// Vercel Blob n'est activé que si le jeton est fourni. Sans lui (développement
// local), Payload stocke les fichiers sur disque dans `public/media`.
const blobToken = process.env.BLOB_READ_WRITE_TOKEN

// Payload envoie des emails pour la réinitialisation de mot de passe. On réutilise
// le compte Resend déjà en place pour le formulaire de contact. Sans clé (dev),
// Payload écrit les emails dans la console.
const resendKey = process.env.RESEND_API_KEY

export default buildConfig({
  editor: lexicalEditor(),

  globals: [HomePage, CollectivitesPage],

  collections: [
    Events,
    EventSeries,
    Actualites,
    Games,
    Categories,
    Partners,
    Media,
    Users,
  ],


  folders: {
    // Retire le bouton « Parcourir par dossiers » de la barre latérale, et la
    // vue `/admin/browse-by-folder` qui va avec. Les dossiers restent pleinement
    // utilisables depuis la bibliothèque de médias elle-même : seule cette
    // seconde porte d'entrée, redondante, disparaît.
    browseByFolder: false,
  },

  ...(resendKey
    ? {
        email: resendAdapter({
          defaultFromAddress: 'contact@holidaygeekcup.fr',
          defaultFromName: 'Holiday Geek Cup',
          apiKey: resendKey,
        }),
      }
    : {}),

  secret: process.env.PAYLOAD_SECRET || '',
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
    // L'URI Atlas ne précise pas de base (pas de `/nom` avant le `?`), donc le
    // driver retombe sur `test` par défaut. La vraie base du projet est `hgc-website`.
    connectOptions: {
      dbName: 'hgc-website',

      /**
       * Garde-fous pour l'exécution en serverless.
       *
       * Sur Vercel, chaque requête simultanée peut démarrer sa propre instance,
       * et chacune ouvre son propre pool. Avec le `maxPoolSize` par défaut (100),
       * une poignée d'instances suffit à dépasser le plafond de connexions
       * d'Atlas — qui répond alors en coupant la poignée de main TLS plutôt que
       * par une erreur lisible. Un pool court par instance suffit largement ici
       * et rend ce plafond hors d'atteinte.
       */
      maxPoolSize: 10,
      // Pas de connexions maintenues ouvertes : une instance gelée entre deux
      // requêtes ne doit pas consommer de quota.
      minPoolSize: 0,
      // Par défaut le driver patiente 30 s avant d'abandonner : côté backoffice,
      // cela se traduit par une interface figée sans message. Mieux vaut échouer
      // vite et afficher l'erreur.
      serverSelectionTimeoutMS: 10_000,
      connectTimeoutMS: 10_000,
    },
  }),
  sharp,
  serverURL: productionURL,
  csrf: allowedOrigins,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Holiday Geek Cup',
      description: 'Interface de gestion du site Holiday Geek Cup',
      icons: [{ url: '/assets/logos/logo-hgc.svg', type: 'image/svg+xml' }],
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo#Logo',
        Icon: '/components/admin/Icon#Icon',
      },
      // Écran de connexion : Payload n'expose pas de vue `login` remplaçable,
      // on passe donc par ses points d'injection. La mise en page en deux
      // colonnes est faite en CSS dans `app/(payload)/custom.scss`.
      beforeLogin: ['/components/admin/LoginIntro#LoginIntro'],
      afterLogin: ['/components/admin/LoginAside#LoginAside'],
      // Logo du site en tête du menu latéral, qui ramène au tableau de bord.
      beforeNavLinks: ['/components/admin/NavLogo#NavLogo'],
      views: {
        // Remplace la grille de collections par défaut.
        dashboard: {
          Component: '/components/admin/views/Dashboard#Dashboard',
        },
        // Page intermédiaire derrière la card « Événements » : elle regroupe les
        // séries et les catégories, absentes de la maquette du tableau de bord.
        evenements: {
          Component: '/components/admin/views/EventsHub#EventsHub',
          path: '/evenements',
          exact: true,
          meta: { title: 'Événements' },
        },
      },
    },
  },
  i18n: {
    fallbackLanguage: 'fr',
    supportedLanguages: { fr },
  },
  telemetry: false,
  plugins: blobToken
    ? [
        vercelBlobStorage({
          enabled: true,
          collections: {
            media: {
              /**
               * Sert les images depuis le CDN de Vercel Blob, et non à travers
               * une fonction serverless.
               *
               * Sans cette option, l'URL de chaque média reste
               * `/api/media/file/<nom>` : Payload y branche un `staticHandler`
               * qui, à **chaque vignette affichée**, ouvre une fonction, fait une
               * requête Mongo pour retrouver le préfixe du fichier, interroge
               * Blob, puis recopie tout le fichier dans sa réponse. Une
               * bibliothèque de médias ouverte, c'est autant de fonctions en
               * parallèle que d'images — et autant de connexions simultanées à
               * Atlas, qui finit par couper la poignée de main TLS
               * (`MongoNetworkError … SSL alert number 80`).
               *
               * Rien n'est perdu côté sécurité : les blobs sont créés en accès
               * `public` (seul mode proposé par Vercel), et `Media.access.read`
               * est déjà ouvert à tous. Le contrôle d'accès de Payload ne
               * protégeait donc rien ici. Les médias déjà en base sont repris
               * sans migration : leur `url` est recalculée à chaque lecture.
               */
              disablePayloadAccessControl: true,
            },
          },
          token: blobToken,
        }),
      ]
    : [],
})
