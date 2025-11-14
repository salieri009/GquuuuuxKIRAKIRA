# 독립적인 효과 개발 가이드

## 🎯 목표

메인 프로젝트와 **완전히 독립적으로** Three.js 효과를 개발할 수 있습니다.

---

## ✅ Loose Coupling 확인

### 현재 구조는 이미 Loose Coupling입니다!

1. **인터페이스 기반**: 표준 인터페이스만 구현하면 됨
2. **동적 로딩**: 런타임에 효과를 로드
3. **독립 디렉토리**: 메인 프로젝트와 완전히 분리
4. **의존성 분리**: Three.js만 필요 (메인 프로젝트 코드 불필요)

---

## 🚀 완전히 독립적인 효과 개발

### 1단계: 독립 디렉토리 생성

```bash
# 어디든 가능! 메인 프로젝트와 완전히 분리
mkdir -p D:/my-effects/gnParticles
cd D:/my-effects/gnParticles
```

### 2단계: 타입 정의 (선택사항)

메인 프로젝트의 타입을 import하지 않고 직접 정의:

```typescript
// my-effects/gnParticles/index.ts
import * as THREE from 'three';

// 타입을 직접 정의 (메인 프로젝트 의존성 없음)
interface MyEffectObjects {
  particleSystem: THREE.Points;
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
}

const myEffect = {
  init(scene: THREE.Scene, params: Record<string, any>): MyEffectObjects {
    // 구현
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshStandardMaterial();
    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    
    return { particleSystem, geometry, material };
  },

  update(objects: MyEffectObjects, params: Record<string, any>, deltaTime: number): void {
    // 구현
    objects.particleSystem.rotation.y += deltaTime;
  },

  dispose(scene: THREE.Scene, objects: MyEffectObjects): void {
    // 구현
    scene.remove(objects.particleSystem);
    objects.geometry.dispose();
    objects.material.dispose();
  },
};

export default myEffect;
```

### 3단계: 메인 프로젝트 설정

메인 프로젝트에서 효과 경로만 설정:

```typescript
// frontend/src/App.tsx
EffectService.setBasePath('/my-effects');
// 또는
EffectService.setBasePath('D:/my-effects'); // 절대 경로
```

---

## 📊 Coupling 수준 평가

### 현재 구조

```
메인 프로젝트 (Kirakira)
    ↓ (인터페이스만 알면 됨)
효과 모듈 (독립 디렉토리)
    ↓ (Three.js만 필요)
Three.js 라이브러리
```

**Coupling 수준**: **Loose Coupling** ✅

### 의존성 방향

```
효과 모듈 → Three.js (필수)
효과 모듈 → 메인 프로젝트 (없음!) ✅
메인 프로젝트 → 효과 모듈 (인터페이스만) ✅
```

---

## 🔍 Loose Coupling 증명

### 1. 효과 개발자는 메인 프로젝트를 몰라도 됨

```typescript
// 효과 개발자가 작성하는 코드
// 메인 프로젝트의 어떤 파일도 import하지 않음 ✅
import * as THREE from 'three';

export default {
  init: (scene, params) => { /* ... */ },
  update: (objects, params, deltaTime) => { /* ... */ },
  dispose: (scene, objects) => { /* ... */ },
};
```

### 2. 메인 프로젝트는 효과의 내부 구현을 몰라도 됨

```typescript
// 메인 프로젝트 코드
// 효과의 내부 구현을 전혀 모름 ✅
const { module } = await EffectLoader.loadEffect('gnParticles');
const objects = module.init(scene, params); // 인터페이스만 사용
```

### 3. 독립적인 배포 가능

```bash
# 효과를 별도 npm 패키지로 배포
cd my-effects/gnParticles
npm publish
```

---

## ✅ 결론

**네, 맞습니다! 완전히 Loose Coupling되어 있습니다.**

- ✅ 효과 개발자는 다른 디렉토리에서 개발 가능
- ✅ 메인 프로젝트와 완전히 분리
- ✅ 인터페이스 기반 설계
- ✅ 동적 로딩으로 런타임 연결
- ✅ 독립적인 배포 가능

**30년차 엔지니어 평가**: 현재 구조는 **Plugin Architecture** 패턴을 완벽하게 구현하고 있으며, 효과 개발자가 메인 프로젝트를 전혀 알 필요 없이 개발할 수 있습니다.

