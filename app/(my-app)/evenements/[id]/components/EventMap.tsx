"use client";

import React from "react";
import { LuMapPin, LuNavigation } from "react-icons/lu";

interface EventMapProps {
  location: string;
  highlightColor: string;
}

const EventMap: React.FC<EventMapProps> = ({ location, highlightColor }) => {
  const encodedLocation = encodeURIComponent(location);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center gap-3 text-gray-400 font-rajdhani">
        <LuMapPin className="w-5 h-5" style={{ color: highlightColor }} />
        <span className="text-lg">{location}</span>
      </div>

      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 group shadow-2xl bg-[#030712]">
        {/* Themed Overlay for the Highlight Color */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-20 mix-blend-screen group-hover:opacity-30 transition-opacity duration-700"
          style={{ backgroundColor: highlightColor }}
        />

        {/* Darkening/Colorizing filters on the iframe itself */}
        <iframe
          width="100%"
          height="100%"
          style={{
            border: 0,
            filter:
              "grayscale(1) invert(1) contrast(1.2) brightness(0.7) hue-rotate(180deg)",
            opacity: 0.8,
          }}
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps?q=${encodedLocation}&output=embed&t=m&z=15`}
          className="transition-all duration-700 group-hover:brightness-90 group-hover:invert-[0.95]"
        ></iframe>

        {/* Overlay Gradient for depth */}
        <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-gray-950/90 via-transparent to-gray-950/40 z-10" />

        {/* Bottom-right info button */}
        <div className="absolute bottom-4 right-4 z-20">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-rajdhani font-bold text-white uppercase tracking-wider text-xs sm:text-sm bg-gray-900/90 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group/btn shadow-xl"
          >
            <LuNavigation className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            Ouvrir dans Google Maps
          </a>
        </div>
      </div>
    </div>
  );
};

export default EventMap;
