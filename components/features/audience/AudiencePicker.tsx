"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
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
 * Sélecteur de cible, affiché à la première visite de la page d'accueil.
 *
 * Deux principes de conception, tous deux dictés par le référencement :
 *
 *  1. Le choix est une **surcouche**, jamais un péage. Le contenu joueurs est
 *     rendu et indexable derrière lui ; les robots, qui n'ont pas de cookie,
 *     voient la page normalement.
 *  2. Sur mobile, c'est une **barre basse** et non une fenêtre plein écran.
 *     Google déclasse les interstitiels intrusifs qui masquent le contenu à
 *     l'arrivée, mais autorise explicitement les bandeaux occupant une part
 *     raisonnable de l'écran.
 *
 * Le cookie n’est lu que côté navigateur : la page d’accueil reste entièrement
 * statique, et le HTML servi ne contient jamais le sélecteur. Les visiteurs déjà
 * passés par ici sont, eux, redirigés en amont par `middleware.ts`.
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

const AudiencePicker = () => {
  const router = useRouter();
  const chosen = useSyncExternalStore(subscribe, readAudience, serverSnapshot);
  const [dismissed, setDismissed] = useState(false);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  const visible = chosen === null && !dismissed;

  const choose = useCallback(
    (audience: Audience) => {
      rememberAudience(audience);
      setDismissed(true);
      if (AUDIENCE_HOME[audience] !== "/") {
        router.push(AUDIENCE_HOME[audience]);
      }
    },
    [router],
  );

  /**
   * Fermer sans choisir revient à rester sur la page où l'on est déjà, donc à
   * choisir « joueurs ». On l'enregistre pour ne pas harceler le visiteur.
   */
  const dismiss = useCallback(() => {
    rememberAudience("joueurs");
    setDismissed(true);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKeyDown);

    // Le focus n'est déplacé que sur grand écran : sur mobile la barre basse
    // ne capture pas la navigation, la déplacer ferait sauter la page.
    if (window.matchMedia("(min-width: 640px)").matches) {
      firstOptionRef.current?.focus();
    }

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <>
      {/* Voile : desktop uniquement, pour ne pas masquer le contenu mobile. */}
      <div
        aria-hidden
        onClick={dismiss}
        className="hidden sm:block fixed inset-0 z-[100] bg-gray-950/80 backdrop-blur-sm animate-in fade-in duration-300"
      />

      <div
        role="dialog"
        aria-labelledby="audience-picker-title"
        aria-describedby="audience-picker-intro"
        className={cn(
          "fixed z-[101] bg-gray-900 border-theme",
          // Mobile : bandeau bas, non bloquant.
          "inset-x-0 bottom-0 border-t-2 p-5",
          // Desktop : fenêtre centrée.
          "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
          "sm:w-[min(46rem,calc(100vw-3rem))] sm:rounded-3xl sm:border-2 sm:p-10",
          "sm:shadow-2xl",
        )}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fermer et rester sur la version joueurs"
          className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors"
        >
          <LuX className="size-5" />
        </button>

        <div className="hidden sm:flex justify-center mb-6">
          <Image
            src="/assets/logos/logo-hgc.svg"
            alt=""
            width={120}
            height={60}
            className="h-12 w-auto"
          />
        </div>

        <h2
          id="audience-picker-title"
          className="font-goldman uppercase text-white text-lg sm:text-3xl text-center text-balance pr-8 sm:pr-0"
        >
          Vous venez pour quoi ?
        </h2>
        <p
          id="audience-picker-intro"
          className="hidden sm:block font-rajdhani text-gray-300 text-center mt-3 text-balance"
        >
          On adapte le site à ce qui vous intéresse. Vous pourrez changer d’avis
          à tout moment depuis le menu.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mt-5 sm:mt-8">
          {CHOICES.map(({ audience, title, tagline, Icon }, index) => (
            <button
              key={audience}
              ref={index === 0 ? firstOptionRef : undefined}
              type="button"
              onClick={() => choose(audience)}
              className={cn(
                "group flex items-center gap-4 rounded-2xl border-2 border-white/10 bg-gray-950/60",
                "p-4 sm:p-6 text-left cursor-pointer",
                "hover:border-theme hover:bg-theme/10 transition-all",
                "focus:outline-none focus-visible:border-theme focus-visible:ring-2 focus-visible:ring-theme",
                "sm:flex-col sm:items-center sm:text-center sm:gap-3",
              )}
            >
              <span className="shrink-0 flex items-center justify-center size-11 sm:size-16 rounded-full bg-linear-to-t from-theme to-theme/0 text-white">
                <Icon className="size-5 sm:size-7" />
              </span>
              <span className="min-w-0">
                <span className="block font-rajdhani font-bold uppercase text-white text-base sm:text-xl">
                  {title}
                </span>
                <span className="block font-rajdhani text-gray-400 text-sm mt-0.5 sm:mt-1 text-balance">
                  {tagline}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default AudiencePicker;
