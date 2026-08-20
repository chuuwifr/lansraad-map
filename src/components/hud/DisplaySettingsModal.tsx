import React from 'react';
import { MapVisualConfig, ThemePreset } from '../../types/landsraad';
import { audioSynth } from '../../services/audioSynth';
import { 
  X, 
  Sliders, 
  Sparkles, 
  Layers, 
  Volume2, 
  Smartphone, 
  Shield, 
  Route, 
  Sun,
  Palette,
  Globe,
  Wind,
  Moon
} from 'lucide-react';

interface DisplaySettingsModalProps {
  config: MapVisualConfig;
  onUpdateConfig: (updater: (prev: MapVisualConfig) => MapVisualConfig) => void;
  onClose: () => void;
}

const THEME_OPTIONS: { id: ThemePreset; name: string; color: string; desc: string }[] = [
  {
    id: 'imperial-gold',
    name: 'Or Impérial Corrino',
    color: '#f59e0b',
    desc: 'Lumière sacrée du Trône du Lion d\'Or et faste de Kaitain.'
  },
  {
    id: 'spice-amber',
    name: 'Ambre Épice Arrakis',
    color: '#ea580c',
    desc: 'Chaleur cuivrée du désert profond et lueurs de Mélange.'
  },
  {
    id: 'mentat-cyan',
    name: 'Luminescence Mentat',
    color: '#06b6d4',
    desc: 'Clarté analytique glaciale des ordinateurs humains et de la Guilde.'
  },
  {
    id: 'giedi-crimson',
    name: 'Obsidienne Harkonnen',
    color: '#dc2626',
    desc: 'Ombres industrielles et contrastes brutaux de Giedi Prime.'
  },
  {
    id: 'ixian-emerald',
    name: 'Matrice Synthétique Ix',
    color: '#10b981',
    desc: 'Circuits d\'ingénierie souterraine et technologies avancées.'
  },
  {
    id: 'night-ops-red',
    name: 'Vision Nocturne Tactique',
    color: '#ef4444',
    desc: 'Protection oculaire maximale pour environnements très sombres.'
  }
];

export const DisplaySettingsModal: React.FC<DisplaySettingsModalProps> = ({
  config,
  onUpdateConfig,
  onClose
}) => {
  const handleThemeChange = (theme: ThemePreset) => {
    audioSynth.playHoloClick(1600);
    onUpdateConfig(prev => ({ ...prev, theme }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#090b10] border border-[#f59e0b]/40 rounded-xl shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden text-[#e2d9c8]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f59e0b]/25 bg-gradient-to-r from-[#f59e0b]/15 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b] flex items-center justify-center text-[#f59e0b]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-[#fef3c7]">
                PERSONNALISATION & SHADERS 3D RÉALISTES
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Paramètres de rendu photoréaliste, atmosphères, éclairages et contrastes
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-xs font-mono">
          
          {/* 1. Photorealistic Planet Rendering Controls */}
          <div className="space-y-4">
            <span className="font-cinzel text-xs font-bold text-[#f59e0b] uppercase flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              Moteur de Rendu Photoréaliste des Planètes
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Sun Light Intensity */}
              <div className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-300 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Éclairage Solaire Direct
                  </span>
                  <span className="text-[#f59e0b] font-bold">x{(config.sunIntensity ?? 3.2).toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="5.0"
                  step="0.2"
                  value={config.sunIntensity ?? 3.2}
                  onChange={(e) => onUpdateConfig(p => ({ ...p, sunIntensity: parseFloat(e.target.value) }))}
                  className="w-full accent-[#f59e0b] bg-neutral-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              {/* Surface Bump / Relief Strength */}
              <div className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" /> Relief & Rugosité Géologique
                  </span>
                  <span className="text-[#f59e0b] font-bold">{Math.round((config.surfaceBumpStrength ?? 1.2) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={config.surfaceBumpStrength ?? 1.2}
                  onChange={(e) => onUpdateConfig(p => ({ ...p, surfaceBumpStrength: parseFloat(e.target.value) }))}
                  className="w-full accent-[#f59e0b] bg-neutral-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              {/* Atmospheric Glow */}
              <div className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Diffusion Rayleigh Atmosphérique
                  </span>
                  <span className="text-[#f59e0b] font-bold">{Math.round((config.atmosphereGlowIntensity ?? 1.1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="2.5"
                  step="0.1"
                  value={config.atmosphereGlowIntensity ?? 1.1}
                  onChange={(e) => onUpdateConfig(p => ({ ...p, atmosphereGlowIntensity: parseFloat(e.target.value) }))}
                  className="w-full accent-[#f59e0b] bg-neutral-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              {/* Planet Rotation Speed */}
              <div className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-300 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-400" /> Vitesse de Rotation Axiale
                  </span>
                  <span className="text-[#f59e0b] font-bold">x{(config.planetRotationSpeed ?? 1.0).toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="3.0"
                  step="0.2"
                  value={config.planetRotationSpeed ?? 1.0}
                  onChange={(e) => onUpdateConfig(p => ({ ...p, planetRotationSpeed: parseFloat(e.target.value) }))}
                  className="w-full accent-[#f59e0b] bg-neutral-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              {/* Cloud Animation Speed */}
              <div className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-300 flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-neutral-300" /> Vitesse des Vents & Nuages
                  </span>
                  <span className="text-[#f59e0b] font-bold">x{(config.cloudSpeed ?? 1.0).toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="3.0"
                  step="0.1"
                  value={config.cloudSpeed ?? 1.0}
                  onChange={(e) => onUpdateConfig(p => ({ ...p, cloudSpeed: parseFloat(e.target.value) }))}
                  className="w-full accent-[#f59e0b] bg-neutral-800 h-1.5 rounded cursor-pointer"
                />
              </div>

              {/* Night Lights Switch */}
              <div className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-neutral-300 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-amber-300" /> Cités Nocturnes Émissives
                  </span>
                  <p className="text-[10px] text-neutral-500">Mégalopoles illuminées sur la face nuit</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.nightLightsEnabled !== false}
                  onChange={(e) => onUpdateConfig(p => ({ ...p, nightLightsEnabled: e.target.checked }))}
                  className="w-4 h-4 accent-[#f59e0b] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 2. Theme Presets Selection */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <span className="font-cinzel text-xs font-bold text-[#f59e0b] uppercase flex items-center gap-1.5">
              <Palette className="w-4 h-4" />
              Thème Holographique & Palette de l'Imperium
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {THEME_OPTIONS.map((th) => {
                const isSelected = config.theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => handleThemeChange(th.id)}
                    className={`p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-neutral-800/90 border-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full mt-0.5 shrink-0 shadow-sm"
                      style={{ backgroundColor: th.color, boxShadow: `0 0 10px ${th.color}` }}
                    />
                    <div>
                      <span className="font-bold text-[#f3e8d2] block">{th.name}</span>
                      <span className="text-[10px] text-neutral-400 font-sans leading-tight mt-0.5 block">
                        {th.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Parallax & 3D Depth Controls */}
          <div className="space-y-4 pt-2 border-t border-neutral-800">
            <span className="font-cinzel text-xs font-bold text-[#f59e0b] uppercase flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              Profondeur & Effets de Parallaxe
            </span>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Intensité de la Parallaxe 3D</span>
                <span className="text-[#f59e0b] font-bold">{Math.round(config.parallaxDepth * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={config.parallaxDepth}
                onChange={(e) => onUpdateConfig(p => ({ ...p, parallaxDepth: parseFloat(e.target.value) }))}
                className="w-full accent-[#f59e0b] bg-neutral-800 h-2 rounded cursor-pointer"
              />
            </div>

            {/* Mobile Gyroscope Toggle */}
            <div className="flex items-center justify-between p-3 rounded bg-neutral-900/70 border border-neutral-800">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-[#06b6d4]" />
                <div>
                  <span className="font-bold text-[#f3e8d2] block">Gyroscope Mobile</span>
                  <span className="text-[10px] text-neutral-400 font-sans block">
                    Parallaxe gyroscopique via inclinaison physique du smartphone
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.gyroscopeParallax}
                onChange={(e) => onUpdateConfig(p => ({ ...p, gyroscopeParallax: e.target.checked }))}
                className="w-4 h-4 accent-[#f59e0b] cursor-pointer"
              />
            </div>
          </div>

          {/* 4. Graphical & Shader Overlays */}
          <div className="space-y-4 pt-2 border-t border-neutral-800">
            <span className="font-cinzel text-xs font-bold text-[#f59e0b] uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Calques Tactiques & Éléments Galactiques
            </span>

            {/* Scanlines slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Trame de Scanlines Holographiques</span>
                <span className="text-[#f59e0b] font-bold">{Math.round(config.scanlinesIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.scanlinesIntensity}
                onChange={(e) => onUpdateConfig(p => ({ ...p, scanlinesIntensity: parseFloat(e.target.value) }))}
                className="w-full accent-[#f59e0b] bg-neutral-800 h-2 rounded cursor-pointer"
              />
            </div>

            {/* Particle Density */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300">Densité de Poussière de Mélange (Particules)</span>
                <span className="text-[#f59e0b] font-bold">{config.particleDensity} Motes</span>
              </div>
              <input
                type="range"
                min="600"
                max="4000"
                step="200"
                value={config.particleDensity}
                onChange={(e) => onUpdateConfig(p => ({ ...p, particleDensity: parseInt(e.target.value, 10) }))}
                className="w-full accent-[#f59e0b] bg-neutral-800 h-2 rounded cursor-pointer"
              />
            </div>

            {/* Toggles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center justify-between p-2.5 rounded bg-neutral-900/70 border border-neutral-800 cursor-pointer">
                <span className="flex items-center gap-2">
                  <Route className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Trajets Guilde Spatiale</span>
                </span>
                <input
                  type="checkbox"
                  checked={config.showGuildRoutes}
                  onChange={(e) => onUpdateConfig(p => ({ ...p, showGuildRoutes: e.target.checked }))}
                  className="accent-[#f59e0b]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded bg-neutral-900/70 border border-neutral-800 cursor-pointer">
                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Boucliers Holtzman 3D</span>
                </span>
                <input
                  type="checkbox"
                  checked={config.showShieldMeshes}
                  onChange={(e) => onUpdateConfig(p => ({ ...p, showShieldMeshes: e.target.checked }))}
                  className="accent-[#f59e0b]"
                />
              </label>
            </div>
          </div>

          {/* 5. Audio Status */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <span className="font-cinzel text-xs font-bold text-[#f59e0b] uppercase flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-neutral-500" />
              Mode Audio & Immersion
            </span>
            <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-neutral-400 text-xs">
              <span className="text-emerald-400 font-bold block mb-0.5">Mode Silencieux Absolu Actif</span>
              Tous les effets sonores et bruitages sont désactivés pour une interface épurée et sans distraction sonore.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f59e0b]/20 bg-[#080a0f] flex justify-end">
          <button
            onClick={() => {
              audioSynth.playHoloClick(1200);
              onClose();
            }}
            className="py-2 px-5 rounded bg-[#f59e0b] hover:bg-[#d97706] text-[#060709] font-mono text-xs font-bold tracking-wider transition-colors shadow-md"
          >
            VALIDER LES CONFIGURATIONS
          </button>
        </div>
      </div>
    </div>
  );
};
