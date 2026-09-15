import type { Event } from "./pages/detail-event";

export type DescriptionBlock = NonNullable<Event["description"]>[number];
export type TransportsData = Event["transports"];
export type Partner = NonNullable<Event["partners"]>[number];

/**
 * Étape d'une série : un événement rattaché à la série, dont les champs laissés
 * vides ont déjà été complétés avec ceux de la série.
 */
export type SeriesDate = {
  id: string;
  type?: Event["type"];
  title?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location: string;
  description?: DescriptionBlock[];
  weezeventCode?: string;
  registrationOpen?: boolean;
  isCancelled?: boolean;
  cardThumbnail: string;
  heroBanner: string;
  heroBannerMobile: string;
  categoryId?: string[];
  freeplayGames?: string[];
  randomizeFreeplayGames?: boolean;
  gameId?: string[];
  transports?: TransportsData;
  partners?: Partner[];
};

export type EventSeries = {
  id: string;
  type: "serie";
  title: string;
  color: string;
  cardThumbnail: string;
  heroBanner: string;
  heroBannerMobile: string;
  categoryId?: string[];
  freeplayGames: string[];
  randomizeFreeplayGames?: boolean;
  gameId?: string[];
  description?: DescriptionBlock[];
  partners?: Partner[];
  isCancelled?: boolean;
  dates: SeriesDate[];
};

export type SeriesListingItem = {
  kind: "serie";
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  cardThumbnail: string;
  color: string;
  dateCount: number;
  categoryId?: string[];
  gameId?: string[];
  games?: Array<{ id: string; name: string; icon?: string; color?: string }>;
  isCancelled?: boolean;
  isPast?: boolean;
  isOngoing?: boolean;
};
