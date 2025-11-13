import React from 'react';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassPanel({ 
  children, 
  className = '',
  hover = false
}: GlassPanelProps) {
  return (
    <motion.div
      className={`glass-panel ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { 
        y: -2,
        transition: { duration: 0.2 }
      } : undefined}
    >
      {children}
    </motion.div>
  );
}