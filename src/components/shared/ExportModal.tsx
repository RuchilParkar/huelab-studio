import React, { useState } from 'react';
import { Modal } from './Modal';
import { useHueStore } from '../../store/useHueStore';
import {
  exportToCssVariables,
  exportToJson,
  exportToTailwindConfig,
  exportToScssVariables,
  exportPaletteCardPng,
  downloadFile,
  downloadDataUrl,
} from '../../engine/exportEngine';
import { Check, Copy, Download, FileCode, FileJson, Image as ImageIcon } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportTab = 'css' | 'json' | 'tailwind' | 'scss' | 'png';

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { currentPalette, addToast } = useHueStore();
  const [activeTab, setActiveTab] = useState<ExportTab>('css');
  const [copied, setCopied] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);

  const getExportContent = (): string => {
    switch (activeTab) {
      case 'css':
        return exportToCssVariables(currentPalette);
      case 'json':
        return exportToJson(currentPalette);
      case 'tailwind':
        return exportToTailwindConfig(currentPalette);
      case 'scss':
        return exportToScssVariables(currentPalette);
      case 'png':
        return '';
    }
  };

  const handleCopy = async () => {
    const text = getExportContent();
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      addToast('Copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    const filenameBase = currentPalette.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (activeTab === 'png') {
      try {
        setIsExportingPng(true);
        const dataUrl = await exportPaletteCardPng(currentPalette);
        downloadDataUrl(dataUrl, `${filenameBase}-huelab.png`);
        addToast('Downloaded palette card PNG', 'success');
      } catch (err) {
        addToast('Failed to export PNG', 'error');
      } finally {
        setIsExportingPng(false);
      }
      return;
    }

    const content = getExportContent();
    const configMap: Record<ExportTab, { ext: string; mime: string }> = {
      css: { ext: 'css', mime: 'text/css' },
      json: { ext: 'json', mime: 'application/json' },
      tailwind: { ext: 'js', mime: 'application/javascript' },
      scss: { ext: 'scss', mime: 'text/x-scss' },
      png: { ext: 'png', mime: 'image/png' },
    };

    const cfg = configMap[activeTab];
    downloadFile(content, `${filenameBase}.${cfg.ext}`, cfg.mime);
    addToast(`Downloaded ${cfg.ext.toUpperCase()} file`, 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export tokens"
      description={`Production design tokens for "${currentPalette.name}"`}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-4">
        {/* Format Selector Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-[#141720] border border-[#222632] rounded-lg overflow-x-auto">
          {[
            { id: 'css', label: 'CSS Variables', icon: FileCode },
            { id: 'json', label: 'JSON Tokens', icon: FileJson },
            { id: 'tailwind', label: 'Tailwind CSS', icon: FileCode },
            { id: 'scss', label: 'SCSS Variables', icon: FileCode },
            { id: 'png', label: 'PNG Spec Card', icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ExportTab)}
                className={`flex items-center gap-1.5 h-7 px-2.5 rounded-md text-xs font-medium transition-colors shrink-0 ${
                  isActive
                    ? 'bg-[#1F2432] text-[#F1F3F7] border border-[#2D3445] shadow-sm'
                    : 'text-[#8E95A5] hover:text-[#F1F3F7]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content View */}
        {activeTab === 'png' ? (
          <div className="flex flex-col items-center justify-center p-6 bg-[#08090C] border border-[#222632] rounded-lg text-center">
            <div className="flex items-center gap-1 mb-5 h-14 w-full max-w-sm rounded overflow-hidden border border-[#222632]">
              {currentPalette.colors.map((c) => (
                <div key={c.id} style={{ backgroundColor: c.hex }} className="flex-1 h-full" />
              ))}
            </div>
            <h4 className="text-xs font-semibold text-[#F1F3F7] mb-1">High-resolution spec sheet</h4>
            <p className="text-[11px] text-[#8E95A5] max-w-xs mb-5">
              Exports a 1200x630 calibrated specimen card with color swatches, hex coordinates, and contrast ratios.
            </p>
            <button
              onClick={handleDownload}
              disabled={isExportingPng}
              className="flex items-center gap-1.5 h-8 px-3.5 bg-[#F1F3F7] hover:bg-white disabled:opacity-40 text-[#0B0C10] text-xs font-semibold rounded-lg btn-highlight shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExportingPng ? 'Generating card...' : 'Download PNG spec'}</span>
            </button>
          </div>
        ) : (
          <div className="relative">
            <pre className="p-3.5 bg-[#08090C] border border-[#222632] rounded-lg text-xs font-mono text-[#F1F3F7] overflow-x-auto max-h-72 leading-relaxed">
              <code>{getExportContent()}</code>
            </pre>
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 h-7 px-2.5 bg-[#141720] hover:bg-[#1E2330] border border-[#222632] text-[#F1F3F7] text-xs font-medium rounded-md transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 h-7 px-2.5 bg-[#F1F3F7] hover:bg-white text-[#0B0C10] text-xs font-semibold rounded-md btn-highlight shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
