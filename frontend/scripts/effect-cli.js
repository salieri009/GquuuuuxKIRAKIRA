#!/usr/bin/env node

/**
 * Three.js 효과 개발 CLI 도구
 * 사용법: npm run effect <command> [options]
 * 
 * 참고: commander 패키지가 필요합니다 (npm install commander)
 */

import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('effect')
  .description('Three.js 효과 개발 도구')
  .version('1.0.0');

// create 명령어
program
  .command('create <name>')
  .description('새로운 효과 생성')
  .option('-p, --path <path>', '효과 디렉토리 경로', '../my-effects')
  .action(async (name, options) => {
    process.env.EFFECTS_PATH = options.path;
    process.argv = ['node', 'create-effect.js', name];
    // 동적 import로 실행
    const { default: createEffect } = await import('./create-effect.js');
    if (typeof createEffect === 'function') {
      createEffect();
    }
  });

// validate 명령어
program
  .command('validate [path]')
  .description('효과 검증')
  .action(async (effectPath) => {
    process.argv = ['node', 'validate-effect.js', effectPath || process.cwd()];
    // 동적 import로 실행
    const { default: validateEffect } = await import('./validate-effect.js');
    if (typeof validateEffect === 'function') {
      validateEffect();
    }
  });

// list 명령어
program
  .command('list')
  .description('사용 가능한 효과 목록 표시')
  .option('-p, --path <path>', '효과 디렉토리 경로', '../my-effects')
  .action((options) => {
    const effectsPath = path.resolve(process.cwd(), options.path);
    
    if (!fs.existsSync(effectsPath)) {
      console.error(`❌ 효과 디렉토리를 찾을 수 없습니다: ${effectsPath}`);
      process.exit(1);
    }

    const effects = fs.readdirSync(effectsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    if (effects.length === 0) {
      console.log('📭 효과가 없습니다.');
      return;
    }

    console.log(`📦 사용 가능한 효과 (${effects.length}개):\n`);
    effects.forEach((effect, index) => {
      const effectPath = path.join(effectsPath, effect);
      const hasIndex = fs.existsSync(path.join(effectPath, 'index.ts'));
      const icon = hasIndex ? '✅' : '⚠️';
      console.log(`  ${index + 1}. ${icon} ${effect}`);
    });
  });

// dev 명령어
program
  .command('dev')
  .description('효과 개발 서버 시작')
  .option('-p, --path <path>', '효과 디렉토리 경로', '../my-effects')
  .action(async (options) => {
    process.env.EFFECTS_PATH = options.path;
    process.argv = ['node', 'dev-effect.js', options.path];
    // 동적 import로 실행
    const { default: devEffect } = await import('./dev-effect.js');
    if (typeof devEffect === 'function') {
      devEffect();
    }
  });

program.parse();

