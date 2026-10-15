// ==========================================
// COMPANIONX: COMPANION PROFILE, 10+ PHOTOS & SERVICES EDITOR
// ==========================================

import React, { useState } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Clock,
  Save,
  Plus,
  Trash2,
  ShieldCheck,
  Languages,
  Camera,
  Star,
  Upload,
  Link,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { store } from '../../services/store';
import { LawfulServiceCategory, ServiceOffering } from '../../types';
import { BRAND_CONFIG, CITIES_IN_INDIA, LAWFUL_SERVICES } from '../../config/brand';

export const ProfileEditor: React.FC = () => {
  const currentUser = store.getCurrentUser();
  const state = store.getState();
  const comp = currentUser
    ? state.companionProfiles.find((c) => c.userId === currentUser.id)
    : null;

  const [tagline, setTagline] = useState(comp?.tagline || '');
  const [bio, setBio] = useState(comp?.bio || '');
  const [profession, setProfession] = useState(comp?.profession || '');
  const [education, setEducation] = useState(comp?.education || '');
  const [city, setCity] = useState(comp?.city || 'Mumbai');
  const [serviceRadiusKm, setServiceRadiusKm] = useState(comp?.serviceRadiusKm || 35);
  const [services, setServices] = useState<ServiceOffering[]>(
    comp?.servicesOffered || []
  );

  // 10+ Photos Manager state
  const [photos, setPhotos] = useState<string[]>(
    comp?.approvedPhotos && comp.approvedPhotos.length > 0
      ? comp.approvedPhotos
      : ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80']
  );
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handleUpdateServiceRate = (index: number, newRate: number) => {
    const updated = [...services];
    updated[index].hourlyRate = newRate;
    setServices(updated);
  };

  // Add photo via URL
  const handleAddPhotoUrl = () => {
    if (!newPhotoUrl.trim()) return;
    if (photos.length >= 10) {
      setPhotoError('You have reached the maximum limit of 10 profile photos.');
      return;
    }
    setPhotos([...photos, newPhotoUrl.trim()]);
    setNewPhotoUrl('');
    setShowUrlInput(false);
    setPhotoError(null);
  };

  // Add photo via local File upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 10) {
      setPhotoError(`You can upload at most 10 photos. You currently have ${photos.length}.`);
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => {
            if (prev.length >= 10) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });
    setPhotoError(null);
    e.target.value = '';
  };

  // Remove photo
  const handleRemovePhoto = (index: number) => {
    if (photos.length <= 1) {
      setPhotoError('You must maintain at least 1 primary profile photo.');
      return;
    }
    const updated = photos.filter((_, idx) => idx !== index);
    setPhotos(updated);
    setPhotoError(null);
  };

  // Set as primary avatar photo
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const selected = photos[index];
    const remaining = photos.filter((_, idx) => idx !== index);
    setPhotos([selected, ...remaining]);
    setPhotoError(null);
  };

  const handleSave = () => {
    if (!comp) return;
    if (photos.length === 0) {
      alert('Please upload at least one profile photo.');
      return;
    }

    comp.tagline = tagline;
    comp.bio = bio;
    comp.profession = profession;
    comp.education = education;
    comp.city = city;
    comp.serviceRadiusKm = Number(serviceRadiusKm);
    comp.servicesOffered = services;

    // Update photos in store
    store.updateCompanionPhotos(comp.id, photos);

    // Trigger reactive update
    store.setActiveRole('companion');
    alert('Companion profile and 10-photo gallery updated successfully!');
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      {/* Verification Badge Header */}
      <div className="bg-[#0B132B] rounded-2xl p-5 border border-[#1C2541] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={photos[0] || currentUser?.avatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'}
            alt={currentUser?.fullName || 'Companion'}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37]"
          />
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{currentUser?.fullName || 'Companion'}</span>
              {comp?.verificationStatus === 'approved' && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                  Aadhaar Verified
                </span>
              )}
              {comp?.isJoiningFeePaid && (
                <span className="text-[10px] bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded-full border border-[#D4AF37]/30 font-semibold">
                  Joining Fee Paid
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              {city} • {comp?.completedBookings || 0} Completed Bookings • {photos.length}/10 Photos
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#D4AF37] to-[#AA8012] hover:brightness-110 flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* 10-PHOTO GALLERY MANAGER */}
      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1C2541] pb-3">
          <div>
            <h4 className="text-sm font-bold text-white font-serif flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#D4AF37]" />
              <span>Companion Photo Portfolio ({photos.length} / 10 Photos)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Companions with at least 5 to 10 verified high-resolution photos receive up to 4x more booking requests. Photo #1 serves as your primary profile cover.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1C2541] hover:bg-[#243356] text-white flex items-center gap-1.5 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Upload Local Photo</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1C2541] hover:bg-[#243356] text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Link className="w-3.5 h-3.5 text-slate-400" />
              <span>Paste URL</span>
            </button>
          </div>
        </div>

        {/* URL Input Bar */}
        {showUrlInput && (
          <div className="flex items-center gap-2 bg-[#070B19] p-3 rounded-xl border border-[#1C2541]">
            <input
              type="url"
              placeholder="Paste direct image link (e.g. https://images.unsplash.com/...)"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddPhotoUrl}
              className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-[#D4AF37] hover:brightness-110"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        )}

        {photoError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{photoError}</span>
          </div>
        )}

        {/* 10 Photo Slots Grid (2 rows of 5 or responsive) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, slotIdx) => {
            const photoUrl = photos[slotIdx];
            const isPrimary = slotIdx === 0 && !!photoUrl;

            if (photoUrl) {
              return (
                <div
                  key={slotIdx}
                  className={`relative group rounded-xl overflow-hidden aspect-square border-2 bg-slate-950 transition-all ${
                    isPrimary
                      ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                      : 'border-[#1C2541] hover:border-slate-500'
                  }`}
                >
                  <img
                    src={photoUrl}
                    alt={`Photo #${slotIdx + 1}`}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Slot Number Badge */}
                  <span className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white px-1.5 py-0.5 rounded">
                    #{slotIdx + 1}
                  </span>

                  {/* Primary Badge */}
                  {isPrimary && (
                    <span className="absolute bottom-1.5 left-1.5 right-1.5 bg-[#D4AF37]/90 backdrop-blur-md text-slate-950 text-[10px] font-bold text-center py-0.5 rounded shadow">
                      Cover Photo
                    </span>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(slotIdx)}
                        className="w-full py-1 rounded bg-[#D4AF37] text-slate-950 text-[10px] font-bold hover:brightness-110 flex items-center justify-center gap-1"
                        title="Set as Main Profile Avatar"
                      >
                        <Star className="w-3 h-3 fill-slate-950" />
                        <span>Set Cover</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(slotIdx)}
                      className="w-full py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-[10px] font-semibold flex items-center justify-center gap-1"
                      title="Delete this photo"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            }

            // Empty slot
            return (
              <label
                key={slotIdx}
                className="rounded-xl border-2 border-dashed border-[#1C2541] hover:border-[#D4AF37]/50 aspect-square flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-colors group bg-[#070B19]/50"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="w-8 h-8 rounded-full bg-[#1C2541] group-hover:bg-[#D4AF37]/20 flex items-center justify-center mb-1 text-slate-400 group-hover:text-[#D4AF37] transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-200">
                  Photo #{slotIdx + 1}
                </span>
                <span className="text-[9px] text-slate-500">Add Slot</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Basic Professional Profile & Pan-India City */}
      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] p-6 space-y-4">
        <h4 className="text-sm font-bold text-white font-serif">
          Professional Biography, City & Tagline
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Base City (Pan-India) *
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              {CITIES_IN_INDIA.filter((c) => c !== 'All Cities').map((cityName) => (
                <option key={cityName} value={cityName} className="bg-[#070B19]">
                  {cityName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Service Radius (km)
            </label>
            <input
              type="number"
              value={serviceRadiusKm}
              onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
              className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Catchy Professional Tagline
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Detailed Biography & Conversational Style
          </label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Primary Profession
            </label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Education / Degree
            </label>
            <input
              type="text"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full bg-[#070B19] border border-[#1C2541] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Services & Hourly Tariffs */}
      <div className="bg-[#0B132B] rounded-2xl border border-[#1C2541] p-6 space-y-4">
        <div>
          <h4 className="text-sm font-bold text-white font-serif mb-1">
            Lawful Services Offered & Hourly Rates
          </h4>
          <p className="text-xs text-slate-400">
            Define your acceptable lawful companion services and hourly remuneration.
          </p>
        </div>

        <div className="space-y-3">
          {services.map((svc, idx) => (
            <div
              key={idx}
              className="bg-[#070B19] p-4 rounded-xl border border-[#1C2541] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <h5 className="text-xs font-bold text-white">{svc.title}</h5>
                <p className="text-[11px] text-slate-400 line-clamp-1">{svc.description}</p>
                <span className="text-[10px] text-slate-500">Min {svc.minHours} hours</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Rate: ₹</span>
                <input
                  type="number"
                  value={svc.hourlyRate}
                  step={100}
                  onChange={(e) => handleUpdateServiceRate(idx, Number(e.target.value))}
                  className="w-24 bg-[#0B132B] border border-[#1C2541] rounded-lg px-2 py-1 text-xs text-white font-mono text-right focus:outline-none focus:border-[#D4AF37]"
                />
                <span className="text-xs text-slate-400">/hr</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
