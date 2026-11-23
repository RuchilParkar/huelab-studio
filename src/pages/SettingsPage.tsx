import React, { useState } from 'react';
import { useHueStore } from '../store/useHueStore';
import { HarmonyType } from '../types';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  ShieldCheck,
  Cpu,
  Keyboard,
} from 'lucide-react';
import { downloadFile } from '../engine/exportEngine';

export const SettingsPage: React.FC = () => {
  const {
    preferences,
    updatePreferences,
    exportBackup,
    importBackup,
    addToast,
    clearHistory,
  } = useHueStore();

  const harmonies: { id: HarmonyType; label: string }[] = [
    { id: 'analogous', label: 'Analogous' },
    { id: 'monochromatic', label: 'Monochromatic' },
    { id: 'complementary', label: 'Complementary' },
    { id: 'split-complementary', label: 'Split Complementary' },
    { id: 'triadic', label: 'Triadic' },
    { id: 'tetradic', label: 'Tetradic' },
    { id: 'square', label: 'Square' },
    { id: 'custom', label: 'Custom' },
  ];

  const handleExportBackup = () => {
    const json = exportBackup();
    downloadFile(json, `huelabstudio-backup-${Date.now()}.json`, 'application/json');
    addToast('Downloaded complete huelabstudio backup JSON', 'success');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackup(content);
      if (!res.success) {
        addToast(res.error || 'Failed to restore backup', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Studio Preferences */}
      <div className="p-4 bg-[#0E1015] border border-[#222632] rounded-xl space-y-4">
        <h3 className="text-xs font-semibold text-[#F1F3F7] flex items-center gap-2">
          <Settings className="w-3.5 h-3.5 text-[#8E95A5]" />
          <span>Studio preferences</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Default palette size */}
          <div>
            <label className="text-xs text-[#8E95A5] block mb-1.5 font-medium">
              Default palette size ({preferences.defaultPaletteSize} tones)
            </label>
            <input
              type="range"
              min={2}
              max={10}
              value={preferences.defaultPaletteSize}
              onChange={(e) => updatePreferences({ defaultPaletteSize: Number(e.target.value) })}
              className="w-full h-1.5 rounded appearance-none cursor-pointer bg-[#222632] accent-[#8E95A5]"
            />
          </div>

          {/* Default harmony */}
          <div>
            <label className="text-xs text-[#8E95A5] block mb-1.5 font-medium">Default harmony algorithm</label>
            <select
              value={preferences.defaultHarmony}
              onChange={(e) => updatePreferences({ defaultHarmony: e.target.value as HarmonyType })}
              className="w-full h-8 px-2.5 bg-[#141720] border border-[#222632] text-[#F1F3F7] text-xs rounded-lg focus:outline-none focus:border-[#3A4154]"
            >
              {harmonies.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-[#222632] grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Keyboard shortcuts toggle */}
          <label className="flex items-center justify-between p-2.5 bg-[#141720] border border-[#222632] rounded-lg cursor-pointer">
            <div className="flex items-center gap-2">
              <Keyboard className="w-3.5 h-3.5 text-[#8E95A5]" />
              <span className="text-xs text-[#F1F3F7] font-medium">Keyboard shortcuts</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.enableKeyboardShortcuts}
              onChange={(e) => updatePreferences({ enableKeyboardShortcuts: e.target.checked })}
              className="w-3.5 h-3.5 rounded accent-[#8E95A5] cursor-pointer"
            />
          </label>

          {/* Reduced motion toggle */}
          <label className="flex items-center justify-between p-2.5 bg-[#141720] border border-[#222632] rounded-lg cursor-pointer">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#8E95A5]" />
              <span className="text-xs text-[#F1F3F7] font-medium">Reduced motion</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.reducedMotion}
              onChange={(e) => updatePreferences({ reducedMotion: e.target.checked })}
              className="w-3.5 h-3.5 rounded accent-[#8E95A5] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Local Data & Backup Management */}
      <div className="p-4 bg-[#0E1015] border border-[#222632] rounded-xl space-y-3.5">
        <h3 className="text-xs font-semibold text-[#F1F3F7] flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local workspace data</span>
        </h3>
        <p className="text-xs text-[#8E95A5] leading-relaxed">
          huelabstudio records your palettes, bookmarks, and parameters deterministically in browser LocalStorage. You can export complete snapshot archives or restore backups.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-1.5 h-8 px-3 bg-[#F1F3F7] hover:bg-white text-[#0B0C10] text-xs font-semibold rounded-lg btn-highlight shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export backup JSON</span>
          </button>

          <label className="flex items-center gap-1.5 h-8 px-3 bg-[#141720] hover:bg-[#1E2330] border border-[#222632] text-[#F1F3F7] text-xs font-medium rounded-lg cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-[#8E95A5]" />
            <span>Restore backup</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 h-8 px-3 bg-[#141720] hover:bg-rose-950/20 border border-[#222632] hover:border-rose-900/40 text-rose-300 text-xs font-medium rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear history</span>
          </button>
        </div>
      </div>
    </div>
  );
};
