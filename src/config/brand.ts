// ==========================================
// COMPANIO: CONFIGURABLE BRAND & POLICY
// ==========================================

import { LawfulServiceCategory, MembershipPlan } from '../types';

export const BRAND_CONFIG = {
  appName: 'Companio',
  tagline: 'Male Escorts & Curated Companionship Service',
  shortDescription: 'India’s premier platform connecting verified adult gentlemen with discerning clients for premium companionship.',
  supportEmail: 'concierge@companio.in',
  complianceEmail: 'legal-safety@companio.in',
  customerCareNumber: '+91 70090 80906',
  customerCareWhatsApp: '7009080906',
  whatsAppSupportUrl: 'https://wa.me/917009080906?text=Hello%20Companio%20Customer%20Care%2C%20I%20need%20assistance',
  emergencyDeskNumber: '+91 70090 80906',
  currency: 'INR',
  currencySymbol: '₹',

  // Compliance & Policy Highlights
  strictlyNonSexualNotice: 'Companio strictly prohibits prostitution, paid sexual services, soliciting sexual acts, coercion, exploitation, or human trafficking. Any violation results in immediate account termination, forfeiture of earnings, and escalation to law enforcement authorities under Bharatiya Nyaya Sanhita (BNS) and applicable laws.',
  ageGateText: 'You must be at least 18 years of age to access, register, or use Companio. Identity verification is required for all active companions and verified clients.',

  // Emergency Hotlines for India
  emergencyHotlines: [
    { name: 'National Emergency Number', number: '112', description: 'Immediate Police / Medical / Fire response across India' },
    { name: 'Women Helpline (Pan-India)', number: '1091', description: '24/7 dedicated helpline for women in distress' },
    { name: 'Women Distress Helpline (NCW)', number: '7827-170-170', description: 'National Commission for Women 24/7 support' },
    { name: 'Cyber Crime Helpline', number: '1930', description: 'Report cyber harassment or financial fraud' },
  ],

  // Platform Commission Settings (Configurable by Admin)
  defaultCommissionRate: 0.30, // 30% platform booking commission
  minCommissionRate: 0.05,     // 5% minimum
  maxCommissionRate: 0.50,     // 50% maximum
  gstRateOnCommission: 0.18,   // 18% GST on platform service fees

  // Profile promotion campaign
  profilePromotionPrice: 99, // ₹99 per 7-day boost

  // One-time Companion Onboarding & Background Verification Joining Fee
  defaultCompanionJoiningFee: 999, // ₹999 one-time verification fee
};

export const CITIES_IN_INDIA = [
  'All Cities',
  // Tier-1 Metros
  'Mumbai',
  'Delhi NCR (Delhi, Gurgaon, Noida, Faridabad)',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',

  // Punjab & Tricity
  'Chandigarh (Tricity)',
  'Mohali (SAS Nagar)',
  'Zirakpur & Dera Bassi',
  'Ludhiana',
  'Amritsar',
  'Jalandhar',
  'Patiala',
  'Bathinda',
  'Pathankot',
  'Hoshiarpur',
  'Batala',
  'Moga',
  'Phagwara',
  'Khanna',
  'Firozpur',
  'Abohar',
  'Kapurthala',
  'Barnala',
  'Sangrur',

  // Himachal Pradesh
  'Shimla',
  'Manali',
  'Dharamshala',
  'McLeod Ganj',
  'Kullu',
  'Kasauli',
  'Solan',
  'Dalhousie',
  'Palampur',
  'Mandi',
  'Baddi',
  'Bilaspur (HP)',
  'Hamirpur (HP)',
  'Chamba',
  'Una',
  'Nahan',

  // Jammu & Kashmir
  'Srinagar',
  'Jammu',
  'Katra (Vaishno Devi)',
  'Gulmarg',
  'Pahalgam',
  'Sonamarg',
  'Udhampur',
  'Anantnag',
  'Baramulla',
  'Sopore',
  'Kathua',
  'Rajouri',
  'Poonch',

  // Uttarakhand
  'Dehradun',
  'Rishikesh',
  'Haridwar',
  'Mussoorie',
  'Nainital',
  'Jim Corbett (Ramnagar)',
  'Haldwani',
  'Roorkee',
  'Rudrapur',
  'Kashipur',
  'Almora',
  'Ranikhet',
  'Pithoragarh',
  'Kotdwar',
  'Vikas Nagar',

  // Key Western & Central Cities
  'Surat',
  'Vadodara',
  'Nashik',
  'Nagpur',
  'Indore',
  'Bhopal',
  'Rajkot',
  'Goa (North & South)',
  'Aurangabad',
  'Jabalpur',
  'Gwalior',
  'Raipur',

  // Other Northern Hubs
  'Jaipur',
  'Jodhpur',
  'Udaipur',
  'Jaisalmer',
  'Kota',
  'Lucknow',
  'Kanpur',
  'Agra',
  'Varanasi',
  'Prayagraj (Allahabad)',
  'Bareilly',
  'Meerut',
  'Aligarh',
  'Moradabad',

  // Southern Hubs
  'Kochi (Cochin)',
  'Thiruvananthapuram',
  'Coimbatore',
  'Mysore',
  'Visakhapatnam',
  'Vijayawada',
  'Madurai',
  'Mangalore',
  'Pondicherry',
  'Tiruchirappalli',
  'Salem',
  'Warangal',
  'Hubballi-Dharwad',

  // Eastern & North-Eastern Hubs
  'Patna',
  'Ranchi',
  'Bhubaneswar',
  'Guwahati',
  'Shillong',
  'Gangtok',
  'Dhanbad',
];


export const LAWFUL_SERVICES: {
  category: LawfulServiceCategory;
  title: string;
  badge: string;
  description: string;
  examples: string[];
}[] = [
  {
    category: 'dining',
    title: 'Gourmet Dining & Social Outings',
    badge: 'Fine Dining',
    description: 'A charming, articulate dining companion for high-end restaurants, wine tastings, or casual coffee catch-ups.',
    examples: ['Michelin/luxury dinners', 'Cocktail lounge evenings', 'Chef tasting menus', 'Sunday brunch accompaniment'],
  },
  {
    category: 'social_events',
    title: 'Events, Galas & Wedding Dates',
    badge: 'Galas & Weddings',
    description: 'Polished, impeccably dressed plus-one for weddings, art galas, corporate annual dinners, and family functions.',
    examples: ['Destination wedding plus-one', 'Corporate black-tie banquets', 'Charity fundraisers', 'Private celebratory dinners'],
  },
  {
    category: 'cultural_exploration',
    title: 'Heritage, Art & City Tours',
    badge: 'Culture & Arts',
    description: 'Knowledgeable guide and conversational partner for museums, art biennials, architecture walks, and theatre.',
    examples: ['Art gallery openings', 'Live symphony & theatre', 'Historical heritage walks', 'Local cuisine exploration'],
  },
  {
    category: 'intellectual_chats',
    title: 'Intellectual & Tech Conversations',
    badge: 'Virtual & In-Person',
    description: 'Engaging, thoughtful discussions on tech startups, literature, philosophy, cinema, finance, or personal growth.',
    examples: ['Coffee shop mentoring/chats', 'Book club discussion partner', 'Startup brainstorming sessions', 'Deep dive conversations'],
  },
  {
    category: 'travel_companion',
    title: 'Travel & Weekend Getaways',
    badge: 'Concierge Travel',
    description: 'Dependable travel companion for business trip leisure hours, weekend hill-station road trips, and resort retreats.',
    examples: ['Weekend road trips (e.g. Mumbai to Lonavala, Delhi to Jaipur)', 'Flight companion', 'Beach resort outings', 'Trekking guide'],
  },
  {
    category: 'fitness_outdoors',
    title: 'Fitness & Outdoor Sports',
    badge: 'Active Lifestyle',
    description: 'Active companion for morning runs, tennis/pickleball matches, golf rounds, gym training sessions, or scenic hikes.',
    examples: ['Pickleball / Tennis match partner', 'Morning coastal jogs', 'Golf club companion', 'Hiking & nature trails'],
  },
];

export const INITIAL_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'client_free',
    name: 'Client Free',
    targetRole: 'client',
    priceMonthly: 0,
    features: [
      'Basic profile browsing',
      'Standard booking request queue',
      'Pay-per-booking platform convenience fee',
      'In-app messaging after booking acceptance',
      'Standard support (within 24 hours)',
    ],
    isActive: true,
  },
  {
    id: 'client_premium',
    name: 'Client Elite Circle',
    targetRole: 'client',
    priceMonthly: 199,
    validityDays: 30,
    isPopular: true,
    features: [
      '0% platform convenience fee on bookings',
      'Priority booking requests (companion alerted immediately)',
      'Verified Client Shield badge on profile',
      'Concierge WhatsApp & phone support line',
      'Early access to top-rated & celebrity-tier companions',
      'Complimentary reschedule protection once a month',
    ],
    isActive: true,
  },
  {
    id: 'comp_basic',
    name: 'Companion Basic',
    targetRole: 'companion',
    priceMonthly: 499,
    validityDays: 30,
    features: [
      'Verified companion profile listing',
      'Receive up to 15 booking inquiries monthly',
      'Standard calendar slot management',
      'Weekly automated payouts to UPI/Bank',
      'Standard 30% platform commission applies',
    ],
    isActive: true,
  },
  {
    id: 'comp_premium',
    name: 'Companion Pro Tier',
    targetRole: 'companion',
    priceMonthly: 999,
    validityDays: 30,
    isPopular: true,
    features: [
      '30-Day Pro Membership Access',
      'Unlimited booking requests & client interactions',
      'Gold "Top Companion" badge & top search placement',
      'Reduced platform commission (save 5% on every booking)',
      'Instant same-day payout clearance',
      'Dedicated relationship manager for dispute handling',
      'Free monthly ₹99 profile spotlight boost included',
    ],
    isActive: true,
  },
];
