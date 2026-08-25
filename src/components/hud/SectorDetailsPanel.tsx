import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarSystem, TacticalPOI, ZoomLevel, HouseInfo } from '../../types/landsraad';
import { HOUSES_DATA } from '../../data/landsraadData';
import { getSystemPlanetsAndStars } from '../../data/systemAstronomicalData';
import { HouseSigilImage } from '../common/HouseSigilImage';
import { 
  Shield, 
  ChevronRight, 
  MapPin, 
  Sparkles, 
  X,
  Compass,
  Navigation,
  Globe,
  Orbit,
  Thermometer,
  Layers,
  Wind,
  Users,
  Activity,
  Info,
  Radio,
  Eye,
  Edit3,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Sun,
  Clock
} from 'lucide-react';

interface SectorDetailsPanelProps {
  system: StarSystem;
  selectedPOI: TacticalPOI | null;
  zoomLevel: ZoomLevel;
  houses?: Record<string, HouseInfo>;
  onSelectPOI: (poi: TacticalPOI | null) => void;
  onZoomToSurface: () => void;
  onOpenAstrogation?: (sys: StarSystem) => void;
  onOpenTimeline?: () => void;
  onEditSystem?: (sys: StarSystem) => void;
  onUpdateSystem?: (updated: StarSystem) => void;
  onClose?: () => void;
}

export const SectorDetailsPanel: React.FC<SectorDetailsPanelProps> = ({
  system,
  selectedPOI,
  zoomLevel,
  houses = HOUSES_DATA,
  onSelectPOI,
  onZoomToSurface,
  onOpenAstrogation,
  onOpenTimeline,
  onEditSystem,
  onUpdateSystem,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'astronomy' | 'surface_pois' | 'orbitals'>('astronomy');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Retrieve complete canonical astronomical architecture (Suns, Planets, Moons)
  const { stars, planets } = getSystemPlanetsAndStars(system);
  const totalMoonsCount = planets.reduce((acc, p) => acc + p.moons.length, 0);
  
  const house = houses[system.controllingHouse] || houses.corrino || {
    id: 'unknown',
    name: 'Souveraineté Neutre',
    shortName: 'Neutre',
    sigil: '🪐',
    color: '#f59e0b',
    accentColor: '#fbbf24',
    homeworld: 'Inconnu',
    ruler: 'Conseil',
    titles: 'Monde Libre',
    territoryInfluenceRadius: 80,
    voteWeight: 0,
    spiceStockKg: 0,
    militaryRating: 50,
    choamSharesPercent: 0,
    ideology: 'Neutralité',
    description: 'Monde non rattaché aux Grandes Maisons.',
    bannerQuote: '',
    capitalSystemId: ''
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && onUpdateSystem) {
        onUpdateSystem({
          ...system,
          customImageUrl: dataUrl
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    if (onUpdateSystem) {
      onUpdateSystem({
        ...system,
        customImageUrl: undefined
      });
    }
  };

  return (
    <aside className="relative w-full md:w-[380px] lg:w-[420px] max-h-[85vh] md:max-h-[calc(100vh-80px)] flex flex-col bg-[#080a0f]/95 backdrop-blur-xl border border-[#f59e0b]/30 rounded-xl shadow-[0_0_35px_rgba(0,0,0,0.85)] overflow-hidden text-[#e2d9c8]">
      
      {/* Hidden Image Upload Input */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleImageUpload}
      />

      {/* Holographic Header Bar */}
      <div className="relative p-4 pb-3 border-b border-[#f59e0b]/20 bg-gradient-to-r from-[#f59e0b]/15 via-[#f59e0b]/5 to-transparent flex items-start justify-between">
        <div className="flex items-center gap-3">
          <HouseSigilImage house={house} size="lg" />
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#f59e0b] px-1.5 py-0.5 bg-[#f59e0b]/15 rounded border border-[#f59e0b]/30">
                {system.strategicImportance} // {system.spectralClass}
              </span>
            </div>
            <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#fef3c7] leading-tight mt-0.5">
              {system.name.split('//')[1] || system.name}
            </h2>
            <p className="text-xs font-mono text-[#a8a29e]">
              Souveraineté : <span className="text-white font-semibold">{house.name}</span>
            </p>
          </div>
        </div>

        {onClose && (
          <motion.button 
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1.5 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            title="Réduire le dossier"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Planet Visual Header Card (With Custom Image or Biome Preview + Quick Upload) */}
      <div className="relative h-28 w-full overflow-hidden border-b border-[#f59e0b]/20 group bg-black/80">
        {system.customImageUrl ? (
          <img 
            src={system.customImageUrl} 
            alt={system.primaryPlanet} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 contrast-105"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center relative overflow-hidden"
            style={{
              background: `radial-gradient(circle at 60% 40%, ${system.atmosphereColor}70, #040508 85%)`
            }}
          >
            {/* Holographic grid wireframe */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:12px_12px]" />
            <div className="flex items-center gap-3 relative z-10 text-center">
              <Globe className="w-10 h-10 text-white/75 drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]" />
              <div className="text-left">
                <span className="text-[10px] font-mono text-neutral-400 uppercase block">Monde Tellurique</span>
                <span className="font-cinzel text-sm font-bold text-white block">{system.primaryPlanet}</span>
              </div>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080a0f] via-transparent to-transparent pointer-events-none" />

        {/* Planet Image Action Overlay Buttons */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2 py-1 rounded bg-black/80 hover:bg-[#f59e0b] text-neutral-300 hover:text-black border border-[#f59e0b]/40 font-mono text-[10px] font-bold flex items-center gap-1 backdrop-blur-md transition-all shadow-md"
            title="Importer une image personnalisée pour cette planète"
          >
            <UploadCloud className="w-3 h-3" />
            <span>{system.customImageUrl ? 'CHANGER IMAGE' : 'UPLOADER IMAGE'}</span>
          </button>

          {system.customImageUrl && (
            <button
              onClick={handleRemoveImage}
              className="p-1 rounded bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white border border-red-800 backdrop-blur-md transition-all"
              title="Supprimer l'image personnalisée"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Bottom Label Badge on Image */}
        <div className="absolute bottom-2 left-3 z-10 flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/75 text-amber-400 border border-amber-500/40 backdrop-blur-sm">
            {system.surfaceTextureType.toUpperCase()}
          </span>
          {system.customImageUrl && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
              Texture HD Personnalisée
            </span>
          )}
        </div>
      </div>

      {/* Tabs with Animated Layout Indicator */}
      <div className="relative flex border-b border-[#f59e0b]/15 bg-[#0b0e14]">
        <button
          onClick={() => setActiveTab('astronomy')}
          className={`relative flex-1 py-2 text-xs font-mono tracking-wider transition-colors z-10 ${
            activeTab === 'astronomy'
              ? 'text-[#f59e0b] font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          ASTRONOMIE
          {activeTab === 'astronomy' && (
            <motion.div
              layoutId="dossierTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.8)]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('surface_pois')}
          className={`relative flex-1 py-2 text-xs font-mono tracking-wider transition-colors z-10 ${
            activeTab === 'surface_pois'
              ? 'text-[#f59e0b] font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          SITES ({system.tacticalPOIs.length})
          {activeTab === 'surface_pois' && (
            <motion.div
              layoutId="dossierTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.8)]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('orbitals')}
          className={`relative flex-1 py-2 text-xs font-mono tracking-wider transition-colors z-10 ${
            activeTab === 'orbitals'
              ? 'text-[#f59e0b] font-bold'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          LUNES & ORBITES ({totalMoonsCount})
          {activeTab === 'orbitals' && (
            <motion.div
              layoutId="dossierTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.8)]"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
        </button>
      </div>

      {/* Tab Body with Smooth Fade/Slide */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-mono">
        <AnimatePresence mode="wait">
          {/* Tab 1: Astronomical & Physical Lore */}
          {activeTab === 'astronomy' && (
            <motion.div
              key="tab-astronomy"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* Lore snippet */}
              <div className="p-3 rounded-lg bg-[#040609] border border-[#f59e0b]/20 text-[#fef3c7] font-serif italic text-xs leading-relaxed space-y-2">
                <p>« {system.loreSnippet} »</p>
                
                {onOpenTimeline && (
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onOpenTimeline()}
                      className="px-2.5 py-1 rounded bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30 font-mono text-[10px] font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Clock className="w-3 h-3 text-[#f59e0b]" />
                      <span>Consulter dans la Chronologie</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Soleils & Étoiles du Système */}
              <div className="space-y-2">
                <span className="text-[10px] text-[#f59e0b] uppercase font-bold tracking-widest flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Soleil{stars.length > 1 ? 's & Étoiles Binaires' : ' du Système'} ({stars.length})
                </span>

                <div className="space-y-1.5">
                  {stars.map((st) => (
                    <div 
                      key={st.id} 
                      className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full inline-block shrink-0 shadow-sm"
                            style={{ backgroundColor: st.color, boxShadow: `0 0 8px ${st.color}` }}
                          />
                          <span className="font-bold text-white text-xs">{st.name}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-white/10 text-amber-300 border border-white/15">
                          Classe : {st.spectralClass}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-300 font-sans">
                        {st.description}
                      </p>
                      <div className="flex justify-between text-[10px] text-neutral-500 pt-1">
                        <span>Luminosité : {st.luminosity ?? 1.0} L☉</span>
                        <span>Masse : {st.mass ?? 1.0} M☉</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Astrophysical Parameters Grid */}
              <div className="space-y-2 pt-1 border-t border-neutral-800">
                <span className="text-[10px] text-[#f59e0b] uppercase font-bold tracking-widest flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" />
                  Spécifications Astrophysiques
                </span>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block">Système Stellaire</span>
                    <span className="text-[#f3e8d2] font-bold block truncate">{system.starName}</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block">Classe Spectrale</span>
                    <span className="text-[#fbbf24] font-bold block">{system.spectralClass}</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block">Distance à Canopus</span>
                    <span className="text-[#38bdf8] font-bold block">{system.distanceFromArrakisLy} AL</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block">Distance à la Terre</span>
                    <span className="text-[#a78bfa] font-bold block">{system.distanceFromTerraLy} AL</span>
                  </div>
                </div>
              </div>

              {/* Famille Planétaire Complète */}
              <div className="space-y-2 pt-1 border-t border-neutral-800">
                <span className="text-[10px] text-[#f59e0b] uppercase font-bold tracking-widest flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Famille Planétaire Complète ({planets.length} Mondes)
                </span>

                <div className="space-y-1.5">
                  {planets.map((pl, pIdx) => (
                    <div 
                      key={pl.id}
                      className={`p-2.5 rounded-lg border transition-all ${
                        pl.isPrimary 
                          ? 'bg-amber-950/20 border-[#f59e0b]/50 shadow-[0_0_10px_rgba(245,158,11,0.15)]' 
                          : 'bg-neutral-900/60 border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-neutral-400">
                            {pl.orderIndex || pl.romanNumeral || `#${pIdx + 1}`}
                          </span>
                          <span className={`font-bold text-xs ${pl.isPrimary ? 'text-amber-300' : 'text-white'}`}>
                            {pl.name}
                          </span>
                          {pl.isPrimary && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              Capitale / Habité
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 font-mono">
                          {pl.classification}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-300 font-sans mt-1">
                        {pl.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1 mt-1 border-t border-white/5">
                        <span>Distance : {pl.distanceAU ? `${pl.distanceAU} UA` : `${(pl.orbitRadius * 0.015 + 0.3).toFixed(2)} UA`}</span>
                        <span>Rayon : {pl.radiusKm ? `${pl.radiusKm.toLocaleString()} km` : `${Math.round((pl.size || 10) * 680).toLocaleString()} km`}</span>
                        <span className="text-cyan-400">{pl.moons?.length ?? 0} lune(s)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Planetary Geophysics for Primary World */}
              <div className="space-y-2 pt-1 border-t border-neutral-800">
                <span className="text-[10px] text-[#f59e0b] uppercase font-bold tracking-widest flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  Métriques Géophysiques : {system.primaryPlanet}
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800 text-center">
                    <span className="text-[9px] text-neutral-400 block">Diamètre</span>
                    <span className="text-white font-bold block">{(system.planetaryMetrics?.diameterKm ?? 12742).toLocaleString()} km</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800 text-center">
                    <span className="text-[9px] text-neutral-400 block">Gravité</span>
                    <span className="text-[#fbbf24] font-bold block">{system.planetaryMetrics?.gravityG ?? 1.0} G</span>
                  </div>
                  <div className="p-2 rounded bg-neutral-900/70 border border-neutral-800 text-center">
                    <span className="text-[9px] text-neutral-400 block">Jour / Année</span>
                    <span className="text-[#38bdf8] font-bold block">{system.planetaryMetrics?.dayLengthHours ?? 24}h / {system.planetaryMetrics?.yearLengthDays ?? 365}j</span>
                  </div>
                </div>

                {/* Atmosphere Bar */}
                <div className="p-2.5 rounded bg-neutral-900/70 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-400 flex items-center gap-1">
                      <Wind className="w-3 h-3 text-cyan-400" /> Atmosphère & Climat
                    </span>
                    <span className="text-[#f59e0b] font-bold">{system.planetaryMetrics.surfaceTempAvgC}°C moy.</span>
                  </div>
                  <p className="text-[11px] text-neutral-300 font-sans">
                    {system.planetaryMetrics.atmosphereComposition}
                  </p>
                </div>

                {/* Demographics & Exports */}
                <div className="p-2.5 rounded bg-neutral-900/70 border border-neutral-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-emerald-400" /> Population & Exports
                    </span>
                    <span className="text-white font-bold">{system.planetaryMetrics.populationTotal}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {system.planetaryMetrics.primaryExports.map((exp, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 border border-white/10 text-neutral-300">
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description Lore */}
              <div className="p-3 rounded bg-neutral-900/50 border border-neutral-800 space-y-1">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                  Dossier Géostratégique Impérial
                </span>
                <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                  {system.description}
                </p>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Tactical POIs */}
          {activeTab === 'surface_pois' && (
            <motion.div
              key="tab-surface-pois"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="space-y-3"
            >
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
                Points d'Intérêt & Sites Remarquables ({system.tacticalPOIs.length})
              </span>

              <div className="space-y-2">
                {system.tacticalPOIs.map((poi) => {
                  const isSelected = selectedPOI?.id === poi.id;
                  return (
                    <motion.button
                      key={poi.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => onSelectPOI(poi)}
                      className={`w-full p-3 rounded-lg text-left transition-all border ${
                        isSelected
                          ? 'bg-neutral-800 border-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{poi.name}</span>
                        <span className={`px-1.5 py-0.5 text-[9px] rounded font-mono ${
                          poi.threatLevel === 'Cataclysmique' || poi.threatLevel === 'Critique'
                            ? 'bg-red-950/80 text-red-400 border border-red-800'
                            : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                        }`}>
                          Menace : {poi.threatLevel}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-300 font-sans mt-1.5 leading-snug">
                        {poi.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-neutral-500 pt-2 mt-2 border-t border-neutral-800">
                        <span>Coord: [{poi.coordinates[0]}°, {poi.coordinates[1]}°]</span>
                        <span className="text-[#f59e0b] font-bold">Sécurité : {poi.securityLevel}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Tab 3: Orbital Bodies & Moons by Planet */}
          {activeTab === 'orbitals' && (
            <motion.div
              key="tab-orbitals"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
                  Satellites Naturels & Mégastructures ({totalMoonsCount})
                </span>
                <span className="text-[10px] text-amber-400 font-bold">
                  {planets.length} Planètes
                </span>
              </div>

              <div className="space-y-4">
                {planets.map((planet, pIdx) => (
                  <div key={planet.id} className="space-y-2">
                    <div className="flex items-center gap-2 pb-1 border-b border-neutral-800">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-xs font-bold text-white">
                        {planet.orderIndex || planet.romanNumeral || `#${pIdx + 1}`} — {planet.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        ({planet.moons?.length ?? 0} lune{(planet.moons?.length ?? 0) > 1 ? 's' : ''})
                      </span>
                    </div>

                    {!planet.moons || planet.moons.length === 0 ? (
                      <div className="p-2 text-[11px] text-neutral-500 italic bg-neutral-900/30 rounded border border-neutral-900">
                        Aucun satellite naturel majeur recensé dans les tables de la Guilde.
                      </div>
                    ) : (
                      <div className="space-y-2 pl-2">
                        {planet.moons.map((moon) => (
                          <div 
                            key={moon.id}
                            className="p-2.5 rounded-lg bg-neutral-900/70 border border-neutral-800 space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                                <Orbit className="w-3.5 h-3.5 text-cyan-400" />
                                {moon.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 uppercase font-mono">
                                {(moon.type || 'natural').replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-300 font-sans">
                              {moon.description}
                            </p>
                            <div className="text-[10px] text-neutral-500 flex justify-between pt-1">
                              <span>Rayon : {(moon.radiusKm ?? Math.round((moon.size || 2.2) * 550)).toLocaleString()} km</span>
                              <span>Période : {moon.orbitalPeriodDays ?? ((moon.orbitRadius || 20) * 0.15).toFixed(1)} jours</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-3 border-t border-[#f59e0b]/20 bg-[#06080d] flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onZoomToSurface}
          className="flex-1 py-2 px-3 rounded bg-[#f59e0b] hover:bg-[#d97706] text-[#060709] font-mono text-xs font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>SURFACE 3D</span>
        </motion.button>

        {onEditSystem && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEditSystem(system)}
            className="py-2 px-2.5 rounded bg-white/5 hover:bg-white/10 border border-neutral-700 text-neutral-300 hover:text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Personnaliser et éditer les paramètres de cette planète"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">ÉDITER</span>
          </motion.button>
        )}

        {onOpenAstrogation && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenAstrogation(system)}
            className="py-2 px-3 rounded bg-[#06b6d4]/15 hover:bg-[#06b6d4]/25 border border-[#06b6d4]/40 text-[#06b6d4] font-mono text-xs font-bold tracking-wider transition-colors flex items-center gap-1.5"
            title="Calculer un vecteur de saut supraluminique depuis ce système"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>SAUT</span>
          </motion.button>
        )}
      </div>
    </aside>
  );
};
