export type ZoomLevel = 'galactic' | 'system' | 'planetary';

export type ThemePreset = 
  | 'imperial-gold' 
  | 'spice-amber' 
  | 'mentat-cyan' 
  | 'giedi-crimson' 
  | 'ixian-emerald' 
  | 'night-ops-red';

export type GalacticViewFilter = 
  | 'all' 
  | 'fiefs' 
  | 'guild-routes' 
  | 'spice-network' 
  | 'tech-worlds' 
  | 'strategic-crucial'
  | 'custom-worlds';

export interface HouseInfo {
  id: string;
  name: string;
  shortName: string;
  sigil: string; // Emoji fallback
  customSigilUrl?: string; // Custom uploaded coat of arms / blason image (data URL or web URL)
  color: string;
  accentColor: string;
  homeworld: string;
  ruler: string;
  titles: string;
  territoryInfluenceRadius: number; // For 3D volumetric sphere
  voteWeight: number; // Landsraad political weight
  spiceStockKg: number;
  militaryRating: number; // 1 - 100
  choamSharesPercent: number;
  ideology: string;
  description: string;
  bannerQuote: string;
  capitalSystemId: string;
}

export interface TacticalPOI {
  id: string;
  name: string;
  type: 'capital' | 'sietch' | 'spice_field' | 'military_base' | 'shield_wall' | 'spaceport' | 'industrial' | 'sacred_site' | 'academy';
  controllingHouse: string;
  coordinates: [number, number]; // Lat, Long on planet sphere (-90 to 90, -180 to 180)
  securityLevel: 'MAXIMAL' | 'HIGH' | 'CONTESTED' | 'CLANDESTINE' | 'IMPERIAL';
  spiceDensity?: number; // 0-100%
  population?: string;
  description: string;
  tacticalNotes: string;
  threatLevel: 'Faible' | 'Modéré' | 'Critique' | 'Cataclysmique';
  wormSignActivity?: 'Nulle' | 'Basse' | 'Alerte Shai-Hulud' | 'Tracé Sismique Détecté';
}

export interface OrbitingBody {
  id: string;
  name: string;
  type: 'moon' | 'heighliner_dock' | 'orbital_refinery' | 'space_station';
  radius: number; // distance from planet
  size: number;
  speed: number;
  color: string;
  description: string;
}

export type SurfaceTextureType = 
  | 'desert' 
  | 'ocean' 
  | 'industrial' 
  | 'imperial' 
  | 'lush' 
  | 'volcanic' 
  | 'synthetic' 
  | 'ice' 
  | 'gas_giant';

export interface StarSystem {
  id: string;
  name: string;
  starName: string;
  starType: string;
  spectralClass: string; // e.g. 'F0II', 'G8V', 'K1V'
  starColor: string;
  starRadius: number;
  primaryPlanet: string;
  coordinates: [number, number, number]; // 3D coordinates in galactic space [x, y, z]
  controllingHouse: string;
  strategicImportance: 'Crucial' | 'Majeur' | 'Secondaire' | 'Neutre' | 'Secret';
  distanceFromTerraLy: number; // Light-years from old Terra / Central coordinate
  distanceFromArrakisLy: number;
  guildTariffSolaris: number;
  spiceOutputPerCycle: number; // in tonnes
  defenseShieldActive: boolean;
  fleetCount: number;
  description: string;
  tacticalPOIs: TacticalPOI[];
  orbitingBodies: OrbitingBody[];
  atmosphereColor: string;
  surfaceTextureType: SurfaceTextureType;
  moonsCount: number;
  planetaryMetrics: {
    diameterKm: number;
    gravityG: number;
    dayLengthHours: number;
    yearLengthDays: number;
    surfaceTempAvgC: number;
    atmosphereComposition: string;
    populationTotal: string;
    capitalSettlement: string;
    primaryExports: string[];
  };
  loreSnippet: string;
  
  // Custom Uploaded Image
  customImageUrl?: string; // Custom uploaded surface or illustration image (data URL or web URL)

  // Advanced Realistic Planetary Rendering Attributes
  hasRings?: boolean;
  ringColor?: string;
  ringRadius?: number;
  cloudDensity?: number; // 0.0 to 1.0
  cloudColor?: string;
  nightLightsIntensity?: number; // 0.0 to 1.0
  bumpScale?: number; // terrain elevation roughness
  isCustom?: boolean;
}

export interface AstrogationRoute {
  sourceSystem: StarSystem;
  targetSystem: StarSystem;
  distanceLy: number;
  estimatedFoldingSeconds: number;
  guildSpiceFeeLitres: number;
  choamTariffSolaris: number;
  hyperSpaceRiskRating: 'Négligeable' | 'Faible' | 'Modéré' | 'Périlleux';
}

export interface MapVisualConfig {
  theme: ThemePreset;
  activeFilter: GalacticViewFilter;
  scanlinesIntensity: number; // 0.0 to 1.0
  particleDensity: number; // 500 to 5000
  bloomIntensity: number; // 0.0 to 2.0
  parallaxDepth: number; // 0.0 to 2.0
  lowLightMode: boolean;
  highContrast: boolean;
  showConstellations: boolean;
  showGuildRoutes: boolean;
  showFiefdomSpheres: boolean;
  showStarLabels: boolean;
  showCoordinatesGrid: boolean;
  showShieldMeshes: boolean;
  audioEnabled: boolean;
  audioVolume: number;
  gyroscopeParallax: boolean;

  // Realism & Customization Controls
  realisticShading: boolean;
  cloudAnimation: boolean;
  cloudSpeed: number;
  atmosphereGlowIntensity: number;
  nightLightsEnabled: boolean;
  sunIntensity: number;
  surfaceBumpStrength: number;
  oceanSpecularStrength: number;
  planetRotationSpeed: number;
}
