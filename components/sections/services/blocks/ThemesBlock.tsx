import React from "react";
import { ThemesBlock as ThemesBlockData } from "@/types/pages/service-blocks";

interface Props {
  data: ThemesBlockData;
  highlightColor: string;
}

const ThemesBlock: React.FC<Props> = ({ data, highlightColor }) => {
  return (
    <div className="my-10">
      <div
        className="inline-block px-6 py-3 rounded-xl mb-8 font-goldman uppercase text-white text-sm tracking-wider"
        style={{ backgroundColor: highlightColor }}
      >
        {data.title ?? "Thématiques abordées"}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.items.map((item) => (
          <div
            key={item.title}
            className="flex items-start gap-4 bg-gray-900/50 border border-white/10 rounded-2xl p-5 backdrop-blur-sm"
          >
            {item.icon && (
              <div className="text-3xl shrink-0" aria-hidden>
                {item.icon}
              </div>
            )}
            <div>
              <h4 className="font-rajdhani font-bold text-white uppercase tracking-wide">
                {item.title}
              </h4>
              {item.description && (
                <p className="text-gray-400 font-rajdhani text-sm leading-snug mt-1">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemesBlock;
