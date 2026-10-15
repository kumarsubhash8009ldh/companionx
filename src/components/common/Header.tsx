// ==========================================
// COMPANIONX: GLOBAL HEADER & NAVIGATION
// ==========================================

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Bell,
  RefreshCw,
  UserCheck,
  Sparkles,
  PhoneCall,
  Menu,
  X,
  Lock,
  LogOut,
  UserPlus,
  LogIn,
  Send,
  Smartphone,
  Download,
} from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';
import { store } from '../../services/store';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenAuth: (tab?: 'client_signup' | 'companion_signup' | 'login') => void;
  onOpenApkDownload?: () => void;
  onOpenSos?: () => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenAuth,
  onOpenApkDownload,
  unreadNotificationsCount,
}) => {
  const activeRole = store.getActiveRole();
  const currentUser = store.getCurrentUser();
  const isAdmin = store.isAdminUser(currentUser);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    store.setActiveRole(role);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    store.logout();
    alert('Logged out successfully.');
  };

  const handleReset = () => {
    if (confirm('Clear all local data and reset platform to pristine state?')) {
      store.clearAllData();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#060714]/95 backdrop-blur-md border-b border-[#1B214B] w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            <div className="relative group cursor-pointer shrink-0">
              <img
                src="/logo.jpg"
                alt="Companio Logo"
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-cover ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform shrink-0"
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#FF0080] rounded-full ring-2 ring-[#060714] animate-ping" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight brand-gradient-text font-sans truncate">
                  {BRAND_CONFIG.appName}
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gradient-to-r from-cyan-500/15 to-pink-500/15 text-pink-300 border border-pink-500/30 shrink-0">
                  India
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shrink-0" title="Connected to Sync Server">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Server Synced</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden lg:block truncate">
                Male Escorts & Curated Companionship Service
              </p>
            </div>
          </div>

          {/* Role Switcher Pills (Desktop) - Admin only visible to 7009600157 */}
          <div className="hidden md:flex items-center bg-[#0B0E23] p-1 rounded-full border border-[#1B214B] shrink-0">
            <button
              onClick={() => handleRoleChange('client')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeRole === 'client'
                  ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Client View
            </button>
            <button
              onClick={() => handleRoleChange('companion')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeRole === 'companion'
                  ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Companion Portal
            </button>
            {isAdmin && (
              <button
                onClick={() => handleRoleChange('admin')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeRole === 'admin'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Lock className="w-3 h-3" />
                Admin Panel
              </button>
            )}
          </div>

          {/* Quick Actions & Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Direct Android APK Download Button (Desktop/Tablet) */}
            {onOpenApkDownload && (
              <button
                type="button"
                onClick={onOpenApkDownload}
                className="hidden lg:flex items-center gap-1.5 bg-gradient-to-r from-[#00D2FF]/20 via-[#8B5CF6]/20 to-[#FF0080]/20 hover:from-[#00D2FF]/30 hover:to-[#FF0080]/30 text-white border border-purple-500/40 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-purple-500/10 cursor-pointer shrink-0"
                title="Download Official Companio Android App (APK)"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
                <span>Android APK</span>
              </button>
            )}

            {/* 24/7 Telegram Support */}
            <a
              href={BRAND_CONFIG.telegramSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-[#0088cc]/20 hover:bg-[#0088cc]/30 text-[#00D2FF] border border-[#0088cc]/40 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm shrink-0"
              title="Official Telegram Support (@companio_male)"
            >
              <Send className="w-3.5 h-3.5 text-[#00D2FF] shrink-0" />
              <span>Telegram</span>
            </a>

            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-[#0B0E23] hover:bg-[#121736] border border-[#1B214B] text-slate-300 hover:text-white transition-all shrink-0"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-purple-300 shrink-0" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF0080] text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm shadow-pink-500/50">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User State (Desktop) */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-[#1B214B] shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-purple-500/50 shrink-0"
                />
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                    {currentUser.fullName.split(' ')[0]}
                    {currentUser.role === 'admin' ? (
                      <span className="text-[10px] text-emerald-400 font-mono">(Admin)</span>
                    ) : (
                      <UserCheck className="w-3 h-3 text-[#00D2FF] shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">{currentUser.role}</div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#121736] transition-colors shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1 sm:gap-1.5 shrink-0">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-[#0B0E23] hover:bg-[#121736] border border-[#1B214B] transition-colors flex items-center gap-1 shrink-0"
                >
                  <LogIn className="w-3 h-3 text-[#00D2FF] shrink-0" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => onOpenAuth('client_signup')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white brand-button transition-all flex items-center gap-1 shrink-0"
                >
                  <UserPlus className="w-3 h-3 shrink-0" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Clear data helper (Desktop only) */}
            <button
              onClick={handleReset}
              className="hidden 2xl:block p-2 rounded-lg bg-[#0B0E23] hover:bg-[#121736] border border-[#1B214B] text-slate-400 hover:text-white transition-all shrink-0"
              title="Clear & Reset Database"
            >
              <RefreshCw className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Mobile menu button (ALWAYS visible and inside screen with right padding) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#0B0E23] hover:bg-[#121736] border border-[#1B214B] text-slate-200 shrink-0 active:scale-95 transition-all shadow-sm"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 shrink-0 text-rose-400" /> : <Menu className="w-4 h-4 shrink-0 text-[#00D2FF]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#060714] border-b border-[#1B214B] px-4 py-3 space-y-3 animate-in slide-in-from-top-2 duration-150">
          {/* User Account / Auth inside Mobile Drawer */}
          {currentUser ? (
            <div className="p-3 rounded-xl bg-[#0B0E23] border border-[#1B214B] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="w-9 h-9 rounded-full object-cover border border-purple-500/50"
                />
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{currentUser.fullName}</span>
                    {currentUser.role === 'admin' ? (
                      <span className="text-[10px] text-emerald-400 font-mono px-1 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">Admin</span>
                    ) : (
                      <span className="text-[10px] text-[#00D2FF] capitalize">{currentUser.role}</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{currentUser.phone}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="px-2.5 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 text-xs font-semibold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="py-2 px-3 rounded-xl bg-[#0B0E23] hover:bg-[#121736] border border-[#1B214B] text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>Log In</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('client_signup');
                }}
                className="py-2 px-3 rounded-xl brand-button text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}

          <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider text-left">
            Switch Interface
          </p>
          <div className={`grid ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleRoleChange('client');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-medium text-center ${
                activeRole === 'client'
                  ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white font-bold'
                  : 'bg-[#0B0E23] text-slate-300'
              }`}
            >
              Client
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleRoleChange('companion');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-medium text-center ${
                activeRole === 'companion'
                  ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white font-bold'
                  : 'bg-[#0B0E23] text-slate-300'
              }`}
            >
              Companion
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleRoleChange('admin');
                }}
                className={`py-2 px-3 rounded-lg text-xs font-medium text-center ${
                  activeRole === 'admin'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-[#0B0E23] text-slate-300'
                }`}
              >
                Admin Panel
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-[#1B214B] space-y-2">
            {onOpenApkDownload && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenApkDownload();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#00D2FF]/20 via-[#8B5CF6]/20 to-[#FF0080]/20 border border-purple-500/40 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Smartphone className="w-4 h-4 text-[#00D2FF]" />
                <span>Download Android App (APK)</span>
              </button>
            )}

            <a
              href={BRAND_CONFIG.telegramSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/40 text-[#00D2FF] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#0088cc]/30 transition-all shadow-md"
            >
              <Send className="w-4 h-4 text-[#00D2FF] shrink-0" />
              <span>Telegram Concierge: {BRAND_CONFIG.telegramUsername}</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleReset();
              }}
              className="w-full py-2 px-3 rounded-lg bg-[#0B0E23] border border-[#1B214B] text-slate-400 hover:text-white text-xs flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset & Clear Local Cache</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
