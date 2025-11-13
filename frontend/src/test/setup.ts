import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// 테스트 후 정리
afterEach(() => {
  cleanup();
});

// 전역 모킹
global.fetch = vi.fn();
global.console = {
  ...console,
  // 테스트 중 console.warn, console.error 무시 (선택사항)
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

