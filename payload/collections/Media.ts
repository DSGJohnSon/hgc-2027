import type { CollectionConfig } from 'payload'

import { isEditor } from '../access'
import { setDefaultMediaFolder } from '../hooks/defaultMediaFolder'

/**
 * Bibliothèque de médias.
 *
 * Reçoit les images envoyées depuis le backoffice. Les images historiques du site
 * restent dans `public/assets` et sont référencées par leur chemin (voir
 * `payload/fields/image.ts`) : la migration se fait donc image par image, sans
 * ré-upload massif.
 *
 * Stockage : Vercel Blob si `BLOB_READ_WRITE_TOKEN` est défini, sinon
 * `public/media` en local (voir payload.config.ts).
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médias' },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    group: 'Administration',
    description: 'Images et fichiers utilisés dans le contenu du site.',
  },
  access: {
    read: () => true,
    create: isEditor,
    update: isEditor,
    delete: isEditor,
  },
  /**
   * Range­ment en dossiers et sous-dossiers, avec bascule grille / liste.
   *
   * Fonctionnalité native de Payload : elle ajoute un champ `folder` aux médias
   * et une collection technique `payload-folders` qui porte l'arborescence. Les
   * dossiers peuvent en contenir d'autres, sans limite de profondeur.
   *
   * ⚠️ Marquée expérimentale par Payload (« may change in minor versions until
   * it is fully stable »). Le projet est épinglé en 3.82.1, donc sans risque
   * immédiat, mais c'est un point à revérifier lors d'une montée de version.
   * Désactivation : retirer cette ligne — l'arborescence resterait en base.
   */
  folders: true,
  hooks: {
    // Un fichier envoyé hors contexte de dossier atterrirait à la racine.
    beforeChange: [setDefaultMediaFolder],
  },
  upload: {
    mimeTypes: ['image/*'],
    // Formats générés automatiquement par sharp, alignés sur les usages du site.
    imageSizes: [
      { name: 'thumbnail', width: 480, height: undefined, position: 'centre' },
      { name: 'card', width: 768, height: undefined, position: 'centre' },
      { name: 'banner', width: 1920, height: undefined, position: 'centre' },
    ],
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texte alternatif',
      admin: {
        description:
          "Décrit l'image pour les lecteurs d'écran et le référencement. Peut être surchargé à l'endroit où l'image est utilisée.",
      },
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Crédit photo',
    },
  ],
}

export default Media
