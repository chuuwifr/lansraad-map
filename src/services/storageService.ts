import { StarSystem, HouseInfo, MapVisualConfig } from '../types/landsraad';
import { STAR_SYSTEMS_DATA, HOUSES_DATA } from '../data/landsraadData';

export interface LandsraadBackupData {
  version: string;
  schemaVersion: number;
  timestamp: number;
  dateFormatted: string;
  imperialStardate: string;
  title: string;
  notes?: string;
  systems: StarSystem[];
  houses: Record<string, HouseInfo>;
  selectedSystemId?: string;
  config?: Partial<MapVisualConfig>;
}

export interface BackupSlot {
  id: string;
  name: string;
  timestamp: number;
  imperialStardate: string;
  systemsCount: number;
  housesCount: number;
  selectedSystemName?: string;
  data: LandsraadBackupData;
}

const STORAGE_KEY_AUTOSAVE = 'dune_landsraad_autosave_v2';
const STORAGE_KEY_SLOTS = 'dune_landsraad_slots_v1';

export const storageService = {
  // Save current app state to local storage autosave
  saveAutosave(
    systems: StarSystem[],
    houses: Record<string, HouseInfo>,
    selectedSystemId?: string,
    config?: Partial<MapVisualConfig>
  ): void {
    try {
      const backup: LandsraadBackupData = {
        version: '1.2.0',
        schemaVersion: 2,
        timestamp: Date.now(),
        dateFormatted: new Date().toLocaleString('fr-FR'),
        imperialStardate: '10,191 A.G. // Cycle Holonet',
        title: 'Sauvegarde Automatique Holonet',
        systems,
        houses,
        selectedSystemId,
        config
      };
      localStorage.setItem(STORAGE_KEY_AUTOSAVE, JSON.stringify(backup));
    } catch (err) {
      console.warn('Unable to write autosave to localStorage:', err);
    }
  },

  // Load autosave from local storage with canonical synchronization
  loadAutosave(): LandsraadBackupData | null {
    try {
      // Check v2 key first, then fallback to v1 for migration
      let raw = localStorage.getItem(STORAGE_KEY_AUTOSAVE);
      if (!raw) {
        raw = localStorage.getItem('dune_landsraad_autosave_v1');
      }
      
      if (!raw) {
        return {
          version: '1.2.0',
          schemaVersion: 2,
          timestamp: Date.now(),
          dateFormatted: new Date().toLocaleString('fr-FR'),
          imperialStardate: '10,191 A.G.',
          title: 'Registre Canonique Impérial',
          systems: STAR_SYSTEMS_DATA,
          houses: HOUSES_DATA,
          selectedSystemId: STAR_SYSTEMS_DATA[0].id
        };
      }

      const parsed = JSON.parse(raw) as LandsraadBackupData;
      if (parsed && Array.isArray(parsed.systems)) {
        // MERGE: Ensure all 53+ canonical systems from STAR_SYSTEMS_DATA are present
        const canonicalMap = new Map(STAR_SYSTEMS_DATA.map(s => [s.id, s]));
        const parsedMap = new Map(parsed.systems.map(s => [s.id, s]));
        
        const mergedSystems: StarSystem[] = [];

        // 1. Add all canonical systems (updated with rich metrics, lore & POIs)
        for (const canonical of STAR_SYSTEMS_DATA) {
          const userSaved = parsedMap.get(canonical.id);
          if (userSaved && (userSaved.isCustom || userSaved.customImageUrl)) {
            mergedSystems.push({ ...canonical, ...userSaved });
          } else {
            mergedSystems.push(canonical);
          }
        }

        // 2. Add any custom systems created by the user
        for (const savedSys of parsed.systems) {
          if (!canonicalMap.has(savedSys.id)) {
            mergedSystems.push(savedSys);
          }
        }

        return {
          ...parsed,
          systems: mergedSystems,
          houses: { ...HOUSES_DATA, ...(parsed.houses || {}) }
        };
      }
    } catch (err) {
      console.warn('Unable to load autosave from localStorage:', err);
    }
    return {
      version: '1.2.0',
      schemaVersion: 2,
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleString('fr-FR'),
      imperialStardate: '10,191 A.G.',
      title: 'Registre Canonique Impérial',
      systems: STAR_SYSTEMS_DATA,
      houses: HOUSES_DATA,
      selectedSystemId: STAR_SYSTEMS_DATA[0].id
    };
  },

  // Clear autosave
  clearAutosave(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_AUTOSAVE);
    } catch (err) {
      console.warn('Unable to clear autosave:', err);
    }
  },

  // Get all user save slots
  getSaveSlots(): BackupSlot[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SLOTS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (err) {
      console.warn('Unable to read save slots:', err);
    }
    return [];
  },

  // Save to a specific slot
  saveToSlot(
    slotId: string,
    slotName: string,
    systems: StarSystem[],
    houses: Record<string, HouseInfo>,
    selectedSystemId?: string,
    config?: Partial<MapVisualConfig>,
    notes?: string
  ): BackupSlot[] {
    const selectedSys = systems.find(s => s.id === selectedSystemId) || systems[0];
    const newBackup: LandsraadBackupData = {
      version: '1.0.0',
      schemaVersion: 1,
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleString('fr-FR'),
      imperialStardate: '10,191 A.G. // Registre Impérial',
      title: slotName,
      notes,
      systems,
      houses,
      selectedSystemId,
      config
    };

    const newSlot: BackupSlot = {
      id: slotId || `slot-${Date.now()}`,
      name: slotName || `Sauvegarde du ${new Date().toLocaleDateString('fr-FR')}`,
      timestamp: Date.now(),
      imperialStardate: '10,191 A.G.',
      systemsCount: systems.length,
      housesCount: Object.keys(houses).length,
      selectedSystemName: selectedSys?.name || 'Inconnu',
      data: newBackup
    };

    const currentSlots = this.getSaveSlots();
    const existingIndex = currentSlots.findIndex(s => s.id === newSlot.id);
    let updatedSlots: BackupSlot[];

    if (existingIndex >= 0) {
      updatedSlots = [...currentSlots];
      updatedSlots[existingIndex] = newSlot;
    } else {
      updatedSlots = [newSlot, ...currentSlots];
    }

    try {
      localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(updatedSlots));
    } catch (err) {
      console.error('Failed to save slot to localStorage:', err);
      throw new Error('Espace de stockage local saturé ou inaccessible');
    }

    return updatedSlots;
  },

  // Delete a save slot
  deleteSlot(slotId: string): BackupSlot[] {
    const currentSlots = this.getSaveSlots();
    const filtered = currentSlots.filter(s => s.id !== slotId);
    try {
      localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(filtered));
    } catch (err) {
      console.warn('Failed to update slots:', err);
    }
    return filtered;
  },

  // Export full archive to downloadable JSON file
  exportToJsonFile(
    systems: StarSystem[],
    houses: Record<string, HouseInfo>,
    selectedSystemId?: string,
    config?: Partial<MapVisualConfig>,
    customTitle?: string
  ): void {
    const backupData: LandsraadBackupData = {
      version: '1.0.0',
      schemaVersion: 1,
      timestamp: Date.now(),
      dateFormatted: new Date().toISOString(),
      imperialStardate: '10,191 A.G. // Grande Convention du Landsraad',
      title: customTitle || 'Archives Galactiques & Fiefs Impériaux du Landsraad',
      notes: 'Données cartographiques 3D, héraldique des Maisons, coordonnées stellaires et métriques planétaires.',
      systems,
      houses,
      selectedSystemId,
      config
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}h${String(now.getMinutes()).padStart(2, '0')}`;
    const filename = `dune-landsraad-backup_${dateStr}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Validate and parse an imported JSON file string
  parseAndValidateBackup(jsonString: string): { success: boolean; data?: LandsraadBackupData; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);

      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Le fichier fourni n\'est pas un objet JSON valide.' };
      }

      // Check systems
      if (!Array.isArray(parsed.systems) || parsed.systems.length === 0) {
        return { success: false, error: 'Le fichier ne contient aucun système stellaire valide (champ "systems" manquant).' };
      }

      // Check houses
      if (!parsed.houses || typeof parsed.houses !== 'object') {
        return { success: false, error: 'Le fichier ne contient aucune Maison valide (champ "houses" manquant).' };
      }

      // Basic sanity check on first system
      const firstSys = parsed.systems[0];
      if (!firstSys.id || !firstSys.name || !firstSys.primaryPlanet || !Array.isArray(firstSys.coordinates)) {
        return { success: false, error: 'Structure des systèmes stellaires invalide ou corrompue.' };
      }

      const validatedData: LandsraadBackupData = {
        version: parsed.version || '1.0.0',
        schemaVersion: parsed.schemaVersion || 1,
        timestamp: parsed.timestamp || Date.now(),
        dateFormatted: parsed.dateFormatted || new Date().toLocaleString('fr-FR'),
        imperialStardate: parsed.imperialStardate || '10,191 A.G.',
        title: parsed.title || 'Archive Importée',
        notes: parsed.notes,
        systems: parsed.systems,
        houses: parsed.houses,
        selectedSystemId: parsed.selectedSystemId || parsed.systems[0]?.id,
        config: parsed.config
      };

      return { success: true, data: validatedData };
    } catch (err: any) {
      return { success: false, error: `Erreur de syntaxe JSON : ${err?.message || 'fichier illisible'}` };
    }
  },

  // Get canonical factory default state
  getCanonicalDefaultState(): { systems: StarSystem[]; houses: Record<string, HouseInfo> } {
    return {
      systems: JSON.parse(JSON.stringify(STAR_SYSTEMS_DATA)),
      houses: JSON.parse(JSON.stringify(HOUSES_DATA))
    };
  }
};
