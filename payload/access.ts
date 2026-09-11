import type { Access } from 'payload'

/** Lecture publique : le site public interroge Payload via la Local API. */
export const anyone: Access = () => true

/** Réservé aux comptes connectés (éditeur ou administrateur). */
export const isEditor: Access = ({ req: { user } }) => Boolean(user)

/** Réservé aux administrateurs. */
export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'
