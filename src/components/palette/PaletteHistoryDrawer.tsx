import React from 'react';
import { Modal } from '../shared/Modal';
import { useHueStore } from '../../store/useHueStore';
import { Palette as PaletteType } from '../../types';
import { Trash2, Check, Clock } from 'lucide-react';

interface PaletteHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaletteHistoryDrawer: React.FC<PaletteHistoryDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { history, setPalette, clearHistory, deleteFromHistory, currentPalette } = useHueStore();

  const handleSelect = (pal: PaletteType) => {
    setPalette(pal);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recent Palettes"
      description="View and restore previously generated color combinations."
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-4">
        {history.length > 0 && (
          <div className="flex justify-end">
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}

        {history.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#626A78]">
            No previous palettes in history. Generate some palettes to see them recorded here.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
            {history.map((pal) => {
              const isCurrent = pal.id === currentPalette.id;
              return (
                <div
                  key={pal.id}
                  onClick={() => handleSelect(pal)}
                  className={`flex items-center justify-between p-3 bg-[#171A22] border rounded-xl cursor-pointer transition-all hover:border-[#7C5CFC] ${
                    isCurrent ? 'border-[#7C5CFC] ring-1 ring-[#7C5CFC]' : 'border-[#272B36]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Swatches preview */}
                    <div className="flex h-8 w-24 sm:w-32 rounded-lg overflow-hidden border border-[#272B36] shrink-0">
                      {pal.colors.map((c) => (
                        <div key={c.id} style={{ backgroundColor: c.hex }} className="flex-1 h-full" />
                      ))}
                    </div>

                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-[#F4F5F7] truncate">{pal.name}</h4>
                      <p className="text-[10px] text-[#626A78] font-mono mt-0.5">
                        {pal.harmony.toUpperCase()} • {pal.colors.length} COLORS
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFromHistory(pal.id);
                      }}
                      className="p-1.5 text-[#626A78] hover:text-rose-400 rounded-lg transition-colors"
                      title="Delete from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};
