"use client";

import { Component, useEffect, useState, type ReactNode } from "react";

import type { Actualities } from "@/types/pages/detail-actualites";
import ActualiteCard from "@/components/sections/ActualitesCarousel/ActualiteCard";

/**
 * Aperçu « en direct » d'une `ActualiteCard`, piloté par `postMessage` depuis
 * le formulaire d'édition du backoffice
 * (`components/admin/fields/ActualitePreviewField.tsx`). N'affiche que ce
 * qu'on lui envoie, ce qui permet de prévisualiser des modifications non
 * enregistrées — y compris le contenu (blocs de texte), reconstruit côté
 * formulaire à partir de l'état à plat de Payload.
 *
 * Enveloppé dans une limite d'erreur : un contenu en cours de saisie peut
 * transiter par des états incomplets (ex. bloc fraîchement ajouté, encore
 * sans texte) — mieux vaut un message clair qu'une iframe muette.
 */

const MESSAGE_TYPE = "hgc-actualite-preview";
const READY_TYPE = "hgc-actualite-preview-ready";

class PreviewErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "2rem", color: "#f87171", fontFamily: "monospace", fontSize: "0.85rem" }}>
          Aperçu impossible : {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ActualiteCardPreviewPage() {
  const [actualite, setActualite] = useState<Actualities | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== MESSAGE_TYPE) return;
      setActualite(event.data.actualite as Actualities);
    };

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: READY_TYPE }, window.location.origin);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div style={{ height: "100vh", overflowY: "auto", padding: "2rem" }}>
      <PreviewErrorBoundary>
        {actualite ? <ActualiteCard {...actualite} /> : null}
      </PreviewErrorBoundary>
    </div>
  );
}
