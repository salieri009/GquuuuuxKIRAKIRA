import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Effect, EffectParameter, LoadingStatus } from '../types';
import { validateParam } from '../utils/validation';
import { withRetry, logError } from '../utils/errorHandler';
import { fetchEffects } from '../services/effectService';

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
  isLoading: () => boolean;
  hasError: () => boolean;
  isReady: () => boolean;
  selectedParams: () => Record<string, any>;
  getEffectById: (id: string) => Effect | undefined;
  getEffectsByCategory: (category: string) => Effect[];
  getRecentEffects: () => Effect[];
  getFavoriteEffects: () => Effect[];
  isFavorite: (effectId: string) => boolean;

  // Actions
  fetchEffects: () => Promise<void>;
  selectEffect: (effectId: string) => void;
  updateParam: (key: string, value: any) => void;
  updateParams: (params: Record<string, any>) => void;
  resetParams: () => void;
  resetStore: () => void;
  toggleFavorite: (effectId: string) => void;
  clearRecentEffects: () => void;
}

const initialState = {
  effects: [],
  selectedEffect: null,
  currentParams: {},
  status: 'idle' as LoadingStatus,
  error: null,
  lastFetchTime: 0,
  progress: 0,
  recentEffects: [] as string[],
  favorites: JSON.parse(localStorage.getItem('kirakira-favorites') || '[]') as string[],
};

export const useEffectStore = create<EffectState>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,
        favorites: JSON.parse(localStorage.getItem('kirakira-favorites') || '[]') as string[],

        // Getters
        isLoading: () => get().status === 'loading',
        hasError: () => get().status === 'failed',
        isReady: () => get().status === 'succeeded' && get().effects.length > 0,
        
        selectedParams: () => {
          const state = get();
          if (!state.selectedEffect) return {};
          
          const params: Record<string, any> = {};
          Object.keys(state.currentParams).forEach(key => {
            params[key] = state.currentParams[key].value;
          });
          return params;
        },

        getEffectById: (id: string) => {
          return get().effects.find(effect => effect.id === id);
        },

        getEffectsByCategory: (category: string) => {
          return get().effects.filter(effect => effect.category === category);
        },

        getRecentEffects: () => {
          const state = get();
          return state.recentEffects
            .map(id => state.effects.find(e => e.id === id))
            .filter((e): e is Effect => e !== undefined);
        },

        getFavoriteEffects: () => {
          const state = get();
          return state.favorites
            .map(id => state.effects.find(e => e.id === id))
            .filter((e): e is Effect => e !== undefined);
        },

        isFavorite: (effectId: string) => {
          return get().favorites.includes(effectId);
        },

        // Actions
        fetchEffects: async () => {
          const state = get();
          
          // 이미 로딩 중이면 중복 요청 방지
          if (state.status === 'loading') return;

          // 최근에 가져온 데이터가 있으면 캐시 사용 (5분 이내)
          const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
          if (state.lastFetchTime > fiveMinutesAgo && state.effects.length > 0) {
            return;
          }

          set((draft) => {
            draft.status = 'loading';
            draft.error = null;
            draft.progress = 0;
          });

          try {
            // 진행률 시뮬레이션
            const progressInterval = setInterval(() => {
              set((draft) => {
                if (draft.progress < 90) {
                  draft.progress += 10;
                }
              });
            }, 100);

            const effects = await withRetry(
              async () => {
                const result = await fetchEffects();
                clearInterval(progressInterval);
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
              }
            );

            set((draft) => {
              draft.effects = effects;
              draft.status = 'succeeded';
              draft.lastFetchTime = Date.now();
              draft.progress = 100;
              
              // 첫 번째 효과를 기본 선택 (선택된 효과가 없을 때만)
              if (!draft.selectedEffect && effects.length > 0) {
                draft.selectedEffect = effects[0];
                draft.currentParams = { ...effects[0].defaultParams };
              }
            });

            console.log('효과 목록 로드 완료');
            
          } catch (error) {
            clearInterval(progressInterval);
            const appError = error instanceof Error ? error : new Error(String(error));
            logError(appError, { context: 'fetchEffects' });
            
            set((draft) => {
              draft.status = 'failed';
              draft.error = appError.message;
              draft.progress = 0;
            });
          }
        },

        selectEffect: (effectId: string) => {
          const state = get();
          const effect = state.effects.find(e => e.id === effectId);
          
          if (!effect) {
            console.warn(`효과를 찾을 수 없습니다: ${effectId}`);
            return;
          }

          // 이전 효과와 같으면 무시
          if (state.selectedEffect?.id === effectId) {
            return;
          }

          set((draft) => {
            draft.selectedEffect = effect;
            draft.currentParams = { ...effect.defaultParams };
            
            // 최근 사용 효과에 추가 (중복 제거, 최대 5개)
            if (!draft.recentEffects.includes(effectId)) {
              draft.recentEffects.unshift(effectId);
              draft.recentEffects = draft.recentEffects.slice(0, 5);
            } else {
              // 이미 있으면 맨 앞으로 이동
              draft.recentEffects = [
                effectId,
                ...draft.recentEffects.filter(id => id !== effectId)
              ].slice(0, 5);
            }
          });
          
          console.log(`효과 선택됨: ${effect.name}`);
        },

        updateParam: (key: string, value: any) => {
          const state = get();
          
          if (!state.selectedEffect) {
            console.warn('선택된 효과가 없습니다.');
            return;
          }

          if (!(key in state.currentParams)) {
            console.warn(`존재하지 않는 파라미터: ${key}`);
            return;
          }

          const param = state.currentParams[key];
          const validation = validateParam(key, value, param);
          
          if (!validation.valid) {
            console.warn(`파라미터 검증 실패: ${validation.error}`);
            return;
          }

          set((draft) => {
            draft.currentParams[key].value = validation.normalizedValue;
          });
        },

        updateParams: (params: Record<string, any>) => {
          const { updateParam } = get();
          Object.keys(params).forEach(key => {
            updateParam(key, params[key]);
          });
        },

        resetParams: () => {
          const state = get();
          
          if (!state.selectedEffect) {
            set((draft) => {
              draft.currentParams = {};
            });
            return;
          }

          set((draft) => {
            draft.currentParams = { ...state.selectedEffect!.defaultParams };
          });
          
          console.log('파라미터가 기본값으로 리셋되었습니다.');
        },

        toggleFavorite: (effectId: string) => {
          set((draft) => {
            const index = draft.favorites.indexOf(effectId);
            if (index > -1) {
              draft.favorites.splice(index, 1);
            } else {
              draft.favorites.push(effectId);
            }
            
            // localStorage에 저장
            localStorage.setItem('kirakira-favorites', JSON.stringify(draft.favorites));
          });
        },

        clearRecentEffects: () => {
          set((draft) => {
            draft.recentEffects = [];
          });
        },

        resetStore: () => {
          set((draft) => {
            Object.assign(draft, initialState);
          });
        },
      })),
      {
        name: 'effect-store',
      }
    )
  )
);

// 스토어 구독자 설정 (디버깅용)
if (import.meta.env.DEV) {
  useEffectStore.subscribe(
    (state) => state.selectedEffect,
    (selectedEffect) => {
      console.log('Selected effect changed:', selectedEffect?.name || 'None');
    }
  );
}
