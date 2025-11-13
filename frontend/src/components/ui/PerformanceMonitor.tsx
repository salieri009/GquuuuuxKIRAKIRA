import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X } from 'lucide-react';
import GlassPanel from './GlassPanel';
import NeonButton from './NeonButton';

interface PerformanceMonitorProps {
  visible?: boolean;
  onClose?: () => void;
}

export default function PerformanceMonitor({
  visible = import.meta.env.DEV,
  onClose,
}: PerformanceMonitorProps) {
  const [fps, setFps] = useState(0);
  const [frameTime, setFrameTime] = useState(0);
  const [memory, setMemory] = useState<{
    used: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    if (!visible) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        const currentFPS = Math.round((frameCount * 1000) / delta);
        const currentFrameTime = delta / frameCount;

        setFps(currentFPS);
        setFrameTime(Math.round(currentFrameTime * 100) / 100);

        frameCount = 0;
        lastTime = currentTime;
      }

      // 메모리 정보 (Chrome만 지원)
      if ('memory' in performance) {
        const mem = (performance as any).memory;
        setMemory({
          used: Math.round(mem.usedJSHeapSize / 1048576), // MB
          total: Math.round(mem.totalJSHeapSize / 1048576), // MB
        });
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [visible]);

  if (!visible) return null;

  const getFPSColor = () => {
    if (fps >= 55) return 'text-success';
    if (fps >= 30) return 'text-warning';
    return 'text-danger';
  };

  const getFrameTimeColor = () => {
    if (frameTime <= 16.67) return 'text-success'; // 60fps 기준
    if (frameTime <= 33.33) return 'text-warning'; // 30fps 기준
    return 'text-danger';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 right-4 z-50"
      >
        <GlassPanel className="p-sm min-w-[200px]">
          <div className="flex items-center justify-between mb-sm">
            <div className="flex items-center gap-xs">
              <Activity size={14} className="text-primary-accent" />
              <span className="text-xs font-bold text-text-primary">Performance</span>
            </div>
            {onClose && (
              <NeonButton
                onClick={onClose}
                size="sm"
                variant="ghost"
              >
                <X size={12} />
              </NeonButton>
            )}
          </div>

          <div className="space-y-xs text-xs">
            <div className="flex justify-between">
              <span className="text-text-secondary">FPS:</span>
              <span className={`font-mono font-bold ${getFPSColor()}`}>
                {fps}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-secondary">Frame Time:</span>
              <span className={`font-mono ${getFrameTimeColor()}`}>
                {frameTime}ms
              </span>
            </div>

            {memory && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Memory:</span>
                <span className="font-mono text-text-primary">
                  {memory.used}MB / {memory.total}MB
                </span>
              </div>
            )}
          </div>
        </GlassPanel>
      </motion.div>
    </AnimatePresence>
  );
}

