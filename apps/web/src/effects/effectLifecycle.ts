import type * as THREE from "three";
import type { EffectModule } from "@kirakira/effect-sdk";

export interface EffectInstance {
  module: EffectModule;
  objects: unknown;
}

export function shouldAbortEffectLoad(
  loadGeneration: number,
  expectedGeneration: number,
  mounted: boolean,
): boolean {
  return !mounted || loadGeneration !== expectedGeneration;
}

export function disposeEffectInstance(
  container: THREE.Object3D,
  instance: EffectInstance | null,
): void {
  if (!instance) return;
  instance.module.dispose(container as THREE.Scene, instance.objects);
}

/**
 * Dispose previous effect, init the next, and roll back if the load was superseded.
 * Caller must set effectRef to null before calling when swapping during an active frame.
 */
export function commitEffectLoad(options: {
  container: THREE.Object3D;
  module: EffectModule;
  initParams: Record<string, unknown>;
  previous: EffectInstance | null;
  generation: number;
  loadGeneration: number;
  mounted: boolean;
}): EffectInstance | null {
  const {
    container,
    module,
    initParams,
    previous,
    generation,
    loadGeneration,
    mounted,
  } = options;

  disposeEffectInstance(container, previous);

  if (shouldAbortEffectLoad(loadGeneration, generation, mounted)) {
    return null;
  }

  const objects = module.init(container as THREE.Scene, initParams);

  if (shouldAbortEffectLoad(loadGeneration, generation, mounted)) {
    module.dispose(container as THREE.Scene, objects);
    return null;
  }

  return { module, objects };
}
