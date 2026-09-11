import type {
  Field,
  GlobalConfig,
  GroupField,
  TextField,
  TextareaField,
} from 'payload'

import type { ImageData } from '@/types'
import { collectivitesContent as DEFAULTS } from '@/data/pages/collectivites'

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
 * Chaque champ porte comme valeur par défaut le contenu réellement en ligne
 * (voir `data/pages/collectivites.ts`). Conséquence utile : le backoffice
 * s'ouvre déjà rempli, et la page s'affiche correctement même tant que personne
 * n'a enregistré ce global — il n'y a donc aucun seed à lancer.
 */

/** Champ image préchargé avec le visuel actuellement en ligne. */
const image = (
  name: string,
  label: string,
  fallback: ImageData,
  description?: string,
): GroupField => ({
  ...imageField({ name, label, description }),
  defaultValue: { path: fallback.src, alt: fallback.alt },
})

const textField = (
  name: string,
  label: string,
  defaultValue: string,
  description?: string,
): TextField => ({
  name,
  type: 'text',
  label,
  defaultValue,
  admin: description ? { description } : undefined,
})

const areaField = (
  name: string,
  label: string,
  defaultValue: string,
  description?: string,
): TextareaField => ({
  name,
  type: 'textarea',
  label,
  defaultValue,
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
                textField('titleLine1', 'Titre — ligne 1', DEFAULTS.hero.titleLine1),
                textField('titleLine2', 'Titre — ligne 2', DEFAULTS.hero.titleLine2),
                {
                  type: 'row',
                  fields: [
                    {
                      ...textField(
                        'titleLine3Start',
                        'Titre — ligne 3 (début)',
                        DEFAULTS.hero.titleLine3Start,
                      ),
                      admin: { width: '50%' },
                    },
                    {
                      ...textField(
                        'titleLine3Accent',
                        'Titre — ligne 3 (en couleur)',
                        DEFAULTS.hero.titleLine3Accent,
                      ),
                      admin: {
                        width: '50%',
                        description: 'Cette partie s’affiche dans la couleur d’accent.',
                      },
                    },
                  ],
                },
                areaField('intro', 'Texte d’introduction', DEFAULTS.hero.intro),
                {
                  name: 'buttons',
                  type: 'array',
                  label: 'Boutons',
                  labels: { singular: 'Bouton', plural: 'Boutons' },
                  maxRows: 2,
                  defaultValue: DEFAULTS.hero.buttons,
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
                  defaultValue: DEFAULTS.hero.highlights.map((highlight) => ({
                    value: highlight.value,
                    label: highlight.label,
                    icon: highlight.icon
                      ? { path: highlight.icon.src, alt: highlight.icon.alt }
                      : undefined,
                  })),
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
                    imageField({
                      name: 'icon',
                      label: 'Icône (optionnelle)',
                      description:
                        'Si une icône est fournie, elle remplace la valeur chiffrée.',
                    }),
                  ],
                },
                image(
                  'backgroundImage',
                  'Image de fond',
                  DEFAULTS.hero.backgroundImage,
                  'Visuel affiché en arrière-plan du bandeau, sous un dégradé sombre.',
                ),
                {
                  name: 'sliderImages',
                  type: 'array',
                  label: 'Carrousel de photos',
                  labels: { singular: 'Photo', plural: 'Photos' },
                  defaultValue: DEFAULTS.hero.sliderImages.map((img) => ({
                    image: { path: img.src, alt: img.alt },
                  })),
                  admin: {
                    description:
                      'Bandeau de photos défilant sous le titre. Comptez au moins 4 visuels pour un défilement fluide.',
                  },
                  fields: [imageField({ name: 'image', label: 'Photo' })],
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
                textField('eyebrow', 'Surtitre', DEFAULTS.whyUs.eyebrow),
                textField('title', 'Titre', DEFAULTS.whyUs.title),
                {
                  name: 'cards',
                  type: 'array',
                  label: 'Arguments',
                  labels: { singular: 'Argument', plural: 'Arguments' },
                  defaultValue: DEFAULTS.whyUs.cards.map((card) => ({
                    image: { path: card.image.src, alt: card.image.alt },
                    titleStart: card.titleStart,
                    titleAccent: card.titleAccent,
                    text: card.text,
                    framing: card.framing,
                  })),
                  admin: {
                    description:
                      'Affichés sur une seule ligne à partir de 5 arguments ; au-delà, la grille passe à la ligne.',
                  },
                  fields: [
                    imageField({ name: 'image', label: 'Illustration' }),
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
                    {
                      name: 'framing',
                      type: 'select',
                      label: 'Cadrage de l’illustration',
                      defaultValue: 'normal',
                      options: [
                        { label: 'Normal', value: 'normal' },
                        { label: 'Réduit', value: 'reduit' },
                        { label: 'Très réduit', value: 'tresReduit' },
                      ],
                      admin: {
                        description:
                          'Ajuste le zoom de l’image dans son cadre. À régler si le sujet est mal centré après un remplacement.',
                      },
                    },
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
                textField('title', 'Titre', DEFAULTS.figures.title),
                image('backgroundImage', 'Image de fond', DEFAULTS.figures.backgroundImage),
                {
                  name: 'items',
                  type: 'array',
                  label: 'Chiffres',
                  labels: { singular: 'Chiffre', plural: 'Chiffres' },
                  defaultValue: DEFAULTS.figures.items,
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
                textField('title', 'Titre', DEFAULTS.solutions.title),
                {
                  name: 'cards',
                  type: 'array',
                  label: 'Solutions proposées',
                  labels: { singular: 'Solution', plural: 'Solutions' },
                  defaultValue: DEFAULTS.solutions.cards.map((card) => ({
                    image: { path: card.image.src, alt: card.image.alt },
                    icon: { path: card.icon.src, alt: card.icon.alt },
                    title: card.title,
                    text: card.text,
                  })),
                  fields: [
                    imageField({ name: 'image', label: 'Visuel de la carte' }),
                    imageField({
                      name: 'icon',
                      label: 'Icône',
                      description: 'Petite icône ronde en haut à gauche de la carte.',
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
                textField('eyebrow', 'Surtitre', DEFAULTS.testimonials.eyebrow),
                textField('title', 'Titre', DEFAULTS.testimonials.title),
                areaField('intro', 'Texte d’introduction', DEFAULTS.testimonials.intro),
                {
                  name: 'button',
                  type: 'group',
                  label: 'Bouton',
                  defaultValue: DEFAULTS.testimonials.button,
                  fields: buttonFields,
                },
                {
                  name: 'items',
                  type: 'array',
                  label: 'Témoignages',
                  labels: { singular: 'Témoignage', plural: 'Témoignages' },
                  defaultValue: DEFAULTS.testimonials.items.map((item) => ({
                    quote: item.quote,
                    authorLogo: {
                      path: item.authorLogo.src,
                      alt: item.authorLogo.alt,
                    },
                    authorName: item.authorName,
                    eventLabel: item.eventLabel,
                  })),
                  admin: {
                    description:
                      'Seul le premier témoignage est affiché pour le moment ; le compteur indique le total.',
                  },
                  fields: [
                    { name: 'quote', type: 'textarea', label: 'Citation', required: true },
                    imageField({ name: 'authorLogo', label: 'Logo de la collectivité' }),
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
                textField('subtitle', 'Surtitre', DEFAULTS.partners.subtitle),
                textField('title', 'Titre', DEFAULTS.partners.title),
                {
                  name: 'selection',
                  type: 'relationship',
                  relationTo: 'partners',
                  hasMany: true,
                  label: 'Partenaires affichés',
                  admin: {
                    description:
                      'Sélectionnez les partenaires dans le référentiel (Référentiels → Partenaires). Tant que rien n’est sélectionné, la liste actuellement en ligne reste affichée.',
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
                textField(
                  'title',
                  'Titre de la page',
                  DEFAULTS.seo.title ?? '',
                  'Environ 60 caractères.',
                ),
                areaField(
                  'description',
                  'Description',
                  DEFAULTS.seo.description ?? '',
                  'Environ 155 caractères.',
                ),
              ],
            },
          ],
        },
      ],
    },
  ],
}
