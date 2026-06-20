import * as THREE from "three";
import type { EffectModule, EffectObjects } from "@kirakira/effect-sdk";
import {
  readNumber,
  readString,
  safeDisposeEffectRoot,
  releaseOrphanRoot,
  isRenderableLive,
} from "../../shared/particleUtils";
import { bindEffectModule } from "../../shared/bindEffectModule";

const NEWTYPE_MAGENTA = "#FF00FF";
const NEWTYPE_CYAN = "#00FFFF";
const NEWTYPE_GOLD = "#FFD700";

interface RippleLayer {
  outer: THREE.Mesh;
  inner: THREE.Mesh;
  progress: number;
  speed: number;
}

class NewtypeFlashEffect implements EffectModule {
  private group: THREE.Group | null = null;
  private ripples: RippleLayer[] = [];
  private coreLight: THREE.PointLight | null = null;
  private coreSprite: THREE.Sprite | null = null;

  init(scene: THREE.Scene, params: Record<string, unknown>): EffectObjects {
    releaseOrphanRoot(scene, this.group);
    this.group = null;
    this.ripples = [];
    this.coreLight = null;
    this.coreSprite = null;

    const rippleCount = Math.round(readNumber(params, "ripples", 3));
    const intensity = readNumber(params, "intensity", 0.8);
    const baseColor = readString(params, "color", NEWTYPE_MAGENTA);

    this.group = new THREE.Group();

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.4)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const coreTex = new THREE.CanvasTexture(canvas);

    this.coreSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: coreTex,
        color: new THREE.Color(baseColor),
        transparent: true,
        opacity: 0.9 * intensity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.coreSprite.scale.set(1.2, 1.2, 1);
    this.group.add(this.coreSprite);

    for (let i = 0; i < rippleCount; i++) {
      const outerMat = new THREE.MeshBasicMaterial({
        color: NEWTYPE_CYAN,
        transparent: true,
        opacity: 0.55 * intensity,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const innerMat = new THREE.MeshBasicMaterial({
        color: baseColor,
        transparent: true,
        opacity: 0.35 * intensity,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const outer = new THREE.Mesh(
        new THREE.RingGeometry(0.45, 0.55, 64),
        outerMat,
      );
      const inner = new THREE.Mesh(
        new THREE.RingGeometry(0.2, 0.42, 64),
        innerMat,
      );
      outer.rotation.x = -Math.PI / 2;
      inner.rotation.x = -Math.PI / 2;

      this.group.add(outer);
      this.group.add(inner);

      this.ripples.push({
        outer,
        inner,
        progress: i / rippleCount,
        speed: 0.35 + i * 0.12,
      });
    }

    this.coreLight = new THREE.PointLight(
      new THREE.Color(baseColor),
      intensity * 2.5,
      24,
    );
    this.coreLight.position.set(0, 0.5, 0);
    this.group.add(this.coreLight);

    scene.add(this.group);

    return { group: this.group };
  }

  update(
    _objects: EffectObjects,
    params: Record<string, unknown>,
    deltaTime: number,
  ): void {
    if (!this.group) return;

    const intensity = readNumber(params, "intensity", 0.8);
    const frequency = readNumber(params, "frequency", 1.0);
    const color = readString(params, "color", NEWTYPE_MAGENTA);
    const time = performance.now() * 0.001;

    const rainbow = intensity > 1.4;
    const coreColor = new THREE.Color(color);

    if (this.coreSprite) {
      const mat = this.coreSprite.material as THREE.SpriteMaterial;
      if (rainbow) {
        mat.color.setHSL((time * 0.15) % 1, 0.85, 0.55);
      } else {
        mat.color.copy(coreColor);
      }
      const burst = 0.85 + Math.sin(time * frequency * 4) * 0.15;
      mat.opacity = burst * intensity * 0.9;
      this.coreSprite.scale.set(1 + burst * 0.4, 1 + burst * 0.4, 1);
    }

    if (this.coreLight) {
      this.coreLight.intensity =
        intensity * 2.5 * (0.75 + Math.sin(time * frequency * 3) * 0.25);
      if (!rainbow) this.coreLight.color.copy(coreColor);
    }

    for (const ripple of this.ripples) {
      if (!isRenderableLive(ripple.outer) || !isRenderableLive(ripple.inner))
        continue;
      ripple.progress += deltaTime * frequency * ripple.speed;
      if (ripple.progress >= 1) ripple.progress = 0;

      const scale = 0.15 + ripple.progress * 5.5 * intensity;
      ripple.outer.scale.set(scale, scale, 1);
      ripple.inner.scale.set(scale * 0.85, scale * 0.85, 1);

      const fade = (1 - ripple.progress) * intensity;
      (ripple.outer.material as THREE.MeshBasicMaterial).opacity = fade * 0.55;
      (ripple.inner.material as THREE.MeshBasicMaterial).opacity = fade * 0.4;

      if (rainbow) {
        const hue = (ripple.progress + time * 0.1) % 1;
        (ripple.inner.material as THREE.MeshBasicMaterial).color.setHSL(
          hue,
          0.9,
          0.5,
        );
        (ripple.outer.material as THREE.MeshBasicMaterial).color.setHSL(
          (hue + 0.5) % 1,
          0.8,
          0.55,
        );
      } else {
        (ripple.inner.material as THREE.MeshBasicMaterial).color.set(color);
        (ripple.outer.material as THREE.MeshBasicMaterial).color.set(
          NEWTYPE_CYAN,
        );
      }
    }

    if (intensity > 1.2 && Math.sin(time * frequency * 6) > 0.92) {
      if (this.coreLight) this.coreLight.color.set(NEWTYPE_GOLD);
    }
  }

  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    const group = objects.group as THREE.Group;

    this.group = null;
    this.ripples = [];
    this.coreLight = null;
    this.coreSprite = null;

    if (group) {
      safeDisposeEffectRoot(scene, group);
    }
  }
}

export default bindEffectModule(new NewtypeFlashEffect());
