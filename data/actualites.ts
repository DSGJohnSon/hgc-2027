import { Actualities } from "@/types/pages/detail-actualites";

export const actualites: Actualities[] = [
  //HISTORIQUE DES ACTUALITES
  //Assemblée Générale 2026 - Supprimée car déjà passée et pas d'actualité à venir
  // {
  //   id: "assemblee-generale-2026",
  //   date: "2026-02-01",
  //   title:
  //     "Holiday Geek Cup tiendra son Assemblée Générale le vendredi 13 février 2026 à Lens",
  //   content: [
  //     {
  //       type: "paragraph",
  //       paragraphs: [
  //         "L’Assemblée Générale de Holiday Geek Cup se déroulera le vendredi 13 février à la Micro-Folie, située 13D route de Béthune, 62300 Lens.",
  //         "L’événement débutera à 15h pour les partenaires et invités, puis sera ouvert à l’ensemble des participants à partir de 18h.",
  //         "Cette Assemblée Générale permettra de présenter le bilan de l’année écoulée, les orientations stratégiques à venir et les prochains projets de l’organisation, dans un cadre dédié à la culture et à l’innovation numérique.",
  //       ],
  //     },
  //   ],
  //   image: {
  //     src: "/assets/img/actus/assemblee-generale-2026.webp",
  //     alt: "Assemblée Générale 2026",
  //     position: "right",
  //   },
  //   cta: {
  //     type: "weezevent",
  //     isExternal: false,
  //     label: "S'inscrire à l'Assemblée Générale",
  //     weezeventCode:
  //       '<a title="Logiciel billetterie en ligne" href="https://weezevent.com/?c=sys_widget"   class="weezevent-widget-integration"   data-src="https://widget.weezevent.com/ticket/E1638551/?code=21051&locale=fr-FR&width_auto=1&color_primary=00AEEF"   data-width="650"   data-height="600"   data-id="1638551"   data-resize="1"   data-width_auto="1"   data-noscroll="0"   data-use-container="yes"   data-type="neo"   target="_blank">Billetterie Weezevent</a><script type="text/javascript" src="https://widget.weezevent.com/weez.js"></script>',
  //   },
  // },
  // Social Cup 2026 - MASQUÉ
  //   {
  //     id: "social-cup-2026",
  //     date: "2026-03-16",
  //     title: "Votez pour nous",
  //     content: [
  //       {
  //         type: "paragraph",
  //         paragraphs: [
  //           "Grande nouvelle : Holiday Geek Cup est sélectionnée pour la finale de la Social Cup 2026, la coupe de France des jeunes de 18 à 30 ans qui agissent pour un monde plus durable et solidaire !",
  //           "Créée en 2014 et co-fondée par makesense, La Banque Postale et KissKissBankBank, la Social Cup accompagne chaque année des projets à impact positif en leur offrant visibilité, accompagnement et force de frappe. Cette année, son partenaire majeur est Ulule.",
  // "La finale aura lieu le mardi 24 mars 2026 à partir de 18h30 chez makesense, au 11 Rue Biscornet, 75012 Paris.",
  //         ],
  //       },
  //       {
  //         type: "title",
  //         title: "Vous pouvez nous soutenir de deux façons :",
  //       },
  //       {
  //         type: "list",
  //         items: [
  //           "🗳️ Voter pour nous en ligne sur Ulule : boost.ulule.com/socialcup12",
  //           "🎟️ Venir nous encourager à la finale : chiche.makesense.org",
  //         ],
  //       },
  //       {
  //         type : "paragraph",
  //         paragraphs: [
  //           "Chaque vote compte et nous rapproche de la victoire. Merci pour votre soutien ! 💜",
  //         ],
  //       }
  //     ],
  //     cta: {
  //       type: "standard",
  //       isExternal: true,
  //       label: "Voter pour nous sur Ulule",
  //       url: "https://boost.ulule.com/socialcup12",
  //     },
  //     image: {
  //       src: "/assets/img/actus/social_cup_2026.png",
  //       alt: "Social Cup 2026",
  //       position: "left",
  //     },
  //   },
  //Evenement au RC Lens - MASQUÉ
  // {
  //   id: "event-rc-lens",
  //   date: "2026-03-16",
  //   title: "Nouvel événement avec le RC Lens",
  //   content: [
  //     {
  //       type: "paragraph",
  //       paragraphs: [
  //         "Quelque chose se prépare du côté de Bollaert. Le RC Lens en collaboration avec Holiday Geek Cup travaille en silence, mais une annonce importante ne devrait plus tarder. Affaire à suivre de très près…",
  //       ],
  //     },
  //   ],
  //   image: {
  //     src: "/assets/img/events/bollaert-cup-2026/thumbnail_bollaert-cup-2026.png",
  //     alt: "Partenariat avec le RC Lens",
  //     position: "left",
  //   },
  // },
  // Nouveau siège social
  {
    id: "nouveau-siege-social",
    date: "2026-01-15",
    title: "Holiday geek cup annonce le changement de son siège social",
    content: [
      {
        type: "paragraph",
        paragraphs: [
          "L’association Holiday Geek Cup informe de l’évolution de son siège social, désormais installé dans de nouveaux locaux à Billy-Montigny.", 
        ],
      },
      {
        type: "list",
        items: [
          "Ancienne adresse : 84 rue Paul Bert, 62300 Lens",
          "Nouvelle adresse : 5002F Rue Louis Blériot, 62420 Billy-Montigny",
        ],
      },
      {
        type: "paragraph",
        paragraphs: [
          "Ce changement d’implantation, tout en restant dans le même secteur géographique, vise à accompagner le développement des projets de l’association dans des conditions plus adaptées.",
          "Les partenaires et contacts sont invités à mettre à jour leurs informations. De nouvelles annonces suivront prochainement.",
        ],
      },
      {
        type: "paragraph",
        paragraphs: [
          "Ce siège social servira à proposer de nouveaux formats d’événements en 2026.",
        ],
      },
    ],
    image: {
      src: "/assets/img/actus/nouveaux-locaux_billy.png",
      alt: "Nouveaux locaux de Holiday Geek Cup",
      position: "left",
    },
  },
];

export default actualites;
