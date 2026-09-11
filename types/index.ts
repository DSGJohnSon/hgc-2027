export interface LinkItem {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ImageData {
  src: string;
  alt: string;
}

// Header Types
export interface MegaMenuColumn {
  title: string;
  /**
   * Nom de l'icône Lucide (ex. "Landmark"), et non le composant lui-même : la
   * donnée vient de la base et doit rester sérialisable pour traverser la
   * frontière serveur → client. La résolution se fait dans
   * `components/layout/Header/megaIcons.ts`.
   */
  icon?: string;
  links: LinkItem[];
}

export interface MenuItemData {
  label: string;
  href: string;
  submenu?: MenuItemData[];
  /** Méga-menu multi-colonnes (ex. "Nos Services" : BtoB / BtoC). */
  mega?: MegaMenuColumn[];
}

export interface TopBarData {
  notice: string;
  socialLinks: SocialLink[];
}

export interface HeaderData {
  logo: ImageData;
  topBar: TopBarData;
  menu: MenuItemData[];
}

export interface FooterWidgetData {
  title: string;
  links: LinkItem[];
}

export interface FooterData {
  logo: ImageData;
  about: string;
  socialLinks: SocialLink[];
  widgets: FooterWidgetData[];
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
  };
}
