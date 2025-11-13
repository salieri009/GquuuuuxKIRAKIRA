# Three.js 효과 개발자 도구 가이드

## 🛠️ 개발 환경 설정

### 1. 효과 개발 디렉토리 생성

```bash
# 프로젝트 외부에 효과 디렉토리 생성
mkdir -p D:/my-effects/gnParticles
cd D:/my-effects/gnParticles
```

### 2. TypeScript 설정

`tsconfig.json` 생성:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "types": ["three"]
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3. 패키지 설정

`package.json` 생성:

```json
{
  "name": "kirakira-gn-particles",
  "version": "1.0.0",
  "type": "module",
  "main": "index.ts",
  "scripts": {
    "dev": "vite build --watch",
    "build": "tsc"
  },
  "dependencies": {
    "three": "^0.158.0"
  },
  "devDependencies": {
    "@types/three": "^0.179.0",
    "typescript": "^5.5.3"
  }
}
```

## 🚀 빠른 시작 템플릿

`index.ts` 파일을 생성하고 다음 템플릿을 사용:

```typescript
import * as THREE from 'three';
import type { EffectModule, EffectObjects } from '@effects/types';

const myEffect: EffectModule = {
  init(scene: THREE.Scene, params: Record<string, any>): EffectObjects {
    // 효과 초기화
    return {};
  },

  update(objects: EffectObjects, params: Record<string, any>, deltaTime: number): void {
    // 애니메이션 업데이트
  },

  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    // 리소스 정리
  },
};

export default myEffect;

export const metadata = {
  name: 'My Effect',
  description: 'Effect description',
  version: '1.0.0',
  category: 'particles',
  tags: ['tag1'],
  performance: 'medium' as const,
};
```

## 📝 개발 체크리스트

### 필수 구현 사항

- [ ] `init` 메서드 구현
- [ ] `update` 메서드 구현
- [ ] `dispose` 메서드 구현
- [ ] 메타데이터 export
- [ ] 파라미터 기본값 제공
- [ ] 리소스 정리 (메모리 누수 방지)

### 권장 사항

- [ ] TypeScript 타입 안정성
- [ ] 성능 최적화 (파티클 개수 조절 등)
- [ ] 에러 처리
- [ ] 주석 및 문서화

## 🔍 디버깅 팁

### 1. 콘솔 로깅

```typescript
update(objects: EffectObjects, params: Record<string, any>, deltaTime: number): void {
  if (import.meta.env.DEV) {
    console.log('Update:', { params, deltaTime });
  }
  // ...
}
```

### 2. 성능 모니터링

```typescript
const startTime = performance.now();
// ... 작업 ...
const duration = performance.now() - startTime;
if (duration > 16) { // 60fps 기준
  console.warn('Performance warning:', duration, 'ms');
}
```

### 3. 메모리 누수 확인

```typescript
dispose(scene: THREE.Scene, objects: EffectObjects): void {
  // 모든 리소스 정리 확인
  Object.values(objects).forEach(obj => {
    if (obj instanceof THREE.Object3D) {
      console.log('Disposing:', obj.constructor.name);
      scene.remove(obj);
    }
  });
}
```

## 📦 빌드 및 배포

### 로컬 테스트

```bash
# 효과 디렉토리에서
npm install
npm run build
```

### 프로덕션 배포

효과를 빌드하여 정적 파일로 서빙:

```bash
# TypeScript 컴파일
tsc --outDir dist

# 또는 Vite로 번들링
vite build
```

## 🛠️ 개발 도구 사용법

### 효과 생성

```bash
# 새 효과 생성
npm run create-effect <effect-name>

# 예시
npm run create-effect gnParticles
```

### 효과 검증

```bash
# 현재 디렉토리의 효과 검증
npm run validate-effect

# 특정 경로의 효과 검증
npm run validate-effect <path>
```

### 개발 서버 시작

```bash
# 효과 개발 모드로 서버 시작
npm run dev:effect

# 특정 경로 지정
EFFECTS_PATH=../my-effects npm run dev:effect
```

## 🔗 유용한 링크

- [Three.js 공식 문서](https://threejs.org/docs/)
- [Three.js 예제](https://threejs.org/examples/)
- [효과 타입 정의](../types.ts)
- [예제 효과](../examples/gnParticles.ts)
- [템플릿](../examples/template.ts)
- [빠른 시작 가이드](./QUICK_START.md)

