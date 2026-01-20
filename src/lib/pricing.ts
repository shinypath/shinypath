// Shiny Path Cleaning - Pricing Configuration

export type CleaningType = 'standard' | 'deep' | 'move-in-out';
export type Frequency = 'one-time' | 'weekly' | 'every-other-week' | 'every-4-weeks';
export type Extra = 'inside-fridge' | 'inside-oven' | 'inside-cabinets' | 'dishes' | 'pets';

export interface PricingConfig {
  cleaningTypes: Record<CleaningType, { label: string; price: number }>;
  frequencies: Record<Frequency, { label: string; discount: number }>;
  kitchens: Record<number, number>;
  bathrooms: Record<string, number>;
  bedrooms: Record<string, number>;
  livingRooms: Record<number, number>;
  extras: Record<Extra, { label: string; price: number }>;
  laundryPerPerson: number;
}

export const DEFAULT_PRICING: PricingConfig = {
  cleaningTypes: {
    'standard': { label: 'Standard', price: 110 },
    'deep': { label: 'Deep Cleaning', price: 125 },
    'move-in-out': { label: 'Move In-Out', price: 140 },
  },
  frequencies: {
    'one-time': { label: 'One-Time', discount: 0 },
    'weekly': { label: 'Weekly', discount: 0.20 },
    'every-other-week': { label: 'Every other week', discount: 0.15 },
    'every-4-weeks': { label: 'Every 4 weeks', discount: 0.10 },
  },
  kitchens: {
    0: 0,
    1: 45,
    2: 90,
    3: 135,
    4: 180,
  },
  bathrooms: {
    '0': 0,
    '1': 24,
    '1.5': 48,
    '2': 66,
    '2.5': 84,
    '3': 102,
    '3.5': 120,
    '4': 138,
    '4.5': 156,
    '5': 174,
    '5.5': 192,
    '6': 210,
    '6.5': 228,
    '7': 246,
    '7.5': 264,
    '8': 282,
  },
  bedrooms: {
    '0': 0,
    '1': 10,
    '1.5': 18,
    '2': 36,
    '2.5': 54,
    '3': 72,
    '3.5': 90,
    '4': 108,
    '4.5': 126,
    '5': 144,
    '5.5': 162,
    '6': 180,
    '6.5': 198,
    '7': 216,
    '7.5': 234,
    '8': 252,
  },
  livingRooms: {
    0: 0,
    1: 0,
    2: 24,
    3: 48,
    4: 72,
    5: 96,
    6: 120,
    7: 144,
    8: 168,
  },
  extras: {
    'inside-fridge': { label: 'Inside Fridge', price: 50 },
    'inside-oven': { label: 'Inside Oven', price: 50 },
    'inside-cabinets': { label: 'Inside Cabinets', price: 40 },
    'dishes': { label: 'Dishes', price: 40 },
    'pets': { label: 'Pets', price: 20 },
  },
  laundryPerPerson: 40,
};

export function getPricing(): PricingConfig {
  try {
    const stored = localStorage.getItem('shiny-path-pricing');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore errors
  }
  return DEFAULT_PRICING;
}

export function savePricing(config: PricingConfig): void {
  localStorage.setItem('shiny-path-pricing', JSON.stringify(config));
}

export function resetPricing(): void {
  localStorage.removeItem('shiny-path-pricing');
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  }).format(amount);
}
