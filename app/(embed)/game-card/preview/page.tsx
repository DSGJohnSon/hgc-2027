'use client'

import { useEffect, useState } from 'react'

import type { Game } from '@/types/games'
import { GameCard } from '@/app/(my-app)/evenements/[id]/components/FreeplaySection'

/**
 * Aperçu « en direct » d'une `GameCard`, piloté par `postMessage` depuis le
 * formulaire d'édition du backoffice (`components/admin/fields/GamePreviewField.tsx`).
 *
 * Contrairement à `game-card/[slug]`, cette page ne lit rien en base : elle
 * n'affiche que les données qu'on lui envoie, ce qui permet de prévisualiser
 * des modifications non enregistrées. Un message `hgc-game-preview-ready` est
 * renvoyé au parent dès le montage, pour qu'il sache qu'il peut commencer à
 * envoyer des mises à jour (sans quoi le tout premier message risquerait
 * d'arriver avant que l'écouteur ne soit posé).
 */

const MESSAGE_TYPE = 'hgc-game-preview'
const READY_TYPE = 'hgc-game-preview-ready'

export default function GameCardPreviewPage() {
  const [game, setGame] = useState<Game | null>(null)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type !== MESSAGE_TYPE) return
      setGame(event.data.game as Game)
    }

    window.addEventListener('message', handleMessage)
    window.parent.postMessage({ type: READY_TYPE }, window.location.origin)

    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {game ? <GameCard game={game} /> : null}
    </div>
  )
}
