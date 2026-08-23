import React, { useState, useRef } from 'react';
import { HouseInfo, StarSystem } from '../../types/landsraad';
import { HOUSES_DATA } from '../../data/landsraadData';
import { HouseSigilImage } from '../common/HouseSigilImage';
import { HouseCreatorModal } from './HouseCreatorModal';
import { audioSynth } from '../../services/audioSynth';
import { 
  X, 
  Shield, 
  Globe, 
  Award, 
  TrendingUp, 
  Layers, 
  Crosshair, 
  Scale, 
  MapPin,
  ChevronRight,
  UploadCloud,
  Trash2,
  Sparkles,
  Check,
  Plus,
  Edit3,
  Search
} from 'lucide-react';

interface FiefdomsAtlasModalProps {
  systems: StarSystem[];
  houses?: Record<string, HouseInfo>;
  onUpdateHouse?: (updatedHouse: HouseInfo) => void;
  onSaveNewHouse?: (newHouse: HouseInfo) => void;
  onSelectSystem: (system: StarSystem) => void;
  onClose: () => void;
}

export const FiefdomsAtlasModal: React.FC<FiefdomsAtlasModalProps> = ({
  systems,
  houses = HOUSES_DATA,
  onUpdateHouse,
  onSaveNewHouse,
  onSelectSystem,
  onClose
}) => {
  const houseList = Object.values(houses);
  const [selectedHouseId, setSelectedHouseId] = useState<string>(houseList[0]?.id || 'corrino');
  const [isHouseCreatorOpen, setIsHouseCreatorOpen] = useState(false);
  const [editingHouse, setEditingHouse] = useState<HouseInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedHouse = houses[selectedHouseId] || houseList[0];
  const associatedSystems = systems.filter(s => s.controllingHouse === selectedHouse?.id);

  const filteredHouseList = houseList.filter(h => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      h.name.toLowerCase().includes(q) ||
      h.shortName.toLowerCase().includes(q) ||
      h.ruler.toLowerCase().includes(q) ||
      h.homeworld.toLowerCase().includes(q)
    );
  });

  const handleSigilUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && (onUpdateHouse || onSaveNewHouse)) {
        const handler = onUpdateHouse || onSaveNewHouse;
        handler?.({
          ...selectedHouse,
          customSigilUrl: dataUrl
        });
        audioSynth.playHoloClick(1500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSigil = () => {
    if (onUpdateHouse || onSaveNewHouse) {
      const handler = onUpdateHouse || onSaveNewHouse;
      handler?.({
        ...selectedHouse,
        customSigilUrl: undefined
      });
      audioSynth.playHoloClick(900);
    }
  };

  const handleSaveHouseFromCreator = (savedHouse: HouseInfo) => {
    if (onSaveNewHouse) {
      onSaveNewHouse(savedHouse);
    } else if (onUpdateHouse) {
      onUpdateHouse(savedHouse);
    }
    setSelectedHouseId(savedHouse.id);
    setIsHouseCreatorOpen(false);
    setEditingHouse(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      
      {/* Hidden File Input for House Sigil */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleSigilUpload}
      />

      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#090b10] border border-[#f59e0b]/40 rounded-xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden text-[#e2d9c8]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f59e0b]/25 bg-gradient-to-r from-[#f59e0b]/15 via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b] flex items-center justify-center text-[#f59e0b]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#fef3c7] flex items-center gap-2">
                ATLAS DES FIEFS DU LANDSRAAD & HÉRALDIQUE
                <span className="px-2 py-0.5 text-[9px] font-mono bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30 rounded">
                  BLASONS IMPÉRIAUX
                </span>
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Cartographie des souverainetés planétaires, armoiries des Grandes Maisons et poids politique
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Create House Button */}
            <button
              onClick={() => {
                audioSynth.playHoloClick(1400);
                setEditingHouse(null);
                setIsHouseCreatorOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-black font-cinzel font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all"
              title="Enregistrer une nouvelle Grande Maison dans le Landsraad"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>AJOUTER UNE MAISON</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          
          {/* Left: Houses Selector List & Search Filter */}
          <div className="md:col-span-4 border-r border-neutral-800 overflow-y-auto p-3 space-y-2 bg-[#05070a] flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block">
                Grandes Maisons ({houseList.length})
              </span>
              <button
                onClick={() => {
                  audioSynth.playHoloClick(1300);
                  setEditingHouse(null);
                  setIsHouseCreatorOpen(true);
                }}
                className="text-[10px] font-mono text-[#f59e0b] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Nouvelle
              </button>
            </div>

            {/* Filter Search Box */}
            <div className="relative mb-2">
              <Search className="w-3 h-3 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrer les Maisons..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#0a0d14] border border-neutral-800 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs placeholder:text-neutral-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
              {filteredHouseList.map((h) => {
                const isSelected = selectedHouse?.id === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => {
                      audioSynth.playHoloClick(1100);
                      setSelectedHouseId(h.id);
                    }}
                    className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'bg-neutral-800 border-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                        : 'bg-neutral-900/50 border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <HouseSigilImage house={h} size="sm" showGlow={false} />
                      <div className="truncate">
                        <span className="text-xs font-bold text-neutral-200 block truncate">{h.name}</span>
                        <span className="text-[10px] text-neutral-400 font-mono block">
                          Fief : {h.homeworld}
                        </span>
                      </div>
                    </div>
                    <div 
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: h.color }}
                    />
                  </button>
                );
              })}

              {filteredHouseList.length === 0 && (
                <p className="text-xs text-neutral-500 text-center py-6">
                  Aucune Maison trouvée
                </p>
              )}
            </div>

            {/* Quick Add House CTA in sidebar */}
            <button
              onClick={() => {
                audioSynth.playHoloClick(1400);
                setEditingHouse(null);
                setIsHouseCreatorOpen(true);
              }}
              className="w-full py-2 px-3 mt-2 rounded-lg border border-dashed border-[#f59e0b]/40 hover:border-[#f59e0b] bg-[#f59e0b]/5 hover:bg-[#f59e0b]/15 text-[#f59e0b] font-mono text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Créer une Maison Noble</span>
            </button>
          </div>

          {/* Right: Selected House Geopolitical Dossier & Sigil Customizer */}
          <div className="md:col-span-8 overflow-y-auto p-4 sm:p-6 space-y-6 font-mono text-xs bg-[#080a0f] custom-scrollbar">
            
            {selectedHouse ? (
              <>
                {/* Top House Card with Coat of Arms Display & Upload CTA */}
                <div 
                  className="p-4 sm:p-5 rounded-xl border relative overflow-hidden space-y-4 shadow-lg"
                  style={{
                    borderColor: `${selectedHouse.color}50`,
                    backgroundColor: `${selectedHouse.color}08`
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <HouseSigilImage house={selectedHouse} size="xl" />
                      <div>
                        <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white uppercase tracking-wide">
                          {selectedHouse.name}
                        </h3>
                        <p className="text-xs text-neutral-300 font-mono">
                          {selectedHouse.titles}
                        </p>
                        <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                          Souverain : <span className="text-white font-semibold">{selectedHouse.ruler}</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions: Edit Data & Sigil */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          audioSynth.playHoloClick(1400);
                          setEditingHouse(selectedHouse);
                          setIsHouseCreatorOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all"
                        title="Modifier les statistiques et chroniques de cette Maison"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#f59e0b]" />
                        <span>MODIFIER</span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-[#f59e0b]/20 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black border border-[#f59e0b]/50 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                      >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>{selectedHouse.customSigilUrl ? 'MODIFIER BLASON' : 'UPLOADER BLASON'}</span>
                      </button>

                      {selectedHouse.customSigilUrl && (
                        <button
                          onClick={handleRemoveSigil}
                          className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white border border-red-800 transition-all"
                          title="Rétablir l'emblème héraldique canonique"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Status Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <div 
                      className="px-2.5 py-1 rounded text-xs font-bold font-mono border"
                      style={{ 
                        borderColor: selectedHouse.color, 
                        color: selectedHouse.accentColor,
                        backgroundColor: `${selectedHouse.color}20` 
                      }}
                    >
                      {selectedHouse.voteWeight} VOIX LANDSRAAD
                    </div>

                    {selectedHouse.customSigilUrl ? (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Armoiries Personnalisées Actives
                      </span>
                    ) : (
                      <span className="text-[11px] text-neutral-400 italic">
                        Blason par défaut • Cliquez ci-dessus pour importer une image (PNG/JPG)
                      </span>
                    )}
                  </div>

                  {/* Banner Quote */}
                  <div className="pt-2 italic text-xs text-[#fef3c7] font-serif leading-relaxed">
                    « {selectedHouse.bannerQuote} »
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase block">Monde Capitale</span>
                    <span className="font-bold text-white text-xs block mt-1 truncate">{selectedHouse.homeworld}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase block">Puissance Militaire</span>
                    <span className="font-bold text-[#fbbf24] text-xs block mt-1">{selectedHouse.militaryRating} / 100</span>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase block">Actions CHOAM</span>
                    <span className="font-bold text-[#06b6d4] text-xs block mt-1">{selectedHouse.choamSharesPercent}%</span>
                  </div>
                  <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase block">Réserves Épice</span>
                    <span className="font-bold text-[#ea580c] text-xs block mt-1">{selectedHouse.spiceStockKg.toLocaleString()} kg</span>
                  </div>
                </div>

                {/* Doctrine and Description */}
                <div className="space-y-3 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
                  <div>
                    <span className="text-[10px] text-[#f59e0b] uppercase font-bold block mb-1">
                      Doctrine & Idéologie Féodale :
                    </span>
                    <p className="text-xs text-neutral-200 font-sans leading-relaxed">
                      {selectedHouse.ideology}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-neutral-800">
                    <span className="text-[10px] text-[#f59e0b] uppercase font-bold block mb-1">
                      Histoire & Rôle dans l'Imperium :
                    </span>
                    <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                      {selectedHouse.description}
                    </p>
                  </div>
                </div>

                {/* Controlled Star Systems & Planetary Fiefs */}
                <div className="space-y-2">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">
                    Fiefs Planétaires et Systèmes Sous Contrôle ({associatedSystems.length})
                  </span>
                  
                  {associatedSystems.length === 0 ? (
                    <div className="p-4 bg-neutral-900/40 rounded-lg border border-neutral-800 text-center space-y-2">
                      <p className="text-xs text-neutral-400 italic">
                        Aucun système stellaire sous domination directe de cette Maison pour l'instant.
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Vous pouvez assigner des planètes existantes ou en créer de nouvelles sous la bannière de {selectedHouse.name} dans la Forge Planétaire.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {associatedSystems.map((sys) => (
                        <button
                          key={sys.id}
                          onClick={() => {
                            onSelectSystem(sys);
                            onClose();
                          }}
                          className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800 hover:border-[#f59e0b] text-left transition-all group flex items-center justify-between"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-[#f59e0b]" />
                              <span className="text-xs font-bold text-white group-hover:text-[#f59e0b] transition-colors truncate block">
                                {sys.primaryPlanet}
                              </span>
                            </div>
                            <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                              Système : {sys.starName} ({sys.spectralClass})
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : null}

          </div>
        </div>

      </div>

      {/* House Creator Modal */}
      {isHouseCreatorOpen && (
        <HouseCreatorModal
          initialHouse={editingHouse}
          existingSystems={systems}
          onSaveHouse={handleSaveHouseFromCreator}
          onClose={() => {
            setIsHouseCreatorOpen(false);
            setEditingHouse(null);
          }}
        />
      )}
    </div>
  );
};
