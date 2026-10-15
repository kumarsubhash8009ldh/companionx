// ==========================================
// COMPANIONX: AUTHENTICATION & ONBOARDING MODAL
// ==========================================

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  AlertCircle,
  GraduationCap,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  ArrowLeft,
  MailCheck,
} from 'lucide-react';
import { store } from '../../services/store';
import { CITIES_IN_INDIA } from '../../config/brand';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'client_signup' | 'companion_signup' | 'login';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'client_signup',
}) => {
  const [tab, setTab] = useState<'client_signup' | 'companion_signup' | 'login' | 'forgot_password'>(
    initialTab
  );

  // Client form
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [clientAge, setClientAge] = useState<number>(24);
  const [clientCity, setClientCity] = useState('Mumbai');

  // Companion form
  const [compName, setCompName] = useState('');
  const [compEmail, setCompEmail] = useState('');
  const [compPhone, setCompPhone] = useState('');
  const [compPassword, setCompPassword] = useState('');
  const [compAge, setCompAge] = useState<number>(26);
  const [compCity, setCompCity] = useState('Mumbai');
  const [compProfession, setCompProfession] = useState('');
  const [compEducation, setCompEducation] = useState('');
  const [compBio, setCompBio] = useState('');
  const [compRate, setCompRate] = useState<number>(1500);
  const [compAvatar, setCompAvatar] = useState(
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'
  );

  // Login form
  const [loginQuery, setLoginQuery] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password / Email OTP Recovery
  const [resetStep, setResetStep] = useState<'request' | 'verify' | 'success'>('request');
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleRegisterClient = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!clientName.trim() || !clientEmail.trim() || !clientPhone.trim()) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    const res = store.registerClient({
      fullName: clientName.trim(),
      email: clientEmail.trim(),
      phone: clientPhone.trim(),
      age: Number(clientAge),
      preferredCity: clientCity,
      password: clientPassword.trim() || 'Client@123',
    });

    if (res.success) {
      alert(`Welcome ${clientName}! Your client account has been created.`);
      onClose();
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  const handleRegisterCompanion = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!compName.trim() || !compEmail.trim() || !compPhone.trim() || !compProfession.trim()) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    const res = store.registerCompanion({
      fullName: compName.trim(),
      email: compEmail.trim(),
      phone: compPhone.trim(),
      age: Number(compAge),
      city: compCity,
      profession: compProfession.trim(),
      education: compEducation.trim() || 'Graduate',
      bio:
        compBio.trim() ||
        `Articulate and respectful gentleman based in ${compCity}. Available for gourmet dining, weddings, and engaging conversations.`,
      hourlyRate: Number(compRate),
      avatar: compAvatar,
      password: compPassword.trim() || 'Companion@123',
    });

    if (res.success) {
      alert(`Welcome ${compName}! Your companion profile is created. Please submit your ID verification next.`);
      onClose();
    } else {
      setErrorMsg(res.error || 'Companion registration failed.');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const query = loginQuery.trim();
    if (!query) {
      setErrorMsg('Please enter your email or registered phone number.');
      return;
    }

    const cleanDigits = query.replace(/\D/g, '');
    const isAdmin = cleanDigits.endsWith('7009600157');

    if (isAdmin && !loginPassword) {
      setErrorMsg('Password is required for this account.');
      return;
    }

    const res = store.loginUser(query, loginPassword);
    if (res.success) {
      alert(`Welcome back, ${res.user?.fullName || 'User'}!`);
      onClose();
    } else {
      setErrorMsg(res.error || 'Invalid login credentials. Please verify your details.');
    }
  };

  const handleGoToForgotPassword = () => {
    setTab('forgot_password');
    setResetStep('request');
    setResetOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setSimulatedOtp(null);
    setErrorMsg(null);
    if (loginQuery.includes('@')) {
      setResetEmail(loginQuery.trim());
    }
  };

  const handleRequestResetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const email = resetEmail.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid registered email address.');
      return;
    }

    setIsSendingOtp(true);
    setTimeout(() => {
      const res = store.requestPasswordResetOtp(email);
      setIsSendingOtp(false);
      if (res.success && res.otp) {
        setSimulatedOtp(res.otp);
        setMaskedEmail(res.maskedEmail || email);
        setResetStep('verify');
        setResendCooldown(60);
      } else {
        setErrorMsg(res.error || 'Unable to dispatch OTP. Please check the email address.');
      }
    }, 500);
  };

  const handleVerifyOtpAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const otp = resetOtp.trim();
    if (!otp || otp.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setIsResetting(true);
    setTimeout(() => {
      const res = store.verifyOtpAndResetPassword(resetEmail.trim(), otp, newPassword);
      setIsResetting(false);
      if (res.success) {
        setResetStep('success');
      } else {
        setErrorMsg(res.error || 'Password reset failed. Invalid or expired OTP.');
      }
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#0B0E23] border border-purple-500/30 rounded-3xl max-w-lg w-full my-auto text-left relative shadow-2xl shadow-purple-950/50 overflow-hidden flex flex-col">
        {/* Top Accent Gradient */}
        <div className="h-1 w-full bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080]" />

        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1B214B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Companio"
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/40 shadow-md shadow-purple-500/20"
            />
            <div>
              <h3 className="text-base font-black brand-gradient-text">
                Companio Portal Access
              </h3>
              <p className="text-[11px] text-slate-400">
                Verified adult companion & client registration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#121736] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        {tab === 'forgot_password' ? (
          <div className="bg-[#060714] border-b border-[#1B214B] px-4 py-2.5 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMsg(null);
              }}
              className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Log In</span>
            </button>
            <span className="font-bold text-white flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#00D2FF]" />
              <span>Password Recovery (Email OTP)</span>
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-3 bg-[#060714] border-b border-[#1B214B] p-1.5 text-xs gap-1">
            <button
              onClick={() => {
                setTab('client_signup');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl font-bold transition-all ${
                tab === 'client_signup'
                  ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Client Sign Up
            </button>
            <button
              onClick={() => {
                setTab('companion_signup');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl font-bold transition-all ${
                tab === 'companion_signup'
                  ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Join as Companion
            </button>
            <button
              onClick={() => {
                setTab('login');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-xl font-bold transition-all ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-[#00D2FF] via-[#8B5CF6] to-[#FF0080] text-white shadow-md shadow-pink-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Log In
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: CLIENT SIGN UP */}
          {tab === 'client_signup' && (
            <form onSubmit={handleRegisterClient} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Kapoor"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 12345"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="radhika@example.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Age (18+ Required) *
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={80}
                    required
                    value={clientAge}
                    onChange={(e) => setClientAge(Number(e.target.value))}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    City *
                  </label>
                  <select
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {CITIES_IN_INDIA.filter((c) => c !== 'All Cities').map((city) => (
                      <option key={city} value={city} className="bg-[#070B19]">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Set Account Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Create a secure password (min 6 chars)"
                  value={clientPassword}
                  onChange={(e) => setClientPassword(e.target.value)}
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold text-white brand-button flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Create Client Account</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: COMPANION REGISTRATION */}
          {tab === 'companion_signup' && (
            <form onSubmit={handleRegisterCompanion} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Full Legal Name (as on Aadhaar) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddharth Verma"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98100 88776"
                    value={compPhone}
                    onChange={(e) => setCompPhone(e.target.value)}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="siddharth@example.com"
                    value={compEmail}
                    onChange={(e) => setCompEmail(e.target.value)}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Age (18+) *
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={65}
                    required
                    value={compAge}
                    onChange={(e) => setCompAge(Number(e.target.value))}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Base City *
                  </label>
                  <select
                    value={compCity}
                    onChange={(e) => setCompCity(e.target.value)}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-2 py-2 text-xs text-white"
                  >
                    {CITIES_IN_INDIA.filter((c) => c !== 'All Cities').map((city) => (
                      <option key={city} value={city} className="bg-[#070B19]">
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Tariff (₹/hr) *
                  </label>
                  <input
                    type="number"
                    step={100}
                    required
                    value={compRate}
                    onChange={(e) => setCompRate(Number(e.target.value))}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-2 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Profession *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brand Strategist / Architect"
                    value={compProfession}
                    onChange={(e) => setCompProfession(e.target.value)}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Education / Degree
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MBA, B.Tech"
                    value={compEducation}
                    onChange={(e) => setCompEducation(e.target.value)}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Professional Biography & Conversational Style
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your interests, background, and conversational etiquette..."
                  value={compBio}
                  onChange={(e) => setCompBio(e.target.value)}
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Set Account Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Create a secure password (min 6 chars)"
                  value={compPassword}
                  onChange={(e) => setCompPassword(e.target.value)}
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Joining fee disclosure */}
              <div className="bg-[#060714] p-3 rounded-xl border border-purple-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
                  <span className="text-slate-300">Onboarding & Background Fee</span>
                </div>
                <span className="font-mono font-bold text-[#FF0080]">
                  ₹{store.getState().companionJoiningFee || 999} (One-Time)
                </span>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold text-white brand-button flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Register as Companion</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: LOG IN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Registered Email Address or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter email or mobile number..."
                    value={loginQuery}
                    onChange={(e) => setLoginQuery(e.target.value)}
                    className="w-full bg-[#060714] border border-[#1B214B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter account password..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#060714] border border-[#1B214B] rounded-xl pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-slate-400">Can't remember password?</span>
                <button
                  type="button"
                  onClick={handleGoToForgotPassword}
                  className="text-[#00D2FF] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Forgot Password? (Email OTP)</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold text-white brand-button flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-pink-500/25"
              >
                <span>Sign In to Companio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* TAB 4: FORGOT PASSWORD / EMAIL OTP RECOVERY */}
          {tab === 'forgot_password' && (
            <div className="space-y-4">
              {resetStep === 'request' && (
                <form onSubmit={handleRequestResetOtp} className="space-y-4">
                  <div className="text-center pb-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00D2FF]/20 via-[#8B5CF6]/20 to-[#FF0080]/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-2.5 shadow-lg shadow-purple-500/20">
                      <KeyRound className="w-6 h-6 text-[#00D2FF]" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Reset Account Password</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Enter the registered email of your Client or Companion account. We will send a secure 6-digit OTP code to verify and reset your password.
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Registered Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="e.g. radhika@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full bg-[#060714] border border-[#1B214B] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="bg-[#070B19] border border-blue-500/20 rounded-xl p-3 text-[11px] text-slate-400 space-y-1">
                    <p className="font-semibold text-blue-300">Quick Test Email Accounts:</p>
                    <p>• Client: <code className="text-slate-300">radhika@example.com</code></p>
                    <p>• Companions: <code className="text-slate-300">priya.sharma@example.com</code>, <code className="text-slate-300">kavya.nair@example.com</code></p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white brand-button flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-pink-500/25 disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      <span>Sending 6-Digit OTP...</span>
                    ) : (
                      <>
                        <MailCheck className="w-3.5 h-3.5" />
                        <span>Send 6-Digit OTP to Email</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      Remembered your password? <span className="text-[#00D2FF] font-semibold">Log In</span>
                    </button>
                  </div>
                </form>
              )}

              {resetStep === 'verify' && (
                <form onSubmit={handleVerifyOtpAndReset} className="space-y-4">
                  <div className="text-center pb-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/20">
                      <MailCheck className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white">Enter OTP & Set New Password</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      OTP sent to <span className="font-mono text-emerald-400 font-semibold">{maskedEmail || resetEmail}</span>
                    </p>
                  </div>

                  {/* Simulated Email Inbox Alert */}
                  {simulatedOtp && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                      <div className="flex items-start gap-2.5">
                        <MailCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div className="space-y-1 w-full">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-300">
                              Simulated Email Inbox Notification
                            </span>
                            <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-medium">
                              Valid for 10 mins
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px]">
                            Companio Password Reset Verification Code:
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="font-mono text-lg font-black tracking-widest text-emerald-300 bg-[#070B19] px-3 py-1 rounded-lg border border-emerald-500/40 shadow-inner">
                              {simulatedOtp}
                            </span>
                            <button
                              type="button"
                              onClick={() => setResetOtp(simulatedOtp)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold transition-all border border-emerald-500/40 cursor-pointer"
                            >
                              Auto-fill OTP
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OTP Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        6-Digit Email OTP *
                      </label>
                      <button
                        type="button"
                        disabled={resendCooldown > 0}
                        onClick={handleRequestResetOtp}
                        className="text-[11px] text-[#00D2FF] hover:underline font-semibold disabled:text-slate-500 disabled:no-underline cursor-pointer"
                      >
                        {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="• • • • • •"
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#060714] border border-[#1B214B] rounded-xl px-3 py-2.5 text-center font-mono text-base tracking-[0.3em] font-black text-white focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      New Password (min 6 characters) *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter new strong password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-[#060714] border border-[#1B214B] rounded-xl pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#060714] border border-[#1B214B] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isResetting}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white brand-button flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-pink-500/25 disabled:opacity-50"
                  >
                    {isResetting ? (
                      <span>Updating Password...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify OTP & Update Password</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setResetStep('request')}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      ← Change Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('login')}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Back to Log In
                    </button>
                  </div>
                </form>
              )}

              {resetStep === 'success' && (
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">Password Reset Successfully!</h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                      Your account password has been updated. You can now log in using your registered email/phone and your new password.
                    </p>
                  </div>

                  <div className="bg-[#070B19] border border-emerald-500/30 rounded-2xl p-3 text-xs text-emerald-300 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Your account is verified & protected.</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      setLoginPassword('');
                      setErrorMsg(null);
                    }}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white brand-button flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-pink-500/25"
                  >
                    <span>Sign In With New Password</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
