import { getGames } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { Game } from "@/types/games";
import Image from "next/image";
import { LuGamepad2 } from "react-icons/lu";

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  if (!game) return null;
  if (game.blockType === "block") {
    return (
      <div
        className="group relative rounded-2xl p-6 gap-4 transition-all duration-300 h-full border-2 border-white/10 box-border"
        style={{
          background:
            game.bgType === "gradient"
              ? `linear-gradient(to top, ${game.color1}, ${game.color2})`
              : game.color1,
        }}
      >
        {game.logo !== "" ? (
          <Image
            src={game.logo || "/assets/logos/default-game.svg"}
            alt={game.name}
            width={500}
            height={500}
            className={cn(
              "w-1/2 group-hover:w-[55%] transition-all duration-500 z-10",
              game.img && game.img !== ""
                ? "absolute top-1/2 -translate-y-1/2"
                : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            )}
          />
        ) : (
          <h4 className="font-rajdhani font-bold text-white text-xl uppercase tracking-wider text-center group-hover:text-white transition-colors">
            {game.name}
          </h4>
        )}

        {game.img && game.img !== "" && (
          <Image
            src={game.img}
            alt={game.name}
            width={500}
            height={500}
            className="w-[70%] group-hover:w-2/3 aspect-square object-contain rounded-xl absolute -top-1/4 -right-1/6 duration-500 z-50"
          />
        )}

        {game.bgImg && game.bgImg !== "" && (
          <Image
            src={game.bgImg}
            alt={`${game.name} background`}
            width={500}
            height={500}
            className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
          />
        )}
      </div>
    );
  }

  return (
    <div className="group relative bg-gray-900/40 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-white/20 transition-all duration-300 backdrop-blur-sm overflow-hidden h-full">
      <div
        className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: game.color1 || "var(--theme-color)" }}
      />

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
        <LuGamepad2
          className="w-8 h-8"
          style={{ color: game.color1 || "var(--theme-color)" }}
        />
      </div>

      <h4 className="font-rajdhani font-bold text-white text-xl uppercase tracking-wider text-center group-hover:text-white transition-colors">
        {game.name}
      </h4>
    </div>
  );
};

interface GameCardByIdProps {
  /**
   * Identifiant du jeu, c'est-à-dire le `slug` de la collection Payload — le
   * même que celui exposé par `getGames()`.
   */
  id: string;
  /** Rendu de repli quand aucun jeu ne porte cet identifiant. */
  fallback?: React.ReactNode;
}

/**
 * Variante autonome de `GameCard` : va chercher le jeu dans Payload à partir de
 * son seul identifiant, plutôt que de recevoir l'objet déjà résolu.
 *
 * C'est un Server Component — il doit être rendu depuis une page ou une section
 * serveur. Depuis un composant client, passer par `GameCard` avec le jeu chargé
 * en amont. La lecture est mutualisée par le cache de `getGames()`, afficher
 * plusieurs cartes ne déclenche donc qu'un seul accès à la base.
 */
export const GameCardById = async ({
  id,
  fallback = null,
}: GameCardByIdProps) => {
  const games = await getGames();
  const game = games.find((g) => g.id === id);

  if (!game) return <>{fallback}</>;

  return <GameCard game={game} />;
};
