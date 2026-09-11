import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '../access'
import { colorField } from '../fields/color'
import { imageField } from '../fields/image'
import { slugField } from '../fields/slug'
import { transportsField } from '../fields/transports'
import { textBlock } from '../blocks/text'
import { galleryBlock, statisticsBlock } from '../blocks/media'
import { CACHE_TAGS, revalidateCollection, revalidateOnDelete } from '../hooks/revalidate'

/** Champs de visuels communs aux événements et aux étapes de série. */
export const eventVisualFields = [
  imageField({
    name: 'cardThumbnail',
    label: 'Vignette (listes et carrousels)',
    required: true,
  }),
  imageField({ name: 'heroBanner', label: 'Bannière (ordinateur)', required: true }),
  imageField({ name: 'heroBannerMobile', label: 'Bannière (mobile)', required: true }),
]

/**
 * Partenaires associés — sélection dans la collection `partners`.
 *
 * L'ordre choisi est conservé et repris tel quel à l'affichage.
 */
export const partnersField = {
  name: 'partners',
  type: 'relationship' as const,
  relationTo: 'partners' as const,
  hasMany: true,
  label: 'Partenaires',
  admin: {
    description:
      'Sélectionnez les partenaires à afficher. Pour en ajouter un au catalogue, passez par Référentiels → Partenaires.',
  },
}

/** Blocs de contenu disponibles dans la description d'un événement. */
export const eventDescriptionBlocks = [textBlock, statisticsBlock, galleryBlock]

/**
 * Événements — miroir de `data/events.ts`.
 *
 * Un événement peut être un tournoi, un événement libre, ou les deux (`both`).
 * Les séries d'événements sont gérées à part (collection `event-series`) : la page
 * `/evenements/[id]` cherche d'abord une série, puis un événement simple.
 */
export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Événement', plural: 'Événements' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'type', 'isCancelled'],
    group: 'Contenu',
    description: 'Événements et tournois ponctuels.',
    // Passe par le mode brouillon de Next.js (voir app/api/preview/route.ts) :
    // sans ça, ce bouton renverrait la version publiée, pas l'état courant.
    preview: (doc) =>
      doc?.slug
        ? `/api/preview?secret=${process.env.PAYLOAD_PREVIEW_SECRET}&collection=events&slug=${doc.slug}`
        : null,
    components: {
      views: {
        // Liste en cards illustrées par la vignette, à la place du tableau.
        // Recherche, filtres, tri, pagination et sélection multiple sont
        // recomposés à partir des composants de Payload — voir le fichier.
        list: {
          Component: '/components/admin/views/EventsListView#EventsListView',
        },
      },
    },
  },
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  hooks: {
    afterChange: [revalidateCollection(CACHE_TAGS.events)],
    afterDelete: [revalidateOnDelete(CACHE_TAGS.events)],
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: '-startDate',
  fields: [
    slugField("Adresse de la page : /evenements/<identifiant>."),
    {
      name: 'preview',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/components/admin/fields/EventPreviewField#EventPreviewField',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Général',
          fields: [
            { name: 'title', type: 'text', label: 'Titre', required: true },
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  type: 'select',
                  label: 'Nature',
                  required: true,
                  defaultValue: 'event',
                  options: [
                    { label: 'Tournoi', value: 'tournoi' },
                    { label: 'Événement', value: 'event' },
                    { label: 'Tournoi & Événement', value: 'both' },
                  ],
                  admin: { width: '50%' },
                },
                colorField({
                  label: 'Couleur d’accent',
                  required: true,
                  defaultValue: '#6240cf',
                  admin: { width: '50%' },
                }),
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'startDate',
                  type: 'date',
                  label: 'Date de début',
                  required: true,
                  admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
                },
                {
                  name: 'endDate',
                  type: 'date',
                  label: 'Date de fin',
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                    description: 'À renseigner uniquement si l’événement dure plusieurs jours.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'startTime',
                  type: 'text',
                  label: 'Heure de début',
                  admin: { width: '50%', placeholder: '18h00' },
                },
                {
                  name: 'endTime',
                  type: 'text',
                  label: 'Heure de fin',
                  admin: { width: '50%', placeholder: '21h00' },
                },
              ],
            },
            {
              name: 'location',
              type: 'text',
              label: 'Lieu',
              admin: { description: 'Adresse utilisée pour la carte et l’itinéraire.' },
            },
            {
              name: 'isCancelled',
              type: 'checkbox',
              label: 'Événement annulé',
              defaultValue: false,
              admin: { position: 'sidebar' },
            },
          ],
        },
        {
          label: 'Visuels',
          fields: [...eventVisualFields, partnersField],
        },
        {
          label: 'Contenu',
          fields: [
            {
              name: 'description',
              type: 'blocks',
              label: 'Description',
              labels: { singular: 'Bloc', plural: 'Blocs' },
              blocks: eventDescriptionBlocks,
            },
          ],
        },
        {
          label: 'Jeux',
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
          label: 'Inscription',
          fields: [
            {
              name: 'registrationOpen',
              type: 'checkbox',
              label: 'Inscriptions ouvertes',
              defaultValue: false,
            },
            {
              name: 'weezeventCode',
              type: 'textarea',
              label: 'Code d’intégration Weezevent',
              admin: {
                description:
                  'Collez ici le code fourni par Weezevent pour la billetterie de cet événement.',
                condition: (data) => Boolean(data?.registrationOpen),
              },
            },
          ],
        },
        {
          label: 'Accès',
          fields: [transportsField()],
        },
      ],
    },
  ],
}

export default Events
