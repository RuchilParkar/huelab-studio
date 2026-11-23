import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNavigation } from './MobileNavigation';
import { useHueStore } from '../../store/useHueStore';
import { ToastContainer } from '../shared/Toast';
import { ExportModal } from '../shared/ExportModal';
import { AiPaletteModal } from '../shared/AiPaletteModal';
import { ShortcutsModal } from '../shared/ShortcutsModal';
import { AboutModal } from '../shared/AboutModal';
import { copyToClipboard } from '../../utils/clipboard';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const {
    activePage,
    generateNewPalette,
    toggleFocusedLock,
    currentPalette,
    focusedColorIndex,
    setFocusedColorIndex,
    preferences,
    addToast,
  } = useHueStore();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    if (!preferences.enableKeyboardShortcuts) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger shortcuts if typing inside inputs, textareas, or contenteditables
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Space -> Generate new palette
      if (e.code === 'Space') {
        e.preventDefault();
        if (activePage === 'generator') {
          generateNewPalette();
        }
      }

      // 'L' -> Lock/Unlock focused color
      if (e.key === 'l' || e.key === 'L') {
        if (activePage === 'generator') {
          toggleFocusedLock();
        }
      }

      // 'C' -> Copy focused color
      if (e.key === 'c' || e.key === 'C') {
        if (activePage === 'generator' && currentPalette.colors[focusedColorIndex]) {
          const hex = currentPalette.colors[focusedColorIndex].hex;
          copyToClipboard(hex).then((ok) => {
            if (ok) addToast(`Copied ${hex} to clipboard`, 'success');
          });
        }
      }

      // 'E' -> Open Export Center
      if (e.key === 'e' || e.key === 'E') {
        setIsExportOpen(true);
      }

      // '?' -> Open Shortcuts
      if (e.key === '?') {
        setIsShortcutsOpen(true);
      }

      // Numbers 1-9 to focus color swatches
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= currentPalette.colors.length) {
        setFocusedColorIndex(num - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activePage,
    preferences.enableKeyboardShortcuts,
    generateNewPalette,
    toggleFocusedLock,
    currentPalette,
    focusedColorIndex,
    setFocusedColorIndex,
    addToast,
  ]);

  return (
    <div className="flex min-h-screen bg-[#0B0C10] text-[#F4F5F7]">
      {/* Desktop Sidebar */}
      <Sidebar
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onOpenExport={() => setIsExportOpen(true)}
          onOpenAi={() => setIsAiOpen(true)}
        />

        <main className="flex-1 p-3 sm:p-4 md:p-6 pb-24 md:pb-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation />

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Shared Modals */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <AiPaletteModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
};
