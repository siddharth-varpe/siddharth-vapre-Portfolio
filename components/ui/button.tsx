import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Reusable Button primitive adhering to Dark Systems / Technical Editorial aesthetics.
 * Features visible electric-blue focus ring, accessible minimum touch targets,
 * and loading state resilience.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary:
        "bg-white text-black hover:bg-neutral-200 border border-white font-medium",
      secondary:
        "bg-surface-muted text-foreground hover:bg-surface-subtle border border-border",
      outline:
        "bg-transparent text-foreground hover:bg-surface-muted border border-border hover:border-border-hover",
      ghost:
        "bg-transparent text-foreground-secondary hover:bg-surface-muted hover:text-foreground",
      destructive:
        "bg-error/10 text-error hover:bg-error/20 border border-error/30",
    };

    const sizeClasses = {
      sm: "h-9 px-3 text-xs tracking-wide",
      md: "h-11 px-4 text-sm font-medium",
      lg: "h-12 px-6 text-base font-medium",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-sans transition-all duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:pointer-events-none disabled:opacity-50",
          fullWidth && "w-full",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
