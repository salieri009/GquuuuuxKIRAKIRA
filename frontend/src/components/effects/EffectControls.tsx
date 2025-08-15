import React from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Save, Share } from 'lucide-react';
import { useEffect as useEffectContext } from '../../contexts/EffectContext';
import NeonSlider from '../ui/NeonSlider';
import NeonButton from '../ui/NeonButton';
import GlassPanel from '../ui/GlassPanel';

export default function EffectControls() {
  const { state, dispatch } = useEffectContext();

  if (!state.selectedEffect) {
    return (
      <GlassPanel className="p-lg text-center">
        <p className="text-muted">Select an effect to see controls</p>
      </GlassPanel>
    );
  }

  const handleParamChange = (key: string, value: any) => {
    dispatch({ type: 'UPDATE_PARAM', payload: { key, value } });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_PARAMS' });
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save preset:', state.currentParams);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share effect:', state.selectedEffect?.id, state.currentParams);
  };

  return (
    <GlassPanel className="p-lg">
      <div className="flex items-center justify-between mb-lg">
        <h3 className="text-lg font-bold text-accent">Effect Controls</h3>
        <div className="flex gap-sm">
          <NeonButton onClick={handleReset} size="sm" variant="ghost">
            <RotateCcw size={16} />
          </NeonButton>
          <NeonButton onClick={handleSave} size="sm" variant="secondary">
            <Save size={16} />
          </NeonButton>
          <NeonButton onClick={handleShare} size="sm">
            <Share size={16} />
          </NeonButton>
        </div>
      </div>

      <div className="space-y-lg">
        {Object.entries(state.selectedEffect.defaultParams).map(([key, config]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {config.type === 'slider' ? (
              <NeonSlider
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={state.currentParams[key] || config.value}
                min={config.min || 0}
                max={config.max || 100}
                step={config.step || 1}
                onChange={(value) => handleParamChange(key, value)}
              />
            ) : config.type === 'color' ? (
              <div>
                <span className="label mb-sm block">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
                <div className="flex items-center gap-sm">
                  <input
                    type="color"
                    value={state.currentParams[key] || config.value}
                    onChange={(e) => handleParamChange(key, e.target.value)}
                    className="w-12 h-8 rounded border-2 border-primary-accent cursor-pointer"
                  />
                  <span className="text-accent font-mono text-sm">
                    {state.currentParams[key] || config.value}
                  </span>
                </div>
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
}