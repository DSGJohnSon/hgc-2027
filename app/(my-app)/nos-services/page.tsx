import { Metadata } from "next";
import { getServicesBtoB, getServicesBtoC } from "@/lib/content";

import ServicesHub from "@/components/sections/services/ServicesHub";
import { ServiceCardData } from "@/components/sections/services/ServiceCard";

export const metadata: Metadata = {
  title: "Nos Services | Holiday Geek Cup",
  description:
    "Découvrez les services d'Holiday Geek Cup : organisation d'événements et de projets pour les collectivités, privatisation et location de matériel gaming pour les particuliers.",
};

const toCard = (s: {
  id: string;
  title: string;
  shortDescription: string;
  cardThumbnail: string;
  color: string;
  isDraft?: boolean;
}): ServiceCardData => ({
  id: s.id,
  title: s.title,
  shortDescription: s.shortDescription,
  cardThumbnail: s.cardThumbnail,
  color: s.color,
  isDraft: s.isDraft,
});

export default async function NosServicesPage() {
  const [servicesBtoB, servicesBtoC] = await Promise.all([
    getServicesBtoB(),
    getServicesBtoC(),
  ]);

  return (
    <ServicesHub
      btob={servicesBtoB.map(toCard)}
      btoc={servicesBtoC.map(toCard)}
    />
  );
}
