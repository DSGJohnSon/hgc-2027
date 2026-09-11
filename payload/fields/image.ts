import type { Field, GroupField } from 'payload'

type ImageFieldOptions = {
  /** Nom du champ dans le document. */
  name?: string
  label?: string
  /** Rend l'image obligatoire côté admin (au moins un upload ou un chemin). */
  required?: boolean
  /** Ajoute un champ `alt` propre à cet emplacement. */
  withAlt?: boolean
  /**
   * Garde le champ `path` (chemin historique `/assets/...`), pour les
   * collections dont le contenu n'est pas encore entièrement migré vers la
   * bibliothèque média. À désactiver une fois la migration d'une collection
   * terminée — voir Games.ts.
   */
  withPath?: boolean
  description?: string
}

/**
 * Champ image réutilisable.
 *
 * Deux sources possibles, dans cet ordre de priorité :
 *  1. `media` — un fichier envoyé par l'administrateur (collection `media`) ;
 *  2. `path`  — un chemin historique vers `public/assets/...`, hérité des fichiers `data/`.
 *
 * Ce double mécanisme permet de migrer le contenu sans avoir à ré-uploader les
 * ~312 Mo d'images déjà versionnées : elles gardent leur chemin, et le client les
 * remplace une par une en envoyant un fichier quand il en a besoin.
 *
 * Côté rendu, `resolveImage()` (lib/content/mappers/image.ts) renvoie une simple
 * chaîne `src`, donc les composants du site ne changent pas.
 */
export const imageField = ({
  name = 'image',
  label = 'Image',
  required = false,
  withAlt = true,
  withPath = true,
  description,
}: ImageFieldOptions = {}): GroupField => {
  const fields: Field[] = [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      label: 'Fichier',
      admin: {
        description: withPath
          ? "Envoyez une image pour remplacer celle d'origine."
          : undefined,
      },
    },
  ]

  if (withPath) {
    fields.push({
      name: 'path',
      type: 'text',
      label: 'Chemin historique',
      admin: {
        description:
          "Image d'origine du site (/assets/...). Ignorée dès qu'un fichier est envoyé ci-dessus.",
        readOnly: true,
      },
    })
  }

  if (withAlt) {
    fields.push({
      name: 'alt',
      type: 'text',
      label: 'Texte alternatif',
      admin: {
        description: "Décrit l'image pour l'accessibilité et le référencement.",
      },
    })
  }

  return {
    name,
    type: 'group',
    label,
    admin: { description },
    fields,
    validate: required
      ? (value: unknown) => {
          const v = value as { media?: unknown; path?: string } | undefined
          if (v?.media || (withPath && v?.path)) return true
          return withPath
            ? 'Renseignez une image (fichier envoyé ou chemin historique).'
            : 'Envoyez une image.'
        }
      : undefined,
  }
}

/** Variante liste : une galerie d'images partageant la même structure. */
export const imageArrayField = (
  name = 'images',
  label = 'Images',
): Field => ({
  name,
  type: 'array',
  label,
  labels: { singular: 'Image', plural: 'Images' },
  fields: [imageField({ name: 'image', withAlt: true })],
})
