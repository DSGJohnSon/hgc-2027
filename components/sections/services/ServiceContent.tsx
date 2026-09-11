import React from "react";
import { ServiceBlock } from "@/types/pages/service-blocks";
import { Game } from "@/types/games";
import Statistics from "@/components/sections/Statistics";
import Gallery from "@/components/sections/Gallery";
import FreeplaySection from "@/app/(my-app)/evenements/[id]/components/FreeplaySection";
import AgeDistribution from "./blocks/AgeDistribution";
import RoleSplit from "./blocks/RoleSplit";
import Highlight from "./blocks/Highlight";
import Speakers from "./blocks/Speakers";
import ThemesBlock from "./blocks/ThemesBlock";
import ImageText from "./blocks/ImageText";
import Equipment from "./blocks/Equipment";

interface Props {
  blocks: ServiceBlock[];
  highlightColor: string;
  /** Catalogue des jeux, nécessaire au bloc « Jeux disponibles ». */
  gamesCatalogue: Game[];
}

/**
 * Dispatcher de blocs de contenu des pages Services (BtoB & BtoC).
 * Réutilise les composants existants (Statistics, Gallery, FreeplaySection)
 * et les blocs spécifiques aux services.
 */
const ServiceContent: React.FC<Props> = ({ blocks, highlightColor, gamesCatalogue }) => {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "text":
            return (
              <div key={index}>
                {block.content.map((item, idx) => {
                  if (item.type === "title") {
                    return (
                      <h3
                        key={`${index}-${idx}`}
                        className="font-rajdhani font-bold text-2xl text-white mt-8 mb-4"
                      >
                        {item.title}
                      </h3>
                    );
                  }
                  if (item.type === "paragraph") {
                    return item.paragraphs?.map((para, pIdx) => (
                      <p
                        key={`${index}-${idx}-${pIdx}`}
                        className="text-gray-300 text-base leading-7 mb-4"
                      >
                        {para}
                      </p>
                    ));
                  }
                  if (item.type === "list") {
                    return (
                      <ul
                        key={`${index}-${idx}`}
                        className="list-disc list-inside text-gray-300 text-base leading-7 mb-4"
                      >
                        {item.items?.map((li, liIdx) => (
                          <li key={`${index}-${idx}-${liIdx}`}>{li}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (item.type === "citation") {
                    return (
                      <blockquote
                        key={`${index}-${idx}`}
                        className="border-l-4 border-gray-500 pl-4 italic text-gray-400 my-6"
                      >
                        {item.citationText}
                      </blockquote>
                    );
                  }
                  return null;
                })}
              </div>
            );

          case "statistics":
            return (
              <Statistics key={index} data={block.content} isDetailedEventPage />
            );

          case "gallery":
            return <Gallery key={index} data={block.content} isDetailedEventPage />;

          case "imageText":
            return (
              <ImageText key={index} data={block} highlightColor={highlightColor} />
            );

          case "ageDistribution":
            return (
              <AgeDistribution
                key={index}
                data={block}
                highlightColor={highlightColor}
              />
            );

          case "roleSplit":
            return (
              <RoleSplit key={index} data={block} highlightColor={highlightColor} />
            );

          case "highlight":
            return (
              <Highlight key={index} data={block} highlightColor={highlightColor} />
            );

          case "speakers":
            return (
              <Speakers key={index} data={block} highlightColor={highlightColor} />
            );

          case "themes":
            return (
              <ThemesBlock key={index} data={block} highlightColor={highlightColor} />
            );

          case "equipment":
            return (
              <Equipment key={index} data={block} highlightColor={highlightColor} />
            );

          case "games":
            return (
              <FreeplaySection
                key={index}
                games={block.gameIds}
                catalogue={gamesCatalogue}
                randomizeGames={block.randomize}
                highlightColor={highlightColor}
                compact
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
};

export default ServiceContent;
