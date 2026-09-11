import type { CollectionAfterLoginHook } from 'payload'

/**
 * Affiche la bibliothèque de médias en vue « Dossiers » par défaut.
 *
 * Payload sait déjà le faire : dans `getRouteData`, `/admin/collections/media`
 * rend la vue par dossier — sans redirection ni changement d'URL — dès que la
 * préférence `listViewType` de l'utilisateur vaut `folders`. Cette préférence est
 * écrite quand on clique sur l'onglet « Dossiers ». Il ne manque donc qu'une
 * valeur initiale, que ce hook pose à la première connexion.
 *
 * On passe volontairement par la préférence plutôt que par une redirection ou un
 * remplacement de vue : ces deux approches rendraient l'onglet « Liste »
 * inopérant, puisqu'il renvoie précisément vers l'URL qu'on aurait détournée.
 * Ici les deux onglets restent fonctionnels et le choix de l'utilisateur, une
 * fois exprimé, est respecté — ce hook ne touche plus à rien.
 */

const PREFERENCE_KEY = 'collection-media'
const PREFERENCES_COLLECTION = 'payload-preferences'

export const setDefaultMediaListView: CollectionAfterLoginHook = async ({ req, user }) => {
  try {
    const existing = await req.payload.find({
      collection: PREFERENCES_COLLECTION,
      where: {
        and: [
          { key: { equals: PREFERENCE_KEY } },
          { 'user.value': { equals: user.id } },
          { 'user.relationTo': { equals: 'users' } },
        ],
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const current = existing.docs[0] as
      | { id: string; value?: Record<string, unknown> }
      | undefined

    // Choix déjà exprimé — vue liste comme vue dossiers : on n'y touche pas.
    if (current?.value?.listViewType) return

    // Les autres préférences de la collection (tri, pagination, vue d'édition)
    // sont conservées : on ne fait qu'ajouter la clé manquante.
    const value = { ...(current?.value ?? {}), listViewType: 'folders' }

    // Le champ `user` de la collection des préférences n'est jamais fourni par
    // l'appelant : un `beforeValidate` interne le dérive systématiquement de
    // `req.user`. C'est utilisable ici car l'opération de connexion affecte
    // `req.user` juste avant d'exécuter les hooks `afterLogin` — d'où le passage
    // explicite de `req` à chaque écriture.
    if (current) {
      await req.payload.update({
        collection: PREFERENCES_COLLECTION,
        id: current.id,
        data: { value },
        req,
        overrideAccess: true,
      })
    } else {
      await req.payload.create({
        collection: PREFERENCES_COLLECTION,
        data: {
          key: PREFERENCE_KEY,
          // Obligatoire pour les types générés, mais sans effet : le
          // `beforeValidate` du champ réécrit systématiquement cette valeur à
          // partir de `req.user`.
          user: { relationTo: 'users', value: user.id },
          value,
        },
        req,
        overrideAccess: true,
      })
    }
  } catch (error) {
    // Une préférence d'affichage ne vaut pas de faire échouer une connexion.
    req.payload.logger.error(
      { err: error },
      'Vue par dossier par défaut : préférence non appliquée.',
    )
  }
}
