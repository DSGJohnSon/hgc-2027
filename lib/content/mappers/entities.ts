import type { Event } from '@/types/pages/detail-event'
import type { EventSeries, SeriesDate } from '@/types/event-series'
import type { Actualities } from '@/types/pages/detail-actualites'
import type { Game } from '@/types/games'

import { toDescription, toTextContent } from './blocks'
import {
  compact,
  flatten,
  resolveImage,
  toDateString,
  toPositionedImage,
  toSlugs,
  type Raw,
} from './common'

/**
 * Logo d'un partenaire — `{ alt, src }`.
 *
 * Les partenaires sont désormais une collection à part, référencée par relation.
 * Selon la profondeur de la requête, Payload renvoie soit le document peuplé,
 * soit son seul identifiant : on ignore ce dernier cas, un identifiant ne
 * permettant pas d'afficher un logo. Le nom du partenaire sert de texte
 * alternatif, ce qui garantit sa cohérence partout où le logo apparaît.
 */
export const toPartner = (
  relation: unknown,
): { alt: string; src: string } | undefined => {
  if (!relation || typeof relation !== 'object') return undefined
  const partner = relation as Raw
  // Le logo est un média de la bibliothèque : sans fichier envoyé, il n'y a rien
  // à afficher et le partenaire est simplement omis.
  const src = resolveImage({ media: partner.logo })
  if (!src) return undefined
  return { alt: String(partner.name ?? ''), src }
}

/** Liste de logos de partenaires, en écartant ceux qui n'ont pas de fichier. */
export const toPartners = (relations: unknown): Array<{ alt: string; src: string }> =>
  Array.isArray(relations)
    ? relations
        .map(toPartner)
        .filter((partner): partner is { alt: string; src: string } => Boolean(partner))
    : []

/** Accès en transports : on n'expose que les modes réellement renseignés. */
const toTransports = (transports: Raw | null | undefined): Event['transports'] => {
  if (!transports) return undefined

  const toStops = (rows: Raw[] | null | undefined) =>
    Array.isArray(rows) && rows.length > 0
      ? rows.map((stop) => ({
          lines: flatten(stop.lines),
          station: String(stop.station ?? ''),
          walkTimeInMin: Number(stop.walkTimeInMin ?? 0),
        }))
      : undefined

  const parkings = transports.car?.parkings
  const result = compact({
    metro: toStops(transports.metro),
    bus: toStops(transports.bus),
    tramway: toStops(transports.tramway),
    car:
      Array.isArray(parkings) && parkings.length > 0
        ? {
            parkings: parkings.map((parking: Raw) => ({
              name: String(parking.name ?? ''),
              address: String(parking.address ?? ''),
              distanceInMeters: Number(parking.distanceInMeters ?? 0),
              walkTimeInMin: Number(parking.walkTimeInMin ?? 0),
            })),
          }
        : undefined,
  })

  return Object.keys(result).length > 0 ? result : undefined
}

/** Événement simple — forme `Event`. */
export const toEvent = (doc: Raw): Event =>
  compact({
    id: String(doc.slug ?? ''),
    type: doc.type ?? 'event',
    title: String(doc.title ?? ''),
    startDate: toDateString(doc.startDate),
    endDate: doc.endDate ? toDateString(doc.endDate) : undefined,
    startTime: doc.startTime || undefined,
    endTime: doc.endTime || undefined,
    cardThumbnail: resolveImage(doc.cardThumbnail) ?? '',
    heroBanner: resolveImage(doc.heroBanner) ?? '',
    heroBannerMobile: resolveImage(doc.heroBannerMobile) ?? '',
    location: doc.location || undefined,
    categoryId: toSlugs(doc.categories),
    gameId: toSlugs(doc.games),
    color: String(doc.color ?? '#6240cf'),
    description: toDescription(doc.description),
    transports: toTransports(doc.transports),
    weezeventCode: doc.weezeventCode || undefined,
    registrationOpen: Boolean(doc.registrationOpen),
    partners: toPartners(doc.partners),
    freeplayGames: toSlugs(doc.freeplayGames),
    randomizeFreeplayGames: Boolean(doc.randomizeFreeplayGames),
    isCancelled: Boolean(doc.isCancelled),
  }) as Event

/** Étape d'une série — forme `SeriesDate`. */
const toSeriesDate = (row: Raw): SeriesDate =>
  compact({
    id: String(row.slug ?? ''),
    title: row.title || undefined,
    startDate: toDateString(row.startDate),
    endDate: row.endDate ? toDateString(row.endDate) : undefined,
    startTime: row.startTime || undefined,
    endTime: row.endTime || undefined,
    location: String(row.location ?? ''),
    description: row.description?.length ? toDescription(row.description) : undefined,
    weezeventCode: row.weezeventCode || undefined,
    registrationOpen: Boolean(row.registrationOpen),
    isCancelled: Boolean(row.isCancelled),
    cardThumbnail: resolveImage(row.cardThumbnail) ?? '',
    heroBanner: resolveImage(row.heroBanner) ?? '',
    heroBannerMobile: resolveImage(row.heroBannerMobile) ?? '',
    freeplayGames: toSlugs(row.freeplayGames),
    gameId: toSlugs(row.games),
    transports: toTransports(row.transports),
    partners: row.partners?.length ? toPartners(row.partners) : undefined,
  }) as SeriesDate

/** Série d'événements — forme `EventSeries`. */
export const toEventSeries = (doc: Raw): EventSeries =>
  compact({
    id: String(doc.slug ?? ''),
    type: 'serie',
    title: String(doc.title ?? ''),
    color: String(doc.color ?? '#6240cf'),
    cardThumbnail: resolveImage(doc.cardThumbnail) ?? '',
    heroBanner: resolveImage(doc.heroBanner) ?? '',
    heroBannerMobile: resolveImage(doc.heroBannerMobile) ?? '',
    freeplayGames: toSlugs(doc.freeplayGames),
    gameId: toSlugs(doc.games),
    description: toDescription(doc.description),
    partners: toPartners(doc.partners),
    isCancelled: Boolean(doc.isCancelled),
    dates: Array.isArray(doc.dates) ? doc.dates.map(toSeriesDate) : [],
  }) as EventSeries

/** Actualité — forme `Actualities`. */
export const toActualite = (doc: Raw): Actualities => {
  const cta = doc.cta
  const hasCta = cta && typeof cta.label === 'string' && cta.label.length > 0

  return compact({
    id: String(doc.slug ?? ''),
    date: toDateString(doc.date),
    title: String(doc.title ?? ''),
    subtitle: doc.subtitle || undefined,
    content: toTextContent(doc.content),
    image: toPositionedImage(doc.image) ?? { src: '', alt: '', position: 'right' },
    cta: hasCta
      ? compact({
          type: cta.type === 'weezevent' ? 'weezevent' : 'standard',
          isExternal: Boolean(cta.isExternal),
          label: String(cta.label),
          url: cta.url || undefined,
          weezeventCode: cta.weezeventCode || undefined,
        })
      : undefined,
  }) as Actualities
}

/** Jeu — forme `Game`. */
export const toGame = (doc: Raw): Game =>
  compact({
    id: String(doc.slug ?? ''),
    name: String(doc.name ?? ''),
    blockType: doc.blockType === 'block' ? 'block' : 'text',
    bgType: doc.bgType || undefined,
    color1: doc.color1 || undefined,
    color2: doc.color2 || undefined,
    logo: resolveImage(doc.logo),
    img: resolveImage(doc.img),
    bgImg: resolveImage(doc.bgImg),
  }) as Game

/** Catégorie — forme `{ id, name, color? }`. */
export const toCategory = (doc: Raw) =>
  compact({
    id: String(doc.slug ?? ''),
    name: String(doc.name ?? ''),
    color: doc.color || undefined,
  })
