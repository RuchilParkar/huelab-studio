import React from 'react';
import { useHueStore } from '../../store/useHueStore';
import { PageView } from '../../types';
import {
  Sparkles,
  Download,
  Shuffle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

interface TopbarProps {
  onOpenExport: () => void;
  onOpenAi: () => void;
}

const PAGE_METADATA: Record<PageView, { title: string; subtitle: string }> = {
  generator: {
    title: 'Color Palette Studio',
    subtitle: 'Generate harmonic color systems with lock, edit & preview',
  },
  explore: {
    title: 'Curated Palette Library',
    subtitle: 'Hand-crafted color collections categorized by visual theme',
  },
  'image-extractor': {
    title: 'Image Color Extractor',
    subtitle: 'Extract dominant color palettes using local clustering algorithms',
  },
  gradient: {
    title: 'Gradient Studio',
    subtitle: 'Craft CSS linear and radial gradients with customizable stops',
  },
  contrast: {
    title: 'Accessibility & Contrast Checker',
    subtitle: 'Evaluate WCAG 2.2 contrast compliance for accessible UI design',
  },
  'color-converter': {
    title: 'Color Format Converter',
    subtitle: 'Live mathematical conversions between HEX, RGB, HSL, HSV & OKLCH',
  },
  favorites: {
    title: 'Saved Palettes',
    subtitle: 'Your personal collection of saved harmonies and tokens',
  },
  settings: {
    title: 'Studio Settings',
    subtitle: 'Manage local data backups, harmony defaults and export preferences',
  },
};

export const Topbar: React.FC<TopbarProps> = ({ onOpenExport, onOpenAi }) => {
  const { activePage, generateNewPalette, currentPalette } = useHueStore();
  const pageMeta = PAGE_METADATA[activePage];

  return (
    <header className="h-16 px-6 bg-[#111319]/80 backdrop-blur-md border-b border-[#272B36] flex items-center justify-between sticky top-0 z-30">
      {/* Title & Description */}
      <div>
        <h2 className="text-sm font-semibold text-[#F4F5F7] tracking-tight flex items-center gap-2">
          {pageMeta.title}
          {activePage === 'generator' && (
            <span className="text-xs font-normal text-[#9298A6] px-2 py-0.5 rounded-full bg-[#171A22] border border-[#272B36]">
              {currentPalette.colors.length} Colors • {currentPalette.harmony}
            </span>
          )}
        </h2>
        <p className="text-xs text-[#626A78] hidden sm:block">{pageMeta.subtitle}</p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5">
        {activePage === 'generator' && (
          <button
            onClick={() => generateNewPalette()}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#171A22] hover:bg-[#272B36] border border-[#272B36] text-[#F4F5F7] text-xs font-medium rounded-xl transition-all active:scale-95 shadow-sm"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span className="hidden sm:inline">Regenerate</span>
            <span className="kbd-badge hidden sm:inline ml-0.5">Space</span>
          </button>
        )}

        <button
          onClick={onOpenAi}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#171A22] hover:bg-[#272B36] border border-[#272B36] text-[#A78BFA] hover:text-white text-xs font-medium rounded-xl transition-all active:scale-95"
          title="AI Palette Generator"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
          <span className="hidden sm:inline">AI Studio</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-[#7C5CFC] hover:bg-[#6D28D9] text-white text-xs font-medium rounded-xl transition-all active:scale-95 shadow-md shadow-[#7C5CFC]/20"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
          <span className="kbd-badge hidden sm:inline bg-[#6D28D9] border-white/20 text-white ml-0.5">E</span>
        </button>
      </div>
    </header>
  );
};
