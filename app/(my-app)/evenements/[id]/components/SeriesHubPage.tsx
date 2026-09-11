import React from "react";
import Link from "next/link";
import {
  LuCalendar,
  LuMapPin,
  LuClock,
  LuChevronRight,
  LuLayers,
} from "react-icons/lu";
import { EventSeries, SeriesDate } from "@/types/event-series";
import { getCategories, getEvents } from "@/lib/content";
import { Game } from "@/types/games";
import { getSeriesDateBounds, prepareEvents } from "@/lib/eventUtils";
import EventHero from "./EventHero";
import EventCarousel from "@/components/sections/EventCarousel";
import Image from "next/image";
import { cn } from "@/lib/utils";

function getSeriesDateRange(series: EventSeries): string {
  const { minDate, maxDate } = getSeriesDateBounds(series.dates);

  const sameYear = minDate.getFullYear() === maxDate.getFullYear();
  const sameMonth = sameYear && minDate.getMonth() === maxDate.getMonth();

  if (sameMonth) {
    const start = minDate.toLocaleDateString("fr-FR", { day: "numeric" });
    const end = maxDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `Du ${start} au ${end}`;
  } else if (sameYear) {
    const start = minDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
    });
    const end = maxDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `Du ${start} au ${end}`;
  } else {
    const start = minDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const end = maxDate.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return `Du ${start} au ${end}`;
  }
}

function formatDateCard(date: SeriesDate): string {
  const start = new Date(date.startDate);
  if (!date.endDate) {
    return start.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }
  const end = new Date(date.endDate);
  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();
  if (sameMonth) {
    return `Du ${start.getDate()} au ${end.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
  }
  return `Du ${start.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} au ${end.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
}

function getDateStatus(
  date: SeriesDate
): "upcoming" | "ongoing" | "past" | "cancelled" {
  if (date.isCancelled) return "cancelled";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(date.startDate);
  const end = date.endDate ? new Date(date.endDate) : start;
  if (end < today) return "past";
  if (start <= today && end >= today) return "ongoing";
  return "upcoming";
}

const statusConfig = {
  upcoming: { label: "À venir", className: "bg-white/10 text-white" },
  ongoing: {
    label: "En cours",
    className: "bg-green-500/20 text-green-400 animate-pulse",
  },
  past: { label: "Passé", className: "bg-white/5 text-gray-500" },
  cancelled: { label: "Annulé", className: "bg-red-600/20 text-red-400" },
};

interface SeriesHubPageProps {
  /** Catalogue des jeux, transmis par la page (il vient de la base). */
  games: Game[];
  series: EventSeries;
}

export default async function SeriesHubPage({ series, games }: SeriesHubPageProps) {
  const dateRange = getSeriesDateRange(series);
  const [eventsData, categories] = await Promise.all([getEvents(), getCategories()]);
  const otherEvents = prepareEvents(eventsData, { games, categories }, undefined, 10);

  const pastOrCancelledDates = series.dates.filter((date) => {
    const status = getDateStatus(date);
    return status === "past" || status === "cancelled";
  });

  return (
    <main className="min-h-screen bg-gray-950">
      <EventHero
        title={series.title}
        type="event"
        categoryName="Série d'événements"
        bannerImage={series.heroBanner}
        bannerImageMobile={series.heroBannerMobile}
        color={series.color}
        isCancelled={series.isCancelled}
        heroBanner={series.heroBanner}
        heroBannerMobile={series.heroBannerMobile}
      />

      <div className="relative z-10">
        {/* Series info bar */}
        <div className="border-b border-white/5 bg-gray-950">
          <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <LuLayers size={20} style={{ color: series.color }} />
              <span className="font-rajdhani font-bold text-white text-lg uppercase tracking-wide">
                {series.dates.length} date{series.dates.length > 1 ? "s" : ""}
              </span>
            </div>
            <span className="hidden sm:block text-white/20">·</span>
            <div className="flex items-center gap-3">
              <LuCalendar size={18} style={{ color: series.color }} />
              <span className="font-rajdhani text-gray-300 text-base uppercase tracking-wide">
                {dateRange}
              </span>
            </div>
          </div>
        </div>

        {/* Dates grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="mb-10 space-y-2">
            <p
              className="font-rajdhani uppercase tracking-wider text-sm font-semibold"
              style={{ color: series.color }}
            >
              Programme
            </p>
            <h2 className="font-goldman text-3xl md:text-4xl text-white uppercase">
              Les dates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.dates
              .filter((date) => {
                const status = getDateStatus(date);
                return status === "upcoming" || status === "ongoing";
              })
              .map((date, index) => {
                const status = getDateStatus(date);
                const { label, className: statusClass } = statusConfig[status];
                const isPast = status === "past";
                const isCancelled = status === "cancelled";

                return (
                  <div
                    key={date.id}
                    className={`relative flex flex-col rounded-xl overflow-hidden border-2 border-white/5 bg-gray-900/60 backdrop-blur-sm transition-all duration-300 hover:border-white/20 ${isPast || isCancelled ? "opacity-60" : ""}`}
                    style={
                      status === "ongoing"
                        ? {
                            borderColor: series.color,
                            boxShadow: `0 0 20px ${series.color}33`,
                          }
                        : {}
                    }
                  >
                  {" "}
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={date.cardThumbnail}
                      alt={date.title || ""}
                      fill
                      className={cn(
                        "object-cover transition-transform duration-700 group-hover:scale-105",
                        isCancelled && "grayscale"
                      )}
                    />

                    {/* Cancelled overlay */}
                    {isCancelled && (
                      <>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full shadow-lg bg-red-600">
                          <span className="text-lg font-rajdhani font-bold text-white uppercase tracking-wider">
                            Annulé
                          </span>
                        </div>
                        <div className="block absolute top-0 left-0 w-full h-full bg-gray-950/70"></div>
                      </>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    {/* Header: Title + status */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-goldman text-white text-2xl lg:text-4xl uppercase leading-tight">
                        {date.title || `Date ${index + 1}`}
                      </h3>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start gap-2 text-gray-300">
                        <LuCalendar
                          size={14}
                          className="mt-0.5 shrink-0"
                          style={{ color: series.color }}
                        />
                        <span className="font-rajdhani text-sm font-semibold uppercase tracking-wide">
                          {formatDateCard(date)}
                        </span>
                      </div>

                      {(date.startTime || date.endTime) && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <LuClock
                            size={14}
                            className="shrink-0"
                            style={{ color: series.color }}
                          />
                          <span className="font-rajdhani text-sm font-semibold uppercase tracking-wide">
                            {date.startTime && date.endTime
                              ? `De ${date.startTime} à ${date.endTime}`
                              : date.startTime}
                          </span>
                        </div>
                      )}

                      <div className="flex items-start gap-2 text-gray-300">
                        <LuMapPin
                          size={14}
                          className="mt-0.5 shrink-0"
                          style={{ color: series.color }}
                        />
                        <span className="font-rajdhani text-sm font-semibold uppercase tracking-wide">
                          {date.location}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex flex-col gap-2">
                      <Link
                        href={`/evenements/${series.id}/${date.id}`}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-rajdhani font-bold uppercase tracking-wider text-sm transition-all duration-300 text-gray-950 hover:scale-[1.02]"
                        style={{
                          backgroundColor: isPast ? "#374151" : series.color,
                          color: isPast ? "#9ca3af" : undefined,
                        }}
                      >
                        {isPast ? "Voir les détails" : "Voir cette date"}
                        <LuChevronRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {pastOrCancelledDates.length > 0 && (
          <section className="container mx-auto px-4 pb-16">
            <div className="mb-10 space-y-2 border-t border-white/10 pt-16">
              <p
                className="font-rajdhani uppercase tracking-wider text-sm font-semibold"
                style={{ color: series.color }}
              >
                Historique
              </p>
              <h2 className="font-goldman text-3xl md:text-4xl text-white uppercase">
                Dates passées & annulées
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastOrCancelledDates.map((date, index) => {
                const status = getDateStatus(date);
                const isCancelled = status === "cancelled";

                return (
                  <div
                    key={date.id}
                    className={cn(
                      "group relative flex flex-col w-full rounded-xl overflow-hidden duration-300 border-2 transition-all bg-gray-950/40 backdrop-blur-sm",
                      "border-white/5 opacity-80 grayscale-[0.3]"
                    )}
                  >
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image
                        src={date.cardThumbnail}
                        alt={date.title || ""}
                        fill
                        className={cn("object-cover transition-transform duration-700 group-hover:scale-105", isCancelled && "grayscale")}
                      />
                      {isCancelled && (
                        <>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full shadow-lg bg-red-600">
                            <span className="text-lg font-rajdhani font-bold text-white uppercase tracking-wider">
                              Annulé
                            </span>
                          </div>
                          <div className="block absolute top-0 left-0 w-full h-full bg-gray-950/70"></div>
                        </>
                      )}
                      <div
                        className="absolute inset-0 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80"
                        style={{
                          backgroundImage: `linear-gradient(to top, ${series.color}66, transparent, transparent)`,
                        }}
                      />
                      <div className="absolute left-4 top-4 z-10">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-rajdhani font-bold uppercase tracking-wider ${isCancelled ? "bg-red-600/90 text-red-50" : "bg-white/10 text-gray-200"}`}>
                          {isCancelled ? "Annulé" : "Passé"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-5 bg-gray-900/50">
                      <h3 className="font-goldman text-white text-xl sm:text-2xl uppercase leading-tight group-hover:text-white transition-colors duration-300 line-clamp-2">
                        {date.title || `Date ${index + 1}`}
                      </h3>

                      <div className="flex items-start gap-2 text-gray-200">
                        <LuCalendar size={14} className="mt-0.5 shrink-0" style={{ color: series.color }} />
                        <span className="font-rajdhani text-sm font-semibold uppercase tracking-wide">
                          {formatDateCard(date)}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-gray-400">
                        <LuMapPin size={14} className="mt-0.5 shrink-0" style={{ color: series.color }} />
                        <span className="font-rajdhani text-sm font-semibold uppercase tracking-wide">
                          {date.location}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Other events carousel */}
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
    </main>
  );
}
