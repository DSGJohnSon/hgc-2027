"use client";

import React from "react";
import Image from "next/image";
import { LuTrophy, LuGamepad2 } from "react-icons/lu";
import { EventHero as EventHeroProps } from "@/types/pages/detail-event";
import { cn } from "@/lib/utils";

const EventHero: React.FC<
  EventHeroProps & {
    bannerImage: string;
    bannerImageMobile?: string;
  }
> = ({
  title,
  type,
  categoryName,
  bannerImage,
  bannerImageMobile,
  color,
  isCancelled,
}) => {
  const highlightColor = color || "#d97706";

  return (
    <section className="relative w-full px-4 lg:px-0 h-[80svh] overflow-hidden">
      {/* Background Image Desktop */}
      <div className="hidden md:block absolute inset-0">
        <Image
          src={bannerImage}
          alt={title}
          fill
          priority
          className={cn("object-cover", isCancelled && "grayscale")}
        />
        {isCancelled && (
          <div className="relative top-0 left-0 w-full h-full z-30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-4 rounded-lg font-rajdhani font-bold uppercase tracking-wider text-2xl text-nowrap z-20">
              Événement annulé
            </div>
            <div className="absolute inset-0 bg-gray-950/70 z-10"></div>
          </div>
        )}
      </div>

      {/* Background Image Mobile */}
      <div className="md:hidden absolute inset-0">
        <Image
          src={bannerImageMobile || bannerImage}
          alt={title}
          fill
          priority
          className={cn("object-cover", isCancelled && "grayscale")}
        />
        {/* Cancelled Badge */}
        {isCancelled && (
          <div className="relative top-0 left-0 w-full h-full z-30">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg font-rajdhani font-bold uppercase tracking-wider text-lg text-nowrap z-20">
              Événement annulé
            </div>
            <div className="absolute inset-0 bg-gray-950/70 z-10"></div>
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `linear-gradient(to top, ${highlightColor}cc, ${highlightColor}33, transparent 70%)`,
        }}
      />

      {/* Content Container */}
      <div className="container mx-auto h-full relative z-20 flex items-end pb-12">
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Left Side: Type and Title */}
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg backdrop-blur-md border border-white/20 bg-gray-950/40">
                {type === "both" ? (
                  <div className="flex items-center gap-2">
                    <LuTrophy size={18} className="text-white" />
                    <span className="text-white text-xs">&</span>
                    <LuGamepad2 size={18} className="text-white" />
                  </div>
                ) : type === "tournoi" ? (
                  <LuTrophy size={18} className="text-white" />
                ) : (
                  <LuGamepad2 size={18} className="text-white" />
                )}
              </div>
              <span className="font-rajdhani font-bold text-white uppercase tracking-[0.2em] text-sm sm:text-base">
                {type === "both"
                  ? "Évènement & Tournoi Officiel"
                  : type === "tournoi"
                    ? "Tournoi Officiel"
                    : "Événement HGC"}
              </span>
            </div>
            <h1 className="font-goldman text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-[0.9] drop-shadow-2xl text-balance">
              {title}
            </h1>
          </div>

          {/* Right Side: Category */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="font-rajdhani text-white/60 uppercase tracking-widest text-xs font-bold">
              Catégorie
            </span>
            <div
              className="px-6 py-2 rounded-full border-2 font-rajdhani font-bold text-white uppercase tracking-wider text-lg backdrop-blur-md"
              style={{
                borderColor: highlightColor,
                backgroundColor: `${highlightColor}33`,
                boxShadow: `0 0 20px ${highlightColor}4d`,
              }}
            >
              {categoryName}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventHero;
