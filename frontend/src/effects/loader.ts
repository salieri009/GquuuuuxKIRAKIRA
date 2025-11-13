import type { EffectModule, EffectMetadata } from './types';

/**
 * 효과 모듈 로더
 * 외부 디렉토리에서 효과를 동적으로 로드할 수 있습니다.
 * 
 * 지원하는 경로 형식:
 * - 절대 경로: '/my-effects/gnParticles'
 * - 상대 경로: '../effects/gnParticles' (개발 환경)
 * - URL: 'https://cdn.example.com/effects/gnParticles'
 * - 프로젝트 내부: '/src/effects/examples/gnParticles'
 */
export class EffectLoader {
  private static cache = new Map<string, { module: EffectModule; metadata?: EffectMetadata }>();

  /**
   * 효과 모듈 동적 로드
   * @param effectId 효과 ID
   * @param basePath 효과 모듈이 있는 기본 경로 (기본값: '/effects')
   * @returns 효과 모듈과 메타데이터
   */
  static async loadEffect(
    effectId: string,
    basePath: string = '/effects'
  ): Promise<{ module: EffectModule; metadata?: EffectMetadata }> {
    // 캐시 확인
    if (this.cache.has(effectId)) {
      return this.cache.get(effectId)!;
    }

    try {
      // 다양한 경로 형식 시도
      const paths = this.getModulePaths(effectId, basePath);
      
      let effectModule: any = null;
      let lastError: Error | null = null;

      // 각 경로를 순차적으로 시도
      for (const modulePath of paths) {
        try {
          // 동적 import 시도
          // Vite는 개발 환경에서 상대 경로를, 프로덕션에서는 절대 경로를 사용
          if (modulePath.startsWith('http://') || modulePath.startsWith('https://')) {
            // URL인 경우 fetch로 로드
            const response = await fetch(modulePath);
            const code = await response.text();
            // 동적 실행 (주의: 보안 고려 필요)
            effectModule = await this.evaluateModule(code, modulePath);
          } else {
            // 로컬 모듈 import
            effectModule = await import(/* @vite-ignore */ modulePath);
          }
          
          // 성공하면 루프 종료
          break;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          console.debug(`Failed to load from ${modulePath}, trying next path...`);
          continue;
        }
      }

      // 모든 경로 실패 시 에러
      if (!effectModule) {
        throw new Error(
          `효과 모듈을 로드할 수 없습니다: ${effectId}. ` +
          `시도한 경로: ${paths.join(', ')}. ` +
          `마지막 에러: ${lastError?.message || 'Unknown error'}`
        );
      }

      // 모듈 검증
      if (!effectModule.default || typeof effectModule.default.init !== 'function') {
        throw new Error(
          `Invalid effect module: ${effectId}. ` +
          `Module must export a default object with init, update (or animate), and dispose methods.`
        );
      }

      const module: EffectModule = {
        init: effectModule.default.init,
        update: effectModule.default.update || effectModule.default.animate,
        dispose: effectModule.default.dispose,
      };

      const metadata: EffectMetadata | undefined = effectModule.metadata || effectModule.default.metadata;

      // 캐시에 저장
      this.cache.set(effectId, { module, metadata });

      return { module, metadata };
    } catch (error) {
      console.error(`Failed to load effect module: ${effectId}`, error);
      throw error instanceof Error 
        ? error 
        : new Error(`효과 모듈을 로드할 수 없습니다: ${effectId}. ${String(error)}`);
    }
  }

  /**
   * 효과 모듈 경로 목록 생성
   * 여러 경로를 시도하여 유연성 제공
   */
  private static getModulePaths(effectId: string, basePath: string): string[] {
    const paths: string[] = [];
    const isDev = import.meta.env.DEV;

    // 1. 절대 경로 (프로덕션)
    if (basePath.startsWith('/')) {
      paths.push(`${basePath}/${effectId}/index.js`);
      paths.push(`${basePath}/${effectId}/index.ts`);
    }

    // 2. 상대 경로 (개발 환경)
    if (isDev) {
      // 프로젝트 내부 효과 디렉토리
      paths.push(`../effects/examples/${effectId}/index.ts`);
      paths.push(`../effects/examples/${effectId}/index.js`);
      paths.push(`@effects/examples/${effectId}/index.ts`);
      
      // 외부 효과 디렉토리 (basePath가 상대 경로인 경우)
      if (!basePath.startsWith('/') && !basePath.startsWith('http')) {
        paths.push(`${basePath}/${effectId}/index.ts`);
        paths.push(`${basePath}/${effectId}/index.js`);
      }
    }

    // 3. URL (CDN 등)
    if (basePath.startsWith('http://') || basePath.startsWith('https://')) {
      paths.push(`${basePath}/${effectId}/index.js`);
    }

    // 4. 기본 경로 (fallback)
    paths.push(`/effects/${effectId}/index.js`);

    return paths;
  }

  /**
   * URL에서 모듈 코드를 평가 (보안 주의)
   * 프로덕션에서는 신뢰할 수 있는 소스에서만 사용
   */
  private static async evaluateModule(code: string, sourceUrl: string): Promise<any> {
    // 보안: 신뢰할 수 있는 소스에서만 실행
    // 실제 구현에서는 더 안전한 방법 사용 권장 (예: Web Worker, CSP)
    console.warn('Remote module evaluation is not fully implemented. Use local modules for now.');
    throw new Error('Remote module loading is not supported yet. Please use local modules.');
  }

  /**
   * 효과 목록 가져오기
   * @param basePath 효과 모듈이 있는 기본 경로
   * @returns 효과 메타데이터 목록
   */
  static async listEffects(basePath: string = '/effects'): Promise<EffectMetadata[]> {
    try {
      // 효과 목록 파일 로드
      const listPath = `${basePath}/manifest.json`;
      const response = await fetch(listPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load effects manifest: ${response.statusText}`);
      }

      const manifest = await response.json();
      return manifest.effects || [];
    } catch (error) {
      console.warn('Failed to load effects manifest, using fallback', error);
      return [];
    }
  }

  /**
   * 캐시 초기화
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * 특정 효과 캐시 제거
   */
  static removeFromCache(effectId: string): void {
    this.cache.delete(effectId);
  }
}

