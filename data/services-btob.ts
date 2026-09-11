import { ServiceBtoB } from "@/types/pages/service-btob";

// ============================================================
// SERVICES BtoB — Organisations & Projets (Collectivités)
// Contenu des 4 projets phares issu de la plaquette commerciale 2026.
// Cité Éducative & Espace Social Gaming Emploi = placeholders (isDraft),
// contenu à fournir par le client (absent de la plaquette).
//
// ⚠️ Assets (logos PNG transparents, photos recap HD) à fournir par le client
// (cahier des charges §3.4). Les chemins /assets/img/services/... sont des
// emplacements cibles ; Gaming House Tour réutilise les assets existants.
// ============================================================

export const servicesBtoB: ServiceBtoB[] = [
  {
    id: "gaming-house-tour",
    target: "btob",
    title: "Gaming House Tour",
    tagline:
      "Maisons de jeu vidéo temporaires dans les quartiers prioritaires.",
    logo: "",
    color: "#FC902E",
    cardThumbnail:
      "/assets/img/events/gaming-house-tour/2026/ght_thumbnail.png",
    heroBanner:
      "/assets/img/events/gaming-house-tour/2026/ght_banniere_desk.png",
    heroBannerMobile:
      "/assets/img/events/gaming-house-tour/2026/ght_banniere_mobile.png",
    shortDescription:
      "Maisons de jeu vidéo temporaires implantées par semaines dans les centres sociaux des quartiers prioritaires pendant les vacances scolaires. PC, tournois et ateliers en accès libre, gratuitement.",
    stats: [
      { value: 600, plus: true, label: "Participants par an" },
      { value: 4, plus: true, label: "Sessions par an" },
    ],
    content: [
      {
        type: "text",
        content: [
          {
            type: "paragraph",
            paragraphs: [
              "Maisons de jeu vidéo temporaires implantées par semaines dans les centres sociaux des quartiers prioritaires pendant les vacances scolaires. PC, tournois, ateliers en accès libre gratuitement.",
            ],
          },
          {
            type: "title",
            title: "Objectifs",
          },
          {
            type: "list",
            items: [
              "Offrir un accès gratuit à des équipements gaming de qualité aux jeunes QPV",
              "Réduire l'isolement social pendant les vacances scolaires",
              "Dynamiser les quartiers prioritaires via le jeu vidéo",
            ],
          },
        ],
      },
      {
        type: "ageDistribution",
        buckets: [
          { label: "8-16 ans", percent: 74 },
          { label: "16-25 ans", percent: 10 },
          { label: "25+", percent: 12 },
        ],
      },
      {
        type: "text",
        content: [
          { type: "title", title: "Format" },
          {
            type: "list",
            items: ["Sessions de plusieurs jours pendant les vacances scolaires"],
          },
        ],
      },
      {
        type: "roleSplit",
        cityItems: [
          "Mise à disposition du local ou centre social",
          "Soutien logistique (accueil, sécurité)",
          "Relais communication locale",
        ],
        hgcItems: [
          "Tout le matériel gaming (PC, écrans, périphériques)",
          "Animation et encadrement par nos équipes",
          "Programme tournoi & free play",
          "Communication et billetterie gratuite",
          "Bilan chiffré post-événement",
        ],
      },
      {
        type: "highlight",
        text: "Pour les communes en QPV, ce projet peut être totalement pris en charge dans le cadre de nos dispositifs partenaires. Contactez-nous pour vérifier votre éligibilité.",
      },
    ],
  },
  {
    id: "summer-tour",
    target: "btob",
    title: "Summer Tour",
    tagline:
      "Tournée estivale d'événements itinérants pour animer les territoires.",
    logo: "",
    color: "#3EB7C4", // provisoire — à caler sur le logo officiel
    cardThumbnail: "/assets/img/services/summer-tour/thumbnail_summer-tour.png",
    heroBanner: "/assets/img/services/summer-tour/banner-desktop_summer-tour.png",
    heroBannerMobile: "/assets/img/services/summer-tour/banner-mobile_summer-tour.png",
    shortDescription:
      "Tournée estivale d'événements itinérants visant à animer différents lieux avec des activités, animations et expériences conviviales pour le public.",
    stats: [
      { value: 22, plus: true, label: "Communes visées", sublabel: "Objectif 2026" },
      { value: 1000, plus: true, label: "Participants visés", sublabel: "Objectif 2026" },
    ],
    content: [
      {
        type: "text",
        content: [
          {
            type: "paragraph",
            paragraphs: [
              "Tournée estivale d'événements itinérants visant à animer différents lieux avec des activités, animations et expériences conviviales pour le public.",
            ],
          },
          { type: "title", title: "Objectifs" },
          {
            type: "list",
            items: [
              "Couvrir un maximum de territoires en Hauts-de-France",
              "Animer les espaces publics et fêtes municipales estivales",
              "Structurer nos événements",
            ],
          },
        ],
      },
      {
        type: "ageDistribution",
        buckets: [
          { label: "8-16 ans", percent: 52 },
          { label: "16-25 ans", percent: 23 },
          { label: "25+ ans", percent: 25 },
        ],
      },
      {
        type: "text",
        content: [
          { type: "title", title: "Format" },
          {
            type: "list",
            items: ["Regroupement de plusieurs événements pendant les vacances d'été"],
          },
        ],
      },
      {
        type: "roleSplit",
        cityItems: [
          "Mise à disposition du local ou centre social",
          "Soutien logistique (accueil, sécurité, équipement, relais communication)",
          "Relais communication locale",
        ],
        hgcItems: [
          "Tout le matériel gaming (PC, écrans, périphériques)",
          "Animation et encadrement par nos équipes",
          "Programme tournoi & free play",
          "Communication et billetterie gratuite",
          "Bilan chiffré post-événement",
        ],
      },
    ],
  },
  {
    id: "tournois-majeurs",
    target: "btob",
    title: "Tournois Majeurs",
    tagline: "Des événements esport sur mesure pour votre territoire.",
    logo: "/assets/logos/services/logo-tournois-majeurs.png",
    color: "#6E38B4",
    cardThumbnail: "/assets/img/services/tournois-majeurs/thumbnail_tournois-majeurs.png",
    heroBanner: "/assets/img/services/tournois-majeurs/banner-desktop_tournois-majeurs.png",
    heroBannerMobile: "/assets/img/services/tournois-majeurs/banner-mobile_tournois-majeurs.png",
    shortDescription:
      "HGC organise des évènements sur mesure selon les besoins spécifiques des villes ou des partenaires, avec animations et compétitions de jeux vidéo adaptées aux objectifs définis.",
    stats: [
      { type: "euros", value: 3000, plus: false, label: "Cashprize par an" },
      { value: 5, plus: true, label: "Événements par an" },
    ],
    content: [
      {
        type: "text",
        content: [
          {
            type: "paragraph",
            paragraphs: [
              "HGC propose d'organiser des évènements sur mesure en fonction des besoins spécifiques des villes ou des partenaires, en créant des animations et compétitions de jeux vidéo adaptées aux objectifs définis.",
            ],
          },
          { type: "title", title: "Objectifs" },
          {
            type: "list",
            items: [
              "Adapter l'offre d'événements esportifs aux besoins spécifiques des communes et des partenaires.",
              "Créer des événements attractifs qui respectent les objectifs de gratuité et d'accessibilité.",
            ],
          },
        ],
      },
      {
        type: "ageDistribution",
        buckets: [
          { label: "8-16 ans", percent: 65 },
          { label: "16-25 ans", percent: 10 },
          { label: "25+ ans", percent: 25 },
        ],
      },
      {
        type: "text",
        content: [
          { type: "title", title: "Format" },
          {
            type: "list",
            items: [
              "Journée complète ou week-end, en salle municipale",
              "Présence de casters professionnels et animation scène",
            ],
          },
        ],
      },
      {
        type: "roleSplit",
        cityItems: [
          "Mise à disposition de la salle ou espace public",
          "Soutien logistique (accueil, sécurité)",
          "Relais communication locale",
        ],
        hgcItems: [
          "Tout le matériel gaming (PC, écrans, périphériques)",
          "Installation complète (scène, matériel, son, lumières)",
          "Animation et commentateurs",
          "Organisation des brackets et arbitrage",
          "Communication digitale complète",
          "Photos/vidéos récap exploitables",
        ],
      },
    ],
  },
  {
    id: "conferences",
    target: "btob",
    title: "Conférences",
    tagline:
      "Sensibilisation et prévention numérique en milieu scolaire.",
    logo: "/assets/logos/services/logo-conferences.png",
    color: "#2E6FB5",
    cardThumbnail: "/assets/img/services/conferences/thumbnail_conferences.png",
    heroBanner: "/assets/img/services/conferences/banner-desktop_conferences.png",
    heroBannerMobile: "/assets/img/services/conferences/banner-mobile_conferences.png",
    shortDescription:
      "Conférences et ateliers pédagogiques dans les établissements scolaires : PEGI, cyberdépendance, numérique responsable et lutte contre le cyberharcèlement.",
    content: [
      {
        type: "text",
        content: [
          {
            type: "paragraph",
            paragraphs: [
              "HGC mobilise des intervenants de référence pour animer des conférences et ateliers dans les établissements scolaires : PEGI et classification des jeux, cyberdépendance, usage responsable du numérique, lutte contre le cyberharcèlement. Des contenus pédagogiques, interactifs et adaptés à chaque tranche d'âge.",
            ],
          },
        ],
      },
      {
        type: "speakers",
        speakers: [
          {
            name: "Nicolas Besombes",
            role: "Sociologue spécialiste de l'esport, chercheur reconnu au niveau national",
          },
          {
            name: "Alexandre Mwaka",
            role: "Vice-Président et membre C.A. de l'Union des Associations Esportives de France",
          },
          {
            name: "Sylvain Régnier",
            role: "Fondateur HGC, praticien terrain et expert en médiation numérique",
          },
        ],
      },
      {
        type: "themes",
        items: [
          {
            title: "Système PEGI",
            description: "Comment lire et utiliser les classifications des jeux",
          },
          {
            title: "Cyberdépendance",
            description: "Signes, prévention, dialogue parents-enfants",
          },
          {
            title: "Numérique responsable",
            description: "Vie privée, réseaux sociaux, identité en ligne",
          },
          {
            // La plaquette imprime "Cyberdépendance" ici, mais l'intro parle de
            // lutte contre le cyberharcèlement → libellé corrigé (à valider client).
            title: "Cyberharcèlement",
            description: "Reconnaître, réagir, accompagner",
          },
        ],
      },
    ],
  },
  {
    id: "cite-educative",
    target: "btob",
    title: "Cité Éducative",
    tagline: "",
    color: "#6240cf",
    cardThumbnail: "/assets/img/services/cite-educ/thumbnail_cite-educ.png",
    heroBanner: "/assets/img/services/cite-educ/banner-desktop_cite-educ.png",
    heroBannerMobile: "/assets/img/services/cite-educ/banner-mobile_cite-educ.png",
    shortDescription:
      "Contenu en cours de préparation. Détails à venir sur ce service.",
    isDraft: true, // absent de la plaquette — contenu à fournir par le client
    content: [],
  },
  {
    id: "espace-social-gaming-emploi",
    target: "btob",
    title: "Espace Social Gaming Emploi",
    tagline: "",
    logo: "/assets/logos/services/logo-espace-social-gaming-emploi.png",
    color: "#8b5cf6",
    cardThumbnail: "/assets/img/services/espace-gaming-emploi/thumbnail_espace-gaming-emploi.png",
    heroBanner: "/assets/img/services/espace-gaming-emploi/banner-desktop_espace-gaming-emploi.png",
    heroBannerMobile: "/assets/img/services/espace-gaming-emploi/banner-mobile_espace-gaming-emploi.png",
    shortDescription:
      "Contenu en cours de préparation. Détails à venir sur ce service.",
    isDraft: true, // absent de la plaquette — contenu à fournir par le client
    content: [],
  },
];

export default servicesBtoB;
