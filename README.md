This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 📬 Formulaire de contact

Le formulaire de la page `/contact` envoie les messages par email via [Resend](https://resend.com) :

1. **Notification** à `contact@holidaygeekcup.fr` avec les détails du message (le *Reply-To* est réglé sur l'adresse du visiteur : répondre au mail répond directement à la personne).
2. **Confirmation** automatique envoyée au visiteur.

### Architecture

- `app/api/contact/route.ts` — route API : validation, anti-bots, envoi des emails
- `lib/contactEmails.ts` — templates HTML des deux emails
- `components/sections/ContactForm/` — formulaire client + widget Turnstile

### Protection anti-bots (2 couches)

**Couche 1 — invisible, toujours active :**
- *Honeypot* : champ caché que seuls les bots remplissent → rejet silencieux
- *Délai minimum* : soumission en moins de 2 s → rejet
- *Rate limiting* : max 3 envois par IP sur 10 minutes
- Validation stricte côté serveur

**Couche 2 — Cloudflare Turnstile (optionnelle) :**
Widget de vérification humaine, activé automatiquement dès que les clés
`NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` sont présentes.
Sans les clés, le formulaire fonctionne avec la couche 1 seule.

### Variables d'environnement

Voir `.env.example`. À configurer en local (`.env.local`) **et** sur Vercel
(Settings > Environment Variables) :

| Variable | Obligatoire | Rôle |
|---|---|---|
| `RESEND_API_KEY` | ✅ | Clé API Resend (sans elle, aucun email ne part) |
| `CONTACT_TO_EMAIL` | non | Destinataire (défaut : contact@holidaygeekcup.fr) |
| `CONTACT_FROM_EMAIL` | non | Expéditeur (défaut : Holiday Geek Cup <contact@holidaygeekcup.fr>) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | non | Clé publique Turnstile (active le widget) |
| `TURNSTILE_SECRET_KEY` | non | Clé secrète Turnstile (vérification serveur) |

### Mise en place — Resend (≈ 15 min)

1. Créer un compte sur [resend.com](https://resend.com) (gratuit, 3 000 emails/mois).
2. Menu **Domains** > **Add Domain** > `holidaygeekcup.fr`.
3. Resend affiche des enregistrements DNS (DKIM, SPF, Return-Path) : les ajouter
   chez le registrar du domaine, puis attendre la vérification (statut *Verified*).
4. Menu **API Keys** > créer une clé > la mettre dans `RESEND_API_KEY` sur Vercel.
5. Redéployer le site.

> ⚠️ Tant que le domaine n'est pas vérifié, Resend refuse d'envoyer depuis
> `contact@holidaygeekcup.fr` — le formulaire affichera une erreur d'envoi.

### Mise en place — Turnstile (≈ 10 min)

1. Créer un compte gratuit sur [dash.cloudflare.com](https://dash.cloudflare.com)
   (pas besoin d'y migrer le domaine ni le DNS).
2. Menu **Turnstile** > **Add Widget** > mode *Managed*, avec **deux domaines** :
   `holidaygeekcup.fr` **et** `localhost` (sinon erreur `110200` en dev local).
3. Récupérer la **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   et la **Secret Key** → `TURNSTILE_SECRET_KEY` sur Vercel.
4. Redéployer : le widget apparaît dans le formulaire.

Pour tester en local sans compte, Cloudflare fournit des clés de test :
`1x00000000000000000000AA` (site, passe toujours) / `1x0000000000000000000000000000000AA` (secret).

---

## 🗂️ Backoffice (Payload CMS)

Le contenu du site — textes, images, événements, menus — se modifie depuis
`/admin`, sans passer par le code ni par un redéploiement.

### Démarrage en local

```bash
npm run db:up          # MongoDB de développement (Docker)
npm run dev            # site + backoffice sur http://localhost:3000
```

Première installation, dans l'ordre :

```bash
cp .env.example .env             # puis renseigner PAYLOAD_SECRET et DATABASE_URL
npm run db:up
npm run create:admin -- --email=… --password=…
npm run seed                     # importe le contenu de data/ dans la base
```

### Organisation

| Dossier | Rôle |
|---|---|
| `payload.config.ts` | configuration : collections, globals, base, stockage |
| `payload/collections/` | contenus en liste (événements, séries, actualités, jeux, catégories, médias, comptes) |
| `payload/globals/` | contenus uniques (accueil, à propos, contact, documents, en-tête, pied de page) |
| `payload/blocks/` | blocs de contenu réutilisables, miroir des types de `types/` |
| `payload/fields/` | champs partagés (image, slug, transports…) |
| `lib/content/` | **seul point d'entrée du site vers Payload** — renvoie les formes déclarées dans `types/` |
| `scripts/seed/` | import du contenu des fichiers `data/` vers la base |

### Comment le contenu arrive sur le site

Les composants de rendu n'ont pas changé : `lib/content/` renvoie exactement les mêmes
objets que les anciens fichiers `data/`. Toute la connaissance du format Payload est
concentrée dans `lib/content/mappers/`.

Les lectures sont mises en cache par tag. À chaque publication dans le backoffice, un
hook `afterChange` invalide le tag concerné : le site est à jour en quelques secondes,
sans redéploiement, et reste servi depuis le cache le reste du temps.

### Images

Les images historiques restent dans `public/assets` et sont référencées par leur chemin.
Le champ image du backoffice accepte les deux : un fichier envoyé (stocké sur Vercel Blob)
prend le pas sur le chemin d'origine. La migration se fait donc image par image, au fil
des modifications du client — aucun ré-upload massif n'est nécessaire.

### Migration du contenu

```bash
npm run seed                       # tout
npm run seed -- --only=events      # une étape
```

Étapes : `referentials`, `globals`, `actualites`, `events`.
Le script est **rejouable** : il met à jour les documents existants (identifiés par leur
slug) au lieu de les dupliquer. Les fichiers `data/` restent dans le repo comme source de
secours tant que le contenu migré n'a pas été validé.

### Mise en production

| Variable | Où | Note |
|---|---|---|
| `DATABASE_URL` | Vercel | MongoDB Atlas — penser à autoriser les IP Vercel |
| `PAYLOAD_SECRET` | Vercel | chaîne aléatoire longue |
| `BLOB_READ_WRITE_TOKEN` | Vercel | requis pour les images envoyées depuis le backoffice |
| `PAYLOAD_SERVER_URL` | Vercel | `https://holidaygeekcup.fr` |

`DATABASE_URL` est également nécessaire **au build** : le sitemap lit la liste des
événements dans la base.

Voir `docs/plan-backoffice.md` pour les décisions d'architecture.
