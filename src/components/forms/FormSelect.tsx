import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  options: { value: string; label: string }[];
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, error, options, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full appearance-none rounded-md border bg-background px-3 py-2 pr-8 text-sm",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-destructive" : "border-input",
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        {error && (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
