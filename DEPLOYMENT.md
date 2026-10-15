# CompanionX - Setup & Deployment Guide

This guide details the procedure for deploying **CompanionX** to production environments with strict compliance with Indian laws, secure cloud infrastructure, and real-time event streaming.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (v24 LTS recommended)
- **Package Manager**: npm or yarn
- **Cloud Provider**: Google Cloud Platform / Firebase (Mumbai region `asia-south1` recommended for low latency in India)
- **Payment Gateway Account**: Razorpay (India) or Cashfree Payments
- **Video SDK Provider**: Agora.io or 100ms.live

---

## 2. Local Development Setup

1. **Clone & Navigate to the Project:**
   ```bash
   cd companionx
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your sandbox/test keys.

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Access the web app at `http://localhost:5173`.

5. **Run Typecheck & Build:**
   ```bash
   npm run build
   ```

---

## 3. Production Node.js Server Deployment (Render / Railway / VPS / Docker)

The easiest and most unified way to launch **CompanionX** in production with full real-time database synchronization on a single domain/port:

### Single Command Launch
```bash
# 1. Install dependencies
npm install

# 2. Build the production bundle
npm run build

# 3. Start the production server (serves frontend + sync API)
npm start
```
* **Port**: Defaults to `5000` or reads `process.env.PORT` automatically provided by cloud hosts.
* **Persistent Database**: Automatically managed at `server/data/db.json` with atomic file-write protection.
* **Real-Time Data Sync**: Server-Sent Events (SSE) `/api/events` pushes state changes to all connected clients instantly.

### One-Click Cloud Platform Settings:
* **Render / Railway / Heroku / DigitalOcean App Platform**:
  - **Build Command**: `npm install && npm run build`
  - **Start Command**: `npm start`
  - **Port**: Automatic / `PORT` env variable.
  - **Health Check Path**: `/api/health`

---

## 4. Firebase Backend Deployment (Serverless Alternative)

### Step A: Initialize Firebase Project
Install the Firebase CLI and log in:
```bash
npm install -g firebase-tools
firebase login
firebase init
```
Select:
- **Firestore**: (Rules & Indexes)
- **Functions**: (Node.js TypeScript runtime)
- **Hosting**: (Configure as a single-page app with `dist` as public directory)
- **Storage**: (Rules for KYC vault)

### Step B: Deploy Firestore Security Rules
Deploy the security rules located in `backend/firestore.rules`:
```bash
firebase deploy --only firestore:rules
```
These rules enforce:
- Role-Based Access Control (RBAC) across Clients, Companions, and Admins.
- Zero public exposure of Aadhaar, Passport, or private phone numbers.
- Private document access strictly restricted to certified compliance auditors.

### Step C: Deploy Cloud Functions
Deploy the serverless backend functions:
```bash
cd backend
npm install
firebase deploy --only functions
```
Functions deployed:
- `handlePaymentWebhook`: Validates HMAC-SHA256 signatures and credits bookings atomically.
- `createBookingWithConflictCheck`: Prevents double bookings in a Firestore transaction.
- `generateAgoraRtcToken`: Issues ephemeral RTC credentials for video calling.

### Step D: Build & Deploy Frontend to Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

---

## 4. Alternate Deployment: Vercel / Netlify / AWS CloudFront

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Single Page App Rewrite**:
  - `/*` -> `/index.html` (Status: 200)

---

## 5. Production Health & Monitoring

1. **Cloud Logging & Audit Trails:**
   Ensure `adminAuditLogs` collection has retention set to minimum 7 years under Indian IT Act regulations.
2. **Error Tracking:**
   Integrate Sentry (`@sentry/react`) for production crash diagnostics.
3. **Web Application Firewall (WAF):**
   Enable Cloudflare or Google Cloud Armor with rate-limiting on booking creation endpoints to block credential stuffing.
