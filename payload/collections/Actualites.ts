import type { CollectionConfig } from 'payload'

import { anyone, isEditor } from '../access'
import { slugField } from '../fields/slug'
import { positionedImageField } from '../fields/common'
import { textContentBlocks } from '../blocks/text'
import { CACHE_TAGS, revalidateCollection, revalidateOnDelete } from '../hooks/revalidate'

/**
 * Actualités — miroir de `data/actualites.ts`.
 *
 * Le fichier d'origine gère le retrait d'une actualité en la mettant en commentaire ;
 * ici, il suffit de la repasser en brouillon, ce qui la retire du site tout en
 * conservant son contenu.
 */
export const Actualites: CollectionConfig = {
  slug: 'actualites',
  labels: { singular: 'Actualité', plural: 'Actualités' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', '_status'],
    group: 'Contenu',
    description: 'Annonces mises en avant sur la page d’accueil.',
    components: {
      views: {
        list: {
          Component: '/components/admin/views/ActualitesListView#ActualitesListView',
        },
      },
    },
  },
  access: { read: anyone, create: isEditor, update: isEditor, delete: isEditor },
  hooks: {
    afterChange: [revalidateCollection(CACHE_TAGS.actualites)],
    afterDelete: [revalidateOnDelete(CACHE_TAGS.actualites)],
  },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: '-date',
  fields: [
    slugField('Identifiant de l’actualité.'),
    {
      name: 'date',
      type: 'date',
      label: 'Date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'preview',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/components/admin/fields/ActualitePreviewField#ActualitePreviewField',
        },
      },
    },
    { name: 'title', type: 'text', label: 'Titre', required: true },
    { name: 'subtitle', type: 'text', label: 'Sous-titre' },
    {
      name: 'content',
      type: 'blocks',
      label: 'Contenu',
      labels: { singular: 'Bloc', plural: 'Blocs' },
      blocks: textContentBlocks,
    },
    positionedImageField('image', 'Illustration', false),
    {
      name: 'cta',
      type: 'group',
      label: 'Bouton d’action',
      admin: { description: 'Facultatif — laissez le libellé vide pour ne rien afficher.' },
      fields: [
        { name: 'label', type: 'text', label: 'Libellé' },
        {
          name: 'type',
          type: 'select',
          label: 'Type',
          defaultValue: 'standard',
          options: [
            { label: 'Lien simple', value: 'standard' },
            { label: 'Billetterie Weezevent', value: 'weezevent' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'Lien',
          admin: { condition: (_, siblingData) => siblingData?.type === 'standard' },
        },
        {
          name: 'isExternal',
          type: 'checkbox',
          label: 'Ouvrir dans un nouvel onglet',
          defaultValue: false,
          admin: { condition: (_, siblingData) => siblingData?.type === 'standard' },
        },
        {
          name: 'weezeventCode',
          type: 'textarea',
          label: 'Code d’intégration Weezevent',
          admin: { condition: (_, siblingData) => siblingData?.type === 'weezevent' },
        },
      ],
    },
  ],
}

export default Actualites
