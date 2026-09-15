import 'dotenv/config'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { BlobNotFoundError, head, put } from '@vercel/blob'
import { getPayload } from 'payload'

import config from '../payload.config'

/**
 * Envoie sur Vercel Blob les médias restés sur le disque local.
 *
 * Les fichiers envoyés depuis le backoffice quand `BLOB_READ_WRITE_TOKEN` était
 * vide ont été écrits dans `media/` (stockage local de Payload). Une fois le
 * jeton renseigné, le plugin Vercel Blob les cherche sur Blob, où ils n'ont
 * jamais été envoyés : leur URL `/api/media/file/...` répond 404.
 *
 * Le script reproduit l'envoi du plugin (`@payloadcms/storage-vercel-blob`,
 * `handleUpload.js`) — même nom de fichier, accès public, sans suffixe
 * aléatoire — pour chaque fichier d'origine et chacune de ses déclinaisons.
 * Un fichier déjà présent sur Blob n'est jamais écrasé, et les fiches média ne
 * sont pas modifiées.
 *
 *   npx tsx scripts/upload-local-media-to-blob.ts            simulation, n'envoie rien
 *   npx tsx scripts/upload-local-media-to-blob.ts --apply    envoi réel
 */

const apply = process.argv.includes('--apply')

/** Dossier du stockage local de Payload : le slug de la collection, à la racine. */
const LOCAL_DIR = path.resolve('media')

/** Durée de cache appliquée par défaut par le plugin (un an). */
const CACHE_CONTROL_MAX_AGE = 60 * 60 * 24 * 365

type MediaFile = { filename: string; mimeType: string | null | undefined }

const run = async () => {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  // Même lecture de l'identifiant du store que le plugin (index.js).
  const storeId = token?.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase()
  if (!token || !storeId) {
    console.error('✖ BLOB_READ_WRITE_TOKEN absent ou invalide : rien à envoyer.')
    process.exit(1)
  }
  const baseUrl = `https://${storeId}.public.blob.vercel-storage.com`

  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'media', depth: 0, pagination: false })
  console.log(apply ? '▶ Envoi réel' : '▶ Simulation (ajoutez --apply pour envoyer)')

  // Fichier d'origine et déclinaisons (`sizes`) de chaque fiche.
  const files: MediaFile[] = docs.flatMap((doc) =>
    [
      { filename: doc.filename, mimeType: doc.mimeType },
      ...Object.values(doc.sizes ?? {}).map((size) => ({
        filename: size?.filename,
        mimeType: size?.mimeType,
      })),
    ].filter((file): file is MediaFile => typeof file.filename === 'string' && file.filename !== ''),
  )

  let toSend = 0
  let alreadyOnBlob = 0
  for (const { filename, mimeType } of files) {
    const localPath = path.join(LOCAL_DIR, filename)
    // Absent du disque : le fichier a été envoyé directement sur Blob.
    if (!existsSync(localPath)) continue

    try {
      await head(`${baseUrl}/${encodeURIComponent(filename)}`, { token })
      console.log(`  = ${filename} : déjà sur Blob`)
      alreadyOnBlob++
      continue
    } catch (error) {
      if (!(error instanceof BlobNotFoundError)) throw error
    }

    console.log(`  + ${filename}`)
    if (apply) {
      await put(filename, await readFile(localPath), {
        access: 'public',
        addRandomSuffix: false,
        cacheControlMaxAge: CACHE_CONTROL_MAX_AGE,
        contentType: mimeType ?? undefined,
        token,
      })
    }
    toSend++
  }

  console.log(
    `\n${apply ? '✔' : '○'} ${toSend} fichier(s) ${apply ? 'envoyé(s)' : 'à envoyer'}, ${alreadyOnBlob} déjà sur Blob, ${files.length} fichiers référencés au total.`,
  )
  process.exit(0)
}

void run().catch((error) => {
  console.error('\n✖ Envoi interrompu :', error)
  process.exit(1)
})
