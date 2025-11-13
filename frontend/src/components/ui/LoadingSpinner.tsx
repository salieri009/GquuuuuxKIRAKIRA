import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary';
}

export default function LoadingSpinner({ 
  size = 'md',
  color = 'primary'
}: LoadingSpinnerProps) {
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6';
      case 'lg': return 'w-12 h-12';
      default: return 'w-8 h-8';
    }
  };

  const getColorClass = () => {
    return color === 'secondary' 
      ? 'border-t-secondary-accent' 
      : 'border-t-primary-accent';
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`loading-spinner ${getSizeClass()} ${getColorClass()}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}