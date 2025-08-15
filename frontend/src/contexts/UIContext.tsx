import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface UIState {
  isInfoPanelVisible: boolean;
  isLibraryVisible: boolean;
  isControlsVisible: boolean;
  isMobile: boolean;
}

type UIAction =
  | { type: 'TOGGLE_INFO_PANEL' }
  | { type: 'TOGGLE_LIBRARY' }
  | { type: 'TOGGLE_CONTROLS' }
  | { type: 'SET_MOBILE'; payload: boolean }
  | { type: 'CLOSE_ALL_PANELS' };

const initialState: UIState = {
  isInfoPanelVisible: false,
  isLibraryVisible: true,
  isControlsVisible: true,
  isMobile: false,
};

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'TOGGLE_INFO_PANEL':
      return { ...state, isInfoPanelVisible: !state.isInfoPanelVisible };
    
    case 'TOGGLE_LIBRARY':
      return { ...state, isLibraryVisible: !state.isLibraryVisible };
    
    case 'TOGGLE_CONTROLS':
      return { ...state, isControlsVisible: !state.isControlsVisible };
    
    case 'SET_MOBILE':
      return { 
        ...state, 
        isMobile: action.payload,
        isLibraryVisible: action.payload ? false : state.isLibraryVisible,
      };
    
    case 'CLOSE_ALL_PANELS':
      return {
        ...state,
        isInfoPanelVisible: false,
        isLibraryVisible: false,
        isControlsVisible: false,
      };
    
    default:
      return state;
  }
}

const UIContext = createContext<{
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
} | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  return (
    <UIContext.Provider value={{ state, dispatch }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}