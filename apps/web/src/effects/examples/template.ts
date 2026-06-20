import * as THREE from "three";
import type { EffectModule, EffectObjects } from "@kirakira/effect-sdk";
import { bindEffectModule } from "../shared/bindEffectModule";
import {
  releaseOrphanRoot,
  safeDisposeEffectRoot,
} from "../shared/particleUtils";

class MyEffect implements EffectModule {
  private group: THREE.Group | null = null;
  private mesh: THREE.Mesh | null = null;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.MeshStandardMaterial | null = null;

  init(scene: THREE.Scene, params: Record<string, unknown>): EffectObjects {
    releaseOrphanRoot(scene, this.group);
    this.group = null;
    this.mesh = null;
    this.geometry = null;
    this.material = null;

    const size = typeof params.size === "number" ? params.size : 1;
    const color = typeof params.color === "string" ? params.color : "#00FF88";

    this.geometry = new THREE.BoxGeometry(size, size, size);
    this.material = new THREE.MeshStandardMaterial({ color });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.group = new THREE.Group();
    this.group.add(this.mesh);
    scene.add(this.group);

    return { group: this.group };
  }

  update(
    _objects: EffectObjects,
    params: Record<string, unknown>,
    deltaTime: number,
  ): void {
    if (!this.mesh || !this.material) return;

    const speed = typeof params.speed === "number" ? params.speed : 1;
    this.mesh.rotation.y += deltaTime * speed * 0.3;

    if (typeof params.color === "string") {
      this.material.color.set(params.color);
    }
  }

  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    const group = objects.group as THREE.Group | undefined;

    this.group = null;
    this.mesh = null;
    this.geometry = null;
    this.material = null;

    if (group) {
      safeDisposeEffectRoot(scene, group);
    }
  }
}

export default bindEffectModule(new MyEffect());
