"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Head from "next/head";
import EventFilters from "@/components/features/events/EventFilters";
import EventGrid from "@/components/features/events/EventGrid";
import { Event, EventItem } from "@/types/pages/detail-event";
import { EventSeries, SeriesListingItem } from "@/types/event-series";
import { Game } from "@/types/games";
import PixelBackground from "@/components/ui/pixel-background";
import { getSeriesDateBounds } from "@/lib/eventUtils";

export type EventsContentProps = {
  events: Event[];
  series: EventSeries[];
  games: Game[];
  categories: Array<{ id: string; name: string; color?: string }>;
};

function EventsContent({ events, series, games, categories }: EventsContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL as source of truth - Handle multiple values (comma-separated)
  const selectedCategories = useMemo(() => {
    const cat = searchParams.get("category");
    return cat ? cat.split(",") : [];
  }, [searchParams]);

  const selectedGames = useMemo(() => {
    const game = searchParams.get("game");
    return game ? game.split(",") : [];
  }, [searchParams]);

  // State for immediate search input feedback
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  // Update URL helper for toggling filters
  const toggleFilter = (key: string, id: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const currentValues = newParams.get(key)?.split(",") || [];

    if (id === "all") {
      newParams.delete(key);
    } else {
      const index = currentValues.indexOf(id);
      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(id);
      }

      if (currentValues.length > 0) {
        newParams.set(key, currentValues.join(","));
      } else {
        newParams.delete(key);
      }
    }

    const queryString = newParams.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(url, { scroll: false });
  };

  // Debounce search query update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQuery = searchParams.get("q") || "";
      if (searchQuery !== currentQuery) {
        const newParams = new URLSearchParams(searchParams.toString());
        if (searchQuery) {
          newParams.set("q", searchQuery);
        } else {
          newParams.delete("q");
        }
        const queryString = newParams.toString();
        const url = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(url, { scroll: false });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, pathname, router, searchParams]);

  // Sync state with URL for back/forward (only for search)
  useEffect(() => {
    const query = searchParams.get("q") || "";
    if (query !== searchQuery) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Mémoïsé pour que les calculs de statut ci-dessous restent stables entre deux rendus.
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  // Process events data
  const processedEvents = useMemo(() => {
    return events.map((event) => {
      const startDate = new Date(event.startDate);
      const endDate = event.endDate ? new Date(event.endDate) : undefined;

      // Determine if ongoing
      const isOngoing = (endDate ? (today >= startDate && today <= endDate) : (today.getTime() === startDate.getTime()));

      // Determine if past
      const isPast = endDate ? endDate < today : startDate < today;

      // Map category and game IDs to objects (handle arrays)
      const eventCategories = event.categoryId
        ? event.categoryId
            .map(catId => categories.find((c) => c.id === catId))
            .filter(Boolean) as Array<{ id: string; name: string; color?: string }>
        : [];

      const eventGames = event.gameId
        ? event.gameId
            .map(gameId => games.find((g) => g.id === gameId))
            .filter(Boolean) as Array<{ id: string; name: string; icon?: string; color?: string }>
        : [];

      return {
        ...event,
        isOngoing,
        isPast,
        categories: eventCategories,
        games: eventGames,
      } as EventItem;
    });
  }, [events, categories, games, today]);

  // Process series data for the listing
  const processedSeries = useMemo(() => {
    return series.map((item) => {
      const { minDate, maxDate } = getSeriesDateBounds(item.dates);

      const isPast = maxDate < today;
      const isOngoing = !isPast && minDate <= today;

      const seriesGames = item.gameId
        ? item.gameId
            .map(gameId => games.find((g) => g.id === gameId))
            .filter(Boolean) as Array<{ id: string; name: string; icon?: string; color?: string }>
        : [];

      return {
        kind: "serie" as const,
        id: item.id,
        title: item.title,
        startDate: minDate.toISOString().split("T")[0],
        endDate: maxDate.toISOString().split("T")[0],
        cardThumbnail: item.cardThumbnail,
        color: item.color,
        dateCount: item.dates.length,
        categoryId: item.categoryId,
        gameId: item.gameId,
        games: seriesGames,
        isCancelled: item.isCancelled,
        isPast,
        isOngoing,
      } as SeriesListingItem;
    });
  }, [series, games, today]);

  // Conditional Filtering: Available games based on selected categories
  const availableGames = useMemo(() => {
    // If no categories selected, show all games that have at least one event
    const relevantEvents =
      selectedCategories.length > 0
        ? processedEvents.filter((e) =>
            e.categoryId?.some(catId => selectedCategories.includes(catId))
          )
        : processedEvents;

    const gameIds = Array.from(
      new Set(relevantEvents.flatMap((e) => e.gameId || []))
    );
    return games.filter((g) => gameIds.includes(g.id));
  }, [selectedCategories, processedEvents, games]);

  // Cleanup selected games when they are no longer available (due to category change)
  useEffect(() => {
    if (selectedGames.length === 0) return;

    const availableGameIds = availableGames.map((g) => g.id);
    const validSelectedGames = selectedGames.filter((id) =>
      availableGameIds.includes(id)
    );

    if (validSelectedGames.length !== selectedGames.length) {
      const newParams = new URLSearchParams(searchParams.toString());
      if (validSelectedGames.length > 0) {
        newParams.set("game", validSelectedGames.join(","));
      } else {
        newParams.delete("game");
      }
      const queryString = newParams.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(url, { scroll: false });
    }
  }, [availableGames, selectedGames, pathname, router, searchParams]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return processedEvents.filter((event) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        event.categoryId?.some(catId => selectedCategories.includes(catId));
      const gameMatch =
        selectedGames.length === 0 ||
        event.gameId?.some(gameId => selectedGames.includes(gameId));

      const searchLower = searchQuery.toLowerCase();
      const searchMatch =
        !searchQuery ||
        event.title.toLowerCase().includes(searchLower) ||
        event.location?.toLowerCase().includes(searchLower) ||
        event.categories?.some((c) =>
          c.name.toLowerCase().includes(searchLower)
        ) ||
        event.games?.some((g) => g.name.toLowerCase().includes(searchLower)) ||
        event.startDate.includes(searchLower);

      return categoryMatch && gameMatch && searchMatch;
    });
  }, [selectedCategories, selectedGames, searchQuery, processedEvents]);

  // Filter series (by category, game and search)
  const filteredSeries = useMemo(() => {
    return processedSeries.filter((series) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        series.categoryId?.some(catId => selectedCategories.includes(catId));
      const gameMatch =
        selectedGames.length === 0 ||
        series.gameId?.some(gameId => selectedGames.includes(gameId));

      const searchLower = searchQuery.toLowerCase();
      const searchMatch =
        !searchQuery ||
        series.title.toLowerCase().includes(searchLower);

      return categoryMatch && gameMatch && searchMatch;
    });
  }, [selectedCategories, selectedGames, searchQuery, processedSeries]);

  // Group and sort events
  const upcomingEvents = useMemo(() => {
    return filteredEvents
      .filter((e) => !e.isPast)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  }, [filteredEvents]);

  const pastEvents = useMemo(() => {
    return filteredEvents
      .filter((e) => e.isPast)
      .sort(
        (a, b) =>
          new Date(b.endDate ?? b.startDate).getTime() - new Date(a.endDate ?? a.startDate).getTime()
      );
  }, [filteredEvents]);

  // Merge events and series for final display
  const upcomingItems = useMemo(() => {
    const upcomingSeries = filteredSeries.filter(s => !s.isPast);
    return [...upcomingEvents, ...upcomingSeries].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }, [upcomingEvents, filteredSeries]);

  const pastItems = useMemo(() => {
    const pastSeries = filteredSeries.filter(s => s.isPast);
    return [...pastEvents, ...pastSeries].sort(
      (a, b) =>
        new Date(b.endDate ?? b.startDate).getTime() -
        new Date(a.endDate ?? a.startDate).getTime()
    );
  }, [pastEvents, filteredSeries]);

  return (
    <>
      <Head>
        <title>Événements Gaming | Holiday Geek Cup</title>
        <meta name="description" content="Découvrez tous les événements gaming et tournois esport organisés par Holiday Geek Cup. Filtrez par catégories et jeux pour trouver votre prochain défi." />
      </Head>
      <div className="min-h-screen bg-transparent pb-20">
      <PixelBackground
        className="relative pt-72 pb-24 flex flex-col items-center justify-center bg-transparent"
        speed={30}
        gap={10}
        colors="#111827"
        opacity={1}
        direction="center"
        haloRadius={250}
        haloSecondaryColor="#d97706"
        haloTertiaryColor="#86198f"
        haloDelay={100}
        canvasClassName="absolute inset-0"
        fadeBottom={true}
        fadeHeight={150}
      >
        <div className="container mx-auto px-4 relative z-10 w-full">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-theme font-rajdhani uppercase tracking-[0.3em] text-sm font-bold mb-4">
              Événements & Tournois
            </p>
            <h1 className="font-goldman text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white text-nowrap uppercase leading-[0.9] mb-8">
              Vivez l'expérience <span className="text-theme2">HGC</span>
            </h1>
            <p className="text-gray-400 font-rajdhani text-lg md:text-xl">
              Retrouvez tous nos tournois e-sport, nos événements communautaires
              et bien plus encore. Retrouvez ce qui a déjà été fait ou
              rejoignez-nous pour les prochaines étapes !
            </p>
          </div>

          {/* Search Bar - Part of EventFilters but moved here for layout */}
          <div className="max-w-2xl mx-auto">
            <EventFilters
              categories={categories}
              games={availableGames}
              selectedCategories={selectedCategories}
              onCategoryChange={(id) => toggleFilter("category", id)}
              selectedGames={selectedGames}
              onGameChange={(id) => toggleFilter("game", id)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              hideFilters={true}
            />
          </div>
        </div>
      </PixelBackground>

      <div className="container mx-auto px-4 mt-8">
        {/* Remaining Filters Section */}
        <EventFilters
          categories={categories}
          games={availableGames}
          selectedCategories={selectedCategories}
          onCategoryChange={(id) => toggleFilter("category", id)}
          selectedGames={selectedGames}
          onGameChange={(id) => toggleFilter("game", id)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          hideSearch={true}
        />

        {/* Dynamic Sections */}
        <div className="space-y-24">
          <EventGrid
            title="Prochainement & En Cours"
            subtitle="Ne manquez rien"
            events={upcomingItems}
            emptyMessage="Aucun événement à venir ne correspond à vos critères."
          />

          {pastItems.length > 0 && (
            <EventGrid
              title="Événements Passés"
              subtitle="C'était mémorable"
              events={pastItems}
              className="opacity-80"
            />
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default EventsContent;
