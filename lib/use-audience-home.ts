"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

import { AUDIENCE_HOME, readAudience } from "@/lib/audience";

/**
 * Page d'accueil vers laquelle pointent le logo et le lien "Accueil" du header.
 *
 * Sur l'une des deux pages d'accueil, c'est celle-ci qui fait foi (on ne veut
 * pas qu'un lien "Accueil" arrache un visiteur collectivités de sa page pour
 * le renvoyer côté joueurs). Ailleurs sur le site — ces pages sont communes
 * aux deux publics — c'est la préférence mémorisée par `AudienceSwitch` /
 * `AudiencePicker` qui décide, "joueurs" par défaut.
 */
const subscribe = () => () => {};
const serverSnapshot = () => null;

export const useAudienceHomeHref = (): string => {
  const pathname = usePathname();
  const stored = useSyncExternalStore(subscribe, readAudience, serverSnapshot);

  if (pathname === AUDIENCE_HOME.joueurs || pathname === AUDIENCE_HOME.collectivites) {
    return pathname;
  }

  return stored === "collectivites" ? AUDIENCE_HOME.collectivites : AUDIENCE_HOME.joueurs;
};
