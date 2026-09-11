import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import config from '../payload.config'

/**
 * Migration ponctuelle : envoie dans la bibliothèque média (donc vers Vercel
 * Blob, avec redimensionnement sharp) l'illustration des actualités qui
 * n'existe encore que sous forme de chemin historique (`public/assets/...`).
 * Même principe que `scripts/migrate-games-images-to-media.ts` (déjà
 * supprimé, son travail fait) : le champ `path` reste inchangé après coup,
 * `media` prend juste la priorité dans `resolveImage()`.
 *
 *   npx tsx scripts/migrate-actualites-images-to-media.ts
 *   npx tsx scripts/migrate-actualites-images-to-media.ts --only=<id>
 */

const onlyId = process.argv.find((arg) => arg.startsWith('--only='))?.split('=')[1]

const run = async () => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN absent du .env : rien à migrer vers Blob.')
  }

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'actualites',
    limit: 200,
    depth: 0,
    draft: true,
  })
  const targets = onlyId ? docs.filter((d) => d.id === onlyId) : docs

  console.log(`${docs.length} actualités, ${targets.length} à traiter.`)

  let ok = 0
  const failed: string[] = []

  for (const doc of targets) {
    const image = doc.image as { media?: unknown; path?: string } | undefined | null
    if (!image?.path || image.media) continue

    const filename = path.basename(image.path)

    if (filename.includes('%')) {
      console.error(`✖ ${doc.title} : nom de fichier avec « % » (${filename}), renomme-le d'abord.`)
      failed.push(String(doc.id))
      continue
    }

    const localPath = path.resolve(process.cwd(), 'public', image.path.replace(/^\//, ''))
    if (!fs.existsSync(localPath)) {
      console.error(`✖ ${doc.title} : fichier local introuvable à ${localPath}`)
      failed.push(String(doc.id))
      continue
    }

    try {
      const media = await payload.create({
        collection: 'media',
        data: {},
        filePath: localPath,
      })

      await payload.update({
        collection: 'actualites',
        id: doc.id,
        draft: doc._status === 'draft',
        // `path` n’existe plus au schéma des actualités
        // (`positionedImageField(.., .., false)`) : on n’écrit que le média.
        data: { image: { media: media.id } },
      })

      console.log(`✔ ${doc.title} -> ${media.url}`)
      ok++
    } catch (error) {
      console.error(`✖ échec sur ${doc.title} (${filename}) :`, error)
      failed.push(String(doc.id))
    }
  }

  console.log(`\n${ok} images migrées, ${failed.length} échec(s).`)
  process.exit(failed.length > 0 ? 1 : 0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
