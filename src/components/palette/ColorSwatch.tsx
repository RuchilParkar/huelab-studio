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
      className={`relative flex-1 min-h-[340px] sm:min-h-[400px] md:min-h-[440px] lg:min-h-[460px] rounded-2xl flex flex-col justify-between p-4 sm:p-5 transition-all duration-300 group cursor-pointer select-none border focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
        isFocused
          ? 'border-white/80 ring-2 ring-[#7C5CFC]/80 shadow-2xl scale-[1.01]'
          : 'border-black/10 hover:shadow-xl'
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
            className={`flex items-center gap-1 text-[10px] font-mono uppercase px-2.5 py-1 rounded-full backdrop-blur-md transition-all ${
              isDarkText
                ? 'bg-black/15 text-black hover:bg-black/25 border border-black/15'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            }`}
            title="Click to assign semantic design role"
          >
            <span>{color.role || `Tone ${index + 1}`}</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-70" />
          </button>

          {/* Quick Role Menu Popover */}
          {showRoleMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-full mt-1.5 w-32 bg-[#171A22] border border-[#272B36] rounded-xl shadow-2xl p-1 z-30 animate-scale-in flex flex-col gap-0.5"
            >
              {AVAILABLE_ROLES.map((r) => (
                <button
                  key={r}
                  onClick={(e) => handleRoleSelect(e, r)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-lg text-left transition-colors uppercase font-mono ${
                    color.role === r
                      ? 'bg-[#7C5CFC] text-white'
                      : 'text-[#9298A6] hover:text-[#F4F5F7] hover:bg-[#272B36]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lock toggle button */}
        <Tooltip content={color.locked ? 'Unlock Color' : 'Lock Color'} shortcut="L">
          <button
            onClick={handleToggleLock}
            className={`p-2 rounded-xl backdrop-blur-md transition-all ${
              color.locked
                ? isDarkText
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white text-black shadow-md'
                : isDarkText
                ? 'bg-black/10 hover:bg-black/20 text-black/80'
                : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
            aria-label={color.locked ? 'Unlock color' : 'Lock color'}
          >
            {color.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4 opacity-70 group-hover:opacity-100" />}
          </button>
        </Tooltip>
      </div>

      {/* Middle Center: Action Toolbar (Visible on hover, focus, or mobile touch) */}
      <div
        className={`flex items-center justify-center gap-2 py-4 transition-all duration-200 ${
          isFocused
            ? 'opacity-100'
            : 'opacity-85 sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
        }`}
      >
        <Tooltip content="Edit Color Details">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenEditor();
            }}
            className={`p-2.5 rounded-xl backdrop-blur-md transition-transform hover:scale-110 shadow-lg ${
              isDarkText
                ? 'bg-black/20 hover:bg-black/30 text-black'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            aria-label="Open advanced color editor"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip content="Copy HEX Code" shortcut="C">
          <button
            onClick={handleCopy}
            className={`p-2.5 rounded-xl backdrop-blur-md transition-transform hover:scale-110 shadow-lg ${
              isDarkText
                ? 'bg-black/20 hover:bg-black/30 text-black'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            aria-label="Copy color hex"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </Tooltip>

        {totalColors > 2 && (
          <Tooltip content="Delete Color">
            <button
              onClick={handleRemove}
              className={`p-2.5 rounded-xl backdrop-blur-md transition-transform hover:scale-110 shadow-lg ${
                isDarkText
                  ? 'bg-black/20 hover:bg-black/30 text-rose-800'
                  : 'bg-white/20 hover:bg-white/30 text-rose-300'
              }`}
              aria-label="Delete color swatch"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </Tooltip>
        )}
      </div>

      {/* Bottom Information: HEX Code & Friendly Name */}
      <div className="w-full">
        <div
          onClick={handleCopy}
          className="flex items-baseline justify-between group/hex cursor-pointer"
        >
          <span
            className={`font-mono text-xl md:text-2xl font-bold tracking-tight transition-opacity ${
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
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </div>

        <p
          className={`text-xs font-medium truncate mt-0.5 tracking-wide ${
            isDarkText ? 'text-black/85' : 'text-white/85'
          }`}
        >
          {color.name}
        </p>
      </div>
    </div>
  );
};
