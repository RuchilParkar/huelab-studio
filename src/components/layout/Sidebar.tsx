import React from 'react';
import { useHueStore } from '../../store/useHueStore';
import { PageView } from '../../types';
import {
  Palette,
  Compass,
  Image as ImageIcon,
  Flame,
  ShieldCheck,
  ArrowRightLeft,
  Heart,
  Settings,
  Keyboard,
  Info,
} from 'lucide-react';

interface SidebarProps {
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenShortcuts, onOpenAbout }) => {
  const { activePage, setActivePage, favorites } = useHueStore();

  const navItems: { id: PageView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'generator', label: 'Palette Studio', icon: Palette },
    { id: 'explore', label: 'Curated Palettes', icon: Compass },
    { id: 'image-extractor', label: 'Image Extractor', icon: ImageIcon },
    { id: 'gradient', label: 'Gradient Studio', icon: Flame },
    { id: 'contrast', label: 'Contrast Matrix', icon: ShieldCheck },
    { id: 'color-converter', label: 'Color Converter', icon: ArrowRightLeft },
    { id: 'favorites', label: 'Saved Palettes', icon: Heart, badge: favorites.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 bg-[#0E1015] border-r border-[#222632] select-none shrink-0 h-screen sticky top-0">
      {/* Brand Header: Crisp architectural logo mark */}
      <div className="h-16 px-4 border-b border-[#222632] flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#181B24] border border-[#2B303F] flex items-center justify-center shrink-0">
          <div className="w-3.5 h-3.5 grid grid-cols-2 gap-0.5">
            <span className="bg-[#A78BFA] rounded-[1px]" />
            <span className="bg-[#7C5CFC] rounded-[1px]" />
            <span className="bg-[#38BDF8] rounded-[1px]" />
            <span className="bg-[#F1F3F7] rounded-[1px]" />
          </div>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold tracking-tight text-[#F1F3F7] leading-none">
              HueLab
            </h1>
            <span className="text-[10px] font-mono text-[#64748B] border border-[#232733] px-1 py-0.2 rounded">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-1 font-normal truncate">
            Color Intelligence Studio
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto">
        <div className="text-[11px] font-medium text-[#64748B] px-2.5 pt-1 pb-1.5">
          Studio tools
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between h-9 px-2.5 rounded-lg text-xs font-medium transition-colors group ${
                isActive
                  ? 'bg-[#181B24] text-[#F1F3F7] border border-[#2B303F]'
                  : 'text-[#9CA3AF] hover:text-[#F1F3F7] hover:bg-[#141720]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                  <Icon
                    className={`w-3.5 h-3.5 transition-colors ${
                      isActive ? 'text-[#F1F3F7]' : 'text-[#64748B] group-hover:text-[#9CA3AF]'
                    }`}
                  />
                </span>
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-medium bg-[#1F232F] text-[#9CA3AF]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-2.5 border-t border-[#222632] space-y-0.5 bg-[#0A0B0E]">
        <button
          onClick={onOpenShortcuts}
          className="w-full flex items-center justify-between h-8 px-2.5 rounded-md text-xs text-[#9CA3AF] hover:text-[#F1F3F7] hover:bg-[#141720] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Keyboard className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Shortcuts</span>
          </div>
          <span className="kbd-badge">?</span>
        </button>

        <button
          onClick={onOpenAbout}
          className="w-full flex items-center gap-2 h-8 px-2.5 rounded-md text-xs text-[#9CA3AF] hover:text-[#F1F3F7] hover:bg-[#141720] transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-[#64748B]" />
          <span>About HueLab</span>
        </button>

        <div className="pt-2 px-2.5 flex items-center justify-between text-[11px] text-[#64748B]">
          <span>Local session</span>
          <span className="flex items-center gap-1.5 text-[#8E95A5]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
            <span>Active</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
