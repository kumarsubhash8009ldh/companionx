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
  MessageCircle,
} from 'lucide-react';
import { BRAND_CONFIG } from '../../config/brand';
import { store } from '../../services/store';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenSos: () => void;
  onOpenNotifications: () => void;
  onOpenAuth: (tab?: 'client_signup' | 'companion_signup' | 'login') => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSos,
  onOpenNotifications,
  onOpenAuth,
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
    <header className="sticky top-0 z-40 bg-[#060714]/90 backdrop-blur-md border-b border-[#1B214B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <img
                src="/logo.jpg"
                alt="Companio Logo"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF0080] rounded-full ring-2 ring-[#060714] animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight brand-gradient-text font-sans">
                  {BRAND_CONFIG.appName}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gradient-to-r from-cyan-500/15 to-pink-500/15 text-pink-300 border border-pink-500/30">
                  India
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300" title="Connected to Sync Server">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Server Synced</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Male Escorts & Curated Companionship Service
              </p>
            </div>
          </div>

          {/* Role Switcher Pills (Desktop) - Admin only visible to 7009600157 */}
          <div className="hidden md:flex items-center bg-[#0B0E23] p-1 rounded-full border border-[#1B214B]">
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 24/7 WhatsApp Customer Care */}
            <a
              href={BRAND_CONFIG.whatsAppSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
              title="WhatsApp Customer Care (7009080906)"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">WhatsApp</span>
              <span>Care</span>
            </a>

            {/* SOS Emergency Button */}
            <button
              onClick={onOpenSos}
              className="flex items-center gap-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              title="Emergency Hotlines & Platform SOS"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="font-semibold text-rose-400">SOS</span>
              <span className="hidden lg:inline text-[11px] text-rose-200/80">Helpdesk</span>
            </button>

            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-[#0B0E23] hover:bg-[#121736] border border-[#1B214B] text-slate-300 hover:text-white transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-purple-300" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF0080] text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm shadow-pink-500/50">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User State */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#1B214B]">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-purple-500/50"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                    {currentUser.fullName.split(' ')[0]}
                    {currentUser.role === 'admin' ? (
                      <span className="text-[10px] text-emerald-400 font-mono">(Admin)</span>
                    ) : (
                      <UserCheck className="w-3 h-3 text-[#00D2FF]" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">{currentUser.role}</div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-[#121736] transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#0B0E23] hover:bg-[#121736] border border-[#1B214B] transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3 text-[#00D2FF]" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={() => onOpenAuth('client_signup')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white brand-button transition-all flex items-center gap-1"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Clear data helper */}
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-[#0B0E23] hover:bg-[#121736] border border-[#1B214B] text-slate-400 hover:text-white transition-all"
              title="Clear & Reset Database"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[#0B0E23] text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#060714] border-b border-[#1B214B] px-4 py-3 space-y-2">
          <p className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
            Switch Interface
          </p>
          <div className={`grid ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
            <button
              onClick={() => handleRoleChange('client')}
              className={`py-2 px-3 rounded-lg text-xs font-medium text-center ${
                activeRole === 'client'
                  ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white font-bold'
                  : 'bg-[#0B0E23] text-slate-300'
              }`}
            >
              Client
            </button>
            <button
              onClick={() => handleRoleChange('companion')}
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
                onClick={() => handleRoleChange('admin')}
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

          <div className="pt-2 border-t border-[#1B214B]">
            <a
              href={BRAND_CONFIG.whatsAppSupportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Customer Care (7009080906)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
