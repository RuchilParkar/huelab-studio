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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-[#111319] border border-[#272B36] rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#626A78] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved palettes..."
            className="w-full pl-10 pr-4 py-2 bg-[#171A22] border border-[#272B36] rounded-xl text-xs text-[#F4F5F7] placeholder-[#626A78] focus:outline-none focus:border-[#7C5CFC]"
          />
        </div>

        <div className="text-xs text-[#9298A6] self-center">
          <span className="font-semibold text-[#F4F5F7]">{filteredFavorites.length}</span> saved palettes
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFavorites.map((pal: Palette) => (
            <div
              key={pal.id}
              className="p-4 bg-[#111319] border border-[#272B36] rounded-2xl flex flex-col justify-between hover:border-[#7C5CFC]/50 transition-all group"
            >
              {/* Color Preview */}
              <div className="flex h-20 w-full rounded-xl overflow-hidden border border-[#272B36] mb-4">
                {pal.colors.map((c: ColorItem) => (
                  <div
                    key={c.id}
                    style={{ backgroundColor: c.hex }}
                    className="flex-1 h-full cursor-pointer hover:scale-105 transition-transform"
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
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2.5 py-1 bg-[#171A22] border border-[#7C5CFC] rounded-lg text-xs text-[#F4F5F7]"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveRename(pal.id)}
                      className="p-1 bg-[#7C5CFC] text-white rounded-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-[#F4F5F7] truncate">{pal.name}</h4>
                    <button
                      onClick={() => handleStartRename(pal)}
                      className="text-[#626A78] hover:text-[#9298A6] p-1 transition-colors"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-[#626A78] font-mono">
                  {pal.harmony.toUpperCase()} • {pal.colors.length} COLORS
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#272B36] mt-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCodes(pal)}
                    className="flex items-center gap-1.5 text-xs text-[#9298A6] hover:text-[#F4F5F7] transition-colors"
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
                    className="p-1 text-[#626A78] hover:text-rose-400 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleOpenInStudio(pal)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A22] hover:bg-[#7C5CFC] hover:text-white border border-[#272B36] hover:border-[#7C5CFC] text-[#F4F5F7] text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95"
                >
                  <span>Open</span>
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
