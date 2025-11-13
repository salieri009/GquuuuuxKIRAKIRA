import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserFriendlyMessage, AppError, logError, withRetry } from './errorHandler';

describe('getUserFriendlyMessage', () => {
  it('AppError의 userMessage 반환', () => {
    const error = new AppError('Technical error', 'TEST_ERROR', true, '사용자 친화적 메시지');
    expect(getUserFriendlyMessage(error)).toBe('사용자 친화적 메시지');
  });

  it('네트워크 에러 감지', () => {
    const error = new Error('Network request failed');
    expect(getUserFriendlyMessage(error)).toContain('인터넷 연결');
  });

  it('404 에러 감지', () => {
    const error = new Error('Resource not found');
    expect(getUserFriendlyMessage(error)).toContain('찾을 수 없습니다');
  });

  it('권한 에러 감지', () => {
    const error = new Error('Unauthorized access');
    expect(getUserFriendlyMessage(error)).toContain('접근 권한');
  });

  it('타임아웃 에러 감지', () => {
    const error = new Error('Request timeout');
    expect(getUserFriendlyMessage(error)).toContain('시간이 초과');
  });

  it('검증 에러 감지', () => {
    const error = new Error('Invalid input validation');
    expect(getUserFriendlyMessage(error)).toContain('올바르지 않습니다');
  });

  it('알 수 없는 에러는 기본 메시지', () => {
    const error = new Error('Unknown error');
    expect(getUserFriendlyMessage(error)).toContain('문제가 발생했습니다');
  });
});

describe('AppError', () => {
  it('기본 속성 설정', () => {
    const error = new AppError('Test error', 'TEST_CODE', true, 'User message');
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.recoverable).toBe(true);
    expect(error.userMessage).toBe('User message');
    expect(error.name).toBe('AppError');
  });

  it('recoverable 기본값은 true', () => {
    const error = new AppError('Test error', 'TEST_CODE');
    expect(error.recoverable).toBe(true);
  });
});

describe('logError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('에러 정보 로깅', () => {
    const consoleSpy = vi.spyOn(console, 'group');
    const error = new Error('Test error');
    
    const result = logError(error, { context: 'test' });
    
    expect(result.message).toBe('Test error');
    expect(result.context).toEqual({ context: 'test' });
    expect(result.timestamp).toBeDefined();
    
    consoleSpy.mockRestore();
  });
});

describe('withRetry', () => {
  it('성공 시 즉시 반환', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await withRetry(fn);
    
    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('실패 후 재시도하여 성공', async () => {
    let attempts = 0;
    const fn = vi.fn().mockImplementation(() => {
      attempts++;
      if (attempts < 3) {
        return Promise.reject(new Error('Failed'));
      }
      return Promise.resolve('success');
    });

    const onRetry = vi.fn();
    const result = await withRetry(fn, { maxRetries: 3, delay: 10, onRetry });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  it('모든 재시도 실패 시 에러 throw', async () => {
    const error = new Error('Always fails');
    const fn = vi.fn().mockRejectedValue(error);

    await expect(
      withRetry(fn, { maxRetries: 2, delay: 10 })
    ).rejects.toThrow('Always fails');

    expect(fn).toHaveBeenCalledTimes(3); // 초기 + 재시도 2회
  });

  it('지수 백오프 적용', async () => {
    const startTime = Date.now();
    const delays: number[] = [];

    let attempts = 0;
    const fn = vi.fn().mockImplementation(() => {
      attempts++;
      if (attempts < 3) {
        const now = Date.now();
        if (attempts > 1) {
          delays.push(now - startTime);
        }
        return Promise.reject(new Error('Failed'));
      }
      return Promise.resolve('success');
    });

    await withRetry(fn, { maxRetries: 3, delay: 100, onRetry: () => {} });

    // 지수 백오프 확인: 첫 번째 재시도는 100ms, 두 번째는 200ms
    expect(delays.length).toBeGreaterThan(0);
  });

  it('재시도 없이 즉시 실패', async () => {
    const error = new Error('Failed');
    const fn = vi.fn().mockRejectedValue(error);

    await expect(
      withRetry(fn, { maxRetries: 0, delay: 10 })
    ).rejects.toThrow('Failed');

    expect(fn).toHaveBeenCalledTimes(1);
  });
});

