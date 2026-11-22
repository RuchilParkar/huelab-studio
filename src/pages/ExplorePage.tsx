import React, { useState, useMemo } from 'react';
import { CURATED_PALETTES } from '../data/curatedPalettes';
import { useHueStore } from '../store/useHueStore';
import { getColorName } from '../engine/colorNaming';
import { assignColorRoles } from '../engine/paletteGenerator';
import { Palette as PaletteType, ColorItem } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { Search, Heart, ExternalLink, Copy, Check, Filter } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Dark UI',
  'Minimal',
  'Cyberpunk',
  'Nature',
  'Luxury',
  'Pastel',
  'Vintage',
  'Modern',
  'Monochrome',
  'Warm',
  'Cool',
] as const;

export const ExplorePage: React.FC = () => {
  const { setPalette, setActivePage, addToast, favorites, toggleFavorite } = useHueStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPalettes = useMemo(() => {
    return CURATED_PALETTES.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.colors.some((c) => c.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleOpenInStudio = (curated: (typeof CURATED_PALETTES)[0]) => {
    const rawColors: ColorItem[] = curated.colors.map((hex, idx) => ({
      id: `curated-${curated.id}-${idx}`,
      hex,
      name: getColorName(hex),
      locked: false,
    }));

    const roleAssigned = assignColorRoles(rawColors);

    const pal: PaletteType = {
      id: `explore-${curated.id}-${Date.now()}`,
      name: curated.name,
      colors: roleAssigned,
      harmony: 'custom',
      createdAt: Date.now(),
      tags: curated.tags,
    };

    setPalette(pal);
    setActivePage('generator');
    addToast(`Opened "${curated.name}" in studio with semantic roles`, 'success');
  };

  const handleCopyPalette = async (curated: (typeof CURATED_PALETTES)[0]) => {
    const ok = await copyToClipboard(curated.colors.join(', '));
    if (ok) {
      setCopiedId(curated.id);
      addToast(`Copied colors for ${curated.name}`, 'success');
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-[#111319] border border-[#272B36] rounded-2xl">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#626A78] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search palettes by name, tag, or mood..."
            className="w-full pl-10 pr-4 py-2 bg-[#171A22] border border-[#272B36] rounded-xl text-xs text-[#F4F5F7] placeholder-[#626A78] focus:outline-none focus:border-[#7C5CFC] transition-colors"
          />
        </div>

        <div className="text-xs text-[#9298A6] self-center">
          Showing <span className="text-[#F4F5F7] font-semibold">{filteredPalettes.length}</span> curated palettes
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#7C5CFC] text-white shadow-md'
                  : 'bg-[#111319] hover:bg-[#171A22] border border-[#272B36] text-[#9298A6] hover:text-[#F4F5F7]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Palettes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPalettes.map((pal) => (
          <div
            key={pal.id}
            className="p-4 bg-[#111319] border border-[#272B36] rounded-2xl flex flex-col justify-between hover:border-[#7C5CFC]/50 transition-all duration-200 group hover:shadow-xl"
          >
            {/* Color preview strip */}
            <div className="flex h-20 w-full rounded-xl overflow-hidden border border-[#272B36] mb-4">
              {pal.colors.map((hex, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: hex }}
                  className="flex-1 h-full hover:scale-105 transition-transform cursor-pointer relative group/swatch"
                  title={`${hex} - ${getColorName(hex)}`}
                  onClick={async () => {
                    const ok = await copyToClipboard(hex);
                    if (ok) addToast(`Copied ${hex}`, 'success');
                  }}
                />
              ))}
            </div>

            {/* Info and Tags */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-semibold text-[#F4F5F7] group-hover:text-[#A78BFA] transition-colors">
                  {pal.name}
                </h4>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#171A22] border border-[#272B36] text-[#9298A6]">
                  {pal.category}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
                {pal.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] text-[#626A78] hover:text-[#9298A6] transition-colors"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#272B36] mt-auto">
              <button
                onClick={() => handleCopyPalette(pal)}
                className="flex items-center gap-1.5 text-xs text-[#9298A6] hover:text-[#F4F5F7] transition-colors"
              >
                {copiedId === pal.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedId === pal.id ? 'Copied' : 'Copy Codes'}</span>
              </button>

              <button
                onClick={() => handleOpenInStudio(pal)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A22] hover:bg-[#7C5CFC] hover:text-white border border-[#272B36] hover:border-[#7C5CFC] text-[#F4F5F7] text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
              >
                <span>Open in Studio</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
