import { describe, it, expect, beforeEach } from 'vitest';
import { useHueStore } from '../store/useHueStore';

describe('Store Integrity & Persistence Safeguards', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('exports valid JSON backup schema', () => {
    const store = useHueStore.getState();
    const backupStr = store.exportBackup();
    const parsed = JSON.parse(backupStr);

    expect(parsed.app).toBe('HueLab');
    expect(parsed.version).toBe('1.0.0');
    expect(Array.isArray(parsed.favorites)).toBe(true);
    expect(Array.isArray(parsed.history)).toBe(true);
    expect(parsed.currentPalette).toBeDefined();
    expect(Array.isArray(parsed.currentPalette.colors)).toBe(true);
  });

  it('rejects malformed or invalid backup JSON safely', () => {
    const store = useHueStore.getState();
    const resultInvalidJson = store.importBackup('{ broken json:');
    expect(resultInvalidJson.success).toBe(false);
    expect(resultInvalidJson.error).toBeDefined();

    const resultNonObject = store.importBackup('"just a string"');
    expect(resultNonObject.success).toBe(false);
  });

  it('imports valid backup and updates state and localStorage safely', () => {
    const store = useHueStore.getState();
    const mockBackup = {
      app: 'HueLab',
      version: '1.0.0',
      favorites: [
        {
          id: 'test-fav-1',
          name: 'Backup Sunset',
          harmony: 'analogous',
          createdAt: 1000,
          colors: [
            { id: 'c1', hex: '#FF5733', name: 'Coral', locked: false, role: 'primary' },
            { id: 'c2', hex: '#C70039', name: 'Crimson', locked: false, role: 'accent' },
          ],
        },
      ],
      history: [],
      preferences: {
        defaultPaletteSize: 6,
        defaultHarmony: 'triadic',
        exportFormat: 'tailwind',
        enableKeyboardShortcuts: true,
        reducedMotion: true,
        aiProvider: 'local',
      },
      currentPalette: {
        id: 'test-curr-1',
        name: 'Active Sunset',
        harmony: 'analogous',
        createdAt: 1000,
        colors: [
          { id: 'c1', hex: '#FF5733', name: 'Coral', locked: false, role: 'primary' },
          { id: 'c2', hex: '#C70039', name: 'Crimson', locked: false, role: 'accent' },
        ],
      },
    };

    const res = store.importBackup(JSON.stringify(mockBackup));
    expect(res.success).toBe(true);

    const updated = useHueStore.getState();
    expect(updated.favorites.length).toBe(1);
    expect(updated.favorites[0].name).toBe('Backup Sunset');
    expect(updated.preferences.defaultPaletteSize).toBe(6);
    expect(updated.currentPalette.name).toBe('Active Sunset');
  });
});
