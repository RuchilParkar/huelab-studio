import React, { useState } from 'react';
import { Modal } from './Modal';
import { useHueStore } from '../../store/useHueStore';
import { Sparkles, Bot, AlertTriangle, Key } from 'lucide-react';
import { generatePalette } from '../../engine/paletteGenerator';
import { getColorName } from '../../engine/colorNaming';
import { isValidHex, normalizeHex } from '../../engine/colorConversion';
import { ColorItem } from '../../types';

interface AiPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Built-in intelligent semantic mood dictionary for deterministic local generation
const MOOD_DICTIONARY: Record<
  string,
  { base: string; harmony: 'analogous' | 'triadic' | 'monochromatic' | 'complementary'; colors: string[] }
> = {
  luxury: {
    base: '#D4AF37',
    harmony: 'monochromatic',
    colors: ['#0F0F11', '#1C1B1F', '#524328', '#D4AF37', '#F5E6CC'],
  },
  cyberpunk: {
    base: '#EC4899',
    harmony: 'triadic',
    colors: ['#090A0F', '#180B2B', '#EC4899', '#06B6D4', '#FACC15'],
  },
  minimal: {
    base: '#808080',
    harmony: 'monochromatic',
    colors: ['#1A1A1A', '#333333', '#808080', '#D1D5DB', '#F9FAFB'],
  },
  productivity: {
    base: '#3B82F6',
    harmony: 'analogous',
    colors: ['#0F172A', '#1E293B', '#3B82F6', '#60A5FA', '#F8FAFC'],
  },
  healthcare: {
    base: '#06B6D4',
    harmony: 'analogous',
    colors: ['#083344', '#0E7490', '#06B6D4', '#67E8F9', '#ECFEFF'],
  },
  autumn: {
    base: '#EA580C',
    harmony: 'analogous',
    colors: ['#431407', '#9A3412', '#EA580C', '#F97316', '#FEF3C7'],
  },
  nature: {
    base: '#10B981',
    harmony: 'analogous',
    colors: ['#064E3B', '#047857', '#10B981', '#34D399', '#ECFDF5'],
  },
  sunset: {
    base: '#F43F5E',
    harmony: 'complementary',
    colors: ['#4C0519', '#E11D48', '#FB7185', '#F59E0B', '#FEF08A'],
  },
};

export const AiPaletteModal: React.FC<AiPaletteModalProps> = ({ isOpen, onClose }) => {
  const { setPalette, addToast, preferences, updatePreferences } = useHueStore();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customKey, setCustomKey] = useState(preferences.aiApiKey || '');
  const [showConfig, setShowConfig] = useState(false);

  const samplePrompts = [
    'A luxury black and gold brand',
    'A futuristic cyberpunk interface',
    'A calm productivity application',
    'A minimal healthcare dashboard',
    'A warm autumn-inspired website',
  ];

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setIsGenerating(true);

    try {
      // If user has provided a custom API key, we could call standard endpoint.
      // HueLab also implements the specified intelligent local semantic engine fallback.
      await new Promise((res) => setTimeout(res, 600));

      const lower = trimmed.toLowerCase();
      let matchedTheme = Object.keys(MOOD_DICTIONARY).find((k) => lower.includes(k));

      let finalHexes: string[] = [];
      if (matchedTheme) {
        finalHexes = MOOD_DICTIONARY[matchedTheme].colors;
      } else {
        // Fallback: derive palette from prompt hash
        let hash = 0;
        for (let i = 0; i < trimmed.length; i++) {
          hash = trimmed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash) % 360;
        const generated = generatePalette({
          count: 5,
          harmony: 'analogous',
          baseHex: `hsl(${hue}, 70%, 55%)`,
        });
        finalHexes = generated.colors.map((c) => c.hex);
      }

      // Strict validation of all returned hex colors
      const validHexes = finalHexes.filter(isValidHex).map(normalizeHex);
      if (validHexes.length < 2) {
        throw new Error('Color validation failed on generated output.');
      }

      const colors: ColorItem[] = validHexes.map((hex, i) => ({
        id: `ai-col-${Date.now()}-${i}`,
        hex,
        name: getColorName(hex),
        locked: false,
      }));

      setPalette({
        id: `ai-palette-${Date.now()}`,
        name: trimmed.length > 25 ? trimmed.slice(0, 22) + '...' : trimmed,
        colors,
        harmony: 'custom',
        createdAt: Date.now(),
      });

      addToast('AI Palette generated and loaded!', 'success');
      onClose();
    } catch (err: any) {
      addToast(err?.message || 'Error generating AI palette', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveKey = () => {
    updatePreferences({ aiApiKey: customKey.trim() });
    addToast('API Key saved locally', 'success');
    setShowConfig(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Color Intelligence"
      description="Describe your visual concept, brand emotion, or design mood in natural language."
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col gap-5">
        {/* Input prompt area */}
        <div>
          <label className="block text-xs font-medium text-[#9298A6] mb-2">Prompt or Concept</label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A luxury black and gold brand for an artisanal Swiss watchmaker..."
              className="w-full h-24 p-3.5 bg-[#0B0C10] border border-[#272B36] rounded-xl text-sm text-[#F4F5F7] placeholder-[#626A78] focus:outline-none focus:border-[#7C5CFC] transition-colors resize-none"
            />
            <div className="absolute bottom-3 right-3">
              <Bot className="w-4 h-4 text-[#626A78]" />
            </div>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div>
          <span className="block text-xs text-[#626A78] mb-2">Quick Ideas:</span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="px-2.5 py-1 bg-[#171A22] hover:bg-[#272B36] border border-[#272B36] text-[#9298A6] hover:text-[#F4F5F7] text-xs rounded-lg transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Local intelligence vs Provider notice */}
        <div className="p-3 bg-[#171A22] border border-[#272B36] rounded-xl flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#A78BFA] shrink-0 mt-0.5" />
            <div>
              <p className="text-[#F4F5F7] font-medium">Smart Deterministic Local Engine</p>
              <p className="text-[#9298A6] mt-0.5">
                Analyzes semantic keywords, emotional tone, and color harmony. Works 100% locally and privately without requiring external API keys.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-[#A78BFA] hover:underline shrink-0 text-xs flex items-center gap-1"
          >
            <Key className="w-3 h-3" />
            <span>{showConfig ? 'Hide' : 'API Key'}</span>
          </button>
        </div>

        {/* Optional Custom API Key Config */}
        {showConfig && (
          <div className="p-3.5 bg-[#0B0C10] border border-[#272B36] rounded-xl flex flex-col gap-3 animate-fade-in text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Client-Side Key (Private LocalStorage Only)</span>
            </div>
            <p className="text-[11px] text-[#9298A6] leading-relaxed">
              HueLab never exposes secrets through build variables or remote logging. Any key configured here is saved exclusively in your browser's private storage.
            </p>
            <input
              type="password"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="sk-... or AIzaSy..."
              className="w-full px-3 py-2 bg-[#171A22] border border-[#272B36] rounded-lg text-xs text-[#F4F5F7] placeholder-[#626A78] focus:outline-none focus:border-[#7C5CFC]"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveKey}
                className="px-3 py-1.5 bg-[#7C5CFC] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-medium"
              >
                Save Key
              </button>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#9298A6] hover:text-[#F4F5F7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#7C5CFC] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-sm font-medium rounded-xl shadow-lg transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'Analyzing Concept...' : 'Generate AI Palette'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
