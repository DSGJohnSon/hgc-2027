"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuItemData, ImageData } from "@/types";
import { getMegaIcon } from "./megaIcons";
import { LuChevronDown, LuX } from "react-icons/lu";
import AudienceSwitch from "./AudienceSwitch";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItemData[];
  logo: ImageData;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  menuItems,
  logo,
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`
          fixed inset-0 bg-gray-950 z-40 transition-opacity duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full
          bg-gray-950 z-50 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="text-center p-6 bg-gray-900">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white block w-6 h-6 hover:text-theme transition-colors"
              aria-label="Close menu"
            >
              <LuX className="w-full h-full" />
            </button>
            <Link href="/" onClick={onClose}>
              <Image
                src={logo.src}
                alt={logo.alt}
                width={150}
                height={45}
                className="mx-auto"
              />
            </Link>
          </div>

          {/* Bascule joueurs / collectivités */}
          <div className="flex justify-center border-b border-white/10 py-4">
            <AudienceSwitch onNavigate={onClose} />
          </div>

          {/* Menu Items */}
          <nav className="p-6">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <MobileMenuItem
                  key={item.label}
                  item={item}
                  onClose={onClose}
                />
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

interface MobileMenuItemProps {
  item: MenuItemData;
  onClose: () => void;
  depth?: number;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({
  item,
  onClose,
  depth = 0,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const hasMega = !!item.mega && item.mega.length > 0;
  const isExpandable = hasSubmenu || hasMega;

  return (
    <li className="list-none">
      <div className="flex items-center justify-between">
        <Link
          href={item.href}
          onClick={onClose}
          className={`
            flex-1 block py-3 text-white font-rajdhani font-semibold
            hover:text-theme transition-colors text-base
            ${depth > 0 ? "pl-4 border-l border-border-color" : ""}
          `}
        >
          {item.label}
        </Link>
        {isExpandable && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-3 text-white hover:text-theme transition-colors"
            aria-label={`Toggle ${item.label} submenu`}
          >
            <span
              className={`transition-transform duration-300 inline-block ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <LuChevronDown className="w-4 h-4" />
            </span>
          </button>
        )}
      </div>

      {hasSubmenu && (
        <ul
          className={`
            overflow-hidden transition-all duration-300
            ${isExpanded ? "max-h-250 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          {item.submenu?.map((subItem: MenuItemData) => (
            <MobileMenuItem
              key={subItem.label}
              item={subItem}
              onClose={onClose}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}

      {hasMega && (
        <div
          className={`
            overflow-hidden transition-all duration-300
            ${isExpanded ? "max-h-250 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          {item.mega?.map((column) => (
            <div key={column.title} className="mt-2">
              <p className="flex items-center gap-2 font-goldman text-theme2 uppercase text-xs tracking-widest px-4 py-2">
                {(() => {
                  const Icon = getMegaIcon(column.icon);
                  return Icon ? <Icon className="w-4 h-4 shrink-0" /> : null;
                })()}
                <span>{column.title}</span>
              </p>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href} className="list-none">
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block py-2 pl-6 border-l border-border-color text-gray-300 font-rajdhani font-semibold hover:text-theme transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </li>
  );
};

export default MobileMenu;
