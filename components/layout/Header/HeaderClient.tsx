"use client";

import React, { useState, useEffect, useMemo } from "react";
import TopBar from "./TopBar";
import Logo from "./Logo";
import MainMenu from "./MainMenu";
import MobileMenu from "./MobileMenu";
import Button from "@/components/ui/Button";
import { HeaderData, MenuItemData } from "@/types";
import { useAudienceHomeHref } from "@/lib/use-audience-home";

/**
 * Le seul lien du menu qui pointe vers "/" est "Accueil" : on le fait suivre
 * la page d'accueil de la version actuelle plutôt que de renvoyer, en dur,
 * vers la version joueurs.
 */
const withHomeHref = (items: MenuItemData[], homeHref: string): MenuItemData[] =>
  items.map((item) => ({
    ...item,
    href: item.href === "/" ? homeHref : item.href,
    submenu: item.submenu ? withHomeHref(item.submenu, homeHref) : item.submenu,
    mega: item.mega?.map((column) => ({
      ...column,
      links: column.links.map((link) => ({
        ...link,
        href: link.href === "/" ? homeHref : link.href,
      })),
    })),
  }));

const HeaderClient: React.FC<{ headerData: HeaderData }> = ({ headerData }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const homeHref = useAudienceHomeHref();

  const menuItems = useMemo(
    () => withHomeHref(headerData.menu, homeHref),
    [headerData.menu, homeHref],
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="absolute left-0 right-0 top-0 z-40">
        {/* Top Bar */}
        <TopBar
          notice={headerData.topBar.notice}
          socialLinks={headerData.topBar.socialLinks}
        />

        {/* Sticky Wrapper */}
        <div
          className={`
            transition-all duration-400
            ${
              isSticky
                ? "fixed top-0 left-0 right-0 shadow-[0_0_10px_rgba(0,0,0,0.07)] animate-sticky-slide z-40"
                : ""
            }
          `}
        >
          {/* Main Menu Area */}
          <div className="relative z-20">
            {/* VERSION MOBILE (Écran < xl) : Fond rouge, rectangulaire, PAS de clip-path */}
            <div className="absolute left-0 top-0 h-[calc(100%)] w-full bg-gray-950/90 backdrop-blur-md border-b-4 border-theme z-[-2] xl:hidden" />

            {/* VERSION DESKTOP (Écran >= xl) : Fond gris, AVEC clip-path */}
            <div
              className="hidden xl:block absolute left-0 bottom-[-23px] h-[calc(100%+23px)] w-full bg-gray-950/90 backdrop-blur-md z-[-2]"
              style={{
                clipPath:
                  "polygon(0 0, 100% 0, 100% 100%, calc(100% - 75px) calc(100% - 23px), 75px calc(100% - 23px), 0 100%)",
              }}
            />
            <div
              className="hidden xl:block absolute left-0 bottom-[-23px] h-[23px] w-full bg-theme z-[-1]"
              style={{
                clipPath:
                  "polygon(75px 0, calc(100% - 75px) 0, 110% 65px, calc(100% - 75px) calc(100% - 20px), 75px calc(100% - 20px), 0 100%)",
              }}
            />
            {/* Fin VERSION DESKTOP */}

            <div className="container mx-auto">
              <div className="flex items-center justify-between px-4 sm:px-auto">
                {/* Logo */}
                <div className="relative z-20">
                  <Logo logo={headerData.logo} href={homeHref} />
                </div>

                {/* Navigation */}
                <div className="flex items-center">
                  <MainMenu menuItems={menuItems} />

                  {/* Mobile Menu Toggle */}
                  <div className="flex xl:hidden">
                    <button
                      type="button"
                      onClick={() => setIsMobileMenuOpen(true)}
                      className="text-white text-2xl p-2 hover:text-theme transition-colors"
                      aria-label="Open menu"
                    >
                      <span className="relative inline-block">☰</span>
                    </button>
                  </div>
                </div>

                {/* Header Buttons (Desktop) */}
                <div className="hidden xl:flex items-center gap-5">
                  <Button
                    variant="primary"
                    asLink
                    href="/evenements"
                    className="uppercase"
                  >
                    évènements à venir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={menuItems}
        logo={headerData.logo}
        homeHref={homeHref}
      />
    </>
  );
};

export default HeaderClient;
