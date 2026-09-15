import type { HomePageData, SocialNetwork } from '@/types/pages/home'
import type { Game } from '@/types/games'

import { text, toButtons, toImageData, type Raw } from './common'
import { toGame, toPartners } from './entities'

/**
 * Page d'accueil « joueurs » : document Payload → forme attendue par la page.
 *
 * Aucun repli : tout ce qui s'affiche vient du global. Un champ laissé vide dans
 * le backoffice donne un texte vide ou un élément absent sur la page, ce qui
 * permet de repérer immédiatement un oubli de saisie.
 */

const NETWORKS: SocialNetwork[] = ['discord', 'instagram', 'facebook', 'tiktok', 'youtube']

const rows = (value: unknown): Raw[] => (Array.isArray(value) ? value : [])

export const toHomePage = (doc: Raw): HomePageData => {
  const hero = (doc.hero ?? {}) as Raw
  const gamingSpaces = (doc.gamingSpaces ?? {}) as Raw
  const games = (doc.games ?? {}) as Raw
  const howItWorks = (doc.howItWorks ?? {}) as Raw
  const whyJoin = (doc.whyJoin ?? {}) as Raw
  const figures = (doc.figures ?? {}) as Raw
  const community = (doc.community ?? {}) as Raw
  const cta = (doc.cta ?? {}) as Raw
  const partners = (doc.partners ?? {}) as Raw
  const seo = (doc.seo ?? {}) as Raw

  return {
    hero: {
      subtitle: text(hero.subtitle),
      titleLine1: text(hero.titleLine1),
      titleLine2: text(hero.titleLine2),
      buttons: toButtons(hero.buttons),
      totalParticipants: text(hero.totalParticipants),
      participantsSince:
        typeof hero.participantsSince === 'number' ? hero.participantsSince : undefined,
      backgroundImage: toImageData(hero.backgroundImage),
    },

    gamingSpaces: {
      eyebrow: text(gamingSpaces.eyebrow),
      title: text(gamingSpaces.title),
      cards: rows(gamingSpaces.cards).map((row) => ({
        logo: toImageData(row?.logo),
        backgroundImage: toImageData(row?.backgroundImage),
        text: String(row?.text ?? ''),
        unavailable: Boolean(row?.unavailable),
      })),
    },

    games: {
      title: text(games.title),
      intro: text(games.intro),
      // Seuls les jeux peuplés sont exploitables : un ObjectId seul ne permet
      // ni d'afficher la carte, ni de construire le lien filtré.
      items: rows(games.selection)
        .filter((relation) => relation && typeof relation === 'object')
        .map(toGame)
        .filter((game: Game) => game.id.length > 0),
    },

    howItWorks: {
      title: text(howItWorks.title),
      steps: rows(howItWorks.steps).map((row) => ({
        icon: toImageData(row?.icon),
        title: String(row?.title ?? ''),
        text: String(row?.text ?? ''),
      })),
    },

    whyJoin: {
      title: text(whyJoin.title),
      cards: rows(whyJoin.cards).map((row) => ({
        image: toImageData(row?.image),
        hoverImage: toImageData(row?.hoverImage),
        titleStart: String(row?.titleStart ?? ''),
        titleAccent: String(row?.titleAccent ?? ''),
        text: String(row?.text ?? ''),
      })),
    },

    figures: {
      title: text(figures.title),
      logo: toImageData(figures.logo),
      backgroundImage: toImageData(figures.backgroundImage),
      items: rows(figures.items).map((row) => ({
        value: Number(row?.value ?? 0),
        decimals: Number(row?.decimals ?? 0),
        prefix: String(row?.prefix ?? ''),
        suffix: String(row?.suffix ?? ''),
        label: String(row?.label ?? ''),
      })),
    },

    community: {
      title: text(community.title),
      accent: text(community.accent),
      text: text(community.text),
      photo: toImageData(community.photo),
      backgroundImage: toImageData(community.backgroundImage),
      socials: rows(community.socials)
        .map((row) => ({ network: row?.network as SocialNetwork, url: text(row?.url) }))
        .filter((social) => NETWORKS.includes(social.network) && social.url.length > 0),
    },

    cta: {
      titleAccent: text(cta.titleAccent),
      title: text(cta.title),
      button: {
        label: text(cta.button?.label),
        href: text(cta.button?.href),
      },
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
