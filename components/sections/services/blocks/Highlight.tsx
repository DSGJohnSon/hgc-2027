import React from "react";
import { HighlightBlock } from "@/types/pages/service-blocks";

interface Props {
  data: HighlightBlock;
  highlightColor: string;
}

const Highlight: React.FC<Props> = ({ data, highlightColor }) => {
  return (
    <div className="my-10 relative overflow-hidden rounded-2xl bg-gray-950 border border-white/10 p-8">
      <div
        className="absolute left-0 top-0 h-full w-1.5"
        style={{ backgroundColor: highlightColor }}
      />
      <h3 className="font-goldman uppercase text-white text-xl md:text-2xl mb-3">
        {data.title ?? "Le petit plus"}
      </h3>
      <p className="text-gray-300 font-rajdhani leading-7">{data.text}</p>
    </div>
  );
};

export default Highlight;
