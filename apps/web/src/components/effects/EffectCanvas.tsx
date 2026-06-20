import React, {
  useRef,
  useLayoutEffect,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";
import { useEffectStore } from "../../store/effectStore";
import { EffectService } from "../../services/effectService";
import type { EffectInstance } from "../../effects/effectLifecycle";
import {
  commitEffectLoad,
  disposeEffectInstance,
} from "../../effects/effectLifecycle";
import {
  pruneInvalidRenderables,
  detachAllChildren,
} from "../../effects/shared/particleUtils";
import {
  logInvalidRenderables,
  installEffectCanvasErrorProbe,
  logEffectLifecycle,
} from "../../effects/shared/effectCanvasDiagnostics";
import LoadingSpinner from "../ui/LoadingSpinner";
import ProgressBar from "../ui/ProgressBar";
import Button from "../ui/Button";
import { getUserFriendlyMessage } from "../../utils/errorHandler";
import { readCurrentEffectParams } from "../../utils/effectParams";

function CanvasOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary-bg bg-opacity-90 z-10">
      {children}
    </div>
  );
}

function SceneGuard() {
  const scene = useThree((state) => state.scene);

  useFrame(() => {
    pruneInvalidRenderables(scene);
    logInvalidRenderables(scene);
  }, -1000);

  return null;
}

function EffectScene() {
  const hostRef = useRef<THREE.Group | null>(null);
  const [hostReady, setHostReady] = useState(false);
  const runtimeRef = useRef<EffectInstance | null>(null);
  const loadGeneration = useRef(0);
  const swappingRef = useRef(false);

  const effectId = useEffectStore((state) => state.selectedEffect?.id);

  const setHost = useCallback((node: THREE.Group | null) => {
    hostRef.current = node;
    setHostReady(node != null);
  }, []);

  useEffect(() => {
    return installEffectCanvasErrorProbe(() => ({
      effectId,
      generation: loadGeneration.current,
    }));
  }, [effectId]);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host || !effectId || !hostReady) {
      return undefined;
    }

    const generation = ++loadGeneration.current;
    let alive = true;

    const endSwap = () => {
      requestAnimationFrame(() => {
        swappingRef.current = false;
        if (import.meta.env.DEV) {
          logEffectLifecycle(
            "swap-end",
            effectId,
            generation,
            host.children.length,
          );
        }
      });
    };

    const load = async () => {
      try {
        swappingRef.current = true;
        if (import.meta.env.DEV) {
          logEffectLifecycle(
            "swap-start",
            effectId,
            generation,
            host.children.length,
          );
        }

        const previous = runtimeRef.current;
        runtimeRef.current = null;

        const module = await EffectService.loadEffectModule(effectId);
        if (!alive || loadGeneration.current !== generation) {
          endSwap();
          return;
        }

        detachAllChildren(host);

        const committed = commitEffectLoad({
          container: host,
          module,
          initParams: readCurrentEffectParams(),
          previous,
          generation,
          loadGeneration: loadGeneration.current,
          mounted: alive,
        });

        if (!committed) {
          endSwap();
          return;
        }

        runtimeRef.current = committed;
        if (import.meta.env.DEV) {
          logEffectLifecycle(
            "init",
            effectId,
            generation,
            host.children.length,
          );
        }
        endSwap();
      } catch (error) {
        swappingRef.current = false;
        console.error("Effect load error:", error);
      }
    };

    void load();

    return () => {
      alive = false;
      loadGeneration.current += 1;
      swappingRef.current = true;
      const previous = runtimeRef.current;
      runtimeRef.current = null;
      if (previous) {
        detachAllChildren(host);
        disposeEffectInstance(host, previous);
        if (import.meta.env.DEV) {
          logEffectLifecycle(
            "dispose",
            effectId,
            loadGeneration.current,
            host.children.length,
          );
        }
      }
    };
  }, [effectId, hostReady]);

  useFrame((_state, delta) => {
    if (swappingRef.current) return;

    const runtime = runtimeRef.current;
    if (!runtime) return;

    runtime.module.update(runtime.objects, readCurrentEffectParams(), delta);
  });

  return (
    <>
      <SceneGuard />
      <group ref={setHost} />
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </>
  );
}

export default function EffectCanvas() {
  const { selectedEffect, status, progress, error } = useEffectStore();
  const [moduleError, setModuleError] = useState(null as string | null);
  const [isRetrying, setIsRetrying] = useState(false);

  const isLoading = status === "loading" || isRetrying;
  const loadError =
    moduleError ??
    (status === "failed" ? error || "효과를 로드할 수 없습니다." : null);

  useEffect(() => {
    if (status === "succeeded") {
      setModuleError(null);
    }
  }, [status]);

  const handleRetry = async () => {
    if (!selectedEffect) return;

    setModuleError(null);
    setIsRetrying(true);
    try {
      await EffectService.loadEffectModule(selectedEffect.id);
    } catch (err) {
      setModuleError(
        getUserFriendlyMessage(
          err instanceof Error ? err : new Error(String(err)),
        ),
      );
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <motion.div
      className="relative w-full h-full bg-primary-bg rounded-lg overflow-hidden border border-border-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {isLoading && (
        <CanvasOverlay>
          <LoadingSpinner size="lg" />
          <p className="mt-md text-sm text-muted">
            {selectedEffect
              ? `Loading ${selectedEffect.name}...`
              : "Loading effect..."}
          </p>
          {progress > 0 && progress < 100 && (
            <div className="mt-md w-64">
              <ProgressBar progress={progress} showPercentage />
            </div>
          )}
        </CanvasOverlay>
      )}

      {loadError && (
        <CanvasOverlay>
          <div className="text-center max-w-md">
            <p className="text-danger mb-md">{loadError}</p>
            <Button variant="primary" size="sm" onClick={handleRetry}>
              Retry
            </Button>
          </div>
        </CanvasOverlay>
      )}

      <Canvas
        frameloop="always"
        camera={{ position: [0, 0, 5] }}
        style={{ background: "transparent" }}
      >
        <EffectScene />
      </Canvas>
      {selectedEffect && !isLoading && !loadError && (
        <div className="absolute bottom-4 left-4 glass-panel p-sm">
          <h3 className="text-sm font-medium text-text-primary">
            {selectedEffect.name}
          </h3>
          <p className="text-xs text-muted mt-xs">
            {selectedEffect.relatedGundam.join(", ")}
          </p>
        </div>
      )}
    </motion.div>
  );
}
