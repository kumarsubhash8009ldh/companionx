// ==========================================
// COMPANIONX: COMPREHENSIVE DATA SCHEMAS
// ==========================================

export type UserRole = 'client' | 'companion' | 'admin';

export type UserStatus = 'active' | 'suspended' | 'deleted';

export interface User {
  id: string;
  email: string;
  phone: string;
  password?: string;
  role: UserRole;
  fullName: string;
  avatar: string;
  age: number;
  isAgeVerified: boolean;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export type LawfulServiceCategory =
  | 'dining'               // Dinner dates & fine dining companion
  | 'social_events'        // Weddings, galas, corporate mixers, parties
  | 'cultural_exploration' // Museums, art galleries, heritage city walks
  | 'intellectual_chats'   // Tech discussions, mentoring, book clubs, philosophy
  | 'travel_companion'     // Weekend road trips, sightseeing, holiday guide
  | 'fitness_outdoors';    // Tennis/badminton partner, hiking, morning jogs

export interface ServiceOffering {
  category: LawfulServiceCategory;
  title: string;
  description: string;
  hourlyRate: number; // in INR
  minHours: number;
}

export type VerificationStatus = 'unverified' | 'pending' | 'approved' | 'rejected';

export interface CompanionProfile {
  id: string;
  userId: string;
  fullName: string;
  tagline: string;
  bio: string;
  age: number;
  height: string;
  education: string;
  profession: string;
  languages: string[];
  city: string;
  state: string;
  serviceRadiusKm: number;
  approvedPhotos: string[];
  interests: string[];
  servicesOffered: ServiceOffering[];
  verificationStatus: VerificationStatus;
  rating: number;
  totalReviews: number;
  completedBookings: number;
  isPaused: boolean; // Pause profile
  featured: boolean; // Promoted profile campaign
  profileTier: 'free' | 'basic' | 'premium';
  isJoiningFeePaid: boolean;
  joiningFeePaymentId?: string;
  activationStatus?: 'pending_payment' | 'pending_approval' | 'approved' | 'rejected';
  activationRequestId?: string;
  lastSubmittedUtr?: string;
  unavailableDates: string[]; // YYYY-MM-DD
  workingHours: {
    start: string; // "10:00"
    end: string;   // "22:00"
  };
}

export interface ClientProfile {
  id: string;
  userId: string;
  fullName: string;
  preferredCity: string;
  interests: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  subscriptionTier: 'free' | 'premium';
  favorites: string[]; // companionProfile IDs
}

export type IdDocumentType = 'aadhaar' | 'passport' | 'driving_licence' | 'voter_id';

export interface VerificationRequest {
  id: string;
  companionId: string;
  userId: string;
  companionName: string;
  idType: IdDocumentType;
  idNumberMasked: string; // e.g. "XXXX-XXXX-8921" - never store/expose unmasked
  documentFrontUrl: string;
  documentBackUrl: string;
  selfieWithIdUrl: string;
  status: VerificationStatus;
  reviewerNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  targetRole: 'client' | 'companion';
  priceMonthly: number; // in INR
  validityDays?: number; // e.g. 30 days
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  targetRole: 'client' | 'companion';
  amount: number;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
  paymentId: string;
  createdAt: string;
}

export type BookingStatus =
  | 'draft'
  | 'requested'
  | 'accepted'
  | 'confirmed'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | 'refund_pending'
  | 'refunded'
  | 'disputed';

export interface PricingBreakdown {
  hourlyRate: number;
  durationHours: number;
  baseAmount: number;
  platformCommissionRate: number; // e.g. 0.15 (15%)
  platformCommissionAmount: number;
  companionPayoutAmount: number;
  gstRate: number; // e.g. 0.18 (18%) on platform fee
  gstAmount: number;
  totalAmount: number; // what client pays
}

export interface Booking {
  id: string;
  bookingCode: string; // e.g. "CX-8834"
  clientId: string;
  clientName: string;
  companionId: string;
  companionName: string;
  serviceCategory: LawfulServiceCategory;
  serviceTitle: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationHours: number;
  meetingLocation: {
    venueName: string;
    address: string;
    city: string;
    landmark?: string;
    isVirtual?: boolean;
  };
  clientNotes: string;
  status: BookingStatus;
  pricing: PricingBreakdown;
  paymentId?: string;
  clientCancelledReason?: string;
  companionRejectReason?: string;
  disputeReason?: string;
  disputeResolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingEvent {
  id: string;
  bookingId: string;
  eventType: string; // 'REQUESTED', 'ACCEPTED', 'CONFIRMED', 'CANCELLED', etc.
  performedBy: string;
  userRole: UserRole | 'system';
  notes: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  companionId: string;
  companionName: string;
  lastMessageText: string;
  lastMessageTimestamp: string;
  isLocked: boolean; // only unlocked when booking is accepted/confirmed
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  companionId: string;
  rating: number; // 1 to 5
  comment: string;
  isModerated: boolean;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  bookingId?: string;
  subscriptionId?: string;
  userId: string;
  amount: number;
  currency: string; // 'INR'
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet';
  gatewayTransactionId: string;
  idempotencyKey: string;
  signatureVerified: boolean;
  createdAt: string;
}

export type UpiAppType = 'all' | 'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'other';

export interface PaymentQrConfig {
  upiId: string;
  payeeName: string;
  merchantCode?: string;
  defaultQrImageUrl?: string;
  gpayQrImageUrl?: string;
  phonepeQrImageUrl?: string;
  paytmQrImageUrl?: string;
  instructions?: string;
  updatedAt?: string;
}

export interface AccountActivationRequest {
  id: string;
  companionId: string;
  userId: string;
  companionName: string;
  companionPhone: string;
  companionEmail: string;
  amount: number;
  upiApp: UpiAppType;
  utrNumber: string;
  screenshotUrl?: string;
  senderUpiId?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface CommissionRecord {
  id: string;
  bookingId: string;
  companionId: string;
  bookingAmount: number;
  commissionRate: number;
  commissionAmount: number;
  gstAmount: number;
  netPayoutAmount: number;
  status: 'accrued' | 'paid_out' | 'refund_reversed';
  createdAt: string;
}

export interface PayoutRecord {
  id: string;
  companionId: string;
  companionName: string;
  amount: number;
  bankAccountMasked: string;
  upiIdMasked: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  utrReference?: string;
  requestedAt: string;
  processedAt?: string;
}

export interface RefundRecord {
  id: string;
  bookingId: string;
  paymentId: string;
  clientId: string;
  amount: number;
  reason: string;
  status: 'initiated' | 'completed' | 'failed';
  processedAt: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  subject: string;
  category: 'booking' | 'payment' | 'safety' | 'verification' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  messages: {
    sender: string;
    role: 'user' | 'admin';
    text: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface SafetyReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  reportedUserId: string;
  reportedUserName: string;
  bookingId?: string;
  reasonCategory:
    | 'unlawful_solicitation'
    | 'harassment'
    | 'no_show'
    | 'impersonation'
    | 'misleading_profile'
    | 'other';
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  adminActionTaken?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'verification' | 'payment' | 'safety' | 'system';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetResource: string;
  targetId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface CouponPromotion {
  id: string;
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  validTill: string;
  target: 'all' | 'client' | 'companion';
  usageCount: number;
  isActive: boolean;
}
