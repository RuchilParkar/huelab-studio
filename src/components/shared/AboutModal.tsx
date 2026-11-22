import React from 'react';
import { Modal } from './Modal';
import { Palette, ShieldCheck, Cpu, Code2, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="About HueLab"
      description="Advanced Color Intelligence & Palette Studio"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4 text-xs text-[#9298A6] leading-relaxed">
        <div className="flex items-center gap-3 p-3 bg-[#0B0C10] border border-[#272B36] rounded-xl">
          <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/20 border border-[#7C5CFC]/30 flex items-center justify-center text-[#A78BFA] shrink-0">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#F4F5F7]">HueLab Studio v1.0.0</h4>
            <p className="text-[#626A78]">Explore Color. Build Harmony.</p>
          </div>
        </div>

        <p>
          HueLab is engineered for UI/UX designers, creative technologists, and frontend developers who need mathematically accurate, perceptually uniform color palettes and production-ready design tokens.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="p-3 bg-[#171A22] border border-[#272B36] rounded-xl">
            <Cpu className="w-4 h-4 text-[#A78BFA] mb-1.5" />
            <h5 className="font-semibold text-[#F4F5F7] mb-0.5">Perceptual Engine</h5>
            <p className="text-[11px] text-[#626A78]">OKLCH & HSL harmonic distribution</p>
          </div>
          <div className="p-3 bg-[#171A22] border border-[#272B36] rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1.5" />
            <h5 className="font-semibold text-[#F4F5F7] mb-0.5">WCAG 2.2 Ready</h5>
            <p className="text-[11px] text-[#626A78]">Mathematical contrast verification</p>
          </div>
        </div>

        <div className="p-3 bg-[#171A22] border border-[#272B36] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#F4F5F7]">
            <Code2 className="w-4 h-4 text-[#A78BFA]" />
            <span>Zero Server Footprint</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">100% Local</span>
        </div>

        <div className="text-center pt-2 text-[#626A78] text-[11px]">
          Designed with intentional restraint and precision.
        </div>
      </div>
    </Modal>
  );
};
