import React from "react";
import Link from "next/link";
import { SocialLink } from "@/types";
import AudienceSwitch from "./AudienceSwitch";

interface TopBarProps {
  notice: string;
  socialLinks: SocialLink[];
}

const TopBar: React.FC<TopBarProps> = ({ notice, socialLinks }) => {
  return (
    <div className="relative z-30 block bg-gray-900">
      <div className="container mx-auto">
        <div className="flex justify-center lg:justify-between items-center py-3">
          {/* Left side - Notice */}
          <div className="hidden lg:block">
            <div className="flex items-center">
              <div className="text-gray-300 font-rajdhani text-xs">
                {notice.split("HGC")[0]}
                <Link
                  href="/"
                  className="text-theme hover:shadow-[0_0_1px_currentColor] transition-shadow"
                >
                  HGC
                </Link>
                {notice.split("HGC")[1]}
              </div>
            </div>
          </div>

          {/* Bascule joueurs / collectivités */}
          <AudienceSwitch className="hidden lg:flex" />

          {/* Right side - Social Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            {socialLinks.map((link, index) => (
              <React.Fragment key={link.platform}>
                <Link
                  href={link.url}
                  className="text-gray-300 text-xs font-rajdhani hover:text-theme transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.platform}
                </Link>
                {index < socialLinks.length - 1 && (
                  <span className="w-0.5 h-4 bg-border-color" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
