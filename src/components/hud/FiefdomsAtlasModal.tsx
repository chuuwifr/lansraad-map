import React, { useState, useRef } from 'react';
import { HouseInfo, StarSystem } from '../../types/landsraad';
import { HOUSES_DATA } from '../../data/landsraadData';
import { HouseSigilImage } from '../common/HouseSigilImage';
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
  Check
} from 'lucide-react';

interface FiefdomsAtlasModalProps {
  systems: StarSystem[];
  houses?: Record<string, HouseInfo>;
  onUpdateHouse?: (updatedHouse: HouseInfo) => void;
  onSelectSystem: (system: StarSystem) => void;
  onClose: () => void;
}

export const FiefdomsAtlasModal: React.FC<FiefdomsAtlasModalProps> = ({
  systems,
  houses = HOUSES_DATA,
  onUpdateHouse,
  onSelectSystem,
  onClose
}) => {
  const houseList = Object.values(houses);
  const [selectedHouseId, setSelectedHouseId] = useState<string>(houseList[0].id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedHouse = houses[selectedHouseId] || houseList[0];
  const associatedSystems = systems.filter(s => s.controllingHouse === selectedHouse.id);

  const handleSigilUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl && onUpdateHouse) {
        onUpdateHouse({
          ...selectedHouse,
          customSigilUrl: dataUrl
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSigil = () => {
    if (onUpdateHouse) {
      onUpdateHouse({
        ...selectedHouse,
        customSigilUrl: undefined
      });
    }
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

      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#090b10] border border-[#f59e0b]/40 rounded-xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden text-[#e2d9c8]">
        
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

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          
          {/* Left: Houses Selector List */}
          <div className="md:col-span-4 border-r border-neutral-800 overflow-y-auto p-3 space-y-2 bg-[#05070a]">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest px-2 block">
              Grandes Maisons & Ordres ({houseList.length})
            </span>
            {houseList.map((h) => {
              const isSelected = selectedHouse.id === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => setSelectedHouseId(h.id)}
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
          </div>

          {/* Right: Selected House Geopolitical Dossier & Sigil Customizer */}
          <div className="md:col-span-8 overflow-y-auto p-4 sm:p-6 space-y-6 font-mono text-xs bg-[#080a0f]">
            
            {/* Top House Card with Coat of Arms Display & Upload CTA */}
            <div 
              className="p-4 sm:p-5 rounded-xl border relative overflow-hidden space-y-4"
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

                {/* Upload / Edit Sigil Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-[#f59e0b]/20 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black border border-[#f59e0b]/50 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{selectedHouse.customSigilUrl ? 'MODIFIER LE BLASON' : 'UPLOADER BLASON'}</span>
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
                <p className="text-xs text-neutral-500 italic p-3 bg-neutral-900/40 rounded border border-neutral-800">
                  Aucun système canonique majeur répertorié dans ce secteur.
                </p>
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

          </div>
        </div>

      </div>
    </div>
  );
};
