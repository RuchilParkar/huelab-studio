import React, { useState, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { ColorItem, RgbColor, HslColor, HsvColor, OklchColor } from '../../types';
import {
  hexToAllFormats,
  isValidHex,
  normalizeHex,
  rgbToHex,
  hslToRgb,
  clamp,
} from '../../engine/colorConversion';
import { getColorName } from '../../engine/colorNaming';
import { evaluateContrast } from '../../engine/colorAccessibility';
import { copyToClipboard } from '../../utils/clipboard';
import { useHueStore } from '../../store/useHueStore';
import { Copy, Check, Eye, AlertCircle } from 'lucide-react';

interface ColorDetailsModalProps {
  color: ColorItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedColor: ColorItem) => void;
}

export const ColorDetailsModal: React.FC<ColorDetailsModalProps> = ({
  color,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!color) return null;

  const { addToast } = useHueStore();
  const [hexInput, setHexInput] = useState(color.hex);
  const [hexError, setHexError] = useState<string | null>(null);
  const [rgbState, setRgbState] = useState<RgbColor>({ r: 0, g: 0, b: 0 });
  const [hslState, setHslState] = useState<HslColor>({ h: 0, s: 0, l: 0 });
  const [hsvState, setHsvState] = useState<HsvColor>({ h: 0, s: 0, v: 0 });
  const [oklchState, setOklchState] = useState<OklchColor>({ l: 0, c: 0, h: 0 });
  const [currentColorName, setCurrentColorName] = useState(color.name);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync state when opened or color changes
  useEffect(() => {
    if (color && isValidHex(color.hex)) {
      updateAllFromHex(color.hex);
      setHexError(null);
    }
  }, [color]);

  const updateAllFromHex = (hex: string) => {
    const valid = isValidHex(hex);
    if (!valid) return;

    const norm = normalizeHex(hex);
    const converted = hexToAllFormats(norm);

    setHexInput(norm);
    setRgbState(converted.rgb);
    setHslState(converted.hsl);
    setHsvState(converted.hsv);
    setOklchState(converted.oklch);
    setCurrentColorName(getColorName(norm));
  };

  const handleHexChange = (val: string) => {
    setHexInput(val);
    if (isValidHex(val)) {
      setHexError(null);
      updateAllFromHex(val);
    } else {
      setHexError('Please enter a valid HEX code (e.g. #7C5CFC or #FFF)');
    }
  };

  const handleRgbChannelChange = (channel: 'r' | 'g' | 'b', val: number) => {
    const nextRgb = { ...rgbState, [channel]: clamp(isNaN(val) ? 0 : val, 0, 255) };
    setRgbState(nextRgb);
    const hex = rgbToHex(nextRgb);
    setHexError(null);
    updateAllFromHex(hex);
  };

  const handleHslChannelChange = (channel: 'h' | 's' | 'l', val: number) => {
    const maxVal = channel === 'h' ? 360 : 100;
    const nextHsl = { ...hslState, [channel]: clamp(isNaN(val) ? 0 : val, 0, maxVal) };
    setHslState(nextHsl);
    const rgb = hslToRgb(nextHsl);
    const hex = rgbToHex(rgb);
    setHexError(null);
    updateAllFromHex(hex);
  };

  const handleCopy = async (text: string, key: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      addToast(`Copied ${text}`, 'success');
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  const handleSave = () => {
    if (!isValidHex(hexInput)) {
      setHexError('Cannot apply invalid HEX color code');
      return;
    }
    const norm = normalizeHex(hexInput);
    onSave({
      ...color,
      hex: norm,
      name: currentColorName,
    });
    onClose();
  };

  // Contrast evaluations against dark / light background
  const contrastAgainstDark = evaluateContrast(isValidHex(hexInput) ? normalizeHex(hexInput) : '#7C5CFC', '#0B0C10');
  const contrastAgainstLight = evaluateContrast(isValidHex(hexInput) ? normalizeHex(hexInput) : '#7C5CFC', '#FFFFFF');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Advanced Color Editor"
      description={`Editing ${color.name} (${color.role || 'palette tone'})`}
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col gap-5">
        {/* Color Preview & Native Picker Header */}
        <div className="flex items-center gap-4 p-4 bg-[#0B0C10] border border-[#272B36] rounded-2xl">
          <div
            style={{ backgroundColor: isValidHex(hexInput) ? hexInput : '#7C5CFC' }}
            className="w-16 h-16 rounded-xl border border-white/20 shadow-inner flex items-center justify-center shrink-0 relative overflow-hidden group cursor-pointer"
          >
            <input
              type="color"
              value={isValidHex(hexInput) ? hexInput : '#7C5CFC'}
              onChange={(e) => handleHexChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Pick color"
            />
            <Eye className="w-5 h-5 text-white/70 group-hover:opacity-100 transition-opacity pointer-events-none drop-shadow" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-[#F4F5F7] truncate">{currentColorName}</h4>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                className={`w-28 px-2.5 py-1 bg-[#171A22] border rounded-lg text-xs font-mono font-bold uppercase focus:outline-none ${
                  hexError ? 'border-rose-500 text-rose-300' : 'border-[#272B36] text-[#F4F5F7] focus:border-[#7C5CFC]'
                }`}
              />
              {hexError && (
                <span className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>Invalid</span>
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={Boolean(hexError)}
            className="px-4 py-2 bg-[#7C5CFC] hover:bg-[#6D28D9] disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 shrink-0"
          >
            Apply Changes
          </button>
        </div>

        {/* RGB Channel Direct Inputs */}
        <div className="p-3.5 bg-[#171A22] border border-[#272B36] rounded-2xl space-y-2">
          <span className="text-xs font-semibold text-[#F4F5F7]">RGB Channels (0-255)</span>
          <div className="grid grid-cols-3 gap-3">
            {(['r', 'g', 'b'] as const).map((ch) => (
              <div key={ch} className="flex items-center gap-2 bg-[#0B0C10] border border-[#272B36] rounded-xl px-2.5 py-1.5">
                <span className="text-[10px] font-mono text-[#626A78] uppercase">{ch}</span>
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={rgbState[ch]}
                  onChange={(e) => handleRgbChannelChange(ch, Number(e.target.value))}
                  className="w-full bg-transparent text-xs font-mono font-semibold text-[#F4F5F7] focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* HSL Sliders & Direct Inputs */}
        <div className="space-y-4 p-4 bg-[#171A22] border border-[#272B36] rounded-2xl">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-semibold text-[#F4F5F7]">Perceptual HSL Controls</h5>
            <div className="flex items-center gap-2 text-xs font-mono text-[#9298A6]">
              <span>H:{hslState.h}°</span>
              <span>S:{hslState.s}%</span>
              <span>L:{hslState.l}%</span>
            </div>
          </div>

          {/* Hue */}
          <div>
            <div className="flex justify-between text-xs text-[#9298A6] mb-1.5 font-mono">
              <span>Hue</span>
              <input
                type="number"
                min={0}
                max={360}
                value={hslState.h}
                onChange={(e) => handleHslChannelChange('h', Number(e.target.value))}
                className="w-14 px-1 py-0.5 bg-[#0B0C10] border border-[#272B36] rounded text-right text-xs text-[#F4F5F7]"
              />
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={hslState.h}
              onChange={(e) => handleHslChannelChange('h', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500"
            />
          </div>

          {/* Saturation */}
          <div>
            <div className="flex justify-between text-xs text-[#9298A6] mb-1.5 font-mono">
              <span>Saturation</span>
              <input
                type="number"
                min={0}
                max={100}
                value={hslState.s}
                onChange={(e) => handleHslChannelChange('s', Number(e.target.value))}
                className="w-14 px-1 py-0.5 bg-[#0B0C10] border border-[#272B36] rounded text-right text-xs text-[#F4F5F7]"
              />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={hslState.s}
              onChange={(e) => handleHslChannelChange('s', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#272B36] accent-[#A78BFA]"
            />
          </div>

          {/* Lightness */}
          <div>
            <div className="flex justify-between text-xs text-[#9298A6] mb-1.5 font-mono">
              <span>Lightness</span>
              <input
                type="number"
                min={0}
                max={100}
                value={hslState.l}
                onChange={(e) => handleHslChannelChange('l', Number(e.target.value))}
                className="w-14 px-1 py-0.5 bg-[#0B0C10] border border-[#272B36] rounded text-right text-xs text-[#F4F5F7]"
              />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={hslState.l}
              onChange={(e) => handleHslChannelChange('l', Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#272B36] accent-[#A78BFA]"
            />
          </div>
        </div>

        {/* Synchronized Color Value Formats with Copy */}
        <div className="space-y-2">
          <h5 className="text-xs font-semibold text-[#F4F5F7]">Synchronized Value Representations</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* HEX */}
            <div className="flex items-center justify-between p-2.5 bg-[#0B0C10] border border-[#272B36] rounded-xl font-mono">
              <span className="text-[#626A78]">HEX</span>
              <span className="text-[#F4F5F7] font-semibold">{isValidHex(hexInput) ? normalizeHex(hexInput) : hexInput}</span>
              <button
                onClick={() => handleCopy(hexInput, 'hex')}
                className="text-[#9298A6] hover:text-white p-1"
                aria-label="Copy HEX"
              >
                {copiedKey === 'hex' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* RGB */}
            <div className="flex items-center justify-between p-2.5 bg-[#0B0C10] border border-[#272B36] rounded-xl font-mono">
              <span className="text-[#626A78]">RGB</span>
              <span className="text-[#F4F5F7]">rgb({rgbState.r}, {rgbState.g}, {rgbState.b})</span>
              <button
                onClick={() => handleCopy(`rgb(${rgbState.r}, ${rgbState.g}, ${rgbState.b})`, 'rgb')}
                className="text-[#9298A6] hover:text-white p-1"
                aria-label="Copy RGB"
              >
                {copiedKey === 'rgb' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* HSL */}
            <div className="flex items-center justify-between p-2.5 bg-[#0B0C10] border border-[#272B36] rounded-xl font-mono">
              <span className="text-[#626A78]">HSL</span>
              <span className="text-[#F4F5F7]">hsl({hslState.h}, {hslState.s}%, {hslState.l}%)</span>
              <button
                onClick={() => handleCopy(`hsl(${hslState.h}, ${hslState.s}%, ${hslState.l}%)`, 'hsl')}
                className="text-[#9298A6] hover:text-white p-1"
                aria-label="Copy HSL"
              >
                {copiedKey === 'hsl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* OKLCH */}
            <div className="flex items-center justify-between p-2.5 bg-[#0B0C10] border border-[#272B36] rounded-xl font-mono">
              <span className="text-[#626A78]">OKLCH</span>
              <span className="text-[#F4F5F7]">
                {(oklchState.l * 100).toFixed(0)}% {oklchState.c.toFixed(2)} {oklchState.h.toFixed(0)}
              </span>
              <button
                onClick={() => handleCopy(`oklch(${(oklchState.l * 100).toFixed(1)}% ${oklchState.c.toFixed(3)} ${oklchState.h.toFixed(1)})`, 'oklch')}
                className="text-[#9298A6] hover:text-white p-1"
                aria-label="Copy OKLCH"
              >
                {copiedKey === 'oklch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Live Contrast Assessment */}
        <div className="p-3.5 bg-[#171A22] border border-[#272B36] rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[#626A78] block">Contrast vs Dark #0B0C10:</span>
            <span className="font-mono font-semibold text-[#F4F5F7]">{contrastAgainstDark.ratio}:1</span>
            <span className="ml-1.5 text-[10px] text-emerald-400 font-medium">({contrastAgainstDark.score})</span>
          </div>

          <div className="text-right">
            <span className="text-[#626A78] block">Contrast vs White #FFFFFF:</span>
            <span className="font-mono font-semibold text-[#F4F5F7]">{contrastAgainstLight.ratio}:1</span>
            <span className="ml-1.5 text-[10px] text-emerald-400 font-medium">({contrastAgainstLight.score})</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
