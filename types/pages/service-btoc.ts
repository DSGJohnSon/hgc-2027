import { ServiceBlock } from "./service-blocks";

// ============================================
// SERVICE BtoC — Privatisation & Location (Particuliers)
// Template commun aux 2 services : Pathé Games Birthday, Gaming Room.
// Réservation via widget HelloAsso (code embed stocké dans helloAssoEmbed).
// ============================================
export type ServiceBtoC = {
  id: string; // slug (ex. "pathe-games-birthday")
  target: "btoc";
  title: string;
  tagline?: string;
  logo?: string;
  color: string;
  cardThumbnail: string;
  heroBanner: string;
  heroBannerMobile: string;
  shortDescription: string;
  content: ServiceBlock[]; // description combo, offre/équipement, jeux, chiffres clés
  helloAssoEmbed?: string; // code embed HelloAsso (pattern weezeventCode)
  isDraft?: boolean;
};
