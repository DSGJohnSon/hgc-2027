"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { usePathname } from "next/navigation";

interface DecorationElement {
  id: number;
  src: string;
  size: number;
  x: number;
  y: number; // Position de départ en % du total
  depth: number;
  rotate: number;
  floatDuration: number;
  floatAmplitudeX: number;
  floatAmplitudeY: number;
}

const FloatingDecorations: React.FC = () => {
  const [elements, setElements] = useState<DecorationElement[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useEffect(() => {
    setIsMounted(true);

    const getLayout = () => {
      const pageHeight = document.documentElement.scrollHeight || 5000;
      const viewHeight = window.innerHeight || 1000;
      const viewWidth = window.innerWidth || 1000;

      // Détection mobile
      const isMobile = viewWidth < 768;
      const isTablet = viewWidth >= 768 && viewWidth < 1024;

      const totalSections = Math.ceil(pageHeight / viewHeight);

      // Distribution des éléments selon le viewport
      let count;
      if (isMobile) {
        // Plus d'éléments sur mobile pour couvrir toute la page
        count = 3 + Math.max(0, Math.floor((totalSections - 1) * 0.6)); // 60% des sections supplémentaires
      } else if (isTablet) {
        count = 3 + Math.max(0, Math.floor((totalSections - 1) / 2)); // Moitié moins sur tablette
      } else {
        count = 3 + Math.max(0, totalSections - 1);
      }

      const assets = [
        "/assets/forms/circle_orange.svg",
        "/assets/forms/circle_purple.svg",
        "/assets/forms/disk_orange.svg",
        "/assets/forms/line-orange.svg",
        "/assets/forms/line-purple.svg",
        "/assets/forms/small_line-orange.svg",
        "/assets/forms/small_line-purple.svg",
        "/assets/forms/triangle-orange.svg",
        "/assets/forms/triangle-purple.svg",
        "/assets/forms/wave_orange.svg",
        "/assets/forms/wave_purple.svg",
      ];

      const startSide = Math.random() > 0.5 ? 0 : 1;

      return Array.from({ length: count }).map((_, i) => {
        const side = (i + startSide) % 2 === 0 ? "left" : "right";

        // Marges adaptées au viewport
        let xBase;
        if (isMobile) {
          // Éléments très proches des bords sur mobile (0-8% et 92-100%)
          xBase = side === "left" ? Math.random() * 8 : 92 + Math.random() * 8;
        } else if (isTablet) {
          // Marge intermédiaire sur tablette
          xBase =
            side === "left" ? 5 + Math.random() * 8 : 82 + Math.random() * 8;
        } else {
          // Marge originale sur desktop
          xBase = side === "left" ? Math.random() * 4 : 96 + Math.random() * 4;
        }

        let yPixels;
        if (i < 3) {
          yPixels =
            i * (viewHeight / 3) + viewHeight * 0.2 + Math.random() * 100;
        } else {
          const remainingElements = count - 3;
          const sectionIndex = i - 3;
          const startFrom = viewHeight + 200;
          const availableHeight = pageHeight - startFrom - 400;

          yPixels =
            startFrom +
            (sectionIndex / Math.max(1, remainingElements)) * availableHeight +
            Math.random() * 200;
        }

        // Tailles adaptées au viewport
        let size;
        if (isMobile) {
          size = Math.random() * 100 + 50; // 50-150px sur mobile
        } else if (isTablet) {
          size = Math.random() * 150 + 100; // 100-250px sur tablette
        } else {
          size = Math.random() * 300 + 150; // 150-450px sur desktop
        }

        // Amplitudes d'animation réduites sur mobile
        const floatAmplitudeX = isMobile
          ? Math.random() * 10 + 5
          : Math.random() * 25 + 15;
        const floatAmplitudeY = isMobile
          ? Math.random() * 8 + 5
          : Math.random() * 15 + 10;

        // Profondeur de parallaxe réduite sur mobile
        const depth = isMobile
          ? Math.random() * 0.2 + 0.05
          : Math.random() * 0.4 + 0.1;

        return {
          id: i,
          src: assets[Math.floor(Math.random() * assets.length)],
          size,
          x: xBase,
          y: (yPixels / pageHeight) * 100,
          depth,
          rotate: Math.random() * 360,
          floatDuration: Math.random() * 10 + 15,
          floatAmplitudeX,
          floatAmplitudeY,
        };
      });
    };

    setElements(getLayout());

    // Recalculer le layout lors du redimensionnement ou du changement de page
    const handleResize = () => {
      setElements(getLayout());
    };

    // Un petit délai pour s'assurer que le contenu de la nouvelle page est rendu
    // et que le scrollHeight est correct
    const timeoutId = setTimeout(() => {
      setElements(getLayout());
    }, 100);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  if (!isMounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-15 min-h-full hidden md:block">
      {elements.map((el) => (
        <ParallaxElement key={el.id} element={el} scrollY={scrollY} />
      ))}
    </div>
  );
};

const ParallaxElement = ({
  element,
  scrollY,
}: {
  element: DecorationElement;
  scrollY: MotionValue<number>;
}) => {
  const springScrollY = useSpring(scrollY, { damping: 50, stiffness: 200 });

  // Parallaxe vertical amplifié
  const yParallax = useTransform(
    springScrollY,
    [0, 10000],
    [0, element.depth * 3500]
  );

  // Rotation liée au scroll
  const scrollRotate = useTransform(
    springScrollY,
    [0, 10000],
    [0, element.depth * 720]
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: element.size,
        height: element.size,
        y: yParallax,
        rotate: scrollRotate,
        translateX: "-50%",
        translateY: "-50%",
        willChange: "transform",
      }}
    >
      <motion.div
        animate={{
          rotate: [
            element.rotate,
            element.rotate + 30,
            element.rotate - 10,
            element.rotate,
          ],
          x: [
            0,
            element.x < 50
              ? element.floatAmplitudeX * 1.5
              : -element.floatAmplitudeX * 1.5,
            0,
          ],
          y: [0, element.floatAmplitudeY * 1.5, 0],
        }}
        transition={{
          duration: element.floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-full h-full"
      >
        <img
          src={element.src}
          alt=""
          className="w-full h-full object-contain select-none pointer-events-none opacity-90"
          style={{ transform: "translate3d(0,0,0)" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default FloatingDecorations;
