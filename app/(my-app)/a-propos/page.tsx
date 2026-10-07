import { Metadata } from "next";
import Partners, { PartnersData } from "@/components/sections/Partners";
import SimpleSection, {
  SimpleSectionData,
} from "@/components/sections/SimpleSection";
import AboutHero from "@/components/sections/AboutHero";
import TextSection, {
  TextSectionData,
} from "@/components/sections/TextSection";
import FeatureGrid, {
  FeatureGridData,
} from "@/components/sections/FeatureGrid";
import TrophyCarousel, {
  TrophyCarouselData,
} from "@/components/sections/TrophyCarousel";
import { getPartners } from "@/lib/content";
import { aboutSections, aboutSeo, type PageSection } from "./content";

const FALLBACK_SEO = {
  title: "À propos | Holiday Geek Cup",
  description:
    "Découvrez l'histoire et la mission de Holiday Geek Cup, une association dédiée à la promotion du gaming et de l'esport auprès des jeunes.",
};

export const metadata: Metadata = {
  title: aboutSeo.title || FALLBACK_SEO.title,
  description: aboutSeo.description || FALLBACK_SEO.description,
};

export default async function APropos() {
  // Les logos de partenaires viennent du référentiel Payload, retrouvés par nom :
  // un logo remplacé au backoffice change aussi ici.
  const logoByName = new Map(
    (await getPartners()).map((logo) => [logo.alt, logo]),
  );

  // Le `switch` ne couvre que les types réellement présents dans `content.ts`.
  // Le contenu n'étant plus éditable depuis un backoffice, aucun autre type ne
  // peut apparaître : ajouter une section, c'est écrire son cas ici.
  const renderSection = (section: PageSection, index: number) => {
    const isLastSection = index === aboutSections.length - 1;

    switch (section.type) {
      case "aboutHero":
        return (
          <AboutHero key={index} data={section.data as SimpleSectionData} />
        );

      case "simpleSection":
        return (
          <SimpleSection key={index} data={section.data as SimpleSectionData} />
        );

      case "textSection":
        return (
          <TextSection key={index} data={section.data as TextSectionData} />
        );

      case "featureGrid":
        return (
          <FeatureGrid key={index} data={section.data as FeatureGridData} />
        );

      case "trophyCarousel":
        return (
          <TrophyCarousel
            key={index}
            data={section.data as TrophyCarouselData}
          />
        );

      case "partners": {
        const { partners: names, ...data } = section.data as Omit<
          PartnersData,
          "logos"
        > & { partners: string[] };

        // Un partenaire renommé, supprimé ou sans logo est omis plutôt que
        // d'afficher une image cassée.
        const logos = names.flatMap((name) => {
          const logo = logoByName.get(name);
          if (!logo) console.warn(`Partenaire introuvable ou sans logo : ${name}`);
          return logo ? [logo] : [];
        });

        return (
          <Partners
            key={index}
            data={{ ...data, logos }}
            isLastSection={isLastSection}
          />
        );
      }

      default:
        console.warn(`Unknown section type: ${section.type}`);
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {aboutSections.map((section, index) => renderSection(section, index))}
    </div>
  );
}
