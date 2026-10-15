// ==========================================
// COMPANIONX: COMPANION BOOKING REQUESTS & SCHEDULE
// ==========================================

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertTriangle,
  User,
  Check,
  Video,
} from 'lucide-react';
import { Booking } from '../../types';
import { store } from '../../services/store';

interface CompanionBookingsProps {
  onOpenChat: (bookingId: string) => void;
  onOpenVideoCall: (booking: Booking) => void;
}

export const CompanionBookings: React.FC<CompanionBookingsProps> = ({
  onOpenChat,
  onOpenVideoCall,
}) => {
  const [rejectBookingId, setRejectBookingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const currentUser = store.getCurrentUser();
  const companionProfile = currentUser
    ? store.getState().companionProfiles.find((c) => c.userId === currentUser.id)
    : null;

  const bookings = companionProfile
    ? store.getState().bookings.filter((b) => b.companionId === companionProfile.id)
    : [];


  const pendingRequests = bookings.filter((b) => b.status === 'requested');
  const activeBookings = bookings.filter(
    (b) => b.status === 'accepted' || b.status === 'confirmed'
  );
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const handleAccept = (bookingId: string) => {
    const res = store.acceptBooking(bookingId);
    if (res.success) {
      alert('Booking request accepted! In-app chat has been unlocked for coordination.');
    }
  };

  const handleConfirmReject = () => {
    if (!rejectBookingId) return;
    const res = store.rejectBooking(
      rejectBookingId,
      rejectReason || 'Unavailable on requested schedule.'
    );
    if (res.success) {
      alert('Booking request declined.');
      setRejectBookingId(null);
      setRejectReason('');
    }
  };

  const handleMarkCompleted = (bookingId: string) => {
    const res = store.completeBooking(bookingId);
    if (res.success) {
      alert('Booking marked completed. Payout balance credited to your earnings account!');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. Pending Booking Inquiries (High Priority) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
            <span>Pending Booking Inquiries</span>
            {pendingRequests.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </h3>
          <span className="text-xs text-slate-400">Respond promptly to maintain high ranking</span>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="bg-[#0B132B] rounded-2xl p-6 text-center border border-[#1C2541]">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300 font-medium">All inquiries answered!</p>
            <p className="text-[11px] text-slate-500">
              New client booking requests will appear here for your review and acceptance.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((b) => (
              <div
                key={b.id}
                className="bg-[#0B132B] rounded-2xl border border-amber-500/40 p-5 space-y-4 shadow-lg shadow-amber-500/5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1C2541]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Action Required • Booking Code {b.bookingCode}
                    </span>
                    <h4 className="text-sm font-bold text-white font-serif">{b.serviceTitle}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Your Net Payout</span>
                    <span className="text-base font-bold text-[#D4AF37] font-mono">
                      ₹{b.pricing.companionPayoutAmount.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      (After 15% platform fee)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#070B19] p-3 rounded-xl border border-[#1C2541]">
                    <span className="text-[10px] uppercase text-slate-400 block mb-1">Client</span>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {b.clientName}
                    </div>
                  </div>

                  <div className="bg-[#070B19] p-3 rounded-xl border border-[#1C2541]">
                    <span className="text-[10px] uppercase text-slate-400 block mb-1">
                      Date & Time
                    </span>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {b.date} at {b.startTime} ({b.durationHours} hrs)
                    </div>
                  </div>

                  <div className="bg-[#070B19] p-3 rounded-xl border border-[#1C2541]">
                    <span className="text-[10px] uppercase text-slate-400 block mb-1">
                      Public Venue
                    </span>
                    <div className="font-semibold text-white flex items-center gap-1.5 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {b.meetingLocation.venueName}
                    </div>
                    <span className="text-[10px] text-slate-400 line-clamp-1">
                      {b.meetingLocation.address}
                    </span>
                  </div>
                </div>

                {b.clientNotes && (
                  <div className="bg-[#070B19] p-3 rounded-xl border border-[#1C2541] text-xs">
                    <span className="text-[10px] uppercase text-slate-400 block mb-0.5">
                      Client Special Notes:
                    </span>
                    <p className="text-slate-300 italic">"{b.clientNotes}"</p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setRejectBookingId(b.id)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors"
                  >
                    Decline Request
                  </button>
                  <button
                    onClick={() => handleAccept(b.id)}
                    className="px-6 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] hover:brightness-110 shadow-md shadow-[#D4AF37]/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Booking</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Active & Confirmed Engagements */}
      <div className="space-y-3 pt-4 border-t border-[#1C2541]">
        <h3 className="text-base font-bold text-white font-serif">
          Upcoming Confirmed Bookings ({activeBookings.length})
        </h3>

        {activeBookings.length === 0 ? (
          <p className="text-xs text-slate-500 bg-[#0B132B] p-4 rounded-xl border border-[#1C2541]">
            No upcoming confirmed bookings at this moment.
          </p>
        ) : (
          <div className="space-y-3">
            {activeBookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#0B132B] rounded-2xl border border-emerald-500/30 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                      {b.bookingCode}
                    </span>
                    <h4 className="text-sm font-bold text-white">{b.serviceTitle}</h4>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {b.status === 'confirmed' ? 'Escrow Confirmed' : 'Accepted • Pending Client Pay'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="text-slate-300">
                    <span className="text-slate-500 block">Client:</span>
                    <strong>{b.clientName}</strong>
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-500 block">Schedule:</span>
                    <strong>{b.date} at {b.startTime}</strong> ({b.durationHours}h)
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-500 block">Location:</span>
                    <strong>{b.meetingLocation.venueName}</strong>, {b.meetingLocation.city}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1C2541]">
                  <div className="text-xs">
                    <span className="text-slate-400">Net Companion Payout: </span>
                    <span className="font-bold text-[#D4AF37] font-mono">
                      ₹{b.pricing.companionPayoutAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenChat(b.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-[#1C2541] hover:bg-[#243356] flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Chat with Client</span>
                    </button>

                    <button
                      onClick={() => onOpenVideoCall(b)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-[#1C2541] hover:bg-[#243356] flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5 text-blue-400" />
                      <span>Video</span>
                    </button>

                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleMarkCompleted(b.id)}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer"
                      >
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B132B] border border-[#1C2541] rounded-2xl max-w-md w-full p-6 text-left shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2">Decline Booking Inquiry</h4>
            <p className="text-xs text-slate-400 mb-4">
              Please share a polite explanation for the client (e.g. prior commitment or out of service radius).
            </p>

            <textarea
              rows={3}
              placeholder="Reason for declining..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl p-3 text-xs text-white mb-4 focus:outline-none focus:border-[#D4AF37]"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectBookingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400"
              >
                Back
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
