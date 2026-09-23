import { notFound } from "next/navigation";

import { getGames } from "@/lib/content";
import { toLocalMediaPath } from "@/lib/media-url";
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

  // `GameCard` utilise next/image. Une image servie par l'application est
  // ramenée à son chemin ; une image du CDN Blob garde son URL absolue, dont
  // l'hôte est déclaré dans `images.remotePatterns`.
  const toPath = (url: string | undefined) =>
    url ? toLocalMediaPath(url) : url;

  game.logo = toPath(game.logo);
  game.img = toPath(game.img);
  game.bgImg = toPath(game.bgImg);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <GameCard game={game} />
    </div>
  );
}
