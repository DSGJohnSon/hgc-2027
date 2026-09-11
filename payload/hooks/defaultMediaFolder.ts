import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Dossier par défaut des médias.
 *
 * Payload injecte le champ `folder` comme une simple relation, sans
 * `defaultValue` : un fichier envoyé hors contexte de dossier atterrit donc à la
 * racine de la bibliothèque. C'est le cas le plus fréquent ici — envoyer un logo
 * depuis la fiche d'un partenaire, par exemple, ne passe par aucun dossier.
 *
 * Ce hook comble ce vide au moment de la création, sans jamais écraser un choix
 * explicite : si l'envoi se fait depuis un dossier, ou si l'utilisateur en a
 * désigné un, sa valeur est conservée.
 *
 * Le dossier est créé au premier besoin, ce qui évite d'avoir à le provisionner
 * et rend le comportement identique sur une base neuve.
 */

/** Nom du dossier d'accueil. Modifier ici pour en changer. */
export const DEFAULT_MEDIA_FOLDER = '0 - IMPORTS (à trier)'

// Valeurs par défaut de la fonctionnalité Dossiers de Payload. Elles ne sont
// surchargées nulle part dans ce projet ; les changer dans `config.folders`
// imposerait de les répercuter ici.
const FOLDER_COLLECTION = 'payload-folders'

export const setDefaultMediaFolder: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || data.folder) return data

  try {
    const existing = await req.payload.find({
      collection: FOLDER_COLLECTION,
      where: { name: { equals: DEFAULT_MEDIA_FOLDER } },
      limit: 1,
      depth: 0,
      req,
    })

    const folder =
      existing.docs[0] ??
      (await req.payload.create({
        collection: FOLDER_COLLECTION,
        data: {
          name: DEFAULT_MEDIA_FOLDER,
          // Le dossier n'accepte que des médias : sans ce cadrage, la
          // validation du champ `folder` refuserait le document
          // (`collectionSpecific` est activé par défaut).
          folderType: ['media'],
        },
        // Dans la transaction du média : la validation du champ `folder`
        // relit le dossier via cette même transaction et ne verrait pas une
        // création faite en dehors.
        req,
      }))

    return { ...data, folder: folder.id }
  } catch (error) {
    // Un dossier par défaut ne vaut pas de faire échouer un envoi de fichier :
    // en cas de problème, le média part simplement à la racine.
    req.payload.logger.error(
      { err: error },
      'Dossier média par défaut : attribution impossible, le fichier reste à la racine.',
    )
    return data
  }
}
