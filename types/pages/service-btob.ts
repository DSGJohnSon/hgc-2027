import { ServiceBlock, ServiceStat } from "./service-blocks";

// ============================================
// SERVICE BtoB — Organisations & Projets (Collectivités)
// Template commun aux 6 services : Gaming House Tour, Summer Tour,
// Tournois Majeurs, Conférences, Cité Éducative, Espace Social Gaming Emploi.
// ============================================
export type ServiceBtoB = {
  id: string; // slug (ex. "gaming-house-tour")
  target: "btob";
  title: string;
  tagline?: string; // accroche affichée dans le hero
  logo?: string; // logo PNG dédié (fourni par le client)
  color: string; // couleur d'accent propre au service
  cardThumbnail: string; // vignette pour la grille du hub
  heroBanner: string;
  heroBannerMobile: string;
  shortDescription: string; // texte de card + <meta description>
  stats?: ServiceStat[]; // chiffres clés (rendus via Statistics)
  content: ServiceBlock[]; // séquence de sections
  formProjectLabel?: string; // valeur du champ "Projet concerné" (défaut = title)
  isDraft?: boolean; // true = contenu client non encore fourni (placeholder)
};
