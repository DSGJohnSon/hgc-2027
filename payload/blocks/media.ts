import type { Block } from 'payload'
import { imageField } from '../fields/image'

/** Bloc « Chiffres clés » — miroir de { type: "statistics", content: StatisticsData }. */
export const statisticsBlock: Block = {
  slug: 'statistics',
  labels: { singular: 'Chiffres clés', plural: 'Chiffres clés' },
  fields: [
    {
      name: 'stats',
      type: 'array',
      label: 'Chiffres',
      labels: { singular: 'Chiffre', plural: 'Chiffres' },
      minRows: 1,
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
  ],
}

/** Bloc « Galerie » — miroir de { type: "gallery", content: GalleryData }. */
export const galleryBlock: Block = {
  slug: 'gallery',
  labels: { singular: 'Galerie photo', plural: 'Galeries photo' },
  fields: [
    { name: 'title', type: 'text', label: 'Titre' },
    { name: 'subtitle', type: 'text', label: 'Sur-titre' },
    {
      name: 'images',
      type: 'array',
      label: 'Photos',
      labels: { singular: 'Photo', plural: 'Photos' },
      minRows: 1,
      fields: [imageField({ name: 'image', label: 'Photo' })],
    },
  ],
}
