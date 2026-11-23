import React, { useState } from 'react';
import { useHueStore } from '../store/useHueStore';
import {
  generateGradientCss,
  exportGradientToPng,
} from '../engine/gradientEngine';
import { GradientConfig, GradientStop } from '../types';
import {
  Flame,
  Copy,
  Download,
  Check,
  Plus,
  Trash2,
  Sliders,
  RotateCw,
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';

export const GradientPage: React.FC = () => {
  const {
    gradientConfig,
    setGradientConfig,
    updateGradientStop,
    addGradientStop,
    removeGradientStop,
    addToast,
  } = useHueStore();

  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const cssString = generateGradientCss(gradientConfig);

  const handleCopyCss = async () => {
    const ok = await copyToClipboard(`background: ${cssString};`);
    if (ok) {
      setCopied(true);
      addToast('Copied gradient CSS to clipboard', 'success');
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDownloadPng = async () => {
    try {
      setIsExporting(true);
      const dataUrl = await exportGradientToPng(gradientConfig, 1920, 1080);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `huelabstudio-gradient-${Date.now()}.png`;
      a.click();
      addToast('Downloaded high-resolution gradient PNG (1920x1080)', 'success');
    } catch {
      addToast('Failed to export gradient PNG', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Live Gradient Preview Display */}
      <div
        style={{ background: cssString }}
        className="w-full h-64 sm:h-80 rounded-xl border border-[#222632] shadow-sm transition-colors duration-200 relative flex flex-col justify-between p-3.5 sm:p-5 overflow-hidden"
      >
        <div className="self-end flex items-center gap-2">
          <button
            onClick={handleCopyCss}
            className="flex items-center gap-1.5 h-8 px-2.5 bg-[#0B0C10]/80 hover:bg-[#0B0C10] backdrop-blur-md border border-white/20 text-white text-xs font-medium rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy CSS'}</span>
          </button>
          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex items-center gap-1.5 h-8 px-3 bg-[#F1F3F7] hover:bg-white disabled:opacity-50 text-[#0B0C10] text-xs font-semibold rounded-lg btn-highlight shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export PNG'}</span>
          </button>
        </div>

        <div className="bg-[#0B0C10]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono text-white/90 tabular-nums break-all max-w-full">
          {cssString}
        </div>
      </div>

      {/* Gradient Customization Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Style & Geometry Controls */}
        <div className="p-4 bg-[#0E1015] border border-[#222632] rounded-xl space-y-4">
          <h4 className="text-xs font-semibold text-[#F1F3F7] flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-[#8E95A5]" />
            <span>Gradient geometry</span>
          </h4>

          {/* Type Toggle */}
          <div>
            <label className="text-xs text-[#8E95A5] block mb-1.5">Type</label>
            <div className="grid grid-cols-2 gap-1 p-0.5 bg-[#141720] border border-[#222632] rounded-lg">
              <button
                onClick={() => setGradientConfig((prev: GradientConfig) => ({ ...prev, type: 'linear' }))}
                className={`h-7 rounded-md text-xs font-medium transition-colors ${
                  gradientConfig.type === 'linear'
                    ? 'bg-[#1F2432] text-[#F1F3F7] border border-[#2D3445] shadow-sm'
                    : 'text-[#8E95A5] hover:text-[#F1F3F7]'
                }`}
              >
                Linear
              </button>
              <button
                onClick={() => setGradientConfig((prev: GradientConfig) => ({ ...prev, type: 'radial' }))}
                className={`h-7 rounded-md text-xs font-medium transition-colors ${
                  gradientConfig.type === 'radial'
                    ? 'bg-[#1F2432] text-[#F1F3F7] border border-[#2D3445] shadow-sm'
                    : 'text-[#8E95A5] hover:text-[#F1F3F7]'
                }`}
              >
                Radial
              </button>
            </div>
          </div>

          {/* Angle Slider (For Linear) */}
          {gradientConfig.type === 'linear' && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#8E95A5]">
                <span className="flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotation angle</span>
                </span>
                <span className="font-mono text-[#F1F3F7] tabular-nums">{gradientConfig.angle}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={gradientConfig.angle}
                onChange={(e) =>
                  setGradientConfig((prev: GradientConfig) => ({ ...prev, angle: Number(e.target.value) }))
                }
                className="w-full h-1.5 rounded appearance-none cursor-pointer bg-[#222632] accent-[#8E95A5]"
              />
            </div>
          )}

          {/* CSS Snippet display */}
          <div className="pt-1">
            <span className="text-[11px] text-[#64748B] block mb-1">Generated syntax</span>
            <pre className="p-2.5 bg-[#08090C] border border-[#222632] rounded-lg text-[11px] font-mono text-[#8E95A5] overflow-x-auto whitespace-pre-wrap">
              background: {cssString};
            </pre>
          </div>
        </div>

        {/* Color Stops Manager */}
        <div className="lg:col-span-2 p-4 bg-[#0E1015] border border-[#222632] rounded-xl space-y-3.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#F1F3F7]">Color stops ({gradientConfig.stops.length})</h4>
            <button
              onClick={addGradientStop}
              className="flex items-center gap-1.5 h-7 px-2.5 bg-[#141720] hover:bg-[#1E2330] border border-[#222632] text-[#8E95A5] hover:text-[#F1F3F7] text-xs font-medium rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add stop</span>
            </button>
          </div>

          <div className="space-y-2">
            {gradientConfig.stops.map((stop: GradientStop) => (
              <div
                key={stop.id}
                className="flex items-center gap-2.5 p-2 bg-[#141720] border border-[#222632] rounded-lg"
              >
                {/* Color input */}
                <div
                  style={{ backgroundColor: stop.color }}
                  className="w-7 h-7 rounded-md border border-white/20 shrink-0 relative overflow-hidden shadow-inner cursor-pointer"
                >
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateGradientStop(stop.id, { color: e.target.value })}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>

                {/* Hex input */}
                <input
                  type="text"
                  value={stop.color}
                  onChange={(e) => updateGradientStop(stop.id, { color: e.target.value })}
                  className="w-20 h-7 px-2 bg-[#08090C] border border-[#222632] rounded text-xs font-mono text-[#F1F3F7] uppercase"
                />

                {/* Position Slider */}
                <div className="flex-1 flex items-center gap-2.5">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={stop.position}
                    onChange={(e) => updateGradientStop(stop.id, { position: Number(e.target.value) })}
                    className="w-full h-1.5 rounded appearance-none cursor-pointer bg-[#222632] accent-[#8E95A5]"
                  />
                  <span className="text-xs font-mono text-[#8E95A5] w-9 text-right tabular-nums">{stop.position}%</span>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeGradientStop(stop.id)}
                  disabled={gradientConfig.stops.length <= 2}
                  className="p-1 text-[#64748B] hover:text-rose-400 disabled:opacity-20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
