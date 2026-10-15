// ==========================================
// COMPANIONX: MANDATORY 18+ AGE GATE & POLICY MODAL
// ==========================================

import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Scale } from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';

interface AgeGateModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({ isOpen, onConfirm }) => {
  const [certifyAge, setCertifyAge] = useState(false);
  const [certifyNonSexual, setCertifyNonSexual] = useState(false);
  const [certifyTerms, setCertifyTerms] = useState(false);

  if (!isOpen) return null;

  const canProceed = certifyAge && certifyNonSexual && certifyTerms;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0B0E23] border border-purple-500/30 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-purple-900/40 text-left relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080]" />

        {/* Logo & Heading */}
        <div className="flex items-center gap-3.5 mb-5">
          <img
            src="/logo.jpg"
            alt="Companio"
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/30 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black brand-gradient-text tracking-tight font-sans">
                {BRAND_CONFIG.appName}
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-pink-300 border border-purple-500/30">
                18+ Only
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Age Declaration & Lawful Companionship Pledge
            </p>
          </div>
        </div>

        {/* Strict Non-Sexual Companionship Notice */}
        <div className="bg-[#060714] border border-pink-500/30 rounded-2xl p-4 mb-5 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-pink-400 font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#FF0080]" />
            <span>Strictly Lawful Non-Sexual Platform</span>
          </div>
          <p className="leading-relaxed">
            {BRAND_CONFIG.strictlyNonSexualNotice}
          </p>
          <p className="text-slate-400 text-[11px] pt-1 border-t border-slate-800">
            Acceptable services: Dining accompaniment, weddings & social galas, art & cultural walks, intellectual conversations, and fitness partners.
          </p>
        </div>

        {/* Mandatory Checkboxes */}
        <div className="space-y-3 mb-6">
          <label className="flex items-start gap-3 p-3 rounded-xl bg-[#121736]/60 border border-[#1B214B] cursor-pointer hover:bg-[#121736] transition-colors">
            <input
              type="checkbox"
              checked={certifyAge}
              onChange={(e) => setCertifyAge(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-[#FF0080] focus:ring-[#FF0080] bg-[#060714]"
            />
            <span className="text-xs text-slate-200 leading-normal">
              <strong>I certify that I am at least 18 years of age</strong> (under Indian law) and have full legal capacity to enter into binding agreements.
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-[#121736]/60 border border-[#1B214B] cursor-pointer hover:bg-[#121736] transition-colors">
            <input
              type="checkbox"
              checked={certifyNonSexual}
              onChange={(e) => setCertifyNonSexual(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-[#FF0080] focus:ring-[#FF0080] bg-[#060714]"
            />
            <span className="text-xs text-slate-200 leading-normal">
              <strong>I agree not to solicit sexual acts, prostitution, or any unlawful services.</strong> I acknowledge that doing so leads to immediate ban and legal reporting.
            </span>
          </label>

          <label className="flex items-start gap-3 p-3 rounded-xl bg-[#121736]/60 border border-[#1B214B] cursor-pointer hover:bg-[#121736] transition-colors">
            <input
              type="checkbox"
              checked={certifyTerms}
              onChange={(e) => setCertifyTerms(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-[#FF0080] focus:ring-[#FF0080] bg-[#060714]"
            />
            <span className="text-xs text-slate-200 leading-normal">
              I accept the <strong>Terms of Service</strong>, <strong>Privacy Policy</strong>, and <strong>Cancellation & Refund Rules</strong>.
            </span>
          </label>
        </div>

        {/* CTA Button */}
        <button
          disabled={!canProceed}
          onClick={onConfirm}
          className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            canProceed
              ? 'brand-button cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Confirm Eligibility & Enter Companio</span>
        </button>

        <p className="text-center text-[11px] text-slate-500 mt-3">
          If you are under 18 or seeking sexual services, please exit immediately.
        </p>
      </div>
    </div>
  );
};
