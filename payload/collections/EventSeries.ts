import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '../access'
import { colorField } from '../fields/color'
import { slugField } from '../fields/slug'
import { transportsField } from '../fields/transports'
import {
  eventDescriptionBlocks,
  eventVisualFields,
  partnersField,
} from './Events'
import { CACHE_TAGS, revalidateCollection, revalidateOnDelete } from '../hooks/revalidate'

/**
 * Séries d'événements — miroir de `data/event-series.ts`.
 *
 * Une série est un événement parent (Gaming House Tour, Nos quartiers d'été…)
 * décliné en plusieurs étapes. Chaque étape hérite des visuels et du contenu du
 * parent et peut les surcharger : c'est pourquoi tous les champs d'une étape sont
 * facultatifs sauf ceux qui lui sont propres (date, lieu).
 */
export const EventSeries: CollectionConfig = {
  slug: 'event-series',
  labels: { singular: 'Série d’événements', plural: 'Séries d’événements' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    group: 'Contenu',
    description: 'Tournées et séries déclinées en plusieurs étapes.',
    preview: (doc) => (doc?.slug ? `/evenements/${doc.slug}` : null),
  },
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  hooks: {
    afterChange: [revalidateCollection(CACHE_TAGS.eventSeries)],
    afterDelete: [revalidateOnDelete(CACHE_TAGS.eventSeries)],
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    slugField('Adresse de la page : /evenements/<identifiant>.'),
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
          ],
        },
        {
          label: 'Étapes',
          fields: [
            {
              name: 'dates',
              type: 'array',
              label: 'Étapes',
              labels: { singular: 'Étape', plural: 'Étapes' },
              minRows: 1,
              admin: {
                description:
                  'Chaque étape hérite des visuels et du contenu de la série ; ne remplissez que ce qui change.',
              },
              fields: [
                {
                  name: 'slug',
                  type: 'text',
                  label: 'Identifiant de l’étape',
                  required: true,
                  admin: {
                    description: 'Adresse : /evenements/<série>/<identifiant d’étape>.',
                  },
                },
                { name: 'title', type: 'text', label: 'Titre (si différent)' },
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
                      admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
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
                      admin: { width: '50%', placeholder: '14h00' },
                    },
                    {
                      name: 'endTime',
                      type: 'text',
                      label: 'Heure de fin',
                      admin: { width: '50%', placeholder: '00h00' },
                    },
                  ],
                },
                { name: 'location', type: 'text', label: 'Lieu', required: true },
                {
                  name: 'isCancelled',
                  type: 'checkbox',
                  label: 'Étape annulée',
                  defaultValue: false,
                },
                {
                  type: 'collapsible',
                  label: 'Visuels propres à l’étape',
                  admin: { initCollapsed: true },
                  fields: eventVisualFields.map((field) => ({
                    ...field,
                    validate: undefined,
                  })),
                },
                {
                  type: 'collapsible',
                  label: 'Contenu propre à l’étape',
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      name: 'description',
                      type: 'blocks',
                      label: 'Description',
                      labels: { singular: 'Bloc', plural: 'Blocs' },
                      blocks: eventDescriptionBlocks,
                    },
                    partnersField,
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
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Inscription',
                  admin: { initCollapsed: true },
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
                        condition: (_, siblingData) =>
                          Boolean(siblingData?.registrationOpen),
                      },
                    },
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Accès',
                  admin: { initCollapsed: true },
                  fields: [transportsField()],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default EventSeries
