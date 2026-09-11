# Plan d'implémentation — Section « Nos Services »

> À valider avant écriture du code. Basé sur le cahier des charges + la plaquette 2026.
> Principe directeur : **réutiliser le pattern events** (données en objets TS typés + blocs de contenu) et les composants existants (`Statistics`, `Gallery`, `Partners`, `FreeplaySection`, `Button`).

---

## 0. Décisions actées

- Données **BtoB et BtoC séparées** (2 types + 2 fichiers de données).
- **Couleur d'accent par service** (champ `color`, comme les events).
- Envoi de mail via **Resend + Server Action**.
- Contenu réel des **4 projets plaquette** dispo ; **Cité Éducative** + **Espace Social Gaming Emploi** = placeholders (contenu client à venir, hors périmètre rédaction).

---

## 1. Modèle de données

### 1.1 Blocs partagés — `types/pages/service-blocks.ts`
Union de blocs de contenu, réutilisée par BtoB et BtoC. Reprend les blocs events + nouveaux blocs.

| Bloc | Réutilise l'existant ? | Usage |
|---|---|---|
| `text` (`title`/`paragraph`/`list`/`citation`) | ✅ identique aux events | Objectifs, Format, descriptions |
| `statistics` (`StatisticsData`) | ✅ composant `Statistics` | Chiffres clés |
| `gallery` (`GalleryData`) | ✅ composant `Gallery` | Recap photo |
| `imageText` | 🆕 | Combo image/texte (BtoC surtout) |
| `ageDistribution` | 🆕 | Bar chart 8-16 / 16-25 / 25+ |
| `roleSplit` | 🆕 | « La ville apporte » vs « HGC apporte » |
| `highlight` | 🆕 | Encadré « Le petit plus » |
| `speakers` | 🆕 | Intervenants (Conférences) |
| `themes` | 🆕 (ou réutilise `FeatureGrid`) | Thématiques à icônes (Conférences) |
| `games` | ✅ ids → `games.json` + `FreeplaySection` | Jeux disponibles (BtoC) |
| `equipment` | 🆕 (liste/galerie) | « Notre équipement » (Gaming Room) |

Types nouveaux (esquisse) :
```ts
export type AgeBucket = { label: string; percent: number };
export type RoleSplitBlock = { cityTitle?: string; cityItems: string[]; hgcTitle?: string; hgcItems: string[] };
export type Speaker = { name: string; role: string; photo?: string; linkedin?: string };
export type ImageTextBlock = { title?: string; text: string[]; image: string; imageAlt: string; reverse?: boolean };
```

### 1.2 BtoB — `types/pages/service-btob.ts` + `data/services-btob.ts`
```ts
export type ServiceBtoB = {
  id: string;                 // slug (ex. "gaming-house-tour")
  target: "btob";
  title: string;
  tagline?: string;           // accroche hero
  logo?: string;              // logo PNG dédié
  color: string;              // couleur d'accent
  cardThumbnail: string;      // vignette pour le hub
  heroBanner: string;
  heroBannerMobile: string;
  shortDescription: string;   // card + <meta>
  stats?: ServiceStat[];      // chiffres clés (rendu via Statistics)
  content: ServiceBlock[];    // séquence de sections
  formProjectLabel?: string;  // valeur "Projet concerné" (défaut = title)
};
export const servicesBtoB: ServiceBtoB[] = [ /* 6 objets */ ];
export default servicesBtoB;
```
Contenu initial : GHT, Summer Tour, Tournois Majeurs, Conférences (réels, extraits plaquette) + Cité Éducative & Espace Social Gaming Emploi (placeholders `isDraft: true`).

### 1.3 BtoC — `types/pages/service-btoc.ts` + `data/services-btoc.ts`
```ts
export type ServiceBtoC = {
  id: string;                 // "pathe-games-birthday" | "gaming-room"
  target: "btoc";
  title: string;
  tagline?: string;
  logo?: string;
  color: string;
  cardThumbnail: string;
  heroBanner: string;
  heroBannerMobile: string;
  shortDescription: string;
  content: ServiceBlock[];    // imageText, offre/équipement, games, chiffres clés
  helloAssoEmbed?: string;    // code embed HelloAsso (pattern weezeventCode)
};
```

---

## 2. Routing — `app/(my-app)/nos-services/`

- `page.tsx` → **Hub** (server component). Charge les 2 tableaux, rend : titre + 2 cards d'orientation + grille BtoB (6) + séparateur + section BtoC (2). Tri par profil via `?profil=collectivites|particuliers` (server) ou state client léger — **le retour reste toujours possible**.
- `[slug]/page.tsx` → **détail polymorphe** :
  1. `find` dans `servicesBtoB` → template BtoB.
  2. sinon `find` dans `servicesBtoC` → template BtoC.
  3. sinon `notFound()`.
  - `generateStaticParams()` : union des ids des 2 tableaux.
  - `generateMetadata()` : titre + `shortDescription`.

---

## 3. Composants nouveaux — `components/sections/services/`

- `ServiceHub/` : `ProfileOrientationCards`, `ServiceCardB2B`, `ServiceCardB2C`.
- `templates/ServiceB2BTemplate.tsx` et `templates/ServiceB2CTemplate.tsx` (analogues à `EventInfo` : bouclent sur `content[]` et dispatchent chaque bloc).
- Blocs : `RoleSplit.tsx`, `AgeDistribution.tsx`, `Highlight.tsx`, `Speakers.tsx`, `ImageText.tsx`, `Equipment.tsx` (+ réutilisation `Statistics`, `Gallery`, `FreeplaySection`, `Partners`).
- `ServiceInquiryForm.tsx` (client) : formulaire BtoB, champ caché « Projet concerné » = `formProjectLabel ?? title`, honeypot anti-spam, états succès/erreur.
- `HelloAssoWidget.tsx` : rend l'embed HelloAsso (dangerouslySetInnerHTML + chargement script, comme `WeezeventDialog`).

Réutilisés tels quels : `components/ui/Button`, `card`, `Statistics`, `Gallery`, `Partners`, `FreeplaySection`.

---

## 4. Navigation — méga-menu 2 colonnes

- Étendre `MenuItemData` (`types/index.ts`) avec une variante optionnelle :
  ```ts
  mega?: { columns: { title: string; links: LinkItem[] }[] };
  ```
- `data/pages/official/header.json` : ajouter l'entrée « NOS SERVICES » (`href: /nos-services`) avec `mega` = 2 colonnes (Organisations & Projets / Privatisation & Location).
- `MainMenu.tsx` : détecter `item.mega` → rendre un panneau large 2 colonnes (au lieu du dropdown vertical simple). `MobileMenu.tsx` : rendu accordéon des 2 colonnes.
- `app/sitemap.ts` : ajouter `/nos-services` + une URL par service (union des 2 tableaux).

---

## 5. Envoi de mail (Resend + Server Action)

- Dépendance : `npm i resend` (⚠️ nécessite un **compte Resend + clé API** côté client, et un **domaine expéditeur vérifié**).
- `app/actions/sendServiceInquiry.ts` : `"use server"`, validation des champs, honeypot, appel `resend.emails.send({ from, to, subject, ... })`. `subject` inclut « Projet concerné ».
- Env (Vercel) : `RESEND_API_KEY`, `SERVICE_MAIL_TO` (mail asso), `SERVICE_MAIL_FROM` (domaine vérifié).
- Bonus (optionnel, non chiffré) : rebrancher `/contact` (aujourd'hui statique) sur la même brique.

---

## 6. Phasage (≈ 10 j ouvrés)

| # | Lot | Dépendances |
|---|---|---|
| 1 | Types (`service-blocks`, `service-btob`, `service-btoc`) + données 4 projets réels + placeholders | — |
| 2 | Composants blocs + templates B2B / B2C | Lot 1 |
| 3 | Page hub + tri par profil | Lot 2 |
| 4 | Méga-menu (header.json + MainMenu + MobileMenu) + sitemap | Lot 2 |
| 5 | Formulaire BtoB + Server Action Resend | clé API client |
| 6 | Widgets HelloAsso (2 pages BtoC) | embeds client |
| 7 | Recette + 1 cycle de corrections | tout |

**Bloquant client (cahier §4.3)** : logos PNG transparents, photos recap HD, embeds HelloAsso, validation des textes. Les lots 1→4 peuvent démarrer avec des assets placeholders ; 5 et 6 dépendent d'éléments client.

---

## 7. Points ouverts à trancher plus tard

- Placement exact de l'entrée « Nos Services » dans l'ordre du menu.
- Cité Éducative / Espace Social Gaming Emploi : afficher en « bientôt disponible » ou attendre le contenu ?
- HelloAsso : widget inline dans la page, ou modale (comme Weezevent) ?
- Réutiliser `games.json` pour « Jeux disponibles » BtoC (recommandé) vs liste ad hoc.
</content>
