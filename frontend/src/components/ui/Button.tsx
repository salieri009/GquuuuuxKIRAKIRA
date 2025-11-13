import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils';
import type { ButtonProps } from '../../types';

interface MotionButtonProps extends Omit<HTMLMotionProps<'button'>, keyof ButtonProps>, ButtonProps {}

const Button = forwardRef<HTMLButtonElement, MotionButtonProps>(({
  variant = 'primary',
  size = 'md',
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
}, ref) => {
  // 기본 클래스
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-bg',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'relative overflow-hidden',
    'select-none',
  ];

  // 변형별 클래스
  const variantClasses = {
    primary: [
      'bg-transparent',
      'border-2 border-primary-accent',
      'text-primary-accent',
      'hover:bg-primary-accent hover:text-primary-bg',
      'focus:ring-primary-accent',
      glow && 'shadow-neon-cyan hover:shadow-neon-cyan-strong',
    ],
    secondary: [
      'bg-transparent',
      'border-2 border-secondary-accent',
      'text-secondary-accent',
      'hover:bg-secondary-accent hover:text-primary-bg',
      'focus:ring-secondary-accent',
      glow && 'shadow-neon-magenta hover:shadow-neon-magenta-strong',
    ],
    ghost: [
      'bg-transparent',
      'border border-border-primary',
      'text-text-secondary',
      'hover:bg-glass-bg hover:text-text-primary hover:border-border-accent',
      'focus:ring-primary-accent',
    ],
    glass: [
      'bg-gradient-glass backdrop-blur-sm',
      'border border-white/20',
      'text-text-primary',
      'hover:bg-glass-secondary hover:border-white/30',
      'focus:ring-primary-accent',
      'shadow-glass',
    ],
    danger: [
      'bg-transparent',
      'border-2 border-danger',
      'text-danger',
      'hover:bg-danger hover:text-primary-bg',
      'focus:ring-danger',
    ],
  };

  // 크기별 클래스
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded-md gap-1 min-h-[1.75rem]',
    sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5 min-h-[2rem]',
    md: 'px-4 py-2 text-sm rounded-lg gap-2 min-h-[2.5rem]',
    lg: 'px-6 py-3 text-base rounded-lg gap-2 min-h-[3rem]',
    xl: 'px-8 py-4 text-lg rounded-xl gap-3 min-h-[3.5rem]',
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );

  return (
    <motion.button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      onClick={!disabled && !loading ? onClick : undefined}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      {...props}
    >
      {/* 호버 효과 오버레이 */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-inherit opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* 버튼 내용 */}
      <span 
        className={cn(
          'flex items-center gap-inherit relative z-10',
          loading && 'opacity-0'
        )}
      >
        {leftIcon && (
          <span className="flex-shrink-0">
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className="flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </span>

      {/* 로딩 스피너 */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}

      {/* 네온 글로우 효과 (활성화 시) */}
      {glow && !disabled && (
        <motion.div
          className={cn(
            'absolute inset-0 rounded-inherit opacity-0',
            variant === 'primary' && 'shadow-neon-cyan',
            variant === 'secondary' && 'shadow-neon-magenta'
          )}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
