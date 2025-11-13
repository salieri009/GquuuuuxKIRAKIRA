#!/usr/bin/env node

/**
 * 효과 개발 서버 스크립트
 * 효과 디렉토리를 감시하고 변경사항을 자동으로 반영
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const effectPath = process.argv[2] || process.env.EFFECTS_PATH || '../my-effects';

if (!fs.existsSync(effectPath)) {
  console.error(`❌ 효과 디렉토리를 찾을 수 없습니다: ${effectPath}`);
  console.log('💡 환경 변수 EFFECTS_PATH를 설정하거나 경로를 인자로 전달하세요.');
  process.exit(1);
}

console.log(`🚀 효과 개발 모드 시작`);
console.log(`📁 감시 디렉토리: ${path.resolve(effectPath)}`);
console.log(`\n효과 파일을 수정하면 자동으로 반영됩니다.\n`);

// Vite 개발 서버 시작
const viteProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    VITE_EFFECTS_PATH: effectPath,
  },
});

viteProcess.on('error', (error) => {
  console.error('❌ 개발 서버 시작 실패:', error);
  process.exit(1);
});

viteProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ 개발 서버가 종료되었습니다 (코드: ${code})`);
  }
  process.exit(code);
});

// 종료 시그널 처리
process.on('SIGINT', () => {
  console.log('\n\n🛑 개발 서버 종료 중...');
  viteProcess.kill();
  process.exit(0);
});

