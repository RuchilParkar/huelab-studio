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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Config: FG and BG Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-[#111319] border border-[#272B36] rounded-2xl">
        {/* Foreground Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#9298A6] flex items-center justify-between">
            <span>Foreground (Text) Color</span>
            <span className="font-mono text-[#F4F5F7]">{validFg}</span>
          </label>
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: validFg }}
              className="w-10 h-10 rounded-xl border border-white/20 shrink-0 relative overflow-hidden shadow-inner cursor-pointer"
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
              className="flex-1 px-3 py-2 bg-[#171A22] border border-[#272B36] rounded-xl text-xs font-mono uppercase text-[#F4F5F7] focus:outline-none focus:border-[#7C5CFC]"
            />
            <button
              onClick={() => handleCopy(validFg, 'fg')}
              className="p-2 bg-[#171A22] border border-[#272B36] text-[#9298A6] hover:text-[#F4F5F7] rounded-xl"
            >
              {copiedKey === 'fg' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Background Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#9298A6] flex items-center justify-between">
            <span>Background Color</span>
            <span className="font-mono text-[#F4F5F7]">{validBg}</span>
          </label>
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: validBg }}
              className="w-10 h-10 rounded-xl border border-white/20 shrink-0 relative overflow-hidden shadow-inner cursor-pointer"
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
              className="flex-1 px-3 py-2 bg-[#171A22] border border-[#272B36] rounded-xl text-xs font-mono uppercase text-[#F4F5F7] focus:outline-none focus:border-[#7C5CFC]"
            />
            <button
              onClick={() => handleCopy(validBg, 'bg')}
              className="p-2 bg-[#171A22] border border-[#272B36] text-[#9298A6] hover:text-[#F4F5F7] rounded-xl"
            >
              {copiedKey === 'bg' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleSwap}
              className="p-2 bg-[#7C5CFC] hover:bg-[#6D28D9] text-white rounded-xl shadow-sm transition-all"
              title="Swap Foreground & Background"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Preview & WCAG Verdict Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Typography Test Preview */}
        <div className="lg:col-span-2">
          <div
            style={{ backgroundColor: validBg, color: validFg }}
            className="p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl transition-all duration-300 min-h-[380px] flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono opacity-60 uppercase tracking-widest block mb-2">
                Sample Typography Preview
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4">
                The quick brown fox jumps over the lazy dog.
              </h2>
              <p className="text-sm sm:text-base leading-relaxed opacity-90 max-w-xl">
                Contrast is the perceived difference in brightness between adjacent colors. High contrast is vital for accessible readability across ambient conditions, daylight reflections, and visual impairments.
              </p>
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-4 border-t border-current/20">
              <span className="text-xs font-mono px-3 py-1 rounded-full border border-current/30">
                16px Regular Text
              </span>
              <span className="text-sm font-semibold px-3 py-1 rounded-full border border-current/30">
                18px Large Text
              </span>
              <span className="text-base font-bold px-3 py-1 rounded-full border border-current/30">
                24px Display Heading
              </span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: WCAG 2.2 Scorecard */}
        <div className="p-6 bg-[#111319] border border-[#272B36] rounded-3xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#626A78] uppercase tracking-wider">
                WCAG 2.2 RATIO
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  evaluation.score === 'AAA'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : evaluation.score === 'AA'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : evaluation.score === 'AA Large'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {evaluation.score}
              </span>
            </div>

            <div className="text-4xl sm:text-5xl font-mono font-extrabold text-[#F4F5F7] tracking-tight">
              {evaluation.ratio}
              <span className="text-xl text-[#626A78] font-normal">:1</span>
            </div>

            {/* Compliance Matrix */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-[#171A22] border border-[#272B36] rounded-xl text-xs">
                <span className="text-[#9298A6]">AA Normal Text (≥ 4.5:1)</span>
                {evaluation.normalTextAA ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 font-semibold">
                    <XCircle className="w-4 h-4" /> Fail
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#171A22] border border-[#272B36] rounded-xl text-xs">
                <span className="text-[#9298A6]">AAA Normal Text (≥ 7.0:1)</span>
                {evaluation.normalTextAAA ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 font-semibold">
                    <XCircle className="w-4 h-4" /> Fail
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#171A22] border border-[#272B36] rounded-xl text-xs">
                <span className="text-[#9298A6]">AA Large Text (≥ 3.0:1)</span>
                {evaluation.largeTextAA ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 font-semibold">
                    <XCircle className="w-4 h-4" /> Fail
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#171A22] border border-[#272B36] rounded-xl text-xs">
                <span className="text-[#9298A6]">AAA Large Text (≥ 4.5:1)</span>
                {evaluation.largeTextAAA ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 font-semibold">
                    <XCircle className="w-4 h-4" /> Fail
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actionable suggestions */}
          {evaluation.suggestions && evaluation.suggestions.length > 0 && (
            <div className="p-3 bg-[#0B0C10] border border-[#272B36] rounded-xl text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Recommendation</span>
              </div>
              {evaluation.suggestions.map((s: string, i: number) => (
                <p key={i} className="text-[#9298A6] text-[11px] leading-relaxed">
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
