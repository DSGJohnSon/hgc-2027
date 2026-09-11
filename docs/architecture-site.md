# Architecture du site HGC — Notes de contexte

> Fichier de travail rédigé au démarrage du projet « Ajout Nouveaux Services ».
> But : documenter le fonctionnement du site existant pour guider les développements.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (config via `@theme` dans `app/(my-app)/globals.css`)
- **Payload CMS 3** (MongoDB) présent dans le repo (`app/(payload)/`, `payload.config.ts`) mais **le contenu du site public n'est PAS servi par Payload** : il est codé en dur dans des fichiers TS/JSON sous `data/`.
- Hébergement **Vercel**. Storage blob Vercel configuré côté Payload.
- Animations : framer-motion / motion, gsap, embla/swiper (carrousels), tsparticles.
- Icônes : `react-icons` (préfixes `Lu` = lucide, `Fa` = font-awesome) + `lucide-react`.

## Organisation des routes (App Router)

Deux groupes de routes :
- `app/(my-app)/` → **site public**
- `app/(payload)/` → admin + API Payload (`/admin`, `/api/...`)

Pages publiques existantes :
| Route | Fichier |
|---|---|
| `/` | `app/(my-app)/page.tsx` |
| `/a-propos` | `app/(my-app)/a-propos/page.tsx` |
| `/evenements` | `app/(my-app)/evenements/page.tsx` (client, filtres) |
| `/evenements/[id]` | détail événement OU série (polymorphe) |
| `/evenements/[id]/[dateId]` | étape d'une série |
| `/contact` | formulaire **statique** (voir §Formulaires) |
| `/reglement`, `/documents`, `/mentions-legales` | pages contenu |

## Le pattern « données = objet TS » (à répliquer pour les Services)

C'est le pattern que le client apprécie et qu'on veut réutiliser.

### Source de vérité
- `types/pages/detail-event.ts` → type central `Event` (union discriminée sur les blocs `description`).
- `data/events.ts` → `export const events: Event[]` : un tableau d'objets, un objet = un événement, avec un `id` slug.
- `data/event-series.ts` (`types/event-series.ts`) → variante « série » : un objet parent + un tableau `dates[]` d'étapes qui surchargent les champs.

### Rendu
- La page `evenements/[id]/page.tsx` fait un `find(e => e.id === id)` sur le tableau, détecte série vs événement simple (**polymorphisme par lookup**, série prioritaire), et sinon `notFound()`.
- Le contenu riche est un tableau `description[]` de **blocs typés** rendus par `EventInfo.tsx` :
  - `{ type: "text", content: [{type:"title"|"paragraph"|"list"|"citation", ...}] }`
  - `{ type: "statistics", content: StatisticsData }` → composant `Statistics`
  - `{ type: "gallery", content: GalleryData }` → composant `Gallery`
  - → **Ce système de blocs est directement réutilisable pour les pages Services.**
- Helpers dans `lib/eventUtils.ts` : `prepareEvents`, `prepareEventSeries`, `mergeSeriesAndEvents` (calcul isPast/isOngoing/isUpcoming + tri + jointure catégories/jeux).
- Référentiels annexes : `data/games.json`, `data/categories.json` (résolus par id).

### SEO
- `generateMetadata` par page détail (titre + description dérivés de l'objet).
- `app/sitemap.ts` génère les URLs statiques + une URL par événement (mappe `eventsData`). **À étendre pour les services.**

## Navigation / Header

- Config du menu : `data/pages/official/header.json` (clé `menu[]`, items `{label, href, submenu?[]}`).
- Type : `MenuItemData` dans `types/index.ts`.
- Rendu desktop : `components/layout/Header/MainMenu.tsx` → dropdown **simple** (sous-menu vertical au survol, récursif). **Ce n'est pas un méga-menu 2 colonnes** → à créer pour « Nos Services ».
- Rendu mobile : `components/layout/Header/MobileMenu.tsx`.
- Le header consomme `header.json` dans `components/layout/Header/index.tsx`.

## Formulaires (état actuel = point de vigilance)

- **Aucun backend d'envoi de mail n'existe.** `app/(my-app)/contact/page.tsx` est un `<form>` **statique** sans `onSubmit` ni action serveur ; les autres pages n'ont que des liens `mailto:`.
- Aucune route API custom (seule `app/(payload)/api/[...slug]` = Payload).
- → Le cahier des charges demande : formulaire de contact BtoB (avec champ « Projet concerné » pré-rempli) + formulaire générique, tous deux « envoient un mail à l'association ». **Il faut donc mettre en place un mécanisme d'envoi (Server Action / route API + service mail type Resend, ou service tiers).** Décision produit à acter.

## Widgets tiers (réservation)

- **Weezevent** (billetterie événements) : le code embed HTML est stocké dans le champ `weezeventCode` de chaque event, injecté via `WeezeventDialogProvider` / `WeezeventDialog.tsx`. Pattern « embed HTML stocké dans la donnée ».
- Pour les Services BtoC, le cahier demande **HelloAsso** : même logique (stocker le code embed / lien HelloAsso dans l'objet service).

## Design system (repères)

- Couleurs thème (globals.css) : `--theme-color: #6240cf` (violet, classe `text-theme`/`bg-theme`), `--theme-color2: #8b5cf6` (`theme2`). Chaque event porte aussi une `color` d'accent propre.
- Polices : titres `font-goldman`, corps `font-rajdhani`.
- Fonds sombres récurrents : `bg-gray-950`, cartes `bg-gray-900/50 border border-white/10 rounded-2xl backdrop-blur-sm`.
- Composants réutilisables utiles : `components/ui/Button.tsx`, `components/sections/FeatureGrid`, `Statistics`, `Gallery`, `Partners`, `CTASection`, `components/ui/card.tsx`.

## Modèle de contenu des Services (confirmé par cahier des charges + plaquette)

### Structure d'une page service **BtoB** (template commun, tirée de la plaquette)
Séquence de sections récurrente pour les 4 projets phares (Gaming House Tour, Summer Tour, Tournois Majeurs, Conférences) :
1. **Hero** : badge « service », titre, logo dédié, accroche, couleur d'accent propre.
2. **Description** courte.
3. **Chiffres clés** (1–2 stat tiles, ex. « 600+ participants/an », « 4+ sessions/an », mention « objectif 2026 »).
4. **Objectifs** (liste à puces).
5. **Répartition par âge** (bar chart 8-16 / 16-25 / 25+ en %). → *nouveau type de bloc*
6. **Format** (liste).
7. **Partage des rôles** : « La ville apporte » vs « HGC apporte » (2 colonnes de listes). → *nouveau type de bloc*
8. **Le petit plus** (encadré callout, ex. éligibilité QPV / prise en charge). → *nouveau type de bloc*
9. **Recap photo** (galerie — bloc existant) + éventuellement recap communication.
10. Variante **Conférences** : bloc « Nos intervenants » (personnes : photo, nom, rôle, LinkedIn) + « Thématiques abordées » (cards à icônes). → *nouveaux blocs / réutiliser FeatureGrid*
11. **Formulaire de demande d'infos** en fin de page (champ « Projet concerné » pré-rempli).

⚠️ **Cité Éducative** et **Espace Social Gaming Emploi** ne figurent PAS dans la plaquette (qui ne détaille que 4 projets phares). Contenu à fournir/valider par le client ; la rédaction de contenu hors plaquette est **hors périmètre** (§4.5 du cahier).

### Structure d'une page service **BtoC** (tableau explicite du cahier)
- **Pathé Games Birthday** : Hero (titre+logo+accroche) · Description combo image/texte · « L'offre comprend » (liste) · Infos pratiques / chiffres clés (public 6-25 ans, 10 à 24 jeunes, **25€/enfant**, sessions personnalisables) · Jeux disponibles (galerie de logos) · **Réservation = widget HelloAsso**.
- **Gaming Room** : Hero · Description (2 options : dans nos espaces / livraison à domicile) · « Notre équipement » (galerie/liste : PC fixe, PC portable, écrans, consoles, manettes, caméras…) · Infos pratiques · **Réservation = widget HelloAsso**.

### Page hub `/nos-services` (wireframe du cahier)
Titre + accroche → **2 cards d'orientation** (Collectivités / Particuliers) → section « Organisations & Projets — BtoB » (grille de 6 cards) → séparateur visuel → section « Privatisation & Location — BtoC » (2 grandes cards avec CTA « Réserver (HelloAsso) »). Le tri par profil **ne bloque jamais** le retour au choix.

### Contraintes projet (cahier §3.4 / §4.3)
Avant tout dev, le **client** doit fournir : logos officiels PNG transparent de chaque service, photos recap HD, code/lien embed HelloAsso (Pathé Games Birthday + Gaming Room), validation des textes plaquette. Aucun dev initié avant réception. Forfait **360 € TTC**, mise en prod cible indicative **27/06/2026**.

## Implications pour le projet « Nos Services » (résumé)

1. Créer `types/pages/service.ts` + `data/services.ts` (tableau d'objets `Service`, id slug, cible `btob`/`btoc`, blocs `description[]` réutilisant le système existant).
2. Routes `app/(my-app)/nos-services/page.tsx` (hub) + `nos-services/[slug]/page.tsx` (détail polymorphe BtoB/BtoC selon `target`).
3. Nouveau composant **méga-menu 2 colonnes** + entrée dans `header.json`.
4. **Formulaire BtoB** (Server Action + service mail) — brique nouvelle à créer.
5. **Embed HelloAsso** stocké dans l'objet service (pages BtoC), rendu comme le pattern Weezevent.
6. Étendre `sitemap.ts`.
</content>
</invoke>
