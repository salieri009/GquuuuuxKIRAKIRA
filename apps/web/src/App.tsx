import React, { Suspense, lazy } from "react";
import { MotionConfig } from "framer-motion";
import { useEffectLoader } from "./hooks/useEffectLoader";
import { useUIStore } from "./store/uiStore";
import Header from "./components/layout/Header";
import EffectLibrary from "./components/effects/EffectLibrary";
import EffectControls from "./components/effects/EffectControls";
import InfoPanel from "./components/common/InfoPanel";
import HelpPanel from "./components/common/HelpPanel";
import PresetManager from "./components/common/PresetManager";
import ErrorBoundary from "./components/common/ErrorBoundary";
import ToastContainer from "./components/ui/ToastContainer";
import PerformanceMonitor from "./components/ui/PerformanceMonitor";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { EffectService } from "./services/effectService";
import "./styles/variables.css";
import "./styles/base.css";
import "./styles/typography.css";
import "./styles/components.css";

const EffectCanvas = lazy(() => import("./components/effects/EffectCanvas"));

const effectsPath = import.meta.env.VITE_EFFECTS_PATH || "/effects";
EffectService.setBasePath(effectsPath);

function AppContent() {
  useEffectLoader();
  const isLibraryVisible = useUIStore((state) => state.isLibraryVisible);
  const isControlsVisible = useUIStore((state) => state.isControlsVisible);
  const isMobile = useUIStore((state) => state.isMobile);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-primary-bg">
        <Header />
        <InfoPanel />
        <HelpPanel />
        <PresetManager />
        <ToastContainer />

        <main className="flex h-[calc(100vh-3.5rem)] gap-4 p-4">
          {isLibraryVisible && !isMobile && (
            <aside className="w-80 flex-shrink-0">
              <EffectLibrary />
            </aside>
          )}

          {isLibraryVisible && isMobile && (
            <div className="fixed inset-0 z-30">
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => useUIStore.getState().toggleLibrary()}
                aria-hidden
              />
              <div className="absolute top-0 left-0 w-[85%] max-w-sm h-full">
                <EffectLibrary />
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="flex-1 min-h-0">
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center rounded-lg border border-border-primary bg-secondary-bg">
                    <LoadingSpinner />
                  </div>
                }
              >
                <EffectCanvas />
              </Suspense>
            </div>

            {isControlsVisible && <EffectControls />}
          </div>
        </main>

        {import.meta.env.DEV && <PerformanceMonitor />}
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="never">
      <AppContent />
    </MotionConfig>
  );
}
export default App;
