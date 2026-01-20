import * as React from "react";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[100px] w-full rounded-md border bg-background px-3 py-2 text-sm",
            "ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 resize-y",
            error ? "border-destructive" : "border-input",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
