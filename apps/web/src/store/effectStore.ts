import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { Effect, EffectParameter, LoadingStatus } from "../types";
import { validateParam } from "../utils/validation";
import { withRetry, logError } from "../utils/errorHandler";
import { EffectService } from "../services/effectService";
import {
  loadFavoritesFromStorage,
  saveFavoritesToStorage,
} from "../utils/storage";

function resolveEffectsByIds(effects: Effect[], ids: string[]): Effect[] {
  return ids
    .map((id) => effects.find((e) => e.id === id))
    .filter((e): e is Effect => e !== undefined);
}

interface EffectState {
  // State
  effects: Effect[];
  selectedEffect: Effect | null;
  currentParams: Record<string, EffectParameter>;
  status: LoadingStatus;
  error: string | null;
  lastFetchTime: number;
  progress: number; // 0-100
  recentEffects: string[]; // 최근 사용한 효과 ID 목록 (최대 5개)
  favorites: string[]; // 즐겨찾기 효과 ID 목록

  // Getters
  getEffectById: (id: string) => Effect | undefined;
  getRecentEffects: () => Effect[];
  getFavoriteEffects: () => Effect[];
  isFavorite: (effectId: string) => boolean;

  // Actions
  fetchEffects: () => Promise<void>;
  selectEffect: (effectId: string) => void;
  updateParam: (key: string, value: any) => void;
  updateParams: (params: Record<string, any>) => void;
  resetParams: () => void;
  toggleFavorite: (effectId: string) => void;
}

const initialState = {
  effects: [],
  selectedEffect: null,
  currentParams: {},
  status: "idle" as LoadingStatus,
  error: null,
  lastFetchTime: 0,
  progress: 0,
  recentEffects: [] as string[],
  favorites: loadFavoritesFromStorage(),
};

export const useEffectStore = create<EffectState>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // Getters
      getEffectById: (id: string) => {
        return get().effects.find((effect) => effect.id === id);
      },

      getRecentEffects: () => {
        const { effects, recentEffects } = get();
        return resolveEffectsByIds(effects, recentEffects);
      },

      getFavoriteEffects: () => {
        const { effects, favorites } = get();
        return resolveEffectsByIds(effects, favorites);
      },

      isFavorite: (effectId: string) => {
        return get().favorites.includes(effectId);
      },

      // Actions
      fetchEffects: async () => {
        const state = get();

        // 이미 로딩 중이면 중복 요청 방지
        if (state.status === "loading") return;

        // 최근에 가져온 데이터가 있으면 캐시 사용 (5분 이내)
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        if (state.lastFetchTime > fiveMinutesAgo && state.effects.length > 0) {
          return;
        }

        set((draft) => {
          draft.status = "loading";
          draft.error = null;
          draft.progress = 0;
        });

        let progressInterval: ReturnType<typeof setInterval> | undefined;

        try {
          progressInterval = setInterval(() => {
            set((draft) => {
              if (draft.progress < 90) {
                draft.progress += 10;
              }
            });
          }, 100);

          const effects = await withRetry(
            async () => {
              const result = await EffectService.fetchEffects();
              if (progressInterval) clearInterval(progressInterval);
              set((draft) => {
                draft.progress = 100;
              });
              return result;
            },
            {
              maxRetries: 3,
              delay: 1000,
              onRetry: (attempt, error) => {
                console.warn(`효과 로드 재시도 ${attempt}/3:`, error.message);
              },
            },
          );

          set((draft) => {
            draft.effects = effects;
            draft.status = "succeeded";
            draft.lastFetchTime = Date.now();
            draft.progress = 100;

            // 첫 번째 효과를 기본 선택 (선택된 효과가 없을 때만)
            if (!draft.selectedEffect && effects.length > 0) {
              draft.selectedEffect = effects[0];
              draft.currentParams = { ...effects[0].defaultParams };
            }
          });
        } catch (error) {
          if (progressInterval) clearInterval(progressInterval);
          const appError =
            error instanceof Error ? error : new Error(String(error));
          logError(appError, { context: "fetchEffects" });

          set((draft) => {
            draft.status = "failed";
            draft.error = appError.message;
            draft.progress = 0;
          });
        }
      },

      selectEffect: (effectId: string) => {
        const { effects, selectedEffect } = get();
        const effect = effects.find((e) => e.id === effectId);

        if (!effect) {
          console.warn(`효과를 찾을 수 없습니다: ${effectId}`);
          return;
        }

        if (selectedEffect?.id === effectId) {
          return;
        }

        set((draft) => {
          draft.selectedEffect = effect;
          draft.currentParams = { ...effect.defaultParams };
          draft.recentEffects = [
            effectId,
            ...draft.recentEffects.filter((id) => id !== effectId),
          ].slice(0, 5);
        });
      },

      updateParam: (key: string, value: any) => {
        const state = get();

        if (!state.selectedEffect) {
          console.warn("선택된 효과가 없습니다.");
          return;
        }

        if (!(key in state.currentParams)) {
          console.warn(`존재하지 않는 파라미터: ${key}`);
          return;
        }

        const validation = validateParam(key, value, state.currentParams[key]);

        if (!validation.valid) {
          console.warn(`파라미터 검증 실패: ${validation.error}`);
          return;
        }

        get().updateParams({ [key]: validation.normalizedValue });
      },

      updateParams: (params: Record<string, any>) => {
        const state = get();

        if (!state.selectedEffect) {
          console.warn("선택된 효과가 없습니다.");
          return;
        }

        // 일괄 업데이트로 성능 최적화
        set((draft) => {
          Object.keys(params).forEach((key) => {
            if (key in draft.currentParams) {
              const param = draft.currentParams[key];
              const validation = validateParam(key, params[key], param);
              if (validation.valid) {
                draft.currentParams[key].value = validation.normalizedValue;
              }
            }
          });
        });
      },

      resetParams: () => {
        set((draft) => {
          draft.currentParams = draft.selectedEffect
            ? { ...draft.selectedEffect.defaultParams }
            : {};
        });
      },

      toggleFavorite: (effectId: string) => {
        set((draft) => {
          draft.favorites = draft.favorites.includes(effectId)
            ? draft.favorites.filter((id) => id !== effectId)
            : [...draft.favorites, effectId];

          saveFavoritesToStorage(draft.favorites);
        });
      },
    })),
    {
      name: "effect-store",
    },
  ),
);
