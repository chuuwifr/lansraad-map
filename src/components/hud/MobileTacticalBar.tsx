import React from 'react';
import { ZoomLevel, StarSystem } from '../../types/landsraad';
import { audioSynth } from '../../services/audioSynth';
import { Compass, Orbit, Globe, FileText, Shield, Navigation, Sparkles, PlusCircle } from 'lucide-react';

interface MobileTacticalBarProps {
  zoomLevel: ZoomLevel;
  currentSystem: StarSystem;
  onZoomChange: (level: ZoomLevel) => void;
  onToggleDossier: () => void;
  onOpenAstrogation: () => void;
  onOpenFiefsAtlas: () => void;
  onOpenResourceAtlas: () => void;
  onOpenCreatePlanet?: () => void;
}

export const MobileTacticalBar: React.FC<MobileTacticalBarProps> = ({
  zoomLevel,
  currentSystem,
  onZoomChange,
  onToggleDossier,
  onOpenAstrogation,
  onOpenFiefsAtlas,
  onOpenResourceAtlas,
  onOpenCreatePlanet
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-3 py-2 bg-[#060709]/95 backdrop-blur-xl border-t border-[#f59e0b]/20 flex items-center justify-around shadow-2xl">
      {/* 01: Galactic Zoom */}
      <button
        onClick={() => {
          audioSynth.playHoloClick(1400);
          onZoomChange('galactic');
        }}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded transition-colors ${
          zoomLevel === 'galactic' ? 'text-[#f59e0b]' : 'text-neutral-400'
        }`}
      >
        <Compass className="w-4 h-4" />
        <span className="text-[9px] font-mono font-bold tracking-tighter">GALAXIE</span>
      </button>

      {/* 02: System Zoom */}
      <button
        onClick={() => {
          audioSynth.playHoloClick(1400);
          onZoomChange('system');
        }}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded transition-colors ${
          zoomLevel === 'system' ? 'text-[#f59e0b]' : 'text-neutral-400'
        }`}
      >
        <Orbit className="w-4 h-4" />
        <span className="text-[9px] font-mono font-bold tracking-tighter">SYSTÈME</span>
      </button>

      {/* 03: Planetary Surface Zoom */}
      <button
        onClick={() => {
          audioSynth.playHoloClick(1400);
          onZoomChange('planetary');
        }}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded transition-colors ${
          zoomLevel === 'planetary' ? 'text-[#f59e0b]' : 'text-neutral-400'
        }`}
      >
        <Globe className="w-4 h-4" />
        <span className="text-[9px] font-mono font-bold tracking-tighter">SURFACE</span>
      </button>

      <div className="w-[1px] h-6 bg-neutral-800" />

      {/* Toggle Sector Dossier */}
      <button
        onClick={() => {
          audioSynth.playHoloClick(1500);
          onToggleDossier();
        }}
        className="flex flex-col items-center gap-0.5 px-2 py-1 rounded text-neutral-300 hover:text-white"
      >
        <FileText className="w-4 h-4 text-[#fbbf24]" />
        <span className="text-[9px] font-mono font-bold tracking-tighter">DOSSIER</span>
      </button>

      {/* Open Astrogation Jump Tool */}
      <button
        onClick={() => {
          audioSynth.playHoloClick(1600);
          onOpenAstrogation();
        }}
        className="flex flex-col items-center gap-0.5 px-2 py-1 rounded text-[#06b6d4]"
      >
        <Navigation className="w-4 h-4" />
        <span className="text-[9px] font-mono font-bold tracking-tighter">SAUT</span>
      </button>

      {/* Open Landsraad Fiefs Atlas */}
      <button
        onClick={() => {
          audioSynth.playHoloClick(1500);
          onOpenFiefsAtlas();
        }}
        className="flex flex-col items-center gap-0.5 px-2 py-1 rounded text-[#f59e0b]"
      >
        <Shield className="w-4 h-4" />
        <span className="text-[9px] font-mono font-bold tracking-tighter">FIEFS</span>
      </button>

      {/* Open CHOAM Resources Atlas */}
      <button
        onClick={() => {
          audioSynth.playHoloClick(1500);
          onOpenResourceAtlas();
        }}
        className="flex flex-col items-center gap-0.5 px-2 py-1 rounded text-neutral-300 hover:text-white"
      >
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-[9px] font-mono font-bold tracking-tighter">RESSOURCES</span>
      </button>

      {/* Add Custom Planet / World Button */}
      {onOpenCreatePlanet && (
        <button
          onClick={() => {
            audioSynth.playHoloClick(1600);
            onOpenCreatePlanet();
          }}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded text-[#f59e0b]"
        >
          <PlusCircle className="w-4 h-4 text-[#f59e0b]" />
          <span className="text-[9px] font-mono font-bold tracking-tighter">+ MONDE</span>
        </button>
      )}
    </div>
  );
};
