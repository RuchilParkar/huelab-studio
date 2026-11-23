import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B0C10]/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-[#0E1015] border border-[#222632] rounded-xl shadow-2xl z-10 overflow-hidden max-h-[92vh] flex flex-col`}
        role="dialog"
        aria-modal="true"
      >
        {(title || description) && (
          <div className="flex items-start justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[#222632] shrink-0">
            <div>
              {title && <h2 className="text-sm font-semibold text-[#F1F3F7]">{title}</h2>}
              {description && <p className="text-xs text-[#8E95A5] mt-0.5">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-[#64748B] hover:text-[#F1F3F7] hover:bg-[#141720] p-1 rounded-md transition-colors ml-4"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-3.5 sm:p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
