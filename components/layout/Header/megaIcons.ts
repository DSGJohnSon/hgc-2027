import {
  CalendarDays,
  Gamepad2,
  Landmark,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Icônes disponibles pour les colonnes du méga-menu.
 *
 * Le backoffice ne stocke que le nom de l'icône : un composant React ne peut pas
 * être sérialisé et donc pas voyager depuis la base. Cette table fait la
 * correspondance au moment du rendu.
 *
 * Les clés doivent rester alignées sur les options du champ `icon` de
 * `components/layout/Header/content.ts`.
 */
const MEGA_ICONS: Record<string, LucideIcon> = {
  Landmark,
  Users,
  Gamepad2,
  CalendarDays,
  Trophy,
  Sparkles,
};

export const getMegaIcon = (name?: string): LucideIcon | undefined =>
  name ? MEGA_ICONS[name] : undefined;
