// ==========================================
// COMPANIONX: COMPANION DETAILED PROFILE MODAL
// ==========================================

import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Languages,
  GraduationCap,
  Briefcase,
  Calendar,
  CheckCircle2,
  Flag,
  ArrowRight,
  Heart,
  Info,
  ChevronLeft,
  ChevronRight,
  Camera,
} from 'lucide-react';
import { CompanionProfile, Review } from '../../types';
import { store } from '../../services/store';

interface CompanionDetailModalProps {
  companion: CompanionProfile | null;
  onClose: () => void;
  onBookNow: (companion: CompanionProfile) => void;
  onReport: (companion: CompanionProfile) => void;
}

export const CompanionDetailModal: React.FC<CompanionDetailModalProps> = ({
  companion,
  onClose,
  onBookNow,
  onReport,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!companion) return null;

  const reviews = store.getState().reviews.filter((r) => r.companionId === companion.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#0B132B] border border-[#1C2541] rounded-2xl max-w-3xl w-full my-auto text-left relative shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-10 bg-[#0B132B]/95 backdrop-blur-md px-6 py-4 border-b border-[#1C2541] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white font-serif tracking-tight">
              {companion.fullName}
            </h2>
            <span className="text-sm text-slate-400">({companion.age} yrs)</span>
            {companion.verificationStatus === 'approved' && (
              <span className="flex items-center gap-1 bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] px-2 py-0.5 rounded-full text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C2541] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Photos Showcase (10+ Photos Portfolio) */}
          <div className="space-y-2">
            <div className="aspect-[16/9] sm:aspect-[21/9] rounded-xl overflow-hidden bg-slate-900 border border-[#1C2541] relative group">
              <img
                src={companion.approvedPhotos[selectedPhotoIndex] || companion.approvedPhotos[0]}
                alt={companion.fullName}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Photo Index Tag */}
              <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-mono font-medium text-white flex items-center gap-1.5 border border-white/10">
                <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {selectedPhotoIndex + 1} / {companion.approvedPhotos.length}
                </span>
              </div>

              {/* Navigation Arrows (if more than 1 photo) */}
              {companion.approvedPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPhotoIndex((prev) =>
                        prev === 0 ? companion.approvedPhotos.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-slate-950 backdrop-blur-md transition-all shadow-lg"
                    title="Previous Photo"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedPhotoIndex((prev) =>
                        prev === companion.approvedPhotos.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-slate-950 backdrop-blur-md transition-all shadow-lg"
                    title="Next Photo"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Scrollable Thumbnails Strip for all 10 photos */}
            {companion.approvedPhotos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                {companion.approvedPhotos.map((photo, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all relative ${
                      selectedPhotoIndex === idx
                        ? 'border-[#D4AF37] scale-105 shadow-md shadow-[#D4AF37]/20 ring-1 ring-[#D4AF37]'
                        : 'border-[#1C2541] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-[9px] font-mono text-white px-1 rounded">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Verification Assurance Card */}
          <div className="bg-[#070B19] rounded-xl p-4 border border-[#D4AF37]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Government ID & Authenticity Verified
                </h4>
                <p className="text-xs text-slate-400">
                  Aadhaar / Passport biometric identity cross-checked with 18+ age validation.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md shrink-0 border border-emerald-500/20">
              UIDAI Confirmed
            </span>
          </div>

          {/* Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#070B19] p-3 rounded-xl border border-[#1C2541]">
              <span className="text-[10px] uppercase text-slate-400 block mb-1">Location</span>
              <div className="text-xs font-semibold text-white flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                {companion.city}
              </div>
              <span className="text-[10px] text-slate-500">{companion.serviceRadiusKm} km radius</span>
            </div>

            <div className="bg-[#070B19] p-3 rounded-xl border border-[#1C2541]">
              <span className="text-[10px] uppercase text-slate-400 block mb-1">Profession</span>
              <div className="text-xs font-semibold text-white flex items-center gap-1 line-clamp-1">
                <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
                {companion.profession}
              </div>
            </div>

            <div className="bg-[#070B19] p-3 rounded-xl border border-[#1C2541]">
              <span className="text-[10px] uppercase text-slate-400 block mb-1">Education</span>
              <div className="text-xs font-semibold text-white flex items-center gap-1 line-clamp-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
                {companion.education.split(',')[0]}
              </div>
            </div>

            <div className="bg-[#070B19] p-3 rounded-xl border border-[#1C2541]">
              <span className="text-[10px] uppercase text-slate-400 block mb-1">Height / Stats</span>
              <div className="text-xs font-semibold text-white">
                {companion.height} • {companion.languages.join(', ')}
              </div>
            </div>
          </div>

          {/* Biography */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
              Biography & Temperament
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-[#070B19] p-4 rounded-xl border border-[#1C2541]">
              {companion.bio}
            </p>
          </div>

          {/* Interests & Topics */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-2">
              Interests & Conversational Themes
            </h4>
            <div className="flex flex-wrap gap-2">
              {companion.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#1C2541] text-slate-200 border border-slate-700/60"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Services Offered & Pricing */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-3">
              Available Lawful Services & Tariffs
            </h4>
            <div className="space-y-3">
              {companion.servicesOffered.map((service, idx) => (
                <div
                  key={idx}
                  className="bg-[#070B19] p-4 rounded-xl border border-[#1C2541] hover:border-[#D4AF37]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{service.title}</span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#1C2541] text-[#D4AF37]">
                        Min {service.minHours} hrs
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">
                      {service.description}
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] text-slate-500 block">Tariff</span>
                    <span className="text-base font-bold text-[#D4AF37] font-mono">
                      ₹{service.hourlyRate.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400">/hr</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Client Reviews */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Verified Client Reviews ({reviews.length})
              </h4>
              {companion.rating > 0 && (
                <div className="flex items-center gap-1 text-xs text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{companion.rating.toFixed(1)} / 5.0</span>
                </div>
              )}
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#070B19] p-3.5 rounded-xl border border-[#1C2541] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{rev.clientName}</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                    <span className="text-[10px] text-slate-500 block">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic bg-[#070B19] p-3 rounded-xl border border-[#1C2541]">
                No reviews yet. Be the first to book and share your experience!
              </p>
            )}
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="sticky bottom-0 bg-[#0B132B]/95 backdrop-blur-md px-6 py-4 border-t border-[#1C2541] flex items-center justify-between gap-4">
          <button
            onClick={() => onReport(companion)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report or Block</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-[#1C2541] transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onBookNow(companion)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <span>Request Booking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
