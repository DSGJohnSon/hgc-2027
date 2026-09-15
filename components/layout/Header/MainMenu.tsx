"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MenuItemData } from "@/types";
import { getMegaIcon } from "./megaIcons";
import { LuChevronDown, LuGamepad2 } from "react-icons/lu";
import Button from "@/components/ui/Button";

interface MainMenuProps {
  menuItems: MenuItemData[];
}

const MainMenu: React.FC<MainMenuProps> = ({ menuItems }) => {
  return (
    <nav className="hidden xl:inline-block ml-0 xl:ml-35">
      <ul className="m-0 p-0">
        {menuItems.map((item) => (
          <MenuItem key={item.label} item={item} />
        ))}
      </ul>
    </nav>
  );
};

interface MenuItemProps {
  item: MenuItemData;
  isSubmenu?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, isSubmenu = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const hasMega = !isSubmenu && !!item.mega && item.mega.length > 0;

  if (hasMega) {
    return <MegaMenuItem item={item} isOpen={isOpen} setIsOpen={setIsOpen} />;
  }

  return (
    <li
      className={`
        inline-block relative list-none
        ${!isSubmenu ? "mx-6.75 first:ml-0 last:mr-0" : "block mx-0 px-2.25"}
        ${hasSubmenu ? "group" : ""}
      `}
      onMouseEnter={() => hasSubmenu && setIsOpen(true)}
      onMouseLeave={() => hasSubmenu && setIsOpen(false)}
    >
      <Link
        href={item.href}
        className={`
          relative font-rajdhani font-bold text-white
          flex items-center
          group/Gamepad2
          transition-colors duration-300
          ${!isSubmenu ? "text-base p-2 xl:p-4" : "text-base capitalize"}
          hover:text-theme
        `}
      >
        {isSubmenu && (
          <LuGamepad2
            className="
              text-theme opacity-0 group-hover/Gamepad2:opacity-100
              -translate-x-5 group-hover/Gamepad2:-translate-x-1.25
              transition-all duration-300
            "
          />
        )}
        <span>{item.label}</span>
        {hasSubmenu && !isSubmenu && (
          <LuChevronDown className="ml-3 transition-transform duration-300 group-hover:rotate-180" />
        )}
        {hasSubmenu && isSubmenu && (
          <span className="float-right text-sm text-gray-400">▶</span>
        )}
      </Link>

      {hasSubmenu && (
        <ul
          className={`
            absolute text-left min-w-57.5 w-max
            bg-linear-to-t from-black to-gray-950
            transition-all duration-400 origin-top
            border-theme border-l-3
            flex flex-col
            ${
              !isSubmenu
                ? "top-[calc(100%)] left-0 p-4 "
                : "top-0 left-full ml-5 pt-4.5 pb-4.5 px-5 pl-4.5"
            }
            ${
              isOpen
                ? "opacity-100 visible scale-y-100 z-50"
                : "opacity-0 invisible scale-y-0 -z-10"
            }
          `}
        >
          {item.submenu?.map((subItem) => (
            <MenuItem key={subItem.label} item={subItem} isSubmenu />
          ))}
        </ul>
      )}
    </li>
  );
};

interface MegaMenuItemProps {
  item: MenuItemData;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const MegaMenuItem: React.FC<MegaMenuItemProps> = ({
  item,
  isOpen,
  setIsOpen,
}) => {
  return (
    <li
      className="inline-block relative list-none mx-6.75 first:ml-0 last:mr-0 group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={item.href}
        className="relative font-rajdhani font-bold text-white flex items-center text-base p-2 xl:p-4 transition-colors duration-300 hover:text-theme"
      >
        <span>{item.label}</span>
        <LuChevronDown className="ml-3 transition-transform duration-300 group-hover:rotate-180" />
      </Link>

      <div
        className={`
          absolute top-[calc(100%)] left-1/2 -translate-x-1/2 z-50
          bg-linear-to-t from-black to-gray-950
          border-theme border-l-3
          p-8 flex flex-col text-left gap-10 w-max max-w-[90vw]
          transition-all duration-400 origin-top
          ${
            isOpen
              ? "opacity-100 visible scale-y-100"
              : "opacity-0 invisible scale-y-0 -z-10"
          }
        `}
      >
        {item.mega?.map((column) => (
          <div key={column.title} className="min-w-56">
            <div className="mb-4 pb-2 border-b border-white/10">
              <p className="flex items-center gap-2 font-goldman text-theme2 uppercase text-lg tracking-widest">
                {(() => {
                  const Icon = getMegaIcon(column.icon);
                  return Icon ? <Icon className="w-5 h-5 shrink-0" /> : null;
                })()}
                <span>{column.title}</span>
              </p>
            </div>
            <ul className="space-y-1">
              {column.links.map((link) => (
                <li key={link.href} className="list-none">
                  <Link
                    href={link.href}
                    className="group/link flex items-center gap-2 py-1.5 font-rajdhani font-semibold text-white hover:text-theme transition-colors"
                  >
                    <LuGamepad2 className="text-theme opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all duration-300 shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <Link href={item.href || "#"} className="inline">
          <Button className="cursor-pointer">
              Voir tous {item.label.toLowerCase()}
          </Button>
        </Link>
      </div>
    </li>
  );
};

export default MainMenu;
