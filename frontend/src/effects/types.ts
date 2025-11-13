import * as THREE from 'three';

/**
 * Three.js 효과 모듈 표준 인터페이스
 * 모든 효과 모듈은 이 인터페이스를 구현해야 합니다.
 */
export interface EffectModule {
  /**
   * 효과 초기화
   * @param scene Three.js Scene 객체
   * @param params 효과 파라미터
   * @returns 초기화된 객체들 (dispose에서 정리할 때 사용)
   */
  init: (scene: THREE.Scene, params: Record<string, any>) => EffectObjects;

  /**
   * 애니메이션 업데이트 (매 프레임 호출)
   * @param objects init에서 반환된 객체들
   * @param params 현재 파라미터 값
   * @param deltaTime 경과 시간 (초)
   */
  update: (objects: EffectObjects, params: Record<string, any>, deltaTime: number) => void;

  /**
   * 리소스 정리
   * @param scene Three.js Scene 객체
   * @param objects init에서 반환된 객체들
   */
  dispose: (scene: THREE.Scene, objects: EffectObjects) => void;
}

/**
 * 효과 객체 컨테이너
 * dispose에서 정리할 수 있도록 모든 Three.js 객체를 포함
 */
export interface EffectObjects {
  [key: string]: THREE.Object3D | THREE.Material | THREE.Geometry | THREE.Texture | any;
}

/**
 * 효과 메타데이터
 */
export interface EffectMetadata {
  name: string;
  description: string;
  version: string;
  author?: string;
  category: string;
  tags: string[];
  performance: 'low' | 'medium' | 'high';
  thumbnail?: string;
}

