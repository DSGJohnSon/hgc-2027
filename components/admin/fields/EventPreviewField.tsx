'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useAllFormFields, useConfig } from '@payloadcms/ui'
import { reduceFieldsToValues } from 'payload/shared'

import type { EventItem as EventItemType } from '@/types/pages/detail-event'
import { useResolvedThumbnails } from '../views/list/useResolvedThumbnails'
import { toLocalMediaPath } from '@/lib/media-url'
import { useResolvedRelations } from '../views/list/useResolvedRelations'

/**
 * Aperçu de la card `EventItem` (celle utilisée sur `/evenements`) dans la
 * colonne latérale du formulaire d'édition, mis à jour à chaque frappe —
 * avant tout enregistrement. Même principe que `ActualitePreviewField` (voir
 * ce fichier pour le détail de `reduceFieldsToValues` et de la mécanique
 * `postMessage`), avec deux résolutions supplémentaires : les catégories et
 * les jeux du tournoi sont des relations `hasMany`, dont l'état du formulaire
 * ne contient que les identifiants — `useResolvedRelations` les résout en
 * `{ id, name }` (seuls champs affichés par la card), comme
 * `useResolvedThumbnails` le fait déjà pour la vignette.
 */

const MESSAGE_TYPE = 'hgc-event-preview'
const READY_TYPE = 'hgc-event-preview-ready'

type ThumbnailFieldValue = { media?: unknown } | undefined

const asIdArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])

export const EventPreviewField = () => {
  const { config } = useConfig()
  const {
    routes: { api: apiRoute },
  } = config
  const [fields] = useAllFormFields()

  const rawDoc = useMemo(() => reduceFieldsToValues(fields, true), [fields])

  const thumbnailId = (rawDoc.cardThumbnail as { media?: unknown } | undefined)?.media
  const categoryIds = asIdArray(rawDoc.categories)
  const gameIds = asIdArray(rawDoc.games)

  // Un « faux » document, à la forme attendue par `useResolvedThumbnails`
  // (même hook que GamesListView/GamePreviewField pour le même besoin).
  const virtualDocs = useMemo(
    () => [{ id: 'preview', cardThumbnail: { media: thumbnailId } as ThumbnailFieldValue }],
    [thumbnailId],
  )
  const [virtualDoc] = virtualDocs
  const thumbnailFor = useResolvedThumbnails(virtualDocs, (d) => d.cardThumbnail, apiRoute)

  // `EventItem` utilise next/image. Une image servie par l'application est
  // ramenée à son chemin ; une image du CDN Blob garde son URL absolue, dont
  // l'hôte est déclaré dans `images.remotePatterns` (même règle que côté Jeux).
  const resolvedThumbnail = useMemo(() => {
    const url = thumbnailFor(virtualDoc)
    return url ? toLocalMediaPath(url) : undefined
  }, [thumbnailFor, virtualDoc])

  const categoryFor = useResolvedRelations(categoryIds, 'categories', apiRoute)
  const gameFor = useResolvedRelations(gameIds, 'games', apiRoute)

  const built = useMemo((): { event: EventItemType; error: null } | { event: null; error: string } => {
    try {
      const startDate = typeof rawDoc.startDate === 'string' ? rawDoc.startDate : ''
      const endDate = typeof rawDoc.endDate === 'string' ? rawDoc.endDate : undefined
      const start = startDate ? new Date(startDate) : undefined
      const end = endDate ? new Date(endDate) : undefined
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const isOngoing = start
        ? end
          ? today >= start && today <= end
          : today.getTime() === start.getTime()
        : false
      const isPast = start ? (end ? end < today : start < today) : false

      const event: EventItemType = {
        id: 'preview',
        type: rawDoc.type === 'tournoi' || rawDoc.type === 'both' ? rawDoc.type : 'event',
        title: (rawDoc.title as string) || 'Sans titre',
        startDate,
        endDate,
        startTime: (rawDoc.startTime as string) || undefined,
        endTime: (rawDoc.endTime as string) || undefined,
        cardThumbnail: resolvedThumbnail || '',
        heroBanner: '',
        heroBannerMobile: '',
        location: (rawDoc.location as string) || undefined,
        color: (rawDoc.color as string) || '#6240cf',
        freeplayGames: [],
        isCancelled: Boolean(rawDoc.isCancelled),
        isOngoing,
        isPast,
        categories: categoryIds
          .map((id) => categoryFor(id))
          .filter((c): c is { id: string; name: string } => Boolean(c)),
        games: gameIds.map((id) => gameFor(id)).filter((g): g is { id: string; name: string } => Boolean(g)),
      }
      return { event, error: null }
    } catch (error) {
      return { event: null, error: error instanceof Error ? error.message : String(error) }
    }
  }, [rawDoc, resolvedThumbnail, categoryIds, gameIds, categoryFor, gameFor])

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === READY_TYPE) setReady(true)
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    if (!ready || !built.event) return
    // `postMessage` peut lever une `DataCloneError` si la donnée reconstruite
    // contient quelque chose de non sérialisable — capturé ici pour
    // l'afficher plutôt que de laisser l'aperçu silencieusement vide.
    try {
      iframeRef.current?.contentWindow?.postMessage(
        { type: MESSAGE_TYPE, event: built.event },
        window.location.origin,
      )
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSendError((previous) => (previous === null ? previous : null))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setSendError((previous) => (previous === message ? previous : message))
    }
  }, [ready, built.event])

  const error = built.error || sendError

  return (
    <div className="hgc-game-preview">
      <div className="hgc-game-preview__block">
        <p className="hgc-game-preview__label">Aperçu</p>
        {error ? (
          <p className="hgc-game-preview__error">Aperçu impossible : {error}</p>
        ) : (
          <div className="hgc-game-preview__frame-wrap hgc-game-preview__frame-wrap--tall">
            <iframe
              className="hgc-game-preview__frame"
              ref={iframeRef}
              src="/event-card/preview"
              title="Aperçu"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default EventPreviewField
