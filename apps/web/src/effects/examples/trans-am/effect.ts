import * as THREE from "three";
import type { EffectModule, EffectObjects } from "@kirakira/effect-sdk";
import {
  createPointsMaterial,
  readNumber,
  readString,
  safeDisposeEffectRoot,
  releaseOrphanRoot,
  worldParticleSize,
  isGeometryLive,
} from "../../shared/particleUtils";
import { bindEffectModule } from "../../shared/bindEffectModule";

const GN_GREEN = "#00FF88";
const TRANS_RED = "#FF0044";
const TRANS_PINK = "#FF1493";

function powerToCount(power: number): number {
  return Math.round(600 + power * 700);
}

interface AfterimageTrail {
  mesh: THREE.Mesh;
  life: number;
}

class TransAmEffect implements EffectModule {
  private group: THREE.Group | null = null;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.PointsMaterial | null = null;
  private velocities: Float32Array | null = null;
  private elapsed = 0;
  private trails: AfterimageTrail[] = [];
  private coreBurst: THREE.Sprite | null = null;
  private driveLights: THREE.PointLight[] = [];

  init(scene: THREE.Scene, params: Record<string, unknown>): EffectObjects {
    releaseOrphanRoot(scene, this.group);
    this.group = null;
    this.geometry = null;
    this.material = null;
    this.velocities = null;
    this.trails = [];
    this.coreBurst = null;
    this.driveLights = [];

    const power = readNumber(params, "power", 2.0);
    const heat = readNumber(params, "heat", 0.8);
    const color = readString(params, "color", TRANS_RED);
    const afterglow = readNumber(params, "afterglow", 1.5);
    const count = powerToCount(power);

    this.group = new THREE.Group();
    this.elapsed = 0;
    this.trails = [];

    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);

    const red = new THREE.Color(color);
    const pink = new THREE.Color(TRANS_PINK);
    const green = new THREE.Color(GN_GREEN);
    const hot = red.clone().lerp(new THREE.Color("#FF6600"), heat * 0.5);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.25;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.2 - 0.8;
      positions[i3 + 2] = Math.sin(angle) * radius;

      const speed = (0.8 + Math.random() * 1.8) * power * 0.35;
      const dir = new THREE.Vector3(
        Math.cos(angle) + (Math.random() - 0.5) * 0.3,
        0.2 + Math.random() * 0.6,
        Math.sin(angle) + (Math.random() - 0.5) * 0.3,
      ).normalize();

      this.velocities[i3] = dir.x * speed;
      this.velocities[i3 + 1] = dir.y * speed;
      this.velocities[i3 + 2] = dir.z * speed;

      const c = green.clone().lerp(Math.random() > 0.5 ? pink : hot, 0.15);
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    this.material = createPointsMaterial(0.05 + heat * 0.04, 0.95);

    const particles = new THREE.Points(this.geometry, this.material);
    this.group.add(particles);

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,100,150,0.6)");
    g.addColorStop(1, "rgba(255,0,68,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);

    this.coreBurst = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(canvas),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.coreBurst.position.set(0, -0.8, 0);
    this.coreBurst.scale.set(2.5, 2.5, 1);
    this.group.add(this.coreBurst);

    const trailCount = Math.round(2 + afterglow * 2);
    for (let t = 0; t < trailCount; t++) {
      const trail = new THREE.Mesh(
        new THREE.SphereGeometry(0.35 + t * 0.25, 12, 12),
        new THREE.MeshBasicMaterial({
          color: TRANS_PINK,
          transparent: true,
          opacity: 0.06 / (t + 1),
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      this.group.add(trail);
      this.trails.push({ mesh: trail, life: t * 0.15 });
    }

    this.driveLights = [
      new THREE.PointLight(new THREE.Color(GN_GREEN), 1.2, 10),
      new THREE.PointLight(new THREE.Color(GN_GREEN), 1.2, 10),
    ];
    this.driveLights[0].position.set(-0.35, -0.9, 0);
    this.driveLights[1].position.set(0.35, -0.9, 0);
    this.driveLights.forEach((l) => this.group!.add(l));

    scene.add(this.group);

    return { group: this.group };
  }

  update(
    _objects: EffectObjects,
    params: Record<string, unknown>,
    deltaTime: number,
  ): void {
    if (
      !isGeometryLive(this.geometry) ||
      !this.material ||
      !this.velocities ||
      !this.group
    )
      return;

    this.elapsed += deltaTime;
    const power = readNumber(params, "power", 2.0);
    const heat = readNumber(params, "heat", 0.8);
    const afterglow = readNumber(params, "afterglow", 1.5);
    const color = readString(params, "color", TRANS_RED);
    const time = performance.now() * 0.001;

    const activation = Math.min(this.elapsed / 0.5, 1);
    const red = new THREE.Color(color);
    const pink = new THREE.Color(TRANS_PINK);
    const green = new THREE.Color(GN_GREEN);
    const hot = red.clone().lerp(new THREE.Color("#FF6600"), heat * 0.5);
    const blendColor = green.clone().lerp(red, activation);

    this.material.size = worldParticleSize(0.05 + heat * 0.04);
    const pulse = 1.1 + Math.sin(time * 4) * 0.25 * heat;
    this.material.opacity = 0.85 * pulse;

    const positions = this.geometry.attributes.position.array as Float32Array;
    const colors = this.geometry.attributes.color.array as Float32Array;
    const limit = 5 + power * 1.2;

    let cx = 0;
    let cy = 0;
    let cz = 0;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += this.velocities[i] * deltaTime * power;
      positions[i + 1] += this.velocities[i + 1] * deltaTime * power;
      positions[i + 2] += this.velocities[i + 2] * deltaTime * power;

      cx += positions[i];
      cy += positions[i + 1];
      cz += positions[i + 2];

      const dist = Math.hypot(positions[i], positions[i + 1], positions[i + 2]);
      if (dist > limit) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.6 + Math.random()) * power * 0.35;
        positions[i] = Math.cos(angle) * 0.15;
        positions[i + 1] = -0.85 + Math.random() * 0.1;
        positions[i + 2] = Math.sin(angle) * 0.15;
        this.velocities[i] = Math.cos(angle) * speed;
        this.velocities[i + 1] = (0.3 + Math.random() * 0.5) * speed;
        this.velocities[i + 2] = Math.sin(angle) * speed;
      }

      const c = blendColor
        .clone()
        .lerp(Math.random() > 0.3 ? pink : hot, activation);
      colors[i] = c.r;
      colors[i + 1] = c.g;
      colors[i + 2] = c.b;
    }

    const n = positions.length / 3;
    cx /= n;
    cy /= n;
    cz /= n;

    if (!isGeometryLive(this.geometry)) return;

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;

    this.group.rotation.y += deltaTime * 0.2 * power;

    if (this.coreBurst) {
      const mat = this.coreBurst.material as THREE.SpriteMaterial;
      mat.color.copy(activation < 0.3 ? green : red);
      const flash = activation < 0.3 ? 1.5 : 1 + Math.sin(time * 8) * 0.2;
      this.coreBurst.scale.set(2.5 * flash, 2.5 * flash, 1);
      mat.opacity = (activation < 0.3 ? 1.2 : 0.85) * heat;
    }

    for (const light of this.driveLights) {
      light.color.copy(blendColor);
      light.intensity =
        (1 + activation * 1.5) * heat * (1 + Math.sin(time * 6) * 0.15);
    }

    for (const trail of this.trails) {
      trail.life += deltaTime * afterglow * 0.5;
      const lag = 0.3 + trail.life * 0.2;
      trail.mesh.position.set(cx * (1 - lag * 0.1), cy, cz * (1 - lag * 0.1));
      const mat = trail.mesh.material as THREE.MeshBasicMaterial;
      mat.color.copy(pink);
      mat.opacity = (0.08 / (trail.life + 1)) * afterglow * activation;
      const s = (1 + trail.life * 0.15) * (0.9 + heat * 0.2);
      trail.mesh.scale.setScalar(s);
      if (trail.life > 3) trail.life = 0;
    }
  }

  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    const group = objects.group as THREE.Group;

    this.group = null;
    this.geometry = null;
    this.material = null;
    this.velocities = null;
    this.trails = [];
    this.coreBurst = null;
    this.driveLights = [];

    if (group) {
      safeDisposeEffectRoot(scene, group);
    }
  }
}

export default bindEffectModule(new TransAmEffect());
