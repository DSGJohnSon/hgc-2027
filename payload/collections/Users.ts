import type { CollectionConfig } from 'payload'

import { setDefaultMediaListView } from '../hooks/defaultMediaListView'

/**
 * Comptes d'accès au backoffice.
 *
 * Deux rôles :
 *  - `admin`   : accès total (développeur / mainteneur du site) ;
 *  - `editeur` : accès au contenu, mais ne peut ni créer ni supprimer de comptes.
 *
 * L'inscription publique est fermée : seuls les administrateurs créent des comptes.
 * Le tout premier compte se crée via `/admin` tant que la collection est vide
 * (comportement natif de Payload), ou via `npm run seed:admin`.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Utilisateur', plural: 'Utilisateurs' },
  auth: true,
  hooks: {
    // Pose la vue « Dossiers » comme affichage initial de la bibliothèque de
    // médias, sans jamais écraser un choix déjà exprimé.
    afterLogin: [setDefaultMediaListView],
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Administration',
    description: 'Comptes autorisés à se connecter au backoffice.',
  },
  access: {
    // Tout utilisateur connecté peut lire la liste (nécessaire à l'interface admin).
    read: ({ req: { user } }) => Boolean(user),
    // Seuls les admins gèrent les comptes ; un éditeur ne modifie que le sien.
    create: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => {
      if (!user) return false
      if (user.role === 'admin') return true
      return { id: { equals: user.id } }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nom',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      label: 'Rôle',
      required: true,
      defaultValue: 'editeur',
      options: [
        { label: 'Administrateur', value: 'admin' },
        { label: 'Éditeur', value: 'editeur' },
      ],
      admin: {
        description:
          'Un éditeur gère le contenu du site mais ne peut pas créer de comptes.',
      },
      access: {
        // Un éditeur ne peut pas s'auto-promouvoir.
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}

export default Users
