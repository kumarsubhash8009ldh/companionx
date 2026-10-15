// ==========================================
// COMPANIONX: GOVERNMENT ID & KYC VERIFICATION
// ==========================================

import React, { useState } from 'react';
import {
  ShieldCheck,
  Upload,
  Lock,
  FileCheck,
  AlertCircle,
  X,
  Camera,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { store } from '../../services/store';
import { IdDocumentType } from '../../types';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [docType, setDocType] = useState<IdDocumentType>('aadhaar');
  const [idNumberLast4, setIdNumberLast4] = useState<string>('8921');
  const [frontUploaded, setFrontUploaded] = useState<boolean>(true);
  const [backUploaded, setBackUploaded] = useState<boolean>(true);
  const [selfieUploaded, setSelfieUploaded] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUser = store.getCurrentUser();
  const comp = currentUser
    ? store.getState().companionProfiles.find((c) => c.userId === currentUser.id)
    : null;

  const handleSubmit = () => {
    if (!idNumberLast4 || idNumberLast4.length < 4) {
      setErrorMsg('Please enter the last 4 digits of your government ID.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const masked =
        docType === 'aadhaar'
          ? `XXXX-XXXX-${idNumberLast4}`
          : docType === 'passport'
          ? `Z-XXXXXX${idNumberLast4.slice(-1)}`
          : `DL-XXXX-${idNumberLast4}`;

      store.submitVerification({
        companionId: comp?.id || 'comp_prof_1',
        idType: docType,
        idNumberMasked: masked,
        documentFrontUrl:
          'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        documentBackUrl:
          'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
        selfieWithIdUrl:
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      });

      setSubmitting(false);
      onSuccess();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#0B132B] border border-[#1C2541] rounded-2xl max-w-lg w-full my-auto text-left relative shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1C2541] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-serif">
                Government Identity Verification (KYC)
              </h3>
              <p className="text-[11px] text-slate-400">
                Mandatory for receiving companion bookings in India
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Privacy & Encryption Guarantee Banner */}
          <div className="p-3.5 bg-[#070B19] rounded-xl border border-[#D4AF37]/30 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#D4AF37]">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero Public Exposure Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Your government identity documents, full identity numbers, and private residential details are <strong>never shown to clients or visible on your public profile</strong>. They are stored in an encrypted vault accessible solely to our licensed Indian verification auditors.
            </p>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Document Type Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Select Indian Government ID
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'aadhaar', label: 'Aadhaar Card' },
                { type: 'passport', label: 'Indian Passport' },
                { type: 'driving_licence', label: 'Driving Licence' },
                { type: 'voter_id', label: 'Voter ID (EPIC)' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setDocType(item.type as IdDocumentType)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                    docType === item.type
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white font-bold'
                      : 'border-[#1C2541] bg-[#070B19] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Masked ID Number */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Last 4 Digits of Document
            </label>
            <div className="flex items-center gap-2">
              <span className="bg-[#070B19] px-3 py-2 rounded-xl border border-[#1C2541] text-xs font-mono text-slate-500">
                XXXX-XXXX-
              </span>
              <input
                type="text"
                maxLength={4}
                value={idNumberLast4}
                onChange={(e) => setIdNumberLast4(e.target.value.replace(/\D/g, ''))}
                placeholder="8921"
                className="w-24 bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Upload Slots */}
          <div className="grid grid-cols-2 gap-3">
            {/* Front */}
            <div className="p-3 bg-[#070B19] rounded-xl border border-[#1C2541] text-center space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Front Side Photo
              </span>
              <div className="h-20 rounded-lg bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center text-xs text-slate-400">
                {frontUploaded ? (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                    <FileCheck className="w-4 h-4" />
                    <span>Attached</span>
                  </div>
                ) : (
                  <Upload className="w-5 h-5 text-slate-500" />
                )}
              </div>
            </div>

            {/* Liveness Cross-Check Selfie */}
            <div className="p-3 bg-[#070B19] rounded-xl border border-[#1C2541] text-center space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Liveness Face Match
              </span>
              <div className="h-20 rounded-lg bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center text-xs text-slate-400">
                {selfieUploaded ? (
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Face Match Done</span>
                  </div>
                ) : (
                  <Camera className="w-5 h-5 text-slate-500" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1C2541] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 cursor-pointer transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{submitting ? 'Submitting to Vault...' : 'Submit for Verification'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
