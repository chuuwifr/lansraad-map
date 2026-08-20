import React, { useState, useEffect, useRef } from 'react';
import { ZoomLevel, StarSystem, MapVisualConfig, GalacticViewFilter } from '../../types/landsraad';
import { HOUSES_DATA } from '../../data/landsraadData';
import { audioSynth } from '../../services/audioSynth';
import { 
  Globe, 
  Orbit, 
  Compass, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Search, 
  Shield, 
  Navigation, 
  Sparkles, 
  Filter, 
  Eye, 
  RotateCcw,
  Layers,
  ChevronDown,
  PlusCircle
} from 'lucide-react';

interface TopNavigationBarProps {
  systems: StarSystem[];
  currentSystem: StarSystem;
  zoomLevel: ZoomLevel;
  config: MapVisualConfig;
  onZoomChange: (level: ZoomLevel) => void;
  onSelectSystem: (sys: StarSystem) => void;
  onUpdateConfig: (updater: (prev: MapVisualConfig) => MapVisualConfig) => void;
  onOpenAstrogation: () => void;
  onOpenFiefsAtlas: () => void;
  onOpenResourceAtlas: () => void;
  onOpenCreatePlanet: () => void;
  onOpenSettings: () => void;
  onResetView: () => void;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  systems,
  currentSystem,
  zoomLevel,
  config,
  onZoomChange,
  onSelectSystem,
  onUpdateConfig,
  onOpenAstrogation,
  onOpenFiefsAtlas,
  onOpenResourceAtlas,
  onOpenCreatePlanet,
  onOpenSettings,
  onResetView
}) => {
  const [stardateCycle, setStardateCycle] = useState('10191.88');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const house = HOUSES_DATA[currentSystem.controllingHouse] || HOUSES_DATA.corrino;

  // Real-time stardate cycle increment
  useEffect(() => {
    const interval = setInterval(() => {
      const cycle = (10191.88 + (Date.now() % 100000) / 1000000).toFixed(4);
      setStardateCycle(cycle);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Filter search matches
  const searchResults = searchQuery.trim() === '' ? [] : systems.filter(sys => {
    const q = searchQuery.toLowerCase();
    const houseObj = HOUSES_DATA[sys.controllingHouse];
    return (
      sys.name.toLowerCase().includes(q) ||
      sys.starName.toLowerCase().includes(q) ||
      sys.primaryPlanet.toLowerCase().includes(q) ||
      (houseObj && houseObj.name.toLowerCase().includes(q)) ||
      sys.tacticalPOIs.some(poi => poi.name.toLowerCase().includes(q))
    );
  });

  const handleZoomClick = (level: ZoomLevel) => {
    audioSynth.playHoloClick(1400);
    onZoomChange(level);
  };

  const toggleSound = () => {
    const nextState = !config.audioEnabled;
    audioSynth.setEnabled(nextState);
    if (nextState) {
      audioSynth.playHoloClick(1600);
      audioSynth.startAmbient();
    }
    onUpdateConfig(prev => ({ ...prev, audioEnabled: nextState }));
  };

  const toggleLowLight = () => {
    audioSynth.playHoloClick(900);
    onUpdateConfig(prev => ({ ...prev, lowLightMode: !prev.lowLightMode }));
  };

  const setFilter = (filter: GalacticViewFilter) => {
    audioSynth.playHoloClick(1500);
    onUpdateConfig(prev => ({ ...prev, activeFilter: filter }));
    setIsFilterDropdownOpen(false);
  };

  return (
    <header className="relative z-30 w-full px-3 py-2.5 sm:px-6 sm:py-3 bg-[#060709]/90 backdrop-blur-md border-b border-[#f59e0b]/20 flex items-center justify-between gap-2 shadow-2xl">
      
      {/* Brand & Landsraad Holosphere Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/40 text-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <span className="font-cinzel text-lg sm:text-xl font-bold tracking-tighter">L</span>
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-sm sm:text-base font-bold tracking-widest text-[#f3e8d2] uppercase">
              CARTOGRAPHIE IMPÉRIALE
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono tracking-wider bg-[#f59e0b]/15 text-[#fbbf24] border border-[#f59e0b]/30 rounded">
              ATLAS 3D
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#a8a29e]">
            <span className="text-[#f59e0b] font-semibold">CYCLE {stardateCycle} AG</span>
            <span className="hidden md:inline text-neutral-600">|</span>
            <span className="hidden md:inline text-neutral-400">
              SECTEUR : <span className="text-[#f3e8d2] font-semibold uppercase">{currentSystem.name.split('//')[0]}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Center: Search Bar & Quick Filters */}
      <div className="flex-1 max-w-md mx-2 hidden md:block relative" ref={searchRef}>
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Rechercher un monde, une étoile, une Maison..."
            className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-[#0c1017] border border-neutral-700/80 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs placeholder:text-neutral-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2.5 text-neutral-400 hover:text-white text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Autocomplete Search Dropdown */}
        {isSearchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#090c12] border border-[#f59e0b]/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto p-1.5 space-y-1 z-50 animate-fadeIn">
            {searchResults.map((sys) => {
              const h = HOUSES_DATA[sys.controllingHouse] || HOUSES_DATA.corrino;
              return (
                <button
                  key={sys.id}
                  onClick={() => {
                    audioSynth.playHoloClick(1600);
                    onSelectSystem(sys);
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="w-full p-2 rounded text-left hover:bg-neutral-800/80 transition-colors flex items-center justify-between group"
                >
                  <div>
                    <span className="font-bold text-xs text-neutral-200 group-hover:text-[#f59e0b] block">
                      {sys.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {sys.starType.split('(')[0]} • {h.name}
                    </span>
                  </div>
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: h.color }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Zoom Level Stepper */}
      <nav className="hidden lg:flex items-center bg-[#0d1117]/90 p-1 rounded-lg border border-[#f59e0b]/20 shadow-inner shrink-0">
        <button
          onClick={() => handleZoomClick('galactic')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all duration-200 ${
            zoomLevel === 'galactic'
              ? 'bg-[#f59e0b] text-[#060709] font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
              : 'text-[#d6c7b2] hover:text-[#fbbf24] hover:bg-white/5'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>GALAXIE</span>
        </button>

        <div className="w-[1px] h-4 bg-[#f59e0b]/20 mx-1" />

        <button
          onClick={() => handleZoomClick('system')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all duration-200 ${
            zoomLevel === 'system'
              ? 'bg-[#f59e0b] text-[#060709] font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
              : 'text-[#d6c7b2] hover:text-[#fbbf24] hover:bg-white/5'
          }`}
        >
          <Orbit className="w-3.5 h-3.5" />
          <span>SYSTÈME</span>
        </button>

        <div className="w-[1px] h-4 bg-[#f59e0b]/20 mx-1" />

        <button
          onClick={() => handleZoomClick('planetary')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all duration-200 ${
            zoomLevel === 'planetary'
              ? 'bg-[#f59e0b] text-[#060709] font-bold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
              : 'text-[#d6c7b2] hover:text-[#fbbf24] hover:bg-white/5'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>SURFACE</span>
        </button>
      </nav>

      {/* Right Tools & Cartography Modals */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        
        {/* Create / Add Custom World Button */}
        <button
          onClick={() => {
            audioSynth.playHoloClick(1600);
            onOpenCreatePlanet();
          }}
          className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r from-[#f59e0b]/20 to-[#d97706]/20 hover:from-[#f59e0b]/30 hover:to-[#d97706]/30 text-[#fef3c7] border border-[#f59e0b]/50 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.25)] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
          title="Ajouter une nouvelle planète personnalisée au Landsraad"
        >
          <PlusCircle className="w-4 h-4 text-[#f59e0b]" />
          <span className="hidden md:inline">+ AJOUTER PLANÈTE</span>
        </button>

        {/* Astrogation Fold Calculator Button */}
        <button
          onClick={() => {
            audioSynth.playHoloClick(1600);
            onOpenAstrogation();
          }}
          className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#06b6d4]/15 hover:bg-[#06b6d4]/25 text-[#06b6d4] border border-[#06b6d4]/40 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          title="Calculateur de translation supraluminique de la Guilde"
        >
          <Navigation className="w-4 h-4" />
          <span className="hidden sm:inline">SAUT SPATIAL</span>
        </button>

        {/* Fiefdoms Atlas Button */}
        <button
          onClick={() => {
            audioSynth.playHoloClick(1500);
            onOpenFiefsAtlas();
          }}
          className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#f59e0b]/15 hover:bg-[#f59e0b]/25 text-[#f59e0b] border border-[#f59e0b]/40 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          title="Atlas des Fiefs du Landsraad"
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">FIEFS</span>
        </button>

        {/* Resources Atlas Button */}
        <button
          onClick={() => {
            audioSynth.playHoloClick(1500);
            onOpenResourceAtlas();
          }}
          className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 border border-neutral-700 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors"
          title="Atlas des Ressources et Monopoles CHOAM"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="hidden xl:inline">RESSOURCES</span>
        </button>

        {/* Reset Camera View */}
        <button
          onClick={() => {
            audioSynth.playHoloClick(1200);
            onResetView();
          }}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-neutral-700 transition-colors"
          title="Recentrer la vue galactique"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded-lg border transition-colors ${
            config.audioEnabled
              ? 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/40'
              : 'bg-white/5 text-neutral-500 border-neutral-800'
          }`}
          title={config.audioEnabled ? 'Désactiver le son holosphérique' : 'Activer le son holosphérique'}
        >
          {config.audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Settings Modal */}
        <button
          onClick={() => {
            audioSynth.playHoloClick(1400);
            onOpenSettings();
          }}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-neutral-700 transition-colors"
          title="Paramètres d'affichage et de rendu"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
