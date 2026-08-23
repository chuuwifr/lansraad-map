import { SystemStar, SystemPlanet, SystemMoon, StarSystem } from '../types/landsraad';

/**
 * Complete Canonical Astronomical and Planetary System Data for the Dune Universe (Landsraad & Fiefdoms)
 * Based on Frank Herbert's Canon, the Dune Encyclopedia & the Official Dune Star Systems Map.
 * Provides all host stars / suns (single, binary, trinary), sequential planets (I, II, III, IV, V, VI, VII, VIII, IX...),
 * and their natural moons & orbital installations.
 */
export const CANONICAL_SYSTEM_ASTRONOMY: Record<string, { stars: SystemStar[]; planets: SystemPlanet[] }> = {
  // 1. CANOPUS // ARRAKIS (DUNE)
  arrakis: {
    stars: [
      {
        id: 'canopus-prime',
        name: 'Alpha Carinae (Canopus)',
        spectralClass: 'F0II',
        starType: 'Supergéante Blanche-Jaune',
        color: '#fffbeb',
        radius: 24,
        luminosity: 10700,
        isPrimary: true,
        description: 'La deuxième étoile la plus brillante du ciel nocturne depuis la Terre antique. Supergéante éclatante à la couronne dorée.'
      }
    ],
    planets: [
      {
        id: 'canopus-1',
        name: 'Canopus I (Vandals)',
        romanNumeral: 'I',
        classification: 'Monde Volcanique',
        orbitRadius: 42,
        orbitSpeed: 0.0036,
        rotationSpeed: 0.008,
        size: 7.2,
        color: '#78350f',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#b45309',
        distanceAU: 0.45,
        radiusKm: 4200,
        description: 'Monde tellurique calciné sous le feu continu de la supergéante Canopus.',
        moons: []
      },
      {
        id: 'canopus-2',
        name: 'Canopus II (Krem)',
        romanNumeral: 'II',
        classification: 'Monde Minier',
        orbitRadius: 64,
        orbitSpeed: 0.0025,
        rotationSpeed: 0.006,
        size: 9.5,
        color: '#a16207',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#ca8a04',
        distanceAU: 0.85,
        radiusKm: 5800,
        description: 'Planète dense riche en silicates lourds et minerais réfractaires.',
        moons: [
          {
            id: 'moon-vokh',
            name: 'Vokh',
            size: 1.8,
            orbitRadius: 16,
            orbitSpeed: 0.015,
            color: '#71717a',
            radiusKm: 850,
            orbitalPeriodDays: 8.4,
            description: 'Lune rocheuse criblée d\'impacts météoritiques.',
            type: 'natural'
          }
        ]
      },
      {
        id: 'canopus-3',
        name: 'Canopus III // Arrakis (Dune, Rakis)',
        romanNumeral: 'III',
        classification: 'Monde Désertique',
        orbitRadius: 92,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.5,
        color: '#ea580c',
        surfaceTextureType: 'desert',
        atmosphereColor: '#f97316',
        cloudDensity: 0.25,
        isPrimary: true,
        distanceAU: 1.42,
        radiusKm: 6375,
        description: 'L\'unique source connue du Mélange dans l\'Univers Connu. Berceau des Vers Géants (Shai-Hulud) et des tribus Fremen.',
        moons: [
          {
            id: 'moon-krelln',
            name: 'Premier Satellite // Krelln (Lune du Poing)',
            size: 3.2,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#d4d4d8',
            radiusKm: 1850,
            orbitalPeriodDays: 14.2,
            description: 'Lune blanche marquée par un cratère d\'impact évoquant un poing fermé.',
            type: 'natural'
          },
          {
            id: 'moon-arane',
            name: 'Deuxième Satellite // Arane (Lune de Muad\'Dib)',
            size: 2.2,
            orbitRadius: 34,
            orbitSpeed: 0.008,
            color: '#a1a1aa',
            radiusKm: 1220,
            orbitalPeriodDays: 28.5,
            description: 'Lune dont les mers de poussière dessinent la silhouette de la souris des sables.',
            type: 'natural'
          },
          {
            id: 'heighliner-dock-arrakis',
            name: 'Heighliner de la Guilde en Rade Orbitale',
            size: 3.8,
            orbitRadius: 44,
            orbitSpeed: 0.005,
            color: '#06b6d4',
            radiusKm: 20,
            orbitalPeriodDays: 3.0,
            description: 'Vaisseau de saut supraluminique de classe Titan stationné en orbite synchrone.',
            type: 'heighliner_dock'
          }
        ]
      },
      {
        id: 'canopus-4',
        name: 'Canopus IV (Pyrak)',
        romanNumeral: 'IV',
        classification: 'Tellurique',
        orbitRadius: 125,
        orbitSpeed: 0.0011,
        rotationSpeed: 0.005,
        size: 8.8,
        color: '#b45309',
        surfaceTextureType: 'desert',
        atmosphereColor: '#d97706',
        distanceAU: 2.3,
        radiusKm: 5100,
        description: 'Monde aride désolé bordant la ceinture d\'astéroïdes extérieure.',
        moons: []
      },
      {
        id: 'canopus-5',
        name: 'Canopus V (Shaddam\'s Watch)',
        romanNumeral: 'V',
        classification: 'Géante Gazeuse',
        orbitRadius: 165,
        orbitSpeed: 0.0008,
        rotationSpeed: 0.012,
        size: 19.5,
        color: '#d97706',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#b45309',
        atmosphereColor: '#fbbf24',
        distanceAU: 5.8,
        radiusKm: 68000,
        description: 'Géante gazeuse massive aux anneaux de poussière dorée et bandes d\'ammoniac.',
        moons: [
          {
            id: 'moon-selva',
            name: 'Selva',
            size: 2.4,
            orbitRadius: 26,
            orbitSpeed: 0.014,
            color: '#cbd5e1',
            radiusKm: 1450,
            orbitalPeriodDays: 6.2,
            description: 'Lune glaciale riche en méthane condensé.',
            type: 'natural'
          },
          {
            id: 'moon-brak',
            name: 'Brak',
            size: 1.8,
            orbitRadius: 34,
            orbitSpeed: 0.009,
            color: '#94a3b8',
            radiusKm: 920,
            orbitalPeriodDays: 12.8,
            description: 'Satellite rocheux capturé.',
            type: 'natural'
          }
        ]
      },
      {
        id: 'canopus-6',
        name: 'Canopus VI (Gargantua)',
        romanNumeral: 'VI',
        classification: 'Naine de Glace',
        orbitRadius: 215,
        orbitSpeed: 0.0005,
        rotationSpeed: 0.003,
        size: 8.2,
        color: '#38bdf8',
        surfaceTextureType: 'ice',
        atmosphereColor: '#bae6fd',
        distanceAU: 11.2,
        radiusKm: 3800,
        description: 'Sentinelle glacée marquant la frontière extérieure du système de Canopus.',
        moons: [
          {
            id: 'moon-bruma',
            name: 'Bruma',
            size: 1.5,
            orbitRadius: 18,
            orbitSpeed: 0.011,
            color: '#e2e8f0',
            radiusKm: 620,
            orbitalPeriodDays: 19.4,
            description: 'Lune recouverte de givre d\'azote.',
            type: 'natural'
          }
        ]
      }
    ]
  },

  // 2. DELTA PAVONIS // CALADAN
  caladan: {
    stars: [
      {
        id: 'delta-pavonis-prime',
        name: 'Delta Pavonis',
        spectralClass: 'G8V',
        starType: 'Étoile Naine Jaune Tempérée',
        color: '#fef08a',
        radius: 20,
        luminosity: 1.2,
        isPrimary: true,
        description: 'Étoile stable et douce de la constellation du Paon, illuminant le monde verdoyant des Atréides.'
      }
    ],
    planets: [
      {
        id: 'caladan-1',
        name: 'Delta Pavonis I (Pyrrhus)',
        romanNumeral: 'I',
        classification: 'Monde Volcanique',
        orbitRadius: 44,
        orbitSpeed: 0.0034,
        size: 6.8,
        color: '#991b1b',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#ef4444',
        distanceAU: 0.48,
        radiusKm: 3900,
        description: 'Tellurique chauffée à blanc, riche en filons de métaux lourds.',
        moons: []
      },
      {
        id: 'caladan-2',
        name: 'Delta Pavonis II (Cala Minor)',
        romanNumeral: 'II',
        classification: 'Tellurique',
        orbitRadius: 66,
        orbitSpeed: 0.0022,
        size: 8.5,
        color: '#ca8a04',
        surfaceTextureType: 'desert',
        atmosphereColor: '#eab308',
        distanceAU: 0.82,
        radiusKm: 5200,
        description: 'Monde stérile de silicates dorés et de plateaux basaltiques.',
        moons: []
      },
      {
        id: 'caladan-3',
        name: 'Delta Pavonis III // Caladan (Dan)',
        romanNumeral: 'III',
        classification: 'Monde Océanique',
        orbitRadius: 94,
        orbitSpeed: 0.0015,
        rotationSpeed: 0.004,
        size: 14.2,
        color: '#0284c7',
        surfaceTextureType: 'ocean',
        atmosphereColor: '#38bdf8',
        cloudDensity: 0.65,
        isPrimary: true,
        distanceAU: 1.05,
        radiusKm: 6600,
        description: 'Monde océanique luxuriant, fief ancestral de 26 générations de ducs Atréides.',
        moons: [
          {
            id: 'moon-cala',
            name: 'Lune Océanique // Cala',
            size: 3.4,
            orbitRadius: 26,
            orbitSpeed: 0.011,
            color: '#bae6fd',
            radiusKm: 1740,
            orbitalPeriodDays: 27.3,
            description: 'Lune principale régulant les puissantes marées caladaniennes.',
            type: 'natural'
          },
          {
            id: 'station-caladan-orbital',
            name: 'Forteresse Spatiale de Défense Atréides',
            size: 2.1,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#10b981',
            radiusKm: 15,
            orbitalPeriodDays: 4.5,
            description: 'Plateforme de surveillance et bastion de la flotte ducale.',
            type: 'defense_fortress'
          }
        ]
      },
      {
        id: 'caladan-4',
        name: 'Delta Pavonis IV (Pundi Prime)',
        romanNumeral: 'IV',
        classification: 'Monde Végétal',
        orbitRadius: 138,
        orbitSpeed: 0.001,
        size: 11.5,
        color: '#15803d',
        surfaceTextureType: 'lush',
        atmosphereColor: '#4ade80',
        distanceAU: 1.85,
        radiusKm: 6100,
        description: 'Monde agricole fertile dédié aux cultures extensives de riz Pundi.',
        moons: [
          {
            id: 'moon-ceres-dan',
            name: 'Ceres-Dan',
            size: 1.9,
            orbitRadius: 22,
            orbitSpeed: 0.012,
            color: '#a7f3d0',
            radiusKm: 890,
            orbitalPeriodDays: 16.0,
            description: 'Lune agricole abritant des serres orbitales expérimentales.',
            type: 'natural'
          }
        ]
      },
      {
        id: 'caladan-5',
        name: 'Delta Pavonis V (Oceanus Major)',
        romanNumeral: 'V',
        classification: 'Géante Gazeuse',
        orbitRadius: 185,
        orbitSpeed: 0.0006,
        size: 18.0,
        color: '#0369a1',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#38bdf8',
        atmosphereColor: '#7dd3fc',
        distanceAU: 5.2,
        radiusKm: 61000,
        description: 'Géante gazeuse bleutée aux bandes de méthane et d\'hydrogène.',
        moons: [
          {
            id: 'moon-thalassa',
            name: 'Thalassa',
            size: 2.2,
            orbitRadius: 28,
            orbitSpeed: 0.012,
            color: '#e0f2fe',
            radiusKm: 1300,
            orbitalPeriodDays: 8.8,
            description: 'Lune d\'eau gelée sous enveloppe de glace lisse.',
            type: 'natural'
          }
        ]
      }
    ]
  },

  // 3. 36 OPHIUCHI // GIEDI PRIME (GAMMU)
  'giedi-prime': {
    stars: [
      {
        id: '36-ophiuchi-b',
        name: '36 Ophiuchi B',
        spectralClass: 'K1V',
        starType: 'Naine Orange Sombre',
        color: '#f97316',
        radius: 19,
        luminosity: 0.28,
        isPrimary: true,
        description: 'Étoile naine orange à la lumière blafarde baignant le complexe industriel Harkonnen.'
      },
      {
        id: '36-ophiuchi-a',
        name: '36 Ophiuchi A',
        spectralClass: 'K0V',
        starType: 'Naine Orange Dorée (Compagnon Binaire)',
        color: '#fbbf24',
        radius: 17,
        luminosity: 0.35,
        isPrimary: false,
        orbitRadius: 210,
        orbitSpeed: 0.0003,
        description: 'Compagnon binaire à orbite large créant des crépuscules bistres.'
      }
    ],
    planets: [
      {
        id: 'giedi-1',
        name: '36 Ophiuchi B-I (Barony Prime)',
        romanNumeral: 'I',
        classification: 'Monde Minier',
        orbitRadius: 42,
        orbitSpeed: 0.0035,
        size: 7.8,
        color: '#7f1d1d',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#991b1b',
        distanceAU: 0.42,
        radiusKm: 4600,
        description: 'Fonderie tellurique surchauffée alimentant les usines d\'armement Harkonnen.',
        moons: []
      },
      {
        id: 'giedi-2',
        name: '36 Ophiuchi B-II // Giedi Prime (Gammu)',
        romanNumeral: 'II',
        classification: 'Monde Industriel',
        orbitRadius: 82,
        orbitSpeed: 0.0018,
        rotationSpeed: 0.004,
        size: 14.6,
        color: '#475569',
        surfaceTextureType: 'industrial',
        atmosphereColor: '#64748b',
        cloudDensity: 0.7,
        isPrimary: true,
        distanceAU: 0.95,
        radiusKm: 6550,
        description: 'Cœur oppressant de la Maison Harkonnen. Monde hyper-industrialisé aux cieux noircis par la suie et aux arènes de gladiateurs.',
        moons: [
          {
            id: 'moon-harko-1',
            name: 'Lune Minière // Giedi Minor I (Harko)',
            size: 2.8,
            orbitRadius: 22,
            orbitSpeed: 0.013,
            color: '#64748b',
            radiusKm: 1480,
            orbitalPeriodDays: 11.2,
            description: 'Lune criblée de fonderies et de citadelles d\'esclaves sous dômes étanches.',
            type: 'natural'
          },
          {
            id: 'moon-harko-2',
            name: 'Lune Fonderie // Giedi Minor II (Drom)',
            size: 2.0,
            orbitRadius: 32,
            orbitSpeed: 0.009,
            color: '#334155',
            radiusKm: 980,
            orbitalPeriodDays: 22.4,
            description: 'Complexe de raffinage de métaux d\'armes et de poisons de Kanly.',
            type: 'natural'
          },
          {
            id: 'station-barony-grid',
            name: 'Réseau de Défense Orbitale Harko',
            size: 2.4,
            orbitRadius: 42,
            orbitSpeed: 0.006,
            color: '#dc2626',
            radiusKm: 18,
            orbitalPeriodDays: 3.2,
            description: 'Ceinture de stations de tir lasers lourds et de batteries anti-vaisseaux.',
            type: 'defense_fortress'
          }
        ]
      },
      {
        id: 'giedi-3',
        name: '36 Ophiuchi B-III (Lankiveil Outpost)',
        romanNumeral: 'III',
        classification: 'Monde Glaciaire',
        orbitRadius: 130,
        orbitSpeed: 0.0011,
        size: 9.2,
        color: '#64748b',
        surfaceTextureType: 'ice',
        atmosphereColor: '#94a3b8',
        distanceAU: 1.8,
        radiusKm: 5400,
        description: 'Monde froid d\'essais chimiques et de garnisons punitives.',
        moons: []
      },
      {
        id: 'giedi-4',
        name: '36 Ophiuchi B-IV (Nerva)',
        romanNumeral: 'IV',
        classification: 'Géante Gazeuse',
        orbitRadius: 180,
        orbitSpeed: 0.0007,
        size: 19.0,
        color: '#334155',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#64748b',
        atmosphereColor: '#475569',
        distanceAU: 4.8,
        radiusKm: 65000,
        description: 'Géante d\'hydrocarbures sombres entourée d\'un anneau de suie glacée.',
        moons: [
          {
            id: 'moon-stryx',
            name: 'Stryx',
            size: 2.2,
            orbitRadius: 26,
            orbitSpeed: 0.012,
            color: '#1e293b',
            radiusKm: 1100,
            orbitalPeriodDays: 9.0,
            description: 'Lune sombre de roche basaltique.',
            type: 'natural'
          }
        ]
      }
    ]
  },

  // 4. 70 OPHIUCHI // KAITAIN
  kaitain: {
    stars: [
      {
        id: '70-ophiuchi-a',
        name: '70 Ophiuchi A',
        spectralClass: 'K0V',
        starType: 'Étoile Dorée Royale',
        color: '#fbbf24',
        radius: 21,
        luminosity: 0.5,
        isPrimary: true,
        description: 'Le soleil doré éclatant qui éclaire le Palais du Lion d\'Or et les hémicycles du Landsraad.'
      },
      {
        id: '70-ophiuchi-b',
        name: '70 Ophiuchi B',
        spectralClass: 'K5V',
        starType: 'Naine Orange (Binaire)',
        color: '#f97316',
        radius: 16,
        luminosity: 0.15,
        isPrimary: false,
        orbitRadius: 220,
        orbitSpeed: 0.0003,
        description: 'Étoile compagne ajoutant des reflets ambrés dans le ciel impérial.'
      }
    ],
    planets: [
      {
        id: 'kaitain-1',
        name: '70 Ophiuchi I // Kaitain (Trône du Lion d\'Or)',
        romanNumeral: 'I',
        classification: 'Monde Végétal',
        orbitRadius: 85,
        orbitSpeed: 0.0017,
        rotationSpeed: 0.004,
        size: 15.0,
        color: '#f59e0b',
        surfaceTextureType: 'imperial',
        atmosphereColor: '#fbbf24',
        cloudDensity: 0.4,
        isPrimary: true,
        distanceAU: 0.98,
        radiusKm: 6720,
        description: 'Capitale impériale de l\'Univers Connu. Cité-monde aux palais de marbre, cascades prismatiques et jardins sans fin.',
        moons: [
          {
            id: 'moon-korona-1',
            name: 'Lune Impériale // Solaria (Korona)',
            size: 3.0,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#fef08a',
            radiusKm: 1650,
            orbitalPeriodDays: 18.2,
            description: 'Lune ornée de stations de villégiature pour les princes de la Maison Corrino.',
            type: 'natural'
          },
          {
            id: 'moon-korona-2',
            name: 'Lune Gardienne // Selenis',
            size: 2.2,
            orbitRadius: 34,
            orbitSpeed: 0.008,
            color: '#fde047',
            radiusKm: 1180,
            orbitalPeriodDays: 32.0,
            description: 'Lune forteresse surveillant le corridor d\'accès au monde impérial.',
            type: 'natural'
          },
          {
            id: 'station-golden-watch',
            name: 'Station Sentinelle Sardaukar Impériale',
            size: 2.6,
            orbitRadius: 44,
            orbitSpeed: 0.005,
            color: '#f59e0b',
            radiusKm: 22,
            orbitalPeriodDays: 2.8,
            description: 'Quartier général orbital de la garde prétorienne Sardaukar.',
            type: 'defense_fortress'
          }
        ]
      },
      {
        id: 'kaitain-2',
        name: '70 Ophiuchi II (Aurelia / Jardins d\'Irulan)',
        romanNumeral: 'II',
        classification: 'Monde Océanique',
        orbitRadius: 135,
        orbitSpeed: 0.0011,
        size: 11.2,
        color: '#38bdf8',
        surfaceTextureType: 'ocean',
        atmosphereColor: '#7dd3fc',
        distanceAU: 1.7,
        radiusKm: 5900,
        description: 'Monde de plaisance aux îles flottantes et faune exotique préservée.',
        moons: [
          {
            id: 'moon-regalis',
            name: 'Regalis',
            size: 1.8,
            orbitRadius: 20,
            orbitSpeed: 0.014,
            color: '#bae6fd',
            radiusKm: 850,
            orbitalPeriodDays: 10.5,
            description: 'Lune de cristal et de glaces scintillantes.',
            type: 'natural'
          }
        ]
      },
      {
        id: 'kaitain-3',
        name: '70 Ophiuchi III (Corrino Reserve)',
        romanNumeral: 'III',
        classification: 'Géante Gazeuse',
        orbitRadius: 190,
        orbitSpeed: 0.0006,
        size: 20.0,
        color: '#f59e0b',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#fbbf24',
        atmosphereColor: '#fde047',
        distanceAU: 4.9,
        radiusKm: 72000,
        description: 'Géante aux majestueux anneaux dorés reflétant la lumière de 70 Ophiuchi A.',
        moons: [
          {
            id: 'moon-augustus',
            name: 'Augustus',
            size: 2.5,
            orbitRadius: 28,
            orbitSpeed: 0.011,
            color: '#fef08a',
            radiusKm: 1520,
            orbitalPeriodDays: 14.1,
            description: 'Lune géante aux océans d\'hydrocarbures liquides.',
            type: 'natural'
          }
        ]
      }
    ]
  },

  // 5. GAMMA WAIPING // SALUSA SECUNDUS
  'salusa-secundus': {
    stars: [
      {
        id: 'gamma-waiping-prime',
        name: 'Gamma Waiping A',
        spectralClass: 'F5V',
        starType: 'Étoile Blanche-Jaune Énergétique',
        color: '#fef9c3',
        radius: 22,
        luminosity: 3.2,
        isPrimary: true,
        description: 'Soleil sévère aux violentes éruptions de radiations balayant la planète-prison.'
      },
      {
        id: 'gamma-waiping-b',
        name: 'Gamma Waiping B',
        spectralClass: 'M2V',
        starType: 'Naine Rouge Lointaine',
        color: '#ef4444',
        radius: 14,
        luminosity: 0.05,
        isPrimary: false,
        orbitRadius: 230,
        orbitSpeed: 0.0002,
        description: 'Compagnon rouge apportant une lueur sanglante dans le ciel nocturne.'
      }
    ],
    planets: [
      {
        id: 'salusa-1',
        name: 'Gamma Waiping I (Ignis Waiping)',
        romanNumeral: 'I',
        classification: 'Monde Volcanique',
        orbitRadius: 48,
        orbitSpeed: 0.0032,
        size: 7.0,
        color: '#b91c1c',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#dc2626',
        distanceAU: 0.52,
        radiusKm: 4100,
        description: 'Monde tellurique en fusion constante, océans de laves basaltiques.',
        moons: []
      },
      {
        id: 'salusa-2',
        name: 'Gamma Waiping II // Salusa Secundus (Le Creuset Sardaukar)',
        romanNumeral: 'II',
        classification: 'Monde Désertique',
        orbitRadius: 96,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.8,
        color: '#d97706',
        surfaceTextureType: 'desert',
        atmosphereColor: '#f59e0b',
        cloudDensity: 0.35,
        isPrimary: true,
        distanceAU: 1.35,
        radiusKm: 6480,
        description: 'L\'ancienne capitale impériale dévastée par l\'holocauste atomique, convertie en planète-prison et creuset impitoyable de sélection des Sardaukars.',
        moons: [
          {
            id: 'moon-salusa-1',
            name: 'Lune Sentinelle // Gorgon',
            size: 3.1,
            orbitRadius: 25,
            orbitSpeed: 0.012,
            color: '#a8a29e',
            radiusKm: 1680,
            orbitalPeriodDays: 15.3,
            description: 'Lune forteresse où sont stationnés les vaisseaux de transport Sardaukar.',
            type: 'natural'
          },
          {
            id: 'moon-salusa-2',
            name: 'Lune Sentinelle // Talon',
            size: 2.1,
            orbitRadius: 36,
            orbitSpeed: 0.008,
            color: '#78716c',
            radiusKm: 1100,
            orbitalPeriodDays: 29.0,
            description: 'Avant-poste d\'observation équipé de capteurs longue portée.',
            type: 'natural'
          }
        ]
      },
      {
        id: 'salusa-3',
        name: 'Gamma Waiping III (Caelum)',
        romanNumeral: 'III',
        classification: 'Monde Glaciaire',
        orbitRadius: 160,
        orbitSpeed: 0.0008,
        size: 17.5,
        color: '#0284c7',
        surfaceTextureType: 'ice',
        atmosphereColor: '#38bdf8',
        distanceAU: 4.2,
        radiusKm: 48000,
        description: 'Géante glaciale ceinturée de tempêtes de méthane liquide.',
        moons: [
          {
            id: 'moon-frost',
            name: 'Frost',
            size: 1.9,
            orbitRadius: 22,
            orbitSpeed: 0.014,
            color: '#e0f2fe',
            radiusKm: 980,
            orbitalPeriodDays: 7.6,
            description: 'Lune de glace d\'azote pure.',
            type: 'natural'
          }
        ]
      }
    ]
  },

  // 6. EPSILON OCTANTIS // JUNCTION
  junction: {
    stars: [
      {
        id: 'junction-star-prime',
        name: 'Epsilon Octantis (Nexus)',
        spectralClass: 'F2IV',
        starType: 'Étoile Supraluminique Bleutée',
        color: '#a5f3fc',
        radius: 23,
        luminosity: 8.5,
        isPrimary: true,
        description: 'Étoile massive à la lumière bleutée servant de phare d\'astronavigation pour les Heighliners de la Guilde.'
      }
    ],
    planets: [
      {
        id: 'junction-1',
        name: 'Epsilon Octantis I (Fold Hub)',
        romanNumeral: 'I',
        classification: 'Monde Synthétique',
        orbitRadius: 50,
        orbitSpeed: 0.003,
        size: 8.0,
        color: '#0891b2',
        surfaceTextureType: 'synthetic',
        atmosphereColor: '#06b6d4',
        distanceAU: 0.55,
        radiusKm: 4800,
        description: 'Station d\'ancrage et générateurs Holtzman pour le saut supraluminique.',
        moons: []
      },
      {
        id: 'junction-2',
        name: 'Epsilon Octantis II // Junction (Siège Suprême de la Guilde)',
        romanNumeral: 'II',
        classification: 'Monde Synthétique',
        orbitRadius: 90,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.003,
        size: 15.2,
        color: '#06b6d4',
        surfaceTextureType: 'synthetic',
        atmosphereColor: '#22d3ee',
        cloudDensity: 0.3,
        isPrimary: true,
        distanceAU: 1.15,
        radiusKm: 6800,
        description: 'Le cœur névralgique de la Guilde Spatiale. Planète artificielle et banque interstellaire où reposent les immenses cuves des Navigateurs.',
        moons: [
          {
            id: 'shipyard-ring',
            name: 'Anneau de Montage Orbital des Heighliners',
            size: 4.8,
            orbitRadius: 28,
            orbitSpeed: 0.01,
            color: '#38bdf8',
            radiusKm: 45,
            orbitalPeriodDays: 1.5,
            description: 'Mégastructure de 300 km de diamètre capable d\'assembler simultanément 12 Heighliners géants.',
            type: 'space_station'
          },
          {
            id: 'moon-navigators-haven',
            name: 'Grand Sanctuaire des Navigateurs Prescients',
            size: 2.8,
            orbitRadius: 40,
            orbitSpeed: 0.006,
            color: '#67e8f9',
            radiusKm: 1250,
            orbitalPeriodDays: 8.0,
            description: 'Lune sanctuaire saturée d\'Épice à l\'atmosphère de gaz orange.',
            type: 'natural'
          },
          {
            id: 'cargo-hub-spire',
            name: 'Spire Orbitale de Fret CHOAM',
            size: 2.2,
            orbitRadius: 52,
            orbitSpeed: 0.004,
            color: '#0ea5e9',
            radiusKm: 25,
            orbitalPeriodDays: 14.0,
            description: 'Entrepôt automatisé de transit de marchandises pour l\'ensemble des Grandes Maisons.',
            type: 'heighliner_dock'
          }
        ]
      },
      {
        id: 'junction-3',
        name: 'Epsilon Octantis III (Avernus)',
        romanNumeral: 'III',
        classification: 'Géante Gazeuse',
        orbitRadius: 170,
        orbitSpeed: 0.0007,
        size: 19.5,
        color: '#0e7490',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#22d3ee',
        atmosphereColor: '#06b6d4',
        distanceAU: 4.6,
        radiusKm: 68000,
        description: 'Géante gazeuse utilisée pour le raffinage d\'hydrogène lourd et de carburant sub-spatial.',
        moons: [
          {
            id: 'moon-nexus-alpha',
            name: 'Nexus Alpha',
            size: 2.4,
            orbitRadius: 26,
            orbitSpeed: 0.013,
            color: '#a5f3fc',
            radiusKm: 1420,
            orbitalPeriodDays: 7.2,
            description: 'Lune glaciale hébergeant des banques de données cryptées de la Guilde.',
            type: 'natural'
          }
        ]
      }
    ]
  },

  // 7. ROD 267 // IX (VERNIUS)
  ix: {
    stars: [
      {
        id: 'alkarurove-prime',
        name: 'Alkarurove (Rod 267)',
        spectralClass: 'K2V',
        starType: 'Naine Orange Technologique',
        color: '#38bdf8',
        radius: 20,
        luminosity: 0.42,
        isPrimary: true,
        description: 'Étoile mère du système d\'Ix, autour de laquelle gravitent 9 mondes manufacturés.'
      }
    ],
    planets: [
      {
        id: 'ix-inner-1',
        name: 'Rod 267 I à VIII (Ceintures Minières d\'Ix)',
        romanNumeral: 'I-VIII',
        classification: 'Monde Minier',
        orbitRadius: 52,
        orbitSpeed: 0.003,
        size: 8.5,
        color: '#0284c7',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#38bdf8',
        distanceAU: 0.6,
        radiusKm: 4900,
        description: 'Chapelet de mondes miniers automatisés fournissant le titane et les supraconducteurs.',
        moons: []
      },
      {
        id: 'ix-9',
        name: 'Rod 267 IX // Ix (Xuttah / Cité Sous Terre Vernius)',
        romanNumeral: 'IX',
        classification: 'Monde Synthétique',
        orbitRadius: 98,
        orbitSpeed: 0.0015,
        rotationSpeed: 0.003,
        size: 14.8,
        color: '#0284c7',
        surfaceTextureType: 'synthetic',
        atmosphereColor: '#38bdf8',
        cloudDensity: 0.5,
        isPrimary: true,
        distanceAU: 1.25,
        radiusKm: 6500,
        description: 'Neuvième planète du système (d\'où le nom romain IX). Métropole souterraine titanesque produisant les Heighliners, les boucliers Holtzman et les Non-Vaisseaux.',
        moons: [
          {
            id: 'moon-ix-1',
            name: 'Station d\'Essais Électroniques // Alpha-Ix',
            size: 2.8,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#7dd3fc',
            radiusKm: 1450,
            orbitalPeriodDays: 12.0,
            description: 'Laboratoire d\'ingénierie cyber-mécanique aux limites des interdits butlériens.',
            type: 'space_station'
          },
          {
            id: 'station-vernius-foundry',
            name: 'Fonderie Orbitale Vernius de Non-Technologie',
            size: 2.4,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#38bdf8',
            radiusKm: 35,
            orbitalPeriodDays: 5.5,
            description: 'Chantier spatial sous champ de non-détection Holtzman impénétrable.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'ix-10',
        name: 'Rod 267 X (Hephaestus)',
        romanNumeral: 'X',
        classification: 'Géante Gazeuse',
        orbitRadius: 175,
        orbitSpeed: 0.0007,
        size: 19.0,
        color: '#0369a1',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#7dd3fc',
        atmosphereColor: '#38bdf8',
        distanceAU: 5.4,
        radiusKm: 66000,
        description: 'Géante extérieure fournissant les gaz rares pour la fabrication des tubes de pliage spatial.',
        moons: []
      }
    ]
  },

  // 8. THALIM // TLEILAX
  'tleilax-prime': {
    stars: [
      {
        id: 'thalim-prime',
        name: 'Thalim',
        spectralClass: 'G2V',
        starType: 'Naine Jaune Biologique',
        color: '#ec4899',
        radius: 20,
        luminosity: 1.0,
        isPrimary: true,
        description: 'Étoile centrale du sanctuaire Tleilaxu, voilée par des protocoles stricts d\'interdiction de vol.'
      }
    ],
    planets: [
      {
        id: 'tleilax-1',
        name: 'Thalim I à VI (Sanctuaires des Périphéries)',
        romanNumeral: 'I-VI',
        classification: 'Monde Synthétique',
        orbitRadius: 55,
        orbitSpeed: 0.0028,
        size: 8.2,
        color: '#db2777',
        surfaceTextureType: 'synthetic',
        atmosphereColor: '#f472b6',
        distanceAU: 0.7,
        radiusKm: 5100,
        description: 'Mondes agraires et avant-postes gardés par les Maîtres Tleilaxu.',
        moons: []
      },
      {
        id: 'tleilax-7',
        name: 'Thalim VII // Tleilax (Bandalong / Les Cuves Axlotl)',
        romanNumeral: 'VII',
        classification: 'Monde Synthétique',
        orbitRadius: 95,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.5,
        color: '#ec4899',
        surfaceTextureType: 'synthetic',
        atmosphereColor: '#f472b6',
        cloudDensity: 0.55,
        isPrimary: true,
        distanceAU: 1.2,
        radiusKm: 6400,
        description: 'Capitale sacrée des Maîtres Tleilaxu. Cité de Bandalong, cuves Axlotl, création des Danseurs-Visages et gholas de chair régénérée.',
        moons: [
          {
            id: 'moon-tleilax-1',
            name: 'Sentinelle Bio-Organique // Axlotl Prime',
            size: 2.7,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#f472b6',
            radiusKm: 1400,
            orbitalPeriodDays: 13.5,
            description: 'Lune bio-artificielle abritant les archives génétiques interdites.',
            type: 'natural'
          },
          {
            id: 'station-zensunni-relic',
            name: 'Sanctuaire Secret de la Vraie Foi Zensunni',
            size: 2.0,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#be185d',
            radiusKm: 20,
            orbitalPeriodDays: 4.2,
            description: 'Temple orbital des Maîtres du Grand Dessein.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'tleilax-8',
        name: 'Thalim VIII (Ghola Deep)',
        romanNumeral: 'VIII',
        classification: 'Géante Gazeuse',
        orbitRadius: 170,
        orbitSpeed: 0.0007,
        size: 18.5,
        color: '#9d174d',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#f472b6',
        atmosphereColor: '#db2777',
        distanceAU: 5.1,
        radiusKm: 62000,
        description: 'Géante gazeuse aux orages pourpres servant de cimetière d\'expérimentations biologiques rejetées.',
        moons: []
      }
    ]
  },

  // 9. LAOUJIN // WALLACH IX
  'wallach-ix': {
    stars: [
      {
        id: 'laoujin-prime',
        name: 'Laoujin Alpha',
        spectralClass: 'A5V',
        starType: 'Étoile Blanche Tempérée',
        color: '#c084fc',
        radius: 22,
        luminosity: 4.8,
        isPrimary: true,
        description: 'Étoile blanche illuminant les cloîtres de l\'École des Mères du Bene Gesserit.'
      }
    ],
    planets: [
      {
        id: 'wallach-inner',
        name: 'Laoujin I à VIII (Mondes Silencieux)',
        romanNumeral: 'I-VIII',
        classification: 'Monde Glaciaire',
        orbitRadius: 55,
        orbitSpeed: 0.0028,
        size: 8.0,
        color: '#7c3aed',
        surfaceTextureType: 'ice',
        atmosphereColor: '#a78bfa',
        distanceAU: 0.75,
        radiusKm: 4900,
        description: 'Mondes déserts et réserves géologiques sous protection stricte du Bene Gesserit.',
        moons: []
      },
      {
        id: 'wallach-9',
        name: 'Laoujin IX // Wallach IX (Maison-Mère du Bene Gesserit)',
        romanNumeral: 'IX',
        classification: 'Monde Végétal',
        orbitRadius: 96,
        orbitSpeed: 0.0015,
        rotationSpeed: 0.004,
        size: 14.6,
        color: '#8b5cf6',
        surfaceTextureType: 'lush',
        atmosphereColor: '#a78bfa',
        cloudDensity: 0.6,
        isPrimary: true,
        distanceAU: 1.3,
        radiusKm: 6600,
        description: 'Siège ancestral de l\'Ordre du Bene Gesserit. Académie suprême du conditionnement Prana-Bindu et chambre de l\'Agonie de l\'Épice.',
        moons: [
          {
            id: 'moon-wallach-1',
            name: 'Lune du Silence // Tacita',
            size: 2.9,
            orbitRadius: 25,
            orbitSpeed: 0.011,
            color: '#ddd6fe',
            radiusKm: 1550,
            orbitalPeriodDays: 16.0,
            description: 'Lune dédiée à la méditation et au recueillement des Révérendes Mères.',
            type: 'natural'
          },
          {
            id: 'station-prana-bindu',
            name: 'Observatoire Suprême de la Mémoire Seconde',
            size: 2.2,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#8b5cf6',
            radiusKm: 25,
            orbitalPeriodDays: 5.0,
            description: 'Station orbitale renfermant les arbres généalogiques millénaires du Kwisatz Haderach.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'wallach-10',
        name: 'Laoujin X (Nadir)',
        romanNumeral: 'X',
        classification: 'Géante Gazeuse',
        orbitRadius: 175,
        orbitSpeed: 0.0007,
        size: 18.0,
        color: '#5b21b6',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#a78bfa',
        atmosphereColor: '#7c3aed',
        distanceAU: 5.3,
        radiusKm: 60000,
        description: 'Géante gazeuse sombre gardant l\'accès stellaire du système.',
        moons: []
      }
    ]
  },

  // 10. CHAPTERHOUSE (SANCTUAIRE DU CHAPITRE)
  chapterhouse: {
    stars: [
      {
        id: 'chap-star',
        name: 'Sigma Ophiuchi (Soleil Secret)',
        spectralClass: 'G5V',
        starType: 'Soleil Jaune Tempéré',
        color: '#fde047',
        radius: 20,
        luminosity: 0.95,
        isPrimary: true,
        description: 'Étoile stable choisie pour sa discrétion lors du grand repli du Bene Gesserit.'
      }
    ],
    planets: [
      {
        id: 'chap-1',
        name: 'Chapterhouse I & II',
        romanNumeral: 'I-II',
        classification: 'Tellurique',
        orbitRadius: 50,
        orbitSpeed: 0.003,
        size: 7.5,
        color: '#ca8a04',
        surfaceTextureType: 'desert',
        atmosphereColor: '#eab308',
        distanceAU: 0.6,
        radiusKm: 4600,
        description: 'Mondes intérieurs arides et déserts de roches basaltiques.',
        moons: []
      },
      {
        id: 'chap-4',
        name: 'Chapterhouse IV // La Maison du Chapitre',
        romanNumeral: 'IV',
        classification: 'Monde Désertique',
        orbitRadius: 92,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.4,
        color: '#d97706',
        surfaceTextureType: 'desert',
        atmosphereColor: '#fb923c',
        cloudDensity: 0.35,
        isPrimary: true,
        distanceAU: 1.15,
        radiusKm: 6420,
        description: 'Le sanctuaire secret où le Bene Gesserit a reproduit le cycle des vers de sable après la destruction d\'Arrakis.',
        moons: [
          {
            id: 'moon-chap-1',
            name: 'Lune Sentinelle // Odrade',
            size: 2.8,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#fdba74',
            radiusKm: 1480,
            orbitalPeriodDays: 14.5,
            description: 'Lune rocheuse camouflée protégeant le secret de la Maison du Chapitre.',
            type: 'natural'
          }
        ]
      },
      {
        id: 'chap-5',
        name: 'Chapterhouse V (Aegis Minor)',
        romanNumeral: 'V',
        classification: 'Géante Gazeuse',
        orbitRadius: 165,
        orbitSpeed: 0.0008,
        size: 18.2,
        color: '#b45309',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#fb923c',
        atmosphereColor: '#ea580c',
        distanceAU: 4.8,
        radiusKm: 63000,
        description: 'Géante gazeuse aux teintes d\'ambre et de cuivre.',
        moons: []
      }
    ]
  },

  // 11. CHUSUK // PLANÈTE DE LA MUSIQUE
  chusuk: {
    stars: [
      {
        id: 'chusuk-star',
        name: 'Theta Shalish (Theta Cygni)',
        spectralClass: 'F4IV',
        starType: 'Étoile Blanche-Dorée Harmonique',
        color: '#ec4899',
        radius: 21,
        luminosity: 4.2,
        isPrimary: true,
        description: 'Étoile lumineuse baignant les vallées fleuries de Chusuk.'
      }
    ],
    planets: [
      {
        id: 'chusuk-1',
        name: 'Theta Shalish I à III',
        romanNumeral: 'I-III',
        classification: 'Tellurique',
        orbitRadius: 52,
        orbitSpeed: 0.003,
        size: 7.8,
        color: '#f472b6',
        surfaceTextureType: 'lush',
        atmosphereColor: '#f9a8d4',
        distanceAU: 0.65,
        radiusKm: 4800,
        description: 'Mondes tropicaux aux forêts de bois résonnants.',
        moons: []
      },
      {
        id: 'chusuk-4',
        name: 'Theta Shalish IV // Chusuk (Planète de la Musique)',
        romanNumeral: 'IV',
        classification: 'Monde Végétal',
        orbitRadius: 94,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.5,
        color: '#db2777',
        surfaceTextureType: 'lush',
        atmosphereColor: '#f472b6',
        cloudDensity: 0.55,
        isPrimary: true,
        distanceAU: 1.2,
        radiusKm: 6550,
        description: 'Le centre culturel et musical de l\'Empire. Célèbre pour ses balisets Varota et ses essences florales apaisantes.',
        moons: [
          {
            id: 'moon-chusuk-1',
            name: 'Lune Lyre // Chorda',
            size: 2.6,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#fbcfe8',
            radiusKm: 1380,
            orbitalPeriodDays: 13.2,
            description: 'Lune de quartz dont les falaises vibrent au vent solaire.',
            type: 'natural'
          },
          {
            id: 'station-varota-ateliers',
            name: 'Atelier Flottant de Maître Varota',
            size: 2.1,
            orbitRadius: 35,
            orbitSpeed: 0.007,
            color: '#ec4899',
            radiusKm: 18,
            orbitalPeriodDays: 4.8,
            description: 'Manufacture orbitale d\'instruments de musique acoustiques d\'élite.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'chusuk-5',
        name: 'Theta Shalish V (Symphonia)',
        romanNumeral: 'V',
        classification: 'Géante Gazeuse',
        orbitRadius: 165,
        orbitSpeed: 0.0008,
        size: 19.0,
        color: '#9d174d',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#f472b6',
        atmosphereColor: '#db2777',
        distanceAU: 4.9,
        radiusKm: 66000,
        description: 'Géante aux anneaux harmoniques émettant des ondes radio régulières.',
        moons: []
      }
    ]
  },

  // 12. PORITRIN // MONDE ANCESTRAL ZENSUNNI
  poritrin: {
    stars: [
      {
        id: 'poritrin-star',
        name: 'Epsilon Alphecca (Epsilon Coronae)',
        spectralClass: 'G0V',
        starType: 'Étoile Jaune Classique',
        color: '#ca8a04',
        radius: 20,
        luminosity: 1.1,
        isPrimary: true,
        description: 'Soleil doré historique du monde d\'origine de Tio Holtzman et des esclaves Zensunni.'
      }
    ],
    planets: [
      {
        id: 'poritrin-1',
        name: 'Epsilon Alphecca I & II',
        romanNumeral: 'I-II',
        classification: 'Monde Minier',
        orbitRadius: 50,
        orbitSpeed: 0.0031,
        size: 7.2,
        color: '#854d0e',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#a16207',
        distanceAU: 0.55,
        radiusKm: 4500,
        description: 'Mondes miniers aux gisements de pyrites et silicates.',
        moons: []
      },
      {
        id: 'poritrin-3',
        name: 'Epsilon Alphecca III // Poritrin',
        romanNumeral: 'III',
        classification: 'Monde Océanique',
        orbitRadius: 92,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.3,
        color: '#eab308',
        surfaceTextureType: 'ocean',
        atmosphereColor: '#fde047',
        cloudDensity: 0.5,
        isPrimary: true,
        distanceAU: 1.08,
        radiusKm: 6480,
        description: 'Monde agricole fertile, étape majeure de l\'exode des Zensunni et berceau de l\'inventeur des effets Holtzman.',
        moons: [
          {
            id: 'moon-poritrin-1',
            name: 'Lune du Souvenir // Zensun',
            size: 2.7,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#fef08a',
            radiusKm: 1420,
            orbitalPeriodDays: 14.0,
            description: 'Lune dédiée à la mémoire des millions de déportés Zensunni.',
            type: 'natural'
          },
          {
            id: 'station-holtzman-memorial',
            name: 'Station Mémoriale Tio Holtzman',
            size: 2.2,
            orbitRadius: 35,
            orbitSpeed: 0.007,
            color: '#ca8a04',
            radiusKm: 22,
            orbitalPeriodDays: 4.5,
            description: 'Station d\'études des équations fondamentales du champ de repliement.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'poritrin-4',
        name: 'Epsilon Alphecca IV (Sirdar)',
        romanNumeral: 'IV',
        classification: 'Géante Gazeuse',
        orbitRadius: 168,
        orbitSpeed: 0.0008,
        size: 18.8,
        color: '#713f12',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#eab308',
        atmosphereColor: '#ca8a04',
        distanceAU: 5.0,
        radiusKm: 65000,
        description: 'Géante gazeuse aux nuages d\'ammoniaque jaune doré.',
        moons: []
      }
    ]
  },

  // 13. ROSSAK // SANCTUAIRE DES SORCIÈRES
  rossak: {
    stars: [
      {
        id: 'rossak-star',
        name: 'HD 95424 (Rossak Sun)',
        spectralClass: 'F8V',
        starType: 'Étoile Jaune-Blanc Énergétique',
        color: '#15803d',
        radius: 21,
        luminosity: 1.8,
        isPrimary: true,
        description: 'Étoile baignant la canopée toxique de Rossak de rayons ultraviolets intenses.'
      }
    ],
    planets: [
      {
        id: 'rossak-1',
        name: 'HD 95424 I à V',
        romanNumeral: 'I-V',
        classification: 'Monde Volcanique',
        orbitRadius: 52,
        orbitSpeed: 0.003,
        size: 7.6,
        color: '#166534',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#22c55e',
        distanceAU: 0.6,
        radiusKm: 4700,
        description: 'Mondes volcaniques aux cratères bouillonnants.',
        moons: []
      },
      {
        id: 'rossak-6',
        name: 'HD 95424 VI // Rossak (Monde des Sorcières)',
        romanNumeral: 'VI',
        classification: 'Monde Végétal',
        orbitRadius: 96,
        orbitSpeed: 0.0015,
        rotationSpeed: 0.004,
        size: 14.6,
        color: '#16a34a',
        surfaceTextureType: 'lush',
        atmosphereColor: '#4ade80',
        cloudDensity: 0.7,
        isPrimary: true,
        distanceAU: 1.25,
        radiusKm: 6580,
        description: 'Monde de jungle toxique et dense. Berceau des Sorcières de Rossak, ancêtres spirituelles du Bene Gesserit.',
        moons: [
          {
            id: 'moon-rossak-1',
            name: 'Lune Sombre // Sayyadina',
            size: 2.8,
            orbitRadius: 25,
            orbitSpeed: 0.011,
            color: '#86efac',
            radiusKm: 1490,
            orbitalPeriodDays: 15.0,
            description: 'Lune jungle abritant des sanctuaires de méditation télépathique.',
            type: 'natural'
          }
        ]
      },
      {
        id: 'rossak-7',
        name: 'HD 95424 VII (Miasma)',
        romanNumeral: 'VII',
        classification: 'Géante Gazeuse',
        orbitRadius: 172,
        orbitSpeed: 0.0007,
        size: 19.2,
        color: '#14532d',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#4ade80',
        atmosphereColor: '#22c55e',
        distanceAU: 5.2,
        radiusKm: 67000,
        description: 'Géante gazeuse ceinturée de nuages de chlore et de soufre vert.',
        moons: []
      }
    ]
  },

  // 14. KUENTSING // BELA TEGEUSE
  'bela-tegeuse': {
    stars: [
      {
        id: 'kuentsing-prime',
        name: 'Kuentsing Prime',
        spectralClass: 'K3V',
        starType: 'Naine Orange Chaude',
        color: '#f97316',
        radius: 20,
        luminosity: 0.4,
        isPrimary: true,
        description: 'Soleil orange illuminant les vastes steppes et sanctuaires de Kuentsing.'
      }
    ],
    planets: [
      {
        id: 'bela-1',
        name: 'Kuentsing I à IV',
        romanNumeral: 'I-IV',
        classification: 'Tellurique',
        orbitRadius: 52,
        orbitSpeed: 0.003,
        size: 7.5,
        color: '#c2410c',
        surfaceTextureType: 'desert',
        atmosphereColor: '#ea580c',
        distanceAU: 0.65,
        radiusKm: 4750,
        description: 'Mondes arides de silicates et de poussière rouge.',
        moons: []
      },
      {
        id: 'bela-5',
        name: 'Kuentsing V // Bela Tegeuse',
        romanNumeral: 'V',
        classification: 'Monde Désertique',
        orbitRadius: 94,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.5,
        color: '#f97316',
        surfaceTextureType: 'desert',
        atmosphereColor: '#fb923c',
        cloudDensity: 0.35,
        isPrimary: true,
        distanceAU: 1.2,
        radiusKm: 6520,
        description: 'Cinquième étape légendaire de l\'Exode Zensunni vers Arrakis. Steppes désertiques et cités troglodytes.',
        moons: [
          {
            id: 'moon-bela-1',
            name: 'Lune Ocre // Nomad',
            size: 2.8,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#fed7aa',
            radiusKm: 1460,
            orbitalPeriodDays: 14.2,
            description: 'Lune ocre dédiée au pèlerinage perpétuel des errants Zensunni.',
            type: 'natural'
          }
        ]
      },
      {
        id: 'bela-6',
        name: 'Kuentsing VI (Kuentsing Major)',
        romanNumeral: 'VI',
        classification: 'Géante Gazeuse',
        orbitRadius: 170,
        orbitSpeed: 0.0007,
        size: 19.0,
        color: '#9a3412',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#fb923c',
        atmosphereColor: '#ea580c',
        distanceAU: 5.1,
        radiusKm: 66000,
        description: 'Géante gazeuse aux cyclones orangers géants.',
        moons: []
      }
    ]
  },

  // 15. BUZZELL // OCÉANS DE SOOS
  buzzell: {
    stars: [
      {
        id: 'buzzell-star',
        name: 'Corona Borealis Alpha',
        spectralClass: 'B9V',
        starType: 'Étoile Bleue Polaire',
        color: '#06b6d4',
        radius: 22,
        luminosity: 6.0,
        isPrimary: true,
        description: 'Étoile bleutée scintillante projetant ses reflets sur l\'océan mondial de Buzzell.'
      }
    ],
    planets: [
      {
        id: 'buzzell-1',
        name: 'Corona Borealis I (Pelagos)',
        romanNumeral: 'I',
        classification: 'Monde Océanique',
        orbitRadius: 54,
        orbitSpeed: 0.0029,
        size: 8.0,
        color: '#0891b2',
        surfaceTextureType: 'ocean',
        atmosphereColor: '#22d3ee',
        distanceAU: 0.7,
        radiusKm: 5100,
        description: 'Monde marin chaud aux fonds coralliens bioluminescents.',
        moons: []
      },
      {
        id: 'buzzell-2',
        name: 'Corona Borealis II // Buzzell (Océan des Soostones)',
        romanNumeral: 'II',
        classification: 'Monde Océanique',
        orbitRadius: 95,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.6,
        color: '#06b6d4',
        surfaceTextureType: 'ocean',
        atmosphereColor: '#67e8f9',
        cloudDensity: 0.65,
        isPrimary: true,
        distanceAU: 1.15,
        radiusKm: 6600,
        description: 'Planète océanique froide où vivent les créatures secrétant les fabuleuses et inestimables gemmes Soostones.',
        moons: [
          {
            id: 'moon-buzzell-1',
            name: 'Lune de Glace // Glacies',
            size: 2.7,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#cffafe',
            radiusKm: 1420,
            orbitalPeriodDays: 13.8,
            description: 'Lune glacée régulant les courants marins polaires.',
            type: 'natural'
          },
          {
            id: 'station-soostone-barge',
            name: 'Barge Forteresse de Récolte des Soostones',
            size: 2.2,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#0891b2',
            radiusKm: 20,
            orbitalPeriodDays: 4.5,
            description: 'Station de tri et d\'enchères des perles précieuses pour le Landsraad.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'buzzell-3',
        name: 'Corona Borealis III (Aquaris)',
        romanNumeral: 'III',
        classification: 'Géante Gazeuse',
        orbitRadius: 170,
        orbitSpeed: 0.0007,
        size: 18.8,
        color: '#155e75',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#67e8f9',
        atmosphereColor: '#06b6d4',
        distanceAU: 5.0,
        radiusKm: 64000,
        description: 'Géante glaciale d\'eau et d\'ammoniaque sous pression extrême.',
        moons: []
      }
    ]
  },

  // 16. HAGAL // LA PLANÈTE JOYAU
  hagal: {
    stars: [
      {
        id: 'hagal-star',
        name: 'Theta Shaowei',
        spectralClass: 'F6V',
        starType: 'Étoile Dorée Cristalline',
        color: '#f59e0b',
        radius: 21,
        luminosity: 2.5,
        isPrimary: true,
        description: 'Étoile illuminant les failles cristallines et les gisements d\'émeraudes d\'Hagal.'
      }
    ],
    planets: [
      {
        id: 'hagal-1',
        name: 'Theta Shaowei I (Obsidian)',
        romanNumeral: 'I',
        classification: 'Monde Volcanique',
        orbitRadius: 50,
        orbitSpeed: 0.0031,
        size: 7.4,
        color: '#78350f',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#b45309',
        distanceAU: 0.58,
        radiusKm: 4600,
        description: 'Monde de verre volcanique et de laves de quartz liquide.',
        moons: []
      },
      {
        id: 'hagal-2',
        name: 'Theta Shaowei II // Hagal (Planète des Joyaux)',
        romanNumeral: 'II',
        classification: 'Monde Minier',
        orbitRadius: 92,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.5,
        color: '#d97706',
        surfaceTextureType: 'imperial',
        atmosphereColor: '#f59e0b',
        cloudDensity: 0.45,
        isPrimary: true,
        distanceAU: 1.1,
        radiusKm: 6540,
        description: 'Source des joyaux ornant le Trône du Lion d\'Or. Montagnes d\'émeraudes, saphirs et quartz purs exploités par le Trésor Impérial.',
        moons: [
          {
            id: 'moon-hagal-1',
            name: 'Lune Émeraude // Gemina',
            size: 2.8,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#fde68a',
            radiusKm: 1470,
            orbitalPeriodDays: 14.0,
            description: 'Lune brillante couverte de poussière cristalline réfléchissante.',
            type: 'natural'
          },
          {
            id: 'station-imperial-lapidary',
            name: 'Manufacture Lapidaire Impériale de Kaitain',
            size: 2.2,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#f59e0b',
            radiusKm: 25,
            orbitalPeriodDays: 4.8,
            description: 'Atelier de taille des plus grands diamants impériaux.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'hagal-3',
        name: 'Theta Shaowei III (Crystalline)',
        romanNumeral: 'III',
        classification: 'Géante Gazeuse',
        orbitRadius: 168,
        orbitSpeed: 0.0008,
        size: 18.5,
        color: '#92400e',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#fbbf24',
        atmosphereColor: '#d97706',
        distanceAU: 4.9,
        radiusKm: 63000,
        description: 'Géante gazeuse aux anneaux de poussière de diamant.',
        moons: []
      }
    ]
  },

  // 17. LANKIVEIL // FIEF DES BALEINES DES GLACES
  lankiveil: {
    stars: [
      {
        id: 'lankiveil-star',
        name: 'Tshion (Beta Tucanae)',
        spectralClass: 'F1III',
        starType: 'Étoile Blanche Arctique',
        color: '#38bdf8',
        radius: 22,
        luminosity: 5.5,
        isPrimary: true,
        description: 'Soleil froid illuminant les mers gelées et les icebergs de Lankiveil.'
      }
    ],
    planets: [
      {
        id: 'lankiveil-1',
        name: 'Tshion I (Permafrost)',
        romanNumeral: 'I',
        classification: 'Monde Glaciaire',
        orbitRadius: 52,
        orbitSpeed: 0.003,
        size: 7.8,
        color: '#0284c7',
        surfaceTextureType: 'ice',
        atmosphereColor: '#38bdf8',
        distanceAU: 0.65,
        radiusKm: 4800,
        description: 'Monde rocheux pris sous une gangue de glace permanente.',
        moons: []
      },
      {
        id: 'lankiveil-2',
        name: 'Tshion II // Lankiveil (Fief de Chasse des Baleines)',
        romanNumeral: 'II',
        classification: 'Monde Glaciaire',
        orbitRadius: 94,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.4,
        color: '#0ea5e9',
        surfaceTextureType: 'ice',
        atmosphereColor: '#7dd3fc',
        cloudDensity: 0.7,
        isPrimary: true,
        distanceAU: 1.2,
        radiusKm: 6500,
        description: 'Fief secondaire des Harkonnen gouverné par Rabban la Bête. Chasse aux baleines géantes pour leur fourrure et cuir impérial.',
        moons: [
          {
            id: 'moon-lanki-1',
            name: 'Lune Arctique // Bjonda',
            size: 2.7,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#e0f2fe',
            radiusKm: 1410,
            orbitalPeriodDays: 13.9,
            description: 'Lune polaire commandant les cycles de migration des cétacés des glaces.',
            type: 'natural'
          },
          {
            id: 'station-whaling-depot',
            name: 'Factorerie Orbitale de Traite des Fourrures Harkonnen',
            size: 2.3,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#dc2626',
            radiusKm: 22,
            orbitalPeriodDays: 4.6,
            description: 'Dépôt d\'empaquetage des peaux et huiles de baleines pour la CHOAM.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'lankiveil-3',
        name: 'Tshion III (Borealis)',
        romanNumeral: 'III',
        classification: 'Géante Gazeuse',
        orbitRadius: 172,
        orbitSpeed: 0.0007,
        size: 19.0,
        color: '#0369a1',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#7dd3fc',
        atmosphereColor: '#38bdf8',
        distanceAU: 5.1,
        radiusKm: 65000,
        description: 'Géante glaciale d\'ammoniaque balayée par des aurores boréales perpétuelles.',
        moons: []
      }
    ]
  },

  // 18. CORRIN // CEINTURE DE LA VICTOIRE DU JIHAD
  corrin: {
    stars: [
      {
        id: 'corrin-star',
        name: 'Alpha Sigma Draconis',
        spectralClass: 'G9V',
        starType: 'Étoile Jaune-Orange Historique',
        color: '#eab308',
        radius: 20,
        luminosity: 0.8,
        isPrimary: true,
        description: 'Soleil témoin de la bataille décisive qui vit la chute des Machines Pensantes et l\'avènement de la Maison Corrino.'
      }
    ],
    planets: [
      {
        id: 'corrin-1',
        name: 'Sigma Draconis I (Omnius Waste)',
        romanNumeral: 'I',
        classification: 'Monde Minier',
        orbitRadius: 50,
        orbitSpeed: 0.0031,
        size: 7.2,
        color: '#713f12',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#a16207',
        distanceAU: 0.58,
        radiusKm: 4500,
        description: 'Désert calciné jonché de fonderies de combat détruites.',
        moons: []
      },
      {
        id: 'corrin-2',
        name: 'Sigma Draconis II // Corrin (Mémorial du Jihad Butlérien)',
        romanNumeral: 'II',
        classification: 'Monde Synthétique',
        orbitRadius: 92,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.5,
        color: '#eab308',
        surfaceTextureType: 'synthetic',
        atmosphereColor: '#fde047',
        cloudDensity: 0.4,
        isPrimary: true,
        distanceAU: 1.12,
        radiusKm: 6520,
        description: 'Lieu de la victoire ultime de l\'Humanité contre le réseau Omnius. Ceinture d\'épaves en orbite et stèles commémoratives.',
        moons: [
          {
            id: 'moon-corrin-debris',
            name: 'Ceinture Orbitale des Épaves des Machines',
            size: 3.5,
            orbitRadius: 25,
            orbitSpeed: 0.011,
            color: '#e2e8f0',
            radiusKm: 50,
            orbitalPeriodDays: 2.2,
            description: 'Des millions de coques de vaisseaux de combat mécaniques maintenues en anneau mémorial.',
            type: 'space_station'
          },
          {
            id: 'station-jihad-memorial',
            name: 'Sanctuaire Suprême de la Victoire de Corrin',
            size: 2.2,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#f59e0b',
            radiusKm: 25,
            orbitalPeriodDays: 4.8,
            description: 'Forteresse mémorielle visitée par les souverains du Landsraad.',
            type: 'defense_fortress'
          }
        ]
      },
      {
        id: 'corrin-3',
        name: 'Sigma Draconis III (Titan\'s End)',
        romanNumeral: 'III',
        classification: 'Géante Gazeuse',
        orbitRadius: 170,
        orbitSpeed: 0.0007,
        size: 18.8,
        color: '#854d0e',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#fde047',
        atmosphereColor: '#eab308',
        distanceAU: 5.0,
        radiusKm: 64000,
        description: 'Géante gazeuse aux tourbillons sombres.',
        moons: []
      }
    ]
  },

  // 19. LAMPADAS // ACADÉMIE MENTAT
  lampadas: {
    stars: [
      {
        id: 'lampadas-star',
        name: 'Beta Lampadas',
        spectralClass: 'A2V',
        starType: 'Étoile Blanche Logique',
        color: '#6366f1',
        radius: 22,
        luminosity: 5.0,
        isPrimary: true,
        description: 'Étoile blanche illuminant les bibliothèques mémorielles et centres de calcul pur des Mentats.'
      }
    ],
    planets: [
      {
        id: 'lampadas-1',
        name: 'Beta Lampadas I & II',
        romanNumeral: 'I-II',
        classification: 'Tellurique',
        orbitRadius: 52,
        orbitSpeed: 0.003,
        size: 7.6,
        color: '#4338ca',
        surfaceTextureType: 'industrial',
        atmosphereColor: '#6366f1',
        distanceAU: 0.65,
        radiusKm: 4700,
        description: 'Mondes de stockage de données minérales inaltérables.',
        moons: []
      },
      {
        id: 'lampadas-3',
        name: 'Beta Lampadas III // Lampadas (L\'Archive des Millions de Vies)',
        romanNumeral: 'III',
        classification: 'Monde Synthétique',
        orbitRadius: 94,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.5,
        color: '#6366f1',
        surfaceTextureType: 'synthetic',
        atmosphereColor: '#a5b4fc',
        cloudDensity: 0.45,
        isPrimary: true,
        distanceAU: 1.18,
        radiusKm: 6550,
        description: 'Centre suprême d\'entraînement des Mentats (ordinateurs humains) et sanctuaire des millions de mémoires secondes du Bene Gesserit.',
        moons: [
          {
            id: 'moon-lampadas-1',
            name: 'Lune du Calcul // Ratio',
            size: 2.8,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#c7d2fe',
            radiusKm: 1480,
            orbitalPeriodDays: 14.1,
            description: 'Lune de silence dédiée aux calculs de probabilités stratégiques des Maîtres Mentats.',
            type: 'natural'
          },
          {
            id: 'station-sapho-depot',
            name: 'Raffinerie Orbitale de Jus de Sapho',
            size: 2.1,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#ef4444',
            radiusKm: 18,
            orbitalPeriodDays: 4.8,
            description: 'Station de préparation du puissant extrait de racine activant la prescience logique des Mentats.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'lampadas-4',
        name: 'Beta Lampadas IV (Mnemosyne)',
        romanNumeral: 'IV',
        classification: 'Géante Gazeuse',
        orbitRadius: 170,
        orbitSpeed: 0.0007,
        size: 19.0,
        color: '#312e81',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#a5b4fc',
        atmosphereColor: '#6366f1',
        distanceAU: 5.1,
        radiusKm: 65000,
        description: 'Géante d\'hélium et de méthane froid.',
        moons: []
      }
    ]
  },

  // 20. TUPILE // LE SANCTUAIRE SECRET
  tupile: {
    stars: [
      {
        id: 'tupile-star',
        name: 'Guild Void (Étoile Voilée)',
        spectralClass: 'M0V',
        starType: 'Naine Rouge Camouflée',
        color: '#6b7280',
        radius: 18,
        luminosity: 0.08,
        isPrimary: true,
        description: 'Étoile à l\'emplacement classé secret d\'État, protégée par les traités inviolables de la Guilde Spatiale.'
      }
    ],
    planets: [
      {
        id: 'tupile-1',
        name: 'Guild Void I // Tupile (Sanctuaire des Maisons Déchues)',
        romanNumeral: 'I',
        classification: 'Monde Végétal',
        orbitRadius: 88,
        orbitSpeed: 0.0017,
        rotationSpeed: 0.004,
        size: 14.6,
        color: '#4b5563',
        surfaceTextureType: 'lush',
        atmosphereColor: '#9ca3af',
        cloudDensity: 0.5,
        isPrimary: true,
        distanceAU: 0.95,
        radiusKm: 6560,
        description: 'Le refuge secret inviolable où les Grandes Maisons vaincues peuvent trouver asile perpétuel sous la garantie de la Guilde.',
        moons: [
          {
            id: 'moon-tupile-cloak',
            name: 'Sentinelle de Brouillage Holtzman // Aegis',
            size: 2.9,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#d1d5db',
            radiusKm: 1520,
            orbitalPeriodDays: 14.0,
            description: 'Lune émettant un dôme de distorsion spatiale masquant tout le système.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'tupile-2',
        name: 'Guild Void II (Umbra)',
        romanNumeral: 'II',
        classification: 'Géante Gazeuse',
        orbitRadius: 165,
        orbitSpeed: 0.0008,
        size: 18.5,
        color: '#1f2937',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#9ca3af',
        atmosphereColor: '#6b7280',
        distanceAU: 4.8,
        radiusKm: 63000,
        description: 'Géante gazeuse sombre absorbant les émissions thermiques.',
        moons: []
      }
    ]
  },

  // 21. ALPHA CENTAURI B // ECAZ
  'ecaz-system': {
    stars: [
      {
        id: 'ecaz-star',
        name: 'Alpha Centauri B',
        spectralClass: 'K1V',
        starType: 'Naine Orange Dorée',
        color: '#a855f7',
        radius: 20,
        luminosity: 0.5,
        isPrimary: true,
        description: 'Étoile bienveillante nourrissant la flore luxuriante et les arbres télépathiques Fogwood d\'Ecaz.'
      },
      {
        id: 'ecaz-star-comp',
        name: 'Alpha Centauri A',
        spectralClass: 'G2V',
        starType: 'Naine Jaune (Binaire)',
        color: '#fbbf24',
        radius: 21,
        luminosity: 1.5,
        isPrimary: false,
        orbitRadius: 210,
        orbitSpeed: 0.0003,
        description: 'Étoile binaire dorée éclairant les canopées sculpturales.'
      }
    ],
    planets: [
      {
        id: 'ecaz-1',
        name: 'Alpha Centauri B-I & II',
        romanNumeral: 'I-II',
        classification: 'Monde Végétal',
        orbitRadius: 52,
        orbitSpeed: 0.003,
        size: 7.8,
        color: '#9333ea',
        surfaceTextureType: 'lush',
        atmosphereColor: '#c084fc',
        distanceAU: 0.65,
        radiusKm: 4800,
        description: 'Mondes tropicaux aux mousses végétales bioluminescentes.',
        moons: []
      },
      {
        id: 'ecaz-4',
        name: 'Alpha Centauri B-IV // Ecaz (Paradis des Sculpteurs)',
        romanNumeral: 'IV',
        classification: 'Monde Végétal',
        orbitRadius: 94,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.5,
        color: '#a855f7',
        surfaceTextureType: 'lush',
        atmosphereColor: '#c084fc',
        cloudDensity: 0.55,
        isPrimary: true,
        distanceAU: 1.15,
        radiusKm: 6580,
        description: 'Maison de l\'Archiduc Armand Ecaz. Forêts de bois vivant Fogwood sculptable par la seule force de la pensée et producteur de l\'élixir Semuta.',
        moons: [
          {
            id: 'moon-ecaz-1',
            name: 'Lune d\'Émeraude // Viridia',
            size: 2.8,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#e9d5ff',
            radiusKm: 1480,
            orbitalPeriodDays: 14.0,
            description: 'Lune recouverte d\'algues vertes et de spores aromatiques.',
            type: 'natural'
          },
          {
            id: 'station-fogwood-distillery',
            name: 'Raffinerie Orbitale de Semuta & Fogwood',
            size: 2.2,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#a855f7',
            radiusKm: 22,
            orbitalPeriodDays: 4.8,
            description: 'Comptoir de vente des sculptures vivantes et drogues artistiques pour les Maisons.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'ecaz-5',
        name: 'Alpha Centauri B-V (Botanica)',
        romanNumeral: 'V',
        classification: 'Géante Gazeuse',
        orbitRadius: 170,
        orbitSpeed: 0.0007,
        size: 19.0,
        color: '#6b21a8',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#c084fc',
        atmosphereColor: '#9333ea',
        distanceAU: 5.1,
        radiusKm: 65000,
        description: 'Géante gazeuse aux orages pourpres et anneaux floraux.',
        moons: []
      }
    ]
  },

  // 22. 40 ERIDANI A // RICHESE
  richese: {
    stars: [
      {
        id: 'richese-star-prime',
        name: '40 Eridani A',
        spectralClass: 'K1V',
        starType: 'Naine Orange de Précision',
        color: '#14b8a6',
        radius: 20,
        luminosity: 0.45,
        isPrimary: true,
        description: 'Soleil éclairant les miroirs focaux et manufactures de précision de la Maison Richese.'
      }
    ],
    planets: [
      {
        id: 'richese-1',
        name: '40 Eridani A-I à III',
        romanNumeral: 'I-III',
        classification: 'Monde Minier',
        orbitRadius: 52,
        orbitSpeed: 0.003,
        size: 7.6,
        color: '#0d9488',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#2dd4bf',
        distanceAU: 0.65,
        radiusKm: 4700,
        description: 'Mondes de fonderie de verres optiques et lentilles haute pureté.',
        moons: []
      },
      {
        id: 'richese-4',
        name: '40 Eridani A-IV // Richese (Quatrième Monde / Miroirs Solaires)',
        romanNumeral: 'IV',
        classification: 'Monde Industriel',
        orbitRadius: 94,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.5,
        color: '#14b8a6',
        surfaceTextureType: 'industrial',
        atmosphereColor: '#5eead4',
        cloudDensity: 0.5,
        isPrimary: true,
        distanceAU: 1.2,
        radiusKm: 6550,
        description: 'Rival historique d\'Ix spécialisé dans la miniaturisation extrême, les horloges atomiques de précision et les miroirs spatiaux réfractaires.',
        moons: [
          {
            id: 'moon-richese-mirror',
            name: 'Station Miroir Orbitale // Korona Lens',
            size: 2.9,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#99f6e4',
            radiusKm: 35,
            orbitalPeriodDays: 2.8,
            description: 'Miroir spatial géant concentrant l\'énergie stellaire vers les fonderies au sol.',
            type: 'space_station'
          },
          {
            id: 'station-precision-foundry',
            name: 'Manufactures de Miniaturisation de Korona',
            size: 2.2,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#0f766e',
            radiusKm: 24,
            orbitalPeriodDays: 5.0,
            description: 'Laboratoires de création de micro-lasers et projecteurs d\'holos.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'richese-5',
        name: '40 Eridani A-V (Technos)',
        romanNumeral: 'V',
        classification: 'Géante Gazeuse',
        orbitRadius: 170,
        orbitSpeed: 0.0007,
        size: 18.8,
        color: '#115e59',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#5eead4',
        atmosphereColor: '#14b8a6',
        distanceAU: 5.0,
        radiusKm: 64000,
        description: 'Géante gazeuse fournissant les isotopes de gaz rares pour les lasers de précision.',
        moons: []
      }
    ]
  },

  // 23. TAU CETI / DELTA SAGITTARII // GINAZ
  ginaz: {
    stars: [
      {
        id: 'ginaz-star',
        name: 'Tau Ceti (Soleil de l\'Acier)',
        spectralClass: 'G8.5V',
        starType: 'Naine Jaune Tempérée',
        color: '#eab308',
        radius: 20,
        luminosity: 0.55,
        isPrimary: true,
        description: 'Soleil illuminant les îles d\'entraînement et archipels martiaux de l\'École des Maîtres d\'Armes.'
      }
    ],
    planets: [
      {
        id: 'ginaz-1',
        name: 'Tau Ceti I & II',
        romanNumeral: 'I-II',
        classification: 'Tellurique',
        orbitRadius: 52,
        orbitSpeed: 0.003,
        size: 7.5,
        color: '#ca8a04',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#eab308',
        distanceAU: 0.6,
        radiusKm: 4600,
        description: 'Mondes d\'entraînement en conditions extrêmes de chaleur et d\'acide.',
        moons: []
      },
      {
        id: 'ginaz-4',
        name: 'Tau Ceti IV // Ginaz (L\'Académie des Maîtres d\'Armes)',
        romanNumeral: 'IV',
        classification: 'Monde Océanique',
        orbitRadius: 94,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.5,
        color: '#eab308',
        surfaceTextureType: 'ocean',
        atmosphereColor: '#fde047',
        cloudDensity: 0.55,
        isPrimary: true,
        distanceAU: 1.15,
        radiusKm: 6540,
        description: 'Monde d\'archipels et d\'îles fortifiées abritant la plus prestigieuse école d\'escrime et de duel au bouclier de l\'Empire.',
        moons: [
          {
            id: 'moon-ginaz-blade',
            name: 'Lune du Glaive // Ensis',
            size: 2.8,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#fef08a',
            radiusKm: 1480,
            orbitalPeriodDays: 14.0,
            description: 'Lune d\'épreuves physiques ultimes pour les aspirants du Dixième Niveau.',
            type: 'natural'
          },
          {
            id: 'station-dojo-orbital',
            name: 'Dojo Orbital des Dix Niveaux de Ginaz',
            size: 2.2,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#ca8a04',
            radiusKm: 25,
            orbitalPeriodDays: 4.8,
            description: 'Arène de duel en apesanteur sous bouclier Holtzman.',
            type: 'defense_fortress'
          }
        ]
      },
      {
        id: 'ginaz-5',
        name: 'Tau Ceti V (Bladefall)',
        romanNumeral: 'V',
        classification: 'Géante Gazeuse',
        orbitRadius: 170,
        orbitSpeed: 0.0007,
        size: 18.8,
        color: '#854d0e',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#fde047',
        atmosphereColor: '#eab308',
        distanceAU: 5.1,
        radiusKm: 64000,
        description: 'Géante gazeuse aux orages violents.',
        moons: []
      }
    ]
  },

  // 24. NIUSHE / SIGMA PAVONIS // GRUMMAN
  grumman: {
    stars: [
      {
        id: 'grumman-star',
        name: 'Niushe (Sigma Pavonis)',
        spectralClass: 'G0V',
        starType: 'Étoile Jaune de Sang',
        color: '#b91c1c',
        radius: 20,
        luminosity: 1.05,
        isPrimary: true,
        description: 'Étoile écarlate éclairant les forteresses et ateliers de poisons de la Maison Moritani.'
      }
    ],
    planets: [
      {
        id: 'grumman-1',
        name: 'Niushe I (Ritk Ash)',
        romanNumeral: 'I',
        classification: 'Monde Volcanique',
        orbitRadius: 50,
        orbitSpeed: 0.0031,
        size: 7.2,
        color: '#991b1b',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#dc2626',
        distanceAU: 0.58,
        radiusKm: 4500,
        description: 'Monde volcanique calciné aux vapeurs sulfureuses létales.',
        moons: []
      },
      {
        id: 'grumman-2',
        name: 'Niushe II // Grumman (Fief des Moritani)',
        romanNumeral: 'II',
        classification: 'Monde Industriel',
        orbitRadius: 92,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.5,
        color: '#b91c1c',
        surfaceTextureType: 'industrial',
        atmosphereColor: '#f87171',
        cloudDensity: 0.6,
        isPrimary: true,
        distanceAU: 1.12,
        radiusKm: 6510,
        description: 'Fief du Vicomte Hundro Moritani. Monde d\'obsidienne hérissé de citadelles, connu pour sa cruauté lors des guerres de Kanly.',
        moons: [
          {
            id: 'moon-grumman-1',
            name: 'Lune Noire // Morit',
            size: 2.8,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#7f1d1d',
            radiusKm: 1460,
            orbitalPeriodDays: 14.0,
            description: 'Lune basaltique abritant les arsenaux chimiques clandestins.',
            type: 'natural'
          },
          {
            id: 'station-moritani-citadel',
            name: 'Citadelle Orbitale des Mercenaires de Ritk',
            size: 2.3,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#b91c1c',
            radiusKm: 25,
            orbitalPeriodDays: 4.8,
            description: 'Poste de commandement des escadrons de frappe sans pitié.',
            type: 'defense_fortress'
          }
        ]
      },
      {
        id: 'grumman-3',
        name: 'Niushe III (Poison Mist)',
        romanNumeral: 'III',
        classification: 'Géante Gazeuse',
        orbitRadius: 170,
        orbitSpeed: 0.0007,
        size: 18.8,
        color: '#450a0a',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#f87171',
        atmosphereColor: '#b91c1c',
        distanceAU: 5.0,
        radiusKm: 64000,
        description: 'Géante gazeuse aux tempêtes d\'acide chlorhydrique.',
        moons: []
      }
    ]
  },

  // 25. EPSILON TRIANGULI // KOLHAR
  kolhar: {
    stars: [
      {
        id: 'kolhar-star',
        name: 'Epsilon Trianguli',
        spectralClass: 'A6V',
        starType: 'Étoile Blanche-Bleue Navigatrice',
        color: '#06b6d4',
        radius: 22,
        luminosity: 4.5,
        isPrimary: true,
        description: 'Étoile mythique où Norma Cenva conçut le tout premier moteur de repliement de l\'espace.'
      }
    ],
    planets: [
      {
        id: 'kolhar-1',
        name: 'Epsilon Trianguli I (Inner Forge)',
        romanNumeral: 'I',
        classification: 'Monde Minier',
        orbitRadius: 50,
        orbitSpeed: 0.0031,
        size: 7.5,
        color: '#0891b2',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#06b6d4',
        distanceAU: 0.6,
        radiusKm: 4600,
        description: 'Fonderie de carènes de coques supraluminiques.',
        moons: []
      },
      {
        id: 'kolhar-2',
        name: 'Epsilon Trianguli II // Kolhar (Le Berceau des Navigateurs)',
        romanNumeral: 'II',
        classification: 'Monde Synthétique',
        orbitRadius: 94,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.8,
        color: '#06b6d4',
        surfaceTextureType: 'synthetic',
        atmosphereColor: '#22d3ee',
        cloudDensity: 0.4,
        isPrimary: true,
        distanceAU: 1.15,
        radiusKm: 6650,
        description: 'Premier grand chantier de construction navale de la Guilde Spatiale, né au cours du Jihad Butlérien sous la direction de Norma Cenva.',
        moons: [
          {
            id: 'moon-kolhar-dock',
            name: 'Chantier Spatial Foldspace Alpha',
            size: 3.5,
            orbitRadius: 26,
            orbitSpeed: 0.011,
            color: '#38bdf8',
            radiusKm: 40,
            orbitalPeriodDays: 2.0,
            description: 'Quai de lancement des premiers prototypes de Heighliners.',
            type: 'space_station'
          },
          {
            id: 'station-norma-sanctum',
            name: 'Sanctuaire Stellaire de Norma Cenva',
            size: 2.2,
            orbitRadius: 38,
            orbitSpeed: 0.006,
            color: '#06b6d4',
            radiusKm: 20,
            orbitalPeriodDays: 6.0,
            description: 'Temple orbital vénéré par les Navigateurs de première génération.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'kolhar-3',
        name: 'Epsilon Trianguli III (Vortex)',
        romanNumeral: 'III',
        classification: 'Géante Gazeuse',
        orbitRadius: 172,
        orbitSpeed: 0.0007,
        size: 19.0,
        color: '#0e7490',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#22d3ee',
        atmosphereColor: '#06b6d4',
        distanceAU: 5.1,
        radiusKm: 65000,
        description: 'Géante gazeuse aux tourbillons de plasma bleu.',
        moons: []
      }
    ]
  },

  // 26. GAMMA PISCIUM // HARMONTHEP
  harmonthep: {
    stars: [
      {
        id: 'harmonthep-star',
        name: 'Gamma Piscium',
        spectralClass: 'G9III',
        starType: 'Géante Jaune Déclinante',
        color: '#f59e0b',
        radius: 24,
        luminosity: 12.0,
        isPrimary: true,
        description: 'Soleil géant ancien éclairant les sables mystiques et ruines de Harmonthep.'
      }
    ],
    planets: [
      {
        id: 'harmonthep-1',
        name: 'Gamma Piscium I (Dustlands)',
        romanNumeral: 'I',
        classification: 'Monde Désertique',
        orbitRadius: 54,
        orbitSpeed: 0.0028,
        size: 7.8,
        color: '#d97706',
        surfaceTextureType: 'desert',
        atmosphereColor: '#f59e0b',
        distanceAU: 0.7,
        radiusKm: 4800,
        description: 'Désert brûlant de silicates abrasifs.',
        moons: []
      },
      {
        id: 'harmonthep-2',
        name: 'Gamma Piscium II // Harmonthep (La Sixième Étape Perdue)',
        romanNumeral: 'II',
        classification: 'Monde Désertique',
        orbitRadius: 96,
        orbitSpeed: 0.0015,
        rotationSpeed: 0.004,
        size: 14.5,
        color: '#ea580c',
        surfaceTextureType: 'desert',
        atmosphereColor: '#f97316',
        cloudDensity: 0.3,
        isPrimary: true,
        distanceAU: 1.25,
        radiusKm: 6480,
        description: 'La mystique sixième étape de l\'Exode Zensunni, un monde détruit dont le souvenir est chanté dans les complaintes Fremen.',
        moons: [
          {
            id: 'moon-harmonthep-1',
            name: 'Lune du Pèlerin // Pilgrim\'s Echo',
            size: 2.8,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#fed7aa',
            radiusKm: 1450,
            orbitalPeriodDays: 14.0,
            description: 'Lune désolée marquée par d\'anciennes gravures rupestres Zensunni.',
            type: 'natural'
          }
        ]
      },
      {
        id: 'harmonthep-3',
        name: 'Gamma Piscium III (Sandsong)',
        romanNumeral: 'III',
        classification: 'Géante Gazeuse',
        orbitRadius: 172,
        orbitSpeed: 0.0007,
        size: 18.8,
        color: '#9a3412',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#f97316',
        atmosphereColor: '#ea580c',
        distanceAU: 5.2,
        radiusKm: 64000,
        description: 'Géante aux nuages de poussières résonnantes.',
        moons: []
      }
    ]
  },

  // 27. SOL // OLD EARTH (TERRA / SYNCHRONY)
  terra: {
    stars: [
      {
        id: 'sol-prime',
        name: 'Sol (Le Soleil Antique)',
        spectralClass: 'G2V',
        starType: 'Naine Jaune Berceau de l\'Humanité',
        color: '#fbbf24',
        radius: 20,
        luminosity: 1.0,
        isPrimary: true,
        description: 'Le berceau originel de l\'espèce humaine, source de tous les mythes de l\'Imperium.'
      }
    ],
    planets: [
      {
        id: 'sol-1',
        name: 'Sol I (Mercure)',
        romanNumeral: 'I',
        classification: 'Monde Volcanique',
        orbitRadius: 38,
        orbitSpeed: 0.0042,
        size: 5.5,
        color: '#71717a',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#a1a1aa',
        distanceAU: 0.39,
        radiusKm: 2440,
        description: 'Monde calciné criblé de cratères.',
        moons: []
      },
      {
        id: 'sol-2',
        name: 'Sol II (Vénus)',
        romanNumeral: 'II',
        classification: 'Monde Volcanique',
        orbitRadius: 58,
        orbitSpeed: 0.0028,
        size: 9.2,
        color: '#d97706',
        surfaceTextureType: 'volcanic',
        atmosphereColor: '#fbbf24',
        distanceAU: 0.72,
        radiusKm: 6050,
        description: 'Enfer d\'acide sulfurique sous pression écrasante.',
        moons: []
      },
      {
        id: 'sol-3',
        name: 'Sol III // Old Earth (Terra / Synchrony)',
        romanNumeral: 'III',
        classification: 'Monde Océanique',
        orbitRadius: 92,
        orbitSpeed: 0.0016,
        rotationSpeed: 0.004,
        size: 14.5,
        color: '#0284c7',
        surfaceTextureType: 'ocean',
        atmosphereColor: '#38bdf8',
        cloudDensity: 0.6,
        isPrimary: true,
        distanceAU: 1.0,
        radiusKm: 6371,
        description: 'La Terre des origines, monde légendaire d\'où partirent les premières nefs humaines avant le Jihad Butlérien.',
        moons: [
          {
            id: 'moon-luna-prime',
            name: 'La Lune // Luna',
            size: 3.2,
            orbitRadius: 24,
            orbitSpeed: 0.012,
            color: '#e2e8f0',
            radiusKm: 1737,
            orbitalPeriodDays: 27.3,
            description: 'Le premier satellite naturel foulé par l\'humanité.',
            type: 'natural'
          },
          {
            id: 'station-terra-archive',
            name: 'Station Mémoriale des Anciens Âges',
            size: 2.2,
            orbitRadius: 36,
            orbitSpeed: 0.007,
            color: '#38bdf8',
            radiusKm: 25,
            orbitalPeriodDays: 4.5,
            description: 'Musée historique conservant les reliques d\'avant le Jihad.',
            type: 'space_station'
          }
        ]
      },
      {
        id: 'sol-4',
        name: 'Sol IV (Mars)',
        romanNumeral: 'IV',
        classification: 'Monde Désertique',
        orbitRadius: 130,
        orbitSpeed: 0.0011,
        size: 8.2,
        color: '#ea580c',
        surfaceTextureType: 'desert',
        atmosphereColor: '#f97316',
        distanceAU: 1.52,
        radiusKm: 3390,
        description: 'La planète rouge aux canyons gigantesques et calottes de glace sèche.',
        moons: [
          {
            id: 'moon-phobos',
            name: 'Phobos & Deimos',
            size: 1.4,
            orbitRadius: 18,
            orbitSpeed: 0.018,
            color: '#78716c',
            radiusKm: 22,
            orbitalPeriodDays: 0.3,
            description: 'Astéroïdes capturés en orbite martienne rapide.',
            type: 'natural'
          }
        ]
      },
      {
        id: 'sol-5',
        name: 'Sol V (Jupiter / Titanis)',
        romanNumeral: 'V',
        classification: 'Géante Gazeuse',
        orbitRadius: 180,
        orbitSpeed: 0.0006,
        size: 20.0,
        color: '#d97706',
        surfaceTextureType: 'gas_giant',
        hasRings: true,
        ringColor: '#fbbf24',
        atmosphereColor: '#f59e0b',
        distanceAU: 5.2,
        radiusKm: 71490,
        description: 'La plus grande géante gazeuse du système solaire avec sa Grande Tache Rouge.',
        moons: [
          {
            id: 'moon-europa',
            name: 'Europa & Ganymede',
            size: 2.6,
            orbitRadius: 28,
            orbitSpeed: 0.012,
            color: '#e0f2fe',
            radiusKm: 2634,
            orbitalPeriodDays: 7.1,
            description: 'Lunes glacées renfermant de profonds océans liquides souterrains.',
            type: 'natural'
          }
        ]
      }
    ]
  }
};

/**
 * Procedural Astronomical System Builder for any star system
 * Ensures 100% of star systems (canonical or custom created) have a rich, realistic solar system architecture.
 */
export function getSystemPlanetsAndStars(system: StarSystem): { stars: SystemStar[]; planets: SystemPlanet[] } {
  // If explicitly defined in canonical dictionary, return it
  if (CANONICAL_SYSTEM_ASTRONOMY[system.id]) {
    return CANONICAL_SYSTEM_ASTRONOMY[system.id];
  }

  // If the system object already has its own handcrafted systemStars/systemPlanets
  if (system.systemStars && system.systemStars.length > 0 && system.systemPlanets && system.systemPlanets.length > 0) {
    return {
      stars: system.systemStars,
      planets: system.systemPlanets
    };
  }

  // Otherwise, procedurally generate a high-fidelity planetary system tailored to this world's biome and lore!
  const star: SystemStar = {
    id: `${system.id}-star`,
    name: system.starName,
    spectralClass: system.spectralClass,
    starType: system.starType,
    color: system.starColor,
    radius: Math.max(16, system.starRadius * 2.2),
    luminosity: 1.0,
    isPrimary: true,
    description: `Étoile hôte du système ${system.name.split('//')[0]?.trim() || system.name}.`
  };

  const moons: SystemMoon[] = system.orbitingBodies.map((b, idx) => ({
    id: b.id,
    name: b.name,
    size: b.size,
    orbitRadius: 20 + idx * 11,
    orbitSpeed: (b.speed || 0.008) * 1.5,
    color: b.color || '#d4d4d8',
    radiusKm: Math.round(1000 * b.size),
    orbitalPeriodDays: Math.round(10 + idx * 8),
    description: b.description || 'Satellite naturel ou station orbitale.',
    type: b.type as any
  }));

  if (moons.length === 0) {
    moons.push({
      id: `${system.id}-moon-1`,
      name: `Satellite Principal de ${system.primaryPlanet}`,
      size: 2.8,
      orbitRadius: 24,
      orbitSpeed: 0.011,
      color: '#cbd5e1',
      radiusKm: 1450,
      orbitalPeriodDays: 14.5,
      description: 'Lune rocheuse naturelle en orbite synchrone.',
      type: 'natural'
    });
  }

  const primaryWorld: SystemPlanet = {
    id: `${system.id}-primary-planet`,
    name: system.primaryPlanet,
    romanNumeral: 'III',
    classification: system.surfaceTextureType === 'desert' 
      ? 'Monde Désertique' 
      : system.surfaceTextureType === 'ocean' 
      ? 'Monde Océanique' 
      : system.surfaceTextureType === 'industrial' 
      ? 'Monde Industriel' 
      : system.surfaceTextureType === 'ice' 
      ? 'Monde Glaciaire' 
      : system.surfaceTextureType === 'volcanic' 
      ? 'Monde Volcanique' 
      : system.surfaceTextureType === 'synthetic' 
      ? 'Monde Synthétique' 
      : system.surfaceTextureType === 'gas_giant' 
      ? 'Géante Gazeuse' 
      : 'Tellurique',
    orbitRadius: 92,
    orbitSpeed: 0.0016,
    rotationSpeed: 0.004,
    size: 14.5,
    color: system.atmosphereColor,
    surfaceTextureType: system.surfaceTextureType,
    hasRings: system.hasRings,
    ringColor: system.ringColor,
    atmosphereColor: system.atmosphereColor,
    cloudDensity: system.cloudDensity ?? 0.55,
    isPrimary: true,
    distanceAU: 1.15,
    radiusKm: system.planetaryMetrics?.diameterKm ? Math.round(system.planetaryMetrics.diameterKm / 2) : 6400,
    description: system.description,
    moons: moons
  };

  // Inner Rocky Planet
  const innerPlanet: SystemPlanet = {
    id: `${system.id}-inner-1`,
    name: `${system.starName} I (Infernus)`,
    romanNumeral: 'I',
    classification: 'Monde Volcanique',
    orbitRadius: 48,
    orbitSpeed: 0.0035,
    size: 7.2,
    color: '#b91c1c',
    surfaceTextureType: 'volcanic',
    atmosphereColor: '#dc2626',
    distanceAU: 0.52,
    radiusKm: 4200,
    description: 'Monde tellurique calciné proche de l\'étoile centrale.',
    moons: []
  };

  // Outer Gas Giant
  const outerGasGiant: SystemPlanet = {
    id: `${system.id}-outer-gas`,
    name: `${system.starName} IV (Titanis)`,
    romanNumeral: 'IV',
    classification: 'Géante Gazeuse',
    orbitRadius: 165,
    orbitSpeed: 0.0008,
    size: 18.5,
    color: '#0284c7',
    surfaceTextureType: 'gas_giant',
    hasRings: true,
    ringColor: '#38bdf8',
    atmosphereColor: '#7dd3fc',
    distanceAU: 5.0,
    radiusKm: 65000,
    description: 'Géante gazeuse massive aux anneaux de glaces et bandes orageuses.',
    moons: [
      {
        id: `${system.id}-gas-moon-1`,
        name: `Titanis Alpha`,
        size: 2.4,
        orbitRadius: 26,
        orbitSpeed: 0.012,
        color: '#e2e8f0',
        radiusKm: 1350,
        orbitalPeriodDays: 8.5,
        description: 'Lune glaciale en orbite équatoriale.',
        type: 'natural'
      }
    ]
  };

  return {
    stars: [star],
    planets: [innerPlanet, primaryWorld, outerGasGiant]
  };
}
