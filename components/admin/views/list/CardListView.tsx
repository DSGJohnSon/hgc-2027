'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'
import {
  Gutter,
  ListControls,
  ListHeader,
  ListSelection,
  PageControls,
  SelectionProvider,
  SelectRow,
  TableColumnsProvider,
  useConfig,
  useListQuery,
  useTranslation,
  useWindowInfo,
} from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'

/**
 * Coque commune aux vues liste en cards.
 *
 * Payload ne propose pas de mode « cards » pour les listes de collections — le
 * bascule grille/liste n'existe que dans la vue Dossiers. On remplace donc la
 * vue liste (`admin.components.views.list.Component`), mais **sans réécrire le
 * reste** : Payload monte déjà `ListQueryProvider` autour de ce composant et
 * expose publiquement ses propres briques. Seul le tableau est remplacé ; l'en-tête,
 * la recherche, les filtres, le tri, la pagination et la sélection multiple sont
 * recomposés à partir de ses composants d'origine.
 *
 * Le contenu d'une card est laissé à l'appelant via `renderCard` : c'est la seule
 * chose qui change d'une collection à l'autre.
 */

export type CardRenderArgs<T> = {
  doc: T
  /** Lien vers la fiche, déjà formaté selon la route d'admin configurée. */
  href: string
}

type CardListViewProps<T> = {
  /** Props transmises par Payload à la vue liste. */
  listProps: any
  /** Contenu d'une card : visuel et informations. */
  renderCard: (args: CardRenderArgs<T>) => ReactNode
  /** Libellé au pluriel, utilisé par le compteur de sélection. */
  selectionLabel: string
  /** Classe appliquée à la grille, pour la mise en forme propre à la collection. */
  gridClassName: string
  emptyTitle: string
  emptyMessage: string
}

export const CardListView = <T extends { id: string }>({
  listProps,
  renderCard,
  selectionLabel,
  gridClassName,
  emptyTitle,
  emptyMessage,
}: CardListViewProps<T>) => {
  const {
    AfterList,
    AfterListTable,
    BeforeList,
    BeforeListTable,
    collectionSlug,
    columnState,
    enableRowSelections,
    hasCreatePermission,
    hasDeletePermission,
    hasTrashPermission,
    listMenuItems,
    newDocumentURL,
    queryPreset,
    queryPresetPermissions,
    renderedFilters,
    resolvedFilterOptions,
    viewType,
  } = listProps

  const { config, getEntityConfig } = useConfig()
  const {
    routes: { admin: adminRoute },
    serverURL,
  } = config

  const { i18n } = useTranslation()
  const {
    breakpoints: { s: smallBreak },
  } = useWindowInfo()

  const { data } = useListQuery()
  const collectionConfig = getEntityConfig({ collectionSlug })

  const docs: T[] = (data?.docs as T[]) ?? []

  return (
    <TableColumnsProvider collectionSlug={collectionSlug} columnState={columnState}>
      <div className={`collection-list collection-list--${collectionSlug}`}>
        <SelectionProvider docs={docs} totalDocs={data?.totalDocs ?? 0}>
          {BeforeList}
          <Gutter className="collection-list__wrap">
            {/*
              `ListHeader` exporté par Payload est son propre en-tête de
              collection : on récupère donc le bouton de création, le menu
              d'actions groupées et l'accès à la corbeille sans les réécrire.
            */}
            <ListHeader
              collectionConfig={collectionConfig}
              hasCreatePermission={hasCreatePermission}
              hasDeletePermission={hasDeletePermission}
              hasTrashPermission={hasTrashPermission}
              i18n={i18n}
              isBulkUploadEnabled={false}
              isTrashEnabled={Boolean(collectionConfig?.trash)}
              newDocumentURL={newDocumentURL}
              openBulkUpload={() => undefined}
              smallBreak={smallBreak}
              viewType={viewType}
            />

            <ListControls
              collectionConfig={collectionConfig}
              collectionSlug={collectionSlug}
              disableQueryPresets
              // Le sélecteur de colonnes n'a plus d'objet sans tableau.
              enableColumns={false}
              listMenuItems={listMenuItems}
              queryPreset={queryPreset}
              queryPresetPermissions={queryPresetPermissions}
              renderedFilters={renderedFilters}
              resolvedFilterOptions={resolvedFilterOptions}
            />

            {BeforeListTable}

            {docs.length > 0 ? (
              <ul className={`hgc-cards ${gridClassName}`}>
                {docs.map((doc) => {
                  const href = formatAdminURL({
                    adminRoute,
                    serverURL,
                    path: `/collections/${collectionSlug}/${doc.id}`,
                    relative: true,
                  })

                  return (
                    <li className="hgc-cards__item" key={doc.id}>
                      <article className="hgc-cards__card">
                        {enableRowSelections ? (
                          <div className="hgc-cards__select">
                            <SelectRow
                              rowData={{
                                id: doc.id,
                                _isLocked: Boolean((doc as any)._isLocked),
                                _userEditing: (doc as any)._userEditing,
                              }}
                            />
                          </div>
                        ) : null}
                        {renderCard({ doc, href })}
                      </article>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <div className="hgc-cards__empty">
                <h3>{emptyTitle}</h3>
                <p>{emptyMessage}</p>
              </div>
            )}

            {AfterListTable}

            {docs.length > 0 ? (
              <PageControls
                AfterPageControls={
                  <ListSelection
                    collectionConfig={collectionConfig}
                    label={selectionLabel}
                    showSelectAllAcrossPages
                  />
                }
                collectionConfig={collectionConfig}
              />
            ) : null}
          </Gutter>
          {AfterList}
        </SelectionProvider>
      </div>
    </TableColumnsProvider>
  )
}

export default CardListView
