"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TextSectionData {
  title?: string;
  subtitle?: string;
  paragraphs: string[];
  columns?: 1 | 2;
  alignment?: "left" | "center";
}

interface TextSectionProps {
  data: TextSectionData;
  className?: string;
}

const TextSection: React.FC<TextSectionProps> = ({ data, className }) => {
  const { title, subtitle, paragraphs, columns = 1, alignment = "left" } = data;

  return (
    <section className={cn("py-16 md:py-24 bg-transparent", className)}>
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "max-w-5xl mx-auto space-y-8",
            alignment === "center" ? "text-center" : "text-left"
          )}
        >
          {/* Subtitle */}
          {subtitle && (
            <p className="text-theme2 font-rajdhani uppercase tracking-wider text-base font-semibold">
              {subtitle}
            </p>
          )}

          {/* Title */}
          {title && (
            <h2 className="font-goldman text-3xl md:text-5xl lg:text-6xl text-white uppercase leading-tight">
              {title}
            </h2>
          )}

          {/* Paragraphs */}
          <div
            className={cn(
              "gap-8 space-y-4",
              columns === 2 && "md:columns-2 md:space-y-0"
            )}
          >
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className={cn(
                  "text-gray-300 text-base md:text-lg leading-relaxed font-rajdhani",
                  columns === 2 && "mb-6 break-inside-avoid"
                )}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextSection;
