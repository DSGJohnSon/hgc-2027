"use client";

import React from "react";
import Image from "next/image";
import { Actualities } from "@/types/pages/detail-actualites";
import Button from "@/components/ui/Button";
import { useWeezeventDialog } from "@/components/providers/WeezeventDialogProvider";
import { cn } from "@/lib/utils";

interface ActualiteCardProps extends Actualities {
  className?: string;
}

const ActualiteCard: React.FC<ActualiteCardProps> = ({
  id,
  title,
  subtitle,
  date,
  content = [],
  image,
  cta,
  className,
}) => {
  const { openDialog } = useWeezeventDialog();

  const handleCtaClick = () => {
    if (cta?.type === "weezevent" && cta?.weezeventCode) {
      openDialog(cta.weezeventCode, title);
    }
  };

  const imagePosition = image.position || "right";

  return (
    <div className={cn("w-full pl-4", className)}>
      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center cursor-crosshair",
          imagePosition === "left" && "lg:grid-flow-dense",
        )}
      >
        {/* Image Section */}
        <div
          className={cn(
            "relative w-full aspect-video rounded-lg overflow-hidden",
            imagePosition === "left" && "lg:col-start-1",
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Content Section */}
        <div
          className={cn(
            "flex flex-col justify-center space-y-6",
            imagePosition === "left" && "lg:col-start-2",
          )}
        >
          {/* DATE */}
          <p className="text-theme2 font-rajdhani uppercase tracking-wider text-sm md:text-base font-semibold">
            {new Date(date).toLocaleDateString("fr-FR")}
          </p>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-theme2 font-rajdhani uppercase tracking-wider text-sm md:text-base font-semibold">
              {subtitle}
            </p>
          )}

          {/* Title */}
          <h3 className="font-goldman text-3xl md:text-4xl lg:text-5xl text-white uppercase leading-tight">
            {title}
          </h3>

          {/* Content Blocks */}
          <div className="space-y-4">
            {content.map((block, index) => {
              if (block.type === "title" && block.title) {
                return (
                  <h4
                    key={index}
                    className="font-goldman text-xl md:text-2xl text-white uppercase mt-6 mb-3"
                  >
                    {block.title}
                  </h4>
                );
              } else if (block.type === "paragraph" && block.paragraphs) {
                return block.paragraphs.map((para, pIdx) => (
                  <p
                    key={`${index}-${pIdx}`}
                    className="text-gray-300 text-base md:text-lg leading-relaxed font-rajdhani"
                  >
                    {para}
                  </p>
                ));
              } else if (block.type === "list" && block.items) {
                return (
                  <ul
                    key={index}
                    className="list-disc list-inside space-y-2 text-gray-300 text-base md:text-lg font-rajdhani ml-4"
                  >
                    {block.items.map((item, iIdx) => (
                      <li key={iIdx}>{item}</li>
                    ))}
                  </ul>
                );
              } else if (block.type === "citation" && block.citationText) {
                return (
                  <blockquote
                    key={index}
                    className="border-l-4 border-theme2 pl-6 py-3 my-6 italic text-gray-300 text-base md:text-lg font-rajdhani"
                  >
                    "{block.citationText}"
                  </blockquote>
                );
              }
              return null;
            })}
          </div>

          {/* CTA Button */}
          {cta && (
            <div className="pt-4">
              {cta.type === "standard" && cta.url ? (
                <Button
                  variant="primary"
                  size="md"
                  href={cta.url}
                  isExternal={cta.isExternal}
                  asLink={true}
                  textUpperCase={true}
                >
                  {cta.label}
                </Button>
              ) : cta.type === "weezevent" && cta.weezeventCode ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCtaClick}
                  textUpperCase={true}
                >
                  {cta.label}
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActualiteCard;
