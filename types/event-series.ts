import type { Event } from "./pages/detail-event";

export type DescriptionBlock = NonNullable<Event["description"]>[number];
export type TransportsData = Event["transports"];
export type Partner = NonNullable<Event["partners"]>[number];

export type SeriesDate = {
  id: string;
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
  freeplayGames?: string[];
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
  freeplayGames: string[];
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
  gameId?: string[];
  games?: Array<{ id: string; name: string; icon?: string; color?: string }>;
  isCancelled?: boolean;
  isPast?: boolean;
  isOngoing?: boolean;
};
