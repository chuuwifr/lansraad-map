import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { StarSystem, TacticalPOI, OrbitingBody, SurfaceTextureType, HouseInfo } from '../../types/landsraad';
import { HOUSES_DATA } from '../../data/landsraadData';
import { HouseSigilImage } from '../common/HouseSigilImage';
import { 
  X, 
  Plus, 
  Sparkles, 
  Globe, 
  Compass, 
  Shield, 
  Orbit, 
  Layers, 
  Save, 
  Trash2, 
  Sun, 
  Wind, 
  Users, 
  Activity,
  CheckCircle2,
  RefreshCw,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';

interface PlanetCreatorModalProps {
  initialSystem?: StarSystem | null; // If editing existing system
  houses?: Record<string, HouseInfo>;
  onSaveSystem: (system: StarSystem) => void;
  onClose: () => void;
}

const BIOME_OPTIONS: { id: SurfaceTextureType; label: string; desc: string; icon: string; defaultAtmo: string; defaultStar: string }[] = [
  {
    id: 'desert',
    label: 'Désert Aride / Dunes d\'Épice',
    desc: 'Ergs de sable infinis, roches brûlantes et gisements d\'Épice (ex: Arrakis).',
    icon: '🏜️',
    defaultAtmo: '#ea580c',
    defaultStar: '#fbbf24'
  },
  {
    id: 'ocean',
    label: 'Océanique & Terres Luxuriantes',
    desc: 'Mers profondes, archipels côtiers et forêts denses (ex: Caladan).',
    icon: '🌊',
    defaultAtmo: '#38bdf8',
    defaultStar: '#38bdf8'
  },
  {
    id: 'imperial',
    label: 'Joyau Impérial & Jardins',
    desc: 'Cités en marbre, palais dorés et biosphères terraformées (ex: Kaitain).',
    icon: '👑',
    defaultAtmo: '#fbbf24',
    defaultStar: '#f59e0b'
  },
  {
    id: 'industrial',
    label: 'Complexe Industriel & Smog',
    desc: 'Fonderies lourdes, ciels de suie et mégalopoles d\'esclaves (ex: Giedi Prime).',
    icon: '🏭',
    defaultAtmo: '#dc2626',
    defaultStar: '#ef4444'
  },
  {
    id: 'synthetic',
    label: 'Forge Cybernétique Ixienne',
    desc: 'Circuits souterrains, dômes de titane et machines pensantes secrètes (ex: Ix).',
    icon: '⚡',
    defaultAtmo: '#10b981',
    defaultStar: '#34d399'
  },
  {
    id: 'volcanic',
    label: 'Volcanique & Monde Pénitentiaire',
    desc: 'Champs de lave, désolation basaltique et gravité écrasante (ex: Salusa Secundus).',
    icon: '🌋',
    defaultAtmo: '#b91c1c',
    defaultStar: '#f97316'
  },
  {
    id: 'ice',
    label: 'Monde Glaciaire & Banquises',
    desc: 'Glaciers de cristal, océans gelés et tempêtes polaires (ex: Ginaz).',
    icon: '❄️',
    defaultAtmo: '#7dd3fc',
    defaultStar: '#e0f2fe'
  },
  {
    id: 'gas_giant',
    label: 'Géante Gazeuse & Anneaux',
    desc: 'Vortex cycloniques massifs, bandes atmosphériques et anneaux de poussière (ex: Junction).',
    icon: '🪐',
    defaultAtmo: '#06b6d4',
    defaultStar: '#0284c7'
  },
  {
    id: 'lush',
    label: 'Paradis Végétal & Forêts Mutantes',
    desc: 'Canopées géantes, résines psychoactives et sanctuaires (ex: Ecaz / Wallach).',
    icon: '🌿',
    defaultAtmo: '#22c55e',
    defaultStar: '#86efac'
  }
];

const SPECTRAL_CLASSES = [
  { label: 'O5V - Supergéante Bleue', class: 'O5V', color: '#60a5fa' },
  { label: 'B2IV - Géante Bleu-Blanc', class: 'B2IV', color: '#93c5fd' },
  { label: 'A0V - Étoile Blanche Pure', class: 'A0V', color: '#f8fafc' },
  { label: 'F0II - Supergéante Jaune-Blanc (Canopus)', class: 'F0II', color: '#fef08a' },
  { label: 'G2V - Naine Jaune Solaire', class: 'G2V', color: '#fbbf24' },
  { label: 'K1V - Naine Orange', class: 'K1V', color: '#fb923c' },
  { label: 'M3V - Naine Rouge Sombre (Ophiuchi)', class: 'M3V', color: '#ef4444' }
];

export const PlanetCreatorModal: React.FC<PlanetCreatorModalProps> = ({
  initialSystem,
  houses = HOUSES_DATA,
  onSaveSystem,
  onClose
}) => {
  const isEditing = Boolean(initialSystem);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [activeTab, setActiveTab] = useState<'general' | 'biome' | 'geophysics' | 'pois' | 'orbitals'>('general');

  const [name, setName] = useState(initialSystem ? initialSystem.name : 'Nouveau Fief // Alpha');
  const [primaryPlanet, setPrimaryPlanet] = useState(initialSystem ? initialSystem.primaryPlanet : 'Nova Prime');
  const [starName, setStarName] = useState(initialSystem ? initialSystem.starName : 'Alpha Draconis');
  const [spectralClass, setSpectralClass] = useState(initialSystem ? initialSystem.spectralClass : 'G2V');
  const [starColor, setStarColor] = useState(initialSystem ? initialSystem.starColor : '#fbbf24');
  const [controllingHouse, setControllingHouse] = useState(initialSystem ? initialSystem.controllingHouse : 'atreides');
  const [strategicImportance, setStrategicImportance] = useState<StarSystem['strategicImportance']>(
    initialSystem ? initialSystem.strategicImportance : 'Majeur'
  );
  const [posX, setPosX] = useState(initialSystem ? initialSystem.coordinates[0] : Math.round((Math.random() - 0.5) * 450));
  const [posY, setPosY] = useState(initialSystem ? initialSystem.coordinates[1] : Math.round((Math.random() - 0.5) * 120));
  const [posZ, setPosZ] = useState(initialSystem ? initialSystem.coordinates[2] : Math.round((Math.random() - 0.5) * 450));

  // Custom Uploaded Image
  const [customImageUrl, setCustomImageUrl] = useState<string | undefined>(initialSystem?.customImageUrl);

  // Biome & Realism
  const [surfaceTextureType, setSurfaceTextureType] = useState<SurfaceTextureType>(
    initialSystem ? initialSystem.surfaceTextureType : 'desert'
  );
  const [atmosphereColor, setAtmosphereColor] = useState(
    initialSystem ? initialSystem.atmosphereColor : '#ea580c'
  );
  const [hasRings, setHasRings] = useState(initialSystem ? Boolean(initialSystem.hasRings) : false);
  const [ringColor, setRingColor] = useState(initialSystem?.ringColor || '#e2d9c8');
  const [cloudDensity, setCloudDensity] = useState(initialSystem?.cloudDensity ?? 0.65);
  const [nightLightsIntensity, setNightLightsIntensity] = useState(initialSystem?.nightLightsIntensity ?? 0.8);
  const [bumpScale, setBumpScale] = useState(initialSystem?.bumpScale ?? 1.2);

  // Metrics
  const [diameterKm, setDiameterKm] = useState(initialSystem?.planetaryMetrics.diameterKm || 12450);
  const [gravityG, setGravityG] = useState(initialSystem?.planetaryMetrics.gravityG || 1.0);
  const [dayLengthHours, setDayLengthHours] = useState(initialSystem?.planetaryMetrics.dayLengthHours || 24);
  const [yearLengthDays, setYearLengthDays] = useState(initialSystem?.planetaryMetrics.yearLengthDays || 365);
  const [surfaceTempAvgC, setSurfaceTempAvgC] = useState(initialSystem?.planetaryMetrics.surfaceTempAvgC || 22);
  const [atmosphereComposition, setAtmosphereComposition] = useState(
    initialSystem?.planetaryMetrics.atmosphereComposition || 'Azote 76%, Oxygène 21%, Traces d\'Épice'
  );
  const [populationTotal, setPopulationTotal] = useState(initialSystem?.planetaryMetrics.populationTotal || '450 millions');
  const [capitalSettlement, setCapitalSettlement] = useState(initialSystem?.planetaryMetrics.capitalSettlement || 'Cité Première');
  const [primaryExports, setPrimaryExports] = useState(
    initialSystem?.planetaryMetrics.primaryExports.join(', ') || 'Mélange, Cristaux, Alliages de Titane'
  );
  const [loreSnippet, setLoreSnippet] = useState(
    initialSystem?.loreSnippet || 'Un monde stratégique convoité pour sa position clé le long des axes de navigation de la Guilde.'
  );
  const [description, setDescription] = useState(
    initialSystem?.description || 'Ce système abrite des installations planétaires de haute valeur surveillées de près par le Landsraad.'
  );

  // Tactical POIs
  const [tacticalPOIs, setTacticalPOIs] = useState<TacticalPOI[]>(
    initialSystem?.tacticalPOIs || [
      {
        id: 'poi-cap-1',
        name: 'Citadelle Centrale',
        type: 'capital',
        controllingHouse: 'atreides',
        coordinates: [15, 45],
        securityLevel: 'MAXIMAL',
        threatLevel: 'Faible',
        description: 'Centre administratif et bastion fortifié de la planète.',
        tacticalNotes: 'Protégé par un bouclier Holtzman de classe impériale.'
      }
    ]
  );

  // Orbiting bodies
  const [orbitingBodies, setOrbitingBodies] = useState<OrbitingBody[]>(
    initialSystem?.orbitingBodies || [
      {
        id: 'moon-1',
        name: 'Lune Première',
        type: 'moon',
        radius: 65,
        size: 3.5,
        speed: 0.008,
        color: '#d4d4d8',
        description: 'Satellite naturel stérile et riche en régolithe.'
      }
    ]
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBiomeChange = (biome: SurfaceTextureType) => {
    setSurfaceTextureType(biome);
    const matched = BIOME_OPTIONS.find(b => b.id === biome);
    if (matched) {
      setAtmosphereColor(matched.defaultAtmo);
      if (biome === 'gas_giant') {
        setHasRings(true);
      }
    }
  };

  const handleAddPOI = () => {
    const newPoi: TacticalPOI = {
      id: `poi-${Date.now()}`,
      name: 'Nouveau Site Tactique',
      type: 'military_base',
      controllingHouse: controllingHouse,
      coordinates: [Math.round((Math.random() - 0.5) * 120), Math.round((Math.random() - 0.5) * 320)],
      securityLevel: 'HIGH',
      threatLevel: 'Modéré',
      description: 'Installation stratégique fortifiée.',
      tacticalNotes: 'Surveillé par patrouilles orbitales.'
    };
    setTacticalPOIs(prev => [...prev, newPoi]);
  };

  const handleAddOrbitingBody = () => {
    const newMoon: OrbitingBody = {
      id: `orb-${Date.now()}`,
      name: `Satellite ${orbitingBodies.length + 1}`,
      type: 'moon',
      radius: 60 + orbitingBodies.length * 25,
      size: 2.5,
      speed: 0.005,
      color: '#cbd5e1',
      description: 'Corps orbital en rotation synchrone.'
    };
    setOrbitingBodies(prev => [...prev, newMoon]);
  };

  const handleRandomizeCoords = () => {
    setPosX(Math.round((Math.random() - 0.5) * 480));
    setPosY(Math.round((Math.random() - 0.5) * 140));
    setPosZ(Math.round((Math.random() - 0.5) * 480));
  };

  const handleSave = () => {
    const generatedId = initialSystem ? initialSystem.id : `custom-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;

    const distFromTerra = Math.round(Math.sqrt(posX * posX + posY * posY + posZ * posZ) * 1.4);
    const distFromArrakis = Math.round(Math.sqrt(Math.pow(posX - 0, 2) + Math.pow(posY - 0, 2) + Math.pow(posZ - 0, 2)) * 1.4);

    const newSystem: StarSystem = {
      id: generatedId,
      name,
      starName,
      starType: spectralClass,
      spectralClass,
      starColor,
      starRadius: 18,
      primaryPlanet,
      coordinates: [posX, posY, posZ],
      controllingHouse,
      strategicImportance,
      distanceFromTerraLy: distFromTerra,
      distanceFromArrakisLy: distFromArrakis,
      guildTariffSolaris: Math.round(distFromArrakis * 850 + 25000),
      spiceOutputPerCycle: surfaceTextureType === 'desert' ? 450 : 0,
      defenseShieldActive: true,
      fleetCount: strategicImportance === 'Crucial' ? 12 : 4,
      description,
      tacticalPOIs,
      orbitingBodies,
      atmosphereColor,
      surfaceTextureType,
      moonsCount: orbitingBodies.filter(b => b.type === 'moon').length,
      customImageUrl,
      hasRings,
      ringColor,
      cloudDensity,
      nightLightsIntensity,
      bumpScale,
      isCustom: true,
      planetaryMetrics: {
        diameterKm,
        gravityG,
        dayLengthHours,
        yearLengthDays,
        surfaceTempAvgC,
        atmosphereComposition,
        populationTotal,
        capitalSettlement,
        primaryExports: primaryExports.split(',').map(s => s.trim()).filter(Boolean)
      },
      loreSnippet
    };

    onSaveSystem(newSystem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      
      {/* Hidden File Input for Custom Planet Image */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleImageUpload}
      />

      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#090b10] border border-[#f59e0b]/40 rounded-xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden text-[#e2d9c8]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f59e0b]/25 bg-gradient-to-r from-[#f59e0b]/15 via-[#f59e0b]/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/20 border border-[#f59e0b] flex items-center justify-center text-[#f59e0b]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#fef3c7]">
                {isEditing ? 'ÉDITER LE MONDE & SYSTÈME' : 'CRÉATEUR DE PLANÈTES IMPÉRIAL'}
              </h2>
              <p className="text-xs font-mono text-[#a8a29e]">
                Cartographie, textures personnalisées, biomes réalistes et souveraineté Landsraad
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#f59e0b]/20 bg-[#0b0e14] overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'general' ? 'border-[#f59e0b] text-[#f59e0b] font-bold bg-[#f59e0b]/10' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. IDENTITÉ & ÉTOILE</span>
          </button>

          <button
            onClick={() => setActiveTab('biome')}
            className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'biome' ? 'border-[#f59e0b] text-[#f59e0b] font-bold bg-[#f59e0b]/10' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. IMAGE & BIOME RÉALISTE</span>
          </button>

          <button
            onClick={() => setActiveTab('geophysics')}
            className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'geophysics' ? 'border-[#f59e0b] text-[#f59e0b] font-bold bg-[#f59e0b]/10' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>3. GÉOPHYSIQUE</span>
          </button>

          <button
            onClick={() => setActiveTab('pois')}
            className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'pois' ? 'border-[#f59e0b] text-[#f59e0b] font-bold bg-[#f59e0b]/10' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>4. SITES TACTIQUES ({tacticalPOIs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orbitals')}
            className={`px-4 py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'orbitals' ? 'border-[#f59e0b] text-[#f59e0b] font-bold bg-[#f59e0b]/10' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Orbit className="w-4 h-4" />
            <span>5. ORBITES & LUNES ({orbitingBodies.length})</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs font-mono">
          
          {/* TAB 1: General & Star */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-400 block">Nom du Secteur / Système</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded bg-neutral-900 border border-neutral-700 text-white font-mono focus:border-[#f59e0b] outline-none"
                    placeholder="Ex: Sigma Draconis // Novus"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400 block">Nom de la Planète Principale</label>
                  <input
                    type="text"
                    value={primaryPlanet}
                    onChange={(e) => setPrimaryPlanet(e.target.value)}
                    className="w-full p-2.5 rounded bg-neutral-900 border border-neutral-700 text-white font-mono focus:border-[#f59e0b] outline-none"
                    placeholder="Ex: Arrakis, Caladan, Kaitain"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-400 block">Maison Contrôlante (Landsraad)</label>
                  <select
                    value={controllingHouse}
                    onChange={(e) => setControllingHouse(e.target.value)}
                    className="w-full p-2.5 rounded bg-neutral-900 border border-neutral-700 text-white font-mono focus:border-[#f59e0b] outline-none"
                  >
                    {Object.values(houses).map(h => (
                      <option key={h.id} value={h.id}>
                        {h.name} ({h.homeworld})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400 block">Importance Stratégique Landsraad</label>
                  <select
                    value={strategicImportance}
                    onChange={(e) => setStrategicImportance(e.target.value as StarSystem['strategicImportance'])}
                    className="w-full p-2.5 rounded bg-neutral-900 border border-neutral-700 text-white font-mono focus:border-[#f59e0b] outline-none"
                  >
                    <option value="Crucial">Crucial (Ex: Arrakis / Kaitain)</option>
                    <option value="Majeur">Majeur (Capitale de Grande Maison)</option>
                    <option value="Secondaire">Secondaire (Monde de garnison)</option>
                    <option value="Neutre">Neutre (Monde franc / CHOAM)</option>
                    <option value="Secret">Secret (Sanctuaire clandestin)</option>
                  </select>
                </div>
              </div>

              {/* Star Astrophysical properties */}
              <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 space-y-3">
                <span className="text-[#f59e0b] font-bold text-xs uppercase flex items-center gap-1.5">
                  <Sun className="w-4 h-4" /> Étoile Centrale du Système
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-neutral-400 block text-[11px]">Nom de l'Étoile</label>
                    <input
                      type="text"
                      value={starName}
                      onChange={(e) => setStarName(e.target.value)}
                      className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white outline-none mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block text-[11px]">Classe Spectrale</label>
                    <select
                      value={spectralClass}
                      onChange={(e) => {
                        setSpectralClass(e.target.value);
                        const match = SPECTRAL_CLASSES.find(s => s.class === e.target.value);
                        if (match) setStarColor(match.color);
                      }}
                      className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white outline-none mt-1"
                    >
                      {SPECTRAL_CLASSES.map(sc => (
                        <option key={sc.class} value={sc.class}>{sc.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-neutral-400 block text-[11px]">Couleur Rayonnée</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={starColor}
                        onChange={(e) => setStarColor(e.target.value)}
                        className="w-10 h-8 rounded border border-neutral-700 cursor-pointer bg-transparent"
                      />
                      <span className="text-white font-mono">{starColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Galactic 3D Coordinates */}
              <div className="p-3.5 rounded-lg bg-neutral-900/60 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#38bdf8] font-bold text-xs uppercase flex items-center gap-1.5">
                    <Compass className="w-4 h-4" /> Position Galactique 3D [X, Y, Z]
                  </span>
                  <button
                    onClick={handleRandomizeCoords}
                    className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Aléatoire
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-neutral-400 block text-[10px]">Axe X ({posX})</label>
                    <input
                      type="range"
                      min="-250"
                      max="250"
                      value={posX}
                      onChange={(e) => setPosX(Number(e.target.value))}
                      className="w-full accent-[#f59e0b]"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block text-[10px]">Axe Y ({posY})</label>
                    <input
                      type="range"
                      min="-80"
                      max="80"
                      value={posY}
                      onChange={(e) => setPosY(Number(e.target.value))}
                      className="w-full accent-[#f59e0b]"
                    />
                  </div>
                  <div>
                    <label className="text-neutral-400 block text-[10px]">Axe Z ({posZ})</label>
                    <input
                      type="range"
                      min="-250"
                      max="250"
                      value={posZ}
                      onChange={(e) => setPosZ(Number(e.target.value))}
                      className="w-full accent-[#f59e0b]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Custom Image & Biome Photorealistic Shading */}
          {activeTab === 'biome' && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Image Upload Zone */}
              <div className="p-4 rounded-xl border border-[#f59e0b]/30 bg-[#06080d] space-y-3">
                <span className="text-[#f59e0b] font-bold text-xs uppercase flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4" /> Image & Texture Planétaire Personnalisée
                </span>
                
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Image Preview Box */}
                  <div className="w-full sm:w-48 h-32 rounded-lg border border-neutral-700 bg-neutral-900 overflow-hidden relative flex items-center justify-center shrink-0">
                    {customImageUrl ? (
                      <img 
                        src={customImageUrl} 
                        alt="Aperçu planète" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-3 text-neutral-500 flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                        <span className="text-[10px]">Texture procédurale par défaut</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <p className="text-xs text-neutral-300">
                      Importez votre propre illustration ou texture de surface (PNG, JPG, WebP). Elle sera appliquée sur le globe 3D et dans le dossier impérial.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded bg-[#f59e0b] hover:bg-[#d97706] text-black font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{customImageUrl ? 'Remplacer l\'image' : 'Importer une image'}</span>
                      </button>

                      {customImageUrl && (
                        <button
                          type="button"
                          onClick={() => setCustomImageUrl(undefined)}
                          className="px-3 py-1.5 rounded bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white border border-red-800 font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer l'image</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <span className="text-neutral-400 block">Sélectionnez le Biome Réaliste du Monde :</span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {BIOME_OPTIONS.map((biome) => {
                  const isSelected = surfaceTextureType === biome.id;
                  return (
                    <button
                      key={biome.id}
                      onClick={() => handleBiomeChange(biome.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'bg-[#f59e0b]/15 border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="text-xl mb-1">{biome.icon}</div>
                      <div className="font-bold text-white text-xs">{biome.label}</div>
                      <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">{biome.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Realistic Parameters */}
              <div className="p-4 rounded-lg bg-neutral-900/70 border border-neutral-800 space-y-3">
                <span className="text-[#f59e0b] font-bold text-xs uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Paramètres Visuels & Couches Atmosphériques
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-neutral-400 block text-[11px]">Couleur du Halo Atmosphérique</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={atmosphereColor}
                        onChange={(e) => setAtmosphereColor(e.target.value)}
                        className="w-10 h-8 rounded border border-neutral-700 cursor-pointer bg-transparent"
                      />
                      <span className="text-white font-mono">{atmosphereColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-neutral-400 block text-[11px]">Densité des Nuages ({Math.round(cloudDensity * 100)}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={cloudDensity}
                      onChange={(e) => setCloudDensity(Number(e.target.value))}
                      className="w-full accent-[#f59e0b] mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-800">
                  <div>
                    <label className="text-neutral-400 block text-[11px]">Relief & Rugosité (Bump: {bumpScale}x)</label>
                    <input
                      type="range"
                      min="0.2"
                      max="2.5"
                      step="0.1"
                      value={bumpScale}
                      onChange={(e) => setBumpScale(Number(e.target.value))}
                      className="w-full accent-[#f59e0b] mt-2"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 block text-[11px]">Lumières Nocturnes des Cités ({Math.round(nightLightsIntensity * 100)}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={nightLightsIntensity}
                      onChange={(e) => setNightLightsIntensity(Number(e.target.value))}
                      className="w-full accent-[#f59e0b] mt-2"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <label className="text-neutral-300 text-xs flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasRings}
                      onChange={(e) => setHasRings(e.target.checked)}
                      className="rounded accent-[#f59e0b] w-4 h-4"
                    />
                    <span>Système d'Anneaux Planétaires</span>
                  </label>

                  {hasRings && (
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 text-[11px]">Couleur des Anneaux :</span>
                      <input
                        type="color"
                        value={ringColor}
                        onChange={(e) => setRingColor(e.target.value)}
                        className="w-8 h-6 rounded border border-neutral-700 bg-transparent cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Geophysics & Lore */}
          {activeTab === 'geophysics' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-neutral-400 block text-[11px]">Diamètre (km)</label>
                  <input
                    type="number"
                    value={diameterKm}
                    onChange={(e) => setDiameterKm(Number(e.target.value))}
                    className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block text-[11px]">Gravité (G)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={gravityG}
                    onChange={(e) => setGravityG(Number(e.target.value))}
                    className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block text-[11px]">Jour (heures)</label>
                  <input
                    type="number"
                    value={dayLengthHours}
                    onChange={(e) => setDayLengthHours(Number(e.target.value))}
                    className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block text-[11px]">Année (jours)</label>
                  <input
                    type="number"
                    value={yearLengthDays}
                    onChange={(e) => setYearLengthDays(Number(e.target.value))}
                    className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white outline-none mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block text-[11px]">Température Moyenne (°C)</label>
                  <input
                    type="number"
                    value={surfaceTempAvgC}
                    onChange={(e) => setSurfaceTempAvgC(Number(e.target.value))}
                    className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white outline-none mt-1"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block text-[11px]">Population Totale</label>
                  <input
                    type="text"
                    value={populationTotal}
                    onChange={(e) => setPopulationTotal(e.target.value)}
                    className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white outline-none mt-1"
                    placeholder="Ex: 15 millions / Inhabitée"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-400 block text-[11px]">Composition Atmosphérique</label>
                <input
                  type="text"
                  value={atmosphereComposition}
                  onChange={(e) => setAtmosphereComposition(e.target.value)}
                  className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white outline-none mt-1"
                  placeholder="Ex: Azote 75%, Oxygène 23%, Vapeur d'eau"
                />
              </div>

              <div>
                <label className="text-neutral-400 block text-[11px]">Exports Majeurs CHOAM (séparés par virgules)</label>
                <input
                  type="text"
                  value={primaryExports}
                  onChange={(e) => setPrimaryExports(e.target.value)}
                  className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white outline-none mt-1"
                  placeholder="Ex: Minéraux rares, Épice, Technologie Ixienne"
                />
              </div>

              <div>
                <label className="text-neutral-400 block text-[11px]">Citation de la Chronique Impériale</label>
                <input
                  type="text"
                  value={loreSnippet}
                  onChange={(e) => setLoreSnippet(e.target.value)}
                  className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white outline-none mt-1"
                  placeholder="Ex: « Le sable est le seul témoin de l'éternité. »"
                />
              </div>

              <div>
                <label className="text-neutral-400 block text-[11px]">Dossier & Histoire Géopolitique</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 rounded bg-neutral-900 border border-neutral-700 text-white outline-none mt-1"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Tactical POIs */}
          {activeTab === 'pois' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Points d'Intérêt & Sites Remarquables à la Surface :</span>
                <button
                  onClick={handleAddPOI}
                  className="px-2.5 py-1 rounded bg-[#f59e0b]/20 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black font-bold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter un Site
                </button>
              </div>

              <div className="space-y-3">
                {tacticalPOIs.map((poi, idx) => (
                  <div key={poi.id} className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={poi.name}
                        onChange={(e) => {
                          const updated = [...tacticalPOIs];
                          updated[idx].name = e.target.value;
                          setTacticalPOIs(updated);
                        }}
                        className="font-bold text-white text-xs bg-transparent border-b border-neutral-700 outline-none pb-0.5"
                      />
                      <button
                        onClick={() => setTacticalPOIs(tacticalPOIs.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <select
                        value={poi.type}
                        onChange={(e) => {
                          const updated = [...tacticalPOIs];
                          updated[idx].type = e.target.value as TacticalPOI['type'];
                          setTacticalPOIs(updated);
                        }}
                        className="p-1.5 rounded bg-neutral-800 border border-neutral-700 text-xs text-white"
                      >
                        <option value="capital">Capitale</option>
                        <option value="sietch">Sietch</option>
                        <option value="spice_field">Gisement d'Épice</option>
                        <option value="military_base">Base Militaire</option>
                        <option value="spaceport">Port Spatial</option>
                        <option value="industrial">Usine / Forge</option>
                      </select>

                      <select
                        value={poi.threatLevel}
                        onChange={(e) => {
                          const updated = [...tacticalPOIs];
                          updated[idx].threatLevel = e.target.value as TacticalPOI['threatLevel'];
                          setTacticalPOIs(updated);
                        }}
                        className="p-1.5 rounded bg-neutral-800 border border-neutral-700 text-xs text-white"
                      >
                        <option value="Faible">Menace Faible</option>
                        <option value="Modéré">Menace Modérée</option>
                        <option value="Critique">Menace Critique</option>
                        <option value="Cataclysmique">Cataclysmique</option>
                      </select>

                      <div>
                        <label className="text-[10px] text-neutral-400 block">Latitude</label>
                        <input
                          type="number"
                          value={poi.coordinates[0]}
                          onChange={(e) => {
                            const updated = [...tacticalPOIs];
                            updated[idx].coordinates[0] = Number(e.target.value);
                            setTacticalPOIs(updated);
                          }}
                          className="w-full p-1 bg-neutral-800 rounded border border-neutral-700 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 block">Longitude</label>
                        <input
                          type="number"
                          value={poi.coordinates[1]}
                          onChange={(e) => {
                            const updated = [...tacticalPOIs];
                            updated[idx].coordinates[1] = Number(e.target.value);
                            setTacticalPOIs(updated);
                          }}
                          className="w-full p-1 bg-neutral-800 rounded border border-neutral-700 text-white text-xs"
                        />
                      </div>
                    </div>

                    <input
                      type="text"
                      value={poi.description}
                      onChange={(e) => {
                        const updated = [...tacticalPOIs];
                        updated[idx].description = e.target.value;
                        setTacticalPOIs(updated);
                      }}
                      className="w-full p-1.5 rounded bg-neutral-800 text-neutral-300 text-xs"
                      placeholder="Description du site..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Orbital Bodies */}
          {activeTab === 'orbitals' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Satellites Naturels, Lunes & Mégastructures :</span>
                <button
                  onClick={handleAddOrbitingBody}
                  className="px-2.5 py-1 rounded bg-[#06b6d4]/20 hover:bg-[#06b6d4] text-[#06b6d4] hover:text-black font-bold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter une Lune / Station
                </button>
              </div>

              <div className="space-y-3">
                {orbitingBodies.map((body, idx) => (
                  <div key={body.id} className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={body.name}
                        onChange={(e) => {
                          const updated = [...orbitingBodies];
                          updated[idx].name = e.target.value;
                          setOrbitingBodies(updated);
                        }}
                        className="font-bold text-white text-xs bg-transparent border-b border-neutral-700 outline-none pb-0.5"
                      />
                      <button
                        onClick={() => setOrbitingBodies(orbitingBodies.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <select
                        value={body.type}
                        onChange={(e) => {
                          const updated = [...orbitingBodies];
                          updated[idx].type = e.target.value as OrbitingBody['type'];
                          setOrbitingBodies(updated);
                        }}
                        className="p-1.5 rounded bg-neutral-800 border border-neutral-700 text-xs text-white"
                      >
                        <option value="moon">Lune Naturelle</option>
                        <option value="heighliner_dock">Heighliner de la Guilde</option>
                        <option value="space_station">Station Orbitale</option>
                        <option value="orbital_refinery">Raffinerie d'Épice</option>
                      </select>

                      <div>
                        <label className="text-[10px] text-neutral-400 block">Distance Orbitale</label>
                        <input
                          type="number"
                          value={body.radius}
                          onChange={(e) => {
                            const updated = [...orbitingBodies];
                            updated[idx].radius = Number(e.target.value);
                            setOrbitingBodies(updated);
                          }}
                          className="w-full p-1 bg-neutral-800 rounded border border-neutral-700 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 block">Taille</label>
                        <input
                          type="number"
                          step="0.5"
                          value={body.size}
                          onChange={(e) => {
                            const updated = [...orbitingBodies];
                            updated[idx].size = Number(e.target.value);
                            setOrbitingBodies(updated);
                          }}
                          className="w-full p-1 bg-neutral-800 rounded border border-neutral-700 text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-neutral-400 block">Couleur</label>
                        <input
                          type="color"
                          value={body.color}
                          onChange={(e) => {
                            const updated = [...orbitingBodies];
                            updated[idx].color = e.target.value;
                            setOrbitingBodies(updated);
                          }}
                          className="w-full h-7 rounded bg-transparent cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f59e0b]/25 bg-[#06080d] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            Annuler
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 rounded bg-[#f59e0b] hover:bg-[#d97706] text-black font-cinzel font-bold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'ENREGISTRER LES MODIFICATIONS' : 'DÉPLOYER CE MONDE DANS L\'IMPERIUM'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
