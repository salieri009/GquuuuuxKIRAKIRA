import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn, clamp, formatNumber } from '../../utils';
import type { SliderProps } from '../../types';

interface EnhancedSliderProps extends SliderProps {
  variant?: 'default' | 'neon' | 'minimal';
  color?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  marks?: { value: number; label?: string }[];
  tooltip?: boolean;
  vertical?: boolean;
}

export default function NeonSlider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  showValue = true,
  disabled = false,
  className,
  variant = 'neon',
  color = 'primary',
  size = 'md',
  marks,
  tooltip = true,
  vertical = false,
}: EnhancedSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  // 값을 올바른 범위와 단계로 정규화
  const normalizedValue = clamp(value, min, max);
  const percentage = ((normalizedValue - min) / (max - min)) * 100;

  const updateValue = useCallback((clientX: number, clientY: number) => {
    if (!sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    let percent: number;

    if (vertical) {
      percent = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    } else {
      percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    }

    const rawValue = min + percent * (max - min);
    const steppedValue = Math.round(rawValue / step) * step;
    const finalValue = clamp(steppedValue, min, max);
    
    if (finalValue !== normalizedValue) {
      onChange(finalValue);
    }
  }, [min, max, step, onChange, normalizedValue, disabled, vertical]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    setIsDragging(true);
    updateValue(e.clientX, e.clientY);
  }, [updateValue, disabled]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      updateValue(e.clientX, e.clientY);
    }
  }, [isDragging, updateValue]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;

    let newValue = normalizedValue;
    const largeStep = (max - min) / 10;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = normalizedValue - step;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = normalizedValue + step;
        break;
      case 'PageDown':
        e.preventDefault();
        newValue = normalizedValue - largeStep;
        break;
      case 'PageUp':
        e.preventDefault();
        newValue = normalizedValue + largeStep;
        break;
      case 'Home':
        e.preventDefault();
        newValue = min;
        break;
      case 'End':
        e.preventDefault();
        newValue = max;
        break;
      default:
        return;
    }

    const clampedValue = clamp(newValue, min, max);
    const steppedValue = Math.round(clampedValue / step) * step;
    onChange(clamp(steppedValue, min, max));
  }, [normalizedValue, min, max, step, onChange, disabled]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('selectstart', (e) => e.preventDefault());
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectstart', (e) => e.preventDefault());
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // 스타일 클래스들
  const containerClasses = cn(
    'relative flex flex-col gap-2',
    vertical && 'items-center',
    className
  );

  const sliderClasses = cn(
    'relative rounded-full cursor-pointer transition-all duration-200',
    {
      // 크기별 스타일
      'h-1.5': size === 'sm' && !vertical,
      'h-2': size === 'md' && !vertical,
      'h-3': size === 'lg' && !vertical,
      'w-1.5': size === 'sm' && vertical,
      'w-2': size === 'md' && vertical,
      'w-3': size === 'lg' && vertical,
      'h-48': vertical,
      'w-full': !vertical,
    },
    {
      // 변형별 배경
      'bg-border-primary': variant === 'default',
      'bg-border-secondary': variant === 'minimal',
      'bg-gradient-to-r from-border-primary to-border-secondary': variant === 'neon',
    },
    disabled && 'opacity-50 cursor-not-allowed'
  );

  const trackClasses = cn(
    'absolute rounded-full transition-all duration-200',
    {
      // 방향별 스타일
      'h-full top-0 left-0': !vertical,
      'w-full bottom-0 left-0': vertical,
    },
    {
      // 색상별 스타일
      'bg-primary-accent': color === 'primary',
      'bg-secondary-accent': color === 'secondary',
      'bg-tertiary-accent': color === 'tertiary',
    },
    variant === 'neon' && [
      color === 'primary' && 'shadow-neon-cyan',
      color === 'secondary' && 'shadow-neon-magenta',
      color === 'tertiary' && 'shadow-neon-green',
    ]
  );

  const thumbClasses = cn(
    'absolute rounded-full border-2 border-white bg-white shadow-lg transition-all duration-200',
    'transform -translate-x-1/2 -translate-y-1/2',
    {
      // 크기별 스타일
      'w-4 h-4': size === 'sm',
      'w-5 h-5': size === 'md',
      'w-6 h-6': size === 'lg',
    },
    {
      // 색상별 스타일
      'border-primary-accent bg-primary-accent': color === 'primary',
      'border-secondary-accent bg-secondary-accent': color === 'secondary',
      'border-tertiary-accent bg-tertiary-accent': color === 'tertiary',
    },
    variant === 'neon' && [
      color === 'primary' && 'shadow-neon-cyan',
      color === 'secondary' && 'shadow-neon-magenta',
      color === 'tertiary' && 'shadow-neon-green',
    ],
    (isDragging || isHovered) && 'scale-110',
    disabled && 'opacity-50'
  );

  const formatValue = (val: number) => {
    if (step < 1) {
      return val.toFixed(2);
    } else if (step < 10) {
      return val.toFixed(1);
    } else {
      return Math.round(val).toString();
    }
  };

  return (
    <div className={containerClasses}>
      {/* 라벨과 값 표시 */}
      {(label || showValue) && (
        <div className="flex justify-between items-center text-sm">
          {label && (
            <span className="text-text-secondary font-medium select-none">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-text-accent font-mono tabular-nums">
              {formatValue(normalizedValue)}
            </span>
          )}
        </div>
      )}

      {/* 슬라이더 컨테이너 */}
      <div className="relative">
        {/* 메인 슬라이더 */}
        <div
          ref={sliderRef}
          className={sliderClasses}
          onMouseDown={handleMouseDown}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={normalizedValue}
          aria-valuetext={formatValue(normalizedValue)}
          aria-label={label}
          aria-disabled={disabled}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
        >
          {/* 트랙 (진행된 부분) */}
          <motion.div
            className={trackClasses}
            style={
              vertical
                ? { height: `${percentage}%` }
                : { width: `${percentage}%` }
            }
            animate={
              vertical
                ? { height: `${percentage}%` }
                : { width: `${percentage}%` }
            }
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />

          {/* 썸 (핸들) */}
          <motion.div
            ref={thumbRef}
            className={thumbClasses}
            style={
              vertical
                ? { 
                    bottom: `${percentage}%`,
                    left: '50%',
                  }
                : { 
                    left: `${percentage}%`,
                    top: '50%',
                  }
            }
            animate={
              vertical
                ? { bottom: `${percentage}%` }
                : { left: `${percentage}%` }
            }
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.2 }}
          />
        </div>

        {/* 마크 표시 */}
        {marks && marks.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {marks.map((mark, index) => {
              const markPercentage = ((mark.value - min) / (max - min)) * 100;
              return (
                <div
                  key={index}
                  className="absolute"
                  style={
                    vertical
                      ? { 
                          bottom: `${markPercentage}%`,
                          left: '50%',
                          transform: 'translate(-50%, 50%)',
                        }
                      : { 
                          left: `${markPercentage}%`,
                          top: '100%',
                          transform: 'translate(-50%, 0.5rem)',
                        }
                  }
                >
                  <div className="w-1 h-1 bg-text-muted rounded-full" />
                  {mark.label && (
                    <span className="text-xs text-text-muted mt-1 block text-center whitespace-nowrap">
                      {mark.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 툴팁 */}
        {tooltip && (showTooltip || isDragging) && (
          <motion.div
            className="absolute pointer-events-none z-10"
            style={
              vertical
                ? { 
                    bottom: `${percentage}%`,
                    left: '100%',
                    transform: 'translate(0.5rem, 50%)',
                  }
                : { 
                    left: `${percentage}%`,
                    bottom: '100%',
                    transform: 'translate(-50%, -0.5rem)',
                  }
            }
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-primary-bg text-text-primary text-xs px-2 py-1 rounded shadow-lg border border-border-primary">
              {formatValue(normalizedValue)}
            </div>
          </motion.div>
        )}
      </div>

      {/* 범위 표시 */}
      {(min !== 0 || max !== 100) && (
        <div className="flex justify-between text-xs text-text-muted">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      )}
    </div>
  );
}