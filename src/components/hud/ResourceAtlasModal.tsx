import React, { useState } from 'react';
import { StarSystem } from '../../types/landsraad';
import { HOUSES_DATA } from '../../data/landsraadData';
import { audioSynth } from '../../services/audioSynth';
import { 
  X, 
  Sparkles, 
  Droplets, 
  Cpu, 
  Factory, 
  ShieldCheck, 
  Trees, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';

interface ResourceAtlasModalProps {
  systems: StarSystem[];
  onSelectSystem: (system: StarSystem) => void;
  onClose: () => void;
}

interface ResourceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  primaryWorlds: {
    systemId: string;
    systemName: string;
    houseId: string;
    outputDescription: string;
    strategicLevel: string;
  }[];
}

export const ResourceAtlasModal: React.FC<ResourceAtlasModalProps> = ({
  systems,
  onSelectSystem,
  onClose
}) => {
  const resourceCategories: ResourceCategory[] = [
    {
      id: 'spice',
      name: 'Épice Mélange & Gériatrie',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      color: '#f59e0b',
      description: 'La substance la plus précieuse de l\'Univers Connu. Prolonge la vie humaine, ouvre l\'esprit à la prescience et permet le calcul des sauts supraluminiques par la Guilde.',
      primaryWorlds: [
        {
          systemId: 'arrakis',
          systemName: 'Arrakis (Dune)',
          houseId: 'atreides',
          outputDescription: '100% de la production mondiale naturelle via le cycle larvaire de la truite des sables et des vers géants Shai-Hulud.',
          strategicLevel: 'Absolu & Vital'
        }
      ]
    },
    {
      id: 'water',
      name: 'Ressources Hydro-Agricoles & Alimentation',
      icon: <Droplets className="w-5 h-5 text-sky-400" />,
      color: '#0284c7',
      description: 'L\'eau potable et les cultures vivrières haute densité constituent la monnaie de base de nombreux mondes arides et nourrissent les populations urbaines de l\'Empire.',
      primaryWorlds: [
        {
          systemId: 'caladan',
          systemName: 'Caladan',
          houseId: 'atreides',
          outputDescription: 'Grands bassins de riz Pundi, vignobles de Cala, pêche océanique de masse et réserves d\'eau douce inépuisables.',
          strategicLevel: 'Majeur'
        }
      ]
    },
    {
      id: 'technology',
      name: 'Cyber-Mécanique & Miniaturisation (Ix / Richese)',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      color: '#06b6d4',
      description: 'Dispositifs mécaniques de haute précision, générateurs de boucliers Holtzman, transmetteurs tachyoniques et no-chambres frôlant les limites du Jihad Butlérien.',
      primaryWorlds: [
        {
          systemId: 'ix',
          systemName: 'Ix (Rodale IX)',
          houseId: 'ix',
          outputDescription: 'Manufactures de coques de Heighliners, Sondes T-Probes, micro-scanners et générateurs de non-champs.',
          strategicLevel: 'Crucial'
        },
        {
          systemId: 'richese',
          systemName: 'Richese',
          houseId: 'richese',
          outputDescription: 'Lentilles optiques fines, micro-horlogerie, miroirs solaires d\'amplification.',
          strategicLevel: 'Majeur'
        }
      ]
    },
    {
      id: 'heavy-industry',
      name: 'Métallurgie Lourde, Fonderies & Armement',
      icon: <Factory className="w-5 h-5 text-red-500" />,
      color: '#dc2626',
      description: 'Extraction minière de surface, alliages d\'obsidienne, usines de blindage lourd et production industrielle de masse pour les armées du Landsraad.',
      primaryWorlds: [
        {
          systemId: 'giedi-prime',
          systemName: 'Giedi Prime',
          houseId: 'harkonnen',
          outputDescription: 'Fosses minières à esclaves, forges d\'acier noir, blindages thermo-cinétiques et usines d\'armement lourd.',
          strategicLevel: 'Majeur'
        },
        {
          systemId: 'grumman',
          systemName: 'Grumman',
          houseId: 'moritani',
          outputDescription: 'Fonderies chimiques, synthèse de gaz de combat toxiques et munitions de suppression.',
          strategicLevel: 'Secondaire'
        }
      ]
    },
    {
      id: 'biology',
      name: 'Biotechnologie & Botanique Rare (Tleilax / Ecaz)',
      icon: <Trees className="w-5 h-5 text-purple-400" />,
      color: '#a855f7',
      description: 'Sculptures de bois vivant Fogwood, narcotiques de combat Semuta, jus de Sapho stimulant pour Mentats et synthèse cellulaire en cuves.',
      primaryWorlds: [
        {
          systemId: 'ecaz-system',
          systemName: 'Ecaz',
          houseId: 'ecaz',
          outputDescription: 'Bosquets vivants de Fogwood, extraction du narcotique Semuta et de la drogue de Sapho pour Mentats.',
          strategicLevel: 'Prestige & Rareté'
        },
        {
          systemId: 'tleilax-prime',
          systemName: 'Tleilax Prime',
          houseId: 'tleilax',
          outputDescription: 'Cuves Axlotl de clonage génétique, Gholas, Danseurs-Visages et prothèses cyber-organiques.',
          strategicLevel: 'Crucial & Secret'
        }
      ]
    },
    {
      id: 'military',
      name: 'Écoles Militaires & Régiments d\'Élite',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      color: '#10b981',
      description: 'Académies martiales et mondes d\'entraînement réputés pour façonner les guerriers les plus redoutables de l\'univers.',
      primaryWorlds: [
        {
          systemId: 'salusa-secundus',
          systemName: 'Salusa Secundus',
          houseId: 'corrino',
          outputDescription: 'Creuset impitoyable de sélection des légions fanatiques Sardaukars de l\'Empereur.',
          strategicLevel: 'Crucial'
        },
        {
          systemId: 'ginaz',
          systemName: 'Ginaz',
          houseId: 'ginaz',
          outputDescription: 'Académie des Dix Niveaux formant les Maîtres d\'Armes et instructeurs d\'escrime.',
          strategicLevel: 'Majeur'
        }
      ]
    }
  ];

  const [activeCategory, setActiveCategory] = useState<ResourceCategory>(resourceCategories[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#090b10] border border-[#f59e0b]/40 rounded-xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden text-[#e2d9c8]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f59e0b]/25 bg-gradient-to-r from-[#f59e0b]/15 via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b] flex items-center justify-center text-[#f59e0b]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#fef3c7] flex items-center gap-2">
                ATLAS DES RESSOURCES DE L'IMPERIUM
                <span className="px-2 py-0.5 text-[9px] font-mono bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30 rounded">
                  DIRECTOIRE CHOAM
                </span>
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Inventaire cartographique des gisements stratégiques, monopoles et pôles industriels
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioSynth.playHoloClick(1200);
              onClose();
            }}
            className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          
          {/* Categories Sidebar */}
          <div className="md:col-span-4 border-r border-neutral-800 overflow-y-auto p-3 space-y-2 bg-[#05070a]">
            <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest px-2 block">
              Filières Stratégiques
            </span>
            {resourceCategories.map((cat) => {
              const isSelected = activeCategory.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    audioSynth.playHoloClick(1500);
                    setActiveCategory(cat);
                  }}
                  className={`w-full p-3 rounded-lg text-left transition-all flex items-center gap-3 border ${
                    isSelected
                      ? 'bg-neutral-800 border-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      : 'bg-neutral-900/50 border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  <div className="shrink-0">{cat.icon}</div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-neutral-200 block truncate">{cat.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono block">
                      {cat.primaryWorlds.length} monde(s) pôle(s)
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details Content */}
          <div className="md:col-span-8 overflow-y-auto p-4 sm:p-6 space-y-6 font-mono text-xs bg-[#080a0f]">
            
            {/* Header info */}
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2">
                {activeCategory.icon}
                <h3 className="font-cinzel text-base font-bold text-white uppercase">
                  {activeCategory.name}
                </h3>
              </div>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {activeCategory.description}
              </p>
            </div>

            {/* List of Producer Planets */}
            <div className="space-y-3">
              <span className="font-cinzel text-xs font-bold text-[#f59e0b] uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Mondes Producteurs & Hubs Principaux
              </span>

              <div className="space-y-2.5">
                {activeCategory.primaryWorlds.map((pw) => {
                  const house = HOUSES_DATA[pw.houseId] || HOUSES_DATA.corrino;
                  const sysObj = systems.find(s => s.id === pw.systemId);

                  return (
                    <div
                      key={pw.systemId}
                      className="p-3.5 rounded-lg bg-[#05070a] border border-neutral-800 space-y-2 hover:border-[#f59e0b]/60 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{pw.systemName}</span>
                            <span 
                              className="px-2 py-0.5 text-[9px] rounded font-mono border"
                              style={{ 
                                borderColor: house.color, 
                                color: house.accentColor,
                                backgroundColor: `${house.color}15` 
                              }}
                            >
                              {house.shortName}
                            </span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                            Importance : {pw.strategicLevel}
                          </span>
                        </div>

                        {sysObj && (
                          <button
                            onClick={() => {
                              audioSynth.playHoloClick(1600);
                              onSelectSystem(sysObj);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded bg-[#f59e0b]/15 border border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#f59e0b] hover:text-black font-bold text-[10px] flex items-center gap-1 transition-colors"
                          >
                            <span>VOIR LE MONDE</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-neutral-300 font-sans">
                        {pw.outputDescription}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-[#06080d] flex justify-end">
          <button
            onClick={() => {
              audioSynth.playHoloClick(1200);
              onClose();
            }}
            className="py-2 px-5 rounded bg-[#f59e0b] hover:bg-[#d97706] text-[#060709] font-mono text-xs font-bold tracking-wider transition-colors shadow-md"
          >
            RETOUR À LA CARTE
          </button>
        </div>
      </div>
    </div>
  );
};
