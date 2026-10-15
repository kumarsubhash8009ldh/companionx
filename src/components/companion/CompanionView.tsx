// ==========================================
// COMPANIONX: COMPANION PORTAL CONTAINER
// ==========================================

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  User,
  Wallet,
  Sparkles,
  MessageSquare,
  AlertCircle,
  Video,
  UserPlus,
  LogIn,
  CreditCard,
  CheckCircle2,
  X,
  QrCode,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { store } from '../../services/store';
import { Booking } from '../../types';
import { CompanionBookings } from './CompanionBookings';
import { AvailabilityManager } from './AvailabilityManager';
import { VerificationModal } from './VerificationModal';
import { ProfileEditor } from './ProfileEditor';
import { EarningsPayoutView } from './EarningsPayoutView';
import { CompanionMemberships } from './CompanionMemberships';
import { ClientChat } from '../client/ClientChat';
import { VideoCallModal } from '../client/VideoCallModal';
import { UpiQrPaymentModal } from '../common/UpiQrPaymentModal';

interface CompanionViewProps {
  onOpenAuth?: (tab?: 'client_signup' | 'companion_signup' | 'login') => void;
}

export const CompanionView: React.FC<CompanionViewProps> = ({ onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<
    'bookings' | 'availability' | 'profile' | 'earnings' | 'membership' | 'chat'
  >('bookings');

  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [joiningFeeModalOpen, setJoiningFeeModalOpen] = useState(false);
  const [chatConvId, setChatConvId] = useState<string | undefined>(undefined);
  const [activeVideoCall, setActiveVideoCall] = useState<Booking | null>(null);

  const currentUser = store.getCurrentUser();
  const state = store.getState();
  const comp = currentUser
    ? state.companionProfiles.find((c) => c.userId === currentUser.id)
    : null;

  const joiningFee = state.companionJoiningFee || 999;

  // If not logged in as a companion
  if (!currentUser || currentUser.role !== 'companion' || !comp) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-[#0B0E23] rounded-3xl border border-purple-500/30 text-center space-y-5 shadow-2xl shadow-purple-950/40">
        <div className="relative mx-auto w-20 h-20">
          <img
            src="/logo.jpg"
            alt="Companio Logo"
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/30 mx-auto"
          />
        </div>
        <h2 className="text-2xl font-black brand-gradient-text tracking-tight">
          Join Companio as a Professional Companion
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
          Offer your cultured company for gourmet dining, weddings, art gallery walks, and thoughtful accompaniment across India. Zero dummy accounts — complete registration to launch your verified profile.
        </p>

        <div className="pt-3 flex items-center justify-center gap-3">
          {onOpenAuth && (
            <>
              <button
                onClick={() => onOpenAuth('companion_signup')}
                className="px-6 py-3 rounded-xl text-xs font-bold text-white brand-button shadow-lg shadow-pink-500/25 flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register as a Male Companion</span>
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-[#121736] hover:bg-[#1B214B] border border-[#1B214B] flex items-center gap-1.5 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const handleOpenChat = (bookingId: string) => {
    const conv = state.conversations.find((c) => c.bookingId === bookingId);
    if (conv) setChatConvId(conv.id);
    setActiveTab('chat');
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Companion Header Bar */}
      <div className="bg-[#0B0E23] p-5 rounded-3xl border border-[#1B214B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-xl">
        <div className="flex items-center gap-3.5">
          <img
            src={comp.approvedPhotos[0] || currentUser.avatar}
            alt={currentUser.fullName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/50 ring-2 ring-purple-500/30"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-white font-sans">
                {currentUser.fullName}
              </h2>
              {comp.verificationStatus === 'approved' ? (
                <span className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Government Verified
                </span>
              ) : (
                <button
                  onClick={() => setVerificationModalOpen(true)}
                  className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full hover:bg-amber-500/25"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  ID Verification Pending
                </button>
              )}

              {comp.isJoiningFeePaid ? (
                <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ₹{joiningFee} Settled • Account Active
                </span>
              ) : comp.activationStatus === 'pending_approval' ? (
                <button
                  onClick={() => setJoiningFeeModalOpen(true)}
                  className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full hover:bg-amber-500/25 animate-pulse"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  ₹{joiningFee} Paid • Pending Admin Approval
                </button>
              ) : (
                <button
                  onClick={() => setJoiningFeeModalOpen(true)}
                  className="flex items-center gap-1 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[10px] font-semibold px-2 py-0.5 rounded-full hover:bg-rose-500/25 animate-pulse"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  ₹{joiningFee} Activation Fee Due
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {comp.profession} • {comp.city} • {comp.approvedPhotos.length}/10 Photos • Rating {comp.rating.toFixed(1)} ★
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!comp.isJoiningFeePaid && (
            <button
              onClick={() => setJoiningFeeModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white brand-button shadow-md shadow-pink-500/25 flex items-center gap-1.5 cursor-pointer hover:brightness-110"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>
                {comp.activationStatus === 'pending_approval'
                  ? 'Payment Status (Pending Approval)'
                  : `Pay Activation Fee (₹${joiningFee})`}
              </span>
            </button>
          )}

          {comp.verificationStatus !== 'approved' && (
            <button
              onClick={() => setVerificationModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-[#121736] hover:bg-[#1B214B] border border-[#1B214B] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Verify Government ID</span>
            </button>
          )}
        </div>
      </div>

      {/* JOINING FEE ALERT BANNER (If not paid) */}
      {!comp.isJoiningFeePaid && (
        <div className="bg-gradient-to-r from-amber-500/10 via-[#0B0E23] to-pink-500/10 border border-purple-500/30 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-lg">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 text-pink-400 mt-0.5">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                {comp.activationStatus === 'pending_approval' ? (
                  <>
                    <span>Payment Reference Submitted (UTR: {comp.lastSubmittedUtr})</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold animate-pulse">
                      Pending Admin Verification
                    </span>
                  </>
                ) : (
                  <>
                    <span>One-Time Onboarding & Activation Fee Due: ₹{joiningFee}</span>
                    <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded font-mono font-bold">
                      Pay via GPay / PhonePe / Paytm
                    </span>
                  </>
                )}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                {comp.activationStatus === 'pending_approval'
                  ? `Your payment of ₹${joiningFee} is currently under verification by the Chief Compliance Officer. Once your UTR reference is confirmed, your companion profile will be activated and open for bookings.`
                  : `Companio maintains verified accounts only. Scan the Google Pay, PhonePe, or Paytm QR code, pay the ₹${joiningFee} onboarding fee, and submit your 12-digit UTR transaction ID for instant activation.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setJoiningFeeModalOpen(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white brand-button shadow-lg shadow-pink-500/25 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>
              {comp.activationStatus === 'pending_approval'
                ? 'View Submitted Proof / Re-submit'
                : `Pay ₹${joiningFee} via QR Code`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#1B214B] pb-3 overflow-x-auto text-left">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'bookings'
              ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Bookings & Requests</span>
        </button>

        <button
          onClick={() => setActiveTab('availability')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'availability'
              ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Calendar & Slots</span>
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'earnings'
              ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Earnings & Payouts</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile & 10-Photos Gallery</span>
        </button>

        <button
          onClick={() => setActiveTab('membership')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'membership'
              ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tier & Spotlight Boost</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
              : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Client Messaging</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'bookings' && (
        <CompanionBookings
          onOpenChat={handleOpenChat}
          onOpenVideoCall={(b) => setActiveVideoCall(b)}
        />
      )}

      {activeTab === 'availability' && <AvailabilityManager />}

      {activeTab === 'earnings' && <EarningsPayoutView />}

      {activeTab === 'profile' && <ProfileEditor />}

      {activeTab === 'membership' && <CompanionMemberships />}

      {activeTab === 'chat' && (
        <ClientChat
          conversationId={chatConvId}
          onBack={() => setActiveTab('bookings')}
        />
      )}

      {/* Verification Modal */}
      <VerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        onSuccess={() => alert('Verification submitted! Our compliance team will audit within 24 hours.')}
      />

      {/* JOINING FEE / ACCOUNT ACTIVATION QR PAYMENT MODAL */}
      <UpiQrPaymentModal
        isOpen={joiningFeeModalOpen}
        onClose={() => setJoiningFeeModalOpen(false)}
        companion={comp}
        amount={joiningFee}
      />

      {/* Video Call Modal */}
      <VideoCallModal
        booking={activeVideoCall}
        isOpen={!!activeVideoCall}
        onClose={() => setActiveVideoCall(null)}
      />
    </div>
  );
};
