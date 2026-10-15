// ==========================================
// COMPANIONX: MASTER APPLICATION ROOT
// ==========================================

import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { Header } from './components/common/Header';
import { AgeGateModal } from './components/common/AgeGateModal';
import { AuthModal } from './components/auth/AuthModal';
import { ClientView } from './components/client/ClientView';
import { CompanionView } from './components/companion/CompanionView';
import { AdminView } from './components/admin/AdminView';
import { DownloadApkModal } from './components/common/DownloadApkModal';
import { BRAND_CONFIG } from './config/brand';
import {
  ShieldCheck,
  Scale,
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Send,
  Smartphone,
} from 'lucide-react';

export function App() {
  const [state, setState] = useState(store.getState());
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
    <div className="min-h-screen bg-[#060714] text-slate-100 flex flex-col font-sans selection:bg-[#FF0080] selection:text-white relative w-full max-w-full overflow-x-hidden">
      {/* Ambient Cyber-Luxury Glows matching Companio Logo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#00D2FF]/10 blur-[140px]" />
        <div className="absolute top-[35%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#FF0080]/10 blur-[160px]" />
        <div className="absolute bottom-[-10%] left-[25%] w-[550px] h-[550px] rounded-full bg-[#8B5CF6]/10 blur-[150px]" />
      </div>

      {/* 1. Mandatory 18+ Age & Lawful Purpose Gate Modal */}
      <AgeGateModal
        isOpen={!state.isAgeGatePassed}
        onConfirm={() => store.setAgeGatePassed(true)}
      />

      {/* 2. Authentication & User Onboarding Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
      />

      {/* 3. Android APK Download Modal */}
      <DownloadApkModal
        isOpen={apkModalOpen}
        onClose={() => setApkModalOpen(false)}
      />

      {/* 4. Notifications Drawer */}
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

      {/* 5. Global Header Navigation */}
      <Header
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenApkDownload={() => setApkModalOpen(true)}
        unreadNotificationsCount={unreadNotifications.length}
      />

      {/* 6. Main Content Routed by Active Role */}
      <main className="flex-1 pb-24 md:pb-8">
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
      <footer className="bg-[#060714] border-t border-[#1B214B] text-xs text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-12 relative z-10 pb-28 md:pb-10">
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
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/40 shadow-lg shadow-purple-500/20 shrink-0"
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
                href={BRAND_CONFIG.telegramSupportUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#00D2FF] hover:text-cyan-300 font-semibold transition-colors"
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span>Official Telegram: <strong>{BRAND_CONFIG.telegramUsername}</strong></span>
              </a>
              <span className="text-slate-400">
                Support Email: <strong className="text-slate-200">{BRAND_CONFIG.supportEmail}</strong>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Desktop Buttons (Hidden on Mobile to prevent overlapping) */}
      <button
        type="button"
        onClick={() => setApkModalOpen(true)}
        className="hidden md:flex fixed bottom-5 left-5 z-40 items-center gap-2.5 bg-[#0B0E23]/95 hover:bg-[#121736] border border-purple-500/50 text-white px-3.5 py-2.5 rounded-full shadow-2xl shadow-purple-950/70 hover:scale-105 transition-all text-xs font-bold cursor-pointer backdrop-blur-md group"
        title="Download Official Companio Android App (APK)"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#00D2FF] to-[#FF0080] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
        </div>
        <div className="flex flex-col text-left leading-tight pr-1">
          <span className="text-[9px] uppercase font-bold tracking-wider text-[#00D2FF]">Android App</span>
          <span className="text-xs font-extrabold text-white">Download APK</span>
        </div>
      </button>

      <a
        href={BRAND_CONFIG.telegramSupportUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-5 right-5 z-40 items-center gap-2.5 bg-gradient-to-r from-[#0088cc] to-[#00D2FF] hover:opacity-95 text-white px-4 py-2.5 rounded-full shadow-2xl shadow-cyan-950/70 hover:scale-105 transition-all group font-bold text-xs"
        title="Official Telegram Support (@companio_male)"
      >
        <div className="relative">
          <Send className="w-5 h-5 text-white fill-current shrink-0" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-100/90">Telegram</span>
          <span className="font-mono text-xs font-black">{BRAND_CONFIG.telegramUsername}</span>
        </div>
      </a>

      {/* NATIVE MOBILE BOTTOM NAVIGATION BAR (Android & Mobile Fit) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060714]/95 backdrop-blur-lg border-t border-[#1B214B] px-3 py-1.5 flex items-center justify-around shadow-2xl" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}>
        {/* 1. Explore / Client */}
        <button
          onClick={() => store.setActiveRole('client')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            state.activeRole === 'client' ? 'text-[#00D2FF]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <img
            src="/logo.jpg"
            alt="Companio"
            className={`w-5 h-5 rounded-full object-cover shrink-0 mb-0.5 ${
              state.activeRole === 'client' ? 'ring-2 ring-[#00D2FF]' : 'opacity-70'
            }`}
          />
          <span className="text-[10px] font-bold tracking-tight">Explore</span>
        </button>

        {/* 2. Download APK */}
        <button
          onClick={() => setApkModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-400 hover:text-white transition-all group"
        >
          <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-[#00D2FF] to-[#FF0080] flex items-center justify-center text-white shrink-0 mb-0.5 shadow-sm">
            <Smartphone className="w-3.5 h-3.5 shrink-0" />
          </div>
          <span className="text-[10px] font-bold text-white tracking-tight">Get APK</span>
        </button>

        {/* 3. Official Telegram Support */}
        <a
          href={BRAND_CONFIG.telegramSupportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[#00D2FF] hover:text-cyan-300 transition-all"
        >
          <div className="relative mb-0.5">
            <Send className="w-5 h-5 shrink-0" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#00D2FF] rounded-full animate-ping" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Telegram</span>
        </a>

        {/* 4. Account / Auth / Admin */}
        <button
          onClick={() => {
            const user = store.getCurrentUser();
            if (user && store.isAdminUser(user)) {
              store.setActiveRole('admin');
            } else if (!user) {
              handleOpenAuth('login');
            } else {
              store.setActiveRole(state.activeRole === 'companion' ? 'client' : 'companion');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            state.activeRole === 'admin' ? 'text-emerald-400' : (state.activeRole === 'companion' ? 'text-purple-400' : 'text-slate-400')
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-[#121736] border border-[#1B214B] flex items-center justify-center text-slate-300 shrink-0 mb-0.5">
            {store.getCurrentUser() ? (
              <img
                src={store.getCurrentUser()?.avatar}
                alt="Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">
            {store.getCurrentUser() ? (store.isAdminUser(store.getCurrentUser()) ? 'Admin' : 'Portal') : 'Login'}
          </span>
        </button>
      </nav>
    </div>
  );
}

export default App;
