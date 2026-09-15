import type { Payload } from 'payload'

import { actualites } from '@/data/actualites'
import { events } from '@/data/events'
import { eventSeries } from '@/data/event-series'
import { relationId } from '@/payload/utils'

import {
  buildIndex,
  resolveIds,
  toDescriptionBlocks,
  toImage,
  toPositionedImage,
  toRows,
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
      // Un événement hors série : ne pas confondre avec une étape de même slug.
      { versioned: true, match: (doc) => !relationId(doc.series) },
    )
  }
  console.log(`  ${events.length} événements`)

  let stepCount = 0
  for (const series of eventSeries) {
    const seriesId = await upsert(
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
      },
      { versioned: true },
    )

    // Les étapes sont des événements rattachés à la série
    // (voir payload/collections/EventSeries.ts).
    for (const date of series.dates) {
      const context = `${series.id}/${date.id}`
      await upsert(
        payload,
        'events',
        date.id,
        {
          series: seriesId,
          title: date.title || series.title,
          type: 'event',
          color: series.color,
          startDate: date.startDate,
          endDate: date.endDate || undefined,
          startTime: date.startTime ?? '',
          endTime: date.endTime ?? '',
          location: date.location,
          isCancelled: Boolean(date.isCancelled),
          ...visuals(date as Raw),
          partners: partners(date.partners, context),
          description: toDescriptionBlocks(date.description as Raw[]),
          games: resolveIds(date.gameId, gameIndex, context),
          freeplayGames: resolveIds(date.freeplayGames, gameIndex, context),
          registrationOpen: Boolean(date.registrationOpen),
          weezeventCode: date.weezeventCode ?? '',
          transports: transports(date.transports as Raw),
        },
        { versioned: true, match: (doc) => relationId(doc.series) === seriesId },
      )
      stepCount++
    }
  }
  console.log(`  ${eventSeries.length} séries, ${stepCount} étapes`)
}
