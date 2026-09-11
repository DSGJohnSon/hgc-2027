import { EventSeries } from "@/types/event-series";

// ============================================================
// SÉRIES D'ÉVÉNEMENTS MULTI-DATES
// Structure : chaque série possède un tableau "dates" d'étapes,
// chaque étape pouvant surcharger les jeux / bannières / partenaires.
// À compléter avec les vraies dates, lieux et assets 2026.
// ============================================================

export const eventSeries: EventSeries[] = [
  {
    id: "gaming-house-tour-2026",
    type: "serie",
    title: "Gaming House Tour 2026",
    color: "#FC902E",
    cardThumbnail:
      "/assets/img/events/gaming-house-tour/2026/ght_thumbnail.png",
    heroBanner:
      "/assets/img/events/gaming-house-tour/2026/ght_banniere_desk.png",
    heroBannerMobile:
      "/assets/img/events/gaming-house-tour/2026/ght_banniere_mobile.png",
    freeplayGames: [
      "fc26",
      "fc25",
      "mariokart_world",
      "mariokart8",
      "fortnite",
      "rocket_league",
      "fall_guys",
      "just_dance",
      "nintendo_switch_sports",
      "valorant",
      "amongus",
    ],
    isCancelled: false,
    dates: [
      {
        id: "ronchin",
        title: "Ronchin",
        startDate: "2026-06-30",
        endDate: "2026-07-04",
        startTime: "15h00",
        endTime: "21h00",
        location: "Ludothèque Municipale – 8 Pl. du Général de Gaulle, Ronchin",
        gameId: ["fall_guys", "fortnite"],
        cardThumbnail:
          "/assets/img/events/gaming-house-tour/2026/ronchin/ght_ronchin_thumbnail.png",
        heroBanner:
          "/assets/img/events/gaming-house-tour/2026/ronchin/ght_ronchin_banniere_desk.png",
        heroBannerMobile:
          "/assets/img/events/gaming-house-tour/2026/ronchin/ght_ronchin_banniere_mobile.png",
        registrationOpen: true,
        isCancelled: false,
        weezeventCode: `<a title="Logiciel billetterie en ligne"
   href="https://weezevent.com/?c=sys_widget"
   class="weezevent-widget-integration"
   data-src="https://widget.weezevent.com/ticket/E2185555/?code=48541&locale=fr-FR&width_auto=1&color_primary=00AEEF"
   data-width="650"
   data-height="600"
   data-id="2185555"
   data-resize="1"
   data-width_auto="1"
   data-noscroll="0"
   data-use-container="yes"
   data-type="neo"
   target="_blank">Billetterie Weezevent</a>
<script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>
`,
        partners: [
          {
            alt: "TADAO 100% Gratuit",
            src: "/assets/logos/partners/LOGO_tadao.png",
          },
          {
            alt: "Agence Nationale de la Cohésion des Territoires",
            src: "/assets/logos/partners/LOGO_anct.png",
          },
          {
            alt: "Quartiers 2030",
            src: "/assets/logos/partners/LOGO_quartier2030.png",
          },
          {
            alt: "Préfecture du Nord",
            src: "/assets/logos/partners/LOGO_prefet du nord.png",
          },
          {
            alt: "Quartiers d'été",
            src: "/assets/logos/partners/LOGO_quartier 2030.png",
          },
          {
            alt: "Ronchin",
            src: "/assets/logos/partners/LOGO_ronchin.png",
          },
          {
            alt: "Wonderbox",
            src: "/assets/logos/partners/LOGO_wonderbox.png",
          },
        ],
        description: [
          {
            type: "text",
            content: [
              {
                type: "paragraph",
                paragraphs: [
                  "Du 30 juin au 4 juillet, la Ludothèque Municipale de Ronchin accueille le Gaming House Tour : une semaine de jeu vidéo 100% gratuite et ouverte à tous !",
                  "Viens jouer entre amis, découvrir des jeux vidéos et profiter de l'ambiance gaming toute la semaine.",
                  "Le mercredi 1er juillet, un tournoi Fall Guys est organisé de 17H à 19H (32 joueurs max) Viens défier les autres participants dans une ambiance fun et détendue !",
                  "Et le vendredi 3 juillet, soirée spéciale de 17H à 20H : tournoi Fortnite (32 joueurs max) + pizzas offertes pour tous les participants. Une soirée à ne pas manquer !",
                  "Viens tenter ta chance pour remporter 700€ de cashprize !",
                  "Entrée gratuite. Zéro excuse pour pas venir.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "marcq-en-baroeul",
        title: "Marcq-en-Barœul",
        startDate: "2026-07-06",
        endDate: "2026-07-10",
        startTime: "15h00",
        endTime: "21h00",
        location:
          "Centre Social & Culturel – 69 Bd Clemenceau, Marcq-en-Barœul",
        gameId: ["fc26"],
        cardThumbnail:
          "/assets/img/events/gaming-house-tour/2026/marcq/ght_marcq_thumbnail.png",
        heroBanner:
          "/assets/img/events/gaming-house-tour/2026/marcq/ght_marcq_banniere_desk.png",
        heroBannerMobile:
          "/assets/img/events/gaming-house-tour/2026/marcq/ght_marcq_banniere_mobile.png",
        registrationOpen: true,
        isCancelled: false,
        weezeventCode: `<a title="Logiciel billetterie en ligne"
   href="https://weezevent.com/?c=sys_widget"
   class="weezevent-widget-integration"
   data-src="https://widget.weezevent.com/ticket/E2189771/?code=67036&locale=fr-FR&width_auto=1&color_primary=00AEEF"
   data-width="650"
   data-height="600"
   data-id="2189771"
   data-resize="1"
   data-width_auto="1"
   data-noscroll="0"
   data-use-container="yes"
   data-type="neo"
   target="_blank">Billetterie Weezevent</a>
<script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>
`,
        partners: [
          {
            alt: "TADAO 100% Gratuit",
            src: "/assets/logos/partners/LOGO_tadao.png",
          },
          {
            alt: "Ville de Marcq en Baroeul",
            src: "/assets/logos/partners/LOGO_marcq.png",
          },
          {
            alt: "Agence Nationale de la Cohésion des Territoires",
            src: "/assets/logos/partners/LOGO_anct.png",
          },
          {
            alt: "Quartiers 2030",
            src: "/assets/logos/partners/LOGO_quartier2030.png",
          },
          {
            alt: "Préfecture du Nord",
            src: "/assets/logos/partners/LOGO_prefet du nord.png",
          },
          {
            alt: "Quartiers d'été",
            src: "/assets/logos/partners/LOGO_quartier 2030.png",
          },
          {
            alt: "Wonderbox",
            src: "/assets/logos/partners/LOGO_wonderbox.png",
          },
        ],
        description: [
          {
            type: "text",
            content: [
              {
                type: "paragraph",
                paragraphs: [
                  "Du 6 au 10 juillet, le Centre Social & Culturel de Marcq-en-Barœul accueille le Gaming House Tour : une semaine de jeu vidéo 100% gratuite et ouverte à tous !",
                  "Le mercredi 8 juillet, un tournoi FC 26 est organisé de 16H à 20H. Format habitant réservé aux 32 premiers inscrits, avec loser bracket pour une seconde chance. Inscris-toi vite, les places partent vite !",
                  "Viens jouer entre amis, découvrir des jeux vidéos  et profiter de l'ambiance gaming toute la semaine.",
                  "Tente ta chance pour remporter 700€ de cashprize !",
                  "Entrée gratuite. Zéro excuse pour pas venir.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "wingles",
        title: "wingles",
        startDate: "2026-07-13",
        endDate: "2026-07-17",
        startTime: "14h00",
        endTime: "18h00",
        location: "CAJ de wingles , Rue Louis le Sénéchal, Wingles",
        gameId: [],
        cardThumbnail:
          "/assets/img/events/gaming-house-tour/2026/wingles/ght_wingles_thumbnail.png",
        heroBanner:
          "/assets/img/events/gaming-house-tour/2026/wingles/ght_wingles_banniere_desk.png",
        heroBannerMobile:
          "/assets/img/events/gaming-house-tour/2026/wingles/ght_wingles_banniere_mobile.png",
        registrationOpen: true,
        isCancelled: false,
        weezeventCode: `<a title="Logiciel billetterie en ligne"
   href="https://weezevent.com/?c=sys_widget"
   class="weezevent-widget-integration"
   data-src="https://widget.weezevent.com/ticket/E2189789/?code=27750&locale=fr-FR&width_auto=1&color_primary=00AEEF"
   data-width="650"
   data-height="600"
   data-id="2189789"
   data-resize="1"
   data-width_auto="1"
   data-noscroll="0"
   data-use-container="yes"
   data-type="neo"
   target="_blank">Billetterie Weezevent</a>
<script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>
`,
        partners: [
          {
            alt: "TADAO 100% Gratuit",
            src: "/assets/logos/partners/LOGO_tadao.png",
          },
          {
            alt: "Agence Nationale de la Cohésion des Territoires",
            src: "/assets/logos/partners/LOGO_anct.png",
          },
          {
            alt: "Quartiers 2030",
            src: "/assets/logos/partners/LOGO_quartier2030.png",
          },
          {
            alt: "Domino's Pizza",
            src: "/assets/logos/partners/LOGO_dominos.png",
          },
          {
            alt: "Wingles",
            src: "/assets/logos/partners/LOGO_wingles.png",
          },
          {
            alt: "Wonderbox",
            src: "/assets/logos/partners/LOGO_wonderbox.png",
          },
        ],
        description: [
          {
            type: "text",
            content: [
              {
                type: "paragraph",
                paragraphs: [
                  "Du 13 au 17 juillet, le CAJ Wingles accueille le Gaming House Tour : une semaine de jeu vidéo 100% gratuite et ouverte à tous ! Viens jouer entre amis, découvrir des jeux vidéos et profiter de l'ambiance gaming toute la semaine.",
                  "Les horaires arrivent très prochainement !",
                  "Entrée gratuite. Zéro excuse pour pas venir.",
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "quartier-tour-2026",
    type: "serie",
    title: "Quartier Tour 2026",
    color: "#6B46D8",
    cardThumbnail: "/assets/img/events/quartiers-tour/2026/qt_thumbnail.png",
    heroBanner:
      "/assets/img/events/quartiers-tour/2026/qt_banniere_desktop.png",
    heroBannerMobile:
      "/assets/img/events/quartiers-tour/2026/qt_banniere_mobile.png",
    gameId: ["fortnite", "fc26", "mariokart_world"],
    // partners: [
    //   {
    //     alt: "RC Lens",
    //     src: "/assets/logos/partners/logo_rc_lens.svg",
    //   },
    // ],
    freeplayGames: [
      "fortnite",
      "fc26",
      "fc25",
      "mariokart_world",
      "mariokart8",
      "rocket_league",
      "fall_guys",
      "just_dance",
      "nintendo_switch_sports",
    ],
    description: [
      {
        type: "text",
        content: [
          {
            type: "paragraph",
            paragraphs: [
              "Le Quartier Tour 2026 fait le tour des quartiers de la région pour amener le gaming directement là où vous vivez.",
            ],
          },
        ],
      },
    ],
    isCancelled: false,
    dates: [
      {
        id: "marcq-en-baroeul",
        title: "marcq en baroeul",
        startDate: "2026-07-03",
        startTime: "18h00",
        endTime: "22h00",
        location: "Centre Social & Culturel, 69 Bd Clemenceau, Marcq-en-Barœul",
        gameId: [],
        cardThumbnail:
          "/assets/img/events/quartiers-tour/2026/marcq/qt_marcq_thumbnail.png",
        heroBanner:
          "/assets/img/events/quartiers-tour/2026/marcq/qt_marcq_banniere_desktop.png",
        heroBannerMobile:
          "/assets/img/events/quartiers-tour/2026/marcq/qt_marcq_banniere_mobile.png",
        registrationOpen: true,
        isCancelled: false,
        weezeventCode: `<a title="Logiciel billetterie en ligne"
   href="https://weezevent.com/?c=sys_widget"
   class="weezevent-widget-integration"
   data-src="https://widget.weezevent.com/ticket/E2185553/?code=14535&locale=fr-FR&width_auto=1&color_primary=00AEEF"
   data-width="650"
   data-height="600"
   data-id="2185553"
   data-resize="1"
   data-width_auto="1"
   data-noscroll="0"
   data-use-container="yes"
   data-type="neo"
   target="_blank">Billetterie Weezevent</a>
<script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>`,
        partners: [
          {
            alt: "TADAO 100% Gratuit",
            src: "/assets/logos/partners/LOGO_tadao.png",
          },
          {
            alt: "Ville de Marcq en Baroeul",
            src: "/assets/logos/partners/LOGO_marcq.png",
          },
          {
            alt: "Agence Nationale de la Cohésion des Territoires",
            src: "/assets/logos/partners/LOGO_anct.png",
          },
          {
            alt: "Quartiers 2030",
            src: "/assets/logos/partners/LOGO_quartier2030.png",
          },
          {
            alt: "Préfecture du Nord",
            src: "/assets/logos/partners/LOGO_prefet du nord.png",
          },
          {
            alt: "Quartiers d'été",
            src: "/assets/logos/partners/LOGO_quartier 2030.png",
          },
        ],
        description: [
          {
            type: "text",
            content: [
              {
                type: "paragraph",
                paragraphs: [
                  "Le vendredi 3 juillet, le Centre Social & Culturel de Marcq-en-Barœul accueille une soirée de jeu vidéo 100% gratuite et ouverte à tous ! Viens jouer entre amis, découvrir nos setups et profiter de l'ambiance gaming de 18H à 22H.",
                  "Entrée gratuite. Zéro excuse pour pas venir.",
                ],
              },
            ],
          },
        ],
      },
//       {
//         id: "lens",
//         title: "lens",
//         startDate: "2026-07-22",
//         startTime: "11h00",
//         endTime: "17h00",
//         location: "Centre Dumas – Rue Gustave Courbet, Lens",
//         gameId: [],
//         cardThumbnail:
//           "/assets/img/events/quartiers-tour/2026/lens/qt_lens_thumbnail.png",
//         heroBanner:
//           "/assets/img/events/quartiers-tour/2026/lens/qt_lens_banniere_desktop.png",
//         heroBannerMobile:
//           "/assets/img/events/quartiers-tour/2026/lens/qt_lens_banniere_mobile.png",
//         registrationOpen: true,
//         isCancelled: false,
//         weezeventCode: `<a title="Logiciel billetterie en ligne"
//    href="https://weezevent.com/?c=sys_widget"
//    class="weezevent-widget-integration"
//    data-src="https://widget.weezevent.com/ticket/E2189837/?code=49320&locale=fr-FR&width_auto=1&color_primary=00AEEF"
//    data-width="650"
//    data-height="600"
//    data-id="2189837"
//    data-resize="1"
//    data-width_auto="1"
//    data-noscroll="0"
//    data-use-container="yes"
//    data-type="neo"
//    target="_blank">Billetterie Weezevent</a>
// <script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>`,
//         partners: [
//           {
//             alt: "TADAO 100% Gratuit",
//             src: "/assets/logos/partners/LOGO_tadao.png",
//           },
//           {
//             alt: "Agence Nationale de la Cohésion des Territoires",
//             src: "/assets/logos/partners/LOGO_anct.png",
//           },
//           {
//             alt: "Quartiers 2030",
//             src: "/assets/logos/partners/LOGO_quartier2030.png",
//           },
//           {
//             alt: "AGPIC",
//             src: "/assets/logos/partners/LOGO_agpic.png",
//           },
//           {
//             alt: "Domino's Pizza",
//             src: "/assets/logos/partners/LOGO_dominos.png",
//           },
//           {
//             alt: "Wonderbox",
//             src: "/assets/logos/partners/LOGO_wonderbox.png",
//           },
//         ],
//         description: [
//           {
//             type: "text",
//             content: [
//               {
//                 type: "paragraph",
//                 paragraphs: [
//                   "Le mercredi 22 juillet, le Centre Dumas de Lens accueille le HGC Quartier Tour dans le cadre des Quartiers d'été de Lens : une journée de jeu vidéo 100% gratuite et ouverte à tous !",
//                   "Un tournoi Splatoon en 1vs1 est organisé sur place. Viens affronter les autres participants et tenter de remporter 100€ de goodies !",
//                   "Pas là pour le tournoi ? Pas de souci ! Un espace Free Play est dispo toute la journée pour jouer entre amis et profiter de l'ambiance.",
//                   "Entrée gratuite. Zéro excuse pour pas venir.",
//                 ],
//               },
//             ],
//           },
//         ],
//       },
      {
        id: "loos-en-gohelle",
        title: "loos en gohelle",
        startDate: "2026-07-29",
        startTime: "14h00",
        endTime: "18h00",
        location: "Salle Dubois – Rue André Dubois, Loos-en-Gohelle",
        gameId: [],
        cardThumbnail:
          "/assets/img/events/quartiers-tour/2026/qt_thumbnail.png",
        heroBanner:
          "/assets/img/events/quartiers-tour/2026/qt_banniere_desktop.png",
        heroBannerMobile:
          "/assets/img/events/quartiers-tour/2026/qt_banniere_mobile.png",
        registrationOpen: true,
        isCancelled: false,
        weezeventCode: `<a title="Logiciel billetterie en ligne"
   href="https://weezevent.com/?c=sys_widget"
   class="weezevent-widget-integration"
   data-src="https://widget.weezevent.com/ticket/E2189849/?code=52565&locale=fr-FR&width_auto=1&color_primary=00AEEF"
   data-width="650"
   data-height="600"
   data-id="2189849"
   data-resize="1"
   data-width_auto="1"
   data-noscroll="0"
   data-use-container="yes"
   data-type="neo"
   target="_blank">Billetterie Weezevent</a>
<script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>`,
        partners: [
          {
            alt: "TADAO 100% Gratuit",
            src: "/assets/logos/partners/LOGO_tadao.png",
          },
          {
            alt: "Domino's Pizza",
            src: "/assets/logos/partners/LOGO_dominos.png",
          },
          {
            alt: "Loos en Gohelle",
            src: "/assets/logos/partners/LOGO_loos.png",
          },
          {
            alt: "Wonderbox",
            src: "/assets/logos/partners/LOGO_wonderbox.png",
          },
        ],
        description: [
          {
            type: "text",
            content: [
              {
                type: "paragraph",
                paragraphs: [
                  "Le mercredi 29 juillet, la Salle Dubois de Loos-en-Gohelle accueille le HGC Quartier Tour : une journée de jeu vidéo 100% gratuite et ouverte à tous !",
                  "Un tournoi Mario Kart est organisé sur place, réservé aux 32 premiers inscrits. Viens affronter les autres participants et tenter de remporter 200€ de cashprize !",
                  "Pas là pour le tournoi ? Pas de souci ! Un espace Free Play est dispo toute la journée pour jouer entre amis et profiter de l'ambiance.",
                  "Viens tenter ta chance pour remporter 200€ de cashprize !",
                  "Entrée gratuite. Zéro excuse pour pas venir.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "tadao-gaming-tour-31-07-2026",
        title: "tadao gaming tour",
        startDate: "2026-07-31",
        startTime: "14h00",
        endTime: "21h00",
        location:
          "La Maison des Mobilités de Tadao – 54 Rue Jean Letienne, Lens",
        gameId: [],
        cardThumbnail:
          "/assets/img/events/quartiers-tour/2026/tadao/qt_tadao_thumbnail.png",
        heroBanner:
          "/assets/img/events/quartiers-tour/2026/tadao/qt_tadao_banniere_desktop.png",
        heroBannerMobile:
          "/assets/img/events/quartiers-tour/2026/tadao/qt_tadao_banniere_mobile.png",
        registrationOpen: true,
        isCancelled: false,
        weezeventCode: `<a title="Logiciel billetterie en ligne"
   href="https://weezevent.com/?c=sys_widget"
   class="weezevent-widget-integration"
   data-src="https://widget.weezevent.com/ticket/E2189857/?code=23771&locale=fr-FR&width_auto=1&color_primary=00AEEF"
   data-width="650"
   data-height="600"
   data-id="2189857"
   data-resize="1"
   data-width_auto="1"
   data-noscroll="0"
   data-use-container="yes"
   data-type="neo"
   target="_blank">Billetterie Weezevent</a>
<script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>
`,
        partners: [
          {
            alt: "TADAO 100% Gratuit",
            src: "/assets/logos/partners/LOGO_tadao.png",
          },
          {
            alt: "Agence Nationale de la Cohésion des Territoires",
            src: "/assets/logos/partners/LOGO_anct.png",
          },
          {
            alt: "Quartiers 2030",
            src: "/assets/logos/partners/LOGO_quartier2030.png",
          },
          {
            alt: "Domino's Pizza",
            src: "/assets/logos/partners/LOGO_dominos.png",
          },
          {
            alt: "Wonderbox",
            src: "/assets/logos/partners/LOGO_wonderbox.png",
          },
        ],
        description: [
          {
            type: "text",
            content: [
              {
                type: "paragraph",
                paragraphs: [
                  " Le 31 juillet, la Maison des Mobilités de Tadao à Lens accueille le HGC Quartier Tour : deux journées de jeu vidéo 100% gratuites et ouvertes à tous !",
                  "Au programme : un simulateur de bus à tester absolument, et plein de jeux en Free Play pour jouer entre amis et profiter de l'ambiance gaming toute la journée.",
                  "Entrée gratuite. Zéro excuse pour pas venir.",
                ],
              },
            ],
          },
        ],
      },
      {
        id: "tadao-gaming-tour-14-08-2026",
        title: "tadao gaming tour",
        startDate: "2026-08-14",
        startTime: "14h00",
        endTime: "21h00",
        location:
          "La Maison des Mobilités de Tadao – 54 Rue Jean Letienne, Lens",
        gameId: [],
        cardThumbnail:
          "/assets/img/events/quartiers-tour/2026/tadao/qt_tadao_thumbnail.png",
        heroBanner:
          "/assets/img/events/quartiers-tour/2026/tadao/qt_tadao_banniere_desktop.png",
        heroBannerMobile:
          "/assets/img/events/quartiers-tour/2026/tadao/qt_tadao_banniere_mobile.png",
        registrationOpen: true,
        isCancelled: false,
        weezeventCode: `<a title="Logiciel billetterie en ligne"
   href="https://weezevent.com/?c=sys_widget"
   class="weezevent-widget-integration"
   data-src="https://widget.weezevent.com/ticket/E2189857/?code=23771&locale=fr-FR&width_auto=1&color_primary=00AEEF"
   data-width="650"
   data-height="600"
   data-id="2189857"
   data-resize="1"
   data-width_auto="1"
   data-noscroll="0"
   data-use-container="yes"
   data-type="neo"
   target="_blank">Billetterie Weezevent</a>
<script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>
`,
        partners: [
          {
            alt: "TADAO 100% Gratuit",
            src: "/assets/logos/partners/LOGO_tadao.png",
          },
          {
            alt: "Agence Nationale de la Cohésion des Territoires",
            src: "/assets/logos/partners/LOGO_anct.png",
          },
          {
            alt: "Quartiers 2030",
            src: "/assets/logos/partners/LOGO_quartier2030.png",
          },
          {
            alt: "Domino's Pizza",
            src: "/assets/logos/partners/LOGO_dominos.png",
          },
          {
            alt: "Wonderbox",
            src: "/assets/logos/partners/LOGO_wonderbox.png",
          },
        ],
        description: [
          {
            type: "text",
            content: [
              {
                type: "paragraph",
                paragraphs: [
                  "Le 14 août, la Maison des Mobilités de Tadao à Lens accueille le HGC Quartier Tour : deux journées de jeu vidéo 100% gratuites et ouvertes à tous !",
                  "Au programme : un simulateur de bus à tester absolument, et plein de jeux en Free Play pour jouer entre amis et profiter de l'ambiance gaming toute la journée.",
                  "Entrée gratuite. Zéro excuse pour pas venir.",
                ],
              },
            ],
          },
        ],
      },
//       {
//         id: "lens-j2",
//         title: "Lens j2",
//         startDate: "2026-08-19",
//         startTime: "11h00",
//         endTime: "17h00",
//         location: "Parc des Solidarités – Rue St Théodore, Lens",
//         gameId: [],
//         cardThumbnail:
//           "/assets/img/events/quartiers-tour/2026/lens/qt_lens2_thumbnail.png",
//         heroBanner:
//           "/assets/img/events/quartiers-tour/2026/lens/qt_lens2_banniere_desktop.png",
//         heroBannerMobile:
//           "/assets/img/events/quartiers-tour/2026/lens/qt_lens2_banniere_mobile.png",
//         registrationOpen: true,
//         isCancelled: false,
//         weezeventCode: `<a title="Logiciel billetterie en ligne"
//    href="https://weezevent.com/?c=sys_widget"
//    class="weezevent-widget-integration"
//    data-src="https://widget.weezevent.com/ticket/E2189871/?code=48782&locale=fr-FR&width_auto=1&color_primary=00AEEF"
//    data-width="650"
//    data-height="600"
//    data-id="2189871"
//    data-resize="1"
//    data-width_auto="1"
//    data-noscroll="0"
//    data-use-container="yes"
//    data-type="neo"
//    target="_blank">Billetterie Weezevent</a>
// <script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>
// `,
//         partners: [
//           {
//             alt: "TADAO 100% Gratuit",
//             src: "/assets/logos/partners/LOGO_tadao.png",
//           },
//           {
//             alt: "Agence Nationale de la Cohésion des Territoires",
//             src: "/assets/logos/partners/LOGO_anct.png",
//           },
//           {
//             alt: "Quartiers 2030",
//             src: "/assets/logos/partners/LOGO_quartier2030.png",
//           },
//           {
//             alt: "AGPIC",
//             src: "/assets/logos/partners/LOGO_agpic.png",
//           },
//           {
//             alt: "Domino's Pizza",
//             src: "/assets/logos/partners/LOGO_dominos.png",
//           },
//           {
//             alt: "Wonderbox",
//             src: "/assets/logos/partners/LOGO_wonderbox.png",
//           },
//         ],
//         description: [
//           {
//             type: "text",
//             content: [
//               {
//                 type: "paragraph",
//                 paragraphs: [
//                   "Un tournoi FC 26 en 1vs1 est organisé sur place, réservé aux 32 premiers inscrits. Viens affronter les autres participants et tenter de remporter 100€ de goodies !",
//                   "Pas là pour le tournoi ? Pas de souci ! Un espace Free Play est dispo toute la journée pour jouer entre amis et profiter de l'ambiance.",
//                   "Viens tenter ta chance pour remporter 100€ de goodies !",
//                   "Entrée gratuite. Zéro excuse pour pas venir.",
//                 ],
//               },
//             ],
//           },
//         ],
//       },
      {
        id: "lilliers",
        title: "Lilliers",
        startDate: "2026-08-17",
        endDate: "2026-08-20",
        startTime: "14h00",
        endTime: "20h00",
        location: "Parc du Brûle, 5004F Rue des Promenades, 62190 Lillers",
        gameId: ["fc_26"],
        cardThumbnail:
          "/assets/img/events/quartiers-tour/2026/lilliers/qt_lilliers_thumbnail.png",
        heroBanner:
          "/assets/img/events/quartiers-tour/2026/lilliers/qt_lilliers_banniere_desktop.png",
        heroBannerMobile:
          "/assets/img/events/quartiers-tour/2026/lilliers/qt_lilliers_banniere_mobile.png",
        registrationOpen: true,
        isCancelled: false,
        weezeventCode: `<a title="Logiciel billetterie en ligne"
   href="https://weezevent.com/?c=sys_widget"
   class="weezevent-widget-integration"
   data-src="https://widget.weezevent.com/ticket/E2227455/?code=35901&locale=fr-FR&width_auto=1&color_primary=00AEEF"
   data-width="650"
   data-height="600"
   data-id="2227455"
   data-resize="1"
   data-width_auto="1"
   data-noscroll="0"
   data-use-container="yes"
   data-type="neo"
   target="_blank">Billetterie Weezevent</a>
<script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>

`,
        partners: [
          {
            alt: "Allocations Familiales",
            src: "/assets/logos/partners/logo_alloc.png",
          },
          {
            alt: "Agence Nationale de la Cohésion des Territoires",
            src: "/assets/logos/partners/LOGO_anct.png",
          },
          {
            alt: "Domino's Pizza",
            src: "/assets/logos/partners/LOGO_dominos.png",
          },
          {
            alt: "Ville de Lilliers",
            src: "/assets/logos/partners/Logo_Lillers.svg",
          },
          {
            alt: "Quartiers 2030",
            src: "/assets/logos/partners/LOGO_quartier2030.png",
          },
          {
            alt: "Logo Solilliers",
            src: "/assets/logos/partners/LOGO_SOLILLERS.png",
          },
          {
            alt: "TADAO 100% Gratuit",
            src: "/assets/logos/partners/LOGO_tadao.png",
          },
          {
            alt: "Wonderbox",
            src: "/assets/logos/partners/LOGO_wonderbox.png",
          },
        ],
        description: [
          {
            type: "text",
            content: [
              {
                type: "paragraph",
                paragraphs: [
                  "Le HGC Quartier Tour débarque au Parc du Brûle de Lillers pour 3 jours de jeu vidéo 100% gratuits et ouverts à tous !",
                  "Au programme :"
                ],
              },
              {
                type: "list",
                items: [
                  "Lundi 17 août - Tournoi FC 26",
                  "Mardi 18 août - Tournoi Fortnite",
                  "Jeudi 20 août - Tournoi Rocket League",
                ],
              },
              {
                type: "paragraph",
                paragraphs: [
                  "Chaque tournoi est réservé aux 32 premiers inscrits et permet de remporter 200€ de cashprize.",
                  "Pas là pour le tournoi ? Pas de souci ! Un espace Free Play est dispo toute la journée pour jouer entre amis et profiter de l'ambiance.",
                  "Entrée gratuite. Zéro excuse pour pas venir.",
                ],
              }
            ],
          },
        ],
      },
    ],
  },
];

export default eventSeries;
