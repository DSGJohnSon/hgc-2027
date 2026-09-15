import type { Field, GlobalConfig, TextField, TextareaField } from 'payload'

import { anyone, isEditor } from '../access'
import { imageField } from '../fields/image'
import { CACHE_TAGS, revalidateGlobal } from '../hooks/revalidate'

/**
 * Page d'accueil « joueurs » (/).
 *
 * Même principe que la page collectivités : la mise en page est dessinée et
 * fixe, seuls varient les textes, les images et le nombre d'éléments dans les
 * listes. Les événements affichés en tête de page ne sont pas saisis ici, ils
 * viennent de leur collection.
 *
 * Les images sont uniquement envoyées via la bibliothèque média : plus aucun
 * champ ne propose de repli sur un chemin historique (`/new-assets/...`).
 *
 * Aucun contenu n'est préchargé depuis le code : le contenu en ligne a été
 * transféré une fois par `npm run seed -- --only=home`.
 */

const textField = (name: string, label: string, description?: string): TextField => ({
  name,
  type: 'text',
  label,
  admin: description ? { description } : undefined,
})

const areaField = (name: string, label: string, description?: string): TextareaField => ({
  name,
  type: 'textarea',
  label,
  admin: description ? { description } : undefined,
})

/** Libellé + lien d'un bouton. */
const buttonFields: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'label', type: 'text', label: 'Libellé', required: true, admin: { width: '50%' } },
      { name: 'href', type: 'text', label: 'Lien', required: true, admin: { width: '50%' } },
    ],
  },
]

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Page Accueil',
  admin: {
    group: 'Pages',
    description: 'Textes et images de la page d’accueil destinée aux joueurs (/).',
  },
  access: { read: anyone, update: isEditor },
  hooks: { afterChange: [revalidateGlobal(CACHE_TAGS.homePage)] },
  versions: { drafts: true, max: 20 },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ----------------------------------------------------------- hero
        {
          label: 'Bandeau principal',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: false,
              fields: [
                textField(
                  'subtitle',
                  'Surtitre',
                  'Texte animé au-dessus du titre. Les espaces sont conservés.',
                ),
                textField('titleLine1', 'Titre — ligne 1'),
                {
                  ...textField('titleLine2', 'Titre — ligne 2'),
                  admin: { description: 'Affichée plus grande, dans la couleur d’accent.' },
                },
                {
                  name: 'buttons',
                  type: 'array',
                  label: 'Boutons',
                  labels: { singular: 'Bouton', plural: 'Boutons' },
                  maxRows: 2,
                  admin: {
                    description:
                      'Le premier bouton est mis en avant, le second est secondaire.',
                  },
                  fields: buttonFields,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      ...textField('totalParticipants', 'Nombre de participants'),
                      admin: { width: '50%', description: 'Ex. « 80.000 ».' },
                    },
                    {
                      name: 'participantsSince',
                      type: 'number',
                      label: 'Depuis l’année',
                      admin: {
                        width: '50%',
                        description: 'Affiché dans « visiteurs/participants depuis … ».',
                      },
                    },
                  ],
                },
                // Visuel désormais uniquement envoyé via la bibliothèque média :
                // pas de repli sur un chemin historique pour ce bandeau.
                imageField({
                  name: 'backgroundImage',
                  label: 'Image de fond',
                  description: 'Visuel très atténué, affiché en haut du bandeau.',
                  withPath: false,
                }),
              ],
            },
          ],
        },

        // -------------------------------------------------- gaming spaces
        {
          label: 'Espaces gaming',
          fields: [
            {
              name: 'gamingSpaces',
              type: 'group',
              label: false,
              fields: [
                textField('eyebrow', 'Surtitre'),
                textField('title', 'Titre'),
                {
                  name: 'cards',
                  type: 'array',
                  label: 'Espaces',
                  labels: { singular: 'Espace', plural: 'Espaces' },
                  admin: { description: 'Affichés par 3 sur une ligne à partir de la tablette.' },
                  fields: [
                    // Visuels désormais uniquement envoyés via la bibliothèque média :
                    // pas de repli sur un chemin historique pour ces cartes.
                    imageField({ name: 'logo', label: 'Logo de l’espace', withPath: false }),
                    imageField({
                      name: 'backgroundImage',
                      label: 'Image de fond',
                      description: 'Affichée en transparence derrière le logo.',
                      withPath: false,
                    }),
                    { name: 'text', type: 'text', label: 'Accroche', required: true },
                    {
                      name: 'unavailable',
                      type: 'checkbox',
                      label: 'Indisponible pour le moment',
                      defaultValue: false,
                      admin: {
                        description:
                          'La carte reste affichée, mais grisée et accompagnée de la mention « Indisponible pour le moment ».',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ---------------------------------------------------------- games
        {
          label: 'Jeux',
          fields: [
            {
              name: 'games',
              type: 'group',
              label: false,
              fields: [
                textField('title', 'Titre'),
                areaField('intro', 'Texte d’introduction'),
                {
                  name: 'selection',
                  type: 'relationship',
                  relationTo: 'games',
                  hasMany: true,
                  label: 'Jeux affichés',
                  admin: {
                    description:
                      'Sélectionnez les jeux dans le référentiel (Référentiels → Jeux), dans l’ordre d’affichage. Chaque carte mène aux événements filtrés sur ce jeu.',
                  },
                },
              ],
            },
          ],
        },

        // --------------------------------------------------- how it works
        {
          label: 'Comment ça marche',
          fields: [
            {
              name: 'howItWorks',
              type: 'group',
              label: false,
              fields: [
                textField('title', 'Titre'),
                {
                  name: 'steps',
                  type: 'array',
                  label: 'Étapes',
                  labels: { singular: 'Étape', plural: 'Étapes' },
                  fields: [
                    // Icône désormais uniquement envoyée via la bibliothèque média :
                    // pas de repli sur un chemin historique pour ces étapes.
                    imageField({
                      name: 'icon',
                      label: 'Icône (optionnelle)',
                      description:
                        'Sans icône, un pictogramme calendrier est affiché. Privilégiez une icône blanche.',
                      withPath: false,
                    }),
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Titre',
                      required: true,
                      admin: { description: 'Numéro compris, ex. « 1. Choisis ton event ».' },
                    },
                    { name: 'text', type: 'textarea', label: 'Description', required: true },
                  ],
                },
              ],
            },
          ],
        },

        // ------------------------------------------------------- why join
        {
          label: 'Pourquoi nous rejoindre',
          fields: [
            {
              name: 'whyJoin',
              type: 'group',
              label: false,
              fields: [
                textField('title', 'Titre'),
                {
                  name: 'cards',
                  type: 'array',
                  label: 'Arguments',
                  labels: { singular: 'Argument', plural: 'Arguments' },
                  admin: { description: 'Affichés par 4 sur une ligne sur PC.' },
                  fields: [
                    // Illustrations désormais uniquement envoyées via la bibliothèque média :
                    // pas de repli sur un chemin historique pour ces arguments.
                    {
                      type: 'row',
                      fields: [
                        {
                          ...imageField({
                            name: 'image',
                            label: 'Illustration au repos',
                            description: 'Visible sur PC uniquement, avant le survol.',
                            withPath: false,
                          }),
                          admin: {
                            width: '50%',
                            description: 'Visible sur PC uniquement, avant le survol.',
                          },
                        },
                        {
                          ...imageField({
                            name: 'hoverImage',
                            label: 'Illustration au survol',
                            description: 'Seule illustration affichée sur mobile.',
                            withPath: false,
                          }),
                          admin: {
                            width: '50%',
                            description: 'Seule illustration affichée sur mobile.',
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'titleStart',
                          type: 'text',
                          label: 'Titre (début)',
                          required: true,
                          admin: { width: '50%' },
                        },
                        {
                          name: 'titleAccent',
                          type: 'text',
                          label: 'Titre (en couleur)',
                          required: true,
                          admin: { width: '50%' },
                        },
                      ],
                    },
                    { name: 'text', type: 'textarea', label: 'Description', required: true },
                  ],
                },
              ],
            },
          ],
        },

        // -------------------------------------------------------- figures
        {
          label: 'Chiffres clés',
          fields: [
            {
              name: 'figures',
              type: 'group',
              label: false,
              fields: [
                textField('title', 'Titre'),
                // Visuels désormais uniquement envoyés via la bibliothèque média :
                // pas de repli sur un chemin historique pour cette section.
                imageField({
                  name: 'logo',
                  label: 'Logo',
                  description: 'Affiché en première position, devant les chiffres.',
                  withPath: false,
                }),
                imageField({ name: 'backgroundImage', label: 'Image de fond', withPath: false }),
                {
                  name: 'items',
                  type: 'array',
                  label: 'Chiffres',
                  labels: { singular: 'Chiffre', plural: 'Chiffres' },
                  admin: {
                    description:
                      'Chaque chiffre est animé au défilement, de 0 jusqu’à la valeur indiquée.',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'value',
                          type: 'number',
                          label: 'Valeur',
                          required: true,
                          admin: { width: '50%' },
                        },
                        {
                          name: 'decimals',
                          type: 'number',
                          label: 'Décimales',
                          defaultValue: 0,
                          min: 0,
                          max: 2,
                          admin: {
                            width: '50%',
                            description: 'Ex. 1 pour afficher « 10,3 ».',
                          },
                        },
                      ],
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'prefix',
                          type: 'text',
                          label: 'Préfixe',
                          admin: { width: '50%', description: 'Ex. « + de ».' },
                        },
                        {
                          name: 'suffix',
                          type: 'text',
                          label: 'Suffixe',
                          admin: { width: '50%', description: 'Ex. « k » ou « k€ ».' },
                        },
                      ],
                    },
                    { name: 'label', type: 'text', label: 'Libellé', required: true },
                  ],
                },
              ],
            },
          ],
        },

        // ------------------------------------------------------ community
        {
          label: 'Communauté',
          fields: [
            {
              name: 'community',
              type: 'group',
              label: false,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { ...textField('title', 'Titre'), admin: { width: '50%' } },
                    {
                      ...textField('accent', 'Mot en très grand'),
                      admin: { width: '50%', description: 'Ex. « HGC ».' },
                    },
                  ],
                },
                areaField('text', 'Texte'),
                // Visuels désormais uniquement envoyés via la bibliothèque média :
                // pas de repli sur un chemin historique pour cette section.
                imageField({
                  name: 'photo',
                  label: 'Photo',
                  description: 'Détourée, affichée à droite sur PC et sous le texte sur mobile.',
                  withPath: false,
                }),
                imageField({ name: 'backgroundImage', label: 'Image de fond', withPath: false }),
                {
                  name: 'socials',
                  type: 'array',
                  label: 'Réseaux sociaux',
                  labels: { singular: 'Réseau', plural: 'Réseaux' },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'network',
                          type: 'select',
                          label: 'Réseau',
                          required: true,
                          options: [
                            { label: 'Discord', value: 'discord' },
                            { label: 'Instagram', value: 'instagram' },
                            { label: 'Facebook', value: 'facebook' },
                            { label: 'TikTok', value: 'tiktok' },
                            { label: 'YouTube', value: 'youtube' },
                          ],
                          admin: { width: '30%' },
                        },
                        {
                          name: 'url',
                          type: 'text',
                          label: 'Lien',
                          required: true,
                          admin: { width: '70%' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ------------------------------------------------------------ cta
        {
          label: 'Appel à l’action',
          fields: [
            {
              name: 'cta',
              type: 'group',
              label: false,
              fields: [
                textField('titleAccent', 'Titre (en couleur)'),
                textField('title', 'Titre'),
                {
                  name: 'button',
                  type: 'group',
                  label: 'Bouton',
                  fields: buttonFields,
                },
              ],
            },
          ],
        },

        // ------------------------------------------------------- partners
        {
          label: 'Partenaires',
          fields: [
            {
              name: 'partners',
              type: 'group',
              label: false,
              fields: [
                textField('subtitle', 'Surtitre'),
                textField('title', 'Titre'),
                {
                  name: 'selection',
                  type: 'relationship',
                  relationTo: 'partners',
                  hasMany: true,
                  label: 'Partenaires affichés',
                  admin: {
                    description:
                      'Sélectionnez les partenaires dans le référentiel (Référentiels → Partenaires). Seuls ceux dont le logo a été envoyé apparaissent sur la page.',
                  },
                },
              ],
            },
          ],
        },

        // ------------------------------------------------------------ seo
        {
          label: 'Référencement',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: 'Métadonnées',
              admin: {
                description:
                  'Titre et description affichés par Google et lors du partage sur les réseaux sociaux.',
              },
              fields: [
                textField('title', 'Titre de la page', 'Environ 60 caractères.'),
                areaField('description', 'Description', 'Environ 155 caractères.'),
              ],
            },
          ],
        },
      ],
    },
  ],
}
