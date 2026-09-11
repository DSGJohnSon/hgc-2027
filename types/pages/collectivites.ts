import type { ImageData } from "@/types";

/**
 * Page d'accueil « collectivités ».
 *
 * La mise en page est fixe : seuls les textes, les images et le nombre
 * d'éléments répétés sont modifiables depuis le backoffice. Chaque groupe ci-
 * dessous correspond à une section visible de la page.
 */

/** Cadrage de l'illustration d'une carte « Pourquoi nous ». */
export type CardFraming = "normal" | "reduit" | "tresReduit";

export interface CollectivitesButton {
  label: string;
  href: string;
}

/** Encart chiffré du hero : soit une valeur + un libellé, soit une icône + un libellé. */
export interface CollectivitesHighlight {
  value?: string;
  label: string;
  icon?: ImageData;
}

export interface WhyUsCard {
  image: ImageData;
  /** Première partie du titre, en blanc. */
  titleStart: string;
  /** Seconde partie du titre, mise en couleur. */
  titleAccent: string;
  text: string;
  framing: CardFraming;
}

export interface FigureItem {
  value: number;
  decimals: number;
  prefix: string;
  suffix: string;
  label: string;
}

export interface SolutionCard {
  image: ImageData;
  icon: ImageData;
  title: string;
  text: string;
}

export interface Testimonial {
  quote: string;
  authorLogo: ImageData;
  authorName: string;
  eventLabel: string;
}

export interface CollectivitesPageData {
  hero: {
    titleLine1: string;
    titleLine2: string;
    titleLine3Start: string;
    titleLine3Accent: string;
    intro: string;
    buttons: CollectivitesButton[];
    highlights: CollectivitesHighlight[];
    backgroundImage: ImageData;
    sliderImages: ImageData[];
  };
  whyUs: {
    eyebrow: string;
    title: string;
    cards: WhyUsCard[];
  };
  figures: {
    title: string;
    backgroundImage: ImageData;
    items: FigureItem[];
  };
  solutions: {
    title: string;
    cards: SolutionCard[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    intro: string;
    button: CollectivitesButton;
    items: Testimonial[];
  };
  partners: {
    subtitle: string;
    title: string;
    /**
     * Partenaires choisis dans le référentiel. Tant que la sélection est vide,
     * la liste historique de `data/pages/collectivites.ts` est affichée — ce qui
     * évite que la section disparaisse avant que quelqu'un ait fait son choix.
     */
    logos: Array<{ alt: string; src: string }>;
  };
  seo: {
    title?: string;
    description?: string;
  };
}
