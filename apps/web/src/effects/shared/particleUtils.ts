import * as THREE from "three";

type DrawableObject =
  | THREE.Mesh
  | THREE.Line
  | THREE.LineSegments
  | THREE.Points;

function isDrawable(object: THREE.Object3D): object is DrawableObject {
  return (
    object instanceof THREE.Mesh ||
    object instanceof THREE.Line ||
    object instanceof THREE.LineSegments ||
    object instanceof THREE.Points
  );
}

let softParticleTexture: THREE.CanvasTexture | null = null;

/** Soft circular sprite — GN / Minovsky / Trans-Am point particles */
export function getSoftParticleTexture(): THREE.CanvasTexture {
  if (softParticleTexture) return softParticleTexture;

  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(255,255,255,0.85)");
  gradient.addColorStop(0.55, "rgba(255,255,255,0.2)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  softParticleTexture = new THREE.CanvasTexture(canvas);
  softParticleTexture.colorSpace = THREE.SRGBColorSpace;
  return softParticleTexture;
}

export function readNumber(
  params: Record<string, unknown>,
  key: string,
  fallback: number,
): number {
  const value = params[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function readString(
  params: Record<string, unknown>,
  key: string,
  fallback: string,
): string {
  const value = params[key];
  return typeof value === "string" ? value : fallback;
}

/** Catalog aliases (e.g. legacy particleCount → count) */
export function readCount(
  params: Record<string, unknown>,
  fallback: number,
): number {
  return Math.round(
    readNumber(params, "count", readNumber(params, "particleCount", fallback)),
  );
}

export function readSize(
  params: Record<string, unknown>,
  fallback: number,
): number {
  return readNumber(
    params,
    "size",
    readNumber(params, "particleSize", fallback),
  );
}

/** Catalog size (0.01–0.1) → visible world-space point diameter */
export function worldParticleSize(catalogSize: number): number {
  return Math.max(catalogSize * 200, 0.55);
}

export function createPointsMaterial(
  catalogSize: number,
  opacity = 0.92,
): THREE.PointsMaterial {
  return new THREE.PointsMaterial({
    size: worldParticleSize(catalogSize),
    map: getSoftParticleTexture(),
    vertexColors: true,
    color: new THREE.Color(0xffffff),
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: true,
    sizeAttenuation: true,
    alphaTest: 0.02,
  });
}

export function setVertexColor(
  colors: Float32Array,
  index: number,
  color: THREE.Color,
  brightness = 1,
): void {
  const i3 = index * 3;
  const b = Math.max(0.35, Math.min(brightness, 1.5));
  colors[i3] = color.r * b;
  colors[i3 + 1] = color.g * b;
  colors[i3 + 2] = color.b * b;
}

const disposedGeometries = new WeakSet<THREE.BufferGeometry>();

function markGeometryDisposed(geometry: THREE.BufferGeometry): void {
  disposedGeometries.add(geometry);
}

function clearGeometryNeedsUpdate(geometry: THREE.BufferGeometry): void {
  for (const attribute of Object.values(geometry.attributes)) {
    attribute.needsUpdate = false;
  }
  const index = geometry.index;
  if (index) {
    index.needsUpdate = false;
  }
}

/** Guard against updating geometry that was detached or disposed mid-frame. */
export function isGeometryLive(
  geometry: THREE.BufferGeometry | null | undefined,
): boolean {
  if (!geometry || disposedGeometries.has(geometry)) return false;
  const position = geometry.attributes.position;
  if (position == null || position.array == null) return false;

  return true;
}

export function isRenderableLive(
  object: THREE.Object3D | null | undefined,
): boolean {
  if (!object) return false;
  if (isDrawable(object) && disposedGeometries.has(object.geometry))
    return false;
  return hasRenderablePositionAttribute(object);
}

function hasRenderablePositionAttribute(object: THREE.Object3D): boolean {
  if (!isDrawable(object)) {
    return true;
  }

  const geometry = object.geometry;
  const position = geometry?.attributes?.position;
  if (position == null || position.array == null) {
    return false;
  }

  if (geometry.index != null && geometry.index.array == null) {
    return false;
  }

  if (object instanceof THREE.Points) {
    const material = object.material;
    const materials = Array.isArray(material) ? material : [material];
    const needsVertexColors = materials.some(
      (entry) => entry instanceof THREE.PointsMaterial && entry.vertexColors,
    );
    if (needsVertexColors) {
      const color = geometry.attributes.color;
      if (color == null || color.array == null) {
        return false;
      }
    }
  }

  return true;
}

function invalidateRenderableBuffers(object: THREE.Object3D): void {
  if (isDrawable(object)) {
    const geometry = object.geometry;
    if (geometry) {
      clearGeometryNeedsUpdate(geometry);
    }
  }
}

/** Hide and detach objects with missing GPU buffers before WebGL upload. */
export function pruneInvalidRenderables(root: THREE.Object3D): void {
  const toRemove: THREE.Object3D[] = [];

  root.traverse((child) => {
    if (!isRenderableLive(child)) {
      invalidateRenderableBuffers(child);
      child.visible = false;
      toRemove.push(child);
    }
  });

  for (const child of toRemove) {
    child.parent?.remove(child);
  }
}

function detachSharedParticleMap(material: THREE.Material): void {
  if (
    material instanceof THREE.PointsMaterial &&
    material.map === softParticleTexture
  ) {
    material.map = null;
  }
}

function disposeMaterial(material: THREE.Material): void {
  detachSharedParticleMap(material);
  if (material instanceof THREE.MeshBasicMaterial && material.map) {
    material.map.dispose();
    material.map = null;
  }
  material.dispose();
}

function disposeMaterials(material: THREE.Material | THREE.Material[]): void {
  if (Array.isArray(material)) {
    material.forEach(disposeMaterial);
  } else {
    disposeMaterial(material);
  }
}

function disposeRenderable(child: THREE.Object3D): void {
  if (isDrawable(child)) {
    const geometry = child.geometry;
    if (geometry && !disposedGeometries.has(geometry)) {
      clearGeometryNeedsUpdate(geometry);
      markGeometryDisposed(geometry);
      geometry.dispose();
    }
    child.geometry = undefined as unknown as THREE.BufferGeometry;
    disposeMaterials(child.material);
    return;
  }

  if (child instanceof THREE.Sprite) {
    const mat = child.material as THREE.SpriteMaterial;
    mat.map?.dispose();
    mat.dispose();
  }
}

/** Dispose geometries/materials under root. Call only after removing root from the scene. */
export function disposeObject3D(root: THREE.Object3D): void {
  root.traverse((child) => {
    disposeRenderable(child);
  });
}

function scheduleDeferredDispose(root: THREE.Object3D): void {
  const disposeLater = () => {
    disposeObject3D(root);
  };

  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(() => {
      requestAnimationFrame(disposeLater);
    });
  } else {
    disposeLater();
  }
}

function hideObjectTree(
  root: THREE.Object3D,
  invalidateBuffers: boolean,
): void {
  root.visible = false;
  root.traverse((child) => {
    child.visible = false;
    if (invalidateBuffers) {
      invalidateRenderableBuffers(child);
    }
  });
}

function detachFromContainer(
  container: THREE.Object3D,
  root: THREE.Object3D,
): void {
  if (root.parent) {
    root.parent.remove(root);
  } else {
    container.remove(root);
  }
}

/**
 * Detach effect root from host immediately; defer GPU dispose until after WebGL frame.
 * Preferred dispose path for all effect modules.
 */
export function safeDisposeEffectRoot(
  container: THREE.Object3D,
  root: THREE.Object3D | null | undefined,
): void {
  if (!root) return;

  hideObjectTree(root, true);
  detachFromContainer(container, root);

  scheduleDeferredDispose(root);
}

/** Remove from scene graph first, then dispose GPU resources synchronously (tests/internal only). */
export function detachAndDispose(
  container: THREE.Object3D,
  root: THREE.Object3D,
): void {
  hideObjectTree(root, false);
  detachFromContainer(container, root);

  disposeObject3D(root);
}

/** Remove every child from the effect host without touching GPU resources. */
export function detachAllChildren(container: THREE.Object3D): void {
  const children = [...container.children];
  for (const child of children) {
    hideObjectTree(child, true);
    container.remove(child);
  }
}

/** Tear down a prior root if a singleton effect init runs again without dispose. */
export function releaseOrphanRoot(
  container: THREE.Object3D,
  existing: THREE.Object3D | null | undefined,
): void {
  if (existing) {
    safeDisposeEffectRoot(container, existing);
  }
}
