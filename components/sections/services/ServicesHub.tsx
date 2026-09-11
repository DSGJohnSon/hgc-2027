"use client";

import React, { useState } from "react";
import {
  LuBuilding2,
  LuGamepad2,
  LuArrowRight,
  LuRotateCcw,
} from "react-icons/lu";
import { cn } from "@/lib/utils";
import ServiceCard, { ServiceCardData } from "./ServiceCard";
import Link from "next/link";

type Profil = "btob" | "btoc" | null;

interface Props {
  btob: ServiceCardData[];
  btoc: ServiceCardData[];
}

const OrientationCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  className?: string;
}> = ({ icon, label, description, href, className }) => (
  <Link
    href={href}
    className={cn(
      "group text-left p-8 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm",
      className,
      // active
      //   ? "border-theme bg-theme/10"
      //   : "border-white/10 bg-gray-900/50 hover:border-white/30",
    )}
  >
    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-5 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-goldman text-2xl text-white uppercase mb-2">{label}</h3>
    <p className="text-gray-400 font-rajdhani mb-4">{description}</p>
    <span className="inline-flex items-center gap-2 text-white font-rajdhani font-bold uppercase text-sm tracking-wider">
      Voir ces services
      <LuArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </span>
  </Link>
);

const ServicesHub: React.FC<Props> = ({ btob, btoc }) => {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <section className="relative pt-72 pb-16 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <p className="text-theme font-rajdhani uppercase tracking-[0.3em] text-sm font-bold mb-4">
            Nos Services
          </p>
          <h1 className="font-goldman text-4xl sm:text-5xl md:text-6xl text-white uppercase text-balance leading-[0.9] mb-6">
            Ce que HGC peut faire <span className="text-theme2">pour vous</span>
          </h1>
          <p className="text-gray-400 font-rajdhani text-lg md:text-xl">
            Que vous soyez une collectivité ou un particulier, découvrez nos
            offres. Choisissez votre profil pour affiner les services proposés.
          </p>
        </div>
      </section>

      {/* Orientation */}
      <section className="px-4 pb-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <OrientationCard
            icon={<LuBuilding2 className="w-8 h-8 text-[#7b297b]" />}
            label="Pour les Collectivités"
            description="Organisation d'événements et de projets pour votre territoire."
            href="#btob"
            className="bg-linear-to-b from-[#7b297b]/20 to-[#7b297b]/20 border-[#7b297b] border-l-3"
          />
          <OrientationCard
            icon={<LuGamepad2 className="w-8 h-8 text-[#f26561]" />}
            label="Pour les joueurs"
            description="Privatisation et location de matériel gaming."
            href="#btoc"
            className="bg-linear-to-b from-[#f26561]/20 to-[#f26561]/20 border-[#f26561] border-l-3"
          />
        </div>
      </section>

      {/* BtoB */}
      <section className="px-4 py-12" id="btob">
        <div className="container mx-auto">
          <div className="mb-12">
            <h2 className="font-goldman text-3xl md:text-4xl text-[#7b297b] bg-white inline p-4 pt-3 rounded-xl uppercase">
              Pour les collectivités et organismes
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {btob.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Séparateur */}
      <div className="container mx-auto py-24">
        <div className="border-t border-dashed border-white/10" />
      </div>

      {/* BtoC */}
      <section className="px-4 py-12 pb-24" id="btoc">
        <div className="container mx-auto">
          <div className="mb-12">
            <h2 className="font-goldman text-3xl md:text-4xl text-[#f26561] bg-white inline p-4 pt-3 rounded-xl uppercase">
              Pour les particuliers
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {btoc.map((service) => (
              <ServiceCard key={service.id} service={service} large />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesHub;
