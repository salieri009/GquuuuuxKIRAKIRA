# Loose Coupling 아키텍처 설계

## 📋 개요

Kirakira 모노레포는 **완전한 Loose Coupling** 구조를 제공하여, Three.js 효과 개발자가 `apps/web`과 독립적으로 효과를 개발할 수 있습니다.

---

## ✅ Loose Coupling 구현 현황

### 1. **인터페이스 기반 설계** ⭐⭐⭐⭐⭐

효과 모듈은 `@kirakira/effect-sdk`가 정의한 표준 인터페이스만 구현하면 됩니다:

```typescript
// packages/effect-sdk — 런타임 계약
import type { EffectModule, EffectObjects } from '@kirakira/effect-sdk';

// 효과 개발자는 이 인터페이스만 알면 됨
interface EffectModule {
  init: (scene: THREE.Scene, params: Record<string, any>) => EffectObjects;
  update: (objects: EffectObjects, params: Record<string, any>, deltaTime: number) => void;
  dispose: (scene: THREE.Scene, objects: EffectObjects) => void;
}
```

**평가**: ✅ **완벽한 Loose Coupling**
- `apps/web` 내부 구현을 알 필요 없음
- `@kirakira/effect-sdk` 인터페이스만 구현하면 자동으로 통합됨

### 2. **동적 로딩** ⭐⭐⭐⭐

```typescript
// 런타임에 동적으로 로드
const module = await EffectLoader.loadEffect('gn-particles', '/my-effects');
```

**평가**: ✅ **Loose Coupling**
- 컴파일 타임 의존성 없음
- 런타임에 동적으로 연결

### 3. **독립적인 디렉토리** ⭐⭐⭐⭐⭐

```
my-effects/              # 완전히 독립적인 디렉토리
├── gn-particles/
│   ├── index.ts         # export { default } from './effect'
│   └── effect.ts        # implementation + bindEffectModule (no export const metadata)
│   ├── package.json     # 독립적인 의존성
│   └── tsconfig.json     # 독립적인 설정
└── manifest.json         # 효과 목록
```

**평가**: ✅ **완벽한 Loose Coupling**
- 메인 프로젝트와 완전히 분리
- 별도 저장소로 관리 가능
- npm 패키지로 배포 가능

---

## ✅ 타입 정의 독립화 (구현 완료)

### `@kirakira/effect-sdk` — 런타임 계약 패키지

Three.js 효과의 **런타임 계약**(`EffectModule`, `EffectObjects`, `BaseEffect`)은 `packages/effect-sdk`에 분리되어 있습니다. `apps/web`과 외부 효과 개발자 모두 이 패키지만 의존하면 됩니다.

```typescript
// 효과 개발자: apps/web 없이 effect-sdk만 import
import type { EffectModule, EffectObjects } from '@kirakira/effect-sdk';
import * as THREE from 'three';
```

**카탈로그 DTO**(`Effect`, `EffectParameter`)는 별도 패키지 `@kirakira/contracts`에 있으며, 런타임 계약과 혼동하지 않도록 구분합니다.

타입을 import하지 않아도 런타임 검증으로 동작 가능합니다. `EffectLoader`가 `init` / `update` / `dispose` 존재 여부를 검사합니다.

---

## ⚠️ 남은 한계점

### **Vite 동적 Import 제한**

**현재 문제**: Vite의 동적 import는 빌드 타임에 분석되므로, 완전히 외부 디렉토리의 모듈을 로드하기 어려울 수 있음

**개선 방안**: 
- 개발 환경: Vite의 `fs.allow` 설정으로 외부 디렉토리 접근
- 프로덕션: 빌드된 효과를 정적 파일로 서빙

---

## 🎯 추가 개선 여지

### 인터페이스 검증 런타임화 (부분 구현)

컴파일 타임이 아닌 런타임에 인터페이스를 검증:

```typescript
// apps/web/src/effects/loader.ts — normalizeEffectModule (런타임 검증)
for (const method of EFFECT_LIFECYCLE_METHODS) {
  if (typeof candidate[method] !== 'function') {
    throw new Error(`Invalid effect module: ${effectId}. Module must have a '${method}' method.`);
  }
}
```

`EffectLoader`는 `@effects/examples/<id>/index.ts`를 `importDefaultFromPaths`로 우선 시도합니다. default export가 없으면 다음 경로로 넘어갑니다. 모듈 캐시는 없으며 legacy `animate` alias도 지원하지 않습니다. 앱 레벨 캐시는 `EffectService.loadEffectModule`이 담당합니다.

### Catalog vs manifest

- **Kirakira app**: `packages/catalog/effects.json` is the catalog single source (names, params, thumbnails).
- **Effect modules**: `examples/<catalog-id>/index.ts` + `effect.ts` — runtime only (`init` / `update` / `dispose`), no `export const metadata`.
- **External `my-effects/`** (optional): `manifest.json` is a fallback for `EffectLoader.listEffects` only.

```json
{
  "effects": [{ "id": "gn-particles", "path": "./gn-particles/index.ts" }]
}
```

---

## 📊 Loose Coupling 평가

| 항목 | 현재 상태 | 목표 | 평가 |
|------|----------|------|------|
| **인터페이스 분리** | ✅ `@kirakira/effect-sdk` | ✅ 완벽 | ⭐⭐⭐⭐⭐ |
| **의존성 분리** | ✅ effect-sdk 분리 | ✅ 완전 분리 | ⭐⭐⭐⭐⭐ |
| **디렉토리 분리** | ✅ 완벽 | ✅ 완벽 | ⭐⭐⭐⭐⭐ |
| **런타임 로딩** | ✅ 구현됨 | ✅ 구현됨 | ⭐⭐⭐⭐ |
| **독립적 개발** | ✅ effect-sdk로 가능 | ✅ 완전 | ⭐⭐⭐⭐⭐ |

**전체 평가**: **4.8/5.0** ⭐⭐⭐⭐⭐

---

## 🔧 권장 사항

### 1. 타입은 `@kirakira/effect-sdk` 사용 (선택)

```bash
# 모노레포 루트에서 워크스페이스 의존성으로 연결
npm install @kirakira/effect-sdk --workspace=my-effect-package
```

또는 외부 저장소에서는:

```bash
npm install @kirakira/effect-sdk
```

### 2. 타입 없이도 개발 가능

```typescript
// EffectLoader가 런타임에 인터페이스 검증
export default {
  init: (scene, params) => { /* ... */ },
  update: (objects, params, deltaTime) => { /* ... */ },
  dispose: (scene, objects) => { /* ... */ },
};
```

### 3. 효과 개발 가이드

`docs/effects/STANDALONE_DEVELOPMENT.md` — `apps/web` 없이 독립 개발 절차

---

## ✅ 결론

**현재 구조는 Loose Coupling이 잘 구현되어 있습니다:**

✅ **잘 구현된 부분**:
- `@kirakira/effect-sdk` 기반 인터페이스 설계
- 동적 로딩 (`apps/web/src/effects/loader.ts`)
- 독립적인 디렉토리 구조
- 런타임 검증

⚠️ **남은 개선**:
- Vite 외부 디렉토리 동적 import (개발·프로덕션 경로 설정)

**30년차 엔지니어 관점**: 모노레포에서 **Plugin Architecture** 패턴을 따르며, `effect-sdk`로 런타임 계약이 분리되어 효과 개발자가 `apps/web`을 몰라도 개발할 수 있습니다.

