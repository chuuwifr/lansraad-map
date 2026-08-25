import React, { useState, useMemo } from 'react';
import { StarSystem, ZoomLevel, HouseInfo } from '../../types/landsraad';
import { HOUSES_DATA } from '../../data/landsraadData';
import { audioSynth } from '../../services/audioSynth';
import { 
  X, 
  Search, 
  Globe, 
  Orbit, 
  Shield, 
  Sparkles, 
  Navigation, 
  MapPin, 
  Layers, 
  Filter, 
  SlidersHorizontal, 
  ExternalLink,
  ChevronRight,
  Compass,
  Zap,
  Users,
  Thermometer,
  Gauge,
  Clock,
  ArrowUpDown,
  LayoutGrid,
  List,
  Eye,
  Info,
  CheckCircle2
} from 'lucide-react';

interface AllPlanetsDirectoryModalProps {
  systems: StarSystem[];
  currentSystem: StarSystem;
  houses?: Record<string, HouseInfo>;
  onSelectSystem: (system: StarSystem) => void;
  onZoomChange?: (level: ZoomLevel) => void;
  onOpenAstrogationFromSystem?: (system: StarSystem) => void;
  onClose: () => void;
}

type SortField = 'name' | 'house' | 'distanceArrakis' | 'distanceTerra' | 'population' | 'importance';
type ViewMode = 'grid' | 'table';

export const AllPlanetsDirectoryModal: React.FC<AllPlanetsDirectoryModalProps> = ({
  systems,
  currentSystem,
  houses = HOUSES_DATA,
  onSelectSystem,
  onZoomChange,
  onOpenAstrogationFromSystem,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFactionFilter, setSelectedFactionFilter] = useState<string>('all');
  const [selectedBiomeFilter, setSelectedBiomeFilter] = useState<string>('all');
  const [selectedImportanceFilter, setSelectedImportanceFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Available unique factions in current systems list
  const factionOptions = useMemo(() => {
    const map = new Map<string, { id: string; name: string; color: string; sigil: string; count: number }>();
    systems.forEach(sys => {
      const hId = sys.controllingHouse || 'independent';
      const houseInfo = houses[hId] || {
        id: hId,
        name: hId === 'independent' ? 'Indépendants' : hId,
        shortName: hId === 'independent' ? 'Indépendants' : hId,
        color: '#94a3b8',
        sigil: '🪐'
      };
      if (!map.has(hId)) {
        map.set(hId, {
          id: hId,
          name: houseInfo.shortName || houseInfo.name,
          color: houseInfo.color,
          sigil: houseInfo.sigil,
          count: 0
        });
      }
      map.get(hId)!.count += 1;
    });
    return Array.from(map.values());
  }, [systems, houses]);

  // Biomes / Texture types
  const biomeOptions = [
    { id: 'all', label: 'Tous les Biomes' },
    { id: 'desert', label: 'Désertique / Aride' },
    { id: 'ocean', label: 'Océanique' },
    { id: 'lush', label: 'Végétal / Sylvestre' },
    { id: 'industrial', label: 'Industriel / Minier' },
    { id: 'volcanic', label: 'Volcanique / Magmatique' },
    { id: 'imperial', label: 'Métropole / Impérial' },
    { id: 'synthetic', label: 'Synthétique / Forteresse' }
  ];

  // Importance options
  const importanceOptions = [
    { id: 'all', label: 'Toutes Importances' },
    { id: 'Crucial', label: 'Crucial (Noyau)' },
    { id: 'Majeur', label: 'Majeur' },
    { id: 'Secondaire', label: 'Secondaire' }
  ];

  // Filter and Sort Logic
  const filteredAndSortedSystems = useMemo(() => {
    let result = systems.filter(sys => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const houseObj = houses[sys.controllingHouse];
        const matchName = sys.name.toLowerCase().includes(q);
        const matchStar = sys.starName.toLowerCase().includes(q);
        const matchPlanet = sys.primaryPlanet.toLowerCase().includes(q);
        const matchHouse = houseObj && (houseObj.name.toLowerCase().includes(q) || houseObj.shortName?.toLowerCase().includes(q));
        const matchLore = sys.loreSnippet?.toLowerCase().includes(q) || sys.description?.toLowerCase().includes(q);
        const matchExports = sys.planetaryMetrics?.primaryExports?.some(e => e.toLowerCase().includes(q));
        const matchPOIs = sys.tacticalPOIs?.some(p => p.name.toLowerCase().includes(q));
        if (!matchName && !matchStar && !matchPlanet && !matchHouse && !matchLore && !matchExports && !matchPOIs) {
          return false;
        }
      }

      // Faction filter
      if (selectedFactionFilter !== 'all') {
        if (sys.controllingHouse !== selectedFactionFilter) return false;
      }

      // Biome filter
      if (selectedBiomeFilter !== 'all') {
        if (sys.surfaceTextureType !== selectedBiomeFilter) return false;
      }

      // Importance filter
      if (selectedImportanceFilter !== 'all') {
        if (sys.strategicImportance !== selectedImportanceFilter) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'house': {
          const hA = houses[a.controllingHouse]?.name || a.controllingHouse;
          const hB = houses[b.controllingHouse]?.name || b.controllingHouse;
          comparison = hA.localeCompare(hB);
          break;
        }
        case 'distanceArrakis':
          comparison = (a.distanceFromArrakisLy || 0) - (b.distanceFromArrakisLy || 0);
          break;
        case 'distanceTerra':
          comparison = (a.distanceFromTerraLy || 0) - (b.distanceFromTerraLy || 0);
          break;
        case 'importance': {
          const rank = (imp: string) => (imp === 'Crucial' ? 3 : imp === 'Majeur' ? 2 : 1);
          comparison = rank(b.strategicImportance) - rank(a.strategicImportance);
          break;
        }
        case 'population': {
          const parsePop = (str?: string) => {
            if (!str) return 0;
            const match = str.match(/([\d.,]+)\s*(Millions?|Milliards?)/i);
            if (!match) return 0;
            const num = parseFloat(match[1].replace(',', '.'));
            if (/Milliard/i.test(match[2])) return num * 1000;
            return num;
          };
          comparison = parsePop(b.planetaryMetrics?.populationTotal) - parsePop(a.planetaryMetrics?.populationTotal);
          break;
        }
        default:
          comparison = 0;
      }
      return sortAscending ? comparison : -comparison;
    });

    return result;
  }, [
    systems, 
    houses, 
    searchQuery, 
    selectedFactionFilter, 
    selectedBiomeFilter, 
    selectedImportanceFilter, 
    sortField, 
    sortAscending
  ]);

  const handleTargetSystem = (sys: StarSystem, targetZoom: ZoomLevel = 'system') => {
    audioSynth.playHoloClick(1600);
    onSelectSystem(sys);
    if (onZoomChange) {
      onZoomChange(targetZoom);
    }
    onClose();
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAscending(!sortAscending);
    } else {
      setSortField(field);
      setSortAscending(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-7xl h-[92vh] flex flex-col bg-[#07090e] border border-[#f59e0b]/40 rounded-2xl shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden text-[#e2d9c8]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f59e0b]/25 bg-gradient-to-r from-[#0d121c] via-[#090b10] to-[#0d121c] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/15 border border-[#f59e0b]/40 flex items-center justify-center text-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-[#f3e8d2]">
                  RÉPERTOIRE EXHAUSTIF DES PLANÈTES & SYSTÈMES
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40">
                  {systems.length} MONDES CANONIQUES
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono flex items-center gap-2">
                <span>Registre Spatiotemporel du Landsraad & Archives de la Spacing Guild</span>
                <span className="text-neutral-600">•</span>
                <span className="text-[#fbbf24]">{filteredAndSortedSystems.length} affichés</span>
              </p>
            </div>
          </div>

          {/* View Mode & Close */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#0d111a] border border-neutral-700/80 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-[#f59e0b] text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
                title="Vue Grille"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'table' ? 'bg-[#f59e0b] text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
                title="Vue Tableau Matriciel"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => {
                audioSynth.playHoloClick(1000);
                onClose();
              }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-neutral-700 transition-colors"
              title="Fermer le répertoire"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="p-3 sm:p-4 bg-[#0a0d14] border-b border-neutral-800 flex flex-col gap-3 shrink-0">
          
          {/* Top Row: Search Input & Quick Sort */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par planète, étoile, ressource (ex: Épice, Titane, Bois de Fer), Maison..."
                className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#0f1420] border border-neutral-700/80 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs placeholder:text-neutral-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs px-1"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <span className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#f59e0b]" /> Tri :
              </span>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0f1420] border border-neutral-700 text-xs font-mono text-[#f3e8d2] focus:border-[#f59e0b] outline-none"
              >
                <option value="name">Nom du Monde (A-Z)</option>
                <option value="house">Maison Souveraine</option>
                <option value="distanceArrakis">Distance d'Arrakis</option>
                <option value="distanceTerra">Distance de la Terre</option>
                <option value="importance">Importance Stratégique</option>
                <option value="population">Population Totale</option>
              </select>

              <button
                onClick={() => setSortAscending(!sortAscending)}
                className="px-2.5 py-1.5 rounded-lg bg-[#0f1420] border border-neutral-700 text-xs font-mono text-neutral-300 hover:text-white"
                title={sortAscending ? 'Ordre croissant' : 'Ordre décroissant'}
              >
                {sortAscending ? '▲ Croissant' : '▼ Décroissant'}
              </button>
            </div>
          </div>

          {/* Faction Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-700">
            <button
              onClick={() => setSelectedFactionFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all ${
                selectedFactionFilter === 'all'
                  ? 'bg-[#f59e0b] text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                  : 'bg-white/5 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              Tous ({systems.length})
            </button>

            {factionOptions.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFactionFilter(f.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 whitespace-nowrap border transition-all ${
                  selectedFactionFilter === f.id
                    ? 'border-white font-bold text-white shadow-md'
                    : 'border-neutral-800 bg-black/40 text-neutral-300 hover:border-neutral-600'
                }`}
                style={{
                  backgroundColor: selectedFactionFilter === f.id ? `${f.color}33` : undefined,
                  borderColor: selectedFactionFilter === f.id ? f.color : undefined
                }}
              >
                <span>{f.sigil}</span>
                <span>{f.name}</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/60 text-neutral-300">
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Biome and Strategic Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-neutral-400 pt-1 border-t border-neutral-800/60">
            <div className="flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#f59e0b]" />
              <span>Biome :</span>
              <select
                value={selectedBiomeFilter}
                onChange={(e) => setSelectedBiomeFilter(e.target.value)}
                className="px-2 py-1 rounded bg-[#0f1420] border border-neutral-700 text-xs text-[#f3e8d2] focus:border-[#f59e0b] outline-none"
              >
                {biomeOptions.map(b => (
                  <option key={b.id} value={b.id}>{b.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 ml-2">
              <span>Importance :</span>
              <select
                value={selectedImportanceFilter}
                onChange={(e) => setSelectedImportanceFilter(e.target.value)}
                className="px-2 py-1 rounded bg-[#0f1420] border border-neutral-700 text-xs text-[#f3e8d2] focus:border-[#f59e0b] outline-none"
              >
                {importanceOptions.map(i => (
                  <option key={i.id} value={i.id}>{i.label}</option>
                ))}
              </select>
            </div>

            {(selectedFactionFilter !== 'all' || selectedBiomeFilter !== 'all' || selectedImportanceFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedFactionFilter('all');
                  setSelectedBiomeFilter('all');
                  setSelectedImportanceFilter('all');
                  setSearchQuery('');
                }}
                className="ml-auto text-[11px] text-[#f59e0b] hover:underline"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 scrollbar-thin scrollbar-thumb-[#f59e0b]/30">
          {filteredAndSortedSystems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white/[0.02] border border-neutral-800 rounded-xl">
              <Globe className="w-12 h-12 text-neutral-600 mb-3 animate-pulse" />
              <h3 className="font-cinzel text-base text-neutral-300 font-bold">Aucune planète trouvée</h3>
              <p className="text-xs text-neutral-500 font-mono mt-1">
                Ajustez vos critères de recherche ou réinitialisez les filtres.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAndSortedSystems.map((sys) => {
                const house = houses[sys.controllingHouse] || HOUSES_DATA.corrino;
                const isSelected = sys.id === currentSystem.id;

                return (
                  <div
                    key={sys.id}
                    className={`relative flex flex-col rounded-xl border transition-all duration-200 overflow-hidden group ${
                      isSelected
                        ? 'bg-[#0f1422] border-[#f59e0b] shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                        : 'bg-[#0b0e16] border-neutral-800 hover:border-neutral-600 hover:bg-[#0e121c]'
                    }`}
                  >
                    {/* Top Stripe with House Color */}
                    <div 
                      className="h-1 w-full"
                      style={{ backgroundColor: house.color }}
                    />

                    <div className="p-4 flex-1 flex flex-col">
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span 
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 border"
                              style={{ 
                                color: house.color, 
                                borderColor: `${house.color}40`,
                                backgroundColor: `${house.color}15`
                              }}
                            >
                              <span>{house.sigil}</span>
                              <span>{house.shortName || house.name}</span>
                            </span>

                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider border ${
                              sys.strategicImportance === 'Crucial'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : sys.strategicImportance === 'Majeur'
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                            }`}>
                              {sys.strategicImportance}
                            </span>
                          </div>

                          <h3 className="font-cinzel text-base font-bold text-[#f3e8d2] group-hover:text-[#f59e0b] transition-colors mt-1">
                            {sys.name}
                          </h3>
                          <div className="text-[11px] font-mono text-neutral-400">
                            {sys.starName} • <span className="text-neutral-500">{sys.starType}</span>
                          </div>
                        </div>

                        {/* Visual Planet Preview Sphere */}
                        <div 
                          className="w-12 h-12 rounded-full shrink-0 border-2 shadow-lg relative overflow-hidden flex items-center justify-center"
                          style={{ 
                            borderColor: sys.atmosphereColor || house.color,
                            boxShadow: `0 0 15px ${sys.atmosphereColor || house.color}40`,
                            background: `radial-gradient(circle at 35% 35%, ${sys.atmosphereColor || '#f59e0b'}, #05070a)`
                          }}
                        >
                          <div className="absolute inset-0 bg-black/20" />
                          <Globe className="w-5 h-5 text-white/40" />
                        </div>
                      </div>

                      {/* Primary Planet & Lore */}
                      <div className="text-xs text-neutral-300 mb-3 bg-black/30 p-2 rounded-lg border border-neutral-800/80">
                        <div className="font-semibold text-[#fbbf24] text-[11px] font-mono flex items-center gap-1 mb-0.5">
                          <MapPin className="w-3 h-3 text-[#f59e0b]" /> {sys.primaryPlanet}
                        </div>
                        <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                          {sys.description}
                        </p>
                      </div>

                      {/* Planetary Metrics Grid */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-neutral-400 mb-3 bg-neutral-900/40 p-2.5 rounded-lg border border-neutral-800/50">
                        <div className="flex items-center gap-1.5">
                          <Gauge className="w-3 h-3 text-cyan-400" />
                          <span>Gravité : <strong className="text-neutral-200">{sys.planetaryMetrics?.gravityG ?? 1.0} G</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Thermometer className="w-3 h-3 text-orange-400" />
                          <span>Temp. : <strong className="text-neutral-200">{sys.planetaryMetrics?.surfaceTempAvgC ?? 20} °C</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3 h-3 text-emerald-400" />
                          <span className="truncate">Pop. : <strong className="text-neutral-200">{sys.planetaryMetrics?.populationTotal?.split(' ')[0] || 'N/A'}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Navigation className="w-3 h-3 text-purple-400" />
                          <span>Arrakis : <strong className="text-neutral-200">{sys.distanceFromArrakisLy} al</strong></span>
                        </div>
                      </div>

                      {/* Exports Tags */}
                      {sys.planetaryMetrics?.primaryExports && sys.planetaryMetrics.primaryExports.length > 0 && (
                        <div className="mb-4">
                          <div className="text-[9px] uppercase tracking-wider text-neutral-500 font-mono mb-1">
                            Exports Principaux :
                          </div>
                          <div className="flex items-center gap-1 flex-wrap">
                            {sys.planetaryMetrics.primaryExports.slice(0, 3).map((exp, idx) => (
                              <span 
                                key={idx}
                                className="px-1.5 py-0.5 rounded bg-amber-950/30 border border-amber-600/30 text-[#fde68a] text-[10px] font-mono"
                              >
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-auto pt-2 border-t border-neutral-800/80 flex items-center gap-2">
                        <button
                          onClick={() => handleTargetSystem(sys, 'planetary')}
                          className="flex-1 py-1.5 px-3 rounded-lg bg-[#f59e0b]/15 hover:bg-[#f59e0b]/25 text-[#f59e0b] border border-[#f59e0b]/40 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                          <span>CIBLER 3D</span>
                        </button>

                        <button
                          onClick={() => handleTargetSystem(sys, 'system')}
                          className="py-1.5 px-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-mono text-xs transition-colors"
                          title="Vue Système Solaire"
                        >
                          <Orbit className="w-3.5 h-3.5" />
                        </button>

                        {onOpenAstrogationFromSystem && (
                          <button
                            onClick={() => {
                              onOpenAstrogationFromSystem(sys);
                              onClose();
                            }}
                            className="py-1.5 px-2.5 rounded-lg bg-[#06b6d4]/15 hover:bg-[#06b6d4]/25 text-[#06b6d4] border border-[#06b6d4]/40 font-mono text-xs transition-colors"
                            title="Calculer un saut de la Guilde"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto border border-neutral-800 rounded-xl bg-[#090c12]">
              <table className="w-full text-left text-xs font-mono text-neutral-300">
                <thead className="bg-[#0f1422] text-[#f59e0b] border-b border-neutral-800 uppercase text-[10px] tracking-wider sticky top-0 z-10">
                  <tr>
                    <th className="p-3">Monde / Système</th>
                    <th className="p-3">Maison / Faction</th>
                    <th className="p-3">Type & Étoile</th>
                    <th className="p-3">Importance</th>
                    <th className="p-3">Dist. Arrakis</th>
                    <th className="p-3">Population</th>
                    <th className="p-3">Exports Clés</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredAndSortedSystems.map((sys) => {
                    const house = houses[sys.controllingHouse] || HOUSES_DATA.corrino;
                    const isSelected = sys.id === currentSystem.id;

                    return (
                      <tr 
                        key={sys.id}
                        className={`hover:bg-neutral-850 transition-colors ${isSelected ? 'bg-[#f59e0b]/10' : ''}`}
                      >
                        <td className="p-3 font-semibold text-[#f3e8d2] flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full shrink-0" 
                            style={{ backgroundColor: sys.atmosphereColor || house.color }}
                          />
                          <div>
                            <div className="font-bold">{sys.name}</div>
                            <div className="text-[10px] text-neutral-400">{sys.primaryPlanet}</div>
                          </div>
                        </td>

                        <td className="p-3">
                          <span 
                            className="px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 border"
                            style={{ 
                              color: house.color, 
                              borderColor: `${house.color}40`,
                              backgroundColor: `${house.color}15`
                            }}
                          >
                            <span>{house.sigil}</span>
                            <span>{house.shortName || house.name}</span>
                          </span>
                        </td>

                        <td className="p-3 text-neutral-300">
                          <div>{sys.starName}</div>
                          <div className="text-[10px] text-neutral-500">{sys.starType}</div>
                        </td>

                        <td className="p-3">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase border ${
                            sys.strategicImportance === 'Crucial'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : sys.strategicImportance === 'Majeur'
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                          }`}>
                            {sys.strategicImportance}
                          </span>
                        </td>

                        <td className="p-3 text-neutral-300 font-mono">
                          {sys.distanceFromArrakisLy} al
                        </td>

                        <td className="p-3 text-neutral-300">
                          {sys.planetaryMetrics?.populationTotal?.split(' ')[0] || 'N/A'}
                        </td>

                        <td className="p-3">
                          <span className="text-[10px] text-[#fde68a] bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-600/30">
                            {sys.planetaryMetrics?.primaryExports?.[0] || 'Général'}
                          </span>
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleTargetSystem(sys, 'planetary')}
                              className="px-2.5 py-1 rounded bg-[#f59e0b]/20 hover:bg-[#f59e0b]/30 text-[#f59e0b] border border-[#f59e0b]/40 text-[11px] font-bold transition-colors flex items-center gap-1"
                            >
                              <Crosshair className="w-3 h-3" />
                              <span>CIBLER</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-3 bg-[#0a0d14] border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[#f59e0b] font-bold">TOTAL : {systems.length} MONDES RÉPERTORIÉS</span>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span className="hidden sm:inline">12 FACTIONS & MAISONS SOUVERAINES</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400">Cliquez sur un monde pour synchroniser la carte 3D</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function Crosshair(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
      {...props}
    >
      <circle cx="12" cy="12" r="10"/>
      <line x1="22" x2="18" y1="12" y2="12"/>
      <line x1="6" x2="2" y1="12" y2="12"/>
      <line x1="12" x2="12" y1="6" y2="2"/>
      <line x1="12" x2="12" y1="22" y2="18"/>
    </svg>
  );
}
