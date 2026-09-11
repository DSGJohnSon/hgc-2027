// ============================================================
// PAGE « À PROPOS »
//
// Contenu figé, extrait du backoffice Payload (global « about »)
// le 2026-09-11, au moment où la gestion de
// cette page a été retirée du CMS. Modifier directement ce fichier.
// ============================================================

/** Forme historique des sections : `switch (section.type)` dans la page. */
export type PageSection = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: any;
};

export const aboutSections: PageSection[] = [
  {
    "type": "aboutHero",
    "data": {
      "id": "intro",
      "title": "Holiday Geek Cup, LA COMPÉTITION et LE JEU VIDÉO POUR TOUS",
      "paragraphs": [
        "Holiday Geek Cup est une structure associative qui a pour but d’organiser divers événements autour du jeux vidéo et de l’esport en général. Grâce à un catalogue de services, elle collabore avec les municipalités et des partenaires pour mettre en place des événements centrés sur l'esport. En parallèle, elle développe ses propres initiatives, bénéficiant du soutien financier à la fois des institutions publiques telles que l'État, les régions, et des départements, ainsi que de ses propres ressources."
      ],
      "backgroundImage": "/assets/img/heros/hero-a_propos.webp"
    }
  },
  {
    "type": "simpleSection",
    "data": {
      "id": "notre-equipe",
      "title": "notre équipe",
      "paragraphs": [
        "L'équipe d'Holiday Geek Cup est composée de bénévoles passionnés par le jeu vidéo et l'esport. Nous sommes tous bénévoles et nous travaillons ensemble pour offrir à tous les jeunes, sans distinction, l'accès à la culture de l'esport de manière gratuite."
      ],
      "image": {
        "src": "/assets/img/sections/team_holiday_geek_cup.png",
        "alt": "L'Esport pour tous HGC",
        "position": "right"
      },
      "ctas": []
    }
  },
  {
    "type": "textSection",
    "data": {
      "subtitle": "NOS VALEURS",
      "title": "OFFRIR LA CULTURE E-SPORT À TOUS",
      "paragraphs": [
        "Les valeurs fondamentales de notre organisation reposent sur la volonté d'offrir à tous les jeunes, sans distinction, l'accès à la culture de l'esport de manière gratuite. Notre objectif est de réduire les inégalités en matière de connaissances et de pratiques liées à cette culture, à ce sport et au monde numérique.",
        "Cette démarche vise à créer des opportunités équitables pour tous les passionnés de jeux vidéo et d'esport, favorisant ainsi un environnement où chacun peut s'épanouir."
      ],
      "alignment": "center"
    }
  },
  {
    "type": "featureGrid",
    "data": {
      "subtitle": "NOS THÉMATIQUES",
      "title": "DES PROJETS QUI TOUCHENT TOUT LE MONDE",
      "cards": [
        {
          "title": "CITOYENNETÉ",
          "icon": "🤝",
          "description": "Engagement citoyen et vie associative."
        },
        {
          "title": "ÉGALITÉ",
          "icon": "⚖️",
          "description": "Égalité des genres et des chances pour tous."
        },
        {
          "title": "INCLUSION",
          "icon": "💻",
          "description": "Inclusion numérique dans nos territoires."
        },
        {
          "title": "LIEN SOCIAL",
          "icon": "🧶",
          "description": "Mixité sociale et nouveaux liens."
        },
        {
          "title": "HANDICAP",
          "icon": "♿",
          "description": "Accessibilité et inclusion physique."
        },
        {
          "title": "MOBILITÉ",
          "icon": "🚌",
          "description": "Aide au déplacement vers nos événements."
        }
      ]
    }
  },
  {
    "type": "simpleSection",
    "data": {
      "id": "esport-pour-tous",
      "subtitle": "NOTRE MISSION",
      "title": "L'ESPORT POUR TOUS !",
      "paragraphs": [
        "HGC est une association loi 1901 organisatrice d'événements de jeux vidéo pour les jeunes et le grand public. L'objectif est de permettre à TOUS d'accéder à la scène esportive amateur avec aucune limite.",
        "Qu'on soit joueur pro ou débutant, tout le monde peut s'inscrire à nos tournois et/ou événements. Nous mettons en avant la pratique du jeu vidéo pour permettre à tous d'y accéder GRATUITEMENT."
      ],
      "image": {
        "src": "/assets/img/placeholders/cinema.png",
        "alt": "L'Esport pour tous HGC",
        "position": "right"
      },
      "ctas": []
    }
  },
  {
    "type": "featureGrid",
    "data": {
      "subtitle": "PROBLÉMATIQUES",
      "title": "🤔 LES ENJEUX QUE NOUS CIBLONS",
      "columns": 2,
      "cards": [
        {
          "title": "Accès universel",
          "description": "Comment permettre à tous les jeunes d'avoir accès au jeux vidéo ?"
        },
        {
          "title": "Pauvreté culturelle",
          "description": "Comment supprimer la pauvreté culturelle ?"
        },
        {
          "title": "Barrières physiques/financières",
          "description": "Comment faire quand les jeunes ne peuvent pas venir aux événements ?"
        },
        {
          "title": "Bienveillance et mixité",
          "description": "Comment rassembler les jeunes de quartiers ensemble dans la bienveillance ?"
        }
      ]
    }
  },
  {
    "type": "trophyCarousel",
    "data": {
      "title": "NOS RÉCOMPENSES ET CHIFFRES CLÉS",
      "subtitle": "Découvrez l'impact de nos événements à travers la France.",
      "images": [
        "/assets/img/trophies/300-people.png",
        "/assets/img/trophies/350-people.png",
        "/assets/img/trophies/500-people.png",
        "/assets/img/trophies/600-people.png",
        "/assets/img/trophies/4000-people.png",
        "/assets/img/trophies/5500-people.png",
        "/assets/img/trophies/8000-people.png",
        "/assets/img/trophies/10000-people.png",
        "/assets/img/trophies/11600-people.png"
      ]
    }
  },
  {
    "type": "textSection",
    "data": {
      "title": "UNE PRÉSENCE SUR TOUS LES TERRITOIRES",
      "paragraphs": [
        "Nous essayons d'organiser le plus grand nombre possible d'événements sur les territoires, qu'ils soient petits ou plus importants ponctuellement. De plus, nous travaillons sur la pérennité de nos actions à travers des projets au sein de l'initiative Holiday Geek Cup (Mario Kart SERIES, Gaming House Tour, SUMMER TOUR, etc.).",
        "À ce jour, HGC a organisé plus de soixante événements gratuits dans l'ensemble du Pas-de-Calais, en collaboration avec des partenaires tels que le musée du Louvre Lens, le Cinéma Pathé de Liévin, et même jusqu'à Paris à la Cité des Sciences.",
        "Grâce à des subventions, nous avons la possibilité d'acheter du matériel gaming pour le mettre à disposition de nos publics. Cela nous permet d'organiser différents espaces de jeu pour tous les âges ainsi que des petits tournois."
      ],
      "alignment": "center"
    }
  },
  {
    "type": "simpleSection",
    "data": {
      "id": "wealth-social",
      "subtitle": "ASPECT SOCIAL",
      "title": "LA RICHESSE NE GARANTIT NI LE BONHEUR NI LA JOIE",
      "paragraphs": [
        "Notre objectif est de permettre à tous les jeunes, quelle que soit leur classe sociale, de jouer, de s'amuser, de remporter des cadeaux, et de démontrer que l'esport n'est pas une culture réservée aux 'riches'.",
        "Nous souhaitons montrer que même avec peu de moyens, on peut passer un bon moment."
      ],
      "image": {
        "src": "/assets/img/placeholders/5.webp",
        "alt": "Impact social HGC",
        "position": "left"
      },
      "ctas": []
    }
  },
  {
    "type": "simpleSection",
    "data": {
      "id": "mobility-transport",
      "subtitle": "FACILITER L'ACCÈS",
      "title": "DES TRANSPORTS POUR TOUS",
      "paragraphs": [
        "Pour les jeunes qui ne peuvent pas se rendre à nos événements en raison de contraintes financières, HGC a collaboré avec le réseau Tadao pour proposer des tickets de bus gratuits.",
        "Dans les mois à venir, nous travaillerons avec la SNCF Hauts de France pour offrir des billets de train à prix réduit vers nos événements.",
        "Pour ceux qui ne peuvent vraiment pas se déplacer, nous rediffusons nos plus grands événements en direct."
      ],
      "image": {
        "src": "/assets/img/placeholders/7.webp",
        "alt": "Transports et accessibilité",
        "position": "right"
      },
      "ctas": []
    }
  },
  {
    "type": "featureGrid",
    "data": {
      "subtitle": "PARTENAIRES SENSIBILISATION",
      "title": "ÉDUCATION ET PROTECTION",
      "columns": 2,
      "cards": [
        {
          "title": "PédaGoJeux",
          "description": "Holiday Geek Cup est également ambassadeur de l'association PédaGoJeux, PédaGoJeux est un collectif créé en 2008 avec une ambition : informer et sensibiliser les parents sur le jeu vidéo pour, in fine, créer les conditions d’une expérience positive et sereine du jeu vidéo au sein de la famille. PédaGoJeux aborde toutes les facettes du jeu vidéo en présentant ses atouts mais aussi les sujets sensibles, sans angélisme, ni diabolisation.",
          "logo": "/assets/logos/partners/logo-pedagojeux.png"
        },
        {
          "title": "Unicef",
          "description": "Holiday Geek Cup a également collaboré avec l'Unicef, concernant le droit des enfant et aujourd'hui nous sensibilisons et informons grâce au supports de communication de l'Unicef que l'on peut retrouver dans l'intégralité des nos événements quelconques, HGC a investi des moyens financiers pour mettre en place cette campagne de sensibilisation.",
          "logo": "/assets/logos/partners/logo_unicef.svg"
        }
      ]
    }
  },
  {
    "type": "partners",
    "data": {
      "subtitle": "NOS PARTENAIRES",
      "title": "ILS NOUS FONT CONFIANCE",
      "logos": [
        {
          "alt": "ANCT (Agence Nationale de la Cohésion des Territoires)",
          "src": "http://localhost:3000/api/media/file/logo_anct-1.png"
        },
        {
          "alt": "Département du Pas de Calais (62)",
          "src": "http://localhost:3000/api/media/file/logo_pas-de-calais-1.png"
        },
        {
          "alt": "Erazer",
          "src": "http://localhost:3000/api/media/file/logo_erazer-1.png"
        },
        {
          "alt": "Ville de Lens",
          "src": "http://localhost:3000/api/media/file/logo_ville-lens-1.png"
        },
        {
          "alt": "Pathé",
          "src": "http://localhost:3000/api/media/file/logo_pathe-1.png"
        },
        {
          "alt": "Polar Lens",
          "src": "http://localhost:3000/api/media/file/logo_polar-lens-1.png"
        },
        {
          "alt": "Préfecture du Pas de Calais",
          "src": "http://localhost:3000/api/media/file/logo_prefecture-pas-de-calais-1.png"
        },
        {
          "alt": "RNJA (Réseau National des Juniors Associations)",
          "src": "http://localhost:3000/api/media/file/logo_rnja-1.png"
        },
        {
          "alt": "ESS France (Économie Sociale et Solidaire)",
          "src": "http://localhost:3000/api/media/file/logo_ess-france-1.png"
        },
        {
          "alt": "Agrément JEP (Jeunesse d'Éducation Populaire)",
          "src": "http://localhost:3000/api/media/file/logo_agrement-jep-1.png"
        },
        {
          "alt": "La Voix du Nord",
          "src": "http://localhost:3000/api/media/file/logo_voix-du-nord-1.png"
        }
      ]
    }
  }
];

export const aboutSeo: { title?: string; description?: string } = {};
