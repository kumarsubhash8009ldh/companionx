// ==========================================
// COMPANIO: ADMIN ACCOUNT ACTIVATION QUEUE
// Admin audits companion payments & approves account activation
// ==========================================

import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  Search,
  Filter,
  Copy,
  ExternalLink,
  Clock,
  AlertCircle,
  Eye,
  CreditCard,
  User,
  Phone,
  Mail,
  Sparkles,
} from 'lucide-react';
import { store } from '../../services/store';
import { AccountActivationRequest } from '../../types';

export const AdminActivationQueue: React.FC = () => {
  const state = store.getState();
  const requests = state.accountActivationRequests || [];

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // Reject modal state
  const [rejectRequestId, setRejectRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Payment not received in bank account');

  const filteredRequests = requests.filter((req) => {
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = req.companionName.toLowerCase().includes(q);
      const matchUtr = req.utrNumber.toLowerCase().includes(q);
      const matchPhone = req.companionPhone.includes(q);
      if (!matchName && !matchUtr && !matchPhone) return false;
    }
    return true;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  const handleApprove = (requestId: string, companionName: string, utr: string) => {
    if (
      confirm(
        `Are you sure you want to APPROVE payment (UTR: ${utr}) and ACTIVATATE the companion account for ${companionName}?`
      )
    ) {
      const res = store.approveAccountActivation(requestId);
      if (res.success) {
        alert(`Account for ${companionName} has been successfully ACTIVATED! The companion can now accept bookings.`);
      } else {
        alert(res.error || 'Failed to approve activation.');
      }
    }
  };

  const handleConfirmReject = () => {
    if (!rejectRequestId) return;
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    const res = store.rejectAccountActivation(rejectRequestId, rejectReason.trim());
    if (res.success) {
      alert('Payment rejected. The companion has been notified to re-submit correct payment proof.');
      setRejectRequestId(null);
      setRejectReason('Payment not received in bank account');
    } else {
      alert(res.error || 'Failed to reject activation.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-[#0B0E23] p-5 rounded-3xl border border-[#1B214B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white brand-gradient-text">
              Account Activation & Payment Approvals
            </h2>
            {pendingCount > 0 ? (
              <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2.5 py-0.5 rounded-full font-mono font-bold border border-pink-500/40 animate-pulse">
                {pendingCount} PENDING APPROVAL
              </span>
            ) : (
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-500/30">
                ALL CAUGHT UP
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Audit companion UTR references paid via Google Pay, PhonePe, or Paytm QR. Approving unlocks their profile and permits booking transactions.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3 bg-[#060714] px-4 py-2 rounded-2xl border border-[#1B214B] text-xs">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block uppercase">Total Submissions</span>
            <span className="font-bold text-white font-mono">{requests.length}</span>
          </div>
          <div className="w-px h-6 bg-[#1B214B]" />
          <div className="text-center">
            <span className="text-[10px] text-pink-400 block uppercase">Pending</span>
            <span className="font-bold text-pink-400 font-mono">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0B0E23] p-4 rounded-3xl border border-[#1B214B] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by companion name, phone, or UTR..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#060714] border border-[#1B214B] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterStatus === 'pending'
                ? 'bg-gradient-to-r from-[#00D2FF] to-[#FF0080] text-white shadow-md'
                : 'bg-[#060714] text-slate-400 hover:text-white border border-[#1B214B]'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterStatus === 'approved'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-[#060714] text-slate-400 hover:text-white border border-[#1B214B]'
            }`}
          >
            Approved ({requests.filter((r) => r.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterStatus === 'rejected'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-[#060714] text-slate-400 hover:text-white border border-[#1B214B]'
            }`}
          >
            Rejected ({requests.filter((r) => r.status === 'rejected').length})
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
              filterStatus === 'all'
                ? 'bg-slate-200 text-slate-950 shadow-md'
                : 'bg-[#060714] text-slate-400 hover:text-white border border-[#1B214B]'
            }`}
          >
            All ({requests.length})
          </button>
        </div>
      </div>

      {/* Requests Grid / Table */}
      {filteredRequests.length === 0 ? (
        <div className="bg-[#0B0E23] p-12 rounded-3xl border border-[#1B214B] text-center space-y-3">
          <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No activation requests found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {filterStatus === 'pending'
              ? 'There are currently no pending payments awaiting verification. New companion submissions will appear here.'
              : 'No records matched your search filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => {
            const companionProfile = state.companionProfiles.find((c) => c.id === req.companionId);
            const isPending = req.status === 'pending';

            return (
              <div
                key={req.id}
                className="bg-[#0B0E23] p-5 rounded-3xl border border-[#1B214B] hover:border-purple-500/40 transition-all shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                {/* Left: Companion Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={
                      companionProfile?.approvedPhotos?.[0] ||
                      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={req.companionName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/40 ring-2 ring-purple-500/20 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white font-sans">
                        {req.companionName}
                      </h4>
                      {req.status === 'pending' && (
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          Pending Review
                        </span>
                      )}
                      {req.status === 'approved' && (
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-400" />
                          Account Activated
                        </span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                          <X className="w-3 h-3 text-rose-400" />
                          Rejected
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      {req.companionPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {req.companionPhone}
                        </span>
                      )}
                      {req.companionEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-500" />
                          {req.companionEmail}
                        </span>
                      )}
                      <span className="text-slate-500">
                        Submitted: {new Date(req.submittedAt).toLocaleString()}
                      </span>
                    </div>

                    {req.rejectionReason && (
                      <p className="text-[11px] text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 inline-block">
                        Rejection reason: {req.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                {/* Middle: Payment Details (UTR & App) */}
                <div className="bg-[#060714] p-3.5 rounded-2xl border border-[#1B214B] flex flex-wrap items-center gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Fee Amount</span>
                    <span className="font-mono font-black text-white text-base brand-gradient-text">
                      ₹{req.amount}
                    </span>
                  </div>

                  <div className="w-px h-8 bg-[#1B214B]" />

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">UPI App Used</span>
                    <span className="font-bold text-pink-300 uppercase text-xs">
                      {req.upiApp}
                    </span>
                  </div>

                  <div className="w-px h-8 bg-[#1B214B]" />

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">12-Digit UTR Ref</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#00D2FF] text-xs">
                        {req.utrNumber}
                      </span>
                      <button
                        onClick={() => handleCopyUtr(req.utrNumber)}
                        className="p-1 rounded text-slate-400 hover:text-white"
                        title="Copy UTR Number"
                      >
                        {copiedUtr === req.utrNumber ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {req.screenshotUrl && (
                    <>
                      <div className="w-px h-8 bg-[#1B214B]" />
                      <button
                        onClick={() => setSelectedProofUrl(req.screenshotUrl!)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#121736] hover:bg-[#1B214B] border border-purple-500/30 text-purple-200 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#00D2FF]" />
                        <span>View Proof</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => handleApprove(req.id, req.companionName, req.utrNumber)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Activate</span>
                      </button>

                      <button
                        onClick={() => setRejectRequestId(req.id)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-500/30 border border-rose-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <div className="text-right text-xs text-slate-500 font-mono">
                      Reviewed: {req.reviewedAt ? new Date(req.reviewedAt).toLocaleDateString() : 'N/A'}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Proof Screenshot Lightbox Modal */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-2xl w-full bg-[#0B0E23] rounded-3xl p-4 border border-purple-500/40 shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setSelectedProofUrl(null)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-white mb-3">Submitted Payment Proof</h3>
            <img
              src={selectedProofUrl}
              alt="Payment Proof"
              className="max-h-[70vh] rounded-2xl object-contain border border-[#1B214B]"
            />
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {rejectRequestId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0B0E23] p-6 rounded-3xl border border-rose-500/40 max-w-md w-full text-left space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>Reject Account Activation Payment</span>
            </h3>
            <p className="text-xs text-slate-300">
              Please enter the reason for rejection. This explanation will be sent to the companion so they can correct their payment.
            </p>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Reason for Rejection *
              </label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-[#060714] border border-[#1B214B] rounded-xl px-3 py-2 text-xs text-white mb-2"
              >
                <option>Payment not received in bank account</option>
                <option>Invalid 12-digit UTR reference number</option>
                <option>Incorrect fee amount transferred</option>
                <option>Duplicate UTR submitted</option>
                <option>Other / Contact Support</option>
              </select>

              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Custom reason description..."
                className="w-full bg-[#060714] border border-[#1B214B] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectRequestId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
