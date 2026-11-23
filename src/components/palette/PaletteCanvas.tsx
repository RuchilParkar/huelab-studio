import React, { useState } from 'react';
import { useHueStore } from '../../store/useHueStore';
import { ColorSwatch } from './ColorSwatch';
import { ColorDetailsModal } from './ColorDetailsModal';
import { ColorItem } from '../../types';

export const PaletteCanvas: React.FC = () => {
  const { currentPalette, focusedColorIndex, setFocusedColorIndex, updateColor } = useHueStore();
  const [editingColor, setEditingColor] = useState<ColorItem | null>(null);

  const colors = currentPalette.colors;

  return (
    <div className="w-full">
      {/* Responsive Color Swatches Container */}
      <div className="flex flex-col md:flex-row gap-2 w-full items-stretch overflow-x-auto pb-1 scrollbar-none">
        {colors.map((color, index) => (
          <div
            key={color.id}
            className={`flex-1 ${colors.length >= 7 ? 'md:min-w-[110px] lg:min-w-[124px]' : 'min-w-0'}`}
          >
            <ColorSwatch
              color={color}
              index={index}
              totalColors={colors.length}
              isFocused={focusedColorIndex === index}
              onFocus={() => setFocusedColorIndex(index)}
              onOpenEditor={() => setEditingColor(color)}
            />
          </div>
        ))}
      </div>

      {/* Detailed Color Editor Modal */}
      <ColorDetailsModal
        isOpen={Boolean(editingColor)}
        color={editingColor}
        onClose={() => setEditingColor(null)}
        onSave={(updated) => updateColor(updated.id, updated)}
      />
    </div>
  );
};
