"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LuCalendar, LuGamepad2, LuMapPin, LuLayers } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { SeriesListingItem } from "@/types/event-series";

const SeriesCard: React.FC<SeriesListingItem> = ({
  id,
  title,
  startDate,
  endDate,
  cardThumbnail,
  color,
  dateCount,
  games = [],
  isCancelled,
  isPast,
  isOngoing,
}) => {
  const highlightColor = color || "var(--theme-color)";

  const formatDateRange = (start: string, end: string) => {
    const startD = new Date(start);
    const endD = new Date(end);

    const sameYear = startD.getFullYear() === endD.getFullYear();
    const sameMonth = sameYear && startD.getMonth() === endD.getMonth();

    const startFormatted = startD.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: sameMonth ? undefined : "long",
    });
    const endFormatted = endD.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return `Du ${startFormatted} au ${endFormatted}`;
  };

  const displayDate = formatDateRange(startDate, endDate);

  return (
    <Link
      href={`/evenements/${id}`}
      className={cn(
        "group relative flex flex-col w-full rounded-xl overflow-hidden duration-300 border-2 transition-all bg-gray-950/40 backdrop-blur-sm cursor-pointer no-underline",
        isOngoing ? "shadow-lg" : isPast ? "border-white/5 opacity-80 grayscale-[0.3]" : "border-white/5",
      )}
      style={
        {
          borderColor: isOngoing ? highlightColor : undefined,
          boxShadow: isOngoing ? `0 0 20px ${highlightColor}4d` : undefined,
        } as React.CSSProperties
      }
      onMouseEnter={(e) => {
        if (!isOngoing && !isPast) {
          e.currentTarget.style.borderColor = highlightColor;
        }
      }}
      onMouseLeave={(e) => {
        if (!isOngoing && !isPast) {
          e.currentTarget.style.borderColor = "";
        }
      }}
    >
      {/* Ongoing badge */}
      {isOngoing && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full animate-pulse shadow-lg bg-gray-950">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="text-[10px] font-rajdhani font-bold text-white uppercase tracking-wider">
            En Cours
          </span>
        </div>
      )}

      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={cardThumbnail}
          alt={title}
          fill
          className={cn(
            "object-cover transition-transform duration-700 group-hover:scale-105",
            isCancelled && "grayscale",
          )}
        />

        {/* Cancelled overlay */}
        {isCancelled && (
          <>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full shadow-lg bg-red-600">
              <span className="text-lg font-rajdhani font-bold text-white uppercase tracking-wider">
                Annulé
              </span>
            </div>
            <div className="block absolute top-0 left-0 w-full h-full bg-gray-950/70"></div>
          </>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80"
          style={{
            backgroundImage: `linear-gradient(to top, ${highlightColor}66, transparent, transparent)`,
          }}
        />

        {/* "X dates" badge */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gray-950/80 border border-white/10 backdrop-blur-md rounded-lg px-3 py-2 flex items-center gap-2">
            <LuLayers size={16} className="text-white" />
            <span className="font-rajdhani font-bold text-white text-xs uppercase tracking-wide">
              {dateCount} date{dateCount > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom content */}
      <div className="flex-1 p-5 space-y-4 flex flex-col bg-gray-900/50">
        <div className="space-y-3">
          {/* "Série" badge */}
          <div className="flex flex-wrap gap-2">
            <span
              className="px-2 py-0.5 rounded text-gray-950 text-[10px] font-rajdhani font-bold uppercase tracking-wider"
              style={{ backgroundColor: `${highlightColor}e6` }}
            >
              Série
            </span>
          </div>

          {/* Title */}
          <h3 className="font-goldman text-white text-xl sm:text-2xl uppercase leading-tight group-hover:text-white transition-colors duration-300 line-clamp-2">
            {title}
          </h3>

          {/* Date range */}
          <div className="flex items-center gap-2 text-gray-200">
            <LuCalendar size={14} style={{ color: highlightColor }} />
            <span className="font-rajdhani text-sm font-semibold uppercase tracking-wide">
              {displayDate}
            </span>
          </div>

          {/* Locations count */}
          <div className="flex items-center gap-2 text-gray-200">
            <LuMapPin size={14} style={{ color: highlightColor }} />
            <span className="font-rajdhani text-sm font-semibold uppercase tracking-wide">
              {dateCount} lieu{dateCount > 1 ? "x" : ""}
            </span>
          </div>

          {/* Game badges */}
          {games.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {games.slice(0, 3).map((game) => (
                <div
                  key={game.id}
                  className="bg-white/5 border border-white/10 rounded-full px-3 py-1 font-rajdhani text-[10px] text-gray-300 flex items-center gap-1.5 hover:bg-white/10 transition-colors"
                >
                  <LuGamepad2 size={12} style={{ color: highlightColor }} />
                  {game.name}
                </div>
              ))}
              {games.length > 3 && (
                <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 font-rajdhani text-[10px] text-gray-300 flex items-center gap-1.5">
                  <LuGamepad2 size={12} style={{ color: highlightColor }} />
                  + {games.length - 3}
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="pt-2 mt-auto">
          {!isPast && !isCancelled && (
            <div
              className="w-full py-3 rounded-lg font-rajdhani font-bold uppercase tracking-wider text-sm text-center text-gray-950 hover:scale-[1.02] transition-all duration-300"
              style={{ backgroundColor: highlightColor }}
            >
              Voir les dates
            </div>
          )}
          {isCancelled && (
            <div className="w-full py-3 rounded-lg font-rajdhani font-bold uppercase tracking-wider text-sm text-center bg-gray-600 text-gray-300 cursor-not-allowed">
              Série annulée
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SeriesCard;
