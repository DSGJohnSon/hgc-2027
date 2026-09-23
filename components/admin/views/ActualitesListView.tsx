'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { useConfig, useListQuery } from '@payloadcms/ui'

import { CardListView } from './list/CardListView'
import { useResolvedThumbnails } from './list/useResolvedThumbnails'

/**
 * Vue liste des actualités, en cards illustrées par l'image de l'actualité.
 * Toute la mécanique de liste vit dans `CardListView` ; on ne décrit ici que le
 * contenu d'une card — même principe que EventsListView/PartnersListView.
 */

type ActualiteDoc = {
  id: string
  title?: string
  subtitle?: string
  date?: string
  _status?: string
  image?: { media?: unknown; path?: string }
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const statusOf = (doc: ActualiteDoc): { label: string; tone: 'draft' | 'published' } =>
  doc._status === 'draft' ? { label: 'Brouillon', tone: 'draft' } : { label: 'Publié', tone: 'published' }

export const ActualitesListView = (props: any) => {
  const { config } = useConfig()
  const {
    routes: { api: apiRoute },
  } = config

  const { data } = useListQuery()
  const docs: ActualiteDoc[] = (data?.docs as ActualiteDoc[]) ?? []

  const thumbnailFor = useResolvedThumbnails(docs, (doc) => doc.image, apiRoute)

  return (
    <CardListView<ActualiteDoc>
      emptyMessage="Aucune actualité ne correspond à votre recherche."
      emptyTitle="Aucune actualité"
      gridClassName="hgc-cards--actualites"
      listProps={props}
      renderCard={({ doc, href }) => {
        const thumbnail = thumbnailFor(doc)
        const status = statusOf(doc)
        const date = doc.date ? dateFormatter.format(new Date(doc.date)) : undefined

        return (
          <>
            <Link className="hgc-cards__media" href={href} tabIndex={-1}>
              {thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" loading="lazy" src={thumbnail} />
              ) : (
                <span className="hgc-cards__media-empty">Pas d’illustration</span>
              )}
            </Link>

            <div className="hgc-cards__body">
              <span className={`hgc-cards__status hgc-cards__status--${status.tone}`}>
                {status.label}
              </span>
              <h3 className="hgc-cards__title">
                <Link href={href}>{doc.title || 'Sans titre'}</Link>
              </h3>
              {date ? <p className="hgc-cards__meta">{date}</p> : null}
              {doc.subtitle ? (
                <p className="hgc-cards__meta hgc-cards__meta--muted">{doc.subtitle}</p>
              ) : null}
            </div>
          </>
        )
      }}
      selectionLabel="actualités"
    />
  )
}

export default ActualitesListView
