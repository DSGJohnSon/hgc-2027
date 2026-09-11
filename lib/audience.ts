/**
 * Cible éditoriale du visiteur.
 *
 * Le site a deux pages d'accueil : les joueurs (cible principale, servie à la
 * racine `/`) et les collectivités (`/collectivites`). Le choix est mémorisé
 * dans un cookie pour ne demander qu'une seule fois.
 *
 * Ce cookie est une simple préférence d'affichage : il ne contient aucune donnée
 * personnelle et n'est pas utilisé à des fins de mesure ou de publicité. Il
 * relève donc des cookies strictement nécessaires au service demandé et ne
 * requiert pas de consentement préalable (CNIL, délibération n° 2020-091).
 */

export const AUDIENCE_COOKIE = "hgc-audience";

export type Audience = "joueurs" | "collectivites";

/** Un an — la préférence n'a pas vocation à être redemandée souvent. */
export const AUDIENCE_MAX_AGE = 60 * 60 * 24 * 365;

/** Page d'accueil correspondant à chaque cible. */
export const AUDIENCE_HOME: Record<Audience, string> = {
  joueurs: "/",
  collectivites: "/collectivites",
};

export const isAudience = (value: unknown): value is Audience =>
  value === "joueurs" || value === "collectivites";

/**
 * Écrit la préférence côté navigateur.
 *
 * Volontairement lisible par le JavaScript (pas de `HttpOnly`) : c'est le
 * composant client qui l'écrit, et le middleware n'a besoin que de la lire.
 */
export const rememberAudience = (audience: Audience) => {
  document.cookie = `${AUDIENCE_COOKIE}=${audience}; path=/; max-age=${AUDIENCE_MAX_AGE}; SameSite=Lax`;
};

/** Lit la préférence côté navigateur, `null` si le visiteur n'a jamais choisi. */
export const readAudience = (): Audience | null => {
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${AUDIENCE_COOKIE}=([^;]*)`),
  );
  const value = match?.[1];
  return isAudience(value) ? value : null;
};
