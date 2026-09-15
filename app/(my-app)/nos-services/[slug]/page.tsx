import { notFound } from "next/navigation";
import { Metadata } from "next";

import ComingSoon from "../ComingSoon";
import { serviceLinks } from "../content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Seules les adresses du méga-menu existent : tout autre slug renvoie une 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceLinks.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceLinks.find((link) => link.slug === slug);

  return {
    title: `${service?.label ?? "Nos Services"} | Holiday Geek Cup`,
    robots: { index: false },
  };
}

export default async function ServiceComingSoonPage({ params }: PageProps) {
  const { slug } = await params;
  const service = serviceLinks.find((link) => link.slug === slug);
  if (!service) notFound();

  return <ComingSoon title={service.label} showBackLink />;
}
