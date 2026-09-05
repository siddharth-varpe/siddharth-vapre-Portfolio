import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Accessible Label for form inputs.
 */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block text-xs font-medium uppercase tracking-wider font-mono text-foreground-secondary mb-1.5",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  );
}

/**
 * Text Input with Dark Systems styling and visible electric blue focus state.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground",
          "placeholder:text-foreground-subtle transition-colors",
          "focus:border-border-emphasized focus:outline-none focus:ring-2 focus:ring-accent/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasError && "border-error focus:ring-error/50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

/**
 * Textarea primitive for longer text entries.
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "flex w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground",
          "placeholder:text-foreground-subtle transition-colors resize-y",
          "focus:border-border-emphasized focus:outline-none focus:ring-2 focus:ring-accent/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasError && "border-error focus:ring-error/50",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

/**
 * Select primitive with dark background options.
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground",
          "focus:border-border-emphasized focus:outline-none focus:ring-2 focus:ring-accent/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasError && "border-error focus:ring-error/50",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";

/**
 * Accessible Checkbox primitive.
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    return (
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            className={cn(
              "peer h-4 w-4 shrink-0 rounded border border-border bg-surface-muted",
              "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background",
              "checked:bg-accent checked:border-accent disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
          <Check className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block" />
        </div>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-foreground-secondary cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";

/**
 * Form field helper text.
 */
export function FormHelperText({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-1.5 text-xs text-foreground-subtle", className)} {...props}>
      {children}
    </p>
  );
}

/**
 * Form field error text.
 */
export function FormErrorText({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-1.5 text-xs text-error font-medium", className)} {...props}>
      {children}
    </p>
  );
}
