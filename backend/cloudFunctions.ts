// ==========================================
// COMPANIONX: SERVER-SIDE FIREBASE CLOUD FUNCTIONS
// ==========================================

import * as crypto from 'crypto';

/**
 * Mock Interfaces for Cloud Functions runtime
 */
interface Request {
  headers: Record<string, string>;
  body: any;
  rawBody?: Buffer;
}

interface Response {
  status: (code: number) => Response;
  json: (data: any) => void;
  send: (msg: string) => void;
}

/**
 * 1. Webhook Signature Verification & Idempotent Payment Processing
 * Verifies Razorpay / Cashfree HMAC-SHA256 signature before crediting payment
 */
export async function handlePaymentWebhook(req: Request, res: Response, db: any) {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    if (!signature || !secret) {
      return res.status(400).send('Missing signature or secret');
    }

    // Verify HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.rawBody || JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid webhook signature attempt');
      return res.status(401).send('Signature mismatch');
    }

    const event = req.body;
    const eventId = event.event_id || req.headers['x-razorpay-event-id'];

    // Idempotency check in Firestore
    const eventRef = db.collection('processedWebhookEvents').doc(eventId);
    const existing = await eventRef.get();
    if (existing.exists) {
      return res.status(200).json({ status: 'already_processed' });
    }

    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const bookingId = paymentEntity.notes?.bookingId;

      if (bookingId) {
        // Atomic transaction to mark booking confirmed and accrue commission
        await db.runTransaction(async (transaction: any) => {
          const bookingRef = db.collection('bookings').doc(bookingId);
          const bookingDoc = await transaction.get(bookingRef);

          if (!bookingDoc.exists) {
            throw new Error('Booking not found');
          }

          const bookingData = bookingDoc.data();

          // Update booking status
          transaction.update(bookingRef, {
            status: 'confirmed',
            paymentId: paymentEntity.id,
            updatedAt: new Date().toISOString(),
          });

          // Accrue commission record
          const commissionRef = db.collection('commissions').doc(`comm_${Date.now()}`);
          transaction.set(commissionRef, {
            bookingId,
            companionId: bookingData.companionId,
            bookingAmount: bookingData.pricing.baseAmount,
            commissionRate: bookingData.pricing.platformCommissionRate,
            commissionAmount: bookingData.pricing.platformCommissionAmount,
            gstAmount: bookingData.pricing.gstAmount,
            netPayoutAmount: bookingData.pricing.companionPayoutAmount,
            status: 'accrued',
            createdAt: new Date().toISOString(),
          });

          // Record processed webhook event
          transaction.set(eventRef, {
            eventId,
            processedAt: new Date().toISOString(),
          });
        });
      }
    }

    return res.status(200).json({ status: 'success' });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * 2. Server-side Transactional Double-Booking Prevention
 */
export async function createBookingWithConflictCheck(
  clientUid: string,
  bookingPayload: any,
  db: any
) {
  return await db.runTransaction(async (transaction: any) => {
    const { companionId, date, startTime, durationHours } = bookingPayload;

    // Query companion's existing bookings for the same date
    const bookingsRef = db.collection('bookings');
    const q = bookingsRef
      .where('companionId', '==', companionId)
      .where('date', '==', date)
      .where('status', 'in', ['requested', 'accepted', 'confirmed']);

    const querySnapshot = await transaction.get(q);

    const [startH, startM] = startTime.split(':').map(Number);
    const reqStartMins = startH * 60 + (startM || 0);
    const reqEndMins = reqStartMins + durationHours * 60;

    for (const doc of querySnapshot.docs) {
      const existing = doc.data();
      const [eH, eM] = existing.startTime.split(':').map(Number);
      const exStartMins = eH * 60 + (eM || 0);
      const exEndMins = exStartMins + existing.durationHours * 60;

      // Overlap condition
      if (reqStartMins < exEndMins && reqEndMins > exStartMins) {
        throw new Error(
          `Conflict: The companion already has an engagement between ${existing.startTime} and ${Math.floor(exEndMins / 60)}:${exEndMins % 60}.`
        );
      }
    }

    // No conflict: Create booking
    const newBookingRef = bookingsRef.doc();
    const newBooking = {
      ...bookingPayload,
      clientId: clientUid,
      status: 'requested',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    transaction.set(newBookingRef, newBooking);
    return { bookingId: newBookingRef.id, ...newBooking };
  });
}

/**
 * 3. Video Call Token Generator (Agora RTC Token)
 */
export function generateAgoraRtcToken(channelName: string, uid: number) {
  // In production: import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
  // const token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, RtcRole.PUBLISHER, privilegeExpireTime);
  return {
    channelName,
    uid,
    token: `agora_rtc_${channelName}_${Date.now()}_mock_token`,
    expiresIn: 3600, // 1 hour
  };
}
