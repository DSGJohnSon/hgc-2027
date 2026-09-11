import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import config from '../payload.config'

/**
 * Migration ponctuelle : re-uploade les logos de partenaires déjà en base vers
 * Vercel Blob (BLOB_READ_WRITE_TOKEN doit être renseigné). Relit le fichier
 * local existant et le fait repasser par `payload.update` avec `filePath`,
 * ce qui régénère les tailles et écrit via l'adaptateur de stockage actif —
 * sans changer l'id du document média, donc sans casser les relations.
 *
 *   npx tsx scripts/migrate-partner-logos-to-blob.ts
 *   npx tsx scripts/migrate-partner-logos-to-blob.ts --only=<mediaId>
 */

const onlyId = process.argv.find((arg) => arg.startsWith('--only='))?.split('=')[1]

const run = async () => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN absent du .env : rien à migrer vers Blob.')
  }

  const payload = await getPayload({ config })

  const { docs: partners } = await payload.find({ collection: 'partners', limit: 1000, depth: 0 })
  const logoIds = [...new Set(partners.map((p) => p.logo).filter((v): v is string => typeof v === 'string'))]
  const targets = onlyId ? logoIds.filter((id) => id === onlyId) : logoIds

  console.log(`${partners.length} partenaires, ${logoIds.length} logos uniques, ${targets.length} à traiter.`)

  let ok = 0
  const failed: string[] = []

  for (const id of targets) {
    const media = await payload.findByID({ collection: 'media', id, depth: 0 })
    if (!media?.filename) {
      console.warn(`⚠ ${id} : pas de filename, ignoré.`)
      continue
    }

    // Le plugin Vercel Blob construit l'URL de suppression de l'ancien fichier
    // sans encoder le nom (@payloadcms/storage-vercel-blob/handleDelete.js) : un
    // « % » littéral casse cette requête, et Payload a déjà supprimé le fichier
    // local avant que l'erreur ne remonte. On refuse donc ces noms en amont.
    if (media.filename.includes('%')) {
      console.error(
        `✖ ${media.filename} (${id}) : nom de fichier avec « % », renomme-le d'abord (casse la suppression de l'ancienne version côté Blob).`,
      )
      failed.push(id)
      continue
    }

    const localPath = path.resolve(process.cwd(), 'media', media.filename)
    if (!fs.existsSync(localPath)) {
      console.error(`✖ ${media.filename} (${id}) : fichier local introuvable à ${localPath}`)
      failed.push(id)
      continue
    }

    try {
      const updated = await payload.update({
        collection: 'media',
        id,
        data: {},
        filePath: localPath,
      })
      console.log(`✔ ${media.filename} -> ${updated.url}`)
      ok++
    } catch (error) {
      console.error(`✖ échec sur ${media.filename} (${id}) :`, error)
      failed.push(id)
    }
  }

  console.log(`\n${ok}/${targets.length} logos migrés. ${failed.length} échec(s).`)
  process.exit(failed.length > 0 ? 1 : 0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
