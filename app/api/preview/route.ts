import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { getPayloadClient } from "@/lib/payload";

/**
 * Point d'entrée du bouton « Aperçu » du backoffice (`admin.preview` des
 * collections). Active le mode brouillon de Next.js puis redirige vers la
 * page publique, qui bascule alors sur une lecture non mise en cache et
 * incluant le contenu non publié (voir `lib/content/index.ts`).
 *
 * Le jeton protège contre un déclenchement par un visiteur quelconque — il
 * n'a pas vocation à rester secret vis-à-vis des personnes déjà authentifiées
 * dans le backoffice, qui le voient de toute façon dans le lien du bouton.
 */

/**
 * Adresse publique d'un document, brouillon compris.
 *
 * On part de l'identifiant plutôt que du slug : l'adresse d'une étape dépend
 * de sa série (`/evenements/<série>/<étape>`), et un même slug d'étape peut
 * exister dans plusieurs séries.
 */
const resolvePath = async (collection: string, id: string): Promise<string | undefined> => {
  const payload = await getPayloadClient();

  if (collection === "event-series") {
    const series = await payload.findByID({
      collection: "event-series",
      id,
      draft: true,
      depth: 0,
      disableErrors: true,
    });
    return series?.slug ? `/evenements/${series.slug}` : undefined;
  }

  if (collection === "events") {
    const event = await payload.findByID({
      collection: "events",
      id,
      draft: true,
      depth: 1,
      disableErrors: true,
    });
    if (!event?.slug) return undefined;
    const seriesSlug =
      event.series && typeof event.series === "object" ? event.series.slug : undefined;
    return seriesSlug ? `/evenements/${seriesSlug}/${event.slug}` : `/evenements/${event.slug}`;
  }

  return undefined;
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const id = searchParams.get("id");
  const collection = searchParams.get("collection");

  if (!process.env.PAYLOAD_PREVIEW_SECRET || secret !== process.env.PAYLOAD_PREVIEW_SECRET) {
    return new Response("Jeton d’aperçu invalide.", { status: 401 });
  }

  const path = id && collection ? await resolvePath(collection, id) : undefined;
  if (!path) {
    return new Response("Paramètres d’aperçu invalides.", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(path);
}
