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
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Active Color Preview & Presets Header */}
      <div className="p-4 bg-[#0E1015] border border-[#222632] rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div
            style={{ backgroundColor: validHex }}
            className="w-14 h-14 rounded-lg border border-white/20 shadow-inner relative overflow-hidden shrink-0 cursor-pointer"
          >
            <input
              type="color"
              value={validHex}
              onChange={(e) => setActiveHex(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </div>

          <div>
            <span className="text-[11px] font-mono text-[#64748B]">Active tone</span>
            <h3 className="text-base font-semibold text-[#F1F3F7] mt-0.5">{colorName}</h3>
            <p className="text-xs font-mono text-[#8E95A5] tabular-nums mt-0.5">{validHex}</p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-center">
          <span className="text-xs text-[#64748B] mr-1 hidden sm:inline">Presets:</span>
          {PRESET_COLORS.map((p) => (
            <button
              key={p.hex}
              onClick={() => setActiveHex(p.hex)}
              className="flex items-center gap-1.5 h-7 px-2.5 bg-[#141720] hover:bg-[#1E2330] border border-[#222632] rounded-lg text-xs text-[#8E95A5] hover:text-[#F1F3F7] transition-colors"
            >
              <span style={{ backgroundColor: p.hex }} className="w-2 h-2 rounded-full" />
              <span>{p.name}</span>
            </button>
          ))}
          <button
            onClick={handleReset}
            className="w-7 h-7 flex items-center justify-center bg-[#141720] hover:bg-[#1E2330] border border-[#222632] text-[#8E95A5] hover:text-[#F1F3F7] rounded-lg transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Conversion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { label: 'HEX', val: formats.hex, desc: '6-digit standard hexadecimal representation' },
          { label: 'RGB', val: formats.rgbString, desc: 'Red, Green, Blue integer channels (0-255)' },
          { label: 'RGBA', val: formats.rgbaString, desc: 'RGB with normalized alpha channel' },
          { label: 'HSL', val: formats.hslString, desc: 'Hue angle, Saturation %, Lightness %' },
          { label: 'HSLA', val: formats.hslaString, desc: 'HSL with alpha channel' },
          { label: 'HSV / HSB', val: formats.hsvString, desc: 'Hue, Saturation, Value brightness' },
          {
            label: 'OKLCH',
            val: formats.oklchString,
            desc: 'Perceptually uniform modern CSS color space',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="p-3.5 bg-[#0E1015] border border-[#222632] rounded-xl flex flex-col justify-between hover:border-[#2D3344] transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-medium text-[#8E95A5]">{item.label}</span>
              <button
                onClick={() => handleCopy(item.val, item.label)}
                className="flex items-center gap-1.5 h-6 px-2 bg-[#141720] hover:bg-[#1E2330] border border-[#222632] text-[#8E95A5] hover:text-[#F1F3F7] text-[11px] rounded transition-colors"
              >
                {copiedKey === item.label ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedKey === item.label ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="font-mono text-sm font-semibold text-[#F1F3F7] tabular-nums select-all my-1">
              {item.val}
            </div>

            <p className="text-[11px] text-[#64748B] mt-1.5">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
