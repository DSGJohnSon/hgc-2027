import { Metadata } from "next";
import Link from "next/link";

import ComingSoon from "./ComingSoon";
import { isUnderConstruction, serviceColumns } from "./content";

export const metadata: Metadata = {
  title: "Nos Services | Holiday Geek Cup",
  description:
    "Découvrez bientôt les services d'Holiday Geek Cup pour les collectivités et les joueurs.",
  robots: { index: false },
};

export default function NosServicesPage() {
  return (
    <ComingSoon title="Nos services">
      {serviceColumns.length > 0 && (
        <section className="px-4 pb-24">
          <div className="container mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
            {serviceColumns.map((column) => (
              <div
                key={column.title}
                className="rounded-2xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-sm"
              >
                <h2 className="font-goldman text-2xl text-white uppercase mb-4">
                  {column.title}
                </h2>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.href} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <Link
                        href={link.href}
                        className="font-rajdhani text-lg text-gray-300 transition-colors hover:text-theme"
                      >
                        {link.label}
                      </Link>
                      {isUnderConstruction(link.href) && (
                        <span className="inline-flex items-center rounded-full border border-theme/40 bg-theme/10 px-2.5 py-0.5 font-rajdhani text-xs font-bold uppercase tracking-wider text-theme">
                          En construction
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </ComingSoon>
  );
}
