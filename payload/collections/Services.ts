import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '../access'
import { colorField } from '../fields/color'
import { imageField } from '../fields/image'
import { slugField } from '../fields/slug'
import { textBlock } from '../blocks/text'
import { galleryBlock, statisticsBlock } from '../blocks/media'
import {
  ageDistributionBlock,
  equipmentBlock,
  gamesBlock,
  highlightBlock,
  imageTextBlock,
  roleSplitBlock,
  speakersBlock,
  themesBlock,
} from '../blocks/services'
import { CACHE_TAGS, revalidateCollection, revalidateOnDelete } from '../hooks/revalidate'

const isBtoB = (data: Record<string, unknown> | undefined) => data?.target === 'btob'
const isBtoC = (data: Record<string, unknown> | undefined) => data?.target === 'btoc'

/**
 * Services — miroir de `data/services-btob.ts` et `data/services-btoc.ts`.
 *
 * Les deux familles partagent la quasi-totalité de leur structure : une seule
 * collection avec un champ `target` discriminant évite de dupliquer le modèle,
 * et les mappers redécoupent en `ServiceBtoB` / `ServiceBtoC` pour le front.
 */
export const Services: CollectionConfig = {
  slug: 'services',
  labels: { singular: 'Service', plural: 'Services' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'target', 'isDraft', '_status'],
    group: 'Contenu',
    description: 'Pages de l’offre : collectivités (BtoB) et particuliers (BtoC).',
    preview: (doc) => (doc?.slug ? `/nos-services/${doc.slug}` : null),
  },
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  hooks: {
    afterChange: [revalidateCollection(CACHE_TAGS.services)],
    afterDelete: [revalidateOnDelete(CACHE_TAGS.services)],
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    slugField('Adresse de la page : /nos-services/<identifiant>.'),
    {
      name: 'target',
      type: 'select',
      label: 'Public',
      required: true,
      defaultValue: 'btob',
      options: [
        { label: 'Collectivités & organismes (BtoB)', value: 'btob' },
        { label: 'Particuliers (BtoC)', value: 'btoc' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Détermine le gabarit de la page et la section du hub.',
      },
    },
    {
      name: 'isDraft',
      type: 'checkbox',
      label: 'Contenu provisoire',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'À cocher tant que le contenu définitif n’a pas été fourni par l’association.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Présentation',
          fields: [
            { name: 'title', type: 'text', label: 'Titre', required: true },
            { name: 'tagline', type: 'text', label: 'Accroche' },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Description courte',
              required: true,
              admin: {
                description:
                  'Utilisée sur la carte du hub et comme description pour les moteurs de recherche.',
              },
            },
            colorField({ label: 'Couleur d’accent', required: true, defaultValue: '#6240cf' }),
          ],
        },
        {
          label: 'Visuels',
          fields: [
            imageField({ name: 'logo', label: 'Logo du service', withAlt: false }),
            imageField({
              name: 'cardThumbnail',
              label: 'Vignette (grille du hub)',
              required: true,
            }),
            imageField({ name: 'heroBanner', label: 'Bannière (ordinateur)', required: true }),
            imageField({
              name: 'heroBannerMobile',
              label: 'Bannière (mobile)',
              required: true,
            }),
          ],
        },
        {
          label: 'Contenu',
          fields: [
            {
              name: 'stats',
              type: 'array',
              label: 'Chiffres clés',
              labels: { singular: 'Chiffre', plural: 'Chiffres' },
              admin: {
                condition: isBtoB,
                description: 'Affichés dans le hero de la page.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'value',
                      type: 'number',
                      label: 'Valeur',
                      required: true,
                      admin: { width: '40%' },
                    },
                    {
                      name: 'type',
                      type: 'select',
                      label: 'Format',
                      defaultValue: 'number',
                      options: [
                        { label: 'Nombre', value: 'number' },
                        { label: 'Euros', value: 'euros' },
                      ],
                      admin: { width: '30%' },
                    },
                    {
                      name: 'plus',
                      type: 'checkbox',
                      label: 'Afficher « + »',
                      defaultValue: false,
                      admin: { width: '30%' },
                    },
                  ],
                },
                { name: 'label', type: 'text', label: 'Libellé', required: true },
                { name: 'sublabel', type: 'text', label: 'Sous-libellé' },
              ],
            },
            {
              name: 'content',
              type: 'blocks',
              label: 'Sections',
              labels: { singular: 'Section', plural: 'Sections' },
              blocks: [
                textBlock,
                statisticsBlock,
                galleryBlock,
                imageTextBlock,
                ageDistributionBlock,
                roleSplitBlock,
                highlightBlock,
                speakersBlock,
                themesBlock,
                gamesBlock,
                equipmentBlock,
              ],
            },
          ],
        },
        {
          label: 'Contact & réservation',
          fields: [
            {
              name: 'formProjectLabel',
              type: 'text',
              label: 'Libellé « Projet concerné »',
              admin: {
                condition: isBtoB,
                description:
                  'Valeur pré-remplie dans le formulaire de demande. Par défaut, le titre du service.',
              },
            },
            {
              name: 'helloAssoEmbed',
              type: 'textarea',
              label: 'Code d’intégration HelloAsso',
              admin: {
                condition: isBtoC,
                description: 'Widget de réservation affiché en bas de page.',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default Services
