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

const PSYCHO_ACTIVE = "#FF4444";
const PSYCHO_OVERLOAD = "#FF6600";
const PSYCHO_RESONANCE = "#FFB6C1";

function createPolygonRing(
  radius: number,
  sides: number,
): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
    points.push(
      new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius),
    );
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

class PsycoFieldEffect implements EffectModule {
  private group: THREE.Group | null = null;
  private rings: THREE.Line[] = [];
  private verticalLines: THREE.Line[] = [];
  private innerGlow: THREE.Mesh | null = null;
  private elapsed = 0;

  init(scene: THREE.Scene, params: Record<string, unknown>): EffectObjects {
    releaseOrphanRoot(scene, this.group);
    this.group = null;
    this.rings = [];
    this.verticalLines = [];
    this.innerGlow = null;

    const sides = Math.max(3, Math.round(readNumber(params, "geometry", 6)));
    const fieldStrength = readNumber(params, "fieldStrength", 1.2);
    const color = readString(params, "color", PSYCHO_ACTIVE);

    this.group = new THREE.Group();
    this.rings = [];
    this.verticalLines = [];
    this.elapsed = 0;

    const layerCount = 4;
    for (let layer = 0; layer < layerCount; layer++) {
      const radius = (1.2 + layer * 0.85) * fieldStrength;
      const y = (layer - 1.5) * 0.9 * fieldStrength;

      const ringGeo = createPolygonRing(radius, sides);
      const ringMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.45 + layer * 0.1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Line(ringGeo, ringMat);
      ring.position.y = y;
      ring.rotation.y = layer * 0.35;
      this.group.add(ring);
      this.rings.push(ring);

      if (layer < layerCount - 1) {
        const nextRadius = (1.2 + (layer + 1) * 0.85) * fieldStrength;
        const nextY = (layer - 0.5) * 0.9 * fieldStrength;
        for (let v = 0; v < sides; v += Math.max(1, Math.floor(sides / 3))) {
          const angle = (v / sides) * Math.PI * 2;
          const vertGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(
              Math.cos(angle) * radius,
              y,
              Math.sin(angle) * radius,
            ),
            new THREE.Vector3(
              Math.cos(angle) * nextRadius,
              nextY,
              Math.sin(angle) * nextRadius,
            ),
          ]);
          const vert = new THREE.Line(
            vertGeo,
            new THREE.LineBasicMaterial({
              color,
              transparent: true,
              opacity: 0.25,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            }),
          );
          this.group.add(vert);
          this.verticalLines.push(vert);
        }
      }
    }

    this.innerGlow = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.55 * fieldStrength, 0),
      new THREE.MeshBasicMaterial({
        color: PSYCHO_RESONANCE,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.group.add(this.innerGlow);

    const crackCount = 6;
    for (let c = 0; c < crackCount; c++) {
      const angle = (c / crackCount) * Math.PI * 2;
      const len = 1.5 * fieldStrength;
      const crackGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(
          Math.cos(angle) * len,
          (Math.random() - 0.5) * 0.5,
          Math.sin(angle) * len,
        ),
      ]);
      const crack = new THREE.Line(
        crackGeo,
        new THREE.LineBasicMaterial({
          color: PSYCHO_OVERLOAD,
          transparent: true,
          opacity: 0.2,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      this.group.add(crack);
      this.verticalLines.push(crack);
    }

    scene.add(this.group);

    return { group: this.group };
  }

  update(
    _objects: EffectObjects,
    params: Record<string, unknown>,
    deltaTime: number,
  ): void {
    if (!this.group) return;

    this.elapsed += deltaTime;
    const rotation = readNumber(params, "rotation", 0.5);
    const fieldStrength = readNumber(params, "fieldStrength", 1.2);
    const color = readString(params, "color", PSYCHO_ACTIVE);
    const time = performance.now() * 0.001;

    const overload = fieldStrength > 2.2;
    const activeColor = new THREE.Color(overload ? PSYCHO_OVERLOAD : color);
    const resonance = new THREE.Color(PSYCHO_RESONANCE);

    this.group.rotation.y += deltaTime * rotation;
    this.group.rotation.x = Math.sin(time * 0.4) * 0.12;

    const pulse = 1 + Math.sin(time * 3.5) * 0.06 * fieldStrength;
    this.group.scale.setScalar(pulse);

    for (let i = 0; i < this.rings.length; i++) {
      const ring = this.rings[i];
      if (!isRenderableLive(ring)) continue;
      ring.rotation.y += deltaTime * rotation * (i % 2 === 0 ? 0.4 : -0.25);
      const mat = ring.material as THREE.LineBasicMaterial;
      const crackle =
        0.35 + Math.abs(Math.sin(time * 14 + i * 2.1)) * 0.35 * fieldStrength;
      mat.color.copy(activeColor);
      mat.opacity = crackle;
    }

    for (const line of this.verticalLines) {
      if (!isRenderableLive(line)) continue;
      const mat = line.material as THREE.LineBasicMaterial;
      const flicker = Math.random() > 0.92 ? 0.7 : 0.25;
      mat.opacity = flicker * (0.3 + fieldStrength * 0.15);
      if (
        mat.color.getHexString() ===
        new THREE.Color(PSYCHO_OVERLOAD).getHexString()
      ) {
        mat.color.set(overload ? PSYCHO_OVERLOAD : PSYCHO_ACTIVE);
      }
    }

    if (this.innerGlow && isRenderableLive(this.innerGlow)) {
      this.innerGlow.rotation.y += deltaTime * rotation * 1.2;
      this.innerGlow.rotation.z += deltaTime * rotation * 0.6;
      const innerMat = this.innerGlow.material as THREE.MeshBasicMaterial;
      innerMat.color.copy(fieldStrength > 1.8 ? resonance : activeColor);
      innerMat.opacity = 0.25 + Math.sin(time * 5) * 0.12;
    }
  }

  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    const group = objects.group as THREE.Group;

    this.group = null;
    this.rings = [];
    this.verticalLines = [];
    this.innerGlow = null;

    if (group) {
      safeDisposeEffectRoot(scene, group);
    }
  }
}

export default bindEffectModule(new PsycoFieldEffect());
