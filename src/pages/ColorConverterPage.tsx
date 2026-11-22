import React, { useState } from 'react';
import {
  hexToAllFormats,
  isValidHex,
  normalizeHex,
} from '../engine/colorConversion';
import { getColorName } from '../engine/colorNaming';
import { useHueStore } from '../store/useHueStore';
import { Copy, Check, RotateCcw } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

const PRESET_COLORS = [
  { name: 'Royal Amethyst', hex: '#7C5CFC' },
  { name: 'Cyber Cyan', hex: '#06B6D4' },
  { name: 'Neon Fuchsia', hex: '#EC4899' },
  { name: 'Emerald Glade', hex: '#10B981' },
  { name: 'Champagne Gold', hex: '#FBBF24' },
  { name: 'Obsidian Black', hex: '#0B0C10' },
];

export const ColorConverterPage: React.FC = () => {
  const { addToast } = useHueStore();
  const [activeHex, setActiveHex] = useState('#7C5CFC');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const validHex = isValidHex(activeHex) ? normalizeHex(activeHex) : '#7C5CFC';
  const formats = hexToAllFormats(validHex);
  const colorName = getColorName(validHex);

  const handleCopy = async (val: string, key: string) => {
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedKey(key);
      addToast(`Copied ${val}`, 'success');
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  const handleReset = () => {
    setActiveHex('#7C5CFC');
    addToast('Reset to default color', 'info');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Active Color Preview & Presets Header */}
      <div className="p-6 bg-[#111319] border border-[#272B36] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div
            style={{ backgroundColor: validHex }}
            className="w-20 h-20 rounded-2xl border border-white/20 shadow-2xl relative overflow-hidden shrink-0 cursor-pointer"
          >
            <input
              type="color"
              value={validHex}
              onChange={(e) => setActiveHex(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          <div>
            <span className="text-xs font-mono text-[#626A78] uppercase">Active Hue</span>
            <h3 className="text-xl font-bold text-[#F4F5F7] mt-0.5">{colorName}</h3>
            <p className="text-xs font-mono text-[#A78BFA] mt-0.5">{validHex}</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          <span className="text-xs text-[#626A78] mr-1 hidden sm:inline">Examples:</span>
          {PRESET_COLORS.map((p) => (
            <button
              key={p.hex}
              onClick={() => setActiveHex(p.hex)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A22] hover:bg-[#272B36] border border-[#272B36] rounded-xl text-xs text-[#9298A6] hover:text-[#F4F5F7] transition-all"
            >
              <span style={{ backgroundColor: p.hex }} className="w-2.5 h-2.5 rounded-full" />
              <span>{p.name}</span>
            </button>
          ))}
          <button
            onClick={handleReset}
            className="p-2 bg-[#171A22] hover:bg-[#272B36] border border-[#272B36] text-[#9298A6] hover:text-[#F4F5F7] rounded-xl transition-all"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Conversion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: 'HEX', val: formats.hex, desc: '6-digit standard web hexadecimal' },
          { label: 'RGB', val: formats.rgbString, desc: 'Red, Green, Blue integer channels (0-255)' },
          { label: 'RGBA', val: formats.rgbaString, desc: 'RGB with alpha transparency channel' },
          { label: 'HSL', val: formats.hslString, desc: 'Hue (0-360°), Saturation (%), Lightness (%)' },
          { label: 'HSLA', val: formats.hslaString, desc: 'HSL with alpha channel' },
          { label: 'HSV / HSB', val: formats.hsvString, desc: 'Hue, Saturation, Value/Brightness' },
          {
            label: 'OKLCH',
            val: formats.oklchString,
            desc: 'Perceptually uniform modern CSS color space',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="p-5 bg-[#111319] border border-[#272B36] rounded-2xl flex flex-col justify-between hover:border-[#7C5CFC]/50 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#A78BFA] tracking-wide">{item.label}</span>
              <button
                onClick={() => handleCopy(item.val, item.label)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#171A22] hover:bg-[#272B36] border border-[#272B36] text-[#9298A6] hover:text-[#F4F5F7] text-xs rounded-lg transition-all"
              >
                {copiedKey === item.label ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedKey === item.label ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="font-mono text-sm sm:text-base font-bold text-[#F4F5F7] select-all my-1">
              {item.val}
            </div>

            <p className="text-[11px] text-[#626A78] mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
