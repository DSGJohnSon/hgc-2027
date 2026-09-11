import React from "react";
import { ServiceBtoC } from "@/types/pages/service-btoc";
import ServiceHero from "../ServiceHero";
import { Game } from "@/types/games";
import ServiceContent from "../ServiceContent";
import HelloAssoWidget from "../HelloAssoWidget";

interface Props {
  service: ServiceBtoC;
  /** Catalogue des jeux, transmis par la page (il vient de la base). */
  gamesCatalogue: Game[];
}

const ServiceB2CTemplate: React.FC<Props> = ({ service, gamesCatalogue }) => {
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
        target="btoc"
      />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <ServiceContent
            blocks={service.content}
            highlightColor={highlightColor}
            gamesCatalogue={gamesCatalogue}
          />

          <HelloAssoWidget
            embed={service.helloAssoEmbed}
            title="Réserver"
            highlightColor={highlightColor}
          />
        </div>
      </section>
    </main>
  );
};

export default ServiceB2CTemplate;
