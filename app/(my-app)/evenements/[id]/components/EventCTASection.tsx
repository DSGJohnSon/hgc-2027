"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { LuTicket } from "react-icons/lu";
import Button from "@/components/ui/Button";
import BlinkingPixelBackground from "@/components/sections/CTASection/BlinkingPixelBackground";
import { useWeezeventDialog } from "@/components/providers/WeezeventDialogProvider";

interface EventCTASectionProps {
  highlightColor: string;
  registrationOpen?: boolean;
  weezeventCode?: string;
  eventTitle: string;
  isCancelled?: boolean;
  compact?: boolean;
}

const EventCTASection: React.FC<EventCTASectionProps> = ({
  highlightColor,
  registrationOpen = false,
  weezeventCode,
  eventTitle,
  isCancelled = false,
  compact = false,
}) => {
  const { openDialog } = useWeezeventDialog();

  return (
    <section className={cn("relative w-full", compact ? "my-12" : "mt-32 mb-32")}>
      <BlinkingPixelBackground
        className={cn("bg-transparent", compact ? "py-8 md:py-14" : "py-8 md:py-32")}
        speed={30}
        gap={10}
        colors="#111827"
        opacity={1}
        direction="center"
        glowColor={highlightColor}
        glowDuration={2000}
        glowCycleDuration={6000}
        glowWidth={300}
        glowMode="centerBlinking"
        fadeTop={true}
        fadeBottom={true}
        fadeHeight={150}
        canvasClassName="absolute inset-0"
      >
        <div className={cn(compact ? "w-full" : "container mx-auto px-4")}>
          <div
            className={cn(
              "flex flex-col items-center text-center space-y-6",
              compact ? "max-w-3xl mx-auto" : "max-w-4xl mx-auto",
            )}
          >
            <p
              className="font-rajdhani uppercase tracking-wider text-base font-semibold"
              style={{ color: highlightColor }}
            >
              Inscription
            </p>

            <h2
              className={cn(
                "font-goldman uppercase leading-tight text-white",
                compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl lg:text-6xl",
              )}
            >
              Prêt à relever le défi ?
            </h2>

            <p
              className={cn(
                "leading-relaxed font-rajdhani text-gray-300",
                compact ? "text-base md:text-lg max-w-2xl" : "text-base md:text-lg max-w-3xl",
              )}
            >
              Ne manquez pas votre chance de participer à cet événement exceptionnel.
              Les places sont limitées !
            </p>

            <div className="flex flex-wrap gap-4 pt-4 justify-center">
              {registrationOpen ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() =>
                    weezeventCode &&
                    openDialog(weezeventCode, eventTitle, registrationOpen)
                  }
                  textUpperCase={true}
                  icon={<LuTicket className="w-5 h-5" />}
                  iconPosition="left"
                  style={{
                    background: `linear-gradient(to right, ${highlightColor}, ${highlightColor})`,
                  }}
                >
                  Je m&apos;inscris
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  disabled={true}
                  textUpperCase={true}
                  icon={<LuTicket className="w-5 h-5" />}
                  iconPosition="left"
                  className="opacity-60 cursor-not-allowed"
                  style={{
                    background: "#4b5563",
                  }}
                >
                  {isCancelled ? "Événement annulé" : "Inscriptions fermées"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </BlinkingPixelBackground>
    </section>
  );
};

export default EventCTASection;
