import { unstable_cache } from 'next/cache'

import { getPayloadClient } from '@/lib/payload'
import { CACHE_TAGS } from '@/payload/hooks/revalidate'
import type { Event } from '@/types/pages/detail-event'
import type { EventSeries } from '@/types/event-series'
import type { Actualities } from '@/types/pages/detail-actualites'
import type { Game } from '@/types/games'
import type { ServiceBtoB } from '@/types/pages/service-btob'
import type { ServiceBtoC } from '@/types/pages/service-btoc'
import type { CollectivitesPageData } from '@/types/pages/collectivites'

import {
  toActualite,
  toCategory,
  toEvent,
  toEventSeries,
  toGame,
  toServiceBtoB,
  toServiceBtoC,
} from './mappers/entities'
import { toCollectivitesPage } from './mappers/collectivites'

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

const cached = <T>(key: string, tag: string, load: () => Promise<T>) =>
  unstable_cache(load, [key], { tags: [tag] })

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

export const getEvents = cached('events', CACHE_TAGS.events, async (): Promise<Event[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    limit: LIMIT,
    depth: DEPTH,
    sort: '-startDate',
  })
  return docs.map(toEvent)
})

/**
 * Un seul événement, brouillon compris — pour le mode aperçu (Draft Mode de
 * Next.js, voir `app/api/preview/route.ts`). Volontairement non mis en cache
 * contrairement à `getEvents()` : un aperçu doit toujours refléter la
 * dernière modification, pas la dernière publication.
 */
export const getEventPreview = async (slug: string): Promise<Event | undefined> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    draft: true,
    depth: DEPTH,
    limit: 1,
  })
  return docs[0] ? toEvent(docs[0]) : undefined
}

export const getEventSeries = cached(
  'event-series',
  CACHE_TAGS.eventSeries,
  async (): Promise<EventSeries[]> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'event-series',
      limit: LIMIT,
      depth: DEPTH,
    })
    return docs.map(toEventSeries)
  },
)

export const getActualites = cached(
  'actualites',
  CACHE_TAGS.actualites,
  async (): Promise<Actualities[]> => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'actualites',
      limit: LIMIT,
      depth: DEPTH,
      sort: '-date',
    })
    return docs.map(toActualite)
  },
)

const getServiceDocs = cached('services', CACHE_TAGS.services, async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'services', limit: LIMIT, depth: DEPTH })
  return docs
})

export const getServicesBtoB = async (): Promise<ServiceBtoB[]> => {
  const docs = await getServiceDocs()
  return docs.filter((doc) => doc.target === 'btob').map(toServiceBtoB)
}

export const getServicesBtoC = async (): Promise<ServiceBtoC[]> => {
  const docs = await getServiceDocs()
  return docs.filter((doc) => doc.target === 'btoc').map(toServiceBtoC)
}


// --------------------------------------------------------------------- globals

/**
 * Page « collectivités ».
 *
 * Seule page du site encore pilotée depuis le backoffice : sa mise en page est
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
