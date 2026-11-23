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
      className={`relative flex-1 min-h-[82px] sm:min-h-[96px] md:min-h-[440px] lg:min-h-[460px] rounded-xl flex md:flex-col flex-row items-center md:items-stretch justify-between p-3 sm:p-4 md:p-5 transition-colors duration-150 group cursor-pointer select-none border focus:outline-none focus-visible:ring-1 focus-visible:ring-white gap-2 md:gap-0 ${
        isFocused
          ? 'border-white/70 ring-1 ring-white/50 ring-offset-2 ring-offset-[#0B0C10] shadow-xl'
          : 'border-black/10 hover:border-black/20'
      }`}
    >
      {/* Role Pill & Desktop Lock */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-auto md:w-full relative z-20 shrink-0">
        {/* Role badge with dropdown menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowRoleMenu(!showRoleMenu);
            }}
            className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded-md backdrop-blur-md transition-colors ${
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

        {/* Lock toggle button on desktop */}
        <div className="hidden md:block">
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
      </div>

      {/* Hex & Name Information */}
      <div className="flex-1 min-w-0 px-2 md:px-0 md:w-full md:order-last">
        <div
          onClick={handleCopy}
          className="flex items-baseline md:justify-between group/hex cursor-pointer gap-2"
        >
          <span
            className={`font-mono text-base sm:text-lg md:text-2xl font-bold tracking-tight tabular-nums transition-opacity ${
              isDarkText ? 'text-black' : 'text-white'
            }`}
          >
            {color.hex}
          </span>
          <span
            className={`text-xs opacity-0 group-hover/hex:opacity-80 transition-opacity font-mono hidden md:inline ${
              isDarkText ? 'text-black' : 'text-white'
            }`}
          >
            {copied ? 'Copied' : 'Copy'}
          </span>
        </div>

        <p
          className={`text-[11px] sm:text-xs font-normal truncate mt-0.5 tracking-normal ${
            isDarkText ? 'text-black/80' : 'text-white/80'
          }`}
        >
          {color.name}
        </p>
      </div>

      {/* Action Toolbar */}
      <div
        className={`flex items-center gap-1 sm:gap-1.5 md:py-4 transition-opacity duration-150 shrink-0 ${
          isFocused
            ? 'opacity-100'
            : 'opacity-90 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100'
        }`}
      >
        {/* Mobile Lock button */}
        <button
          onClick={handleToggleLock}
          className={`md:hidden w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg backdrop-blur-md transition-colors ${
            color.locked
              ? isDarkText
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-black shadow-sm'
              : isDarkText
              ? 'bg-black/15 hover:bg-black/25 text-black'
              : 'bg-white/15 hover:bg-white/25 text-white'
          }`}
          aria-label={color.locked ? 'Unlock color' : 'Lock color'}
        >
          {color.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 opacity-70" />}
        </button>

        <Tooltip content="Edit Channels">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenEditor();
            }}
            className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg backdrop-blur-md transition-colors ${
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
            className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg backdrop-blur-md transition-colors ${
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
              className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg backdrop-blur-md transition-colors ${
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
    </div>
  );
};
