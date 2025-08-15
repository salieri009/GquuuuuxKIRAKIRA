import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Effect, EffectParameter, LoadingStatus } from '../types';

interface EffectState {
  // State
  effects: Effect[];
  selectedEffect: Effect | null;
  currentParams: Record<string, EffectParameter>;
  status: LoadingStatus;
  error: string | null;
  lastFetchTime: number;

  // Getters
  isLoading: () => boolean;
  hasError: () => boolean;
  isReady: () => boolean;
  selectedParams: () => Record<string, any>;
  getEffectById: (id: string) => Effect | undefined;
  getEffectsByCategory: (category: string) => Effect[];

  // Actions
  fetchEffects: () => Promise<void>;
  selectEffect: (effectId: string) => void;
  updateParam: (key: string, value: any) => void;
  updateParams: (params: Record<string, any>) => void;
  resetParams: () => void;
  resetStore: () => void;
}

const initialState = {
  effects: [],
  selectedEffect: null,
  currentParams: {},
  status: 'idle' as LoadingStatus,
  error: null,
  lastFetchTime: 0,
};

export const useEffectStore = create<EffectState>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

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
          });

          try {
            // Mock 데이터 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const mockEffects: Effect[] = [
              {
                id: 'gnParticles',
                name: 'GN 입자',
                description: 'GN 드라이브에서 방출되는 고에너지 입자들이 만들어내는 환상적인 빛의 향연',
                thumbnail: '/images/effects/gn-particles-thumb.jpg',
                relatedGundam: ['가넷 건담', '엑시아', '더블오', '큐안타'],
                category: 'particles',
                defaultParams: {
                  particleCount: { type: 'slider', value: 2000, min: 500, max: 5000, step: 100 },
                  particleSize: { type: 'slider', value: 0.08, min: 0.02, max: 0.15, step: 0.01 },
                  speed: { type: 'slider', value: 1.5, min: 0.5, max: 3.0, step: 0.1 },
                  spread: { type: 'slider', value: 8.0, min: 2.0, max: 15.0, step: 0.5 },
                  color: { type: 'color', value: '#00FF88' },
                  glowIntensity: { type: 'slider', value: 1.2, min: 0.5, max: 2.5, step: 0.1 }
                }
              },
              {
                id: 'newtypeFlash',
                name: '뉴타입 섬광',
                description: '뉴타입의 정신적 각성 순간에 발생하는 강렬한 금색 섬광과 충격파',
                thumbnail: '/images/effects/newtype-flash-thumb.jpg',
                relatedGundam: ['뉴 건담', '유니콘 건담', '바나지', '아무로'],
                category: 'energy',
                defaultParams: {
                  intensity: { type: 'slider', value: 1.5, min: 0.5, max: 3.0, step: 0.1 },
                  flashSpeed: { type: 'slider', value: 2.0, min: 0.5, max: 5.0, step: 0.1 },
                  waveCount: { type: 'slider', value: 3, min: 1, max: 8, step: 1 },
                  color: { type: 'color', value: '#FFD700' },
                  pulseRate: { type: 'slider', value: 1.2, min: 0.3, max: 3.0, step: 0.1 }
                }
              },
              {
                id: 'minofskyParticles',
                name: '미노프스키 입자',
                description: 'MS의 핵융합 반응에서 생성되는 미노프스키 입자의 전자기 간섭 효과',
                thumbnail: '/images/effects/minofsky-particles-thumb.jpg',
                relatedGundam: ['건담', '자쿠', '겔구그', '모든 MS'],
                category: 'particles',
                defaultParams: {
                  particleCount: { type: 'slider', value: 1500, min: 300, max: 4000, step: 100 },
                  particleSize: { type: 'slider', value: 0.06, min: 0.01, max: 0.12, step: 0.01 },
                  speed: { type: 'slider', value: 1.0, min: 0.3, max: 2.5, step: 0.1 },
                  color: { type: 'color', value: '#FF6B35' },
                  interference: { type: 'slider', value: 0.7, min: 0.0, max: 2.0, step: 0.1 }
                }
              }
            ];

            set((draft) => {
              draft.effects = mockEffects;
              draft.status = 'succeeded';
              draft.lastFetchTime = Date.now();
              
              // 첫 번째 효과를 기본 선택 (선택된 효과가 없을 때만)
              if (!draft.selectedEffect && mockEffects.length > 0) {
                draft.selectedEffect = mockEffects[0];
                draft.currentParams = { ...mockEffects[0].defaultParams };
              }
            });

            console.log('효과 목록 로드 완료');
            
          } catch (error) {
            console.error('효과 목록 로드 실패:', error);
            set((draft) => {
              draft.status = 'failed';
              draft.error = error instanceof Error ? error.message : '효과 목록을 불러오는데 실패했습니다.';
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

          set((draft) => {
            const param = draft.currentParams[key];
            
            // 값 검증 및 정규화
            let normalizedValue = value;
            
            if (param.type === 'slider') {
              normalizedValue = Math.max(param.min || 0, Math.min(param.max || 100, Number(value)));
            } else if (param.type === 'color') {
              // 색상 값 검증 (헥스 코드 형식)
              if (!/^#[0-9A-F]{6}$/i.test(value)) {
                console.warn(`잘못된 색상 형식: ${value}`);
                return;
              }
            } else if (param.type === 'toggle') {
              normalizedValue = Boolean(value);
            }

            // 값이 실제로 변경된 경우만 업데이트
            if (param.value !== normalizedValue) {
              draft.currentParams[key].value = normalizedValue;
              console.log(`파라미터 업데이트: ${key} = ${normalizedValue}`);
            }
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
if (process.env.NODE_ENV === 'development') {
  useEffectStore.subscribe(
    (state) => state.selectedEffect,
    (selectedEffect) => {
      console.log('Selected effect changed:', selectedEffect?.name || 'None');
    }
  );

  useEffectStore.subscribe(
    (state) => state.status,
    (status) => {
      console.log('Effect store status changed:', status);
    }
  );
}
