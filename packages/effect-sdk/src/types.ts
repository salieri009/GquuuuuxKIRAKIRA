import type * as THREE from 'three';

/**
 * Three.js effect module runtime contract.
 * Distinct from @kirakira/contracts Effect (catalog DTO).
 */
export interface EffectModule {
  init: (scene: THREE.Scene, params: Record<string, unknown>) => EffectObjects;
  update: (
    objects: EffectObjects,
    params: Record<string, unknown>,
    deltaTime: number
  ) => void;
  dispose: (scene: THREE.Scene, objects: EffectObjects) => void;
}

export interface EffectObjects {
  [key: string]:
    | THREE.Object3D
    | THREE.Material
    | THREE.BufferGeometry
    | THREE.Texture
    | unknown;
}

export interface EffectMetadata {
  name: string;
  description: string;
  version: string;
  author?: string;
  category: string;
  tags: string[];
  performance: 'low' | 'medium' | 'high';
  thumbnail?: string;
}
