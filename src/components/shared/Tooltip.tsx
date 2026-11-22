import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  shortcut?: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  shortcut,
  children,
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const posClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }[position];

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute ${posClasses} z-40 whitespace-nowrap px-2.5 py-1 bg-[#171A22] border border-[#272B36] text-[#F4F5F7] text-xs rounded-md shadow-xl pointer-events-none flex items-center gap-1.5 animate-fade-in`}
          role="tooltip"
        >
          <span>{content}</span>
          {shortcut && <span className="kbd-badge">{shortcut}</span>}
        </div>
      )}
    </div>
  );
};
