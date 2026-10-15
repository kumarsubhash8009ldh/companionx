// ==========================================
// COMPANIONX: EMERGENCY SOS & SAFETY MODAL
// ==========================================

import React, { useState } from 'react';
import {
  PhoneCall,
  ShieldAlert,
  X,
  MapPin,
  AlertOctagon,
  CheckCircle2,
  ExternalLink,
  Shield,
  MessageCircle,
} from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';
import { store } from '../../services/store';

interface SafetySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetySosModal: React.FC<SafetySosModalProps> = ({ isOpen, onClose }) => {
  const [sosTriggered, setSosTriggered] = useState(false);

  if (!isOpen) return null;

  const handleTriggerPlatformSos = () => {
    const user = store.getCurrentUser();
    // Record into safety reports & audit logs
    store.fileSafetyReport({
      reportedUserId: 'emergency_sos_dispatch',
      reportedUserName: 'Emergency SOS Signal',
      reasonCategory: 'harassment',
      description: `URGENT SOS triggered by ${user?.fullName || 'Client'} (${user?.phone || 'Mobile'}). Platform concierge dispatch dispatched emergency protocol.`,
    });
    setSosTriggered(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0B132B] border border-rose-500/40 rounded-2xl max-w-lg w-full p-6 text-left relative shadow-2xl shadow-rose-900/30 overflow-hidden">
        {/* Top Warning Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <PhoneCall className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif tracking-tight">
                Safety & Emergency Hub
              </h3>
              <p className="text-xs text-rose-300">
                24/7 Rapid Assistance & Emergency Helplines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C2541] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SOS Action Card */}
        <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-4 mb-5">
          {!sosTriggered ? (
            <div className="text-center">
              <p className="text-xs text-rose-200 mb-3">
                Feeling uncomfortable or in immediate need of concierge intervention during an ongoing booking?
              </p>
              <button
                onClick={handleTriggerPlatformSos}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <AlertOctagon className="w-5 h-5" />
                <span>Trigger Platform 24/7 SOS Alert</span>
              </button>
              <p className="text-[11px] text-slate-400 mt-2">
                This immediately alerts our safety dispatch team with your current booking details.
              </p>
            </div>
          ) : (
            <div className="text-center py-2 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-emerald-300">
                Emergency Alert Broadcasted
              </h4>
              <p className="text-xs text-slate-300">
                Our safety response team has received your beacon. For immediate life danger, please dial 112 below.
              </p>
            </div>
          )}
        </div>

        {/* Dedicated 24/7 WhatsApp Customer Care Card */}
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 mb-5 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Companio Customer Care (24/7)</h4>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded font-mono">
              ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Directly connect with Companio Official Customer Care for booking assistance, payment queries, or urgent concierge support.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={BRAND_CONFIG.whatsAppSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-900/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: 7009080906</span>
            </a>
            <a
              href="tel:7009080906"
              className="py-2.5 px-3 rounded-lg bg-[#070B19] hover:bg-[#121736] border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Call: +91 70090 80906</span>
            </a>
          </div>
        </div>

        {/* National Hotlines List */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Official Indian Emergency Hotlines
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BRAND_CONFIG.emergencyHotlines.map((hotline, idx) => (
              <a
                key={idx}
                href={`tel:${hotline.number.replace(/-/g, '')}`}
                className="p-3 rounded-lg bg-[#070B19] border border-[#1C2541] hover:border-[#D4AF37]/50 hover:bg-[#1C2541]/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                    {hotline.name}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1">
                    {hotline.description}
                  </div>
                </div>
                <span className="text-sm font-bold text-[#D4AF37] shrink-0 font-mono ml-2">
                  {hotline.number}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Essential Safety Protocol */}
        <div className="bg-[#070B19]/60 rounded-xl p-3.5 border border-[#1C2541] text-[11px] text-slate-300 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-[#D4AF37]">
            <Shield className="w-3.5 h-3.5" />
            <span>CompanionX Golden Safety Rules</span>
          </div>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li>Always meet in reputable public spaces (cafes, fine restaurants, galleries).</li>
            <li>Never disclose personal home addresses or sensitive banking credentials.</li>
            <li>Share your itinerary with a trusted friend or family member.</li>
            <li>Payments must strictly go through CompanionX; never offer or accept off-platform cash.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
