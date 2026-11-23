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
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#222632] rounded-xl bg-[#0E1015]/60">
      <div className="w-11 h-11 rounded-lg bg-[#141720] border border-[#222632] flex items-center justify-center mb-3.5 text-[#8E95A5]">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-[#F1F3F7] mb-1">{title}</h3>
      <p className="text-xs text-[#8E95A5] max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="h-8 px-3.5 bg-[#F1F3F7] hover:bg-white text-[#0B0C10] text-xs font-semibold rounded-lg transition-colors btn-highlight shadow-sm"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
