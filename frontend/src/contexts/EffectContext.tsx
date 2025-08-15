import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface Effect {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  relatedGundam: string[];
  defaultParams: {
    [key: string]: {
      type: 'slider' | 'color';
      value: number | string;
      min?: number;
      max?: number;
      step?: number;
    };
  };
}

interface EffectState {
  effects: Effect[];
  selectedEffect: Effect | null;
  currentParams: Record<string, any>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

type EffectAction =
  | { type: 'SET_LOADING' }
  | { type: 'SET_EFFECTS'; payload: Effect[] }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SELECT_EFFECT'; payload: Effect }
  | { type: 'UPDATE_PARAM'; payload: { key: string; value: any } }
  | { type: 'RESET_PARAMS' };

const initialState: EffectState = {
  effects: [],
  selectedEffect: null,
  currentParams: {},
  status: 'idle',
  error: null,
};

function effectReducer(state: EffectState, action: EffectAction): EffectState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, status: 'loading', error: null };
    
    case 'SET_EFFECTS':
      return { 
        ...state, 
        effects: action.payload, 
        status: 'succeeded',
        selectedEffect: action.payload[0] || null,
        currentParams: action.payload[0] ? 
          Object.fromEntries(
            Object.entries(action.payload[0].defaultParams).map(([key, config]) => [key, config.value])
          ) : {}
      };
    
    case 'SET_ERROR':
      return { ...state, status: 'failed', error: action.payload };
    
    case 'SELECT_EFFECT':
      return {
        ...state,
        selectedEffect: action.payload,
        currentParams: Object.fromEntries(
          Object.entries(action.payload.defaultParams).map(([key, config]) => [key, config.value])
        ),
      };
    
    case 'UPDATE_PARAM':
      return {
        ...state,
        currentParams: {
          ...state.currentParams,
          [action.payload.key]: action.payload.value,
        },
      };
    
    case 'RESET_PARAMS':
      if (!state.selectedEffect) return state;
      return {
        ...state,
        currentParams: Object.fromEntries(
          Object.entries(state.selectedEffect.defaultParams).map(([key, config]) => [key, config.value])
        ),
      };
    
    default:
      return state;
  }
}

const EffectContext = createContext<{
  state: EffectState;
  dispatch: React.Dispatch<EffectAction>;
} | null>(null);

export function EffectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(effectReducer, initialState);

  return (
    <EffectContext.Provider value={{ state, dispatch }}>
      {children}
    </EffectContext.Provider>
  );
}

export function useEffect() {
  const context = useContext(EffectContext);
  if (!context) {
    throw new Error('useEffect must be used within an EffectProvider');
  }
  return context;
}