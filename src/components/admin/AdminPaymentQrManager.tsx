// ==========================================
// COMPANIO: ADMIN PAYMENT QR & UPI SETTINGS
// Admin updates GPay, PhonePe, Paytm QR & UPI Details
// ==========================================

import React, { useState } from 'react';
import {
  QrCode,
  Save,
  Upload,
  RefreshCw,
  CheckCircle2,
  Trash2,
  ShieldCheck,
  Smartphone,
  Eye,
  Info,
} from 'lucide-react';
import { store } from '../../services/store';
import { PaymentQrConfig, UpiAppType } from '../../types';

export const AdminPaymentQrManager: React.FC = () => {
  const currentConfig = store.getPaymentQrConfig();

  const [upiId, setUpiId] = useState(currentConfig.upiId || 'companio@okhdfcbank');
  const [payeeName, setPayeeName] = useState(currentConfig.payeeName || 'Companio Official Concierge');
  const [merchantCode, setMerchantCode] = useState(currentConfig.merchantCode || 'COMPANIO7299');
  const [instructions, setInstructions] = useState(
    currentConfig.instructions ||
      'Scan using GPay, PhonePe, Paytm, or BHIM. Pay the exact account activation fee and enter your 12-digit UPI / UTR transaction ID for instant verification.'
  );

  // Custom QR Images (Base64 data URLs)
  const [defaultQr, setDefaultQr] = useState<string>(currentConfig.defaultQrImageUrl || '');
  const [gpayQr, setGpayQr] = useState<string>(currentConfig.gpayQrImageUrl || '');
  const [phonepeQr, setPhonepeQr] = useState<string>(currentConfig.phonepeQrImageUrl || '');
  const [paytmQr, setPaytmQr] = useState<string>(currentConfig.paytmQrImageUrl || '');

  const [previewApp, setPreviewApp] = useState<UpiAppType>('all');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim() || !upiId.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. merchant@okhdfcbank).');
      return;
    }

    const updatedConfig: Partial<PaymentQrConfig> = {
      upiId: upiId.trim(),
      payeeName: payeeName.trim(),
      merchantCode: merchantCode.trim(),
      instructions: instructions.trim(),
      defaultQrImageUrl: defaultQr,
      gpayQrImageUrl: gpayQr,
      phonepeQrImageUrl: phonepeQr,
      paytmQrImageUrl: paytmQr,
    };

    const res = store.updatePaymentQrConfig(updatedConfig);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      alert('Payment QR code and UPI merchant settings updated successfully! All users will now see these QR codes.');
    }
  };

  // Compute preview QR code URL
  let previewQrUrl = defaultQr;
  if (previewApp === 'gpay' && gpayQr) previewQrUrl = gpayQr;
  else if (previewApp === 'phonepe' && phonepeQr) previewQrUrl = phonepeQr;
  else if (previewApp === 'paytm' && paytmQr) previewQrUrl = paytmQr;

  if (!previewQrUrl) {
    const rawUpi = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
      payeeName
    )}&am=999&cu=INR&tn=Companio`;
    previewQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&margin=10&data=${encodeURIComponent(
      rawUpi
    )}`;
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="bg-[#0B0E23] p-5 rounded-3xl border border-[#1B214B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white brand-gradient-text">
              Payment QR & UPI Merchant Settings
            </h2>
            <span className="text-[10px] bg-purple-500/15 text-pink-300 px-2 py-0.5 rounded-full font-mono font-bold border border-purple-500/30">
              GPay • PhonePe • Paytm
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Update your receiving UPI ID and upload custom QR codes for Google Pay, PhonePe, and Paytm so companions can pay their onboarding activation fees.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Changes Saved!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SETTINGS FORM */}
        <div className="lg:col-span-7 bg-[#0B0E23] p-6 rounded-3xl border border-[#1B214B] space-y-6 shadow-xl">
          <form onSubmit={handleSave} className="space-y-5">
            {/* Primary UPI Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1B214B]">
                <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
                <span>Primary Receiving UPI Credentials</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    UPI ID / VPA *
                  </label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. companio@okhdfcbank"
                    className="w-full bg-[#060714] border border-[#1B214B] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#00D2FF]"
                  />
                  <span className="text-[10px] text-slate-500">Your bank or merchant UPI handle</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Payee / Merchant Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={payeeName}
                    onChange={(e) => setPayeeName(e.target.value)}
                    placeholder="e.g. Companio Official Concierge"
                    className="w-full bg-[#060714] border border-[#1B214B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                  <span className="text-[10px] text-slate-500">Displayed inside user's UPI app</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Payment Instructions for Companions
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-[#060714] border border-[#1B214B] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>
            </div>

            {/* Custom QR Code Uploads */}
            <div className="space-y-4 pt-2 border-t border-[#1B214B]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-[#1B214B]">
                <QrCode className="w-4 h-4 text-[#FF0080]" />
                <span>Custom QR Code Image Uploads</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                You can upload your official merchant QR codes directly (PNG, JPG, WebP). If not uploaded, the system will automatically generate a dynamic UPI QR code.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Universal UPI QR */}
                <div className="bg-[#060714] p-3.5 rounded-2xl border border-[#1B214B] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Universal UPI QR</span>
                    {defaultQr && (
                      <span className="text-[10px] text-emerald-400 font-semibold">Custom active</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#121736] hover:bg-[#1B214B] text-slate-200 border border-[#1B214B] flex items-center gap-1.5 transition-all">
                      <Upload className="w-3.5 h-3.5 text-[#00D2FF]" />
                      <span>{defaultQr ? 'Replace' : 'Upload QR'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setDefaultQr)}
                        className="hidden"
                      />
                    </label>
                    {defaultQr && (
                      <button
                        type="button"
                        onClick={() => setDefaultQr('')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                        title="Remove custom QR and use auto-generated"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Google Pay QR */}
                <div className="bg-[#060714] p-3.5 rounded-2xl border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Google Pay (GPay) QR</span>
                    {gpayQr && (
                      <span className="text-[10px] text-emerald-400 font-semibold">Custom active</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#121736] hover:bg-[#1B214B] text-slate-200 border border-[#1B214B] flex items-center gap-1.5 transition-all">
                      <Upload className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{gpayQr ? 'Replace' : 'Upload GPay QR'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setGpayQr)}
                        className="hidden"
                      />
                    </label>
                    {gpayQr && (
                      <button
                        type="button"
                        onClick={() => setGpayQr('')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                        title="Remove custom QR"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. PhonePe QR */}
                <div className="bg-[#060714] p-3.5 rounded-2xl border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300">PhonePe QR</span>
                    {phonepeQr && (
                      <span className="text-[10px] text-emerald-400 font-semibold">Custom active</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#121736] hover:bg-[#1B214B] text-slate-200 border border-[#1B214B] flex items-center gap-1.5 transition-all">
                      <Upload className="w-3.5 h-3.5 text-purple-400" />
                      <span>{phonepeQr ? 'Replace' : 'Upload PhonePe QR'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setPhonepeQr)}
                        className="hidden"
                      />
                    </label>
                    {phonepeQr && (
                      <button
                        type="button"
                        onClick={() => setPhonepeQr('')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                        title="Remove custom QR"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 4. Paytm QR */}
                <div className="bg-[#060714] p-3.5 rounded-2xl border border-sky-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-300">Paytm QR</span>
                    {paytmQr && (
                      <span className="text-[10px] text-emerald-400 font-semibold">Custom active</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#121736] hover:bg-[#1B214B] text-slate-200 border border-[#1B214B] flex items-center gap-1.5 transition-all">
                      <Upload className="w-3.5 h-3.5 text-sky-400" />
                      <span>{paytmQr ? 'Replace' : 'Upload Paytm QR'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, setPaytmQr)}
                        className="hidden"
                      />
                    </label>
                    {paytmQr && (
                      <button
                        type="button"
                        onClick={() => setPaytmQr('')}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400"
                        title="Remove custom QR"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs font-bold text-white brand-button shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save & Update Live Payment QR Codes</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: LIVE INTERACTIVE PREVIEW */}
        <div className="lg:col-span-5 bg-[#0B0E23] p-6 rounded-3xl border border-[#1B214B] space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1B214B]">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#00D2FF]" />
                <span>Live User Preview</span>
              </h3>
              <span className="text-[10px] text-pink-300 font-mono">Real-time simulator</span>
            </div>

            {/* App switch tabs */}
            <div className="grid grid-cols-4 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setPreviewApp('all')}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                  previewApp === 'all'
                    ? 'bg-purple-500/25 border-purple-400 text-white'
                    : 'bg-[#060714] border-[#1B214B] text-slate-400'
                }`}
              >
                Universal
              </button>
              <button
                type="button"
                onClick={() => setPreviewApp('gpay')}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                  previewApp === 'gpay'
                    ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300'
                    : 'bg-[#060714] border-[#1B214B] text-slate-400'
                }`}
              >
                GPay
              </button>
              <button
                type="button"
                onClick={() => setPreviewApp('phonepe')}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                  previewApp === 'phonepe'
                    ? 'bg-purple-500/25 border-purple-400 text-purple-200'
                    : 'bg-[#060714] border-[#1B214B] text-slate-400'
                }`}
              >
                PhonePe
              </button>
              <button
                type="button"
                onClick={() => setPreviewApp('paytm')}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                  previewApp === 'paytm'
                    ? 'bg-sky-500/25 border-sky-400 text-sky-200'
                    : 'bg-[#060714] border-[#1B214B] text-slate-400'
                }`}
              >
                Paytm
              </button>
            </div>

            {/* QR Card */}
            <div className="bg-[#060714] p-5 rounded-3xl border border-purple-500/30 flex flex-col items-center text-center space-y-3">
              <div className="p-2.5 rounded-2xl bg-white shadow-xl">
                <img
                  src={previewQrUrl}
                  alt="QR Preview"
                  className="w-48 h-48 object-contain rounded-lg"
                />
              </div>

              <div className="space-y-1 w-full text-left bg-[#0B0E23] p-3 rounded-xl border border-[#1B214B]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[10px]">Active Payee</span>
                  <span className="font-bold text-white text-[11px]">{payeeName}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#1B214B]">
                  <span className="text-slate-400 text-[10px]">UPI VPA</span>
                  <span className="font-mono font-bold text-[#00D2FF] text-[11px]">{upiId}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 italic">
                {previewApp.toUpperCase()} users will see this exact QR code and merchant details.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-[11px] text-slate-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <span>
              Companions will scan this QR, pay the activation fee, and submit their 12-digit UTR. You can then review and activate them in the <strong>Account Activations</strong> queue.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
