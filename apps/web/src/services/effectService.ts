import { EffectLoader } from "../effects/loader";
import type { EffectModule, EffectMetadata } from "@kirakira/effect-sdk";
import type { Effect } from "@kirakira/contracts";
import catalogEffects from "@kirakira/catalog";
import { withRetry, logError } from "../utils/errorHandler";
import { getJson } from "./apiClient";

function metadataToEffect(meta: EffectMetadata): Effect {
  const slug = meta.name.toLowerCase().replace(/\s+/g, "");
  return {
    id: slug,
    name: meta.name,
    description: meta.description,
    category: meta.category as Effect["category"],
    thumbnail: meta.thumbnail || `/images/effects/${slug}-thumb.jpg`,
    relatedGundam: meta.tags || [],
    defaultParams: {},
  };
}

/**
 * 효과 서비스
 * 카탈로그 로딩(API → manifest → @kirakira/catalog)과 모듈 로딩을 담당합니다.
 */
export class EffectService {
  private static loadedModules = new Map<string, EffectModule>();
  private static basePath: string = "/effects";

  static setBasePath(path: string): void {
    this.basePath = path;
  }

  static async loadEffectModule(
    effectId: string,
    retries: number = 3,
  ): Promise<EffectModule> {
    const cached = this.loadedModules.get(effectId);
    if (cached) {
      return cached;
    }

    try {
      const module = await withRetry(
        () => EffectLoader.loadEffect(effectId, this.basePath),
        {
          maxRetries: retries,
          delay: 1000,
          onRetry: (attempt, error) => {
            console.warn(
              `효과 모듈 로드 재시도 ${attempt}/${retries}: ${effectId}`,
              error.message,
            );
          },
        },
      );

      this.loadedModules.set(effectId, module);
      return module;
    } catch (error) {
      logError(error instanceof Error ? error : new Error(String(error)), {
        context: "loadEffectModule",
        effectId,
      });
      throw error;
    }
  }

  static async fetchEffects(): Promise<Effect[]> {
    try {
      return await getJson<Effect[]>("/api/effects");
    } catch (apiError) {
      console.warn(
        "API catalog unavailable, falling back to local sources",
        apiError,
      );
    }

    const metadataList = await EffectLoader.listEffects(this.basePath);
    if (metadataList.length > 0) {
      return metadataList.map(metadataToEffect);
    }

    return catalogEffects;
  }

  static clearAll(): void {
    this.loadedModules.clear();
  }
}
