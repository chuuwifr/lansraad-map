import { HouseInfo, StarSystem } from '../types/landsraad';

export const HOUSES_DATA: Record<string, HouseInfo> = {
  atreides: {
    id: 'atreides',
    name: 'Maison Atréides',
    shortName: 'Atréides',
    sigil: '🦅',
    color: '#10b981', // Hawk Green & Black
    accentColor: '#34d399',
    homeworld: 'Caladan',
    capitalSystemId: 'caladan',
    ruler: 'Duc Leto Atréides',
    titles: 'Gouverneur Fief d\'Arrakis, Seigneur de Caladan',
    territoryInfluenceRadius: 110,
    voteWeight: 142,
    spiceStockKg: 85400,
    militaryRating: 88,
    choamSharesPercent: 12.4,
    ideology: 'Honneur, loyauté martiale, diplomatie féodale, justice',
    description: 'Grande Maison d\'honneur respectée du Landsraad. Réputée pour ses officiers dévoués (Duncan Idaho, Gurney Halleck, Thufir Hawat), sa flotte agile et sa loyauté inébranlable.',
    bannerQuote: '« Il n\'est de paix qu\'au tranchant de la vertu. »'
  },
  harkonnen: {
    id: 'harkonnen',
    name: 'Maison Harkonnen',
    shortName: 'Harkonnen',
    sigil: '⚡',
    color: '#dc2626', // Blue/Black & Crimson
    accentColor: '#ef4444',
    homeworld: 'Giedi Prime',
    capitalSystemId: 'giedi-prime',
    ruler: 'Baron Vladimir Harkonnen',
    titles: 'Souverain de Giedi Prime & Lankiveil, Ancien Gouverneur d\'Arrakis',
    territoryInfluenceRadius: 130,
    voteWeight: 168,
    spiceStockKg: 340000,
    militaryRating: 92,
    choamSharesPercent: 18.2,
    ideology: 'Oppression industrielle, profit impitoyable, machiavélisme',
    description: 'Grande Maison d\'une immense richesse bâtie sur un siècle d\'extraction brute d\'Épice sur Arrakis et la traite des fourrures de baleines de Lankiveil. Armée massive, poisons foudroyants et maîtres du Kanly.',
    bannerQuote: '« Ce qui ne cède pas sous la force pliera sous la douleur. »'
  },
  corrino: {
    id: 'corrino',
    name: 'Maison Impériale Corrino',
    shortName: 'Corrino',
    sigil: '👑',
    color: '#f59e0b', // Imperial Gold & Amethyst
    accentColor: '#fbbf24',
    homeworld: 'Kaitain',
    capitalSystemId: 'kaitain',
    ruler: 'Padishah Empereur Shaddam IV',
    titles: 'Empereur Padishah de l\'Univers Connu, Duc de Salusa Secundus & Corrin',
    territoryInfluenceRadius: 150,
    voteWeight: 200,
    spiceStockKg: 950000,
    militaryRating: 98,
    choamSharesPercent: 24.5,
    ideology: 'Hégémonie impériale absolue, contrôle de la balance des pouvoirs',
    description: 'La dynastie régnante de l\'Imperium depuis la bataille de Corrin mettant fin au Jihad Butlérien. S\'appuie sur la terreur des légions de Sardaukars forgés sur Salusa Secundus.',
    bannerQuote: '« Que la volonté du Trône du Lion d\'Or ordonne les étoiles. »'
  },
  guild: {
    id: 'guild',
    name: 'Guilde Spatiale (Spacing Guild)',
    shortName: 'Guilde',
    sigil: '🌀',
    color: '#06b6d4', // Spacing Cyan / Folded Space
    accentColor: '#22d3ee',
    homeworld: 'Junction',
    capitalSystemId: 'junction',
    ruler: 'Haut Conseil des Navigateurs',
    titles: 'Monopole Absolu du Voyage Supraluminique et Bancaire',
    territoryInfluenceRadius: 160,
    voteWeight: 110,
    spiceStockKg: 2400000,
    militaryRating: 75,
    choamSharesPercent: 15.0,
    ideology: 'Neutralité stricte, dépendance critique au Mélange, prescience mathématique',
    description: 'Détient le monopole absolu du transport spatial supraluminique grâce aux Navigateurs mutants saturés de gaz d\'Épice qui replient l\'espace instantanément sans ordinateurs.',
    bannerQuote: '« L\'Épice doit couler. Sans navigation, l\'Empire s\'éteint. »'
  },
  bene_gesserit: {
    id: 'bene_gesserit',
    name: 'Ordre du Bene Gesserit',
    shortName: 'Bene Gesserit',
    sigil: '👁️',
    color: '#8b5cf6', // Indigo / Voice Purple
    accentColor: '#a78bfa',
    homeworld: 'Wallach IX',
    capitalSystemId: 'wallach-ix',
    ruler: 'Révérende Mère Supérieure Gaius Helen Mohiam',
    titles: 'Gardiennes du Programme Génétique, Éminences Grises',
    territoryInfluenceRadius: 95,
    voteWeight: 95,
    spiceStockKg: 120000,
    militaryRating: 84,
    choamSharesPercent: 7.8,
    ideology: 'Conditionnement Prana-Bindu, sélection eugénique, prescience contrôlée',
    description: 'Organisation matriarcale secrète façonnant l\'avenir politique des Grandes Maisons par l\'éducation des épouses impériales, la Voix et leur plan millénaire du Kwisatz Haderach.',
    bannerQuote: '« Nous existons pour servir l\'humanité, même malgré elle. »'
  },
  fremen: {
    id: 'fremen',
    name: 'Tribus Fremen d\'Arrakis (Zensunni)',
    shortName: 'Fremen',
    sigil: '🦂',
    color: '#f97316', // Deep Ochre & Blue-in-Blue eyes
    accentColor: '#fb923c',
    homeworld: 'Arrakis',
    capitalSystemId: 'arrakis',
    ruler: 'Naib Stilgar / Paul Muad\'Dib',
    titles: 'Gardiens du Désert Profond, Cavaliers de Shai-Hulud, Descendants Zensunni',
    territoryInfluenceRadius: 85,
    voteWeight: 25,
    spiceStockKg: 620000,
    militaryRating: 96,
    choamSharesPercent: 2.1,
    ideology: 'Discipline de l\'eau, culte de Shai-Hulud, prophétie messianique',
    description: 'Les guerriers les plus redoutables de l\'Imperium, endurcis par des millénaires d\'exode Zensunni à travers Poritrin, Rossak, Bela Tegeuse jusqu\'aux sables d\'Arrakis.',
    bannerQuote: '« L\'eau d\'un homme appartient à sa tribu. »'
  },
  ix: {
    id: 'ix',
    name: 'Confédération d\'Ix (Maison Vernius)',
    shortName: 'Ix',
    sigil: '⚙️',
    color: '#38bdf8', // Cyber Blue / Silver
    accentColor: '#7dd3fc',
    homeworld: 'Ix',
    capitalSystemId: 'ix',
    ruler: 'Haut Technocrate Rhombur Vernius',
    titles: 'Maîtres de la Cyber-mécanique et de la Non-Technologie',
    territoryInfluenceRadius: 105,
    voteWeight: 80,
    spiceStockKg: 95000,
    militaryRating: 80,
    choamSharesPercent: 11.0,
    ideology: 'Prouesse technologique à la frontière des interdits butlériens',
    description: 'Fabricants des Heighliners de la Guilde, des Sondes T-Probes, des générateurs de boucliers Holtzman et des complexes souterrains inviolables.',
    bannerQuote: '« La machine intelligente est maudite ; la machine parfaite est notre création. »'
  },
  tleilax: {
    id: 'tleilax',
    name: 'Bene Tleilax',
    shortName: 'Tleilaxu',
    sigil: '🧬',
    color: '#ec4899', // Bio-magenta & Grey
    accentColor: '#f472b6',
    homeworld: 'Tleilax',
    capitalSystemId: 'tleilax-prime',
    ruler: 'Maître Hidar Fen Ajidica',
    titles: 'Généticiens des Cuves Axlotl, Créateurs de Gholas',
    territoryInfluenceRadius: 90,
    voteWeight: 40,
    spiceStockKg: 180000,
    militaryRating: 70,
    choamSharesPercent: 4.5,
    ideology: 'Fanatisme religieux xénophobe, biotechnologie clandestine',
    description: 'Artisans génétiques méprisés mais indispensables créant Danseurs-Visages, Gholas et organes synthétiques dans le secret absolu de leurs cuves Axlotl.',
    bannerQuote: '« La chair est malléable aux yeux de Dieu. »'
  },
  ecaz: {
    id: 'ecaz',
    name: 'Maison Ecaz',
    shortName: 'Ecaz',
    sigil: '🌺',
    color: '#a855f7',
    accentColor: '#c084fc',
    homeworld: 'Ecaz',
    capitalSystemId: 'ecaz-system',
    ruler: 'Archiduc Armand Ecaz',
    titles: 'Seigneur des Bois Fogwood et des Élixirs Rares',
    territoryInfluenceRadius: 80,
    voteWeight: 75,
    spiceStockKg: 65000,
    militaryRating: 68,
    choamSharesPercent: 4.5,
    ideology: 'Botanique de prestige, diplomatie d\'alliance, art sculpté vivant',
    description: 'Producteurs du puissant narcotique Semuta, du bois télépathique Fogwood et alliés fidèles des Atréides dans la guerre d\'usure contre les Moritani.',
    bannerQuote: '« La beauté transcende la corruption du pouvoir. »'
  },
  richese: {
    id: 'richese',
    name: 'Maison Richese',
    shortName: 'Richese',
    sigil: '🔬',
    color: '#14b8a6', // Teal
    accentColor: '#2dd4bf',
    homeworld: 'Richese',
    capitalSystemId: 'richese',
    ruler: 'Comte Ilban Richese',
    titles: 'Maîtres de la Miniaturisation et des Miroirs Focaux',
    territoryInfluenceRadius: 75,
    voteWeight: 65,
    spiceStockKg: 82000,
    militaryRating: 72,
    choamSharesPercent: 6.2,
    ideology: 'Science optique et micro-mécanique de précision',
    description: 'Rival historique d\'Ix spécialisé dans la miniaturisation extrême, les lentilles lumineuses, les horloges de précision et les armes légères.',
    bannerQuote: '« La petitesse contient l\'infinité du monde. »'
  },
  ginaz: {
    id: 'ginaz',
    name: 'Maison Ginaz (Maîtres d\'Armes)',
    shortName: 'Ginaz',
    sigil: '⚔️',
    color: '#eab308', // Gold Sword
    accentColor: '#fde047',
    homeworld: 'Ginaz',
    capitalSystemId: 'ginaz',
    ruler: 'Grand Maître de l\'Académie de Ginaz',
    titles: 'Instructeurs des Dix Niveaux de Maîtrise d\'Armes',
    territoryInfluenceRadius: 65,
    voteWeight: 45,
    spiceStockKg: 35000,
    militaryRating: 94,
    choamSharesPercent: 3.0,
    ideology: 'Discipline du bouclier, perfection du duel, code de l\'honneur',
    description: 'L\'école militaire la plus réputée de tout l\'Imperium. C\'est ici que furent formés Duncan Idaho et les plus grands maîtres d\'escrime des Maisons souveraines.',
    bannerQuote: '« L\'acier ne ment jamais. Le bouclier est ton souffle. »'
  },
  moritani: {
    id: 'moritani',
    name: 'Maison Moritani (Grumman)',
    shortName: 'Moritani',
    sigil: '🩸',
    color: '#b91c1c', // Crimson
    accentColor: '#f87171',
    homeworld: 'Grumman',
    capitalSystemId: 'grumman',
    ruler: 'Vicomte Hundro Moritani',
    titles: 'Seigneur de Grumman, Maître des Armes Chimiques',
    territoryInfluenceRadius: 85,
    voteWeight: 55,
    spiceStockKg: 98000,
    militaryRating: 82,
    choamSharesPercent: 5.0,
    ideology: 'Guerre totale Kanly sans quartier, sabotage, terreur',
    description: 'Maison belliqueuse célèbre pour son mépris des conventions du Landsraad, son recours aux mercenaires et sa haine féroce envers la Maison Ecaz.',
    bannerQuote: '« Que la cendre recouvre leurs palais. »'
  }
};

export const STAR_SYSTEMS_DATA: StarSystem[] = [
  // 1. ARRAKIS (DUNE) - Canopus
  {
    id: 'arrakis',
    name: 'Canopus // Arrakis (Dune, Rakis)',
    starName: 'Alpha Carinae (Canopus)',
    starType: 'Supergéante Blanche-Jaune (Canopus F0II)',
    spectralClass: 'F0II',
    starColor: '#fffbeb',
    starRadius: 9.0,
    primaryPlanet: 'Arrakis (Dune)',
    coordinates: [0, 0, 0], // Center of galactic interest
    controllingHouse: 'atreides',
    strategicImportance: 'Crucial',
    distanceFromTerraLy: 310,
    distanceFromArrakisLy: 0,
    guildTariffSolaris: 42000,
    spiceOutputPerCycle: 14800,
    defenseShieldActive: true,
    fleetCount: 24,
    description: 'L\'unique source connue de l\'Épice Mélange dans tout l\'univers connu. Un monde désertique brutal habité par les mystérieux Fremen et les gigantesques Vers des Sables (Shai-Hulud).',
    atmosphereColor: '#ea580c',
    surfaceTextureType: 'desert',
    moonsCount: 2,
    planetaryMetrics: {
      diameterKm: 12750,
      gravityG: 0.98,
      dayLengthHours: 22.4,
      yearLengthDays: 312,
      surfaceTempAvgC: 58,
      atmosphereComposition: '74.3% N2, 22.8% O2, 1.5% Ar, 0.4% CO2, traces de Mélange',
      populationTotal: '15.2 Millions (dont tribus du désert profond)',
      capitalSettlement: 'Palais d\'Arrakeen',
      primaryExports: ['Épice Mélange (100% du marché)', 'Verre du Désert', 'Tissus Fremen']
    },
    loreSnippet: 'Arrakis, Dune, la planète des sables. Celui qui contrôle l\'Épice contrôle l\'Univers.',
    orbitingBodies: [
      {
        id: 'moon-krelln',
        name: 'Premier Satellite // Krelln (Lune du Poing)',
        type: 'moon',
        radius: 65,
        size: 3.2,
        speed: 0.008,
        color: '#d4d4d8',
        description: 'Lune rocheuse blanche avec cratère d\'impact évoquant un poing fermé.'
      },
      {
        id: 'moon-arane',
        name: 'Deuxième Satellite // Arane (Lune de la Souris Muad\'Dib)',
        type: 'moon',
        radius: 88,
        size: 2.1,
        speed: 0.005,
        color: '#a1a1aa',
        description: 'Petite lune dont les mers sombres dessinent la silhouette de la souris des sables.'
      },
      {
        id: 'heighliner-station',
        name: 'Heighliner de la Guilde en Rade Orbitale',
        type: 'heighliner_dock',
        radius: 110,
        size: 4.8,
        speed: 0.002,
        color: '#06b6d4',
        description: 'Vaisseau de saut supraluminique de classe Titan stationné en orbite synchrone.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-arrakeen',
        name: 'Palais Impérial d\'Arrakeen',
        type: 'capital',
        controllingHouse: 'atreides',
        coordinates: [18.2, 24.5],
        securityLevel: 'MAXIMAL',
        population: '4.2 Millions',
        description: 'Capitale administrative et siège de la garnison Atréides. Protégée par le massif naturel de la Falaise du Bouclier.',
        tacticalNotes: 'Boucliers de défense active Holtzman configurés. Risque d\'infiltration par des chasseurs-tueurs Harkonnen.',
        threatLevel: 'Modéré',
        wormSignActivity: 'Nulle'
      },
      {
        id: 'poi-shield-wall',
        name: 'La Falaise du Bouclier (Shield Wall)',
        type: 'shield_wall',
        controllingHouse: 'atreides',
        coordinates: [14.0, 19.8],
        securityLevel: 'IMPERIAL',
        description: 'Immense chaîne montagneuse protégeant le bassin nord d\'Arrakeen contre les tempêtes de Coriolis et les vers géants.',
        tacticalNotes: 'Point géostratégique critique : une brèche atomique exposerait tout le bassin impérial aux vers de sable.',
        threatLevel: 'Critique',
        wormSignActivity: 'Basse'
      },
      {
        id: 'poi-carthag',
        name: 'Citadelle de Carthag',
        type: 'military_base',
        controllingHouse: 'harkonnen',
        coordinates: [-8.4, 42.1],
        securityLevel: 'CONTESTED',
        population: '2.8 Millions',
        description: 'Ancienne forteresse Harkonnen, centre de torture et de commandement des moissonneuses lourdes.',
        tacticalNotes: 'Cellules dormantes Harkonnen suspectées. Dépôts clandestins de pièces d\'ornithoptères.',
        threatLevel: 'Critique',
        wormSignActivity: 'Nulle'
      },
      {
        id: 'poi-sietch-tabr',
        name: 'Sietch Tabr',
        type: 'sietch',
        controllingHouse: 'fremen',
        coordinates: [-28.6, -54.2],
        securityLevel: 'CLANDESTINE',
        population: '22 000 Fremen',
        description: 'Refuge troglodyte majeur des Fremen dirigé par le Naib Stilgar. Possède l\'un des plus grands bassins de captage d\'eau de condensation.',
        tacticalNotes: 'Inaccessible sans guide Fremen. Entouré de champs de mines vibratoires et de postes de guet.',
        threatLevel: 'Faible',
        wormSignActivity: 'Tracé Sismique Détecté'
      },
      {
        id: 'poi-great-flat',
        name: 'Bassin du Grand Erg // Champ d\'Épice Alpha',
        type: 'spice_field',
        controllingHouse: 'atreides',
        coordinates: [-45.1, 12.0],
        securityLevel: 'CONTESTED',
        spiceDensity: 94,
        description: 'Zone de gisements ultra-denses de Mélange avec éruptions explosives périodiques (Spice Blows).',
        tacticalNotes: 'Activité de Shai-Hulud quasi-continue dès le démarrage des moissonneuses.',
        threatLevel: 'Cataclysmique',
        wormSignActivity: 'Alerte Shai-Hulud'
      },
      {
        id: 'poi-spaceport-arrakis',
        name: 'Port Spatial de la Guilde de Canopus',
        type: 'spaceport',
        controllingHouse: 'guild',
        coordinates: [22.8, 30.1],
        securityLevel: 'IMPERIAL',
        description: 'Plateforme orbitale d\'amarrage pour les barges des Heighliners de la Guilde.',
        tacticalNotes: 'Zone de neutralité absolue sous mandat conjoint Landsraad/Guilde.',
        threatLevel: 'Faible',
        wormSignActivity: 'Nulle'
      }
    ]
  },

  // 2. CALADAN - Delta Pavonis
  {
    id: 'caladan',
    name: 'Delta Pavonis // Caladan (Dan)',
    starName: 'Delta Pavonis (Étoile du Paon)',
    starType: 'Sous-géante Jaune Dorée (G8V)',
    spectralClass: 'G8V',
    starColor: '#fef08a',
    starRadius: 7.2,
    primaryPlanet: 'Caladan (Fief Ancestral Atréides)',
    coordinates: [-180, 75, -95],
    controllingHouse: 'atreides',
    strategicImportance: 'Majeur',
    distanceFromTerraLy: 19.9,
    distanceFromArrakisLy: 312,
    guildTariffSolaris: 18500,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 16,
    description: 'Troisième planète de Delta Pavonis. Monde océanique verdoyant et tempétueux, riche en ressources hydro-agricoles (riz Pundi, vin de Caladan). Berceau de 26 générations de ducs Atréides.',
    atmosphereColor: '#0ea5e9',
    surfaceTextureType: 'ocean',
    moonsCount: 1,
    planetaryMetrics: {
      diameterKm: 13200,
      gravityG: 1.02,
      dayLengthHours: 24.1,
      yearLengthDays: 374,
      surfaceTempAvgC: 19,
      atmosphereComposition: '78.1% N2, 20.9% O2, 0.9% Ar, 0.04% CO2, humidité 92%',
      populationTotal: '1.2 Milliards',
      capitalSettlement: 'Château Caladan',
      primaryExports: ['Riz Pundi', 'Vins de Caladan', 'Bois de Cala', 'Officiers Militaires']
    },
    loreSnippet: 'Sur Caladan, nous n\'avions pas besoin de penser à l\'eau : elle tombait du ciel.',
    orbitingBodies: [
      {
        id: 'moon-cala',
        name: 'Lune Océanique // Cala',
        type: 'moon',
        radius: 70,
        size: 3.5,
        speed: 0.006,
        color: '#bae6fd',
        description: 'Lune générant les grandes marées caladaniennes propices à l\'agriculture marine.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-castle-caladan',
        name: 'Château Caladan & Falaises de Cala',
        type: 'capital',
        controllingHouse: 'atreides',
        coordinates: [45.0, -12.0],
        securityLevel: 'MAXIMAL',
        population: '850 000',
        description: 'Forteresse de pierre ancestrale surplombant l\'océan mondial de Caladan.',
        tacticalNotes: 'Garnison de vétérans loyaux et académies d\'entraînement de maîtres d\'armes.',
        threatLevel: 'Faible'
      },
      {
        id: 'poi-pundi-basin',
        name: 'Grands Bassins de Riz Pundi & Vignobles',
        type: 'industrial',
        controllingHouse: 'atreides',
        coordinates: [12.5, 60.2],
        securityLevel: 'HIGH',
        description: 'Principale zone d\'exportation agricole vers le Trône Impérial et CHOAM.',
        tacticalNotes: 'Rendements stables, météo sous contrôle d\'ingénierie météorologique.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 3. GIEDI PRIME - 36 Ophiuchi B
  {
    id: 'giedi-prime',
    name: '36 Ophiuchi B // Giedi Prime (Gammu)',
    starName: '36 Ophiuchi B (Naine K)',
    starType: 'Étoile Naine Orange-Sombre Ultraviolette',
    spectralClass: 'K1V',
    starColor: '#f97316',
    starRadius: 6.8,
    primaryPlanet: 'Giedi Prime (Ogygos / Gammu)',
    coordinates: [160, -85, 120],
    controllingHouse: 'harkonnen',
    strategicImportance: 'Majeur',
    distanceFromTerraLy: 19.5,
    distanceFromArrakisLy: 295,
    guildTariffSolaris: 22000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 38,
    description: 'Monde dystopique hyper-industrialisé sans végétation naturelle. Atmosphère polluée baignée par une lumière monochrome. Cœur de la machine de guerre Harkonnen.',
    atmosphereColor: '#991b1b',
    surfaceTextureType: 'industrial',
    moonsCount: 3,
    planetaryMetrics: {
      diameterKm: 14500,
      gravityG: 1.15,
      dayLengthHours: 26.2,
      yearLengthDays: 410,
      surfaceTempAvgC: 32,
      atmosphereComposition: '71% N2, 17% O2, 6% CO2, 4% Gaz Soufrés & Particules de Carbone',
      populationTotal: '3.4 Milliards d\'esclaves et ouvriers matriculés',
      capitalSettlement: 'Baronie de Harko City',
      primaryExports: ['Armement Lourd', 'Alliages d\'Obsidienne', 'Machines de Guerre', 'Esclaves Combattants']
    },
    loreSnippet: 'Un enfer de suie et d\'acier où les hommes sont des engrenages jetables.',
    orbitingBodies: [
      {
        id: 'moon-harko-1',
        name: 'Lune Minière // Giedi Minor I',
        type: 'moon',
        radius: 65,
        size: 2.8,
        speed: 0.009,
        color: '#71717a',
        description: 'Station de forage d\'uranium et de métaux lourds sans atmosphère.'
      },
      {
        id: 'moon-harko-2',
        name: 'Lune Fonderie // Giedi Minor II',
        type: 'moon',
        radius: 95,
        size: 3.4,
        speed: 0.005,
        color: '#52525b',
        description: 'Fourneaux orbitaux fonctionnant à flux continu.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-harko-citadel',
        name: 'Baronie & Citadelle Noire de Harko',
        type: 'capital',
        controllingHouse: 'harkonnen',
        coordinates: [52.1, 8.4],
        securityLevel: 'MAXIMAL',
        population: '12.5 Millions',
        description: 'Quartier général imprenable du Baron Vladimir Harkonnen et de Feyd-Rautha.',
        tacticalNotes: 'Boucliers thermo-cinétiques multiples et garnisons de gardes d\'élite.',
        threatLevel: 'Faible'
      },
      {
        id: 'poi-arena-harko',
        name: 'Arène des Gladiateurs de Harko',
        type: 'sacred_site',
        controllingHouse: 'harkonnen',
        coordinates: [50.2, 10.1],
        securityLevel: 'HIGH',
        population: '150 000 Spectateurs',
        description: 'Colisée brutal où les esclaves et prisonniers de guerre s\'affrontent pour le divertissement de la cour.',
        tacticalNotes: 'Dispositif de sécurité sous drogue elacca pour neutraliser les combattants.',
        threatLevel: 'Modéré'
      },
      {
        id: 'poi-slave-pits',
        name: 'Fosses Minières & Puits d\'Esclaves d\'Obsidienne',
        type: 'industrial',
        controllingHouse: 'harkonnen',
        coordinates: [-22.0, 85.0],
        securityLevel: 'MAXIMAL',
        description: 'Gigantesques usines d\'armement lourd et de forgeage d\'alliages haute résistance.',
        tacticalNotes: 'Surveillance par implants neuraux et drones de suppression.',
        threatLevel: 'Modéré'
      }
    ]
  },

  // 4. KAITAIN - 36 Ophiuchi A
  {
    id: 'kaitain',
    name: '36 Ophiuchi A // Kaitain',
    starName: '36 Ophiuchi A (Étoile Impériale Dorée)',
    starType: 'Étoile Dorée Super-lumineuse (F5V)',
    spectralClass: 'F5V',
    starColor: '#fde047',
    starRadius: 8.4,
    primaryPlanet: 'Kaitain (Capitale Impériale)',
    coordinates: [40, 140, -40],
    controllingHouse: 'corrino',
    strategicImportance: 'Crucial',
    distanceFromTerraLy: 19.5,
    distanceFromArrakisLy: 305,
    guildTariffSolaris: 12000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 52,
    description: 'Le joyau éblouissant de l\'Imperium. Siège du Trône du Lion d\'Or de Shaddam IV et du Haut Conseil du Landsraad. Climat et architecture d\'une perfection artificielle totale.',
    atmosphereColor: '#eab308',
    surfaceTextureType: 'imperial',
    moonsCount: 4,
    planetaryMetrics: {
      diameterKm: 13800,
      gravityG: 0.99,
      dayLengthHours: 24.0,
      yearLengthDays: 365,
      surfaceTempAvgC: 22,
      atmosphereComposition: '78% N2, 21% O2, 0.9% Ar, Climat régulé par satellites orbitaux',
      populationTotal: '850 Millions de nobles, sénateurs et dignitaires',
      capitalSettlement: 'Cité Impériale de Korona',
      primaryExports: ['Monnaie Impériale (Solaris)', 'Décrets du Landsraad', 'Art Pré-Butlérien', 'Diplomatie']
    },
    loreSnippet: 'Ici se joue le destin de mille mondes sous les voûtes de marbre et d\'or.',
    orbitingBodies: [
      {
        id: 'moon-korona-1',
        name: 'Lune Impériale // Solaria',
        type: 'moon',
        radius: 65,
        size: 3.0,
        speed: 0.007,
        color: '#fef08a',
        description: 'Lune réservée aux ambassades du Landsraad.'
      },
      {
        id: 'moon-korona-2',
        name: 'Lune Gardienne // Sardaukar Prime Station',
        type: 'space_station',
        radius: 90,
        size: 2.2,
        speed: 0.004,
        color: '#f59e0b',
        description: 'Forteresse orbitale de la Garde Impériale.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-golden-lion-throne',
        name: 'Palais du Trône du Lion d\'Or',
        type: 'capital',
        controllingHouse: 'corrino',
        coordinates: [10.0, 0.0],
        securityLevel: 'IMPERIAL',
        population: '3.0 Millions',
        description: 'Résidence de l\'Empereur Padishah Shaddam IV et de la princesse Irulan.',
        tacticalNotes: 'Protégé 24/7 par 3 légions de Gardes Sardaukars impériaux.',
        threatLevel: 'Faible'
      },
      {
        id: 'poi-landsraad-hall',
        name: 'Hémicycle Suprême du Landsraad',
        type: 'capital',
        controllingHouse: 'corrino',
        coordinates: [10.5, 1.2],
        securityLevel: 'IMPERIAL',
        description: 'Chambre de débat parlementaire où les Grandes et Petites Maisons votent les décrets universels.',
        tacticalNotes: 'Zone de paix assermentée régie par le statut de la Grande Trêve.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 5. SALUSA SECUNDUS - Gamma Waiping
  {
    id: 'salusa-secundus',
    name: 'Gamma Waiping // Salusa Secundus',
    starName: 'Gamma Waiping',
    starType: 'Étoile Naine Rouge Sombre (M2V)',
    spectralClass: 'M2V',
    starColor: '#f87171',
    starRadius: 6.0,
    primaryPlanet: 'Salusa Secundus (Planète-Prison Corrino)',
    coordinates: [95, 110, -130],
    controllingHouse: 'corrino',
    strategicImportance: 'Majeur',
    distanceFromTerraLy: 85,
    distanceFromArrakisLy: 380,
    guildTariffSolaris: 35000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 44,
    description: 'Ancienne capitale détruite par des guerres atomiques, devenue la planète-prison impériale la plus impitoyable. Terrain d\'entraînement secret des légions Sardaukars.',
    atmosphereColor: '#78716c',
    surfaceTextureType: 'volcanic',
    moonsCount: 2,
    planetaryMetrics: {
      diameterKm: 11900,
      gravityG: 1.25,
      dayLengthHours: 29.5,
      yearLengthDays: 440,
      surfaceTempAvgC: -12,
      atmosphereComposition: '72% N2, 19% O2, 5% Cendres radioactives, tempêtes toxiques',
      populationTotal: '45 Millions de prisonniers de haute sécurité',
      capitalSettlement: 'Forteresse Noire de Salusa',
      primaryExports: ['Légions Sardaukars', 'Minéraux Radioactifs', 'Condamnés Militaires']
    },
    loreSnippet: 'Seuls 6 hommes sur 10 survivent à leur première année sur Salusa. Les survivants deviennent des Sardaukars.',
    orbitingBodies: [
      {
        id: 'moon-salusa-1',
        name: 'Lune Sentinelle // Gorgon',
        type: 'moon',
        radius: 60,
        size: 2.2,
        speed: 0.007,
        color: '#a8a29e',
        description: 'Poste de surveillance équipé de canons laser orbitaux.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-sardaukar-crucible',
        name: 'Le Creuset de Sélection Sardaukar',
        type: 'military_base',
        controllingHouse: 'corrino',
        coordinates: [-15.0, 33.0],
        securityLevel: 'MAXIMAL',
        description: 'Camp d\'entraînement de combat extrême à balles réelles et survie en milieu radioactif.',
        tacticalNotes: 'Accès strictement restreint aux officiers supérieurs Corrino.',
        threatLevel: 'Critique'
      }
    ]
  },

  // 6. JUNCTION (KOLHAR) - Epsilon Octantis
  {
    id: 'junction',
    name: 'Epsilon Octantis // Junction (Kolhar)',
    starName: 'Epsilon Octantis',
    starType: 'Étoile Bleue Variable (B3V)',
    spectralClass: 'B3V',
    starColor: '#67e8f9',
    starRadius: 8.0,
    primaryPlanet: 'Junction (Siège de la Guilde)',
    coordinates: [-40, -60, -160],
    controllingHouse: 'guild',
    strategicImportance: 'Crucial',
    distanceFromTerraLy: 110,
    distanceFromArrakisLy: 175,
    guildTariffSolaris: 0,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 80,
    description: 'Le cœur névralgique de toute la navigation spatiale de l\'Imperium. Ancien monde de Kolhar transformé en sanctuaire des immenses chantiers de Heighliners et des cuves de gaz d\'Épice des Navigateurs.',
    atmosphereColor: '#06b6d4',
    surfaceTextureType: 'synthetic',
    moonsCount: 3,
    planetaryMetrics: {
      diameterKm: 15600,
      gravityG: 1.05,
      dayLengthHours: 21.8,
      yearLengthDays: 290,
      surfaceTempAvgC: 16,
      atmosphereComposition: '76% N2, 21% O2, 3% Traces d\'Épice et de Composés Cryogéniques',
      populationTotal: '35 Millions de techniciens, pilotes et Navigateurs',
      capitalSettlement: 'Nave Sanctum de Junction',
      primaryExports: ['Services de Saut Spatial', 'Heighliners', 'Crédits Bancaires de la Guilde']
    },
    loreSnippet: 'Ici convergent toutes les routes de l\'espace plié. Sans Junction, l\'Imperium est aveugle.',
    orbitingBodies: [
      {
        id: 'shipyard-ring',
        name: 'Anneau de Montage Orbital des Heighliners',
        type: 'space_station',
        radius: 75,
        size: 5.2,
        speed: 0.005,
        color: '#22d3ee',
        description: 'Gigantesque mégastructure d\'assemblage de coques supraluminiques.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-guild-sanctum',
        name: 'Grand Sanctuaire des Navigateurs Prescients',
        type: 'capital',
        controllingHouse: 'guild',
        coordinates: [0.0, 0.0],
        securityLevel: 'IMPERIAL',
        population: '500 000 Guildiens',
        description: 'Chambres étanches remplies de gaz d\'Épice orange où nagent les Navigateurs géants.',
        tacticalNotes: 'Interdiction totale d\'armes et de caméras sous peine d\'interdiction de vol à vie.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 7. IX (RODALE IX) - Epsilon Eridani
  {
    id: 'ix',
    name: 'Epsilon Eridani // Ix (Rodale IX, Xuttah)',
    starName: 'Epsilon Eridani',
    starType: 'Étoile Naine Métallique Froide (K2V)',
    spectralClass: 'K2V',
    starColor: '#38bdf8',
    starRadius: 7.0,
    primaryPlanet: 'Ix (Maison Vernius)',
    coordinates: [-120, -90, 80],
    controllingHouse: 'ix',
    strategicImportance: 'Crucial',
    distanceFromTerraLy: 10.5,
    distanceFromArrakisLy: 320,
    guildTariffSolaris: 28000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 29,
    description: 'Neuvième planète du système Epsilon Eridani. Monde souterrain hypersophistiqué où sont conçues les technologies les plus avancées contournant les interdits stricts de la Bible Catholique Orange.',
    atmosphereColor: '#38bdf8',
    surfaceTextureType: 'synthetic',
    moonsCount: 2,
    planetaryMetrics: {
      diameterKm: 14200,
      gravityG: 1.00,
      dayLengthHours: 23.5,
      yearLengthDays: 350,
      surfaceTempAvgC: -45,
      atmosphereComposition: 'Surface gelée inhospitalière ; biosphère entièrement souterraine thermorégulée',
      populationTotal: '420 Millions de techniciens et cyber-ingénieurs',
      capitalSettlement: 'Complexe Souterrain de Vernii',
      primaryExports: ['Générateurs Holtzman', 'No-Chambres', 'Sondes T-Probes', 'Ornithoptères d\'Élite']
    },
    loreSnippet: 'Les Ixiens créent des merveilles que même l\'Empereur craint et désire en secret.',
    orbitingBodies: [
      {
        id: 'moon-ix-1',
        name: 'Station d\'Essais Électroniques // Alpha-Ix',
        type: 'space_station',
        radius: 65,
        size: 3.1,
        speed: 0.008,
        color: '#7dd3fc',
        description: 'Laboratoire orbital isolé pour tester les propulseurs à non-champ.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-ix-foundry',
        name: 'Manufactures Subterrannées & Chantiers Heighliner',
        type: 'industrial',
        controllingHouse: 'ix',
        coordinates: [0.0, 0.0],
        securityLevel: 'MAXIMAL',
        population: '8.0 Millions',
        description: 'Cavernes titanesques de production de coques de vaisseaux pliants et de transmetteurs tachyoniques.',
        tacticalNotes: 'Protection par no-chambres (invisibles à la prescience et aux radars).',
        threatLevel: 'Faible'
      }
    ]
  },

  // 8. TLEILAX - Thalim
  {
    id: 'tleilax-prime',
    name: 'Thalim // Tleilax (Bandalong)',
    starName: 'Thalim',
    starType: 'Étoile Naine Ambrée (K5V)',
    spectralClass: 'K5V',
    starColor: '#f472b6',
    starRadius: 6.4,
    primaryPlanet: 'Tleilax (Bandalong)',
    coordinates: [190, -40, -110],
    controllingHouse: 'tleilax',
    strategicImportance: 'Secondaire',
    distanceFromTerraLy: 145,
    distanceFromArrakisLy: 360,
    guildTariffSolaris: 48000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 18,
    description: 'Monde hermétique et inaccessible aux infidèles (powindah). Sanctuaire des Maîtres Tleilaxu et de leurs cuves Axlotl secrètes de clonage de chair vivante.',
    atmosphereColor: '#ec4899',
    surfaceTextureType: 'synthetic',
    moonsCount: 1,
    planetaryMetrics: {
      diameterKm: 13100,
      gravityG: 1.04,
      dayLengthHours: 23.8,
      yearLengthDays: 360,
      surfaceTempAvgC: 24,
      atmosphereComposition: '75% N2, 21% O2, 4% Gaz bio-organiques et spores protectrices',
      populationTotal: '90 Millions de Tleilaxu et cuves organiques',
      capitalSettlement: 'Cité Sacrée de Bandalong',
      primaryExports: ['Gholas (Clones avec mémoire)', 'Danseurs-Visages', 'Yeux Métalliques Tleilaxu']
    },
    loreSnippet: 'Nul étranger n\'a jamais vu une femme Tleilaxu ni pénétré dans leurs sanctuaires de chair.',
    orbitingBodies: [
      {
        id: 'moon-tleilax-1',
        name: 'Sentinelle Bio-Organique // Axlotl Prime',
        type: 'moon',
        radius: 65,
        size: 2.6,
        speed: 0.006,
        color: '#fbcfe8',
        description: 'Lune couverte de dômes de culture fermés.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-bandalong',
        name: 'Cité Sacrée de Bandalong',
        type: 'capital',
        controllingHouse: 'tleilax',
        coordinates: [-12.0, 78.0],
        securityLevel: 'MAXIMAL',
        description: 'Laboratoires biologiques de production des gholas et des yeux métalliques Tleilaxu.',
        tacticalNotes: 'Défenses génétiques autonomes et gaz neurotoxiques.',
        threatLevel: 'Critique'
      }
    ]
  },

  // 9. WALLACH IX - Laoujin
  {
    id: 'wallach-ix',
    name: 'Laoujin // Wallach IX (Maison-Mère)',
    starName: 'Laoujin',
    starType: 'Étoile Blanche Stable (A9V)',
    spectralClass: 'A9V',
    starColor: '#c084fc',
    starRadius: 7.5,
    primaryPlanet: 'Wallach IX (École Mère)',
    coordinates: [-70, 160, 45],
    controllingHouse: 'bene_gesserit',
    strategicImportance: 'Majeur',
    distanceFromTerraLy: 82,
    distanceFromArrakisLy: 290,
    guildTariffSolaris: 31000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 12,
    description: 'Neuvième planète de Laoujin. Sanctuaire et Maison-Mère historique de l\'Ordre du Bene Gesserit. Lieu où sont formées les Sœurs et où est conservée la généalogie secrète de tout l\'Imperium.',
    atmosphereColor: '#8b5cf6',
    surfaceTextureType: 'lush',
    moonsCount: 1,
    planetaryMetrics: {
      diameterKm: 12400,
      gravityG: 0.96,
      dayLengthHours: 25.0,
      yearLengthDays: 390,
      surfaceTempAvgC: 18,
      atmosphereComposition: '77% N2, 22% O2, 1% Gaz Rares, brumes florales méditatives',
      populationTotal: '45 Millions de novices, acolytes et Révérendes Mères',
      capitalSettlement: 'Maison-Mère de Wallach',
      primaryExports: ['Conseillères Politiques', 'Épouses Royales Conditionnées', 'Élixirs de Transe']
    },
    loreSnippet: 'Ici repose la mémoire vivante de cent générations de mères et de prophéties.',
    orbitingBodies: [
      {
        id: 'moon-wallach-1',
        name: 'Lune du Silence // Tacita',
        type: 'moon',
        radius: 65,
        size: 2.5,
        speed: 0.006,
        color: '#ddd6fe',
        description: 'Sanctuaire de méditation Prana-Bindu dans le vide spatial.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-chapterhouse-school',
        name: 'Maison-Mère & Archives Génétiques Suprêmes',
        type: 'sacred_site',
        controllingHouse: 'bene_gesserit',
        coordinates: [24.0, 45.0],
        securityLevel: 'MAXIMAL',
        description: 'Bibliothèque génétique scellée et salle de l\'épreuve de la boîte d\'agonie du Gom Jabbar.',
        tacticalNotes: 'Interdiction de survol armé sous peine d\'embargo diplomatique absolu.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 10. CHAPTERHOUSE (LA MAISON DU CHAPITRE) - Sanctuaire Secret
  {
    id: 'chapterhouse',
    name: 'Sanctuaire // Chapterhouse (La Maison du Chapitre)',
    starName: 'Alpha Secretus',
    starType: 'Étoile Naine Jaune Tempérée (G4V)',
    spectralClass: 'G4V',
    starColor: '#a78bfa',
    starRadius: 7.2,
    primaryPlanet: 'Chapterhouse',
    coordinates: [-85, 185, -60],
    controllingHouse: 'bene_gesserit',
    strategicImportance: 'Secret',
    distanceFromTerraLy: 140,
    distanceFromArrakisLy: 340,
    guildTariffSolaris: 60000,
    spiceOutputPerCycle: 450,
    defenseShieldActive: true,
    fleetCount: 20,
    description: 'Le sanctuaire secret ultime du Bene Gesserit. Monde initialement luxuriant, terraformé patiemment en désert aride pour introduire le cycle vivant de la truite des sables et du ver Shai-Hulud.',
    atmosphereColor: '#c084fc',
    surfaceTextureType: 'desert',
    moonsCount: 2,
    planetaryMetrics: {
      diameterKm: 12800,
      gravityG: 0.99,
      dayLengthHours: 24.2,
      yearLengthDays: 370,
      surfaceTempAvgC: 38,
      atmosphereComposition: '76% N2, 22% O2, 2% Poussières de Ver et Spores d\'Épice',
      populationTotal: '12 Millions de Sœurs et d\'ouvriers loyaux',
      capitalSettlement: 'Grand Chapitre de Centralis',
      primaryExports: ['Transmission de la Mémoire Seconde', 'Archives Secrètes', 'Truites des Sables']
    },
    loreSnippet: 'La terre se dessèche pour que l\'Épice renaisse. Le cycle ne mourra pas avec Arrakis.',
    orbitingBodies: [
      {
        id: 'moon-chap-1',
        name: 'Lune Sentinelle // Odrade',
        type: 'moon',
        radius: 65,
        size: 2.7,
        speed: 0.007,
        color: '#c4b5fd',
        description: 'Station d\'alerte avancée contre les Honorées Matriarches.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-chap-centralis',
        name: 'Complexe Centralis du Haut Conseil',
        type: 'capital',
        controllingHouse: 'bene_gesserit',
        coordinates: [32.0, 15.0],
        securityLevel: 'MAXIMAL',
        description: 'Chambre de commandement de la Mère Supérieure et verger d\'acclimatation des vers.',
        tacticalNotes: 'Protégé par des réseaux de non-vaisseaux invisibles à la prescience.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 11. CHUSUK (PLANÈTE DE LA MUSIQUE) - Theta Shalish
  {
    id: 'chusuk',
    name: 'Theta Shalish // Chusuk (Planète de la Musique)',
    starName: 'Theta Shalish',
    starType: 'Étoile Dorée Harmonique (F8V)',
    spectralClass: 'F8V',
    starColor: '#facc15',
    starRadius: 7.4,
    primaryPlanet: 'Chusuk (Quatrième Monde)',
    coordinates: [-35, 95, 140],
    controllingHouse: 'atreides',
    strategicImportance: 'Secondaire',
    distanceFromTerraLy: 115,
    distanceFromArrakisLy: 260,
    guildTariffSolaris: 16000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 10,
    description: 'Quatrième planète de Theta Shalish. Réputée dans tout l\'Imperium comme la « Planète de la Musique ». C\'est ici que sont façonnés les balisets, les varis et les instruments de résonance acoustique les plus prestigieux par le maître luthier Varota.',
    atmosphereColor: '#fde047',
    surfaceTextureType: 'lush',
    moonsCount: 2,
    planetaryMetrics: {
      diameterKm: 12500,
      gravityG: 0.95,
      dayLengthHours: 23.9,
      yearLengthDays: 358,
      surfaceTempAvgC: 21,
      atmosphereComposition: '78% N2, 21% O2, 1% Vapeurs harmoniques et pollens acoustiques',
      populationTotal: '240 Millions d\'artisans et musiciens',
      capitalSettlement: 'Cité Harmonique de Varota',
      primaryExports: ['Balisets de Maître Varota', 'Varis Harmoniques', 'Verre Sonore', 'Compositions Nobles']
    },
    loreSnippet: 'Gurney Halleck ne touchait aucun baliset qui ne fût taillé dans le bois de résonance de Chusuk.',
    orbitingBodies: [
      {
        id: 'moon-chusuk-1',
        name: 'Lune Lyre // Chorda',
        type: 'moon',
        radius: 65,
        size: 2.6,
        speed: 0.007,
        color: '#fef08a',
        description: 'Lune aux échos sonores naturels dans les cavernes sous vide.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-varota-ateliers',
        name: 'Ateliers Impériaux de Maître Varota',
        type: 'academy',
        controllingHouse: 'atreides',
        coordinates: [18.0, 72.0],
        securityLevel: 'HIGH',
        description: 'Manufacture artisanale des balisets à 9 cordes joués dans toutes les cours royales.',
        tacticalNotes: 'Zone protégée par décret d\'immunité culturelle du Landsraad.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 12. PORITRIN - Epsilon Alangue (Berceau Zensunni)
  {
    id: 'poritrin',
    name: 'Epsilon Alangue // Poritrin (Monde Ancestral Zensunni)',
    starName: 'Epsilon Alangue',
    starType: 'Étoile Naine Jaune-Orange (G7V)',
    spectralClass: 'G7V',
    starColor: '#fed7aa',
    starRadius: 7.1,
    primaryPlanet: 'Poritrin (Troisième Monde)',
    coordinates: [130, 45, -170],
    controllingHouse: 'corrino',
    strategicImportance: 'Majeur',
    distanceFromTerraLy: 165,
    distanceFromArrakisLy: 310,
    guildTariffSolaris: 23000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 22,
    description: 'Troisième planète d\'Epsilon Alangue. Monde agricole historique et berceau de l\'exode des Zensunni (ancêtres des Fremen) réduits en esclavage avant les grandes révoltes du Jihad Butlérien. Lieu des premières découvertes de T-Probes et de répulseurs Holtzman par Tio Holtzman.',
    atmosphereColor: '#fb923c',
    surfaceTextureType: 'lush',
    moonsCount: 2,
    planetaryMetrics: {
      diameterKm: 13400,
      gravityG: 1.01,
      dayLengthHours: 24.8,
      yearLengthDays: 382,
      surfaceTempAvgC: 25,
      atmosphereComposition: '77% N2, 21% O2, 2% Gaz agricoles et humidité',
      populationTotal: '920 Millions',
      capitalSettlement: 'Stolis de Poritrin',
      primaryExports: ['Céréales Hybrides', 'Graines Anciennes', 'Brevets Holtzman Primitifs']
    },
    loreSnippet: 'De Poritrin naquit le chant de douleur qui résonne encore sous les sietches d\'Arrakis.',
    orbitingBodies: [
      {
        id: 'moon-poritrin-1',
        name: 'Lune du Souvenir // Zensun',
        type: 'moon',
        radius: 65,
        size: 2.8,
        speed: 0.006,
        color: '#ffedd5',
        description: 'Lune stérile marquée par les premières tombes de l\'exil Zensunni.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-poritrin-gardens',
        name: 'Plaines Fertiles & Laboratoires Historiques Holtzman',
        type: 'industrial',
        controllingHouse: 'corrino',
        coordinates: [28.0, -40.0],
        securityLevel: 'HIGH',
        description: 'Vestiges des domaines de Lord Niko Bludd et de l\'atelier d\'origine de Tio Holtzman.',
        tacticalNotes: 'Surveillance préventive contre les cellules de libération religieuse.',
        threatLevel: 'Modéré'
      }
    ]
  },

  // 13. ROSSAK - HD 95424 (Sorcières de Rossak & Drogue d'Éveil)
  {
    id: 'rossak',
    name: 'HD 95424 // Rossak (Sanctuaire des Sorcières)',
    starName: 'HD 95424',
    starType: 'Étoile Variable Violette-Bleue (A2V)',
    spectralClass: 'A2V',
    starColor: '#a855f7',
    starRadius: 7.7,
    primaryPlanet: 'Rossak (Cinquième Monde)',
    coordinates: [-150, 110, -50],
    controllingHouse: 'bene_gesserit',
    strategicImportance: 'Majeur',
    distanceFromTerraLy: 198,
    distanceFromArrakisLy: 335,
    guildTariffSolaris: 29000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 15,
    description: 'Cinquième planète du système HD 95424. Jungle toxique dense où s\'établirent les Sorcières de Rossak, fondatrices du proto-Bene Gesserit. Foyer du puissant poison alcaloïde (la Drogue de Rossak) qui permettait les premières communions de Mémoire Seconde avant la découverte de l\'Eau de Vie sur Arrakis.',
    atmosphereColor: '#9333ea',
    surfaceTextureType: 'lush',
    moonsCount: 1,
    planetaryMetrics: {
      diameterKm: 12200,
      gravityG: 0.94,
      dayLengthHours: 23.4,
      yearLengthDays: 340,
      surfaceTempAvgC: 31,
      atmosphereComposition: '73% N2, 19% O2, 8% Alcaloïdes volatils et spores toxiques de jungle',
      populationTotal: '110 Millions',
      capitalSettlement: 'Sanctuaire Végétal de Rossak',
      primaryExports: ['Drogue de Rossak (Sérum d\'Éveil)', 'Antidotes Rares', 'Plantes Carnivores Télépathiques']
    },
    loreSnippet: 'Avant que l\'Épice ne soit connue des Sœurs, le poison de Rossak ouvrait la porte des ancêtres.',
    orbitingBodies: [
      {
        id: 'moon-rossak-1',
        name: 'Lune Sombre // Sayyadina',
        type: 'moon',
        radius: 65,
        size: 2.3,
        speed: 0.008,
        color: '#e9d5ff',
        description: 'Lune d\'isolation médicale pour les cas d\'intoxication à la drogue d\'éveil.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-rossak-groves',
        name: 'Canopée Chimique & Temple des Premières Mères',
        type: 'sacred_site',
        controllingHouse: 'bene_gesserit',
        coordinates: [-5.0, 115.0],
        securityLevel: 'MAXIMAL',
        description: 'Serres tropicales où est distillé le sérum neurotoxique de transe ancestrale.',
        tacticalNotes: 'Masques respiratoires obligatoires sous peine de démence irréversible.',
        threatLevel: 'Modéré'
      }
    ]
  },

  // 14. BELA TEGEUSE - Kuentsing (Halte Zensunni)
  {
    id: 'bela-tegeuse',
    name: 'Kuentsing // Bela Tegeuse',
    starName: 'Kuentsing',
    starType: 'Étoile Géante Tempérée (K0III)',
    spectralClass: 'K0III',
    starColor: '#fed7aa',
    starRadius: 8.2,
    primaryPlanet: 'Bela Tegeuse (Cinquième Monde)',
    coordinates: [110, -120, 95],
    controllingHouse: 'fremen',
    strategicImportance: 'Secondaire',
    distanceFromTerraLy: 215,
    distanceFromArrakisLy: 280,
    guildTariffSolaris: 20000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: false,
    fleetCount: 8,
    description: 'Cinquième planète du système Kuentsing. Vaste monde de savanes et d\'agriculture extensive, escale historique majeure des nomades Zensunni au cours de leur longue errance vers Arrakis.',
    atmosphereColor: '#f59e0b',
    surfaceTextureType: 'lush',
    moonsCount: 2,
    planetaryMetrics: {
      diameterKm: 13600,
      gravityG: 1.02,
      dayLengthHours: 25.1,
      yearLengthDays: 395,
      surfaceTempAvgC: 22,
      atmosphereComposition: '78% N2, 21% O2, 1% Gaz nobles',
      populationTotal: '580 Millions',
      capitalSettlement: 'Oasis de Kuentsing',
      primaryExports: ['Bétail Robuste', 'Fibres Textiles', 'Épices Culinaires Locales']
    },
    loreSnippet: 'Les nomades y laissèrent leurs troupeaux mais emportèrent leur soif de liberté.',
    orbitingBodies: [
      {
        id: 'moon-bela-1',
        name: 'Lune Ocre // Nomad',
        type: 'moon',
        radius: 65,
        size: 2.9,
        speed: 0.006,
        color: '#fef3c7',
        description: 'Lune dorée bordant les grands axes commerciaux.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-bela-sanctuary',
        name: 'Sanctuaires Troglodytes de Kuentsing',
        type: 'sietch',
        controllingHouse: 'fremen',
        coordinates: [14.0, -85.0],
        securityLevel: 'HIGH',
        description: 'Anciennes gravures murales racontant la marche sacrée vers la planète des sables.',
        tacticalNotes: 'Lieu de pèlerinage discret pour les descendants des tribus nomades.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 15. BUZZELL - Corona Borealis (Océans de Pierres de Soos)
  {
    id: 'buzzell',
    name: 'Corona Borealis // Buzzell (Océans de Soos)',
    starName: 'Corona Borealis',
    starType: 'Étoile Bleue-Blanche Froide (F2V)',
    spectralClass: 'F2V',
    starColor: '#bae6fd',
    starRadius: 7.3,
    primaryPlanet: 'Buzzell (Quatrième Monde)',
    coordinates: [-195, -70, -110],
    controllingHouse: 'bene_gesserit',
    strategicImportance: 'Majeur',
    distanceFromTerraLy: 275,
    distanceFromArrakisLy: 390,
    guildTariffSolaris: 34000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 14,
    description: 'Quatrième planète de Corona Borealis. Monde aquatique glacial et hostile, utilisé par le Bene Gesserit comme colonie pénitentiaire et centre d\'extraction des précieuses « Pierres de Soos » (Soostones), gemmes opalescentes marines à forte valeur marchande auprès de la CHOAM.',
    atmosphereColor: '#38bdf8',
    surfaceTextureType: 'ocean',
    moonsCount: 3,
    planetaryMetrics: {
      diameterKm: 14100,
      gravityG: 1.08,
      dayLengthHours: 27.2,
      yearLengthDays: 430,
      surfaceTempAvgC: 3,
      atmosphereComposition: '76% N2, 22% O2, 2% Brumes salines et embruns polaires',
      populationTotal: '35 Millions d\'exilées et plongeuses de haute mer',
      capitalSettlement: 'Donjon Submersible de Buzzell',
      primaryExports: ['Pierres de Soos (Soostones)', 'Perles d\'Abysse', 'Huiles Antarctiques']
    },
    loreSnippet: 'Dans les abysses glaciales de Buzzell, la moindre pierre de Soos vaut le prix d\'un domaine stellaire.',
    orbitingBodies: [
      {
        id: 'moon-buzzell-1',
        name: 'Lune de Glace // Glacies',
        type: 'moon',
        radius: 65,
        size: 3.1,
        speed: 0.005,
        color: '#e0f2fe',
        description: 'Lune couverte d\'une croûte d\'azote gelé.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-buzzell-keep',
        name: 'Forteresse Maritime & Fosses de Récolte de Soostones',
        type: 'military_base',
        controllingHouse: 'bene_gesserit',
        coordinates: [-48.0, 160.0],
        securityLevel: 'MAXIMAL',
        description: 'Plateforme flottante de surveillance et sas d\'immersion vers les fosses sous-marines.',
        tacticalNotes: 'Courants océaniques violents et créatures abyssopélagiques hostiles.',
        threatLevel: 'Critique'
      }
    ]
  },

  // 16. HAGAL (LA PLANÈTE JOYAU) - Theta Shaowei
  {
    id: 'hagal',
    name: 'Theta Shaowei // Hagal (La Planète Joyau)',
    starName: 'Theta Shaowei',
    starType: 'Étoile Dorée Scintillante (F3V)',
    spectralClass: 'F3V',
    starColor: '#fef08a',
    starRadius: 7.9,
    primaryPlanet: 'Hagal (Deuxième Monde)',
    coordinates: [175, 125, 40],
    controllingHouse: 'corrino',
    strategicImportance: 'Majeur',
    distanceFromTerraLy: 190,
    distanceFromArrakisLy: 310,
    guildTariffSolaris: 26000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 16,
    description: 'Deuxième planète de Theta Shaowei. Connue comme la légendaire « Planète Joyau ». Célèbre pour ses opales de feu, ses quartz étincelants et ses diamants de structure parfaite qui ornaient les couronnes et trônes impériaux sous le règne de Shaddam I.',
    atmosphereColor: '#fbbf24',
    surfaceTextureType: 'desert',
    moonsCount: 2,
    planetaryMetrics: {
      diameterKm: 13000,
      gravityG: 1.00,
      dayLengthHours: 24.3,
      yearLengthDays: 368,
      surfaceTempAvgC: 34,
      atmosphereComposition: '77% N2, 21% O2, 2% Poussières de quartz et silice',
      populationTotal: '380 Millions de mineurs et lapidaires',
      capitalSettlement: 'Cité Cristalline de Hagal',
      primaryExports: ['Opales de Feu de Hagal', 'Diamants Laser Industriels', 'Cristaux de Résonance']
    },
    loreSnippet: 'Les joyaux de Hagal scintillent d\'une lueur que même les millénaires ne sauraient éteindre.',
    orbitingBodies: [
      {
        id: 'moon-hagal-1',
        name: 'Lune Émeraude // Gemina',
        type: 'moon',
        radius: 65,
        size: 2.6,
        speed: 0.007,
        color: '#fef9c3',
        description: 'Lune réfractant la lumière stellaire en prismes multicolores.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-hagal-mines',
        name: 'Carrières Minérales Profondes & Fonderies Lapidaires',
        type: 'industrial',
        controllingHouse: 'corrino',
        coordinates: [35.0, -110.0],
        securityLevel: 'HIGH',
        description: 'Gisements géants d\'opales de feu et de cristaux piézo-électriques.',
        tacticalNotes: 'Réseaux de tunnels fragiles sujets aux effondrements sismiques.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 17. LANKIVEIL - Tshion (Fief Harkonnen des Baleines des Glaces)
  {
    id: 'lankiveil',
    name: 'Tshion // Lankiveil (Fief des Baleines des Glaces)',
    starName: 'Tshion',
    starType: 'Étoile Naine Bleue Glaciale (A5V)',
    spectralClass: 'A5V',
    starColor: '#7dd3fc',
    starRadius: 6.9,
    primaryPlanet: 'Lankiveil',
    coordinates: [180, -140, 60],
    controllingHouse: 'harkonnen',
    strategicImportance: 'Secondaire',
    distanceFromTerraLy: 160,
    distanceFromArrakisLy: 330,
    guildTariffSolaris: 21000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 14,
    description: 'Monde austère recouvert de banquises mouvantes et d\'icebergs géants. Gouverné par la branche cadette Harkonnen (Abulurd Harkonnen). Économie basée sur la chasse aux gigantesques baleines Bjondax dont les peaux et fourrures soyeuses sont hautement cotées à la CHOAM.',
    atmosphereColor: '#67e8f9',
    surfaceTextureType: 'ice',
    moonsCount: 2,
    planetaryMetrics: {
      diameterKm: 13700,
      gravityG: 1.06,
      dayLengthHours: 26.5,
      yearLengthDays: 415,
      surfaceTempAvgC: -18,
      atmosphereComposition: '79% N2, 20% O2, 1% Ar, Vents glaciaires perpétuels',
      populationTotal: '140 Millions d\'ouvriers et chasseurs marins',
      capitalSettlement: 'Port de Chasse de Tula',
      primaryExports: ['Fourrures de Baleines Bjondax', 'Huiles Protectrices Cryogéniques', 'Cuirs Polaires']
    },
    loreSnippet: 'Sur Lankiveil, la douceur d\'Abulurd était une anomalie dans le sang impitoyable des Harkonnen.',
    orbitingBodies: [
      {
        id: 'moon-lanki-1',
        name: 'Lune Arctique // Bjonda',
        type: 'moon',
        radius: 65,
        size: 2.9,
        speed: 0.006,
        color: '#cffafe',
        description: 'Lune blanche provoquant les débâcles de glace sur les côtes océaniques.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-lanki-ports',
        name: 'Factoreries de Traite des Fourrures de Tula',
        type: 'industrial',
        controllingHouse: 'harkonnen',
        coordinates: [65.0, 30.0],
        securityLevel: 'HIGH',
        description: 'Hangars de traitement des peaux de baleines Bjondax sous quotas stricts de la CHOAM.',
        tacticalNotes: 'Présence de garnisons Harkonnen assurant le rendement des usines de salaison.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 18. CORRIN - Sigma Draconis (Origine du Nom Impérial Corrino)
  {
    id: 'corrin',
    name: 'Sigma Draconis // Corrin (Ceinture de la Victoire)',
    starName: 'Sigma Draconis (Alsafi)',
    starType: 'Étoile Naine Orange Solitaire (K0V)',
    spectralClass: 'K0V',
    starColor: '#fb923c',
    starRadius: 7.2,
    primaryPlanet: 'Corrin (Ceinture des Ruines)',
    coordinates: [120, 170, -90],
    controllingHouse: 'corrino',
    strategicImportance: 'Majeur',
    distanceFromTerraLy: 18.8,
    distanceFromArrakisLy: 315,
    guildTariffSolaris: 25000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 30,
    description: 'Théâtre de la mythique Bataille de Corrin (88 B.G.) marquant la victoire décisive de l\'Humanité contre les Machines Pensantes d\'Omnius. C\'est de cette victoire historique que le vice-roi Faykan Butler prit le nom de famille impérial « Corrino ».',
    atmosphereColor: '#f97316',
    surfaceTextureType: 'volcanic',
    moonsCount: 3,
    planetaryMetrics: {
      diameterKm: 12900,
      gravityG: 1.03,
      dayLengthHours: 24.4,
      yearLengthDays: 372,
      surfaceTempAvgC: 12,
      atmosphereComposition: '75% N2, 20% O2, 5% Poussières métalliques post-jihad',
      populationTotal: '95 Millions',
      capitalSettlement: 'Cité du Triomphe Impérial',
      primaryExports: ['Reliques du Jihad Butlérien', 'Alliages de Récupération', 'Archives Historiques']
    },
    loreSnippet: 'C\'est au-dessus des cieux de Corrin que naquit la dynastie qui régna dix mille ans.',
    orbitingBodies: [
      {
        id: 'moon-corrin-debris',
        name: 'Ceinture Orbitale des Épaves des Machines',
        type: 'space_station',
        radius: 70,
        size: 4.0,
        speed: 0.005,
        color: '#fdba74',
        description: 'Vaste champ d\'épaves titanesques de la dernière flotte des Machines Pensantes.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-corrin-memorial',
        name: 'Mémorial Suprême de la Fin du Jihad',
        type: 'sacred_site',
        controllingHouse: 'corrino',
        coordinates: [22.0, 48.0],
        securityLevel: 'IMPERIAL',
        description: 'Monument en titanium pur érigé sur le cratère d\'impact de la machine souveraine.',
        tacticalNotes: 'Garde d\'honneur permanente des Sardaukars.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 19. LAMPADAS - Sanctuaire Mentat
  {
    id: 'lampadas',
    name: 'Beta Lampadas // Lampadas (Académie Mentat)',
    starName: 'Beta Lampadas',
    starType: 'Étoile Blanche-Bleue Pure (A0V)',
    spectralClass: 'A0V',
    starColor: '#e0e7ff',
    starRadius: 7.6,
    primaryPlanet: 'Lampadas (Maison de la Logique)',
    coordinates: [-100, 70, 160],
    controllingHouse: 'bene_gesserit',
    strategicImportance: 'Majeur',
    distanceFromTerraLy: 155,
    distanceFromArrakisLy: 295,
    guildTariffSolaris: 32000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 16,
    description: 'Monde de haute rigueur intellectuelle et siège de la Grande École des Mentats et de l\'immense Archive de Lampadas. C\'est ici que les ordinateurs humains apprennent à condenser des téraoctets d\'analyses sans l\'aide de machines prohibées.',
    atmosphereColor: '#818cf8',
    surfaceTextureType: 'synthetic',
    moonsCount: 1,
    planetaryMetrics: {
      diameterKm: 12600,
      gravityG: 0.98,
      dayLengthHours: 24.0,
      yearLengthDays: 360,
      surfaceTempAvgC: 17,
      atmosphereComposition: '78% N2, 21% O2, 1% Vapeurs stimulantes de jus de Sapho',
      populationTotal: '65 Millions de Mentats, scribes et logiciens',
      capitalSettlement: 'L\'Hémicycle du Calcul Pur',
      primaryExports: ['Mentats Diplômés', 'Formules Stratégiques', 'Jus de Sapho Distillé']
    },
    loreSnippet: 'C\'est par la volonté seule que l\'esprit se met en mouvement. La pensée prend de la vitesse.',
    orbitingBodies: [
      {
        id: 'moon-lampadas-1',
        name: 'Lune du Calcul // Ratio',
        type: 'moon',
        radius: 65,
        size: 2.5,
        speed: 0.007,
        color: '#c7d2fe',
        description: 'Observatoire astronomique dédié au calcul des trajectoires stellaires.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-lampadas-school',
        name: 'La Grande Bibliothèque & École Suprême Mentat',
        type: 'academy',
        controllingHouse: 'bene_gesserit',
        coordinates: [12.0, 10.0],
        securityLevel: 'MAXIMAL',
        description: 'Salles silencieuses où des milliers de Mentats ingèrent le jus de Sapho pour résoudre les crises de l\'Empire.',
        tacticalNotes: 'Interdiction absolue de tout enregistreur cybernétique.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 20. TUPILE (LE SANCTUAIRE SECRET DE LA GUILDE)
  {
    id: 'tupile',
    name: 'Guild Void // Tupile (Le Sanctuaire Secret)',
    starName: 'Étoile Non-Cartographiée (Secret de la Guilde)',
    starType: 'Étoile Naine Dorée Masquée (G9V)',
    spectralClass: 'G9V',
    starColor: '#67e8f9',
    starRadius: 6.8,
    primaryPlanet: 'Tupile (Monde Refuge)',
    coordinates: [-210, -180, -180],
    controllingHouse: 'guild',
    strategicImportance: 'Secret',
    distanceFromTerraLy: 420,
    distanceFromArrakisLy: 395,
    guildTariffSolaris: 100000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 60,
    description: 'Planète-refuge inviolable dont les coordonnées spatiales exactes ne sont connues que des Navigateurs de la Guilde Spatiale. Sert de sanctuaire aux Maisons du Landsraad vaincues ou bannies selon les termes ancestraux de la Grande Convention.',
    atmosphereColor: '#22d3ee',
    surfaceTextureType: 'ocean',
    moonsCount: 2,
    planetaryMetrics: {
      diameterKm: 13300,
      gravityG: 1.00,
      dayLengthHours: 24.0,
      yearLengthDays: 365,
      surfaceTempAvgC: 20,
      atmosphereComposition: '78% N2, 21% O2, 1% Ar, Climat doux sans intempéries violentes',
      populationTotal: '180 Millions de nobles en exil et leurs suites',
      capitalSettlement: 'L\'Asile des Cent Maisons',
      primaryExports: ['Asile Diplomatique', 'Garantie de Survie Féodale', 'Secrets d\'État Préservés']
    },
    loreSnippet: 'Quiconque atteint Tupile est à l\'abri du Kanly et de la colère de l\'Empereur.',
    orbitingBodies: [
      {
        id: 'moon-tupile-cloak',
        name: 'Sentinelle de Brouillage Supraluminique // Aegis',
        type: 'space_station',
        radius: 70,
        size: 3.8,
        speed: 0.004,
        color: '#a5f3fc',
        description: 'Station de brouillage rendant tout le système indétectable aux radars et à la prescience.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-tupile-enclave',
        name: 'Enclave Diplomatique du Grand Asile',
        type: 'capital',
        controllingHouse: 'guild',
        coordinates: [0.0, 0.0],
        securityLevel: 'IMPERIAL',
        description: 'Palais partagé par les dynasties déchues sous la protection armée des Guildiens.',
        tacticalNotes: 'Interdiction formelle de toute vendetta sous peine d\'exclusion spatiale immédiate.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 21. ECAZ - Alpha Centauri B
  {
    id: 'ecaz-system',
    name: 'Alpha Centauri B // Ecaz (Paradis Botanique)',
    starName: 'Alpha Centauri B',
    starType: 'Étoile Solaire Tempérée (G2V)',
    spectralClass: 'G2V',
    starColor: '#a855f7',
    starRadius: 7.1,
    primaryPlanet: 'Ecaz',
    coordinates: [-60, -130, -60],
    controllingHouse: 'ecaz',
    strategicImportance: 'Secondaire',
    distanceFromTerraLy: 4.37,
    distanceFromArrakisLy: 310,
    guildTariffSolaris: 19000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 15,
    description: 'Planète paradisiaque aux forêts d\'arbres Fogwood et aux jardins de plantes médicinales et artistiques.',
    atmosphereColor: '#a855f7',
    surfaceTextureType: 'lush',
    moonsCount: 2,
    planetaryMetrics: {
      diameterKm: 12900,
      gravityG: 0.97,
      dayLengthHours: 24.5,
      yearLengthDays: 380,
      surfaceTempAvgC: 23,
      atmosphereComposition: '78% N2, 21% O2, Parfums et pollens télépathiques Fogwood',
      populationTotal: '320 Millions',
      capitalSettlement: 'Palais Botanique d\'Ecaz',
      primaryExports: ['Bois Sculpté Fogwood', 'Drogue Semuta', 'Élixirs de Sapho', 'Art Vivant']
    },
    loreSnippet: 'Le Fogwood réagit à la pensée de l\'artiste pour créer les sculptures les plus prisées du Landsraad.',
    orbitingBodies: [
      {
        id: 'moon-ecaz-1',
        name: 'Lune d\'Émeraude // Viridia',
        type: 'moon',
        radius: 65,
        size: 3.0,
        speed: 0.007,
        color: '#d8b4fe',
        description: 'Lune luxuriante couverte de serres orbitales.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-fogwood-groves',
        name: 'Bosquets Sacrés de Fogwood & Raffineries de Semuta',
        type: 'industrial',
        controllingHouse: 'ecaz',
        coordinates: [15.0, -80.0],
        securityLevel: 'HIGH',
        description: 'Centres d\'extraction des substances psychotropes les plus pures du marché CHOAM.',
        tacticalNotes: 'Forêts vivantes surveillées par des gardes d\'honneur et barrières soniques.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 22. RICHESE - Eridani A
  {
    id: 'richese',
    name: 'Eridani A // Richese (Quatrième Monde)',
    starName: 'Eridani A',
    starType: 'Étoile Naine Bleue Métallique (G5V)',
    spectralClass: 'G5V',
    starColor: '#14b8a6',
    starRadius: 7.0,
    primaryPlanet: 'Richese (Quatrième Monde)',
    coordinates: [-150, -40, 110],
    controllingHouse: 'richese',
    strategicImportance: 'Majeur',
    distanceFromTerraLy: 16.2,
    distanceFromArrakisLy: 330,
    guildTariffSolaris: 24000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 22,
    description: 'Pôle technologique impérial réputé pour la miniaturisation, la fabrication de lentilles optiques fines et les miroirs spatiaux de haute précision.',
    atmosphereColor: '#14b8a6',
    surfaceTextureType: 'synthetic',
    moonsCount: 2,
    planetaryMetrics: {
      diameterKm: 13500,
      gravityG: 1.01,
      dayLengthHours: 23.2,
      yearLengthDays: 345,
      surfaceTempAvgC: 15,
      atmosphereComposition: '78% N2, 21% O2, 1% Gaz nobles',
      populationTotal: '680 Millions',
      capitalSettlement: 'Korona de Richese',
      primaryExports: ['Lentilles Optiques', 'Micro-mécanique', 'Miroirs Solaires', 'Armes Légères']
    },
    loreSnippet: 'Les miroirs de Richese reflètent les étoiles avec une pureté que même les Mentats admirent.',
    orbitingBodies: [
      {
        id: 'moon-richese-mirror',
        name: 'Station Miroir Orbitale // Korona Lens',
        type: 'space_station',
        radius: 65,
        size: 3.2,
        speed: 0.008,
        color: '#99f6e4',
        description: 'Miroir géant de concentration d\'énergie stellaire.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-richese-foundry',
        name: 'Manufactures de Miniaturisation de Korona',
        type: 'industrial',
        controllingHouse: 'richese',
        coordinates: [32.0, -15.0],
        securityLevel: 'HIGH',
        description: 'Ateliers de précision concevant les micro-horloges et instruments de navigation.',
        tacticalNotes: 'Protégé par des réseaux de micro-détecteurs laser.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 23. GINAZ - Delta Sagittarii
  {
    id: 'ginaz',
    name: 'Delta Sagittarii // Ginaz (École des Maîtres d\'Armes)',
    starName: 'Delta Sagittarii (Kaus Media)',
    starType: 'Étoile Géante Orange (K3III)',
    spectralClass: 'K3III',
    starColor: '#fde047',
    starRadius: 7.8,
    primaryPlanet: 'Ginaz',
    coordinates: [80, -150, -80],
    controllingHouse: 'ginaz',
    strategicImportance: 'Majeur',
    distanceFromTerraLy: 348,
    distanceFromArrakisLy: 270,
    guildTariffSolaris: 21000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 14,
    description: 'Monde insulaire et martial, berceau de la célèbre École des Maîtres d\'Armes de Ginaz. C\'est ici que sont formés les plus redoutables duellistes de l\'univers connu.',
    atmosphereColor: '#eab308',
    surfaceTextureType: 'ocean',
    moonsCount: 1,
    planetaryMetrics: {
      diameterKm: 12600,
      gravityG: 1.00,
      dayLengthHours: 24.0,
      yearLengthDays: 360,
      surfaceTempAvgC: 21,
      atmosphereComposition: '78% N2, 21% O2, 1% Ar',
      populationTotal: '45 Millions de guerriers et insulaires',
      capitalSettlement: 'L\'Académie des Dix Niveaux',
      primaryExports: ['Maîtres d\'Armes Diplômés', 'Lames de Ginaz', 'Manuels de Stratégie Martiale']
    },
    loreSnippet: 'Un maître d\'armes de Ginaz vaut à lui seul une compagnie entière de fantassins du Landsraad.',
    orbitingBodies: [
      {
        id: 'moon-ginaz-blade',
        name: 'Lune du Glaive // Ensis',
        type: 'moon',
        radius: 65,
        size: 2.4,
        speed: 0.007,
        color: '#fef08a',
        description: 'Lune d\'exercice pour les combats en gravité zéro.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-ginaz-academy',
        name: 'L\'Académie Suprême des Dix Niveaux de Ginaz',
        type: 'academy',
        controllingHouse: 'ginaz',
        coordinates: [12.0, 140.0],
        securityLevel: 'MAXIMAL',
        population: '120 000 Instructeurs et Élèves',
        description: 'Complexe insulaire où Duncan Idaho a conquis son titre de Maître d\'Armes.',
        tacticalNotes: 'Zone de neutralité militaire absolue reconnue par le Landsraad.',
        threatLevel: 'Faible'
      }
    ]
  },

  // 24. GRUMMAN - Chi Draconis
  {
    id: 'grumman',
    name: 'Chi Draconis // Grumman (Fief Moritani)',
    starName: 'Chi Draconis',
    starType: 'Étoile Naine Jaune-Blanche (F7V)',
    spectralClass: 'F7V',
    starColor: '#ef4444',
    starRadius: 6.7,
    primaryPlanet: 'Grumman (Fief Moritani)',
    coordinates: [-110, -160, -120],
    controllingHouse: 'moritani',
    strategicImportance: 'Secondaire',
    distanceFromTerraLy: 26.3,
    distanceFromArrakisLy: 340,
    guildTariffSolaris: 27000,
    spiceOutputPerCycle: 0,
    defenseShieldActive: true,
    fleetCount: 26,
    description: 'Monde montagneux rude, fief de la Maison Moritani. Foyer de mercenaires sans pitié et d\'usines de gaz de combat toxiques.',
    atmosphereColor: '#dc2626',
    surfaceTextureType: 'volcanic',
    moonsCount: 2,
    planetaryMetrics: {
      diameterKm: 13900,
      gravityG: 1.12,
      dayLengthHours: 25.6,
      yearLengthDays: 405,
      surfaceTempAvgC: 28,
      atmosphereComposition: '74% N2, 19% O2, 7% Composés chlorés et fumées volcaniques',
      populationTotal: '410 Millions',
      capitalSettlement: 'Citadelle de Ritk',
      primaryExports: ['Troupes Mercenaires', 'Poisons de Combat', 'Armes Chimiques', 'Minerais Noirs']
    },
    loreSnippet: 'Sur Grumman, le Kanly ne s\'arrête que lorsque la dernière lignée ennemie est anéantie.',
    orbitingBodies: [
      {
        id: 'moon-grumman-1',
        name: 'Lune Noire // Morit',
        type: 'moon',
        radius: 65,
        size: 2.7,
        speed: 0.007,
        color: '#7f1d1d',
        description: 'Lune basaltique d\'essais balistiques.'
      }
    ],
    tacticalPOIs: [
      {
        id: 'poi-grumman-citadel',
        name: 'Citadelle de Ritk & Fonderies Toxiques',
        type: 'capital',
        controllingHouse: 'moritani',
        coordinates: [42.0, -65.0],
        securityLevel: 'MAXIMAL',
        description: 'Forteresse du Vicomte Hundro Moritani construite sur un cratère volcanique actif.',
        tacticalNotes: 'Batteries antiaériennes lourdes et barrières de gaz mortel.',
        threatLevel: 'Critique'
      }
    ]
  }
];
