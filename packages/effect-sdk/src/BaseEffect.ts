import * as THREE from 'three';
import type { EffectModule, EffectObjects } from './types';

/**
 * Base effect class with default dispose logic.
 */
export abstract class BaseEffect implements EffectModule {
  protected scene: THREE.Scene;
  protected params: Record<string, unknown>;
  protected objects: EffectObjects = {};
  protected clock: THREE.Clock;

  constructor(scene: THREE.Scene, params: Record<string, unknown> = {}) {
    this.scene = scene;
    this.params = params;
    this.clock = new THREE.Clock();
  }

  abstract init(scene: THREE.Scene, params: Record<string, unknown>): EffectObjects;

  update(objects: EffectObjects, params: Record<string, unknown>, deltaTime: number): void {
    this.params = params;
    this.objects = objects;
    this.onUpdate(deltaTime);
  }

  protected abstract onUpdate(deltaTime: number): void;

  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    Object.values(objects).forEach((obj) => {
      if (obj instanceof THREE.Object3D) {
        scene.remove(obj);
      }
    });

    Object.values(objects).forEach((obj) => {
      if (obj instanceof THREE.BufferGeometry) {
        obj.dispose();
      }
    });

    Object.values(objects).forEach((obj) => {
      if (obj instanceof THREE.Material) {
        obj.dispose();
      } else if (obj instanceof THREE.Mesh && obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat) => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    Object.values(objects).forEach((obj) => {
      if (obj instanceof THREE.Texture) {
        obj.dispose();
      } else if (obj instanceof THREE.Material && 'map' in obj && obj.map instanceof THREE.Texture) {
        obj.map.dispose();
      }
    });

    this.objects = {};
  }

  protected updateParams(newParams: Record<string, unknown>): void {
    this.params = { ...this.params, ...newParams };
  }
}
