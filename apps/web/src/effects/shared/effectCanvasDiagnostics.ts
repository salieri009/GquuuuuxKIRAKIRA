import * as THREE from "three";
import { isRenderableLive } from "./particleUtils";

const PREFIX = "[EffectCanvas:diag]";

export function logEffectLifecycle(
  phase: "init" | "dispose" | "swap-start" | "swap-end" | "error",
  effectId: string | undefined,
  generation: number,
  hostChildCount: number,
): void {
  if (!import.meta.env.DEV) return;
  console.debug(PREFIX, phase, {
    effectId,
    generation,
    hostChildCount,
    t: performance.now(),
  });
}

export function installEffectCanvasErrorProbe(
  getContext: () => { effectId?: string; generation: number },
): () => void {
  if (!import.meta.env.DEV) return () => undefined;

  const handler = (event: ErrorEvent) => {
    const message = event.message ?? "";
    if (!message.includes("length") && !message.includes("updateBuffer"))
      return;
    const ctx = getContext();
    console.error(PREFIX, "uncaught", {
      message,
      stack: event.error?.stack,
      effectId: ctx.effectId,
      generation: ctx.generation,
    });
  };

  window.addEventListener("error", handler);
  return () => window.removeEventListener("error", handler);
}

export function findInvalidRenderables(root: THREE.Object3D): string[] {
  if (!import.meta.env.DEV) return [];

  const invalid: string[] = [];
  root.traverse((child) => {
    if (!isRenderableLive(child)) {
      invalid.push(`${child.type}:${child.uuid}`);
    }
  });
  return invalid;
}

export function logInvalidRenderables(root: THREE.Object3D): void {
  const invalid = findInvalidRenderables(root);
  if (invalid.length > 0) {
    console.debug(PREFIX, "invalid-renderables", invalid);
  }
}
