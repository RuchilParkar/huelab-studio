import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#272B36] rounded-2xl bg-[#111319]/50">
      <div className="w-14 h-14 rounded-2xl bg-[#171A22] border border-[#272B36] flex items-center justify-center mb-4 text-[#A78BFA]">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-[#F4F5F7] mb-1.5">{title}</h3>
      <p className="text-sm text-[#9298A6] max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#7C5CFC] hover:bg-[#6D28D9] text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-[#7C5CFC]/20 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
