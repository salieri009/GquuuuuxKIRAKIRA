import * as THREE from "three";
import type { EffectModule, EffectObjects } from "@kirakira/effect-sdk";
import {
  createPointsMaterial,
  safeDisposeEffectRoot,
  releaseOrphanRoot,
  readNumber,
  setVertexColor,
  worldParticleSize,
  isGeometryLive,
} from "../../shared/particleUtils";
import { bindEffectModule } from "../../shared/bindEffectModule";

const KIRA_PALETTE = [
  "#FF66CC",
  "#66CCFF",
  "#FFDD44",
  "#AA88FF",
  "#44FFAA",
  "#FF8844",
];

interface SparkleState {
  phase: number;
  twinkle: number;
  orbit: number;
  hueOffset: number;
}

function createMoiréTexture(
  lineSpacing: number,
  angleRad: number,
): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(size / 2, size / 2);
  ctx.rotate(angleRad);
  ctx.translate(-size / 2, -size / 2);
  ctx.strokeStyle = "rgba(255,255,255,0.42)";
  ctx.lineWidth = 1.2;
  for (let x = -size; x < size * 2; x += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, -size);
    ctx.lineTo(x, size * 2);
    ctx.stroke();
  }
  ctx.restore();
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function hslSparkle(h: number, s: number, l: number): THREE.Color {
  return new THREE.Color().setHSL(h % 1, s, l);
}

class GQuaxKirakiraEffect implements EffectModule {
  private group: THREE.Group | null = null;
  private sparkles: THREE.Points | null = null;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.PointsMaterial | null = null;
  private moireLayers: THREE.Mesh[] = [];
  private coreSprite: THREE.Sprite | null = null;
  private coreLight: THREE.PointLight | null = null;
  private states: SparkleState[] = [];

  init(scene: THREE.Scene, params: Record<string, unknown>): EffectObjects {
    releaseOrphanRoot(scene, this.group);
    this.group = null;
    this.sparkles = null;
    this.geometry = null;
    this.material = null;
    this.moireLayers = [];
    this.coreSprite = null;
    this.coreLight = null;
    this.states = [];

    const sparkle = readNumber(params, "sparkle", 1);
    const moire = readNumber(params, "moire", 0.6);
    const intensity = readNumber(params, "intensity", 1);
    const count = Math.round(900 + sparkle * 1100);

    this.group = new THREE.Group();

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 0.4 + Math.pow(Math.random(), 0.55) * 2.8;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.65;
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const palette = KIRA_PALETTE[i % KIRA_PALETTE.length]!;
      setVertexColor(
        colors,
        i,
        new THREE.Color(palette),
        0.85 + Math.random() * 0.15,
      );

      this.states.push({
        phase: Math.random() * Math.PI * 2,
        twinkle: 0.4 + Math.random() * 0.6,
        orbit: 0.3 + Math.random() * 1.2,
        hueOffset: Math.random(),
      });
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const catalogSize = 0.03 + sparkle * 0.025;
    this.material = createPointsMaterial(
      catalogSize,
      Math.min(0.88 + intensity * 0.1, 0.98),
    );
    this.sparkles = new THREE.Points(this.geometry, this.material);
    this.group.add(this.sparkles);

    const moireAngles = [0, Math.PI / 7, -Math.PI / 5];
    moireAngles.forEach((angle, layer) => {
      const tex = createMoiréTexture(10 + layer * 2, angle);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: moire * (0.22 - layer * 0.04) * intensity,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 5.5), mat);
      plane.rotation.x = -Math.PI / 2 + layer * 0.12;
      plane.rotation.z = angle;
      plane.position.y = layer * 0.08 - 0.04;
      this.moireLayers.push(plane);
      this.group.add(plane);
    });

    const coreCanvas = document.createElement("canvas");
    coreCanvas.width = 128;
    coreCanvas.height = 128;
    const coreCtx = coreCanvas.getContext("2d")!;
    const coreGrad = coreCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    coreGrad.addColorStop(0, "rgba(255,255,255,1)");
    coreGrad.addColorStop(0.25, "rgba(255,200,255,0.7)");
    coreGrad.addColorStop(0.55, "rgba(120,200,255,0.25)");
    coreGrad.addColorStop(1, "rgba(255,255,255,0)");
    coreCtx.fillStyle = coreGrad;
    coreCtx.fillRect(0, 0, 128, 128);
    const coreTex = new THREE.CanvasTexture(coreCanvas);

    this.coreSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: coreTex,
        color: 0xffffff,
        transparent: true,
        opacity: 0.75 * intensity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.coreSprite.scale.set(1.6 + sparkle * 0.4, 1.6 + sparkle * 0.4, 1);
    this.group.add(this.coreSprite);

    this.coreLight = new THREE.PointLight(0xffaaff, 1.4 * intensity, 12, 2);
    this.coreLight.position.set(0, 0.2, 0);
    this.group.add(this.coreLight);

    scene.add(this.group);

    return { group: this.group };
  }

  update(
    objects: EffectObjects,
    params: Record<string, unknown>,
    deltaTime: number,
  ): void {
    if (
      !this.group ||
      !isGeometryLive(this.geometry) ||
      !this.material ||
      this.states.length === 0
    ) {
      return;
    }

    const sparkle = readNumber(params, "sparkle", 1);
    const moire = readNumber(params, "moire", 0.6);
    const intensity = readNumber(params, "intensity", 1);
    const hueSpeed = readNumber(params, "hueSpeed", 0.5);
    const time = performance.now() * 0.001;

    this.material.size = worldParticleSize(0.03 + sparkle * 0.025);
    this.material.opacity = Math.min(0.88 + intensity * 0.1, 0.98);

    const positions = this.geometry.attributes.position.array as Float32Array;
    const colors = this.geometry.attributes.color.array as Float32Array;
    const globalHue = (time * hueSpeed * 0.08) % 1;

    for (let i = 0; i < this.states.length; i++) {
      const state = this.states[i]!;
      const i3 = i * 3;
      const twinkle =
        0.55 +
        Math.abs(Math.sin(time * state.twinkle * 5 + state.phase)) * 0.45;
      const hue = (globalHue + state.hueOffset * 0.35) % 1;
      const c = hslSparkle(hue, 0.82, 0.58 + twinkle * 0.12);
      setVertexColor(colors, i, c, twinkle * intensity);

      const orbit = state.orbit * deltaTime * sparkle;
      const x = positions[i3]!;
      const y = positions[i3 + 1]!;
      const z = positions[i3 + 2]!;
      const dist = Math.sqrt(x * x + y * y + z * z) || 1;
      const nx = x / dist;
      const ny = y / dist;
      positions[i3] = x + (-ny * orbit + Math.sin(time + state.phase) * 0.002);
      positions[i3 + 1] =
        y + (nx * orbit * 0.5 + Math.cos(time * 1.3 + state.phase) * 0.0015);
      positions[i3 + 2] = z + Math.sin(time * 0.7 + state.phase) * orbit * 0.3;
    }

    if (!isGeometryLive(this.geometry)) return;

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;

    this.moireLayers.forEach((plane, layer) => {
      const mat = plane.material as THREE.MeshBasicMaterial;
      mat.opacity = moire * (0.22 - layer * 0.04) * intensity;
      plane.rotation.z += deltaTime * (0.15 + layer * 0.08) * hueSpeed;
      const map = mat.map;
      if (map) {
        map.offset.x = (time * 0.03 * hueSpeed) % 1;
        map.offset.y = (time * 0.02 * hueSpeed) % 1;
      }
    });

    if (this.coreSprite) {
      const mat = this.coreSprite.material as THREE.SpriteMaterial;
      mat.opacity = (0.65 + Math.sin(time * 3 * hueSpeed) * 0.12) * intensity;
      const pulse = 1 + Math.sin(time * 2.5) * 0.08 * sparkle;
      this.coreSprite.scale.set(
        (1.6 + sparkle * 0.4) * pulse,
        (1.6 + sparkle * 0.4) * pulse,
        1,
      );
    }

    if (this.coreLight) {
      this.coreLight.intensity = (1.2 + Math.sin(time * 4) * 0.35) * intensity;
      const lightHue = (globalHue + 0.15) % 1;
      this.coreLight.color.copy(hslSparkle(lightHue, 0.7, 0.62));
    }

    const group = objects.group as THREE.Group;
    if (group) group.rotation.y += deltaTime * 0.06 * hueSpeed;
  }

  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    const group = objects.group as THREE.Group;

    this.group = null;
    this.sparkles = null;
    this.geometry = null;
    this.material = null;
    this.moireLayers = [];
    this.coreSprite = null;
    this.coreLight = null;
    this.states = [];

    if (group) {
      safeDisposeEffectRoot(scene, group);
    }
  }
}

export default bindEffectModule(new GQuaxKirakiraEffect());
