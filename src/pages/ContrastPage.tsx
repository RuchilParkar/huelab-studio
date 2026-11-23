import React, { useState } from 'react';
import { evaluateContrast } from '../engine/colorAccessibility';
import { isValidHex, normalizeHex } from '../engine/colorConversion';
import { useHueStore } from '../store/useHueStore';
import {
  ShieldCheck,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Copy,
  Check,
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

export const ContrastPage: React.FC = () => {
  const { currentPalette, addToast } = useHueStore();

  const [fgHex, setFgHex] = useState(currentPalette.colors[0]?.hex || '#F4F5F7');
  const [bgHex, setBgHex] = useState(currentPalette.colors[currentPalette.colors.length - 1]?.hex || '#0B0C10');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const validFg = isValidHex(fgHex) ? normalizeHex(fgHex) : '#F4F5F7';
  const validBg = isValidHex(bgHex) ? normalizeHex(bgHex) : '#0B0C10';

  const evaluation = evaluateContrast(validFg, validBg);

  const handleSwap = () => {
    setFgHex(bgHex);
    setBgHex(fgHex);
    addToast('Swapped foreground and background colors', 'info');
  };

  const handleCopy = async (text: string, key: string) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      addToast(`Copied ${text}`, 'success');
      setTimeout(() => setCopiedKey(null), 1500);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Config: FG and BG Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-[#0E1015] border border-[#222632] rounded-xl">
        {/* Foreground Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#8E95A5] flex items-center justify-between">
            <span>Foreground text tone</span>
            <span className="font-mono text-[#F1F3F7] tabular-nums">{validFg}</span>
          </label>
          <div className="flex items-center gap-2">
            <div
              style={{ backgroundColor: validFg }}
              className="w-8 h-8 rounded-lg border border-white/20 shrink-0 relative overflow-hidden shadow-inner cursor-pointer"
            >
              <input
                type="color"
                value={validFg}
                onChange={(e) => setFgHex(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
            <input
              type="text"
              value={fgHex}
              onChange={(e) => setFgHex(e.target.value)}
              className="flex-1 h-8 px-2.5 bg-[#141720] border border-[#222632] rounded-lg text-xs font-mono uppercase text-[#F1F3F7] focus:outline-none focus:border-[#3A4154]"
            />
            <button
              onClick={() => handleCopy(validFg, 'fg')}
              className="w-8 h-8 flex items-center justify-center bg-[#141720] border border-[#222632] text-[#8E95A5] hover:text-[#F1F3F7] rounded-lg"
            >
              {copiedKey === 'fg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Background Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#8E95A5] flex items-center justify-between">
            <span>Background surface tone</span>
            <span className="font-mono text-[#F1F3F7] tabular-nums">{validBg}</span>
          </label>
          <div className="flex items-center gap-2">
            <div
              style={{ backgroundColor: validBg }}
              className="w-8 h-8 rounded-lg border border-white/20 shrink-0 relative overflow-hidden shadow-inner cursor-pointer"
            >
              <input
                type="color"
                value={validBg}
                onChange={(e) => setBgHex(e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>
            <input
              type="text"
              value={bgHex}
              onChange={(e) => setBgHex(e.target.value)}
              className="flex-1 h-8 px-2.5 bg-[#141720] border border-[#222632] rounded-lg text-xs font-mono uppercase text-[#F1F3F7] focus:outline-none focus:border-[#3A4154]"
            />
            <button
              onClick={() => handleCopy(validBg, 'bg')}
              className="w-8 h-8 flex items-center justify-center bg-[#141720] border border-[#222632] text-[#8E95A5] hover:text-[#F1F3F7] rounded-lg"
            >
              {copiedKey === 'bg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleSwap}
              className="w-8 h-8 flex items-center justify-center bg-[#141720] hover:bg-[#1C202B] border border-[#222632] text-[#8E95A5] hover:text-[#F1F3F7] rounded-lg transition-colors"
              title="Swap Foreground & Background"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Preview & WCAG Verdict Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Live Typography Test Preview */}
        <div className="lg:col-span-2">
          <div
            style={{ backgroundColor: validBg, color: validFg }}
            className="p-6 sm:p-8 rounded-xl border border-white/10 shadow-sm transition-colors duration-200 min-h-[360px] flex flex-col justify-between"
          >
            <div>
              <span className="text-[11px] font-mono opacity-60 uppercase tracking-wider block mb-2">
                Sample typography preview
              </span>
              <h2 className="text-xl sm:text-3xl font-semibold tracking-tight mb-3">
                The quick brown fox jumps over the lazy dog.
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed opacity-85 max-w-lg">
                Contrast is the perceived difference in luminance between adjacent colors. Consistent contrast calibration ensures readability across mobile glare, dimmed displays, and varying visual acuity.
              </p>
            </div>

            <div className="pt-6 flex flex-wrap items-center gap-3 border-t border-current/20">
              <span className="text-xs font-mono px-2.5 py-1 rounded-md border border-current/30">
                14px Body text
              </span>
              <span className="text-sm font-medium px-2.5 py-1 rounded-md border border-current/30">
                18px Subheading
              </span>
              <span className="text-base font-semibold px-2.5 py-1 rounded-md border border-current/30">
                24px Headline
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: WCAG 2.2 Scorecard */}
        <div className="p-5 bg-[#0E1015] border border-[#222632] rounded-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#8E95A5]">
                Contrast ratio
              </span>
              <span
                className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                  evaluation.score === 'AAA'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : evaluation.score === 'AA'
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                    : evaluation.score === 'AA Large'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                }`}
              >
                {evaluation.score}
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-mono font-bold text-[#F1F3F7] tracking-tight tabular-nums">
              {evaluation.ratio}
              <span className="text-lg text-[#64748B] font-normal">:1</span>
            </div>

            {/* Compliance Matrix */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between p-2 bg-[#141720] border border-[#222632] rounded-lg text-xs">
                <span className="text-[#8E95A5]">AA Normal Text (≥ 4.5:1)</span>
                {evaluation.normalTextAA ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 font-medium">
                    <XCircle className="w-3.5 h-3.5" /> Fail
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 bg-[#141720] border border-[#222632] rounded-lg text-xs">
                <span className="text-[#8E95A5]">AAA Normal Text (≥ 7.0:1)</span>
                {evaluation.normalTextAAA ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 font-medium">
                    <XCircle className="w-3.5 h-3.5" /> Fail
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 bg-[#141720] border border-[#222632] rounded-lg text-xs">
                <span className="text-[#8E95A5]">AA Large Text (≥ 3.0:1)</span>
                {evaluation.largeTextAA ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 font-medium">
                    <XCircle className="w-3.5 h-3.5" /> Fail
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2 bg-[#141720] border border-[#222632] rounded-lg text-xs">
                <span className="text-[#8E95A5]">AAA Large Text (≥ 4.5:1)</span>
                {evaluation.largeTextAAA ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 font-medium">
                    <XCircle className="w-3.5 h-3.5" /> Fail
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actionable suggestions */}
          {evaluation.suggestions && evaluation.suggestions.length > 0 && (
            <div className="p-2.5 bg-[#0A0B0E] border border-[#222632] rounded-lg text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium text-[11px]">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Recommendation</span>
              </div>
              {evaluation.suggestions.map((s: string, i: number) => (
                <p key={i} className="text-[#8E95A5] text-[11px] leading-relaxed">
                  {s}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
