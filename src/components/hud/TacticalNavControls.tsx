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
  Compass
} from 'lucide-react';
import { ZoomLevel } from '../../types/landsraad';

interface TacticalNavControlsProps {
  zoomLevel: ZoomLevel;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: (deltaTheta: number, deltaPhi: number) => void;
  onResetOrientation: () => void;
  onSetZoomLevel?: (level: ZoomLevel) => void;
}

export const TacticalNavControls: React.FC<TacticalNavControlsProps> = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onRotate,
  onResetOrientation,
  onSetZoomLevel
}) => {
  const continuousRotateInterval = useRef<number | null>(null);

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

  return (
    <div className="flex flex-col items-center gap-3 p-3 rounded-2xl bg-[#06080d]/90 backdrop-blur-md border border-[#f59e0b]/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)] select-none text-[#e2d9c8]">
      
      {/* Title / Compass Header */}
      <div className="flex items-center justify-between w-full px-1 border-b border-neutral-800/80 pb-2">
        <div className="flex items-center gap-1.5 font-cinzel text-[11px] font-bold text-[#f59e0b] tracking-wider uppercase">
          <Compass className="w-3.5 h-3.5 animate-[spin_12s_linear_infinite]" />
          <span>Navigation</span>
        </div>
        <button
          onClick={onResetOrientation}
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
          onClick={onResetOrientation}
          title="Recentrer la caméra"
          className="w-7 h-7 rounded-full bg-[#1e2536] hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black flex items-center justify-center font-mono text-[10px] font-bold transition-colors z-10 border border-[#f59e0b]/40 shadow-inner"
        >
          ●
        </button>
      </div>

      {/* 2. Boutons de Zoom (+ / -) */}
      <div className="w-full flex flex-col gap-1.5 pt-2 border-t border-neutral-800/80">
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 px-1">
          <span className="flex items-center gap-1 uppercase">
            <ZoomIn className="w-3 h-3 text-[#f59e0b]" /> Zoom
          </span>
          <span className="text-[#f59e0b] font-bold uppercase tracking-wider">
            {zoomLevel === 'galactic' ? 'Galaxie' : zoomLevel === 'system' ? 'Système' : 'Planète'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 w-full">
          {/* Zoom In (+) */}
          <button
            onClick={onZoomIn}
            disabled={zoomLevel === 'planetary'}
            title="Zoomer (+)"
            aria-label="Zoomer"
            className="flex-1 py-1.5 px-2 flex items-center justify-center gap-1 rounded-lg bg-[#121620] hover:bg-[#f59e0b] text-neutral-200 hover:text-black font-mono font-bold text-sm border border-[#f59e0b]/30 transition-all disabled:opacity-35 disabled:hover:bg-[#121620] disabled:hover:text-neutral-200 disabled:cursor-not-allowed shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Zoom Out (-) */}
          <button
            onClick={onZoomOut}
            disabled={zoomLevel === 'galactic'}
            title="Dézoomer (-)"
            aria-label="Dézoomer"
            className="flex-1 py-1.5 px-2 flex items-center justify-center gap-1 rounded-lg bg-[#121620] hover:bg-[#f59e0b] text-neutral-200 hover:text-black font-mono font-bold text-sm border border-[#f59e0b]/30 transition-all disabled:opacity-35 disabled:hover:bg-[#121620] disabled:hover:text-neutral-200 disabled:cursor-not-allowed shadow-md active:scale-95"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Paliers de zoom rapides */}
        {onSetZoomLevel && (
          <div className="grid grid-cols-3 gap-1 pt-1">
            <button
              onClick={() => onSetZoomLevel('galactic')}
              className={`py-1 rounded text-[9px] font-mono uppercase font-semibold transition-colors ${
                zoomLevel === 'galactic'
                  ? 'bg-[#f59e0b] text-black'
                  : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5 border border-neutral-800'
              }`}
            >
              Gal
            </button>
            <button
              onClick={() => onSetZoomLevel('system')}
              className={`py-1 rounded text-[9px] font-mono uppercase font-semibold transition-colors ${
                zoomLevel === 'system'
                  ? 'bg-[#f59e0b] text-black'
                  : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5 border border-neutral-800'
              }`}
            >
              Sys
            </button>
            <button
              onClick={() => onSetZoomLevel('planetary')}
              className={`py-1 rounded text-[9px] font-mono uppercase font-semibold transition-colors ${
                zoomLevel === 'planetary'
                  ? 'bg-[#f59e0b] text-black'
                  : 'bg-black/40 text-neutral-400 hover:text-white hover:bg-white/5 border border-neutral-800'
              }`}
            >
              Plan
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
