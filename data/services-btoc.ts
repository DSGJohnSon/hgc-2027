import { ServiceBtoC } from "@/types/pages/service-btoc";

// ============================================================
// SERVICES BtoC — Privatisation & Location (Particuliers)
// Structure issue du cahier des charges (§3.2). Plusieurs contenus sont
// "à définir" côté client (hero/accroche, description, visuels).
// Réservation via widget HelloAsso : le code embed (helloAssoEmbed) est
// à fournir par le client (§3.4).
// ============================================================

export const servicesBtoC: ServiceBtoC[] = [
  {
    id: "pathe-games-birthday",
    target: "btoc",
    title: "Pathé Games Birthday",
    tagline: "", // à définir (client)
    logo: "/assets/logos/services/logo-pathe-games-birthday.png",
    color: "#fbbc09", // provisoire (univers Pathé) — à caler sur le logo
    cardThumbnail: "/assets/img/services/pathe-games-birthday/thumbnail_pathe-games-birthday.png",
    heroBanner: "/assets/img/services/pathe-games-birthday/banner-desktop_pathe-games-birthday.png",
    heroBannerMobile: "/assets/img/services/pathe-games-birthday/banner-mobile_pathe-games-birthday.png",
    shortDescription:
      "Organisez un anniversaire gaming inoubliable : une session privée encadrée avec une sélection de jeux, pour 10 à 24 jeunes.",
    content: [
      {
        type: "imageText",
        title: "Le concept",
        text: [
          "Présentation textuelle de l'offre à définir avec le client.", // placeholder
        ],
        image: "/assets/img/services/pathe-games-birthday/illustration.png",
        imageAlt: "Anniversaire gaming Pathé Games Birthday",
      },
      {
        type: "text",
        content: [
          { type: "title", title: "L'offre comprend" },
          {
            type: "list",
            items: ["Contenu à définir avec le client"], // placeholder
          },
        ],
      },
      {
        type: "text",
        content: [
          { type: "title", title: "Infos pratiques" },
          {
            type: "list",
            items: [
              "Public : 6-25 ans, de 10 à 24 jeunes",
              "Tarif : 25 € / enfant",
              "Sessions personnalisables",
            ],
          },
        ],
      },
      {
        type: "games",
        title: "Jeux disponibles",
        subtitle: "Une sélection adaptée à l'âge des participants",
        gameIds: [
          "fortnite",
          "mariokart_world",
          "mariokart8",
          "just_dance",
          "rocket_league",
          "fall_guys",
        ],
      },
    ],
    // Widget HelloAsso fourni par le client (boutique "pathe-games-birthday").
    helloAssoEmbed: `<iframe id="haWidget" allowtransparency="true" scrolling="auto" src="https://www.helloasso.com/associations/holiday-geek-cup/boutiques/pathe-games-birthday/widget" style="width: 100%; height: 750px; border: none;" onload="window.addEventListener('message', function(e) { const dataHeight = e.data.height; const haWidgetElement = document.getElementById('haWidget'); if (dataHeight > parseFloat(haWidgetElement.height || 0)) { haWidgetElement.height = dataHeight + 'px';}})"></iframe>`,
  },
  {
    id: "gaming-room",
    target: "btoc",
    title: "Gaming Room",
    tagline: "", // à définir (client)
    logo: "/assets/logos/services/logo-gaming-room.png",
    color: "#6240cf", // provisoire — à caler sur le logo
    cardThumbnail: "/assets/img/services/gaming-room/thumbnail_gaming-room.png",
    heroBanner: "/assets/img/services/gaming-room/banner-desktop_gaming-room.png",
    heroBannerMobile: "/assets/img/services/gaming-room/banner-mobile_gaming-room.png",
    shortDescription:
      "Louez du matériel gaming pour votre événement : dans nos espaces ou en livraison à domicile.",
    content: [
      {
        type: "imageText",
        title: "Le concept",
        text: [
          "Deux options possibles : profitez de nos espaces équipés, ou faites-vous livrer le matériel à domicile.",
        ],
        image: "/assets/img/services/gaming-room/illustration.png",
        imageAlt: "Espace Gaming Room équipé",
      },
      {
        type: "equipment",
        title: "Notre équipement",
        items: [
          { label: "PC fixe" },
          { label: "PC portable" },
          { label: "Écrans" },
          { label: "Consoles" },
          { label: "Manettes" },
          { label: "Caméras" },
        ],
      },
      {
        type: "text",
        content: [
          { type: "title", title: "Infos pratiques" },
          {
            type: "list",
            items: ["Public cible à définir", "Sessions personnalisables"],
          },
        ],
      },
    ],
    helloAssoEmbed: "", // code embed HelloAsso à fournir par le client
  },
];

export default servicesBtoC;
