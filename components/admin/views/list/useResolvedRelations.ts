'use client'

import { useMemo } from 'react'

import { useResolvedDocs } from './docStore'

/**
 * Résout une liste d'identifiants de relation (`hasMany`) en `{ id, name }`,
 * pour l'affichage d'un aperçu en direct — l'état du formulaire ne contient
 * que les identifiants, jamais les documents peuplés (voir
 * `useResolvedThumbnails`, même principe pour les champs image).
 *
 * `labelField` désigne le champ servant de nom (`name` pour les jeux et les
 * catégories, `title` pour les séries).
 *
 * Les requêtes passent par le cache partagé (`docStore`) : un même jeu référencé
 * par dix événements n'est demandé qu'une fois.
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
  labelField = 'name',
) => {
  const normalizedIds = useMemo(
    () => [...new Set(ids.map(toId).filter((id): id is string => Boolean(id)))],
    [ids],
  )

  const docFor = useResolvedDocs(collection, normalizedIds, apiRoute)

  return (id: unknown): Resolved | undefined => {
    const normalized = toId(id)
    if (!normalized) return undefined

    const label = docFor(normalized)?.[labelField]
    return typeof label === 'string' && label ? { id: normalized, name: label } : undefined
  }
}
