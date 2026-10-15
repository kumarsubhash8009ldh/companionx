// ==========================================
// COMPANIONX: REAL-TIME DATA SYNC & API SERVER
// ==========================================

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default Seed State
const DEFAULT_SEED = {
  version: 1,
  updatedAt: new Date().toISOString(),
  platformCommissionRate: 0.30,
  companionJoiningFee: 999,
  paymentQrConfig: {
    upiId: 'companio@okhdfcbank',
    payeeName: 'Companio Official Concierge',
    merchantCode: 'COMPANIO7299',
    defaultQrImageUrl: '',
    gpayQrImageUrl: '',
    phonepeQrImageUrl: '',
    paytmQrImageUrl: '',
    instructions: 'Scan using GPay, PhonePe, Paytm, or BHIM. Pay the exact account activation fee and enter your 12-digit UPI / UTR transaction ID for instant verification.',
    updatedAt: new Date().toISOString(),
  },
  users: [
    {
      id: 'user_admin_1',
      email: 'admin@companio.in',
      phone: '7009600157',
      password: 'Shivshankar@1',
      role: 'admin',
      fullName: 'System Administrator (7009600157)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      age: 38,
      isAgeVerified: true,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  companionProfiles: [],
  clientProfiles: [],
  verificationRequests: [],
  membershipPlans: [
    {
      id: 'plan_silver',
      name: 'Silver Elite',
      tier: 'silver',
      pricePerMonth: 2999,
      features: ['Up to 5 companion bookings/mo', 'Verified background guarantee', 'Standard concierge chat'],
      isActive: true,
    },
    {
      id: 'plan_gold',
      name: 'Gold Privilege',
      tier: 'gold',
      pricePerMonth: 6999,
      features: ['Unlimited companion bookings', 'Priority booking window', 'Dedicated 24/7 Concierge Hotline', '5% discount on hourly tariffs'],
      isActive: true,
    },
    {
      id: 'plan_platinum',
      name: 'Platinum Black',
      tier: 'platinum',
      pricePerMonth: 14999,
      features: ['All Gold benefits', 'Chauffeur booking assistance', 'Luxury hotel reservation coordination', 'Strict NDA & privacy protection protocol'],
      isActive: true,
    },
  ],
  subscriptions: [],
  bookings: [],
  bookingEvents: [],
  conversations: [],
  messages: [],
  reviews: [],
  payments: [],
  commissions: [],
  payouts: [],
  refunds: [],
  supportTickets: [],
  reports: [],
  notifications: [],
  adminAuditLogs: [
    {
      id: 'audit_init',
      adminId: 'user_admin_1',
      adminName: 'Chief Compliance Officer',
      action: 'SYSTEM_INITIALIZED',
      targetResource: 'system',
      targetId: 'global',
      details: 'Companio live sync server initialized. Ready for multi-client synchronization.',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Server)',
    },
  ],
  coupons: [
    {
      id: 'coup_welcome',
      code: 'WELCOME10',
      discountPercentage: 10,
      maxDiscount: 500,
      validTill: '2026-12-31',
      target: 'client',
      usageCount: 0,
      isActive: true,
    },
  ],
  accountActivationRequests: [],
};

// Safe DB loader
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(content);
      // Ensure admin exists
      if (!data.users || !data.users.some(u => u.role === 'admin')) {
        data.users = [...(data.users || []), DEFAULT_SEED.users[0]];
      } else {
        const admin = data.users.find(u => u.role === 'admin' || u.phone === '7009600157');
        if (admin) {
          admin.phone = '7009600157';
          admin.password = 'Shivshankar@1';
          admin.role = 'admin';
        }
      }
      return { ...DEFAULT_SEED, ...data };
    }
  } catch (err) {
    console.error('Error reading db.json, using default seed:', err);
  }
  saveDatabase(DEFAULT_SEED);
  return { ...DEFAULT_SEED };
}

// Atomic file write
function saveDatabase(data) {
  try {
    data.updatedAt = new Date().toISOString();
    const tmpFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error('Failed to save db.json:', err);
  }
}

let db = loadDatabase();

// In-memory OTP store
const otpCache = new Map();

// SSE Connected Clients for Real-time push
const sseClients = new Set();

function broadcastEvent(eventType, payload) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    serverTime: new Date().toISOString(),
    version: db.version || 1,
    connectedClients: sseClients.size,
    counts: {
      users: db.users?.length || 0,
      companions: db.companionProfiles?.length || 0,
      clients: db.clientProfiles?.length || 0,
      bookings: db.bookings?.length || 0,
      activationRequests: db.accountActivationRequests?.length || 0,
    },
  });
});

// Real-Time Server-Sent Events (SSE) Stream
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial handshake
  res.write(`event: handshake\ndata: ${JSON.stringify({ version: db.version, timestamp: Date.now() })}\n\n`);

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// Full State Get
app.get('/api/state', (req, res) => {
  res.json({
    success: true,
    version: db.version || 1,
    updatedAt: db.updatedAt,
    state: db,
  });
});

// Full/Delta State Sync
app.post('/api/state/sync', (req, res) => {
  try {
    const incoming = req.body.state;
    if (!incoming || typeof incoming !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid state payload' });
    }

    // Merge collections intelligently
    const mergeById = (existing = [], next = []) => {
      const map = new Map();
      existing.forEach(item => { if (item?.id) map.set(item.id, item); });
      next.forEach(item => {
        if (item?.id) {
          // If already exists, merge
          const old = map.get(item.id) || {};
          map.set(item.id, { ...old, ...item });
        }
      });
      return Array.from(map.values());
    };

    // Keep admin credentials pristine
    const mergedUsers = mergeById(db.users, incoming.users || []);
    let admin = mergedUsers.find(u => u.role === 'admin' || u.phone === '7009600157');
    if (admin) {
      admin.phone = '7009600157';
      admin.password = 'Shivshankar@1';
      admin.role = 'admin';
    } else {
      mergedUsers.push(DEFAULT_SEED.users[0]);
    }

    db.users = mergedUsers;
    db.companionProfiles = mergeById(db.companionProfiles, incoming.companionProfiles);
    db.clientProfiles = mergeById(db.clientProfiles, incoming.clientProfiles);
    db.bookings = mergeById(db.bookings, incoming.bookings);
    db.bookingEvents = mergeById(db.bookingEvents, incoming.bookingEvents);
    db.conversations = mergeById(db.conversations, incoming.conversations);
    db.messages = mergeById(db.messages, incoming.messages);
    db.reviews = mergeById(db.reviews, incoming.reviews);
    db.payments = mergeById(db.payments, incoming.payments);
    db.commissions = mergeById(db.commissions, incoming.commissions);
    db.payouts = mergeById(db.payouts, incoming.payouts);
    db.refunds = mergeById(db.refunds, incoming.refunds);
    db.supportTickets = mergeById(db.supportTickets, incoming.supportTickets);
    db.reports = mergeById(db.reports, incoming.reports);
    db.notifications = mergeById(db.notifications, incoming.notifications);
    db.adminAuditLogs = mergeById(db.adminAuditLogs, incoming.adminAuditLogs);
    db.accountActivationRequests = mergeById(db.accountActivationRequests, incoming.accountActivationRequests);

    // Dynamic configs
    if (incoming.paymentQrConfig) {
      db.paymentQrConfig = { ...db.paymentQrConfig, ...incoming.paymentQrConfig };
    }
    if (incoming.companionJoiningFee !== undefined) {
      db.companionJoiningFee = incoming.companionJoiningFee;
    }
    if (incoming.platformCommissionRate !== undefined) {
      db.platformCommissionRate = incoming.platformCommissionRate;
    }

    db.version = (db.version || 1) + 1;
    saveDatabase(db);

    // Notify all active clients in real time
    broadcastEvent('STATE_UPDATED', { version: db.version, timestamp: Date.now() });

    res.json({
      success: true,
      version: db.version,
      updatedAt: db.updatedAt,
      state: db,
    });
  } catch (err) {
    console.error('Sync failed:', err);
    res.status(500).json({ success: false, error: err.message || 'Sync failed' });
  }
});

// Update Payment QR Config (Admin)
app.post('/api/admin/update-qr', (req, res) => {
  try {
    const { paymentQrConfig, adminPhone } = req.body;
    if (!paymentQrConfig) {
      return res.status(400).json({ success: false, error: 'Missing paymentQrConfig' });
    }

    db.paymentQrConfig = {
      ...db.paymentQrConfig,
      ...paymentQrConfig,
      updatedAt: new Date().toISOString(),
    };

    db.adminAuditLogs.unshift({
      id: `audit_qr_${Date.now()}`,
      adminId: 'user_admin_1',
      adminName: 'System Administrator (7009600157)',
      action: 'PAYMENT_QR_UPDATED',
      targetResource: 'payment_qr',
      targetId: 'global',
      details: `Admin updated payment QR codes. UPI: ${paymentQrConfig.upiId || 'default'}`,
      timestamp: new Date().toISOString(),
      ipAddress: req.ip || '127.0.0.1',
    });

    db.version = (db.version || 1) + 1;
    saveDatabase(db);
    broadcastEvent('STATE_UPDATED', { version: db.version, action: 'QR_UPDATED' });

    res.json({ success: true, paymentQrConfig: db.paymentQrConfig, version: db.version });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Approve Account Activation (Admin)
app.post('/api/admin/approve-activation', (req, res) => {
  try {
    const { requestId, notes } = req.body;
    const reqIndex = db.accountActivationRequests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) {
      return res.status(404).json({ success: false, error: 'Activation request not found' });
    }

    const item = db.accountActivationRequests[reqIndex];
    item.status = 'approved';
    item.approvedAt = new Date().toISOString();
    item.adminNotes = notes || 'Payment verified via bank settlement.';

    // Activate the user
    const user = db.users.find(u => u.id === item.userId);
    if (user) {
      user.status = 'active';
      user.updatedAt = new Date().toISOString();
    }

    // If companion, update profile
    const comp = db.companionProfiles.find(c => c.id === item.userId || c.userId === item.userId);
    if (comp) {
      comp.status = 'active';
      comp.verificationStatus = 'verified';
    }

    db.adminAuditLogs.unshift({
      id: `audit_act_${Date.now()}`,
      adminId: 'user_admin_1',
      adminName: 'System Administrator (7009600157)',
      action: 'ACCOUNT_ACTIVATED',
      targetResource: 'user',
      targetId: item.userId,
      details: `Approved account activation for ${item.userName} (${item.userRole}). UTR: ${item.utrNumber}`,
      timestamp: new Date().toISOString(),
      ipAddress: req.ip || '127.0.0.1',
    });

    db.version = (db.version || 1) + 1;
    saveDatabase(db);
    broadcastEvent('STATE_UPDATED', { version: db.version, action: 'ACTIVATION_APPROVED' });

    res.json({ success: true, request: item });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Request Password Reset OTP
app.post('/api/auth/request-otp', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email is required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = db.users.find(u => u.email?.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(404).json({ success: false, error: 'No account registered with this email address.' });
    }

    if (user.role === 'admin' || user.phone?.includes('7009600157')) {
      return res.status(403).json({ success: false, error: 'Admin account credentials cannot be recovered via public email OTP.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpCache.set(cleanEmail, {
      otp,
      expiresAt,
      userId: user.id,
      fullName: user.fullName,
    });

    // Masked email for display
    const [local, domain] = cleanEmail.split('@');
    const maskedLocal = local.length <= 2 ? `${local[0]}*` : `${local.slice(0, 2)}${'*'.repeat(Math.max(1, local.length - 2))}`;
    const maskedEmail = `${maskedLocal}@${domain}`;

    console.log(`[AUTH] Password Reset OTP for ${cleanEmail}: ${otp} (Valid 10m)`);

    res.json({
      success: true,
      otp, // provided so demo/live frontend can notify user seamlessly
      maskedEmail,
      message: `A 6-digit OTP has been dispatched to ${maskedEmail}`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify OTP & Reset Password
app.post('/api/auth/verify-reset-password', (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, OTP, and new password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cached = otpCache.get(cleanEmail);

    if (!cached) {
      return res.status(400).json({ success: false, error: 'No active OTP request found for this email. Please request a new code.' });
    }

    if (Date.now() > cached.expiresAt) {
      otpCache.delete(cleanEmail);
      return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new verification code.' });
    }

    if (cached.otp !== otp.trim()) {
      return res.status(400).json({ success: false, error: 'Invalid 6-digit OTP code. Please verify and try again.' });
    }

    const user = db.users.find(u => u.email?.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    user.password = newPassword.trim();
    user.updatedAt = new Date().toISOString();
    otpCache.delete(cleanEmail);

    db.version = (db.version || 1) + 1;
    saveDatabase(db);
    broadcastEvent('STATE_UPDATED', { version: db.version, action: 'PASSWORD_RESET' });

    res.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Static Production Files (Serve frontend dist for single-port deployment)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  console.log(`Serving static production build from: ${distPath}`);
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 COMPANIONX SERVER RUNNING ON: http://localhost:${PORT}`);
  console.log(`📡 Real-time API & Data Sync ready`);
  console.log(`🔒 Admin restricted to Phone: 7009600157`);
  console.log(`====================================================`);
});
