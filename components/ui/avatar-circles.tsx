"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Avatar from "boring-avatars";

interface AvatarCirclesProps {
  className?: string;
  numPeople?: string;
  avatarNames: string[];
}

const AvatarCircles = ({
  numPeople,
  className,
  avatarNames,
}: AvatarCirclesProps) => {
  // Logo color palette - extracted from logo-hgc.svg
  const colors = ["#fbb900", "#e60661", "#7f2171", "#5a3b81", "#4cc2f1"];

  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {avatarNames.map((name, index) => (
        <div
          key={index}
          className="h-10 w-10 rounded-full border border-gray-800 relative z-0 overflow-hidden"
        >
          <Avatar size={40} name={name} variant="beam" colors={colors} />
        </div>
      ))}
      <div className="flex h-10 px-3 items-center justify-center rounded-full border border-gray-800 bg-gray-950 text-white relative z-10 whitespace-nowrap">
        <span className="text-xs font-rajdhani font-medium">
          +{numPeople?.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default AvatarCircles;
