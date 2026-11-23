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
  Cpu,
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
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Upload Zone & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Drag & Drop Zone */}
        <div className="lg:col-span-2">
          <div
            {...getRootProps()}
            className={`h-64 sm:h-80 border border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-[#8E95A5] bg-[#141720]'
                : 'border-[#222632] bg-[#0E1015] hover:border-[#2E3547] hover:bg-[#12141B]'
            }`}
          >
            <input {...getInputProps()} />
            {imageSrc ? (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={imageSrc}
                  alt="Uploaded visual"
                  className="max-h-full max-w-full object-contain rounded shadow-sm"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium backdrop-blur-xs">
                  Click or drag another image to replace
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-lg bg-[#141720] border border-[#222632] flex items-center justify-center mb-3 text-[#8E95A5]">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-semibold text-[#F1F3F7] mb-1">
                  Upload visual to extract palette
                </h4>
                <p className="text-[11px] text-[#8E95A5] max-w-xs mb-3">
                  Drag and drop a PNG, JPG, or WebP image, or click to browse.
                </p>
                <span className="text-[10px] text-[#64748B] font-mono">
                  Local in-browser clustering • Data stays on your device
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Extraction Controls & Meta */}
        <div className="p-4 bg-[#0E1015] border border-[#222632] rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <Cpu className="w-4 h-4 text-[#8E95A5]" />
              <h3 className="text-xs font-semibold text-[#F1F3F7]">Clustering parameters</h3>
            </div>

            {/* Palette size count slider */}
            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between text-xs text-[#8E95A5]">
                <span>Dominant tones</span>
                <span className="font-mono text-[#F1F3F7] tabular-nums">{colorCount} tones</span>
              </div>
              <input
                type="range"
                min={2}
                max={10}
                value={colorCount}
                onChange={(e) => handleCountChange(Number(e.target.value))}
                className="w-full h-1.5 rounded appearance-none cursor-pointer bg-[#222632] accent-[#8E95A5]"
              />
            </div>

            <div className="p-3 bg-[#08090C] border border-[#222632] rounded-lg text-xs text-[#8E95A5] space-y-1">
              <p className="font-medium text-[#F1F3F7] text-[11px]">RGB K-means clustering</p>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Samples pixel clusters in RGB Euclidean space to identify highest-density centroid frequencies while merging adjacent duplicates.
              </p>
            </div>
          </div>

          <div className="pt-3">
            <button
              onClick={handleApplyToStudio}
              disabled={extractedColors.length === 0}
              className="w-full h-8 flex items-center justify-center gap-1.5 bg-[#F1F3F7] hover:bg-white disabled:opacity-30 text-[#0B0C10] text-xs font-semibold rounded-lg btn-highlight shadow-sm transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Apply to Studio Canvas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Extracted Colors Grid */}
      {extractedColors.length > 0 && (
        <div className="p-4 bg-[#0E1015] border border-[#222632] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-[#F1F3F7]">Extracted dominant tones</h4>
            <span className="text-[11px] text-[#64748B] font-mono">Sorted by pixel share</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {extractedColors.map((item) => (
              <div
                key={item.hex}
                onClick={() => handleCopyHex(item.hex)}
                className="p-2.5 bg-[#141720] border border-[#222632] rounded-lg flex flex-col justify-between hover:border-[#2E3547] cursor-pointer transition-colors group"
              >
                <div
                  style={{ backgroundColor: item.hex }}
                  className="h-16 w-full rounded mb-2.5 shadow-inner relative flex items-center justify-center"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white p-1 rounded">
                    {copiedHex === item.hex ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-mono text-xs font-bold text-[#F1F3F7] tabular-nums block">{item.hex}</span>
                  <p className="text-[11px] text-[#8E95A5] truncate mt-0.5">{item.name}</p>
                  <span className="text-[10px] text-[#64748B] font-mono tabular-nums mt-1 block">
                    {item.percentage}% share
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
