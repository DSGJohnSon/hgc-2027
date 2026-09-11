import { StatisticsData } from "../components/sections/Statistics";
import { GalleryData } from "../components/sections/Gallery";

// ============================================
// BLOCS DE CONTENU PARTAGÉS — SERVICES
// Réutilise le système de blocs des événements (text / statistics / gallery)
// et ajoute des blocs spécifiques aux pages Services (BtoB & BtoC).
// Rendu par les templates ServiceB2BTemplate / ServiceB2CTemplate.
// ============================================

/** Un chiffre clé (même forme que les stats des événements). */
export type ServiceStat = StatisticsData["stats"][number];

/** Bloc texte : identique à celui des événements (title / paragraph / list / citation). */
export type TextBlock = {
  type: "text";
  content: {
    type: "title" | "paragraph" | "list" | "citation";
    title?: string;
    paragraphs?: string[];
    items?: string[];
    citationText?: string;
  }[];
};

/** Bloc chiffres clés → composant Statistics. */
export type StatisticsBlock = {
  type: "statistics";
  content: StatisticsData;
};

/** Bloc galerie photo → composant Gallery. */
export type GalleryBlock = {
  type: "gallery";
  content: GalleryData;
};

/** Combo image + texte (utilisé surtout côté BtoC). */
export type ImageTextBlock = {
  type: "imageText";
  title?: string;
  text: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean; // image à droite si true
};

/** Répartition par âge (bar chart en %). */
export type AgeDistributionBlock = {
  type: "ageDistribution";
  title?: string; // défaut "Répartition par âge"
  buckets: { label: string; percent: number }[];
};

/** Partage des rôles « La ville apporte » vs « HGC apporte ». */
export type RoleSplitBlock = {
  type: "roleSplit";
  cityTitle?: string; // défaut "La ville apporte"
  cityItems: string[];
  hgcTitle?: string; // défaut "HGC apporte"
  hgcItems: string[];
};

/** Encadré « Le petit plus ». */
export type HighlightBlock = {
  type: "highlight";
  title?: string; // défaut "Le petit plus"
  text: string;
};

/** Intervenants (conférences). */
export type SpeakersBlock = {
  type: "speakers";
  title?: string; // défaut "Nos intervenants"
  speakers: { name: string; role: string; photo?: string; linkedin?: string }[];
};

/** Thématiques à icônes (conférences). Peut être rendu via FeatureGrid. */
export type ThemesBlock = {
  type: "themes";
  title?: string; // défaut "Thématiques abordées"
  items: { title: string; description?: string; icon?: string }[];
};

/** Jeux disponibles → ids résolus via data/games.json (réutilise FreeplaySection). */
export type GamesBlock = {
  type: "games";
  title?: string;
  subtitle?: string;
  gameIds: string[];
  randomize?: boolean;
};

/** Liste / galerie d'équipement (Gaming Room). */
export type EquipmentBlock = {
  type: "equipment";
  title?: string; // défaut "Notre équipement"
  items: { label: string; icon?: string; image?: string }[];
};

export type ServiceBlock =
  | TextBlock
  | StatisticsBlock
  | GalleryBlock
  | ImageTextBlock
  | AgeDistributionBlock
  | RoleSplitBlock
  | HighlightBlock
  | SpeakersBlock
  | ThemesBlock
  | GamesBlock
  | EquipmentBlock;

// Ré-exports pratiques
export type { StatisticsData, GalleryData };
