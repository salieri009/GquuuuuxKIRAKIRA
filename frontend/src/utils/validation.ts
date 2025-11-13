import type { EffectParameter } from '../types';

/**
 * 파라미터 값 검증
 */
export function validateParam(
  key: string,
  value: any,
  config: EffectParameter
): { valid: boolean; normalizedValue?: any; error?: string } {
  if (!config) {
    return {
      valid: false,
      error: `파라미터 "${key}"의 설정을 찾을 수 없습니다.`,
    };
  }

  switch (config.type) {
    case 'slider': {
      const numValue = Number(value);
      
      if (isNaN(numValue)) {
        return {
          valid: false,
          error: `"${key}"는 숫자여야 합니다.`,
        };
      }
      
      const min = config.min ?? 0;
      const max = config.max ?? 100;
      
      if (numValue < min) {
        return {
          valid: true,
          normalizedValue: min,
          error: `최소값(${min})보다 작아서 ${min}으로 조정되었습니다.`,
        };
      }
      
      if (numValue > max) {
        return {
          valid: true,
          normalizedValue: max,
          error: `최대값(${max})보다 커서 ${max}으로 조정되었습니다.`,
        };
      }
      
      // step 적용
      if (config.step) {
        const steppedValue = Math.round(numValue / config.step) * config.step;
        return {
          valid: true,
          normalizedValue: steppedValue,
        };
      }
      
      return {
        valid: true,
        normalizedValue: numValue,
      };
    }

    case 'color': {
      if (typeof value !== 'string') {
        return {
          valid: false,
          error: `"${key}"는 색상 코드(문자열)여야 합니다.`,
        };
      }
      
      // 헥스 색상 검증
      if (!/^#[0-9A-F]{6}$/i.test(value)) {
        return {
          valid: false,
          error: `"${key}"는 유효한 헥스 색상 코드(#RRGGBB 형식)여야 합니다.`,
        };
      }
      
      return {
        valid: true,
        normalizedValue: value.toUpperCase(),
      };
    }

    case 'toggle': {
      return {
        valid: true,
        normalizedValue: Boolean(value),
      };
    }

    case 'select': {
      if (!config.options) {
        return {
          valid: false,
          error: `"${key}"의 선택 옵션이 정의되지 않았습니다.`,
        };
      }
      
      if (!config.options.includes(value)) {
        return {
          valid: false,
          error: `"${key}"는 다음 중 하나여야 합니다: ${config.options.join(', ')}`,
        };
      }
      
      return {
        valid: true,
        normalizedValue: value,
      };
    }

    default:
      return {
        valid: false,
        error: `알 수 없는 파라미터 타입: ${config.type}`,
      };
  }
}

/**
 * 여러 파라미터 일괄 검증
 */
export function validateParams(
  params: Record<string, any>,
  configs: Record<string, EffectParameter>
): {
  valid: boolean;
  validatedParams: Record<string, any>;
  errors: string[];
} {
  const validatedParams: Record<string, any> = {};
  const errors: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    const config = configs[key];
    
    if (!config) {
      errors.push(`알 수 없는 파라미터: ${key}`);
      continue;
    }

    const result = validateParam(key, value, config);
    
    if (!result.valid) {
      errors.push(result.error || `"${key}" 검증 실패`);
    } else {
      validatedParams[key] = result.normalizedValue;
      
      if (result.error) {
        // 경고성 메시지 (값이 조정됨)
        console.warn(result.error);
      }
    }
  }

  return {
    valid: errors.length === 0,
    validatedParams,
    errors,
  };
}

