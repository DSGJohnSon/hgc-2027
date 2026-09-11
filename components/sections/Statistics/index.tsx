"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, animate } from "framer-motion";
import { StatisticsProps } from "@/types/components/sections/Statistics";
import { cn } from "@/lib/utils";

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return Math.floor(num).toString();
};

const AnimatedNumber = ({ value, plus, type }: { value: number; plus: boolean; type?: "number" | "euros" }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2 + Math.random() * 2,
        ease: "easeOut",
        onUpdate(latest) {
          if (type === "euros") {
            setDisplayValue(Math.floor(latest) + "€" + (plus ? "+" : ""));
          } else {
            setDisplayValue(formatNumber(Math.floor(latest)) + (plus ? "+" : ""));
          }
        },
      });

      return () => controls.stop();
    }
  }, [value, isInView, plus]);

  return <span ref={ref}>{displayValue}</span>;
};

export default function Statistics({ data, isDetailedEventPage }: StatisticsProps) {
  return (
    <div className={cn("relative w-full bg-transparent overflow-hidden",
      isDetailedEventPage ? "py-4" : "py-32"
    )}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 text-center">
          {data.stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center space-y-2"
            >
              <span className="text-6xl md:text-7xl lg:text-8xl font-goldman font-medium text-white tracking-tight">
                <AnimatedNumber value={stat.value} plus={stat.plus} type={stat.type} />
              </span>
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg md:text-xl text-white font-rajdhani uppercase tracking-wider">
                  {stat.label}
                </span>
                {stat.sublabel && (
                  <span className="text-base md:text-lg text-gray-300 font-rajdhani tracking-wide">
                    {stat.sublabel}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
