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
  Sparkles,
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
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111319] border border-[#272B36] rounded-2xl shadow-sm">
      {/* Left: Mode Toggle & Harmony Selector */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Mode Toggle: UI Hierarchy vs Pure Harmony */}
        <div className="flex items-center p-0.5 bg-[#171A22] border border-[#272B36] rounded-xl">
          <button
            onClick={() => {
              setGenerationMode('ui-system');
              generateNewPalette({ mode: 'ui-system' });
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              generationMode === 'ui-system'
                ? 'bg-[#7C5CFC] text-white shadow-sm'
                : 'text-[#9298A6] hover:text-[#F4F5F7]'
            }`}
            title="Practical UI Design System with Background, Surface, Primary, Text & Accent hierarchy"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">UI System</span>
          </button>
          <button
            onClick={() => {
              setGenerationMode('pure-harmony');
              generateNewPalette({ mode: 'pure-harmony' });
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              generationMode === 'pure-harmony'
                ? 'bg-[#7C5CFC] text-white shadow-sm'
                : 'text-[#9298A6] hover:text-[#F4F5F7]'
            }`}
            title="Traditional color wheel harmonies (Analogous, Triadic, Monochromatic)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pure Harmony</span>
          </button>
        </div>

        {/* Harmony Dropdown */}
        <select
          value={currentPalette.harmony}
          onChange={(e) => setHarmony(e.target.value as HarmonyType)}
          className="px-3 py-1.5 bg-[#171A22] border border-[#272B36] text-[#F4F5F7] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7C5CFC] cursor-pointer"
        >
          {harmonies.map((h) => (
            <option key={h.id} value={h.id}>
              {h.label}
            </option>
          ))}
        </select>
      </div>

      {/* Center: Color count adjusters */}
      <div className="flex items-center gap-1.5 p-1 bg-[#171A22] border border-[#272B36] rounded-xl">
        <Tooltip content="Remove Color">
          <button
            onClick={() => {
              if (colorCount > 2) {
                removeColor(currentPalette.colors[currentPalette.colors.length - 1].id);
              }
            }}
            disabled={colorCount <= 2}
            className="p-1.5 rounded-lg text-[#9298A6] hover:text-[#F4F5F7] disabled:opacity-30 disabled:hover:text-[#9298A6] transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <span className="text-xs font-mono font-semibold text-[#F4F5F7] px-2">
          {colorCount} <span className="text-[10px] text-[#626A78] font-normal">colors</span>
        </span>

        <Tooltip content="Add Color (Up to 10)">
          <button
            onClick={() => addColor()}
            disabled={colorCount >= 10}
            className="p-1.5 rounded-lg text-[#9298A6] hover:text-[#F4F5F7] disabled:opacity-30 disabled:hover:text-[#9298A6] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>

      {/* Right: Balance Contrast, Favorite, History & Primary Generate */}
      <div className="flex items-center gap-2">
        {/* Contrast Auto-balancer button */}
        <Tooltip content="Auto-Balance WCAG AA/AAA Contrast">
          <button
            onClick={balancePalette}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A22] hover:bg-[#272B36] border border-[#272B36] text-[#A78BFA] hover:text-white rounded-xl text-xs font-semibold transition-all active:scale-95"
          >
            <Scale className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span className="hidden md:inline">Balance Contrast</span>
          </button>
        </Tooltip>

        <Tooltip content={isFavorite ? 'Remove from favorites' : 'Save palette to favorites'}>
          <button
            onClick={() => toggleFavorite()}
            className={`p-2 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-[#171A22] border-[#272B36] text-[#9298A6] hover:text-[#F4F5F7]'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </Tooltip>

        <Tooltip content="Palette History">
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl bg-[#171A22] border border-[#272B36] text-[#9298A6] hover:text-[#F4F5F7] transition-all"
          >
            <History className="w-4 h-4" />
          </button>
        </Tooltip>

        {/* Big Generate Button */}
        <button
          onClick={() => generateNewPalette()}
          className="flex items-center gap-2 px-4 py-2 bg-[#7C5CFC] hover:bg-[#6D28D9] text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-[#7C5CFC]/20 active:scale-95"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Generate</span>
          <span className="kbd-badge bg-[#6D28D9] border-white/20 text-white ml-0.5">Space</span>
        </button>
      </div>
    </div>
  );
};
