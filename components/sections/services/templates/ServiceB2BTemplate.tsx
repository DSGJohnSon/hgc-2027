import React from "react";
import { ServiceBtoB } from "@/types/pages/service-btob";
import ServiceHero from "../ServiceHero";
import { Game } from "@/types/games";
import ServiceContent from "../ServiceContent";
import ServiceInquiryForm from "../ServiceInquiryForm";
import Statistics from "@/components/sections/Statistics";

interface Props {
  service: ServiceBtoB;
  /** Catalogue des jeux, transmis par la page (il vient de la base). */
  gamesCatalogue: Game[];
}

const ServiceB2BTemplate: React.FC<Props> = ({ service, gamesCatalogue }) => {
  const highlightColor = service.color;

  return (
    <main className="min-h-screen bg-gray-950">
      <ServiceHero
        title={service.title}
        tagline={service.tagline}
        logo={service.logo}
        color={highlightColor}
        bannerImage={service.heroBanner}
        bannerImageMobile={service.heroBannerMobile}
        target="btob"
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {service.stats && service.stats.length > 0 && (
            <div className="mb-12">
              <Statistics data={{ stats: service.stats }} isDetailedEventPage />
            </div>
          )}

          <h2 className="font-goldman text-3xl text-white uppercase tracking-tight flex items-center gap-3 mb-8">
            <span className="w-8 h-1" style={{ backgroundColor: highlightColor }} />
            Le projet
          </h2>

          <ServiceContent
            blocks={service.content}
            highlightColor={highlightColor}
            gamesCatalogue={gamesCatalogue}
          />
        </div>
      </section>

      {/* Formulaire de demande d'informations */}
      <section className="py-16 md:py-20 bg-gray-900/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <p
              className="font-rajdhani uppercase tracking-[0.3em] text-sm font-bold mb-3"
              style={{ color: highlightColor }}
            >
              Un projet pour votre territoire ?
            </p>
            <h2 className="font-goldman text-3xl md:text-4xl text-white uppercase">
              Parlons de votre projet
            </h2>
          </div>
          <ServiceInquiryForm
            serviceTitle={service.formProjectLabel ?? service.title}
            highlightColor={highlightColor}
          />
        </div>
      </section>
    </main>
  );
};

export default ServiceB2BTemplate;
