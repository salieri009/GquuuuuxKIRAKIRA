import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffectStore } from "../../store/effectStore";
import { useUIStore } from "../../store/uiStore";
import GlassPanel from "../ui/GlassPanel";
import Button from "../ui/Button";

export default function InfoPanel() {
  const isInfoPanelVisible = useUIStore((state) => state.isInfoPanelVisible);
  const toggleInfoPanel = useUIStore((state) => state.toggleInfoPanel);
  const { selectedEffect, currentParams } = useEffectStore();

  const closePanel = () => {
    if (isInfoPanelVisible) {
      toggleInfoPanel();
    }
  };

  return (
    <AnimatePresence>
      {isInfoPanelVisible && (
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
                <h2 className="text-lg font-semibold text-text-primary">
                  {selectedEffect?.name || "Kirakira"}
                </h2>
                <Button
                  onClick={closePanel}
                  size="sm"
                  variant="ghost"
                  aria-label="닫기"
                >
                  <X size={16} />
                </Button>
              </div>

              {selectedEffect ? (
                <div className="space-y-md">
                  <img
                    src={selectedEffect.thumbnail}
                    alt={selectedEffect.name}
                    className="w-full h-32 object-cover rounded-md border border-border-primary"
                  />

                  <div>
                    <h3 className="font-bold text-text-primary mb-sm">
                      Description
                    </h3>
                    <p className="text-sm text-text-secondary">
                      {selectedEffect.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-text-primary mb-sm">
                      Related Gundam
                    </h3>
                    <div className="flex flex-wrap gap-sm">
                      {selectedEffect.relatedGundam.map((gundam) => (
                        <span
                          key={gundam}
                          className="px-2 py-0.5 text-xs bg-surface text-text-muted rounded"
                        >
                          {gundam}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-text-primary mb-sm">
                      Parameters
                    </h3>
                    <div className="space-y-sm">
                      {Object.entries(selectedEffect.defaultParams).map(
                        ([key, config]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-text-secondary capitalize">
                              {key}
                            </span>
                            <span className="text-accent font-mono">
                              {currentParams[key]?.value ?? config.value}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-lg">
                  <h3 className="font-bold text-text-primary mb-sm">
                    Gundam Effects Simulator
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Experience the visual effects from various Gundam series in
                    real-time 3D. Select an effect from the library to get
                    started.
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
