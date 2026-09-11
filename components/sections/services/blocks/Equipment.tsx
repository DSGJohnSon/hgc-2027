import React from "react";
import Image from "next/image";
import { LuGamepad2 } from "react-icons/lu";
import { EquipmentBlock } from "@/types/pages/service-blocks";

interface Props {
  data: EquipmentBlock;
  highlightColor: string;
}

const Equipment: React.FC<Props> = ({ data, highlightColor }) => {
  return (
    <div className="my-10">
      <h3 className="font-goldman text-2xl text-white uppercase tracking-tight flex items-center gap-3 mb-6">
        <span className="w-8 h-1" style={{ backgroundColor: highlightColor }} />
        {data.title ?? "Notre équipement"}
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {data.items.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 bg-gray-900/50 border border-white/10 rounded-xl p-4 backdrop-blur-sm"
          >
            {item.image ? (
              <div className="relative w-8 h-8 shrink-0">
                <Image src={item.image} alt={item.label} fill sizes="32px" className="object-contain" />
              </div>
            ) : (
              <LuGamepad2
                className="w-5 h-5 shrink-0"
                style={{ color: highlightColor }}
              />
            )}
            <span className="font-rajdhani font-bold text-white">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Equipment;
