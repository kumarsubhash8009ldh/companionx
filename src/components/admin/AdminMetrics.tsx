// ==========================================
// COMPANIONX: ADMIN ANALYTICS & METRICS
// ==========================================

import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  ShieldAlert,
  Percent,
  CreditCard,
  RotateCcw,
} from 'lucide-react';
import { store } from '../../services/store';

export const AdminMetrics: React.FC = () => {
  const state = store.getState();

  // Metrics calculations
  const totalUsers = state.users.length;
  const clientsCount = state.users.filter((u) => u.role === 'client').length;
  const companionsCount = state.users.filter((u) => u.role === 'companion').length;
  const totalBookings = state.bookings.length;

  const grossVolume = state.bookings.reduce((sum, b) => sum + (b.pricing?.baseAmount || 0), 0);
  const totalPlatformCommission = state.commissions.reduce(
    (sum, c) => sum + c.commissionAmount,
    0
  );
  const totalGstFacilitation = state.commissions.reduce((sum, c) => sum + c.gstAmount, 0);

  const subscriptionRevenue = state.subscriptions.reduce(
    (sum, s) => sum + (s.status === 'active' ? s.amount : 0),
    0
  );

  const totalRefunds = state.refunds.reduce((sum, r) => sum + r.amount, 0);
  const pendingVerifications = state.verificationRequests.filter(
    (v) => v.status === 'pending'
  ).length;
  const pendingReports = state.reports.filter((r) => r.status === 'pending').length;

  const joiningFeeRevenue = state.payments
    .filter((p) => p.id.startsWith('pay_join_') && p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);
  const paidCompanionsCount = state.companionProfiles.filter((c) => c.isJoiningFeePaid).length;

  return (
    <div className="space-y-6 text-left">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Volume */}
        <div className="bg-[#0B132B] rounded-2xl p-5 border border-[#1C2541] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Gross Platform Volume</span>
            <DollarSign className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ₹{grossVolume.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Escrowed booking payments</span>
          </div>
        </div>

        {/* Platform Facilitation Commission */}
        <div className="bg-[#0B132B] rounded-2xl p-5 border border-[#1C2541] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Platform Facilitation Revenue</span>
            <Percent className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-[#D4AF37] font-mono">
            ₹{totalPlatformCommission.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">
            Avg {(state.platformCommissionRate * 100).toFixed(0)}% commission rate
          </div>
        </div>

        {/* Subscriptions */}
        <div className="bg-[#0B132B] rounded-2xl p-5 border border-[#1C2541] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Monthly Membership MRR</span>
            <CreditCard className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ₹{subscriptionRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">
            {state.subscriptions.filter((s) => s.status === 'active').length} active paid tiers
          </div>
        </div>

        {/* Refunds Issued */}
        <div className="bg-[#0B132B] rounded-2xl p-5 border border-[#1C2541] space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Refunds Processed</span>
            <RotateCcw className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-slate-300 font-mono">
            ₹{totalRefunds.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">
            {state.refunds.length} cancellations settled
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0B132B] rounded-2xl p-5 border border-[#1C2541]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">User Demographics</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono mb-1">
            {totalUsers} Registered
          </div>
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Clients: {clientsCount}</span>
            <span>Companions: {companionsCount}</span>
          </div>
        </div>

        <div className="bg-[#0B132B] rounded-2xl p-5 border border-[#1C2541]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Joining Fees Collected</span>
            <CreditCard className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="text-xl font-bold text-[#D4AF37] font-mono mb-1">
            ₹{joiningFeeRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-slate-400">
            {paidCompanionsCount} of {companionsCount} Companions Settled
          </span>
        </div>

        <div className="bg-[#0B132B] rounded-2xl p-5 border border-[#1C2541]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Verification Backlog</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono mb-1">
            {pendingVerifications} Pending Review
          </div>
          <span className="text-xs text-slate-400">Aadhaar/Passport queues</span>
        </div>

        <div className="bg-[#0B132B] rounded-2xl p-5 border border-[#1C2541]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Safety Incident Reports</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 font-mono mb-1">
            {pendingReports} Active Incidents
          </div>
          <span className="text-xs text-slate-400">24/7 compliance response</span>
        </div>
      </div>
    </div>
  );
};
