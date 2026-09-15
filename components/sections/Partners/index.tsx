"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/carousel";
import { Sparkles } from "@/components/ui/sparkles";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AutoScroll from "embla-carousel-auto-scroll";
import { useMemo } from "react";

export interface PartnersData {
  subtitle: string;
  title: string;
  logos: Array<{
    alt: string;
    src: string;
  }>;
}

interface PartnersProps {
  data: PartnersData;
  isLastSection?: boolean;
  compact?: boolean;
  subtitleColor?: string;
}

const LogoItem = ({
  logo,
  className,
}: {
  logo: { alt: string; src: string };
  className?: string;
}) => (
  <div className={cn("relative h-32 w-32 md:h-48 md:w-48", className)}>
    <Image
      alt={logo.alt}
      className="pointer-events-none select-none object-cover w-full h-full"
      width={500}
      height={500}
      loading="lazy"
      src={logo.src}
    />
  </div>
);

export default function Partners({
  data,
  isLastSection = false,
  compact = false,
  subtitleColor,
}: PartnersProps) {
  const totalLogos = data.logos.length;
  const numRowsMobile = totalLogos >= 12 ? 3 : totalLogos >= 8 ? 2 : 1;
  const mobileLogosPerRow = Math.ceil(totalLogos / numRowsMobile);

  const row1Logos =
    numRowsMobile > 1 ? data.logos.slice(0, mobileLogosPerRow) : data.logos;
  const row2Logos =
    numRowsMobile >= 2
      ? data.logos.slice(mobileLogosPerRow, mobileLogosPerRow * 2)
      : [];
  const row3Logos =
    numRowsMobile >= 3 ? data.logos.slice(mobileLogosPerRow * 2) : [];

  const autoScrollDesktop = useMemo(
    () =>
      AutoScroll({
        speed: 0.5,
        stopOnInteraction: false,
        startDelay: 0,
      }),
    [],
  );

  const autoScrollMobile1 = useMemo(
    () =>
      AutoScroll({
        speed: 0.5,
        stopOnInteraction: false,
        startDelay: 0,
      }),
    [],
  );

  const autoScrollMobile2 = useMemo(
    () =>
      AutoScroll({
        speed: -0.5,
        stopOnInteraction: false,
        startDelay: 0,
      }),
    [],
  );

  const autoScrollMobile3 = useMemo(
    () =>
      AutoScroll({
        speed: 0.5,
        stopOnInteraction: false,
        startDelay: 0,
      }),
    [],
  );

  return (
    <div
      className={cn(
        "w-full overflow-hidden bg-transparent",
        compact
          ? "h-auto min-h-0"
          : isLastSection
            ? "h-auto min-h-[60svh] sm:min-h-[70svh] md:h-[80svh]"
            : "h-auto min-h-screen md:h-screen",
      )}
    >
      <div
        className={cn(
          compact
            ? "w-full"
            : "container mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 md:mt-32 max-w-full",
        )}
      >
        <div
          className={cn(
            compact
              ? "mb-8 space-y-2 text-center"
              : "text-center mb-8 sm:mb-12 md:mb-16 space-y-2 sm:space-y-3 md:space-y-4",
          )}
        >
          <p
            className="text-theme2 font-rajdhani uppercase tracking-wider text-sm sm:text-base font-semibold"
            style={subtitleColor ? { color: subtitleColor } : undefined}
          >
            {data.subtitle}
          </p>
          <h2
            className={cn(
              "font-goldman text-white uppercase",
              compact
                ? "text-3xl sm:text-4xl tracking-tight"
                : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-4",
            )}
          >
            {data.title}
          </h2>
        </div>

        <div
          className={cn(
            "flex flex-col relative z-50",
            compact ? "gap-3" : "gap-3 md:gap-6",
          )}
        >
          <div
            className={cn(
              compact
                ? "overflow-hidden w-full py-2"
                : "overflow-hidden w-full py-4",
              totalLogos > 3
                ? "mask-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(0,0,0,1)_15%,rgba(0,0,0,1)_85%,rgba(255,255,255,0)_100%)] sm:mask-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(0,0,0,1)_20%,rgba(0,0,0,1)_80%,rgba(255,255,255,0)_100%)]"
                : "mask-none sm:mask-none",
              totalLogos > 5
                ? "md:mask-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(0,0,0,1)_25%,rgba(0,0,0,1)_75%,rgba(255,255,255,0)_100%)]"
                : "md:mask-none",
            )}
          >
            <div className="hidden md:block w-full">
              {totalLogos <= 5 ? (
                <div className="flex flex-wrap justify-center items-center gap-8 w-full">
                  {data.logos.map((logo, index: number) => (
                    <LogoItem key={`desktop-logo-row1-${index}`} logo={logo}/>
                  ))}
                </div>
              ) : (
                <Carousel
                  plugins={[autoScrollDesktop]}
                  opts={{
                    loop: true,
                    align: "center",
                    dragFree: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="gap-8 items-center">
                    {data.logos.map((logo, index: number) => (
                      <CarouselItem
                        key={`desktop-logo-row1-${index}`}
                        className="basis-auto"
                      >
                        <LogoItem logo={logo} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              )}
            </div>

            <div className="md:hidden w-full">
              {totalLogos <= 3 ? (
                <div className="flex flex-wrap justify-center items-center gap-4 w-full px-4">
                  {row1Logos.map((logo, index: number) => (
                    <LogoItem key={`mobile-logo-row1-${index}`} logo={logo} />
                  ))}
                </div>
              ) : (
                <Carousel
                  plugins={[autoScrollMobile1]}
                  opts={{
                    loop: true,
                    align: "center",
                    dragFree: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="gap-4 items-center">
                    {row1Logos.map((logo, index: number) => (
                      <CarouselItem
                        key={`mobile-logo-row1-${index}`}
                        className="basis-auto"
                      >
                        <LogoItem logo={logo} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              )}
            </div>
          </div>

          {numRowsMobile >= 2 && (
            <div
              className={cn(
                "md:hidden overflow-hidden w-full",
                "mask-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(0,0,0,1)_15%,rgba(0,0,0,1)_85%,rgba(255,255,255,0)_100%)]",
              )}
            >
              <Carousel
                plugins={[autoScrollMobile2]}
                opts={{
                  loop: true,
                  align: "center",
                  dragFree: true,
                }}
                className="w-full"
              >
                <CarouselContent className="gap-4">
                  {row2Logos.map((logo, index: number) => (
                    <CarouselItem
                      key={`logo-row2-${index}`}
                      className="basis-auto"
                    >
                      <LogoItem logo={logo} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}

          {numRowsMobile >= 3 && (
            <div
              className={cn(
                "md:hidden overflow-hidden w-full",
                "mask-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(0,0,0,1)_15%,rgba(0,0,0,1)_85%,rgba(255,255,255,0)_100%)]",
              )}
            >
              <Carousel
                plugins={[autoScrollMobile3]}
                opts={{
                  loop: true,
                  align: "center",
                  dragFree: true,
                }}
                className="w-full"
              >
                <CarouselContent className="gap-4">
                  {row3Logos.map((logo, index: number) => (
                    <CarouselItem
                      key={`logo-row3-${index}`}
                      className="basis-auto"
                    >
                      <LogoItem logo={logo} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}
        </div>
      </div>

      {!compact && (
        <div className="relative z-0 -mt-16 sm:-mt-24 md:-mt-32 h-48 sm:h-64 md:h-80 lg:h-96 w-full overflow-hidden mask-[radial-gradient(50%_50%,#030712,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#030712,transparent_70%)] before:opacity-40 after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-theme after:bg-gray-900">
          <Sparkles
            density={1200}
            speed={0.2}
            color="#fff"
            background="#030712"
            className="absolute inset-x-0 bottom-0 h-full w-full mask-[radial-gradient(50%_50%,#030712,transparent_85%)]"
          />
        </div>
      )}
    </div>
  );
}
