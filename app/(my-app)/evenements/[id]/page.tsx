import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { Metadata } from "next";
import {
  getCategories,
  getEventPreview,
  getEvents,
  getEventSeries,
  getGames,
} from "@/lib/content";
import { prepareEvents } from "@/lib/eventUtils";
import EventHero from "./components/EventHero";
import EventInfo from "./components/EventInfo";
import EventCarousel from "@/components/sections/EventCarousel";
import FloatingRegister from "./components/FloatingRegister";
import SeriesHubPage from "./components/SeriesHubPage";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  // Check if it's a series
  const eventSeriesData = await getEventSeries();
  const series = eventSeriesData.find((s) => s.id === id);
  if (series) {
    return {
      title: `${series.title} | Série d'événements - Holiday Geek Cup`,
      description: `Découvrez toutes les dates du ${series.title} organisé par Holiday Geek Cup. ${series.dates.length} date${series.dates.length > 1 ? "s" : ""} dans la région.`,
    };
  }

  const eventsData = await getEvents();
  const event = eventsData.find((e) => e.id === id);

  if (!event) {
    return {
      title: "Événement non trouvé | Holiday Geek Cup",
      description: "L'événement demandé n'existe pas.",
    };
  }

  const categoriesData = await getCategories();
  const category = event.categoryId?.[0]
    ? categoriesData.find((c) => c.id === event.categoryId?.[0])
    : null;
  const categoryName = category ? category.name : "Événement";

  const descriptionText = Array.isArray(event.description)
    ? (() => {
        const firstBlock = event.description[0];
        if (!firstBlock || firstBlock.type !== "text") {
          return undefined;
        }

        const firstParagraph = firstBlock.content.find(
          (item) => item.type === "paragraph",
        );

        return firstParagraph?.paragraphs?.[0];
      })()
    : undefined;

  return {
    title: `${event.title} | ${categoryName} - Holiday Geek Cup`,
    description:
      descriptionText ||
      `Découvrez l'événement ${event.title} organisé par Holiday Geek Cup. ${event.location ? `Lieu : ${event.location}.` : ""}`,
  };
}

export default async function EventDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const search = await searchParams;
  const shouldOpenRegister = search.register === "true";

  const [eventsData, eventSeriesData, games, categoriesData] = await Promise.all([
    getEvents(),
    getEventSeries(),
    getGames(),
    getCategories(),
  ]);

  // Polymorphic detection: series takes priority
  const series = eventSeriesData.find((s) => s.id === id);
  if (series) {
    return <SeriesHubPage series={series} games={games} />;
  }

  // Mode aperçu (bouton « Aperçu » du backoffice) : lit l'événement, brouillon
  // compris, sans passer par le cache public — voir app/api/preview/route.ts.
  const { isEnabled: isPreview } = await draftMode();
  const event = isPreview
    ? await getEventPreview(id)
    : eventsData.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  // Get category name (take first category if multiple)
  const category = event.categoryId?.[0]
    ? categoriesData.find((c) => c.id === event.categoryId?.[0])
    : null;
  const categoryName = category ? category.name : "Événement";

  // If event is cancelled, registration is not open
  const effectiveRegistrationOpen = event.isCancelled
    ? false
    : (event.registrationOpen ?? false);

  // Filter other events for carousel
  const otherEvents = prepareEvents(
    eventsData,
    { games, categories: categoriesData },
    id,
    10,
  );

  return (
    <main className="min-h-screen bg-gray-950">
      <EventHero
        title={event.title}
        type={event.type as "tournoi" | "event"}
        categoryName={categoryName}
        bannerImage={event.heroBanner}
        bannerImageMobile={event.heroBannerMobile}
        color={event.color}
        isCancelled={event.isCancelled}
        heroBanner={event.heroBanner}
        heroBannerMobile={event.heroBannerMobile}
      />

      <div className="relative">
        <div className="relative z-10">
          <EventInfo
            description={event.description}
            startDate={event.startDate}
            endDate={event.endDate}
            startTime={event.startTime}
            endTime={event.endTime}
            location={event.location}
            highlightColor={event.color}
            transports={event.transports ? event.transports : undefined}
            weezeventCode={event.weezeventCode}
            eventTitle={event.title}
            registrationOpen={effectiveRegistrationOpen}
            partners={event.partners}
            freeplayGames={event.freeplayGames}
            randomizeFreeplayGames={event.randomizeFreeplayGames}
            isCancelled={event.isCancelled}
            gamesCatalogue={games}
          />

          {otherEvents.length > 0 && (
            <EventCarousel
              data={{
                title: "Événements à venir",
                subtitle: "Nos prochains rendez-vous",
                events: otherEvents,
              }}
              loop={false}
              subtitleColor={event.color}
              games={games}
              categories={categoriesData}
            />
          )}
        </div>
      </div>

      <FloatingRegister
        weezeventCode={event.weezeventCode}
        eventTitle={event.title}
        highlightColor={event.color}
        startDate={event.startDate}
        endDate={event.endDate}
        shouldOpenRegister={shouldOpenRegister}
        registrationOpen={effectiveRegistrationOpen}
        isCancelled={event.isCancelled}
      />
    </main>
  );
}
