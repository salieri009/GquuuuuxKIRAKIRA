# 07. 3D 효과 모듈 설계 (3D Effect Module Design)

## 1. 설계 목표

- 각 3D 효과를 독립적인 모듈로 분리하여 관리의 용이성과 재사용성을 높임.
- `EffectCanvas.vue` 컴포넌트가 어떤 효과든 일관된 방식으로 로드하고 제어할 수 있도록 표준화된 인터페이스를 정의.

## 2. 모듈 인터페이스

- 모든 효과 모듈(`src/effects/*.effect.js`)은 다음의 함수를 `export` 해야 함.

```javascript
/**
 * 효과를 초기화하고 Scene에 추가합니다.
 * @param {THREE.Scene} scene - Three.js Scene 객체
 * @param {object} params - 효과의 초기 파라미터
 * @returns {object} - 애니메이션 루프에서 사용할 객체(들)
 */
export function init(scene, params) {
  // 파티클, 메쉬 등 Three.js 객체 생성 및 초기 설정
  // ...
  // 생성된 객체들을 scene에 추가
  // scene.add(particleSystem);
  // animate 함수에서 참조할 객체들을 반환
  return { particleSystem };
}

/**
 * 매 프레임마다 호출될 애니메이션 로직입니다.
 * @param {object} objects - init 함수에서 반환된 객체
 * @param {object} params - 실시간으로 업데이트되는 파라미터
 * @param {number} delta - 경과 시간
 */
export function animate(objects, params, delta) {
  // objects.particleSystem의 속성을 params 값에 따라 업데이트
  // 예: objects.particleSystem.rotation.y += delta * params.speed;
}

/**
 * 효과를 Scene에서 제거하고 리소스를 해제합니다.
 * @param {THREE.Scene} scene - Three.js Scene 객체
 * @param {object} objects - init 함수에서 반환된 객체
 */
export function dispose(scene, objects) {
  // scene에서 객체 제거
  // scene.remove(objects.particleSystem);
  // geometry, material 등의 메모리 해제
  // objects.particleSystem.geometry.dispose();
  // objects.particleSystem.material.dispose();
}
```

## 3. 구현 예시 (`src/effects/gnParticles.effect.js`)

```javascript
import * as THREE from 'three';

let particleSystem;

export function init(scene, params) {
  const particleCount = 5000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: new THREE.Color(params.color),
    size: params.size,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });

  particleSystem = new THREE.Points(particles, material);
  scene.add(particleSystem);

  return { particleSystem };
}

export function animate({ particleSystem }, params, delta) {
  particleSystem.rotation.y += delta * params.speed;

  // 파라미터 실시간 반영
  particleSystem.material.color.set(params.color);
  particleSystem.material.size = params.size;
  particleSystem.material.needsUpdate = true;
}

export function dispose(scene, { particleSystem }) {
  scene.remove(particleSystem);
  particleSystem.geometry.dispose();
  particleSystem.material.dispose();
}
```

## 4. `EffectCanvas.vue` 와의 연동

- `EffectCanvas.vue`는 `selectedEffect`가 변경될 때마다 다음과 같은 로직을 수행.

1.  **기존 효과 정리**: 현재 로드된 효과가 있다면, 해당 모듈의 `dispose` 함수를 호출하여 리소스를 정리.
2.  **새 효과 동적 로드**: `import(\`@/effects/${newEffectName}.effect.js\`)`를 통해 새 효과 모듈을 비동기적으로 로드.
3.  **새 효과 초기화**: 로드된 모듈의 `init` 함수를 호출하여 새 효과를 Scene에 추가하고, 반환된 객체들을 내부 상태에 저장.
4.  **애니메이션 루프 업데이트**: 렌더링 루프(`requestAnimationFrame`)에서 새 모듈의 `animate` 함수를 호출하도록 설정.
