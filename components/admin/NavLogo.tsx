import Link from 'next/link'
import type { ServerProps } from 'payload'

/**
 * Logo du site en tête du menu latéral de l'admin, qui ramène au tableau de bord.
 *
 * Injecté par `admin.components.beforeNavLinks` (payload.config.ts) : Payload le
 * rend au-dessus des liens du menu, sur toutes les vues qui affichent ce menu.
 */
export const NavLogo = ({ payload }: ServerProps) => (
  <Link className="hgc-nav-logo" href={payload.config.routes.admin} title="Tableau de bord">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img alt="Holiday Geek Cup" src="/assets/logos/logo-hgc.svg" />
  </Link>
)

export default NavLogo
