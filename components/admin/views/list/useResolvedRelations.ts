'use client'

import { useEffect, useMemo, useState } from 'react'

/**
 * Résout une liste d'identifiants de relation (`hasMany`) en `{ id, name }`,
 * pour l'affichage d'un aperçu en direct — l'état du formulaire ne contient
 * que les identifiants, jamais les documents peuplés (voir
 * `useResolvedThumbnails`, même principe pour les champs image).
 */

type Resolved = { id: string; name: string }

const toId = (value: unknown): string | undefined => {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (value && typeof value === 'object' && typeof (value as { id?: unknown }).id === 'string') {
    return (value as { id: string }).id
  }
  return undefined
}

export const useResolvedRelations = (
  ids: unknown[],
  collection: string,
  apiRoute: string,
  serverURL: string,
) => {
  const [docs, setDocs] = useState<Record<string, Resolved>>({})

  const normalizedIds = useMemo(() => ids.map(toId).filter((id): id is string => Boolean(id)), [ids])

  const unresolved = useMemo(
    () => normalizedIds.filter((id) => !docs[id]),
    [normalizedIds, docs],
  )

  useEffect(() => {
    if (unresolved.length === 0) return

    const controller = new AbortController()
    const query = unresolved.map((id) => `where[id][in][]=${encodeURIComponent(id)}`).join('&')

    void fetch(
      `${serverURL}${apiRoute}/${collection}?depth=0&limit=${unresolved.length}&${query}`,
      { credentials: 'include', signal: controller.signal },
    )
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (!body?.docs) return
        setDocs((previous) => {
          const next = { ...previous }
          for (const doc of body.docs as Array<{ id: string; name?: string }>) {
            if (doc.name) next[String(doc.id)] = { id: String(doc.id), name: doc.name }
          }
          return next
        })
      })
      .catch(() => {
        // Non résolu : l'aperçu ignore simplement cette entrée.
      })

    return () => controller.abort()
  }, [unresolved, collection, apiRoute, serverURL])

  return (id: unknown): Resolved | undefined => {
    const normalized = toId(id)
    return normalized ? docs[normalized] : undefined
  }
}
