import type { Field } from 'payload'

import { imageField } from './image'

/**
 * Petits champs réutilisés par plusieurs sections.
 *
 * Les tableaux Payload produisent des objets (`{ value: "…" }`) là où le site
 * attend des chaînes (`string[]`). La convention retenue est de toujours nommer
 * la valeur `value` : les mappers savent alors aplatir n'importe quel tableau
 * de ce type avec un seul helper (`flatten()`).
 */

/** Liste de paragraphes → `string[]`. */
export const paragraphsField = (
  name = 'paragraphs',
  label = 'Paragraphes',
): Field => ({
  name,
  type: 'array',
  label,
  labels: { singular: 'Paragraphe', plural: 'Paragraphes' },
  fields: [{ name: 'value', type: 'textarea', label: 'Texte', required: true }],
})

/** Liste de chaînes courtes → `string[]`. */
export const stringListField = (
  name: string,
  label: string,
  singular = 'Élément',
): Field => ({
  name,
  type: 'array',
  label,
  labels: { singular, plural: label },
  fields: [{ name: 'value', type: 'text', label: 'Texte', required: true }],
})

/** Boutons d'appel à l'action, forme `{ text, href, variant, size }`. */
export const ctasField = (name = 'ctas', label = "Boutons d'action"): Field => ({
  name,
  type: 'array',
  label,
  labels: { singular: 'Bouton', plural: 'Boutons' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Libellé',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'href',
          type: 'text',
          label: 'Lien',
          required: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'variant',
          type: 'select',
          label: 'Style',
          defaultValue: 'primary',
          options: [
            { label: 'Principal', value: 'primary' },
            { label: 'Secondaire', value: 'secondary' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'size',
          type: 'select',
          label: 'Taille',
          defaultValue: 'md',
          options: [
            { label: 'Petite', value: 'sm' },
            { label: 'Moyenne', value: 'md' },
            { label: 'Grande', value: 'lg' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
  ],
})

/** Image accompagnée de sa position dans la section (gauche / droite). */
export const positionedImageField = (
  name = 'image',
  label = 'Image',
  withPath = true,
): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    ...imageField({ name: 'source', label: 'Fichier', withPath }).fields,
    {
      name: 'position',
      type: 'select',
      label: 'Position',
      defaultValue: 'right',
      options: [
        { label: 'À gauche du texte', value: 'left' },
        { label: 'À droite du texte', value: 'right' },
      ],
    },
  ],
})

/** Liens sociaux, partagés entre le header et le pied de page. */
export const socialLinksField = (): Field => ({
  name: 'socialLinks',
  type: 'array',
  label: 'Réseaux sociaux',
  labels: { singular: 'Réseau', plural: 'Réseaux' },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'platform',
          type: 'text',
          label: 'Plateforme',
          required: true,
          admin: { width: '40%' },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Lien',
          required: true,
          admin: { width: '40%' },
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icône',
          required: true,
          admin: {
            width: '20%',
            description: 'facebook, twitter, instagram, linkedin…',
          },
        },
      ],
    },
  ],
})
