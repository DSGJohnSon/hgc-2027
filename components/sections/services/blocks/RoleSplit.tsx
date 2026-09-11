import React from "react";
import { RoleSplitBlock } from "@/types/pages/service-blocks";

interface Props {
  data: RoleSplitBlock;
  highlightColor: string;
}

const Column: React.FC<{
  title: string;
  items: string[];
  accent: string;
}> = ({ title, items, accent }) => (
  <div className="bg-gray-900/50 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
    <h3
      className="font-goldman uppercase text-xl md:text-2xl mb-6 pb-3 border-b-2"
      style={{ color: accent, borderColor: accent }}
    >
      {title}
    </h3>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-gray-300 font-rajdhani">
          <span
            className="mt-2 w-3 h-0.5 shrink-0"
            style={{ backgroundColor: accent }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const RoleSplit: React.FC<Props> = ({ data, highlightColor }) => {
  return (
    <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Column
        title={data.cityTitle ?? "La ville apporte"}
        items={data.cityItems}
        accent="#2E6FB5"
      />
      <Column
        title={data.hgcTitle ?? "HGC apporte"}
        items={data.hgcItems}
        accent={highlightColor}
      />
    </div>
  );
};

export default RoleSplit;
