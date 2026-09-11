"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Button, { ButtonVariant, ButtonSize } from "@/components/ui/Button";

export interface SimpleSectionCTA {
  text: string;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export interface SimpleSectionImage {
  src: string;
  alt: string;
  position: "left" | "right";
}

export interface SimpleSectionData {
  id: string;
  subtitle?: string;
  title: string;
  paragraphs: string[];
  image?: SimpleSectionImage | null;
  ctas?: SimpleSectionCTA[];
  backgroundImage?: string;
}

interface SimpleSectionProps {
  data: SimpleSectionData;
  className?: string;
}

const SimpleSection: React.FC<SimpleSectionProps> = ({ data, className }) => {
  const { subtitle, title, paragraphs, image, ctas = [] } = data;
  const hasImage = image && image.src;
  const imagePosition = image?.position || "right";
  const [fitClass, setFitClass] = useState<"object-cover" | "object-contain">(
    "object-cover",
  );

  return (
    <section
      className={cn("relative w-full py-16 md:py-32 bg-transparent", className)}
    >
      <div className="container mx-auto px-4">
        <div
          className={cn(
            "flex flex-col gap-12 items-center",
            hasImage && "md:flex-row md:gap-16 lg:gap-24",
            hasImage && imagePosition === "left" && "md:flex-row-reverse",
          )}
        >
          {/* Text Content */}
          <div
            className={cn(
              "flex flex-col space-y-6",
              hasImage ? "md:w-1/2" : "max-w-4xl mx-auto text-center",
            )}
          >
            {/* Subtitle */}
            {subtitle && (
              <p className="text-theme2 font-rajdhani uppercase tracking-wider text-base font-semibold">
                {subtitle}
              </p>
            )}

            {/* Title */}
            <h2
              className={cn(
                "font-goldman text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-tight",
                !hasImage && "text-center",
              )}
            >
              {title}
            </h2>

            {/* Paragraphs */}
            <div className="space-y-4">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={cn(
                    "text-gray-300 text-base md:text-lg leading-relaxed font-rajdhani",
                    !hasImage && "text-center",
                  )}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* CTAs */}
            {ctas.length > 0 && (
              <div
                className={cn(
                  "flex flex-wrap gap-4 pt-4",
                  !hasImage && "justify-center",
                )}
              >
                {ctas.map((cta, index) => (
                  <Button
                    key={index}
                    variant={cta.variant || "primary"}
                    size={cta.size || "md"}
                    href={cta.href}
                    asLink={true}
                    textUpperCase={true}
                  >
                    {cta.text}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          {hasImage && (
            <div className="w-full md:w-1/2 relative">
              <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className={fitClass}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onLoad={(e) => {
                    const { naturalWidth, naturalHeight } = e.currentTarget;
                    if (naturalWidth && naturalHeight) {
                      console.log("image", image.src);
                      console.log("naturalWidth", naturalWidth);
                      console.log("naturalHeight", naturalHeight);
                      const ratio = naturalWidth / naturalHeight;
                      console.log("ratio", ratio);
                      // Le conteneur a un aspect 4/3 (1.333).
                      // On passe en "contain" si l'image est trop large (> 1.6) ou trop étroite/haute (< 1.1)
                      if (ratio > 1.6) {
                        setFitClass("object-contain");
                      } else {
                        setFitClass("object-cover");
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SimpleSection;
