// ==========================================
// COMPANIONX: COMPANION EARNINGS & PAYOUTS
// ==========================================

import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  Download,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { store } from '../../services/store';

export const EarningsPayoutView: React.FC = () => {
  const [upiId, setUpiId] = useState('aryan***@okhdfcbank');
  const [bankAccount, setBankAccount] = useState('HDFC Bank ending in 4492');
  const [payoutAmount, setPayoutAmount] = useState('3825');
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  const currentUser = store.getCurrentUser();
  const state = store.getState();
  const comp = currentUser
    ? state.companionProfiles.find((c) => c.userId === currentUser.id)
    : null;
  const companionId = comp?.id || '';

  // Earnings calculations
  const commissions = state.commissions.filter((c) => c.companionId === companionId);
  const payouts = state.payouts.filter((p) => p.companionId === companionId);

  const totalGrossBookings = commissions.reduce((sum, c) => sum + c.bookingAmount, 0);
  const totalCommissionDeducted = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalNetEarned = commissions.reduce((sum, c) => sum + c.netPayoutAmount, 0);
  const totalPaidOut = payouts
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const availableBalance = Math.max(0, totalNetEarned - totalPaidOut);

  const handleRequestPayout = () => {
    const amt = Number(payoutAmount);
    if (!amt || amt <= 0 || amt > availableBalance) {
      alert(`Please enter a valid amount up to your available balance of ₹${availableBalance}`);
      return;
    }

    const res = store.requestPayout(companionId, amt, upiId, bankAccount);
    if (res.success) {
      alert(`Payout request for ₹${amt} submitted! Clearance processed within 24 hours to your bank.`);
      setRequestModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 text-left max-w-5xl">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0B132B] rounded-2xl p-5 border border-[#1C2541]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Available For Payout
          </span>
          <div className="text-2xl font-bold text-[#D4AF37] font-mono">
            ₹{availableBalance.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-400">Ready to transfer to UPI</span>
        </div>

        <div className="bg-[#0B132B] rounded-2xl p-5 border border-[#1C2541]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Total Net Earnings
          </span>
          <div className="text-2xl font-bold text-white font-mono">
            ₹{totalNetEarned.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400">After platform commission</span>
        </div>

        <div className="bg-[#0B132B] rounded-2xl p-5 border border-[#1C2541]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Gross Booking Value
          </span>
          <div className="text-2xl font-bold text-slate-300 font-mono">
            ₹{totalGrossBookings.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500">Total client receipts</span>
        </div>

        <div className="bg-[#0B132B] rounded-2xl p-5 border border-[#1C2541] flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Fast Payout
          </span>
          <button
            onClick={() => setRequestModalOpen(true)}
            disabled={availableBalance <= 0}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
              availableBalance > 0
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8012] text-slate-950 hover:brightness-110 cursor-pointer shadow-md'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Request Payout
          </button>
        </div>
      </div>

      {/* 2. Commission & Earnings Breakdown per Booking */}
      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1C2541] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white font-serif">
              Booking Commission & Net Earnings Breakdown
            </h3>
            <p className="text-[11px] text-slate-400">
              Platform facilitates booking & escrow; commission transparently deducted
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#070B19] text-slate-400 uppercase text-[10px] border-b border-[#1C2541]">
              <tr>
                <th className="px-6 py-3">Booking ID</th>
                <th className="px-6 py-3">Client Bill</th>
                <th className="px-6 py-3">
                  Platform Fee ({Math.round((state.platformCommissionRate || 0.3) * 100)}%)
                </th>
                <th className="px-6 py-3">GST on Fee</th>
                <th className="px-6 py-3">Your Net Payout</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2541]">
              {commissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No completed bookings or accrued commissions yet.
                  </td>
                </tr>
              ) : (
                commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-[#1C2541]/30 transition-colors">
                    <td className="px-6 py-3.5 font-mono text-white">{comm.bookingId}</td>
                    <td className="px-6 py-3.5 font-mono text-slate-300">
                      ₹{comm.bookingAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-rose-400">
                      -₹{comm.commissionAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-400">
                      ₹{comm.gstAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-[#D4AF37]">
                      ₹{comm.netPayoutAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {comm.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Payout Transactions Table */}
      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1C2541]">
          <h3 className="text-sm font-bold text-white font-serif">
            Bank & UPI Payout Disbursements
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#070B19] text-slate-400 uppercase text-[10px] border-b border-[#1C2541]">
              <tr>
                <th className="px-6 py-3">Reference / UTR</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Destination</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Disbursed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2541]">
              {payouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center text-slate-500">
                    No payouts disbursed yet.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1C2541]/30">
                    <td className="px-6 py-3.5 font-mono text-white">
                      {p.utrReference || 'Processing...'}
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-[#D4AF37]">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-3.5 text-slate-300">
                      {p.upiIdMasked || p.bankAccountMasked}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-400">
                      {new Date(p.requestedAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Request Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B132B] border border-[#D4AF37]/40 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2">Request Payout Disbursement</h4>
            <p className="text-xs text-slate-400 mb-4">
              Funds are transferred to your verified bank account or UPI VPA via IMPS/NEFT.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Amount to Withdraw (Max: ₹{availableBalance})
                </label>
                <input
                  type="number"
                  value={payoutAmount}
                  max={availableBalance}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Verified UPI VPA
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Bank Account Reference
                </label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRequestModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestPayout}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012]"
              >
                Disburse ₹{payoutAmount}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
