import React from 'react';
import { motion } from 'framer-motion';
import { EffectProvider } from './contexts/EffectContext';
import { UIProvider } from './contexts/UIContext';
import { useEffectLoader } from './hooks/useEffectLoader';
import { useResponsive } from './hooks/useResponsive';
import { useUI } from './contexts/UIContext';
import Header from './components/layout/Header';
import EffectCanvas from './components/effects/EffectCanvas';
import EffectLibrary from './components/effects/EffectLibrary';
import EffectControls from './components/effects/EffectControls';
import InfoPanel from './components/common/InfoPanel';
import './styles/variables.css';
import './styles/base.css';
import './styles/typography.css';
import './styles/components.css';

function AppContent() {
  useEffectLoader();
  useResponsive();
  const { state } = useUI();

  return (
    <div className="min-h-screen bg-primary-bg">
      <Header />
      <InfoPanel />
      
      <motion.main 
        className="flex h-[calc(100vh-80px)] gap-md p-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Left Sidebar - Effect Library */}
        {(state.isLibraryVisible && !state.isMobile) && (
          <motion.aside
            className="w-80 flex-shrink-0"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <EffectLibrary />
          </motion.aside>
        )}

        {/* Mobile Library Overlay */}
        {(state.isLibraryVisible && state.isMobile) && (
          <motion.div
            className="fixed inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <motion.div
              className="absolute top-0 left-0 w-4/5 h-full"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
            >
              <EffectLibrary />
            </motion.div>
          </motion.div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-md">
          {/* 3D Canvas */}
          <motion.div
            className="flex-1 min-h-0"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <EffectCanvas />
          </motion.div>

          {/* Bottom Controls */}
          {state.isControlsVisible && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <EffectControls />
            </motion.div>
          )}
        </div>
      </motion.main>
    </div>
  );
}

function App() {
  return (
    <UIProvider>
      <EffectProvider>
        <AppContent />
      </EffectProvider>
    </UIProvider>
  );
}

export default App;