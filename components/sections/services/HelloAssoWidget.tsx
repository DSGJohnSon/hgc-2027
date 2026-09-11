"use client";

import React, { useEffect, useRef } from "react";
import { LuTicket } from "react-icons/lu";

interface Props {
  embed?: string;
  title?: string;
  highlightColor: string;
}

/**
 * Rend le code embed HelloAsso fourni par le client (pattern similaire au
 * widget Weezevent). Si aucun embed n'est fourni, affiche un état neutre.
 * NB : re-exécute les <script> contenus dans l'embed (non exécutés via
 * dangerouslySetInnerHTML) en les ré-injectant manuellement.
 */
const HelloAssoWidget: React.FC<Props> = ({ embed, title, highlightColor }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !embed) return;

    container.innerHTML = embed;

    // Ré-injecter les scripts pour qu'ils s'exécutent réellement.
    const scripts = Array.from(container.querySelectorAll("script"));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value),
      );
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [embed]);

  return (
    <section className="py-12">
      <div className="flex items-center gap-3 mb-6">
        <LuTicket className="w-6 h-6" style={{ color: highlightColor }} />
        <h2 className="font-goldman text-2xl md:text-3xl text-white uppercase tracking-tight">
          {title ?? "Réserver"}
        </h2>
      </div>

      {embed ? (
        <div
          ref={containerRef}
          className="bg-gray-900/50 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-sm"
        />
      ) : (
        <div className="bg-gray-900/50 border border-dashed border-white/20 rounded-2xl p-8 text-center text-gray-400 font-rajdhani">
          Le module de réservation HelloAsso sera disponible prochainement.
        </div>
      )}
    </section>
  );
};

export default HelloAssoWidget;
