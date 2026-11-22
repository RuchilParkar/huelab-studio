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
      a.download = `huelab-gradient-${Date.now()}.png`;
      a.click();
      addToast('Downloaded high-resolution gradient PNG (1920x1080)', 'success');
    } catch {
      addToast('Failed to export gradient PNG', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Live Gradient Preview Display */}
      <div
        style={{ background: cssString }}
        className="w-full h-72 sm:h-96 rounded-3xl border border-[#272B36] shadow-2xl transition-all duration-300 relative flex items-end p-6 overflow-hidden"
      >
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={handleCopyCss}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0B0C10]/80 hover:bg-[#0B0C10] backdrop-blur-md border border-white/20 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied CSS' : 'Copy CSS'}</span>
          </button>
          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#7C5CFC] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export PNG'}</span>
          </button>
        </div>

        <div className="bg-[#0B0C10]/70 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-xs font-mono text-white/90">
          {cssString}
        </div>
      </div>

      {/* Gradient Customization Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Style & Geometry Controls */}
        <div className="p-5 bg-[#111319] border border-[#272B36] rounded-2xl space-y-5">
          <h4 className="text-sm font-semibold text-[#F4F5F7] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#A78BFA]" />
            <span>Gradient Configuration</span>
          </h4>

          {/* Type Toggle */}
          <div>
            <label className="text-xs text-[#9298A6] block mb-2">Gradient Type</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#171A22] border border-[#272B36] rounded-xl">
              <button
                onClick={() => setGradientConfig((prev: GradientConfig) => ({ ...prev, type: 'linear' }))}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  gradientConfig.type === 'linear'
                    ? 'bg-[#7C5CFC] text-white shadow'
                    : 'text-[#9298A6] hover:text-[#F4F5F7]'
                }`}
              >
                Linear
              </button>
              <button
                onClick={() => setGradientConfig((prev: GradientConfig) => ({ ...prev, type: 'radial' }))}
                className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  gradientConfig.type === 'radial'
                    ? 'bg-[#7C5CFC] text-white shadow'
                    : 'text-[#9298A6] hover:text-[#F4F5F7]'
                }`}
              >
                Radial
              </button>
            </div>
          </div>

          {/* Angle Slider (For Linear) */}
          {gradientConfig.type === 'linear' && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#9298A6]">
                <span className="flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotation Angle</span>
                </span>
                <span className="font-mono text-[#F4F5F7] font-semibold">{gradientConfig.angle}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={gradientConfig.angle}
                onChange={(e) =>
                  setGradientConfig((prev: GradientConfig) => ({ ...prev, angle: Number(e.target.value) }))
                }
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#272B36] accent-[#A78BFA]"
              />
            </div>
          )}

          {/* CSS Snippet display */}
          <div className="pt-2">
            <span className="text-xs text-[#626A78] block mb-1">Generated Output</span>
            <pre className="p-3 bg-[#0B0C10] border border-[#272B36] rounded-xl text-[11px] font-mono text-[#A78BFA] overflow-x-auto whitespace-pre-wrap">
              background: {cssString};
            </pre>
          </div>
        </div>

        {/* Color Stops Manager */}
        <div className="lg:col-span-2 p-5 bg-[#111319] border border-[#272B36] rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#F4F5F7]">Color Stops ({gradientConfig.stops.length})</h4>
            <button
              onClick={addGradientStop}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A22] hover:bg-[#272B36] border border-[#272B36] text-[#A78BFA] hover:text-white text-xs font-semibold rounded-xl transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stop</span>
            </button>
          </div>

          <div className="space-y-3">
            {gradientConfig.stops.map((stop: GradientStop) => (
              <div
                key={stop.id}
                className="flex items-center gap-3 p-3 bg-[#171A22] border border-[#272B36] rounded-xl"
              >
                {/* Color input */}
                <div
                  style={{ backgroundColor: stop.color }}
                  className="w-9 h-9 rounded-lg border border-white/20 shrink-0 relative overflow-hidden shadow-inner cursor-pointer"
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
                  className="w-24 px-2 py-1.5 bg-[#0B0C10] border border-[#272B36] rounded-lg text-xs font-mono text-[#F4F5F7] uppercase"
                />

                {/* Position Slider */}
                <div className="flex-1 flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={stop.position}
                    onChange={(e) => updateGradientStop(stop.id, { position: Number(e.target.value) })}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#272B36] accent-[#A78BFA]"
                  />
                  <span className="text-xs font-mono text-[#9298A6] w-10 text-right">{stop.position}%</span>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeGradientStop(stop.id)}
                  disabled={gradientConfig.stops.length <= 2}
                  className="p-1.5 text-[#626A78] hover:text-rose-400 disabled:opacity-20 transition-colors"
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
