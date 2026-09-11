import { NextResponse, type NextRequest } from "next/server";

import { AUDIENCE_COOKIE } from "@/lib/audience";

/**
 * Aiguillage des visiteurs déjà passés par le sélecteur de cible.
 *
 * La racine `/` sert la page d'accueil **joueurs**, cible principale : c'est
 * l'URL qui concentre l'autorité du domaine, elle doit donc porter du contenu
 * réel et non une page de choix. Un visiteur ayant déclaré représenter une
 * collectivité est renvoyé vers sa version dès l'arrivée.
 *
 * Point important pour le référencement : les robots d'indexation n'ont pas de
 * cookie, ils ne sont donc **jamais** redirigés et voient `/` et
 * `/collectivites` telles quelles. La redirection est temporaire (307) car elle
 * dépend du visiteur et ne doit pas être mise en cache comme définitive.
 */
export function middleware(request: NextRequest) {
  const audience = request.cookies.get(AUDIENCE_COOKIE)?.value;

  if (audience === "collectivites") {
    const url = request.nextUrl.clone();
    url.pathname = "/collectivites";
    return NextResponse.redirect(url, 307);
  }

  return NextResponse.next();
}

export const config = {
  // La seule page à aiguiller est la racine. Tout le reste — y compris les
  // fichiers statiques, le backoffice et les routes d'API — est ignoré.
  matcher: "/",
};
