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
    downloadFile(json, `huelab-backup-${Date.now()}.json`, 'application/json');
    addToast('Downloaded complete HueLab backup JSON', 'success');
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Studio Preferences */}
      <div className="p-6 bg-[#111319] border border-[#272B36] rounded-2xl space-y-6">
        <h3 className="text-sm font-semibold text-[#F4F5F7] flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#A78BFA]" />
          <span>Generator Defaults & Preferences</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Default palette size */}
          <div>
            <label className="text-xs text-[#9298A6] block mb-2 font-medium">
              Default Palette Size ({preferences.defaultPaletteSize} colors)
            </label>
            <input
              type="range"
              min={2}
              max={10}
              value={preferences.defaultPaletteSize}
              onChange={(e) => updatePreferences({ defaultPaletteSize: Number(e.target.value) })}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#272B36] accent-[#A78BFA]"
            />
          </div>

          {/* Default harmony */}
          <div>
            <label className="text-xs text-[#9298A6] block mb-2 font-medium">Default Harmony Mode</label>
            <select
              value={preferences.defaultHarmony}
              onChange={(e) => updatePreferences({ defaultHarmony: e.target.value as HarmonyType })}
              className="w-full px-3 py-2 bg-[#171A22] border border-[#272B36] text-[#F4F5F7] text-xs rounded-xl focus:outline-none focus:border-[#7C5CFC]"
            >
              {harmonies.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-2 border-t border-[#272B36] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Keyboard shortcuts toggle */}
          <label className="flex items-center justify-between p-3 bg-[#171A22] border border-[#272B36] rounded-xl cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Keyboard className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-xs text-[#F4F5F7] font-medium">Enable Keyboard Shortcuts</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.enableKeyboardShortcuts}
              onChange={(e) => updatePreferences({ enableKeyboardShortcuts: e.target.checked })}
              className="w-4 h-4 rounded accent-[#7C5CFC] cursor-pointer"
            />
          </label>

          {/* Reduced motion toggle */}
          <label className="flex items-center justify-between p-3 bg-[#171A22] border border-[#272B36] rounded-xl cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-xs text-[#F4F5F7] font-medium">Reduced Motion</span>
            </div>
            <input
              type="checkbox"
              checked={preferences.reducedMotion}
              onChange={(e) => updatePreferences({ reducedMotion: e.target.checked })}
              className="w-4 h-4 rounded accent-[#7C5CFC] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Local Data & Backup Management */}
      <div className="p-6 bg-[#111319] border border-[#272B36] rounded-2xl space-y-5">
        <h3 className="text-sm font-semibold text-[#F4F5F7] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Local Workspace Data & Backups</span>
        </h3>
        <p className="text-xs text-[#9298A6] leading-relaxed">
          HueLab stores all your color systems and favorites locally in your browser. You can export a full JSON backup or restore past data at any time.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2 bg-[#7C5CFC] hover:bg-[#6D28D9] text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Full Backup JSON</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-[#171A22] hover:bg-[#272B36] border border-[#272B36] text-[#F4F5F7] text-xs font-semibold rounded-xl cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-[#A78BFA]" />
            <span>Restore Backup JSON</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-[#171A22] hover:bg-rose-950/40 border border-[#272B36] hover:border-rose-800 text-rose-300 text-xs font-semibold rounded-xl transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      </div>
    </div>
  );
};
