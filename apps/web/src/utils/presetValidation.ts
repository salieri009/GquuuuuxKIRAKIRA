import { sanitizeParamRecord } from "./paramSanitizer";

export interface Preset {
  id: string;
  name: string;
  effectId: string;
  params: Record<string, unknown>;
  createdAt: string;
}

const EFFECT_ID_PATTERN = /^[a-z0-9-]+$/;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validatePreset(raw: unknown): Preset | null {
  if (!isPlainObject(raw)) return null;

  const { id, name, effectId, params, createdAt } = raw;

  if (typeof id !== "string" || !id.trim()) return null;
  if (typeof name !== "string" || !name.trim()) return null;
  if (typeof effectId !== "string" || !EFFECT_ID_PATTERN.test(effectId))
    return null;
  if (!isPlainObject(params)) return null;
  if (typeof createdAt !== "string" || Number.isNaN(Date.parse(createdAt)))
    return null;

  const safeParams = sanitizeParamRecord(params);
  if (!safeParams) return null;

  return {
    id: id.trim(),
    name: name.trim(),
    effectId,
    params: safeParams,
    createdAt,
  };
}

export function parsePresetList(raw: unknown): Preset[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(validatePreset)
    .filter((preset): preset is Preset => preset !== null);
}

export function loadPresetsFromStorage(
  storageKey = "kirakira-presets",
): Preset[] {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return [];
    return parsePresetList(JSON.parse(saved));
  } catch {
    return [];
  }
}

export function savePresetsToStorage(
  presets: Preset[],
  storageKey = "kirakira-presets",
): void {
  localStorage.setItem(storageKey, JSON.stringify(presets));
}
