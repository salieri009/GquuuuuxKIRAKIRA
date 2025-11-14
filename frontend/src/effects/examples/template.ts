/**
 * 효과 모듈 템플릿
 * 
 * 이 파일을 복사하여 새로운 효과를 만들 수 있습니다.
 * 별도 디렉토리에서 개발할 때도 이 구조를 따르세요.
 * 
 * 사용법:
 * 1. 이 파일을 복사하여 새로운 효과 디렉토리에 index.ts로 저장
 * 2. 클래스 이름과 메타데이터를 수정
 * 3. init, update, dispose 메서드를 구현
 * 4. 효과를 테스트하고 배포
 * 
 * ⚠️ 중요: Loose Coupling을 위해 타입을 직접 정의할 수 있습니다.
 * 메인 프로젝트의 타입을 import하지 않아도 됩니다.
 */

import * as THREE from 'three';

// 타입 정의 (메인 프로젝트 의존성 없음)
// 또는 메인 프로젝트에서 types-standalone.d.ts를 복사하여 사용
interface EffectObjects {
  [key: string]: THREE.Object3D | THREE.Material | THREE.Geometry | THREE.Texture | any;
}

interface EffectModule {
  init: (scene: THREE.Scene, params: Record<string, any>) => EffectObjects;
  update: (objects: EffectObjects, params: Record<string, any>, deltaTime: number) => void;
  dispose: (scene: THREE.Scene, objects: EffectObjects) => void;
}

/**
 * 효과 클래스
 * Three.js 객체를 관리하고 애니메이션을 처리합니다.
 */
class MyEffect implements EffectModule {
  // 효과에서 사용할 Three.js 객체들을 저장
  private mesh: THREE.Mesh | null = null;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.MeshStandardMaterial | null = null;

  /**
   * 효과 초기화
   * Scene에 객체를 추가하고 초기 상태를 설정합니다.
   * 
   * @param scene Three.js Scene 객체
   * @param params 효과 파라미터 (슬라이더, 색상 등)
   * @returns dispose에서 정리할 객체들
   */
  init(scene: THREE.Scene, params: Record<string, any>): EffectObjects {
    // 파라미터에서 값 가져오기 (기본값 제공)
    const size = params.size || 1.0;
    const color = params.color || '#00FF88';
    const position = params.position || [0, 0, 0];

    // Geometry 생성
    this.geometry = new THREE.BoxGeometry(size, size, size);
    // 또는 다른 지오메트리:
    // this.geometry = new THREE.SphereGeometry(size, 32, 32);
    // this.geometry = new THREE.PlaneGeometry(size, size);

    // Material 생성
    this.material = new THREE.MeshStandardMaterial({
      color: color,
      metalness: params.metalness || 0.5,
      roughness: params.roughness || 0.5,
    });

    // Mesh 생성
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(position[0], position[1], position[2]);

    // Scene에 추가
    scene.add(this.mesh);

    // dispose에서 정리할 수 있도록 모든 객체 반환
    return {
      mesh: this.mesh,
      geometry: this.geometry,
      material: this.material,
    };
  }

  /**
   * 애니메이션 업데이트
   * 매 프레임마다 호출되어 애니메이션을 처리합니다.
   * 
   * @param objects init에서 반환된 객체들
   * @param params 현재 파라미터 값
   * @param deltaTime 경과 시간 (초 단위, 보통 0.016초 = 60fps)
   */
  update(objects: EffectObjects, params: Record<string, any>, deltaTime: number): void {
    const mesh = objects.mesh as THREE.Mesh;
    if (!mesh) return;

    // 회전 애니메이션 예제
    const speed = params.speed || 1.0;
    mesh.rotation.x += deltaTime * speed * 0.5;
    mesh.rotation.y += deltaTime * speed * 0.3;

    // 파라미터 변경 시 Material 업데이트
    if (this.material) {
      const color = new THREE.Color(params.color || '#00FF88');
      this.material.color.copy(color);
      this.material.metalness = params.metalness || 0.5;
      this.material.roughness = params.roughness || 0.5;
    }

    // 위치 애니메이션 예제
    if (params.enableFloat) {
      const floatSpeed = params.floatSpeed || 1.0;
      const floatAmount = params.floatAmount || 0.5;
      mesh.position.y = Math.sin(performance.now() * 0.001 * floatSpeed) * floatAmount;
    }

    // 크기 애니메이션 예제
    if (params.enablePulse) {
      const pulseSpeed = params.pulseSpeed || 1.0;
      const pulseAmount = params.pulseAmount || 0.2;
      const scale = 1.0 + Math.sin(performance.now() * 0.001 * pulseSpeed) * pulseAmount;
      mesh.scale.set(scale, scale, scale);
    }
  }

  /**
   * 리소스 정리
   * 효과가 제거될 때 모든 리소스를 해제합니다.
   * 메모리 누수를 방지하기 위해 반드시 구현해야 합니다.
   * 
   * @param scene Three.js Scene 객체
   * @param objects init에서 반환된 객체들
   */
  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    const mesh = objects.mesh as THREE.Mesh;
    const geometry = objects.geometry as THREE.BufferGeometry;
    const material = objects.material as THREE.Material;

    // Scene에서 제거
    if (mesh) {
      scene.remove(mesh);
    }

    // Geometry 정리
    if (geometry) {
      geometry.dispose();
    }

    // Material 정리
    if (material) {
      material.dispose();
      
      // Material의 Texture도 정리
      if ('map' in material && material.map) {
        material.map.dispose();
      }
      if ('normalMap' in material && material.normalMap) {
        material.normalMap.dispose();
      }
      if ('roughnessMap' in material && material.roughnessMap) {
        material.roughnessMap.dispose();
      }
      if ('metalnessMap' in material && material.metalnessMap) {
        material.metalnessMap.dispose();
      }
    }

    // 참조 제거
    this.mesh = null;
    this.geometry = null;
    this.material = null;
  }
}

// 효과 인스턴스 생성
const effect = new MyEffect();

// 모듈 export (필수)
// default export는 반드시 init, update, dispose 메서드를 가진 객체여야 합니다.
export default {
  init: effect.init.bind(effect),
  update: effect.update.bind(effect),
  dispose: effect.dispose.bind(effect),
};

// 메타데이터 (선택사항, 하지만 권장)
// 이 정보는 효과 라이브러리에서 표시됩니다.
export const metadata = {
  name: 'My Effect',
  description: '효과 설명을 여기에 작성하세요',
  version: '1.0.0',
  author: 'Your Name',
  category: 'particles', // 'particles' | 'lighting' | 'transformation' | 'other'
  tags: ['tag1', 'tag2'], // 검색 및 필터링에 사용
  performance: 'medium' as const, // 'low' | 'medium' | 'high'
  thumbnail: '/images/effects/my-effect-thumb.jpg', // 썸네일 이미지 경로 (선택사항)
};

