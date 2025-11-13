#!/usr/bin/env node

/**
 * Three.js 효과 생성 스크립트
 * 사용법: npm run create-effect <effect-name>
 * 예: npm run create-effect gnParticles
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const effectName = process.argv[2];

if (!effectName) {
  console.error('❌ 효과 이름을 입력해주세요.');
  console.log('사용법: npm run create-effect <effect-name>');
  process.exit(1);
}

// 효과 이름 검증
if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(effectName)) {
  console.error('❌ 효과 이름은 영문자로 시작하고 영문자와 숫자만 사용할 수 있습니다.');
  process.exit(1);
}

// 효과 디렉토리 경로 확인
const effectsPath = process.env.VITE_EFFECTS_PATH || process.env.EFFECTS_PATH || '../my-effects';
const effectDir = path.resolve(process.cwd(), effectsPath, effectName);

// 디렉토리 생성
if (fs.existsSync(effectDir)) {
  console.error(`❌ 효과 디렉토리가 이미 존재합니다: ${effectDir}`);
  process.exit(1);
}

fs.mkdirSync(effectDir, { recursive: true });

// index.ts 파일 생성
const indexTemplate = `import * as THREE from 'three';
import type { EffectModule, EffectObjects } from '@effects/types';

/**
 * ${effectName} 효과
 * 효과 설명을 여기에 작성하세요.
 */

const ${effectName}Effect: EffectModule = {
  /**
   * 효과 초기화
   */
  init(scene: THREE.Scene, params: Record<string, any>): EffectObjects {
    // TODO: 효과 초기화 로직 구현
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: params.color || '#00FF88',
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    return { mesh, geometry, material };
  },

  /**
   * 애니메이션 업데이트
   */
  update(objects: EffectObjects, params: Record<string, any>, deltaTime: number): void {
    // TODO: 애니메이션 로직 구현
    const mesh = objects.mesh as THREE.Mesh;
    if (mesh) {
      mesh.rotation.x += deltaTime;
      mesh.rotation.y += deltaTime * 0.5;
    }
  },

  /**
   * 리소스 정리
   */
  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    // TODO: 리소스 정리 로직 구현
    const mesh = objects.mesh as THREE.Mesh;
    const geometry = objects.geometry as THREE.BufferGeometry;
    const material = objects.material as THREE.Material;

    if (mesh) {
      scene.remove(mesh);
    }
    if (geometry) {
      geometry.dispose();
    }
    if (material) {
      material.dispose();
    }
  },
};

export default ${effectName}Effect;

// 메타데이터
export const metadata = {
  name: '${effectName}',
  description: '${effectName} 효과 설명',
  version: '1.0.0',
  category: 'particles',
  tags: ['${effectName.toLowerCase()}'],
  performance: 'medium' as const,
};
`;

fs.writeFileSync(path.join(effectDir, 'index.ts'), indexTemplate);

// package.json 생성
const packageJson = {
  name: `kirakira-${effectName.toLowerCase()}`,
  version: '1.0.0',
  type: 'module',
  main: 'index.ts',
  scripts: {
    build: 'tsc',
  },
  dependencies: {
    three: '^0.158.0',
  },
  devDependencies: {
    '@types/three': '^0.179.0',
    typescript: '^5.5.3',
  },
};

fs.writeFileSync(
  path.join(effectDir, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

// tsconfig.json 생성
const tsconfig = {
  compilerOptions: {
    target: 'ES2020',
    module: 'ESNext',
    lib: ['ES2020', 'DOM'],
    moduleResolution: 'node',
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    types: ['three'],
  },
  include: ['**/*.ts'],
  exclude: ['node_modules'],
};

fs.writeFileSync(
  path.join(effectDir, 'tsconfig.json'),
  JSON.stringify(tsconfig, null, 2)
);

// README.md 생성
const readmeTemplate = `# ${effectName} 효과

## 설명

효과 설명을 여기에 작성하세요.

## 파라미터

- \`color\`: 색상 (기본값: #00FF88)

## 사용법

\`\`\`typescript
import ${effectName}Effect from './index';

const objects = ${effectName}Effect.init(scene, { color: '#FF0000' });
\`\`\`

## 개발

\`\`\`bash
npm install
npm run build
\`\`\`
`;

fs.writeFileSync(path.join(effectDir, 'README.md'), readmeTemplate);

console.log(`✅ 효과 "${effectName}"이 생성되었습니다!`);
console.log(`📁 위치: ${effectDir}`);
console.log(`\n다음 단계:`);
console.log(`1. cd ${effectDir}`);
console.log(`2. npm install`);
console.log(`3. index.ts 파일을 편집하여 효과를 구현하세요.`);
console.log(`4. npm run dev:effect로 개발 서버를 시작하세요.`);
console.log(`5. 앱에서 효과를 테스트하세요.`);

