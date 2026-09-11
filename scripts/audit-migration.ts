import 'dotenv/config'
import { getPayload, type Payload } from 'payload'

import config from '../payload.config'

import { events } from '@/data/events'
import { eventSeries } from '@/data/event-series'
import { actualites } from '@/data/actualites'
import { servicesBtoB } from '@/data/services-btob'
import { servicesBtoC } from '@/data/services-btoc'
import gamesData from '@/data/games.json'
import categoriesData from '@/data/categories.json'

/**
 * Audit de la migration : que contiennent les fichiers `data/` que la base n'a pas ?
 *
 * Motivation : **Payload ignore en silence toute clé inconnue**. Si le script de
 * seed écrit un champ que le schéma ne déclare pas, la valeur est perdue sans la
 * moindre erreur — c'est ainsi que les images positionnées, puis les logos des
 * cards `featureGrid`, ont disparu sans que rien ne le signale.
 *
 * Le principe est volontairement bête et donc fiable : on aplatit les valeurs
 * « de contenu » (chemins d'images, liens, textes) présentes dans `data/`, on
 * aplatit celles réellement stockées, et on liste ce qui manque. Aucun couplage
 * au schéma : l'audit reste valable quand le modèle évolue.
 *
 *   npm run audit:migration
 */

type Leaf = { value: string; where: string }

const IMAGE_LIKE = /^\/assets\//
const IGNORED_KEYS = new Set(['id', '_id', 'blockType', 'type', 'position', 'variant', 'size'])

/** Aplatit un objet en valeurs textuelles, en gardant le chemin d'accès. */
const collect = (input: unknown, where: string, out: Leaf[] = []): Leaf[] => {
  if (typeof input === 'string') {
    const value = input.trim()
    if (value.length > 0) out.push({ value, where })
    return out
  }
  if (Array.isArray(input)) {
    input.forEach((item, index) => collect(item, `${where}[${index}]`, out))
    return out
  }
  if (input && typeof input === 'object') {
    for (const [key, child] of Object.entries(input as Record<string, unknown>)) {
      if (IGNORED_KEYS.has(key)) continue
      collect(child, `${where}.${key}`, out)
    }
  }
  return out
}

/** Sources migrées, avec le nom lisible utilisé dans le rapport. */
const SOURCES: Array<[string, unknown]> = [
  ['events', events],
  ['event-series', eventSeries],
  ['actualites', actualites],
  ['services-btob', servicesBtoB],
  ['services-btoc', servicesBtoC],
  ['games', gamesData],
  ['categories', categoriesData],
]
// `data/pages/contact.json` est volontairement hors audit : seuls le titre et
// l'accroche ont été migrés, sa mise en page vit dans le code.

const COLLECTIONS = [
  'events',
  'event-series',
  'services',
  'actualites',
  'games',
  'categories',
  'partners',
  'media',
] as const


/** Toutes les valeurs textuelles réellement présentes en base. */
const collectStored = async (payload: Payload): Promise<Set<string>> => {
  const stored = new Set<string>()

  for (const collection of COLLECTIONS) {
    const { docs } = await payload.find({ collection, limit: 1000, depth: 0, draft: true })
    for (const leaf of collect(docs, collection)) stored.add(leaf.value)
  }


  return stored
}

const run = async () => {
  const payload = await getPayload({ config })
  const stored = await collectStored(payload)

  const missingImages: Leaf[] = []
  const missingText: Leaf[] = []

  for (const [name, source] of SOURCES) {
    for (const leaf of collect(source, name)) {
      if (stored.has(leaf.value)) continue

      if (IMAGE_LIKE.test(leaf.value)) {
        missingImages.push(leaf)
      } else if (leaf.value.length >= 25) {
        // Sous 25 caractères, trop de faux positifs : identifiants transformés
        // en slugs, libellés recomposés, valeurs par défaut réécrites.
        missingText.push(leaf)
      }
    }
  }

  const report = (title: string, leaves: Leaf[]) => {
    console.log(`\n${title} : ${leaves.length}`)
    for (const leaf of leaves) {
      const value = leaf.value.length > 90 ? `${leaf.value.slice(0, 90)}…` : leaf.value
      console.log(`  ${leaf.where}\n    ${value}`)
    }
  }

  report('IMAGES présentes dans data/ mais absentes de la base', missingImages)
  report('TEXTES (≥ 25 caractères) présents dans data/ mais absents de la base', missingText)

  console.log(
    `\n${missingImages.length === 0 && missingText.length === 0 ? '✔ Aucun écart détecté.' : '✖ Écarts à examiner ci-dessus.'}`,
  )
  process.exit(0)
}

void run().catch((error) => {
  console.error('✖ Audit interrompu :', error)
  process.exit(1)
})
