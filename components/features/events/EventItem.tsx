"use client";

import React from "react";
import Image from "next/image";
import {
  LuTrophy,
  LuGamepad2,
  LuClock,
  LuMapPin,
  LuCalendar,
} from "react-icons/lu";
import { cn } from "@/lib/utils";
import { EventItem as EventItemProps } from "@/types/pages/detail-event";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EventItem: React.FC<EventItemProps> = ({
  id,
  type,
  title,
  startDate,
  endDate,
  startTime,
  endTime,
  cardThumbnail,
  location,
  isOngoing,
  isPast,
  isCancelled,
  weezeventCode,
  categoryId,
  gameId,
  categories = [],
  games = [],
  color,
}) => {
  const router = useRouter();
  const highlightColor = color || "var(--theme-color)";

  // Format date for display
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const displayDate = endDate
    ? `Du ${new Date(startDate).getDate()} au ${formatDate(endDate)}`
    : formatDate(startDate);

  const handleCardClick = () => {
    router.push(`/evenements/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "group relative flex flex-col w-full rounded-xl overflow-hidden duration-300 border-2 transition-all bg-gray-950/40 backdrop-blur-sm cursor-pointer",
        isOngoing
          ? "shadow-lg"
          : isPast
            ? "border-white/5 opacity-80 grayscale-[0.3]"
            : "border-white/5",
      )}
      style={
        {
          ["--hover-border-color" as string]: highlightColor,
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
      {/* Ongoing Badge */}
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
        {/* Cancelled Badge */}
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
        {/* Gradient Overlay */}
        <div
          className={cn(
            "absolute inset-0 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80",
          )}
          style={{
            backgroundImage: `linear-gradient(to top, ${highlightColor}66, transparent, transparent)`,
          }}
        />

        {/* Type Icon Overlay */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gray-950/80 border border-white/10 backdrop-blur-md rounded-lg p-2.5">
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
        </div>
      </div>

      {/* Bottom Content Section */}
      <div className="flex-1 p-5 space-y-4 flex flex-col bg-gray-900/50">
        <div className="space-y-3">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category.id}
                  className="px-2 py-0.5 rounded text-gray-950 text-[10px] font-rajdhani font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${highlightColor}e6`,
                  }}
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-goldman text-white text-xl sm:text-2xl uppercase leading-tight group-hover:text-white transition-colors duration-300 line-clamp-2">
            {title}
          </h3>

          {/* Date */}
          <div className="flex items-center gap-2 text-gray-200">
            <LuCalendar size={14} style={{ color: highlightColor }} />
            <span className="font-rajdhani text-sm font-semibold uppercase tracking-wide">
              {displayDate}
            </span>
          </div>

          {/* Hour if defined */}
          {startTime && !endTime && (
            <div className="flex items-center gap-2 text-gray-200">
              <LuClock size={14} style={{ color: highlightColor }} />
              <span className="font-rajdhani text-sm font-semibold uppercase tracking-wide">
                {startTime}
              </span>
            </div>
          )}
          {startTime && endTime && (
            <div className="flex items-center gap-2 text-gray-200">
              <LuClock size={14} style={{ color: highlightColor }} />
              <span className="font-rajdhani text-sm font-semibold uppercase tracking-wide">
                de {startTime} à {endTime}
              </span>
            </div>
          )}

          {/* Game Badges */}
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
              <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 font-rajdhani text-[10px] text-gray-300 flex items-center gap-1.5 hover:bg-white/10 transition-colors">
                <LuGamepad2 size={12} style={{ color: highlightColor }} />+{" "}
                {games.length - 3}
              </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 mt-auto">
          {!isPast && (
            <div className="flex flex-col gap-2">
              {isCancelled ? (
                <div className="w-full py-3 rounded-lg font-rajdhani font-bold uppercase tracking-wider text-sm text-center bg-gray-600 text-gray-300 cursor-not-allowed">
                  Événement annulé
                </div>
              ) : isOngoing || !weezeventCode ? (
                <div
                  className="w-full py-3 rounded-lg font-rajdhani font-bold uppercase tracking-wider text-sm transition-all duration-300 text-center bg-white text-gray-950 hover:scale-[1.02]"
                  style={{
                    backgroundColor: highlightColor,
                  }}
                >
                  plus d'informations
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href={`/evenements/${id}`}
                    className="flex-1 py-3 rounded-lg font-rajdhani font-bold uppercase tracking-wider text-sm transition-all duration-300 text-center bg-white/5 text-white border border-white/10 hover:bg-white/10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    plus d'infos
                  </Link>
                  <Link
                    href={`/evenements/${id}?register=true`}
                    className="flex-1 py-3 rounded-lg font-rajdhani font-bold uppercase tracking-wider text-sm transition-all duration-300 text-center text-gray-950 hover:scale-[1.02]"
                    style={{
                      backgroundColor: highlightColor,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    s'inscrire
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventItem;
