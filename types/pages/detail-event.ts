import { GalleryData } from "../components/sections/Gallery";
import { StatisticsData } from "../components/sections/Statistics";

// ============================================
// CENTRAL EVENT TYPE - Source of Truth
// ============================================
export type Event = {
  id: string;
  type: "tournoi" | "event" | "both";
  title: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  cardThumbnail: string;
  heroBanner: string;
  heroBannerMobile: string;
  location?: string;
  categoryId?: string[];
  gameId?: string[];
  color: string;
  description?: (
    | {
        type: "text";
        content: {
          type: "title" | "paragraph" | "list" | "citation";
          title?: string;
          paragraphs?: string[];
          items?: string[];
          citationText?: string;
        }[];
      }
    | {
        type: "gallery";
        content: GalleryData;
      }
    | {
        type: "statistics";
        content: StatisticsData;
      }
  )[];
  transports?: {
    metro?: {
      lines: string[];
      station: string;
      walkTimeInMin: number;
    }[];
    bus?: {
      lines: string[];
      station: string;
      walkTimeInMin: number;
    }[];
    tramway?: {
      lines: string[];
      station: string;
      walkTimeInMin: number;
    }[];
    car?: {
      parkings: {
        name: string;
        address: string;
        distanceInMeters: number;
        walkTimeInMin: number;
      }[];
    };
  };
  weezeventCode?: string;
  registrationOpen?: boolean;
  partners?: {
    alt: string;
    src: string;
  }[];
  freeplayGames: string[];
  randomizeFreeplayGames?: boolean;
  isCancelled?: boolean;
};

// ============================================
// UTILITY TYPES - Derived from Event
// ============================================

/**
 * Event card representation for carousels and lists
 * Used in: EventCarousel, Hero section, Event listing pages
 */
export type EventCard = Pick<
  Event,
  "id" | "type" | "title" | "startDate" | "startTime" | "endTime" | "cardThumbnail" | "color"
> & {
  startDate: string;
  endDate?: string;
  time: string; // Formatted time for display
  categories?: Array<{
    id: string;
    name: string;
  }>;
  games?: Array<{
    id: string;
    name: string;
    icon?: string;
  }>;
  isPast?: boolean; // Whether the event has ended
  isOngoing?: boolean; // Whether the event is currently happening
  isUpcoming?: boolean; // Whether the event is in the future
  isCancelled?: boolean; // Whether the event is cancelled
  linkHref?: string; // Optional custom link for special cards
  gradientTheme?: "theme" | "theme2" | "fifa-season";
  buttonText?: string;
  buttonLink?: string;
};

/**
 * Event item with additional computed properties
 * Used in: Event listing/filtering pages
 */
export type EventItem = Event & {
  isOngoing?: boolean;
  isPast?: boolean;
  isCancelled?: boolean;
  categories?: Array<{
    id: string;
    name: string;
    color?: string;
  }>;
  games?: Array<{
    id: string;
    name: string;
    icon?: string;
    color?: string;
  }>;
};

/**
 * Minimal event hero data
 * Used in: Event detail page hero section
 */
export type EventHero = Pick<
  Event,
  "title" | "type" | "heroBanner" | "heroBannerMobile" | "color"
> & {
  categoryName?: string;
  isCancelled?: boolean;
};
