'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { useConfig, useListQuery } from '@payloadcms/ui'

import { CardListView } from './list/CardListView'
import { useResolvedThumbnails } from './list/useResolvedThumbnails'

/**
 * Vue liste des partenaires, en cards : logo et nom, rien de plus.
 *
 * Le logo est affiché en `contain` sur un aplat sombre, et non recadré en
 * `cover` comme les vignettes d'événements : un logo tronqué serait inexploitable,
 * et la plupart de ceux de l'association sont conçus pour fond sombre.
 */

type PartnerDoc = {
  id: string
  name?: string
  /** Média de la bibliothèque : document peuplé, ou simple identifiant en `depth: 0`. */
  logo?: unknown
}

export const PartnersListView = (props: any) => {
  const { config } = useConfig()
  const {
    routes: { api: apiRoute },
  } = config

  const { data } = useListQuery()
  const docs: PartnerDoc[] = (data?.docs as PartnerDoc[]) ?? []

  // Le hook attend un champ image du projet (`{ media, path }`) ; ici le logo est
  // directement la relation, on l'y présente donc sous la clé `media`.
  const logoFor = useResolvedThumbnails(docs, (doc) => ({ media: doc.logo }), apiRoute)

  return (
    <CardListView<PartnerDoc>
      emptyMessage="Aucun partenaire ne correspond à votre recherche."
      emptyTitle="Aucun partenaire"
      gridClassName="hgc-cards--partners"
      listProps={props}
      renderCard={({ doc, href }) => {
        const logo = logoFor(doc)

        return (
          <>
            <Link className="hgc-cards__media" href={href} tabIndex={-1}>
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="" loading="lazy" src={logo} />
              ) : (
                <span className="hgc-cards__media-empty">Pas de logo</span>
              )}
            </Link>

            <div className="hgc-cards__body">
              <h3 className="hgc-cards__title">
                <Link href={href}>{doc.name || 'Sans nom'}</Link>
              </h3>
            </div>
          </>
        )
      }}
      selectionLabel="partenaires"
    />
  )
}

export default PartnersListView
