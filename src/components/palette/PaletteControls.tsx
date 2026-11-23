import React from 'react';
import { useHueStore } from '../../store/useHueStore';
import { HarmonyType } from '../../types';
import {
  Shuffle,
  Plus,
  Minus,
  Heart,
  History,
  Scale,
  Disc3,
  Layers,
} from 'lucide-react';
import { Tooltip } from '../shared/Tooltip';

interface PaletteControlsProps {
  onOpenHistory: () => void;
}

export const PaletteControls: React.FC<PaletteControlsProps> = ({ onOpenHistory }) => {
  const {
    currentPalette,
    generateNewPalette,
    setHarmony,
    addColor,
    removeColor,
    toggleFavorite,
    favorites,
    generationMode,
    setGenerationMode,
    balancePalette,
  } = useHueStore();

  const isFavorite = favorites.some((f) => f.id === currentPalette.id);
  const colorCount = currentPalette.colors.length;

  const harmonies: { id: HarmonyType; label: string }[] = [
    { id: 'analogous', label: 'Analogous' },
    { id: 'monochromatic', label: 'Monochromatic' },
    { id: 'complementary', label: 'Complementary' },
    { id: 'split-complementary', label: 'Split Comp' },
    { id: 'triadic', label: 'Triadic' },
    { id: 'tetradic', label: 'Tetradic' },
    { id: 'square', label: 'Square' },
    { id: 'custom', label: 'Custom' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:p-2.5 bg-[#0E1015] border border-[#222632] rounded-xl shadow-sm">
      {/* Left: Mode Toggle & Harmony Selector */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {/* Mode Toggle: UI Hierarchy vs Pure Harmony */}
        <div className="flex items-center p-0.5 bg-[#141720] border border-[#222632] rounded-lg">
          <button
            onClick={() => {
              setGenerationMode('ui-system');
              generateNewPalette({ mode: 'ui-system' });
            }}
            className={`flex items-center gap-1.5 h-7 px-2 sm:px-2.5 rounded-md text-xs font-medium transition-colors ${
              generationMode === 'ui-system'
                ? 'bg-[#1F2432] text-[#F1F3F7] border border-[#2D3344] shadow-sm'
                : 'text-[#8E95A5] hover:text-[#F1F3F7]'
            }`}
            title="Calibrated UI roles: background, surface, text, primary and accent"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">UI System</span>
          </button>
          <button
            onClick={() => {
              setGenerationMode('pure-harmony');
              generateNewPalette({ mode: 'pure-harmony' });
            }}
            className={`flex items-center gap-1.5 h-7 px-2 sm:px-2.5 rounded-md text-xs font-medium transition-colors ${
              generationMode === 'pure-harmony'
                ? 'bg-[#1F2432] text-[#F1F3F7] border border-[#2D3344] shadow-sm'
                : 'text-[#8E95A5] hover:text-[#F1F3F7]'
            }`}
            title="Chromatic harmonies: Analogous, Triadic, Monochromatic"
          >
            <Disc3 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Pure Harmony</span>
          </button>
        </div>

        {/* Harmony Dropdown */}
        <select
          value={currentPalette.harmony}
          onChange={(e) => setHarmony(e.target.value as HarmonyType)}
          className="h-8 px-2 sm:px-2.5 bg-[#141720] border border-[#222632] text-[#F1F3F7] text-xs font-medium rounded-lg focus:outline-none focus:border-[#3A4154] cursor-pointer"
        >
          {harmonies.map((h) => (
            <option key={h.id} value={h.id}>
              {h.label}
            </option>
          ))}
        </select>
      </div>

      {/* Center: Color count adjusters */}
      <div className="flex items-center gap-1 h-8 px-1 bg-[#141720] border border-[#222632] rounded-lg">
        <Tooltip content="Remove Swatch">
          <button
            onClick={() => {
              if (colorCount > 2) {
                removeColor(currentPalette.colors[currentPalette.colors.length - 1].id);
              }
            }}
            disabled={colorCount <= 2}
            className="w-6 h-6 flex items-center justify-center rounded text-[#8E95A5] hover:text-[#F1F3F7] disabled:opacity-30 disabled:hover:text-[#8E95A5] transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <span className="text-xs font-mono font-medium text-[#F1F3F7] px-1.5 sm:px-2 tabular-nums">
          {colorCount} <span className="text-[10px] text-[#64748B]">tones</span>
        </span>

        <Tooltip content="Add Swatch (Up to 10)">
          <button
            onClick={() => addColor()}
            disabled={colorCount >= 10}
            className="w-6 h-6 flex items-center justify-center rounded text-[#8E95A5] hover:text-[#F1F3F7] disabled:opacity-30 disabled:hover:text-[#8E95A5] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>

      {/* Right: Balance Contrast, Favorite, History & Primary Generate */}
      <div className="flex items-center gap-1.5">
        <Tooltip content="Auto-balance WCAG AA/AAA lightness distribution">
          <button
            onClick={balancePalette}
            className="flex items-center gap-1.5 h-8 px-2 sm:px-2.5 bg-[#141720] hover:bg-[#1C202B] border border-[#222632] text-[#8E95A5] hover:text-[#F1F3F7] rounded-lg text-xs font-medium transition-colors"
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Balance</span>
          </button>
        </Tooltip>

        <Tooltip content={isFavorite ? 'Remove from favorites' : 'Bookmark palette'}>
          <button
            onClick={() => toggleFavorite()}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${
              isFavorite
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-[#141720] border-[#222632] text-[#8E95A5] hover:text-[#F1F3F7]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </Tooltip>

        <Tooltip content="Palette History">
          <button
            onClick={onOpenHistory}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#141720] border border-[#222632] text-[#8E95A5] hover:text-[#F1F3F7] transition-colors"
          >
            <History className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        {/* Studio Primary Generate Button */}
        <button
          onClick={() => generateNewPalette()}
          className="flex items-center gap-1.5 h-8 px-3 bg-[#F1F3F7] hover:bg-white text-[#0B0C10] text-xs font-semibold rounded-lg transition-colors btn-highlight shadow-sm"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Generate</span>
          <span className="kbd-badge bg-[#E1E4EB] border-transparent text-[#0B0C10] ml-0.5 hidden sm:inline">Space</span>
        </button>
      </div>
    </div>
  );
};
