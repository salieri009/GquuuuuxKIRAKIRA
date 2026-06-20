import * as THREE from "three";
import type { EffectModule, EffectObjects } from "@kirakira/effect-sdk";
import {
  createPointsMaterial,
  readNumber,
  readString,
  safeDisposeEffectRoot,
  releaseOrphanRoot,
  worldParticleSize,
  setVertexColor,
  isGeometryLive,
} from "../../shared/particleUtils";
import { bindEffectModule } from "../../shared/bindEffectModule";

const MINOVSKY_BLUE = "#00AAFF";
const MINOVSKY_DEEP = "#0088DD";
const INTERFERENCE = "#FF6666";

function densityToCount(density: number): number {
  return Math.round(300 + density * 2700);
}

class MinovskyParticleEffect implements EffectModule {
  private group: THREE.Group | null = null;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.PointsMaterial | null = null;
  private basePositions: Float32Array | null = null;
  private isInterference: Uint8Array | null = null;
  private fogMesh: THREE.Mesh | null = null;

  init(scene: THREE.Scene, params: Record<string, unknown>): EffectObjects {
    releaseOrphanRoot(scene, this.group);
    this.group = null;
    this.geometry = null;
    this.material = null;
    this.basePositions = null;
    this.isInterference = null;
    this.fogMesh = null;

    const density = readNumber(params, "density", 0.3);
    const color = readString(params, "color", MINOVSKY_BLUE);
    const opacity = readNumber(params, "opacity", 0.7);
    const particleCount = densityToCount(density);
    const spread = 14;

    this.group = new THREE.Group();

    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    this.basePositions = new Float32Array(particleCount * 3);
    this.isInterference = new Uint8Array(particleCount);

    const primary = new THREE.Color(color);
    const deep = new THREE.Color(MINOVSKY_DEEP);
    const interference = new THREE.Color(INTERFERENCE);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spread * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * spread * 1.1;
      positions[i3 + 2] = (Math.random() - 0.5) * spread * 2;

      this.basePositions[i3] = positions[i3];
      this.basePositions[i3 + 1] = positions[i3 + 1];
      this.basePositions[i3 + 2] = positions[i3 + 2];

      const isNoise =
        Math.random() < 0.08 * readNumber(params, "turbulence", 0.5);
      this.isInterference[i] = isNoise ? 1 : 0;

      const c = isNoise
        ? interference
        : primary.clone().lerp(deep, Math.random() * 0.5);
      const brightness = isNoise ? 1.0 : 0.75 + Math.random() * 0.25;
      setVertexColor(colors, i, c, brightness);
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleSize = 0.04 + density * 0.05;
    this.material = createPointsMaterial(
      particleSize,
      Math.min(0.55 + opacity * 0.4, 0.95),
    );

    const particles = new THREE.Points(this.geometry, this.material);
    this.group.add(particles);

    const fogMat = new THREE.MeshBasicMaterial({
      color: primary,
      transparent: true,
      opacity: 0.04 + density * 0.06,
      depthWrite: false,
      side: THREE.BackSide,
    });
    this.fogMesh = new THREE.Mesh(
      new THREE.SphereGeometry(spread * 0.95, 32, 32),
      fogMat,
    );
    this.group.add(this.fogMesh);

    scene.add(this.group);

    return { group: this.group };
  }

  update(
    objects: EffectObjects,
    params: Record<string, unknown>,
    deltaTime: number,
  ): void {
    if (
      !isGeometryLive(this.geometry) ||
      !this.material ||
      !this.basePositions ||
      !this.isInterference
    )
      return;

    const turbulence = readNumber(params, "turbulence", 0.5);
    const color = readString(params, "color", MINOVSKY_BLUE);
    const opacity = readNumber(params, "opacity", 0.7);
    const time = performance.now() * 0.001;

    this.material.opacity = Math.min(0.55 + opacity * 0.4, 0.95);
    this.material.size = worldParticleSize(
      0.04 + readNumber(params, "density", 0.3) * 0.05,
    );

    if (this.fogMesh) {
      const fogMat = this.fogMesh.material as THREE.MeshBasicMaterial;
      fogMat.color.set(color);
      fogMat.opacity = 0.04 + readNumber(params, "density", 0.3) * 0.06;
    }

    const positions = this.geometry.attributes.position.array as Float32Array;
    const colors = this.geometry.attributes.color.array as Float32Array;
    const primary = new THREE.Color(color);
    const interference = new THREE.Color(INTERFERENCE);
    const brownian = turbulence * deltaTime * 0.22;

    for (let i = 0; i < positions.length; i += 3) {
      const idx = i / 3;
      const bx = this.basePositions[i];
      const by = this.basePositions[i + 1];
      const bz = this.basePositions[i + 2];

      positions[i] =
        bx +
        (Math.random() - 0.5) * brownian +
        Math.sin(time * 0.5 + idx * 0.11) * turbulence * 0.15;
      positions[i + 1] =
        by +
        (Math.random() - 0.5) * brownian * 0.6 +
        Math.cos(time * 0.4 + idx * 0.09) * turbulence * 0.1;
      positions[i + 2] =
        bz +
        (Math.random() - 0.5) * brownian +
        Math.sin(time * 0.55 + idx * 0.13) * turbulence * 0.15;

      if (this.isInterference[idx]) {
        const flicker = 0.65 + Math.abs(Math.sin(time * 12 + idx)) * 0.35;
        setVertexColor(colors, idx, interference, flicker);
      } else {
        const pulse = 0.7 + Math.sin(time * 0.8 + idx * 0.05) * 0.15;
        setVertexColor(colors, idx, primary, pulse);
      }
    }

    if (!isGeometryLive(this.geometry)) return;

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;

    const group = objects.group as THREE.Group;
    if (group) group.rotation.y += deltaTime * 0.02;
  }

  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    const group = objects.group as THREE.Group;

    this.group = null;
    this.geometry = null;
    this.material = null;
    this.basePositions = null;
    this.isInterference = null;
    this.fogMesh = null;

    if (group) {
      safeDisposeEffectRoot(scene, group);
    }
  }
}

export default bindEffectModule(new MinovskyParticleEffect());
