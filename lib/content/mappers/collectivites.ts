import type { CollectivitesPageData } from '@/types/pages/collectivites'

import { text, toButtons, toImageData, toImageList, type Raw } from './common'
import { toPartner, toPartners } from './entities'

/**
 * Page « collectivités » : document Payload → forme attendue par la page.
 *
 * Aucun repli : tout ce qui s'affiche vient du global. Un champ laissé vide dans
 * le backoffice donne un texte vide ou un élément absent sur la page, ce qui
 * permet de repérer immédiatement un oubli de saisie.
 */

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
      titleLine1: text(hero.titleLine1),
      titleLine2: text(hero.titleLine2),
      titleLine3Start: text(hero.titleLine3Start),
      titleLine3Accent: text(hero.titleLine3Accent),
      intro: text(hero.intro),
      buttons: toButtons(hero.buttons),
      highlights: Array.isArray(hero.highlights)
        ? hero.highlights.map((row: Raw) => ({
            value: typeof row?.value === 'string' && row.value ? row.value : undefined,
            label: String(row?.label ?? ''),
            icon: toImageData(row?.icon),
          }))
        : [],
      backgroundImage: toImageData(hero.backgroundImage),
      sliderImages: toImageList(hero.sliderImages),
    },

    whyUs: {
      eyebrow: text(whyUs.eyebrow),
      title: text(whyUs.title),
      cards: Array.isArray(whyUs.cards)
        ? whyUs.cards
            .map((row: Raw) => {
              const image = toImageData(row?.image)
              if (!image) return undefined
              return {
                image,
                titleStart: String(row?.titleStart ?? ''),
                titleAccent: String(row?.titleAccent ?? ''),
                text: String(row?.text ?? ''),
              }
            })
            .filter((card): card is CollectivitesPageData['whyUs']['cards'][number] =>
              Boolean(card),
            )
        : [],
    },

    figures: {
      title: text(figures.title),
      backgroundImage: toImageData(figures.backgroundImage),
      items: Array.isArray(figures.items)
        ? figures.items.map((row: Raw) => ({
            value: Number(row?.value ?? 0),
            decimals: Number(row?.decimals ?? 0),
            prefix: String(row?.prefix ?? ''),
            suffix: String(row?.suffix ?? ''),
            label: String(row?.label ?? ''),
          }))
        : [],
    },

    solutions: {
      title: text(solutions.title),
      cards: Array.isArray(solutions.cards)
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
    },

    testimonials: {
      eyebrow: text(testimonials.eyebrow),
      title: text(testimonials.title),
      intro: text(testimonials.intro),
      button: {
        label: text(testimonials.button?.label),
        href: text(testimonials.button?.href),
      },
      items: Array.isArray(testimonials.items)
        ? testimonials.items.map((row: Raw) => ({
            quote: String(row?.quote ?? ''),
            // Le logo vient du référentiel Partenaires : c'est le nom du
            // partenaire qui y sert de texte alternatif.
            authorLogo: toPartner(row?.partner) ?? { src: '', alt: '' },
            authorName: String(row?.authorName ?? ''),
            eventLabel: String(row?.eventLabel ?? ''),
          }))
        : [],
    },

    partners: {
      subtitle: text(partners.subtitle),
      title: text(partners.title),
      logos: toPartners(partners.selection),
    },

    seo: {
      title: text(seo.title),
      description: text(seo.description),
    },
  }
}
