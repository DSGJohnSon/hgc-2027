import type { Payload } from 'payload'

import { toImage, withRetry, type Raw } from './lib'

/**
 * Transfert unique du contenu de la page d'accueil vers le global `home-page`.
 *
 * Jusqu'ici, ce contenu était écrit en dur dans `app/(my-app)/page.tsx`. Il est
 * recopié tel quel ci-dessous ; les images gardent leur chemin historique et
 * seront remplacées une à une depuis le backoffice.
 *
 * **Le global n'est jamais écrasé** une fois rempli : relancer le seed ne doit
 * pas effacer ce qui a été saisi dans le backoffice. Pour forcer la réécriture,
 * passer `--force`.
 */

/** Logos historiques de la section partenaires, retrouvés par nom de fichier. */
const PARTNER_LOGOS = [
  'logo_ville-lens-1.png',
  'logo_ville-lillers-1.png',
  'logo_solillers-1.png',
  'logo_ville-ronchin-1.png',
  'logo_ville-marcq-en-baroeule-1.png',
  'logo_ville-wingles-1.png',
  'logo_ville-loos-en-gohelle-1.png',
  'logo_ville-isbergues-1.png',
  'logo_ville-lestrem-1.png',
]

const GAMES = ['fortnite', 'fc26', 'rocket_league', 'mariokart_world', 'valorant']

const gamingSpace = () => ({
  logo: toImage('/new-assets/logo_pathe_games.webp', 'Logo Pathé Games'),
  backgroundImage: toImage('/new-assets/bg-espace-pathe.webp', ''),
  text: 'Viens fêter ton anniversaire sur nos setups.',
})

const whyJoinCard = (
  mascot: string,
  titleStart: string,
  titleAccent: string,
  text: string,
) => ({
  image: toImage(`/new-assets/mascotte/mascotte-${mascot}-triste.webp`, ''),
  hoverImage: toImage(`/new-assets/mascotte/mascotte-${mascot}.webp`, ''),
  titleStart,
  titleAccent,
  text,
})

export const seedHomePage = async (payload: Payload) => {
  const current = (await payload.findGlobal({
    slug: 'home-page',
    depth: 0,
    draft: true,
  })) as Raw

  if (current?.hero?.titleLine1 && !process.argv.includes('--force')) {
    console.log('  Page d’accueil déjà renseignée, rien n’est écrasé (--force pour réécrire).')
    return
  }

  // Relations : identifiants résolus depuis les référentiels existants.
  const { docs: partnerDocs } = await payload.find({
    collection: 'partners',
    limit: 500,
    depth: 1,
  })
  const partnerIdByFile = new Map(
    (partnerDocs as Raw[])
      .filter((doc) => typeof doc.logo?.filename === 'string')
      .map((doc) => [String(doc.logo.filename), String(doc.id)]),
  )
  const partnerIds = PARTNER_LOGOS.map((file) => {
    const id = partnerIdByFile.get(file)
    if (!id) console.warn(`  ! partenaires : aucun partenaire avec le logo « ${file} », ignoré`)
    return id
  }).filter((id): id is string => Boolean(id))

  const { docs: gameDocs } = await payload.find({ collection: 'games', limit: 500, depth: 0 })
  const gameIdBySlug = new Map((gameDocs as Raw[]).map((doc) => [String(doc.slug), String(doc.id)]))
  const gameIds = GAMES.map((slug) => {
    const id = gameIdBySlug.get(slug)
    if (!id) console.warn(`  ! jeux : jeu inconnu « ${slug} », ignoré`)
    return id
  }).filter((id): id is string => Boolean(id))

  const data: Raw = {
    _status: 'published',

    hero: {
      subtitle: '#     100% GRATUITS     #',
      titleLine1: "L'événement gaming qui",
      titleLine2: 'débarque chez toi',
      buttons: [
        { label: 'Événements à venir', href: '/evenements' },
        { label: 'Comment participer ?', href: '#comment-participer' },
      ],
      totalParticipants: '80.000',
      participantsSince: 2020,
      backgroundImage: toImage('/assets/img/heros/hero_main.png', ''),
    },

    gamingSpaces: {
      eyebrow: 'Envie de jouer dès maintenant ?',
      title: 'nos espaces gaming',
      cards: [gamingSpace(), gamingSpace(), gamingSpace()],
    },

    games: {
      title: 'À quoi tu joues ?',
      intro:
        'Clique sur ton jeu favori pour filtrer instantanément tous les tournois et animations disponibles.',
      selection: gameIds,
    },

    howItWorks: {
      title: 'Comment ça marche ?',
      steps: [
        {
          title: '1. Choisis ton event',
          text: 'Parcours les tournois à venir et choisis celui qui te plaît.',
        },
        { title: '2. Inscris-toi', text: "Remplis le formulaire d'inscription en ligne." },
        {
          title: '3. Participe',
          text: 'Rejoins-nous le jour J., montre ton skill et amuse-toi !',
        },
      ],
    },

    whyJoin: {
      title: 'Pourquoi rejoindre HGC ?',
      cards: [
        whyJoinCard(
          'vainqueur',
          'Des tournois',
          'pour tous',
          'Des compétitions accessibles à tous les niveaux et sur tes jeux préféres.',
        ),
        whyJoinCard(
          'communaute',
          'Une communauté',
          'passionnée',
          "Rencontre d'autres joueurs qui partagent ta passion.",
        ),
        whyJoinCard(
          'gift',
          'Des cashprizes',
          'à gagner',
          'Cashprizes, cadeaux et récompenses exclusives à certains événements.',
        ),
        whyJoinCard(
          'location',
          'Des Événements',
          'proche de chez toi',
          "HGC organise des events dans ta ville et ton quartier toute l'année.",
        ),
      ],
    },

    figures: {
      title: 'HGC en quelques chiffres',
      logo: toImage('/assets/logos/logo-hgc.svg', 'Holiday Geek Cup'),
      backgroundImage: toImage('/new-assets/bg-section-chiffres.webp', ''),
      items: [
        { value: 10.3, decimals: 1, prefix: '+ de ', suffix: ' k', label: 'joueurs / an' },
        { value: 67, decimals: 0, prefix: '+ de ', suffix: '', label: 'événements / an' },
        {
          value: 4,
          decimals: 0,
          prefix: '+ de ',
          suffix: ' k€',
          label: 'cashprize offert par an',
        },
      ],
    },

    community: {
      title: 'Rejoins la communauté',
      accent: 'HGC',
      text: "Ne rate aucune annonce d'événement, actualités ou ouverture de billeterie. Suis-nous sur nos réseaux sociaux et sois parmi les premiers informés !",
      photo: toImage('/new-assets/photo-section-commu-joueurs.webp', ''),
      backgroundImage: toImage('/new-assets/bg-section-commu-joueurs.webp', ''),
      // Liens encore factices sur le site : à renseigner depuis le backoffice.
      socials: ['discord', 'instagram', 'facebook', 'tiktok', 'youtube'].map((network) => ({
        network,
        url: '#',
      })),
    },

    cta: {
      titleAccent: 'Prêt à jouer ?',
      title: 'Trouve ton prochain événement.',
      button: { label: 'Découvrir les événements', href: '/evenements' },
    },

    partners: {
      subtitle: '',
      title: 'Nos partenaires',
      selection: partnerIds,
    },

    seo: {
      title: 'Holiday Geek Cup | Tournois gaming et événements esport près de chez toi',
      description:
        'Participe aux tournois et événements gaming gratuits de Holiday Geek Cup : Fortnite, FC26, Rocket League, Valorant, Mario Kart. Des compétitions ouvertes à tous les niveaux, partout dans les Hauts-de-France.',
    },
  }

  await withRetry(() => payload.updateGlobal({ slug: 'home-page', data }))

  console.log(
    `  Page d’accueil publiée (${gameIds.length} jeux, ${partnerIds.length} partenaires, images en chemins historiques)`,
  )
}
