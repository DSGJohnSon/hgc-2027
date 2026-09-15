# Reprise du projet sur une autre machine

> Rédigé le 31/08/2026, pour repartir de l'état exact du projet à cette date.
> Contexte : copie du dossier sur disque dur externe, machine d'arrivée vierge,
> sans Docker.

---

## L'essentiel en trois lignes

Copier le dossier suffit pour le **code**, les **médias** et la **configuration**.
Il manquera une seule chose, et c'est la plus importante : **la base de données**,
qui vit dans un volume Docker et ne sera pas du voyage. Elle s'exporte en un
fichier de 564 Ko, à faire **avant de débrancher**.

---

## 1. Avant de partir — sur la machine actuelle

### 1.1 Exporter la base de données ⚠️ à ne pas oublier

Tout le contenu du backoffice est là : 36 médias, 30 partenaires avec leurs logos,
10 événements, 2 séries, 8 services, les pages, ton compte et tes préférences
d'affichage. **Rien de tout ça n'est dans le dossier du projet.**

```bash
# Depuis la racine du projet, Docker démarré.
# MSYS_NO_PATHCONV=1 est indispensable sous Git Bash : sans lui, Windows
# réécrit « /tmp/... » en chemin Windows et mongodump échoue.
MSYS_NO_PATHCONV=1 docker exec hgc-mongo mongodump --db=hgc-website --archive=/tmp/hgc.archive --quiet
docker cp hgc-mongo:/tmp/hgc.archive ./hgc-website.archive
```

Tu obtiens `hgc-website.archive` (~564 Ko) à la racine. **Copie-le sur le disque
avec le reste.** Procédure testée dans les deux sens.

### 1.2 Ce qu'il ne faut PAS copier

Deux dossiers sont à exclure de la copie — ou à supprimer sur la machine
d'arrivée avant de réinstaller :

| Dossier | Pourquoi |
|---|---|
| `node_modules/` | 541 paquets, et surtout des **binaires natifs liés à la plateforme** — `@img/sharp-win32-x64`. Sur une autre machine, un autre OS ou une autre architecture, sharp casse. Or Payload en dépend pour toute image. |
| `.next/` | Cache de build, régénéré automatiquement. |

Tout le reste part : `media/` (tes 36 fichiers envoyés), `.env`, `data/`,
`public/`, le code.

### 1.3 Vérifier que `.env` est bien du voyage

Il est ignoré par git mais **présent dans le dossier**, donc copié. Il contient
`PAYLOAD_SECRET`, `DATABASE_URL`, la clé Resend et les clés Turnstile. Garde-le
identique : changer `PAYLOAD_SECRET` invaliderait les sessions ouvertes.

---

## 2. Sur la machine d'arrivée

### 2.1 Prérequis

- **Node.js 24** (la machine actuelle tourne en 24.18.0). Aucune version n'est
  épinglée dans `package.json` ; Node 20+ devrait passer, mais reste en 24 pour
  éviter les surprises.
- **Git** — facultatif ici puisque tu copies le dossier, mais utile pour committer.

### 2.2 Choisir une base MongoDB

C'est la seule vraie décision. Payload utilise des **transactions**, qui exigent
un *replica set* — une instance MongoDB isolée ne suffit pas. Trois voies :

#### Option A — MongoDB Atlas (recommandé si tu as du réseau)

Rien à installer, et c'est de toute façon la cible pour la production.

1. Créer un compte gratuit sur [mongodb.com/atlas](https://www.mongodb.com/atlas), cluster **M0** (gratuit).
2. Créer un utilisateur de base, et autoriser ton IP (ou `0.0.0.0/0` le temps des congés).
3. Récupérer la chaîne de connexion et la mettre dans `.env` :

```env
DATABASE_URL="mongodb+srv://<user>:<motdepasse>@<cluster>.mongodb.net/hgc-website?retryWrites=true&w=majority"
```

Atlas est nativement en replica set : rien de plus à faire.

**Réserve** : sans connexion internet, tu ne peux plus travailler du tout.

#### Option B — MongoDB Community en local (recommandé si le réseau est incertain)

Léger, fonctionne hors ligne, mais demande d'activer le replica set à la main.

1. Installer [MongoDB Community Server](https://www.mongodb.com/try/download/community) (installeur Windows, cocher « Install MongoDB as a Service »).
2. Installer aussi les [Database Tools](https://www.mongodb.com/try/download/database-tools) — ils fournissent `mongorestore`, nécessaire à l'import.
3. Activer le replica set : ouvrir `C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg` et ajouter

```yaml
replication:
  replSetName: rs0
```

4. Redémarrer le service MongoDB, puis l'initialiser une seule fois :

```bash
mongosh --eval "rs.initiate()"
```

5. Dans `.env` :

```env
DATABASE_URL="mongodb://localhost:27017/hgc-website?replicaSet=rs0&directConnection=true"
```

#### Option C — Docker Desktop

Reproduit à l'identique la machine actuelle : `docker/compose.yml` est déjà
configuré en replica set mono-nœud, et `npm run db:up` fait tout.

Installer [Docker Desktop](https://www.docker.com/products/docker-desktop/), puis :

```bash
npm run db:up
```

`DATABASE_URL` reste alors celle du `.env` actuel, sans modification.

**Réserve** : c'est lourd (~1 Go, WSL2 requis sous Windows) pour une petite machine.

> **Mon conseil** : Atlas si tu es sûr d'avoir du réseau — tu prépares la
> production par la même occasion. Sinon MongoDB Community, plus léger que Docker
> et utilisable dans l'avion.

### 2.3 Restaurer la base

**Avec Docker (option C)** :

```bash
npm run db:up
docker cp ./hgc-website.archive hgc-mongo:/tmp/hgc.archive
MSYS_NO_PATHCONV=1 docker exec hgc-mongo mongorestore --archive=/tmp/hgc.archive --quiet
```

**Avec MongoDB local ou Atlas (options A et B)** :

```bash
mongorestore --uri="<contenu de DATABASE_URL sans le nom de base>" --archive=./hgc-website.archive
```

Exemple en local : `mongorestore --uri="mongodb://localhost:27017/?replicaSet=rs0&directConnection=true" --archive=./hgc-website.archive`

### 2.4 Installer et démarrer

```bash
rm -rf node_modules .next      # si tu les as copiés malgré tout
npm install
npm run generate:types         # régénère payload-types.ts
npm run dev
```

Le site est sur http://localhost:3000, le backoffice sur http://localhost:3000/admin.

---

## 3. Vérifier que la reprise est complète

```bash
npm run audit:migration
```

Cet audit compare les fichiers `data/` au contenu de la base. **Résultat attendu :
6 écarts, tous sur `home-page.sections[0].data.slider.events`** — ce sont les
événements factices du carrousel d'accueil, volontairement non migrés (le
carrousel est alimenté par les vrais événements publiés). Tout autre écart signale
un problème de restauration.

Contrôles rapides côté backoffice :

- Référentiels → Partenaires : **30 fiches, toutes avec leur logo**
- Médias : **36 fichiers**, rangés dans tes dossiers
- Événements : **10**, en vue grille avec les vignettes
- Le tableau de bord affiche bien les cards et les raccourcis

Et côté code : `npx tsc --noEmit`, `npm run lint`, `npm run build`.

---

## 4. Si la base n'a pas pu être exportée

Solution de repli — tu récupères le contenu, **mais pas les médias**.

```bash
npm run create:admin -- --email=… --password=…
npm run seed
```

Le seed rejoue la migration depuis les fichiers `data/`. Il recrée les
événements, séries, actualités, jeux, catégories, les pages et les
**fiches partenaires** (noms et liens).

Ce qu'il **ne recrée pas**, par conception : les fichiers envoyés dans la
bibliothèque de médias, les logos rattachés aux partenaires, l'arborescence de
dossiers, les comptes et les préférences. Il faudrait tout renvoyer à la main.

> C'est pour ça que l'export de la base est le point le plus important de ce
> document.

---

## 5. Pièges connus

**`MSYS_NO_PATHCONV=1`** devant tout `docker exec` manipulant un chemin
absolu Unix, sous Git Bash. Sans lui : `Failed: open C:/Users/... no such file or directory`.

**La CLI Payload passe par tsx.** `npx payload …` échoue à résoudre les imports
relatifs de `payload.config.ts` sous Windows. Les scripts npm utilisent donc
`tsx node_modules/payload/bin.js … --disable-transpile`. Utilise `npm run payload`,
jamais `npx payload`.

**Premier seed et verrous Mongo.** À la toute première écriture, la construction
des index peut provoquer des `LockTimeout` transitoires. Les scripts gèrent
la reprise automatiquement (`withRetry`), mais si un import échoue, le relancer
suffit — il est rejouable.

---

## 6. État du projet à la date de rédaction

### Travail non commité

⚠️ **49 fichiers modifiés ou ajoutés, 0 commit d'avance sur `origin/dev`.**
L'intégralité du backoffice n'existe que dans ce dossier. La copie sur disque est
donc bien ta seule sauvegarde — pense à committer une fois installé.

### Trois sujets ouverts

**Le stockage des médias est local.** `BLOB_READ_WRITE_TOKEN` est vide dans
`.env`, donc le plugin Vercel Blob est désactivé et Payload écrit sur disque,
dans `media/` à la racine. **Ça ne fonctionnera pas en production** : le système
de fichiers de Vercel est en lecture seule et éphémère.

**`media/` n'est pas ignoré par git.** Mon entrée `.gitignore` vise
`/public/media/`, qui ne correspond à rien — le vrai dossier est `media/`, car
Payload utilise le slug de la collection comme dossier par défaut. En l'état,
`git add .` committerait 34 Mo de binaires. **À corriger avant le premier commit.**

**Conversion WebP en attente.** Mesurée sur tes 36 PNG : 17,7 Mo → 2,1 Mo, soit
**88 % de gain**. À activer via `formatOptions` sur l'upload **et sur chacune des
trois tailles** (Payload ne propage pas l'option aux déclinaisons). Les SVG ne
risquent rien : `canResizeImage` les exclut, ils ne passent jamais par sharp.

Ces trois points se rejoignent : si les images doivent être renvoyées pour partir
sur Blob, autant activer WebP avant, et ne le faire qu'une fois.

---

## 7. Repères dans le projet

| Fichier | Rôle |
|---|---|
| [docs/plan-backoffice.md](docs/plan-backoffice.md) | Décisions d'architecture, écarts, reste à faire |
| [README.md](README.md) | Section « Backoffice » : organisation, seed, mise en production |
| `payload.config.ts` | Collections, globals, vues custom, dossiers |
| `lib/content/` | Seul point d'entrée du site vers Payload |
| `scripts/seed/` | Migration `data/` → base, rejouable |
