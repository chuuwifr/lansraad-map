import React, { useState, useMemo } from 'react';
import { TimelineEra, TimelineEvent, TimelineEraId } from '../../types/landsraad';
import { TIMELINE_ERAS, TIMELINE_EVENTS_DATA } from '../../data/timelineData';
import { audioSynth } from '../../services/audioSynth';
import {
  X,
  Clock,
  Search,
  Filter,
  Globe,
  Flame,
  Crown,
  BookOpen,
  Shield,
  Sparkles,
  Zap,
  Navigation,
  Crosshair,
  ExternalLink,
  ChevronRight,
  Quote,
  Users,
  MapPin,
  Calendar,
  Layers,
  ArrowUpDown,
  BookMarked,
  Info
} from 'lucide-react';

interface TimelineModalProps {
  onSelectSystem?: (systemId: string) => void;
  onClose: () => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({
  onSelectSystem,
  onClose
}) => {
  const [selectedEra, setSelectedEra] = useState<TimelineEraId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Icon mapping helper
  const getEraIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Globe': return <Globe className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Navigation': return <Navigation className={className} />;
      default: return <Clock className={className} />;
    }
  };

  const getCategoryBadge = (category: TimelineEvent['category']) => {
    switch (category) {
      case 'war':
        return { label: 'Guerre & Conflit', bg: 'bg-red-950/60 text-red-400 border-red-800/80' };
      case 'political':
        return { label: 'Politique & Traité', bg: 'bg-amber-950/60 text-amber-300 border-amber-800/80' };
      case 'religious':
        return { label: 'Foi & Prophétie', bg: 'bg-purple-950/60 text-purple-300 border-purple-800/80' };
      case 'scientific':
        return { label: 'Science & Invention', bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80' };
      case 'discovery':
        return { label: 'Découverte Majeure', bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80' };
      case 'crisis':
        return { label: 'Crise & Cataclysme', bg: 'bg-rose-950/60 text-rose-300 border-rose-800/80' };
      case 'dynasty':
        return { label: 'Dynastie & Règne', bg: 'bg-yellow-950/60 text-yellow-300 border-yellow-800/80' };
      default:
        return { label: 'Événement', bg: 'bg-neutral-800 text-neutral-300 border-neutral-700' };
    }
  };

  // Filtered and sorted events list
  const filteredEvents = useMemo(() => {
    return TIMELINE_EVENTS_DATA.filter((evt) => {
      // Era filter
      if (selectedEra !== 'all' && evt.era !== selectedEra) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && evt.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = evt.title.toLowerCase().includes(q);
        const matchSubtitle = evt.subtitle?.toLowerCase().includes(q) || false;
        const matchDesc = evt.description.toLowerCase().includes(q);
        const matchImpact = evt.impact.toLowerCase().includes(q);
        const matchFigures = evt.keyFigures.some(f => f.toLowerCase().includes(q));
        const matchPlanet = evt.relatedPlanetName?.toLowerCase().includes(q) || false;
        const matchDate = evt.dateDisplay.toLowerCase().includes(q);
        const matchFaction = evt.factionName.toLowerCase().includes(q);
        return matchTitle || matchSubtitle || matchDesc || matchImpact || matchFigures || matchPlanet || matchDate || matchFaction;
      }
      return true;
    }).sort((a, b) => {
      return sortOrder === 'asc' ? a.year - b.year : b.year - a.year;
    });
  }, [selectedEra, selectedCategory, searchQuery, sortOrder]);

  const handleWarpToPlanet = (systemId: string, eventTitle: string) => {
    audioSynth.playHoloClick(1800);
    if (onSelectSystem) {
      onSelectSystem(systemId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#07090e] border border-[#f59e0b]/40 rounded-xl shadow-[0_0_60px_rgba(245,158,11,0.25)] overflow-hidden text-[#e2d9c8]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#f59e0b]/25 bg-gradient-to-r from-[#f59e0b]/15 via-transparent to-[#f59e0b]/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/20 border border-[#f59e0b] flex items-center justify-center text-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-base sm:text-xl font-bold text-[#fef3c7] tracking-wider">
                  CHRONOLOGIE HISTORIQUE DE DUNE
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30 rounded">
                  EXPANDED DUNE ARCHIVES
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400">
                Des origines de la Terre et du Jihad Butlérien jusqu'au Règne de Leto II et la Grande Dispersion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioSynth.playHoloClick(1100);
                setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-300 flex items-center gap-1.5 transition-colors"
              title={sortOrder === 'asc' ? 'Ordre chronologique (Ancien -> Récent)' : 'Ordre antéchronologique (Récent -> Ancien)'}
            >
              <ArrowUpDown className="w-4 h-4 text-[#f59e0b]" />
              <span className="hidden md:inline">{sortOrder === 'asc' ? 'Chronologique' : 'Antéchronologique'}</span>
            </button>

            <button
              onClick={() => {
                audioSynth.playHoloClick(1000);
                onClose();
              }}
              className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Toolbar & Search Bar */}
        <div className="p-3 sm:p-4 bg-[#05070a] border-b border-neutral-800/80 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par mot-clé (Paul Muad'Dib, Épice, Arrakis, Holtzman, Corrin, Jihad...)"
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#0b0e14] border border-neutral-700 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs focus:outline-none placeholder-neutral-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#f59e0b] shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                audioSynth.playHoloClick(1200);
                setSelectedCategory(e.target.value);
              }}
              className="px-3 py-2 rounded-lg bg-[#0b0e14] border border-neutral-700 text-[#f3e8d2] font-mono text-xs focus:outline-none focus:border-[#f59e0b]"
            >
              <option value="all">Toutes les Catégories ({TIMELINE_EVENTS_DATA.length})</option>
              <option value="war">Guerres & Conflits</option>
              <option value="political">Politique & Traités</option>
              <option value="religious">Foi & Prophéties</option>
              <option value="scientific">Sciences & Inventions</option>
              <option value="discovery">Découvertes Majeures</option>
              <option value="crisis">Crises & Cataclysmes</option>
              <option value="dynasty">Dynasties & Règnes</option>
            </select>
          </div>
        </div>

        {/* Horizontal Eras Ribbon Tabs */}
        <div className="flex border-b border-neutral-800 bg-[#040609] overflow-x-auto text-xs font-mono scrollbar-thin scrollbar-thumb-neutral-700">
          <button
            onClick={() => {
              audioSynth.playHoloClick(1200);
              setSelectedEra('all');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 font-bold whitespace-nowrap transition-colors shrink-0 ${
              selectedEra === 'all'
                ? 'border-[#f59e0b] text-[#f59e0b] bg-[#f59e0b]/10'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Toutes les Époques ({TIMELINE_EVENTS_DATA.length})</span>
          </button>

          {TIMELINE_ERAS.map((era) => {
            const count = TIMELINE_EVENTS_DATA.filter(e => e.era === era.id).length;
            const isSelected = selectedEra === era.id;
            return (
              <button
                key={era.id}
                onClick={() => {
                  audioSynth.playHoloClick(1300);
                  setSelectedEra(era.id);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 font-bold whitespace-nowrap transition-colors shrink-0 ${
                  isSelected
                    ? 'border-[#f59e0b] text-[#fbbf24] bg-[#f59e0b]/10'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200'
                }`}
                style={{
                  borderBottomColor: isSelected ? era.accentColor : undefined,
                  color: isSelected ? era.accentColor : undefined
                }}
              >
                {getEraIcon(era.iconName, 'w-3.5 h-3.5')}
                <span>{era.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800/80 text-neutral-300 font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Era Summary Card Banner (when a specific era is selected) */}
        {selectedEra !== 'all' && (
          <div className="p-3 sm:p-4 bg-[#0a0f18] border-b border-[#f59e0b]/20 flex items-center justify-between gap-4">
            {(() => {
              const currentEra = TIMELINE_ERAS.find(e => e.id === selectedEra);
              if (!currentEra) return null;
              return (
                <div className="flex items-start gap-3">
                  <div 
                    className="p-2 rounded-lg border shrink-0 mt-0.5"
                    style={{ borderColor: currentEra.accentColor, backgroundColor: `${currentEra.accentColor}20` }}
                  >
                    {getEraIcon(currentEra.iconName, 'w-4 h-4 text-white')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel font-bold text-xs sm:text-sm text-white">
                        {currentEra.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#fde68a]">
                        {currentEra.periodDisplay}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300 mt-1 font-mono leading-relaxed max-w-4xl">
                      {currentEra.summary}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Events Timeline Stream Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-6 font-mono custom-scrollbar">
          
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center bg-neutral-950/40 rounded-xl border border-neutral-800 text-neutral-400 space-y-3">
              <BookMarked className="w-10 h-10 mx-auto text-neutral-600" />
              <p className="text-sm font-cinzel text-neutral-300">Aucun événement historique ne correspond à vos filtres.</p>
              <p className="text-xs text-neutral-500">Essayez d'ajuster votre recherche ou de sélectionner « Toutes les Époques ».</p>
              <button
                onClick={() => {
                  setSelectedEra('all');
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-[#f59e0b] border border-neutral-700 mt-2 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="relative pl-4 sm:pl-8 space-y-6 before:absolute before:left-[19px] sm:before:left-[35px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#f59e0b]/60 before:via-[#f59e0b]/30 before:to-[#f59e0b]/10">
              
              {filteredEvents.map((evt) => {
                const badge = getCategoryBadge(evt.category);
                const isExpanded = expandedEventId === evt.id;
                const eraObj = TIMELINE_ERAS.find(e => e.id === evt.era);

                return (
                  <div
                    key={evt.id}
                    className="relative group transition-all"
                  >
                    {/* Glowing Timeline Marker Orb */}
                    <div 
                      className="absolute -left-[20px] sm:-left-[36px] top-4 w-4 h-4 rounded-full border-2 border-[#07090e] shadow-[0_0_12px_rgba(245,158,11,0.6)] flex items-center justify-center transition-transform group-hover:scale-125"
                      style={{ backgroundColor: evt.factionColor || '#f59e0b' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
                    </div>

                    {/* Main Event Card */}
                    <div 
                      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                        isExpanded
                          ? 'border-[#f59e0b] bg-[#0c101a] shadow-[0_0_25px_rgba(245,158,11,0.2)]'
                          : 'border-neutral-800 hover:border-[#f59e0b]/60 bg-[#070a12] hover:bg-[#0a0e18]'
                      }`}
                    >
                      {/* Card Header */}
                      <div 
                        onClick={() => {
                          audioSynth.playHoloClick(1100);
                          setExpandedEventId(prev => prev === evt.id ? null : evt.id);
                        }}
                        className="p-3.5 sm:p-4 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          {/* Top Tag Row */}
                          <div className="flex flex-wrap items-center gap-2 text-[10px]">
                            {/* Stardate Badge */}
                            <span className="px-2 py-0.5 rounded font-bold font-mono bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/40 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {evt.dateDisplay}
                            </span>

                            {evt.earthYearEquivalent && (
                              <span className="text-neutral-400 font-mono hidden md:inline">
                                ({evt.earthYearEquivalent})
                              </span>
                            )}

                            {/* Category Badge */}
                            <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${badge.bg}`}>
                              {badge.label}
                            </span>

                            {/* Faction Badge */}
                            <span 
                              className="px-2 py-0.5 rounded border text-[9px] font-bold"
                              style={{ 
                                borderColor: `${evt.factionColor}60`, 
                                color: evt.factionColor, 
                                backgroundColor: `${evt.factionColor}15` 
                              }}
                            >
                              {evt.factionName}
                            </span>
                          </div>

                          {/* Title & Subtitle */}
                          <h3 className="font-cinzel text-sm sm:text-base font-bold text-neutral-100 group-hover:text-[#fef3c7] transition-colors">
                            {evt.title}
                          </h3>

                          {evt.subtitle && (
                            <p className="text-xs text-neutral-400 italic">
                              {evt.subtitle}
                            </p>
                          )}
                        </div>

                        {/* Right Planet Link / Expansion Indicator */}
                        <div className="flex items-center gap-2 shrink-0 pt-1 sm:pt-0">
                          {evt.relatedSystemId && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWarpToPlanet(evt.relatedSystemId!, evt.title);
                              }}
                              className="px-2.5 py-1 rounded bg-[#f59e0b]/15 hover:bg-[#f59e0b]/30 text-[#fbbf24] border border-[#f59e0b]/50 text-[10px] font-mono font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                              title={`Localiser ${evt.relatedPlanetName || 'ce monde'} sur la Carte Galactique 3D`}
                            >
                              <Crosshair className="w-3.5 h-3.5 text-[#f59e0b]" />
                              <span>{evt.relatedPlanetName || 'Localiser Monde'}</span>
                            </button>
                          )}

                          <div className={`p-1 text-neutral-400 transition-transform ${isExpanded ? 'rotate-90 text-[#f59e0b]' : ''}`}>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details Body */}
                      {isExpanded && (
                        <div className="px-3.5 pb-4 sm:px-4 sm:pb-4 pt-1 border-t border-neutral-800/80 space-y-3.5 text-xs text-neutral-300 animate-fadeIn">
                          
                          {/* Main Description */}
                          <p className="leading-relaxed text-[#e5e7eb]">
                            {evt.description}
                          </p>

                          {/* Quote block if present */}
                          {evt.quote && (
                            <div className="p-3 rounded-lg bg-neutral-900/90 border-l-2 border-[#f59e0b] text-[11px] text-amber-200/90 italic flex items-start gap-2.5">
                              <Quote className="w-4 h-4 text-[#f59e0b] shrink-0 mt-0.5 opacity-80" />
                              <div>
                                <p>« {evt.quote.text} »</p>
                                <span className="text-[9px] text-neutral-400 block mt-1 not-italic font-mono">
                                  — {evt.quote.author}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Historical Impact & Key Figures */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            {/* Impact */}
                            <div className="p-2.5 rounded-lg bg-[#070b14] border border-neutral-800 space-y-1">
                              <span className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5" /> Impact Historique Majeur
                              </span>
                              <p className="text-[11px] text-neutral-300">
                                {evt.impact}
                              </p>
                            </div>

                            {/* Key Figures */}
                            <div className="p-2.5 rounded-lg bg-[#070b14] border border-neutral-800 space-y-1">
                              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5" /> Personnages & Protagonistes Clés
                              </span>
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {evt.keyFigures.map((fig, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/60 text-[10px] text-cyan-200"
                                  >
                                    {fig}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Footer Action to Jump to Planet */}
                          {evt.relatedSystemId && (
                            <div className="pt-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleWarpToPlanet(evt.relatedSystemId!, evt.title)}
                                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.35)] hover:brightness-110 transition-all"
                              >
                                <Crosshair className="w-4 h-4" />
                                <span>VOIR {evt.relatedPlanetName?.toUpperCase() || 'LE SYSTÈME'} SUR LA CARTE 3D</span>
                              </button>
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="p-3 sm:p-4 border-t border-[#f59e0b]/20 bg-[#040609] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse shrink-0" />
            <span>Chronologie Officielle Élargie (Expanded Dune) • {filteredEvents.length} événements documentés</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audioSynth.playHoloClick(1000);
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
            >
              Fermer la Chronologie
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
