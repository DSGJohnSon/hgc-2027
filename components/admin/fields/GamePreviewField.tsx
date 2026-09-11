'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useConfig, useDocumentInfo, useField } from '@payloadcms/ui'

import type { Game } from '@/types/games'
import { useResolvedThumbnails } from '../views/list/useResolvedThumbnails'

/**
 * Aperçu de la `GameCard` dans la colonne latérale du formulaire d'édition,
 * à côté de « Identifiant (URL) ».
 *
 * - Création : un seul aperçu, celui du jeu tel qu'il sera créé.
 * - Édition : l'état actuellement enregistré (statique, page dédiée
 *   `game-card/[slug]`) au-dessus de l'aperçu en direct des modifications en
 *   cours (piloté par `postMessage`, page `game-card/preview`) — pour
 *   comparer avant/après sans avoir à enregistrer.
 *
 * Chaque valeur est lue via `useField` (le hook officiel de Payload, celui
 * qu'utilisent ses propres champs) plutôt que via un accès brut à l'état
 * global du formulaire : c'est ce qui garantit une valeur à jour pour les
 * champs imbriqués dans le groupe `logo`/`img`/`bgImg`.
 *
 * Voir `app/(embed)/game-card/` pour les deux pages embarquées, et
 * `components/admin/views/GamesListView.tsx` pour le même principe appliqué
 * à la liste (aperçu de l'état enregistré uniquement, là où il n'y a pas de
 * formulaire en cours).
 */

const MESSAGE_TYPE = 'hgc-game-preview'
const READY_TYPE = 'hgc-game-preview-ready'

type ImageFieldValue = { media?: unknown } | undefined

export const GamePreviewField = () => {
  const { config } = useConfig()
  const {
    routes: { api: apiRoute },
    serverURL,
  } = config
  const { initialData, isEditing } = useDocumentInfo()

  const { value: nameValue } = useField<string>({ path: 'name' })
  const { value: blockTypeValue } = useField<string>({ path: 'blockType' })
  const { value: bgTypeValue } = useField<string>({ path: 'bgType' })
  const { value: color1 } = useField<string>({ path: 'color1' })
  const { value: color2 } = useField<string>({ path: 'color2' })
  const { value: logoId } = useField<unknown>({ path: 'logo.media' })
  const { value: imgId } = useField<unknown>({ path: 'img.media' })
  const { value: bgImgId } = useField<unknown>({ path: 'bgImg.media' })

  const name = nameValue || 'Sans nom'
  const blockType = blockTypeValue === 'block' ? 'block' : 'text'
  const bgType = bgTypeValue === 'gradient' || bgTypeValue === 'color' ? bgTypeValue : undefined

  // Un « faux » document, à la forme attendue par `useResolvedThumbnails`
  // (déjà utilisé par GamesListView pour le même besoin). Mémorisé sur les
  // seuls identifiants d'image : sans quoi une nouvelle référence à chaque
  // frappe redéclencherait inutilement la résolution réseau des vignettes.
  const virtualDocs = useMemo(
    () => [
      {
        id: 'preview',
        logo: { media: logoId } as ImageFieldValue,
        img: { media: imgId } as ImageFieldValue,
        bgImg: { media: bgImgId } as ImageFieldValue,
      },
    ],
    [logoId, imgId, bgImgId],
  )
  const [virtualDoc] = virtualDocs

  const logoFor = useResolvedThumbnails(virtualDocs, (d) => d.logo, apiRoute, serverURL)
  const imgFor = useResolvedThumbnails(virtualDocs, (d) => d.img, apiRoute, serverURL)
  const bgImgFor = useResolvedThumbnails(virtualDocs, (d) => d.bgImg, apiRoute, serverURL)

  // Le hook renvoie une URL absolue (adaptée à un <img> classique). `GameCard`
  // utilise next/image, qui refuse toute URL absolue non déclarée dans
  // `images.remotePatterns` : on ne garde que le chemin, toujours autorisé.
  const toPath = (url: string | undefined) => {
    if (!url) return url
    try {
      return new URL(url, window.location.origin).pathname
    } catch {
      return url
    }
  }

  const logo = toPath(logoFor(virtualDoc))
  const img = toPath(imgFor(virtualDoc))
  const bgImg = toPath(bgImgFor(virtualDoc))

  const liveGame: Game = {
    id: 'preview',
    name,
    blockType,
    bgType,
    color1: color1 || undefined,
    color2: color2 || undefined,
    logo,
    img,
    bgImg,
  }

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type === READY_TYPE) setReady(true)
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    if (!ready) return
    iframeRef.current?.contentWindow?.postMessage(
      { type: MESSAGE_TYPE, game: liveGame },
      window.location.origin,
    )
    // `liveGame` est reconstruit à chaque rendu : on ne redéclenche l'envoi
    // que si une de ses valeurs a réellement changé.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, name, blockType, bgType, color1, color2, logo, img, bgImg])

  const currentSlug = typeof initialData?.slug === 'string' ? initialData.slug : undefined

  return (
    <div className="hgc-game-preview">
      {isEditing ? (
        <div className="hgc-game-preview__block">
          <p className="hgc-game-preview__label">Actuellement enregistré</p>
          <div className="hgc-game-preview__frame-wrap">
            {currentSlug ? (
              <iframe
                className="hgc-game-preview__frame"
                src={`/game-card/${currentSlug}`}
                title="Aperçu enregistré"
              />
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="hgc-game-preview__block">
        <p className="hgc-game-preview__label">
          {isEditing ? 'Avec vos modifications' : 'Aperçu'}
        </p>
        <div className="hgc-game-preview__frame-wrap">
          <iframe
            className="hgc-game-preview__frame"
            ref={iframeRef}
            src="/game-card/preview"
            title="Aperçu en direct"
          />
        </div>
      </div>
    </div>
  )
}

export default GamePreviewField
