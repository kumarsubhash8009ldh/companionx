# CompanionX - Comprehensive QA Testing Checklist

Use this checklist to verify all flows across the Client Application, Companion Application, and Admin Dashboard.

---

## 1. Authentication & Role-Based Access Control (RBAC)
- [ ] **Role Switcher:** Tap between `Client View`, `Companion Portal`, and `Admin Control` in the header; verify active view, permissions, and persona information change immediately.
- [ ] **Protected Admin View:** Switch to client or companion persona and attempt to access admin routes; verify permission block is rendered.
- [ ] **Data Reset:** Tap the refresh icon in the header to re-seed clean demo records anytime.

---

## 2. Age Gate & Compliance Affirmations
- [ ] **Mandatory 18+ Gate:** Clear local storage or launch new incognito session; verify the Age & Lawful Purpose Gate modal prevents access.
- [ ] **Uncheck Certifications:** Ensure the "Confirm Eligibility & Enter Platform" button remains disabled until all 3 checkboxes (18+ Age, Lawful Non-Sexual purpose, Terms of Service) are checked.

---

## 3. Client Experience & Discovery
- [ ] **City Filtering:** Select "Mumbai", "Delhi NCR", "Bengaluru"; verify companion cards filter accordingly.
- [ ] **Service Category Filter:** Filter by "Gourmet Dining", "Galas & Weddings", "Heritage Tours"; check card listings.
- [ ] **Search Bar:** Type companion names ("Aryan", "Kabir") or interests ("Tennis", "Art"); verify instant search results.
- [ ] **Companion Detail Modal:** Tap "Profile"; verify photo showcase, verified UIDAI badge, biography, tariffs, and client reviews display correctly.

---

## 4. Double-Booking Prevention & Booking Lifecycle
- [ ] **Double-Booking Conflict Check:**
  - Create a booking with Aryan Malhotra for `2026-10-18` at `19:30` (duration 3 hours).
  - Attempt to book Aryan again on `2026-10-18` between `19:30` and `22:30`.
  - Verify server-side conflict message: *"The companion is already booked on 2026-10-18 between 19:30 and 22:30. Please choose a different slot."*
- [ ] **Companion Acceptance Flow:**
  - Switch to `Companion Portal` -> `Bookings & Requests`.
  - See the new booking in "Pending Booking Inquiries".
  - Tap **Accept Booking**; verify in-app chat unlocks and client is notified.
- [ ] **Payment & Escrow Confirmation:**
  - Switch back to `Client View` -> `My Bookings`.
  - Tap **Pay & Confirm (₹Total)**; verify payment transaction is created and status updates to "Confirmed & Escrowed".
- [ ] **Mark Completed:**
  - Switch to Companion Portal and tap **Mark Completed**; verify companion completed booking count increments and earnings balance updates.

---

## 5. In-App Messaging & Anti-Solicitation Filter
- [ ] **Unlocked Messaging:** Open in-app chat for a confirmed booking; send a normal message (e.g., *"Table is reserved under my name"*); verify companion simulated reply arrives after 1.5 seconds.
- [ ] **Anti-Solicitation Filter:** Type a prohibited keyword (e.g., *"escort service"* or *"paid sex"*); verify the message is blocked with a security warning.

---

## 6. Financials, Commission & Refunds
- [ ] **Transparent Fee Breakdown:** Verify booking fee breakdown: Base + 15% Platform Commission + 18% GST on platform fee = Total Amount.
- [ ] **Admin Commission Slider:** Go to `Admin Panel` -> `Pricing & Commissions`; move slider to 18% and tap Apply; verify new bookings use the updated commission rate.
- [ ] **Cancellation & Refund Policy:**
  - Cancel a booking scheduled >24 hours prior; verify 100% full refund is issued.
  - Check `Admin Panel` -> `Bookings & Refunds` to verify refund record and transaction status.
- [ ] **Companion Payout Request:**
  - Go to `Companion Portal` -> `Earnings & Payouts`.
  - Check available balance; request payout to UPI (`aryan***@okhdfcbank`); verify payout record is generated with UTR reference.

---

## 7. Safety, Verification & SOS
- [ ] **Emergency SOS:** Tap **SOS Helpdesk** in the header; verify Indian emergency numbers (112, 1091, 1930) and tap **Trigger Platform 24/7 SOS Alert**.
- [ ] **Companion KYC Verification:**
  - Go to `Companion Portal` -> **Verify Government ID**.
  - Enter last 4 digits (`8921`) and submit; verify request appears in `Admin Panel` -> `KYC Queue`.
  - From Admin Panel, tap **Approve & Activate Companion**; verify companion receives the verified badge.
- [ ] **User Suspension:** File a report against a user from Client View; go to `Admin Panel` -> `Safety & Reports` and tap **Permanently Suspend & Ban**.

---

## 8. Mobile Responsiveness
- [ ] Open browser DevTools in Mobile view (iPhone 14 / Pixel 7); verify sticky header, mobile drawer, touch targets, and modal dialogs are fully responsive and scroll smoothly.
