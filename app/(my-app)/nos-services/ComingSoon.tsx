import React from "react";
import Link from "next/link";

interface Props {
  title: string;
  children?: React.ReactNode;
  /** Lien de retour vers la page « Nos Services » (masqué sur cette page). */
  showBackLink?: boolean;
}

/** Gabarit commun des pages « Nos Services » en attendant leur contenu. */
const ComingSoon: React.FC<Props> = ({ title, children, showBackLink = false }) => (
  <div className="min-h-screen bg-gray-950">
    <section className="relative pt-72 pb-24 px-4">
      <div className="container mx-auto text-center max-w-3xl">
        <p className="text-theme font-rajdhani uppercase tracking-[0.3em] text-sm font-bold mb-4">
          Nos Services
        </p>
        <h1 className="font-goldman text-4xl sm:text-5xl md:text-6xl text-white uppercase text-balance leading-[0.9] mb-6">
          {title}
        </h1>
        <p className="text-gray-400 font-rajdhani text-lg md:text-xl mb-10">
          Cette page est en cours de préparation. Revenez très bientôt, ou
          contactez-nous dès maintenant pour en savoir plus.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-theme px-6 py-3 font-rajdhani font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
          >
            Nous contacter
          </Link>
          {showBackLink && (
            <Link
              href="/nos-services"
              className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 font-rajdhani font-bold uppercase tracking-wider text-white transition-colors hover:border-white/50"
            >
              Tous nos services
            </Link>
          )}
        </div>
      </div>
    </section>
    {children}
  </div>
);

export default ComingSoon;
