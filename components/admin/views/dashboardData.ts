import type { Payload } from 'payload'

import { resolveImage } from '@/lib/content/mappers/common'

/**
 * Données affichées par les cards du tableau de bord.
 *
 * Deux visuels sont statiques (fournis par l'association), deux sont tirés du
 * contenu réel afin que le tableau de bord reflète l'état du site.
 */

/** Visuel « Jeux HGC » — image dédiée fournie par l'association. */
export const GAMES_THUMBNAIL = '/assets/payload/thumbnails/jeux-hgc.png'

/** Visuel « Partenaires » — image dédiée fournie par l'association. */
export const PARTNERS_THUMBNAIL = '/assets/payload/thumbnails/partners.png'

/**
 * Visuel « Services » — provisoirement la vignette de Tournois Majeurs, en
 * attendant une image dédiée sur le modèle de celle des jeux.
 */
export const SERVICES_THUMBNAIL =
  '/assets/img/services/tournois-majeurs/thumbnail_tournois-majeurs.png'

/**
 * Bannière mobile du **prochain** événement à venir.
 *
 * On ne prend pas le dernier événement créé : la migration ayant importé les dix
 * événements dans la même seconde, l'ordre de création n'a aucun sens ici et
 * remonterait un événement passé. Le prochain à venir est aussi ce qui intéresse
 * réellement l'association. Repli sur l'événement le plus récent si l'agenda est
 * vide.
 */
export const getNextEventBanner = async (payload: Payload): Promise<string | undefined> => {
  const today = new Date().toISOString().slice(0, 10)

  const upcoming = await payload.find({
    collection: 'events',
    where: { startDate: { greater_than_equal: today } },
    sort: 'startDate',
    limit: 1,
    depth: 1,
  })

  const fallback = upcoming.docs.length
    ? upcoming
    : await payload.find({ collection: 'events', sort: '-startDate', limit: 1, depth: 1 })

  const doc = fallback.docs[0] as { heroBannerMobile?: unknown } | undefined
  return resolveImage(doc?.heroBannerMobile as never)
}

/** Illustration de l'actualité publiée la plus récente. */
export const getLatestNewsImage = async (payload: Payload): Promise<string | undefined> => {
  const { docs } = await payload.find({
    collection: 'actualites',
    sort: '-date',
    limit: 1,
    depth: 1,
  })

  const doc = docs[0] as { image?: unknown } | undefined
  return resolveImage(doc?.image as never)
}
