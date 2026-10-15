// ==========================================
// COMPANIONX: ADMIN BOOKING & DISPUTE MANAGER
// ==========================================

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
} from 'lucide-react';
import { store } from '../../services/store';
import { Booking } from '../../types';

export const AdminBookingsManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const state = store.getState();
  const bookings = state.bookings;

  const filtered = bookings.filter((b) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      b.bookingCode.toLowerCase().includes(q) ||
      b.clientName.toLowerCase().includes(q) ||
      b.companionName.toLowerCase().includes(q) ||
      b.status.toLowerCase().includes(q)
    );
  });

  const handleManualRefund = (booking: Booking) => {
    const reason = prompt('Enter administrative reason for manual refund override:');
    if (!reason) return;

    store.cancelBooking(booking.id, 'admin', `Admin Refund Override: ${reason}`);
    alert(`Manual refund of ₹${booking.pricing.totalAmount} issued for ${booking.bookingCode}.`);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white font-serif">
            Platform Booking & Dispute Operations
          </h3>
          <p className="text-xs text-slate-400">
            Monitor escrow balances, force complete engagements, and process administrative refunds.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by code, client, companion..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#0B132B] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37] w-64"
        />
      </div>

      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#070B19] text-slate-400 uppercase text-[10px] border-b border-[#1C2541]">
              <tr>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Companion</th>
                <th className="px-6 py-3">Date & Venue</th>
                <th className="px-6 py-3">Total / Fee</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2541]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No bookings created yet.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-[#1C2541]/30 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-bold text-[#D4AF37]">
                      {b.bookingCode}
                    </td>
                    <td className="px-6 py-3.5 text-white font-medium">{b.clientName}</td>
                    <td className="px-6 py-3.5 text-slate-300">{b.companionName}</td>
                    <td className="px-6 py-3.5 text-slate-400">
                    <div>{b.date} at {b.startTime}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">
                      {b.meetingLocation.venueName}, {b.meetingLocation.city}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 font-mono">
                    <div className="font-bold text-white">₹{b.pricing.totalAmount}</div>
                    <div className="text-[10px] text-emerald-400">
                      Fee: ₹{b.pricing.platformCommissionAmount}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#1C2541] text-slate-300 border border-slate-700">
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleManualRefund(b)}
                          className="px-2.5 py-1 rounded text-[11px] font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>


          </table>
        </div>
      </div>
    </div>
  );
};
