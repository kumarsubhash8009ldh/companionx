// ==========================================
// COMPANIONX: ADMIN IMMUTABLE AUDIT TRAIL
// ==========================================

import React, { useState } from 'react';
import {
  FileText,
  Download,
  ShieldCheck,
  Search,
  Clock,
  Terminal,
} from 'lucide-react';
import { store } from '../../services/store';

export const AdminAuditLogs: React.FC = () => {
  const [search, setSearch] = useState('');
  const logs = store.getState().adminAuditLogs;

  const filtered = logs.filter((log) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.adminName.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  const handleExportLogs = () => {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `companionx-audit-trail-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#D4AF37]" />
            <span>Immutable Administrative Audit Trail</span>
          </h3>
          <p className="text-xs text-slate-400">
            Cryptographically timestamped record of administrative interventions, KYC approvals, and commission changes.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] flex items-center gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#070B19] text-slate-400 uppercase text-[10px] border-b border-[#1C2541]">
              <tr>
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Admin Persona</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Target Resource</th>
                <th className="px-6 py-3">Details</th>
                <th className="px-6 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2541]">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-[#1C2541]/30 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-white">
                    {log.adminName}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="font-mono text-[10px] bg-[#1C2541] text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-300">
                    {log.targetResource}
                  </td>
                  <td className="px-6 py-3.5 text-slate-300 max-w-sm">
                    {log.details}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
