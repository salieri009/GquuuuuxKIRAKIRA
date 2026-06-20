import { useEffectStore } from "../store/effectStore";
import { MAX_PARAMS_JSON_LENGTH, sanitizeParamRecord } from "./paramSanitizer";

const EFFECT_ID_PATTERN = /^[a-z0-9-]+$/;

export interface ShareUrlPayload {
  effectId: string;
  params: Record<string, unknown>;
}

export function parseShareUrl(search: string): ShareUrlPayload | null {
  const searchParams = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  const effectId = searchParams.get("effect");
  const paramsRaw = searchParams.get("params");

  if (
    !effectId ||
    !paramsRaw ||
    !EFFECT_ID_PATTERN.test(effectId) ||
    paramsRaw.length > MAX_PARAMS_JSON_LENGTH
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(paramsRaw));
    const params = sanitizeParamRecord(parsed);
    if (!params) return null;
    return { effectId, params };
  } catch {
    return null;
  }
}

export function buildShareUrl(
  effectId: string,
  params: Record<string, unknown>,
): string {
  return `${window.location.origin}${window.location.pathname}?effect=${effectId}&params=${encodeURIComponent(JSON.stringify(params))}`;
}

export function clearShareParamsFromLocation(): void {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("effect") && !url.searchParams.has("params"))
    return;

  url.searchParams.delete("effect");
  url.searchParams.delete("params");
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, "", next);
}

/**
 * Applies ?effect=&params= from the current URL after the catalog is loaded.
 */
export function applyShareUrlFromLocation(): boolean {
  const payload = parseShareUrl(window.location.search);
  if (!payload) return false;

  const store = useEffectStore.getState();
  const effect = store.getEffectById(payload.effectId);
  if (!effect) return false;

  store.selectEffect(payload.effectId);
  store.updateParams(payload.params);
  clearShareParamsFromLocation();
  return true;
}
