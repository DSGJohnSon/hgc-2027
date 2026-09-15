import type { CollectionConfig, GroupField, Validate } from 'payload'

import { anyone, isEditor } from '../access'
import { colorField } from '../fields/color'
import { imageField } from '../fields/image'
import { slugField } from '../fields/slug'
import { transportsField } from '../fields/transports'
import { textBlock } from '../blocks/text'
import { galleryBlock, statisticsBlock } from '../blocks/media'
import { CACHE_TAGS, revalidateCollection, revalidateOnDelete } from '../hooks/revalidate'
import { relationId } from '../utils'

/** Champs de visuels communs aux événements et aux séries. */
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

const seriesOf = (data: unknown) => relationId((data as { series?: unknown } | undefined)?.series)

/** Une étape de série peut laisser ses visuels vides : elle reprend ceux de la série. */
const optionalInSeries = (field: GroupField): GroupField => ({
  ...field,
  validate: (value, options) =>
    seriesOf(options.data) || !field.validate ? true : field.validate(value, options),
})

/**
 * Unicité de l'identifiant.
 *
 * Une étape vit à `/evenements/<série>/<identifiant>` : deux séries peuvent donc
 * avoir chacune une étape « marcq-en-baroeul ». L'identifiant doit seulement être
 * unique dans sa série ou, pour un événement hors série, parmi les événements
 * hors série et les séries, qui partagent l'adresse `/evenements/<identifiant>`.
 */
const validateEventSlug: Validate = async (value, { data, id, req }) => {
  if (typeof value !== 'string' || value.length === 0 || !req?.payload) return true

  const seriesId = seriesOf(data)
  const { docs } = await req.payload.find({
    collection: 'events',
    where: { slug: { equals: value } },
    depth: 0,
    draft: true,
    pagination: false,
    req,
  })
  const taken = docs.some(
    (doc) => String(doc.id) !== String(id) && relationId(doc.series) === seriesId,
  )
  if (taken) {
    return seriesId
      ? 'Une autre étape de cette série utilise déjà cet identifiant.'
      : 'Un autre événement utilise déjà cet identifiant.'
  }

  if (!seriesId) {
    const series = await req.payload.count({
      collection: 'event-series',
      where: { slug: { equals: value } },
      req,
    })
    if (series.totalDocs > 0) return 'Une série d’événements utilise déjà cet identifiant.'
  }

  return true
}

/**
 * Événements — tournois, événements libres, ou les deux (`both`).
 *
 * Un événement peut être rattaché à une série (champ `series`) : il en devient
 * une étape, publiée à l'adresse `/evenements/<série>/<identifiant>`. Les champs
 * qu'une étape laisse vides reprennent les valeurs de sa série (voir
 * `lib/content/mappers/entities.ts`).
 */
export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Événement', plural: 'Événements' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'startDate', 'series', 'type', 'isCancelled'],
    group: 'Contenu',
    description: 'Événements et tournois, ponctuels ou étapes d’une série.',
    // Passe par le mode brouillon de Next.js (voir app/api/preview/route.ts) :
    // sans ça, ce bouton renverrait la version publiée, pas l'état courant.
    preview: (doc) =>
      doc?.id
        ? `/api/preview?secret=${process.env.PAYLOAD_PREVIEW_SECRET}&collection=events&id=${doc.id}`
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
    slugField(
      'Adresse de la page : /evenements/<identifiant>, ou /evenements/<série>/<identifiant> pour une étape.',
      { unique: false, validate: validateEventSlug },
    ),
    {
      name: 'series',
      type: 'relationship',
      relationTo: 'event-series',
      label: 'Série',
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Rattache l’événement à une tournée, dont il devient une étape. Les visuels, la description, les jeux et les partenaires laissés vides reprennent ceux de la série.',
      },
    },
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
                  // Une étape prend toujours la couleur de sa série.
                  admin: { width: '50%', condition: (data) => !seriesOf(data) },
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
          description: 'Pour une étape de série, laissez vide pour reprendre les visuels de la série.',
          fields: [...eventVisualFields.map(optionalInSeries), partnersField],
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
              admin: {
                description:
                  'Pour une étape de série, laissez vide pour reprendre la description de la série.',
              },
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
