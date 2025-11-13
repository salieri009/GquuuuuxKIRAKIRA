# Three.js 효과 빠른 시작 가이드

## 🚀 5분 안에 효과 만들기

### 1단계: 디렉토리 생성

```bash
mkdir -p my-effects/my-first-effect
cd my-effects/my-first-effect
```

### 2단계: 파일 생성

`index.ts` 파일을 생성하고 다음 코드를 복사:

```typescript
import * as THREE from 'three';

const myEffect = {
  init(scene: THREE.Scene, params: Record<string, any>) {
    // 큐브 생성
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: params.color || '#00FF88',
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    return { mesh, geometry, material };
  },

  update(objects: any, params: Record<string, any>, deltaTime: number) {
    // 회전 애니메이션
    if (objects.mesh) {
      objects.mesh.rotation.x += deltaTime;
      objects.mesh.rotation.y += deltaTime * 0.5;
    }
  },

  dispose(scene: THREE.Scene, objects: any) {
    // 리소스 정리
    if (objects.mesh) {
      scene.remove(objects.mesh);
    }
    if (objects.geometry) {
      objects.geometry.dispose();
    }
    if (objects.material) {
      objects.material.dispose();
    }
  },
};

export default myEffect;

export const metadata = {
  name: 'My First Effect',
  description: '첫 번째 효과입니다',
  version: '1.0.0',
  category: 'other',
  tags: ['test'],
  performance: 'low' as const,
};
```

### 3단계: 효과 생성 (자동화)

또는 스크립트를 사용하여 자동으로 생성:

```bash
# 효과 생성
npm run create-effect my-first-effect

# 생성된 디렉토리로 이동
cd ../my-effects/my-first-effect

# 의존성 설치
npm install
```

### 4단계: 개발 서버 시작

```bash
# 효과 개발 모드로 서버 시작
npm run dev:effect
```

또는 수동으로 경로 설정:

`frontend/src/App.tsx`에서 효과 경로 설정:

```typescript
EffectService.setBasePath('/my-effects');
```

또는 환경 변수 사용:

```bash
# .env 파일
VITE_EFFECTS_PATH=/my-effects
```

### 5단계: 테스트

앱을 실행하고 효과를 선택하여 테스트하세요!

### 6단계: 효과 검증

```bash
# 효과 검증
npm run validate-effect ../my-effects/my-first-effect
```

## 📚 다음 단계

- [템플릿 파일](../examples/template.ts) 참고
- [개발자 도구](./DEVELOPER_TOOLS.md) 확인
- [상세 가이드](../EFFECTS_DEVELOPMENT.md) 읽기

