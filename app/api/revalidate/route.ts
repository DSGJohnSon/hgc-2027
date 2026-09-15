import { NextRequest } from "next/server";

import { CACHE_TAGS, safeRevalidate } from "@/payload/hooks/revalidate";

/**
 * Invalide le cache du site public à la demande.
 *
 * Les modifications faites dans le backoffice invalident le cache d'elles-mêmes
 * (hooks de `payload/hooks/revalidate.ts`). Les scripts — seed, migrations —
 * écrivent en revanche via la Local API, hors du processus Next : le site
 * continue alors de servir l'ancien contenu. Ce point d'entrée permet de le
 * rafraîchir après coup :
 *
 *   curl -X POST "<site>/api/revalidate?secret=<PAYLOAD_PREVIEW_SECRET>"              tout
 *   curl -X POST "<site>/api/revalidate?secret=<PAYLOAD_PREVIEW_SECRET>&tag=events"   un tag
 *
 * Même jeton que l'aperçu : il ne sert qu'à écarter les visiteurs quelconques.
 */

const KNOWN_TAGS: string[] = Object.values(CACHE_TAGS);

export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");

  if (!process.env.PAYLOAD_PREVIEW_SECRET || secret !== process.env.PAYLOAD_PREVIEW_SECRET) {
    return Response.json({ ok: false, error: "Jeton invalide." }, { status: 401 });
  }

  const tag = searchParams.get("tag");
  if (tag && !KNOWN_TAGS.includes(tag)) {
    return Response.json(
      { ok: false, error: `Tag inconnu. Tags disponibles : ${KNOWN_TAGS.join(", ")}.` },
      { status: 400 },
    );
  }

  const tags = tag ? [tag] : KNOWN_TAGS;
  tags.forEach(safeRevalidate);

  return Response.json({ ok: true, revalidated: tags });
}
