# Types centralisés - Event Management

## 📦 Architecture de centralisation

Tous les types liés aux événements sont maintenant centralisés dans `/types/pages/detail-event.ts`.

### Type principal : `Event`

Le type `Event` est la **source de vérité unique** pour tous les événements du site. Il contient toutes les propriétés nécessaires pour représenter un événement complet.

```typescript
import { Event } from "@/types/pages/detail-event";
```

**Propriétés principales :**
- `id`, `type`, `title` - Identifiants et informations de base
- `startDate`, `endDate`, `startTime` - Dates et horaires
- `cardThumbnail`, `heroBanner`, `heroBannerMobile` - Images
- `location`, `color` - Lieu et thème visuel
- `categoryId[]`, `gameId[]` - Relations avec catégories et jeux (arrays)
- `description[]` - Contenu riche (texte, galerie, statistiques)
- `transports`, `weezeventCode`, `partners`, `freeplayGames` - Métadonnées

### Types utilitaires dérivés

#### `EventCard`
Représentation simplifiée pour les carousels et listes d'événements.

**Utilisation :**
- `components/sections/EventCarousel/`
- `components/sections/Hero/`
- Pages de listing d'événements

```typescript
import { EventCard } from "@/types/pages/detail-event";
```

**Propriétés :**
- Hérite de : `id`, `type`, `title`, `startDate`, `startTime`, `cardThumbnail`, `color`
- Ajoute : `date` (string formatée), `time` (string formatée)
- Inclut : `categories[]`, `games[]` (avec objets enrichis)
- Options : `gradientTheme`, `buttonText`, `buttonLink`

#### `EventItem`
Version enrichie avec propriétés calculées pour les pages de filtrage.

**Utilisation :**
- `app/evenements/page.tsx`
- `components/features/events/EventItem.tsx`

```typescript
import { EventItem } from "@/types/pages/detail-event";
```

**Propriétés ajoutées :**
- `isOngoing` - Booléen indiquant si l'événement est en cours
- `isPast` - Booléen indiquant si l'événement est passé
- `categories[]` - Objets catégories complets (avec `name`, `color`)
- `games[]` - Objets jeux complets (avec `name`, `icon`, `color`)

#### `EventHero`
Données minimales pour le composant hero d'un événement.

**Utilisation :**
- `app/evenements/[id]/components/EventHero.tsx`

```typescript
import { EventHero } from "@/types/pages/detail-event";
```

**Propriétés :**
- Hérite de : `title`, `type`, `heroBanner`, `heroBannerMobile`, `color`
- Ajoute : `categoryName` (optionnel)

## 🎯 Bénéfices de la centralisation

1. **Single Source of Truth** : Un seul endroit pour définir la structure des événements
2. **Type Safety** : TypeScript garantit la cohérence dans toute l'application
3. **Facilité de maintenance** : Les modifications de structure se propagent automatiquement
4. **Préparation BDD** : Structure prête pour une migration vers une base de données
5. **Documentation intégrée** : Types auto-documentés avec commentaires JSDoc

## 💡 Utilisation recommandée

```typescript
// ✅ CORRECT - Import depuis le type centralisé
import { Event, EventCard, EventItem } from "@/types/pages/detail-event";

// ❌ INCORRECT - Ne pas redéfinir localement
interface MyEventType { ... }
```
