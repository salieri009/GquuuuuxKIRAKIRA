import React from 'react';
import { motion } from 'framer-motion';
import { useEffect as useEffectContext } from '../../contexts/EffectContext';
import GlassPanel from '../ui/GlassPanel';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function EffectLibrary() {
  const { state, dispatch } = useEffectContext();

  const handleEffectSelect = (effect: any) => {
    dispatch({ type: 'SELECT_EFFECT', payload: effect });
  };

  if (state.status === 'loading') {
    return (
      <GlassPanel className="p-lg text-center">
        <LoadingSpinner />
        <p className="mt-md text-muted">Loading effects...</p>
      </GlassPanel>
    );
  }

  if (state.status === 'failed') {
    return (
      <GlassPanel className="p-lg text-center">
        <p className="text-danger mb-md">Failed to load effects</p>
        <p className="text-muted text-sm">{state.error}</p>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="p-lg">
      <h3 className="text-lg font-bold text-accent mb-lg">Effect Library</h3>
      
      <div className="space-y-md">
        {state.effects.map((effect, index) => (
          <motion.div
            key={effect.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`effect-card cursor-pointer ${
              state.selectedEffect?.id === effect.id ? 'active' : ''
            }`}
            onClick={() => handleEffectSelect(effect)}
          >
            <div className="flex items-start gap-md">
              <img
                src={effect.thumbnail}
                alt={effect.name}
                className="w-16 h-12 object-cover rounded border border-primary-accent"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-text-primary truncate">
                  {effect.name}
                </h4>
                <p className="text-sm text-muted line-clamp-2 mt-xs">
                  {effect.description}
                </p>
                <div className="mt-sm">
                  <div className="flex flex-wrap gap-xs">
                    {effect.relatedGundam.slice(0, 2).map((gundam) => (
                      <span
                        key={gundam}
                        className="px-2 py-1 text-xs bg-primary-accent bg-opacity-20 text-accent rounded"
                      >
                        {gundam}
                      </span>
                    ))}
                    {effect.relatedGundam.length > 2 && (
                      <span className="px-2 py-1 text-xs text-muted">
                        +{effect.relatedGundam.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}