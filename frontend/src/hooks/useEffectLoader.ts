import { useEffect, useCallback } from 'react';
import { useEffect as useEffectContext } from '../contexts/EffectContext';
import { fetchEffects } from '../services/effectService';

export function useEffectLoader() {
  const { state, dispatch } = useEffectContext();

  const loadEffects = useCallback(async () => {
    if (state.effects.length > 0) return;

    dispatch({ type: 'SET_LOADING' });
    
    try {
      const effects = await fetchEffects();
      dispatch({ type: 'SET_EFFECTS', payload: effects });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to load effects' 
      });
    }
  }, [state.effects.length, dispatch]);

  useEffect(() => {
    loadEffects();
  }, [loadEffects]);

  return {
    loadEffects,
    isLoading: state.status === 'loading',
    error: state.error,
    effects: state.effects
  };
}