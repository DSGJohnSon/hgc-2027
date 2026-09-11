import { notFound } from "next/navigation";

import { getGames } from "@/lib/content";
import { GameCard } from "@/app/(my-app)/evenements/[id]/components/FreeplaySection";

/**
 * Rendu isolé d'une seule `GameCard`, à destination de l'`<iframe>` d'aperçu
 * dans le backoffice (collection Jeux). Voir `app/(embed)/layout.tsx`.
 */

export default async function GameCardEmbedPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const games = await getGames();
  const game = games.find((g) => g.id === slug);

  if (!game) notFound();

  // `getGames()` renvoie l'URL absolue construite par Payload (`serverURL` +
  // chemin). `GameCard` utilise next/image, qui charge mal cette forme dans
  // ce contexte embarqué — on ne garde que le chemin, toujours valide.
  const toPath = (url: string | undefined) => {
    if (!url) return url;
    try {
      return new URL(url, "http://localhost").pathname;
    } catch {
      return url;
    }
  };
  game.logo = toPath(game.logo);
  game.img = toPath(game.img);
  game.bgImg = toPath(game.bgImg);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <GameCard game={game} />
    </div>
  );
}
