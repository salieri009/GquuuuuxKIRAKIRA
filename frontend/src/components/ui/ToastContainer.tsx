import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export default function ToastContainer() {
  const { toasts, hideToast } = useUIStore();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.9 }}
            className="pointer-events-auto"
          >
            <div
              className={`glass-panel p-md min-w-[300px] max-w-md flex items-start gap-sm ${
                toast.type === 'success' ? 'border-success' :
                toast.type === 'error' ? 'border-danger' :
                toast.type === 'warning' ? 'border-warning' :
                'border-primary-accent'
              }`}
            >
              <div className="flex-shrink-0 mt-xs">
                {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-success" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-danger" />}
                {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-warning" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-primary-accent" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary">{toast.message}</p>
              </div>
              <button
                onClick={() => hideToast(toast.id)}
                className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
                aria-label="닫기"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

