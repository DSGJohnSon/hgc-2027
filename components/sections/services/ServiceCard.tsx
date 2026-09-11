import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LuArrowRight } from "react-icons/lu";
import { cn } from "@/lib/utils";

export interface ServiceCardData {
  id: string;
  title: string;
  shortDescription: string;
  cardThumbnail: string;
  color: string;
  isDraft?: boolean;
}

interface Props {
  service: ServiceCardData;
  large?: boolean; // format large (section BtoC)
}

const ServiceCard: React.FC<Props> = ({ service, large = false }) => {
  const href = `/nos-services/${service.id}`;

  const inner = (
    <div
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 backdrop-blur-sm transition-all duration-300",
        service.isDraft ? "opacity-70" : "hover:border-white/30",
      )}
    >
      <div className={cn("relative overflow-hidden aspect-square")}>
        <Image
          src={service.cardThumbnail}
          alt={service.title}
          fill
          sizes={large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105 z-10"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to top, ${service.color}cc, transparent 70%)`,
          }}
        />
        {service.isDraft && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gray-950/80 border border-white/20 text-white text-xs font-rajdhani font-bold uppercase tracking-wider">
            Bientôt
          </span>
        )}
      </div>

      <div className="p-6">
        <h3 className={cn(
          "font-goldman text-white uppercase tracking-tight mb-2",
          large ? "text-2xl md:text-3xl" : "text-xl",
        )}>
          {service.title}
        </h3>
        <p className="text-gray-400 font-rajdhani leading-relaxed line-clamp-3">
          {service.shortDescription}
        </p>
        {!service.isDraft && (
          <span
            className="inline-flex items-center gap-2 mt-4 font-rajdhani font-bold uppercase text-sm tracking-wider"
            style={{ color: service.color }}
          >
            Découvrir
            <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        )}
      </div>
    </div>
  );

  if (service.isDraft) {
    return <div className="h-full cursor-default">{inner}</div>;
  }

  return (
    <Link href={href} className="block h-full">
      {inner}
    </Link>
  );
};

export default ServiceCard;
