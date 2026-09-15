import { APIError, type CollectionConfig, type Validate } from 'payload'

import { anyone, isEditor } from '../access'
import { colorField } from '../fields/color'
import { slugField } from '../fields/slug'
import {
  eventDescriptionBlocks,
  eventVisualFields,
  partnersField,
} from './Events'
import { CACHE_TAGS, revalidateCollection, revalidateOnDelete } from '../hooks/revalidate'
import { relationId } from '../utils'

/** Une série partage l'adresse `/evenements/<identifiant>` avec les événements hors série. */
const validateSeriesSlug: Validate = async (value, { req }) => {
  if (typeof value !== 'string' || value.length === 0 || !req?.payload) return true

  const { docs } = await req.payload.find({
    collection: 'events',
    where: { slug: { equals: value } },
    depth: 0,
    draft: true,
    pagination: false,
    req,
  })
  return docs.some((doc) => !relationId(doc.series))
    ? 'Un événement hors série utilise déjà cet identifiant.'
    : true
}

/**
 * Séries d'événements — tournées déclinées en plusieurs étapes (Gaming House
 * Tour, Nos quartiers d'été…).
 *
 * Les étapes sont de vrais documents de la collection `events`, rattachés par
 * leur champ `series` : chacune a son brouillon, son aperçu et son adresse
 * `/evenements/<série>/<étape>`. La série porte ce qui leur est commun, et une
 * étape reprend ces valeurs pour les champs qu'elle laisse vides.
 */
export const EventSeries: CollectionConfig = {
  slug: 'event-series',
  labels: { singular: 'Série d’événements', plural: 'Séries d’événements' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    group: 'Contenu',
    description: 'Tournées regroupant plusieurs événements, leurs étapes.',
    preview: (doc) =>
      doc?.id
        ? `/api/preview?secret=${process.env.PAYLOAD_PREVIEW_SECRET}&collection=event-series&id=${doc.id}`
        : null,
  },
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  hooks: {
    // `getEventSeries()` porte aussi le tag des événements : modifier une étape
    // rafraîchit donc la série qui la contient.
    afterChange: [revalidateCollection(CACHE_TAGS.eventSeries)],
    afterDelete: [revalidateOnDelete(CACHE_TAGS.eventSeries)],
    beforeDelete: [
      async ({ id, req }) => {
        const { totalDocs } = await req.payload.count({
          collection: 'events',
          where: { series: { equals: id } },
          req,
        })
        if (totalDocs > 0) {
          throw new APIError(
            `Cette série compte encore ${totalDocs} étape${totalDocs > 1 ? 's' : ''} : détachez-les ou supprimez-les avant de supprimer la série.`,
            400,
            undefined,
            true,
          )
        }
      },
    ],
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    slugField('Adresse de la page : /evenements/<identifiant>.', {
      validate: validateSeriesSlug,
    }),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Série',
          fields: [
            { name: 'title', type: 'text', label: 'Titre', required: true },
            colorField({ label: 'Couleur d’accent', required: true, defaultValue: '#6240cf' }),
            {
              name: 'isCancelled',
              type: 'checkbox',
              label: 'Série annulée',
              defaultValue: false,
              admin: { position: 'sidebar' },
            },
            ...eventVisualFields,
            partnersField,
            {
              name: 'description',
              type: 'blocks',
              label: 'Description commune',
              labels: { singular: 'Bloc', plural: 'Blocs' },
              blocks: eventDescriptionBlocks,
              admin: {
                description:
                  'Contenu affiché sur la page de la série et repris par les étapes qui n’ont pas leur propre description.',
              },
            },
          ],
        },
        {
          label: 'Jeux',
          description: 'Repris par les étapes qui ne définissent pas les leurs.',
          fields: [
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              label: 'Catégories',
            },
            {
              name: 'games',
              type: 'relationship',
              relationTo: 'games',
              hasMany: true,
              label: 'Jeux du tournoi',
            },
            {
              name: 'freeplayGames',
              type: 'relationship',
              relationTo: 'games',
              hasMany: true,
              label: 'Jeux en free play',
            },
            {
              name: 'randomizeFreeplayGames',
              type: 'checkbox',
              label: 'Afficher les jeux free play dans un ordre aléatoire',
              defaultValue: false,
            },
          ],
        },
        {
          label: 'Étapes',
          fields: [
            {
              name: 'steps',
              type: 'join',
              collection: 'events',
              on: 'series',
              label: 'Étapes',
              defaultSort: 'startDate',
              defaultLimit: 50,
              admin: {
                defaultColumns: ['title', 'startDate', 'location', '_status'],
                description:
                  'Événements rattachés à cette série. Pour ajouter une étape, créez un événement et choisissez cette série dans son champ « Série ».',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default EventSeries
