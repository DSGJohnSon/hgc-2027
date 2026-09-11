"use client";

import { useEffect, useState } from "react";
import { LucideArrowLeft, LucideArrowRight } from "lucide-react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/carousel";
import type { Testimonial } from "@/types/pages/collectivites";

/**
 * Panneau de citations de la page « collectivités ».
 *
 * Les flèches et le compteur étaient jusqu'ici décoratifs : un seul témoignage
 * était affiché quoi qu'il arrive. Ils pilotent désormais réellement le
 * carrousel, qui reprend le rendu et les variantes de boutons de
 * `TrophyCarousel` — même famille de composants, même placement des flèches.
 *
 * L'index courant vient d'Embla plutôt que d'un état local : c'est lui qui fait
 * autorité, puisque le défilement peut aussi venir d'un glissement au doigt ou
 * des flèches du clavier.
 */
const TestimonialsCarousel = ({ items }: { items: Testimonial[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    // On s'abonne sans lire la valeur tout de suite : un carrousel démarre
    // toujours sur sa première diapositive, et `select` couvre la suite.
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect).on("reInit", onSelect);

    return () => {
      api.off("select", onSelect).off("reInit", onSelect);
    };
  }, [api]);

  if (items.length === 0) return null;

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: items.length > 1, align: "start" }}
      className="w-full lg:w-2/3 text-white border-t lg:border-t-0 lg:border-l border-white flex flex-col self-stretch pt-8 lg:p-8 xl:p-16"
    >
      <CarouselContent>
        {items.map((item, index) => (
          <CarouselItem
            key={`${item.authorName}-${index}`}
            className="basis-full"
          >
            <span className="font-goldman text-6xl sm:text-8xl leading-none">
              &quot;
            </span>
            <p className="font-rajdhani text-lg sm:text-xl xl:text-2xl text-balance">
              {item.quote}
            </p>
            <div className="flex items-center gap-4 mt-8">
              {item.authorLogo.src && (
                <div className="size-12 sm:size-16 shrink-0">
                  <Image
                    src={item.authorLogo.src}
                    alt={item.authorLogo.alt}
                    width={50}
                    height={50}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div>
                <span className="font-rajdhani text-base sm:text-lg font-bold">
                  {item.authorName}
                </span>
                <span className="font-rajdhani text-base sm:text-lg block">
                  {item.eventLabel}
                </span>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/*
        Un seul témoignage : les commandes n’auraient rien à piloter.

        `CarouselPrevious` et `CarouselNext` rendent leur propre icône ; les
        enfants passés ci-dessous ne servent qu’à satisfaire le type de
        `Button`, qui les exige. Même convention que `TrophyCarousel`.
      */}
      {items.length > 1 && (
        <div className="flex items-center justify-end gap-4 mt-8">
          <CarouselPrevious
            variant="carouselTrophies"
            size="carouselTrophies"
            className="cursor-pointer"
          >
            <LucideArrowLeft className="w-4 h-4" />
          </CarouselPrevious>
          <CarouselNext
            variant="carouselTrophies"
            size="carouselTrophies"
            className="cursor-pointer"
          >
            <LucideArrowRight className="w-4 h-4" />
          </CarouselNext>
          <span
            className="font-rajdhani font-bold"
            aria-live="polite"
            aria-atomic="true"
          >
            {current + 1}/{items.length}
          </span>
        </div>
      )}
    </Carousel>
  );
};

export default TestimonialsCarousel;
