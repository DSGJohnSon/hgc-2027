import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '../access'
import { CACHE_TAGS, revalidateMany, revalidateManyOnDelete } from '../hooks/revalidate'

// Un partenaire est intégré au rendu des événements, des séries et des pages
// d’accueil (joueurs et collectivités) : son cache propre ne suffit pas.
const AFFECTED_TAGS = [
  CACHE_TAGS.partners,
  CACHE_TAGS.events,
  CACHE_TAGS.eventSeries,
  CACHE_TAGS.collectivitesPage,
  CACHE_TAGS.homePage,
]

/**
 * Partenaires de l'association.
 *
 * Auparavant, chaque événement et chaque section « Partenaires » portait sa
 * propre liste de logos : le même partenaire était donc ressaisi à chaque
 * utilisation, avec des noms et des fichiers qui divergeaient au fil du temps.
 * Ils sont désormais référencés depuis cette collection unique — on met le logo
 * à jour à un seul endroit et il change partout.
 *
 * Pas de champ « identifiant » ici : contrairement aux jeux ou aux catégories,
 * le site ne référence jamais un partenaire par un slug, il n'affiche que son
 * logo. La relation Payload suffit.
 */
export const Partners: CollectionConfig = {
  slug: 'partners',
  labels: { singular: 'Partenaire', plural: 'Partenaires' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'url'],
    group: 'Référentiels',
    description:
      'Logos des partenaires, réutilisables sur les événements et dans les sections « Partenaires ».',
    components: {
      views: {
        // Liste en cards : logo et nom. Voir le fichier pour la composition.
        list: {
          Component: '/components/admin/views/PartnersListView#PartnersListView',
        },
      },
    },
  },
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  hooks: {
    afterChange: [revalidateMany(AFFECTED_TAGS)],
    afterDelete: [revalidateManyOnDelete(AFFECTED_TAGS)],
  },
  defaultSort: 'name',
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom',
      required: true,
      admin: {
        description:
          'Sert aussi de texte alternatif au logo, pour l’accessibilité et le référencement.',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      admin: {
        description:
          'Envoyez le logo depuis la bibliothèque de médias. Le nom du partenaire ci-dessus lui sert de texte alternatif. Tant qu’aucun logo n’est envoyé, le partenaire n’apparaît pas sur le site.',
      },
    },
    {
      name: 'url',
      type: 'text',
      label: 'Site web',
      admin: {
        description:
          'Facultatif. Non utilisé par le site aujourd’hui — les logos ne sont pas cliquables.',
      },
    },
  ],
}

export default Partners
