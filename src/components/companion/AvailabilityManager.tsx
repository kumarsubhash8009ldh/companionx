// ==========================================
// COMPANIONX: AVAILABILITY & CALENDAR MANAGER
// ==========================================

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { store } from '../../services/store';

export const AvailabilityManager: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const state = store.getState();
  const comp = currentUser
    ? state.companionProfiles.find((c) => c.userId === currentUser.id)
    : null;

  const [startTime, setStartTime] = useState(comp?.workingHours?.start || '11:00');
  const [endTime, setEndTime] = useState(comp?.workingHours?.end || '23:30');
  const [isPaused, setIsPaused] = useState(comp?.isPaused || false);
  const [unavailableDate, setUnavailableDate] = useState('');
  const [unavailableDatesList, setUnavailableDatesList] = useState<string[]>(
    comp?.unavailableDates || ['2026-10-25', '2026-10-31']
  );

  const handleTogglePause = () => {
    if (!comp) return;
    const newPaused = store.togglePauseProfile(comp.id);
    setIsPaused(newPaused);
    alert(
      newPaused
        ? 'Your profile is now paused. Clients cannot send new booking requests.'
        : 'Your profile is active and discoverable!'
    );
  };

  const handleAddUnavailableDate = () => {
    if (!unavailableDate) return;
    if (unavailableDatesList.includes(unavailableDate)) return;
    setUnavailableDatesList([...unavailableDatesList, unavailableDate]);
    setUnavailableDate('');
  };

  const handleRemoveDate = (date: string) => {
    setUnavailableDatesList(unavailableDatesList.filter((d) => d !== date));
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      {/* 1. Pause Profile Toggle Card */}
      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-white font-serif">
              Profile Availability Status
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                !isPaused
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}
            >
              {!isPaused ? 'Active & Accepting Bookings' : 'Paused (Invisible to Search)'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Pause your listing anytime you need personal time off or travel outside your service radius.
          </p>
        </div>

        <button
          onClick={handleTogglePause}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
            !isPaused
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
          }`}
        >
          {!isPaused ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
          <span>{!isPaused ? 'Pause Profile' : 'Resume Listing'}</span>
        </button>
      </div>

      {/* 2. Standard Working Hours */}
      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <span>Daily Companion Working Hours</span>
          </h3>
          <p className="text-xs text-slate-400">
            Clients can only select booking slots within your defined operating hours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Earliest Meeting Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Latest Meeting Conclusion
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => alert('Operating hours preferences saved!')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012]"
          >
            Save Working Hours
          </button>
        </div>
      </div>

      {/* 3. Blackout / Unavailable Dates */}
      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
            <span>Blackout Specific Dates</span>
          </h3>
          <p className="text-xs text-slate-400">
            Block out specific dates when you are unavailable for social engagements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            value={unavailableDate}
            onChange={(e) => setUnavailableDate(e.target.value)}
            className="bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            onClick={handleAddUnavailableDate}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-[#1C2541] hover:bg-[#243356]"
          >
            Block Date
          </button>
        </div>

        {unavailableDatesList.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {unavailableDatesList.map((d) => (
              <span
                key={d}
                className="px-3 py-1 rounded-full text-xs bg-[#070B19] border border-[#1C2541] text-slate-300 flex items-center gap-2"
              >
                <span>{d}</span>
                <button
                  onClick={() => handleRemoveDate(d)}
                  className="text-slate-500 hover:text-rose-400 font-bold"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
