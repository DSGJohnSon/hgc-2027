"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { rememberAudience, type Audience } from "@/lib/audience";

/**
 * Bascule entre les deux versions du site.
 *
 * Sans elle, un visiteur qui se trompe au premier clic reste enfermé un an dans
 * la mauvaise version : le cookie le redirigerait à chaque retour. Cliquer ici
 * réécrit donc la préférence en même temps que l'on navigue.
 *
 * Ce sont de vrais liens `<a>` : les robots les suivent, ce qui relie les deux
 * pages d'accueil entre elles.
 */

const OPTIONS: Array<{ audience: Audience; href: string; label: string }> = [
  { audience: "joueurs", href: "/", label: "Joueurs" },
  { audience: "collectivites", href: "/collectivites", label: "Collectivités" },
];

const AudienceSwitch = ({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="group"
      aria-label="Version du site"
    >
      <span className="text-gray-500 font-rajdhani text-xs uppercase tracking-wider mr-1">
        Je suis
      </span>
      {OPTIONS.map(({ audience, href, label }) => {
        const isCurrent = pathname === href;
        return (
          <Link
            key={audience}
            href={href}
            aria-current={isCurrent ? "page" : undefined}
            onClick={() => {
              rememberAudience(audience);
              onNavigate?.();
            }}
            className={cn(
              "font-rajdhani text-xs uppercase tracking-wider px-2 py-1 rounded transition-colors",
              isCurrent
                ? "text-theme font-bold"
                : "text-gray-400 hover:text-white",
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
};

export default AudienceSwitch;
