import type { Payload } from 'payload'

import { events } from '@/data/events'
import { eventSeries } from '@/data/event-series'
import homePageData from '@/data/pages/official/home-page.json'
import aboutData from '@/data/pages/official/about.json'

import { withRetry, type Raw } from './lib'

/**
 * Catalogue des partenaires, reconstitué depuis les fichiers `data/`.
 *
 * Avant la migration, chaque événement et chaque section « Partenaires » portait
 * sa propre liste `{ alt, src }`. On rassemble ici ces occurrences pour créer les
 * fiches de la collection et rétablir les liens.
 *
 * **Le seed n'écrit jamais le logo.** Les partenaires sont illustrés par un média
 * de la bibliothèque, envoyé à la main depuis le backoffice : rejouer la
 * migration ne doit en aucun cas écraser ce travail. Le seed se limite donc aux
 * noms et aux relations.
 */

type PartnerRef = { alt?: string; src?: string }

/** Ordre de balayage — il détermine quel libellé est retenu comme nom. */
const collectRefs = (): PartnerRef[] => {
  const refs: PartnerRef[] = []

  for (const event of events) refs.push(...((event.partners ?? []) as PartnerRef[]))

  for (const series of eventSeries) {
    refs.push(...((series.partners ?? []) as PartnerRef[]))
    for (const date of series.dates) refs.push(...((date.partners ?? []) as PartnerRef[]))
  }

  for (const page of [homePageData, aboutData]) {
    for (const section of page.sections as Raw[]) {
      if (section.type === 'partners') {
        refs.push(...((section.data?.logos ?? []) as PartnerRef[]))
      }
    }
  }

  return refs
}

/**
 * Correspondance fichier de logo → nom retenu.
 *
 * Un même fichier est parfois libellé différemment d'un endroit à l'autre
 * (« Tadao » / « TADAO 100% Gratuit ») : on retient le premier libellé rencontré
 * et cette table sert ensuite à retrouver la fiche depuis n'importe quelle
 * référence historique.
 */
export const buildNameBySrc = (): Map<string, string> => {
  const nameBySrc = new Map<string, string>()

  for (const ref of collectRefs()) {
    if (!ref?.src || nameBySrc.has(ref.src)) continue
    const name = (ref.alt ?? '').trim()
    nameBySrc.set(ref.src, name || ref.src)
  }

  return nameBySrc
}

/**
 * Crée les fiches partenaires manquantes.
 *
 * Identifiées par leur **nom** : c'est la seule donnée stable dont dispose encore
 * la collection depuis que le logo est un média envoyé à la main. Conséquence
 * assumée : deux fichiers portant le même libellé donnent une seule fiche —
 * ce qui va dans le sens du regroupement que l'association fera de toute façon.
 */
export const seedPartners = async (payload: Payload) => {
  const names = [...new Set(buildNameBySrc().values())]

  let created = 0
  for (const name of names) {
    const existing = await withRetry(() =>
      payload.find({
        collection: 'partners',
        where: { name: { equals: name } },
        limit: 1,
        depth: 0,
      }),
    )

    if (existing.docs.length > 0) continue

    await withRetry(() =>
      payload.create({ collection: 'partners', data: { name }, disableTransaction: true }),
    )
    created += 1
  }

  console.log(`  ${names.length} partenaires (${created} créé(s), logos à envoyer à la main)`)
}

/**
 * Fabrique la fonction de résolution des références historiques `{ alt, src }`
 * vers les identifiants de la collection.
 */
export const createPartnerResolver = async (payload: Payload) => {
  const nameBySrc = buildNameBySrc()
  const { docs } = await payload.find({ collection: 'partners', limit: 500, depth: 0 })
  const idByName = new Map(docs.map((doc: Raw) => [String(doc.name), String(doc.id)]))

  return (refs: PartnerRef[] | undefined, context: string): string[] => {
    if (!Array.isArray(refs)) return []

    const ids: string[] = []
    for (const ref of refs) {
      if (!ref?.src) continue
      const name = nameBySrc.get(ref.src)
      const id = name ? idByName.get(name) : undefined
      if (id) {
        // Un même partenaire peut être référencé deux fois via deux fichiers.
        if (!ids.includes(id)) ids.push(id)
      } else {
        console.warn(`  ! ${context} : partenaire inconnu « ${ref.src} », ignoré`)
      }
    }
    return ids
  }
}
