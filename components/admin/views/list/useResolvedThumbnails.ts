'use client'

import { useEffect, useMemo, useState } from 'react'

/**
 * Résout la vignette d'une liste, y compris quand elle vient de la bibliothèque.
 *
 * Les champs image du projet acceptent deux sources : un fichier envoyé depuis le
 * backoffice (`media`, une relation) ou un chemin hérité de `public/assets`
 * (`path`). Or **la requête de liste de Payload s'exécute en `depth: 0`** : une
 * image envoyée n'arrive donc que sous forme d'identifiant, sans URL.
 *
 * Ce hook complète les identifiants manquants en une requête, et **seulement si
 * nécessaire** — tant que les vignettes sont des chemins hérités, il ne déclenche
 * aucun appel réseau.
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
  serverURL: string,
) => {
  const [urls, setUrls] = useState<Record<string, string>>({})

  const unresolved = useMemo(() => {
    const ids = new Set<string>()
    for (const doc of docs) {
      const id = pendingID(getField(doc))
      if (id && !urls[id]) ids.add(id)
    }
    return [...ids]
    // `getField` est une fonction locale recréée à chaque rendu : l'inclure
    // relancerait l'effet en boucle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docs, urls])

  useEffect(() => {
    if (unresolved.length === 0) return

    const controller = new AbortController()
    const query = unresolved.map((id) => `where[id][in][]=${encodeURIComponent(id)}`).join('&')

    void fetch(`${serverURL}${apiRoute}/media?depth=0&limit=${unresolved.length}&${query}`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (!body?.docs) return
        setUrls((previous) => {
          const next = { ...previous }
          for (const doc of body.docs as Array<{ id: string; url?: string }>) {
            if (doc.url) next[String(doc.id)] = doc.url
          }
          return next
        })
      })
      .catch(() => {
        // Vignette non résolue : la card affiche son état vide, sans casser la liste.
      })

    return () => controller.abort()
  }, [unresolved, apiRoute, serverURL])

  return (doc: T): string | undefined => {
    const field = getField(doc)
    const direct = directURL(field)
    if (direct) return direct
    const id = pendingID(field)
    return id ? urls[id] : undefined
  }
}
