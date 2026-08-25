import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomLevel, 
  StarSystem, 
  TacticalPOI, 
  MapVisualConfig,
  HouseInfo
} from './types/landsraad';
import { 
  STAR_SYSTEMS_DATA,
  HOUSES_DATA
} from './data/landsraadData';
import { HolosphereCanvas, HolosphereCanvasRef } from './components/canvas/HolosphereCanvas';
import { TopNavigationBar } from './components/hud/TopNavigationBar';
import { SectorDetailsPanel } from './components/hud/SectorDetailsPanel';
import { AstrogationMeasureTool } from './components/hud/AstrogationMeasureTool';
import { FiefdomsAtlasModal } from './components/hud/FiefdomsAtlasModal';
import { ResourceAtlasModal } from './components/hud/ResourceAtlasModal';
import { AllPlanetsDirectoryModal } from './components/hud/AllPlanetsDirectoryModal';
import { DisplaySettingsModal } from './components/hud/DisplaySettingsModal';
import { PlanetCreatorModal } from './components/hud/PlanetCreatorModal';
import { BackupRestoreModal } from './components/hud/BackupRestoreModal';
import { TimelineModal } from './components/hud/TimelineModal';
import { MobileTacticalBar } from './components/hud/MobileTacticalBar';
import { PlanetHoverBanner } from './components/hud/PlanetHoverBanner';
import { TacticalNavControls } from './components/hud/TacticalNavControls';
import { storageService } from './services/storageService';
import { Layers, Compass, Navigation, Info, Shield, Sparkles, Database, Clock } from 'lucide-react';

export default function App() {
  const holosphereCanvasRef = useRef<HolosphereCanvasRef>(null);

  // Main Systems & Houses State (with optional autosave restore initialization)
  const [systems, setSystems] = useState<StarSystem[]>(() => {
    const saved = storageService.loadAutosave();
    return saved?.systems || STAR_SYSTEMS_DATA;
  });
  const [houses, setHouses] = useState<Record<string, HouseInfo>>(() => {
    const saved = storageService.loadAutosave();
    return saved?.houses || HOUSES_DATA;
  });
  const [selectedSystem, setSelectedSystem] = useState<StarSystem>(() => {
    const saved = storageService.loadAutosave();
    if (saved?.selectedSystemId && saved?.systems) {
      const found = saved.systems.find(s => s.id === saved.selectedSystemId);
      if (found) return found;
    }
    return STAR_SYSTEMS_DATA[0];
  });
  const [selectedPOI, setSelectedPOI] = useState<TacticalPOI | null>(() => {
    const saved = storageService.loadAutosave();
    if (saved?.selectedSystemId && saved?.systems) {
      const found = saved.systems.find(s => s.id === saved.selectedSystemId);
      if (found?.tacticalPOIs?.[0]) return found.tacticalPOIs[0];
    }
    return STAR_SYSTEMS_DATA[0].tacticalPOIs[0];
  });
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('galactic');

  // Hover state for interactive tactical HUD banner
  const [hoveredSystem, setHoveredSystem] = useState<StarSystem | null>(null);

  // Astrogation / Folding Space Measurement State
  const [isAstrogationOpen, setIsAstrogationOpen] = useState(false);
  const [astrogationSourceSystem, setAstrogationSourceSystem] = useState<StarSystem>(STAR_SYSTEMS_DATA[0]);
  const [astrogationTargetSystem, setAstrogationTargetSystem] = useState<StarSystem | null>(STAR_SYSTEMS_DATA[1]);

  // Atlas, Backup, Timeline & Creator Modals
  const [isPlanetsDirectoryOpen, setIsPlanetsDirectoryOpen] = useState(false);
  const [isFiefsAtlasOpen, setIsFiefsAtlasOpen] = useState(false);
  const [isResourceAtlasOpen, setIsResourceAtlasOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isPlanetCreatorOpen, setIsPlanetCreatorOpen] = useState(false);
  const [isBackupRestoreOpen, setIsBackupRestoreOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<StarSystem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(true);

  // Visual Configuration (Completely silent by default, sounds disabled)
  const [config, setConfig] = useState<MapVisualConfig>(() => {
    const saved = storageService.loadAutosave();
    const baseConfig: MapVisualConfig = {
      theme: 'imperial-gold',
      activeFilter: 'all',
      scanlinesIntensity: 0.12,
      particleDensity: 2400,
      bloomIntensity: 1.25,
      parallaxDepth: 0.85,
      lowLightMode: false,
      highContrast: false,
      showConstellations: true,
      showGuildRoutes: true,
      showFiefdomSpheres: false,
      showStarLabels: true,
      showCoordinatesGrid: true,
      showShieldMeshes: true,
      audioEnabled: false, // Sounds completely removed/disabled
      audioVolume: 0.0,
      gyroscopeParallax: true,
      realisticShading: true,
      cloudAnimation: true,
      cloudSpeed: 1.0,
      atmosphereGlowIntensity: 1.1,
      nightLightsEnabled: true,
      sunIntensity: 3.2,
      surfaceBumpStrength: 1.2,
      oceanSpecularStrength: 1.0,
      planetRotationSpeed: 1.0
    };
    if (saved?.config) {
      return { ...baseConfig, ...saved.config };
    }
    return baseConfig;
  });

  // Automatically save state changes to local storage autosave
  React.useEffect(() => {
    storageService.saveAutosave(systems, houses, selectedSystem.id, config);
  }, [systems, houses, selectedSystem.id, config]);

  // Restore State Handler (from JSON import, Slot or Reset)
  const handleRestoreState = useCallback((restoredData: {
    systems: StarSystem[];
    houses: Record<string, HouseInfo>;
    selectedSystemId?: string;
    config?: Partial<MapVisualConfig>;
  }) => {
    setSystems(restoredData.systems);
    setHouses(restoredData.houses);
    if (restoredData.selectedSystemId) {
      const found = restoredData.systems.find(s => s.id === restoredData.selectedSystemId) || restoredData.systems[0];
      if (found) {
        setSelectedSystem(found);
        setSelectedPOI(found.tacticalPOIs?.[0] || null);
      }
    } else if (restoredData.systems.length > 0) {
      setSelectedSystem(restoredData.systems[0]);
      setSelectedPOI(restoredData.systems[0].tacticalPOIs?.[0] || null);
    }

    if (restoredData.config) {
      setConfig(prev => ({ ...prev, ...restoredData.config }));
    }
  }, []);

  // Handle System Selection
  const handleSelectSystem = useCallback((sys: StarSystem) => {
    setSelectedSystem(sys);
    setSelectedPOI(sys.tacticalPOIs[0] || null);
    setIsDossierOpen(true);
    setHoveredSystem(null); // Dismiss hover banner once selected
  }, []);

  // Handle POI Selection
  const handleSelectPOI = useCallback((poi: TacticalPOI | null) => {
    setSelectedPOI(poi);
    if (poi && zoomLevel !== 'planetary') {
      setZoomLevel('planetary');
    }
  }, [zoomLevel]);

  // Open Astrogation Tool directly from a system
  const handleOpenAstrogationFromSystem = useCallback((sys: StarSystem) => {
    setAstrogationSourceSystem(sys);
    const target = systems.find(s => s.id !== sys.id) || systems[0];
    setAstrogationTargetSystem(target);
    setIsAstrogationOpen(true);
  }, [systems]);

  // Update existing system (e.g. when uploading custom planet image)
  const handleUpdateSystem = useCallback((updatedSystem: StarSystem) => {
    setSystems(prev => {
      const idx = prev.findIndex(s => s.id === updatedSystem.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updatedSystem;
        return next;
      }
      return [updatedSystem, ...prev];
    });
    if (selectedSystem.id === updatedSystem.id) {
      setSelectedSystem(updatedSystem);
    }
  }, [selectedSystem.id]);

  // Update House Data (e.g. when uploading custom Noble House blason / coat of arms)
  const handleUpdateHouse = useCallback((updatedHouse: HouseInfo) => {
    setHouses(prev => ({
      ...prev,
      [updatedHouse.id]: updatedHouse
    }));
  }, []);

  // Save or Edit Custom System / Planet from Creator Modal
  const handleSaveCustomSystem = useCallback((savedSystem: StarSystem) => {
    setSystems(prev => {
      const existsIndex = prev.findIndex(s => s.id === savedSystem.id);
      if (existsIndex >= 0) {
        const next = [...prev];
        next[existsIndex] = savedSystem;
        return next;
      } else {
        return [savedSystem, ...prev];
      }
    });
    setSelectedSystem(savedSystem);
    setSelectedPOI(savedSystem.tacticalPOIs[0] || null);
    setZoomLevel('planetary');
    setIsPlanetCreatorOpen(false);
    setEditingSystem(null);
  }, []);

  // Manual Zoom In & Out handlers (+ / -)
  const handleZoomIn = useCallback(() => {
    setZoomLevel(current => {
      if (current === 'galactic') return 'system';
      if (current === 'system') return 'planetary';
      return 'planetary';
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(current => {
      if (current === 'planetary') return 'system';
      if (current === 'system') return 'galactic';
      return 'galactic';
    });
  }, []);

  // Directional Rotation handler
  const handleRotate = useCallback((deltaTheta: number, deltaPhi: number) => {
    if (holosphereCanvasRef.current) {
      holosphereCanvasRef.current.rotateBy(deltaTheta, deltaPhi);
    }
  }, []);

  // Reset Camera & Orientation View
  const handleResetOrientation = useCallback(() => {
    if (holosphereCanvasRef.current) {
      holosphereCanvasRef.current.resetRotation();
    }
  }, []);

  // Reset Camera View
  const handleResetView = useCallback(() => {
    setZoomLevel('galactic');
    if (holosphereCanvasRef.current) {
      holosphereCanvasRef.current.resetRotation();
    }
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#040507] text-[#e2d9c8] overflow-hidden flex flex-col font-sans select-none">
      
      {/* 1. Top Navigation Bar */}
      <TopNavigationBar
        systems={systems}
        currentSystem={selectedSystem}
        zoomLevel={zoomLevel}
        config={config}
        houses={houses}
        onZoomChange={setZoomLevel}
        onSelectSystem={handleSelectSystem}
        onUpdateConfig={setConfig}
        onOpenPlanetsDirectory={() => setIsPlanetsDirectoryOpen(true)}
        onOpenAstrogation={() => setIsAstrogationOpen(true)}
        onOpenFiefsAtlas={() => setIsFiefsAtlasOpen(true)}
        onOpenResourceAtlas={() => setIsResourceAtlasOpen(true)}
        onOpenTimeline={() => setIsTimelineOpen(true)}
        onOpenCreatePlanet={() => {
          setEditingSystem(null);
          setIsPlanetCreatorOpen(true);
        }}
        onOpenBackupRestore={() => setIsBackupRestoreOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onResetView={handleResetView}
      />

      {/* 2. Main 3D Canvas Area */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <HolosphereCanvas
          ref={holosphereCanvasRef}
          systems={systems}
          selectedSystem={selectedSystem}
          selectedPOI={selectedPOI}
          zoomLevel={zoomLevel}
          config={config}
          measuringTargetSystem={astrogationTargetSystem}
          isMeasuringMode={isAstrogationOpen}
          onSelectSystem={handleSelectSystem}
          onSelectPOI={handleSelectPOI}
          onZoomChange={setZoomLevel}
          onHoverSystem={setHoveredSystem}
        />

        {/* Tactical Planet Hover Banner (Appears dynamically on planet mouseover) */}
        <PlanetHoverBanner
          hoveredSystem={hoveredSystem}
          houses={houses}
          onSelectSystem={handleSelectSystem}
        />

        {/* Tactical Navigation Controls (D-Pad Rotation & Manual Zoom +/-) */}
        <div className="absolute bottom-6 left-4 z-20 hidden md:block">
          <TacticalNavControls
            zoomLevel={zoomLevel}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onRotate={handleRotate}
            onResetOrientation={handleResetOrientation}
            onSetZoomLevel={setZoomLevel}
          />
        </div>

        {/* Mobile Quick Zoom Buttons (+ / -) top right below navbar */}
        <div className="md:hidden absolute top-4 right-3 z-20 flex flex-col gap-1.5 p-1.5 rounded-xl bg-[#06080d]/90 backdrop-blur-md border border-[#f59e0b]/30 shadow-lg">
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel === 'planetary'}
            title="Zoomer (+)"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#121620] active:bg-[#f59e0b] text-[#f59e0b] active:text-black border border-[#f59e0b]/30 disabled:opacity-30 disabled:pointer-events-none font-bold text-lg"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel === 'galactic'}
            title="Dézoomer (-)"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#121620] active:bg-[#f59e0b] text-[#f59e0b] active:text-black border border-[#f59e0b]/30 disabled:opacity-30 disabled:pointer-events-none font-bold text-lg"
          >
            −
          </button>
        </div>

        {/* Floating Sector Details Panel (Right HUD - Desktop Framer Motion) */}
        <div className="absolute top-4 right-4 z-20 hidden md:flex flex-col items-end pointer-events-none">
          <AnimatePresence mode="wait">
            {isDossierOpen ? (
              <motion.div
                key="expanded-dossier-panel"
                layout="position"
                initial={{ opacity: 0, x: 50, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.96 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 380, 
                  damping: 28, 
                  mass: 0.75 
                }}
                className="pointer-events-auto origin-top-right"
              >
                <SectorDetailsPanel
                  system={selectedSystem}
                  selectedPOI={selectedPOI}
                  zoomLevel={zoomLevel}
                  houses={houses}
                  onSelectPOI={handleSelectPOI}
                  onZoomToSurface={() => setZoomLevel('planetary')}
                  onOpenAstrogation={handleOpenAstrogationFromSystem}
                  onOpenTimeline={() => setIsTimelineOpen(true)}
                  onUpdateSystem={handleUpdateSystem}
                  onEditSystem={(sys) => {
                    setEditingSystem(sys);
                    setIsPlanetCreatorOpen(true);
                  }}
                  onClose={() => setIsDossierOpen(false)}
                />
              </motion.div>
            ) : (
              <motion.button
                key="collapsed-dossier-button"
                layout="position"
                initial={{ opacity: 0, x: 30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.9 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(245,158,11,0.35)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 420, damping: 25 }}
                onClick={() => setIsDossierOpen(true)}
                className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-[#080a0f]/95 backdrop-blur-md border border-[#f59e0b]/50 text-[#f59e0b] hover:bg-[#f59e0b] hover:text-black font-mono text-xs font-bold transition-colors shadow-2xl group"
              >
                <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                <span className="tracking-wider">DOSSIER STELLAIRE</span>
                <span className="w-2 h-2 rounded-full bg-[#f59e0b] group-hover:bg-black animate-pulse" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Galactic Filter Pills Overlay (Top Left) */}
        <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-1.5 p-1.5 rounded-lg bg-[#06080d]/85 backdrop-blur-md border border-[#f59e0b]/20 font-mono text-[10px]">
          <span className="text-neutral-500 uppercase px-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#f59e0b]" /> CALQUES :
          </span>

          <button
            onClick={() => setConfig(prev => ({ ...prev, activeFilter: 'all' }))}
            className={`px-2 py-1 rounded transition-colors ${
              config.activeFilter === 'all'
                ? 'bg-[#f59e0b] text-black font-bold'
                : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Tous
          </button>

          <button
            onClick={() => setConfig(prev => ({ ...prev, activeFilter: 'fiefs' }))}
            className={`px-2 py-1 rounded transition-colors ${
              config.activeFilter === 'fiefs'
                ? 'bg-[#f59e0b] text-black font-bold'
                : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Fiefs
          </button>

          <button
            onClick={() => setConfig(prev => ({ ...prev, activeFilter: 'guild-routes' }))}
            className={`px-2 py-1 rounded transition-colors ${
              config.activeFilter === 'guild-routes'
                ? 'bg-[#06b6d4] text-black font-bold'
                : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Routes Guilde
          </button>

          <button
            onClick={() => setConfig(prev => ({ ...prev, activeFilter: 'spice-network' }))}
            className={`px-2 py-1 rounded transition-colors ${
              config.activeFilter === 'spice-network'
                ? 'bg-[#ea580c] text-white font-bold'
                : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Épice
          </button>

          <button
            onClick={() => setConfig(prev => ({ ...prev, activeFilter: 'tech-worlds' }))}
            className={`px-2 py-1 rounded transition-colors ${
              config.activeFilter === 'tech-worlds'
                ? 'bg-[#10b981] text-black font-bold'
                : 'text-neutral-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Ix / Richese
          </button>
        </div>

        {/* Mobile Fullscreen Dossier Drawer (Framer Motion slide up/down) */}
        <AnimatePresence>
          {isDossierOpen && (
            <motion.div
              key="mobile-dossier-drawer"
              initial={{ opacity: 0, y: '100%', scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: '100%', scale: 0.96 }}
              transition={{ 
                type: 'spring', 
                stiffness: 360, 
                damping: 30, 
                mass: 0.85 
              }}
              className="md:hidden absolute inset-x-2 bottom-16 top-16 z-20 flex flex-col origin-bottom"
            >
              <SectorDetailsPanel
                system={selectedSystem}
                selectedPOI={selectedPOI}
                zoomLevel={zoomLevel}
                houses={houses}
                onSelectPOI={handleSelectPOI}
                onZoomToSurface={() => setZoomLevel('planetary')}
                onOpenAstrogation={handleOpenAstrogationFromSystem}
                onOpenTimeline={() => setIsTimelineOpen(true)}
                onUpdateSystem={handleUpdateSystem}
                onEditSystem={(sys) => {
                  setEditingSystem(sys);
                  setIsPlanetCreatorOpen(true);
                }}
                onClose={() => setIsDossierOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. Mobile Tactical Navigation Bar */}
      <MobileTacticalBar
        zoomLevel={zoomLevel}
        currentSystem={selectedSystem}
        onZoomChange={setZoomLevel}
        onToggleDossier={() => setIsDossierOpen(prev => !prev)}
        onOpenPlanetsDirectory={() => setIsPlanetsDirectoryOpen(true)}
        onOpenAstrogation={() => setIsAstrogationOpen(true)}
        onOpenFiefsAtlas={() => setIsFiefsAtlasOpen(true)}
        onOpenResourceAtlas={() => setIsResourceAtlasOpen(true)}
        onOpenTimeline={() => setIsTimelineOpen(true)}
        onOpenCreatePlanet={() => {
          setEditingSystem(null);
          setIsPlanetCreatorOpen(true);
        }}
        onOpenBackupRestore={() => setIsBackupRestoreOpen(true)}
      />

      {/* 4. Complete Planet & Systems Directory Modal */}
      {isPlanetsDirectoryOpen && (
        <AllPlanetsDirectoryModal
          systems={systems}
          currentSystem={selectedSystem}
          houses={houses}
          onSelectSystem={handleSelectSystem}
          onZoomChange={setZoomLevel}
          onOpenAstrogationFromSystem={handleOpenAstrogationFromSystem}
          onClose={() => setIsPlanetsDirectoryOpen(false)}
        />
      )}

      {/* 5. Astrogation & Fold Distance Tool Modal */}
      {isAstrogationOpen && (
        <AstrogationMeasureTool
          systems={systems}
          sourceSystem={astrogationSourceSystem}
          targetSystem={astrogationTargetSystem}
          onSelectSource={setAstrogationSourceSystem}
          onSelectTarget={setAstrogationTargetSystem}
          onClose={() => setIsAstrogationOpen(false)}
        />
      )}

      {/* 5. Landsraad Fiefs Geopolitical Atlas Modal with House Coat of Arms Customizer & Creation */}
      {isFiefsAtlasOpen && (
        <FiefdomsAtlasModal
          systems={systems}
          houses={houses}
          onUpdateHouse={handleUpdateHouse}
          onSaveNewHouse={handleUpdateHouse}
          onSelectSystem={handleSelectSystem}
          onClose={() => setIsFiefsAtlasOpen(false)}
        />
      )}

      {/* 6. CHOAM Resources Atlas Modal */}
      {isResourceAtlasOpen && (
        <ResourceAtlasModal
          systems={systems}
          onSelectSystem={handleSelectSystem}
          onClose={() => setIsResourceAtlasOpen(false)}
        />
      )}

      {/* 7. Dune Historical Timeline Modal (Expanded Dune Chronology) */}
      {isTimelineOpen && (
        <TimelineModal
          onSelectSystem={(sysId) => {
            const found = systems.find(s => s.id === sysId);
            if (found) {
              handleSelectSystem(found);
            }
          }}
          onClose={() => setIsTimelineOpen(false)}
        />
      )}

      {/* 8. Planet Creator / Custom World Foundry Modal */}
      {isPlanetCreatorOpen && (
        <PlanetCreatorModal
          initialSystem={editingSystem}
          houses={houses}
          onSaveSystem={handleSaveCustomSystem}
          onClose={() => {
            setIsPlanetCreatorOpen(false);
            setEditingSystem(null);
          }}
        />
      )}

      {/* 9. Visual & Theme Settings Modal */}
      {isSettingsOpen && (
        <DisplaySettingsModal
          config={config}
          onUpdateConfig={setConfig}
          onOpenBackupRestore={() => {
            setIsSettingsOpen(false);
            setIsBackupRestoreOpen(true);
          }}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* 10. Holonet Archives, Backup & Restore Modal */}
      {isBackupRestoreOpen && (
        <BackupRestoreModal
          systems={systems}
          houses={houses}
          selectedSystemId={selectedSystem.id}
          config={config}
          onRestoreState={handleRestoreState}
          onClose={() => setIsBackupRestoreOpen(false)}
        />
      )}
    </div>
  );
}
