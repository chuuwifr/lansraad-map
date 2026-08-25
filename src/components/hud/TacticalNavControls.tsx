import React, { useRef, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus, 
  RotateCcw, 
  ZoomIn, 
  Compass,
  Layers
} from 'lucide-react';
import { ZoomLevel } from '../../types/landsraad';
import { audioSynth } from '../../services/audioSynth';

interface TacticalNavControlsProps {
  zoomLevel: ZoomLevel;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: (deltaTheta: number, deltaPhi: number) => void;
  onResetOrientation: () => void;
  onSetZoomLevel?: (level: ZoomLevel) => void;
}

const ZOOM_TIERS: { id: ZoomLevel; label: string; shortLabel: string; scale: string; pct: string }[] = [
  { id: 'deep_space', label: 'Cosmos (Grand Angle)', shortLabel: 'Cosmos', scale: '1:1500 AL', pct: '20%' },
  { id: 'galactic', label: 'Secteur Galactique', shortLabel: 'Secteur', scale: '1:600 AL', pct: '50%' },
  { id: 'system', label: 'Système Solaire', shortLabel: 'Système', scale: '1:40 UA', pct: '100%' },
  { id: 'planetary', label: 'Orbite Planétaire', shortLabel: 'Orbite', scale: '1:100k KM', pct: '220%' },
  { id: 'tactical', label: 'Surface & Tactique', shortLabel: 'Surface', scale: '1:2k KM', pct: '450%' },
];

export const TacticalNavControls: React.FC<TacticalNavControlsProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onRotate,
  onResetOrientation,
  onSetZoomLevel
}) => {
  const continuousRotateInterval = useRef<number | null>(null);

  const currentTierIndex = ZOOM_TIERS.findIndex(t => t.id === zoomLevel);
  const safeIndex = currentTierIndex >= 0 ? currentTierIndex : 1;
  const currentTier = ZOOM_TIERS[safeIndex];

  const startContinuousRotation = (deltaTheta: number, deltaPhi: number) => {
    onRotate(deltaTheta, deltaPhi);
    if (continuousRotateInterval.current) {
      clearInterval(continuousRotateInterval.current);
    }
    continuousRotateInterval.current = window.setInterval(() => {
      onRotate(deltaTheta, deltaPhi);
    }, 45);
  };

  const stopContinuousRotation = () => {
    if (continuousRotateInterval.current) {
      clearInterval(continuousRotateInterval.current);
      continuousRotateInterval.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (continuousRotateInterval.current) {
        clearInterval(continuousRotateInterval.current);
      }
    };
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const targetTier = ZOOM_TIERS[val];
    if (targetTier && onSetZoomLevel) {
      audioSynth.playHoloClick(1200 + val * 120);
      onSetZoomLevel(targetTier.id);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 p-3 rounded-2xl bg-[#06080d]/92 backdrop-blur-md border border-[#f59e0b]/35 shadow-[0_8px_32px_rgba(0,0,0,0.7)] select-none text-[#e2d9c8] w-[184px]">
      
      {/* Title / Compass Header */}
      <div className="flex items-center justify-between w-full px-1 border-b border-neutral-800/80 pb-2">
        <div className="flex items-center gap-1.5 font-cinzel text-[11px] font-bold text-[#f59e0b] tracking-wider uppercase">
          <Compass className="w-3.5 h-3.5 animate-[spin_12s_linear_infinite]" />
          <span>Navigation</span>
        </div>
        <button
          onClick={() => {
            audioSynth.playHoloClick(1600);
            onResetOrientation();
          }}
          title="Réinitialiser l'orientation"
          className="p-1 rounded text-neutral-400 hover:text-[#f59e0b] hover:bg-[#f59e0b]/10 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. Croix Directionnelle (D-Pad) */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Decorative central holographic rings */}
        <div className="absolute inset-2 rounded-full border border-dashed border-[#f59e0b]/20 pointer-events-none" />
        <div className="absolute inset-5 rounded-full border border-[#f59e0b]/15 pointer-events-none" />

        {/* Up Button */}
        <button
          onMouseDown={() => startContinuousRotation(0, -0.045)}
          onMouseUp={stopContinuousRotation}
          onMouseLeave={stopContinuousRotation}
          onTouchStart={() => startContinuousRotation(0, -0.045)}
          onTouchEnd={stopContinuousRotation}
          title="Incliner vers le haut (Pitch Up)"
          aria-label="Incliner vers le haut"
          className="absolute top-0 inset-x-9 h-8 flex items-center justify-center rounded-t-lg bg-[#121620] hover:bg-[#f59e0b] text-neutral-300 hover:text-black active:scale-95 transition-all border border-[#f59e0b]/30 shadow-md group"
        >
          <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        </button>

        {/* Down Button */}
        <button
          onMouseDown={() => startContinuousRotation(0, 0.045)}
          onMouseUp={stopContinuousRotation}
          onMouseLeave={stopContinuousRotation}
          onTouchStart={() => startContinuousRotation(0, 0.045)}
          onTouchEnd={stopContinuousRotation}
          title="Incliner vers le bas (Pitch Down)"
          aria-label="Incliner vers le bas"
          className="absolute bottom-0 inset-x-9 h-8 flex items-center justify-center rounded-b-lg bg-[#121620] hover:bg-[#f59e0b] text-neutral-300 hover:text-black active:scale-95 transition-all border border-[#f59e0b]/30 shadow-md group"
        >
          <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
        </button>

        {/* Left Button */}
        <button
          onMouseDown={() => startContinuousRotation(0.055, 0)}
          onMouseUp={stopContinuousRotation}
          onMouseLeave={stopContinuousRotation}
          onTouchStart={() => startContinuousRotation(0.055, 0)}
          onTouchEnd={stopContinuousRotation}
          title="Pivoter vers la gauche (Yaw Left)"
          aria-label="Pivoter vers la gauche"
          className="absolute left-0 inset-y-9 w-8 flex items-center justify-center rounded-l-lg bg-[#121620] hover:bg-[#f59e0b] text-neutral-300 hover:text-black active:scale-95 transition-all border border-[#f59e0b]/30 shadow-md group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        </button>

        {/* Right Button */}
        <button
          onMouseDown={() => startContinuousRotation(-0.055, 0)}
          onMouseUp={stopContinuousRotation}
          onMouseLeave={stopContinuousRotation}
          onTouchStart={() => startContinuousRotation(-0.055, 0)}
          onTouchEnd={stopContinuousRotation}
          title="Pivoter vers la droite (Yaw Right)"
          aria-label="Pivoter vers la droite"
          className="absolute right-0 inset-y-9 w-8 flex items-center justify-center rounded-r-lg bg-[#121620] hover:bg-[#f59e0b] text-neutral-300 hover:text-black active:scale-95 transition-all border border-[#f59e0b]/30 shadow-md group"
        >
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Center Reset Button */}
        <button
          onClick={() => {
            audioSynth.playHoloClick(1600);
            onResetOrientation();
          }}
          title="Recentrer la caméra"
          className="w-7 h-7 rounded-full bg-[#1e2536] hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black flex items-center justify-center font-mono text-[10px] font-bold transition-colors z-10 border border-[#f59e0b]/40 shadow-inner"
        >
          ●
        </button>
      </div>

      {/* 2. Contrôle de Zoom Nuancé & Curseur Holographique */}
      <div className="w-full flex flex-col gap-2 pt-2 border-t border-neutral-800/80">
        
        {/* Telemetry Header */}
        <div className="flex flex-col gap-0.5 px-0.5">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span className="flex items-center gap-1 uppercase">
              <ZoomIn className="w-3 h-3 text-[#f59e0b]" /> Zoom
            </span>
            <span className="text-[#f59e0b] font-bold uppercase tracking-wider text-[11px]">
              {currentTier.shortLabel}
            </span>
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-neutral-500">
            <span>{currentTier.scale}</span>
            <span className="text-[#fbbf24] font-semibold">{currentTier.pct}</span>
          </div>
        </div>

        {/* Tactile Nuanced Zoom Range Slider */}
        <div className="px-1 py-1">
          <input
            type="range"
            min={0}
            max={ZOOM_TIERS.length - 1}
            step={1}
            value={safeIndex}
            onChange={handleSliderChange}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#f59e0b] focus:outline-none"
            aria-label="Ajuster le niveau de zoom"
          />
          {/* Tick Markers */}
          <div className="flex justify-between items-center px-0.5 pt-1 text-[8px] font-mono text-neutral-500">
            <span>🌌</span>
            <span>🪐</span>
            <span>☀️</span>
            <span>🌍</span>
            <span>🎯</span>
          </div>
        </div>

        {/* Stepper Buttons (+ / -) */}
        <div className="flex items-center gap-1.5 w-full">
          {/* Zoom Out (-) towards Cosmos */}
          <button
            onClick={() => {
              audioSynth.playHoloClick(1200);
              onZoomOut();
            }}
            disabled={safeIndex === 0}
            title="Dézoomer vers le Cosmos (-)"
            aria-label="Dézoomer"
            className="flex-1 py-1.5 px-2 flex items-center justify-center gap-1 rounded-lg bg-[#121620] hover:bg-[#f59e0b] text-neutral-200 hover:text-black font-mono font-bold text-xs border border-[#f59e0b]/30 transition-all disabled:opacity-30 disabled:hover:bg-[#121620] disabled:hover:text-neutral-200 disabled:cursor-not-allowed shadow-md active:scale-95"
          >
            <Minus className="w-3.5 h-3.5" />
            <span className="text-[9px]">LARGE</span>
          </button>

          {/* Zoom In (+) towards Surface */}
          <button
            onClick={() => {
              audioSynth.playHoloClick(1400);
              onZoomIn();
            }}
            disabled={safeIndex === ZOOM_TIERS.length - 1}
            title="Zoomer vers la Surface (+)"
            aria-label="Zoomer"
            className="flex-1 py-1.5 px-2 flex items-center justify-center gap-1 rounded-lg bg-[#121620] hover:bg-[#f59e0b] text-neutral-200 hover:text-black font-mono font-bold text-xs border border-[#f59e0b]/30 transition-all disabled:opacity-30 disabled:hover:bg-[#121620] disabled:hover:text-neutral-200 disabled:cursor-not-allowed shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-[9px]">PRÈS</span>
          </button>
        </div>

        {/* 3. 5 Paliers de Zoom Tactiques Rapides */}
        {onSetZoomLevel && (
          <div className="flex flex-col gap-1 pt-1 border-t border-neutral-800/60">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => {
                  audioSynth.playHoloClick(1100);
                  onSetZoomLevel('deep_space');
                }}
                className={`py-1 px-1 rounded text-[8.5px] font-mono uppercase font-bold transition-all ${
                  zoomLevel === 'deep_space'
                    ? 'bg-[#f59e0b] text-black shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                    : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5 border border-neutral-800'
                }`}
                title="Vue panoramique complète de l'Univers Connu"
              >
                1. Cosmos
              </button>

              <button
                onClick={() => {
                  audioSynth.playHoloClick(1200);
                  onSetZoomLevel('galactic');
                }}
                className={`py-1 px-1 rounded text-[8.5px] font-mono uppercase font-bold transition-all ${
                  zoomLevel === 'galactic'
                    ? 'bg-[#f59e0b] text-black shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                    : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5 border border-neutral-800'
                }`}
                title="Vue des corridors et fiefs du Landsraad"
              >
                2. Secteur
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => {
                  audioSynth.playHoloClick(1300);
                  onSetZoomLevel('system');
                }}
                className={`py-1 px-0.5 rounded text-[8px] font-mono uppercase font-bold transition-all ${
                  zoomLevel === 'system'
                    ? 'bg-[#f59e0b] text-black shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                    : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5 border border-neutral-800'
                }`}
                title="Vue du système solaire et des orbites"
              >
                Système
              </button>

              <button
                onClick={() => {
                  audioSynth.playHoloClick(1400);
                  onSetZoomLevel('planetary');
                }}
                className={`py-1 px-0.5 rounded text-[8px] font-mono uppercase font-bold transition-all ${
                  zoomLevel === 'planetary'
                    ? 'bg-[#f59e0b] text-black shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                    : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5 border border-neutral-800'
                }`}
                title="Orbite et atmosphère du monde"
              >
                Orbite
              </button>

              <button
                onClick={() => {
                  audioSynth.playHoloClick(1500);
                  onSetZoomLevel('tactical');
                }}
                className={`py-1 px-0.5 rounded text-[8px] font-mono uppercase font-bold transition-all ${
                  zoomLevel === 'tactical'
                    ? 'bg-[#f59e0b] text-black shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                    : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5 border border-neutral-800'
                }`}
                title="Close-up tactique de la surface et des POIs"
              >
                Surface
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
