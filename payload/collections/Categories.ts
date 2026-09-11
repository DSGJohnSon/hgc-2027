import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '../access'
import { colorField } from '../fields/color'
import { slugField } from '../fields/slug'
import { CACHE_TAGS, revalidateCollection, revalidateOnDelete } from '../hooks/revalidate'

/**
 * Référentiel des catégories d'événements — miroir de `data/categories.json`.
 * Les identifiants servent aussi de filtres dans les URLs (`/evenements?category=...`).
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Catégorie', plural: 'Catégories' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Référentiels',
    description: "Familles d'événements (Gaming House Tour, FIFA Season…).",
  },
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  hooks: {
    afterChange: [revalidateCollection(CACHE_TAGS.categories)],
    afterDelete: [revalidateOnDelete(CACHE_TAGS.categories)],
  },
  fields: [
    slugField(
      "Identifiant de la catégorie (ex. « gamingHouseTour »). Utilisé dans les filtres d'URL.",
    ),
    { name: 'name', type: 'text', label: 'Nom', required: true },
    colorField(),
  ],
}

export default Categories
