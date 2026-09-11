import type { Payload } from 'payload'

import { actualites } from '@/data/actualites'
import { events } from '@/data/events'
import { eventSeries } from '@/data/event-series'
import { servicesBtoB } from '@/data/services-btob'
import { servicesBtoC } from '@/data/services-btoc'

import {
  buildIndex,
  resolveIds,
  toDescriptionBlocks,
  toImage,
  toImageRows,
  toPositionedImage,
  toRows,
  toStatRows,
  toTextContentBlocks,
  upsert,
  type Raw,
} from './lib'
import { createPartnerResolver } from './partners'

/** Actualités — `data/actualites.ts`. */
export const seedActualites = async (payload: Payload) => {
  for (const actualite of actualites) {
    await upsert(
      payload,
      'actualites',
      actualite.id,
      {
        title: actualite.title,
        subtitle: actualite.subtitle ?? '',
        date: actualite.date,
        content: toTextContentBlocks(actualite.content as Raw[]),
        image: toPositionedImage(actualite.image),
        cta: actualite.cta
          ? {
              label: actualite.cta.label,
              type: actualite.cta.type,
              url: actualite.cta.url ?? '',
              isExternal: Boolean(actualite.cta.isExternal),
              weezeventCode: actualite.cta.weezeventCode ?? '',
            }
          : undefined,
      },
      { versioned: true },
    )
  }
  console.log(`  ${actualites.length} actualités`)
}

/** Champs de visuels partagés entre un événement et une étape de série. */
const visuals = (source: Raw) => ({
  cardThumbnail: toImage(source.cardThumbnail),
  heroBanner: toImage(source.heroBanner),
  heroBannerMobile: toImage(source.heroBannerMobile),
})

/** Transports : `lines: string[]` devient un tableau de lignes Payload. */
const transports = (source: Raw | undefined): Raw | undefined => {
  if (!source) return undefined
  const stops = (rows: Raw[] | undefined) =>
    (rows ?? []).map((stop) => ({
      lines: toRows(stop.lines),
      station: stop.station,
      walkTimeInMin: stop.walkTimeInMin,
    }))

  return {
    metro: stops(source.metro),
    bus: stops(source.bus),
    tramway: stops(source.tramway),
    car: source.car ? { parkings: source.car.parkings ?? [] } : undefined,
  }
}

/** Événements et séries — `data/events.ts`, `data/event-series.ts`. */
export const seedEvents = async (payload: Payload) => {
  const gameIndex = await buildIndex(payload, 'games')
  const categoryIndex = await buildIndex(payload, 'categories')
  const partners = await createPartnerResolver(payload)

  for (const event of events) {
    await upsert(
      payload,
      'events',
      event.id,
      {
        title: event.title,
        type: event.type,
        color: event.color,
        startDate: event.startDate,
        endDate: event.endDate || undefined,
        startTime: event.startTime ?? '',
        endTime: event.endTime ?? '',
        location: event.location ?? '',
        isCancelled: Boolean(event.isCancelled),
        ...visuals(event as Raw),
        partners: partners(event.partners, event.id),
        description: toDescriptionBlocks(event.description as Raw[]),
        categories: resolveIds(event.categoryId, categoryIndex, event.id),
        games: resolveIds(event.gameId, gameIndex, event.id),
        freeplayGames: resolveIds(event.freeplayGames, gameIndex, event.id),
        randomizeFreeplayGames: Boolean(event.randomizeFreeplayGames),
        registrationOpen: Boolean(event.registrationOpen),
        weezeventCode: event.weezeventCode ?? '',
        transports: transports(event.transports as Raw),
      },
      { versioned: true },
    )
  }
  console.log(`  ${events.length} événements`)

  for (const series of eventSeries) {
    await upsert(
      payload,
      'event-series',
      series.id,
      {
        title: series.title,
        color: series.color,
        isCancelled: Boolean(series.isCancelled),
        ...visuals(series as Raw),
        partners: partners(series.partners, series.id),
        description: toDescriptionBlocks(series.description as Raw[]),
        games: resolveIds(series.gameId, gameIndex, series.id),
        freeplayGames: resolveIds(series.freeplayGames, gameIndex, series.id),
        dates: series.dates.map((date) => ({
          slug: date.id,
          title: date.title ?? '',
          startDate: date.startDate,
          endDate: date.endDate || undefined,
          startTime: date.startTime ?? '',
          endTime: date.endTime ?? '',
          location: date.location,
          isCancelled: Boolean(date.isCancelled),
          ...visuals(date as Raw),
          partners: partners(date.partners, `${series.id}/${date.id}`),
          description: toDescriptionBlocks(date.description as Raw[]),
          games: resolveIds(date.gameId, gameIndex, `${series.id}/${date.id}`),
          freeplayGames: resolveIds(
            date.freeplayGames,
            gameIndex,
            `${series.id}/${date.id}`,
          ),
          registrationOpen: Boolean(date.registrationOpen),
          weezeventCode: date.weezeventCode ?? '',
          transports: transports(date.transports as Raw),
        })),
      },
      { versioned: true },
    )
  }
  console.log(`  ${eventSeries.length} séries`)
}

/** Blocs de contenu d'une page Service — inverse de `toServiceContent`. */
const toServiceBlocks = (blocks: Raw[] | undefined, gameIndex: Map<string, string>, context: string): Raw[] =>
  (blocks ?? [])
    .map((block): Raw | null => {
      switch (block.type) {
        case 'text':
          return { blockType: 'text', content: toTextContentBlocks(block.content) }
        case 'statistics':
          return { blockType: 'statistics', stats: toStatRows(block.content?.stats) }
        case 'gallery':
          return {
            blockType: 'gallery',
            title: block.content?.title ?? '',
            subtitle: block.content?.subtitle ?? '',
            images: toImageRows(block.content?.images),
          }
        case 'imageText':
          return {
            blockType: 'imageText',
            title: block.title ?? '',
            text: toRows(block.text),
            image: toImage(block.image, block.imageAlt),
            reverse: Boolean(block.reverse),
          }
        case 'ageDistribution':
          return {
            blockType: 'ageDistribution',
            title: block.title ?? '',
            buckets: block.buckets ?? [],
          }
        case 'roleSplit':
          return {
            blockType: 'roleSplit',
            cityTitle: block.cityTitle ?? '',
            cityItems: toRows(block.cityItems),
            hgcTitle: block.hgcTitle ?? '',
            hgcItems: toRows(block.hgcItems),
          }
        case 'highlight':
          return { blockType: 'highlight', title: block.title ?? '', text: block.text ?? '' }
        case 'speakers':
          return {
            blockType: 'speakers',
            title: block.title ?? '',
            speakers: (block.speakers ?? []).map((speaker: Raw) => ({
              name: speaker.name,
              role: speaker.role,
              photo: toImage(speaker.photo),
              linkedin: speaker.linkedin ?? '',
            })),
          }
        case 'themes':
          return { blockType: 'themes', title: block.title ?? '', items: block.items ?? [] }
        case 'games':
          return {
            blockType: 'games',
            title: block.title ?? '',
            subtitle: block.subtitle ?? '',
            games: resolveIds(block.gameIds, gameIndex, context),
            randomize: Boolean(block.randomize),
          }
        case 'equipment':
          return {
            blockType: 'equipment',
            title: block.title ?? '',
            items: (block.items ?? []).map((item: Raw) => ({
              label: item.label,
              icon: item.icon ?? '',
              image: toImage(item.image),
            })),
          }
        default:
          console.warn(`  ! bloc de service inconnu « ${block.type} », ignoré`)
          return null
      }
    })
    .filter((block): block is Raw => block !== null)

/** Services BtoB et BtoC — `data/services-btob.ts`, `data/services-btoc.ts`. */
export const seedServices = async (payload: Payload) => {
  const gameIndex = await buildIndex(payload, 'games')

  const common = (service: Raw) => ({
    title: service.title,
    tagline: service.tagline ?? '',
    shortDescription: service.shortDescription,
    color: service.color,
    logo: toImage(service.logo),
    cardThumbnail: toImage(service.cardThumbnail),
    heroBanner: toImage(service.heroBanner),
    heroBannerMobile: toImage(service.heroBannerMobile),
    content: toServiceBlocks(service.content, gameIndex, service.id),
    isDraft: Boolean(service.isDraft),
  })

  for (const service of servicesBtoB) {
    await upsert(
      payload,
      'services',
      service.id,
      {
        ...common(service as Raw),
        target: 'btob',
        stats: toStatRows(service.stats as Raw[]),
        formProjectLabel: service.formProjectLabel ?? '',
      },
      { versioned: true },
    )
  }
  console.log(`  ${servicesBtoB.length} services BtoB`)

  for (const service of servicesBtoC) {
    await upsert(
      payload,
      'services',
      service.id,
      {
        ...common(service as Raw),
        target: 'btoc',
        helloAssoEmbed: service.helloAssoEmbed ?? '',
      },
      { versioned: true },
    )
  }
  console.log(`  ${servicesBtoC.length} services BtoC`)
}
