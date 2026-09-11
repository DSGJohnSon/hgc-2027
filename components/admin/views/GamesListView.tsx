'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'

import { CardListView } from './list/CardListView'

/**
 * Vue liste des jeux, en cards illustrées par le vrai composant du site
 * (`GameCard`, dans `FreeplaySection.tsx`).
 *
 * Ce composant s'appuie sur les classes Tailwind et les polices du site
 * public, absentes du bundle CSS de l'admin (voir `app/(payload)/layout.tsx`,
 * qui n'importe que `custom.scss`). Plutôt que d'en reconstruire une
 * approximation en CSS pur, l'aperçu affiche le composant réel via une page
 * dédiée (`app/(embed)/game-card/[slug]`), embarquée en `<iframe>` : rendu
 * strictement identique à celui des pages événements, sans dupliquer le style.
 */

type GameDoc = {
  id: string
  slug?: string
  name?: string
}

export const GamesListView = (props: any) => (
  <CardListView<GameDoc>
    emptyMessage="Aucun jeu ne correspond à votre recherche."
    emptyTitle="Aucun jeu"
    gridClassName="hgc-cards--games"
    listProps={props}
    renderCard={({ doc, href }) => {
      const name = doc.name || 'Sans nom'

      return (
        <>
          <div className="hgc-cards__media hgc-game-card__media">
            {doc.slug ? (
              <iframe
                className="hgc-game-card__frame"
                loading="lazy"
                src={`/game-card/${doc.slug}`}
                tabIndex={-1}
                title={name}
              />
            ) : (
              <span className="hgc-cards__media-empty">Pas d&apos;aperçu</span>
            )}
            <Link aria-label={name} className="hgc-game-card__overlay-link" href={href} />
          </div>

          <div className="hgc-cards__body">
            <h3 className="hgc-cards__title">
              <Link href={href}>{name}</Link>
            </h3>
            <Link className="hgc-cards__action" href={href}>
              Modifier le jeu
            </Link>
          </div>
        </>
      )
    }}
    selectionLabel="jeux"
  />
)

export default GamesListView
