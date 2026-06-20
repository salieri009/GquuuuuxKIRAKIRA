import type { EffectParameter } from "../types";
import { useEffectStore } from "../store/effectStore";

export function paramValuesFromRecord(
  currentParams: Record<string, EffectParameter>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(currentParams).map(([key, param]) => [key, param.value]),
  );
}

export function readCurrentEffectParams(): Record<string, unknown> {
  return paramValuesFromRecord(useEffectStore.getState().currentParams);
}
