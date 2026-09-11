"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";

export function ImageGallery({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = React.useState(true);

  // Détecter si on est sur desktop (>= 1024px)
  React.useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"],
  });

  const translateYFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateXFirst = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isDesktop ? -200 : 0]
  );
  const rotateXFirst = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isDesktop ? -20 : 0]
  );

  const translateYThird = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateXThird = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isDesktop ? 200 : 0]
  );
  const rotateXThird = useTransform(
    scrollYProgress,
    [0, 1],
    [0, isDesktop ? 20 : 0]
  );

  return (
    <div
      ref={gridRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center"
    >
      <div className="mx-auto grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((colIndex) => (
          <div key={colIndex} className="grid gap-6">
            {images
              .filter((_, index) => index % 3 === colIndex)
              .map((image, idx) => (
                <AnimatedImage
                  key={`${colIndex}-${idx}`}
                  alt={image.alt}
                  src={image.src}
                  placeholder={image.src}
                  colIndex={colIndex}
                  translateY={
                    colIndex === 0
                      ? translateYFirst
                      : colIndex === 2
                      ? translateYThird
                      : undefined
                  }
                  translateX={
                    colIndex === 0
                      ? translateXFirst
                      : colIndex === 2
                      ? translateXThird
                      : undefined
                  }
                  rotateZ={
                    colIndex === 0
                      ? rotateXFirst
                      : colIndex === 2
                      ? rotateXThird
                      : undefined
                  }
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

interface AnimatedImageProps {
  alt: string;
  src: string;
  className?: string;
  placeholder?: string;
  colIndex: number;
  translateY?: any;
  translateX?: any;
  rotateZ?: any;
}

function AnimatedImage({
  alt,
  src,
  placeholder,
  colIndex,
  translateY,
  translateX,
  rotateZ,
}: AnimatedImageProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [imgSrc, setImgSrc] = React.useState(src);

  const handleError = () => {
    if (placeholder) {
      setImgSrc(placeholder);
    }
  };

  // Pour la colonne du milieu (index 1), on utilise un div normal
  // Pour les colonnes 0 et 2, on utilise motion.div avec les transformations
  if (colIndex === 1) {
    return (
      <div className="relative overflow-hidden rounded-lg">
        <Image
          alt={alt}
          src={imgSrc}
          width={400}
          height={400}
          className={cn(
            "size-full object-cover transition-all duration-700 ease-in-out",
            isLoading
              ? "scale-[1.01] blur-xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoad={() => setIsLoading(false)}
          loading="lazy"
          onError={handleError}
        />
      </div>
    );
  }

  return (
    <motion.div
      style={{
        y: translateY,
        x: translateX,
        rotateZ: rotateZ,
      }}
      className="relative overflow-hidden rounded-lg"
    >
      <Image
        alt={alt}
        src={imgSrc}
        width={400}
        height={400}
        className={cn(
          "size-full object-cover transition-all duration-700 ease-in-out",
          isLoading
            ? "scale-[1.01] blur-xl grayscale"
            : "scale-100 blur-0 grayscale-0"
        )}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
        onError={handleError}
      />
    </motion.div>
  );
}
