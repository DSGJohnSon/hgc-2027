import HeaderClient from "./HeaderClient";
import { headerData } from "./content";

/**
 * En-tête du site.
 *
 * La barre est interactive (état collant au scroll, menu mobile) : sa logique vit
 * donc dans `HeaderClient`. Le contenu du menu est figé dans `content.ts` — il
 * n'est plus géré depuis un backoffice.
 */
const Header = () => <HeaderClient headerData={headerData} />;

export default Header;
