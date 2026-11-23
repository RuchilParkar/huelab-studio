import React, { useState, useMemo } from 'react';
import { CURATED_PALETTES } from '../data/curatedPalettes';
import { useHueStore } from '../store/useHueStore';
import { getColorName } from '../engine/colorNaming';
import { assignColorRoles } from '../engine/paletteGenerator';
import { Palette as PaletteType, ColorItem } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { Search, Heart, ExternalLink, Copy, Check, Filter } from 'lucide-react';
import { EmptyState } from '../components/shared/EmptyState';

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
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#0E1015] border border-[#222632] rounded-xl">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, tag, or hex..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#141720] border border-[#222632] rounded-lg text-xs text-[#F1F3F7] placeholder-[#64748B] focus:outline-none focus:border-[#3A4154] transition-colors"
          />
        </div>

        <div className="text-xs text-[#8E95A5] self-center">
          Showing <span className="text-[#F1F3F7] font-semibold tabular-nums">{filteredPalettes.length}</span> curated palettes
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`h-7 px-3 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#1F2432] text-[#F1F3F7] border border-[#2D3445] shadow-sm'
                  : 'bg-[#0E1015] hover:bg-[#141720] border border-[#222632] text-[#8E95A5] hover:text-[#F1F3F7]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Palettes Grid */}
      {filteredPalettes.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching palettes found"
          description="No palettes matched your search query or selected category filter. Try clearing the search or choosing another category."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPalettes.map((pal) => (
            <div
              key={pal.id}
              className="p-3.5 bg-[#0E1015] border border-[#222632] rounded-xl flex flex-col justify-between hover:border-[#2D3344] transition-colors group"
            >
              {/* Color preview strip */}
              <div className="flex h-16 w-full rounded-lg overflow-hidden border border-[#222632] mb-3">
                {pal.colors.map((hex, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: hex }}
                    className="flex-1 h-full cursor-pointer relative"
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
                  <h4 className="text-xs font-semibold text-[#F1F3F7]">
                    {pal.name}
                  </h4>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#141720] border border-[#222632] text-[#8E95A5]">
                    {pal.category}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-1.5 mb-3">
                  {pal.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] text-[#64748B] font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2.5 border-t border-[#222632] mt-auto">
                <button
                  onClick={() => handleCopyPalette(pal)}
                  className="flex items-center gap-1.5 text-xs text-[#8E95A5] hover:text-[#F1F3F7] transition-colors"
                >
                  {copiedId === pal.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === pal.id ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => handleOpenInStudio(pal)}
                  className="flex items-center gap-1.5 h-7 px-2.5 bg-[#141720] hover:bg-[#1E2330] border border-[#222632] hover:border-[#2E3547] text-[#F1F3F7] text-xs font-medium rounded-lg transition-colors"
                >
                  <span>Open in Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
