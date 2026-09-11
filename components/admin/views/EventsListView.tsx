'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { useConfig, useListQuery } from '@payloadcms/ui'

import { CardListView } from './list/CardListView'
import { useResolvedThumbnails } from './list/useResolvedThumbnails'

/**
 * Vue liste des événements, en cards illustrées par la vignette.
 * Toute la mécanique de liste vit dans `CardListView` ; on ne décrit ici que le
 * contenu d'une card.
 */

type EventDoc = {
  id: string
  title?: string
  startDate?: string
  endDate?: string
  location?: string
  isCancelled?: boolean
  _status?: string
  cardThumbnail?: { media?: unknown; path?: string }
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const formatRange = (doc: EventDoc): string | undefined => {
  if (!doc.startDate) return undefined
  const start = dateFormatter.format(new Date(doc.startDate))
  if (!doc.endDate || doc.endDate.slice(0, 10) === doc.startDate.slice(0, 10)) return start
  return `Du ${start} au ${dateFormatter.format(new Date(doc.endDate))}`
}

/** Annulé prime sur brouillon : c'est l'information la plus structurante. */
const statusOf = (doc: EventDoc): { label: string; tone: 'cancelled' | 'draft' | 'published' } => {
  if (doc.isCancelled) return { label: 'Annulé', tone: 'cancelled' }
  if (doc._status === 'draft') return { label: 'Brouillon', tone: 'draft' }
  return { label: 'Publié', tone: 'published' }
}

export const EventsListView = (props: any) => {
  const { config } = useConfig()
  const {
    routes: { api: apiRoute },
    serverURL,
  } = config

  const { data } = useListQuery()
  const docs: EventDoc[] = (data?.docs as EventDoc[]) ?? []

  const thumbnailFor = useResolvedThumbnails(
    docs,
    (doc) => doc.cardThumbnail,
    apiRoute,
    serverURL,
  )

  return (
    <CardListView<EventDoc>
      emptyMessage="Aucun événement ne correspond à votre recherche."
      emptyTitle="Aucun événement"
      gridClassName="hgc-cards--events"
      listProps={props}
      renderCard={({ doc, href }) => {
        const thumbnail = thumbnailFor(doc)
        const status = statusOf(doc)
        const range = formatRange(doc)

        return (
          <>
            <Link className="hgc-cards__media" href={href} tabIndex={-1}>
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" loading="lazy" src={thumbnail} />
              ) : (
                <span className="hgc-cards__media-empty">Pas de vignette</span>
              )}
            </Link>

            <div className="hgc-cards__body">
              <span className={`hgc-cards__status hgc-cards__status--${status.tone}`}>
                {status.label}
              </span>
              <h3 className="hgc-cards__title">
                <Link href={href}>{doc.title || 'Sans titre'}</Link>
              </h3>
              {range ? <p className="hgc-cards__meta">{range}</p> : null}
              {doc.location ? (
                <p className="hgc-cards__meta hgc-cards__meta--muted">{doc.location}</p>
              ) : null}
            </div>
          </>
        )
      }}
      selectionLabel="événements"
    />
  )
}

export default EventsListView
