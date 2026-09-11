import React from "react";
import Image from "next/image";
import { LuBuilding2, LuGamepad2 } from "react-icons/lu";

interface Props {
  title: string;
  tagline?: string;
  logo?: string;
  color: string;
  bannerImage: string;
  bannerImageMobile?: string;
  target: "btob" | "btoc";
}

const ServiceHero: React.FC<Props> = ({
  title,
  tagline,
  logo,
  color,
  bannerImage,
  bannerImageMobile,
  target,
}) => {
  const highlightColor = color || "#6240cf";
  const targetLabel =
    target === "btob"
      ? "Service aux collectivités"
      : "Privatisation & Location";
  const TargetIcon = target === "btob" ? LuBuilding2 : LuGamepad2;

  return (
    <section className="relative w-full h-[70svh] min-h-120 overflow-hidden">
      {/* Banner desktop */}
      <div className="hidden md:block absolute inset-0">
        <Image src={bannerImage} alt={title} fill priority sizes="100vw" className="object-cover" />
      </div>
      {/* Banner mobile */}
      <div className="md:hidden absolute inset-0">
        <Image
          src={bannerImageMobile || bannerImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `linear-gradient(to top, ${highlightColor}cc, ${highlightColor}33, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="container mx-auto h-full relative z-20 flex items-end pb-12 px-4">
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg backdrop-blur-md border border-white/20 bg-gray-950/40">
                <TargetIcon size={18} className="text-white" />
              </div>
              <span className="font-rajdhani font-bold text-white uppercase tracking-[0.2em] text-sm sm:text-base">
                {targetLabel}
              </span>
            </div>
            <h1 className="font-goldman text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-[0.9] drop-shadow-2xl text-balance">
              {title}
            </h1>
            {tagline && (
              <p className="font-rajdhani text-lg md:text-xl text-white/90 max-w-xl">
                {tagline}
              </p>
            )}
          </div>

          {logo && (
            <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0">
              <Image src={logo} alt={`Logo ${title}`} fill sizes="160px" className="object-contain" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
