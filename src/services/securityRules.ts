// ==========================================
// COMPANIONX: SECURITY & PRIVACY ENFORCEMENT
// ==========================================

import { UserRole } from '../types';

export interface SecurityCheckResult {
  authorized: boolean;
  reason?: string;
}

export class SecurityGuard {
  /**
   * Enforces 18+ requirement on all actions
   */
  public static verifyAgeEligibility(age: number): SecurityCheckResult {
    if (!age || age < 18) {
      return {
        authorized: false,
        reason: 'Underage access strictly forbidden. You must be at least 18 years old under Indian law.',
      };
    }
    return { authorized: true };
  }

  /**
   * RBAC check for Admin functions
   */
  public static requireAdminRole(role: UserRole): SecurityCheckResult {
    if (role !== 'admin') {
      return {
        authorized: false,
        reason: 'Restricted administrative capability. Least-privilege access violation.',
      };
    }
    return { authorized: true };
  }

  /**
   * Privacy masking: Government IDs must never be exposed publicly.
   */
  public static maskGovernmentId(idNumber: string): string {
    if (!idNumber) return 'XXXX-XXXX-XXXX';
    const cleaned = idNumber.replace(/\s+/g, '');
    const last4 = cleaned.slice(-4);
    return `XXXX-XXXX-${last4}`;
  }

  /**
   * Privacy masking: Phone numbers should only be revealed when mutually agreed or in admin audit.
   */
  public static maskPhoneNumber(phone: string): string {
    if (!phone) return '+91 XXXXX XXXXX';
    const parts = phone.trim().split(' ');
    if (parts.length > 1) {
      return `${parts[0]} XXXXX ${parts[parts.length - 1].slice(-3)}`;
    }
    return '+91 XXXXX ' + phone.slice(-4);
  }

  /**
   * Anti-solicitation text filter to catch unlawful sexual solicitation keywords
   */
  public static checkMessageForCompliance(text: string): { compliant: boolean; flaggedWord?: string } {
    const prohibitedKeywords = [
      'escort',
      'prostitution',
      'sexual',
      'sex',
      'intimate service',
      'happy ending',
      'massage with extra',
      'full service',
      'call girl',
      'gigolo sex',
      'hookup',
      'hotel room only',
      'erotic',
      'nude',
      'paid sex',
    ];

    const lower = text.toLowerCase();
    for (const keyword of prohibitedKeywords) {
      if (lower.includes(keyword)) {
        return { compliant: false, flaggedWord: keyword };
      }
    }
    return { compliant: true };
  }
}
