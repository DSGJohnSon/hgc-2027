import type { CollectivitesPageData } from "@/types/pages/collectivites";

/**
 * Contenu de référence de la page « collectivités ».
 *
 * Ce fichier alimente les `defaultValue` du global Payload : le backoffice
 * s'ouvre donc déjà rempli avec le contenu réellement en ligne, et la page
 * s'affiche correctement même avant la première sauvegarde dans le CMS.
 *
 * Une fois le contenu modifié depuis le backoffice, c'est la base qui fait foi ;
 * ce fichier ne sert plus que de valeur de repli.
 */
export const collectivitesContent: CollectivitesPageData = {
  hero: {
    titleLine1: "Le gaming,",
    titleLine2: "un levier puissant",
    titleLine3Start: "pour",
    titleLine3Accent: "votre territoire.",
    intro:
      "Notre association conçoit et organise des événements gaming sur-mesure pour animer, fédérer et valoriser votre territoire.",
    buttons: [
      { label: "Découvrir nos événements", href: "/evenements" },
      { label: "Nous contacter", href: "/contact" },
    ],
    highlights: [
      { value: "+ de 5 ans", label: "d'expérience" },
      { value: "+ de 67", label: "événements / an" },
      {
        label: "dans le\nnord-pas-de-calais",
        icon: {
          src: "/new-assets/map-ping-nord_pas_de_calais.svg",
          alt: "Carte du Nord-Pas-de-Calais",
        },
      },
    ],
    backgroundImage: {
      src: "/new-assets/bg-hero-landing-collectivites.webp",
      alt: "",
    },
    sliderImages: [
      { src: "/assets/img/placeholders/3.webp", alt: "" },
      { src: "/assets/img/placeholders/3.webp", alt: "" },
      { src: "/assets/img/placeholders/3.webp", alt: "" },
      { src: "/assets/img/placeholders/3.webp", alt: "" },
      { src: "/assets/img/placeholders/3.webp", alt: "" },
      { src: "/assets/img/placeholders/3.webp", alt: "" },
    ],
  },

  whyUs: {
    eyebrow: "Un impact positif sur votre territoire",
    title: "Pourquoi faire appel à nous ?",
    cards: [
      {
        image: {
          src: "/new-assets/why-us/hgc-creer-du-lien-social.webp",
          alt: "Holiday Geek Cup vous aide à créer du lien social au sein de votre collectivité",
        },
        titleStart: "Créer du",
        titleAccent: "lien social",
        text: "Fédérez toutes les générations autour d'une passion commune dans un cadre inclusif.",
        framing: "normal",
      },
      {
        image: {
          src: "/new-assets/why-us/hgc-valoriser-votre-image.webp",
          alt: "Holiday Geek Cup vous aide à valoriser l'image de votre collectivité",
        },
        titleStart: "Valoriser",
        titleAccent: "votre image",
        text: "Associez votre collectivité à un événement moderne, dynamique et innovant.",
        framing: "normal",
      },
      {
        image: {
          src: "/new-assets/why-us/hgc-dynamiser-le-territoire.webp",
          alt: "Holiday Geek Cup aide votre collectivité à dynamiser son territoire",
        },
        titleStart: "Dynamiser",
        titleAccent: "le territoire",
        text: "Attirez du public, soutenez le commerce local et animez vos quartiers.",
        framing: "normal",
      },
      {
        image: {
          src: "/new-assets/why-us/hgc-accompagner-la-jeunesse.webp",
          alt: "Holiday Geek Cup aide votre collectivité à accompagner la jeunesse",
        },
        titleStart: "Accompagner",
        titleAccent: "la jeunesse",
        text: "Proposez des activités positives, éducatives et ludiques pour les jeunes.",
        framing: "reduit",
      },
      {
        image: {
          src: "/new-assets/why-us/hgc-evenement-securise.webp",
          alt: "Holiday Geek Cup garantit des événements sécurisés",
        },
        titleStart: "Événement",
        titleAccent: "sécurisé",
        text: "Une organisation professionnelle avec du matériel adapté et des équipes formées.",
        framing: "tresReduit",
      },
    ],
  },

  figures: {
    title: "HGC en quelques chiffres",
    backgroundImage: { src: "/new-assets/bg-section-chiffres.webp", alt: "" },
    items: [
      {
        value: 10.3,
        decimals: 1,
        prefix: "+ de ",
        suffix: " k",
        label: "joueurs / an",
      },
      {
        value: 67,
        decimals: 0,
        prefix: "+ de ",
        suffix: "",
        label: "événements / an",
      },
      {
        value: 80,
        decimals: 0,
        prefix: "+ de ",
        suffix: " k",
        label: "visiteurs touchés / an",
      },
      {
        value: 20,
        decimals: 0,
        prefix: "+ de ",
        suffix: "",
        label: "villes partenaires",
      },
    ],
  },

  solutions: {
    title: "Nos solutions clés en main",
    cards: [
      {
        image: {
          src: "/new-assets/services/bg-card-tournois-competitions.webp",
          alt: "Holiday Geek Cup organise des tournois e-sport sur les jeux les plus populaires",
        },
        icon: { src: "/new-assets/icons/icon-trophy.webp", alt: "" },
        title: "Tournois et compétitions",
        text: "Organisez des tournois e-sport sur les jeux les plus populaires (FC26, Fortnite, Rocket League, Valorant, Mario Kart...).",
      },
      {
        image: {
          src: "/new-assets/services/bg-card-animations-espaces-gaming.webp",
          alt: "Holiday Geek Cup propose des animations et espaces gaming pour les collectivités",
        },
        icon: { src: "/new-assets/icons/icon-trophy.webp", alt: "" },
        title: "Animations & Espaces Gaming",
        text: "Espaces en accès libre, animations multi-jeux, simulateurs...",
      },
      {
        image: {
          src: "/new-assets/services/bg-card-actions-educatives.webp",
          alt: "Holiday Geek Cup propose des actions éducatives pour les collectivités",
        },
        icon: { src: "/new-assets/icons/icon-trophy.webp", alt: "" },
        title: "Actions éducatives",
        text: "Sensibilisation au numérique, ateliers pédagogiques, découverte des métiers de l'e-sport.",
      },
    ],
  },

  testimonials: {
    eyebrow: "Ils nous ont fait confiance",
    title: "Des collectivités satisfaites",
    intro:
      "Holiday Geek Cup accompagne les villes, mairies, intercommunalités et établissements publics dans la réussite de leurs événements.",
    button: { label: "Voir nos événements", href: "/evenements" },
    items: [
      {
        quote:
          "Un événement parfaitement organisé, qui a rassemblé toutes les générations et dynamisé notre commune. Les jeunes en parlent encore !",
        authorLogo: {
          src: "/api/media/file/logo_ville-lillers-1.png",
          alt: "Ville de Lillers",
        },
        authorName: "Ville de Lillers",
        eventLabel: "Événement « Lillers Game Show » - 2023",
      },
    ],
  },

  partners: {
    subtitle: "",
    title: "Nos partenaires",
    logos: [
      { alt: "Ville de Lens", src: "/api/media/file/logo_ville-lens-1.png" },
      {
        alt: "Ville de Lillers",
        src: "/api/media/file/logo_ville-lillers-1.png",
      },
      { alt: "Solillers", src: "/api/media/file/logo_solillers-1.png" },
      {
        alt: "Ville de Ronchin",
        src: "/api/media/file/logo_ville-ronchin-1.png",
      },
      {
        alt: "Ville de Marcq-en-Barœul",
        src: "/api/media/file/logo_ville-marcq-en-baroeule-1.png",
      },
      {
        alt: "Ville de Wingles",
        src: "/api/media/file/logo_ville-wingles-1.png",
      },
      {
        alt: "Ville de Loos-en-Gohelle",
        src: "/api/media/file/logo_ville-loos-en-gohelle-1.png",
      },
      {
        alt: "Ville d'Isbergues",
        src: "/api/media/file/logo_ville-isbergues-1.png",
      },
      {
        alt: "Ville de Lestrem",
        src: "/api/media/file/logo_ville-lestrem-1.png",
      },
    ],
  },

  seo: {
    title: "Événements gaming pour les collectivités | Holiday Geek Cup",
    description:
      "Holiday Geek Cup conçoit et organise des événements gaming sur-mesure pour les villes, mairies et intercommunalités : tournois esport, espaces d’animation et actions éducatives clés en main.",
  },
};
