import React, { useState } from 'react';
import { useHueStore } from '../store/useHueStore';
import { Palette, ColorItem } from '../types';
import {
  Heart,
  ExternalLink,
  Copy,
  Trash2,
  Edit2,
  Check,
  Search,
} from 'lucide-react';
import { EmptyState } from '../components/shared/EmptyState';
import { copyToClipboard } from '../utils/clipboard';

export const FavoritesPage: React.FC = () => {
  const {
    favorites,
    setPalette,
    setActivePage,
    removeFavorite,
    renamePalette,
    addToast,
  } = useHueStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredFavorites = favorites.filter((f: Palette) =>
    (f.name || 'Untitled Palette').toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleOpenInStudio = (palette: Palette) => {
    setPalette(palette);
    setActivePage('generator');
  };

  const handleStartRename = (palette: Palette) => {
    setEditingId(palette.id);
    setEditName(palette.name || 'Untitled Palette');
  };

  const handleSaveRename = (paletteId: string) => {
    renamePalette(paletteId, editName);
    setEditingId(null);
  };

  const handleCopyCodes = async (palette: Palette) => {
    const text = palette.colors.map((c: ColorItem) => c.hex).join(', ');
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedId(palette.id);
      addToast(`Copied colors for ${palette.name}`, 'success');
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[#0E1015] border border-[#222632] rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved palettes..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#141720] border border-[#222632] rounded-lg text-xs text-[#F1F3F7] placeholder-[#64748B] focus:outline-none focus:border-[#3A4154] transition-colors"
          />
        </div>

        <div className="text-xs text-[#8E95A5] self-center">
          <span className="font-semibold text-[#F1F3F7] tabular-nums">{filteredFavorites.length}</span> saved palettes
        </div>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites saved yet"
          description="Click the heart icon in the Palette Studio or Explore library to bookmark palettes for your projects."
          actionLabel="Explore Curated Palettes"
          onAction={() => setActivePage('explore')}
        />
      ) : filteredFavorites.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No matching saved palettes"
          description="None of your bookmarked palettes match your search query."
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredFavorites.map((pal: Palette) => (
            <div
              key={pal.id}
              className="p-3.5 bg-[#0E1015] border border-[#222632] rounded-xl flex flex-col justify-between hover:border-[#2D3344] transition-colors group"
            >
              {/* Color Preview */}
              <div className="flex h-16 w-full rounded-lg overflow-hidden border border-[#222632] mb-3">
                {pal.colors.map((c: ColorItem) => (
                  <div
                    key={c.id}
                    style={{ backgroundColor: c.hex }}
                    className="flex-1 h-full cursor-pointer relative"
                    title={`${c.hex} - ${c.name}`}
                    onClick={async () => {
                      const ok = await copyToClipboard(c.hex);
                      if (ok) addToast(`Copied ${c.hex}`, 'success');
                    }}
                  />
                ))}
              </div>

              {/* Title & Rename */}
              <div>
                {editingId === pal.id ? (
                  <div className="flex items-center gap-1.5 mb-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2.5 py-1 bg-[#141720] border border-[#3A4154] rounded-lg text-xs text-[#F1F3F7] focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveRename(pal.id)}
                      className="p-1 bg-[#F1F3F7] text-[#0B0C10] rounded-md"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-semibold text-[#F1F3F7] truncate">{pal.name}</h4>
                    <button
                      onClick={() => handleStartRename(pal)}
                      className="text-[#64748B] hover:text-[#9CA3AF] p-1 transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-[#64748B] font-mono">
                  {pal.harmony.toUpperCase()} • {pal.colors.length} TONES
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2.5 border-t border-[#222632] mt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCodes(pal)}
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
                    onClick={() => removeFavorite(pal.id)}
                    className="p-1 text-[#64748B] hover:text-rose-400 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

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
