// Currency configuration per country
export const currencyConfig: Record<string, { symbol: string; multiplier: number; code: string; name: string }> = {
  BD: { symbol: '৳', multiplier: 1, code: 'BDT', name: 'Bangladeshi Taka' },
  US: { symbol: '$', multiplier: 0.0091, code: 'USD', name: 'US Dollar' },
  GB: { symbol: '£', multiplier: 0.0072, code: 'GBP', name: 'British Pound' },
  IN: { symbol: '₹', multiplier: 0.76, code: 'INR', name: 'Indian Rupee' },
  default: { symbol: '$', multiplier: 0.0091, code: 'USD', name: 'US Dollar' },
};

// Payment methods per country
export const paymentMethods: Record<string, string[]> = {
  BD: ['sslcommerz', 'bkash', 'nagad'],
  US: ['stripe', 'paypal'],
  GB: ['stripe', 'paypal', 'wise'],
  IN: ['stripe'],
  default: ['stripe', 'paypal'],
};

// Locale mapping by country code
export const localeMap: Record<string, string> = {
  BD: 'bn',
  IN: 'en-IN',
  GB: 'en',
  US: 'en',
  CA: 'en',
  AU: 'en',
};

// Country info
export const countries = [
  { code: 'BD', name: 'বাংলাদেশ', nameEn: 'Bangladesh', flag: '🇧🇩', currency: 'BDT' },
  { code: 'US', name: 'United States', nameEn: 'United States', flag: '🇺🇸', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', nameEn: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
  { code: 'IN', name: 'ভারত', nameEn: 'India', flag: '🇮🇳', currency: 'INR' },
  { code: 'CA', name: 'Canada', nameEn: 'Canada', flag: '🇨🇦', currency: 'USD' },
  { code: 'AU', name: 'Australia', nameEn: 'Australia', flag: '🇦🇺', currency: 'USD' },
] as const;

// Format price in local currency
export function formatPrice(amountBdt: number, countryCode: string): string {
  const config = currencyConfig[countryCode] || currencyConfig.default;
  const localAmount = amountBdt * config.multiplier;
  
  if (countryCode === 'BD') {
    return `${config.symbol}${localAmount.toLocaleString('bn-BD')}`;
  }
  
  return `${config.symbol}${localAmount.toFixed(2)}`;
}

// Level configuration
export const levels = [
  { name: 'Bronze', key: 'bronze', minOrders: 0, discount: 0, color: '#CD7F32', bgClass: 'bg-amber-900/20 text-amber-400' },
  { name: 'Silver', key: 'silver', minOrders: 10, discount: 5, color: '#94A3B8', bgClass: 'bg-slate-400/20 text-slate-300' },
  { name: 'Gold', key: 'gold', minOrders: 30, discount: 10, color: '#F59E0B', bgClass: 'bg-yellow-500/20 text-yellow-400' },
  { name: 'Diamond', key: 'diamond', minOrders: 100, discount: 15, color: '#67E8F9', bgClass: 'bg-cyan-300/20 text-cyan-300' },
] as const;

// Order status configuration
export const orderStatuses = [
  { key: 'pending_payment', label: 'Pending Payment', labelBn: 'পেমেন্ট বাকি', color: 'text-yellow-400', bgClass: 'bg-yellow-500/20' },
  { key: 'paid_pending_assign', label: 'Paid - Awaiting Assignment', labelBn: 'পেইড - অ্যাসাইনমেন্ট অপেক্ষমান', color: 'text-blue-400', bgClass: 'bg-blue-500/20' },
  { key: 'assigned', label: 'Assigned', labelBn: 'অ্যাসাইন করা হয়েছে', color: 'text-purple-400', bgClass: 'bg-purple-500/20' },
  { key: 'in_progress', label: 'In Progress', labelBn: 'কাজ চলছে', color: 'text-blue-400', bgClass: 'bg-blue-500/20' },
  { key: 'in_review', label: 'In Review', labelBn: 'রিভিউ চলছে', color: 'text-orange-400', bgClass: 'bg-orange-500/20' },
  { key: 'revision', label: 'Revision', labelBn: 'রিভিশন', color: 'text-red-400', bgClass: 'bg-red-500/20' },
  { key: 'delivered', label: 'Delivered', labelBn: 'ডেলিভার্ড', color: 'text-emerald-400', bgClass: 'bg-emerald-500/20' },
  { key: 'cancelled', label: 'Cancelled', labelBn: 'বাতিল', color: 'text-gray-400', bgClass: 'bg-gray-500/20' },
] as const;

// Service slugs
export const serviceSlugs = [
  'youtube-editing',
  'shorts-editing',
  'thumbnail-design',
  'script-writing',
  'channel-management',
  'motion-graphics',
] as const;

// Points configuration
export const pointsConfig = {
  daily_login: 50,
  order_placed: 200,
  referral_joined: 100,
  rating_given: 50,
  profile_complete: 100,
  email_verified: 50,
} as const;