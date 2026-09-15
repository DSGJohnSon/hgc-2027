import type { ImageData } from "@/types";
import type { Game } from "@/types/games";
import type { FigureItem } from "@/types/pages/collectivites";

/**
 * Page d'accueil « joueurs ».
 *
 * Comme pour la page collectivités, la mise en page est fixe : seuls les
 * textes, les images et le nombre d'éléments répétés sont modifiables depuis le
 * backoffice. Chaque groupe ci-dessous correspond à une section visible de la
 * page. Les événements, eux, viennent directement de leur collection.
 */

export interface HomeButton {
  label: string;
  href: string;
}

export interface GamingSpaceCard {
  logo?: ImageData;
  backgroundImage?: ImageData;
  text: string;
  /** Carte grisée, avec la mention « Indisponible pour le moment ». */
  unavailable: boolean;
}

export interface HowItWorksStep {
  /** Absente : l'icône calendrier par défaut est affichée. */
  icon?: ImageData;
  title: string;
  text: string;
}

export interface WhyJoinCard {
  /** Illustration au repos, visible uniquement sur PC avant le survol. */
  image?: ImageData;
  /** Illustration au survol — seule affichée sur mobile. */
  hoverImage?: ImageData;
  /** Première partie du titre, en blanc. */
  titleStart: string;
  /** Seconde partie du titre, mise en couleur au survol. */
  titleAccent: string;
  text: string;
}

export type SocialNetwork =
  | "discord"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube";

export interface SocialLink {
  network: SocialNetwork;
  url: string;
}

export interface HomePageData {
  hero: {
    subtitle: string;
    titleLine1: string;
    titleLine2: string;
    buttons: HomeButton[];
    totalParticipants: string;
    participantsSince?: number;
    backgroundImage?: ImageData;
  };
  gamingSpaces: {
    eyebrow: string;
    title: string;
    cards: GamingSpaceCard[];
  };
  games: {
    title: string;
    intro: string;
    /** Jeux choisis dans le référentiel, dans l'ordre du backoffice. */
    items: Game[];
  };
  howItWorks: {
    title: string;
    steps: HowItWorksStep[];
  };
  whyJoin: {
    title: string;
    cards: WhyJoinCard[];
  };
  figures: {
    title: string;
    logo?: ImageData;
    backgroundImage?: ImageData;
    items: FigureItem[];
  };
  community: {
    title: string;
    accent: string;
    text: string;
    photo?: ImageData;
    backgroundImage?: ImageData;
    socials: SocialLink[];
  };
  cta: {
    titleAccent: string;
    title: string;
    button: HomeButton;
  };
  partners: {
    subtitle: string;
    title: string;
    /** Partenaires choisis dans le référentiel, limités à ceux qui ont un logo. */
    logos: Array<{ alt: string; src: string }>;
  };
  seo: {
    title?: string;
    description?: string;
  };
}
