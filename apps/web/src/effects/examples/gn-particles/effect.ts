import * as THREE from "three";
import type { EffectModule, EffectObjects } from "@kirakira/effect-sdk";
import {
  createPointsMaterial,
  readCount,
  readNumber,
  readSize,
  readString,
  setVertexColor,
  worldParticleSize,
  isGeometryLive,
  safeDisposeEffectRoot,
  releaseOrphanRoot,
} from "../../shared/particleUtils";
import { bindEffectModule } from "../../shared/bindEffectModule";

const GN_GREEN = "#00FF88";
const GN_GLOW = "#00FFAA";

interface ParticleState {
  phase: number;
  drift: number;
  life: number;
  lifeSpeed: number;
}

class GNParticleEffect implements EffectModule {
  private group: THREE.Group | null = null;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.PointsMaterial | null = null;
  private states: ParticleState[] = [];
  private driveY = -1.2;

  init(scene: THREE.Scene, params: Record<string, unknown>): EffectObjects {
    releaseOrphanRoot(scene, this.group);
    this.group = null;
    this.geometry = null;
    this.material = null;
    this.states = [];

    const count = Math.min(readCount(params, 1000), 3000);
    const size = readSize(params, 0.02);
    const color = readString(params, "color", GN_GREEN);

    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const base = new THREE.Color(color);
    const glow = new THREE.Color(GN_GLOW);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const cluster = 0.35 + Math.random() * 0.65;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.9 * cluster;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = this.driveY + (Math.random() - 0.2) * 0.6;
      positions[i3 + 2] = Math.sin(angle) * radius;

      const mix = Math.random();
      const c = base.clone().lerp(glow, mix * 0.45);
      const intensity = 0.65 + Math.random() * 0.35;
      colors[i3] = c.r * intensity;
      colors[i3 + 1] = c.g * intensity;
      colors[i3 + 2] = c.b * intensity;

      this.states.push({
        phase: Math.random() * Math.PI * 2,
        drift: 0.4 + Math.random() * 0.6,
        life: Math.random(),
        lifeSpeed: 0.15 + Math.random() * 0.25,
      });
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    this.material = createPointsMaterial(size, 0.92);

    const particles = new THREE.Points(this.geometry, this.material);

    const driveGlow = new THREE.PointLight(base, 0.6, 8);
    driveGlow.position.set(0, this.driveY, 0);

    this.group = new THREE.Group();
    this.group.add(particles);
    this.group.add(driveGlow);
    scene.add(this.group);

    return { group: this.group };
  }

  update(
    _objects: EffectObjects,
    params: Record<string, unknown>,
    deltaTime: number,
  ): void {
    if (!isGeometryLive(this.geometry) || !this.material) return;

    const speed = readNumber(params, "speed", 0.5);
    const size = readSize(params, 0.02);
    const color = readString(params, "color", GN_GREEN);
    const time = performance.now() * 0.001;

    this.material.size = worldParticleSize(size);

    const positions = this.geometry.attributes.position.array as Float32Array;
    const colors = this.geometry.attributes.color.array as Float32Array;
    const base = new THREE.Color(color);
    const glow = new THREE.Color(GN_GLOW);

    for (let i = 0; i < this.states.length; i++) {
      const i3 = i * 3;
      const state = this.states[i];

      state.life += deltaTime * state.lifeSpeed * speed;
      if (state.life >= 1) {
        state.life = 0;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.5;
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = this.driveY;
        positions[i3 + 2] = Math.sin(angle) * radius;
      }

      const rise = speed * deltaTime * (0.35 + state.drift * 0.4);
      positions[i3 + 1] += rise;
      positions[i3] +=
        Math.sin(time * 2.2 + state.phase) * speed * deltaTime * 0.12;
      positions[i3 + 2] +=
        Math.cos(time * 1.8 + state.phase) * speed * deltaTime * 0.1;

      if (positions[i3 + 1] > 3.5) {
        positions[i3 + 1] = this.driveY;
      }

      const fadeIn = Math.min(state.life * 3, 1);
      const fadeOut = 1 - Math.max(0, (state.life - 0.8) * 5);
      const brightness = 0.55 + fadeIn * fadeOut * 0.45;
      const c = base.clone().lerp(glow, state.drift * 0.35);
      setVertexColor(colors, i, c, brightness);
    }

    if (!isGeometryLive(this.geometry)) return;

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
  }

  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    const group = objects.group as THREE.Group | undefined;

    this.group = null;
    this.geometry = null;
    this.material = null;
    this.states = [];

    if (group) {
      safeDisposeEffectRoot(scene, group);
    }
  }
}

export default bindEffectModule(new GNParticleEffect());
