import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { getCategories, getEvents, getEventSeries, getGames } from "@/lib/content";

import { prepareEvents } from "@/lib/eventUtils";
import EventHero from "../components/EventHero";
import EventInfo from "../components/EventInfo";
import EventCarousel from "@/components/sections/EventCarousel";
import FloatingRegister from "../components/FloatingRegister";

interface PageProps {
  params: Promise<{ id: string; dateId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id, dateId } = await params;
  const eventSeriesData = await getEventSeries();
  const series = eventSeriesData.find((s) => s.id === id);

  if (!series) {
    return {
      title: "Événement non trouvé | Holiday Geek Cup",
      description: "L'événement demandé n'existe pas.",
    };
  }

  const date = series.dates.find((d) => d.id === dateId);

  if (!date) {
    return {
      title: "Date non trouvée | Holiday Geek Cup",
      description: "La date demandée n'existe pas.",
    };
  }

  const pageTitle = date.title || `${series.title} – Date`;

  const descriptionText = (() => {
    const firstBlock = date.description?.[0];
    if (!firstBlock || firstBlock.type !== "text") return undefined;
    const firstParagraph = firstBlock.content.find(item => item.type === "paragraph");
    return firstParagraph?.paragraphs?.[0];
  })();

  return {
    title: `${pageTitle} | ${series.title} - Holiday Geek Cup`,
    description:
      descriptionText ||
      `Découvrez cette date du ${series.title} organisé par Holiday Geek Cup. ${date.location ? `Lieu : ${date.location}.` : ""}`,
  };
}

export default async function SeriesDatePage({ params, searchParams }: PageProps) {
  const { id, dateId } = await params;
  const search = await searchParams;
  const shouldOpenRegister = search.register === "true";

  const eventSeriesData = await getEventSeries();
  const series = eventSeriesData.find((s) => s.id === id);
  if (!series) notFound();

  const date = series.dates.find((d) => d.id === dateId);
  if (!date) notFound();

  // Resolve inherited fields
  const resolvedHeroBanner = date.heroBanner ?? series.heroBanner;
  const resolvedHeroBannerMobile = date.heroBannerMobile ?? series.heroBannerMobile;
  const resolvedFreeplayGames = date.freeplayGames ?? series.freeplayGames;
  const resolvedPartners = date.partners ?? series.partners;

  const effectiveRegistrationOpen = date.isCancelled ? false : (date.registrationOpen ?? false);

  const pageTitle = date.title || series.title;

  const [eventsData, games, categories] = await Promise.all([
    getEvents(),
    getGames(),
    getCategories(),
  ]);
  const otherEvents = prepareEvents(eventsData, { games, categories }, undefined, 10);

  return (
    <main className="min-h-screen bg-gray-950">
      <EventHero
        title={pageTitle}
        type="event"
        categoryName={series.title}
        bannerImage={resolvedHeroBanner}
        bannerImageMobile={resolvedHeroBannerMobile}
        color={series.color}
        isCancelled={date.isCancelled}
        heroBanner={resolvedHeroBanner}
        heroBannerMobile={resolvedHeroBannerMobile}
      />

      <div className="relative">
        <div className="relative z-10">
          {/* Breadcrumb */}
          <div className="border-b border-white/5 bg-gray-950">
            <div className="container mx-auto px-4 py-3">
              <Link
                href={`/evenements/${series.id}`}
                className="inline-flex items-center gap-2 font-rajdhani text-sm font-semibold uppercase tracking-wide text-gray-400 hover:text-white transition-colors duration-200"
              >
                <LuArrowLeft size={16} />
                {series.title}
              </Link>
            </div>
          </div>

          <EventInfo
            description={date.description}
            startDate={date.startDate}
            endDate={date.endDate}
            startTime={date.startTime}
            endTime={date.endTime}
            location={date.location}
            highlightColor={series.color}
            transports={date.transports}
            weezeventCode={date.weezeventCode}
            eventTitle={pageTitle}
            registrationOpen={effectiveRegistrationOpen}
            partners={resolvedPartners}
            freeplayGames={resolvedFreeplayGames}
            randomizeFreeplayGames={false}
            isCancelled={date.isCancelled}
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
              subtitleColor={series.color}
              games={games}
              categories={categories}
            />
          )}
        </div>
      </div>

      <FloatingRegister
        weezeventCode={date.weezeventCode}
        eventTitle={pageTitle}
        highlightColor={series.color}
        startDate={date.startDate}
        endDate={date.endDate}
        shouldOpenRegister={shouldOpenRegister}
        registrationOpen={effectiveRegistrationOpen}
        isCancelled={date.isCancelled}
      />
    </main>
  );
}
