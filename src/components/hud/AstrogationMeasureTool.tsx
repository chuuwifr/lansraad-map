import React, { useState } from 'react';
import { StarSystem, AstrogationRoute } from '../../types/landsraad';
import { HOUSES_DATA } from '../../data/landsraadData';
import { audioSynth } from '../../services/audioSynth';
import { 
  X, 
  Route, 
  Sparkles, 
  Navigation, 
  Clock, 
  Coins, 
  ShieldAlert, 
  ArrowRight,
  Zap,
  Crosshair,
  Compass
} from 'lucide-react';

interface AstrogationMeasureToolProps {
  systems: StarSystem[];
  sourceSystem: StarSystem;
  targetSystem: StarSystem | null;
  onSelectSource: (sys: StarSystem) => void;
  onSelectTarget: (sys: StarSystem) => void;
  onClose: () => void;
}

export const AstrogationMeasureTool: React.FC<AstrogationMeasureToolProps> = ({
  systems,
  sourceSystem,
  targetSystem,
  onSelectSource,
  onSelectTarget,
  onClose
}) => {
  // If target not set, pick the first other system (or Arrakis)
  const effectiveTarget = targetSystem && targetSystem.id !== sourceSystem.id 
    ? targetSystem 
    : systems.find(s => s.id !== sourceSystem.id) || systems[0];

  // Calculate 3D euclidean distance in coordinate space, scaled to light-years
  const dx = sourceSystem.coordinates[0] - effectiveTarget.coordinates[0];
  const dy = sourceSystem.coordinates[1] - effectiveTarget.coordinates[1];
  const dz = sourceSystem.coordinates[2] - effectiveTarget.coordinates[2];
  const coordDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
  
  // Real Dune lore light-years approximation
  const distanceLy = Math.round(Math.max(12, coordDistance * 1.45));
  
  // Spacing Guild Folding Calculations
  const guildSpiceFeeLitres = Math.round(distanceLy * 18.5);
  const choamTariffSolaris = Math.round(distanceLy * 145 + 12000);
  const estimatedFoldingCycles = (distanceLy / 120).toFixed(2);

  const sourceHouse = HOUSES_DATA[sourceSystem.controllingHouse] || HOUSES_DATA.corrino;
  const targetHouse = HOUSES_DATA[effectiveTarget.controllingHouse] || HOUSES_DATA.corrino;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#090b10] border border-[#06b6d4]/40 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden text-[#e2d9c8]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#06b6d4]/25 bg-gradient-to-r from-[#06b6d4]/15 via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#06b6d4]/15 border border-[#06b6d4] flex items-center justify-center text-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#e0f2fe] flex items-center gap-2">
                CALCULATEUR DE TRANSLATION SPATIALE
                <span className="px-2 py-0.5 text-[9px] font-mono bg-[#06b6d4]/20 text-[#38bdf8] border border-[#06b6d4]/40 rounded">
                  GUILDE SPATIALE
                </span>
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Calcul des vecteurs de pliage de l'espace, consommation de Mélange et tarifs CHOAM
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

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 font-mono text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Waypoints Selection Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Origin Star */}
            <div className="p-3.5 rounded-lg bg-[#04060a] border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span className="text-[#06b6d4] font-bold flex items-center gap-1">
                  <Crosshair className="w-3 h-3" /> POINT DE DÉPART (ORIGINE)
                </span>
                <span style={{ color: sourceHouse.color }}>{sourceHouse.shortName}</span>
              </div>
              <select
                value={sourceSystem.id}
                onChange={(e) => {
                  const sys = systems.find(s => s.id === e.target.value);
                  if (sys) {
                    audioSynth.playHoloClick(1600);
                    onSelectSource(sys);
                  }
                }}
                className="w-full bg-[#0d121c] border border-neutral-700 text-[#f3e8d2] font-mono text-xs rounded p-2 focus:border-[#06b6d4] focus:outline-none"
              >
                {systems.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.starType.split('(')[0]})
                  </option>
                ))}
              </select>
              <div className="text-[10px] text-neutral-500 flex justify-between">
                <span>Coord: [{sourceSystem.coordinates.join(', ')}]</span>
                <span>Type: {sourceSystem.spectralClass}</span>
              </div>
            </div>

            {/* Destination Star */}
            <div className="p-3.5 rounded-lg bg-[#04060a] border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-neutral-400">
                <span className="text-[#f59e0b] font-bold flex items-center gap-1">
                  <Compass className="w-3 h-3" /> POINT D'ARRIVÉE (DESTINATION)
                </span>
                <span style={{ color: targetHouse.color }}>{targetHouse.shortName}</span>
              </div>
              <select
                value={effectiveTarget.id}
                onChange={(e) => {
                  const sys = systems.find(s => s.id === e.target.value);
                  if (sys) {
                    audioSynth.playHoloClick(1600);
                    onSelectTarget(sys);
                  }
                }}
                className="w-full bg-[#0d121c] border border-neutral-700 text-[#f3e8d2] font-mono text-xs rounded p-2 focus:border-[#f59e0b] focus:outline-none"
              >
                {systems.filter(s => s.id !== sourceSystem.id).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.starType.split('(')[0]})
                  </option>
                ))}
              </select>
              <div className="text-[10px] text-neutral-500 flex justify-between">
                <span>Coord: [{effectiveTarget.coordinates.join(', ')}]</span>
                <span>Type: {effectiveTarget.spectralClass}</span>
              </div>
            </div>
          </div>

          {/* Jump Vector Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase block">Distance Réelle</span>
              <span className="text-base sm:text-lg font-bold text-[#38bdf8] block">
                {distanceLy} <span className="text-[10px] text-neutral-400">AL</span>
              </span>
              <span className="text-[9px] text-neutral-500">Années-Lumière</span>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase block">Temps de Pliage</span>
              <span className="text-base sm:text-lg font-bold text-[#fbbf24] block">
                0.00 <span className="text-[10px] text-neutral-400">sec</span>
              </span>
              <span className="text-[9px] text-neutral-500">Instantané (Holtzman)</span>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase block">Gaz d'Épice Requis</span>
              <span className="text-base sm:text-lg font-bold text-[#ea580c] block">
                {guildSpiceFeeLitres} <span className="text-[10px] text-neutral-400">L</span>
              </span>
              <span className="text-[9px] text-neutral-500">Dose Presciente</span>
            </div>

            <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center space-y-1">
              <span className="text-[10px] text-neutral-400 uppercase block">Tarif de Fret CHOAM</span>
              <span className="text-base sm:text-lg font-bold text-[#10b981] block">
                {choamTariffSolaris.toLocaleString()} <span className="text-[10px] text-neutral-400">₷</span>
              </span>
              <span className="text-[9px] text-neutral-500">Solaris Impériaux</span>
            </div>
          </div>

          {/* Astronavigation Technical Dossier */}
          <div className="p-4 rounded-lg bg-[#05070a] border border-[#06b6d4]/20 space-y-3">
            <h4 className="font-cinzel text-xs font-bold text-[#38bdf8] flex items-center gap-1.5 uppercase">
              <Zap className="w-3.5 h-3.5" />
              Protocole de Translation Supraluminique de la Guilde
            </h4>
            <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">
              La translation entre <strong className="text-white">{sourceSystem.name.split('//')[0]}</strong> et{' '}
              <strong className="text-white">{effectiveTarget.name.split('//')[0]}</strong> nécessite l'embarquement à bord d'un 
              Heighliner de classe Titan. Le Navigateur de la Guilde inhale une brume de Mélange hautement concentrée dans son caisson 
              pour percevoir les voies sans danger à travers l'espace replié. Sans ce calcul prescient, le vaisseau risquerait 
              de réapparaître au cœur d'une naine blanche ou d'un trou noir.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-neutral-800 text-[10px] text-neutral-400">
              <span>Indice de Sécurité de Pliage : <strong className="text-emerald-400 font-mono">99.9997%</strong></span>
              <span>•</span>
              <span>Barge d'embarquement : <strong className="text-neutral-200">Disponible</strong></span>
              <span>•</span>
              <span>Statut de la Trêve Spatiale : <strong className="text-cyan-400">Scellée</strong></span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#06b6d4]/20 bg-[#06080d] flex justify-end">
          <button
            onClick={() => {
              audioSynth.playHoloClick(1400);
              onClose();
            }}
            className="py-2 px-5 rounded bg-[#06b6d4] hover:bg-[#0891b2] text-[#04060a] font-mono text-xs font-bold tracking-wider transition-colors shadow-md"
          >
            FERMER LE CALCULATEUR
          </button>
        </div>
      </div>
    </div>
  );
};
