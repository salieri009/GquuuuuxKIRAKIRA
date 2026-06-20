#!/usr/bin/env tsx

/**
 * Three.js 효과 생성 스크립트
 * 사용법: npm run create-effect <effect-name>
 */

import fs from "fs";
import path from "path";

const effectName = process.argv[2];

if (!effectName) {
  console.error("❌ 효과 이름을 입력해주세요.");
  console.log("사용법: npm run create-effect <effect-name>");
  process.exit(1);
}

if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(effectName)) {
  console.error(
    "❌ 효과 이름은 영문자로 시작하고 영문자와 숫자만 사용할 수 있습니다.",
  );
  process.exit(1);
}

const effectsPath =
  process.env.VITE_EFFECTS_PATH || process.env.EFFECTS_PATH || "../my-effects";
const effectDir = path.resolve(process.cwd(), effectsPath, effectName);

if (fs.existsSync(effectDir)) {
  console.error(`❌ 효과 디렉토리가 이미 존재합니다: ${effectDir}`);
  process.exit(1);
}

fs.mkdirSync(effectDir, { recursive: true });

const effectTemplate = `import * as THREE from 'three';
import type { EffectModule, EffectObjects } from '@kirakira/effect-sdk';

const impl: EffectModule = {
  init(scene: THREE.Scene, params: Record<string, unknown>): EffectObjects {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: (params.color as string) || '#00FF88',
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    return { mesh, geometry, material };
  },

  update(objects: EffectObjects, _params: Record<string, unknown>, deltaTime: number): void {
    const mesh = objects.mesh as THREE.Mesh;
    if (mesh) {
      mesh.rotation.x += deltaTime;
      mesh.rotation.y += deltaTime * 0.5;
    }
  },

  dispose(scene: THREE.Scene, objects: EffectObjects): void {
    const mesh = objects.mesh as THREE.Mesh;
    const geometry = objects.geometry as THREE.BufferGeometry;
    const material = objects.material as THREE.Material;
    if (mesh) scene.remove(mesh);
    geometry?.dispose();
    material?.dispose();
  },
};

export const init = impl.init.bind(impl);
export const update = impl.update.bind(impl);
export const dispose = impl.dispose.bind(impl);
`;

const indexTemplate = `import { init, update, dispose } from './effect';
export default { init, update, dispose };
`;

fs.writeFileSync(path.join(effectDir, "effect.ts"), effectTemplate);
fs.writeFileSync(path.join(effectDir, "index.ts"), indexTemplate);

const packageJson = {
  name: `kirakira-${effectName.toLowerCase()}`,
  version: "1.0.0",
  type: "module",
  main: "index.ts",
  scripts: { build: "tsc" },
  dependencies: { three: "^0.158.0" },
  devDependencies: {
    "@types/three": "^0.179.0",
    typescript: "^5.5.3",
  },
};

fs.writeFileSync(
  path.join(effectDir, "package.json"),
  JSON.stringify(packageJson, null, 2),
);

const tsconfig = {
  compilerOptions: {
    target: "ES2020",
    module: "ESNext",
    lib: ["ES2020", "DOM"],
    moduleResolution: "node",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    types: ["three"],
  },
  include: ["**/*.ts"],
  exclude: ["node_modules"],
};

fs.writeFileSync(
  path.join(effectDir, "tsconfig.json"),
  JSON.stringify(tsconfig, null, 2),
);

const readmeTemplate = `# ${effectName} 효과

## 개발

\`\`\`bash
npm install
npm run build
\`\`\`
`;

fs.writeFileSync(path.join(effectDir, "README.md"), readmeTemplate);

console.log(`✅ 효과 "${effectName}"이 생성되었습니다!`);
console.log(`📁 위치: ${effectDir}`);
