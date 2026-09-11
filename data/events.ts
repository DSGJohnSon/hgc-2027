import { Event } from "@/types/pages/detail-event";

export const events: Event[] = [
  {
    id: "bollaert-cup-2026",
    type: "both",
    title: "Bollaert Cup – Tournoi FC 26",
    startDate: "2026-05-13",
    startTime: "18h00",
    endTime: "21h00",
    cardThumbnail:
      "/assets/img/events/bollaert-cup-2026/thumbnail_bollaert-cup-2026.png",
    heroBanner:
      "/assets/img/events/bollaert-cup-2026/banner_bollaert-cup-2026_desktop.png",
    heroBannerMobile:
      "/assets/img/events/bollaert-cup-2026/banner_bollaert-cup-2026_mobile.png",
    location: "Stade Bollaert, Lens",
    gameId: ["fc26"],
    color: "#FD0113",
    isCancelled: false,
    description: [
      {
        type: "text",
        content: [
          {
            type: "paragraph",
            paragraphs: [
              "Le mercredi 13 mai, le Stade Bollaert nous accueille pour la Bollaert Cup : un tournoi sur le jeu FC 26 avant le match RC Lens vs PSG. Viens défier d'autres joueurs en 1 vs 1 sur FC 26 avant le coup d'envoi, et tente de remporter des goodies, aucune inscription préalable nécessaire, il suffit d'avoir un billet pour le match pour participer ! Pas là pour le tournoi ? Pas de souci ! Un espace Free Play est dispo sur place pour jouer entre amis et profiter de l'ambiance avant le match.",
            ],
          },
        ],
      },
    ],
    freeplayGames: [
      "fc25",
      "fc26",
      "fortnite",
      "valorant",
      "mariokart8",
      "rocket_league",
      "amongus",
      "fall_guys",
      "just_dance",
      "nintendo_switch_sports",
      "tombraider",
      "mariokart_world",
      "luigi_mansion_3",
      "super_mario_galaxy_2",
      "life_is_strange_2",
      "clair_obscur_expedition_33",
      "heavy_rain",
      "firewatch",
      "la_noire",
      "detective_pikachu_returns",
      "the_secret_of_monkey_island",
      "oxenfree_2",
      "sherlock_holmes_crimes_punishments",
      "syberia",
      "secret_neighbor",
      "agatha_christie_2",
      "the_vanishing_of_ethan_carter",
      "twin_mirror",
      "riven",
    ],
    randomizeFreeplayGames: false,
    weezeventCode:
      '',
    registrationOpen: false,
    partners: [
      {
        alt: "RC Lens",
        src: "/assets/logos/partners/logo_rc_lens.svg",
      },
      {
        alt: "CDOS Pas de Calais",
        src: "/assets/logos/partners/logo_cdos_pas-de-calais.png",
      },
    ],
  },
  {
    id: "tournoi-isbergues-2026",
    type: "both",
    title: "Tournoi Fortnite / Mario Kart Isbergues",
    startDate: "2026-05-24",
    startTime: "10h00",
    endTime: "18h00",
    cardThumbnail:
      "/assets/img/events/tournoi-isbergues-2026/thumbnail_tournoi_isbergues_2026.png",
    heroBanner:
      "/assets/img/events/tournoi-isbergues-2026/banner_tournoi_isbergues_2026_desktop.png",
    heroBannerMobile:
      "/assets/img/events/tournoi-isbergues-2026/banner_tournoi_isbergues_2026_mobile.png",
    location: "Complexe Edmond Mille, 62330 Isbergues",
    gameId: ["mariokart_world", "fortnite"],
    color: "#154398",
    isCancelled: false,
    description: [
      {
        type: "text",
        content: [
          {
            type: "title",
            title: "OUVERTURE DE LA BILLETERIE LE 24 AVRIL À 10H00 !",
          },
          {
            type: "paragraph",
            paragraphs: [
              "Le dimanche 24 mai, le Complexe Edmond Mille se transforme en maison du gaming en vous proposant deux tournois, un sur Mario Kart World et l'autre sur Fortnite, ainsi qu'un espace free-play accessible à tous !",
              "Tournois : 96 joueurs au total",
            ],
          },
          {
            type: "list",
            items: [
              "Mario Kart : 32 joueurs | Cashprize : 350 € | De 11H à 13H",
              "Fortnite : 64 joueurs | Cashprize : 350 € | De 14H à 18H",
            ],
          },
          {
            type: "paragraph",
            paragraphs: [
              "Récompenses : Un cashprize total de 700 € réparti sur les deux tournois pour récompenser les meilleurs pilotes et tireurs !",
              "Free-Play : En parallèle de la compétition, profitez d'un accès libre à de nombreux jeux toute la journée (Fall Guys, Rocket League, FC 25, etc) pour jouer entre amis.",
              "L'inscription est entièrement gratuite !",
            ],
          },
          {
            type: "paragraph",
            paragraphs: ["Lieu et horaires :"],
          },
          {
            type: "list",
            items: [
              "Adresse : Complexe Edmond Mille, 62330 Isbergues",
              "Horaires globaux : De 10H00 à 18H00",
              "Entrée : Gratuite",
            ],
          },
        ],
      },
    ],
    transports: {
      bus: [
        {
          lines: ["2314"],
          station: "Berguette - Isbergues",
          walkTimeInMin: 4,
        },
      ],
      car: {
        parkings: [
          {
            name: "Parking Complexe Edmond Mille",
            address: "Complexe Edmond Mille, 62330 Isbergues",
            distanceInMeters: 0,
            walkTimeInMin: 0,
          },
        ],
      },
    },
    freeplayGames: [
      "fortnite",
      "valorant",
      "mariokart8",
      "fc25",
      "rocket_league",
      "amongus",
      "fall_guys",
      "just_dance",
      "nintendo_switch_sports",
      "tombraider",
      "mariokart_world",
      "fc26",
      "luigi_mansion_3",
      "super_mario_galaxy_2",
      "life_is_strange_2",
      "clair_obscur_expedition_33",
      "heavy_rain",
      "firewatch",
      "la_noire",
      "detective_pikachu_returns",
      "the_secret_of_monkey_island",
      "oxenfree_2",
      "sherlock_holmes_crimes_punishments",
      "syberia",
      "secret_neighbor",
      "agatha_christie_2",
      "the_vanishing_of_ethan_carter",
      "twin_mirror",
      "riven",
    ],
    randomizeFreeplayGames: false,
    weezeventCode:
      '<a title="Logiciel billetterie en ligne"   href="https://weezevent.com/?c=sys_widget"   class="weezevent-widget-integration"   data-src="https://widget.weezevent.com/ticket/E1951411/?code=3097&locale=fr-FR&width_auto=1&color_primary=00aeef"   data-width="650"   data-height="600"   data-id="1951411"   data-resize="1"   data-width_auto="1"   data-noscroll="0"   data-use-container="yes"   data-type="neo"   target="_blank">Billetterie Weezevent</a><script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>',
    registrationOpen: true,
    partners: [
      {
        alt: "Ville d'Isbergues (62)",
        src: "/assets/logos/partners/logo_isbergues.png",
      },
    ],
  },
  {
    id: "pathe-mario-galaxy-2026",
    type: "event",
    title: "Pathé Mario Galaxy",
    startDate: "2026-04-04",
    startTime: "13h00",
    endTime: "20h00",
    cardThumbnail:
      "/assets/img/events/pathe-mario-galaxy-2026/pathe-mario-galaxy-2026_thumbnail.png",
    heroBanner:
      "/assets/img/events/pathe-mario-galaxy-2026/pathe-mario-galaxy-2026_desktop.png",
    heroBannerMobile:
      "/assets/img/events/pathe-mario-galaxy-2026/pathe-mario-galaxy-2026_mobile.png",
    location: "Cinéma Pathé Liévin – Rue François Courtin, Liévin",
    gameId: ["super_mario_galaxy_2"],
    color: "#C31B50",
    isCancelled: false,
    description: [
      {
        type: "text",
        content: [
          {
            type: "paragraph",
            paragraphs: [
              "Holiday Geek Cup et Pathé présentent le Pathé Mario Galaxy ! Venez profiter d'une journée gaming en accès libre au Cinéma Pathé de Liévin, le samedi 4 avril de 13h à 20h. Jouez à une sélection de jeux Mario en accès libre, et profitez des séances du film Mario Galaxy le film tout au long de la journée.",
            ],
          },
        ],
      },
    ],
    freeplayGames: [
      "super_mario_galaxy_1",
      "super_mario_galaxy_2",
      "super_mario_odyssey",
      "mariokart_live",
      "new_super_mario_bros",
      "new_super_mario_bros_2",
      "new_super_mario_bros_u_deluxe",
      "super_mario_maker_2",
      "mario_kart_wii",
      "mariokart_world",
    ],
    randomizeFreeplayGames: false,
    weezeventCode:
      '<a title="Logiciel billetterie en ligne\"   href=\"https://weezevent.com/?c=sys_widget\"   class=\"weezevent-widget-integration\"   data-src=\"https://widget.weezevent.com/ticket/E1875811/?code=2526&locale=fr-FR&width_auto=1&color_primary=00AEEF\"   data-width=\"650\"   data-height=\"600\"   data-id=\"1875811\"   data-resize=\"1\"   data-width_auto=\"1\"   data-noscroll=\"0\"   data-use-container=\"yes\"   data-type=\"neo\"   target=\"_blank\">Billetterie Weezevent</a><script type=\"text/javascript\" src=\"https://widget.weezevent.com/weez.js\"></script>',
    registrationOpen: true,
    partners: [
      {
        alt: "Pathé",
        src: "/assets/logos/partners/logo-pathe.png",
      },
    ],
  },
  {
    id: "tournoi-fortnite-lestrem-2026",
    type: "both",
    title: "Tournoi Fortnite lestrem",
    startDate: "2026-04-19",
    startTime: "14h00",
    endTime: "22h00",
    cardThumbnail:
      "/assets/img/events/tournoi-fortnite-lestrem-2026/thumbnail_tournoi_fortnite_lestrem_2026.png",
    heroBanner:
      "/assets/img/events/tournoi-fortnite-lestrem-2026/banner_tournoi_fortnite_lestrem_2026_desktop.png",
    heroBannerMobile:
      "/assets/img/events/tournoi-fortnite-lestrem-2026/banner_tournoi_fortnite_lestrem_2026_mobile.png",
    location:
      "Espace Culturel Jean de la Fontaine – 301 Allée Pierre Macquart, 62136 Lestrem",
    gameId: ["fortnite"],
    color: "#6E3045",
    isCancelled: false,
    description: [
      {
        type: "text",
        content: [
          {
            type: "paragraph",
            paragraphs: [
              "Le dimanche 19 avril, l'Espace Culturel Jean de la Fontaine accueille un tournoi sur Fortnite ultra compétitif avec 100 joueurs pour un cashprize de 1 300€ comprenant une PS5, une Nintendo Switch et 300€ de cartes cadeaux.",
              "Pas là pour le tournoi ? Pas de souci ! Un espace Free Play est dispo sur place pour jouer entre amis et profiter de l'ambiance toute la journée.",
              "Le tout pour seulement 1€ pour l’accès au tournoi. Zéro excuse pour pas venir",
            ],
          },
        ],
      },
    ],
    freeplayGames: [
      "fortnite",
      "valorant",
      "mariokart8",
      "fc25",
      "rocket_league",
      "amongus",
      "fall_guys",
      "just_dance",
      "nintendo_switch_sports",
      "tombraider",
      "mariokart_world",
      "fc26",
      "luigi_mansion_3",
      "super_mario_galaxy_2",
      "life_is_strange_2",
      "clair_obscur_expedition_33",
      "heavy_rain",
      "firewatch",
      "la_noire",
      "detective_pikachu_returns",
      "the_secret_of_monkey_island",
      "oxenfree_2",
      "sherlock_holmes_crimes_punishments",
      "syberia",
      "secret_neighbor",
      "agatha_christie_2",
      "the_vanishing_of_ethan_carter",
      "twin_mirror",
      "riven",
    ],
    randomizeFreeplayGames: false,
    weezeventCode:
      '<a title="Logiciel billetterie en ligne" href="https://weezevent.com/?c=sys_widget" class="weezevent-widget-integration" data-src="https://widget.weezevent.com/ticket/E1803771/?code=42919&locale=fr-FR&width_auto=1&color_primary=00AEEF" data-width="650" data-height="600" data-id="1803771" data-resize="1" data-width_auto="1" data-noscroll="0" data-use-container="yes" data-type="neo" target="_blank">Billetterie Weezevent</a><script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>',
    registrationOpen: true,
    partners: [
      {
        alt: "Ville de Lestrem (62)",
        src: "/assets/logos/partners/logo-ville-lestrem.svg",
      },
    ],
  },
  {
    id: "polar-lens-2026",
    type: "event",
    title: "Polar Lens 2026",
    startDate: "2026-03-21",
    endDate: "2026-03-22",
    cardThumbnail:
      "/assets/img/events/polar-lens-2026/thumbnail_polar_lens_2026.png",
    heroBanner:
      "/assets/img/events/polar-lens-2026/banner_polar_lens_2026_desktop.png",
    heroBannerMobile:
      "/assets/img/events/polar-lens-2026/banner_polar_lens_2026_mobile.png",
    location: "Maison Syndicale de Lens, 62300 LENS",
    categoryId: ["polarLens"],
    gameId: [
      "luigi_mansion_3",
      "super_mario_galaxy_2",
      "detective_pikachu_returns",
      "firewatch",
      "riven",
      "the_secret_of_monkey_island",
      "la_noire",
      "heavy_rain",
      "the_vanishing_of_ethan_carter",
      "agatha_christie_2",
      "oxenfree_2",
      "syberia",
      "life_is_strange_2",
      "twin_mirror",
      "secret_neighbor",
      "clair_obscur_expedition_33",
      "sherlock_holmes_crimes_punishments",
    ],
    color: "#DAA019",
    isCancelled: false,
    description: [
      {
        type: "text",
        content: [
          {
            type: "paragraph",
            paragraphs: [
              "Dans le cadre du salon Polar Lens, l'association Holiday Geek Cup propose une immersion numérique dédiée à l'enquête et au mystère. Venez découvrir un espace Free Play exceptionnel avec 11 postes PC et des consoles de dernière génération. Venez profitez d'un moment ludique et gratuit ouvert à tous, encadré par notre staff expert.",
            ],
          },
        ],
      },
    ],
    transports: {
      bus: [
        {
          lines: ["5", "33", "39", "91"],
          station: "Cantin Salengro",
          walkTimeInMin: 3,
        },
        {
          lines: ["33", "37", "39", "1508"],
          station: "4 Septembre",
          walkTimeInMin: 2,
        },
        {
          lines: ["33", "39"],
          station: "Eugene Thomas",
          walkTimeInMin: 6,
        },
      ],
      car: {
        parkings: [
          {
            name: "Parking Roger Salengro",
            address: "Parking Roger Salengro, 62300 LENS",
            distanceInMeters: 190,
            walkTimeInMin: 3,
          },
          {
            name: "Parking Place Jean Jaurès",
            address: "17 B Pl. Jean Jaurès, 62300 LENS",
            distanceInMeters: 550,
            walkTimeInMin: 8,
          },
          {
            name: "Parking Cantin",
            address: "Rue de la Paix, 62300 LENS",
            distanceInMeters: 650,
            walkTimeInMin: 9,
          },
        ],
      },
    },
    freeplayGames: [
      "luigi_mansion_3",
      "super_mario_galaxy_2",
      "detective_pikachu_returns",
      "firewatch",
      "riven",
      "the_secret_of_monkey_island",
      "la_noire",
      "heavy_rain",
      "the_vanishing_of_ethan_carter",
      "agatha_christie_2",
      "oxenfree_2",
      "syberia",
      "life_is_strange_2",
      "twin_mirror",
      "secret_neighbor",
      "clair_obscur_expedition_33",
      "sherlock_holmes_crimes_punishments",
    ],
    weezeventCode:
      '<a title="Logiciel billetterie en ligne"   href="https://weezevent.com/?c=sys_widget"   class="weezevent-widget-integration"   data-src="https://widget.weezevent.com/ticket/E1796197/?code=39841&locale=fr-FR&width_auto=1&color_primary=00AEEF"   data-width="650"   data-height="600"   data-id="1796197"   data-resize="1"   data-width_auto="1"   data-noscroll="0"   data-use-container="yes"   data-type="neo"   target="_blank">Billetterie Weezevent</a><script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>',
    registrationOpen: true,
    partners: [
      {
        alt: "Ville de Lens",
        src: "/assets/logos/partners/logo-lens-ville.svg",
      },
    ],
  },
  {
    id: "2h-de-sport-2025",
    type: "event",
    title: "2h de sport au collège",
    startDate: "2025-01-01",
    endDate: "2025-06-30",
    cardThumbnail:
      "/assets/img/events/2h-de-sport-2025/thumbnail_2h_de_sport.png",
    heroBanner:
      "/assets/img/events/2h-de-sport-2025/banner_2h_de_sport_desktop.png",
    heroBannerMobile:
      "/assets/img/events/2h-de-sport-2025/banner_2h_de_sport_mobile.png",
    location: "Collège Charles Péguy, Arras",
    categoryId: [],
    gameId: ["just_dance", "nintendo_switch_sports"],
    color: "#6B46D8",
    isCancelled: false,
    description: [
      {
        type: "text",
        content: [
          {
            type: "paragraph",
            paragraphs: [
              "Dans le cadre du dispositif national des '2 heures de sport en plus au collège', Holiday geek cup et le collège Charles Peguy à Arras ont lancé une initiative innovante pour réconcilier tous les élèves avec l'activité physique.",
            ],
          },
          {
            type: "title",
            title: "Une mission : Le sport pour tous",
          },
          {
            type: "paragraph",
            paragraphs: [
              "L'objectif principal de ces sessions est clair : inclure. Nous ciblons en priorité les élèves qui se sentent parfois éloignés des pratiques sportives traditionnelles ou qui rencontrent des difficultés en EPS.",
              "Dans ses sessions nous avons levé les barrières de l'appréhension et du jugement pour laisser place au plaisir pur du mouvement.",
            ],
          },
          {
            type: "title",
            title: "Des activités ludiques et variées",
          },
          {
            type: "paragraph",
            paragraphs: [
              "Pendant ces rendez-vous, les élèves se sont affrontés ou ont collaboré sur divers jeux sportifs : ",
            ],
          },
          {
            type: "list",
            items: [
              "Just Dance : Pour travailler le cardio, la coordination et l'expression corporelle de manière festive.",
              "Nintendo Switch Sports : Pour s'initier aux gestes techniques du tennis, du bowling ou du chambara dans une ambiance conviviale et stimulante.",
            ],
          },
          {
            type: "citation",
            citationText:
              "Ici, on ne cherche pas la performance athlétique, mais le plaisir de bouger ensemble. Le jeu devient un levier de confiance en soi.",
          },
          {
            type: "paragraph",
            paragraphs: [
              "Ce dispositif a permis de créer une dynamique de groupe positive, où chaque élève, quel que soit son niveau initial, a pu trouver sa place et dépenser de l'énergie avec le sourire.",
            ],
          },
        ],
      },
      {
        type: "statistics",
        content: {
          stats: [
            {
              value: 17,
              plus: false,
              label: "Sessions",
              sublabel: "Organisées tout au long de l'année.",
            },
            {
              value: 2,
              plus: false,
              label: "Heures",
              sublabel: "De pratique active par créneau.",
            },
            {
              value: 175,
              plus: false,
              label: "Joueurs",
              sublabel: "Au total ont relevé le défi.",
            },
          ],
        },
      },
      {
        type: "gallery",
        content: {
          title: "Retour en images",
          subtitle: "Quelques moments capturés lors des 2h de sport au collège",
          images: [
            {
              src: "/assets/img/events/2h-de-sport/gallery/img_event_2h-de-sport_1677.webp",
              alt: "Élèves jouant à Nintendo Switch Sport lors des 2h de sport au collège",
            },
            {
              src: "/assets/img/events/2h-de-sport/gallery/img_event_2h-de-sport_1686.webp",
              alt: "Ambiance de la salle lors des 2h de sport au collège",
            },
            {
              src: "/assets/img/events/2h-de-sport/gallery/img_event_2h-de-sport_2444.webp",
              alt: "Élèves jouant à Just Dance lors des 2h de sport au collège",
            },
            {
              src: "/assets/img/events/2h-de-sport/gallery/img_event_2h-de-sport_8202.webp",
              alt: "Élèves jouant à Nintendo Switch Sports lors des 2h de sport au collège",
            },
          ],
        },
      },
    ],
    freeplayGames: ["just_dance", "nintendo_switch_sports"],
  },
  {
    id: "valorant-series-cite-des-sciences-2025",
    type: "both",
    title: "Valorant series à la Cité des Sciences",
    startDate: "2025-02-22",
    endDate: "2025-02-23",
    cardThumbnail:
      "/assets/img/events/valorant-series-cite-des-sciences-2025/thumbnail_valorant-series-cite-des-sciences-2025.png",
    heroBanner:
      "/assets/img/events/valorant-series-cite-des-sciences-2025/banner_valorant-series-cite-des-sciences-2025_desktop.png",
    heroBannerMobile:
      "/assets/img/events/valorant-series-cite-des-sciences-2025/banner_valorant-series-cite-des-sciences-2025_mobile.png",
    location: "Cité des sciences et de l'industrie, Paris",
    categoryId: [],
    gameId: ["valorant"],
    color: "#E37C1F",
    isCancelled: false,
    description: [
      {
        type: "text",
        content: [
          {
            type: "paragraph",
            paragraphs: [
              "Du 22 au 23 février 2025, nous nous sommes installés dans l'un des lieux les plus emblématiques de la culture scientifique et technique : la Cité des Sciences et de l'Industrie. Pour cet événement d'envergure, nous avons déployé un dispositif complet dédié à l'univers compétitif de Valorant.",
            ],
          },
          {
            type: "title",
            title: '"Valorant Series" : Entre Free Play et Compétition',
          },
          {
            type: "paragraph",
            paragraphs: [
              "Nous avons conçu un espace hybride capable de répondre aux attentes de tous les profils de gamers, du curieux au compétiteur acharné :",
            ],
          },
          {
            type: "list",
            items: [
              "Zone Free Play : optimisées pour permettre au grand public de découvrir un grand nombre de jeux vidéos.",
              "Les Valorant Series : L'organisation d'un tournoi compétitif structuré, offrant aux joueurs une véritable expérience de scène et de compétition \"esportive\".",
            ],
          },
          {
            type: "title",
            title: "Un show animé par Disco Devil",
          },
          {
            type: "paragraph",
            paragraphs: [
              "Pour sublimer l'expérience, nous avons eu le plaisir d'accueillir Disco Devil, animateur, commentateur et host professionnel de la scène jeu vidéo. Sa présence a permis de transformer notre tournois en un véritable spectacle, offrant aux spectateurs une analyse et un dynamisme unique.",
            ],
          },
        ],
      },
      {
        type: "statistics",
        content: {
          stats: [
            {
              value: 5000,
              plus: true,
              label: "visiteurs et joueurs",
              sublabel: "accueillis pendant l'événement.",
            },
          ],
        },
      },
      {
        type: "text",
        content: [
          {
            type: "title",
            title: "Notre expertise en action",
          },
          {
            type: "paragraph",
            paragraphs: [
              "Sur cet événement, nous avons prouvé notre capacité à gérer :",
            ],
          },
          {
            type: "list",
            items: [
              "Le déploiement technique lourd : Installation des matériels gaming, PC/consoles et écrans haute performance et réseaux stables pour le jeu en ligne.",
              "La logistique de flux : Accueillir et orienter 5 000 personnes sur deux journées.",
              'Le "Show Running" : Coordination entre la technique, les joueurs et l\'animation micro pour un événement sans fausse note.',
            ],
          },
        ],
      },
      {
        type: "gallery",
        content: {
          title: "Retour en images",
          subtitle:
            "Quelques moments capturés lors des Valorant Series à la Cité des Sciences 2025",
          images: [
            {
              src: "/assets/img/events/valorant-series-cite-des-sciences-2025/gallery/img_event_valorant_series_cite_des_sciences_2350.webp",
              alt: "Visiteur jouant à Mario Kart 8 sur Nintendo Switch lors des Valorant Series à la Cité des Sciences 2025",
            },
            {
              src: "/assets/img/events/valorant-series-cite-des-sciences-2025/gallery/img_event_valorant_series_cite_des_sciences_2358.webp",
              alt: "Ambiance de la salle lors des Valorant Series à la Cité des Sciences 2025",
            },
            {
              src: "/assets/img/events/valorant-series-cite-des-sciences-2025/gallery/img_event_valorant_series_cite_des_sciences_2375.webp",
              alt: "Vainquer du tournoi au côté de Disco Devil lors des Valorant Series à la Cité des Sciences 2025",
            },
            {
              src: "/assets/img/events/valorant-series-cite-des-sciences-2025/gallery/img_event_valorant_series_cite_des_sciences_2407.webp",
              alt: "Visiteurs jouant à Super Mario Bros U Deluxe sur Nintendo Switch lors des Valorant Series à la Cité des Sciences 2025",
            },
            {
              src: "/assets/img/events/valorant-series-cite-des-sciences-2025/gallery/img_event_valorant_series_cite_des_sciences_2410.webp",
              alt: "Visiteurs jouant à Mario Kart 8 sur Nintendo Switch lors des Valorant Series à la Cité des Sciences 2025",
            },
          ],
        },
      },
    ],
    freeplayGames: ["valorant", "fortnite"],
  },
  {
    id: "fifa-season-2025",
    type: "tournoi",
    title: "Fifa season 2025",
    startDate: "2025-08-30",
    endDate: "2025-08-31",
    cardThumbnail:
      "/assets/img/events/fifa-season-2025/thumbnail_fifa_season_2025.png",
    heroBanner:
      "/assets/img/events/fifa-season-2025/banner_fifa_season_2025_desktop.png",
    heroBannerMobile:
      "/assets/img/events/fifa-season-2025/banner_fifa_season_2025_mobiles.png",
    location: "Salle régionale des sports Maréchal, Harnes",
    categoryId: ["fifaSeason"],
    gameId: ["fc25"],
    color: "#067C6E",
    isCancelled: false,
    description: [
      {
        type: "text",
        content: [
          {
            type: "paragraph",
            paragraphs: [
              "Nous avons eu le plaisir d'organiser et de mettre en place le tournoi \"Fifa Season\", un tournoi d'envergure sur le jeu FC25. Cet événement a opposé les meilleurs talents de deux villes : Harnes et Lens.",
            ],
          },
          {
            type: "title",
            title: "Un parcours de qualification intense",
          },
          {
            type: "paragraph",
            paragraphs: [
              "Pour sélectionner les finalistes, nous avons déployé nos infrastructures sur quatre journées de compétition acharnées :",
            ],
          },
          {
            type: "list",
            items: [
              "Harnes : 2 journées de qualifications locales.",
              "Lens : 2 journées de qualifications locales.",
            ],
          },
          {
            type: "paragraph",
            paragraphs: [
              "Ces étapes ont permis de brasser un large public et de faire monter la pression jusqu'à l'apothéose de la compétition.",
            ],
          },
          {
            type: "title",
            title: "Une Finale d'exception à la Salle Maréchal",
          },
          {
            type: "paragraph",
            paragraphs: [
              "Le 31 août, nous avons organisé la finale dans la Salle régionale des sports Maréchal à Harnes.",
              "Les joueurs se sont affrontés pour la gloire de leur ville, mais aussi pour un enjeu de taille : un Cashprize de 1 500 €.",
            ],
          },
          {
            type: "title",
            title: "Chiffres clés",
          },
          {
            type: "paragraph",
            paragraphs: [
              "Cet événement a confirmé l'engouement massif pour l'esport de proximité et notre capacité à gérer des rassemblements de grande ampleur.",
            ],
          },
        ],
      },
      {
        type: "statistics",
        content: {
          stats: [
            {
              type: "euros",
              value: 1500,
              plus: false,
              label: "de cashprize",
            },
            {
              value: 1900,
              plus: true,
              label: "joueurs & visiteurs",
              sublabel: "durant l'événement",
            },
          ],
        },
      },
      {
        type: "gallery",
        content: {
          title: "Retour en images",
          subtitle: "Quelques moments capturés lors du Fifa Season 2025",
          images: [
            {
              src: "/assets/img/events/fifa-season-2025/gallery/img_event_fifa-season-2025_6263.webp",
              alt: "Visiteur jouant à FC25 sur PC lors du Fifa Season 2025",
            },
            {
              src: "/assets/img/events/fifa-season-2025/gallery/img_event_fifa-season-2025_6264.webp",
              alt: "Visiteurs jouant à FC25 sur PC lors du Fifa Season 2025",
            },
            {
              src: "/assets/img/events/fifa-season-2025/gallery/img_event_fifa-season-2025_6274.webp",
              alt: "Visiteurs regardant un match de qualifications sur FC25 lors du Fifa Season 2025",
            },
          ],
        },
      },
    ],
    freeplayGames: ["fc25"],
  },
  {
    id: "gaming-house-tour-2025",
    type: "event",
    title: "Gaming House Tour 2025",
    startDate: "2025-07-08",
    endDate: "2025-08-09",
    cardThumbnail:
      "/assets/img/events/gaming-house-tour-2025/thumbnail_gaming-house-tour_2025.png",
    heroBanner:
      "/assets/img/events/gaming-house-tour-2025/banner_gaming-house-tour_2025_2_desktop.png",
    heroBannerMobile:
      "/assets/img/events/gaming-house-tour-2025/banner_gaming-house-tour_2025_mobile.png",
    categoryId: ["gamingHouseTour"],
    gameId: [],
    color: "#FC902E",
    isCancelled: false,
    description: [
      {
        type: "text",
        content: [
          {
            type: "title",
            title: "Le Gaming House Tour revient en 2025 !",
          },
          {
            type: "paragraph",
            paragraphs: [
              "Pendant l'été 2025, nous avons transformé les centres sociaux en véritables hubs numériques. Notre mission était d'offrir aux jeunes un espace de loisirs moderne, sécurisant et convivial, directement au sein de leur structure de proximité.",
            ],
          },
          {
            type: "title",
            title: "Le concept : Une semaine 100% Gaming",
          },
          {
            type: "paragraph",
            paragraphs: [
              "L'idée n'était pas seulement de poser des consoles, mais de métamorphoser le centre social pour une durée d'une semaine. Nous avons créé un espace Free Play où chaque jeune a pu :",
            ],
          },
          {
            type: "list",
            items: [
              "Découvrir les dernières nouveautés vidéoludiques.",
              "Partager des moments de convivialité avec ses amis.",
              "S'initier à la pratique du jeu vidéo dans un cadre encadré et bienveillant.",
            ],
          },
          {
            type: "title",
            title: "Chiffres clés",
          },
        ],
      },
      {
        type: "statistics",
        content: {
          stats: [
            {
              value: 5,
              plus: false,
              label: "semaines d'immersion",
            },
            {
              value: 620,
              plus: true,
              label: "joueurs & visiteurs",
            },
          ],
        },
      },
      {
        type: "gallery",
        content: {
          title: "Retour en images",
          subtitle: "Quelques moments capturés lors des Gaming House Tour 2025",
          images: [
            {
              src: "/assets/img/events/gaming-house-tour-2025/gallery/img_event_gaming-house-tour-2025.webp",
              alt: "Visiteurs lors du Gaming House Tour 2025",
            },
            {
              src: "/assets/img/events/gaming-house-tour-2025/gallery/img_event_gaming-house-tour-2025_1046.webp",
              alt: "Visiteur lors du Gaming House Tour 2025",
            },
            {
              src: "/assets/img/events/gaming-house-tour-2025/gallery/img_event_gaming-house-tour-2025_1048.webp",
              alt: "Visiteurs jouant à Mario Kart 8 sur Nintendo Switch lors du Gaming House Tour 2025",
            },
            {
              src: "/assets/img/events/gaming-house-tour-2025/gallery/img_event_gaming-house-tour-2025_1050.webp",
              alt: "Visiteur jouant à FC25 sur PC lors du Gaming House Tour 2025",
            },
            {
              src: "/assets/img/events/gaming-house-tour-2025/gallery/img_event_gaming-house-tour-2025_1052.webp",
              alt: "Visiteur jouant à Mario Kart 8 sur Nintendo Switch lors du Gaming House Tour 2025",
            },
            {
              src: "/assets/img/events/gaming-house-tour-2025/gallery/img_event_gaming-house-tour-2025_1053.webp",
              alt: "Visiteurs jouant à Mario Kart 8 sur Nintendo Switch lors du Gaming House Tour 2025",
            },
            {
              src: "/assets/img/events/gaming-house-tour-2025/gallery/img_event_gaming-house-tour-2025_1166.webp",
              alt: "Visiteur jouant à Mario Kart 8 sur Nintendo Switch lors du Gaming House Tour 2025",
            },
            {
              src: "/assets/img/events/gaming-house-tour-2025/gallery/img_event_gaming-house-tour-2025_1167.webp",
              alt: "Visiteur jouant à Fortnite sur PC lors du Gaming House Tour 2025",
            },
            {
              src: "/assets/img/events/gaming-house-tour-2025/gallery/img_event_gaming-house-tour-2025_5616.webp",
              alt: "Visiteurs jouant à FC25 sur PC devant un panneau sponsor de l'ANCT - Agence nationale de la cohésion des territoires - lors du Gaming House Tour 2025",
            },
          ],
        },
      },
    ],
    freeplayGames: ["fc25", "mariokart8", "fortnite"],
  },
  {
    id: "polar-lens-2025",
    type: "event",
    title: "Polar Lens 2025",
    startDate: "2025-03-22",
    endDate: "2025-03-23",
    cardThumbnail:
      "/assets/img/events/polar-lens-2025/thumbnail_polar_lens_2025.png",
    heroBanner:
      "/assets/img/events/polar-lens-2025/banner_polar_lens_2025_desktop.png",
    heroBannerMobile:
      "/assets/img/events/polar-lens-2025/banner_polar_lens_2025_mobile.png",
    categoryId: ["polarLens"],
    gameId: [],
    color: "#DAA019",
    isCancelled: false,
    description: [
      {
        type: "text",
        content: [
          {
            type: "paragraph",
            paragraphs: [
              "Les 22 et 23 mars 2025, nous avons eu le plaisir de participer au célèbre salon du roman policier, Polar Lens, aux Halles Bertinchamps. Pour cette édition, nous avons relevé un défi passionnant : prouver que le jeu vidéo est un prolongement naturel de la littérature policière.",
            ],
          },
          {
            type: "title",
            title: "Une sélection thématique : Mystère et Investigation",
          },
          {
            type: "paragraph",
            paragraphs: [
              "Pour coller à l'ADN du salon, nous avons conçu un stand sur-mesure mettant en avant des jeux où la réflexion, l'exploration et la déduction sont reines :",
            ],
          },
          {
            type: "list",
            items: [
              "Tomb Raider : Pour l'aventure, la recherche d'indices et l'exploration de mystères anciens.",
              "Among Us : Le phénomène de déduction sociale où chaque joueur doit mener l'enquête pour démasquer l'imposteur.",
              "Et bien d'autres titres orientés \"énigmes`\" pour stimuler l'esprit d'analyse des visiteurs.",
            ],
          },
          {
            type: "title",
            title: "Chiffres clés",
          },
        ],
      },
      {
        type: "statistics",
        content: {
          stats: [
            {
              value: 5800,
              plus: true,
              label: "joueurs & visiteurs",
            },
          ],
        },
      },
      {
        type: "gallery",
        content: {
          title: "Retour en images",
          subtitle: "Quelques moments capturés lors des Gaming House Tour 2025",
          images: [
            {
              src: "/assets/img/events/polar-lens-2025/gallery/img_event_polar-lens-2025_2921.webp",
              alt: "Visiteurs lors du Polar Lens 2025",
            },
            {
              src: "/assets/img/events/polar-lens-2025/gallery/img_event_polar-lens-2025_7669.webp",
              alt: "Visiteurs lors du Polar Lens 2025",
            },
            {
              src: "/assets/img/events/polar-lens-2025/gallery/img_event_polar-lens-2025_7704.webp",
              alt: "Visiteurs lors du Polar Lens 2025",
            },
            {
              src: "/assets/img/events/polar-lens-2025/gallery/img_event_polar-lens-2025_7658.webp",
              alt: "Visiteurs lors du Polar Lens 2025",
            },
            {
              src: "/assets/img/events/polar-lens-2025/gallery/img_event_polar-lens-2025_7655.webp",
              alt: "Visiteurs lors du Polar Lens 2025",
            },
            {
              src: "/assets/img/events/polar-lens-2025/gallery/img_event_polar-lens-2025_7602.webp",
              alt: "Visiteurs lors du Polar Lens 2025",
            },
            {
              src: "/assets/img/events/polar-lens-2025/gallery/img_event_polar-lens-2025_6263.webp",
              alt: "Visiteurs lors du Polar Lens 2025",
            },
            {
              src: "/assets/img/events/polar-lens-2025/gallery/img_event_polar-lens-2025_2966.webp",
              alt: "Visiteurs lors du Polar Lens 2025",
            },
            {
              src: "/assets/img/events/polar-lens-2025/gallery/img_event_polar-lens-2025_2933.webp",
              alt: "Visiteurs lors du Polar Lens 2025",
            },
            {
              src: "/assets/img/events/polar-lens-2025/gallery/img_event_polar-lens-2025_2927.webp",
              alt: "Visiteurs lors du Polar Lens 2025",
            },
          ],
        },
      },
    ],
    freeplayGames: ["tombraider", "amongus"],
  },
  // EVENTS MASQUES DU SITE WEB A LA DEMANDE DU CLIENT
  // {
  //   id: "tournoi-sains-en-gohelle-2026",
  //   type: "both",
  //   title: "Tournoi SAINS-EN-GOHELLE",
  //   startDate: "2026-02-21",
  //   startTime: "14:00",
  //   cardThumbnail:
  //     "/assets/img/events/tournoi-sains-en-gohelle-2026/thumbnail_tournoi-sains-en-gohelle-2026.png",
  //   heroBanner:
  //     "/assets/img/events/tournoi-sains-en-gohelle-2026/banner_tournoi-sains-en-gohelle-2026_desktop.png",
  //   heroBannerMobile:
  //     "/assets/img/events/tournoi-sains-en-gohelle-2026/banner_tournoi-sains-en-gohelle-2026_mobile.png",
  //   categoryId: [],
  //   gameId: ["mariokart_world"],
  //   color: "#1E8E2B",
  //   location: "Église Sainte-Marguerite, 4 Pl. de la Marne, Sains-en-Gohelle",
  //   weezeventCode:
  //     '<a title="Logiciel billetterie en ligne"   href="https://weezevent.com/?c=sys_widget"   class="weezevent-widget-integration"   data-src="https://widget.weezevent.com/ticket/E1712193/?code=23061&locale=fr-FR&width_auto=1&color_primary=00AEEF"   data-width="650"   data-height="600"   data-id="1712193"   data-resize="1"   data-width_auto="1"   data-noscroll="0"   data-use-container="yes"   data-type="neo"   target="_blank">Billetterie Weezevent</a><script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>',
  //   registrationOpen: true,
  //   isCancelled: true,
  //   description: [],
  //   freeplayGames: [
  //     "mariokart_world",
  //     "fc25",
  //     "fortnite",
  //     "rocket_league",
  //     "fall_guys",
  //     "valorant",
  //   ],
  // },
];

export default events;
