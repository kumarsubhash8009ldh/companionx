// ==========================================
// COMPANIONX: ADMIN CONTROL PANEL
// ==========================================

import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  Calendar,
  Percent,
  ShieldAlert,
  Terminal,
  Lock,
  QrCode,
  UserCheck,
  RefreshCw,
  Server,
} from 'lucide-react';
import { store } from '../../services/store';
import { AdminMetrics } from './AdminMetrics';
import { AdminVerificationQueue } from './AdminVerificationQueue';
import { AdminBookingsManager } from './AdminBookingsManager';
import { AdminConfigManager } from './AdminConfigManager';
import { AdminSafetyModeration } from './AdminSafetyModeration';
import { AdminAuditLogs } from './AdminAuditLogs';
import { AdminActivationQueue } from './AdminActivationQueue';
import { AdminPaymentQrManager } from './AdminPaymentQrManager';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'metrics' | 'activations' | 'payment_qr' | 'kyc' | 'bookings' | 'config' | 'safety' | 'audit'
  >('activations');

  const state = store.getState();
  const currentUser = store.getCurrentUser();

  // Strict Admin check: Strictly restricted to 7009600157
  if (!currentUser || !store.isAdminUser(currentUser)) {
    return (
      <div className="max-w-md mx-auto my-16 bg-[#0B0E23] p-8 rounded-3xl border border-rose-500/30 text-center space-y-4 shadow-2xl shadow-rose-950/40">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
          <Lock className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-white">403 - Admin Access Restricted</h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Yeh page sirf authorized platform administrator phone <span className="font-mono text-[#00D2FF] font-bold">7009600157</span> ke login par hi accessible hai.
        </p>
        <button
          onClick={() => store.setActiveRole('client')}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-white brand-button cursor-pointer"
        >
          Return to Platform
        </button>
      </div>
    );
  }

  const pendingActivationsCount = (state.accountActivationRequests || []).filter(
    (r) => r.status === 'pending'
  ).length;
  const pendingKycCount = state.verificationRequests.filter((r) => r.status === 'pending').length;
  const pendingReportsCount = state.reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0B0E23] p-5 rounded-3xl border border-[#1B214B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-xl">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-black text-white brand-gradient-text">
              Platform Administration & Compliance Center
            </h2>
            <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full font-mono font-bold border border-emerald-500/30">
              AUDIT ACTIVE • 7009600157
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <Server className="w-3 h-3" />
              <span>Real-Time Sync Active (Port 5000)</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Authenticated Administrator: <span className="text-white font-semibold font-mono">{currentUser.phone}</span> ({currentUser.email})
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            store.syncWithServer();
            alert('Synced successfully with backend database!');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#070B19] hover:bg-[#121736] border border-[#1B214B] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
          title="Force refresh data from backend database"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#00D2FF]" />
          <span>Sync Database</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1B214B] pb-3 overflow-x-auto text-left">
        {/* 1. Account Activations & UPI Approvals */}
        <button
          onClick={() => setActiveTab('activations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'activations'
              ? 'bg-gradient-to-r from-[#00D2FF] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Account Activations</span>
          {pendingActivationsCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-pink-500 text-white font-bold animate-pulse">
              {pendingActivationsCount}
            </span>
          )}
        </button>

        {/* 2. Payment QR Settings */}
        <button
          onClick={() => setActiveTab('payment_qr')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'payment_qr'
              ? 'bg-gradient-to-r from-[#00D2FF] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Payment QR Codes</span>
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'metrics'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Metrics & Revenue</span>
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'kyc'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>KYC Queue</span>
          {pendingKycCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">
              {pendingKycCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'bookings'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Bookings & Refunds</span>
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'config'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Pricing & Commissions</span>
        </button>

        <button
          onClick={() => setActiveTab('safety')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'safety'
              ? 'bg-rose-500 text-white font-bold shadow-md'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Safety & Reports</span>
          {pendingReportsCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-400 text-slate-950 font-bold">
              {pendingReportsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Audit Trail</span>
        </button>
      </div>

      {/* Panels */}
      {activeTab === 'activations' && <AdminActivationQueue />}
      {activeTab === 'payment_qr' && <AdminPaymentQrManager />}
      {activeTab === 'metrics' && <AdminMetrics />}
      {activeTab === 'kyc' && <AdminVerificationQueue />}
      {activeTab === 'bookings' && <AdminBookingsManager />}
      {activeTab === 'config' && <AdminConfigManager />}
      {activeTab === 'safety' && <AdminSafetyModeration />}
      {activeTab === 'audit' && <AdminAuditLogs />}
    </div>
  );
};
