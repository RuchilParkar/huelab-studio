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
} from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const { activePage, setActivePage, favorites } = useHueStore();

  const navItems: { id: PageView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'generator', label: 'Palette', icon: Palette },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'image-extractor', label: 'Extract', icon: ImageIcon },
    { id: 'gradient', label: 'Gradient', icon: Flame },
    { id: 'contrast', label: 'Contrast', icon: ShieldCheck },
    { id: 'color-converter', label: 'Convert', icon: ArrowRightLeft },
    { id: 'favorites', label: 'Saved', icon: Heart, badge: favorites.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111319] border-t border-[#272B36] px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[10px] font-medium transition-colors relative ${
              isActive ? 'text-[#A78BFA]' : 'text-[#626A78] hover:text-[#9298A6]'
            }`}
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#7C5CFC]" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
