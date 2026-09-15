import type { Field, GlobalConfig, TextField, TextareaField } from 'payload'

import { anyone, isEditor } from '../access'
import { imageField } from '../fields/image'
import { CACHE_TAGS, revalidateGlobal } from '../hooks/revalidate'

/**
 * Page d'accueil « collectivités ».
 *
 * Contrairement aux anciennes pages éditoriales, ce global n'est **pas** un
 * tableau de blocs réordonnables : la mise en page de cette landing est dessinée
 * et fixe. Seuls varient les textes, les images et le nombre d'éléments dans les
 * listes (cartes, chiffres, visuels du carrousel).
 *
 * Aucun contenu n'est préchargé depuis le code : tout ce qui s'affiche sur la
 * page est saisi ici. Un champ laissé vide reste vide en ligne, ce qui rend
 * tout oubli visible immédiatement.
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

export const CollectivitesPage: GlobalConfig = {
  slug: 'collectivites-page',
  label: 'Page Collectivités',
  admin: {
    group: 'Pages',
    description:
      'Textes et images de la page d’accueil destinée aux collectivités (/collectivites).',
  },
  access: { read: anyone, update: isEditor },
  hooks: { afterChange: [revalidateGlobal(CACHE_TAGS.collectivitesPage)] },
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
                textField('titleLine1', 'Titre — ligne 1'),
                textField('titleLine2', 'Titre — ligne 2'),
                {
                  type: 'row',
                  fields: [
                    {
                      ...textField('titleLine3Start', 'Titre — ligne 3 (début)'),
                      admin: { width: '50%' },
                    },
                    {
                      ...textField('titleLine3Accent', 'Titre — ligne 3 (en couleur)'),
                      admin: {
                        width: '50%',
                        description: 'Cette partie s’affiche dans la couleur d’accent.',
                      },
                    },
                  ],
                },
                areaField('intro', 'Texte d’introduction'),
                // Visuel désormais uniquement envoyé via la bibliothèque média :
                // pas de repli sur un chemin historique pour ce bandeau.
                imageField({
                  name: 'backgroundImage',
                  label: 'Image de fond',
                  description:
                    'Visuel affiché en arrière-plan du bandeau, sous un dégradé sombre.',
                  withPath: false,
                }),
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
                  name: 'highlights',
                  type: 'array',
                  label: 'Encart chiffré',
                  labels: { singular: 'Encart', plural: 'Encarts' },
                  admin: {
                    description:
                      'Bloc coloré à droite du titre. Renseignez soit une valeur, soit une icône.',
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'value',
                          type: 'text',
                          label: 'Valeur',
                          admin: {
                            width: '50%',
                            description: 'Ex. « + de 5 ans ». Laissez vide si vous mettez une icône.',
                          },
                        },
                        {
                          name: 'label',
                          type: 'textarea',
                          label: 'Libellé',
                          required: true,
                          admin: {
                            width: '50%',
                            description: 'Les retours à la ligne sont conservés.',
                          },
                        },
                      ],
                    },
                    // Icône désormais uniquement envoyée via la bibliothèque média :
                    // pas de repli sur un chemin historique pour ces encarts.
                    imageField({
                      name: 'icon',
                      label: 'Icône (optionnelle)',
                      description:
                        'Si une icône est fournie, elle remplace la valeur chiffrée.',
                      withPath: false,
                    }),
                  ],
                },
                {
                  name: 'sliderImages',
                  type: 'array',
                  label: 'Carrousel de photos',
                  labels: { singular: 'Photo', plural: 'Photos' },
                  admin: {
                    description:
                      'Bandeau de photos défilant sous le titre. Comptez au moins 4 visuels pour un défilement fluide.',
                  },
                  // Photos désormais uniquement envoyées via la bibliothèque média :
                  // pas de repli sur un chemin historique pour ce carrousel.
                  fields: [imageField({ name: 'image', label: 'Photo', withPath: false })],
                },
              ],
            },
          ],
        },

        // -------------------------------------------------------- why us
        {
          label: 'Pourquoi nous',
          fields: [
            {
              name: 'whyUs',
              type: 'group',
              label: false,
              fields: [
                textField('eyebrow', 'Surtitre'),
                textField('title', 'Titre'),
                {
                  name: 'cards',
                  type: 'array',
                  label: 'Arguments',
                  labels: { singular: 'Argument', plural: 'Arguments' },
                  admin: {
                    description:
                      'Affichés sur une seule ligne à partir de 5 arguments ; au-delà, la grille passe à la ligne.',
                  },
                  fields: [
                    // Illustrations désormais uniquement envoyées via la bibliothèque média :
                    // pas de repli sur un chemin historique pour cette section.
                    imageField({ name: 'image', label: 'Illustration', withPath: false }),
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

        // ------------------------------------------------------- figures
        {
          label: 'Chiffres clés',
          fields: [
            {
              name: 'figures',
              type: 'group',
              label: false,
              fields: [
                textField('title', 'Titre'),
                // Visuel désormais uniquement envoyé via la bibliothèque média :
                // pas de repli sur un chemin historique pour cette section.
                imageField({
                  name: 'backgroundImage',
                  label: 'Image de fond',
                  withPath: false,
                }),
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

        // ----------------------------------------------------- solutions
        {
          label: 'Solutions',
          fields: [
            {
              name: 'solutions',
              type: 'group',
              label: false,
              fields: [
                textField('title', 'Titre'),
                {
                  name: 'cards',
                  type: 'array',
                  label: 'Solutions proposées',
                  labels: { singular: 'Solution', plural: 'Solutions' },
                  fields: [
                    // Visuels désormais uniquement envoyés via la bibliothèque média :
                    // pas de repli sur un chemin historique pour cette section.
                    imageField({ name: 'image', label: 'Visuel de la carte', withPath: false }),
                    imageField({
                      name: 'icon',
                      label: 'Icône',
                      description: 'Petite icône ronde en haut à gauche de la carte.',
                      withPath: false,
                    }),
                    { name: 'title', type: 'text', label: 'Titre', required: true },
                    { name: 'text', type: 'textarea', label: 'Description', required: true },
                  ],
                },
              ],
            },
          ],
        },

        // -------------------------------------------------- testimonials
        {
          label: 'Témoignages',
          fields: [
            {
              name: 'testimonials',
              type: 'group',
              label: false,
              fields: [
                textField('eyebrow', 'Surtitre'),
                textField('title', 'Titre'),
                areaField('intro', 'Texte d’introduction'),
                {
                  name: 'button',
                  type: 'group',
                  label: 'Bouton',
                  fields: buttonFields,
                },
                {
                  name: 'items',
                  type: 'array',
                  label: 'Témoignages',
                  labels: { singular: 'Témoignage', plural: 'Témoignages' },
                  admin: {
                    description:
                      'Seul le premier témoignage est affiché pour le moment ; le compteur indique le total.',
                  },
                  fields: [
                    { name: 'quote', type: 'textarea', label: 'Citation', required: true },
                    // Le logo n'est plus ressaisi ici : on pointe la collectivité dans le
                    // référentiel, et son logo suit automatiquement s'il y change.
                    {
                      name: 'partner',
                      type: 'relationship',
                      relationTo: 'partners',
                      label: 'Logo de la collectivité',
                      admin: {
                        description:
                          'Choisissez la collectivité dans le référentiel (Référentiels → Partenaires). Son logo et son nom servent de visuel et de texte alternatif ; tant qu’aucune n’est choisie, le témoignage s’affiche sans logo.',
                      },
                    },
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'authorName',
                          type: 'text',
                          label: 'Nom',
                          required: true,
                          admin: { width: '50%' },
                        },
                        {
                          name: 'eventLabel',
                          type: 'text',
                          label: 'Événement concerné',
                          admin: { width: '50%' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ------------------------------------------------------ partners
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

        // ----------------------------------------------------------- seo
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
