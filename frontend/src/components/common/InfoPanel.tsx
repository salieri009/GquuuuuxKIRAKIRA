import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useUI } from '../../contexts/UIContext';
import { useEffect as useEffectContext } from '../../contexts/EffectContext';
import GlassPanel from '../ui/GlassPanel';
import NeonButton from '../ui/NeonButton';

export default function InfoPanel() {
  const { state: uiState, dispatch: uiDispatch } = useUI();
  const { state: effectState } = useEffectContext();

  const closePanel = () => {
    uiDispatch({ type: 'TOGGLE_INFO_PANEL' });
  };

  return (
    <AnimatePresence>
      {uiState.isInfoPanelVisible && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closePanel}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 mx-4"
          >
            <GlassPanel className="p-lg">
              <div className="flex items-center justify-between mb-lg">
                <h2 className="text-xl font-bold text-accent">
                  {effectState.selectedEffect?.name || 'Kirakira'}
                </h2>
                <NeonButton onClick={closePanel} size="sm" variant="ghost">
                  <X size={16} />
                </NeonButton>
              </div>

              {effectState.selectedEffect ? (
                <div className="space-y-md">
                  <img
                    src={effectState.selectedEffect.thumbnail}
                    alt={effectState.selectedEffect.name}
                    className="w-full h-32 object-cover rounded border border-primary-accent"
                  />
                  
                  <div>
                    <h3 className="font-bold text-text-primary mb-sm">Description</h3>
                    <p className="text-sm text-text-secondary">
                      {effectState.selectedEffect.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-text-primary mb-sm">Related Gundam</h3>
                    <div className="flex flex-wrap gap-sm">
                      {effectState.selectedEffect.relatedGundam.map((gundam) => (
                        <span
                          key={gundam}
                          className="px-3 py-1 text-sm bg-secondary-accent bg-opacity-20 text-secondary-accent rounded-full border border-secondary-accent border-opacity-30"
                        >
                          {gundam}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-text-primary mb-sm">Parameters</h3>
                    <div className="space-y-sm">
                      {Object.entries(effectState.selectedEffect.defaultParams).map(([key, config]) => (
                        <div key={key} className="flex justify-between items-center text-sm">
                          <span className="text-text-secondary capitalize">{key}</span>
                          <span className="text-accent font-mono">
                            {effectState.currentParams[key] || config.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-lg">
                  <h3 className="font-bold text-text-primary mb-sm">Gundam Effects Simulator</h3>
                  <p className="text-sm text-text-secondary">
                    Experience the visual effects from various Gundam series in real-time 3D.
                    Select an effect from the library to get started.
                  </p>
                </div>
              )}
            </GlassPanel>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}