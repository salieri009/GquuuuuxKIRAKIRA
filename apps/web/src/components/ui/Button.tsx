import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../utils";
import type { ButtonProps } from "../../types";

interface MotionButtonProps
  extends Omit<HTMLMotionProps<"button">, keyof ButtonProps>, ButtonProps {}

const Button = forwardRef<HTMLButtonElement, MotionButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      glow = false,
      loading = false,
      disabled = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const baseClasses = [
      "inline-flex items-center justify-center",
      "font-medium transition-colors duration-150",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-bg",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
      "relative select-none",
    ];

    const variantClasses = {
      primary: [
        "bg-primary-accent text-text-inverse",
        "hover:bg-[var(--color-primary-accent-hover)]",
        "border border-transparent",
        glow && "shadow-neon-cyan-strong",
      ],
      secondary: [
        "bg-surface text-text-primary",
        "border border-border-primary",
        "hover:bg-tertiary-bg hover:border-border-hover",
      ],
      ghost: [
        "bg-transparent text-text-secondary",
        "border border-transparent",
        "hover:bg-glass-bg hover:text-text-primary",
      ],
      glass: [
        "bg-glass-bg backdrop-blur-sm",
        "border border-border-primary",
        "text-text-primary",
        "hover:bg-tertiary-bg",
      ],
      danger: [
        "bg-transparent text-danger",
        "border border-danger/40",
        "hover:bg-danger/10",
      ],
    };

    const sizeClasses = {
      xs: "px-2 py-1 text-xs rounded-md gap-1 min-h-[1.75rem]",
      sm: "px-3 py-1.5 text-sm rounded-md gap-1.5 min-h-[2rem]",
      md: "px-4 py-2 text-sm rounded-md gap-2 min-h-[2.25rem]",
      lg: "px-5 py-2.5 text-sm rounded-lg gap-2 min-h-[2.5rem]",
      xl: "px-6 py-3 text-base rounded-lg gap-2 min-h-[3rem]",
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && "w-full",
      className,
    );

    return (
      <motion.button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        onClick={!disabled && !loading ? onClick : undefined}
        {...props}
      >
        <span
          className={cn(
            "flex items-center gap-inherit",
            loading && "opacity-0",
          )}
        >
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </span>

        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </span>
        )}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

export default Button;
