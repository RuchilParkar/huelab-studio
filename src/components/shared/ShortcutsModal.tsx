import React from 'react';
import { Modal } from './Modal';
import { Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: 'Space', desc: 'Generate a new harmonious palette' },
    { key: 'L', desc: 'Lock or unlock the selected color' },
    { key: 'C', desc: 'Copy hex code of focused color' },
    { key: '1 – 9', desc: 'Focus color swatch by index' },
    { key: 'E', desc: 'Open Export Center' },
    { key: 'Esc', desc: 'Close any active modal or color picker' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Keyboard Shortcuts"
      description="Accelerate your workflow with quick keyboard navigation."
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-3">
        {shortcuts.map((s) => (
          <div
            key={s.key}
            className="flex items-center justify-between p-2.5 bg-[#171A22] border border-[#272B36] rounded-xl"
          >
            <span className="text-xs text-[#9298A6]">{s.desc}</span>
            <span className="kbd-badge">{s.key}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
};
