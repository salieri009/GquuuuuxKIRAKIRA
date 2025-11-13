/**
 * GN 입자 효과 예제
 * 
 * 이 파일은 효과 모듈의 예제입니다.
 * 별도 디렉토리에서 개발할 때 이 구조를 참고하세요.
 */

import * as THREE from 'three';
import type { EffectModule, EffectObjects } from '../types';

/**
 * GN 입자 효과 구현
 */
class GNParticleEffect implements EffectModule {
  private particleSystem: THREE.Points | null = null;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.PointsMaterial | null = null;

  init(scene: THREE.Scene, params: Record<string, any>): EffectObjects {
    const particleCount = params.particleCount || 2000;
    const particleSize = params.particleSize || 0.08;
    const color = params.color || '#00FF88';
    const spread = params.spread || 8.0;

    // 파티클 지오메트리 생성
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorObj = new THREE.Color(color);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // 위치 (구 형태로 분포)
      const radius = Math.random() * spread;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // 색상
      const intensity = 0.7 + Math.random() * 0.3;
      colors[i3] = colorObj.r * intensity;
      colors[i3 + 1] = colorObj.g * intensity;
      colors[i3 + 2] = colorObj.b * intensity;

      // 크기
      sizes[i] = particleSize * (0.8 + Math.random() * 0.4);
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // 머테리얼 생성
    this.material = new THREE.PointsMaterial({
      size: particleSize,
      vertexColors: true,
      transparent: true,
      opacity: params.opacity || 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    // 파티클 시스템 생성
    this.particleSystem = new THREE.Points(this.geometry, this.material);
    scene.add(this.particleSystem);

    return {
      particleSystem: this.particleSystem,
      geometry: this.geometry,
      material: this.material,
    };
  }

  update(objects: EffectObjects, params: Record<string, any>, deltaTime: number): void {
    const particleSystem = objects.particleSystem as THREE.Points;
    if (!particleSystem) return;

    // 회전 애니메이션
    particleSystem.rotation.y += deltaTime * (params.speed || 1.0) * 0.2;

    // 파라미터 업데이트
    if (this.material) {
      const color = new THREE.Color(params.color || '#00FF88');
      this.material.color.copy(color);
      this.material.size = params.particleSize || 0.08;
      this.material.opacity = params.opacity || 0.8;
    }

    // 파티클 위치 업데이트 (터뷸런스 효과)
    if (this.geometry) {
      const positions = this.geometry.attributes.position.array as Float32Array;
      const turbulence = params.turbulence || 0.5;
      const time = performance.now() * 0.001;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(time * 2 + i * 0.1) * turbulence * deltaTime * 0.1;
        positions[i + 1] += Math.cos(time * 1.5 + i * 0.15) * turbulence * deltaTime * 0.1;
        positions[i + 2] += Math.sin(time * 1.8 + i * 0.12) * turbulence * deltaTime * 0.1;
      }

      this.geometry.attributes.position.needsUpdate = true;
    }
  }

  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    if (this.particleSystem) {
      scene.remove(this.particleSystem);
    }

    if (this.geometry) {
      this.geometry.dispose();
    }

    if (this.material) {
      this.material.dispose();
    }

    this.particleSystem = null;
    this.geometry = null;
    this.material = null;
  }
}

// 모듈 export
const effect = new GNParticleEffect();

export default {
  init: effect.init.bind(effect),
  update: effect.update.bind(effect),
  dispose: effect.dispose.bind(effect),
};

// 메타데이터
export const metadata = {
  name: 'GN Particles',
  description: 'GN 드라이브에서 방출되는 고에너지 입자 효과',
  version: '1.0.0',
  category: 'particles',
  tags: ['gundam-00', 'gn-drive', 'particles'],
  performance: 'medium' as const,
};

