# CompanionX - Security, Safety & Legal Compliance Architecture

CompanionX is architected from the ground up for lawful, dignified, and safe professional male companionship for adults in India. This document details the security controls, data privacy policies, and regulatory compliances enforced across the platform.

---

## 1. Indian Legal Compliance Framework

### A. Non-Sexual Companionship & Anti-Trafficking Policy
- **Immoral Traffic (Prevention) Act, 1956 (ITPA):** Prohibits soliciting for prostitution, trafficking, running brothels, and living on the earnings of sex work. CompanionX strictly forbids and actively filters any form of sexual service, intimate exchange, or prostitution.
- **Bharatiya Nyaya Sanhita, 2023 (BNS):** All contracts and interactions facilitate lawful social, cultural, dining, and conversational accompaniment under the **Indian Contract Act, 1872**.
- **Enforcement Mechanisms:**
  - Automated keyword blocking across all in-app messaging.
  - Mandatory mutual Code of Conduct agreement before booking submission.
  - Immediate platform ban and referral of offenders to cybercrime and local police units.

### B. Digital Personal Data Protection Act, 2023 (DPDP Act)
- **Data Fiduciary Responsibilities:**
  - **Purpose Limitation:** Identity documents are collected solely for authenticating companion legal age and identity.
  - **Zero Public Exposure:** Government IDs (Aadhaar, Passport, Driving Licence, Voter ID), private home addresses, and personal phone numbers are **never published on public profiles**.
  - **Storage & Encryption:** ID documents are encrypted in transit (TLS 1.3) and at rest (AES-256) inside access-restricted Firebase Storage buckets.
  - **Right to Erasure:** Users can request permanent deletion of their profile and uploaded assets through the compliance portal.

### C. Information Technology (Intermediary Guidelines) Rules, 2021
- **Grievance Officer:** CompanionX appoints a dedicated Resident Grievance Officer in India reachable at `compliance@companionx.in`.
- **24-Hour Resolution Window:** All reported harassment, impersonation, or unlawful solicitation incidents are audited and resolved within 24 hours.

---

## 2. Safety Sentinel & Emergency Architecture

### A. The 24/7 Safety SOS Dispatch
- Accessible from every view in the application.
- One-tap access to official national helplines:
  - **112**: National Emergency Helpline (Police, Ambulance, Fire)
  - **1091**: Dedicated 24/7 Women in Distress Helpline
  - **1930**: Cyber Crime Fraud Reporting
- Tapping **Platform SOS** broadcasts an emergency distress beacon to the CompanionX safety response team, capturing real-time booking coordinates and venue details.

### B. The Public Venue Golden Rule
- First-time companion bookings must strictly take place in recognized public establishments (hotels, verified restaurants, cafes, art galleries, golf clubs).
- Private residences are disabled as meeting venue options for unverified initial bookings.

---

## 3. Financial & Escrow Integrity

- **Configurable Commission:** Platform retains between 10% and 20% facilitation fee (configured by Admin), with transparent GST (18%) deduction.
- **Zero Card Storage:** No raw credit/debit card numbers or CVVs are collected or stored on CompanionX databases, complying with RBI tokenization directives.
- **Automated Refund Policy:**
  - Cancellation >24 hours prior to booking: **100% Full Refund**.
  - Cancellation 12 to 24 hours prior: **50% Partial Refund**.
  - Cancellation <12 hours: Non-refundable (companion held time slot).
