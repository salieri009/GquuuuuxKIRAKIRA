#!/usr/bin/env node

/**
 * Three.js 효과 검증 스크립트
 * 사용법: npm run validate-effect <effect-path>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const effectPath = process.argv[2] || process.cwd();

if (!fs.existsSync(effectPath)) {
  console.error(`❌ 경로를 찾을 수 없습니다: ${effectPath}`);
  process.exit(1);
}

const indexFile = path.join(effectPath, 'index.ts');

if (!fs.existsSync(indexFile)) {
  console.error(`❌ index.ts 파일을 찾을 수 없습니다: ${indexFile}`);
  process.exit(1);
}

console.log(`🔍 효과 검증 중: ${effectPath}\n`);

const checks = {
  hasIndexFile: fs.existsSync(indexFile),
  hasPackageJson: fs.existsSync(path.join(effectPath, 'package.json')),
  hasTsConfig: fs.existsSync(path.join(effectPath, 'tsconfig.json')),
  hasReadme: fs.existsSync(path.join(effectPath, 'README.md')),
};

// 파일 내용 검증
const indexContent = fs.readFileSync(indexFile, 'utf-8');
const contentChecks = {
  hasInit: indexContent.includes('init('),
  hasUpdate: indexContent.includes('update(') || indexContent.includes('animate('),
  hasDispose: indexContent.includes('dispose('),
  hasExport: indexContent.includes('export default'),
  hasMetadata: indexContent.includes('export const metadata'),
};

// 결과 출력
console.log('📋 파일 구조:');
Object.entries(checks).forEach(([key, value]) => {
  const icon = value ? '✅' : '⚠️';
  const name = key.replace(/([A-Z])/g, ' $1').toLowerCase();
  console.log(`  ${icon} ${name}`);
});

console.log('\n📋 코드 구조:');
Object.entries(contentChecks).forEach(([key, value]) => {
  const icon = value ? '✅' : '❌';
  const name = key.replace(/([A-Z])/g, ' $1').toLowerCase();
  console.log(`  ${icon} ${name}`);
});

// 필수 항목 확인
const required = ['hasInit', 'hasUpdate', 'hasDispose', 'hasExport'];
const missing = required.filter(key => !contentChecks[key]);

if (missing.length > 0) {
  console.log(`\n❌ 필수 항목이 누락되었습니다: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('\n✅ 효과 검증 완료!');
console.log('💡 팁: TypeScript 컴파일 오류가 없는지 확인하세요 (npm run build)');

