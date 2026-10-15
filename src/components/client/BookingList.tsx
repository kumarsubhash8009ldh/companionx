// ==========================================
// COMPANIONX: CLIENT BOOKINGS MANAGEMENT
// ==========================================

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Video,
  FileText,
  CreditCard,
  XCircle,
  Star,
  RefreshCw,
  AlertTriangle,
  Download,
} from 'lucide-react';
import { Booking, BookingStatus } from '../../types';
import { store } from '../../services/store';
import { PaymentGatewayService } from '../../services/paymentService';

interface BookingListProps {
  onOpenChat: (bookingId: string) => void;
  onOpenVideoCall: (booking: Booking) => void;
  onOpenDispute: (booking: Booking) => void;
}

export const BookingList: React.FC<BookingListProps> = ({
  onOpenChat,
  onOpenVideoCall,
  onOpenDispute,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [reviewBookingId, setReviewBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('');

  const currentUser = store.getCurrentUser();
  const allBookings = currentUser
    ? store.getState().bookings.filter((b) => b.clientId === currentUser.id)
    : [];

  const filteredBookings = allBookings.filter((b) => {
    if (activeTab === 'upcoming') {
      return b.status === 'requested' || b.status === 'accepted' || b.status === 'confirmed';
    }
    if (activeTab === 'completed') {
      return b.status === 'completed';
    }
    if (activeTab === 'cancelled') {
      return (
        b.status === 'cancelled' ||
        b.status === 'rejected' ||
        b.status === 'refund_pending' ||
        b.status === 'refunded' ||
        b.status === 'disputed'
      );
    }
    return true;
  });

  const handlePayAndConfirm = (bookingId: string) => {
    const res = store.confirmAndPayBooking(bookingId, 'upi');
    if (res.success) {
      alert('Payment of ₹' + res.payment?.amount + ' successful via UPI (Verified). Booking Confirmed!');
    }
  };

  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    const res = store.cancelBooking(cancelModalBooking.id, 'client', cancelReason || 'Client requested cancellation.');
    if (res.success) {
      alert(`Booking cancelled. Refund of ₹${res.refundAmount} initiated per policy.`);
      setCancelModalBooking(null);
      setCancelReason('');
    }
  };

  const handleSubmitReview = (bookingId: string) => {
    if (!reviewComment.trim()) {
      alert('Please write a brief comment about your experience.');
      return;
    }
    store.submitReview(bookingId, reviewRating, reviewComment);
    setReviewBookingId(null);
    setReviewComment('');
    alert('Thank you! Your verified review has been submitted.');
  };

  const handleDownloadInvoice = (booking: Booking) => {
    const inv = PaymentGatewayService.generateInvoice(booking, booking.paymentId || 'pay_tx_demo');
    setSelectedInvoice(inv);
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'requested':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Awaiting Companion Acceptance
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
            Accepted • Ready for Payment
          </span>
        );
      case 'confirmed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Confirmed & Escrowed
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            Completed
          </span>
        );
      case 'cancelled':
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
            {status === 'rejected' ? 'Declined by Companion' : 'Cancelled'}
          </span>
        );
      case 'refunded':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
            Refund Processed
          </span>
        );
      case 'disputed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            Under Safety Review
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 text-left">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1C2541] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'upcoming'
              ? 'bg-[#D4AF37] text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-[#0B132B]'
          }`}
        >
          Upcoming & Active ({allBookings.filter((b) => b.status === 'requested' || b.status === 'accepted' || b.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'completed'
              ? 'bg-[#D4AF37] text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-[#0B132B]'
          }`}
        >
          Completed ({allBookings.filter((b) => b.status === 'completed').length})
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'cancelled'
              ? 'bg-[#D4AF37] text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-[#0B132B]'
          }`}
        >
          Cancelled / Disputed
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
            activeTab === 'all'
              ? 'bg-[#D4AF37] text-slate-950 font-bold'
              : 'text-slate-400 hover:text-white bg-[#0B132B]'
          }`}
        >
          All Bookings ({allBookings.length})
        </button>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-[#0B132B] rounded-2xl p-8 text-center border border-[#1C2541]">
          <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-white mb-1">No Bookings Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You don't have any bookings in this section yet. Browse verified companions to schedule an occasion.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#0B132B] rounded-2xl border border-[#1C2541] hover:border-slate-700 transition-all p-5 space-y-4"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1C2541]">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-md border border-[#D4AF37]/30">
                    {b.bookingCode}
                  </span>
                  <span className="text-sm font-bold text-white font-serif">{b.serviceTitle}</span>
                </div>
                <div>{getStatusBadge(b.status)}</div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#070B19] p-3 rounded-xl border border-[#1C2541]">
                  <span className="text-[10px] uppercase text-slate-400 block mb-1">Companion</span>
                  <div className="font-semibold text-white">{b.companionName}</div>
                  <span className="text-[11px] text-[#D4AF37] font-mono">
                    ₹{b.pricing.hourlyRate}/hr • {b.durationHours} hrs
                  </span>
                </div>

                <div className="bg-[#070B19] p-3 rounded-xl border border-[#1C2541]">
                  <span className="text-[10px] uppercase text-slate-400 block mb-1">Date & Time</span>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {b.date} at {b.startTime}
                  </div>
                  <span className="text-[10px] text-slate-400">{b.durationHours} Hours duration</span>
                </div>

                <div className="bg-[#070B19] p-3 rounded-xl border border-[#1C2541]">
                  <span className="text-[10px] uppercase text-slate-400 block mb-1">Meeting Location</span>
                  <div className="font-semibold text-white flex items-center gap-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {b.meetingLocation.venueName}
                  </div>
                  <span className="text-[10px] text-slate-400 line-clamp-1">
                    {b.meetingLocation.address}, {b.meetingLocation.city}
                  </span>
                </div>
              </div>

              {/* Fee & Action Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Total Escrow:</span>
                  <span className="text-sm font-bold text-[#D4AF37] font-mono">
                    ₹{b.pricing.totalAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    (incl. facilitation & 18% GST)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Action 1: If Accepted, Pay & Confirm */}
                  {b.status === 'accepted' && (
                    <button
                      onClick={() => handlePayAndConfirm(b.id)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] hover:brightness-110 flex items-center gap-1.5 shadow-sm"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Pay & Confirm (₹{b.pricing.totalAmount})</span>
                    </button>
                  )}

                  {/* Action 2: Chat (Unlocked once accepted/confirmed) */}
                  {(b.status === 'accepted' || b.status === 'confirmed') && (
                    <button
                      onClick={() => onOpenChat(b.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-[#1C2541] hover:bg-[#243356] flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Chat</span>
                    </button>
                  )}

                  {/* Action 3: Virtual Video Call */}
                  {b.status === 'confirmed' && (
                    <button
                      onClick={() => onOpenVideoCall(b)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-[#1C2541] hover:bg-[#243356] flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5 text-blue-400" />
                      <span>Video Call</span>
                    </button>
                  )}

                  {/* Action 4: Invoice */}
                  {(b.status === 'confirmed' || b.status === 'completed') && (
                    <button
                      onClick={() => handleDownloadInvoice(b)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-[#070B19] hover:bg-[#1C2541] border border-[#1C2541] flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Invoice</span>
                    </button>
                  )}

                  {/* Action 5: Review */}
                  {b.status === 'completed' && (
                    <button
                      onClick={() => setReviewBookingId(b.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>Write Review</span>
                    </button>
                  )}

                  {/* Action 6: Cancel */}
                  {(b.status === 'requested' || b.status === 'accepted' || b.status === 'confirmed') && (
                    <button
                      onClick={() => setCancelModalBooking(b)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}

                  {/* Action 7: Dispute */}
                  <button
                    onClick={() => onOpenDispute(b)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300"
                    title="File Dispute / Support Ticket"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B132B] border border-[#1C2541] rounded-2xl max-w-md w-full p-6 text-left shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2">Review Your Experience</h4>
            <p className="text-xs text-slate-400 mb-4">
              Your feedback is verified and helps maintain our high standards of professional companionship.
            </p>

            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= reviewRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              placeholder="Describe your dining or conversational experience..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl p-3 text-xs text-white mb-4 focus:outline-none focus:border-[#D4AF37]"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setReviewBookingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmitReview(reviewBookingId)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012]"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal with Dynamic Policy Calculation */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B132B] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl">
            <h4 className="text-base font-bold text-white mb-2">Cancel Booking {cancelModalBooking.bookingCode}</h4>
            <div className="p-3 bg-[#070B19] rounded-xl border border-[#1C2541] text-xs text-slate-300 space-y-1.5 mb-4">
              <p className="font-semibold text-amber-400">Refund Policy Schedule:</p>
              <p>• More than 24 hours prior: 100% full refund.</p>
              <p>• Between 12 to 24 hours: 50% refund.</p>
              <p>• Under 12 hours: Non-refundable (companion held slot).</p>
            </div>

            <textarea
              rows={2}
              placeholder="Reason for cancellation..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl p-3 text-xs text-white mb-4 focus:outline-none focus:border-rose-400"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400"
              >
                Keep Booking
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B132B] border border-[#D4AF37]/40 rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2541] mb-4">
              <div>
                <h4 className="text-base font-bold text-white font-serif">Tax Invoice & Receipt</h4>
                <p className="text-xs text-slate-400">{selectedInvoice.invoiceNumber}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-[#070B19] p-4 rounded-xl border border-[#1C2541] mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="text-white font-mono">{selectedInvoice.invoiceDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Client:</span>
                <span className="text-white">{selectedInvoice.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verified Companion:</span>
                <span className="text-white">{selectedInvoice.companionName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Service:</span>
                <span className="text-white">{selectedInvoice.serviceTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration & Venue:</span>
                <span className="text-white text-right">
                  {selectedInvoice.meetingDuration} at {selectedInvoice.meetingLocation}
                </span>
              </div>
              <div className="border-t border-[#1C2541] pt-2 flex justify-between">
                <span className="text-slate-400">Base Companion Fee:</span>
                <span className="text-white font-mono">₹{selectedInvoice.baseAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Platform Facilitation Fee:</span>
                <span className="text-white font-mono">₹{selectedInvoice.platformCommissionAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GST (18% on Facilitation):</span>
                <span className="text-white font-mono">₹{selectedInvoice.gstAmount}</span>
              </div>
              <div className="border-t border-[#1C2541] pt-2 flex justify-between font-bold text-sm">
                <span className="text-white">Total Amount Paid:</span>
                <span className="text-[#D4AF37] font-mono">₹{selectedInvoice.totalPaid}</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 mb-4 leading-normal italic">
              {selectedInvoice.legalDisclaimer}
            </p>

            <button
              onClick={() => {
                alert('Invoice downloaded successfully (PDF representation saved).');
                setSelectedInvoice(null);
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] flex items-center justify-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Invoice</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
