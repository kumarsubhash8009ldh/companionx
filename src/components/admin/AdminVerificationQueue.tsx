// ==========================================
// COMPANIONX: ADMIN KYC & IDENTITY QUEUE
// ==========================================

import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  Eye,
  FileText,
  AlertCircle,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { store } from '../../services/store';
import { VerificationRequest } from '../../types';

export const AdminVerificationQueue: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'rejected' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const state = store.getState();
  const requests = state.verificationRequests;

  const handleConfirmDecision = () => {
    if (!selectedRequest || !reviewAction) return;

    store.reviewVerification(
      selectedRequest.id,
      reviewAction,
      reviewNotes || `${reviewAction === 'approved' ? 'Verified UIDAI match' : 'Documents unclear'}`
    );

    alert(`Verification ${reviewAction.toUpperCase()} for ${selectedRequest.companionName}.`);
    setSelectedRequest(null);
    setReviewAction(null);
    setReviewNotes('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white font-serif">
            Companion Verification & Government KYC Queue
          </h3>
          <p className="text-xs text-slate-400">
            Review masked Aadhaar, Passport, and liveness cross-checks prior to profile publication.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
          {requests.filter((r) => r.status === 'pending').length} Pending Review
        </span>
      </div>

      {/* Requests Table */}
      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#070B19] text-slate-400 uppercase text-[10px] border-b border-[#1C2541]">
              <tr>
                <th className="px-6 py-3">Companion</th>
                <th className="px-6 py-3">Document Type</th>
                <th className="px-6 py-3">Masked ID Number</th>
                <th className="px-6 py-3">Joining Fee</th>
                <th className="px-6 py-3">Submitted At</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2541]">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    No verification requests submitted.
                  </td>
                </tr>
              ) : (
                requests.map((req) => {
                  const comp = state.companionProfiles.find((c) => c.id === req.companionId);
                  return (
                    <tr key={req.id} className="hover:bg-[#1C2541]/30 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-white">
                        {req.companionName}
                      </td>
                      <td className="px-6 py-3.5 uppercase text-slate-300 font-mono">
                        {req.idType.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[#D4AF37]">
                        {req.idNumberMasked}
                      </td>
                      <td className="px-6 py-3.5">
                        {comp?.isJoiningFeePaid ? (
                          <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            ₹{state.companionJoiningFee} Paid
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            ₹{state.companionJoiningFee} Due
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-slate-400">
                        {new Date(req.submittedAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            req.status === 'approved'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : req.status === 'pending'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {req.status.toUpperCase()}
                        </span>
                      </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] hover:brightness-110"
                      >
                        Inspect & Review
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Inspection Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B132B] border border-[#D4AF37]/40 rounded-2xl max-w-xl w-full p-6 text-left shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2541]">
              <div>
                <h4 className="text-base font-bold text-white font-serif">
                  KYC Review: {selectedRequest.companionName}
                </h4>
                <p className="text-xs text-slate-400">
                  Document ID: {selectedRequest.idNumberMasked} ({selectedRequest.idType})
                </p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Document Preview Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#070B19] rounded-xl border border-[#1C2541] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Government ID Photo
                </span>
                <img
                  src={selectedRequest.documentFrontUrl}
                  alt="Govt ID"
                  className="w-full h-28 object-cover rounded-lg border border-slate-700"
                />
              </div>

              <div className="p-3 bg-[#070B19] rounded-xl border border-[#1C2541] space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Liveness Selfie Match
                </span>
                <img
                  src={selectedRequest.selfieWithIdUrl}
                  alt="Selfie"
                  className="w-full h-28 object-cover rounded-lg border border-slate-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Auditor Assessment Notes *
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Verified Aadhaar XML online match, photo cross-checked."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setReviewAction('rejected');
                  handleConfirmDecision();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/30"
              >
                Reject Verification
              </button>
              <button
                onClick={() => {
                  setReviewAction('approved');
                  handleConfirmDecision();
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md"
              >
                Approve & Activate Companion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
