import React, { useState, useRef } from 'react';
import { HouseInfo, StarSystem } from '../../types/landsraad';
import { HOUSES_DATA } from '../../data/landsraadData';
import { HouseSigilImage } from '../common/HouseSigilImage';
import { audioSynth } from '../../services/audioSynth';
import { 
  X, 
  Shield, 
  Plus, 
  Sparkles, 
  UploadCloud, 
  Trash2, 
  Globe, 
  ChevronRight, 
  Check, 
  Crown, 
  Award, 
  Scale, 
  TrendingUp, 
  Layers,
  Edit3,
  Search
} from 'lucide-react';

interface HouseCreatorModalProps {
  initialHouse?: HouseInfo | null;
  existingSystems: StarSystem[];
  onSaveHouse: (house: HouseInfo) => void;
  onClose: () => void;
}

const PRESET_EMOJIS = ['🦅', '🪓', '👑', '👁️', '🪐', '🗡️', '🦂', '🦁', '🐉', '🐍', '🐺', '⚡', '🏹', '🕊️', '☀️', '⚓', '🏛️', '🛡️', '🌙', '🔥'];

const PRESET_COLOR_PALETTES = [
  { name: 'Vert & Noir Atréides', color: '#15803d', accent: '#4ade80' },
  { name: 'Bleu Royal & Or', color: '#1d4ed8', accent: '#60a5fa' },
  { name: 'Pourpre Impérial', color: '#7e22ce', accent: '#c084fc' },
  { name: 'Rouge Écarlate Guerrier', color: '#b91c1c', accent: '#f87171' },
  { name: 'Ambre Épice & Dune', color: '#d97706', accent: '#fbbf24' },
  { name: 'Cyan & Électron Ixien', color: '#0284c7', accent: '#38bdf8' },
  { name: 'Émeraude Sombre', color: '#047857', accent: '#34d399' },
  { name: 'Bronze Métallique', color: '#854d0e', accent: '#fde047' },
  { name: 'Gris Sidéral & Acier', color: '#475569', accent: '#94a3b8' },
  { name: 'Noir Obsidienne & Sang', color: '#991b1b', accent: '#fca5a5' }
];

export const HouseCreatorModal: React.FC<HouseCreatorModalProps> = ({
  initialHouse,
  existingSystems,
  onSaveHouse,
  onClose
}) => {
  const isEditing = !!initialHouse;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [id, setId] = useState(
    initialHouse?.id || `house-custom-${Date.now().toString(36)}`
  );
  const [name, setName] = useState(initialHouse?.name || 'Maison ');
  const [shortName, setShortName] = useState(initialHouse?.shortName || '');
  const [sigil, setSigil] = useState(initialHouse?.sigil || '🦅');
  const [customSigilUrl, setCustomSigilUrl] = useState<string | undefined>(initialHouse?.customSigilUrl);
  const [color, setColor] = useState(initialHouse?.color || '#1d4ed8');
  const [accentColor, setAccentColor] = useState(initialHouse?.accentColor || '#60a5fa');
  const [homeworld, setHomeworld] = useState(initialHouse?.homeworld || 'Monde Capitale');
  const [capitalSystemId, setCapitalSystemId] = useState(initialHouse?.capitalSystemId || (existingSystems[0]?.id || ''));
  const [ruler, setRuler] = useState(initialHouse?.ruler || 'Duc / Baronne / Archonte');
  const [titles, setTitles] = useState(initialHouse?.titles || 'Haut Seigneur du Landsraad, Souverain Fief-Major');
  const [voteWeight, setVoteWeight] = useState<number>(initialHouse?.voteWeight || 12);
  const [militaryRating, setMilitaryRating] = useState<number>(initialHouse?.militaryRating || 65);
  const [choamSharesPercent, setChoamSharesPercent] = useState<number>(initialHouse?.choamSharesPercent || 2.5);
  const [spiceStockKg, setSpiceStockKg] = useState<number>(initialHouse?.spiceStockKg || 15000);
  const [ideology, setIdeology] = useState(
    initialHouse?.ideology || 'Honneur féodal, suprématie navale et fidélité au Grand Accord du Landsraad.'
  );
  const [description, setDescription] = useState(
    initialHouse?.description || 'Grande Maison historique reconnue par l\'Imperium lors des sessions de la Grande Convention.'
  );
  const [bannerQuote, setBannerQuote] = useState(
    initialHouse?.bannerQuote || 'Par la vertu et l\'acier, nous régnons sans fléchir.'
  );
  const [territoryInfluenceRadius, setTerritoryInfluenceRadius] = useState<number>(
    initialHouse?.territoryInfluenceRadius || 60
  );

  const handleSigilFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCustomSigilUrl(dataUrl);
        audioSynth.playHoloClick(1400);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPalette = (palette: { color: string; accent: string }) => {
    setColor(palette.color);
    setAccentColor(palette.accent);
    audioSynth.playHoloClick(1200);
  };

  const handleGenerateIdFromName = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generated = val
        .toLowerCase()
        .replace(/^maison\s+/i, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      if (generated) {
        setId(`house-${generated}`);
        if (!shortName) {
          setShortName(val.replace(/^maison\s+/i, ''));
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalHouse: HouseInfo = {
      id: id.trim() || `house-${Date.now()}`,
      name: name.trim(),
      shortName: shortName.trim() || name.replace(/^maison\s+/i, '').trim(),
      sigil,
      customSigilUrl,
      color,
      accentColor,
      homeworld: homeworld.trim() || 'Fief Primordial',
      capitalSystemId,
      ruler: ruler.trim() || 'Seigneur Régnant',
      titles: titles.trim() || 'Membre du Landsraad',
      territoryInfluenceRadius: Number(territoryInfluenceRadius) || 50,
      voteWeight: Number(voteWeight) || 5,
      spiceStockKg: Number(spiceStockKg) || 0,
      militaryRating: Math.min(100, Math.max(1, Number(militaryRating) || 50)),
      choamSharesPercent: Number(choamSharesPercent) || 0,
      ideology: ideology.trim() || 'Devoir et puissance.',
      description: description.trim() || 'Maison souveraine du Landsraad.',
      bannerQuote: bannerQuote.trim() || 'Pax et Bellum'
    };

    audioSynth.playHoloClick(1800);
    onSaveHouse(finalHouse);
    onClose();
  };

  const dummyPreviewHouse: HouseInfo = {
    id,
    name: name || 'Nom de la Maison',
    shortName: shortName || 'Maison',
    sigil,
    customSigilUrl,
    color,
    accentColor,
    homeworld: homeworld || 'Capitale',
    capitalSystemId,
    ruler: ruler || 'Souverain',
    titles: titles || 'Titres',
    territoryInfluenceRadius,
    voteWeight,
    spiceStockKg,
    militaryRating,
    choamSharesPercent,
    ideology,
    description,
    bannerQuote,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Hidden File Upload for Custom Sigil / Blason */}
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleSigilFileUpload}
      />

      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#090b10] border border-[#f59e0b]/40 rounded-xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden text-[#e2d9c8]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f59e0b]/25 bg-gradient-to-r from-[#f59e0b]/15 via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b] flex items-center justify-center text-[#f59e0b]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#fef3c7] flex items-center gap-2">
                {isEditing ? 'ÉDITER LA MAISON NOBLE' : 'ENREGISTRER UNE NOUVELLE MAISON DU LANDSRAAD'}
                <span className="px-2 py-0.5 text-[9px] font-mono bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30 rounded">
                  SCEAU DU LANDSRAAD
                </span>
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Protocole impérial d'enregistrement des fiefs majeurs, armoiries et votes de la Grande Convention
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 font-mono text-xs custom-scrollbar">
          
          {/* Live Preview Card */}
          <div 
            className="p-4 rounded-xl border relative overflow-hidden transition-all shadow-md"
            style={{
              borderColor: `${accentColor}70`,
              backgroundColor: `${color}15`
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <HouseSigilImage house={dummyPreviewHouse} size="xl" />
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white uppercase tracking-wide">
                    {name || 'Nom de la Maison'}
                  </h3>
                  <p className="text-xs text-neutral-300 font-mono">
                    {titles || 'Titres & Rangs'}
                  </p>
                  <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                    Souverain : <span className="text-white font-semibold">{ruler || 'Inconnu'}</span> • Monde : <span className="text-white font-semibold">{homeworld}</span>
                  </p>
                </div>
              </div>

              {/* Upload Sigil CTA */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#f59e0b]/20 hover:bg-[#f59e0b] text-[#f59e0b] hover:text-black border border-[#f59e0b]/50 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>{customSigilUrl ? 'Changer Blason Image' : 'Uploader Blason (Image)'}</span>
                </button>
                {customSigilUrl && (
                  <button
                    type="button"
                    onClick={() => setCustomSigilUrl(undefined)}
                    className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white border border-red-800 transition-colors"
                    title="Revenir à l'icône emoji"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-[11px]">
                <span className="font-bold px-2 py-0.5 rounded border" style={{ borderColor: accentColor, color: accentColor }}>
                  {voteWeight} Voix Landsraad
                </span>
                <span className="text-neutral-300">
                  ⚔️ Militaire : <strong className="text-amber-400">{militaryRating}/100</strong>
                </span>
                <span className="text-neutral-300">
                  📈 CHOAM : <strong className="text-cyan-400">{choamSharesPercent}%</strong>
                </span>
              </div>

              <div className="italic text-[11px] text-[#fef3c7] font-serif">
                « {bannerQuote} »
              </div>
            </div>
          </div>

          {/* General Identification */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> 1. Identité & Héraldique
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  Nom Officiel de la Maison *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleGenerateIdFromName(e.target.value)}
                  placeholder="Ex: Maison Fenring, Maison Taligari..."
                  className="w-full px-3 py-2 rounded-lg bg-[#05070a] border border-neutral-700 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  Nom Court / Faction
                </label>
                <input
                  type="text"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  placeholder="Ex: Fenring, Taligari..."
                  className="w-full px-3 py-2 rounded-lg bg-[#05070a] border border-neutral-700 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  Souverain / Dirigeant
                </label>
                <input
                  type="text"
                  value={ruler}
                  onChange={(e) => setRuler(e.target.value)}
                  placeholder="Ex: Comte Hasimir Fenring"
                  className="w-full px-3 py-2 rounded-lg bg-[#05070a] border border-neutral-700 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  Titres & Rangs Féodaux
                </label>
                <input
                  type="text"
                  value={titles}
                  onChange={(e) => setTitles(e.target.value)}
                  placeholder="Ex: Fief-Major, Gardien du Sceau Impérial..."
                  className="w-full px-3 py-2 rounded-lg bg-[#05070a] border border-neutral-700 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Emoji Sigil Quick Selection */}
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">
                Symbole / Émoticône Héraldique (Sceau rapide) :
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-[#05070a] border border-neutral-800">
                {PRESET_EMOJIS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => {
                      setSigil(em);
                      audioSynth.playHoloClick(1000);
                    }}
                    className={`w-8 h-8 rounded text-base flex items-center justify-center transition-all ${
                      sigil === em
                        ? 'bg-[#f59e0b] text-black scale-110 shadow'
                        : 'bg-neutral-800/80 hover:bg-neutral-700 text-white'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors & Palette Selection */}
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">
                Couleurs Héraldiques de la Bannière :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {PRESET_COLOR_PALETTES.map((pal) => (
                  <button
                    key={pal.name}
                    type="button"
                    onClick={() => handleApplyPalette(pal)}
                    className="p-1.5 rounded-lg border border-neutral-800 hover:border-neutral-600 bg-neutral-900/60 flex items-center gap-2 text-[10px] text-left transition-colors"
                  >
                    <div className="flex items-center -space-x-1 shrink-0">
                      <span className="w-3.5 h-3.5 rounded-full border border-black" style={{ backgroundColor: pal.color }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-black" style={{ backgroundColor: pal.accent }} />
                    </div>
                    <span className="truncate text-neutral-300">{pal.name}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <span className="text-[10px] text-neutral-400 block mb-1">Couleur Principale (Fond)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded bg-[#05070a] border border-neutral-700 text-xs font-mono text-neutral-200"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 block mb-1">Couleur d'Accent (Texte & Bordure)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded border border-neutral-700 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded bg-[#05070a] border border-neutral-700 text-xs font-mono text-neutral-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Territorial & Geopolitical Metrics */}
          <div className="space-y-3 pt-3 border-t border-neutral-800">
            <span className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> 2. Fief Capitale & Poids Politique
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  Nom du Monde Capitale
                </label>
                <input
                  type="text"
                  value={homeworld}
                  onChange={(e) => setHomeworld(e.target.value)}
                  placeholder="Ex: Tula, Zanovar, Parmentier..."
                  className="w-full px-3 py-2 rounded-lg bg-[#05070a] border border-neutral-700 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  Système Stellaire Associé (Optionnel)
                </label>
                <select
                  value={capitalSystemId}
                  onChange={(e) => setCapitalSystemId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#05070a] border border-neutral-700 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs focus:outline-none"
                >
                  <option value="">-- Aucun système lié spécifié --</option>
                  {existingSystems.map((sys) => (
                    <option key={sys.id} value={sys.id}>
                      {sys.name} ({sys.primaryPlanet})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  Voix au Landsraad ({voteWeight} Voix)
                </label>
                <input
                  type="range"
                  min={1}
                  max={40}
                  value={voteWeight}
                  onChange={(e) => setVoteWeight(Number(e.target.value))}
                  className="w-full accent-[#f59e0b]"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  Puissance Militaire & Légions ({militaryRating} / 100)
                </label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={militaryRating}
                  onChange={(e) => setMilitaryRating(Number(e.target.value))}
                  className="w-full accent-[#f59e0b]"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  Actions & Dividendes CHOAM (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="25"
                  value={choamSharesPercent}
                  onChange={(e) => setChoamSharesPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#05070a] border border-neutral-700 text-[#f3e8d2] font-mono text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">
                  Stocks d'Épice Déclarés (kg)
                </label>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={spiceStockKg}
                  onChange={(e) => setSpiceStockKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#05070a] border border-neutral-700 text-[#f3e8d2] font-mono text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Lore, Motto and Ideology */}
          <div className="space-y-3 pt-3 border-t border-neutral-800">
            <span className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 3. Devise & Chroniques Féodales
            </span>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">
                Devise de la Bannière (Citation)
              </label>
              <input
                type="text"
                value={bannerQuote}
                onChange={(e) => setBannerQuote(e.target.value)}
                placeholder="Ex: Jamais vaincus, toujours fidèles..."
                className="w-full px-3 py-2 rounded-lg bg-[#05070a] border border-neutral-700 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">
                Doctrine & Idéologie Politique
              </label>
              <textarea
                rows={2}
                value={ideology}
                onChange={(e) => setIdeology(e.target.value)}
                placeholder="Principes directeurs, alliances traditionnelles et vision du pouvoir..."
                className="w-full px-3 py-2 rounded-lg bg-[#05070a] border border-neutral-700 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">
                Histoire & Origines dans l'Imperium
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Origine de la lignée, faits d'armes durant le Jihad Butlérien ou la Grande Convention..."
                className="w-full px-3 py-2 rounded-lg bg-[#05070a] border border-neutral-700 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 text-xs font-bold transition-colors"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-black font-cinzel font-bold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.4)] transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'ENREGISTRER LES MODIFICATIONS' : 'RATIFIER LA MAISON DANS LE LANDSRAAD'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
