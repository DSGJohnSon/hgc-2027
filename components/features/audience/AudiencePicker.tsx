"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { LuGamepad2, LuLandmark, LuX } from "react-icons/lu";

import { cn } from "@/lib/utils";
import {
  AUDIENCE_HOME,
  rememberAudience,
  readAudience,
  type Audience,
} from "@/lib/audience";

/**
 * Sélecteur de cible, affiché à la première visite de l'une des deux pages
 * d'accueil, et rouvrable à la demande (bouton de version dans le header, via
 * `AudiencePickerProvider`).
 *
 * Le choix est une **surcouche**, jamais un péage : le contenu de la page est
 * rendu et indexable derrière lui, et les robots, qui n'ont pas de cookie, voient
 * la page normalement. Sur mobile, le sélecteur occupe tout l'écran pour être
 * l'élément principal tant qu'il est ouvert ; sur desktop, c'est une fenêtre
 * centrée sur un voile.
 *
 * Le cookie n’est lu que côté navigateur : les pages d’accueil restent
 * entièrement statiques, et le HTML servi ne contient jamais le sélecteur
 * (`forcedOpen` démarre à `false` et ne bascule qu'après une interaction).
 * Les visiteurs déjà passés par ici sont, eux, redirigés en amont par
 * `middleware.ts`.
 */

type Choice = {
  audience: Audience;
  title: string;
  tagline: string;
  Icon: typeof LuGamepad2;
};

const CHOICES: Choice[] = [
  {
    audience: "joueurs",
    title: "Je suis joueur",
    tagline: "Tournois, événements près de chez moi et communauté.",
    Icon: LuGamepad2,
  },
  {
    audience: "collectivites",
    title: "Je représente une collectivité",
    tagline: "Animer mon territoire avec des événements gaming clés en main.",
    Icon: LuLandmark,
  },
];

/**
 * Le cookie est lu via `useSyncExternalStore` plutôt que dans un effet : côté
 * serveur l’instantané vaut « joueurs », donc le sélecteur n’est jamais rendu
 * dans le HTML statique, et côté navigateur la vraie valeur est connue dès le
 * premier rendu. Pas de `setState` en cascade, pas de clignotement.
 */
const subscribe = () => () => {};
const serverSnapshot = (): Audience | null => "joueurs";

interface AudiencePickerProps {
  /** Forcé à `true` par `AudiencePickerProvider` (bouton de version du header). */
  forcedOpen?: boolean;
  onForcedClose?: () => void;
}

const AudiencePicker = ({ forcedOpen = false, onForcedClose }: AudiencePickerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const chosen = useSyncExternalStore(subscribe, readAudience, serverSnapshot);
  const [dismissed, setDismissed] = useState(false);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  const isHomePage =
    pathname === AUDIENCE_HOME.joueurs || pathname === AUDIENCE_HOME.collectivites;
  const visible = forcedOpen || (isHomePage && chosen === null && !dismissed);
  const stayAudience: Audience =
    pathname === AUDIENCE_HOME.collectivites ? "collectivites" : "joueurs";

  const choose = useCallback(
    (audience: Audience) => {
      rememberAudience(audience);
      setDismissed(true);
      onForcedClose?.();
      if (AUDIENCE_HOME[audience] !== pathname) {
        router.push(AUDIENCE_HOME[audience]);
      }
    },
    [router, pathname, onForcedClose],
  );

  /**
   * Fermer sans choisir revient à rester sur la page où l'on est déjà, donc à
   * garder l'audience qu'elle représente. On l'enregistre pour ne pas
   * harceler le visiteur.
   */
  const dismiss = useCallback(() => {
    rememberAudience(stayAudience);
    setDismissed(true);
    onForcedClose?.();
  }, [stayAudience, onForcedClose]);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKeyDown);

    // La page derrière ne doit pas défiler tant que le sélecteur est ouvert.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    firstOptionRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <>
      {/* Voile : desktop uniquement, le sélecteur couvre déjà tout l'écran sur mobile. */}
      <div
        aria-hidden
        onClick={dismiss}
        className="hidden sm:block fixed inset-0 z-[100] bg-gray-950/80 backdrop-blur-sm animate-in fade-in duration-300"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="audience-picker-title"
        aria-describedby="audience-picker-intro"
        className={cn(
          "fixed z-[101] border-theme animate-in fade-in duration-300",
          // Mobile : plein écran semi-transparent, contenu centré et défilable si l'écran est trop court.
          "inset-0 flex flex-col overflow-y-auto overscroll-contain px-5 py-16",
          "bg-gray-950/99 sm:bg-gray-900",
          // Desktop : fenêtre centrée.
          "sm:block sm:overflow-visible sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
          "sm:w-[min(46rem,calc(100vw-3rem))] sm:rounded-3xl sm:border-2 sm:p-10",
          "sm:shadow-2xl",
        )}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label={`Fermer et rester sur la version ${
            stayAudience === "collectivites" ? "collectivités" : "joueurs"
          }`}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 p-2 sm:p-0 text-gray-500 hover:text-white transition-colors"
        >
          <LuX className="size-6 sm:size-5" />
        </button>

        <div className="my-auto w-full max-w-md mx-auto sm:max-w-none">
          <div className="flex justify-center mb-8 sm:mb-6">
            <Image
              src="/assets/logos/logo-hgc.svg"
              alt=""
              width={120}
              height={60}
              className="h-14 sm:h-12 w-auto"
            />
          </div>

          <h2
            id="audience-picker-title"
            className="font-goldman uppercase text-white text-2xl sm:text-3xl text-center text-balance"
          >
            Vous venez pour quoi ?
          </h2>
          <p
            id="audience-picker-intro"
            className="font-rajdhani text-gray-300 text-center mt-3 text-balance"
          >
            On adapte le site à ce qui vous intéresse. Vous pourrez changer d’avis
            à tout moment depuis le menu.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8">
            {CHOICES.map(({ audience, title, tagline, Icon }, index) => (
              <button
                key={audience}
                ref={index === 0 ? firstOptionRef : undefined}
                type="button"
                onClick={() => choose(audience)}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl border-2 border-white/10 bg-gray-950/60",
                  "p-5 sm:p-6 text-left cursor-pointer",
                  "hover:border-theme hover:bg-theme/10 transition-all",
                  "focus:outline-none focus-visible:border-theme focus-visible:ring-2 focus-visible:ring-theme",
                  "sm:flex-col sm:items-center sm:text-center sm:gap-3",
                )}
              >
                <span className="shrink-0 flex items-center justify-center size-14 sm:size-16 rounded-full bg-linear-to-t from-theme to-theme/0 text-white">
                  <Icon className="size-6 sm:size-7" />
                </span>
                <span className="min-w-0">
                  <span className="block font-rajdhani font-bold uppercase text-white text-lg sm:text-xl">
                    {title}
                  </span>
                  <span className="block font-rajdhani text-gray-400 text-sm mt-1 text-balance">
                    {tagline}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AudiencePicker;
