import type { Block } from 'payload'

/**
 * Bloc « Texte » — miroir de :
 *   { type: "text", content: { type: "title"|"paragraph"|"list"|"citation", ... }[] }
 *
 * Chaque variante de `content` est modélisée comme un Block imbriqué portant le
 * même slug que le `type` actuel : le mapper renomme simplement `blockType` en
 * `type` et le rendu (EventInfo.tsx, templates services) ne change pas.
 */

const titleItem: Block = {
  slug: 'title',
  labels: { singular: 'Titre', plural: 'Titres' },
  fields: [{ name: 'title', type: 'text', label: 'Titre', required: true }],
}

const paragraphItem: Block = {
  slug: 'paragraph',
  labels: { singular: 'Paragraphe', plural: 'Paragraphes' },
  fields: [
    {
      name: 'paragraphs',
      type: 'array',
      label: 'Paragraphes',
      labels: { singular: 'Paragraphe', plural: 'Paragraphes' },
      minRows: 1,
      fields: [{ name: 'text', type: 'textarea', label: 'Texte', required: true }],
    },
  ],
}

const listItem: Block = {
  slug: 'list',
  labels: { singular: 'Liste à puces', plural: 'Listes à puces' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Éléments',
      labels: { singular: 'Élément', plural: 'Éléments' },
      minRows: 1,
      fields: [{ name: 'text', type: 'text', label: 'Texte', required: true }],
    },
  ],
}

const citationItem: Block = {
  slug: 'citation',
  labels: { singular: 'Citation', plural: 'Citations' },
  fields: [
    { name: 'citationText', type: 'textarea', label: 'Citation', required: true },
  ],
}

export const textBlock: Block = {
  slug: 'text',
  labels: { singular: 'Texte', plural: 'Textes' },
  fields: [
    {
      name: 'content',
      type: 'blocks',
      label: 'Contenu',
      blocks: [titleItem, paragraphItem, listItem, citationItem],
      minRows: 1,
    },
  ],
}

/** Les mêmes éléments, utilisables à plat (actualités : `content[]` sans wrapper). */
export const textContentBlocks = [titleItem, paragraphItem, listItem, citationItem]
