import type { EffectModule, EffectMetadata } from "@kirakira/effect-sdk";

const EFFECT_LIFECYCLE_METHODS = ["init", "update", "dispose"] as const;

/** Dynamic effect module loader — resolves `examples/<catalog-id>/index.ts` first. */
export class EffectLoader {
  static async loadEffect(
    effectId: string,
    basePath: string = "/effects",
  ): Promise<EffectModule> {
    try {
      const paths = this.getModulePaths(effectId, basePath);
      const effect = await this.importDefaultFromPaths(paths, effectId);

      return this.normalizeEffectModule(effect, effectId);
    } catch (error) {
      console.error(`Failed to load effect module: ${effectId}`, error);
      throw error instanceof Error
        ? error
        : new Error(
            `효과 모듈을 로드할 수 없습니다: ${effectId}. ${String(error)}`,
          );
    }
  }

  private static async importDefaultFromPaths(
    paths: string[],
    effectId: string,
  ): Promise<unknown> {
    let lastError: Error | null = null;

    for (const modulePath of paths) {
      try {
        const imported = await import(/* @vite-ignore */ modulePath);
        if (imported.default != null) {
          return imported.default;
        }
        lastError = new Error(`Module ${modulePath} has no default export`);
        console.debug(
          `No default export from ${modulePath}, trying next path...`,
        );
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.debug(`Failed to load from ${modulePath}, trying next path...`);
      }
    }

    throw new Error(
      `효과 모듈을 로드할 수 없습니다: ${effectId}. ` +
        `시도한 경로: ${paths.join(", ")}. ` +
        `마지막 에러: ${lastError?.message || "Unknown error"}`,
    );
  }

  private static getModulePaths(effectId: string, basePath: string): string[] {
    const isDev = import.meta.env.DEV;

    return [
      ...new Set([
        `@effects/examples/${effectId}/index.ts`,
        `../effects/examples/${effectId}/index.ts`,
        ...(basePath.startsWith("/")
          ? [
              `${basePath}/${effectId}/index.js`,
              `${basePath}/${effectId}/index.ts`,
            ]
          : []),
        ...(isDev && !basePath.startsWith("/")
          ? [
              `${basePath}/${effectId}/index.ts`,
              `${basePath}/${effectId}/index.js`,
            ]
          : []),
        `/effects/${effectId}/index.js`,
      ]),
    ];
  }

  private static normalizeEffectModule(
    effect: unknown,
    effectId: string,
  ): EffectModule {
    if (!effect || typeof effect !== "object") {
      throw new Error(
        `Invalid effect module: ${effectId}. Module must export a default object.`,
      );
    }

    const candidate = effect as Partial<EffectModule>;
    for (const method of EFFECT_LIFECYCLE_METHODS) {
      if (typeof candidate[method] !== "function") {
        throw new Error(
          `Invalid effect module: ${effectId}. Module must have a '${method}' method.`,
        );
      }
    }

    return candidate as EffectModule;
  }

  /**
   * 효과 목록 가져오기 (manifest fallback; catalog prefers @kirakira/catalog / API)
   */
  static async listEffects(
    basePath: string = "/effects",
  ): Promise<EffectMetadata[]> {
    try {
      const response = await fetch(`${basePath}/manifest.json`);

      if (!response.ok) {
        throw new Error(
          `Failed to load effects manifest: ${response.statusText}`,
        );
      }

      const manifest = await response.json();
      return manifest.effects ?? [];
    } catch (error) {
      console.warn("Failed to load effects manifest, using fallback", error);
      return [];
    }
  }
}
