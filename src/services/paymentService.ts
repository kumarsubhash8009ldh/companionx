// ==========================================
// COMPANIONX: PAYMENT GATEWAY & INVOICING
// ==========================================

import { BRAND_CONFIG } from '../config/brand';
import { Booking } from '../types';

export interface PaymentInitiationResult {
  orderId: string;
  amountInPaise: number;
  currency: string;
  keyId: string;
  clientSecretMock: string;
  idempotencyKey: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  bookingCode: string;
  clientName: string;
  companionName: string;
  serviceTitle: string;
  meetingDate: string;
  meetingDuration: string;
  meetingLocation: string;
  baseAmount: number;
  platformCommissionAmount: number;
  gstAmount: number;
  totalPaid: number;
  paymentMethod: string;
  gatewayTxId: string;
  legalDisclaimer: string;
}

export class PaymentGatewayService {
  /**
   * Initializes a payment order (e.g. Razorpay / Cashfree Standard Workflow for India)
   */
  public static initiateOrder(booking: Booking): PaymentInitiationResult {
    const orderId = `order_${Math.random().toString(36).substring(2, 10)}`;
    const idempotencyKey = `idemp_${booking.id}_${Date.now()}`;

    return {
      orderId,
      amountInPaise: Math.round(booking.pricing.totalAmount * 100),
      currency: 'INR',
      keyId: 'rzp_live_companionx_mock',
      clientSecretMock: `secret_${Math.random().toString(36).substring(2, 12)}`,
      idempotencyKey,
    };
  }

  /**
   * Simulates Webhook HMAC SHA-256 signature verification for Indian payment providers
   */
  public static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    if (!payload || !signature || !secret) return false;
    // In production: crypto.createHmac('sha256', secret).update(payload).digest('hex') === signature
    return signature.startsWith('sig_') || signature.length > 10;
  }

  /**
   * Generates a tax invoice complying with Indian GST rules for platform facilitation fees
   */
  public static generateInvoice(booking: Booking, paymentTxId: string): InvoiceData {
    return {
      invoiceNumber: `INV-${new Date().getFullYear()}-${booking.bookingCode.replace('CX-', '')}`,
      invoiceDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      bookingCode: booking.bookingCode,
      clientName: booking.clientName,
      companionName: booking.companionName,
      serviceTitle: booking.serviceTitle,
      meetingDate: `${booking.date} at ${booking.startTime}`,
      meetingDuration: `${booking.durationHours} hours`,
      meetingLocation: `${booking.meetingLocation.venueName}, ${booking.meetingLocation.city}`,
      baseAmount: booking.pricing.baseAmount,
      platformCommissionAmount: booking.pricing.platformCommissionAmount,
      gstAmount: booking.pricing.gstAmount,
      totalPaid: booking.pricing.totalAmount,
      paymentMethod: 'UPI / NetBanking (Verified)',
      gatewayTxId: paymentTxId || 'rzp_live_sample_tx',
      legalDisclaimer:
        'This invoice represents facilitation fees and professional non-sexual companionship compensation under Indian Contract Act, 1872. CompanionX strictly prohibits unlawful sexual solicitation or trafficking.',
    };
  }
}
