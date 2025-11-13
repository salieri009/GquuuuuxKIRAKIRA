import * as THREE from 'three';
import type { EffectModule, EffectObjects } from '../types';

/**
 * 기본 효과 클래스
 * 모든 효과의 기본 구현을 제공합니다.
 */
export abstract class BaseEffect implements EffectModule {
  protected scene: THREE.Scene;
  protected params: Record<string, any>;
  protected objects: EffectObjects = {};
  protected clock: THREE.Clock;

  constructor(scene: THREE.Scene, params: Record<string, any> = {}) {
    this.scene = scene;
    this.params = params;
    this.clock = new THREE.Clock();
  }

  /**
   * 효과 초기화 (추상 메서드 - 하위 클래스에서 구현)
   */
  abstract init(scene: THREE.Scene, params: Record<string, any>): EffectObjects;

  /**
   * 애니메이션 업데이트
   */
  update(objects: EffectObjects, params: Record<string, any>, deltaTime: number): void {
    this.params = params;
    this.objects = objects;
    this.onUpdate(deltaTime);
  }

  /**
   * 업데이트 로직 (하위 클래스에서 구현)
   */
  protected abstract onUpdate(deltaTime: number): void;

  /**
   * 리소스 정리
   */
  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    // Scene에서 객체 제거
    Object.values(objects).forEach((obj) => {
      if (obj instanceof THREE.Object3D) {
        scene.remove(obj);
      }
    });

    // Geometry 정리
    Object.values(objects).forEach((obj) => {
      if (obj instanceof THREE.BufferGeometry || obj instanceof THREE.Geometry) {
        obj.dispose();
      }
    });

    // Material 정리
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

    // Texture 정리
    Object.values(objects).forEach((obj) => {
      if (obj instanceof THREE.Texture) {
        obj.dispose();
      } else if (obj instanceof THREE.Material && obj.map) {
        obj.map.dispose();
      }
    });

    this.objects = {};
  }

  /**
   * 파라미터 업데이트
   */
  protected updateParams(newParams: Record<string, any>): void {
    this.params = { ...this.params, ...newParams };
  }
}

