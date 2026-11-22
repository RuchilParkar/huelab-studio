import React, { useState } from 'react';
import { PaletteCanvas } from '../components/palette/PaletteCanvas';
import { PaletteControls } from '../components/palette/PaletteControls';
import { WebsitePreview } from '../components/preview/WebsitePreview';
import { PaletteHistoryDrawer } from '../components/palette/PaletteHistoryDrawer';
import { useHueStore } from '../store/useHueStore';

export const GeneratorPage: React.FC = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { currentPalette } = useHueStore();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Studio Controls */}
      <PaletteControls onOpenHistory={() => setIsHistoryOpen(true)} />

      {/* Main Interactive Color Swatches */}
      <section aria-label="Palette Swatches">
        <PaletteCanvas />
      </section>

      {/* Live Website UI Simulation with Active Palette */}
      <section aria-label="Live Website Simulation" className="pt-4">
        <WebsitePreview />
      </section>

      {/* Palette History Drawer */}
      <PaletteHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
};
