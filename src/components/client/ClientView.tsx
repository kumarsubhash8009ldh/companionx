// ==========================================
// COMPANIONX: PREMIUM CLIENT VIEW & SHOWCASE
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
  Smartphone,
  Download,
  Send,
  Lock,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  ChevronRight,
  Heart,
  Award,
  Zap,
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
  const [activeTab, setActiveTab] = useState<'browse' | 'bookings' | 'chat' | 'membership'>('browse');

  // Directory Filters
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price_low' | 'price_high'>('recommended');

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
  let filteredCompanions = companions.filter((comp) => {
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
      const matchProfession = comp.profession.toLowerCase().includes(q);
      const matchInterest = comp.interests.some((i) => i.toLowerCase().includes(q));
      if (!matchName && !matchBio && !matchCity && !matchProfession && !matchInterest) return false;
    }
    return true;
  });

  // Sort companions
  filteredCompanions.sort((a, b) => {
    const minRateA = a.servicesOffered.length > 0 ? Math.min(...a.servicesOffered.map((s) => s.hourlyRate)) : 1000;
    const minRateB = b.servicesOffered.length > 0 ? Math.min(...b.servicesOffered.map((s) => s.hourlyRate)) : 1000;

    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'price_low') {
      return minRateA - minRateB;
    }
    if (sortBy === 'price_high') {
      return minRateB - minRateA;
    }
    // recommended: featured first, then rating
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.rating - a.rating;
  });

  const handleOpenChatFromBooking = (bookingId: string) => {
    const conv = state.conversations.find((c) => c.bookingId === bookingId);
    if (conv) {
      setChatConversationId(conv.id);
    }
    setActiveTab('chat');
  };

  const POPULAR_CITIES = [
    'All Cities',
    'Delhi NCR (Delhi, Gurgaon, Noida, Faridabad)',
    'Mumbai',
    'Bengaluru',
    'Chandigarh (Tricity)',
    'Jaipur',
    'Goa (North & South)',
    'Pune',
    'Kolkata',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-8">
      {/* Top Navigation Tabs Bar */}
      <div className="flex items-center justify-between border-b border-[#1C2541] pb-3 overflow-x-auto gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'browse'
                ? 'brand-button text-white shadow-md shadow-pink-500/25'
                : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Discover Escorts</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'bookings'
                ? 'brand-button text-white shadow-md shadow-pink-500/25'
                : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>My Bookings ({state.bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'chat'
                ? 'brand-button text-white shadow-md shadow-pink-500/25'
                : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Concierge Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('membership')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'membership'
                ? 'brand-button text-white shadow-md shadow-pink-500/25'
                : 'text-slate-400 hover:text-white bg-[#0B0E23] border border-[#1B214B]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Elite Circle</span>
          </button>
        </div>

        {/* 100% ID Verified Trust Seal */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-300 bg-[#0B0E23] px-3 py-1.5 rounded-full border border-cyan-500/30">
          <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
          <span>Govt ID Verified • End-to-End Privacy</span>
        </div>
      </div>

      {/* TAB 1: BROWSE COMPANIONS */}
      {activeTab === 'browse' && (
        <div className="space-y-8">
          {/* ========================================================= */}
          {/* 1. HERO BANNER: LUXURY SHOWCASE WITH STATS & QUICK ACTIONS */}
          {/* ========================================================= */}
          <div className="relative rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden bg-gradient-to-br from-[#0B0E28] via-[#070A1E] to-[#14193F] border border-purple-500/30 text-left shadow-2xl shadow-purple-950/50">
            {/* Glowing Accent Orbs */}
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#FF0080]/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00D2FF]/15 rounded-full blur-[110px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/3 w-[350px] h-[350px] bg-[#8B5CF6]/15 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-3xl space-y-4">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-pink-500/15 border border-purple-500/30 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-[#FF0080] animate-ping" />
                  <span className="text-[10px] sm:text-[11px] uppercase font-extrabold tracking-widest brand-gradient-text">
                    India’s Premier Male Escorts & Curated Companionship
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15] font-sans">
                  Refined Male Escorts for{' '}
                  <span className="brand-gradient-text">
                    Elite Dinners, Galas & Travel
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-normal">
                  Connect directly with verified, cultured gentlemen across Delhi NCR, Mumbai, Bengaluru, Chandigarh, and major Indian cities for gourmet dining dates, destination weddings, black-tie events, and leisure travel accompaniment.
                </p>

                {/* CTA Action Row */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    href="#companion-directory"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl brand-button hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-pink-500/30 transition-all cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <span>Explore Companions</span>
                  </a>

                  <a
                    href={`${BRAND_CONFIG.telegramSupportUrl}?text=${encodeURIComponent(
                      'Hello Companio Concierge, I want to inquire about booking an escort / companion.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#141B3B] hover:bg-[#1B2452] border border-[#00D2FF]/40 text-[#00D2FF] font-bold text-xs sm:text-sm transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram Concierge</span>
                  </a>

                  <a
                    href="/api/download/apk"
                    download="Companio.apk"
                    className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition-all"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Download APK (.apk)</span>
                  </a>
                </div>

                {/* Live Stats Bar */}
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[#1C2541]/70">
                  <div className="p-2.5 rounded-xl bg-[#060714]/60 border border-[#1B214B]">
                    <span className="text-lg sm:text-xl font-black text-white font-mono block">50+</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400">Verified Escorts</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#060714]/60 border border-[#1B214B]">
                    <span className="text-lg sm:text-xl font-black text-pink-400 font-mono block">4.96 ★</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400">Client Rating</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#060714]/60 border border-[#1B214B]">
                    <span className="text-lg sm:text-xl font-black text-cyan-400 font-mono block">20+</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400">Metropolitan Hubs</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#060714]/60 border border-[#1B214B]">
                    <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono block">100%</span>
                    <span className="text-[10px] sm:text-[11px] text-slate-400">Discrete & Private</span>
                  </div>
                </div>
              </div>

              {/* Logo Emblem Banner */}
              <div className="hidden lg:flex flex-col items-center shrink-0">
                <div className="relative p-1.5 rounded-3xl bg-gradient-to-tr from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] shadow-2xl shadow-pink-500/40">
                  <img
                    src="/logo.jpg"
                    alt="Companio Brand"
                    className="w-44 h-44 rounded-[22px] object-cover ring-2 ring-black"
                  />
                </div>
                <span className="text-xs font-black tracking-widest brand-gradient-text mt-3 font-mono">
                  COMPANIO OFFICIAL
                </span>
                <span className="text-[10px] text-slate-400">Verified Escort Agency</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. POPULAR CITIES QUICK SELECTOR PILLS */}
          {/* ========================================================= */}
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00D2FF]" />
                Select City:
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {selectedCity === 'All Cities' ? 'Pan-India Directory' : selectedCity}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {POPULAR_CITIES.map((city) => {
                const label = city.split(' (')[0];
                const isSelected = selectedCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'brand-button text-white shadow-md shadow-pink-500/30'
                        : 'bg-[#0B0E23] hover:bg-[#121736] text-slate-300 border border-[#1B214B]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. OCCASION CATEGORIES GRID */}
          {/* ========================================================= */}
          <div className="space-y-3 text-left">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF0080]" />
              Select Lawful Occasion:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400 text-white font-bold'
                    : 'bg-[#0B0E23] border-[#1B214B] text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-base block mb-1">✨</span>
                <span className="text-xs font-bold block truncate">All Occasions</span>
                <span className="text-[10px] text-slate-400">Complete list</span>
              </button>

              {LAWFUL_SERVICES.map((svc) => {
                const isSelected = selectedCategory === svc.category;
                const emojiMap: Record<string, string> = {
                  dining: '🍷',
                  social_events: '💍',
                  cultural_exploration: '🎭',
                  intellectual_chats: '💬',
                  travel_companion: '✈️',
                  fitness_outdoors: '🎾',
                };
                return (
                  <button
                    key={svc.category}
                    onClick={() => setSelectedCategory(isSelected ? 'all' : svc.category)}
                    className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500 text-white font-bold'
                        : 'bg-[#0B0E23] border-[#1B214B] text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-base block mb-1">{emojiMap[svc.category] || '🌟'}</span>
                    <span className="text-xs font-bold block truncate">{svc.badge}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{svc.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. SEARCH & FILTER TOOLBAR */}
          {/* ========================================================= */}
          <div id="companion-directory" className="bg-[#0B0E23] p-4 rounded-3xl border border-[#1B214B] space-y-3 text-left shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search Box */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by name, profession, city, or interests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#060714] border border-[#1B214B] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              {/* City Filter */}
              <div className="sm:col-span-4">
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

              {/* Sort By Filter */}
              <div className="sm:col-span-3">
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="w-full bg-[#060714] border border-[#1B214B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                >
                  <option value="recommended">⭐ Recommended</option>
                  <option value="rating">★ Highest Rated</option>
                  <option value="price_low">💸 Tariff: Low to High</option>
                  <option value="price_high">💎 Tariff: High to Low</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1B214B] text-xs">
              <span className="text-[11px] text-slate-400">
                Showing <strong>{filteredCompanions.length}</strong> verified escorts available for booking
              </span>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-700 text-[#FF0080] focus:ring-[#FF0080] bg-[#070B19]"
                />
                <span className="text-[11px] font-semibold flex items-center gap-1 text-[#00D2FF]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Govt. UIDAI Verified Only
                </span>
              </label>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 5. COMPANION CARDS DIRECTORY GRID */}
          {/* ========================================================= */}
          <div>
            {filteredCompanions.length === 0 ? (
              <div className="bg-[#0B0E23] rounded-3xl p-10 text-center border border-[#1B214B] max-w-xl mx-auto space-y-4">
                <Users className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">
                  No Companions Found Matching Selected Filters
                </h3>
                <p className="text-xs text-slate-400">
                  Try clearing your city or keyword search to view our full directory of verified gentlemen.
                </p>
                <button
                  onClick={() => {
                    setSelectedCity('All Cities');
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white brand-button shadow-lg shadow-pink-500/25"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

          {/* ========================================================= */}
          {/* 6. WHY CHOOSE COMPANIO: TRUST, PRIVACY & SAFETY PILLARS */}
          {/* ========================================================= */}
          <div className="pt-6 border-t border-[#1C2541] space-y-6 text-left">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00D2FF]">
                Uncompromising Excellence
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                Why Discerning Clients Choose <span className="brand-gradient-text">Companio</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Experience unparalleled discretion, background-vetted companionship, and frictionless VIP concierge bookings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0B0E23] border border-[#1B214B] space-y-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#00D2FF] mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">100% ID Verified</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every companion undergoes mandatory government Aadhaar / Passport verification and biometric liveness checks.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0B0E23] border border-[#1B214B] space-y-2">
                <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-[#FF0080] mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Complete Discretion</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strict privacy protocol. Encrypted in-app messaging, zero public exposure of personal details, and NDA compliance.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0B0E23] border border-[#1B214B] space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Safe Escrow Protection</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Funds are held safely in escrow and only released after your booking concludes. Instant refunds on cancellations.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0B0E23] border border-[#1B214B] space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">24/7 VIP Concierge</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dedicated relationship managers accessible via Telegram and Phone Call to assist with custom itinerary planning.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 7. HOW IT WORKS: 3 EASY STEPS */}
          {/* ========================================================= */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0B0E23] to-[#121736] border border-[#1B214B] text-left space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1C2541] pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">How Companio Works</h3>
                <p className="text-xs text-slate-400">Three effortless steps to book your verified companion date</p>
              </div>
              <span className="text-[11px] font-mono text-[#00D2FF] bg-[#00D2FF]/10 px-3 py-1 rounded-full border border-[#00D2FF]/20 self-start">
                Frictionless Booking
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00D2FF] to-[#8B5CF6] text-white font-black text-sm flex items-center justify-center shadow-md">
                  1
                </span>
                <h4 className="text-sm font-bold text-white">Browse Curated Directory</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Filter verified escorts by your city, occasion (Dinner, Gala, Travel, Sports), verified reviews, and hourly tariffs.
                </p>
              </div>

              <div className="space-y-2">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#FF0080] text-white font-black text-sm flex items-center justify-center shadow-md">
                  2
                </span>
                <h4 className="text-sm font-bold text-white">Submit Booking Request</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Choose date, time, public venue, and service hours. Pay transparently with escrow protection or connect with our concierge.
                </p>
              </div>

              <div className="space-y-2">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF0080] to-amber-400 text-white font-black text-sm flex items-center justify-center shadow-md">
                  3
                </span>
                <h4 className="text-sm font-bold text-white">Enjoy Polished Company</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Meet at your selected venue and enjoy courteous, articulate, and engaging companionship with complete discretion.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 8. CLIENT TESTIMONIALS */}
          {/* ========================================================= */}
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif">Verified Client Experiences</h3>
                <p className="text-xs text-slate-400">Authentic reviews from social and professional bookings</p>
              </div>
              <span className="text-[11px] text-pink-300 font-semibold hidden sm:inline">
                500+ Dates Concluded Successfully
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#0B0E23] border border-[#1B214B] space-y-2">
                <div className="flex items-center gap-1 text-amber-300 text-xs">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs text-slate-300 italic">
                  "Booked Kabir for an annual corporate charity gala at Taj Lands End. Impeccably dressed in a tuxedo, articulate, and charmed all my international partners. Absolute professional!"
                </p>
                <div className="text-[11px] text-slate-400 font-semibold pt-1 border-t border-[#1C2541]">
                  — Ritu M., Senior Partner (Mumbai)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0E23] border border-[#1B214B] space-y-2">
                <div className="flex items-center gap-1 text-amber-300 text-xs">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs text-slate-300 italic">
                  "Needed an energetic plus-one for a 3-day destination wedding in Jaipur. Sameer was punctual, respectful, and fit right in with family conversations. Couldn't have asked for better."
                </p>
                <div className="text-[11px] text-slate-400 font-semibold pt-1 border-t border-[#1C2541]">
                  — Ananya K., Entrepreneur (Delhi NCR)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0E23] border border-[#1B214B] space-y-2">
                <div className="flex items-center gap-1 text-amber-300 text-xs">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs text-slate-300 italic">
                  "Booked Zayn for a sunset catamaran sail and dinner in North Goa. Incredible sommelier knowledge and delightful company throughout the evening. 10/10 service."
                </p>
                <div className="text-[11px] text-slate-400 font-semibold pt-1 border-t border-[#1C2541]">
                  — Priyadarshini S. (Bengaluru)
                </div>
              </div>
            </div>
          </div>
          {/* ========================================================= */}
          {/* 8.5. FREQUENTLY ASKED QUESTIONS (GOOGLE SEO FAQ) */}
          {/* ========================================================= */}
          <div className="space-y-4 text-left border-t border-[#1C2541] pt-6">
            <div className="max-w-2xl">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00D2FF]">
                Common Inquiries
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-sans">
                Frequently Asked Questions about <span className="brand-gradient-text">Companio</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Everything you need to know about booking verified adult male escorts and social companions in India.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#0B0E23] border border-[#1B214B] space-y-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00D2FF]" />
                  How do I book a verified male companion on Companio?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Browse our curated directory, choose your preferred gentleman and city, select your occasion (dining, galas, weddings, travel), and click <strong>"Book Date"</strong> or connect directly with our 24/7 concierge on Telegram for bespoke arrangements.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0E23] border border-[#1B214B] space-y-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF0080]" />
                  Are all companions background & identity verified?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Yes, 100% of our active escorts undergo strict government Aadhaar or Passport verification and live biometric liveness verification before receiving a verified badge.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0E23] border border-[#1B214B] space-y-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Which cities in India does Companio operate in?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Companio operates across Delhi NCR, Mumbai, Bengaluru, Chandigarh (Tricity), Jaipur, Goa, Pune, Kolkata, and over 20+ other major metropolitan cities.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0E23] border border-[#1B214B] space-y-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Is my booking and personal information confidential?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Companio enforces strict NDA confidentiality protocols. Client information, booking venue details, and messages are end-to-end encrypted and never disclosed publicly.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0E23] border border-[#1B214B] space-y-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  What are the rates and payment methods?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Tariffs start from ₹1,500/hr to ₹5,000/hr depending on the companion’s tier and occasion. Payments are securely held in escrow via UPI (GPay, PhonePe, Paytm, BHIM) and released only upon conclusion of the date.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0B0E23] border border-[#1B214B] space-y-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-300" />
                  Can I apply to become a male companion?
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Yes, well-mannered, articulate gentlemen aged 18+ can apply via our <strong>"Companion Portal"</strong> tab. Submit your government ID, bio, and high-resolution photos for fast administrative approval.
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 9. ANDROID APK DOWNLOAD CALLOUT */}
          {/* ========================================================= */}
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#0B0E23] via-[#121736] to-[#1C1642] border border-[#FF0080]/30 text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#00D2FF] bg-[#00D2FF]/10 px-2.5 py-0.5 rounded-full border border-[#00D2FF]/20">
                Install On Your Phone
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Download the Native Companio Android App
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enjoy fast one-tap bookings, push notifications for companion responses, offline profile previews, and end-to-end discrete mode directly on your Android smartphone.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href="/api/download/apk"
                download="Companio.apk"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl brand-button text-white font-extrabold text-xs shadow-xl shadow-pink-500/30 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Companio.apk</span>
              </a>

              <a
                href="https://github.com/kumarsubhash8009ldh/companionx/releases/download/v1.0.0/Companio.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>GitHub CDN Mirror</span>
              </a>
            </div>
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
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00D2FF]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setReportCompanion(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!reportDesc.trim()) {
                    alert('Please provide details');
                    return;
                  }
                  store.fileSafetyReport({
                    reportedUserId: reportCompanion.userId,
                    reportedUserName: reportCompanion.fullName,
                    reasonCategory: reportReason,
                    description: reportDesc,
                  });
                  alert('Report submitted successfully.');
                  setReportCompanion(null);
                  setReportDesc('');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 10. FLOATING TELEGRAM / WHATSAPP CONCIERGE BUTTON */}
      {/* ========================================================= */}
      <aside aria-label="Customer Support Concierge" className="fixed bottom-6 right-6 z-40">
        <a
          href={`${BRAND_CONFIG.telegramSupportUrl}?text=${encodeURIComponent(
            'Hello Companio Concierge, I need assistance with booking an escort / companion.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full brand-button text-white font-extrabold text-xs shadow-2xl shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all group border border-white/20"
          title="Direct Concierge Support on Telegram"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>
          <Send className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">24/7 Concierge Chat</span>
        </a>
      </aside>
    </div>
  );
};
