/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Utilitaires de conversion « document Payload → objet attendu par le site ».
 *
 * Les types de `types/` restent le contrat du rendu : ces mappers sont la seule
 * couche qui connaît la forme des documents Payload. Tout ce qui est spécifique
 * au CMS (`blockType`, tableaux d'objets, relations peuplées) est absorbé ici.
 */

/** Document ou fragment de document Payload, volontairement peu typé. */
export type Raw = Record<string, any>

/**
 * Aplatit un tableau Payload `[{ value: "a" }, { value: "b" }]` en `["a", "b"]`.
 * Payload ne sait pas stocker de tableau de chaînes nues ; la convention du projet
 * est de nommer la valeur `value` (voir payload/fields/common.ts).
 */
export const flatten = (rows: Raw[] | null | undefined, key = 'value'): string[] =>
  Array.isArray(rows)
    ? rows.map((row) => row?.[key]).filter((value): value is string => typeof value === 'string')
    : []

/**
 * Ramène une URL de média Payload à un chemin relatif.
 *
 * `serverURL` étant renseigné (voir payload.config.ts), Payload renvoie des URLs
 * absolues du type `http://localhost:3000/api/media/file/x.png`. `next/image`
 * considère toute URL absolue comme distante et la fait passer par l'optimiseur,
 * qui depuis Next 16 refuse un hôte résolvant vers une IP privée — d'où les
 * `upstream image ... resolved to private ip` en local.
 *
 * Ces fichiers sont servis par cette application elle-même : on ne garde que le
 * chemin. Même ressource, mais traitée comme locale, et valable quel que soit le
 * domaine de déploiement. Les URLs pointant ailleurs (stockage externe, images de
 * démonstration) ne sont pas touchées.
 */
const toLocalMediaPath = (url: string): string => {
  try {
    const { pathname, search } = new URL(url)
    return pathname.startsWith('/api/media/') ? `${pathname}${search}` : url
  } catch {
    return url // déjà relative
  }
}

/**
 * Résout un champ image en une simple URL.
 *
 * Priorité au fichier envoyé depuis le backoffice ; à défaut, on retombe sur le
 * chemin historique `/assets/...`. C'est ce qui permet de migrer les images une
 * par une plutôt que d'un bloc (voir payload/fields/image.ts).
 */
export const resolveImage = (field: Raw | null | undefined): string | undefined => {
  if (!field) return undefined
  const media = field.media
  if (media && typeof media === 'object' && typeof media.url === 'string') {
    return toLocalMediaPath(media.url)
  }
  return typeof field.path === 'string' && field.path.length > 0 ? field.path : undefined
}

/** Texte alternatif : celui saisi sur place, sinon celui du média. */
export const resolveAlt = (field: Raw | null | undefined, fallback = ''): string => {
  if (!field) return fallback
  if (typeof field.alt === 'string' && field.alt.length > 0) return field.alt
  const media = field.media
  if (media && typeof media === 'object' && typeof media.alt === 'string') return media.alt
  return fallback
}

/** Image au format `{ src, alt }` attendu par les galeries et les listes de logos. */
export const toImageData = (
  field: Raw | null | undefined,
): { src: string; alt: string } | undefined => {
  const src = resolveImage(field)
  if (!src) return undefined
  return { src, alt: resolveAlt(field) }
}

/** Liste d'images `{ src, alt }`, en écartant les entrées incomplètes. */
export const toImageList = (
  rows: Raw[] | null | undefined,
  key = 'image',
): Array<{ src: string; alt: string }> =>
  Array.isArray(rows)
    ? rows
        .map((row) => toImageData(row?.[key]))
        .filter((image): image is { src: string; alt: string } => Boolean(image))
    : []

/**
 * Image accompagnée de sa position (`SimpleSection`, `aboutHero`, actualités).
 *
 * `positionedImageField` porte `media`, `path` et `alt` à plat dans le même
 * groupe que `position` : on résout donc directement sur le groupe.
 */
export const toPositionedImage = (
  field: Raw | null | undefined,
): { src: string; alt: string; position: 'left' | 'right' } | undefined => {
  const src = resolveImage(field)
  if (!src) return undefined
  return {
    src,
    alt: resolveAlt(field),
    position: field?.position === 'left' ? 'left' : 'right',
  }
}

/**
 * Identifiant public d'un document relationnel.
 *
 * Le site référence les jeux et les catégories par leur slug (`fortnite`,
 * `gamingHouseTour`). Selon la profondeur de la requête, Payload renvoie soit le
 * document peuplé, soit son ObjectId : on ne garde que les documents peuplés,
 * un ObjectId ne voulant rien dire pour le front.
 */
export const toSlugs = (relations: unknown): string[] => {
  if (!Array.isArray(relations)) return []
  return relations
    .map((relation) =>
      relation && typeof relation === 'object' ? (relation as Raw).slug : undefined,
    )
    .filter((slug): slug is string => typeof slug === 'string')
}

/** Chiffres clés — forme `StatisticsData["stats"]`. */
export const toStats = (rows: Raw[] | null | undefined) =>
  Array.isArray(rows)
    ? rows.map((row) => ({
        type: row.type === 'euros' ? ('euros' as const) : ('number' as const),
        value: Number(row.value ?? 0),
        plus: Boolean(row.plus),
        label: String(row.label ?? ''),
        sublabel: typeof row.sublabel === 'string' ? row.sublabel : undefined,
      }))
    : []

/** Date Payload (ISO complet) → `YYYY-MM-DD`, forme utilisée partout dans `data/`. */
export const toDateString = (value: unknown): string => {
  if (typeof value !== 'string' || value.length === 0) return ''
  return value.slice(0, 10)
}

/** Retire les clés `undefined` pour que les objets produits collent aux types optionnels. */
export const compact = <T extends Raw>(object: T): T =>
  Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined)) as T
