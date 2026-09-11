import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getGames, getServicesBtoB, getServicesBtoC } from "@/lib/content";
import ServiceB2BTemplate from "@/components/sections/services/templates/ServiceB2BTemplate";
import ServiceB2CTemplate from "@/components/sections/services/templates/ServiceB2CTemplate";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const [servicesBtoB, servicesBtoC] = await Promise.all([
    getServicesBtoB(),
    getServicesBtoC(),
  ]);

  return [
    ...servicesBtoB.map((s) => ({ slug: s.id })),
    ...servicesBtoC.map((s) => ({ slug: s.id })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [servicesBtoB, servicesBtoC] = await Promise.all([
    getServicesBtoB(),
    getServicesBtoC(),
  ]);
  const service =
    servicesBtoB.find((s) => s.id === slug) ||
    servicesBtoC.find((s) => s.id === slug);

  if (!service) {
    return {
      title: "Service non trouvé | Holiday Geek Cup",
      description: "Le service demandé n'existe pas.",
    };
  }

  return {
    title: `${service.title} | Nos Services - Holiday Geek Cup`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [servicesBtoB, servicesBtoC, games] = await Promise.all([
    getServicesBtoB(),
    getServicesBtoC(),
    getGames(),
  ]);

  // Détection polymorphe : BtoB puis BtoC.
  const btob = servicesBtoB.find((s) => s.id === slug);
  if (btob) {
    return <ServiceB2BTemplate service={btob} gamesCatalogue={games} />;
  }

  const btoc = servicesBtoC.find((s) => s.id === slug);
  if (btoc) {
    return <ServiceB2CTemplate service={btoc} gamesCatalogue={games} />;
  }

  notFound();
}
