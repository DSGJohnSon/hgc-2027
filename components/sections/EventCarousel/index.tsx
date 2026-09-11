"use client";

import React, { useRef } from "react";
import { Stories, StoriesContent, Story } from "@/components/stories-carousel";
import { CarouselPrevious, CarouselNext } from "@/components/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import EventCard from "./EventCard";
import { EventCard as EventCardProps } from "@/types/pages/detail-event";
import { Game } from "@/types/games";


export interface EventCarouselData {
  title: string;
  subtitle: string;
  events: EventCardProps[];
}

interface EventCarouselProps {
  data: EventCarouselData;
  className?: string;
  loop?: boolean;
  subtitleColor?: string;
  /** Référentiels transmis par la page serveur (ils viennent de la base). */
  games?: Game[];
  categories?: Array<{ id: string; name: string; color?: string }>;
}

type IdOrRef = string | { id: string; name?: string };

/** Libellé d'une référence déjà résolue, à défaut son identifiant. */
const getName = (ref: IdOrRef): string =>
  typeof ref === "string" ? ref : (ref.name ?? ref.id);

const EventCarousel: React.FC<EventCarouselProps> = ({ 
  data, 
  className,
  loop = true,
  subtitleColor,
  games = [],
  categories = [],
}) => {
  const { title, subtitle, events } = data;

  // Autoplay plugin with pause on interaction
  const autoplayRef = useRef(
    Autoplay({
      delay: 60000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  // Map game IDs and category IDs to full objects
  const eventsWithGamesAndCategories: EventCardProps[] = events.map((event) => {
    const gameRefs = (event.games ?? []) as IdOrRef[];
    const categoryRefs = (event.categories ?? []) as IdOrRef[];

    return {
      ...event,
      games: gameRefs.map((gameIdOrObj) => {
        const gameId =
          typeof gameIdOrObj === "string" ? gameIdOrObj : gameIdOrObj.id;
        const game = games.find((g) => g.id === gameId);
        if (game) return { id: game.id, name: game.name };
        // Certains appelants (le hero de l'accueil) fournissent des références déjà
        // résolues : on garde leur libellé plutôt que d'afficher « Unknown ».
        return { id: gameId, name: getName(gameIdOrObj) };
      }),
      categories: categoryRefs.map((categoryIdOrObj) => {
        const categoryId =
          typeof categoryIdOrObj === "string"
            ? categoryIdOrObj
            : categoryIdOrObj.id;
        const category = categories.find((c) => c.id === categoryId);
        if (category) return { id: category.id, name: category.name };
        return { id: categoryId, name: getName(categoryIdOrObj) };
      }),
    };
  });

  return (
    <section
      className={cn("relative w-full py-16 md:py-32 bg-transparent", className)}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 space-y-2 md:space-y-4">
          <p
            className="text-theme2 font-rajdhani uppercase tracking-wider text-sm sm:text-base font-semibold"
            style={subtitleColor ? { color: subtitleColor } : undefined}
          >
            {subtitle}
          </p>
          <h2 className="font-goldman text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase px-4">
            {title}
          </h2>
        </div>

        {/* Carousel */}
        <div className="w-full">
          <Stories
            className="w-full"
            plugins={[autoplayRef.current]}
            opts={{
              loop: loop,
              slidesToScroll: 1,
              align: "start",
            }}
          >
            <StoriesContent className="gap-0 md:gap-6">
              {eventsWithGamesAndCategories.map((event, index) => (
                <Story
                  key={index}
                  className="basis-full pl-0 sm:basis-auto sm:w-70! md:w-85! lg:w-100! p-0 sm:pl-4 bg-transparent shadow-none hover:scale-100"
                >
                  <div className="px-4 sm:px-0 h-full">
                    <EventCard {...event} />
                  </div>
                </Story>
              ))}
            </StoriesContent>
            <div className="flex w-full justify-end gap-4 mt-6">
              <CarouselPrevious
                size="carouselTrophies"
                variant="carouselTrophies"
              >
                <LuArrowLeft />
              </CarouselPrevious>
              <CarouselNext size="carouselTrophies" variant="carouselTrophies">
                <LuArrowRight />
              </CarouselNext>
            </div>
          </Stories>
        </div>
      </div>
    </section>
  );
};

export default EventCarousel;
