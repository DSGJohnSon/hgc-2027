import path from 'path'
import { fileURLToPath } from 'url'

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
import { Services } from './payload/collections/Services'
import { CollectivitesPage } from './payload/globals/Collectivites'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Vercel Blob n'est activé que si le jeton est fourni. Sans lui (développement
// local), Payload stocke les fichiers sur disque dans `public/media`.
const blobToken = process.env.BLOB_READ_WRITE_TOKEN

// Payload envoie des emails pour la réinitialisation de mot de passe. On réutilise
// le compte Resend déjà en place pour le formulaire de contact. Sans clé (dev),
// Payload écrit les emails dans la console.
const resendKey = process.env.RESEND_API_KEY

export default buildConfig({
  editor: lexicalEditor(),

  globals: [CollectivitesPage],

  collections: [
    Events,
    EventSeries,
    Services,
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
  }),
  sharp,
  serverURL: process.env.PAYLOAD_SERVER_URL || 'http://localhost:3000',
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
          collections: { media: true },
          token: blobToken,
        }),
      ]
    : [],
})
