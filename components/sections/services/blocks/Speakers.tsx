import React from "react";
import Image from "next/image";
import { LuLinkedin, LuUser } from "react-icons/lu";
import { SpeakersBlock } from "@/types/pages/service-blocks";

interface Props {
  data: SpeakersBlock;
  highlightColor: string;
}

const Speakers: React.FC<Props> = ({ data, highlightColor }) => {
  return (
    <div className="my-10">
      <div
        className="inline-block px-6 py-3 rounded-xl mb-8 font-goldman uppercase text-white text-sm tracking-wider"
        style={{ backgroundColor: highlightColor }}
      >
        {data.title ?? "Nos intervenants"}
      </div>

      <div className="space-y-4">
        {data.speakers.map((speaker) => (
          <div
            key={speaker.name}
            className="flex items-center gap-4 bg-gray-900/50 border border-white/10 rounded-2xl p-4 backdrop-blur-sm"
          >
            <div className="relative w-16 h-16 shrink-0 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
              {speaker.photo ? (
                <Image
                  src={speaker.photo}
                  alt={speaker.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <LuUser className="w-7 h-7 text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-rajdhani font-bold text-white text-lg">
                  {speaker.name}
                </h4>
                {speaker.linkedin && (
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn de ${speaker.name}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <LuLinkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="text-gray-400 font-rajdhani text-sm leading-snug">
                {speaker.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Speakers;
