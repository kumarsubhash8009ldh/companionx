// ==========================================
// COMPANIONX: VIRTUAL AUDIO/VIDEO CALL ROOM
// ==========================================

import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  ShieldCheck,
  Code,
  Info,
  Maximize2,
  Volume2,
} from 'lucide-react';
import { Booking } from '../../types';

interface VideoCallModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [callDurationSec, setCallDurationSec] = useState(0);
  const [showSdkDocs, setShowSdkDocs] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isOpen) {
      setCallDurationSec(0);
      timer = setInterval(() => {
        setCallDurationSec((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="bg-[#0B132B] border border-[#1C2541] rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl relative text-left">
        {/* Call Header */}
        <div className="px-6 py-3.5 bg-[#070B19]/90 border-b border-[#1C2541] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1C2541] flex items-center justify-center text-[#D4AF37] font-bold text-xs border border-[#D4AF37]/30">
              CX
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{booking.companionName}</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                  {formatTimer(callDurationSec)}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {booking.serviceTitle} • End-to-End Encrypted Session
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSdkDocs(!showSdkDocs)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-[#1C2541] hover:bg-[#243356]"
            >
              <Code className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{showSdkDocs ? 'Hide SDK Spec' : 'SDK Provider Info'}</span>
            </button>
          </div>
        </div>

        {/* Video Canvas Area */}
        <div className="flex-1 relative bg-slate-950 p-4 flex items-center justify-center overflow-hidden">
          {/* Main Remote Video Stream (Companion) */}
          <div className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-900 border border-[#1C2541] flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80"
              alt="Companion Video Feed"
              className="w-full h-full object-cover"
            />
            {/* Status Overlays */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>{booking.companionName} (Live 1080p)</span>
            </div>

            {/* Self-View Picture-in-Picture */}
            <div className="absolute bottom-4 right-4 w-32 sm:w-44 aspect-[4/3] rounded-xl overflow-hidden bg-slate-800 border-2 border-[#D4AF37]/50 shadow-xl">
              {videoActive ? (
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="Client Camera Feed"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 text-xs">
                  <VideoOff className="w-5 h-5 mb-1" />
                  <span>Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-1 left-2 text-[10px] text-white/80 font-medium">
                You ({micActive ? 'Unmuted' : 'Muted'})
              </div>
            </div>
          </div>

          {/* Third-Party SDK Integration Sheet Drawer */}
          {showSdkDocs && (
            <div className="absolute inset-y-4 right-4 w-80 sm:w-96 bg-[#0B132B]/95 backdrop-blur-md border border-[#D4AF37]/40 rounded-2xl p-5 shadow-2xl text-xs text-slate-300 space-y-3 overflow-y-auto animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#1C2541]">
                <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Audio/Video Architecture</span>
                </h4>
                <button
                  onClick={() => setShowSdkDocs(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <p className="leading-relaxed text-slate-400">
                To activate production real-time video in India, CompanionX uses secure tokenized RTC architecture via Agora.io or Twilio Programmable Video.
              </p>

              <div className="bg-[#070B19] p-3 rounded-xl border border-[#1C2541] space-y-1.5 font-mono text-[10px]">
                <div className="text-[#D4AF37] font-bold">// 1. Generate RTC Token on Cloud Function</div>
                <div>POST /api/video/generateToken</div>
                <div>Body: &#123; bookingId: "{booking.bookingCode}" &#125;</div>
                <div className="text-slate-500">// 2. Client joins channel with dynamic ephemeral key</div>
                <div>agoraEngine.join(appId, channel, token, uid)</div>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-300 text-[11px]">
                <strong>Privacy Note:</strong> Media streams are peer-to-peer or routed through Indian media relays (Mumbai datacenter) with zero server-side recording without explicit mutual consent.
              </div>
            </div>
          )}
        </div>

        {/* Call Controls Toolbar */}
        <div className="px-6 py-4 bg-[#070B19] border-t border-[#1C2541] flex items-center justify-center gap-4">
          <button
            onClick={() => setMicActive(!micActive)}
            className={`p-3.5 rounded-full transition-all ${
              micActive
                ? 'bg-[#1C2541] hover:bg-[#243356] text-white'
                : 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
            }`}
            title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setVideoActive(!videoActive)}
            className={`p-3.5 rounded-full transition-all ${
              videoActive
                ? 'bg-[#1C2541] hover:bg-[#243356] text-white'
                : 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
            }`}
            title={videoActive ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {videoActive ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* End Call Button */}
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
