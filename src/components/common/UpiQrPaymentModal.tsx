// ==========================================
// COMPANIO: UPI QR PAYMENT & ACTIVATION MODAL
// Supports Google Pay, PhonePe, Paytm & BHIM QR
// ==========================================

import React, { useState } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  Upload,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Clock,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { store } from '../../services/store';
import { UpiAppType, PaymentQrConfig, CompanionProfile } from '../../types';

interface UpiQrPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  companion: CompanionProfile;
  amount: number;
  title?: string;
  description?: string;
}

export const UpiQrPaymentModal: React.FC<UpiQrPaymentModalProps> = ({
  isOpen,
  onClose,
  companion,
  amount,
  title = 'Account Activation & Onboarding Fee',
  description = 'Pay via Google Pay, PhonePe, or Paytm QR to verify your identity and activate your companion profile.',
}) => {
  const qrConfig: PaymentQrConfig = store.getPaymentQrConfig();
  const [selectedApp, setSelectedApp] = useState<UpiAppType>('all');
  const [utrNumber, setUtrNumber] = useState(companion.lastSubmittedUtr || '');
  const [senderUpiId, setSenderUpiId] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const upiId = qrConfig.upiId || 'companio@okhdfcbank';
  const payeeName = qrConfig.payeeName || 'Companio Official Concierge';

  // Construct raw UPI payment string for UPI intent and QR generation
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent('Companio Joining Verification')}`;

  // Determine which QR code to show:
  // 1. If admin uploaded custom app-specific QR
  // 2. Or fallback to dynamic generated UPI QR
  let activeQrImageUrl = qrConfig.defaultQrImageUrl;
  if (selectedApp === 'gpay' && qrConfig.gpayQrImageUrl) {
    activeQrImageUrl = qrConfig.gpayQrImageUrl;
  } else if (selectedApp === 'phonepe' && qrConfig.phonepeQrImageUrl) {
    activeQrImageUrl = qrConfig.phonepeQrImageUrl;
  } else if (selectedApp === 'paytm' && qrConfig.paytmQrImageUrl) {
    activeQrImageUrl = qrConfig.paytmQrImageUrl;
  }

  // Fallback to dynamic QR Code API if no custom image uploaded by admin
  const finalQrUrl =
    activeQrImageUrl ||
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=12&data=${encodeURIComponent(
      upiUrl
    )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Screenshot file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 8) {
      setErrorMsg('Please enter a valid 12-digit UPI / UTR Transaction Reference Number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = store.submitAccountActivationRequest({
        companionId: companion.id,
        upiApp: selectedApp,
        utrNumber: cleanUtr,
        screenshotUrl: screenshotPreview || undefined,
        senderUpiId: senderUpiId.trim() || undefined,
      });

      setIsSubmitting(false);
      if (res.success) {
        setSuccessMsg(
          'Payment proof submitted successfully! Admin will audit your UTR and activate your account shortly.'
        );
      } else {
        setErrorMsg(res.error || 'Failed to submit payment proof.');
      }
    }, 600);
  };

  const isPendingApproval = companion.activationStatus === 'pending_approval';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#0B0E23] border border-purple-500/30 rounded-3xl max-w-xl w-full my-auto text-left relative shadow-2xl shadow-purple-950/50 overflow-hidden flex flex-col">
        {/* Top Accent Gradient */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080]" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1B214B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-pink-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white brand-gradient-text">
                {title}
              </h3>
              <p className="text-[11px] text-slate-400">
                Official UPI Gateway • Instant QR Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#121736] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Pending Approval Notice if already submitted */}
          {isPendingApproval && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-spin" />
              <div className="space-y-1">
                <span className="font-bold text-amber-300">
                  Payment Submitted • Awaiting Admin Activation
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Your payment of <strong>₹{amount}</strong> (UTR: <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300 font-mono">{companion.lastSubmittedUtr}</code>) is currently under review by our compliance team. Your account will automatically activate once approved.
                </p>
              </div>
            </div>
          )}

          {/* Amount Due Card */}
          <div className="bg-[#060714] p-4 rounded-2xl border border-purple-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                Total Amount Due
              </span>
              <div className="text-2xl font-black font-mono brand-gradient-text">
                ₹{amount.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                18% GST Included
              </span>
              <p className="text-[11px] text-slate-400 mt-1">One-time Onboarding</p>
            </div>
          </div>

          {/* UPI App Selection Tabs */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">
              1. Select Preferred UPI App
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedApp('all')}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                  selectedApp === 'all'
                    ? 'bg-gradient-to-r from-[#00D2FF]/20 to-[#FF0080]/20 border-purple-500 text-white shadow-md'
                    : 'bg-[#060714] border-[#1B214B] text-slate-400 hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4 text-[#00D2FF]" />
                <span className="text-[10px]">All UPI</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedApp('gpay')}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                  selectedApp === 'gpay'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-[#060714] border-[#1B214B] text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-black text-emerald-400">GPay</span>
                <span className="text-[10px]">Google Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedApp('phonepe')}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                  selectedApp === 'phonepe'
                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-md'
                    : 'bg-[#060714] border-[#1B214B] text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-black text-purple-400">पे</span>
                <span className="text-[10px]">PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedApp('paytm')}
                className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center justify-center gap-1 border transition-all ${
                  selectedApp === 'paytm'
                    ? 'bg-sky-500/15 border-sky-400 text-sky-200 shadow-md'
                    : 'bg-[#060714] border-[#1B214B] text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xs font-black text-sky-400">Paytm</span>
                <span className="text-[10px]">Paytm UPI</span>
              </button>
            </div>
          </div>

          {/* QR Code Presentation Box */}
          <div className="bg-[#060714] p-5 rounded-3xl border border-[#1B214B] flex flex-col items-center text-center space-y-4">
            <div className="relative p-3 rounded-2xl bg-white shadow-2xl shadow-purple-500/20 ring-4 ring-purple-500/30">
              <img
                src={finalQrUrl}
                alt="Companio UPI QR Code"
                className="w-56 h-56 object-contain rounded-lg"
              />
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#060714] border border-purple-500/50 text-[10px] font-bold text-pink-300 font-mono shadow-md">
                ₹{amount}
              </div>
            </div>

            {/* UPI ID & One-Click Copy */}
            <div className="w-full max-w-sm space-y-2">
              <div className="flex items-center justify-between bg-[#0B0E23] px-3.5 py-2.5 rounded-xl border border-[#1B214B] text-xs">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block uppercase">UPI ID (VPA)</span>
                  <span className="font-mono font-bold text-white tracking-wide">{upiId}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-[#121736] hover:bg-[#1B214B] text-slate-200 border border-[#1B214B] flex items-center gap-1 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#00D2FF]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>Payee: <strong className="text-slate-200">{payeeName}</strong></span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Merchant
                </span>
              </div>
            </div>

            {/* Direct UPI Intent Button (Mobile) */}
            <a
              href={upiUrl}
              className="w-full max-w-sm py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#121736] hover:bg-[#1B214B] border border-purple-500/40 flex items-center justify-center gap-2 transition-all"
            >
              <Smartphone className="w-4 h-4 text-[#00D2FF]" />
              <span>Tap to Open in UPI App (Mobile)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          {/* Step 2: Proof Submission Form */}
          <form onSubmit={handleSubmitProof} className="space-y-4 pt-2 border-t border-[#1B214B]">
            <div>
              <label className="text-xs font-bold text-white block mb-1">
                2. Enter 12-Digit UPI / UTR Reference Number *
              </label>
              <input
                type="text"
                required
                maxLength={20}
                placeholder="e.g. 428987654321 (found in GPay/PhonePe receipt)"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                className="w-full bg-[#060714] border border-[#1B214B] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#00D2FF] focus:ring-1 focus:ring-[#00D2FF]/40"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                After completing the payment in GPay/PhonePe/Paytm, copy the 12-digit UTR/UPI Ref ID from transaction details.
              </p>
            </div>

            {/* Optional screenshot upload */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Payment Screenshot / Receipt (Optional for Faster Approval)
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-3.5 py-2 rounded-xl text-xs font-medium bg-[#060714] border border-[#1B214B] hover:border-purple-500/50 text-slate-300 flex items-center gap-2 transition-all">
                  <Upload className="w-3.5 h-3.5 text-[#FF0080]" />
                  <span>Choose Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {screenshotPreview && (
                  <div className="flex items-center gap-2">
                    <img
                      src={screenshotPreview}
                      alt="Proof"
                      className="w-10 h-10 rounded-lg object-cover border border-purple-500/40"
                    />
                    <span className="text-[11px] text-emerald-400 font-medium">Image attached</span>
                    <button
                      type="button"
                      onClick={() => setScreenshotPreview(null)}
                      className="text-slate-400 hover:text-rose-400 text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sender UPI ID (Optional) */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Your Sender UPI ID or Mobile Number (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 9876543210@paytm or sender@okhdfcbank"
                value={senderUpiId}
                onChange={(e) => setSenderUpiId(e.target.value)}
                className="w-full bg-[#060714] border border-[#1B214B] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF]"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white brand-button shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Verification Request...</span>
              ) : (
                <>
                  <span>Submit Proof for Admin Account Activation</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
