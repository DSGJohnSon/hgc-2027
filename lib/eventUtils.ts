import { Event, EventCard } from "@/types/pages/detail-event";
import { EventSeries } from "@/types/event-series";
import { Game } from "@/types/games";

/**
 * Référentiels nécessaires pour résoudre les identifiants portés par un événement
 * (`gameId`, `categoryId`) en objets affichables.
 *
 * Ils étaient auparavant importés directement depuis `data/` ; ils sont désormais
 * passés en paramètre, car ils viennent de la base et se lisent donc de façon
 * asynchrone (voir `lib/content`).
 */
export type Referentials = {
  games: Game[];
  categories: Array<{ id: string; name: string; color?: string }>;
};

// Bornes d'une série : début de la première date -> FIN de la dernière date
export function getSeriesDateBounds(
  dates: { startDate: string; endDate?: string }[]
): { minDate: Date; maxDate: Date } {
  const startTimestamps = dates.map((d) => new Date(d.startDate).getTime());
  const endTimestamps = dates.map((d) =>
    new Date(d.endDate || d.startDate).getTime()
  );

  return {
    minDate: new Date(Math.min(...startTimestamps)),
    maxDate: new Date(Math.max(...endTimestamps)),
  };
}

// Common sorting logic for events and series
function sortByStatus(a: { isPast?: boolean; isOngoing?: boolean; isUpcoming?: boolean; isCancelled?: boolean; startDate: string }, b: { isPast?: boolean; isOngoing?: boolean; isUpcoming?: boolean; isCancelled?: boolean; startDate: string }) {
  const getPriority = (item: typeof a) => {
    if (item.isUpcoming) return 0;
    if (item.isOngoing) return 1;
    if (item.isCancelled) return 2;
    return 3; // past
  };
  const priorityA = getPriority(a);
  const priorityB = getPriority(b);
  if (priorityA !== priorityB) return priorityA - priorityB;
  if (priorityA === 3) {
    // For past events, show the ones closest to today first.
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  }
  // For upcoming/ongoing/cancelled, keep oldest date first.
  return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
}

export function prepareEvents(
  events: Event[],
  refs: Referentials,
  excludeId?: string,
  limit?: number
): EventCard[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let filteredEvents = events;

  if (excludeId) {
    filteredEvents = events.filter((e) => e.id !== excludeId);
  }

  const prepared = filteredEvents
    .map((e) => {
      const startDate = new Date(e.startDate);
      const endDate = e.endDate ? new Date(e.endDate) : startDate;
      const isPast = endDate < today;
      const isOngoing = !isPast && startDate <= today && (e.endDate ? endDate >= today : startDate.getTime() === today.getTime());
      const isUpcoming = startDate > today;
      const isCancelled = e.isCancelled;

      return {
        id: e.id,
        type: e.type as "tournoi" | "event",
        title: e.title,
        startDate: e.startDate,
        endDate: e.endDate,
        time: e.startTime || "",
        cardThumbnail: e.cardThumbnail,
        color: e.color,
        isPast,
        isOngoing,
        isUpcoming,
        isCancelled,
        date: e.startDate,
        categories: e.categoryId
          ?.map((catId) => refs.categories.find((c) => c.id === catId))
          .filter(
            (cat): cat is { id: string; name: string } => cat !== undefined,
          ),
        games: e.gameId
          ?.map((gameId) => refs.games.find((g) => g.id === gameId))
          .filter(
            (game): game is NonNullable<typeof game> =>
              game !== undefined,
          ),
      };
    })
    .sort(sortByStatus);

  if (limit) {
    return prepared.slice(0, limit);
  }

  return prepared;
}

export function prepareEventSeries(
  series: EventSeries[],
  refs: Referentials,
  excludeId?: string,
  limit?: number
): EventCard[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let filteredSeries = series;

  if (excludeId) {
    filteredSeries = series.filter((s) => s.id !== excludeId);
  }

  const prepared = filteredSeries
    .map((s) => {
      // Calculate min and max dates from all dates in the series
      const { minDate, maxDate } = getSeriesDateBounds(s.dates);

      const isPast = maxDate < today;
      const isOngoing = !isPast && minDate <= today && maxDate >= today;
      const isUpcoming = minDate > today;
      const isCancelled = s.isCancelled;

      return {
        id: s.id,
        type: "event" as const, // Display as event in carousel
        title: s.title,
        startDate: minDate.toISOString().split("T")[0],
        endDate: maxDate.toISOString().split("T")[0],
        time: s.dates[0]?.startTime || "",
        cardThumbnail: s.cardThumbnail,
        color: s.color,
        isPast,
        isOngoing,
        isUpcoming,
        isCancelled,
        date: minDate.toISOString().split("T")[0],
        categories: [],
        games: s.gameId
          ?.map((gameId) => refs.games.find((g) => g.id === gameId))
          .filter(
            (game): game is NonNullable<typeof game> =>
              game !== undefined,
          ),
      };
    })
    .sort(sortByStatus);

  if (limit) {
    return prepared.slice(0, limit);
  }

  return prepared;
}

export function mergeSeriesAndEvents(
  series: EventCard[],
  events: EventCard[],
  limit?: number
): EventCard[] {
  // Track which items are series for sorting priority
  const seriesIds = new Set(series.map(s => s.id));

  // Combine all items
  const all = [...series, ...events];

  // Sort by status first, then series > events within same status, then by date
  const sorted = all.sort((a, b) => {
    // Priority order: upcoming, ongoing, cancelled, past
    const getPriority = (item: EventCard) => {
      if (item.isUpcoming) return 0;
      if (item.isOngoing) return 1;
      if (item.isCancelled) return 2;
      return 3; // past
    };

    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    // Different status: sort by status first
    if (priorityA !== priorityB) return priorityA - priorityB;

    // Same status: sort by series first (series > events)
    const aIsSeries = seriesIds.has(a.id);
    const bIsSeries = seriesIds.has(b.id);
    if (aIsSeries !== bIsSeries) return aIsSeries ? -1 : 1;

    // Same status and type: sort by date
    if (priorityA === 3) {
      // For past items, show the ones closest to today first
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    }
    // For upcoming/ongoing/cancelled, keep oldest date first
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  if (limit) {
    return sorted.slice(0, limit);
  }

  return sorted;
}