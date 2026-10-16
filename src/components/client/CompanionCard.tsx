// ==========================================
// COMPANIONX: PREMIUM COMPANION PROFILE CARD
// ==========================================

import React from 'react';
import {
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Languages,
  ArrowRight,
  Heart,
  Camera,
  Send,
  CheckCircle,
} from 'lucide-react';
import { CompanionProfile } from '../../types';
import { BRAND_CONFIG } from '../../config/brand';

interface CompanionCardProps {
  companion: CompanionProfile;
  onViewProfile: (companion: CompanionProfile) => void;
  onBookNow: (companion: CompanionProfile) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (companionId: string) => void;
}

export const CompanionCard: React.FC<CompanionCardProps> = ({
  companion,
  onViewProfile,
  onBookNow,
  isFavorite = false,
  onToggleFavorite,
}) => {
  // Lowest rate among services
  const minRate = companion.servicesOffered.length > 0
    ? Math.min(...companion.servicesOffered.map((s) => s.hourlyRate))
    : 1500;

  const telegramChatLink = `${BRAND_CONFIG.telegramSupportUrl}?text=${encodeURIComponent(
    `Hello Concierge, I would like to book or inquire about escort/companion ${companion.fullName} (${companion.city}, ₹${minRate}/hr).`
  )}`;

  return (
    <div className="group bg-gradient-to-b from-[#0E132D] to-[#070A1C] rounded-3xl border border-[#1B214B] hover:border-pink-500/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/40 flex flex-col text-left relative">
      {/* Photo Header */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onViewProfile(companion)}>
        <img
          src={companion.approvedPhotos[0]}
          alt={companion.fullName}
          loading="lazy"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E132D] via-transparent to-black/40" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
            {companion.verificationStatus === 'approved' && (
              <span className="flex items-center gap-1 bg-[#060714]/85 backdrop-blur-md border border-[#00D2FF]/60 text-[#00D2FF] px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified ID</span>
              </span>
            )}
            {companion.featured && (
              <span className="flex items-center gap-1 bg-gradient-to-r from-pink-500/30 to-purple-500/30 backdrop-blur-md border border-pink-500/50 text-pink-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                <Sparkles className="w-3 h-3 text-pink-400" />
                <span>VIP Elite</span>
              </span>
            )}
            {companion.approvedPhotos && companion.approvedPhotos.length > 1 && (
              <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/20 text-slate-200 px-2 py-0.5 rounded-full text-[10px] font-mono">
                <Camera className="w-3 h-3 text-[#00D2FF]" />
                <span>{companion.approvedPhotos.length}</span>
              </span>
            )}
          </div>

          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(companion.id);
              }}
              className="p-2 rounded-full bg-[#060714]/80 backdrop-blur-md text-white hover:text-[#FF0080] transition-colors pointer-events-auto shadow-md"
              title="Add to Favorites"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-[#FF0080] text-[#FF0080]' : ''}`}
              />
            </button>
          )}
        </div>

        {/* Bottom Photo Overlay Info */}
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
          <div className="flex items-baseline justify-between mb-0.5">
            <h3 className="text-lg sm:text-xl font-black text-white font-sans tracking-tight flex items-center gap-1.5 drop-shadow-md">
              {companion.fullName}, {companion.age}
            </h3>
            {companion.rating > 0 && (
              <div className="flex items-center gap-1 text-xs font-bold text-pink-300 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-pink-500/30 shadow-md">
                <Star className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                <span>{companion.rating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400">({companion.totalReviews})</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-200 line-clamp-1 mb-1.5 font-medium drop-shadow-sm">
            {companion.profession} • <span className="text-cyan-300">{companion.height}</span>
          </p>

          <div className="flex items-center gap-3 text-[11px] text-slate-300">
            <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
              <MapPin className="w-3 h-3 text-[#00D2FF]" />
              <span className="truncate max-w-[120px]">{companion.city}</span>
            </span>
            <span className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
              <Languages className="w-3 h-3 text-purple-400" />
              <span>{companion.languages.slice(0, 2).join(', ')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {companion.bio}
        </p>

        {/* Service Badges */}
        <div className="flex flex-wrap gap-1.5">
          {companion.servicesOffered.slice(0, 2).map((s, idx) => (
            <span
              key={idx}
              className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-[#141B3B] text-cyan-200 border border-cyan-500/20"
            >
              {s.title}
            </span>
          ))}
          {companion.servicesOffered.length > 2 && (
            <span className="text-[10px] font-medium px-2 py-1 rounded-lg bg-[#141B3B] text-slate-400 border border-slate-700/50">
              +{companion.servicesOffered.length - 2} more
            </span>
          )}
        </div>

        {/* Pricing & CTA Controls */}
        <div className="pt-3 border-t border-[#1B214B] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
              Tariff from
            </span>
            <div className="text-sm sm:text-base font-extrabold text-white font-mono">
              <span className="brand-gradient-text">₹{minRate.toLocaleString('en-IN')}</span>
              <span className="text-xs font-normal text-slate-400">/hr</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href={telegramChatLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all flex items-center gap-1"
              title="Quick Chat with Concierge on Telegram"
            >
              <Send className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span className="hidden sm:inline">Inquire</span>
            </a>

            <button
              onClick={() => onBookNow(companion)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white brand-button shadow-lg shadow-pink-500/25 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Book Date</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
