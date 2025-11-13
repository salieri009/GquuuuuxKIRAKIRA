import { describe, it, expect } from 'vitest';
import { validateParam, validateParams } from './validation';
import type { EffectParameter } from '../types';

describe('validateParam', () => {
  describe('slider 타입', () => {
    it('정상적인 값 검증', () => {
      const config: EffectParameter = {
        type: 'slider',
        value: 50,
        min: 0,
        max: 100,
        step: 1,
      };

      const result = validateParam('test', 50, config);
      expect(result.valid).toBe(true);
      expect(result.normalizedValue).toBe(50);
    });

    it('최소값보다 작은 값은 최소값으로 조정', () => {
      const config: EffectParameter = {
        type: 'slider',
        value: 0,
        min: 10,
        max: 100,
      };

      const result = validateParam('test', 5, config);
      expect(result.valid).toBe(true);
      expect(result.normalizedValue).toBe(10);
      expect(result.error).toContain('최소값');
    });

    it('최대값보다 큰 값은 최대값으로 조정', () => {
      const config: EffectParameter = {
        type: 'slider',
        value: 50,
        min: 0,
        max: 100,
      };

      const result = validateParam('test', 150, config);
      expect(result.valid).toBe(true);
      expect(result.normalizedValue).toBe(100);
      expect(result.error).toContain('최대값');
    });

    it('step 적용 테스트', () => {
      const config: EffectParameter = {
        type: 'slider',
        value: 50,
        min: 0,
        max: 100,
        step: 10,
      };

      const result = validateParam('test', 53, config);
      expect(result.valid).toBe(true);
      expect(result.normalizedValue).toBe(50); // 53 -> 50 (step 10)
    });

    it('숫자가 아닌 값은 에러', () => {
      const config: EffectParameter = {
        type: 'slider',
        value: 50,
        min: 0,
        max: 100,
      };

      const result = validateParam('test', 'not-a-number', config);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('숫자');
    });

    it('문자열 숫자는 변환되어야 함', () => {
      const config: EffectParameter = {
        type: 'slider',
        value: 50,
        min: 0,
        max: 100,
      };

      const result = validateParam('test', '75', config);
      expect(result.valid).toBe(true);
      expect(result.normalizedValue).toBe(75);
    });

    it('NaN 값 처리', () => {
      const config: EffectParameter = {
        type: 'slider',
        value: 50,
        min: 0,
        max: 100,
      };

      const result = validateParam('test', NaN, config);
      expect(result.valid).toBe(false);
    });
  });

  describe('color 타입', () => {
    it('정상적인 헥스 색상 검증', () => {
      const config: EffectParameter = {
        type: 'color',
        value: '#00FF88',
      };

      const result = validateParam('test', '#00FF88', config);
      expect(result.valid).toBe(true);
      expect(result.normalizedValue).toBe('#00FF88');
    });

    it('소문자 헥스 색상은 대문자로 변환', () => {
      const config: EffectParameter = {
        type: 'color',
        value: '#00ff88',
      };

      const result = validateParam('test', '#00ff88', config);
      expect(result.valid).toBe(true);
      expect(result.normalizedValue).toBe('#00FF88');
    });

    it('잘못된 헥스 색상 형식은 에러', () => {
      const config: EffectParameter = {
        type: 'color',
        value: '#00FF88',
      };

      const result1 = validateParam('test', '00FF88', config); // # 없음
      expect(result1.valid).toBe(false);

      const result2 = validateParam('test', '#00FF', config); // 짧음
      expect(result2.valid).toBe(false);

      const result3 = validateParam('test', '#00FF88FF', config); // 길음
      expect(result3.valid).toBe(false);
    });

    it('문자열이 아닌 값은 에러', () => {
      const config: EffectParameter = {
        type: 'color',
        value: '#00FF88',
      };

      const result = validateParam('test', 123, config);
      expect(result.valid).toBe(false);
    });
  });

  describe('toggle 타입', () => {
    it('모든 값은 boolean으로 변환', () => {
      const config: EffectParameter = {
        type: 'toggle',
        value: true,
      };

      expect(validateParam('test', true, config).normalizedValue).toBe(true);
      expect(validateParam('test', false, config).normalizedValue).toBe(false);
      expect(validateParam('test', 1, config).normalizedValue).toBe(true);
      expect(validateParam('test', 0, config).normalizedValue).toBe(false);
      expect(validateParam('test', 'true', config).normalizedValue).toBe(true);
      expect(validateParam('test', '', config).normalizedValue).toBe(false);
    });
  });

  describe('select 타입', () => {
    it('정상적인 옵션 선택', () => {
      const config: EffectParameter = {
        type: 'select',
        value: 'option1',
        options: ['option1', 'option2', 'option3'],
      };

      const result = validateParam('test', 'option1', config);
      expect(result.valid).toBe(true);
      expect(result.normalizedValue).toBe('option1');
    });

    it('옵션에 없는 값은 에러', () => {
      const config: EffectParameter = {
        type: 'select',
        value: 'option1',
        options: ['option1', 'option2'],
      };

      const result = validateParam('test', 'option3', config);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('다음 중 하나');
    });

    it('options가 없으면 에러', () => {
      const config: EffectParameter = {
        type: 'select',
        value: 'option1',
      } as any;

      const result = validateParam('test', 'option1', config);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('선택 옵션');
    });
  });

  describe('에지 케이스', () => {
    it('config가 없으면 에러', () => {
      const result = validateParam('test', 50, null as any);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('설정을 찾을 수 없습니다');
    });

    it('알 수 없는 타입은 에러', () => {
      const config = {
        type: 'unknown',
        value: 50,
      } as any;

      const result = validateParam('test', 50, config);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('알 수 없는 파라미터 타입');
    });
  });
});

describe('validateParams', () => {
  it('모든 파라미터 검증 성공', () => {
    const params = {
      size: 50,
      color: '#00FF88',
      enabled: true,
    };

    const configs: Record<string, EffectParameter> = {
      size: { type: 'slider', value: 50, min: 0, max: 100 },
      color: { type: 'color', value: '#00FF88' },
      enabled: { type: 'toggle', value: true },
    };

    const result = validateParams(params, configs);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.validatedParams.size).toBe(50);
    expect(result.validatedParams.color).toBe('#00FF88');
    expect(result.validatedParams.enabled).toBe(true);
  });

  it('일부 파라미터 검증 실패', () => {
    const params = {
      size: 150, // 최대값 초과
      color: 'invalid', // 잘못된 색상
      enabled: true,
    };

    const configs: Record<string, EffectParameter> = {
      size: { type: 'slider', value: 50, min: 0, max: 100 },
      color: { type: 'color', value: '#00FF88' },
      enabled: { type: 'toggle', value: true },
    };

    const result = validateParams(params, configs);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('알 수 없는 파라미터는 에러', () => {
    const params = {
      unknown: 50,
    };

    const configs: Record<string, EffectParameter> = {
      size: { type: 'slider', value: 50, min: 0, max: 100 },
    };

    const result = validateParams(params, configs);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('알 수 없는 파라미터: unknown');
  });

  it('빈 파라미터 객체', () => {
    const params = {};
    const configs: Record<string, EffectParameter> = {
      size: { type: 'slider', value: 50, min: 0, max: 100 },
    };

    const result = validateParams(params, configs);
    expect(result.valid).toBe(true);
    expect(Object.keys(result.validatedParams)).toHaveLength(0);
  });
});

