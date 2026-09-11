import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'
import { seedReferentials } from './seed/referentials'
import { seedPartners } from './seed/partners'
import { seedActualites, seedEvents, seedServices } from './seed/content'

/**
 * Migration du contenu des fichiers `data/` vers Payload.
 *
 * Le script est **rejouable** : chaque document est identifié par son slug et mis
 * à jour s'il existe déjà. Les fichiers `data/` restent la source de secours tant
 * que le contenu migré n'a pas été validé par l'association.
 *
 *   npm run seed                    tout migrer
 *   npm run seed -- --only=events   ne migrer qu'une étape
 *
 * Étapes disponibles : referentials, partners, actualites, events, services.
 * L'ordre par défaut respecte les dépendances : les événements et les services
 * référencent les jeux, qui doivent donc exister d'abord.
 */

const STEPS = {
  referentials: seedReferentials,
  partners: seedPartners,
  actualites: seedActualites,
  events: seedEvents,
  services: seedServices,
} as const

type StepName = keyof typeof STEPS

const run = async () => {
  const onlyArg = process.argv.find((arg) => arg.startsWith('--only='))
  const requested = onlyArg
    ? onlyArg.slice('--only='.length).split(',').map((step) => step.trim())
    : Object.keys(STEPS)

  const unknown = requested.filter((step) => !(step in STEPS))
  if (unknown.length > 0) {
    console.error(`Étape inconnue : ${unknown.join(', ')}`)
    console.error(`Étapes disponibles : ${Object.keys(STEPS).join(', ')}`)
    process.exit(1)
  }

  const payload = await getPayload({ config })

  for (const step of requested as StepName[]) {
    console.log(`\n▶ ${step}`)
    await STEPS[step](payload)
  }

  console.log('\n✔ Migration terminée.')
  process.exit(0)
}

void run().catch((error) => {
  console.error('\n✖ Échec de la migration :', error)
  process.exit(1)
})
