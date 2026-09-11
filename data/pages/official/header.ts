
import { HeaderData } from "@/types";

// ============================================================
// DONNÉES DU HEADER (logo, top bar, menu principal + méga-menu)
// Structure typée reprise de l'ancien header.json.
// Les icônes du méga-menu sont désignées par leur nom (voir megaIcons.ts) :
// une donnée venant du backoffice ne peut pas transporter de composant React.
// ============================================================

export const headerData: HeaderData = {
  logo: {
    src: "/assets/logos/logo-hgc.svg",
    alt: "Holiday Geek Cup Logo SVG",
  },
  topBar: {
    notice: "Bienvenue sur le site officiel HGC - Association Loi 1901",
    socialLinks: [
      {
        platform: "Facebook",
        url: "https://www.facebook.com/HolidayGeekCup/",
        icon: "facebook",
      },
      {
        platform: "Twitter - X",
        url: "https://x.com/HolidayGeekCup",
        icon: "twitter",
      },
      {
        platform: "Instagram",
        url: "https://www.instagram.com/holiday_geek_cup/",
        icon: "instagram",
      },
      {
        platform: "LinkedIn",
        url: "https://www.linkedin.com/company/holiday-geek-cup/",
        icon: "linkedin",
      },
    ],
  },
  menu: [
    {
      label: "ACCUEIL",
      href: "/",
    },
    {
      label: "À PROPOS",
      href: "/a-propos",
    },
    {
      label: "ÉVÉNEMENTS",
      href: "/evenements",
      submenu: [
        {
          label: "Tous les événements",
          href: "/evenements",
        },
        {
          label: "Gaming House Tour 2026",
          href: "/evenements/gaming-house-tour-2026",
        },
        {
          label: "Nos quartiers d'été 2026",
          href: "/evenements/quartier-tour-2026",
        },
      ],
    },
    {
      label: "NOS SERVICES",
      href: "/nos-services",
      mega: [
        {
          title: "Collectivités & Organismes",
          icon: "Landmark",
          links: [
            { label: "Gaming House Tour", href: "/nos-services/gaming-house-tour" },
            { label: "Summer Tour", href: "/nos-services/summer-tour" },
            { label: "Tournois Majeurs", href: "/nos-services/tournois-majeurs" },
            { label: "Conférences", href: "/nos-services/conferences" },
            { label: "Cité Éducative", href: "/nos-services/cite-educative" },
            { label: "Espace Social Gaming Emploi", href: "/nos-services/espace-social-gaming-emploi" },
          ],
        },
        {
          title: "Pour les joueurs",
          icon: "Users",
          links: [
            { label: "Pathé Games Birthday", href: "/nos-services/pathe-games-birthday" },
            { label: "Gaming Room", href: "/nos-services/gaming-room" },
          ],
        },
      ],
    },
    {
      label: "RESSOURCES",
      href: "#",
      submenu: [
        {
          label: "Règlement",
          href: "/reglement",
        },
        {
          label: "Documents Officiels",
          href: "/documents",
        },
      ],
    },
    {
      label: "CONTACT",
      href: "/contact",
    },
  ],
};

export default headerData;
