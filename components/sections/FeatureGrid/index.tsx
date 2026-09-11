"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface FeatureCard {
  title?: string;
  description?: string;
  icon?: string; // We can use icon names or emojis
  logo?: string;
  alt?: string;
}

export interface FeatureGridData {
  title?: string;
  subtitle?: string;
  cards: FeatureCard[];
  columns?: number;
}

interface FeatureGridProps {
  data: FeatureGridData;
  className?: string;
}

const FeatureGrid: React.FC<FeatureGridProps> = ({ data, className }) => {
  const { title, subtitle, cards, columns = 3 } = data;

  return (
    <section className={cn("py-16 md:py-24 bg-transparent", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
          {subtitle && (
            <p className="text-theme2 font-rajdhani uppercase tracking-wider text-base font-semibold">
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className="font-goldman text-3xl md:text-5xl lg:text-6xl text-white uppercase leading-tight text-center text-balance">
              {title}
            </h2>
          )}
        </div>

        <div
          className={cn(
            "grid gap-6 md:gap-8",
            columns === 2
              ? "md:grid-cols-2"
              : columns === 3
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-gray-900/50 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:border-theme2/50 transition-colors group"
            >
              {card.logo && (
                <Image
                  src={card.logo}
                  alt={card.alt || card.title || ""}
                  width={200}
                  height={100}
                  className="mb-6 group-hover:scale-110 transition-transform inline-block"
                />
              )}
              {card.icon && (
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">
                  {card.icon}
                </div>
              )}
              <h3 className="text-xl font-bold font-rajdhani text-white uppercase mb-4 tracking-wide group-hover:text-theme2 transition-colors">
                {card.title}
              </h3>
              {card.description && (
                <p className="text-gray-400 font-rajdhani leading-relaxed">
                  {card.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
