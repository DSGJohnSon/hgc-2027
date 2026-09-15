// ============================================================
// NOS SERVICES — PAGES D'ATTENTE
//
// L'ancien système générique (collection Payload `services`, gabarits
// BtoB / BtoC à base de blocs) a été retiré : chaque service aura sa propre
// page, écrite à la main dans `app/(my-app)/nos-services/<slug>/page.tsx`.
// Un dossier statique est prioritaire sur `[slug]`, la page d'attente
// correspondante disparaît donc d'elle-même.
//
// La liste des services est lue dans le méga-menu du header, pour ne pas la
// maintenir à deux endroits.
// ============================================================

import { headerData } from "@/components/layout/Header/content";

export const SERVICES_HREF = "/nos-services";

/**
 * Services dont la page définitive est en ligne. Ajouter le slug ici une fois
 * `nos-services/<slug>/page.tsx` créé : le badge « En construction » disparaît
 * alors de la page « Nos Services ».
 */
const READY_SLUGS = new Set<string>([]);

export const isUnderConstruction = (href: string) =>
  !READY_SLUGS.has(href.slice(SERVICES_HREF.length + 1));

/** Colonnes du méga-menu « Nos Services » (collectivités, joueurs…). */
export const serviceColumns =
  headerData.menu.find((item) => item.href === SERVICES_HREF)?.mega ?? [];

/** Un service = un lien du méga-menu, dont on déduit le slug. */
export const serviceLinks = serviceColumns.flatMap((column) =>
  column.links
    .filter((link) => link.href.startsWith(`${SERVICES_HREF}/`))
    .map((link) => ({
      label: link.label,
      href: link.href,
      slug: link.href.slice(SERVICES_HREF.length + 1),
    })),
);
