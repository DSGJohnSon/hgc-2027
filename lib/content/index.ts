import { unstable_cache } from 'next/cache'
import type { Where } from 'payload'

import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/payload/hooks/revalidate'
import { relationId } from '@/payload/utils'
import type { Event } from '@/types/pages/detail-event'
import type { EventSeries } from '@/types/event-series'
import type { Actualities } from '@/types/pages/detail-actualites'
import type { Game } from '@/types/games'
import type { CollectivitesPageData } from '@/types/pages/collectivites'
import type { HomePageData } from '@/types/pages/home'

import { toActualite, toCategory, toEvent, toEventSeries, toGame } from './mappers/entities'
import { toCollectivitesPage } from './mappers/collectivites'
import { toHomePage } from './mappers/home'

/**
 * Couche d'accès au contenu.
 *
 * C'est le seul point d'entrée du site public vers Payload. Les fonctions
 * exposées renvoient exactement les formes déclarées dans `types/` — les mêmes
 * que celles produites autrefois par les fichiers `data/` — de sorte que les
 * composants de rendu n'ont pas eu à changer.
 *
 * Chaque lecture est mise en cache par tag ; les hooks `afterChange` de Payload
 * invalident le tag correspondant à la publication (voir
 * `payload/hooks/revalidate.ts`). Le site est donc statique entre deux
 * publications, et à jour en quelques secondes après.
 */

/** Profondeur de peuplement des relations : médias et jeux/catégories liés. */
const DEPTH = 2

/** Limite haute des listes — le site affiche tout, sans pagination. */
const LIMIT = 500

const cached = <T>(key: string, tags: string | string[], load: () => Promise<T>) =>
  unstable_cache(load, [key], { tags: Array.isArray(tags) ? tags : [tags] })

/**
 * Lectures publiques des collections versionnées : sans les documents jamais publiés.
 *
 * Sans `draft: true`, Payload lit le document principal sans filtrer son statut.
 * Un brouillon enregistré sur un document déjà publié ne touche pas ce document
 * (seule une version est créée), mais un document créé puis seulement enregistré
 * en brouillon y figure avec `_status: 'draft'` et apparaîtrait sur le site.
 */
const PUBLISHED: Where = { _status: { not_equals: 'draft' } }

// ---------------------------------------------------------------- référentiels

export const getGames = cached('games', CACHE_TAGS.games, async (): Promise<Game[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'games', limit: LIMIT, depth: DEPTH })
  return docs.map(toGame)
})

export const getCategories = cached(
  'categories',
  CACHE_TAGS.categories,
  async (): Promise<Array<{ id: string; name: string; color?: string }>> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'categories',
      limit: LIMIT,
      depth: DEPTH,
    })
    return docs.map(toCategory)
  },
)

// -------------------------------------------------------------------- contenus

/**
 * Tous les événements publiés, étapes de séries comprises. Une seule lecture en
 * cache, que `getEvents()` et `getEventSeries()` répartissent ensuite.
 */
const getEventDocs = cached('event-docs', CACHE_TAGS.events, async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    where: PUBLISHED,
    limit: LIMIT,
    depth: DEPTH,
    sort: '-startDate',
  })
  return docs
})

const getSeriesDocs = cached('event-series', CACHE_TAGS.eventSeries, async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'event-series',
    where: PUBLISHED,
    limit: LIMIT,
    depth: DEPTH,
  })
  return docs
})

/**
 * Événements hors série. Les étapes n'en font pas partie : elles sont exposées
 * par leur série (`getEventSeries()`), comme avant la refonte.
 */
export const getEvents = async (): Promise<Event[]> => {
  const docs = await getEventDocs()
  return docs.filter((doc) => !relationId(doc.series)).map(toEvent)
}

/**
 * Séries publiées, chacune avec ses étapes publiées.
 *
 * Une série sans étape publiée est écartée : elle n'a rien à présenter, et ses
 * bornes de dates (calculées sur les étapes) seraient invalides.
 */
export const getEventSeries = async (): Promise<EventSeries[]> => {
  const [seriesDocs, eventDocs] = await Promise.all([getSeriesDocs(), getEventDocs()])
  return seriesDocs
    .map((series) =>
      toEventSeries(
        series,
        eventDocs.filter((doc) => relationId(doc.series) === String(series.id)),
      ),
    )
    .filter((series) => series.dates.length > 0)
}

/**
 * Un seul événement hors série, brouillon compris — pour le mode aperçu (Draft
 * Mode de Next.js, voir `app/api/preview/route.ts`). Volontairement non mis en
 * cache contrairement à `getEvents()` : un aperçu doit toujours refléter la
 * dernière modification, pas la dernière publication.
 */
export const getEventPreview = async (slug: string): Promise<Event | undefined> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    draft: true,
    depth: DEPTH,
    pagination: false,
  })
  const event = docs.find((doc) => !relationId(doc.series))
  return event ? toEvent(event) : undefined
}

/** Une série et toutes ses étapes, brouillons compris — pour le mode aperçu. */
export const getEventSeriesPreview = async (slug: string): Promise<EventSeries | undefined> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'event-series',
    where: { slug: { equals: slug } },
    draft: true,
    depth: DEPTH,
    limit: 1,
  })
  const series = docs[0]
  if (!series) return undefined

  const steps = await payload.find({
    collection: 'events',
    where: { series: { equals: series.id } },
    draft: true,
    depth: DEPTH,
    pagination: false,
  })
  return toEventSeries(series, steps.docs)
}

export const getActualites = cached(
  'actualites',
  CACHE_TAGS.actualites,
  async (): Promise<Actualities[]> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'actualites',
      where: PUBLISHED,
      limit: LIMIT,
      depth: DEPTH,
      sort: '-date',
    })
    return docs.map(toActualite)
  },
)


// --------------------------------------------------------------------- globals

/**
 * Page « collectivités ».
 *
 * Sa mise en page est
 * fixe, seuls les textes, les images et le nombre d'éléments des listes sont
 * modifiables (voir `payload/globals/Collectivites.ts`).
 */
export const getCollectivitesPage = cached(
  'collectivites-page',
  CACHE_TAGS.collectivitesPage,
  async (): Promise<CollectivitesPageData> => {
    const payload = await getPayloadClient()
    const doc = await payload.findGlobal({ slug: 'collectivites-page', depth: DEPTH })
    return toCollectivitesPage(doc)
  },
)

/**
 * Page d'accueil « joueurs ».
 *
 * Même principe que la page collectivités : mise en page fixe, textes, images
 * et listes modifiables (voir `payload/globals/Home.ts`).
 */
export const getHomePage = cached(
  'home-page',
  CACHE_TAGS.homePage,
  async (): Promise<HomePageData> => {
    const payload = await getPayloadClient()
    const doc = await payload.findGlobal({ slug: 'home-page', depth: DEPTH })
    return toHomePage(doc)
  },
)
