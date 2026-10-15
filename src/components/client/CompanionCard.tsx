// ==========================================
// COMPANIONX: COMPANION PROFILE CARD
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
    : 1000;

  return (
    <div className="group bg-[#0B0E23]/90 rounded-3xl border border-[#1B214B] hover:border-purple-500/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/30 flex flex-col text-left">
      {/* Photo Header */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-slate-900">
        <img
          src={companion.approvedPhotos[0]}
          alt={companion.fullName}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E23] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {companion.verificationStatus === 'approved' && (
              <span className="flex items-center gap-1 bg-[#060714]/85 backdrop-blur-md border border-[#00D2FF]/60 text-[#00D2FF] px-2 py-0.5 rounded-full text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            )}
            {companion.featured && (
              <span className="flex items-center gap-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md border border-pink-500/40 text-pink-300 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-pink-400" />
                Spotlight
              </span>
            )}
            {companion.approvedPhotos && companion.approvedPhotos.length > 1 && (
              <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-mono">
                <Camera className="w-3 h-3 text-[#00D2FF]" />
                {companion.approvedPhotos.length}
              </span>
            )}
          </div>

          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(companion.id);
              }}
              className="p-2 rounded-full bg-[#060714]/75 backdrop-blur-md text-white hover:text-[#FF0080] transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? 'fill-[#FF0080] text-[#FF0080]' : ''}`}
              />
            </button>
          )}
        </div>

        {/* Bottom Photo Overlay Info */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-baseline justify-between mb-0.5">
            <h3 className="text-lg font-bold text-white font-sans tracking-tight flex items-center gap-1.5">
              {companion.fullName}, {companion.age}
            </h3>
            {companion.rating > 0 && (
              <div className="flex items-center gap-1 text-xs font-semibold text-pink-300 bg-black/50 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-pink-500/20">
                <Star className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
                <span>{companion.rating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400">({companion.totalReviews})</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-300 line-clamp-1 mb-1 font-medium">
            {companion.profession}
          </p>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#00D2FF]" />
              {companion.city}
            </span>
            <span className="flex items-center gap-1">
              <Languages className="w-3 h-3 text-slate-400" />
              {companion.languages.slice(0, 2).join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
          {companion.bio}
        </p>

        {/* Services Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {companion.servicesOffered.slice(0, 2).map((s, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-lg bg-[#121736] text-purple-200 border border-purple-500/20"
            >
              {s.title}
            </span>
          ))}
          {companion.servicesOffered.length > 2 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-lg bg-[#121736] text-slate-400">
              +{companion.servicesOffered.length - 2} more
            </span>
          )}
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-3 border-t border-[#1B214B] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
              Starting from
            </span>
            <div className="text-sm font-bold text-white font-mono">
              <span className="text-[#00D2FF]">₹{minRate.toLocaleString('en-IN')}</span>
              <span className="text-xs font-normal text-slate-400">/hr</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewProfile(companion)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-[#121736] hover:bg-[#1B214B] border border-[#1B214B] transition-colors"
            >
              Profile
            </button>
            <button
              onClick={() => onBookNow(companion)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white brand-button shadow-md shadow-pink-500/20 transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Book</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
