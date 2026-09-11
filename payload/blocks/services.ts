import type { Block } from 'payload'
import { imageField } from '../fields/image'

/**
 * Blocs spécifiques aux pages Services — miroir de types/pages/service-blocks.ts.
 * Les slugs reprennent exactement les `type` de l'union `ServiceBlock`.
 */

/** Combo image + texte (surtout BtoC). */
export const imageTextBlock: Block = {
  slug: 'imageText',
  labels: { singular: 'Image + texte', plural: 'Images + texte' },
  fields: [
    { name: 'title', type: 'text', label: 'Titre' },
    {
      name: 'text',
      type: 'array',
      label: 'Paragraphes',
      labels: { singular: 'Paragraphe', plural: 'Paragraphes' },
      minRows: 1,
      fields: [{ name: 'value', type: 'textarea', label: 'Texte', required: true }],
    },
    imageField({ name: 'image', label: 'Image', required: true }),
    {
      name: 'reverse',
      type: 'checkbox',
      label: 'Image à droite',
      defaultValue: false,
    },
  ],
}

/** Répartition par âge (bar chart en %). */
export const ageDistributionBlock: Block = {
  slug: 'ageDistribution',
  labels: { singular: 'Répartition par âge', plural: 'Répartitions par âge' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      admin: { placeholder: 'Répartition par âge' },
    },
    {
      name: 'buckets',
      type: 'array',
      label: 'Tranches',
      labels: { singular: 'Tranche', plural: 'Tranches' },
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Tranche',
              required: true,
              admin: { width: '60%', placeholder: '8-16 ans' },
            },
            {
              name: 'percent',
              type: 'number',
              label: 'Pourcentage',
              required: true,
              min: 0,
              max: 100,
              admin: { width: '40%' },
            },
          ],
        },
      ],
    },
  ],
}

/** Partage des rôles « La ville apporte » / « HGC apporte ». */
export const roleSplitBlock: Block = {
  slug: 'roleSplit',
  labels: { singular: 'Partage des rôles', plural: 'Partages des rôles' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'cityTitle',
          type: 'text',
          label: 'Titre colonne 1',
          admin: { width: '50%', placeholder: 'La ville apporte' },
        },
        {
          name: 'hgcTitle',
          type: 'text',
          label: 'Titre colonne 2',
          admin: { width: '50%', placeholder: 'HGC apporte' },
        },
      ],
    },
    {
      name: 'cityItems',
      type: 'array',
      label: 'Éléments colonne 1',
      labels: { singular: 'Élément', plural: 'Éléments' },
      fields: [{ name: 'value', type: 'text', label: 'Texte', required: true }],
    },
    {
      name: 'hgcItems',
      type: 'array',
      label: 'Éléments colonne 2',
      labels: { singular: 'Élément', plural: 'Éléments' },
      fields: [{ name: 'value', type: 'text', label: 'Texte', required: true }],
    },
  ],
}

/** Encadré « Le petit plus ». */
export const highlightBlock: Block = {
  slug: 'highlight',
  labels: { singular: 'Encadré', plural: 'Encadrés' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      admin: { placeholder: 'Le petit plus' },
    },
    { name: 'text', type: 'textarea', label: 'Texte', required: true },
  ],
}

/** Intervenants (conférences). */
export const speakersBlock: Block = {
  slug: 'speakers',
  labels: { singular: 'Intervenants', plural: 'Intervenants' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      admin: { placeholder: 'Nos intervenants' },
    },
    {
      name: 'speakers',
      type: 'array',
      label: 'Intervenants',
      labels: { singular: 'Intervenant', plural: 'Intervenants' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Nom',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'role',
              type: 'text',
              label: 'Rôle',
              required: true,
              admin: { width: '50%' },
            },
          ],
        },
        imageField({ name: 'photo', label: 'Photo', withAlt: false }),
        { name: 'linkedin', type: 'text', label: 'LinkedIn' },
      ],
    },
  ],
}

/** Thématiques à icônes (rendu via FeatureGrid). */
export const themesBlock: Block = {
  slug: 'themes',
  labels: { singular: 'Thématiques', plural: 'Thématiques' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      admin: { placeholder: 'Thématiques abordées' },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Thématiques',
      labels: { singular: 'Thématique', plural: 'Thématiques' },
      fields: [
        { name: 'title', type: 'text', label: 'Titre', required: true },
        { name: 'description', type: 'textarea', label: 'Description' },
        {
          name: 'icon',
          type: 'text',
          label: 'Icône',
          admin: { description: 'Emoji ou nom de l’icône.' },
        },
      ],
    },
  ],
}

/** Jeux disponibles — ids résolus via la collection `games`. */
export const gamesBlock: Block = {
  slug: 'games',
  labels: { singular: 'Jeux disponibles', plural: 'Jeux disponibles' },
  fields: [
    { name: 'title', type: 'text', label: 'Titre' },
    { name: 'subtitle', type: 'text', label: 'Sous-titre' },
    {
      name: 'games',
      type: 'relationship',
      relationTo: 'games',
      hasMany: true,
      label: 'Jeux',
    },
    {
      name: 'randomize',
      type: 'checkbox',
      label: 'Ordre aléatoire',
      defaultValue: false,
    },
  ],
}

/** Liste / galerie d'équipement (Gaming Room). */
export const equipmentBlock: Block = {
  slug: 'equipment',
  labels: { singular: 'Équipement', plural: 'Équipements' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titre',
      admin: { placeholder: 'Notre équipement' },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Éléments',
      labels: { singular: 'Élément', plural: 'Éléments' },
      fields: [
        { name: 'label', type: 'text', label: 'Libellé', required: true },
        { name: 'icon', type: 'text', label: 'Icône' },
        imageField({ name: 'image', label: 'Image', withAlt: false }),
      ],
    },
  ],
}
