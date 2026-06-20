# 독립적인 효과 개발 가이드

## 🎯 목표

메인 프로젝트와 **완전히 독립적으로** Three.js 효과를 개발할 수 있습니다.

---

## ✅ Loose Coupling 확인

### 현재 구조는 이미 Loose Coupling입니다!

1. **인터페이스 기반**: 표준 인터페이스만 구현하면 됨
2. **동적 로딩**: 런타임에 효과를 로드
3. **독립 디렉토리**: 메인 프로젝트와 완전히 분리
4. **의존성 분리**: Three.js 필수, `@kirakira/effect-sdk` 선택 (`apps/web` 코드 불필요)

---

## 🚀 완전히 독립적인 효과 개발

### 1단계: 독립 디렉토리 생성

```bash
# 어디든 가능! 메인 프로젝트와 완전히 분리
mkdir -p D:/my-effects/gn-particles
cd D:/my-effects/gn-particles
```

### 2단계: 타입 정의 (선택사항)

`@kirakira/effect-sdk`를 사용하거나, 메인 앱 없이 직접 정의:

```typescript
// my-effects/gn-particles/index.ts + effect.ts (catalog metadata in packages/catalog only)
import * as THREE from 'three';
import type { EffectModule } from '@kirakira/effect-sdk'; // 선택

// 또는 타입을 직접 정의 (effect-sdk 의존성 없음)
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

내장 예제는 `dispose`에서 `safeDisposeEffectRoot`( `particleUtils` )를 사용합니다. sync `geometry.dispose()`는 WebGL 프레임 중 크래시를 유발할 수 있습니다.

### 3단계: 웹 앱 설정 (`@kirakira/web`)

모노레포 루트에서 개발 서버 실행:

```bash
# 저장소 루트 (d:\UTS\GundamKiraKIra)
npm install
npm run dev          # apps/web → http://localhost:5173
npm run dev:api      # apps/api → http://localhost:3001 (카탈로그 API)
```

효과 경로는 `apps/web/src/App.tsx` 또는 환경 변수로 설정:

```typescript
// apps/web/src/App.tsx
const effectsPath = import.meta.env.VITE_EFFECTS_PATH || '/effects';
EffectService.setBasePath(effectsPath);
// 또는
EffectService.setBasePath('/my-effects');
// EffectService.setBasePath('D:/my-effects'); // 절대 경로 (개발 시)
```

`.env` 예시:

```bash
VITE_EFFECTS_PATH=/my-effects
```

---

## 📊 Coupling 수준 평가

### 현재 구조 (모노레포)

```
@kirakira/web (apps/web)
    ↓ EffectModule 계약
@kirakira/effect-sdk (packages/effect-sdk)
    ↓ (선택 import)
효과 모듈 (독립 디렉토리)
    ↓ Three.js
Three.js 라이브러리
```

**Coupling 수준**: **Loose Coupling** ✅

### 의존성 방향

```
효과 모듈 → Three.js (필수)
효과 모듈 → @kirakira/effect-sdk (선택, 타입·헬퍼)
효과 모듈 → apps/web (없음!) ✅
apps/web → 효과 모듈 (EffectModule 인터페이스만) ✅
```

---

## 🔍 Loose Coupling 증명

### 1. 효과 개발자는 메인 프로젝트를 몰라도 됨

```typescript
// 효과 개발자가 작성하는 코드
// apps/web의 어떤 파일도 import하지 않음 ✅
import * as THREE from 'three';
import type { EffectModule } from '@kirakira/effect-sdk'; // 선택

export default {
  init: (scene, params) => { /* ... */ },
  update: (objects, params, deltaTime) => { /* ... */ },
  dispose: (scene, objects) => { /* ... */ },
};
```

### 2. 메인 프로젝트는 효과의 내부 구현을 몰라도 됨

```typescript
// apps/web — 효과 내부 구현을 모름 ✅
const module = await EffectLoader.loadEffect('gn-particles');
const objects = module.init(scene, params); // @kirakira/effect-sdk 계약만 사용
```

### 3. 독립적인 배포 가능

```bash
# 효과를 별도 npm 패키지로 배포
cd my-effects/gn-particles
npm publish
```

---

## ✅ 결론

**네, 맞습니다! 완전히 Loose Coupling되어 있습니다.**

- ✅ 효과 개발자는 다른 디렉토리에서 개발 가능
- ✅ `apps/web`과 완전히 분리 (`@kirakira/effect-sdk`로 계약 공유)
- ✅ 인터페이스 기반 설계
- ✅ 동적 로딩으로 런타임 연결
- ✅ 독립적인 배포 가능

**30년차 엔지니어 평가**: 모노레포 **Plugin Architecture** 패턴으로, 효과 개발자가 `apps/web`을 몰라도 `@kirakira/effect-sdk`만으로 개발할 수 있습니다.

