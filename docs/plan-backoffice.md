# Plan — Backoffice administrateur (Payload CMS)

> Objectif : permettre à l'association HGC de modifier les textes et les images du site
> sans passer par le code ni par un redéploiement.
> Ce document décrit le chantier ; l'état d'avancement est en fin de fichier.

## 1. Point de départ

Payload CMS 3 est **déjà installé et branché** dans le repo :

- `withPayload()` dans `next.config.ts`
- routes `app/(payload)/admin` + `app/(payload)/api/[...slug]`
- `payload.config.ts` : MongoDB, Lexical, i18n FR, logo custom, plugin Vercel Blob

…mais `collections: []` — aucun modèle de contenu n'est défini, l'admin est une coquille vide.

Le contenu réel vit en dur dans `data/` (~4 100 lignes TS/JSON), importé **statiquement** :

```ts
import { events } from "@/data/events";
import homePageData from "@/data/pages/official/home-page.json";
```

Le chantier n'est donc pas « créer un backoffice » mais **faire passer le contenu des
fichiers vers la base, sans casser le typage ni le rendu**.

## 2. Principe directeur — Payload comme miroir de `data/`

Le pattern actuel « objet TS + `description[]` de blocs typés » est isomorphe au système
de **Blocks** de Payload. Chaque variante de l'union devient un Block portant **le même
`slug` que le `type` actuel** :

| `data/` aujourd'hui | Payload |
|---|---|
| `{ type: "text", content: [...] }` | Block `text` |
| `{ type: "statistics", content: StatisticsData }` | Block `statistics` |
| `{ type: "gallery", content: GalleryData }` | Block `gallery` |
| `imageText`, `ageDistribution`, `roleSplit`, `highlight`, `speakers`, `themes`, `games`, `equipment` | 1 Block chacun |

Payload sérialise en `{ blockType: "text", ... }` → un mapper renomme `blockType` en `type`
et **les composants de rendu existants ne changent pas** (`EventInfo.tsx`, templates services,
sections de la home…). C'est ce qui rend la migration soutenable.

### Découpage

**Collections** (listes) : `users`, `media`, `games`, `categories`, `actualites`,
`events`, `event-series`, `services`

**Globals** (contenu unique) : `header`, `footer`, `home-page`, `about`, `documents`,
`contact`, `tournament-detail`

## 3. Couche d'accès — `lib/content/`

~30 fichiers importent `@/data/*` directement. Plutôt que de les réécrire vers des requêtes
Payload, on introduit `lib/content/` qui **expose les mêmes formes de données qu'aujourd'hui** :

```ts
export async function getEvents(): Promise<Event[]> {
  const payload = await getPayloadClient()          // Local API, pas de HTTP
  const { docs } = await payload.find({ collection: "events", limit: 1000 })
  return docs.map(toEvent)                          // → type Event de types/, inchangé
}
```

Conséquences :

- les types de `types/` restent le **contrat** ; les types générés par Payload
  (`payload-types.ts`) restent cantonnés aux mappers → le risque est isolé dans un dossier ;
- `lib/eventUtils.ts` devient `async`, sa logique ne change pas ;
- migration **page par page**, les deux systèmes coexistent pendant la transition.

## 4. Fraîcheur du contenu

Pas d'ISR à durée fixe : **cache par tags + invalidation à la publication**.

- lectures enveloppées dans `unstable_cache` avec un tag par collection ;
- hook `afterChange` / `afterDelete` sur chaque collection et global → `revalidateTag()`.

→ le client publie dans `/admin`, le site est à jour en quelques secondes, sans rebuild,
et les pages restent statiques le reste du temps.

## 5. Images

**Décision** : les 312 Mo d'images déjà référencées dans `data/` restent dans `public/assets`
tant qu'un import n'est pas lancé — elles sont versionnées et servies par le CDN Vercel.
La collection `media` reçoit les images **nouvelles ou modifiées** par le client.

- `media` en collection upload, tailles générées par `sharp` (déjà installé) ;
- storage : Vercel Blob **si `BLOB_READ_WRITE_TOKEN` est présent**, sinon disque local
  (permet de développer sans compte Blob) ;
- `scripts/seed-media.ts` importe les fichiers de `public/assets` référencés par le contenu,
  de façon **idempotente** et filtrable (`--only=events/`) pour étaler l'upload ;
- ajouter le domaine Blob aux `remotePatterns` de `next.config.ts`.

## 6. Ordre de migration

| Étape | Contenu | Pourquoi là |
|---|---|---|
| 0 | `users`, `media`, accès admin FR, 1er compte | socle, aucun impact sur le site |
| 1 | Globals `header`, `footer`, `home-page`, `about`, `documents`, `contact` | JSON plats, conversion mécanique, gain visible immédiatement |
| 2 | `games`, `categories` | petits référentiels résolus par id |
| 3 | `actualites` | valide le pattern collection + blocs de texte |
| 4 | `events`, `event-series` | le gros morceau (blocs, dates, Weezevent, transports) |
| 5 | `services` BtoB / BtoC | en dernier : chantier « Nos Services » en cours |

Chaque étape a un `scripts/seed-*.ts` qui **lit le fichier `data/` existant** et l'insère via
la Local API → aucune ressaisie. Les fichiers `data/` restent dans le repo comme source de
secours jusqu'à validation client.

## 7. Décisions actées

- **Drafts + versions** activés dès l'étape 1 (`versions: { drafts: true }`) : le client
  prévisualise avant publication, on évite les publications accidentelles.
- **Rôles** : `admin` (dev) / `editeur` (association). L'inscription publique est fermée.
- **Admin en français** : labels, `useAsTitle`, `admin.description` sur les champs sensibles,
  regroupement par onglets — c'est ce qui rend l'admin utilisable sans accompagnement.
- Le formulaire de contact (Resend, `app/api/contact/route.ts`) n'est pas concerné.
- Alternative écartée : CMS git-based (Tina/Decap). Payload est déjà installé et configuré,
  changer maintenant serait du travail jeté.

## 8. À provisionner (hors code)

| Élément | Où | Note |
|---|---|---|
| `DATABASE_URL` | MongoDB Atlas (free tier suffisant) | + IP allowlist Vercel |
| `PAYLOAD_SECRET` | Vercel env | chaîne aléatoire longue |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob | requis seulement pour les uploads client |
| Sauvegardes | Atlas | qui possède le compte ? |

En local : `docker compose -f docker/compose.yml up -d` démarre un MongoDB de développement.

## 9. Avancement

- [x] Étape 0 — socle (users, media, admin FR, MongoDB local via Docker)
- [x] Étape 1 — globals éditoriaux (en-tête, pied de page, accueil, à propos, contact, documents)
- [x] Étape 2 — référentiels (37 jeux, 3 catégories)
- [x] Étape 3 — actualités
- [x] Étape 4 — événements (10) et séries (2)
- [x] Étape 5 — services (6 BtoB, 2 BtoC)
- [x] Câblage du site public sur `lib/content/` (toutes les pages)
- [x] Invalidation du cache à la publication
- [x] Build de production vérifié

## 10. Écarts par rapport au plan initial

- **Page contact** : sa mise en page est écrite en dur dans le code, et
  `data/pages/contact.json` n'était plus utilisé par la page. Plutôt qu'un éditeur de
  sections sans effet visible, le global n'expose que le titre et l'accroche
  réellement affichés, plus les métadonnées de référencement.

- **Icônes du méga-menu** : elles étaient des composants Lucide importés dans
  `data/pages/official/header.ts`. Une donnée en base ne peut pas transporter de
  composant React — il ne franchirait pas la frontière serveur → client. Elles sont
  désormais désignées par leur nom, résolu au rendu par
  `components/layout/Header/megaIcons.ts`.

- **`prepareEvents` / `prepareEventSeries`** prennent un paramètre `refs`
  (jeux + catégories). Ces référentiels venaient d'imports statiques ; ils viennent
  maintenant de la base et se lisent donc de façon asynchrone, ce qui interdit de les
  résoudre depuis le module lui-même.

- **Composants client** : la page `/evenements`, l'en-tête, `EventCarousel` et
  `FreeplaySection` lisaient les données par import direct. Ils reçoivent désormais
  ces données en props depuis un composant serveur, qui est seul à interroger Payload.

## 11. Reste à faire (hors code)

- Provisionner MongoDB Atlas, puis renseigner `DATABASE_URL`, `PAYLOAD_SECRET` et
  `PAYLOAD_SERVER_URL` sur Vercel — `DATABASE_URL` est aussi nécessaire au build.
- Créer un jeton Vercel Blob (`BLOB_READ_WRITE_TOKEN`) pour les images envoyées
  depuis le backoffice.
- Créer le compte de l'association (rôle `editeur`) depuis `/admin`.
- Faire valider le contenu migré par l'association, puis archiver les fichiers `data/`.

## 12. Anomalie de contenu repérée

`data/event-series.ts` (étape « lilliers ») référence le jeu `fc_26`, alors que le
référentiel définit `fc26`. La référence était déjà ignorée avant la migration : le jeu
ne s'affiche pas sur cette étape, ni avant ni après. À corriger depuis le backoffice si
c'est bien une faute de frappe.

Sans lien avec la migration : `components/sections/Partners/index.tsx` utilise deux fois
la même clé React (`desktop-logo-row1-${index}`) pour deux boucles sœurs, ce qui produit
un avertissement en développement.
