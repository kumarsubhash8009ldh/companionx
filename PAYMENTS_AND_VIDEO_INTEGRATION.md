# CompanionX - Payment Gateway & Video SDK Integration

This document outlines the exact technical and regulatory protocols for integrating payments and real-time audio/video calls for the Indian market.

---

## 1. Payment Gateway Setup (India)

### A. Merchant Onboarding & Underwriting
When applying for merchant accounts with providers like **Razorpay**, **Cashfree**, or **PayU Payments**:
1. **Merchant Category Code (MCC):** Register under **7299 (Miscellaneous Personal Services)** or **7389 (Business Services / Concierge Facilitation)**.
2. **Business Model Disclosure:** Provide the gateway underwriter with your platform Terms of Service affirming that **CompanionX strictly facilitates lawful social, cultural, and professional companionship** (weddings, dining, tour guides, intellectual conversations) and strictly prohibits prostitution, sexual solicitation, or adult entertainment.
3. **Escrow Structure:** Payment is collected into a nodal/escrow account upon booking request acceptance and disbursed to the companion only after the engagement is successfully completed without disputes.

### B. Standard Payment Lifecycle
```
Client Initiates Booking
      │
      ▼
Server creates Order (Razorpay API: /v1/orders)
      │
      ▼
Client completes UPI / Card / NetBanking authentication
      │
      ▼
Gateway triggers Webhook: `payment.captured`
      │
      ▼
CompanionX Cloud Function verifies HMAC-SHA256 signature
      │
      ▼
Idempotency Check -> Booking Confirmed -> Commission (15%) Accrued
```

### C. Webhook Signature Verification Code Snippet (Node.js)
```typescript
import * as crypto from 'crypto';

export function verifyRazorpaySignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  return generatedSignature === signature;
}
```

### D. Automated Payouts to Male Companions
For disbursing earnings to verified companions:
- Use **RazorpayX** or **Cashfree Payouts API**.
- Supported payout methods in India:
  - **IMPS / NEFT** (Account Number + IFSC)
  - **UPI VPA** (`username@okhdfcbank`, `username@paytm`)
- Always store bank account details and UPI IDs with partial masking in logs (`XXXXXX4492`).

---

## 2. Real-Time Audio/Video Calling Integration

### A. Recommended SDKs for India
1. **Agora.io** (RTC Web SDK NG) - Excellent network adaptation across 4G/5G Indian mobile carriers (Jio, Airtel).
2. **100ms.live** (Indian headquartered RTC platform) - Native UI components, low latency media servers in Mumbai (`in-west-1`).

### B. Security & Token Architecture
Video rooms are **never public**; both participants require a short-lived cryptographic RTC token issued by CompanionX backend only if a booking is in `confirmed` status.

#### Token Issuance Flow:
1. Client or Companion taps **Video Call** in the app.
2. Frontend calls Cloud Function: `POST /api/video/getToken` with `bookingId`.
3. Server validates:
   - Requester UID matches either `booking.clientId` or `booking.companionId`.
   - Current time is within scheduled booking window (±15 mins).
   - Booking status is `confirmed`.
4. Server generates Agora RTC token valid for 3600 seconds.
5. Frontend joins channel:
   ```javascript
   import AgoraRTC from "agora-rtc-sdk-ng";

   const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
   await client.join(APP_ID, channelName, token, uid);
   ```

### C. Privacy & Regulatory Safeguards
- Under Section 69 of the Information Technology Act and DPDP Act 2023, personal audio/video calls must **not be recorded on platform servers** without explicit, informed mutual consent of both adults.
- All media streams are encrypted in transit via **DTLS-SRTP**.
