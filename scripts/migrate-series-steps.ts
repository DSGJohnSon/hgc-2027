/* eslint-disable @typescript-eslint/no-explicit-any */
import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'
import { relationId } from '../payload/utils'

/**
 * Migration ponctuelle : étapes de séries → événements rattachés.
 *
 * Avant la refonte, les étapes d'une série formaient un tableau `dates` dans le
 * document `event-series`. Elles deviennent des documents `events` dont le champ
 * `series` pointe vers leur série. Le schéma ne déclarant plus `dates`, Payload
 * ne le renvoie plus : on lit donc les documents bruts dans MongoDB.
 *
 * Le tableau `dates` n'est pas effacé : il reste en base, invisible pour Payload,
 * comme copie de secours. Le script est rejouable : une étape déjà migrée (même
 * slug, même série) est ignorée.
 *
 *   npx tsx scripts/migrate-series-steps.ts            simulation, n'écrit rien
 *   npx tsx scripts/migrate-series-steps.ts --apply    migre réellement
 */

const apply = process.argv.includes('--apply')

/** ObjectId, dates… → valeurs JSON, la forme attendue par l'API Payload. */
const plain = (value: unknown): any => JSON.parse(JSON.stringify(value ?? null))

const run = async () => {
  const payload = await getPayload({ config })
  const models = (payload.db as any).collections
  console.log(apply ? '▶ Migration réelle' : '▶ Simulation (ajoutez --apply pour écrire)')

  // Un slug d'étape n'est unique que dans sa série (deux séries ont une étape
  // « marcq-en-baroeul ») : l'index unique de l'ancien schéma bloquerait la
  // création des étapes. On le remplace par un index simple.
  const indexes: any[] = await models.events.collection.indexes()
  const uniqueSlug = indexes.find((index) => index.key?.slug === 1 && index.unique)
  if (uniqueSlug) {
    console.log(`\nIndex unique « ${uniqueSlug.name} » sur events.slug → index simple`)
    if (apply) {
      await models.events.collection.dropIndex(uniqueSlug.name)
      await models.events.collection.createIndex({ slug: 1 })
    }
  }

  const seriesDocs: any[] = await models['event-series'].find({}).lean()
  let created = 0
  let skipped = 0

  for (const series of seriesDocs) {
    const seriesId = String(series._id)
    const steps: any[] = Array.isArray(series.dates) ? plain(series.dates) : []
    console.log(`\n${series.slug} — ${steps.length} étape(s)`)

    for (const step of steps) {
      const existing = await payload.find({
        collection: 'events',
        where: { slug: { equals: step.slug } },
        depth: 0,
        draft: true,
        pagination: false,
      })
      if (existing.docs.some((doc) => relationId(doc.series) === seriesId)) {
        console.log(`  = ${step.slug} : déjà migrée`)
        skipped++
        continue
      }

      const status = series._status === 'draft' ? 'draft' : 'published'
      const data = {
        slug: step.slug,
        series: seriesId,
        title: step.title || series.title,
        type: 'event',
        color: series.color,
        startDate: step.startDate,
        endDate: step.endDate ?? undefined,
        startTime: step.startTime ?? '',
        endTime: step.endTime ?? '',
        location: step.location ?? '',
        isCancelled: Boolean(step.isCancelled),
        cardThumbnail: step.cardThumbnail,
        heroBanner: step.heroBanner,
        heroBannerMobile: step.heroBannerMobile,
        description: step.description ?? [],
        partners: step.partners ?? [],
        games: step.games ?? [],
        freeplayGames: step.freeplayGames ?? [],
        registrationOpen: Boolean(step.registrationOpen),
        weezeventCode: step.weezeventCode ?? '',
        transports: step.transports,
        _status: status,
      }

      console.log(
        `  + ${step.slug} — ${data.title}, ${String(step.startDate).slice(0, 10)} (${status})`,
      )
      if (apply) {
        await payload.create({ collection: 'events', data: data as any, draft: status === 'draft' })
      }
      created++
    }
  }

  console.log(
    `\n${apply ? '✔' : '○'} ${created} étape(s) ${apply ? 'créée(s)' : 'à créer'}, ${skipped} déjà migrée(s).`,
  )
  process.exit(0)
}

void run().catch((error) => {
  console.error('\n✖ Migration interrompue :', error)
  process.exit(1)
})
