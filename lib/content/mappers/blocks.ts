import type { ServiceBlock } from '@/types/pages/service-blocks'
import type { Event } from '@/types/pages/detail-event'

import {
  flatten,
  resolveImage,
  toImageData,
  toImageList,
  toSlugs,
  toStats,
  type Raw,
} from './common'

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

/**
 * Contenu d'une page Service — reprend les trois blocs des événements et y ajoute
 * les blocs propres aux services (miroir de `types/pages/service-blocks.ts`).
 */
export const toServiceContent = (blocks: Raw[] | null | undefined): ServiceBlock[] => {
  if (!Array.isArray(blocks)) return []

  return blocks
    .map((block): ServiceBlock | null => {
      switch (block?.blockType) {
        case 'text':
          return { type: 'text', content: toTextContent(block.content) }

        case 'statistics':
          return { type: 'statistics', content: { stats: toStats(block.stats) } }

        case 'gallery':
          return { type: 'gallery', content: toGallery(block) }

        case 'imageText': {
          const image = toImageData(block.image)
          if (!image) return null
          return {
            type: 'imageText',
            title: block.title || undefined,
            text: flatten(block.text),
            image: image.src,
            imageAlt: image.alt,
            reverse: Boolean(block.reverse),
          }
        }

        case 'ageDistribution':
          return {
            type: 'ageDistribution',
            title: block.title || undefined,
            buckets: Array.isArray(block.buckets)
              ? block.buckets.map((bucket: Raw) => ({
                  label: String(bucket.label ?? ''),
                  percent: Number(bucket.percent ?? 0),
                }))
              : [],
          }

        case 'roleSplit':
          return {
            type: 'roleSplit',
            cityTitle: block.cityTitle || undefined,
            cityItems: flatten(block.cityItems),
            hgcTitle: block.hgcTitle || undefined,
            hgcItems: flatten(block.hgcItems),
          }

        case 'highlight':
          return {
            type: 'highlight',
            title: block.title || undefined,
            text: String(block.text ?? ''),
          }

        case 'speakers':
          return {
            type: 'speakers',
            title: block.title || undefined,
            speakers: Array.isArray(block.speakers)
              ? block.speakers.map((speaker: Raw) => ({
                  name: String(speaker.name ?? ''),
                  role: String(speaker.role ?? ''),
                  photo: resolveImage(speaker.photo),
                  linkedin: speaker.linkedin || undefined,
                }))
              : [],
          }

        case 'themes':
          return {
            type: 'themes',
            title: block.title || undefined,
            items: Array.isArray(block.items)
              ? block.items.map((item: Raw) => ({
                  title: String(item.title ?? ''),
                  description: item.description || undefined,
                  icon: item.icon || undefined,
                }))
              : [],
          }

        case 'games':
          return {
            type: 'games',
            title: block.title || undefined,
            subtitle: block.subtitle || undefined,
            gameIds: toSlugs(block.games),
            randomize: Boolean(block.randomize),
          }

        case 'equipment':
          return {
            type: 'equipment',
            title: block.title || undefined,
            items: Array.isArray(block.items)
              ? block.items.map((item: Raw) => ({
                  label: String(item.label ?? ''),
                  icon: item.icon || undefined,
                  image: resolveImage(item.image),
                }))
              : [],
          }

        default:
          return null
      }
    })
    .filter((block): block is ServiceBlock => block !== null)
}
