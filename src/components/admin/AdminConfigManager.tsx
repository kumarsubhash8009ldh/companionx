// ==========================================
// COMPANIONX: ADMIN PRICING & COMMISSION CONFIG
// ==========================================

import React, { useState } from 'react';
import {
  Percent,
  Sliders,
  DollarSign,
  Tag,
  Save,
  CheckCircle2,
  Sparkles,
  Plus,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { store } from '../../services/store';
import { BRAND_CONFIG } from '../../config/brand';

export const AdminConfigManager: React.FC = () => {
  const state = store.getState();
  const [commissionRatePct, setCommissionRatePct] = useState(
    Math.round(state.platformCommissionRate * 100)
  );

  const [joiningFee, setJoiningFee] = useState(state.companionJoiningFee || 999);

  const [couponCode, setCouponCode] = useState('');
  const [discountPct, setDiscountPct] = useState('10');
  const [maxDiscount, setMaxDiscount] = useState('500');

  const handleUpdateCommission = () => {
    const rateDecimal = commissionRatePct / 100;
    const res = store.updateCommissionRate(rateDecimal);
    if (res.success) {
      alert(`Platform booking commission successfully updated to ${commissionRatePct}%.`);
    } else {
      alert(res.error);
    }
  };

  const handleUpdateJoiningFee = () => {
    const feeNum = Number(joiningFee);
    const res = store.updateCompanionJoiningFee(feeNum);
    if (res.success) {
      alert(`Companion onboarding joining fee updated to ₹${feeNum}.`);
    } else {
      alert(res.error);
    }
  };

  const handleCreateCoupon = () => {
    if (!couponCode.trim()) {
      alert('Please enter a coupon code.');
      return;
    }

    state.coupons.unshift({
      id: `coup_${Date.now()}`,
      code: couponCode.trim().toUpperCase(),
      discountPercentage: Number(discountPct),
      maxDiscount: Number(maxDiscount),
      validTill: '2026-12-31',
      target: 'client',
      usageCount: 0,
      isActive: true,
    });

    alert(`Coupon code ${couponCode.toUpperCase()} activated!`);
    setCouponCode('');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      {/* 1. Platform Commission Setting (10% to 20%) */}
      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <Percent className="w-4 h-4 text-[#D4AF37]" />
              <span>Platform Booking Commission Setting</span>
            </h3>
            <p className="text-xs text-slate-400">
              Dynamically modify the platform facilitation fee deducted from companion booking payouts.
            </p>
          </div>
          <span className="text-2xl font-bold font-mono text-[#D4AF37]">
            {commissionRatePct}%
          </span>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min={5}
            max={50}
            step={1}
            value={commissionRatePct}
            onChange={(e) => setCommissionRatePct(Number(e.target.value))}
            className="w-full accent-[#D4AF37]"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Minimum: 5%</span>
            <span className="text-[#D4AF37] font-bold">Standard Meeting Commission: 30%</span>
            <span>Maximum: 50%</span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            GST on platform commission is automatically assessed at 18.0%.
          </span>
          <button
            onClick={handleUpdateCommission}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/20"
          >
            <Save className="w-4 h-4" />
            <span>Apply Commission Rate</span>
          </button>
        </div>
      </div>

      {/* 2. Companion Onboarding & Background Verification Fee (₹) */}
      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#D4AF37]" />
              <span>Companion Onboarding & Background Verification Fee</span>
            </h3>
            <p className="text-xs text-slate-400">
              One-time non-refundable verification tariff charged to male companions upon registration before live directory listing.
            </p>
          </div>
          <span className="text-2xl font-bold font-mono text-[#D4AF37]">
            ₹{joiningFee}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              One-Time Joining Fee Amount (₹)
            </label>
            <input
              type="number"
              step={50}
              min={0}
              max={10000}
              value={joiningFee}
              onChange={(e) => setJoiningFee(Number(e.target.value))}
              className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <button
              onClick={handleUpdateJoiningFee}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] flex items-center justify-center gap-1.5 shadow-md shadow-[#D4AF37]/20 cursor-pointer hover:brightness-110"
            >
              <Save className="w-4 h-4" />
              <span>Update Joining Fee</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Configured Membership Tiers Overview */}
      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] p-6 space-y-4">
        <h3 className="text-base font-bold text-white font-serif">
          Configured Subscription Price Schedule
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#070B19] p-4 rounded-xl border border-[#1C2541] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase">Client Elite Circle</span>
              <span className="text-[9px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded">30 Days</span>
            </div>
            <div className="text-xl font-bold text-white font-mono">₹199</div>
            <span className="text-slate-500">0% convenience fee, priority booking</span>
          </div>

          <div className="bg-[#070B19] p-4 rounded-xl border border-[#1C2541] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase">Companion Basic</span>
              <span className="text-[9px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded">30 Days</span>
            </div>
            <div className="text-xl font-bold text-white font-mono">₹499</div>
            <span className="text-slate-500">Standard listing & weekly payout</span>
          </div>

          <div className="bg-[#070B19] p-4 rounded-xl border border-[#1C2541] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase">Companion Pro Tier</span>
              <span className="text-[9px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded">30 Days</span>
            </div>
            <div className="text-xl font-bold text-[#D4AF37] font-mono">₹999</div>
            <span className="text-slate-500">Gold badge, top placement & commission rebate</span>
          </div>
        </div>
      </div>

      {/* 3. Promotional Campaign & Coupon Generator */}
      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#D4AF37]" />
              <span>Promotional Coupons & Campaigns</span>
            </h3>
            <p className="text-xs text-slate-400">
              Generate promotional discount codes for client bookings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Coupon Code
            </label>
            <input
              type="text"
              placeholder="e.g. LUXURY20"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Discount %
            </label>
            <input
              type="number"
              value={discountPct}
              onChange={(e) => setDiscountPct(e.target.value)}
              className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Max Cap (₹)
            </label>
            <input
              type="number"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleCreateCoupon}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Code</span>
            </button>
          </div>
        </div>

        {/* Active Coupons List */}
        <div className="flex flex-wrap gap-2 pt-2">
          {state.coupons.map((c) => (
            <div
              key={c.id}
              className="px-3 py-1.5 rounded-xl bg-[#070B19] border border-[#1C2541] text-xs flex items-center gap-2"
            >
              <span className="font-mono font-bold text-[#D4AF37]">{c.code}</span>
              <span className="text-slate-400 text-[10px]">
                {c.discountPercentage}% off (Used {c.usageCount} times)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
