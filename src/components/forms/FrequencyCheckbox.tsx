import { cn } from "@/lib/utils";

interface FrequencyCheckboxProps {
  value: string;
  label: string;
  discountLabel?: string;
  checked: boolean;
  onChange: (value: string) => void;
}

export function FrequencyCheckbox({
  value,
  label,
  discountLabel,
  checked,
  onChange,
}: FrequencyCheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(value)}
      className={cn(
        "flex items-center gap-3 p-3 rounded-md border transition-colors w-full text-left",
        checked
          ? "border-primary bg-primary/5"
          : "border-input hover:border-primary/50"
      )}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
          checked ? "border-primary" : "border-muted-foreground"
        )}
      >
        {checked && (
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
        )}
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium">{label}</span>
        {discountLabel && (
          <span className="ml-2 text-xs bg-status-confirmed/15 text-status-confirmed px-2 py-0.5 rounded-full">
            {discountLabel}
          </span>
        )}
      </div>
    </button>
  );
}
