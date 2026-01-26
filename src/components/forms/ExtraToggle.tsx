import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface ExtraToggleProps {
  value: string;
  label: string;
  price: string;
  icon: ReactNode;
  checked: boolean;
  onChange: (value: string, checked: boolean) => void;
}

export function ExtraToggle({
  value,
  label,
  price,
  icon,
  checked,
  onChange,
}: ExtraToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(value, !checked)}
      className={cn(
        "flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg border transition-all min-h-[44px]",
        checked
          ? "border-primary bg-primary/10 text-primary"
          : "border-input hover:border-primary/50 text-muted-foreground hover:text-foreground"
      )}
    >
      <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">{icon}</div>
      <span className="text-[10px] sm:text-xs font-medium text-center leading-tight">{label}</span>
      <span className="text-[10px] sm:text-xs">{price}</span>
    </button>
  );
}
