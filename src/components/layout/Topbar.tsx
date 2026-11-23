import React from 'react';
import { useHueStore } from '../../store/useHueStore';
import { PageView } from '../../types';
import {
  Wand2,
  Download,
  Shuffle,
} from 'lucide-react';

interface TopbarProps {
  onOpenExport: () => void;
  onOpenAi: () => void;
}

const PAGE_METADATA: Record<PageView, { title: string; subtitle: string }> = {
  generator: {
    title: 'Palette Studio',
    subtitle: 'Generate and calibrate harmonic color systems for digital interfaces',
  },
  explore: {
    title: 'Curated Palettes',
    subtitle: 'Harmonic color libraries categorized by aesthetic design domain',
  },
  'image-extractor': {
    title: 'Image Extractor',
    subtitle: 'Extract dominant color palettes via spatial RGB k-means clustering',
  },
  gradient: {
    title: 'Gradient Studio',
    subtitle: 'Synthesize CSS linear and radial gradients with precision stops',
  },
  contrast: {
    title: 'Contrast Matrix',
    subtitle: 'Evaluate WCAG 2.2 contrast compliance and APCA readability targets',
  },
  'color-converter': {
    title: 'Color Converter',
    subtitle: 'Deterministic conversions across HEX, sRGB, HSL, HSV, and OKLCH',
  },
  favorites: {
    title: 'Saved Palettes',
    subtitle: 'Workspace collection of saved harmonies and export tokens',
  },
  settings: {
    title: 'Studio Settings',
    subtitle: 'Data persistence, workspace defaults, and token export formats',
  },
};

export const Topbar: React.FC<TopbarProps> = ({ onOpenExport, onOpenAi }) => {
  const { activePage, generateNewPalette, currentPalette } = useHueStore();
  const pageMeta = PAGE_METADATA[activePage];

  return (
    <header className="h-14 px-6 bg-[#0E1015]/90 backdrop-blur-md border-b border-[#222632] flex items-center justify-between sticky top-0 z-30">
      {/* Title & Metadata */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-semibold text-[#F1F3F7] tracking-tight">
              {pageMeta.title}
            </h2>
            {activePage === 'generator' && (
              <span className="text-[11px] font-mono text-[#8E95A5] px-1.5 py-0.5 rounded bg-[#181B24] border border-[#262B38]">
                {currentPalette.colors.length} hues • {currentPalette.harmony}
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#64748B] hidden sm:block">
            {pageMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {activePage === 'generator' && (
          <button
            onClick={() => generateNewPalette()}
            className="flex items-center gap-1.5 h-8 px-2.5 bg-[#171A23] hover:bg-[#202532] border border-[#282D3B] text-[#F1F3F7] text-xs font-medium rounded-lg transition-colors shadow-sm"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span className="hidden sm:inline">Regenerate</span>
            <span className="kbd-badge hidden sm:inline ml-1">Space</span>
          </button>
        )}

        <button
          onClick={onOpenAi}
          className="flex items-center gap-1.5 h-8 px-2.5 bg-[#171A23] hover:bg-[#202532] border border-[#282D3B] text-[#9CA3AF] hover:text-[#F1F3F7] text-xs font-medium rounded-lg transition-colors"
          title="AI Palette Generator"
        >
          <Wand2 className="w-3.5 h-3.5 text-[#8E95A5]" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 h-8 px-3 bg-[#F1F3F7] hover:bg-white text-[#0B0C10] text-xs font-medium rounded-lg transition-colors btn-highlight shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
          <span className="kbd-badge bg-[#E1E4EB] border-transparent text-[#0B0C10] ml-1">E</span>
        </button>
      </div>
    </header>
  );
};
