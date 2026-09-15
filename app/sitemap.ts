import { getEvents, getEventSeries } from "@/lib/content";

// Les pages « Nos Services » sont volontairement absentes : ce sont des pages
// d'attente, à ajouter ici au fur et à mesure de leur mise en ligne.
export default async function sitemap() {
  const [eventsData, seriesData] = await Promise.all([getEvents(), getEventSeries()]);

  const baseUrl = "https://holidaygeekcup.fr";

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/collectivites`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/evenements`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/reglement`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const eventPages = eventsData.map((event) => ({
    url: `${baseUrl}/evenements/${event.id}`,
    lastModified: new Date(event.startDate),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Une série et chacune de ses étapes : /evenements/<série>/<étape>.
  const seriesPages = seriesData.flatMap((series) => [
    {
      url: `${baseUrl}/evenements/${series.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...series.dates.map((date) => ({
      url: `${baseUrl}/evenements/${series.id}/${date.id}`,
      lastModified: new Date(date.startDate),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ]);

  return [...staticPages, ...eventPages, ...seriesPages];
}