// ==========================================
// COMPANIONX: CLIENT MEMBERSHIP PLANS
// ==========================================

import React, { useState } from 'react';
import {
  Check,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Zap,
  PhoneCall,
  Calendar,
} from 'lucide-react';
import { store } from '../../services/store';

export const ClientSubscriptions: React.FC = () => {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const currentUser = store.getCurrentUser();
  const clientProfile = currentUser
    ? store.getState().clientProfiles.find((c) => c.userId === currentUser.id)
    : null;
  const currentTier = clientProfile?.subscriptionTier || 'free';
  const plans = store.getState().membershipPlans.filter((p) => p.targetRole === 'client');

  const handleSelectPlan = (planId: string) => {
    setLoadingPlan(planId);
    setTimeout(() => {
      const res = store.upgradeSubscription(planId, 'client');
      setLoadingPlan(null);
      if (res.success) {
        alert('Membership updated successfully!');
      }
    }, 700);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
          Client Privileges
        </span>
        <h2 className="text-2xl font-bold text-white font-serif tracking-tight">
          Elevate Your Companion Experience
        </h2>
        <p className="text-xs text-slate-400">
          Unlock 0% platform convenience fees, dedicated concierge booking assistance, and priority companion access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const isCurrent =
            (plan.id === 'client_free' && currentTier === 'free') ||
            (plan.id === 'client_premium' && currentTier === 'premium');

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 border transition-all flex flex-col justify-between relative ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-[#0B132B] to-[#070B19] border-[#D4AF37]/60 shadow-xl shadow-[#D4AF37]/5'
                  : 'bg-[#0B132B] border-[#1C2541]'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] text-slate-950 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Most Preferred
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-white font-serif mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-bold text-white font-mono">
                    ₹{plan.priceMonthly}
                  </span>
                  <span className="text-xs text-slate-400">/month</span>
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
                    Current Active Tier
                  </div>
                ) : (
                  <button
                    disabled={loadingPlan === plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8012] text-slate-950 hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 cursor-pointer'
                        : 'bg-[#1C2541] hover:bg-[#243356] text-white cursor-pointer'
                    }`}
                  >
                    {loadingPlan === plan.id
                      ? 'Processing...'
                      : plan.priceMonthly === 0
                      ? 'Downgrade to Free'
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
