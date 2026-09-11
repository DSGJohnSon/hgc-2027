import { Suspense } from "react";
import { Metadata } from "next";

import EventsContent from "./EventsContent";
import { getCategories, getEvents, getEventSeries, getGames } from "@/lib/content";

export const metadata: Metadata = {
  title: "Événements | Holiday Geek Cup",
  description:
    "Retrouvez tous les événements et tournois Holiday Geek Cup : dates, lieux, jeux et inscriptions.",
};

/**
 * Listing des événements.
 *
 * Le filtrage se fait côté client (recherche, catégories, jeux, URL comme source
 * de vérité) : la page charge donc les données ici, côté serveur, et les transmet
 * au composant client, qui ne connaît plus rien de leur provenance.
 */
export default async function EventsPage() {
  const [events, series, games, categories] = await Promise.all([
    getEvents(),
    getEventSeries(),
    getGames(),
    getCategories(),
  ]);

  return (
    <Suspense>
      <EventsContent
        events={events}
        series={series}
        games={games}
        categories={categories}
      />
    </Suspense>
  );
}
