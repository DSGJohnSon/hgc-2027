'use client'

import { useMemo } from 'react'

import { useResolvedDocs } from './docStore'

/**
 * Résout la vignette d'une liste, y compris quand elle vient de la bibliothèque.
 *
 * Les champs image du projet acceptent deux sources : un fichier envoyé depuis le
 * backoffice (`media`, une relation) ou un chemin hérité de `public/assets`
 * (`path`). Or **la requête de liste de Payload s'exécute en `depth: 0`** : une
 * image envoyée n'arrive donc que sous forme d'identifiant, sans URL.
 *
 * Les identifiants manquants sont confiés au cache partagé (`docStore`), qui
 * regroupe les demandes et ne réclame jamais deux fois le même document. Tant
 * que les vignettes sont des chemins hérités, aucun appel réseau n'est déclenché.
 */

type ImageField = { media?: unknown; path?: string } | undefined | null

/** URL directe, quand elle est déjà connue. */
const directURL = (field: ImageField): string | undefined => {
  if (!field) return undefined
  const { media } = field
  if (media && typeof media === 'object' && typeof (media as { url?: unknown }).url === 'string') {
    return (media as { url: string }).url
  }
  return typeof field.path === 'string' && field.path.length > 0 ? field.path : undefined
}

/** Identifiant du média restant à résoudre. */
const pendingID = (field: ImageField): string | undefined => {
  if (!field || directURL(field)) return undefined
  const { media } = field
  if (typeof media === 'string' || typeof media === 'number') return String(media)
  return undefined
}

export const useResolvedThumbnails = <T,>(
  docs: T[],
  getField: (doc: T) => ImageField,
  apiRoute: string,
) => {
  const ids = useMemo(() => {
    const collected = new Set<string>()
    for (const doc of docs) {
      const id = pendingID(getField(doc))
      if (id) collected.add(id)
    }
    return [...collected]
    // `getField` est une fonction locale recréée à chaque rendu : l'inclure
    // relancerait le calcul en boucle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docs])

  const mediaFor = useResolvedDocs('media', ids, apiRoute)

  return (doc: T): string | undefined => {
    const field = getField(doc)
    const direct = directURL(field)
    if (direct) return direct

    const id = pendingID(field)
    if (!id) return undefined

    const url = mediaFor(id)?.url
    return typeof url === 'string' ? url : undefined
  }
}
