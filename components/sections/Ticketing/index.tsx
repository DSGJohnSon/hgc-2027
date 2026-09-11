"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TicketingData {
  code: string;
}

interface TicketingProps {
  data: TicketingData;
  className?: string;
}

const Ticketing: React.FC<TicketingProps> = ({ data, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (!data.code || !containerRef.current || processedRef.current) return;

    // Extract script src
    const scriptSrcMatch = data.code.match(/<script.*?src=["'](.*?)["'].*?>/);
    const scriptSrc = scriptSrcMatch ? scriptSrcMatch[1] : null;

    // Remove script tag from HTML to avoid double rendering or hydration issues if React tries to handle it
    const cleanHtml = data.code.replace(
      /<script\b[^>]*>([\s\S]*?)<\/script>/gm,
      ""
    );

    // Inject HTML
    containerRef.current.innerHTML = cleanHtml;

    // Inject Script dynamically if found
    if (scriptSrc) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      script.type = "text/javascript";
      document.body.appendChild(script);

      // Cleanup script on unmount
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }

    processedRef.current = true;
  }, [data.code]);

  return (
    <section
      className={cn(
        "relative w-full py-20 bg-transparent flex flex-col",
        className
      )}
    >
      <div className="w-full">
        <div ref={containerRef} className="weezevent-container w-full" />
      </div>
    </section>
  );
};

export default Ticketing;
