import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

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

const PATH_BY_COLLECTION: Record<string, (slug: string) => string> = {
  events: (slug) => `/evenements/${slug}`,
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const collection = searchParams.get("collection");

  if (!process.env.PAYLOAD_PREVIEW_SECRET || secret !== process.env.PAYLOAD_PREVIEW_SECRET) {
    return new Response("Jeton d’aperçu invalide.", { status: 401 });
  }

  if (!slug || !collection || !(collection in PATH_BY_COLLECTION)) {
    return new Response("Paramètres d’aperçu invalides.", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(PATH_BY_COLLECTION[collection](slug));
}
