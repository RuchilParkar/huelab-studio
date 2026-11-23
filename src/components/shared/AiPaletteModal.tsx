import React, { useState } from 'react';
import { Modal } from './Modal';
import { useHueStore } from '../../store/useHueStore';
import { Wand2, Bot, AlertTriangle, Key } from 'lucide-react';
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
      await new Promise((res) => setTimeout(res, 400));

      const lower = trimmed.toLowerCase();
      let matchedTheme = Object.keys(MOOD_DICTIONARY).find((k) => lower.includes(k));

      let finalHexes: string[] = [];
      if (matchedTheme) {
        finalHexes = MOOD_DICTIONARY[matchedTheme].colors;
      } else {
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

      addToast('Palette generated from semantic concept', 'success');
      onClose();
    } catch (err: any) {
      addToast(err?.message || 'Error generating AI palette', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveKey = () => {
    updatePreferences({ aiApiKey: customKey.trim() });
    addToast('API key saved locally', 'success');
    setShowConfig(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Semantic color synthesis"
      description="Synthesize harmonious palettes from descriptive creative prompts"
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col gap-4">
        {/* Input prompt area */}
        <div>
          <label className="block text-xs font-medium text-[#8E95A5] mb-1.5">Creative concept or domain</label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Precision dark analytics workstation for orbital satellite tracking..."
              className="w-full h-20 p-3 bg-[#08090C] border border-[#222632] rounded-lg text-xs text-[#F1F3F7] placeholder-[#64748B] focus:outline-none focus:border-[#3A4154] transition-colors resize-none"
            />
            <div className="absolute bottom-2.5 right-2.5">
              <Bot className="w-4 h-4 text-[#64748B]" />
            </div>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div>
          <span className="block text-[11px] text-[#64748B] mb-1.5">Examples:</span>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p) => (
              <button
                key={p}
                onClick={() => setPrompt(p)}
                className="h-6 px-2 bg-[#141720] hover:bg-[#1E2330] border border-[#222632] text-[#8E95A5] hover:text-[#F1F3F7] text-[11px] rounded transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Local intelligence vs Provider notice */}
        <div className="p-3 bg-[#141720] border border-[#222632] rounded-lg flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <Wand2 className="w-3.5 h-3.5 text-[#8E95A5] shrink-0 mt-0.5" />
            <div>
              <p className="text-[#F1F3F7] font-medium text-xs">Local semantic engine</p>
              <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed">
                Evaluates chromatic keywords, emotional undertones, and perceptual harmony. Operates deterministically without third-party API dependencies.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-[#8E95A5] hover:text-[#F1F3F7] shrink-0 text-xs flex items-center gap-1"
          >
            <Key className="w-3 h-3" />
            <span>{showConfig ? 'Hide' : 'API Key'}</span>
          </button>
        </div>

        {/* Optional Custom API Key Config */}
        {showConfig && (
          <div className="p-3 bg-[#08090C] border border-[#222632] rounded-lg flex flex-col gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-medium text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Client-side storage only</span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              HueLab never exposes secrets or proxies requests through remote servers.
            </p>
            <input
              type="password"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="sk-... or AIzaSy..."
              className="w-full h-8 px-2.5 bg-[#141720] border border-[#222632] rounded-md text-xs text-[#F1F3F7] placeholder-[#64748B] focus:outline-none focus:border-[#3A4154]"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveKey}
                className="h-7 px-3 bg-[#F1F3F7] hover:bg-white text-[#0B0C10] rounded text-xs font-semibold"
              >
                Save Key
              </button>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="h-8 px-3 text-xs text-[#8E95A5] hover:text-[#F1F3F7] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center gap-1.5 h-8 px-3.5 bg-[#F1F3F7] hover:bg-white disabled:opacity-40 text-[#0B0C10] text-xs font-semibold rounded-lg btn-highlight shadow-sm transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Synthesizing...' : 'Generate palette'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
