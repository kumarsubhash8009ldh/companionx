// ==========================================
// COMPANIONX: BOOKING REQUEST WIZARD
// ==========================================

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Receipt,
  ArrowRight,
  ArrowLeft,
  Building2,
  Sparkles,
} from 'lucide-react';
import { CompanionProfile, ServiceOffering } from '../../types';
import { store } from '../../services/store';
import { BRAND_CONFIG } from '../../config/brand';

interface BookingModalProps {
  companion: CompanionProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  companion,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<ServiceOffering | null>(null);
  const [durationHours, setDurationHours] = useState<number>(2);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('19:00');
  const [venueName, setVenueName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [agreePledge, setAgreePledge] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize defaults when companion loads
  React.useEffect(() => {
    if (companion && companion.servicesOffered.length > 0) {
      setSelectedService(companion.servicesOffered[0]);
      setDurationHours(companion.servicesOffered[0].minHours || 2);
      setCity(companion.city);

      // Default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setBookingDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [companion]);

  if (!isOpen || !companion || !selectedService) return null;

  // Real-time server-side conflict check
  const handleCheckAvailability = () => {
    setErrorMsg(null);
    if (!bookingDate || !startTime) {
      setErrorMsg('Please select both a valid date and start time.');
      return false;
    }

    const conflict = store.checkDoubleBooking(
      companion.id,
      bookingDate,
      startTime,
      durationHours
    );

    if (conflict.hasConflict) {
      setErrorMsg(conflict.message || 'Companion is already booked for this time slot.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!handleCheckAvailability()) return;
      setStep(2);
    } else if (step === 2) {
      if (!venueName.trim() || !address.trim()) {
        setErrorMsg('Please provide a specific public meeting location (e.g. hotel restaurant, cafe, or venue).');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const pricing = store.calculatePricing(selectedService.hourlyRate, durationHours);

  const handleSubmitBooking = () => {
    if (!agreePledge) {
      setErrorMsg('You must agree to the Non-Sexual Companionship Code of Conduct.');
      return;
    }

    const result = store.requestBooking({
      companionId: companion.id,
      serviceCategory: selectedService.category,
      serviceTitle: selectedService.title,
      hourlyRate: selectedService.hourlyRate,
      date: bookingDate,
      startTime,
      durationHours,
      venueName,
      address,
      city,
      landmark,
      clientNotes,
    });

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(result.error || 'Failed to submit booking request.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#0B132B] border border-[#1C2541] rounded-2xl max-w-xl w-full my-auto text-left relative shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1C2541] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider block">
              Step {step} of 4 • Booking Request
            </span>
            <h3 className="text-base font-bold text-white font-serif">
              Book {companion.fullName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1C2541]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-[#1C2541]">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#AA8012] transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Service, Date, Time & Hours */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Select Lawful Service
                </label>
                <div className="space-y-2">
                  {companion.servicesOffered.map((svc, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedService(svc);
                        if (durationHours < svc.minHours) {
                          setDurationHours(svc.minHours);
                        }
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedService.title === svc.title
                          ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                          : 'border-[#1C2541] bg-[#070B19] hover:border-slate-600'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{svc.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1">{svc.description}</div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <span className="text-xs font-bold text-[#D4AF37] font-mono">
                          ₹{svc.hourlyRate.toLocaleString('en-IN')}/hr
                        </span>
                        <span className="text-[10px] text-slate-500 block">Min {svc.minHours}h</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Meeting Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.checked ? '' : e.target.value)}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Duration: <span className="text-[#D4AF37] font-bold">{durationHours} Hours</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Minimum {selectedService.minHours} hours
                  </span>
                </div>
                <input
                  type="range"
                  min={selectedService.minHours || 1}
                  max={8}
                  step={1}
                  value={durationHours}
                  onChange={(e) => setDurationHours(Number(e.target.value))}
                  className="w-full accent-[#D4AF37]"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Meeting Venue & Public Location */}
          {step === 2 && (
            <div className="space-y-3.5 animate-in fade-in">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-2">
                <Building2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Safety First:</strong> For mutual security, initial companion meetings must take place at recognized public venues (restaurants, cafes, lounges, hotel dining rooms, or art galleries). Private residential addresses are prohibited for first bookings.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Venue Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. The Table Restaurant / Olive Bar & Kitchen"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Public Street Address *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ground Floor, Kalapesi Trust Building, Colaba"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Landmark</label>
                  <input
                    type="text"
                    placeholder="Near Gateway of India"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Occasion Notes & Expectations
                </label>
                <textarea
                  rows={2}
                  placeholder="Share details like dress code, table reservation name, or topics you would like to discuss..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Transparent Fee & Commission Breakdown */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-[#070B19] rounded-xl p-4 border border-[#1C2541] space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#1C2541]">
                  <span className="text-xs text-slate-400">Occasion & Service</span>
                  <span className="text-xs font-semibold text-white">{selectedService.title}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Companion Fee (₹{selectedService.hourlyRate} × {durationHours} hrs)
                  </span>
                  <span className="font-mono text-white">₹{pricing.baseAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Platform Facilitation & Escrow Fee ({(pricing.platformCommissionRate * 100).toFixed(0)}%)
                  </span>
                  <span className="font-mono text-slate-300">
                    ₹{pricing.platformCommissionAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">GST on Platform Fee (18%)</span>
                  <span className="font-mono text-slate-300">₹{pricing.gstAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 border-t border-[#1C2541] flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Total Estimated Amount
                  </span>
                  <span className="text-lg font-bold text-[#D4AF37] font-mono">
                    ₹{pricing.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="bg-[#070B19]/50 rounded-xl p-3 border border-[#1C2541] text-[11px] text-slate-400 space-y-1">
                <p>
                  • Payment is only captured after {companion.fullName} formally reviews and accepts your request.
                </p>
                <p>
                  • Full refund if cancelled more than 24 hours prior to meeting time.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Non-Sexual Pledge & Submission */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-[#070B19] rounded-xl p-4 border border-[#D4AF37]/30 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                  <span>Code of Conduct & Lawful Purpose Agreement</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  CompanionX is committed to professional, dignified, and lawful companionship. By submitting this request, you agree:
                </p>
                <ul className="list-disc pl-4 text-xs text-slate-400 space-y-1.5">
                  <li>This booking is purely for non-sexual social, cultural, dining, or conversational companionship.</li>
                  <li>No sexual acts, prostitution, or physical intimacy will be requested, suggested, or engaged in.</li>
                  <li>Both parties retain the right to terminate the meeting immediately if boundaries are breached.</li>
                  <li>Any violation will result in account forfeiture and escalation to law enforcement under Indian Penal law.</li>
                </ul>
              </div>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-[#070B19] border border-amber-500/30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreePledge}
                  onChange={(e) => setAgreePledge(e.target.checked)}
                  className="mt-0.5 rounded border-slate-700 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <span className="text-xs text-slate-200 leading-normal">
                  <strong>I solemnly agree to the Code of Conduct</strong> and declare that this booking is strictly for lawful, non-sexual companionship.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#1C2541] flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-[#1C2541] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={handleNextStep}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/20 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              disabled={!agreePledge}
              onClick={handleSubmitBooking}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                agreePledge
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA8012] text-slate-950 hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Submit Booking Request</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
