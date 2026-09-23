'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'

/**
 * Cache partagé des documents résolus à la volée par les vues d'admin custom.
 *
 * Les listes et les aperçus s'exécutent en `depth: 0` : une image ou une relation
 * n'y arrive que sous forme d'identifiant. Chaque vue doit donc compléter ce
 * qui lui manque par un appel à l'API — et c'est là que la charge dérape si
 * chaque composant interroge l'API de son côté.
 *
 * Ce module place un cache unique, partagé par tous les hooks, entre les vues et
 * l'API. Il apporte trois choses :
 *
 *  1. **Un identifiant n'est demandé qu'une fois** par session, quel que soit le
 *     nombre de composants qui en ont besoin — y compris en revenant sur une
 *     liste déjà consultée.
 *  2. **Les demandes émises dans le même cycle sont regroupées** en une seule
 *     requête. Un formulaire de jeu, qui résout trois images (logo, visuel,
 *     fond), passait par trois appels ; il n'en fait plus qu'un.
 *  3. **Un identifiant introuvable n'est jamais redemandé.** C'est ce qui corrige
 *     la boucle décrite plus bas.
 *
 * ⚠️ Boucle de requêtes corrigée ici. Les hooks recalculaient la liste des
 * identifiants manquants à partir de leur propre état, que la réponse mettait à
 * jour — en renvoyant systématiquement un objet neuf, même quand rien n'avait
 * été résolu. Un média supprimé mais encore référencé suffisait donc à
 * enchaîner : requête → nouvel état → nouvelle liste → requête… sans fin, tant
 * que l'onglet restait ouvert. Chaque tour consommait une fonction serverless et
 * une requête Mongo. En mémorisant les identifiants **déjà demandés** plutôt que
 * les seuls identifiants **résolus**, la question ne se repose pas.
 */

type Doc = Record<string, unknown> & { id: string }

type Store = {
  /** Documents résolus, par identifiant. */
  docs: Map<string, Doc>
  /** Identifiants déjà demandés — résolus ou non. Ne sont jamais redemandés. */
  attempted: Set<string>
  /** Identifiants en attente du prochain regroupement. */
  queue: Set<string>
  flushTimer: ReturnType<typeof setTimeout> | null
  listeners: Set<() => void>
  /** Incrémenté à chaque arrivée de données : sert d'instantané à React. */
  version: number
}

const stores = new Map<string, Store>()

const getStore = (collection: string): Store => {
  let store = stores.get(collection)
  if (!store) {
    store = {
      docs: new Map(),
      attempted: new Set(),
      queue: new Set(),
      flushTimer: null,
      listeners: new Set(),
      version: 0,
    }
    stores.set(collection, store)
  }
  return store
}

const notify = (store: Store) => {
  store.version += 1
  for (const listener of store.listeners) listener()
}

/**
 * Nombre d'identifiants par requête. Au-delà, l'URL deviendrait déraisonnable —
 * chaque identifiant y occupe une paire `where[id][in][]=…`.
 */
const BATCH_SIZE = 50

/**
 * Récupère un lot. Renvoie `false` si la requête n'a pas abouti, pour que les
 * identifiants concernés restent redemandables.
 */
const fetchBatch = async (
  collection: string,
  apiRoute: string,
  ids: string[],
): Promise<boolean> => {
  const query = ids.map((id) => `where[id][in][]=${encodeURIComponent(id)}`).join('&')

  try {
    // URL relative : le backoffice et l'API sont servis par la même application.
    // Une URL absolue bâtie sur `serverURL` partirait vers le domaine de
    // production depuis une préproduction — donc en cross-origin, sans cookie.
    const response = await fetch(
      `${apiRoute}/${collection}?depth=0&limit=${ids.length}&${query}`,
      { credentials: 'include' },
    )
    if (!response.ok) return false

    const body = (await response.json()) as { docs?: Doc[] }
    const store = getStore(collection)
    for (const doc of body.docs ?? []) {
      if (doc?.id) store.docs.set(String(doc.id), doc)
    }
    return true
  } catch {
    return false
  }
}

const flush = async (collection: string, apiRoute: string) => {
  const store = getStore(collection)
  store.flushTimer = null

  const ids = [...store.queue]
  store.queue.clear()
  if (ids.length === 0) return

  const batches: string[][] = []
  for (let index = 0; index < ids.length; index += BATCH_SIZE) {
    batches.push(ids.slice(index, index + BATCH_SIZE))
  }

  const results = await Promise.all(
    batches.map(async (batch) => ({ batch, ok: await fetchBatch(collection, apiRoute, batch) })),
  )

  // Un échec de transport (réseau coupé, 500) n'est pas une réponse : on rend
  // ces identifiants redemandables par un prochain montage. Une réponse valide
  // ne listant pas un document est en revanche définitive — le document n'existe
  // pas, insister ne changerait rien.
  for (const { batch, ok } of results) {
    if (!ok) for (const id of batch) store.attempted.delete(id)
  }

  notify(store)
}

const request = (collection: string, apiRoute: string, ids: string[]) => {
  const store = getStore(collection)

  let queued = false
  for (const id of ids) {
    if (store.attempted.has(id)) continue
    // Marqué avant l'envoi : deux composants montés ensemble demandent le même
    // identifiant, il ne part qu'une fois.
    store.attempted.add(id)
    store.queue.add(id)
    queued = true
  }

  if (!queued || store.flushTimer) return

  // Délai nul : laisse les effets du même rendu s'enregistrer avant l'envoi,
  // ce qui est précisément ce qui regroupe leurs demandes en une requête.
  store.flushTimer = setTimeout(() => void flush(collection, apiRoute), 0)
}

/**
 * Donne accès aux documents d'une collection par identifiant, en demandant ceux
 * qui manquent. Renvoie un accesseur, dont l'identité change à chaque arrivée de
 * données — les `useMemo` qui en dépendent se recalculent donc au bon moment.
 */
export const useResolvedDocs = (collection: string, ids: string[], apiRoute: string) => {
  const store = getStore(collection)

  const subscribe = useCallback(
    (listener: () => void) => {
      store.listeners.add(listener)
      return () => {
        store.listeners.delete(listener)
      }
    },
    [store],
  )

  const version = useSyncExternalStore(
    subscribe,
    () => store.version,
    // Rendu serveur : le cache est vide et aucune requête n'est émise.
    () => 0,
  )

  // `ids` est un tableau reconstruit à chaque rendu : c'est son contenu qui doit
  // piloter l'effet, pas son identité.
  const key = ids.join(',')

  useEffect(() => {
    if (key.length > 0) request(collection, apiRoute, key.split(','))
  }, [collection, apiRoute, key])

  return useCallback(
    (id: string): Doc | undefined => store.docs.get(id),
    // `version` est volontairement dans les dépendances : l'accesseur lit le
    // cache en direct, donc sans lui son identité ne changerait jamais et les
    // `useMemo` des appelants garderaient une vignette vide après la réponse.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store, version],
  )
}
