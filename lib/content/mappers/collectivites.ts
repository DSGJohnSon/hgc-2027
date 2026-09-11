import type {
  CardFraming,
  CollectivitesPageData,
} from '@/types/pages/collectivites'
import { collectivitesContent as DEFAULTS } from '@/data/pages/collectivites'

import { toImageData, toImageList, type Raw } from './common'
import { toPartners } from './entities'

/**
 * Page « collectivités » : document Payload → forme attendue par la page.
 *
 * Chaque valeur retombe sur `data/pages/collectivites.ts` si elle est absente du
 * document. Ce n'est pas de la prudence excessive : tant que personne n'a
 * enregistré le global, Payload ne renvoie que les `defaultValue` des champs
 * simples — les listes, elles, peuvent revenir vides. Le repli garantit que la
 * page reste complète en toutes circonstances.
 */

const text = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.length > 0 ? value : fallback

/** Une liste vide côté CMS signifie « pas encore renseigné », pas « vider la section ». */
const list = <T>(rows: T[], fallback: T[]): T[] => (rows.length > 0 ? rows : fallback)

const FRAMINGS: CardFraming[] = ['normal', 'reduit', 'tresReduit']

const toFraming = (value: unknown): CardFraming =>
  FRAMINGS.includes(value as CardFraming) ? (value as CardFraming) : 'normal'

const toButtons = (rows: Raw[] | null | undefined) =>
  Array.isArray(rows)
    ? rows
        .map((row) => ({
          label: String(row?.label ?? ''),
          href: String(row?.href ?? '#'),
        }))
        .filter((button) => button.label.length > 0)
    : []

export const toCollectivitesPage = (doc: Raw): CollectivitesPageData => {
  const hero = (doc.hero ?? {}) as Raw
  const whyUs = (doc.whyUs ?? {}) as Raw
  const figures = (doc.figures ?? {}) as Raw
  const solutions = (doc.solutions ?? {}) as Raw
  const testimonials = (doc.testimonials ?? {}) as Raw
  const partners = (doc.partners ?? {}) as Raw
  const seo = (doc.seo ?? {}) as Raw

  return {
    hero: {
      titleLine1: text(hero.titleLine1, DEFAULTS.hero.titleLine1),
      titleLine2: text(hero.titleLine2, DEFAULTS.hero.titleLine2),
      titleLine3Start: text(hero.titleLine3Start, DEFAULTS.hero.titleLine3Start),
      titleLine3Accent: text(hero.titleLine3Accent, DEFAULTS.hero.titleLine3Accent),
      intro: text(hero.intro, DEFAULTS.hero.intro),
      buttons: list(toButtons(hero.buttons), DEFAULTS.hero.buttons),
      highlights: list(
        Array.isArray(hero.highlights)
          ? hero.highlights.map((row: Raw) => ({
              value: typeof row?.value === 'string' && row.value ? row.value : undefined,
              label: String(row?.label ?? ''),
              icon: toImageData(row?.icon),
            }))
          : [],
        DEFAULTS.hero.highlights,
      ),
      backgroundImage:
        toImageData(hero.backgroundImage) ?? DEFAULTS.hero.backgroundImage,
      sliderImages: list(toImageList(hero.sliderImages), DEFAULTS.hero.sliderImages),
    },

    whyUs: {
      eyebrow: text(whyUs.eyebrow, DEFAULTS.whyUs.eyebrow),
      title: text(whyUs.title, DEFAULTS.whyUs.title),
      cards: list(
        Array.isArray(whyUs.cards)
          ? whyUs.cards
              .map((row: Raw) => {
                const image = toImageData(row?.image)
                if (!image) return undefined
                return {
                  image,
                  titleStart: String(row?.titleStart ?? ''),
                  titleAccent: String(row?.titleAccent ?? ''),
                  text: String(row?.text ?? ''),
                  framing: toFraming(row?.framing),
                }
              })
              .filter((card): card is CollectivitesPageData['whyUs']['cards'][number] =>
                Boolean(card),
              )
          : [],
        DEFAULTS.whyUs.cards,
      ),
    },

    figures: {
      title: text(figures.title, DEFAULTS.figures.title),
      backgroundImage:
        toImageData(figures.backgroundImage) ?? DEFAULTS.figures.backgroundImage,
      items: list(
        Array.isArray(figures.items)
          ? figures.items.map((row: Raw) => ({
              value: Number(row?.value ?? 0),
              decimals: Number(row?.decimals ?? 0),
              prefix: String(row?.prefix ?? ''),
              suffix: String(row?.suffix ?? ''),
              label: String(row?.label ?? ''),
            }))
          : [],
        DEFAULTS.figures.items,
      ),
    },

    solutions: {
      title: text(solutions.title, DEFAULTS.solutions.title),
      cards: list(
        Array.isArray(solutions.cards)
          ? solutions.cards
              .map((row: Raw) => {
                const image = toImageData(row?.image)
                if (!image) return undefined
                return {
                  image,
                  icon: toImageData(row?.icon) ?? { src: '', alt: '' },
                  title: String(row?.title ?? ''),
                  text: String(row?.text ?? ''),
                }
              })
              .filter((card): card is CollectivitesPageData['solutions']['cards'][number] =>
                Boolean(card),
              )
          : [],
        DEFAULTS.solutions.cards,
      ),
    },

    testimonials: {
      eyebrow: text(testimonials.eyebrow, DEFAULTS.testimonials.eyebrow),
      title: text(testimonials.title, DEFAULTS.testimonials.title),
      intro: text(testimonials.intro, DEFAULTS.testimonials.intro),
      button: {
        label: text(testimonials.button?.label, DEFAULTS.testimonials.button.label),
        href: text(testimonials.button?.href, DEFAULTS.testimonials.button.href),
      },
      items: list(
        Array.isArray(testimonials.items)
          ? testimonials.items.map((row: Raw) => ({
              quote: String(row?.quote ?? ''),
              authorLogo: toImageData(row?.authorLogo) ?? { src: '', alt: '' },
              authorName: String(row?.authorName ?? ''),
              eventLabel: String(row?.eventLabel ?? ''),
            }))
          : [],
        DEFAULTS.testimonials.items,
      ),
    },

    partners: {
      subtitle: text(partners.subtitle, DEFAULTS.partners.subtitle),
      title: text(partners.title, DEFAULTS.partners.title),
      // Aucune sélection faite dans le référentiel : on garde la liste en ligne
      // plutôt que de faire disparaître la section (voir la description du champ).
      logos: list(toPartners(partners.selection), DEFAULTS.partners.logos),
    },

    seo: {
      title: text(seo.title, DEFAULTS.seo.title ?? ''),
      description: text(seo.description, DEFAULTS.seo.description ?? ''),
    },
  }
}
