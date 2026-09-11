"use client";

import React, { useMemo } from "react";
import Button from "@/components/ui/Button";
import { LuArrowRight, LuChevronDown } from "react-icons/lu";
import TextGradient from "@/components/ui/text-gradient";
import AvatarCircles from "@/components/ui/avatar-circles";

interface MainHeroProps {
  subtitle: string;
  title: {
    line1: string;
    line2: string;
  };
  buttons: Array<{
    label: string;
    href: string;
    variant: "primary" | "secondary";
    textUpperCase?: boolean;
  }>;
  totalParticipants?: string;
  year?: number;
}

const MainHero: React.FC<MainHeroProps> = ({
  subtitle,
  title,
  buttons,
  totalParticipants = "500",
  year = 2020,
}) => {
  // Generate random names for boring-avatars
  // Generate random names for boring-avatars
  const [displayedAvatars, setDisplayedAvatars] = React.useState<string[]>([]);

  React.useEffect(() => {
    const names = [
      "Alice Johnson",
      "Bob Smith",
      "Charlie Brown",
      "Diana Prince",
      "Ethan Hunt",
      "Fiona Apple",
      "George Martin",
      "Hannah Montana",
      "Isaac Newton",
      "Julia Roberts",
      "Kevin Hart",
      "Laura Palmer",
      "Michael Jordan",
      "Nina Simone",
      "Oscar Wilde",
      "Patricia Hill",
      "Quinn Fabray",
      "Rachel Green",
      "Steve Jobs",
      "Tina Turner",
    ];
    // Shuffle and pick 4 random names - only on client
    const shuffled = [...names].sort(() => Math.random() - 0.5);
    setDisplayedAvatars(shuffled.slice(0, 4));
  }, []);

  return (
    <>
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-5xl mx-auto animate-fade-in-up animation-delay-200 space-y-8 pt-20 pb-8">
          {/* Subtitle */}
          <TextGradient
            className="font-rajdhani text-base lg:text-xl text-gray-500"
            spread={22}
            highlightColor="#fff"
            duration={2}
          >
            {subtitle}
          </TextGradient>

          {/* Title */}
          <h1 className="font-goldman font-bold text-white mb-8 sm:mb-12 uppercase">
            <span className="block text-4xl sm:text-6xl lg:text-7xl mb-2 sm:mb-4 animate-fade-in-up uppercase text-balance">
              {title.line1}
            </span>
            <span className="block text-5xl sm:text-7xl lg:text-8xl text-theme2 animate-fade-in-up animation-delay-200 uppercase text-balance">
              {title.line2}
            </span>
          </h1>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
            {buttons.map((button) => (
              <Button
                key={button.label}
                variant={button.variant}
                asLink
                href={button.href}
                icon={<LuArrowRight />}
                iconPosition="right"
                textUpperCase={button.textUpperCase}
                className="w-full lg:w-auto"
              >
                {button.label}
              </Button>
            ))}
          </div>

          {/* Avatar Circles - Participants */}
          <div className="animate-fade-in-up animation-delay-600 mt-8 flex flex-col lg:flex-row items-center gap-4 justify-center">
            <AvatarCircles
              numPeople={totalParticipants}
              avatarNames={displayedAvatars}
            />
            <p className="text-sm text-gray-400 font-rajdhani">
              visiteurs/participants depuis {year}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainHero;
