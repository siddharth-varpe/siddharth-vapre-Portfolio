import * as React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "article" | "section" | "aside" | "header" | "footer" | "main";
  size?: "public" | "reading" | "admin" | "full";
}

/**
 * Reusable layout container with controlled maximum widths and responsive horizontal padding.
 * - public: max-w-6xl (default editorial presentation width)
 * - reading: max-w-3xl (optimal reading width for text/articles)
 * - admin: max-w-7xl (operational dashboard width)
 * - full: max-w-full
 */
export function Container({
  as: Component = "div",
  size = "public",
  className,
  children,
  ...props
}: ContainerProps) {
  const sizeClasses = {
    reading: "max-w-3xl",
    public: "max-w-screen-2xl",
    admin: "max-w-7xl",
    full: "max-w-full",
  };

  const Comp = Component as "div";
  return (
    <Comp
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8 xl:px-12",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
