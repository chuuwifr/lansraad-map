import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarSystem, HouseInfo } from '../../types/landsraad';
import { HouseSigilImage } from '../common/HouseSigilImage';
import { 
  Sparkles, 
  Globe, 
  Compass, 
  Shield, 
  Layers, 
  Flame, 
  Users, 
  Zap,
  ArrowRight
} from 'lucide-react';

interface PlanetHoverBannerProps {
  hoveredSystem: StarSystem | null;
  houses: Record<string, HouseInfo>;
  onSelectSystem?: (system: StarSystem) => void;
}

export const PlanetHoverBanner: React.FC<PlanetHoverBannerProps> = ({
  hoveredSystem,
  houses,
  onSelectSystem
}) => {
  if (!hoveredSystem) return null;

  const house = houses[hoveredSystem.controllingHouse] || houses.corrino || {
    id: 'unknown',
    name: 'Souveraineté Neutre',
    shortName: 'Neutre',
    sigil: '🪐',
    color: '#f59e0b',
    accentColor: '#fbbf24'
  };

  const isArrakis = hoveredSystem.id === 'arrakis';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -15, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl pointer-events-auto select-none"
      >
        <div 
          onClick={() => onSelectSystem && onSelectSystem(hoveredSystem)}
          className="relative group cursor-pointer overflow-hidden rounded-xl border backdrop-blur-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] p-3 sm:p-4 transition-all duration-300 hover:scale-[1.01]"
          style={{
            borderColor: `${house.accentColor || '#f59e0b'}80`,
            background: `linear-gradient(135deg, rgba(8,10,15,0.96) 0%, rgba(13,17,23,0.94) 50%, ${house.color}15 100%)`,
            boxShadow: `0 0 25px ${house.color}25, 0 10px 30px rgba(0,0,0,0.8)`
          }}
        >
          {/* Top Decorative Imperial Scan Bar */}
          <div 
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${house.accentColor || '#f59e0b'}, transparent)` 
            }}
          />

          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Planet Visual Icon / Custom Image Thumbnail */}
            <div className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border border-white/20 shadow-md bg-black/60 flex items-center justify-center">
              {hoveredSystem.customImageUrl ? (
                <img 
                  src={hoveredSystem.customImageUrl} 
                  alt={hoveredSystem.primaryPlanet}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div 
                  className="w-full h-full flex flex-col items-center justify-center p-1"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${hoveredSystem.atmosphereColor}80, #000000 90%)`
                  }}
                >
                  <Globe className="w-7 h-7 text-white/90 drop-shadow-md" />
                </div>
              )}

              {/* Mini Corner Badge for Strategic Importance */}
              <div 
                className="absolute bottom-0 inset-x-0 py-0.5 text-center text-[8px] font-mono font-bold tracking-widest uppercase bg-black/80 text-amber-400 border-t border-white/10"
              >
                {hoveredSystem.strategicImportance}
              </div>
            </div>

            {/* Middle: Names & House Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/15">
                  SYS: {hoveredSystem.starName}
                </span>
                <span 
                  className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded border"
                  style={{
                    backgroundColor: `${house.color}25`,
                    borderColor: house.accentColor,
                    color: house.accentColor
                  }}
                >
                  {hoveredSystem.spectralClass}
                </span>
                {isArrakis && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400 animate-pulse" /> UNIQUE SOURCE D'ÉPICE
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#fef3c7] truncate drop-shadow">
                  {hoveredSystem.primaryPlanet}
                </h3>
                <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
                  ({hoveredSystem.name.split('//')[0]?.trim() || hoveredSystem.name})
                </span>
              </div>

              {/* Allegiance Line */}
              <div className="flex items-center gap-2 mt-1">
                <HouseSigilImage house={house} size="sm" showGlow={false} />
                <span className="text-xs font-mono text-neutral-300 truncate">
                  Fief de la <strong className="text-white font-semibold">{house.name}</strong>
                </span>
              </div>
            </div>

            {/* Right: Key Fast Metrics */}
            <div className="hidden md:flex flex-col items-end gap-1.5 text-right font-mono text-xs shrink-0 pl-2 border-l border-white/10">
              <div>
                <span className="text-[9px] text-neutral-400 uppercase block">Production Épice</span>
                <span className="font-bold text-amber-400 flex items-center gap-1 justify-end">
                  {hoveredSystem.spiceOutputPerCycle > 0 
                    ? `${hoveredSystem.spiceOutputPerCycle.toLocaleString()} T / cycle` 
                    : 'Nulle (0 T)'}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-neutral-400 uppercase block">Distance Canopus</span>
                <span className="font-bold text-cyan-400">
                  {hoveredSystem.distanceFromArrakisLy} AL
                </span>
              </div>
            </div>

            {/* Click Action Indicator */}
            <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#f59e0b]/20 group-hover:border-[#f59e0b] text-neutral-400 group-hover:text-[#f59e0b] transition-colors">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>

          </div>

          {/* Bottom Quick Lore Bar */}
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="italic font-serif truncate max-w-[85%] text-neutral-300">
              « {hoveredSystem.loreSnippet || hoveredSystem.description} »
            </span>
            <span className="text-[#f59e0b] font-bold text-[10px] uppercase tracking-wider shrink-0">
              [ Cliquer pour analyser ]
            </span>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
