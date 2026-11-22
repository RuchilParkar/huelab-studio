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
      title="Export Palette"
      description={`Export "${currentPalette.name}" in production-ready formats.`}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-5">
        {/* Format Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#171A22] border border-[#272B36] rounded-xl overflow-x-auto">
          {[
            { id: 'css', label: 'CSS Variables', icon: FileCode },
            { id: 'json', label: 'JSON Tokens', icon: FileJson },
            { id: 'tailwind', label: 'Tailwind CSS', icon: FileCode },
            { id: 'scss', label: 'SCSS', icon: FileCode },
            { id: 'png', label: 'PNG Image Card', icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ExportTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#7C5CFC] text-white shadow-md'
                    : 'text-[#9298A6] hover:text-[#F4F5F7] hover:bg-[#272B36]/50'
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
          <div className="flex flex-col items-center justify-center p-8 bg-[#0B0C10] border border-[#272B36] rounded-xl text-center">
            <div className="flex items-center gap-1.5 mb-6 h-16 w-full max-w-md rounded-lg overflow-hidden border border-[#272B36]">
              {currentPalette.colors.map((c) => (
                <div key={c.id} style={{ backgroundColor: c.hex }} className="flex-1 h-full" />
              ))}
            </div>
            <h4 className="text-sm font-semibold text-[#F4F5F7] mb-1">High-Resolution Social Card</h4>
            <p className="text-xs text-[#9298A6] max-w-sm mb-6">
              Renders a 1200x630 branded showcase card with color values, typography, and harmony metadata.
            </p>
            <button
              onClick={handleDownload}
              disabled={isExportingPng}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#7C5CFC] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-sm font-medium rounded-xl shadow-lg transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPng ? 'Generating Card...' : 'Download High-Res PNG'}</span>
            </button>
          </div>
        ) : (
          <div className="relative">
            <pre className="p-4 bg-[#0B0C10] border border-[#272B36] rounded-xl text-xs font-mono text-[#F4F5F7] overflow-x-auto max-h-72 leading-relaxed selection:bg-[#7C5CFC]/40">
              <code>{getExportContent()}</code>
            </pre>
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#171A22] hover:bg-[#272B36] border border-[#272B36] text-[#F4F5F7] text-xs font-medium rounded-lg transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7C5CFC] hover:bg-[#6D28D9] text-white text-xs font-medium rounded-lg transition-all"
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
