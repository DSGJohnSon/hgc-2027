import type { Event } from '@/types/pages/detail-event'

import { flatten, toImageList, toStats, type Raw } from './common'

type DescriptionBlock = NonNullable<Event['description']>[number]
type TextContentItem = Extract<DescriptionBlock, { type: 'text' }>['content'][number]

/**
 * Éléments d'un bloc « Texte ».
 *
 * Payload nomme le discriminant `blockType` là où le site attend `type` : c'est,
 * à peu de chose près, toute la conversion. Les tableaux de chaînes sont aplatis
 * au passage (voir `flatten`).
 */
export const toTextContent = (rows: Raw[] | null | undefined): TextContentItem[] => {
  if (!Array.isArray(rows)) return []

  return rows
    .map((row): TextContentItem | null => {
      switch (row?.blockType) {
        case 'title':
          return { type: 'title', title: String(row.title ?? '') }
        case 'paragraph':
          return { type: 'paragraph', paragraphs: flatten(row.paragraphs, 'text') }
        case 'list':
          return { type: 'list', items: flatten(row.items, 'text') }
        case 'citation':
          return { type: 'citation', citationText: String(row.citationText ?? '') }
        default:
          return null
      }
    })
    .filter((item): item is TextContentItem => item !== null)
}

/** Galerie — forme `GalleryData`. */
const toGallery = (block: Raw) => ({
  title: String(block.title ?? ''),
  subtitle: String(block.subtitle ?? ''),
  images: toImageList(block.images),
})

/**
 * Description d'un événement — blocs `text` / `statistics` / `gallery`.
 * Rendu par `EventInfo.tsx`, dont le `switch` est resté inchangé.
 */
export const toDescription = (blocks: Raw[] | null | undefined): DescriptionBlock[] => {
  if (!Array.isArray(blocks)) return []

  return blocks
    .map((block): DescriptionBlock | null => {
      switch (block?.blockType) {
        case 'text':
          return { type: 'text', content: toTextContent(block.content) }
        case 'statistics':
          return { type: 'statistics', content: { stats: toStats(block.stats) } }
        case 'gallery':
          return { type: 'gallery', content: toGallery(block) }
        default:
          return null
      }
    })
    .filter((block): block is DescriptionBlock => block !== null)
}
