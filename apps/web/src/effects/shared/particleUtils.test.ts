import { describe, it, expect, vi } from "vitest";
import * as THREE from "three";
import {
  safeDisposeEffectRoot,
  disposeObject3D,
  detachAndDispose,
  isGeometryLive,
  pruneInvalidRenderables,
  detachAllChildren,
} from "./particleUtils";

function flushDeferredDispose(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

describe("particleUtils dispose", () => {
  it("safeDisposeEffectRoot removes root from scene immediately", () => {
    const container = new THREE.Group();
    const group = new THREE.Group();
    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    group.add(mesh);
    container.add(group);

    safeDisposeEffectRoot(container, group);

    expect(container.children).not.toContain(group);
    expect(group.parent).toBeNull();
  });

  it("safeDisposeEffectRoot defers geometry.dispose until after double rAF", async () => {
    const container = new THREE.Group();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(3), 3),
    );
    const points = new THREE.Points(geometry, new THREE.PointsMaterial());
    const group = new THREE.Group();
    group.add(points);
    container.add(group);
    const disposeSpy = vi.spyOn(geometry, "dispose");

    safeDisposeEffectRoot(container, group);

    expect(container.children).not.toContain(group);
    expect(disposeSpy).not.toHaveBeenCalled();
    await flushDeferredDispose();
    expect(disposeSpy).toHaveBeenCalled();
  });

  it("detachAndDispose disposes geometry synchronously", () => {
    const container = new THREE.Group();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(3), 3),
    );
    const points = new THREE.Points(geometry, new THREE.PointsMaterial());
    const group = new THREE.Group();
    group.add(points);
    container.add(group);
    const disposeSpy = vi.spyOn(geometry, "dispose");

    detachAndDispose(container, group);

    expect(disposeSpy).toHaveBeenCalled();
  });

  it("isGeometryLive is false after deferred dispose completes", async () => {
    const container = new THREE.Group();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(3), 3),
    );
    const points = new THREE.Points(geometry, new THREE.PointsMaterial());
    const group = new THREE.Group();
    group.add(points);
    container.add(group);

    expect(isGeometryLive(geometry)).toBe(true);
    safeDisposeEffectRoot(container, group);
    await flushDeferredDispose();
    expect(isGeometryLive(geometry)).toBe(false);
  });

  it("detachAllChildren removes host children without disposing geometry", () => {
    const container = new THREE.Group();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(3), 3),
    );
    const points = new THREE.Points(geometry, new THREE.PointsMaterial());
    container.add(points);

    detachAllChildren(container);

    expect(container.children).toHaveLength(0);
    expect(isGeometryLive(geometry)).toBe(true);
  });

  it("pruneInvalidRenderables removes objects without position buffers", () => {
    const scene = new THREE.Scene();
    const bad = new THREE.Points(
      new THREE.BufferGeometry(),
      new THREE.PointsMaterial(),
    );
    scene.add(bad);

    pruneInvalidRenderables(scene);

    expect(scene.children).toHaveLength(0);
  });

  it("pruneInvalidRenderables removes Points with vertexColors but no color buffer", () => {
    const scene = new THREE.Scene();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3),
    );
    const material = new THREE.PointsMaterial({ vertexColors: true });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    pruneInvalidRenderables(scene);

    expect(scene.children).toHaveLength(0);
  });

  it("disposeObject3D disposes Points and Sprites", () => {
    const group = new THREE.Group();
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3),
    );
    const pointDisposeSpy = vi.spyOn(pointGeo, "dispose");
    const points = new THREE.Points(
      pointGeo,
      new THREE.PointsMaterial({ size: 1 }),
    );
    group.add(points);

    const canvas = document.createElement("canvas");
    const spriteTex = new THREE.CanvasTexture(canvas);
    const spriteDisposeSpy = vi.spyOn(spriteTex, "dispose");
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: spriteTex, transparent: true }),
    );
    group.add(sprite);

    disposeObject3D(group);

    expect(pointDisposeSpy).toHaveBeenCalled();
    expect(spriteDisposeSpy).toHaveBeenCalled();
  });

  it("swap simulation: needsUpdate then deferred dispose invalidates geometry", async () => {
    const container = new THREE.Group();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3),
    );
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array([1, 1, 1]), 3),
    );
    const material = new THREE.PointsMaterial({ vertexColors: true });
    const points = new THREE.Points(geometry, material);
    const group = new THREE.Group();
    group.add(points);
    container.add(group);

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    safeDisposeEffectRoot(container, group);
    pruneInvalidRenderables(container);

    expect(container.children).toHaveLength(0);
    await flushDeferredDispose();
    expect(isGeometryLive(geometry)).toBe(false);
  });
});

describe("effectLifecycle", () => {
  it("shouldAbortEffectLoad returns true when generation or mount mismatches", async () => {
    const { shouldAbortEffectLoad } = await import("../effectLifecycle");
    expect(shouldAbortEffectLoad(2, 1, true)).toBe(true);
    expect(shouldAbortEffectLoad(1, 1, false)).toBe(true);
    expect(shouldAbortEffectLoad(1, 1, true)).toBe(false);
  });

  it("commitEffectLoad disposes previous and rolls back stale init", async () => {
    const { commitEffectLoad } = await import("../effectLifecycle");
    const container = new THREE.Group();

    const disposePrev = vi.fn();
    const disposeNext = vi.fn();
    const init = vi.fn(() => ({ mesh: new THREE.Mesh() }));

    const previous = {
      module: { init: vi.fn(), update: vi.fn(), dispose: disposePrev },
      objects: { id: "prev" },
    };

    const module = {
      init,
      update: vi.fn(),
      dispose: disposeNext,
    };

    const committed = commitEffectLoad({
      container,
      module,
      initParams: {},
      previous,
      generation: 1,
      loadGeneration: 2,
      mounted: true,
    });

    expect(disposePrev).toHaveBeenCalledWith(container, previous.objects);
    expect(init).not.toHaveBeenCalled();
    expect(committed).toBeNull();
  });

  it("commitEffectLoad returns new instance when generation matches", async () => {
    const { commitEffectLoad } = await import("../effectLifecycle");
    const container = new THREE.Group();
    const objects = { mesh: new THREE.Mesh() };
    const module = {
      init: vi.fn(() => objects),
      update: vi.fn(),
      dispose: vi.fn(),
    };

    const committed = commitEffectLoad({
      container,
      module,
      initParams: { speed: 1 },
      previous: null,
      generation: 3,
      loadGeneration: 3,
      mounted: true,
    });

    expect(module.init).toHaveBeenCalledWith(container, { speed: 1 });
    expect(committed).toEqual({ module, objects });
  });
});
