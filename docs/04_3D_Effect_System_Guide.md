# 04. 3D 효과 시스템 구현 가이드 (Three.js)

## 1. 효과 시스템 아키텍처

### 1.1. 설계 원칙
- **모듈화**: 각 효과를 독립적인 모듈로 분리
- **표준화**: 일관된 인터페이스로 모든 효과 관리
- **성능 최적화**: 메모리 관리 및 애니메이션 최적화
- **확장성**: 새로운 효과 추가가 용이한 구조

### 1.2. 효과 모듈 구조
```
src/effects/
├── base/
│   ├── BaseEffect.js          # 기본 효과 클래스
│   ├── ParticleEffect.js      # 파티클 효과 기본 클래스
│   └── MeshEffect.js          # 메시 효과 기본 클래스
├── particles/
│   ├── gnParticles.effect.js  # GN 입자 효과
│   ├── minofskyParticles.effect.js # 미노프스키 입자
│   └── newtypeFlash.effect.js # 뉴타입 섬광
├── environments/
│   ├── spaceField.effect.js   # 우주 공간 배경
│   └── nebula.effect.js       # 성운 효과
└── weapons/
    ├── beamSaber.effect.js    # 빔 사벨 효과
    └── funnelTrail.effect.js  # 펀넬 궤적
```

## 2. 기본 효과 클래스

### 2.1. BaseEffect.js

```javascript
import * as THREE from 'three';

/**
 * 모든 효과의 기본 클래스
 * 표준화된 인터페이스 제공
 */
export class BaseEffect {
  constructor(scene, params = {}) {
    this.scene = scene;
    this.params = { ...this.getDefaultParams(), ...params };
    this.objects = {};
    this.isInitialized = false;
    this.isDisposed = false;
    
    // 애니메이션 관련
    this.clock = new THREE.Clock();
    this.elapsedTime = 0;
    
    // 성능 관련
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.targetFPS = 60;
  }

  /**
   * 기본 파라미터 정의 (하위 클래스에서 오버라이드)
   * @returns {Object} 기본 파라미터 객체
   */
  getDefaultParams() {
    return {
      intensity: { type: 'slider', value: 1.0, min: 0, max: 2, step: 0.1 },
      scale: { type: 'slider', value: 1.0, min: 0.1, max: 3, step: 0.1 },
      color: { type: 'color', value: '#00FFFF' },
      visible: { type: 'toggle', value: true }
    };
  }

  /**
   * 효과 초기화 (하위 클래스에서 구현)
   * @returns {Promise<Object>} 생성된 3D 객체들
   */
  async init() {
    if (this.isInitialized) {
      console.warn('효과가 이미 초기화되었습니다.');
      return this.objects;
    }

    try {
      this.objects = await this.createObjects();
      this.addToScene();
      this.isInitialized = true;
      
      console.log(`효과 초기화 완료: ${this.constructor.name}`);
      return this.objects;
    } catch (error) {
      console.error('효과 초기화 실패:', error);
      throw error;
    }
  }

  /**
   * 3D 객체 생성 (하위 클래스에서 구현)
   * @returns {Promise<Object>} 생성된 객체들
   */
  async createObjects() {
    throw new Error('createObjects 메서드를 구현해야 합니다.');
  }

  /**
   * 객체를 씬에 추가
   */
  addToScene() {
    Object.values(this.objects).forEach(obj => {
      if (obj && obj.isObject3D) {
        this.scene.add(obj);
      }
    });
  }

  /**
   * 애니메이션 업데이트
   * @param {Object} newParams 새로운 파라미터
   * @param {number} deltaTime 경과 시간
   */
  animate(newParams = {}, deltaTime = 0.016) {
    if (!this.isInitialized || this.isDisposed) return;

    // 프레임 제한 체크
    const now = performance.now();
    if (now - this.lastFrameTime < 1000 / this.targetFPS) return;

    // 파라미터 업데이트
    this.updateParams(newParams);
    
    // 시간 업데이트
    this.elapsedTime += deltaTime;
    this.lastFrameTime = now;
    this.frameCount++;

    // 실제 애니메이션 로직 (하위 클래스에서 구현)
    this.updateAnimation(deltaTime);
  }

  /**
   * 파라미터 업데이트
   * @param {Object} newParams 새로운 파라미터
   */
  updateParams(newParams) {
    Object.keys(newParams).forEach(key => {
      if (key in this.params) {
        this.params[key].value = newParams[key];
      }
    });
  }

  /**
   * 애니메이션 로직 업데이트 (하위 클래스에서 구현)
   * @param {number} deltaTime 경과 시간
   */
  updateAnimation(deltaTime) {
    // 기본 구현: visible 파라미터 적용
    Object.values(this.objects).forEach(obj => {
      if (obj && obj.isObject3D) {
        obj.visible = this.params.visible.value;
      }
    });
  }

  /**
   * 리소스 정리 및 제거
   */
  dispose() {
    if (this.isDisposed) return;

    // 씬에서 객체 제거
    Object.values(this.objects).forEach(obj => {
      if (obj && obj.isObject3D) {
        this.scene.remove(obj);
        
        // 지오메트리와 머테리얼 정리
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(mat => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
        
        // 텍스처 정리
        if (obj.material && obj.material.map) {
          obj.material.map.dispose();
        }
      }
    });

    this.objects = {};
    this.isDisposed = true;
    
    console.log(`효과 정리 완료: ${this.constructor.name}`);
  }

  /**
   * 효과 리셋 (파라미터를 기본값으로)
   */
  reset() {
    const defaultParams = this.getDefaultParams();
    Object.keys(defaultParams).forEach(key => {
      if (key in this.params) {
        this.params[key].value = defaultParams[key].value;
      }
    });
    
    this.elapsedTime = 0;
    this.frameCount = 0;
  }

  /**
   * 성능 정보 반환
   * @returns {Object} 성능 정보
   */
  getPerformanceInfo() {
    return {
      frameCount: this.frameCount,
      elapsedTime: this.elapsedTime,
      averageFPS: this.frameCount / (this.elapsedTime || 1),
      objectCount: Object.keys(this.objects).length
    };
  }
}
```

### 2.2. ParticleEffect.js

```javascript
import * as THREE from 'three';
import { BaseEffect } from './BaseEffect.js';

/**
 * 파티클 효과를 위한 기본 클래스
 */
export class ParticleEffect extends BaseEffect {
  constructor(scene, params = {}) {
    super(scene, params);
    
    // 파티클 관련 속성
    this.particleCount = 0;
    this.positions = null;
    this.velocities = null;
    this.colors = null;
    this.sizes = null;
    this.lifetimes = null;
  }

  /**
   * 파티클 효과 기본 파라미터
   */
  getDefaultParams() {
    return {
      ...super.getDefaultParams(),
      particleCount: { type: 'slider', value: 1000, min: 100, max: 10000, step: 100 },
      particleSize: { type: 'slider', value: 0.05, min: 0.01, max: 0.2, step: 0.01 },
      speed: { type: 'slider', value: 1.0, min: 0.1, max: 5.0, step: 0.1 },
      spread: { type: 'slider', value: 5.0, min: 1.0, max: 20.0, step: 0.5 },
      opacity: { type: 'slider', value: 0.8, min: 0.1, max: 1.0, step: 0.1 },
      blending: { type: 'select', value: 'additive', options: ['normal', 'additive', 'multiply'] }
    };
  }

  /**
   * 파티클 시스템 생성
   */
  async createObjects() {
    const count = this.params.particleCount.value;
    this.particleCount = count;

    // 버퍼 지오메트리 생성
    const geometry = new THREE.BufferGeometry();
    
    // 파티클 데이터 초기화
    this.initializeParticleData(count);
    
    // 버퍼 어트리뷰트 설정
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));

    // 머테리얼 생성
    const material = this.createParticleMaterial();

    // 파티클 시스템 생성
    const particleSystem = new THREE.Points(geometry, material);
    
    return { particleSystem, geometry, material };
  }

  /**
   * 파티클 데이터 초기화
   * @param {number} count 파티클 개수
   */
  initializeParticleData(count) {
    this.positions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    this.colors = new Float32Array(count * 3);
    this.sizes = new Float32Array(count);
    this.lifetimes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      this.resetParticle(i);
    }
  }

  /**
   * 개별 파티클 초기화 (하위 클래스에서 오버라이드)
   * @param {number} index 파티클 인덱스
   */
  resetParticle(index) {
    const i3 = index * 3;
    
    // 위치 (구 형태로 분포)
    const radius = Math.random() * this.params.spread.value;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    this.positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    this.positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    this.positions[i3 + 2] = radius * Math.cos(phi);
    
    // 속도 (중심에서 바깥쪽으로)
    const speed = this.params.speed.value * (0.5 + Math.random() * 0.5);
    this.velocities[i3] = this.positions[i3] * speed * 0.1;
    this.velocities[i3 + 1] = this.positions[i3 + 1] * speed * 0.1;
    this.velocities[i3 + 2] = this.positions[i3 + 2] * speed * 0.1;
    
    // 색상 (기본 색상 기반)
    const color = new THREE.Color(this.params.color.value);
    this.colors[i3] = color.r;
    this.colors[i3 + 1] = color.g;
    this.colors[i3 + 2] = color.b;
    
    // 크기
    this.sizes[index] = this.params.particleSize.value * (0.5 + Math.random() * 0.5);
    
    // 생명주기
    this.lifetimes[index] = Math.random() * 5 + 1; // 1-6초
  }

  /**
   * 파티클 머테리얼 생성
   */
  createParticleMaterial() {
    const blendingMap = {
      normal: THREE.NormalBlending,
      additive: THREE.AdditiveBlending,
      multiply: THREE.MultiplyBlending
    };

    return new THREE.PointsMaterial({
      size: this.params.particleSize.value,
      vertexColors: true,
      transparent: true,
      opacity: this.params.opacity.value,
      blending: blendingMap[this.params.blending.value] || THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
  }

  /**
   * 파티클 애니메이션 업데이트
   */
  updateAnimation(deltaTime) {
    super.updateAnimation(deltaTime);
    
    if (!this.objects.particleSystem) return;

    const { particleSystem, geometry, material } = this.objects;
    
    // 파티클 위치 및 생명주기 업데이트
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // 위치 업데이트
      this.positions[i3] += this.velocities[i3] * deltaTime;
      this.positions[i3 + 1] += this.velocities[i3 + 1] * deltaTime;
      this.positions[i3 + 2] += this.velocities[i3 + 2] * deltaTime;
      
      // 생명주기 감소
      this.lifetimes[i] -= deltaTime;
      
      // 파티클 리셋 (생명주기 종료 시)
      if (this.lifetimes[i] <= 0) {
        this.resetParticle(i);
      }
    }
    
    // 버퍼 어트리뷰트 업데이트
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
    
    // 머테리얼 파라미터 업데이트
    material.opacity = this.params.opacity.value;
    material.size = this.params.particleSize.value;
    
    // 회전 효과 (선택적)
    particleSystem.rotation.y += deltaTime * 0.1;
  }
}
```

## 3. 구체적인 효과 구현 예시

### 3.1. GN 입자 효과 (gnParticles.effect.js)

```javascript
import * as THREE from 'three';
import { ParticleEffect } from '../base/ParticleEffect.js';

/**
 * 건담 00 시리즈의 GN 입자 효과
 */
class GNParticleEffect extends ParticleEffect {
  getDefaultParams() {
    return {
      ...super.getDefaultParams(),
      particleCount: { type: 'slider', value: 2000, min: 500, max: 5000, step: 100 },
      particleSize: { type: 'slider', value: 0.08, min: 0.02, max: 0.15, step: 0.01 },
      speed: { type: 'slider', value: 1.5, min: 0.5, max: 3.0, step: 0.1 },
      spread: { type: 'slider', value: 8.0, min: 2.0, max: 15.0, step: 0.5 },
      glowIntensity: { type: 'slider', value: 1.2, min: 0.5, max: 2.5, step: 0.1 },
      flowDirection: { type: 'slider', value: 1.0, min: -2.0, max: 2.0, step: 0.1 },
      color: { type: 'color', value: '#00FF88' }, // GN 입자 특유의 청록색
      turbulence: { type: 'slider', value: 0.5, min: 0.0, max: 2.0, step: 0.1 }
    };
  }

  async createObjects() {
    const objects = await super.createObjects();
    
    // GN 입자 특유의 글로우 효과를 위한 추가 레이어
    const glowGeometry = objects.geometry.clone();
    const glowMaterial = new THREE.PointsMaterial({
      size: this.params.particleSize.value * 2,
      color: this.params.color.value,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const glowSystem = new THREE.Points(glowGeometry, glowMaterial);
    
    return {
      ...objects,
      glowSystem,
      glowGeometry,
      glowMaterial
    };
  }

  resetParticle(index) {
    const i3 = index * 3;
    
    // GN 입자는 중심에서 나선형으로 퍼져나감
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * this.params.spread.value;
    const height = (Math.random() - 0.5) * 10;
    
    this.positions[i3] = Math.cos(angle) * radius;
    this.positions[i3 + 1] = height;
    this.positions[i3 + 2] = Math.sin(angle) * radius;
    
    // 나선형 움직임을 위한 속도 설정
    const speed = this.params.speed.value;
    this.velocities[i3] = -Math.sin(angle) * speed * 0.5;
    this.velocities[i3 + 1] = this.params.flowDirection.value * speed;
    this.velocities[i3 + 2] = Math.cos(angle) * speed * 0.5;
    
    // GN 입자 특유의 색상 변화
    const color = new THREE.Color(this.params.color.value);
    const intensity = 0.7 + Math.random() * 0.3;
    this.colors[i3] = color.r * intensity;
    this.colors[i3 + 1] = color.g * intensity;
    this.colors[i3 + 2] = color.b * intensity;
    
    this.sizes[index] = this.params.particleSize.value * (0.8 + Math.random() * 0.4);
    this.lifetimes[index] = 3 + Math.random() * 4;
  }

  updateAnimation(deltaTime) {
    super.updateAnimation(deltaTime);
    
    if (!this.objects.particleSystem || !this.objects.glowSystem) return;
    
    // 터뷸런스 효과 추가
    const turbulence = this.params.turbulence.value;
    const time = this.elapsedTime;
    
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // 터뷸런스 노이즈 추가
      if (turbulence > 0) {
        const noiseX = Math.sin(time * 2 + i * 0.1) * turbulence * deltaTime;
        const noiseY = Math.cos(time * 1.5 + i * 0.15) * turbulence * deltaTime;
        const noiseZ = Math.sin(time * 1.8 + i * 0.12) * turbulence * deltaTime;
        
        this.positions[i3] += noiseX;
        this.positions[i3 + 1] += noiseY;
        this.positions[i3 + 2] += noiseZ;
      }
      
      // 생명주기에 따른 알파값 조정
      const life = this.lifetimes[i];
      const alpha = Math.min(life, 1.0);
      this.colors[i3] *= alpha;
      this.colors[i3 + 1] *= alpha;
      this.colors[i3 + 2] *= alpha;
    }
    
    // 글로우 시스템 동기화
    const { glowSystem, glowGeometry, glowMaterial } = this.objects;
    glowGeometry.attributes.position.array.set(this.positions);
    glowGeometry.attributes.position.needsUpdate = true;
    
    glowMaterial.opacity = this.params.glowIntensity.value * 0.3;
    glowMaterial.size = this.params.particleSize.value * 2;
    
    // 전체 시스템 회전
    this.objects.particleSystem.rotation.y += deltaTime * 0.2;
    glowSystem.rotation.y += deltaTime * 0.15;
  }
}

// 표준 인터페이스 함수들
export async function init(scene, params) {
  const effect = new GNParticleEffect(scene, params);
  await effect.init();
  return { effect };
}

export function animate(objects, params, deltaTime) {
  if (objects.effect) {
    objects.effect.animate(params, deltaTime);
  }
}

export function dispose(scene, objects) {
  if (objects.effect) {
    objects.effect.dispose();
  }
}

// 효과 메타데이터
export const metadata = {
  name: 'GN Particles',
  description: 'GN 드라이브에서 방출되는 입자 효과',
  category: 'particles',
  tags: ['gundam-00', 'gn-drive', 'particles'],
  performance: 'medium'
};
```

### 3.2. 뉴타입 섬광 효과 (newtypeFlash.effect.js)

```javascript
import * as THREE from 'three';
import { BaseEffect } from '../base/BaseEffect.js';

/**
 * 뉴타입 능력 발현 시의 섬광 효과
 */
class NewtypeFlashEffect extends BaseEffect {
  getDefaultParams() {
    return {
      ...super.getDefaultParams(),
      intensity: { type: 'slider', value: 1.5, min: 0.5, max: 3.0, step: 0.1 },
      flashSpeed: { type: 'slider', value: 2.0, min: 0.5, max: 5.0, step: 0.1 },
      waveCount: { type: 'slider', value: 3, min: 1, max: 8, step: 1 },
      color: { type: 'color', value: '#FFD700' }, // 금색 섬광
      pulseRate: { type: 'slider', value: 1.2, min: 0.3, max: 3.0, step: 0.1 },
      shockwaveSize: { type: 'slider', value: 10, min: 3, max: 30, step: 1 }
    };
  }

  async createObjects() {
    const objects = {};
    
    // 중심 핵 생성
    const coreGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: this.params.color.value,
      transparent: true,
      opacity: 0.8
    });
    objects.core = new THREE.Mesh(coreGeometry, coreMaterial);
    
    // 충격파 링들 생성
    objects.shockwaves = [];
    const waveCount = this.params.waveCount.value;
    
    for (let i = 0; i < waveCount; i++) {
      const ringGeometry = new THREE.RingGeometry(1, 1.2, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: this.params.color.value,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.userData = {
        initialDelay: i * 0.3,
        phase: 0,
        maxScale: this.params.shockwaveSize.value
      };
      
      objects.shockwaves.push(ring);
    }
    
    // 에너지 필드 파티클들
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      const color = new THREE.Color(this.params.color.value);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    
    objects.particles = new THREE.Points(particleGeometry, particleMaterial);
    
    return objects;
  }

  updateAnimation(deltaTime) {
    super.updateAnimation(deltaTime);
    
    const { core, shockwaves, particles } = this.objects;
    if (!core || !shockwaves || !particles) return;
    
    const time = this.elapsedTime;
    const intensity = this.params.intensity.value;
    const flashSpeed = this.params.flashSpeed.value;
    const pulseRate = this.params.pulseRate.value;
    
    // 중심 핵 펄스 효과
    const coreScale = 1 + Math.sin(time * pulseRate * Math.PI * 2) * 0.3 * intensity;
    core.scale.setScalar(coreScale);
    core.material.opacity = 0.5 + Math.sin(time * pulseRate * Math.PI * 2) * 0.3;
    
    // 충격파 애니메이션
    shockwaves.forEach((wave, index) => {
      const userData = wave.userData;
      const phase = time * flashSpeed - userData.initialDelay;
      
      if (phase > 0) {
        const progress = (phase % 2) / 2; // 2초 주기로 반복
        const scale = progress * userData.maxScale;
        const opacity = Math.max(0, 1 - progress) * 0.6;
        
        wave.scale.setScalar(scale);
        wave.material.opacity = opacity * intensity;
        wave.visible = opacity > 0.01;
      } else {
        wave.visible = false;
      }
    });
    
    // 파티클 필드 회전 및 깜빡임
    particles.rotation.x += deltaTime * 0.5;
    particles.rotation.y += deltaTime * 0.3;
    particles.rotation.z += deltaTime * 0.1;
    
    const particleOpacity = 0.4 + Math.sin(time * 3) * 0.3;
    particles.material.opacity = particleOpacity * intensity;
    
    // 색상 업데이트
    const newColor = new THREE.Color(this.params.color.value);
    core.material.color.copy(newColor);
    shockwaves.forEach(wave => {
      wave.material.color.copy(newColor);
    });
  }
}

// 표준 인터페이스
export async function init(scene, params) {
  const effect = new NewtypeFlashEffect(scene, params);
  await effect.init();
  return { effect };
}

export function animate(objects, params, deltaTime) {
  if (objects.effect) {
    objects.effect.animate(params, deltaTime);
  }
}

export function dispose(scene, objects) {
  if (objects.effect) {
    objects.effect.dispose();
  }
}

export const metadata = {
  name: 'Newtype Flash',
  description: '뉴타입 능력 발현 시의 강렬한 섬광 효과',
  category: 'energy',
  tags: ['newtype', 'flash', 'psychic'],
  performance: 'high'
};
```

## 4. 효과 관리 시스템

### 4.1. EffectManager.js

```javascript
import * as THREE from 'three';

/**
 * 효과 시스템 전체를 관리하는 매니저 클래스
 */
export class EffectManager {
  constructor(scene) {
    this.scene = scene;
    this.effects = new Map();
    this.loadedModules = new Map();
    this.activeEffect = null;
    
    // 성능 모니터링
    this.performanceMonitor = {
      frameTime: 0,
      effectCount: 0,
      lastUpdate: 0
    };
  }

  /**
   * 효과 로드 및 초기화
   * @param {string} effectId 효과 ID
   * @param {Object} params 초기 파라미터
   */
  async loadEffect(effectId, params = {}) {
    try {
      // 이미 로드된 모듈 체크
      let effectModule = this.loadedModules.get(effectId);
      
      if (!effectModule) {
        // 동적 import로 효과 모듈 로드
        effectModule = await import(`@/effects/${effectId}.effect.js`);
        this.loadedModules.set(effectId, effectModule);
      }
      
      // 효과 초기화
      const effectObjects = await effectModule.init(this.scene, params);
      
      // 효과 등록
      this.effects.set(effectId, {
        module: effectModule,
        objects: effectObjects,
        params: { ...params },
        isActive: false,
        loadTime: Date.now()
      });
      
      console.log(`효과 로드 완료: ${effectId}`);
      return true;
      
    } catch (error) {
      console.error(`효과 로드 실패: ${effectId}`, error);
      throw new Error(`효과를 로드할 수 없습니다: ${effectId}`);
    }
  }

  /**
   * 효과 활성화
   * @param {string} effectId 활성화할 효과 ID
   */
  async activateEffect(effectId) {
    // 기존 활성 효과 비활성화
    if (this.activeEffect) {
      this.deactivateEffect(this.activeEffect);
    }
    
    // 효과가 로드되지 않았다면 로드
    if (!this.effects.has(effectId)) {
      await this.loadEffect(effectId);
    }
    
    const effect = this.effects.get(effectId);
    effect.isActive = true;
    this.activeEffect = effectId;
    
    console.log(`효과 활성화: ${effectId}`);
  }

  /**
   * 효과 비활성화
   * @param {string} effectId 비활성화할 효과 ID
   */
  deactivateEffect(effectId) {
    const effect = this.effects.get(effectId);
    if (effect) {
      effect.isActive = false;
      if (this.activeEffect === effectId) {
        this.activeEffect = null;
      }
      console.log(`효과 비활성화: ${effectId}`);
    }
  }

  /**
   * 효과 제거
   * @param {string} effectId 제거할 효과 ID
   */
  removeEffect(effectId) {
    const effect = this.effects.get(effectId);
    if (effect) {
      // 리소스 정리
      effect.module.dispose(this.scene, effect.objects);
      
      // 맵에서 제거
      this.effects.delete(effectId);
      
      // 활성 효과였다면 초기화
      if (this.activeEffect === effectId) {
        this.activeEffect = null;
      }
      
      console.log(`효과 제거: ${effectId}`);
    }
  }

  /**
   * 활성 효과의 파라미터 업데이트
   * @param {Object} newParams 새로운 파라미터
   */
  updateActiveEffectParams(newParams) {
    if (!this.activeEffect) return;
    
    const effect = this.effects.get(this.activeEffect);
    if (effect) {
      // 파라미터 병합
      effect.params = { ...effect.params, ...newParams };
    }
  }

  /**
   * 애니메이션 업데이트 (매 프레임 호출)
   * @param {number} deltaTime 경과 시간
   */
  update(deltaTime) {
    const startTime = performance.now();
    
    // 활성 효과만 업데이트
    if (this.activeEffect) {
      const effect = this.effects.get(this.activeEffect);
      if (effect && effect.isActive) {
        effect.module.animate(effect.objects, effect.params, deltaTime);
      }
    }
    
    // 성능 모니터링 업데이트
    this.performanceMonitor.frameTime = performance.now() - startTime;
    this.performanceMonitor.effectCount = this.effects.size;
    this.performanceMonitor.lastUpdate = Date.now();
  }

  /**
   * 모든 효과 정리
   */
  dispose() {
    this.effects.forEach((effect, effectId) => {
      effect.module.dispose(this.scene, effect.objects);
    });
    
    this.effects.clear();
    this.loadedModules.clear();
    this.activeEffect = null;
    
    console.log('모든 효과 정리 완료');
  }

  /**
   * 현재 상태 정보 반환
   */
  getStatus() {
    return {
      loadedEffects: Array.from(this.effects.keys()),
      activeEffect: this.activeEffect,
      performance: { ...this.performanceMonitor },
      memoryUsage: this.getMemoryUsage()
    };
  }

  /**
   * 메모리 사용량 추정
   */
  getMemoryUsage() {
    let totalObjects = 0;
    let totalTriangles = 0;
    
    this.effects.forEach(effect => {
      Object.values(effect.objects).forEach(obj => {
        if (obj && obj.isObject3D) {
          totalObjects++;
          if (obj.geometry && obj.geometry.index) {
            totalTriangles += obj.geometry.index.count / 3;
          }
        }
      });
    });
    
    return {
      totalObjects,
      totalTriangles,
      estimatedMB: (totalTriangles * 36 + totalObjects * 1000) / 1024 / 1024 // 대략적 추정
    };
  }
}
```

## 5. 효과 컨트롤 패널 구현

### 5.1. EffectControls.vue (완전한 구현)

```vue
<template>
  <div class="effect-controls" :class="{ visible: isVisible }">
    <div class="controls-header">
      <h3>Effect Controls</h3>
      <div class="header-actions">
        <button 
          @click="resetParams"
          class="reset-button"
          title="기본값으로 리셋"
        >
          🔄
        </button>
        <button 
          @click="toggleMinimize"
          class="minimize-button"
          :title="isMinimized ? '펼치기' : '접기'"
        >
          {{ isMinimized ? '📈' : '📉' }}
        </button>
      </div>
    </div>
    
    <div v-if="!isMinimized" class="controls-content">
      <!-- 효과 선택 -->
      <div v-if="!selectedEffect" class="no-effect">
        <p>효과를 선택해주세요</p>
      </div>
      
      <!-- 파라미터 컨트롤들 -->
      <div v-else class="param-controls">
        <div 
          v-for="(param, key) in effectParams"
          :key="key"
          class="param-group"
        >
          <label :for="`param-${key}`" class="param-label">
            {{ formatParamName(key) }}
          </label>
          
          <!-- 슬라이더 컨트롤 -->
          <div v-if="param.type === 'slider'" class="slider-control">
            <input
              :id="`param-${key}`"
              type="range"
              :min="param.min"
              :max="param.max"
              :step="param.step"
              :value="param.value"
              @input="updateParam(key, $event.target.value)"
              class="param-slider"
            />
            <span class="param-value">{{ formatValue(param.value, param.step) }}</span>
          </div>
          
          <!-- 컬러 컨트롤 -->
          <div v-else-if="param.type === 'color'" class="color-control">
            <input
              :id="`param-${key}`"
              type="color"
              :value="param.value"
              @input="updateParam(key, $event.target.value)"
              class="param-color"
            />
            <span class="param-value">{{ param.value }}</span>
          </div>
          
          <!-- 토글 컨트롤 -->
          <div v-else-if="param.type === 'toggle'" class="toggle-control">
            <label class="toggle-switch">
              <input
                :id="`param-${key}`"
                type="checkbox"
                :checked="param.value"
                @change="updateParam(key, $event.target.checked)"
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <!-- 선택 컨트롤 -->
          <div v-else-if="param.type === 'select'" class="select-control">
            <select
              :id="`param-${key}`"
              :value="param.value"
              @change="updateParam(key, $event.target.value)"
              class="param-select"
            >
              <option 
                v-for="option in param.options"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- 프리셋 섹션 -->
        <div class="preset-section">
          <h4>Presets</h4>
          <div class="preset-buttons">
            <button 
              v-for="preset in presets"
              :key="preset.name"
              @click="applyPreset(preset)"
              class="preset-button"
            >
              {{ preset.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useEffectStore } from '@/store/effectStore';
import { useUIStore } from '@/store/uiStore';

export default {
  name: 'EffectControls',
  setup() {
    const effectStore = useEffectStore();
    const uiStore = useUIStore();
    
    const isMinimized = ref(false);
    
    const selectedEffect = computed(() => effectStore.selectedEffect);
    const effectParams = computed(() => effectStore.currentParams);
    const isVisible = computed(() => uiStore.isControlPanelVisible);
    
    // 기본 프리셋들
    const presets = ref([
      {
        name: 'Low',
        description: '저사양 모드',
        params: { intensity: 0.5, particleCount: 500 }
      },
      {
        name: 'Medium',
        description: '중간 설정',
        params: { intensity: 1.0, particleCount: 1000 }
      },
      {
        name: 'High',
        description: '고품질 모드',
        params: { intensity: 1.5, particleCount: 2000 }
      },
      {
        name: 'Extreme',
        description: '최고 품질',
        params: { intensity: 2.0, particleCount: 5000 }
      }
    ]);
    
    const updateParam = (key, value) => {
      effectStore.updateParam(key, value);
    };
    
    const resetParams = () => {
      effectStore.resetParams();
      uiStore.showToast('파라미터가 기본값으로 리셋되었습니다.', 'success');
    };
    
    const toggleMinimize = () => {
      isMinimized.value = !isMinimized.value;
    };
    
    const formatParamName = (key) => {
      return key.replace(/([A-Z])/g, ' $1')
               .replace(/^./, str => str.toUpperCase());
    };
    
    const formatValue = (value, step) => {
      if (step && step < 1) {
        return Number(value).toFixed(2);
      }
      return Math.round(value);
    };
    
    const applyPreset = (preset) => {
      effectStore.updateParams(preset.params);
      uiStore.showToast(`프리셋 "${preset.name}" 적용됨`, 'success');
    };
    
    return {
      selectedEffect,
      effectParams,
      isVisible,
      isMinimized,
      presets,
      updateParam,
      resetParams,
      toggleMinimize,
      formatParamName,
      formatValue,
      applyPreset
    };
  }
};
</script>

<style scoped>
.effect-controls {
  position: fixed;
  bottom: 40px;
  right: -350px;
  width: 350px;
  max-height: calc(100vh - 140px);
  background: var(--color-secondary-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: right 0.3s ease;
  z-index: 400;
  overflow: hidden;
}

.effect-controls.visible {
  right: 20px;
}

.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-primary-bg);
}

.controls-header h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.reset-button,
.minimize-button {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.reset-button:hover,
.minimize-button:hover {
  border-color: var(--color-primary-accent);
  color: var(--color-primary-accent);
}

.controls-content {
  padding: 1rem;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

.no-effect {
  text-align: center;
  color: var(--color-text-muted);
  padding: 2rem;
}

.param-group {
  margin-bottom: 1.5rem;
}

.param-label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
}

.slider-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.param-slider {
  flex: 1;
  height: 4px;
  background: var(--color-border);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.param-slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-primary-accent);
  border-radius: 50%;
  cursor: pointer;
}

.param-value {
  min-width: 50px;
  text-align: right;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-family: monospace;
}

.color-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.param-color {
  width: 60px;
  height: 30px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
}

.toggle-control {
  display: flex;
  align-items: center;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-border);
  transition: 0.2s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  transition: 0.2s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background: var(--color-primary-accent);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.param-select {
  width: 100%;
  padding: 0.5rem;
  background: var(--color-primary-bg);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text);
  font-size: 0.875rem;
}

.preset-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.preset-section h4 {
  margin: 0 0 1rem 0;
  color: var(--color-text);
  font-size: 1rem;
}

.preset-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.preset-button {
  padding: 0.5rem;
  background: var(--color-primary-bg);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.preset-button:hover {
  border-color: var(--color-primary-accent);
  background: rgba(0, 255, 255, 0.1);
}

/* 반응형 */
@media (max-width: 768px) {
  .effect-controls {
    right: -100%;
    width: 100%;
    bottom: 0;
    max-height: 50vh;
  }
  
  .effect-controls.visible {
    right: 0;
  }
}
</style>
```

## 6. 구현 체크리스트

### 6.1. 기본 클래스 구현
- [ ] `BaseEffect.js` 기본 클래스 작성
- [ ] `ParticleEffect.js` 파티클 기본 클래스 작성
- [ ] `MeshEffect.js` 메시 기본 클래스 작성 (선택사항)

### 6.2. 효과 모듈 구현
- [ ] GN 입자 효과 (`gnParticles.effect.js`)
- [ ] 뉴타입 섬광 효과 (`newtypeFlash.effect.js`)
- [ ] 미노프스키 입자 효과 (추가 구현)
- [ ] 빔 사벨 효과 (추가 구현)

### 6.3. 관리 시스템
- [ ] `EffectManager.js` 효과 관리자 구현
- [ ] 동적 로딩 시스템 구현
- [ ] 성능 모니터링 시스템 구현

### 6.4. UI 연동
- [ ] `EffectControls.vue` 완전한 구현
- [ ] 파라미터 실시간 업데이트 연동
- [ ] 프리셋 시스템 구현

## 7. 성능 최적화 가이드

### 7.1. 메모리 관리
```javascript
// ✅ 올바른 리소스 정리
dispose() {
  if (this.geometry) {
    this.geometry.dispose();
  }
  if (this.material) {
    if (Array.isArray(this.material)) {
      this.material.forEach(mat => mat.dispose());
    } else {
      this.material.dispose();
    }
  }
  if (this.texture) {
    this.texture.dispose();
  }
}
```

### 7.2. 프레임 제한
```javascript
// 60fps 제한으로 성능 최적화
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

if (now - this.lastFrameTime >= frameInterval) {
  this.updateAnimation(deltaTime);
  this.lastFrameTime = now;
}
```

### 7.3. LOD (Level of Detail) 시스템
```javascript
// 거리에 따른 품질 조정
const distanceToCamera = camera.position.distanceTo(this.position);
if (distanceToCamera > 50) {
  this.particleCount = Math.floor(this.baseParticleCount * 0.5);
} else if (distanceToCamera > 20) {
  this.particleCount = Math.floor(this.baseParticleCount * 0.8);
} else {
  this.particleCount = this.baseParticleCount;
}
```

## 8. 다음 단계

3D 효과 시스템 구현이 완료되면 다음 문서로 진행하세요:

1. **05_API_Services_Guide.md** - API 서비스와 Mock 데이터 구현
2. **06_Styling_Implementation_Guide.md** - 스타일링 시스템 구현

## 9. 트러블슈팅

### 9.1. 일반적인 문제들

#### 효과 로딩 실패
- 파일 경로 확인
- 모듈 export 형식 확인
- Webpack 동적 import 설정 확인

#### 성능 저하
- 파티클 개수 조정
- 프레임 제한 활성화
- 불필요한 연산 최적화

#### 메모리 누수
- dispose 메서드 구현 확인
- 이벤트 리스너 정리
- Three.js 객체 생명주기 관리

#### 모바일 호환성
- 파티클 개수 자동 조정
- 터치 이벤트 대응
- WebGL 지원 확인
