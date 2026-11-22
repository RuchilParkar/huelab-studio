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
    { id: 'generator', label: 'Generator', icon: Palette },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'image-extractor', label: 'Image Extractor', icon: ImageIcon },
    { id: 'gradient', label: 'Gradient Studio', icon: Flame },
    { id: 'contrast', label: 'Contrast Checker', icon: ShieldCheck },
    { id: 'color-converter', label: 'Color Converter', icon: ArrowRightLeft },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favorites.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#111319] border-r border-[#272B36] select-none shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#272B36] flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C5CFC] to-[#EC4899] p-0.5 flex items-center justify-center shadow-lg shadow-[#7C5CFC]/20">
          <div className="w-full h-full bg-[#111319] rounded-[10px] flex items-center justify-center">
            <Palette className="w-5 h-5 text-[#A78BFA]" />
          </div>
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-[#F4F5F7] leading-none">
            Hue<span className="text-[#A78BFA]">Lab</span>
          </h1>
          <p className="text-[11px] text-[#626A78] mt-1 font-medium tracking-wide">
            Explore Color. Build Harmony.
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold text-[#626A78] tracking-wider uppercase px-3 py-2">
          Studio Tools
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#171A22] text-[#F4F5F7] border border-[#272B36] shadow-sm'
                  : 'text-[#9298A6] hover:text-[#F4F5F7] hover:bg-[#171A22]/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#A78BFA]' : 'text-[#626A78] group-hover:text-[#9298A6]'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#272B36] text-[#A78BFA] font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-[#272B36] space-y-1 bg-[#0B0C10]/40">
        <button
          onClick={onOpenShortcuts}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#9298A6] hover:text-[#F4F5F7] hover:bg-[#171A22] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-3.5 h-3.5 text-[#626A78]" />
            <span>Shortcuts</span>
          </div>
          <span className="kbd-badge">?</span>
        </button>

        <button
          onClick={onOpenAbout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#9298A6] hover:text-[#F4F5F7] hover:bg-[#171A22] transition-colors"
        >
          <Info className="w-3.5 h-3.5 text-[#626A78]" />
          <span>About HueLab</span>
        </button>

        <div className="pt-2 px-3 flex items-center justify-between text-[11px] text-[#626A78]">
          <span>HueLab v1.0.0</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Local</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
