"use client";

import React, { useRef } from "react";
import {
  Stories,
  StoriesContent,
  Story,
  StoryImage,
} from "@/components/stories-carousel";
import { CarouselPrevious, CarouselNext } from "@/components/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

export interface TrophyCarouselData {
  title: string;
  subtitle: string;
  images: string[];
}

interface TrophyCarouselProps {
  data: TrophyCarouselData;
  className?: string;
}

const TrophyCarousel: React.FC<TrophyCarouselProps> = ({ data, className }) => {
  const { title, subtitle, images } = data;

  // Autoplay plugin with pause on interaction
  const autoplayRef = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  return (
    <section
      className={cn("relative w-full py-16 md:py-32 bg-transparent", className)}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 space-y-2 md:space-y-4">
          <p className="text-theme2 font-rajdhani uppercase tracking-wider text-sm sm:text-base font-semibold">
            {subtitle}
          </p>
          <h2 className="font-goldman text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white uppercase px-4">
            {title}
          </h2>
        </div>

        {/* Carousel - Optimized for 9:16 aspect ratio (stories format: 1080x1920) */}
        <div className="w-full">
          <Stories
            className="w-full"
            plugins={[autoplayRef.current]}
            opts={{
              loop: false,
              slidesToScroll: 1,
            }}
          >
            <StoriesContent className="gap-4 md:gap-6 p-4">
              {images.map((imageSrc, index) => (
                <Story
                  key={index}
                  className="w-45! sm:w-56! md:w-67.5! lg:w-78.75! aspect-9/16 p-4"
                >
                  <StoryImage src={imageSrc} alt={`Trophy ${index + 1}`} />
                </Story>
              ))}
            </StoriesContent>
            <div className="flex w-full justify-end gap-4">
              <CarouselPrevious size="carouselTrophies" variant="carouselTrophies">
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

export default TrophyCarousel;
