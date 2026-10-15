// ==========================================
// COMPANIONX: ANDROID APK DIRECT DOWNLOAD MODAL
// ==========================================

import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ isOpen, onClose }) => {
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const APK_DOWNLOAD_URL = '/api/download/apk';
  const GITHUB_RELEASE_URL = 'https://github.com/kumarsubhash8009ldh/companionx/releases/latest';

  const handleDownload = () => {
    setDownloadStarted(true);
    // Trigger direct download
    const link = document.createElement('a');
    link.href = APK_DOWNLOAD_URL;
    link.setAttribute('download', 'Companio.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#0B0E23] border border-purple-500/30 rounded-3xl max-w-lg w-full my-auto text-left relative shadow-2xl shadow-purple-950/50 overflow-hidden flex flex-col">
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080]" />

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1B214B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00D2FF]/20 via-[#8B5CF6]/20 to-[#FF0080]/20 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Smartphone className="w-5 h-5 text-[#00D2FF]" />
            </div>
            <div>
              <h3 className="text-base font-black brand-gradient-text">
                Companio for Android
              </h3>
              <p className="text-[11px] text-slate-400">
                Official Native Android App (Direct APK Download)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#121736] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-slate-300">
          {/* Hero Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#070B19] to-[#121736] border border-purple-500/30 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Companio.apk</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                  v1.0.0 Stable
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Requires Android 8.0 (Oreo) or later • Free Download
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          {/* Key Native Features */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-[#060714] border border-[#1B214B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00D2FF] shrink-0" />
              <span>Real-Time Notifications</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#060714] border border-[#1B214B] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Fast 1-Tap Booking</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#060714] border border-[#1B214B] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF0080] shrink-0" />
              <span>100% Encrypted & Private</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#060714] border border-[#1B214B] flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Native Fluid Experience</span>
            </div>
          </div>

          {/* Download Action */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleDownload}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white brand-button flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-pink-500/25"
            >
              <Download className="w-4 h-4" />
              <span>Download Companio.apk Directly</span>
            </button>

            {downloadStarted && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  <strong>Download Initiated!</strong> Check your browser downloads for <code>Companio.apk</code>.
                </span>
              </div>
            )}
          </div>

          {/* Installation Instructions (Hindi + English) */}
          <div className="p-3.5 rounded-2xl bg-[#060714] border border-[#1B214B] space-y-2.5 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Installation Steps (Android):</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
              <li>
                Download complete hone ke baad notification me <strong>Companio.apk</strong> par tap karein.
              </li>
              <li>
                Agar Android <span className="text-amber-300">"File might be harmful"</span> puche, to <strong>"Download Anyway"</strong> select karein (kyunki yeh official direct APK hai).
              </li>
              <li>
                Agar required ho, <strong>Settings → "Allow from this source"</strong> ko ON karein.
              </li>
              <li>
                <strong>Install</strong> par tap karein aur app open karein!
              </li>
            </ol>
          </div>

          {/* GitHub Source Link */}
          <div className="text-center pt-1 text-[11px] text-slate-400">
            <span>Also available on GitHub Releases: </span>
            <a
              href={GITHUB_RELEASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00D2FF] hover:underline font-semibold inline-flex items-center gap-1"
            >
              <span>View Release v1.0.0</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
