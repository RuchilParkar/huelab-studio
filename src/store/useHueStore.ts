import { create } from 'zustand';
import {
  ColorItem,
  GradientConfig,
  HarmonyType,
  PageView,
  Palette,
  UserPreferences,
} from '../types';
import {
  generatePalette,
  generateRandomHex,
  balancePaletteContrast,
} from '../engine/paletteGenerator';
import { getColorName } from '../engine/colorNaming';
import { getDefaultGradient } from '../engine/gradientEngine';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export type PreviewMode = 'saas' | 'dashboard' | 'ecommerce' | 'mobile' | 'components';

interface HueStore {
  // Navigation & View
  activePage: PageView;
  setActivePage: (page: PageView) => void;

  // Active Palette State
  currentPalette: Palette;
  history: Palette[];
  favorites: Palette[];
  editingColor: ColorItem | null;
  focusedColorIndex: number;
  generationMode: 'ui-system' | 'pure-harmony';
  setGenerationMode: (mode: 'ui-system' | 'pure-harmony') => void;

  // Actions on Active Palette
  generateNewPalette: (params?: {
    harmony?: HarmonyType;
    baseHex?: string;
    mode?: 'ui-system' | 'pure-harmony';
  }) => void;
  balancePalette: () => void;
  updateColor: (id: string, updates: Partial<ColorItem>) => void;
  updateColorRole: (id: string, role: ColorItem['role']) => void;
  toggleColorLock: (id: string) => void;
  toggleFocusedLock: () => void;
  setFocusedColorIndex: (index: number) => void;
  addColor: (hex?: string) => void;
  removeColor: (id: string) => void;
  setPalette: (palette: Palette) => void;
  setBaseColor: (hex: string) => void;
  setHarmony: (harmony: HarmonyType) => void;
  setEditingColor: (color: ColorItem | null) => void;

  // Favorites & History
  toggleFavorite: (paletteId?: string) => void;
  removeFavorite: (paletteId: string) => void;
  renamePalette: (paletteId: string, newName: string) => void;
  clearHistory: () => void;
  deleteFromHistory: (paletteId: string) => void;

  // Gradient Studio State
  gradientConfig: GradientConfig;
  setGradientConfig: (updater: (prev: GradientConfig) => GradientConfig) => void;
  updateGradientStop: (id: string, updates: { color?: string; position?: number }) => void;
  addGradientStop: () => void;
  removeGradientStop: (id: string) => void;

  // Live Website Preview State
  previewMode: PreviewMode;
  setPreviewMode: (mode: PreviewMode) => void;
  previewTheme: 'dark' | 'light';
  setPreviewTheme: (theme: 'dark' | 'light') => void;

  // Preferences & Local Data
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  exportBackup: () => string;
  importBackup: (jsonStr: string) => { success: boolean; error?: string };

  // Toasts
  toasts: ToastItem[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEYS = {
  PREFERENCES: 'huelabstudio_preferences_v1',
  FAVORITES: 'huelabstudio_favorites_v1',
  HISTORY: 'huelabstudio_history_v1',
  CURRENT: 'huelabstudio_current_v1',
  GEN_MODE: 'huelabstudio_gen_mode_v1',
};

// Safe LocalStorage helpers with backward-compatible legacy fallback
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    let raw = localStorage.getItem(key);
    if (!raw && key.startsWith('huelabstudio_')) {
      const legacyKey = key.replace('huelabstudio_', 'huelab_');
      raw = localStorage.getItem(legacyKey);
    }
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

// Initial default state
const initialPreferences: UserPreferences = {
  defaultPaletteSize: 5,
  defaultHarmony: 'analogous',
  exportFormat: 'css',
  enableKeyboardShortcuts: true,
  reducedMotion: false,
  aiProvider: 'local',
};

const initialPalette = generatePalette({
  count: 5,
  harmony: 'analogous',
  baseHex: '#7C5CFC',
  name: 'Royal Amethyst Harmony',
  mode: 'ui-system',
});

function loadCurrentPalette(): Palette {
  const loaded = loadFromStorage<Palette | null>(STORAGE_KEYS.CURRENT, null);
  if (loaded && typeof loaded === 'object' && Array.isArray(loaded.colors) && loaded.colors.length >= 2) {
    return loaded;
  }
  return initialPalette;
}

function loadPaletteArray(key: string, fallback: Palette[]): Palette[] {
  const loaded = loadFromStorage<Palette[] | null>(key, null);
  if (Array.isArray(loaded)) {
    return loaded.filter((p) => p && typeof p === 'object' && Array.isArray(p.colors) && p.colors.length >= 2);
  }
  return fallback;
}

function loadPreferences(): UserPreferences {
  const loaded = loadFromStorage<UserPreferences | null>(STORAGE_KEYS.PREFERENCES, null);
  if (loaded && typeof loaded === 'object') {
    return { ...initialPreferences, ...loaded };
  }
  return initialPreferences;
}

export const useHueStore = create<HueStore>((set, get) => ({
  activePage: 'generator',
  setActivePage: (page) => set({ activePage: page }),

  currentPalette: loadCurrentPalette(),
  history: loadPaletteArray(STORAGE_KEYS.HISTORY, [initialPalette]),
  favorites: loadPaletteArray(STORAGE_KEYS.FAVORITES, []),
  editingColor: null,
  focusedColorIndex: 0,
  generationMode: loadFromStorage<'ui-system' | 'pure-harmony'>(STORAGE_KEYS.GEN_MODE, 'ui-system'),

  setGenerationMode: (mode) => {
    saveToStorage(STORAGE_KEYS.GEN_MODE, mode);
    set({ generationMode: mode });
  },

  setFocusedColorIndex: (index) => set({ focusedColorIndex: index }),

  generateNewPalette: (params) => {
    const { currentPalette, history, preferences, generationMode } = get();
    const count = currentPalette.colors.length || preferences.defaultPaletteSize;
    const harmony = params?.harmony || currentPalette.harmony || preferences.defaultHarmony;
    const mode = params?.mode || generationMode;

    const newPalette = generatePalette({
      existingColors: currentPalette.colors,
      count,
      harmony,
      baseHex: params?.baseHex,
      mode,
    });

    const updatedHistory = [newPalette, ...history.slice(0, 49)];

    saveToStorage(STORAGE_KEYS.CURRENT, newPalette);
    saveToStorage(STORAGE_KEYS.HISTORY, updatedHistory);

    set({
      currentPalette: newPalette,
      history: updatedHistory,
    });
  },

  balancePalette: () => {
    const { currentPalette, addToast } = get();
    const balancedColors = balancePaletteContrast(currentPalette.colors);
    const updatedPalette = { ...currentPalette, colors: balancedColors };

    saveToStorage(STORAGE_KEYS.CURRENT, updatedPalette);
    set({ currentPalette: updatedPalette });
    addToast('Balanced palette for optimal WCAG AA/AAA UI contrast!', 'success');
  },

  updateColorRole: (id, role) => {
    const { currentPalette, addToast } = get();
    const updatedColors = currentPalette.colors.map((c) =>
      c.id === id ? { ...c, role } : c
    );
    const updatedPalette = { ...currentPalette, colors: updatedColors };
    saveToStorage(STORAGE_KEYS.CURRENT, updatedPalette);
    set({ currentPalette: updatedPalette });
    addToast(`Assigned role: ${role}`, 'info');
  },

  updateColor: (id, updates) => {
    const { currentPalette } = get();
    const updatedColors = currentPalette.colors.map((c) => {
      if (c.id === id) {
        const hex = updates.hex ? updates.hex.toUpperCase() : c.hex;
        const name = updates.hex ? getColorName(hex) : updates.name ?? c.name;
        return { ...c, ...updates, hex, name };
      }
      return c;
    });

    const updatedPalette = { ...currentPalette, colors: updatedColors };
    saveToStorage(STORAGE_KEYS.CURRENT, updatedPalette);
    set({ currentPalette: updatedPalette });

    // Also update editingColor if open
    const { editingColor } = get();
    if (editingColor && editingColor.id === id) {
      set({ editingColor: { ...editingColor, ...updates } });
    }
  },

  toggleColorLock: (id) => {
    const { currentPalette, addToast } = get();
    let isNowLocked = false;
    const updatedColors = currentPalette.colors.map((c) => {
      if (c.id === id) {
        isNowLocked = !c.locked;
        return { ...c, locked: isNowLocked };
      }
      return c;
    });

    const updatedPalette = { ...currentPalette, colors: updatedColors };
    saveToStorage(STORAGE_KEYS.CURRENT, updatedPalette);
    set({ currentPalette: updatedPalette });
    addToast(isNowLocked ? 'Color locked' : 'Color unlocked', 'info');
  },

  toggleFocusedLock: () => {
    const { currentPalette, focusedColorIndex, toggleColorLock } = get();
    const target = currentPalette.colors[focusedColorIndex];
    if (target) {
      toggleColorLock(target.id);
    }
  },

  addColor: (hex) => {
    const { currentPalette, addToast } = get();
    if (currentPalette.colors.length >= 10) {
      addToast('Maximum of 10 colors reached', 'info');
      return;
    }

    const newHex = hex ?? generateRandomHex();
    const newColor: ColorItem = {
      id: `color-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      hex: newHex,
      name: getColorName(newHex),
      locked: false,
    };

    const updatedColors = [...currentPalette.colors, newColor];
    const updatedPalette = { ...currentPalette, colors: updatedColors };
    saveToStorage(STORAGE_KEYS.CURRENT, updatedPalette);
    set({ currentPalette: updatedPalette });
    addToast('Added new color to palette', 'success');
  },

  removeColor: (id) => {
    const { currentPalette, addToast } = get();
    if (currentPalette.colors.length <= 2) {
      addToast('A palette requires at least 2 colors', 'info');
      return;
    }

    const updatedColors = currentPalette.colors.filter((c) => c.id !== id);
    const updatedPalette = { ...currentPalette, colors: updatedColors };
    saveToStorage(STORAGE_KEYS.CURRENT, updatedPalette);
    set({ currentPalette: updatedPalette });
    addToast('Removed color from palette', 'info');
  },

  setPalette: (palette) => {
    const { history, addToast } = get();
    const updatedHistory = [palette, ...history.filter((h) => h.id !== palette.id).slice(0, 49)];
    saveToStorage(STORAGE_KEYS.CURRENT, palette);
    saveToStorage(STORAGE_KEYS.HISTORY, updatedHistory);
    set({ currentPalette: palette, history: updatedHistory });
    addToast(`Loaded palette: ${palette.name}`, 'success');
  },

  setBaseColor: (hex) => {
    const { generateNewPalette } = get();
    generateNewPalette({ baseHex: hex });
  },

  setHarmony: (harmony) => {
    const { generateNewPalette } = get();
    generateNewPalette({ harmony });
  },

  setEditingColor: (color) => set({ editingColor: color }),

  toggleFavorite: (paletteId) => {
    const { currentPalette, favorites, addToast } = get();
    const targetId = paletteId || currentPalette.id;
    const isFav = favorites.some((f) => f.id === targetId);

    let updatedFavorites: Palette[];
    if (isFav) {
      updatedFavorites = favorites.filter((f) => f.id !== targetId);
      addToast('Removed from favorites', 'info');
    } else {
      const paletteToFav =
        paletteId === currentPalette.id
          ? { ...currentPalette, isFavorite: true }
          : { ...currentPalette, id: targetId, isFavorite: true };
      updatedFavorites = [paletteToFav, ...favorites];
      addToast('Saved to favorites', 'success');
    }

    saveToStorage(STORAGE_KEYS.FAVORITES, updatedFavorites);
    set({
      favorites: updatedFavorites,
      currentPalette:
        targetId === currentPalette.id
          ? { ...currentPalette, isFavorite: !isFav }
          : currentPalette,
    });
  },

  removeFavorite: (paletteId) => {
    const { favorites, currentPalette, addToast } = get();
    const updated = favorites.filter((f) => f.id !== paletteId);
    saveToStorage(STORAGE_KEYS.FAVORITES, updated);
    set({
      favorites: updated,
      currentPalette:
        paletteId === currentPalette.id
          ? { ...currentPalette, isFavorite: false }
          : currentPalette,
    });
    addToast('Removed from favorites', 'info');
  },

  renamePalette: (paletteId, newName) => {
    const { currentPalette, favorites, history, addToast } = get();
    const cleanName = newName.trim();
    if (!cleanName) return;

    const updatedFavorites = favorites.map((f) => (f.id === paletteId ? { ...f, name: cleanName } : f));
    const updatedHistory = history.map((h) => (h.id === paletteId ? { ...h, name: cleanName } : h));
    const isCurrent = currentPalette.id === paletteId;

    saveToStorage(STORAGE_KEYS.FAVORITES, updatedFavorites);
    saveToStorage(STORAGE_KEYS.HISTORY, updatedHistory);

    if (isCurrent) {
      const updatedCurr = { ...currentPalette, name: cleanName };
      saveToStorage(STORAGE_KEYS.CURRENT, updatedCurr);
      set({ currentPalette: updatedCurr, favorites: updatedFavorites, history: updatedHistory });
    } else {
      set({ favorites: updatedFavorites, history: updatedHistory });
    }

    addToast('Palette renamed', 'success');
  },

  clearHistory: () => {
    saveToStorage(STORAGE_KEYS.HISTORY, []);
    set({ history: [] });
    get().addToast('Palette history cleared', 'info');
  },

  deleteFromHistory: (paletteId) => {
    const { history } = get();
    const updated = history.filter((h) => h.id !== paletteId);
    saveToStorage(STORAGE_KEYS.HISTORY, updated);
    set({ history: updated });
  },

  // Gradient studio
  gradientConfig: getDefaultGradient(),
  setGradientConfig: (updater) =>
    set((state) => ({ gradientConfig: updater(state.gradientConfig) })),

  updateGradientStop: (id, updates) => {
    set((state) => ({
      gradientConfig: {
        ...state.gradientConfig,
        stops: state.gradientConfig.stops.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      },
    }));
  },

  addGradientStop: () => {
    const { gradientConfig, addToast } = get();
    if (gradientConfig.stops.length >= 8) {
      addToast('Maximum 8 gradient stops allowed', 'info');
      return;
    }
    const newStop = {
      id: `stop-${Date.now()}`,
      color: generateRandomHex(),
      position: Math.round(Math.random() * 80 + 10),
    };
    set((state) => ({
      gradientConfig: {
        ...state.gradientConfig,
        stops: [...state.gradientConfig.stops, newStop],
      },
    }));
  },

  removeGradientStop: (id) => {
    const { gradientConfig, addToast } = get();
    if (gradientConfig.stops.length <= 2) {
      addToast('A gradient requires at least 2 color stops', 'info');
      return;
    }
    set((state) => ({
      gradientConfig: {
        ...state.gradientConfig,
        stops: state.gradientConfig.stops.filter((s) => s.id !== id),
      },
    }));
  },

  // Live website preview
  previewMode: 'saas',
  setPreviewMode: (mode) => set({ previewMode: mode }),
  previewTheme: 'dark',
  setPreviewTheme: (theme) => set({ previewTheme: theme }),

  // Preferences & backups
  preferences: loadPreferences(),
  updatePreferences: (updates) => {
    const { preferences, addToast } = get();
    const updated = { ...preferences, ...updates };
    saveToStorage(STORAGE_KEYS.PREFERENCES, updated);
    set({ preferences: updated });
    addToast('Preferences saved', 'success');
  },

  exportBackup: () => {
    const { favorites, history, preferences, currentPalette } = get();
    return JSON.stringify(
      {
        version: '1.0.0',
        app: 'huelabstudio',
        exportedAt: new Date().toISOString(),
        currentPalette,
        favorites,
        history,
        preferences,
      },
      null,
      2
    );
  },

  importBackup: (jsonStr) => {
    try {
      const data = JSON.parse(jsonStr);
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Invalid JSON file format' };
      }

      if (data.favorites && Array.isArray(data.favorites)) {
        saveToStorage(STORAGE_KEYS.FAVORITES, data.favorites);
        set({ favorites: data.favorites });
      }
      if (data.history && Array.isArray(data.history)) {
        saveToStorage(STORAGE_KEYS.HISTORY, data.history);
        set({ history: data.history });
      }
      if (data.preferences && typeof data.preferences === 'object') {
        saveToStorage(STORAGE_KEYS.PREFERENCES, data.preferences);
        set({ preferences: data.preferences });
      }
      if (data.currentPalette && data.currentPalette.colors) {
        saveToStorage(STORAGE_KEYS.CURRENT, data.currentPalette);
        set({ currentPalette: data.currentPalette });
      }

      get().addToast('Backup successfully restored!', 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to parse backup JSON' };
    }
  },

  // Toast system
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    set((state) => ({
      toasts: [...state.toasts.slice(-4), { id, message, type }],
    }));
    setTimeout(() => {
      get().removeToast(id);
    }, 2800);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
