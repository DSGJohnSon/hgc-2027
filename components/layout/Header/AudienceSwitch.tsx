"use client";

import { usePathname } from "next/navigation";
import { LuArrowLeftRight } from "react-icons/lu";

import { cn } from "@/lib/utils";
import { AUDIENCE_HOME, type Audience } from "@/lib/audience";
import { useAudiencePicker } from "@/components/providers/AudiencePickerProvider";

/**
 * Affiche la version du site actuellement consultée et rouvre la popup de
 * sélection (`AudiencePicker`) pour en changer.
 *
 * Uniquement affiché sur l'une des deux pages d'accueil : ailleurs, la notion
 * de "version affichée" n'a pas de sens, ces pages étant communes aux deux
 * publics.
 */
const LABELS: Record<Audience, string> = {
  joueurs: "Version Joueurs",
  collectivites: "Version Collectivités",
};

const AudienceSwitch = ({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();
  const { openPicker } = useAudiencePicker();

  const isJoueurs = pathname === AUDIENCE_HOME.joueurs;
  const isCollectivites = pathname === AUDIENCE_HOME.collectivites;

  if (!isJoueurs && !isCollectivites) return null;

  const current: Audience = isCollectivites ? "collectivites" : "joueurs";

  return (
    <button
      type="button"
      onClick={() => {
        openPicker();
        onNavigate?.();
      }}
      aria-label="Changer la version du site"
      className={cn(
        "flex items-center gap-2 text-theme font-rajdhani font-semibold text-xs uppercase tracking-wider transition-colors hover:text-white",
        className,
      )}
    >
      {LABELS[current]}
      <LuArrowLeftRight className="size-3.5 shrink-0" aria-hidden />
    </button>
  );
};

export default AudienceSwitch;
