// ==========================================
// COMPANIONX: MASTER APPLICATION ROOT
// ==========================================

import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { Header } from './components/common/Header';
import { AgeGateModal } from './components/common/AgeGateModal';
import { SafetySosModal } from './components/common/SafetySosModal';
import { AuthModal } from './components/auth/AuthModal';
import { ClientView } from './components/client/ClientView';
import { CompanionView } from './components/companion/CompanionView';
import { AdminView } from './components/admin/AdminView';
import { DownloadApkModal } from './components/common/DownloadApkModal';
import { BRAND_CONFIG } from './config/brand';
import {
  ShieldCheck,
  Scale,
  PhoneCall,
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  Smartphone,
} from 'lucide-react';

export function App() {
  const [state, setState] = useState(store.getState());
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'client_signup' | 'companion_signup' | 'login'>('client_signup');
  const [apkModalOpen, setApkModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState({ ...store.getState() });
    });
    return unsubscribe;
  }, []);

  const unreadNotifications = state.notifications.filter(
    (n) => n.userId === state.currentUserId && !n.isRead
  );

  const handleOpenAuth = (tab: 'client_signup' | 'companion_signup' | 'login' = 'client_signup') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#060714] text-slate-100 flex flex-col font-sans selection:bg-[#FF0080] selection:text-white relative overflow-x-hidden">
      {/* Ambient Cyber-Luxury Glows matching Companio Logo */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#00D2FF]/10 blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#FF0080]/10 blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[25%] w-[550px] h-[550px] rounded-full bg-[#8B5CF6]/10 blur-[150px] pointer-events-none -z-10" />

      {/* 1. Mandatory 18+ Age & Lawful Purpose Gate Modal */}
      <AgeGateModal
        isOpen={!state.isAgeGatePassed}
        onConfirm={() => store.setAgeGatePassed(true)}
      />

      {/* 2. Global Safety & Emergency Hotlines Hub */}
      <SafetySosModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
      />

      {/* 3. Authentication & User Onboarding Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
      />

      {/* 4. Android APK Download Modal */}
      <DownloadApkModal
        isOpen={apkModalOpen}
        onClose={() => setApkModalOpen(false)}
      />

      {/* 5. Notifications Drawer */}
      {notificationsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#0B0E23] h-full border-l border-[#1B214B] p-5 flex flex-col shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-[#1B214B] mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#FF0080]" />
                <h3 className="text-sm font-bold text-white font-serif">Notifications</h3>
              </div>
              <button
                onClick={() => setNotificationsOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {state.notifications.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">
                  No notifications yet.
                </p>
              ) : (
                state.notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 bg-[#070B19] rounded-xl border border-[#1C2541] text-xs space-y-1"
                  >
                    <div className="font-bold text-white flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">{n.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Global Header Navigation */}
      <Header
        onOpenSos={() => setSosModalOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenApkDownload={() => setApkModalOpen(true)}
        unreadNotificationsCount={unreadNotifications.length}
      />

      {/* 6. Main Content Routed by Active Role */}
      <main className="flex-1">
        {state.activeRole === 'client' && <ClientView onOpenAuth={handleOpenAuth} />}
        {state.activeRole === 'companion' && <CompanionView onOpenAuth={handleOpenAuth} />}
        {state.activeRole === 'admin' && (
          store.isAdminUser(store.getCurrentUser()) ? (
            <AdminView />
          ) : (
            <ClientView onOpenAuth={handleOpenAuth} />
          )
        )}
      </main>

      {/* 7. Footer & Legal Disclaimers */}
      <footer className="bg-[#060714] border-t border-[#1B214B] text-xs text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6 text-left">
          {/* Strict Lawful Compliance Declaration */}
          <div className="p-4 rounded-2xl bg-[#0B0E23]/80 border border-amber-500/30 text-slate-300 space-y-2 backdrop-blur-md">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Scale className="w-4 h-4 shrink-0" />
              <span>Legal Notice & Strict Non-Sexual Companionship Statement</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              {BRAND_CONFIG.strictlyNonSexualNotice}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-[#1B214B]">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Companio Logo"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/40 shadow-lg shadow-purple-500/20"
              />
              <div>
                <span className="text-base font-extrabold tracking-tight brand-gradient-text">
                  {BRAND_CONFIG.appName}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  © {new Date().getFullYear()} {BRAND_CONFIG.appName} Technologies India Private Limited. All rights reserved.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a
                href={BRAND_CONFIG.whatsAppSupportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Customer Care WhatsApp: <strong>7009080906</strong></span>
              </a>
              <span className="text-slate-400">
                National Emergency: <strong className="text-rose-400">112</strong>
              </span>
              <span className="text-slate-400">
                Women Helpline: <strong className="text-amber-400">1091</strong>
              </span>
              <span className="text-slate-400">
                Support: <strong className="text-slate-200">{BRAND_CONFIG.supportEmail}</strong>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Download Android App Button (Bottom Left) */}
      <button
        type="button"
        onClick={() => setApkModalOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2.5 bg-[#0B0E23]/95 hover:bg-[#121736] border border-purple-500/50 text-white px-3.5 py-2.5 rounded-full shadow-2xl shadow-purple-950/70 hover:scale-105 transition-all text-xs font-bold cursor-pointer backdrop-blur-md group"
        title="Download Official Companio Android App (APK)"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00D2FF] to-[#FF0080] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
          <Smartphone className="w-3.5 h-3.5" />
        </div>
        <div className="flex flex-col text-left leading-tight pr-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-[#00D2FF]">Android App</span>
          <span className="text-xs font-extrabold text-white">Download APK</span>
        </div>
      </button>

      {/* Floating 24/7 WhatsApp Customer Care Button */}
      <a
        href={BRAND_CONFIG.whatsAppSupportUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-4 py-2.5 rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-105 transition-all group font-bold text-xs"
        title="24/7 WhatsApp Customer Care: 7009080906"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 text-slate-950 fill-current" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-900/80">WhatsApp Care</span>
          <span className="font-mono text-xs font-black">7009080906</span>
        </div>
      </a>
    </div>
  );
}

export default App;
