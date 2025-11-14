/**
 * @deprecated EffectContext는 더 이상 사용되지 않습니다.
 * 대신 useEffectStore를 사용하세요.
 * 
 * 마이그레이션 가이드:
 * - useEffect() -> useEffectStore()
 * - EffectProvider는 제거되었습니다 (더 이상 필요 없음)
 * 
 * 이 파일은 하위 호환성을 위해 유지되지만, 새로운 코드에서는 사용하지 마세요.
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { useEffectStore } from '../store/effectStore';

// 더미 Context (하위 호환성)
const EffectContext = createContext<{
  state: any;
  dispatch: any;
} | null>(null);

/**
 * @deprecated EffectProvider는 더 이상 필요하지 않습니다.
 * useEffectStore를 직접 사용하세요.
 */
export function EffectProvider({ children }: { children: ReactNode }) {
  console.warn(
    'EffectProvider is deprecated. ' +
    'You can remove it from your component tree. ' +
    'useEffectStore can be used directly without a provider.'
  );
  
  return <>{children}</>;
}

/**
 * @deprecated useEffect()는 더 이상 사용되지 않습니다.
 * 대신 useEffectStore()를 사용하세요.
 * 
 * 예시:
 * ```typescript
 * // 이전
 * const { state } = useEffect();
 * 
 * // 이후
 * const { selectedEffect, currentParams } = useEffectStore();
 * ```
 */
export function useEffect() {
  console.warn(
    'useEffect() from EffectContext is deprecated. ' +
    'Use useEffectStore() instead.'
  );
  
  // 하위 호환성을 위해 effectStore를 래핑
  const store = useEffectStore();
  
  return {
    state: {
      effects: store.effects,
      selectedEffect: store.selectedEffect,
      currentParams: Object.fromEntries(
        Object.entries(store.currentParams).map(([key, param]) => [key, param.value])
      ),
      status: store.status,
      error: store.error,
    },
    dispatch: () => {
      console.warn('dispatch() is not supported. Use store actions instead.');
    },
  };
}
