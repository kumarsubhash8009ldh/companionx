// ==========================================
// COMPANIONX: COMPANION MEMBERSHIP & PROMOTIONS
// ==========================================

import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Zap,
  TrendingUp,
  ShieldCheck,
  Star,
} from 'lucide-react';
import { store } from '../../services/store';
import { BRAND_CONFIG } from '../../config/brand';

export const CompanionMemberships: React.FC = () => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const currentUser = store.getCurrentUser();
  const state = store.getState();
  const comp = currentUser
    ? state.companionProfiles.find((c) => c.userId === currentUser.id)
    : null;
  const currentTier = comp?.profileTier || 'basic';
  const plans = state.membershipPlans.filter((p) => p.targetRole === 'companion');

  const handleSelectPlan = (planId: string) => {
    setLoadingAction(planId);
    setTimeout(() => {
      const res = store.upgradeSubscription(planId, 'companion');
      setLoadingAction(null);
      if (res.success) {
        alert('Companion membership updated successfully!');
      }
    }, 700);
  };

  const handleBoostProfile = () => {
    if (!comp) return;
    setLoadingAction('boost');
    setTimeout(() => {
      const res = store.boostProfile(comp.id);
      setLoadingAction(null);
      if (res.success) {
        alert('Profile Spotlight active! Your profile will appear in top highlighted carousel for the next 7 days.');
      }
    }, 700);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* 1. Profile Spotlight Boost Campaign Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-[#0B132B] to-[#1C2541] rounded-2xl p-6 border border-[#D4AF37]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-[#D4AF37]/5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Promotion Boost
            </span>
            <span className="text-xs text-emerald-400 font-semibold">3.8x More Profile Views</span>
          </div>
          <h3 className="text-lg font-bold text-white font-serif">
            Spotlight Your Profile in Search
          </h3>
          <p className="text-xs text-slate-300">
            Feature at the very top of client search results for your city for 7 full days.
          </p>
        </div>

        <button
          disabled={loadingAction === 'boost' || comp?.featured}
          onClick={handleBoostProfile}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
            comp?.featured
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-gradient-to-r from-[#D4AF37] to-[#AA8012] text-slate-950 hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 cursor-pointer'
          }`}
        >
          {comp?.featured ? (
            '✓ Spotlight Active'
          ) : loadingAction === 'boost' ? (
            'Activating...'
          ) : (
            `Boost Profile for ₹${BRAND_CONFIG.profilePromotionPrice}`
          )}
        </button>
      </div>

      {/* 2. Monthly Membership Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {plans.map((plan) => {
          const isCurrent =
            (plan.id === 'comp_basic' && currentTier === 'basic') ||
            (plan.id === 'comp_premium' && currentTier === 'premium');

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 border transition-all flex flex-col justify-between relative ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-[#0B132B] to-[#070B19] border-[#D4AF37]/60 shadow-xl'
                  : 'bg-[#0B132B] border-[#1C2541]'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Recommended Pro
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white font-serif mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-center gap-2 my-3">
                  <span className="text-3xl font-bold text-white font-mono">
                    ₹{plan.priceMonthly}
                  </span>
                  <span className="text-[11px] font-semibold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2.5 py-1 rounded-lg">
                    {plan.validityDays || 30} Days Validity
                  </span>
                </div>

                <div className="space-y-2.5 my-6 text-xs">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-[#D4AF37]/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-[#D4AF37]" />
                      </div>
                      <span className="leading-normal">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {isCurrent ? (
                  <div className="w-full py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center">
                    Current Active Plan
                  </div>
                ) : (
                  <button
                    disabled={loadingAction === plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8012] text-slate-950 hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 cursor-pointer'
                        : 'bg-[#1C2541] hover:bg-[#243356] text-white cursor-pointer'
                    }`}
                  >
                    {loadingAction === plan.id
                      ? 'Processing...'
                      : `Upgrade for ₹${plan.priceMonthly}/mo`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
