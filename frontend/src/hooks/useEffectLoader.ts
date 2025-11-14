import { useEffect } from 'react';
import { useEffectStore } from '../store/effectStore';

/**
 * 효과 로더 훅
 * 앱 시작 시 효과 목록을 자동으로 로드합니다.
 */
export function useEffectLoader() {
  const { fetchEffects, effects, status, error } = useEffectStore();

  useEffect(() => {
    // 효과가 이미 로드되어 있으면 스킵
    if (effects.length > 0) return;

    // 효과 목록 로드
    fetchEffects();
  }, [effects.length, fetchEffects]);

  return {
    isLoading: status === 'loading',
    error,
    effects,
  };
}