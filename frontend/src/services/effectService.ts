import { EffectLoader } from '../effects/loader';
import type { EffectModule, EffectMetadata } from '../effects/types';
import { withRetry, logError } from '../utils/errorHandler';

/**
 * 효과 서비스
 * 효과 모듈 로딩 및 관리를 담당합니다.
 */
export class EffectService {
  private static loadedModules = new Map<string, { module: EffectModule; metadata?: EffectMetadata }>();
  private static basePath: string = '/effects';

  /**
   * 효과 모듈 기본 경로 설정
   */
  static setBasePath(path: string): void {
    this.basePath = path;
  }

  /**
   * 효과 모듈 로드
   */
  static async loadEffectModule(
    effectId: string,
    retries: number = 3
  ): Promise<{ module: EffectModule; metadata?: EffectMetadata }> {
    // 이미 로드된 모듈 확인
    if (this.loadedModules.has(effectId)) {
      return this.loadedModules.get(effectId)!;
    }

    try {
      const result = await withRetry(
        () => EffectLoader.loadEffect(effectId, this.basePath),
        {
          maxRetries: retries,
          delay: 1000,
          onRetry: (attempt, error) => {
            console.warn(`효과 모듈 로드 재시도 ${attempt}/${retries}: ${effectId}`, error.message);
          },
        }
      );

      // 로드된 모듈 캐시
      this.loadedModules.set(effectId, result);

      return result;
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), {
        context: 'loadEffectModule',
        effectId,
      });
      throw error;
    }
  }

  /**
   * 효과 목록 가져오기
   */
  static async fetchEffects(): Promise<any[]> {
    try {
      // 먼저 manifest에서 메타데이터 가져오기
      const metadataList = await EffectLoader.listEffects(this.basePath);
      
      if (metadataList.length > 0) {
        // manifest가 있으면 메타데이터 기반으로 효과 생성
        return metadataList.map((meta) => ({
          id: meta.name.toLowerCase().replace(/\s+/g, ''),
          name: meta.name,
          description: meta.description,
          category: meta.category,
          thumbnail: meta.thumbnail || `/images/effects/${meta.name.toLowerCase()}-thumb.jpg`,
          relatedGundam: meta.tags || [],
          defaultParams: {}, // 메타데이터에서 파라미터 정보가 있으면 사용
        }));
      }

      // manifest가 없으면 기본 효과 데이터 사용
      const effectsData = await import('../data/effects.json');
      return effectsData.default || [];
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), {
        context: 'fetchEffects',
      });
      
      // 폴백: 로컬 데이터 사용
      const effectsData = await import('../data/effects.json');
      return effectsData.default || [];
    }
  }

  /**
   * 로드된 모듈 제거
   */
  static unloadEffect(effectId: string): void {
    this.loadedModules.delete(effectId);
    EffectLoader.removeFromCache(effectId);
  }

  /**
   * 모든 모듈 제거
   */
  static clearAll(): void {
    this.loadedModules.clear();
    EffectLoader.clearCache();
  }
}

// 기존 함수들도 유지 (하위 호환성)
export async function fetchEffects() {
  return EffectService.fetchEffects();
}

export async function loadEffectModule(effectId: string) {
  const { module } = await EffectService.loadEffectModule(effectId);
  return module;
}
