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
      description="Calibrated color studio and design-token workbench"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-3.5 text-xs text-[#8E95A5] leading-relaxed">
        <div className="flex items-center gap-3 p-3 bg-[#08090C] border border-[#222632] rounded-lg">
          <div className="w-8 h-8 rounded-md bg-[#141720] border border-[#2B303F] flex items-center justify-center shrink-0">
            <div className="w-3.5 h-3.5 grid grid-cols-2 gap-0.5">
              <span className="bg-[#A78BFA] rounded-[1px]" />
              <span className="bg-[#7C5CFC] rounded-[1px]" />
              <span className="bg-[#38BDF8] rounded-[1px]" />
              <span className="bg-[#F1F3F7] rounded-[1px]" />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[#F1F3F7]">HueLab Studio v1.0.0</h4>
            <p className="text-[#64748B]">Optical color intelligence instrument</p>
          </div>
        </div>

        <p>
          HueLab is engineered for UI/UX designers, creative developers, and frontend architects who require deterministic color harmonies, perceptual lightness calibration, and exportable design tokens.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2.5 bg-[#141720] border border-[#222632] rounded-lg">
            <Cpu className="w-3.5 h-3.5 text-[#8E95A5] mb-1" />
            <h5 className="font-semibold text-[#F1F3F7] text-[11px] mb-0.5">Perceptual Engine</h5>
            <p className="text-[10px] text-[#64748B]">OKLCH & HSL harmonic distribution</p>
          </div>
          <div className="p-2.5 bg-[#141720] border border-[#222632] rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mb-1" />
            <h5 className="font-semibold text-[#F1F3F7] text-[11px] mb-0.5">WCAG 2.2 Ready</h5>
            <p className="text-[10px] text-[#64748B]">Mathematical contrast verification</p>
          </div>
        </div>

        <div className="p-2.5 bg-[#141720] border border-[#222632] rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#F1F3F7]">
            <Code2 className="w-3.5 h-3.5 text-[#8E95A5]" />
            <span>Zero server footprint</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">100% Client-side</span>
        </div>

        <div className="text-center pt-1 text-[#64748B] text-[11px]">
          Designed with architectural restraint and functional clarity.
        </div>
      </div>
    </Modal>
  );
};
