// ==========================================
// COMPANIONX: ADMIN SAFETY & INCIDENT MODERATION
// ==========================================

import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  UserX,
  CheckCircle2,
  Ban,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { store } from '../../services/store';
import { SafetyReport } from '../../types';

export const AdminSafetyModeration: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<SafetyReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const state = store.getState();
  const reports = state.reports;

  const handleResolve = (action: 'suspend_user' | 'dismiss' | 'warning_issued') => {
    if (!selectedReport) return;

    store.resolveSafetyReport(
      selectedReport.id,
      action,
      resolutionNotes || `Administrative action: ${action}`
    );

    alert(`Incident resolved with action: ${action.replace('_', ' ').toUpperCase()}`);
    setSelectedReport(null);
    setResolutionNotes('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>Reported Incidents & Zero-Tolerance Sentinel</span>
          </h3>
          <p className="text-xs text-slate-400">
            Immediate escalation queue for unlawful sexual solicitation, harassment, or safety breaches.
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
          {reports.filter((r) => r.status === 'pending').length} Open Incidents
        </span>
      </div>

      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#070B19] text-slate-400 uppercase text-[10px] border-b border-[#1C2541]">
              <tr>
                <th className="px-6 py-3">Reported Entity</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Filed By</th>
                <th className="px-6 py-3">Incident Synopsis</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2541]">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No safety reports or incidents filed. Platform is operating normally.
                  </td>
                </tr>
              ) : (
                reports.map((rep) => (
                  <tr key={rep.id} className="hover:bg-[#1C2541]/30 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-white">
                      {rep.reportedUserName}
                    </td>
                    <td className="px-6 py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase">
                      {rep.reasonCategory.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-300">
                    {rep.reporterName} ({rep.reporterRole})
                  </td>
                  <td className="px-6 py-3.5 text-slate-400 max-w-xs truncate">
                    {rep.description}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        rep.status === 'resolved'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {rep.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedReport(rep)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30"
                    >
                      Audit Report
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Incident Resolution Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B132B] border border-rose-500/40 rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C2541]">
              <div>
                <h4 className="text-base font-bold text-white font-serif">
                  Safety Incident #{selectedReport.id.slice(-6)}
                </h4>
                <p className="text-xs text-rose-400">
                  Target: {selectedReport.reportedUserName}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#070B19] p-4 rounded-xl border border-[#1C2541] space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Complainant Incident Statement
              </span>
              <p className="text-slate-300 leading-relaxed italic">
                "{selectedReport.description}"
              </p>
              <div className="pt-2 text-[10px] text-slate-500 flex justify-between">
                <span>Reporter: {selectedReport.reporterName}</span>
                <span>Date: {new Date(selectedReport.createdAt).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Resolution Action Notes
              </label>
              <textarea
                rows={2}
                placeholder="Log reason for suspension or dismissal..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleResolve('dismiss')}
                className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Dismiss Report
              </button>
              <button
                onClick={() => handleResolve('warning_issued')}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30"
              >
                Issue Warning
              </button>
              <button
                onClick={() => handleResolve('suspend_user')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md"
              >
                Permanently Suspend & Ban
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
