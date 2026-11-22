import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractColorsFromImage } from '../engine/colorExtraction';
import { getColorName } from '../engine/colorNaming';
import { assignColorRoles } from '../engine/paletteGenerator';
import { useHueStore } from '../store/useHueStore';
import { ColorItem, Palette } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import {
  UploadCloud,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';

export const ImageExtractorPage: React.FC = () => {
  const { setPalette, setActivePage, addToast } = useHueStore();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<
    { hex: string; percentage: number; name: string }[]
  >([]);
  const [colorCount, setColorCount] = useState<number>(6);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const processImage = useCallback(
    (imgElement: HTMLImageElement, count: number) => {
      try {
        setIsProcessing(true);
        const results = extractColorsFromImage(imgElement, count);
        const enriched = results.map((r: { hex: string; percentage: number }) => ({
          hex: r.hex,
          percentage: r.percentage,
          name: getColorName(r.hex),
        }));
        setExtractedColors(enriched);
        addToast(`Extracted ${enriched.length} dominant colors!`, 'success');
      } catch {
        addToast('Failed to process image colors', 'error');
      } finally {
        setIsProcessing(false);
      }
    },
    [addToast]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        addToast('Please upload a valid image file (PNG, JPG, WebP)', 'error');
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        addToast('Image exceeds 15MB file size limit', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageSrc(result);

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          imageRef.current = img;
          processImage(img, colorCount);
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    },
    [colorCount, processImage, addToast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: false,
  });

  const handleCountChange = (newCount: number) => {
    setColorCount(newCount);
    if (imageRef.current) {
      processImage(imageRef.current, newCount);
    }
  };

  const handleApplyToStudio = () => {
    if (extractedColors.length === 0) return;

    const rawColors: ColorItem[] = extractedColors.map((c, i) => ({
      id: `extracted-${Date.now()}-${i}`,
      hex: c.hex,
      name: c.name,
      locked: false,
    }));

    const roleAssigned = assignColorRoles(rawColors);

    const pal: Palette = {
      id: `extracted-pal-${Date.now()}`,
      name: `Extracted Harmony`,
      colors: roleAssigned,
      harmony: 'custom',
      createdAt: Date.now(),
    };

    setPalette(pal);
    setActivePage('generator');
    addToast('Palette transferred to Studio Canvas with semantic roles!', 'success');
  };

  const handleCopyHex = async (hex: string) => {
    const ok = await copyToClipboard(hex);
    if (ok) {
      setCopiedHex(hex);
      addToast(`Copied ${hex}`, 'success');
      setTimeout(() => setCopiedHex(null), 1500);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Upload Zone & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Drag & Drop Zone */}
        <div className="lg:col-span-2">
          <div
            {...getRootProps()}
            className={`h-72 sm:h-96 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-[#7C5CFC] bg-[#7C5CFC]/10'
                : 'border-[#272B36] bg-[#111319] hover:border-[#7C5CFC]/60 hover:bg-[#171A22]'
            }`}
          >
            <input {...getInputProps()} />
            {imageSrc ? (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
                <img
                  src={imageSrc}
                  alt="Uploaded visual"
                  className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold backdrop-blur-xs">
                  Click or drag another image to replace
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-[#171A22] border border-[#272B36] flex items-center justify-center mb-4 text-[#A78BFA]">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-semibold text-[#F4F5F7] mb-1">
                  Upload an image to extract its palette
                </h4>
                <p className="text-xs text-[#9298A6] max-w-xs mb-4">
                  Drag and drop a PNG, JPG, or WebP file here, or click to browse.
                </p>
                <span className="text-[11px] text-[#626A78] font-mono">
                  100% Client-Side Processing • Never Leaves Your Browser
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Extraction Controls & Meta */}
        <div className="p-5 bg-[#111319] border border-[#272B36] rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-[#A78BFA]" />
              <h3 className="text-sm font-semibold text-[#F4F5F7]">Extraction Parameters</h3>
            </div>

            {/* Palette size count slider */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs text-[#9298A6]">
                <span>Number of Dominant Colors</span>
                <span className="font-mono text-[#F4F5F7] font-semibold">{colorCount} colors</span>
              </div>
              <input
                type="range"
                min={2}
                max={10}
                value={colorCount}
                onChange={(e) => handleCountChange(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#272B36] accent-[#A78BFA]"
              />
            </div>

            <div className="p-3 bg-[#0B0C10] border border-[#272B36] rounded-xl text-xs text-[#9298A6] space-y-1.5">
              <p className="font-medium text-[#F4F5F7]">Perceptual K-Means Algorithm</p>
              <p className="text-[11px] text-[#626A78] leading-relaxed">
                Uses color quantization and centroid clustering to identify dominant chromatic tones while suppressing near-duplicate pixel noise.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleApplyToStudio}
              disabled={extractedColors.length === 0}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#7C5CFC] hover:bg-[#6D28D9] disabled:opacity-40 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Apply to Studio Palette</span>
            </button>
          </div>
        </div>
      </div>

      {/* Extracted Colors Grid */}
      {extractedColors.length > 0 && (
        <div className="p-6 bg-[#111319] border border-[#272B36] rounded-2xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#F4F5F7]">Extracted Dominant Tones</h4>
            <span className="text-xs text-[#626A78] font-mono">Sorted by prominence</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {extractedColors.map((item) => (
              <div
                key={item.hex}
                onClick={() => handleCopyHex(item.hex)}
                className="p-3 bg-[#171A22] border border-[#272B36] rounded-xl flex flex-col justify-between hover:border-[#7C5CFC] cursor-pointer transition-all group"
              >
                <div
                  style={{ backgroundColor: item.hex }}
                  className="h-20 w-full rounded-lg mb-3 shadow-inner relative flex items-center justify-center group-hover:scale-[1.02] transition-transform"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white p-1 rounded-md">
                    {copiedHex === item.hex ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-mono text-xs font-bold text-[#F4F5F7] block">{item.hex}</span>
                  <p className="text-[11px] text-[#9298A6] truncate mt-0.5">{item.name}</p>
                  <span className="text-[10px] text-[#626A78] font-mono mt-1 block">
                    {item.percentage}% of pixels
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
