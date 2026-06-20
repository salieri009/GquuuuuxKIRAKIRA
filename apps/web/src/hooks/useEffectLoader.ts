import { useEffect, useRef } from "react";
import { useEffectStore } from "../store/effectStore";
import { applyShareUrlFromLocation } from "../utils/shareUrl";

/**
 * 효과 로더 훅
 * 앱 시작 시 효과 목록을 자동으로 로드하고 공유 URL 파라미터를 적용합니다.
 */
export function useEffectLoader() {
  const { fetchEffects, effects, status, error } = useEffectStore();
  const shareApplied = useRef(false);

  useEffect(() => {
    if (effects.length > 0) {
      if (!shareApplied.current) {
        shareApplied.current = applyShareUrlFromLocation();
      }
      return;
    }

    void fetchEffects();
  }, [effects.length, fetchEffects]);

  return {
    isLoading: status === "loading",
    error,
    effects,
  };
}
