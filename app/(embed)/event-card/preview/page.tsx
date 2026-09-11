"use client";

import { Component, useEffect, useState, type ReactNode } from "react";

import type { EventItem as EventItemType } from "@/types/pages/detail-event";
import EventItem from "@/components/features/events/EventItem";

/**
 * Aperçu « en direct » d'une `EventItem` (la card utilisée sur `/evenements`),
 * piloté par `postMessage` depuis le formulaire d'édition du backoffice
 * (`components/admin/fields/EventPreviewField.tsx`). Même principe que
 * `actualite-card/preview` : n'affiche que ce qu'on lui envoie, ce qui permet
 * de prévisualiser des modifications non enregistrées.
 */

const MESSAGE_TYPE = "hgc-event-preview";
const READY_TYPE = "hgc-event-preview-ready";

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

export default function EventCardPreviewPage() {
  const [event, setEvent] = useState<EventItemType | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== MESSAGE_TYPE) return;
      setEvent(event.data.event as EventItemType);
    };

    window.addEventListener("message", handleMessage);
    window.parent.postMessage({ type: READY_TYPE }, window.location.origin);

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div style={{ height: "100vh", overflowY: "auto", padding: "2rem" }}>
      <div style={{ maxWidth: "420px", margin: "0 auto" }}>
        <PreviewErrorBoundary>
          {event ? <EventItem {...event} /> : null}
        </PreviewErrorBoundary>
      </div>
    </div>
  );
}
