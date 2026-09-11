import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Invalidation du cache Next à la publication.
 *
 * Les lectures du site public sont mises en cache par tag (voir `lib/content/cache.ts`).
 * Dès qu'un document change dans le backoffice, on invalide le tag correspondant :
 * le site est à jour en quelques secondes, sans redéploiement, et reste servi
 * depuis le cache le reste du temps.
 *
 * `revalidateTag` n'existe que dans le contexte Next ; les scripts de seed appellent
 * la Local API hors de ce contexte, d'où le try/catch.
 */
const safeRevalidate = (tag: string) => {
  try {
    // Appel volontairement à un seul argument.
    //
    // Next 16 fait cohabiter deux systèmes de cache : l'historique
    // (`unstable_cache`, utilisé par `lib/content`) et le nouveau
    // (`'use cache'` + `cacheTag`, encore derrière un drapeau expérimental).
    // `revalidateTag(tag, 'max')` ne parle qu'au second : passer le deuxième
    // argument fait taire l'avertissement de dépréciation mais n'invalide plus
    // rien — vérifié en publiant depuis le backoffice. Tant que les lectures
    // passent par `unstable_cache`, c'est la forme à un argument qu'il faut.
    //
    // Les types de Next ne décrivent plus que la nouvelle signature, d'où ce
    // cast ; il disparaîtra le jour où `lib/content` passera à `'use cache'`.
    ;(revalidateTag as unknown as (tag: string) => void)(tag)
  } catch {
    // Hors contexte Next (scripts de seed) : il n'y a pas de cache à invalider.
  }
}

export const revalidateCollection =
  (tag: string): CollectionAfterChangeHook =>
  ({ doc }) => {
    safeRevalidate(tag)
    return doc
  }

export const revalidateOnDelete =
  (tag: string): CollectionAfterDeleteHook =>
  ({ doc }) => {
    safeRevalidate(tag)
    return doc
  }

export const revalidateGlobal =
  (tag: string): GlobalAfterChangeHook =>
  ({ doc }) => {
    safeRevalidate(tag)
    return doc
  }

/**
 * Invalide plusieurs tags d'un coup.
 *
 * Nécessaire pour les référentiels dont le contenu est **intégré** dans d'autres
 * documents : un partenaire est recopié dans le rendu des événements et des
 * pages, donc changer son logo doit aussi invalider leurs caches — sans quoi le
 * site continuerait à servir l'ancien visuel.
 */
export const revalidateMany =
  (tags: string[]): CollectionAfterChangeHook =>
  ({ doc }) => {
    tags.forEach(safeRevalidate)
    return doc
  }

export const revalidateManyOnDelete =
  (tags: string[]): CollectionAfterDeleteHook =>
  ({ doc }) => {
    tags.forEach(safeRevalidate)
    return doc
  }

/** Tags de cache — un par collection / global. */
export const CACHE_TAGS = {
  events: 'events',
  eventSeries: 'event-series',
  services: 'services',
  actualites: 'actualites',
  games: 'games',
  categories: 'categories',
  partners: 'partners',
  collectivitesPage: 'collectivites-page',
} as const
