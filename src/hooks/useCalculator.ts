import { useMemo } from 'react';
import { getPricing, type Extra } from '@/lib/pricing';
import type { CalculatedPrice } from '@/lib/types';

interface CalculatorInput {
  cleaningType: string;
  frequency: string;
  kitchens: number;
  bathrooms: string;
  bedrooms: string;
  livingRooms: number;
  extras: string[];
  laundry: number;
}

export function useCalculator(input: CalculatorInput): CalculatedPrice {
  const pricing = useMemo(() => getPricing(), []);

  return useMemo(() => {
    const typePrice = pricing.cleaningTypes[input.cleaningType as keyof typeof pricing.cleaningTypes]?.price ?? 110;
    const kitchenPrice = pricing.kitchens[input.kitchens] ?? 0;
    const bathroomPrice = pricing.bathrooms[input.bathrooms] ?? 0;
    const bedroomPrice = pricing.bedrooms[input.bedrooms] ?? 0;
    const livingRoomPrice = pricing.livingRooms[input.livingRooms] ?? 0;

    const extrasPrice = input.extras.reduce((sum, extra) => {
      const extraConfig = pricing.extras[extra as Extra];
      return sum + (extraConfig?.price ?? 0);
    }, 0);

    const laundryPrice = input.laundry * pricing.laundryPerPerson;

    const subtotal = typePrice + kitchenPrice + bathroomPrice + bedroomPrice + livingRoomPrice + extrasPrice + laundryPrice;

    const frequencyConfig = pricing.frequencies[input.frequency as keyof typeof pricing.frequencies];
    const discountPercent = frequencyConfig?.discount ?? 0;
    const discountAmount = subtotal * discountPercent;
    const total = subtotal - discountAmount;

    return {
      typePrice,
      kitchenPrice,
      bathroomPrice,
      bedroomPrice,
      livingRoomPrice,
      extrasPrice,
      laundryPrice,
      subtotal,
      discountPercent,
      discountAmount,
      total,
    };
  }, [input, pricing]);
}
