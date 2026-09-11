"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { EventItem as EventItemProps } from "@/types/pages/detail-event";
import type { SeriesListingItem } from "@/types/event-series";
import EventItem from "./EventItem";
import SeriesCard from "./SeriesCard";

type GridItem = EventItemProps | SeriesListingItem;

interface EventGridProps {
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
  className?: string;
  events: GridItem[];
}

const EventGrid: React.FC<EventGridProps> = ({
  events,
  title,
  subtitle,
  emptyMessage = "Aucun événement trouvé pour le moment.",
  className,
}) => {
  return (
    <div className={cn("space-y-10", className)}>
      {(title || subtitle) && (
        <div className="space-y-2">
          {subtitle && (
            <p className="text-theme2 font-rajdhani uppercase tracking-wider text-sm font-semibold">
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className="font-goldman text-3xl md:text-4xl text-white uppercase">
              {title}
            </h2>
          )}
        </div>
      )}

      {events.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((item, index) =>
            "kind" in item && item.kind === "serie" ? (
              <SeriesCard key={item.id} {...item} />
            ) : (
              <EventItem key={index} {...(item as EventItemProps)} />
            ),
          )}
        </div>
      ) : (
        <div className="py-20 text-center bg-gray-950/20 border border-white/5 rounded-2xl">
          <p className="font-rajdhani text-gray-500 text-lg">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default EventGrid;
