import React from "react";
import Link from "next/link";
import { GoHeartFill } from "react-icons/go";
import { LuCopyright } from "react-icons/lu";

const Copyright: React.FC = () => {
  return (
    <div className="bg-gray-900 mt-14">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-4 sm:py-0">
          <div
            className="inline-block bg-gray-900 relative font-rajdhani sm:py-4"
          >
            <p className="text-white text-xs sm:text-sm flex items-center justify-center text-center gap-2">
              <LuCopyright className="sm:w-4 sm:h-4 w-3 h-3 shrink-0" />
              2024 - {new Date().getFullYear()} Holiday Geek Cup. Tous droits réservés.
            </p>
          </div>
          <div>
            <p className="text-white/50 text-xs sm:text-sm flex flex-col sm:flex-row items-center gap-1 sm:gap-2 font-rajdhani">
              <span className="flex items-center gap-2">
                Développé avec <GoHeartFill className="sm:w-4 sm:h-4 w-3 h-3 text-theme" />
              </span>
              <span>
                par <Link href="https://fredf.fr" target="_blank" className="underline">Fred F.</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
