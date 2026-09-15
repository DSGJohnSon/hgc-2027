/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Payload } from 'payload'

/**
 * Helpers de migration `data/` → Payload.
 *
 * Les mappers de `lib/content/mappers` font la conversion Payload → site ;
 * ces fonctions font le trajet inverse, une seule fois, au moment du seed.
 */

export type Raw = Record<string, any>

/** `["a", "b"]` → `[{ value: "a" }, { value: "b" }]` (voir payload/fields/common.ts). */
export const toRows = (values: string[] | undefined, key = 'value'): Raw[] =>
  Array.isArray(values) ? values.map((value) => ({ [key]: value })) : []

/**
 * Chemin d'image historique → champ image Payload.
 *
 * On renseigne `path` et non `media` : les images de `public/assets` ne sont pas
 * ré-uploadées, elles restent servies telles quelles. Le client les remplacera
 * une par une depuis le backoffice.
 */
export const toImage = (src?: string, alt?: string): Raw | undefined =>
  src ? { path: src, alt: alt ?? '' } : undefined

/**
 * Image positionnée (`{ src, alt, position }`) → groupe Payload.
 *
 * `positionedImageField` (payload/fields/common.ts) place `media`, `path` et
 * `alt` **à plat** dans le groupe, aux côtés de `position` — et non sous une
 * sous-clé. Écrire une clé `source` ici reviendrait à envoyer un champ inconnu,
 * que Payload ignore en silence : l'image serait perdue sans la moindre erreur.
 */
export const toPositionedImage = (image?: {
  src: string
  alt?: string
  position?: string
}): Raw | undefined =>
  image?.src
    ? {
        path: image.src,
        alt: image.alt ?? '',
        position: image.position === 'left' ? 'left' : 'right',
      }
    : undefined

/** Liste `{ src, alt }` → tableau de champs image. */
export const toImageRows = (
  images: Array<{ src: string; alt?: string }> | undefined,
): Raw[] =>
  Array.isArray(images)
    ? images
        .filter((image) => Boolean(image?.src))
        .map((image) => ({ image: { path: image.src, alt: image.alt ?? '' } }))
    : []

/** Éléments d'un bloc texte : `type` → `blockType`, chaînes → lignes. */
export const toTextContentBlocks = (items: Raw[] | undefined): Raw[] =>
  Array.isArray(items)
    ? items
        .map((item): Raw | null => {
          switch (item?.type) {
            case 'title':
              return { blockType: 'title', title: item.title ?? '' }
            case 'paragraph':
              return {
                blockType: 'paragraph',
                paragraphs: toRows(item.paragraphs, 'text'),
              }
            case 'list':
              return { blockType: 'list', items: toRows(item.items, 'text') }
            case 'citation':
              return { blockType: 'citation', citationText: item.citationText ?? '' }
            default:
              return null
          }
        })
        .filter((block): block is Raw => block !== null)
    : []

/** Chiffres clés — la forme est déjà celle attendue, on normalise juste les valeurs. */
export const toStatRows = (stats: Raw[] | undefined): Raw[] =>
  Array.isArray(stats)
    ? stats.map((stat) => ({
        type: stat.type === 'euros' ? 'euros' : 'number',
        value: Number(stat.value ?? 0),
        plus: Boolean(stat.plus),
        label: stat.label ?? '',
        sublabel: stat.sublabel ?? '',
      }))
    : []

/** Description d'un événement : blocs `text` / `statistics` / `gallery`. */
export const toDescriptionBlocks = (blocks: Raw[] | undefined): Raw[] =>
  Array.isArray(blocks)
    ? blocks
        .map((block): Raw | null => {
          switch (block?.type) {
            case 'text':
              return { blockType: 'text', content: toTextContentBlocks(block.content) }
            case 'statistics':
              return {
                blockType: 'statistics',
                stats: toStatRows(block.content?.stats),
              }
            case 'gallery':
              return {
                blockType: 'gallery',
                title: block.content?.title ?? '',
                subtitle: block.content?.subtitle ?? '',
                images: toImageRows(block.content?.images),
              }
            default:
              return null
          }
        })
        .filter((block): block is Raw => block !== null)
    : []

/** Résout des slugs (`"fortnite"`) en identifiants Payload, en ignorant les inconnus. */
export const resolveIds = (
  slugs: string[] | undefined,
  index: Map<string, string>,
  context: string,
): string[] => {
  if (!Array.isArray(slugs)) return []
  const resolved: string[] = []
  for (const slug of slugs) {
    const id = index.get(slug)
    if (id) resolved.push(id)
    else console.warn(`  ! ${context} : référence inconnue « ${slug} », ignorée`)
  }
  return resolved
}

/**
 * Rejoue une opération quand MongoDB refuse le verrou.
 *
 * Au premier démarrage, Payload construit ses index (dont l'unicité des slugs)
 * pendant que le seed écrit : Mongo renvoie alors un `LockTimeout` transitoire.
 * Quelques tentatives espacées suffisent à laisser la construction se terminer.
 */
export const withRetry = async <T>(operation: () => Promise<T>, attempts = 6): Promise<T> => {
  let lastError: unknown
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      const transient =
        error?.code === 24 || error?.errorLabelSet?.has?.('TransientTransactionError')
      if (!transient) throw error
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)))
    }
  }
  throw lastError
}

/** Index slug → id d'une collection, pour résoudre les relations. */
export const buildIndex = async (
  payload: Payload,
  collection: 'games' | 'categories',
): Promise<Map<string, string>> => {
  const { docs } = await payload.find({ collection, limit: 500, depth: 0 })
  return new Map(docs.map((doc: Raw) => [String(doc.slug), String(doc.id)]))
}

/**
 * Crée ou met à jour un document identifié par son slug.
 *
 * Le seed est rejouable : relancer un script ne duplique rien, il réaligne les
 * documents existants sur le contenu des fichiers `data/`.
 */
export const upsert = async (
  payload: Payload,
  collection: any,
  slug: string,
  data: Raw,
  /**
   * Collections versionnées : sans `_status`, un document créé reste en brouillon
   * et n'apparaît donc pas sur le site. Le contenu migré étant déjà en ligne, on
   * le publie directement.
   */
  options: {
    versioned?: boolean
    /**
     * Plusieurs documents peuvent partager un slug — deux étapes de séries
     * différentes, par exemple. `match` désigne alors celui à mettre à jour.
     */
    match?: (doc: Raw) => boolean
  } = {},
): Promise<string> => {
  const payloadData = options.versioned ? { ...data, slug, _status: 'published' } : { ...data, slug }

  const existing = await withRetry(() =>
    payload.find({
      collection,
      where: { slug: { equals: slug } },
      pagination: false,
      depth: 0,
      ...(options.versioned ? { draft: true } : {}),
    }),
  )
  const match = (existing.docs as Raw[]).find((doc) => !options.match || options.match(doc))

  if (match) {
    const doc = await withRetry(() =>
      payload.update({
        collection,
        id: match.id,
        data: payloadData,
        disableTransaction: true,
      }),
    )
    return String((doc as Raw).id)
  }

  const doc = await withRetry(() =>
    payload.create({ collection, data: payloadData, disableTransaction: true }),
  )
  return String((doc as Raw).id)
}
