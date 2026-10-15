# CompanionX - Premium Male Companion Booking Platform

> **Curated Adult Male Companionship for Social, Cultural, and Professional Occasions in India**

CompanionX is a production-ready, mobile-first booking platform designed for verified adult male companions to connect with discerning clients for **strictly lawful, non-sexual companionship**, including gourmet dining, weddings & galas, art & heritage tours, travel accompaniment, and intellectual conversations.

The platform enforces strict zero-tolerance policies against prostitution, sexual solicitation, exploitation, and trafficking under the **Bharatiya Nyaya Sanhita (BNS)** and the **Immoral Traffic (Prevention) Act (ITPA)**.

---

## 🏛️ Three Integrated Interfaces

### 1. Client Application
- **18+ Age & Lawful Purpose Gate:** Mandatory age declaration and non-sexual pledge.
- **Curated Companion Directory:** High-resolution companion cards, city filter (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Pune, Kolkata, Jaipur, Goa, etc.), and lawful occasion categories.
- **Detailed Profiles:** Bio, profession, education, height, languages, service radius, verified UIDAI badge, approved photo showcase, and verified client reviews.
- **Interactive Booking Wizard:** Step-by-step request flow with **real-time double-booking conflict prevention**, transparent fee breakdown, and code of conduct pledge.
- **Booking Management:** Track active, upcoming, completed, and cancelled bookings with automated cancellation policy calculations.
- **In-App Messaging:** Secure chat unlocked only after companion acceptance, backed by automated anti-solicitation keyword scanning.
- **Virtual Video Call Room:** Simulated WebRTC audio/video call room with camera/mic controls and Agora/Twilio integration spec.
- **Membership & Subscriptions:** Client Elite Circle (₹199/month) for 0% convenience fees and priority companion access.
- **Safety Hub & SOS:** One-tap access to Indian national emergency helplines (112, 1091, 1930) and 24/7 platform safety dispatch.

### 2. Male Companion Portal
- **Government ID Verification (KYC):** Upload masked Aadhaar / Passport / Driving Licence with selfie match. Identity documents are stored in an encrypted vault and never exposed publicly.
- **Booking Requests Dashboard:** View incoming inquiries with client notes, venue details, and net companion payout; accept or decline with reasons.
- **Availability & Calendar Slots:** Configure daily working hours, block blackout dates, or toggle **"Pause Profile"** to temporarily pause inquiries.
- **Profile & Tariff Customizer:** Edit professional bio, languages, service radius (km), and customize hourly rates per lawful service category.
- **Earnings & Payouts Hub:** Real-time earnings dashboard with platform commission breakdown (15%), GST (18%) deduction, available balance, and IMPS/UPI withdrawal requests.
- **Companion Memberships & Boosts:** Companion Basic (₹499/mo), Companion Pro Tier (₹999/mo with reduced commission), and ₹99 Profile Spotlight Boost campaign.

### 3. Protected Admin Dashboard
- **Executive Metrics & KPIs:** Gross Platform Volume (₹), Platform Net Commission, Active Memberships MRR, Registrations, and Refund totals.
- **KYC Verification Queue:** Inspect submitted government IDs, review liveness match, and approve or reject companions with audit notes.
- **Booking Operations & Dispute Resolution:** Complete oversight of all bookings with administrative manual refund override capabilities.
- **Dynamic Pricing & Commission Sliders:** Adjust platform commission between 10% and 20% on the fly without changing code.
- **Promotional Coupon Manager:** Create and manage promo discount codes (`WELCOME10`, `ELITE50`).
- **Safety Incident Moderation:** Audit reports of inappropriate solicitation, harassment, or no-shows, with instant permanent user suspension tools.
- **Immutable Audit Trail:** Chronological security log recording every administrative action with timestamps and IP addresses, exportable to JSON.

---

## 🎨 Design System

- **Primary Colors:** Deep Navy (`#070B19`, `#0B132B`, `#1C2541`)
- **Accents:** Muted Gold (`#D4AF37`, `#AA8012`, `#FBF6E2`)
- **Typography:** High-contrast crisp sans-serif with classic serif accents for editorial elegance.
- **Layout:** Mobile-first responsive grids, fluid bottom drawers, skeleton feedback, and accessible controls.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 + Custom Gold & Navy Design Tokens
- **Icons:** Lucide React
- **State & Backend Simulation:** Local-first reactive store with localStorage persistence, transactional conflict detection, and event logging.
- **Backend Rules & Serverless:** Production Firebase Security Rules (`backend/firestore.rules`) and Cloud Functions (`backend/cloudFunctions.ts`).

---

## 🚀 Quickstart

```bash
# 1. Clone & Enter Project Directory
cd companionx

# 2. Install Dependencies
npm install

# 3. Start Development Server
npm run dev

# 4. Run Production Build & Typecheck
npm run build
```

---

## 🔒 Security & Privacy Guarantees

1. **Zero Raw Card Storage:** Strict compliance with Reserve Bank of India (RBI) tokenization guidelines.
2. **Identity Privacy:** Companions' government IDs and private home addresses are completely masked and shielded from public view.
3. **Double-Booking Shield:** Server-side atomic checks prevent overlapping reservations for the same companion.
4. **Anti-Solicitation Filter:** Real-time regex and NLP filters intercept and block inappropriate sexual solicitation keywords in messages.
5. **Emergency Hotlines:** Direct dial integration for 112 (National Emergency), 1091 (Women Helpline), and 1930 (Cyber Crime).

---

## 📋 Legal Prerequisites Before Commercial Launch in India

1. **Corporate Entity:** Register private limited company under the Companies Act, 2013 (e.g. *CompanionX Technologies India Private Limited*).
2. **Payment Aggregator Approval:** Underwrite with Razorpay or Cashfree under MCC 7299 (Personal Services) with explicit non-sexual service platform declarations.
3. **GST Registration:** Obtain GSTIN for collecting and depositing 18% GST on platform facilitation fees.
4. **KYC Vendor Partnership:** Contract with an authorised Aadhaar offline XML verification / DigiLocker API provider (e.g., Karza, IDfy, or Signzy).
5. **Resident Grievance Officer:** Publish the statutory contact address and name of the Grievance Officer in accordance with the IT Rules, 2021.
