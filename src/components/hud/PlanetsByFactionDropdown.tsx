import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarSystem, ZoomLevel, HouseInfo } from '../../types/landsraad';
import { HOUSES_DATA } from '../../data/landsraadData';
import { audioSynth } from '../../services/audioSynth';
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Globe, 
  Orbit, 
  Shield, 
  Sparkles, 
  Layers, 
  Filter,
  ExternalLink,
  ChevronsUpDown,
  Moon,
  Zap,
  Compass
} from 'lucide-react';

interface PlanetsByFactionDropdownProps {
  systems: StarSystem[];
  currentSystem: StarSystem;
  houses?: Record<string, HouseInfo>;
  onSelectSystem: (system: StarSystem) => void;
  onZoomChange?: (level: ZoomLevel) => void;
  onOpenFiefsAtlas?: () => void;
}

export const PlanetsByFactionDropdown: React.FC<PlanetsByFactionDropdownProps> = ({
  systems,
  currentSystem,
  houses = HOUSES_DATA,
  onSelectSystem,
  onZoomChange,
  onOpenFiefsAtlas
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFactionFilter, setSelectedFactionFilter] = useState<string>('all');
  const [collapsedFactions, setCollapsedFactions] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or ESC key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Group systems by faction / controllingHouse
  const { groupedByFaction, factionStats, totalPlanetsCount } = useMemo(() => {
    const groups: Record<string, StarSystem[]> = {};
    let total = 0;

    systems.forEach((sys) => {
      const houseKey = sys.controllingHouse || 'independent';
      if (!groups[houseKey]) {
        groups[houseKey] = [];
      }
      groups[houseKey].push(sys);
      total += 1;
    });

    // Sort order based on canonical hierarchy or presence in HOUSES_DATA
    const knownHouseIds = Object.keys(houses);
    const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
      const idxA = knownHouseIds.indexOf(a);
      const idxB = knownHouseIds.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    const orderedGroups: { houseId: string; houseInfo: HouseInfo; systems: StarSystem[] }[] = [];

    sortedGroupKeys.forEach((hId) => {
      const houseInfo = houses[hId] || {
        id: hId,
        name: hId === 'independent' ? 'Maisons Indépendantes & Non-Alignées' : `Faction ${hId}`,
        shortName: hId === 'independent' ? 'Indépendants' : hId,
        sigil: '🪐',
        color: '#94a3b8',
        accentColor: '#cbd5e1',
        homeworld: 'Divers',
        capitalSystemId: '',
        ruler: 'Conseil Local',
        titles: 'Fiefs Mixtes',
        territoryInfluenceRadius: 50,
        voteWeight: 10,
        spiceStockKg: 0,
        militaryRating: 50,
        choamSharesPercent: 1.0,
        ideology: 'Autonomie locale',
        description: 'Fiefs et stations autonomes du Landsraad.',
        bannerQuote: '« La liberté entre les étoiles. »'
      };

      orderedGroups.push({
        houseId: hId,
        houseInfo,
        systems: groups[hId]
      });
    });

    return {
      groupedByFaction: orderedGroups,
      factionStats: orderedGroups.map(g => ({
        id: g.houseId,
        name: g.houseInfo.shortName || g.houseInfo.name,
        count: g.systems.length,
        color: g.houseInfo.color,
        sigil: g.houseInfo.sigil
      })),
      totalPlanetsCount: total
    };
  }, [systems, houses]);

  // Filter groups and systems based on search query and faction filter
  const filteredGroups = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return groupedByFaction
      .filter(group => {
        if (selectedFactionFilter !== 'all' && group.houseId !== selectedFactionFilter) {
          return false;
        }
        return true;
      })
      .map(group => {
        if (!q) return group;

        const houseMatches = 
          group.houseInfo.name.toLowerCase().includes(q) ||
          group.houseInfo.shortName.toLowerCase().includes(q) ||
          group.houseInfo.ruler.toLowerCase().includes(q);

        const filteredSystems = group.systems.filter(sys => {
          return (
            sys.name.toLowerCase().includes(q) ||
            sys.starName.toLowerCase().includes(q) ||
            sys.primaryPlanet.toLowerCase().includes(q) ||
            sys.strategicImportance.toLowerCase().includes(q) ||
            (sys.surfaceTextureType && sys.surfaceTextureType.toLowerCase().includes(q)) ||
            sys.tacticalPOIs.some(p => p.name.toLowerCase().includes(q))
          );
        });

        if (houseMatches) {
          return group; // Keep all if house name matches
        }

        return {
          ...group,
          systems: filteredSystems
        };
      })
      .filter(group => group.systems.length > 0);
  }, [groupedByFaction, searchQuery, selectedFactionFilter]);

  const toggleFactionCollapse = (houseId: string) => {
    audioSynth.playHoloClick(1100);
    setCollapsedFactions(prev => ({
      ...prev,
      [houseId]: !prev[houseId]
    }));
  };

  const handleSelectPlanet = (system: StarSystem, targetZoom?: ZoomLevel) => {
    audioSynth.playHoloClick(1600);
    onSelectSystem(system);
    if (targetZoom && onZoomChange) {
      onZoomChange(targetZoom);
    }
    setIsOpen(false);
  };

  const currentHouse = houses[currentSystem.controllingHouse] || HOUSES_DATA.corrino;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          audioSynth.playHoloClick(isOpen ? 900 : 1400);
          setIsOpen(!isOpen);
        }}
        className={`group flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg border font-mono text-xs font-semibold transition-all shadow-md ${
          isOpen
            ? 'bg-[#f59e0b]/20 border-[#f59e0b] text-[#fbbf24] shadow-[0_0_15px_rgba(245,158,11,0.3)]'
            : 'bg-[#0e131d]/90 hover:bg-[#161f2e] border-neutral-700/80 hover:border-[#f59e0b]/50 text-[#e2e8f0]'
        }`}
        title="Liste des planètes et fiefs classés par faction ou Maison"
      >
        {/* Active House Sigil Indicator */}
        <div 
          className="flex items-center justify-center w-5 h-5 rounded text-xs shadow-inner shrink-0"
          style={{ backgroundColor: `${currentHouse.color}25`, border: `1px solid ${currentHouse.color}80` }}
        >
          {currentHouse.customSigilUrl ? (
            <img src={currentHouse.customSigilUrl} alt="" className="w-3.5 h-3.5 object-contain" />
          ) : (
            <span>{currentHouse.sigil}</span>
          )}
        </div>

        <div className="flex flex-col items-start text-left">
          <span className="text-[10px] leading-3 text-[#f59e0b] font-bold tracking-wider uppercase flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#f59e0b]" />
            <span className="hidden sm:inline">MONDES PAR FACTION</span>
            <span className="sm:hidden">FACTIONS</span>
          </span>
          <span className="text-[11px] leading-3 text-neutral-300 font-mono font-medium truncate max-w-[110px] sm:max-w-[150px]">
            {currentSystem.primaryPlanet.split('(')[0].trim()}
          </span>
        </div>

        <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-400 font-mono font-bold hidden md:inline">
          {totalPlanetsCount}
        </span>

        <ChevronDown 
          className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-[#f59e0b] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#f59e0b]' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 mt-2 w-[340px] sm:w-[480px] md:w-[560px] max-h-[82vh] bg-[#070a10]/95 backdrop-blur-xl border border-[#f59e0b]/40 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.85)] z-50 flex flex-col overflow-hidden text-[#e2e8f0]"
          >
            {/* Top Header & Search Bar */}
            <div className="p-3 bg-gradient-to-b from-[#101726]/90 to-[#0a0f18]/90 border-b border-[#f59e0b]/20 shrink-0 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b]">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-sm font-bold tracking-wider text-[#fef3c7] uppercase">
                      Atlas des Mondes par Faction
                    </h3>
                    <p className="text-[10px] font-mono text-neutral-400">
                      {totalPlanetsCount} Mondes souverains et protectorats répertoriés
                    </p>
                  </div>
                </div>

                {onOpenFiefsAtlas && (
                  <button
                    onClick={() => {
                      audioSynth.playHoloClick(1400);
                      onOpenFiefsAtlas();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono font-semibold bg-[#f59e0b]/10 hover:bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30 transition-colors"
                  >
                    <span>Atlas Fiefs</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Search Box */}
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrer par nom de planète, étoile, type ou Maison..."
                  className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-[#05080f] border border-neutral-700/80 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs placeholder:text-neutral-500 focus:outline-none transition-colors"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-neutral-400 hover:text-white text-xs"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Faction Filter Quick Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
                <button
                  onClick={() => {
                    audioSynth.playHoloClick(1200);
                    setSelectedFactionFilter('all');
                  }}
                  className={`px-2 py-0.5 rounded-full whitespace-nowrap transition-colors border text-[11px] ${
                    selectedFactionFilter === 'all'
                      ? 'bg-[#f59e0b] text-black font-bold border-[#f59e0b]'
                      : 'bg-neutral-900/80 text-neutral-400 hover:text-white border-neutral-800'
                  }`}
                >
                  Toutes ({totalPlanetsCount})
                </button>
                {factionStats.map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      audioSynth.playHoloClick(1200);
                      setSelectedFactionFilter(selectedFactionFilter === f.id ? 'all' : f.id);
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full whitespace-nowrap transition-colors border text-[11px] ${
                      selectedFactionFilter === f.id
                        ? 'font-bold border-current'
                        : 'bg-neutral-900/80 text-neutral-400 hover:text-white border-neutral-800'
                    }`}
                    style={{
                      color: selectedFactionFilter === f.id ? f.color : undefined,
                      borderColor: selectedFactionFilter === f.id ? f.color : undefined,
                      backgroundColor: selectedFactionFilter === f.id ? `${f.color}20` : undefined
                    }}
                  >
                    <span>{f.sigil}</span>
                    <span>{f.name}</span>
                    <span className="opacity-70 text-[10px]">({f.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Faction Groups & Planets List */}
            <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-3 custom-scrollbar max-h-[55vh]">
              {filteredGroups.length === 0 ? (
                <div className="py-12 text-center text-neutral-500 font-mono text-xs">
                  <Globe className="w-8 h-8 mx-auto mb-2 opacity-30 animate-pulse" />
                  <p>Aucune planète ou Maison ne correspond à votre recherche.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFactionFilter('all');
                    }}
                    className="mt-2 text-[#f59e0b] hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                filteredGroups.map((group) => {
                  const isCollapsed = collapsedFactions[group.houseId] || false;
                  const houseColor = group.houseInfo.color || '#f59e0b';
                  const isCurrentFaction = currentSystem.controllingHouse === group.houseId;

                  return (
                    <div 
                      key={group.houseId}
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isCurrentFaction 
                          ? 'border-[#f59e0b]/40 bg-[#0f1422]/60' 
                          : 'border-neutral-800/90 bg-[#080c14]/70 hover:border-neutral-700'
                      }`}
                    >
                      {/* Faction Header Accordion Bar */}
                      <button
                        onClick={() => toggleFactionCollapse(group.houseId)}
                        className="w-full px-3 py-2.5 flex items-center justify-between gap-2 bg-gradient-to-r from-white/[0.03] to-transparent hover:from-white/[0.07] transition-colors text-left"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* House Sigil Badge */}
                          <div 
                            className="flex items-center justify-center w-7 h-7 rounded-lg text-sm shrink-0 shadow-md font-bold"
                            style={{ 
                              backgroundColor: `${houseColor}20`, 
                              borderColor: `${houseColor}60`,
                              borderWidth: 1,
                              color: houseColor
                            }}
                          >
                            {group.houseInfo.customSigilUrl ? (
                              <img src={group.houseInfo.customSigilUrl} alt="" className="w-4 h-4 object-contain" />
                            ) : (
                              <span>{group.houseInfo.sigil}</span>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span 
                                className="font-cinzel text-xs sm:text-sm font-bold tracking-wide truncate"
                                style={{ color: houseColor }}
                              >
                                {group.houseInfo.name}
                              </span>
                              {isCurrentFaction && (
                                <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/40 rounded">
                                  ACTUEL
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-neutral-400 font-mono truncate">
                              {group.houseInfo.ruler} • {group.houseInfo.titles.split(',')[0]}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span 
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                            style={{ backgroundColor: `${houseColor}15`, color: houseColor }}
                          >
                            {group.systems.length} {group.systems.length > 1 ? 'mondes' : 'monde'}
                          </span>
                          {isCollapsed ? (
                            <ChevronRight className="w-4 h-4 text-neutral-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-neutral-400" />
                          )}
                        </div>
                      </button>

                      {/* Planet Items List */}
                      {!isCollapsed && (
                        <div className="p-1.5 sm:p-2 space-y-1.5 border-t border-white/[0.04] bg-black/20">
                          {group.systems.map((sys) => {
                            const isSelected = currentSystem.id === sys.id;
                            const moonsCount = sys.orbitingBodies?.filter(b => b.type === 'moon').length || sys.moonsCount || 0;
                            const stationsCount = sys.orbitingBodies?.filter(b => b.type !== 'moon').length || 0;

                            return (
                              <div
                                key={sys.id}
                                className={`group/item rounded-lg p-2 sm:p-2.5 transition-all border flex items-center justify-between gap-2.5 ${
                                  isSelected
                                    ? 'bg-[#f59e0b]/15 border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                    : 'bg-[#0d121c]/80 hover:bg-[#141b29] border-neutral-800/80 hover:border-neutral-600'
                                }`}
                              >
                                {/* Left Planet Info & Icon */}
                                <div 
                                  onClick={() => handleSelectPlanet(sys)}
                                  className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                                >
                                  {/* Planet Sphere Icon / Texture Preview */}
                                  <div 
                                    className="relative flex items-center justify-center w-8 h-8 rounded-full border shrink-0 shadow-inner group-hover/item:scale-105 transition-transform"
                                    style={{
                                      backgroundColor: sys.atmosphereColor ? `${sys.atmosphereColor}30` : '#1e293b',
                                      borderColor: isSelected ? '#f59e0b' : (sys.atmosphereColor || '#64748b')
                                    }}
                                  >
                                    <div 
                                      className="w-3.5 h-3.5 rounded-full shadow-[0_0_8px_currentColor]"
                                      style={{ backgroundColor: sys.starColor || '#fbbf24', color: sys.starColor || '#fbbf24' }}
                                    />
                                    {isSelected && (
                                      <div className="absolute -inset-1 rounded-full border border-[#f59e0b] animate-ping opacity-60 pointer-events-none" />
                                    )}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className={`font-bold text-xs truncate transition-colors ${
                                        isSelected ? 'text-[#fbbf24]' : 'text-neutral-200 group-hover/item:text-[#f59e0b]'
                                      }`}>
                                        {sys.name}
                                      </span>

                                      {/* Classification Badge */}
                                      {sys.surfaceTextureType && (
                                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-800/90 text-neutral-400 border border-neutral-700">
                                          {sys.surfaceTextureType === 'desert' && '🏜️ Désert'}
                                          {sys.surfaceTextureType === 'ocean' && '🌊 Océan'}
                                          {sys.surfaceTextureType === 'lush' && '🌿 Végétal'}
                                          {sys.surfaceTextureType === 'industrial' && '🏭 Industriel'}
                                          {sys.surfaceTextureType === 'synthetic' && '⚙️ Synthétique'}
                                          {sys.surfaceTextureType === 'volcanic' && '🌋 Volcanique'}
                                          {sys.surfaceTextureType === 'ice' && '❄️ Glaciaire'}
                                          {sys.surfaceTextureType === 'imperial' && '👑 Impérial'}
                                        </span>
                                      )}

                                      {/* Importance Badge */}
                                      {sys.strategicImportance === 'Crucial' && (
                                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                                          CRUCIAL
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono mt-0.5 flex-wrap">
                                      <span>Étoile : <span className="text-neutral-300">{sys.starName}</span></span>
                                      <span>•</span>
                                      <span>Fief : <span className="text-neutral-300">{sys.primaryPlanet.split('(')[0].trim()}</span></span>
                                      {(moonsCount > 0 || stationsCount > 0) && (
                                        <>
                                          <span>•</span>
                                          <span className="text-neutral-400 flex items-center gap-0.5">
                                            <Moon className="w-2.5 h-2.5" />
                                            {moonsCount} {moonsCount > 1 ? 'Lunes' : 'Lune'}
                                            {stationsCount > 0 && ` + ${stationsCount} St.`}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Right Action Buttons */}
                                <div className="flex items-center gap-1 shrink-0">
                                  {/* Quick Zoom System Button */}
                                  <button
                                    onClick={() => handleSelectPlanet(sys, 'system')}
                                    className="p-1.5 rounded hover:bg-neutral-700/80 text-neutral-400 hover:text-[#fbbf24] transition-colors"
                                    title="Voir le Système 3D et ses orbites"
                                  >
                                    <Orbit className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Quick Zoom Surface Button */}
                                  <button
                                    onClick={() => handleSelectPlanet(sys, 'planetary')}
                                    className="p-1.5 rounded hover:bg-neutral-700/80 text-neutral-400 hover:text-[#06b6d4] transition-colors"
                                    title="Voir la Surface Planétaire et les POI tactiques"
                                  >
                                    <Globe className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Main Select Button */}
                                  <button
                                    onClick={() => handleSelectPlanet(sys)}
                                    className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-colors ${
                                      isSelected
                                        ? 'bg-[#f59e0b] text-black shadow-sm'
                                        : 'bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white border border-neutral-700/60'
                                    }`}
                                  >
                                    {isSelected ? 'ACTIF' : 'ALLER'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Dropdown Footer Status */}
            <div className="p-2.5 bg-[#06080e] border-t border-[#f59e0b]/20 flex items-center justify-between text-[11px] font-mono text-neutral-400 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                <span>Landsraad Holonet Sync : ACTIF</span>
              </div>
              <span className="text-[#f59e0b] font-semibold">
                {filteredGroups.reduce((acc, g) => acc + g.systems.length, 0)} Mondes affichés
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
