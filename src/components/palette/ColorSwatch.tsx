import React, { useState } from 'react';
import { ColorItem } from '../../types';
import { useHueStore } from '../../store/useHueStore';
import { getIdealTextColor } from '../../engine/colorAccessibility';
import { Lock, Unlock, Copy, Sliders, Trash2, Check, ChevronDown } from 'lucide-react';
import { Tooltip } from '../shared/Tooltip';
import { copyToClipboard } from '../../utils/clipboard';

interface ColorSwatchProps {
  color: ColorItem;
  index: number;
  totalColors: number;
  isFocused: boolean;
  onFocus: () => void;
  onOpenEditor: () => void;
}

const AVAILABLE_ROLES: ColorItem['role'][] = [
  'primary',
  'secondary',
  'accent',
  'surface',
  'background',
  'text',
  'muted',
];

export const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  index,
  totalColors,
  isFocused,
  onFocus,
  onOpenEditor,
}) => {
  const { toggleColorLock, removeColor, addToast, updateColorRole } = useHueStore();
  const [copied, setCopied] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const textColor = getIdealTextColor(color.hex);
  const isDarkText = textColor === '#0B0C10';

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await copyToClipboard(color.hex);
    if (ok) {
      setCopied(true);
      addToast(`Copied ${color.hex}`, 'success');
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleToggleLock = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleColorLock(color.id);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeColor(color.id);
  };

  const handleRoleSelect = (e: React.MouseEvent, role: ColorItem['role']) => {
    e.stopPropagation();
    updateColorRole(color.id, role);
    setShowRoleMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onOpenEditor();
    }
  };

  return (
    <div
      onClick={onFocus}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Color swatch for ${color.name}, ${color.hex}, role ${color.role || 'unassigned'}`}
      style={{ backgroundColor: color.hex }}
      className={`relative flex-1 min-h-[340px] sm:min-h-[400px] md:min-h-[440px] lg:min-h-[460px] rounded-xl flex flex-col justify-between p-4 sm:p-5 transition-colors duration-150 group cursor-pointer select-none border focus:outline-none focus-visible:ring-1 focus-visible:ring-white ${
        isFocused
          ? 'border-white/70 ring-1 ring-white/50 ring-offset-2 ring-offset-[#0B0C10] shadow-xl'
          : 'border-black/10 hover:border-black/20'
      }`}
    >
      {/* Top Controls: Semantic Role Pill & Lock Button */}
      <div className="flex items-center justify-between w-full relative z-20">
        {/* Role badge with dropdown menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowRoleMenu(!showRoleMenu);
            }}
            className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md backdrop-blur-md transition-colors ${
              isDarkText
                ? 'bg-black/10 text-black hover:bg-black/20 border border-black/10'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
            }`}
            title="Assign semantic UI token role"
          >
            <span>{color.role ? color.role.charAt(0).toUpperCase() + color.role.slice(1) : `Tone ${index + 1}`}</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>

          {/* Role Menu Popover */}
          {showRoleMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-full mt-1.5 w-32 bg-[#141720] border border-[#262B38] rounded-lg shadow-xl p-1 z-30 flex flex-col gap-0.5"
            >
              {AVAILABLE_ROLES.map((r) => (
                <button
                  key={r}
                  onClick={(e) => handleRoleSelect(e, r)}
                  className={`px-2 py-1 text-[11px] font-mono rounded text-left transition-colors ${
                    color.role === r
                      ? 'bg-[#1F2432] text-[#F1F3F7] font-semibold'
                      : 'text-[#8E95A5] hover:text-[#F1F3F7] hover:bg-[#1C202B]'
                  }`}
                >
                  {r ? r.charAt(0).toUpperCase() + r.slice(1) : ''}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lock toggle button */}
        <Tooltip content={color.locked ? 'Unlock Color' : 'Lock Color'} shortcut="L">
          <button
            onClick={handleToggleLock}
            className={`w-7 h-7 flex items-center justify-center rounded-lg backdrop-blur-md transition-colors ${
              color.locked
                ? isDarkText
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white text-black shadow-sm'
                : isDarkText
                ? 'bg-black/10 hover:bg-black/20 text-black/80'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
            aria-label={color.locked ? 'Unlock color' : 'Lock color'}
          >
            {color.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />}
          </button>
        </Tooltip>
      </div>

      {/* Middle Center: Action Toolbar */}
      <div
        className={`flex items-center justify-center gap-1.5 py-4 transition-opacity duration-150 ${
          isFocused
            ? 'opacity-100'
            : 'opacity-85 sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
        }`}
      >
        <Tooltip content="Edit Channels">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenEditor();
            }}
            className={`w-8 h-8 flex items-center justify-center rounded-lg backdrop-blur-md transition-colors ${
              isDarkText
                ? 'bg-black/15 hover:bg-black/25 text-black'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            aria-label="Open advanced color editor"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <Tooltip content="Copy HEX" shortcut="C">
          <button
            onClick={handleCopy}
            className={`w-8 h-8 flex items-center justify-center rounded-lg backdrop-blur-md transition-colors ${
              isDarkText
                ? 'bg-black/15 hover:bg-black/25 text-black'
                : 'bg-white/15 hover:bg-white/25 text-white'
            }`}
            aria-label="Copy color hex"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </Tooltip>

        {totalColors > 2 && (
          <Tooltip content="Remove Swatch">
            <button
              onClick={handleRemove}
              className={`w-8 h-8 flex items-center justify-center rounded-lg backdrop-blur-md transition-colors ${
                isDarkText
                  ? 'bg-black/15 hover:bg-black/25 text-rose-800'
                : 'bg-white/15 hover:bg-white/25 text-rose-300'
              }`}
              aria-label="Delete color swatch"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        )}
      </div>

      {/* Bottom Information: HEX Code & Technical Title */}
      <div className="w-full">
        <div
          onClick={handleCopy}
          className="flex items-baseline justify-between group/hex cursor-pointer"
        >
          <span
            className={`font-mono text-xl md:text-2xl font-bold tracking-tight tabular-nums transition-opacity ${
              isDarkText ? 'text-black' : 'text-white'
            }`}
          >
            {color.hex}
          </span>
          <span
            className={`text-xs opacity-0 group-hover/hex:opacity-80 transition-opacity font-mono ${
              isDarkText ? 'text-black' : 'text-white'
            }`}
          >
            {copied ? 'Copied' : 'Copy'}
          </span>
        </div>

        <p
          className={`text-xs font-normal truncate mt-0.5 tracking-normal ${
            isDarkText ? 'text-black/80' : 'text-white/80'
          }`}
        >
          {color.name}
        </p>
      </div>
    </div>
  );
};
