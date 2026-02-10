import { formatCurrency, getPricing } from "@/lib/pricing";
import type { CalculatedPrice } from "@/lib/types";
import { Sparkles } from "lucide-react";

interface SummaryProps {
  cleaningType: string;
  frequency: string;
  kitchens: number;
  bathrooms: string;
  bedrooms: string;
  livingRooms: number;
  extras: string[];
  laundry: number;
  calculation: CalculatedPrice;
}

export function Summary({
  cleaningType,
  frequency,
  kitchens,
  bathrooms,
  bedrooms,
  livingRooms,
  extras,
  laundry,
  calculation,
}: SummaryProps) {
  const pricing = getPricing();

  const typeLabel = pricing.cleaningTypes[cleaningType as keyof typeof pricing.cleaningTypes]?.label ?? cleaningType;
  const freqConfig = pricing.frequencies[frequency as keyof typeof pricing.frequencies];
  const freqLabel = freqConfig?.label ?? frequency;
  const discountPercent = freqConfig?.discount ?? 0;

  const hasRooms = kitchens > 0 || Number(bathrooms) > 0 || Number(bedrooms) > 0 || livingRooms > 0;

  return (
    <div className="calculator-panel lg:sticky lg:top-4 shadow-md lg:shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-display text-base sm:text-lg uppercase tracking-wide">SUMMARY</h3>
      </div>

      <div className="space-y-3 text-sm">
        {/* Cleaning Type */}
        <div className="flex justify-between">
          <span>{typeLabel}</span>
          <span className="font-medium">{formatCurrency(calculation.typePrice)}</span>
        </div>

        {/* Frequency */}
        <div className="flex justify-between items-center">
          <span>{freqLabel}</span>
          {discountPercent > 0 && (
            <span className="text-xs bg-status-confirmed/15 text-status-confirmed px-2 py-0.5 rounded-full">
              {Math.round(discountPercent * 100)}% off
            </span>
          )}
        </div>

        <hr className="border-border" />

        {/* Rooms */}
        {kitchens > 0 && (
          <div className="flex justify-between">
            <span>Kitchen ({kitchens})</span>
            <span>{formatCurrency(calculation.kitchenPrice)}</span>
          </div>
        )}

        {Number(bathrooms) > 0 && (
          <div className="flex justify-between">
            <span>Bathroom ({bathrooms})</span>
            <span>{formatCurrency(calculation.bathroomPrice)}</span>
          </div>
        )}

        {Number(bedrooms) > 0 && (
          <div className="flex justify-between">
            <span>Bedroom ({bedrooms})</span>
            <span>{formatCurrency(calculation.bedroomPrice)}</span>
          </div>
        )}

        {livingRooms > 0 && (
          <div className="flex justify-between">
            <span>Living Room ({livingRooms})</span>
            <span>{formatCurrency(calculation.livingRoomPrice)}</span>
          </div>
        )}

        {/* Extras */}
        {extras.length > 0 && (
          <>
            {hasRooms && <hr className="border-border" />}
            {extras.map((extra) => {
              const extraConfig = pricing.extras[extra as keyof typeof pricing.extras];
              if (!extraConfig) return null;
              return (
                <div key={extra} className="flex justify-between">
                  <span>{extraConfig.label}</span>
                  <span>{formatCurrency(extraConfig.price)}</span>
                </div>
              );
            })}
          </>
        )}

        {/* Laundry */}
        {laundry > 0 && (
          <>
            {(hasRooms || extras.length > 0) && <hr className="border-border" />}
            <div className="flex justify-between">
              <span>Laundry ({laundry} person{laundry > 1 ? 's' : ''})</span>
              <span>{formatCurrency(calculation.laundryPrice)}</span>
            </div>
          </>
        )}

        {(hasRooms || extras.length > 0 || laundry > 0) && <hr className="border-border" />}

        {/* Subtotal */}
        <div className="flex justify-between font-medium">
          <span>Subtotal</span>
          <span>{formatCurrency(calculation.subtotal)}</span>
        </div>


        {/* Total */}
        <div className="flex justify-between text-xl font-bold text-primary pt-2 border-t border-border font-display">
          <span>Total</span>
          <span className="price-display font-display">{formatCurrency(calculation.total)}</span>
        </div>
      </div>
    </div>
  );
}
