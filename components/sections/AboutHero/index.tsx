"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import PixelBackground from "@/components/ui/pixel-background";
import { SimpleSectionData } from "../SimpleSection";

interface AboutHeroProps {
  data: SimpleSectionData;
  className?: string;
}

const AboutHero: React.FC<AboutHeroProps> = ({ data, className }) => {
  const { subtitle, title, paragraphs, image, ctas = [], backgroundImage } = data;
  const hasImage = image && image.src;
  const imagePosition = image?.position || "right";

  return (
    <section className="relative">
      <PixelBackground
        className={cn(
          "relative min-h-[60vh] sm:min-h-screen flex items-center justify-center py-20 sm:py-32 bg-transparent",
          className,
        )}
        speed={30}
        gap={10}
        colors="#111827"
        direction="center"
        haloRadius={250}
        haloSecondaryColor="#d97706"
        haloTertiaryColor="#86198f"
        haloDelay={100}
        canvasClassName="absolute inset-0"
        fadeBottom={true}
        fadeHeight={100}
      >
        <div className="container mx-auto pt-36 px-4 relative z-10">
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
              <h1
                className={cn(
                  "font-goldman text-4xl md:text-5xl lg:text-7xl text-white uppercase leading-tight",
                  !hasImage && "text-center",
                )}
              >
                {title}
              </h1>

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
              <div className="w-full md:w-1/2 flex justify-center">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={1200}
                  className="w-full h-auto rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        </div>
      </PixelBackground>
      {backgroundImage && (
        <div className="absolute h-full w-full top-0 left-0 opacity-10">
          <Image
            src={backgroundImage}
            alt="Background Image"
            fill
            className="object-cover"
          />
        </div>
      )}
    </section>
  );
};

export default AboutHero;
