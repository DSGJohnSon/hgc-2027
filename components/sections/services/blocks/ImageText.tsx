import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageTextBlock } from "@/types/pages/service-blocks";

interface Props {
  data: ImageTextBlock;
  highlightColor: string;
}

const ImageText: React.FC<Props> = ({ data, highlightColor }) => {
  return (
    <div
      className={cn(
        "my-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center",
        data.reverse && "md:[direction:rtl]",
      )}
    >
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 [direction:ltr]">
        <Image
          src={data.image}
          alt={data.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="[direction:ltr]">
        {data.title && (
          <h3 className="font-goldman text-2xl text-white uppercase tracking-tight flex items-center gap-3 mb-4">
            <span className="w-8 h-1" style={{ backgroundColor: highlightColor }} />
            {data.title}
          </h3>
        )}
        {data.text.map((para, i) => (
          <p key={i} className="text-gray-300 font-rajdhani leading-7 mb-4">
            {para}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ImageText;
