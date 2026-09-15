import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '../access'
import { colorField } from '../fields/color'
import { imageField } from '../fields/image'
import { slugField } from '../fields/slug'
import { CACHE_TAGS, revalidateMany, revalidateManyOnDelete } from '../hooks/revalidate'

// Les jeux sont aussi intégrés à la page d'accueil (section « À quoi tu joues ? »).
const AFFECTED_TAGS = [CACHE_TAGS.games, CACHE_TAGS.homePage]

/**
 * Référentiel des jeux — miroir de `data/games.json`.
 * Les événements et les blocs « Jeux disponibles » y font référence.
 */
export const Games: CollectionConfig = {
  slug: 'games',
  labels: { singular: 'Jeu', plural: 'Jeux' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'blockType'],
    group: 'Référentiels',
    description: 'Catalogue des jeux proposés en tournoi et en free play.',
    // Chaque card charge une page complète en <iframe> (voir GamesListView) :
    // un « Par page » à 100 chargerait 100 contextes JS/CSS simultanés.
    pagination: { defaultLimit: 10, limits: [10, 25] },
    components: {
      views: {
        // Liste en cards reproduisant l'aperçu utilisé sur les pages événements.
        list: {
          Component: '/components/admin/views/GamesListView#GamesListView',
        },
      },
    },
  },
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  hooks: {
    afterChange: [revalidateMany(AFFECTED_TAGS)],
    afterDelete: [revalidateManyOnDelete(AFFECTED_TAGS)],
  },
  fields: [
    slugField("Identifiant du jeu (ex. « fortnite »). Référencé par les événements."),
    {
      name: 'preview',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/components/admin/fields/GamePreviewField#GamePreviewField',
        },
      },
    },
    { name: 'name', type: 'text', label: 'Nom', required: true },
    {
      name: 'blockType',
      type: 'select',
      label: 'Affichage',
      required: true,
      defaultValue: 'text',
      options: [
        { label: 'Vignette illustrée', value: 'block' },
        { label: 'Texte seul', value: 'text' },
      ],
      admin: {
        description:
          'Une vignette illustrée nécessite un logo et des visuels ci-dessous.',
      },
    },
    {
      name: 'bgType',
      type: 'select',
      label: 'Type de fond',
      options: [
        { label: 'Dégradé', value: 'gradient' },
        { label: 'Couleur unie', value: 'color' },
      ],
      admin: { condition: (data) => data?.blockType === 'block' },
    },
    {
      type: 'row',
      admin: { condition: (data) => data?.blockType === 'block' },
      fields: [
        colorField({ name: 'color1', label: 'Couleur 1', placeholder: '#007cbe', admin: { width: '50%' } }),
        colorField({
          name: 'color2',
          label: 'Couleur 2',
          placeholder: '#43e2e7',
          admin: { width: '50%', condition: (data) => data?.bgType === 'gradient' },
        }),
      ],
    },
    {
      type: 'collapsible',
      label: 'Visuels',
      admin: { condition: (data) => data?.blockType === 'block' },
      fields: [
        imageField({ name: 'logo', label: 'Logo du jeu', withAlt: false, withPath: false }),
        imageField({ name: 'img', label: 'Personnages', withAlt: false, withPath: false }),
        imageField({ name: 'bgImg', label: 'Image de fond', withAlt: false, withPath: false }),
      ],
    },
  ],
}

export default Games
