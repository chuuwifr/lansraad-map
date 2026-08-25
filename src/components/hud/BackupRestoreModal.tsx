import React, { useState, useEffect, useRef } from 'react';
import { StarSystem, HouseInfo, MapVisualConfig } from '../../types/landsraad';
import { storageService, BackupSlot, LandsraadBackupData } from '../../services/storageService';
import { audioSynth } from '../../services/audioSynth';
import { 
  X, 
  Download, 
  UploadCloud, 
  Save, 
  RotateCcw, 
  Trash2, 
  Check, 
  AlertTriangle, 
  FileText, 
  Layers, 
  HardDrive, 
  Copy, 
  Sparkles, 
  Shield, 
  Globe, 
  Clock, 
  CheckCircle2, 
  FileJson,
  FolderOpen,
  ArrowRight,
  Database
} from 'lucide-react';

interface BackupRestoreModalProps {
  systems: StarSystem[];
  houses: Record<string, HouseInfo>;
  selectedSystemId?: string;
  config: MapVisualConfig;
  onRestoreState: (restoredData: {
    systems: StarSystem[];
    houses: Record<string, HouseInfo>;
    selectedSystemId?: string;
    config?: Partial<MapVisualConfig>;
  }) => void;
  onClose: () => void;
}

type TabType = 'export' | 'import' | 'slots' | 'reset';

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  systems,
  houses,
  selectedSystemId,
  config,
  onRestoreState,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('export');
  const [slots, setSlots] = useState<BackupSlot[]>([]);
  const [newSlotName, setNewSlotName] = useState('');
  const [isSavingSlot, setIsSavingSlot] = useState(false);
  
  // Import state
  const [importJsonText, setImportJsonText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<LandsraadBackupData | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset confirmation state
  const [resetConfirmed, setResetConfirmed] = useState(false);

  // Load existing slots on mount
  useEffect(() => {
    setSlots(storageService.getSaveSlots());
  }, []);

  const handleExportJson = () => {
    audioSynth.playHoloClick(1600);
    storageService.exportToJsonFile(
      systems,
      houses,
      selectedSystemId,
      config,
      `Archives Impériales - ${systems.length} Mondes`
    );
  };

  const handleCopyJson = () => {
    audioSynth.playHoloClick(1400);
    const data: LandsraadBackupData = {
      version: '1.0.0',
      schemaVersion: 1,
      timestamp: Date.now(),
      dateFormatted: new Date().toISOString(),
      imperialStardate: '10,191 A.G.',
      title: 'Presse-Papier Archives Impériales',
      systems,
      houses,
      selectedSystemId,
      config
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2500);
  };

  const handleFileSelected = (file: File) => {
    setImportError(null);
    setImportSuccessMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setImportJsonText(content);
        validateAndSetPreview(content);
      }
    };
    reader.onerror = () => {
      setImportError('Impossible de lire le fichier sélectionné.');
    };
    reader.readAsText(file);
  };

  const validateAndSetPreview = (text: string) => {
    setImportError(null);
    setImportSuccessMessage(null);
    const res = storageService.parseAndValidateBackup(text);
    if (res.success && res.data) {
      setParsedPreview(res.data);
      audioSynth.playHoloClick(1500);
    } else {
      setParsedPreview(null);
      setImportError(res.error || 'Erreur lors de la validation du fichier.');
    }
  };

  const handleConfirmImport = (merge: boolean = false) => {
    if (!parsedPreview) return;

    audioSynth.playHoloClick(1800);

    if (merge) {
      // Merge mode: keep existing systems, overwrite or append new ones
      const existingSystemIds = new Set(systems.map(s => s.id));
      const mergedSystems = [...systems];

      parsedPreview.systems.forEach(importedSys => {
        const idx = mergedSystems.findIndex(s => s.id === importedSys.id);
        if (idx >= 0) {
          mergedSystems[idx] = importedSys;
        } else {
          mergedSystems.push(importedSys);
        }
      });

      const mergedHouses = {
        ...houses,
        ...parsedPreview.houses
      };

      onRestoreState({
        systems: mergedSystems,
        houses: mergedHouses,
        selectedSystemId: parsedPreview.selectedSystemId || selectedSystemId,
        config: parsedPreview.config
      });

      setImportSuccessMessage(`Fusion réussie : ${mergedSystems.length} mondes et ${Object.keys(mergedHouses).length} Maisons actifs.`);
    } else {
      // Full replacement
      onRestoreState({
        systems: parsedPreview.systems,
        houses: parsedPreview.houses,
        selectedSystemId: parsedPreview.selectedSystemId,
        config: parsedPreview.config
      });

      setImportSuccessMessage(`Restauration complète effectuée : ${parsedPreview.systems.length} mondes et ${Object.keys(parsedPreview.houses).length} Maisons restaurés.`);
    }

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleSaveToNewSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotName.trim()) return;

    try {
      const updated = storageService.saveToSlot(
        `slot-${Date.now()}`,
        newSlotName.trim(),
        systems,
        houses,
        selectedSystemId,
        config
      );
      setSlots(updated);
      setNewSlotName('');
      setIsSavingSlot(false);
      audioSynth.playHoloClick(1600);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleLoadSlot = (slot: BackupSlot) => {
    audioSynth.playHoloClick(1700);
    onRestoreState({
      systems: slot.data.systems,
      houses: slot.data.houses,
      selectedSystemId: slot.data.selectedSystemId,
      config: slot.data.config
    });
    onClose();
  };

  const handleDeleteSlot = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioSynth.playHoloClick(1000);
    const updated = storageService.deleteSlot(slotId);
    setSlots(updated);
  };

  const handleRestoreAutosave = () => {
    const autosave = storageService.loadAutosave();
    if (autosave) {
      audioSynth.playHoloClick(1700);
      onRestoreState({
        systems: autosave.systems,
        houses: autosave.houses,
        selectedSystemId: autosave.selectedSystemId,
        config: autosave.config
      });
      onClose();
    } else {
      alert('Aucune sauvegarde automatique trouvée dans ce navigateur.');
    }
  };

  const handleCanonicalFactoryReset = () => {
    audioSynth.playHoloClick(900);
    const canonical = storageService.getCanonicalDefaultState();
    onRestoreState({
      systems: canonical.systems,
      houses: canonical.houses,
      selectedSystemId: canonical.systems[0]?.id
    });
    onClose();
  };

  const autosaveData = storageService.loadAutosave();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelected(file);
        }}
      />

      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#090b10] border border-[#f59e0b]/40 rounded-xl shadow-[0_0_50px_rgba(245,158,11,0.25)] overflow-hidden text-[#e2d9c8]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#f59e0b]/25 bg-gradient-to-r from-[#f59e0b]/15 via-transparent to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/15 border border-[#f59e0b] flex items-center justify-center text-[#f59e0b]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-base sm:text-lg font-bold text-[#fef3c7] flex items-center gap-2">
                ARCHIVES IMPÉRIALES & GESTION DES SAUVEGARDES
                <span className="px-2 py-0.5 text-[9px] font-mono bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30 rounded">
                  HOLONET SYNC
                </span>
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Sauvegardez, exportez, partagez ou restaurez l'intégralité de la carte galactique, des fiefs et des Maisons
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

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 bg-[#06080e] overflow-x-auto text-xs font-mono">
          <button
            onClick={() => {
              audioSynth.playHoloClick(1200);
              setActiveTab('export');
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold whitespace-nowrap transition-colors ${
              activeTab === 'export'
                ? 'border-[#f59e0b] text-[#f59e0b] bg-[#f59e0b]/5'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>EXPORTER (JSON)</span>
          </button>

          <button
            onClick={() => {
              audioSynth.playHoloClick(1200);
              setActiveTab('import');
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold whitespace-nowrap transition-colors ${
              activeTab === 'import'
                ? 'border-[#f59e0b] text-[#f59e0b] bg-[#f59e0b]/5'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>RESTAURER / IMPORTER</span>
          </button>

          <button
            onClick={() => {
              audioSynth.playHoloClick(1200);
              setActiveTab('slots');
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold whitespace-nowrap transition-colors ${
              activeTab === 'slots'
                ? 'border-[#f59e0b] text-[#f59e0b] bg-[#f59e0b]/5'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>EMPLACEMENTS LOCAUX ({slots.length})</span>
          </button>

          <button
            onClick={() => {
              audioSynth.playHoloClick(1200);
              setActiveTab('reset');
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold whitespace-nowrap transition-colors ${
              activeTab === 'reset'
                ? 'border-red-500 text-red-400 bg-red-500/5'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>RÉINITIALISER CANONIQUE</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 font-mono text-xs custom-scrollbar">
          
          {/* TAB 1: EXPORT */}
          {activeTab === 'export' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Summary Card */}
              <div className="p-4 rounded-xl border border-[#f59e0b]/30 bg-[#0d121c]/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Contenu Actuel de la Session Holonet
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Version de Schéma : 1.0.0
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase block">Systèmes Stellaires</span>
                    <span className="text-base font-bold text-[#fbbf24] mt-0.5 block">{systems.length}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase block">Grandes Maisons</span>
                    <span className="text-base font-bold text-[#38bdf8] mt-0.5 block">{Object.keys(houses).length}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase block">Points d'Intérêt (POI)</span>
                    <span className="text-base font-bold text-[#34d399] mt-0.5 block">
                      {systems.reduce((acc, s) => acc + (s.tacticalPOIs?.length || 0), 0)}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-center">
                    <span className="text-[10px] text-neutral-400 uppercase block">Monde Focalisé</span>
                    <span className="text-xs font-bold text-white mt-1 block truncate">
                      {systems.find(s => s.id === selectedSystemId)?.name.split('//')[1]?.trim() || 'Arrakis'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-neutral-800 bg-[#06090f] flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
                      <FileJson className="w-4 h-4 text-[#f59e0b]" />
                      Télécharger le Fichier Archive .JSON
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                      Crée un fichier complet contenant toutes les planètes, soleils, textures, armoiries de Maisons et configurations visuelles.
                    </p>
                  </div>

                  <button
                    onClick={handleExportJson}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>TÉLÉCHARGER LE FICHIER .JSON</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-neutral-800 bg-[#06090f] flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-cinzel text-sm font-bold text-white flex items-center gap-2">
                      <Copy className="w-4 h-4 text-cyan-400" />
                      Copier le JSON dans le Presse-Papier
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                      Idéal pour partager vos créations, sauvegarder dans un éditeur de texte ou transmettre à un autre utilisateur.
                    </p>
                  </div>

                  <button
                    onClick={handleCopyJson}
                    className={`w-full py-2.5 px-4 rounded-lg border font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      copiedToClipboard
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-600'
                    }`}
                  >
                    {copiedToClipboard ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedToClipboard ? 'COPIÉ DANS LE PRESSE-PAPIER !' : 'COPIER LE TEXTE JSON'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORT */}
          {activeTab === 'import' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Drag & Drop File Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFileSelected(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`p-8 rounded-xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-3 ${
                  isDragOver
                    ? 'border-[#f59e0b] bg-[#f59e0b]/10 scale-[1.01]'
                    : 'border-neutral-700 hover:border-[#f59e0b]/60 bg-[#07090e]/80 hover:bg-[#0a0f18]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/40 flex items-center justify-center text-[#f59e0b]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-white">
                    Glissez-déposez une archive .JSON ici
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-1 font-mono">
                    ou cliquez pour parcourir vos fichiers locaux
                  </p>
                </div>
              </div>

              {/* Paste JSON Raw Text */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-neutral-300 block">
                  Ou collez directement le contenu JSON brut :
                </label>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => {
                    setImportJsonText(e.target.value);
                    if (e.target.value.trim()) {
                      validateAndSetPreview(e.target.value);
                    } else {
                      setParsedPreview(null);
                      setImportError(null);
                    }
                  }}
                  placeholder='{"version": "1.0.0", "systems": [...], "houses": {...}}'
                  className="w-full p-3 rounded-lg bg-[#05070a] border border-neutral-700 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs focus:outline-none"
                />
              </div>

              {/* Import Error Message */}
              {importError && (
                <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-700/80 text-red-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Archive Invalide ou Incompatible</span>
                    <p className="text-[11px] text-red-300 mt-0.5">{importError}</p>
                  </div>
                </div>
              )}

              {/* Import Success Notification */}
              {importSuccessMessage && (
                <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-600 text-emerald-200 flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-bold text-xs">{importSuccessMessage}</span>
                </div>
              )}

              {/* Preview Card Before Restoring */}
              {parsedPreview && (
                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/15 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Archive Valide Détectée</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">
                      Date : {parsedPreview.dateFormatted}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-2.5 rounded bg-black/40 border border-emerald-500/20">
                      <span className="text-[10px] text-neutral-400 block">Titre de l'Archive</span>
                      <span className="font-bold text-white truncate block mt-0.5">{parsedPreview.title}</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/40 border border-emerald-500/20">
                      <span className="text-[10px] text-neutral-400 block">Mondes & Systèmes</span>
                      <span className="font-bold text-[#fbbf24] block mt-0.5">{parsedPreview.systems.length} planètes</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/40 border border-emerald-500/20">
                      <span className="text-[10px] text-neutral-400 block">Grandes Maisons</span>
                      <span className="font-bold text-[#38bdf8] block mt-0.5">{Object.keys(parsedPreview.houses).length} factions</span>
                    </div>
                  </div>

                  {/* Restore Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={() => handleConfirmImport(false)}
                      className="w-full sm:flex-1 py-2.5 px-4 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-black font-cinzel font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>RESTAURER & REMPLACER TOUT</span>
                    </button>

                    <button
                      onClick={() => handleConfirmImport(true)}
                      className="w-full sm:flex-1 py-2.5 px-4 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-600 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all"
                    >
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>FUSIONNER AVEC L'EXISTANT</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: LOCAL SLOTS */}
          {activeTab === 'slots' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Quick Autosave Bar */}
              <div className="p-3.5 rounded-xl border border-neutral-800 bg-[#080b12] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <span className="font-bold text-xs text-neutral-200 block">Sauvegarde Automatique de Session</span>
                    <span className="text-[10px] text-neutral-400">
                      {autosaveData ? `Dernière synchro : ${autosaveData.dateFormatted}` : 'Aucune session enregistrée'}
                    </span>
                  </div>
                </div>

                {autosaveData && (
                  <button
                    onClick={handleRestoreAutosave}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#f59e0b] border border-[#f59e0b]/40 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Charger Session</span>
                  </button>
                )}
              </div>

              {/* Create New Slot */}
              <div className="p-4 rounded-xl border border-[#f59e0b]/30 bg-[#0d121c]/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#f59e0b] uppercase tracking-wider flex items-center gap-1.5">
                    <Save className="w-4 h-4" /> Enregistrer l'État Actuel dans un Emplacement
                  </span>
                </div>

                <form onSubmit={handleSaveToNewSlot} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newSlotName}
                    onChange={(e) => setNewSlotName(e.target.value)}
                    placeholder="Nom du slot (ex: Campagne Atréides, Guerre d'Arrakis...)"
                    className="flex-1 px-3 py-2 rounded-lg bg-[#05070a] border border-neutral-700 focus:border-[#f59e0b] text-[#f3e8d2] font-mono text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-black font-cinzel font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>SAUVEGARDER</span>
                  </button>
                </form>
              </div>

              {/* Slots List */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                  Emplacements Sauvegardés dans ce Navigateur ({slots.length}) :
                </span>

                {slots.length === 0 ? (
                  <div className="p-8 text-center bg-neutral-950/40 rounded-xl border border-neutral-800 text-neutral-500 space-y-2">
                    <HardDrive className="w-8 h-8 mx-auto opacity-30" />
                    <p>Aucun emplacement de sauvegarde créé pour l'instant.</p>
                    <p className="text-[10px]">Utilisez le formulaire ci-dessus pour enregistrer votre état actuel.</p>
                  </div>
                ) : (
                  slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-3.5 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-[#070a10] flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0">
                        <h4 className="font-cinzel text-sm font-bold text-neutral-100 truncate">
                          {slot.name}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-1 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#f59e0b]" />
                            {new Date(slot.timestamp).toLocaleString('fr-FR')}
                          </span>
                          <span>•</span>
                          <span>{slot.systemsCount} mondes</span>
                          <span>•</span>
                          <span>{slot.housesCount} Maisons</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleLoadSlot(slot)}
                          className="px-3 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-black font-cinzel font-bold text-xs flex items-center gap-1 transition-all"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>CHARGER</span>
                        </button>

                        <button
                          onClick={(e) => handleDeleteSlot(slot.id, e)}
                          className="p-2 rounded-lg bg-red-950/60 hover:bg-red-700 text-red-300 hover:text-white border border-red-900 transition-colors"
                          title="Supprimer cet emplacement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

          {/* TAB 4: FACTORY RESET */}
          {activeTab === 'reset' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-xl border border-red-700/60 bg-red-950/20 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-900/50 border border-red-600 text-red-300 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-cinzel text-base font-bold text-red-200 uppercase">
                      Rétablir l'Imperium Canonique Initial (Reset d'Usine)
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1 font-sans leading-relaxed">
                      Cette action réinitialisera l'intégralité de la carte galactique, des systèmes stellaires (Canopus, Kaitain, Giedi Prime, Salusa Secundus, Tupile, Kolhar...) et de toutes les Maisons nobles à leur état initial canonique de Dune.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded bg-black/60 border border-red-900 text-neutral-400 text-[11px]">
                  ⚠️ Toute planète personnalisée ou armoirie non exportée dans un fichier JSON sera effacée de la mémoire active.
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                    <input
                      type="checkbox"
                      checked={resetConfirmed}
                      onChange={(e) => setResetConfirmed(e.target.checked)}
                      className="accent-red-500 w-4 h-4"
                    />
                    <span>Je comprends et souhaite réinitialiser l'état canonique</span>
                  </label>

                  <button
                    disabled={!resetConfirmed}
                    onClick={handleCanonicalFactoryReset}
                    className={`px-5 py-2.5 rounded-lg font-cinzel font-bold text-xs flex items-center gap-2 transition-all ${
                      resetConfirmed
                        ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer'
                        : 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>CONFIRMER LA RÉINITIALISATION</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#f59e0b]/20 bg-[#06080e] flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sécurisation Holonet & Intégrité des Données : NOMINALE</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
