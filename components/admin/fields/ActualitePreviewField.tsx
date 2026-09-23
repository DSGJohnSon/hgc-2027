'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useAllFormFields, useConfig } from '@payloadcms/ui'
import { reduceFieldsToValues } from 'payload/shared'

import type { Actualities } from '@/types/pages/detail-actualites'
import { toActualite } from '@/lib/content/mappers/entities'
import { useResolvedThumbnails } from '../views/list/useResolvedThumbnails'
import { toLocalMediaPath } from '@/lib/media-url'

/**
 * Aperçu de l'`ActualiteCard` dans la colonne latérale du formulaire
 * d'édition, mis à jour à chaque frappe — avant tout enregistrement. Même
 * principe que `GamePreviewField` (voir ce fichier pour le détail de la
 * mécanique `postMessage`), mais pour un champ `content` de type `blocks`
 * (nombre de blocs variable) : sa valeur n'existe pas telle quelle dans
 * l'état du formulaire, Payload la garde à plat (une entrée par sous-champ,
 * `content.0.blockType`, `content.0.paragraphs.0.text`, …).
 * `reduceFieldsToValues` (utilitaire officiel de Payload) reconstruit
 * l'objet imbriqué à partir de cet état — c'est ce qui permet de réutiliser
 * directement `toActualite()`, le même mapper que celui du site public,
 * plutôt que d'en récrire un pour chaque type de bloc.
 */

const MESSAGE_TYPE = 'hgc-actualite-preview'
const READY_TYPE = 'hgc-actualite-preview-ready'

type ImageFieldValue = { media?: unknown } | undefined

export const ActualitePreviewField = () => {
  const { config } = useConfig()
  const {
    routes: { api: apiRoute },
  } = config
  const [fields] = useAllFormFields()

  const rawDoc = useMemo(() => reduceFieldsToValues(fields, true), [fields])
  const logoId = (rawDoc.image as { media?: unknown } | undefined)?.media

  // Un « faux » document, à la forme attendue par `useResolvedThumbnails`
  // (même hook que GamesListView/GamePreviewField pour le même besoin).
  const virtualDocs = useMemo(
    () => [{ id: 'preview', image: { media: logoId } as ImageFieldValue }],
    [logoId],
  )
  const [virtualDoc] = virtualDocs
  const imageFor = useResolvedThumbnails(virtualDocs, (d) => d.image, apiRoute)

  // `ActualiteCard` utilise next/image. Une image servie par l'application est
  // ramenée à son chemin ; une image du CDN Blob garde son URL absolue, dont
  // l'hôte est déclaré dans `images.remotePatterns` (même règle que côté Jeux).
  const resolvedImageUrl = useMemo(() => {
    const url = imageFor(virtualDoc)
    return url ? toLocalMediaPath(url) : undefined
  }, [imageFor, virtualDoc])

  const built = useMemo((): { actualite: Actualities; error: null } | { actualite: null; error: string } => {
    try {
      const actualite = toActualite(rawDoc)
      if (resolvedImageUrl) actualite.image = { ...actualite.image, src: resolvedImageUrl }
      return { actualite, error: null }
    } catch (error) {
      return { actualite: null, error: error instanceof Error ? error.message : String(error) }
    }
  }, [rawDoc, resolvedImageUrl])
  const liveActualite = built.actualite

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
    if (!ready || !liveActualite) return
    // `postMessage` peut lever une `DataCloneError` si la donnée reconstruite
    // contient quelque chose de non sérialisable — capturé ici pour
    // l'afficher plutôt que de laisser l'aperçu silencieusement vide.
    try {
      iframeRef.current?.contentWindow?.postMessage(
        { type: MESSAGE_TYPE, actualite: liveActualite },
        window.location.origin,
      )
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSendError((previous) => (previous === null ? previous : null))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      setSendError((previous) => (previous === message ? previous : message))
    }
  }, [ready, liveActualite])

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
              src="/actualite-card/preview"
              title="Aperçu"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ActualitePreviewField
