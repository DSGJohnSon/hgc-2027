"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { LuGamepad2, LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { Stories, StoriesContent, Story } from "@/components/stories-carousel";
import { CarouselPrevious, CarouselNext } from "@/components/carousel";
import Autoplay from "embla-carousel-autoplay";

import { Game } from "@/types/games";

import Image from "next/image";
import { cn } from "@/lib/utils";



interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  if (!game) return null;
  if (game.blockType === "block") {
    return (
      <div
        className="group relative rounded-2xl p-6 gap-4 transition-all duration-300 h-full border-2 border-white/10 box-border"
        style={{
          background:
            game.bgType === "gradient"
              ? `linear-gradient(to top, ${game.color1}, ${game.color2})`
              : game.color1,
        }}
      >
        {game.logo !== "" ? (
          <Image
            src={game.logo || "/assets/logos/default-game.svg"}
            alt={game.name}
            width={500}
            height={500}
            className={cn(
              "w-1/2 group-hover:w-[55%] transition-all duration-500 z-10",
              game.img && game.img !== ""
                ? "absolute top-1/2 -translate-y-1/2"
                : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            )}
          />
        ) : (
          <h4 className="font-rajdhani font-bold text-white text-xl uppercase tracking-wider text-center group-hover:text-white transition-colors">
            {game.name}
          </h4>
        )}

        {game.img && game.img !== "" && (
          <Image
            src={game.img}
            alt={game.name}
            width={500}
            height={500}
            className="w-[70%] group-hover:w-2/3 aspect-square object-contain rounded-xl absolute -top-1/4 -right-1/6 duration-500 z-50"
          />
        )}

        {game.bgImg && game.bgImg !== "" && (
          <Image
            src={game.bgImg}
            alt={`${game.name} background`}
            width={500}
            height={500}
            className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
          />
        )}
      </div>
    );
  }

  return (
    <div className="group relative bg-gray-900/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-white/20 transition-all duration-300 backdrop-blur-sm overflow-hidden h-full">
      <div
        className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: game.color1 || "var(--theme-color)" }}
      />

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
        <LuGamepad2
          className="w-8 h-8"
          style={{ color: game.color1 || "var(--theme-color)" }}
        />
      </div>

      <h4 className="font-rajdhani font-bold text-white text-xl uppercase tracking-wider text-center group-hover:text-white transition-colors">
        {game.name}
      </h4>
    </div>
  );
};

interface FreeplaySectionProps {
  /** Catalogue complet des jeux, fourni par la page (il vient de la base). */
  catalogue: Game[];
  games: string[];
  randomizeGames?: boolean;
  highlightColor: string;
  compact?: boolean;
}

const shuffleGames = (games: Game[]): Game[] => {
  const shuffled = [...games];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const FreeplaySection: React.FC<FreeplaySectionProps> = ({
  games: gameIds,
  catalogue,
  randomizeGames = false,
  highlightColor,
  compact = false,
}) => {
  const resolvedGames = useMemo(() => {
    const hasAllOnly = gameIds.length === 1 && gameIds[0] === "all";
    if (hasAllOnly) {
      return catalogue;
    }

    return gameIds
      .map((id) => {
        const game = catalogue.find((g) => g.id === id);
        return game || null;
      })
      .filter(Boolean) as Game[];
  }, [gameIds, catalogue]);

  const [displayGames, setDisplayGames] = useState<Game[]>(resolvedGames);

  useEffect(() => {
    if (randomizeGames) {
      setDisplayGames(shuffleGames(resolvedGames));
      return;
    }

    setDisplayGames(resolvedGames);
  }, [resolvedGames, randomizeGames]);

  const autoplayRef = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  return (
    <section className={cn("bg-transparent", compact ? "py-10" : "py-20")}>
      <div className={cn(compact ? "w-full" : "container mx-auto px-4")}>
        <div
          className={cn(
            "space-y-4",
            compact ? "mb-8 text-center" : "text-center mb-12",
          )}
        >
          <p
            className="text-theme2 font-rajdhani uppercase tracking-widest text-sm font-semibold"
            style={{ color: highlightColor }}
          >
            Incontournables
          </p>
          <h2
            className={cn(
              "font-goldman text-white uppercase tracking-tight",
              compact ? "text-3xl sm:text-4xl" : "text-4xl sm:text-5xl",
            )}
          >
            Nos jeux en Freeplay
          </h2>
        </div>

        {displayGames.length > 4 ? (
          <div className="w-full">
            <Stories
              plugins={[autoplayRef.current]}
              opts={{
                loop: true,
                slidesToScroll: 1,
              }}
              className="w-full"
            >
              <StoriesContent className={cn(compact ? "gap-8 py-2" : "gap-16 p-4")}>
                {displayGames.map((game: Game, index: number) => (
                  <Story
                    key={index}
                    className="w-70! sm:w-[320px]! md:w-100! aspect-2/1 bg-transparent shadow-none hover:scale-103 transition-transform duration-300"
                  >
                    <GameCard game={game} />
                  </Story>
                ))}
              </StoriesContent>
              <div className={cn("flex w-full justify-end gap-4", compact ? "mt-4" : "mt-8")}>
                <CarouselPrevious
                  size="carouselTrophies"
                  variant="carouselTrophies"
                  className="relative inset-0"
                >
                  <LuArrowLeft />
                </CarouselPrevious>
                <CarouselNext
                  size="carouselTrophies"
                  variant="carouselTrophies"
                  className="relative inset-0"
                >
                  <LuArrowRight />
                </CarouselNext>
              </div>
            </Stories>
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-wrap justify-center mx-auto",
              compact ? "gap-8 max-w-full" : "gap-16 max-w-6xl",
            )}
          >
            {displayGames.map((game: Game, index: number) => (
              <div
                key={index}
                className={cn("aspect-2/1", compact ? "w-70 sm:w-80" : "w-75 sm:w-87.5")}
              >
                <GameCard game={game} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FreeplaySection;
export { GameCard };
