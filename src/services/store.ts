// ==========================================
// COMPANIONX: REACTIVE DATABASE & STORE (CLEAN - NO DUMMY ACCOUNTS)
// ==========================================

import { BRAND_CONFIG, INITIAL_MEMBERSHIP_PLANS } from '../config/brand';
import {
  AdminAuditLog,
  Booking,
  BookingEvent,
  BookingStatus,
  ClientProfile,
  CommissionRecord,
  CompanionProfile,
  Conversation,
  CouponPromotion,
  MembershipPlan,
  Message,
  NotificationItem,
  PaymentTransaction,
  PayoutRecord,
  PricingBreakdown,
  RefundRecord,
  Review,
  SafetyReport,
  Subscription,
  SupportTicket,
  User,
  UserRole,
  VerificationRequest,
  VerificationStatus,
  PaymentQrConfig,
  AccountActivationRequest,
  UpiAppType,
} from '../types';

const LIVE_SERVER_URL = 'https://jets-solar-debug-glen.trycloudflare.com';

export const getApiUrl = (endpoint: string): string => {
  if (typeof window !== 'undefined') {
    const isCapacitor = !!(window as any).Capacitor?.isNativePlatform?.() || 
                        window.location.protocol === 'capacitor:' || 
                        (window.location.hostname === 'localhost' && window.location.port !== '5000' && window.location.port !== '5173');
    if (isCapacitor) {
      const saved = localStorage.getItem('companio_custom_server_url') || LIVE_SERVER_URL;
      const base = saved.replace(/\/+$/, '');
      const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      return `${base}${path}`;
    }
  }
  return endpoint;
};

export const DEFAULT_PAYMENT_QR_CONFIG: PaymentQrConfig = {
  upiId: 'companio@okhdfcbank',
  payeeName: 'Companio Official Concierge',
  merchantCode: 'COMPANIO7299',
  defaultQrImageUrl: '',
  gpayQrImageUrl: '',
  phonepeQrImageUrl: '',
  paytmQrImageUrl: '',
  instructions: 'Scan using GPay, PhonePe, Paytm, or BHIM. Pay the exact account activation fee and enter your 12-digit UPI / UTR transaction ID for instant verification.',
  updatedAt: new Date().toISOString(),
};

// Only 1 System Admin account for platform management (Phone: 7009600157, Password: Shivshankar@1)
const INITIAL_SYSTEM_USERS: User[] = [
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
];

const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'audit_clean_init',
    adminId: 'user_admin_1',
    adminName: 'Chief Compliance Officer',
    action: 'SYSTEM_INITIALIZED',
    targetResource: 'system',
    targetId: 'global',
    details: 'Companio platform initialized with zero dummy accounts. Ready for genuine user onboarding.',
    timestamp: new Date().toISOString(),
    ipAddress: '127.0.0.1 (Localhost)',
  },
];

const INITIAL_COUPONS: CouponPromotion[] = [
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
];

// Clean storage key to ensure fresh admin credentials and zero dummy accounts
const STORAGE_KEY = 'companionx_state_clean_v3';

interface AppState {
  users: User[];
  companionProfiles: CompanionProfile[];
  clientProfiles: ClientProfile[];
  verificationRequests: VerificationRequest[];
  membershipPlans: MembershipPlan[];
  subscriptions: Subscription[];
  bookings: Booking[];
  bookingEvents: BookingEvent[];
  conversations: Conversation[];
  messages: Message[];
  reviews: Review[];
  payments: PaymentTransaction[];
  commissions: CommissionRecord[];
  payouts: PayoutRecord[];
  refunds: RefundRecord[];
  supportTickets: SupportTicket[];
  reports: SafetyReport[];
  notifications: NotificationItem[];
  adminAuditLogs: AdminAuditLog[];
  coupons: CouponPromotion[];
  platformCommissionRate: number; // 0.10 to 0.20
  companionJoiningFee: number; // e.g. 999
  paymentQrConfig: PaymentQrConfig;
  accountActivationRequests: AccountActivationRequest[];
  currentUserId: string | null;
  activeRole: UserRole;
  isAgeGatePassed: boolean;
}

class Store {
  private state: AppState;
  private listeners: (() => void)[] = [];
  private passwordResetOtps: Map<
    string,
    {
      email: string;
      userId: string;
      role: UserRole;
      fullName: string;
      otp: string;
      createdAt: number;
      expiresAt: number;
    }
  > = new Map();
  private syncTimeout: any = null;
  private sseSource: EventSource | null = null;
  public isServerSynced: boolean = false;

  constructor() {
    this.state = this.loadState();
    if (typeof window !== 'undefined') {
      this.initServerSync();
    }
  }

  private loadState(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.companionJoiningFee === undefined) {
          parsed.companionJoiningFee = BRAND_CONFIG.defaultCompanionJoiningFee;
        }
        if (parsed.platformCommissionRate === undefined || parsed.platformCommissionRate < 0.25) {
          parsed.platformCommissionRate = BRAND_CONFIG.defaultCommissionRate; // 0.30 (30%)
        }
        if (!parsed.paymentQrConfig) {
          parsed.paymentQrConfig = DEFAULT_PAYMENT_QR_CONFIG;
        }
        if (!parsed.accountActivationRequests) {
          parsed.accountActivationRequests = [];
        }
        parsed.membershipPlans = INITIAL_MEMBERSHIP_PLANS;

        // Ensure 7009600157 admin account is strictly registered & updated
        if (parsed.users && Array.isArray(parsed.users)) {
          let admin = parsed.users.find(
            (u: User) => u.role === 'admin' || (u.phone && u.phone.includes('7009600157'))
          );
          if (admin) {
            admin.phone = '7009600157';
            admin.password = 'Shivshankar@1';
            admin.role = 'admin';
            admin.fullName = 'System Administrator (7009600157)';
          } else {
            parsed.users.push(INITIAL_SYSTEM_USERS[0]);
          }
        } else {
          parsed.users = INITIAL_SYSTEM_USERS;
        }

        // Only allow admin role if active logged-in user is 7009600157
        const curUser = (parsed.users || []).find((u: User) => u.id === parsed.currentUserId);
        const isAdmin = curUser && curUser.role === 'admin' && (curUser.phone || '').replace(/\D/g, '').endsWith('7009600157');
        if (parsed.activeRole === 'admin' && !isAdmin) {
          parsed.activeRole = 'client';
        }

        return parsed;
      }
    } catch {
      // fallback
    }

    return {
      users: INITIAL_SYSTEM_USERS,
      companionProfiles: [],
      clientProfiles: [],
      verificationRequests: [],
      membershipPlans: INITIAL_MEMBERSHIP_PLANS,
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
      adminAuditLogs: INITIAL_AUDIT_LOGS,
      coupons: INITIAL_COUPONS,
      platformCommissionRate: BRAND_CONFIG.defaultCommissionRate,
      companionJoiningFee: BRAND_CONFIG.defaultCompanionJoiningFee,
      paymentQrConfig: DEFAULT_PAYMENT_QR_CONFIG,
      accountActivationRequests: [],
      currentUserId: null, // Starts logged out or guest
      activeRole: 'client',
      isAgeGatePassed: false, // Forces age check
    };
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // ignore
    }
    this.notify();
    this.scheduleServerSync();
  }

  private scheduleServerSync(): void {
    if (typeof window === 'undefined') return;
    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }
    this.syncTimeout = setTimeout(() => {
      this.pushStateToServer();
    }, 250);
  }

  private async pushStateToServer(): Promise<void> {
    try {
      const res = await fetch(getApiUrl('/api/state/sync'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: this.state }),
      });
      if (res.ok) {
        this.isServerSynced = true;
      }
    } catch {
      this.isServerSynced = false;
    }
  }

  public async syncWithServer(): Promise<void> {
    try {
      const res = await fetch(getApiUrl('/api/state'));
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.state) {
          const s = json.state;
          const currentUserId = this.state.currentUserId;
          const activeRole = this.state.activeRole;
          const isAgeGatePassed = this.state.isAgeGatePassed;

          this.state = {
            ...this.state,
            users: this.mergeItems(this.state.users, s.users),
            companionProfiles: this.mergeItems(this.state.companionProfiles, s.companionProfiles),
            clientProfiles: this.mergeItems(this.state.clientProfiles, s.clientProfiles),
            bookings: this.mergeItems(this.state.bookings, s.bookings),
            bookingEvents: this.mergeItems(this.state.bookingEvents, s.bookingEvents),
            conversations: this.mergeItems(this.state.conversations, s.conversations),
            messages: this.mergeItems(this.state.messages, s.messages),
            reviews: this.mergeItems(this.state.reviews, s.reviews),
            payments: this.mergeItems(this.state.payments, s.payments),
            commissions: this.mergeItems(this.state.commissions, s.commissions),
            payouts: this.mergeItems(this.state.payouts, s.payouts),
            refunds: this.mergeItems(this.state.refunds, s.refunds),
            supportTickets: this.mergeItems(this.state.supportTickets, s.supportTickets),
            reports: this.mergeItems(this.state.reports, s.reports),
            notifications: this.mergeItems(this.state.notifications, s.notifications),
            adminAuditLogs: this.mergeItems(this.state.adminAuditLogs, s.adminAuditLogs),
            accountActivationRequests: this.mergeItems(this.state.accountActivationRequests, s.accountActivationRequests),
            paymentQrConfig: s.paymentQrConfig ? { ...this.state.paymentQrConfig, ...s.paymentQrConfig } : this.state.paymentQrConfig,
            companionJoiningFee: s.companionJoiningFee ?? this.state.companionJoiningFee,
            platformCommissionRate: s.platformCommissionRate ?? this.state.platformCommissionRate,
            currentUserId,
            activeRole,
            isAgeGatePassed,
          };

          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
          } catch {}
          this.isServerSynced = true;
          this.notify();
        }
      }
    } catch {
      this.isServerSynced = false;
    }
  }

  private mergeItems<T extends { id: string }>(local: T[] = [], remote: T[] = []): T[] {
    const map = new Map<string, T>();
    (local || []).forEach((item) => {
      if (item && item.id) map.set(item.id, item);
    });
    (remote || []).forEach((item) => {
      if (item && item.id) {
        const existing = map.get(item.id);
        map.set(item.id, existing ? { ...existing, ...item } : item);
      }
    });
    return Array.from(map.values());
  }

  private initServerSync(): void {
    // Initial fetch from server
    this.syncWithServer();

    // Real-time server push via Server-Sent Events (SSE)
    try {
      if (typeof EventSource !== 'undefined') {
        this.sseSource = new EventSource(getApiUrl('/api/events'));
        this.sseSource.addEventListener('STATE_UPDATED', () => {
          this.syncWithServer();
        });
        this.sseSource.onerror = () => {
          // SSE auto-reconnects
        };
      }
    } catch {
      // fallback
    }

    // Polling safety fallback (every 4s)
    setInterval(() => {
      this.syncWithServer();
    }, 4000);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  // Getters
  public getState(): AppState {
    return this.state;
  }

  public getCurrentUser(): User | null {
    if (!this.state.currentUserId) return null;
    return this.state.users.find((u) => u.id === this.state.currentUserId) || null;
  }

  public getActiveRole(): UserRole {
    return this.state.activeRole;
  }

  // Check if a user is the authorized admin with phone 7009600157
  public isAdminUser(user?: User | null): boolean {
    if (!user) return false;
    const cleanPhone = (user.phone || '').replace(/\D/g, '');
    return user.role === 'admin' && cleanPhone.endsWith('7009600157');
  }

  public setActiveRole(role: UserRole): void {
    if (role === 'admin') {
      const cur = this.getCurrentUser();
      if (!this.isAdminUser(cur)) {
        // Forbidden to switch to admin unless authenticated as 7009600157
        this.state.activeRole = 'client';
        this.saveState();
        return;
      }
    }
    this.state.activeRole = role;
    this.saveState();
  }

  public setAgeGatePassed(passed: boolean): void {
    this.state.isAgeGatePassed = passed;
    this.saveState();
  }

  public pushNotification(params: {
    userId: string;
    title: string;
    message: string;
    type: 'booking' | 'payment' | 'verification' | 'safety' | 'system';
  }): void {
    this.state.notifications.unshift({
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }

  // ==========================================
  // REAL AUTHENTICATION & REGISTRATION
  // ==========================================

  public registerClient(params: {
    fullName: string;
    email: string;
    phone: string;
    age: number;
    preferredCity: string;
    password?: string;
  }): { success: boolean; user?: User; error?: string } {
    if (params.age < 18) {
      return { success: false, error: 'Under 18 registration strictly prohibited by law.' };
    }

    const existing = this.state.users.find(
      (u) => u.email.toLowerCase() === params.email.toLowerCase() || u.phone === params.phone
    );
    if (existing) {
      return { success: false, error: 'An account with this email or phone already exists.' };
    }

    const userId = `user_client_${Date.now()}`;
    const newUser: User = {
      id: userId,
      email: params.email,
      phone: params.phone,
      password: params.password || 'Client@123',
      role: 'client',
      fullName: params.fullName,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
      age: params.age,
      isAgeVerified: true,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newClientProfile: ClientProfile = {
      id: `client_prof_${Date.now()}`,
      userId,
      fullName: params.fullName,
      preferredCity: params.preferredCity,
      interests: ['Fine Dining', 'Art & Culture'],
      emergencyContact: {
        name: 'Family Emergency Contact',
        phone: params.phone,
        relation: 'Self/Family',
      },
      subscriptionTier: 'free',
      favorites: [],
    };

    this.state.users.push(newUser);
    this.state.clientProfiles.push(newClientProfile);
    this.state.currentUserId = userId;
    this.state.activeRole = 'client';

    this.state.adminAuditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminId: 'system',
      adminName: 'Registration Sentinel',
      action: 'CLIENT_REGISTERED',
      targetResource: 'users',
      targetId: userId,
      details: `New client registered: ${params.fullName} (${params.email}, City: ${params.preferredCity})`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Client App)',
    });

    this.saveState();
    return { success: true, user: newUser };
  }

  public registerCompanion(params: {
    fullName: string;
    email: string;
    phone: string;
    age: number;
    city: string;
    profession: string;
    education: string;
    bio: string;
    hourlyRate: number;
    languages?: string[];
    avatar?: string;
    photos?: string[];
    isJoiningFeePaid?: boolean;
    password?: string;
  }): { success: boolean; user?: User; error?: string } {
    if (params.age < 18) {
      return { success: false, error: 'Under 18 registration strictly prohibited by law.' };
    }

    const existing = this.state.users.find(
      (u) => u.email.toLowerCase() === params.email.toLowerCase() || u.phone === params.phone
    );
    if (existing) {
      return { success: false, error: 'An account with this email or phone already exists.' };
    }

    const userId = `user_comp_${Date.now()}`;
    const initialPhotos =
      params.photos && params.photos.length > 0
        ? params.photos
        : [
            params.avatar ||
              'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
          ];

    const newUser: User = {
      id: userId,
      email: params.email,
      phone: params.phone,
      password: params.password || 'Companion@123',
      role: 'companion',
      fullName: params.fullName,
      avatar: initialPhotos[0],
      age: params.age,
      isAgeVerified: true,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newCompanionProfile: CompanionProfile = {
      id: `comp_prof_${Date.now()}`,
      userId,
      fullName: params.fullName,
      tagline: `${params.profession} & Cultured Companion in ${params.city}`,
      bio: params.bio,
      age: params.age,
      height: "5'11\"",
      education: params.education,
      profession: params.profession,
      languages: params.languages || ['English', 'Hindi'],
      city: params.city,
      state: 'India',
      serviceRadiusKm: 35,
      approvedPhotos: initialPhotos,
      interests: ['Fine Dining', 'Literature', 'Travel', 'Art'],
      servicesOffered: [
        {
          category: 'dining',
          title: 'Gourmet Dining & Social Outing',
          description: 'Sophisticated accompaniment for fine dining, coffee conversations, and culinary tastings.',
          hourlyRate: params.hourlyRate || 1500,
          minHours: 2,
        },
        {
          category: 'social_events',
          title: 'Weddings & Gala Plus-One',
          description: 'Polished, articulate plus-one for celebratory social galas and family gatherings.',
          hourlyRate: (params.hourlyRate || 1500) + 500,
          minHours: 3,
        },
        {
          category: 'cultural_exploration',
          title: 'Heritage & Art Walk',
          description: 'Engaging guided exploration of museums, art galleries, and city landmarks.',
          hourlyRate: params.hourlyRate || 1500,
          minHours: 2,
        },
      ],
      verificationStatus: 'pending', // Starts in verification review
      rating: 0,
      totalReviews: 0,
      completedBookings: 0,
      isPaused: false,
      featured: false,
      profileTier: 'basic',
      isJoiningFeePaid: params.isJoiningFeePaid ?? false,
      unavailableDates: [],
      workingHours: { start: '11:00', end: '23:00' },
    };

    this.state.users.push(newUser);
    this.state.companionProfiles.push(newCompanionProfile);
    this.state.currentUserId = userId;
    this.state.activeRole = 'companion';


    this.state.adminAuditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminId: 'system',
      adminName: 'Registration Sentinel',
      action: 'COMPANION_REGISTERED',
      targetResource: 'companionProfile',
      targetId: newCompanionProfile.id,
      details: `New companion registered: ${params.fullName} (${params.email}, ${params.city}). Awaiting KYC submission.`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Companion App)',
    });

    this.saveState();
    return { success: true, user: newUser };
  }

  public loginUser(emailOrPhone: string, password?: string): { success: boolean; user?: User; error?: string } {
    const q = emailOrPhone.trim().toLowerCase();
    const cleanDigits = q.replace(/\D/g, '');

    // Strict Admin check: Phone 7009600157 or admin email
    const isAdminAttempt =
      cleanDigits.endsWith('7009600157') ||
      q === 'admin@companio.in' ||
      q === 'admin.compliance@companio.in';

    if (isAdminAttempt) {
      if (!password || password !== 'Shivshankar@1') {
        return {
          success: false,
          error: 'Invalid password. Please check your credentials.',
        };
      }

      let admin = this.state.users.find(
        (u) => u.role === 'admin' || (u.phone && u.phone.replace(/\D/g, '').endsWith('7009600157'))
      );
      if (!admin) {
        admin = {
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
        };
        this.state.users.push(admin);
      } else {
        admin.phone = '7009600157';
        admin.password = 'Shivshankar@1';
        admin.role = 'admin';
        admin.fullName = 'System Administrator (7009600157)';
      }

      this.state.currentUserId = admin.id;
      this.state.activeRole = 'admin';
      this.saveState();
      return { success: true, user: admin };
    }

    // Standard client or companion login
    const user = this.state.users.find((u) => {
      const uDigits = (u.phone || '').replace(/\D/g, '');
      return (
        u.email.toLowerCase() === q ||
        (cleanDigits.length >= 7 && uDigits.endsWith(cleanDigits))
      );
    });

    if (!user) {
      return { success: false, error: 'No account found with this email or phone number.' };
    }

    if (user.role === 'admin') {
      return {
        success: false,
        error: 'Password required for this account.',
      };
    }

    if (user.status === 'suspended') {
      return { success: false, error: 'This account has been suspended for policy violations.' };
    }

    // Verify password if entered and user has password
    if (user.password && password && user.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Click "Forgot password?" to recover via Email OTP.',
      };
    }

    this.state.currentUserId = user.id;
    this.state.activeRole = user.role;
    this.saveState();
    return { success: true, user };
  }

  public logout(): void {
    this.state.currentUserId = null;
    this.state.activeRole = 'client';
    this.saveState();
  }

  // Helper to mask email for security
  public maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!domain) return email;
    if (local.length <= 2) return `${local[0]}*@${domain}`;
    return `${local.slice(0, 2)}${'*'.repeat(Math.max(3, local.length - 2))}@${domain}`;
  }

  // ==========================================
  // PASSWORD RECOVERY VIA EMAIL OTP
  // ==========================================

  // Step 1: Request Password Reset OTP to Email
  public requestPasswordResetOtp(email: string): {
    success: boolean;
    otp?: string;
    maskedEmail?: string;
    fullName?: string;
    role?: UserRole;
    error?: string;
  } {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // Find client or companion user
    const user = this.state.users.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (!user) {
      return {
        success: false,
        error: 'No registered client or companion account found with this email address.',
      };
    }

    // Disallow admin password reset through public client/companion portal
    if (this.isAdminUser(user)) {
      return {
        success: false,
        error: 'Administrator credentials cannot be recovered via public email reset.',
      };
    }

    // Generate 6-digit cryptographic-style numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const now = Date.now();
    const expiresAt = now + 10 * 60 * 1000; // 10 minutes

    this.passwordResetOtps.set(cleanEmail, {
      email: cleanEmail,
      userId: user.id,
      role: user.role,
      fullName: user.fullName,
      otp,
      createdAt: now,
      expiresAt,
    });

    // Notify user in system notifications as well
    this.pushNotification({
      userId: user.id,
      title: '🔐 Password Reset OTP Code',
      message: `Your password recovery verification code is: ${otp} (valid for 10 minutes). Do not share this OTP with anyone.`,
      type: 'system',
    });

    // Audit log
    this.state.adminAuditLogs.unshift({
      id: `audit_reset_${Date.now()}`,
      adminId: 'system',
      adminName: 'Security Sentinel',
      action: 'PASSWORD_RESET_OTP_DISPATCHED',
      targetResource: 'users',
      targetId: user.id,
      details: `Password reset OTP dispatched to ${this.maskEmail(cleanEmail)} for ${user.fullName} (${user.role}).`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Email Service)',
    });

    this.saveState();

    return {
      success: true,
      otp, // Provided so UI can simulate actual email dispatch
      maskedEmail: this.maskEmail(cleanEmail),
      fullName: user.fullName,
      role: user.role,
    };
  }

  // Step 2: Verify OTP & Reset Password
  public verifyOtpAndResetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): { success: boolean; user?: User; error?: string } {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanEmail || !cleanOtp) {
      return { success: false, error: 'Email and OTP code are required.' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    const record = this.passwordResetOtps.get(cleanEmail);
    if (!record) {
      return {
        success: false,
        error: 'No active password reset request found for this email. Please request a new OTP.',
      };
    }

    if (Date.now() > record.expiresAt) {
      this.passwordResetOtps.delete(cleanEmail);
      return {
        success: false,
        error: 'The OTP code has expired. Please request a fresh OTP.',
      };
    }

    if (record.otp !== cleanOtp) {
      return {
        success: false,
        error: 'Incorrect OTP code. Please enter the 6-digit code sent to your email.',
      };
    }

    const user = this.state.users.find((u) => u.id === record.userId);
    if (!user) {
      return { success: false, error: 'Associated user account not found.' };
    }

    // Update password
    user.password = newPassword;
    user.updatedAt = new Date().toISOString();

    // Consume OTP
    this.passwordResetOtps.delete(cleanEmail);

    // Notify user
    this.pushNotification({
      userId: user.id,
      title: '🔐 Password Successfully Updated',
      message: 'Your account password has been successfully reset. You can now log in securely with your new password.',
      type: 'system',
    });

    // Audit log
    this.state.adminAuditLogs.unshift({
      id: `audit_pwd_${Date.now()}`,
      adminId: 'system',
      adminName: 'Security Sentinel',
      action: 'PASSWORD_RESET_SUCCESS',
      targetResource: 'users',
      targetId: user.id,
      details: `Password successfully updated via verified email OTP for ${user.fullName} (${user.role}).`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Auth System)',
    });

    this.saveState();
    return { success: true, user };
  }

  // ==========================================
  // AVAILABILITY & CONFLICT CHECK (DOUBLE BOOKING)
  // ==========================================
  public checkDoubleBooking(
    companionId: string,
    date: string,
    startTime: string,
    durationHours: number
  ): { hasConflict: boolean; conflictingBooking?: Booking; message?: string } {
    const existing = this.state.bookings.filter(
      (b) =>
        b.companionId === companionId &&
        b.date === date &&
        (b.status === 'confirmed' || b.status === 'accepted' || b.status === 'requested')
    );

    const [startH, startM] = startTime.split(':').map(Number);
    const reqStartMins = startH * 60 + (startM || 0);
    const reqEndMins = reqStartMins + durationHours * 60;

    for (const bk of existing) {
      const [bH, bM] = bk.startTime.split(':').map(Number);
      const bkStartMins = bH * 60 + (bM || 0);
      const bkEndMins = bkStartMins + bk.durationHours * 60;

      if (reqStartMins < bkEndMins && reqEndMins > bkStartMins) {
        return {
          hasConflict: true,
          conflictingBooking: bk,
          message: `The companion is already booked on ${date} between ${bk.startTime} and ${Math.floor(
            bkEndMins / 60
          )}:${String(bkEndMins % 60).padStart(2, '0')}. Please choose a different slot.`,
        };
      }
    }

    return { hasConflict: false };
  }

  // Pricing & Commission Calculation
  public calculatePricing(hourlyRate: number, durationHours: number): PricingBreakdown {
    const baseAmount = hourlyRate * durationHours;
    const commissionRate = this.state.platformCommissionRate;
    const commissionAmount = Math.round(baseAmount * commissionRate * 100) / 100;
    const companionPayoutAmount = baseAmount - commissionAmount;
    const gstRate = BRAND_CONFIG.gstRateOnCommission;
    const gstAmount = Math.round(commissionAmount * gstRate * 100) / 100;
    const totalAmount = Math.round((baseAmount + gstAmount) * 100) / 100;

    return {
      hourlyRate,
      durationHours,
      baseAmount,
      platformCommissionRate: commissionRate,
      platformCommissionAmount: commissionAmount,
      companionPayoutAmount,
      gstRate,
      gstAmount,
      totalAmount,
    };
  }

  // Request Booking
  public requestBooking(params: {
    companionId: string;
    serviceCategory: any;
    serviceTitle: string;
    hourlyRate: number;
    date: string;
    startTime: string;
    durationHours: number;
    venueName: string;
    address: string;
    city: string;
    landmark?: string;
    isVirtual?: boolean;
    clientNotes: string;
  }): { success: boolean; booking?: Booking; error?: string } {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, error: 'Please register or log in as a client to book.' };
    }

    const conflict = this.checkDoubleBooking(
      params.companionId,
      params.date,
      params.startTime,
      params.durationHours
    );
    if (conflict.hasConflict) {
      return { success: false, error: conflict.message };
    }

    const companion = this.state.companionProfiles.find((c) => c.id === params.companionId);
    if (!companion) {
      return { success: false, error: 'Companion profile not found.' };
    }

    if (companion.isPaused) {
      return { success: false, error: 'This companion is currently not accepting bookings (Profile Paused).' };
    }

    const pricing = this.calculatePricing(params.hourlyRate, params.durationHours);

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      bookingCode: `CX-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: currentUser.id,
      clientName: currentUser.fullName,
      companionId: companion.id,
      companionName: companion.fullName,
      serviceCategory: params.serviceCategory,
      serviceTitle: params.serviceTitle,
      date: params.date,
      startTime: params.startTime,
      durationHours: params.durationHours,
      meetingLocation: {
        venueName: params.venueName,
        address: params.address,
        city: params.city,
        landmark: params.landmark,
        isVirtual: params.isVirtual,
      },
      clientNotes: params.clientNotes,
      status: 'requested',
      pricing,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.state.bookings.unshift(newBooking);

    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: companion.userId,
      title: 'New Booking Request Received',
      message: `${currentUser.fullName} requested a booking for ${params.serviceTitle} on ${params.date} at ${params.startTime}.`,
      type: 'booking',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.saveState();
    return { success: true, booking: newBooking };
  }

  // Accept Booking (Companion Action)
  public acceptBooking(bookingId: string): { success: boolean; error?: string } {
    const booking = this.state.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    booking.status = 'accepted';
    booking.updatedAt = new Date().toISOString();

    let conv = this.state.conversations.find((c) => c.bookingId === bookingId);
    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        bookingId: booking.id,
        clientId: booking.clientId,
        clientName: booking.clientName,
        companionId: booking.companionId,
        companionName: booking.companionName,
        lastMessageText: 'Booking request accepted. Messaging is unlocked!',
        lastMessageTimestamp: new Date().toISOString(),
        isLocked: false,
      };
      this.state.conversations.unshift(conv);
    } else {
      conv.isLocked = false;
    }

    this.state.messages.push({
      id: `msg_${Date.now()}`,
      conversationId: conv.id,
      senderId: 'system',
      senderName: 'CompanionX Concierge',
      senderRole: 'admin',
      text: `Booking ${booking.bookingCode} accepted by ${booking.companionName}. Chat unlocked for public venue coordination.`,
      timestamp: new Date().toISOString(),
      isRead: false,
    });

    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: booking.clientId,
      title: 'Booking Request Accepted!',
      message: `${booking.companionName} accepted your request for ${booking.date}. Please proceed to payment.`,
      type: 'booking',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.saveState();
    return { success: true };
  }

  // Reject Booking
  public rejectBooking(bookingId: string, reason: string): { success: boolean; error?: string } {
    const booking = this.state.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    booking.status = 'rejected';
    booking.companionRejectReason = reason;
    booking.updatedAt = new Date().toISOString();

    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: booking.clientId,
      title: 'Booking Request Declined',
      message: `${booking.companionName} was unavailable for ${booking.date}. Reason: ${reason}`,
      type: 'booking',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    this.saveState();
    return { success: true };
  }

  // Confirm & Pay for Booking
  public confirmAndPayBooking(
    bookingId: string,
    paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet'
  ): { success: boolean; payment?: PaymentTransaction; error?: string } {
    const booking = this.state.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    const paymentId = `pay_tx_${Date.now()}`;
    const paymentTx: PaymentTransaction = {
      id: paymentId,
      bookingId: booking.id,
      userId: booking.clientId,
      amount: booking.pricing.totalAmount,
      currency: 'INR',
      status: 'success',
      paymentMethod,
      gatewayTransactionId: `rzp_live_${Math.random().toString(36).substring(2, 10)}`,
      idempotencyKey: `idemp_${booking.id}_${Date.now()}`,
      signatureVerified: true,
      createdAt: new Date().toISOString(),
    };

    booking.status = 'confirmed';
    booking.paymentId = paymentId;
    booking.updatedAt = new Date().toISOString();

    this.state.payments.unshift(paymentTx);

    this.state.commissions.unshift({
      id: `comm_${Date.now()}`,
      bookingId: booking.id,
      companionId: booking.companionId,
      bookingAmount: booking.pricing.baseAmount,
      commissionRate: booking.pricing.platformCommissionRate,
      commissionAmount: booking.pricing.platformCommissionAmount,
      gstAmount: booking.pricing.gstAmount,
      netPayoutAmount: booking.pricing.companionPayoutAmount,
      status: 'accrued',
      createdAt: new Date().toISOString(),
    });

    this.saveState();
    return { success: true, payment: paymentTx };
  }

  // Cancel Booking
  public cancelBooking(
    bookingId: string,
    cancelledByRole: UserRole,
    reason: string
  ): { success: boolean; refundAmount: number; error?: string } {
    const booking = this.state.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, refundAmount: 0, error: 'Booking not found.' };

    let refundAmount = 0;

    if (booking.status === 'confirmed' && booking.paymentId) {
      const bookingDateTime = new Date(`${booking.date}T${booking.startTime}:00`).getTime();
      const now = Date.now();
      const diffHours = (bookingDateTime - now) / (1000 * 60 * 60);

      if (diffHours >= 24 || cancelledByRole === 'companion' || cancelledByRole === 'admin') {
        refundAmount = booking.pricing.totalAmount;
      } else if (diffHours >= 12) {
        refundAmount = Math.round(booking.pricing.totalAmount * 0.5 * 100) / 100;
      } else {
        refundAmount = 0;
      }

      booking.status = refundAmount > 0 ? 'refund_pending' : 'cancelled';

      if (refundAmount > 0) {
        this.state.refunds.unshift({
          id: `ref_${Date.now()}`,
          bookingId: booking.id,
          paymentId: booking.paymentId,
          clientId: booking.clientId,
          amount: refundAmount,
          reason: `Cancelled by ${cancelledByRole}. Notice: ${Math.round(diffHours)}h prior.`,
          status: 'completed',
          processedAt: new Date().toISOString(),
        });
        booking.status = 'refunded';
      }
    } else {
      booking.status = 'cancelled';
    }

    booking.clientCancelledReason = reason;
    booking.updatedAt = new Date().toISOString();

    this.saveState();
    return { success: true, refundAmount };
  }

  // Mark Completed
  public completeBooking(bookingId: string): { success: boolean; error?: string } {
    const booking = this.state.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found.' };

    booking.status = 'completed';
    booking.updatedAt = new Date().toISOString();

    const comp = this.state.companionProfiles.find((c) => c.id === booking.companionId);
    if (comp) {
      comp.completedBookings = (comp.completedBookings || 0) + 1;
    }

    this.saveState();
    return { success: true };
  }

  // Send Chat Message
  public sendMessage(conversationId: string, text: string): { success: boolean; message?: Message } {
    const conv = this.state.conversations.find((c) => c.id === conversationId);
    if (!conv) return { success: false };

    const currentUser = this.getCurrentUser();
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser ? currentUser.id : 'client',
      senderName: currentUser ? currentUser.fullName : 'Guest',
      senderRole: this.state.activeRole,
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    this.state.messages.push(newMsg);
    conv.lastMessageText = text;
    conv.lastMessageTimestamp = new Date().toISOString();

    this.saveState();
    return { success: true, message: newMsg };
  }

  // Submit Review
  public submitReview(bookingId: string, rating: number, comment: string): { success: boolean } {
    const booking = this.state.bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false };

    const client = this.getCurrentUser();
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      bookingId,
      clientId: client ? client.id : booking.clientId,
      clientName: client ? client.fullName : booking.clientName,
      companionId: booking.companionId,
      rating,
      comment,
      isModerated: true,
      createdAt: new Date().toISOString(),
    };

    this.state.reviews.unshift(newRev);

    const comp = this.state.companionProfiles.find((c) => c.id === booking.companionId);
    if (comp) {
      const allCompReviews = this.state.reviews.filter((r) => r.companionId === comp.id);
      const sum = allCompReviews.reduce((acc, r) => acc + r.rating, 0);
      comp.rating = Math.round((sum / allCompReviews.length) * 100) / 100;
      comp.totalReviews = allCompReviews.length;
    }

    this.saveState();
    return { success: true };
  }

  // Companion: Toggle Pause Profile
  public togglePauseProfile(companionId: string): boolean {
    const comp = this.state.companionProfiles.find((c) => c.id === companionId);
    if (!comp) return false;
    comp.isPaused = !comp.isPaused;
    this.saveState();
    return comp.isPaused;
  }

  // Companion: Submit Verification (KYC)
  public submitVerification(params: {
    companionId: string;
    idType: any;
    idNumberMasked: string;
    documentFrontUrl: string;
    documentBackUrl: string;
    selfieWithIdUrl: string;
  }): { success: boolean; request?: VerificationRequest } {
    const comp = this.state.companionProfiles.find((c) => c.id === params.companionId);
    if (!comp) return { success: false };

    const req: VerificationRequest = {
      id: `verif_${Date.now()}`,
      companionId: comp.id,
      userId: comp.userId,
      companionName: comp.fullName,
      idType: params.idType,
      idNumberMasked: params.idNumberMasked,
      documentFrontUrl: params.documentFrontUrl,
      documentBackUrl: params.documentBackUrl,
      selfieWithIdUrl: params.selfieWithIdUrl,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    comp.verificationStatus = 'pending';
    this.state.verificationRequests.unshift(req);

    this.saveState();
    return { success: true, request: req };
  }

  // Admin: Review Verification Request
  public reviewVerification(
    requestId: string,
    decision: 'approved' | 'rejected',
    notes: string
  ): { success: boolean } {
    const req = this.state.verificationRequests.find((r) => r.id === requestId);
    if (!req) return { success: false };

    req.status = decision;
    req.reviewerNotes = notes;
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = this.getCurrentUser()?.fullName || 'Chief Compliance Officer';

    const comp = this.state.companionProfiles.find((c) => c.id === req.companionId);
    if (comp) {
      comp.verificationStatus = decision;
    }

    this.state.adminAuditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminId: 'admin_1',
      adminName: 'Chief Compliance Officer',
      action: decision === 'approved' ? 'VERIFY_COMPANION_APPROVED' : 'VERIFY_COMPANION_REJECTED',
      targetResource: 'companionProfile',
      targetId: req.companionId,
      details: `${decision.toUpperCase()} ID verification for ${req.companionName}. Notes: ${notes}`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Admin Console)',
    });

    this.saveState();
    return { success: true };
  }

  // Admin: Update Platform Commission Rate
  public updateCommissionRate(newRate: number): { success: boolean; error?: string } {
    if (newRate < BRAND_CONFIG.minCommissionRate || newRate > BRAND_CONFIG.maxCommissionRate) {
      return {
        success: false,
        error: `Commission rate must be between ${BRAND_CONFIG.minCommissionRate * 100}% and ${BRAND_CONFIG.maxCommissionRate * 100}%.`,
      };
    }

    const oldRate = this.state.platformCommissionRate;
    this.state.platformCommissionRate = newRate;

    this.state.adminAuditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminId: 'admin_1',
      adminName: 'Chief Compliance Officer',
      action: 'UPDATE_COMMISSION_RATE',
      targetResource: 'systemConfig',
      targetId: 'global',
      details: `Updated platform commission rate from ${(oldRate * 100).toFixed(1)}% to ${(newRate * 100).toFixed(1)}%.`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Admin Console)',
    });

    this.saveState();
    return { success: true };
  }

  // Companion: Request Payout
  public requestPayout(
    companionId: string,
    amount: number,
    upiId: string,
    bankAccountMasked: string
  ): { success: boolean; payout?: PayoutRecord; error?: string } {
    const comp = this.state.companionProfiles.find((c) => c.id === companionId);
    if (!comp) return { success: false, error: 'Companion not found.' };

    const payout: PayoutRecord = {
      id: `payout_${Date.now()}`,
      companionId: comp.id,
      companionName: comp.fullName,
      amount,
      bankAccountMasked,
      upiIdMasked: upiId,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    this.state.payouts.unshift(payout);
    this.saveState();
    return { success: true, payout };
  }

  // Safety: File Report
  public fileSafetyReport(params: {
    reportedUserId: string;
    reportedUserName: string;
    bookingId?: string;
    reasonCategory: any;
    description: string;
  }): { success: boolean; report?: SafetyReport } {
    const reporter = this.getCurrentUser();
    const rep: SafetyReport = {
      id: `report_${Date.now()}`,
      reporterId: reporter ? reporter.id : 'guest',
      reporterName: reporter ? reporter.fullName : 'Guest Client',
      reporterRole: this.state.activeRole,
      reportedUserId: params.reportedUserId,
      reportedUserName: params.reportedUserName,
      bookingId: params.bookingId,
      reasonCategory: params.reasonCategory,
      description: params.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.state.reports.unshift(rep);
    this.saveState();
    return { success: true, report: rep };
  }

  // Admin: Resolve Safety Report & Suspend User
  public resolveSafetyReport(
    reportId: string,
    action: 'suspend_user' | 'dismiss' | 'warning_issued',
    notes: string
  ): { success: boolean } {
    const rep = this.state.reports.find((r) => r.id === reportId);
    if (!rep) return { success: false };

    rep.status = 'resolved';
    rep.adminActionTaken = `Action: ${action.replace('_', ' ').toUpperCase()}. Notes: ${notes}`;

    if (action === 'suspend_user') {
      const targetUser = this.state.users.find((u) => u.id === rep.reportedUserId);
      if (targetUser) {
        targetUser.status = 'suspended';
      }
    }

    this.saveState();
    return { success: true };
  }

  // Companion: Boost Profile (₹99 Promotion Campaign)
  public boostProfile(companionId: string): { success: boolean } {
    const comp = this.state.companionProfiles.find((c) => c.id === companionId);
    if (!comp) return { success: false };

    comp.featured = true;
    this.saveState();
    return { success: true };
  }

  // Upgrade Membership Subscription
  public upgradeSubscription(planId: string, targetRole: 'client' | 'companion'): { success: boolean } {
    const plan = this.state.membershipPlans.find((p) => p.id === planId);
    if (!plan) return { success: false };

    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false };

    const validityDays = plan.validityDays || 30;
    const sub: Subscription = {
      id: `sub_${Date.now()}`,
      userId: currentUser.id,
      planId: plan.id,
      planName: plan.name,
      targetRole,
      amount: plan.priceMonthly,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: true,
      paymentId: `pay_sub_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    this.state.subscriptions = this.state.subscriptions.filter(
      (s) => !(s.userId === currentUser.id && s.targetRole === targetRole)
    );
    this.state.subscriptions.unshift(sub);

    this.saveState();
    return { success: true };
  }

  // Pay Companion Joining & Verification Fee
  public payCompanionJoiningFee(
    companionId: string,
    paymentMethod: 'upi' | 'card' | 'netbanking'
  ): { success: boolean; payment?: PaymentTransaction; error?: string } {
    const comp = this.state.companionProfiles.find((c) => c.id === companionId);
    if (!comp) return { success: false, error: 'Companion profile not found.' };

    const amount = this.state.companionJoiningFee;
    const paymentId = `pay_join_${Date.now()}`;
    const payment: PaymentTransaction = {
      id: paymentId,
      userId: comp.userId,
      amount,
      currency: 'INR',
      status: 'success',
      paymentMethod,
      gatewayTransactionId: `rzp_join_${Math.random().toString(36).substring(2, 9)}`,
      idempotencyKey: `idemp_join_${comp.id}_${Date.now()}`,
      signatureVerified: true,
      createdAt: new Date().toISOString(),
    };

    comp.isJoiningFeePaid = true;
    comp.joiningFeePaymentId = paymentId;
    this.state.payments.unshift(payment);

    this.state.adminAuditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminId: 'system',
      adminName: 'Payment Gateway',
      action: 'COMPANION_JOINING_FEE_PAID',
      targetResource: 'companionProfile',
      targetId: comp.id,
      details: `Companion ${comp.fullName} paid ₹${amount} joining & background verification fee via ${paymentMethod.toUpperCase()}.`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    });

    this.saveState();
    return { success: true, payment };
  }

  // ----------------------------------------------------
  // PAYMENT QR CONFIG & ACCOUNT ACTIVATION MANAGEMENT
  // ----------------------------------------------------

  public getPaymentQrConfig(): PaymentQrConfig {
    return this.state.paymentQrConfig || DEFAULT_PAYMENT_QR_CONFIG;
  }

  public updatePaymentQrConfig(config: Partial<PaymentQrConfig>): { success: boolean; error?: string } {
    this.state.paymentQrConfig = {
      ...this.getPaymentQrConfig(),
      ...config,
      updatedAt: new Date().toISOString(),
    };

    this.state.adminAuditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminId: this.state.currentUserId || 'admin',
      adminName: 'Chief Compliance Officer',
      action: 'PAYMENT_QR_UPDATED',
      targetResource: 'paymentQrConfig',
      targetId: 'global',
      details: `Updated Payment UPI ID to ${this.state.paymentQrConfig.upiId} and payee to ${this.state.paymentQrConfig.payeeName}.`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    });

    this.saveState();
    return { success: true };
  }

  // Submit Account Activation Proof (Companion pays via GPay/PhonePe/Paytm QR)
  public submitAccountActivationRequest(data: {
    companionId: string;
    upiApp: UpiAppType;
    utrNumber: string;
    screenshotUrl?: string;
    senderUpiId?: string;
  }): { success: boolean; request?: AccountActivationRequest; error?: string } {
    const comp = this.state.companionProfiles.find((c) => c.id === data.companionId);
    if (!comp) return { success: false, error: 'Companion profile not found.' };

    const utr = data.utrNumber.trim();
    if (!utr || utr.length < 8) {
      return { success: false, error: 'Please enter a valid 12-digit UPI Transaction ID / UTR reference number.' };
    }

    // Check duplicate UTR
    const duplicate = this.state.accountActivationRequests.find(
      (r) => r.utrNumber.toLowerCase() === utr.toLowerCase() && r.status !== 'rejected'
    );
    if (duplicate && duplicate.companionId !== comp.id) {
      return { success: false, error: 'This UTR / Transaction reference has already been submitted.' };
    }

    const user = this.state.users.find((u) => u.id === comp.userId);
    const requestId = `act_${Date.now()}`;
    const amount = this.state.companionJoiningFee || 999;

    const request: AccountActivationRequest = {
      id: requestId,
      companionId: comp.id,
      userId: comp.userId,
      companionName: comp.fullName,
      companionPhone: user?.phone || '',
      companionEmail: user?.email || '',
      amount,
      upiApp: data.upiApp,
      utrNumber: utr,
      screenshotUrl: data.screenshotUrl,
      senderUpiId: data.senderUpiId,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    // Remove any previous pending request for this companion to avoid clutter
    this.state.accountActivationRequests = this.state.accountActivationRequests.filter(
      (r) => r.companionId !== comp.id || r.status !== 'pending'
    );
    this.state.accountActivationRequests.unshift(request);

    comp.activationStatus = 'pending_approval';
    comp.activationRequestId = requestId;
    comp.lastSubmittedUtr = utr;

    // Send notifications
    this.pushNotification({
      userId: comp.userId,
      title: 'Payment Verification in Progress',
      message: `Your payment of ₹${amount} (UTR: ${utr}) via ${data.upiApp.toUpperCase()} has been submitted. Our compliance officer will audit and activate your account shortly.`,
      type: 'payment',
    });

    const adminUser = this.state.users.find((u) => u.role === 'admin');
    if (adminUser) {
      this.pushNotification({
        userId: adminUser.id,
        title: 'New Account Activation Payment Due',
        message: `${comp.fullName} submitted ₹${amount} payment via ${data.upiApp.toUpperCase()} (UTR: ${utr}). Please verify and approve.`,
        type: 'payment',
      });
    }

    this.state.adminAuditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminId: 'system',
      adminName: 'UPI Sentinel',
      action: 'ACTIVATION_REQUEST_SUBMITTED',
      targetResource: 'accountActivationRequest',
      targetId: requestId,
      details: `Companion ${comp.fullName} submitted ₹${amount} payment reference ${utr} via ${data.upiApp}.`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    });

    this.saveState();
    return { success: true, request };
  }

  // Admin Approves Account Activation & Unlocks Profile
  public approveAccountActivation(requestId: string): { success: boolean; error?: string } {
    const req = this.state.accountActivationRequests.find((r) => r.id === requestId);
    if (!req) return { success: false, error: 'Activation request not found.' };

    const comp = this.state.companionProfiles.find((c) => c.id === req.companionId);
    if (!comp) return { success: false, error: 'Companion profile not found.' };

    req.status = 'approved';
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = 'Chief Compliance Officer';

    comp.isJoiningFeePaid = true;
    comp.activationStatus = 'approved';

    const paymentId = `pay_upi_act_${Date.now()}`;
    const payment: PaymentTransaction = {
      id: paymentId,
      userId: comp.userId,
      amount: req.amount,
      currency: 'INR',
      status: 'success',
      paymentMethod: 'upi',
      gatewayTransactionId: `upi_${req.utrNumber}`,
      idempotencyKey: `idemp_act_${comp.id}_${Date.now()}`,
      signatureVerified: true,
      createdAt: new Date().toISOString(),
    };

    comp.joiningFeePaymentId = paymentId;
    this.state.payments.unshift(payment);

    // Notify Companion
    this.pushNotification({
      userId: comp.userId,
      title: '🎉 Account Activated & Verified!',
      message: `Your payment of ₹${req.amount} (UTR: ${req.utrNumber}) has been approved! Your companion account is now active and ready to receive bookings.`,
      type: 'payment',
    });

    this.state.adminAuditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminId: this.state.currentUserId || 'user_admin_1',
      adminName: 'Chief Compliance Officer',
      action: 'COMPANION_ACCOUNT_ACTIVATED',
      targetResource: 'companionProfile',
      targetId: comp.id,
      details: `Approved account activation for ${comp.fullName}. Verified UTR ${req.utrNumber} for ₹${req.amount}.`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    });

    this.saveState();
    return { success: true };
  }

  // Admin Rejects Account Activation
  public rejectAccountActivation(requestId: string, reason: string): { success: boolean; error?: string } {
    const req = this.state.accountActivationRequests.find((r) => r.id === requestId);
    if (!req) return { success: false, error: 'Activation request not found.' };

    const comp = this.state.companionProfiles.find((c) => c.id === req.companionId);
    if (!comp) return { success: false, error: 'Companion profile not found.' };

    req.status = 'rejected';
    req.rejectionReason = reason;
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = 'Chief Compliance Officer';

    comp.activationStatus = 'rejected';

    this.pushNotification({
      userId: comp.userId,
      title: 'Payment Verification Action Required',
      message: `Your account activation payment (UTR: ${req.utrNumber}) could not be verified: ${reason}. Please re-check and submit valid payment proof.`,
      type: 'payment',
    });

    this.state.adminAuditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminId: this.state.currentUserId || 'user_admin_1',
      adminName: 'Chief Compliance Officer',
      action: 'COMPANION_ACTIVATION_REJECTED',
      targetResource: 'companionProfile',
      targetId: comp.id,
      details: `Rejected payment activation for ${comp.fullName}. Reason: ${reason}.`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    });

    this.saveState();
    return { success: true };
  }

  // Update Companion 10+ Photos
  public updateCompanionPhotos(
    companionId: string,
    photos: string[]
  ): { success: boolean; error?: string } {
    const comp = this.state.companionProfiles.find((c) => c.id === companionId);
    if (!comp) return { success: false, error: 'Companion not found.' };

    if (photos.length > 12) {
      return { success: false, error: 'Maximum 12 photos allowed.' };
    }

    comp.approvedPhotos = photos;
    if (photos.length > 0) {
      const user = this.state.users.find((u) => u.id === comp.userId);
      if (user) {
        user.avatar = photos[0];
      }
    }

    this.saveState();
    return { success: true };
  }

  // Admin: Update Companion Joining Fee
  public updateCompanionJoiningFee(newFee: number): { success: boolean; error?: string } {
    if (newFee < 0 || newFee > 10000) {
      return { success: false, error: 'Fee must be between ₹0 and ₹10,000.' };
    }
    const oldFee = this.state.companionJoiningFee;
    this.state.companionJoiningFee = newFee;

    this.state.adminAuditLogs.unshift({
      id: `audit_${Date.now()}`,
      adminId: 'admin_1',
      adminName: 'Chief Compliance Officer',
      action: 'UPDATE_COMPANION_JOINING_FEE',
      targetResource: 'systemConfig',
      targetId: 'global',
      details: `Companion onboarding joining fee updated from ₹${oldFee} to ₹${newFee}.`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Admin Console)',
    });

    this.saveState();
    return { success: true };
  }

  // Complete Clear / Factory Reset
  public clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
    this.notify();
  }
}


export const store = new Store();
