import React from "react";
import { AgeDistributionBlock } from "@/types/pages/service-blocks";

interface Props {
  data: AgeDistributionBlock;
  highlightColor: string;
}

const AgeDistribution: React.FC<Props> = ({ data, highlightColor }) => {
  const title = data.title ?? "Répartition par âge";
  const max = Math.max(...data.buckets.map((b) => b.percent), 1);

  return (
    <div className="my-10">
      <div
        className="inline-block px-6 py-3 rounded-xl mb-8 font-goldman uppercase text-white text-sm tracking-wider"
        style={{ backgroundColor: highlightColor }}
      >
        {title}
      </div>

      <div className="space-y-5">
        {data.buckets.map((bucket) => (
          <div key={bucket.label} className="flex items-center gap-4">
            <span className="w-20 shrink-0 font-rajdhani font-bold text-gray-400 text-sm uppercase leading-tight">
              {bucket.label}
            </span>
            <div className="flex-1 flex items-center gap-3">
              <div
                className="h-6 rounded-md transition-all"
                style={{
                  width: `${(bucket.percent / max) * 100}%`,
                  backgroundColor: highlightColor,
                }}
                role="img"
                aria-label={`${bucket.label} : ${bucket.percent}%`}
              />
              <span className="font-goldman text-white text-lg">
                {bucket.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgeDistribution;
