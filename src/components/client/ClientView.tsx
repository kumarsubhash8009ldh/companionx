// ==========================================
// COMPANIONX: CLIENT APPLICATION MAIN VIEW
// ==========================================

import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  Star,
  Users,
  MessageSquare,
  BookmarkCheck,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { store } from '../../services/store';
import { CompanionProfile, Booking, LawfulServiceCategory } from '../../types';
import { BRAND_CONFIG, CITIES_IN_INDIA, LAWFUL_SERVICES } from '../../config/brand';
import { CompanionCard } from './CompanionCard';
import { CompanionDetailModal } from './CompanionDetailModal';
import { BookingModal } from './BookingModal';
import { BookingList } from './BookingList';
import { ClientChat } from './ClientChat';
import { VideoCallModal } from './VideoCallModal';
import { ClientSubscriptions } from './ClientSubscriptions';

interface ClientViewProps {
  onOpenAuth?: (tab?: 'client_signup' | 'companion_signup' | 'login') => void;
}

export const ClientView: React.FC<ClientViewProps> = ({ onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'bookings' | 'chat' | 'membership' | 'support'>('browse');

  // Directory Filters
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);

  // Modals
  const [selectedCompanion, setSelectedCompanion] = useState<CompanionProfile | null>(null);
  const [bookingCompanion, setBookingCompanion] = useState<CompanionProfile | null>(null);
  const [activeVideoCallBooking, setActiveVideoCallBooking] = useState<Booking | null>(null);
  const [chatConversationId, setChatConversationId] = useState<string | undefined>(undefined);
  const [reportCompanion, setReportCompanion] = useState<CompanionProfile | null>(null);
  const [reportReason, setReportReason] = useState<any>('unlawful_solicitation');
  const [reportDesc, setReportDesc] = useState<string>('');

  const state = store.getState();
  const companions = state.companionProfiles;

  // Filter companions
  const filteredCompanions = companions.filter((comp) => {
    if (comp.isPaused) return false;
    if (verifiedOnly && comp.verificationStatus !== 'approved') return false;
    if (selectedCity !== 'All Cities' && comp.city !== selectedCity) return false;
    if (selectedCategory !== 'all') {
      const hasCategory = comp.servicesOffered.some((s) => s.category === selectedCategory);
      if (!hasCategory) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = comp.fullName.toLowerCase().includes(q);
      const matchBio = comp.bio.toLowerCase().includes(q);
      const matchCity = comp.city.toLowerCase().includes(q);
      const matchInterest = comp.interests.some((i) => i.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchCity && !matchInterest) return false;
    }
    return true;
  });

  const handleOpenChatFromBooking = (bookingId: string) => {
    const conv = state.conversations.find((c) => c.bookingId === bookingId);
    if (conv) {
      setChatConversationId(conv.id);
    }
    setActiveTab('chat');
  };

  const handleReportSubmit = () => {
    if (!reportCompanion || !reportDesc.trim()) {
      alert('Please describe the issue.');
      return;
    }
    store.fileSafetyReport({
      reportedUserId: reportCompanion.userId,
      reportedUserName: reportCompanion.fullName,
      reasonCategory: reportReason,
      description: reportDesc,
    });
    alert('Report submitted to Platform Safety Sentinel. Our compliance team will review within 2 hours.');
    setReportCompanion(null);
    setReportDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Navigation Tabs Bar */}
      <div className="flex items-center justify-between border-b border-[#1C2541] pb-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'browse'
                ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
                : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Discover Companions</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
                : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>My Bookings</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
                : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>In-App Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('membership')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'membership'
                ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
                : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Elite Circle</span>
          </button>
        </div>

        {/* 18+ Compliance Seal */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
          <span>Aadhaar/Passport Verified • Strictly Lawful</span>
        </div>
      </div>

      {/* TAB 1: BROWSE COMPANIONS */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Hero Banner with Official Companio Logo */}
          <div className="relative rounded-3xl p-6 sm:p-10 overflow-hidden bg-gradient-to-r from-[#0B0E23] via-[#060714] to-[#121736] border border-purple-500/30 text-left shadow-2xl shadow-purple-950/40">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF0080]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00D2FF]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/30">
                  <span className="w-2 h-2 rounded-full bg-[#FF0080] animate-ping" />
                  <span className="text-[11px] uppercase font-bold tracking-widest brand-gradient-text">
                    Curated Male Escorts & Social Accompaniment
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-sans">
                  Refined Male Escorts & Companions for <span className="brand-gradient-text">Elite Social Occasions</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Connect with articulate, cultured gentlemen for dinner dates, VIP galas, destination weddings, and intellectual accompaniment across major metropolitan hubs in India.
                </p>
              </div>

              {/* Logo Emblem Presentation */}
              <div className="hidden md:flex flex-col items-center shrink-0">
                <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] shadow-2xl shadow-pink-500/30">
                  <img
                    src="/logo.jpg"
                    alt="Companio Logo"
                    className="w-32 h-32 rounded-[22px] object-cover"
                  />
                </div>
                <span className="text-[11px] font-bold tracking-wider brand-gradient-text mt-2 font-mono">
                  COMPANIO
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-[#0B0E23] p-4 rounded-3xl border border-[#1B214B] space-y-3 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search Bar */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, interests (e.g. Art, Tennis, Wine, AI)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#060714] border border-[#1B214B] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              {/* City Dropdown */}
              <div className="sm:col-span-3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-[#060714] border border-[#1B214B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                >
                  {CITIES_IN_INDIA.map((city) => (
                    <option key={city} value={city} className="bg-[#060714]">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Dropdown */}
              <div className="sm:col-span-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#060714] border border-[#1B214B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                >
                  <option value="all">All Lawful Occasions</option>
                  {LAWFUL_SERVICES.map((svc) => (
                    <option key={svc.category} value={svc.category} className="bg-[#060714]">
                      {svc.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1B214B] text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-400 mr-1">Lawful Themes:</span>
                {LAWFUL_SERVICES.slice(0, 4).map((s) => (
                  <button
                    key={s.category}
                    onClick={() =>
                      setSelectedCategory(selectedCategory === s.category ? 'all' : s.category)
                    }
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      selectedCategory === s.category
                        ? 'bg-[#D4AF37] text-slate-950 font-bold'
                        : 'bg-[#1C2541] text-slate-300 hover:text-white'
                    }`}
                  >
                    {s.badge}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-700 text-[#D4AF37] focus:ring-[#D4AF37] bg-[#070B19]"
                />
                <span className="text-[11px] font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Verified IDs Only
                </span>
              </label>
            </div>
          </div>

          {/* Companion Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white font-serif">
                Available Companions ({filteredCompanions.length})
              </h2>
              <span className="text-xs text-slate-400">
                Sorted by Concierge Verified Score
              </span>
            </div>

            {filteredCompanions.length === 0 ? (
              <div className="bg-[#0B132B] rounded-2xl p-10 text-center border border-[#1C2541]">
                <Users className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white mb-1">
                  No Companions Registered in this Category Yet
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                  All dummy accounts have been cleared. Be the first verified adult male companion to create your professional profile on CompanionX!
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedCity('All Cities');
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-[#1C2541] hover:bg-[#243356]"
                  >
                    Clear Filters
                  </button>
                  {onOpenAuth && (
                    <button
                      onClick={() => onOpenAuth('companion_signup')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] shadow-md"
                    >
                      Join as a Male Companion
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanions.map((comp) => (
                  <CompanionCard
                    key={comp.id}
                    companion={comp}
                    onViewProfile={(c) => setSelectedCompanion(c)}
                    onBookNow={(c) => setBookingCompanion(c)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY BOOKINGS */}
      {activeTab === 'bookings' && (
        <BookingList
          onOpenChat={handleOpenChatFromBooking}
          onOpenVideoCall={(b) => setActiveVideoCallBooking(b)}
          onOpenDispute={(b) => {
            setReportCompanion(companions.find((c) => c.id === b.companionId) || null);
          }}
        />
      )}

      {/* TAB 3: IN-APP CHAT */}
      {activeTab === 'chat' && (
        <ClientChat
          conversationId={chatConversationId}
          onBack={() => setActiveTab('bookings')}
        />
      )}

      {/* TAB 4: MEMBERSHIP & PRIVILEGES */}
      {activeTab === 'membership' && <ClientSubscriptions />}

      {/* MODAL 1: COMPANION DETAILS */}
      <CompanionDetailModal
        companion={selectedCompanion}
        onClose={() => setSelectedCompanion(null)}
        onBookNow={(c) => {
          setSelectedCompanion(null);
          setBookingCompanion(c);
        }}
        onReport={(c) => {
          setSelectedCompanion(null);
          setReportCompanion(c);
        }}
      />

      {/* MODAL 2: BOOKING WIZARD */}
      <BookingModal
        companion={bookingCompanion}
        isOpen={!!bookingCompanion}
        onClose={() => setBookingCompanion(null)}
        onSuccess={() => {
          alert('Booking request sent successfully to companion for review!');
          setActiveTab('bookings');
        }}
      />

      {/* MODAL 3: VIDEO CALL ROOM */}
      <VideoCallModal
        booking={activeVideoCallBooking}
        isOpen={!!activeVideoCallBooking}
        onClose={() => setActiveVideoCallBooking(null)}
      />

      {/* MODAL 4: SAFETY REPORT & BLOCK */}
      {reportCompanion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0B132B] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              File Safety Report: {reportCompanion.fullName}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              All reports are audited by our compliance sentinel and escalated within 2 hours.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Violation Category
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="unlawful_solicitation">Unlawful Sexual Solicitation / Request</option>
                  <option value="harassment">Harassment or Inappropriate Conduct</option>
                  <option value="no_show">No Show at Agreed Public Venue</option>
                  <option value="misleading_profile">Misleading Profile / Impersonation</option>
                  <option value="other">Other Violation</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Incident Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide precise details of the incident..."
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setReportCompanion(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500"
              >
                Submit Report & Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
