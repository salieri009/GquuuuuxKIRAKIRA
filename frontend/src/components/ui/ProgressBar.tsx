import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function ProgressBar({
  progress,
  label,
  showPercentage = true,
  color = 'primary',
  size = 'md',
  animated = true,
}: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const getColorClass = () => {
    switch (color) {
      case 'primary':
        return 'bg-primary-accent';
      case 'secondary':
        return 'bg-secondary-accent';
      case 'success':
        return 'bg-success';
      case 'warning':
        return 'bg-warning';
      case 'danger':
        return 'bg-danger';
      default:
        return 'bg-primary-accent';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-1';
      case 'lg':
        return 'h-3';
      default:
        return 'h-2';
    }
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-xs">
          {label && (
            <span className="text-sm text-text-secondary">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-mono text-text-muted">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full ${getSizeClass()} bg-secondary-bg rounded-full overflow-hidden`}>
        {animated ? (
          <motion.div
            className={`${getColorClass()} h-full rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${clampedProgress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={`${getColorClass()} h-full rounded-full`}
            style={{ width: `${clampedProgress}%` }}
          />
        )}
      </div>
    </div>
  );
}

