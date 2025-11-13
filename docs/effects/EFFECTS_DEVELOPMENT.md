# Three.js 효과 개발 가이드

<div align="center">

**별도 디렉토리에서 효과를 개발하고 통합하는 완전한 가이드**

</div>

---

## 📋 목차

1. [개요](#개요)
2. [효과 디렉토리 구조](#효과-디렉토리-구조)
3. [빠른 시작](#빠른-시작)
4. [효과 모듈 인터페이스](#효과-모듈-인터페이스)
5. [개발 환경 설정](#개발-환경-설정)
6. [효과 작성 가이드](#효과-작성-가이드)
7. [통합 및 테스트](#통합-및-테스트)
8. [배포](#배포)
9. [트러블슈팅](#트러블슈팅)

---

## 1. 개요

Kirakira 프로젝트는 Three.js 효과를 **별도 디렉토리에서 독립적으로 개발**할 수 있는 구조를 제공합니다. 이를 통해:

- ✅ 효과 개발과 메인 앱 개발을 분리
- ✅ 효과를 재사용 가능한 모듈로 관리
- ✅ 여러 효과를 독립적으로 개발 및 테스트
- ✅ 효과를 별도 저장소나 패키지로 배포

---

## 2. 효과 디렉토리 구조

### 2.1. 권장 구조

```
my-effects/                    # 효과 루트 디렉토리 (프로젝트 외부 가능)
├── gnParticles/              # 효과 1
│   ├── index.ts              # 효과 모듈 메인 파일 (필수)
│   ├── package.json          # (선택사항) 의존성 관리
│   ├── tsconfig.json         # (선택사항) TypeScript 설정
│   └── README.md             # (선택사항) 효과 문서
├── newtypeFlash/             # 효과 2
│   └── index.ts
├── minofskyParticles/        # 효과 3
│   └── index.ts
└── manifest.json            # (선택사항) 효과 목록 메타데이터
```

### 2.2. 디렉토리 위치 옵션

효과 디렉토리는 다음 위치에 둘 수 있습니다:

1. **프로젝트 내부**: `frontend/src/effects/` (기본)
2. **프로젝트 루트**: `GundamKiraKIra/effects/`
3. **프로젝트 외부**: `D:/my-effects/` (절대 경로)
4. **별도 저장소**: Git 서브모듈 또는 npm 패키지

---

## 3. 빠른 시작

### 3.1. 효과 디렉토리 생성

```bash
# 프로젝트 루트에서
mkdir -p my-effects/gnParticles
cd my-effects/gnParticles
```

### 3.2. 기본 효과 모듈 작성

`index.ts` 파일 생성:

```typescript
import * as THREE from 'three';

/**
 * GN 입자 효과
 * 건담 00 시리즈의 GN 드라이브 입자 효과
 */

// 효과 모듈 인터페이스 구현
const gnParticleEffect = {
  /**
   * 효과 초기화
   */
  init(scene: THREE.Scene, params: Record<string, any>) {
    const particleCount = params.particleCount || 2000;
    const particleSize = params.particleSize || 0.08;
    const color = params.color || '#00FF88';
    const spread = params.spread || 8.0;

    // 파티클 지오메트리 생성
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorObj = new THREE.Color(color);

    // 파티클 초기화
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

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // 머테리얼 생성
    const material = new THREE.PointsMaterial({
      size: particleSize,
      vertexColors: true,
      transparent: true,
      opacity: params.opacity || 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    // 파티클 시스템 생성
    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // dispose에서 정리할 수 있도록 모든 객체 반환
    return {
      particleSystem,
      geometry,
      material,
    };
  },

  /**
   * 애니메이션 업데이트 (매 프레임 호출)
   */
  update(objects: any, params: Record<string, any>, deltaTime: number) {
    const { particleSystem, geometry, material } = objects;
    if (!particleSystem) return;

    // 회전 애니메이션
    particleSystem.rotation.y += deltaTime * (params.speed || 1.0) * 0.2;

    // 파라미터 업데이트
    if (material) {
      const color = new THREE.Color(params.color || '#00FF88');
      material.color.copy(color);
      material.size = params.particleSize || 0.08;
      material.opacity = params.opacity || 0.8;
    }

    // 파티클 위치 업데이트 (터뷸런스 효과)
    if (geometry) {
      const positions = geometry.attributes.position.array as Float32Array;
      const turbulence = params.turbulence || 0.5;
      const time = performance.now() * 0.001;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(time * 2 + i * 0.1) * turbulence * deltaTime * 0.1;
        positions[i + 1] += Math.cos(time * 1.5 + i * 0.15) * turbulence * deltaTime * 0.1;
        positions[i + 2] += Math.sin(time * 1.8 + i * 0.12) * turbulence * deltaTime * 0.1;
      }

      geometry.attributes.position.needsUpdate = true;
    }
  },

  /**
   * 리소스 정리
   */
  dispose(scene: THREE.Scene, objects: any) {
    const { particleSystem, geometry, material } = objects;

    // Scene에서 제거
    if (particleSystem) {
      scene.remove(particleSystem);
    }

    // 리소스 해제
    if (geometry) {
      geometry.dispose();
    }

    if (material) {
      material.dispose();
    }
  },
};

// 모듈 export (필수)
export default gnParticleEffect;

// 메타데이터 (선택사항)
export const metadata = {
  name: 'GN Particles',
  description: 'GN 드라이브에서 방출되는 고에너지 입자 효과',
  version: '1.0.0',
  author: 'Your Name',
  category: 'particles',
  tags: ['gundam-00', 'gn-drive', 'particles'],
  performance: 'medium' as const,
  thumbnail: '/images/effects/gn-particles-thumb.jpg',
};
```

### 3.3. Vite 설정 업데이트

`frontend/vite.config.ts` 수정:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@effects': path.resolve(__dirname, './src/effects'),
    },
  },
  
  server: {
    fs: {
      // 프로젝트 외부 디렉토리 접근 허용
      allow: [
        '..',                           // 상위 디렉토리
        '../../my-effects',             // 상대 경로
        'D:/my-effects',               // 절대 경로 (Windows)
        '/Users/username/my-effects',   // 절대 경로 (Mac/Linux)
      ],
    },
    // 효과 디렉토리를 정적 파일로 서빙
    // 예: /my-effects -> ../../my-effects
  },
  
  // 빌드 설정
  build: {
    rollupOptions: {
      // 효과 모듈을 외부로 처리하지 않음 (번들에 포함)
      // 또는 별도로 빌드하여 정적 파일로 서빙
    },
  },
});
```

### 3.4. 효과 경로 설정

`frontend/src/App.tsx`에서 효과 경로 설정:

```typescript
import { EffectService } from './services/effectService';

// 개발 환경: 로컬 효과 디렉토리
// 프로덕션: 빌드된 효과 경로
const effectsPath = import.meta.env.DEV
  ? '/my-effects'              // 개발: 정적 파일 서빙 또는 상대 경로
  : '/effects';                // 프로덕션: 빌드된 효과

EffectService.setBasePath(effectsPath);
```

또는 환경 변수 사용 (`.env` 파일):

```bash
# .env.development
VITE_EFFECTS_PATH=/my-effects

# .env.production
VITE_EFFECTS_PATH=/effects
```

```typescript
const effectsPath = import.meta.env.VITE_EFFECTS_PATH || '/effects';
EffectService.setBasePath(effectsPath);
```

### 3.5. 효과 사용

효과는 자동으로 로드됩니다:

```typescript
// EffectCanvas 컴포넌트에서 자동 처리
// 또는 수동으로 로드:
import { EffectService } from '@/services/effectService';

const { module, metadata } = await EffectService.loadEffectModule('gnParticles');
const objects = module.init(scene, { particleCount: 2000, color: '#00FF88' });
```

---

## 4. 효과 모듈 인터페이스

### 4.1. 필수 인터페이스

모든 효과 모듈은 다음 인터페이스를 구현해야 합니다:

```typescript
interface EffectModule {
  /**
   * 효과 초기화
   * @param scene Three.js Scene 객체
   * @param params 효과 파라미터 (Record<string, any>)
   * @returns EffectObjects - dispose에서 정리할 객체들
   */
  init: (scene: THREE.Scene, params: Record<string, any>) => EffectObjects;

  /**
   * 애니메이션 업데이트 (매 프레임 호출)
   * @param objects init에서 반환된 객체들
   * @param params 현재 파라미터 값
   * @param deltaTime 경과 시간 (초 단위)
   */
  update: (objects: EffectObjects, params: Record<string, any>, deltaTime: number) => void;

  /**
   * 리소스 정리
   * @param scene Three.js Scene 객체
   * @param objects init에서 반환된 객체들
   */
  dispose: (scene: THREE.Scene, objects: EffectObjects) => void;
}
```

### 4.2. EffectObjects 타입

```typescript
interface EffectObjects {
  [key: string]: 
    | THREE.Object3D 
    | THREE.Material 
    | THREE.Geometry 
    | THREE.Texture 
    | THREE.BufferGeometry
    | any;
}
```

**중요**: `dispose`에서 정리할 수 있도록 모든 Three.js 객체를 반환해야 합니다.

---

## 5. 개발 환경 설정

### 5.1. TypeScript 설정 (선택사항)

효과 디렉토리에 `tsconfig.json` 생성:

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
    "forceConsistentCasingInFileNames": true,
    "types": ["three"]
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### 5.2. package.json (선택사항)

효과 디렉토리에 `package.json` 생성:

```json
{
  "name": "kirakira-gn-particles",
  "version": "1.0.0",
  "type": "module",
  "main": "index.ts",
  "dependencies": {
    "three": "^0.158.0"
  },
  "devDependencies": {
    "@types/three": "^0.179.0",
    "typescript": "^5.5.3"
  }
}
```

### 5.3. 개발 서버에서 효과 서빙

효과를 정적 파일로 서빙하려면:

**옵션 1: Vite 정적 파일 서빙**

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    fs: {
      allow: ['..', '../../my-effects'],
    },
    // 효과 디렉토리를 public처럼 서빙
    // /my-effects -> ../../my-effects
  },
});
```

**옵션 2: 심볼릭 링크 사용**

```bash
# Windows (관리자 권한 필요)
mklink /D frontend\public\effects ..\my-effects

# Mac/Linux
ln -s ../../my-effects frontend/public/effects
```

**옵션 3: 개발 서버 프록시**

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/my-effects': {
        target: 'file:///D:/my-effects',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 6. 효과 작성 가이드

### 6.1. 기본 템플릿

```typescript
import * as THREE from 'three';

const myEffect = {
  init(scene: THREE.Scene, params: Record<string, any>) {
    // 1. Three.js 객체 생성
    // 2. Scene에 추가
    // 3. 객체들 반환
    return { /* objects */ };
  },

  update(objects: any, params: Record<string, any>, deltaTime: number) {
    // 1. 파라미터에 따라 객체 업데이트
    // 2. 애니메이션 로직 실행
  },

  dispose(scene: THREE.Scene, objects: any) {
    // 1. Scene에서 제거
    // 2. 모든 리소스 해제 (geometry, material, texture 등)
  },
};

export default myEffect;
export const metadata = { /* ... */ };
```

### 6.2. 파라미터 처리

```typescript
init(scene: THREE.Scene, params: Record<string, any>) {
  // 기본값 제공
  const particleCount = params.particleCount ?? 2000;
  const color = params.color ?? '#00FF88';
  const size = params.size ?? 1.0;

  // 범위 검증
  const clampedCount = Math.max(100, Math.min(10000, particleCount));
  
  // 타입 변환
  const colorObj = new THREE.Color(color);
  
  // ...
}
```

### 6.3. 성능 최적화

```typescript
update(objects: any, params: Record<string, any>, deltaTime: number) {
  // 1. 불필요한 재계산 최소화
  if (params.particleCount !== this.lastParticleCount) {
    // 파티클 개수 변경 시에만 재생성
    this.recreateParticles(params.particleCount);
  }

  // 2. 조건부 업데이트
  if (params.enableAnimation) {
    // 애니메이션이 활성화된 경우에만 업데이트
    this.animate(deltaTime);
  }

  // 3. 버퍼 업데이트 최소화
  if (this.needsUpdate) {
    geometry.attributes.position.needsUpdate = true;
    this.needsUpdate = false;
  }
}
```

### 6.4. 메모리 관리

```typescript
dispose(scene: THREE.Scene, objects: any) {
  // 1. Scene에서 제거
  Object.values(objects).forEach(obj => {
    if (obj instanceof THREE.Object3D) {
      scene.remove(obj);
    }
  });

  // 2. Geometry 정리
  Object.values(objects).forEach(obj => {
    if (obj instanceof THREE.BufferGeometry || obj instanceof THREE.Geometry) {
      obj.dispose();
    }
  });

  // 3. Material 정리
  Object.values(objects).forEach(obj => {
    if (obj instanceof THREE.Material) {
      obj.dispose();
    } else if (obj instanceof THREE.Mesh && obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach(mat => mat.dispose());
      } else {
        obj.material.dispose();
      }
    }
  });

  // 4. Texture 정리
  Object.values(objects).forEach(obj => {
    if (obj instanceof THREE.Texture) {
      obj.dispose();
    } else if (obj instanceof THREE.Material && obj.map) {
      obj.map.dispose();
    }
  });
}
```

---

## 7. 통합 및 테스트

### 7.1. 효과 등록

효과를 사용하려면 `effects.json`에 등록:

```json
{
  "id": "gnParticles",
  "name": "GN 입자",
  "description": "GN 드라이브에서 방출되는 고에너지 입자 효과",
  "category": "particles",
  "relatedGundam": ["엑시아", "더블오"],
  "defaultParams": {
    "particleCount": { "type": "slider", "value": 2000, "min": 500, "max": 5000, "step": 100 },
    "particleSize": { "type": "slider", "value": 0.08, "min": 0.02, "max": 0.15, "step": 0.01 },
    "color": { "type": "color", "value": "#00FF88" },
    "speed": { "type": "slider", "value": 1.5, "min": 0.5, "max": 3.0, "step": 0.1 }
  }
}
```

### 7.2. 로컬 테스트

효과를 로컬에서 테스트:

```typescript
// test-effect.ts
import * as THREE from 'three';
import { WebGLRenderer } from 'three';
import myEffect from './index';

// Scene 생성
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new WebGLRenderer();

// 효과 초기화
const objects = myEffect.init(scene, { particleCount: 2000 });

// 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);
  const deltaTime = 0.016; // 60fps
  myEffect.update(objects, { speed: 1.0 }, deltaTime);
  renderer.render(scene, camera);
}

animate();

// 정리
// myEffect.dispose(scene, objects);
```

### 7.3. 통합 테스트

메인 앱에서 효과 로드 테스트:

```typescript
import { EffectService } from '@/services/effectService';

// 효과 경로 설정
EffectService.setBasePath('/my-effects');

// 효과 로드
try {
  const { module, metadata } = await EffectService.loadEffectModule('gnParticles');
  console.log('효과 로드 성공:', metadata);
} catch (error) {
  console.error('효과 로드 실패:', error);
}
```

---

## 8. 배포

### 8.1. 효과 빌드

효과를 별도 패키지로 빌드:

```bash
cd my-effects/gnParticles

# TypeScript 빌드
tsc --outDir dist --module ES2020 --target ES2020

# 또는 Webpack/Vite로 번들링
```

### 8.2. 정적 파일 배포

빌드된 효과를 정적 파일로 배포:

```bash
# 효과 빌드
npm run build:effects

# dist 디렉토리를 정적 서버에 업로드
# 예: /effects/gnParticles/index.js
```

### 8.3. CDN 배포

효과를 CDN에 배포:

```typescript
// CDN에서 효과 로드
EffectService.setBasePath('https://cdn.example.com/effects');
```

### 8.4. npm 패키지로 배포

효과를 npm 패키지로 배포:

```json
{
  "name": "@kirakira/gn-particles",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"]
}
```

```typescript
// npm 패키지에서 로드
import gnParticles from '@kirakira/gn-particles';
```

---

## 9. 트러블슈팅

### 9.1. 효과 로드 실패

**문제**: `Failed to load effect module`

**해결책**:
1. 효과 경로 확인: `EffectService.setBasePath()` 설정 확인
2. 파일 경로 확인: `index.ts` 또는 `index.js` 파일 존재 확인
3. Vite 설정 확인: `server.fs.allow`에 효과 디렉토리 경로 추가
4. 모듈 export 확인: `export default`로 모듈 export 확인

### 9.2. 타입 에러

**문제**: TypeScript 타입 에러

**해결책**:
```typescript
// 타입 정의 import
import type { EffectModule, EffectObjects } from '@effects/types';

// 또는 타입 단언 사용
const module = effectModule as EffectModule;
```

### 9.3. 메모리 누수

**문제**: 효과 전환 시 메모리 사용량 증가

**해결책**:
1. `dispose` 메서드에서 모든 리소스 정리 확인
2. Geometry, Material, Texture 모두 `dispose()` 호출
3. 이벤트 리스너 제거 확인

### 9.4. 성능 저하

**문제**: 효과 실행 시 프레임 드롭

**해결책**:
1. 파티클 개수 조정
2. 불필요한 재계산 최소화
3. `needsUpdate` 플래그 사용
4. LOD (Level of Detail) 시스템 구현

---

## 10. 고급 기능

### 10.1. 효과 프리셋

효과별 프리셋 저장:

```typescript
// 프리셋 저장
const preset = {
  effectId: 'gnParticles',
  name: 'High Quality',
  params: { particleCount: 5000, particleSize: 0.1 },
};

localStorage.setItem('preset-gnParticles-high', JSON.stringify(preset));
```

### 10.2. 효과 조합

여러 효과를 조합:

```typescript
const combinedEffect = {
  init(scene, params) {
    const objects1 = effect1.init(scene, params);
    const objects2 = effect2.init(scene, params);
    return { ...objects1, ...objects2 };
  },
  // ...
};
```

### 10.3. 효과 애니메이션

효과 전환 애니메이션:

```typescript
update(objects, params, deltaTime) {
  // 페이드 인/아웃
  if (objects.material) {
    objects.material.opacity = Math.min(1, objects.material.opacity + deltaTime);
  }
}
```

---

## 11. 예제 프로젝트

완전한 예제는 다음을 참고하세요:

- [GN 입자 효과 예제](../src/effects/examples/gnParticles.ts)
- [효과 타입 정의](../src/effects/types.ts)
- [효과 로더 구현](../src/effects/loader.ts)

---

## 12. 참고 자료

- [Three.js 공식 문서](https://threejs.org/docs/)
- [Three.js 예제](https://threejs.org/examples/)
- [효과 타입 정의](../src/effects/types.ts)
- [효과 서비스](../src/services/effectService.ts)

---

<div align="center">

**효과 개발이 즐거우시길 바랍니다! 🚀**

문제가 있으면 이슈를 등록해주세요.

</div>
