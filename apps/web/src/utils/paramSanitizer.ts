export const MAX_PARAMS_JSON_LENGTH = 8192;
export const MAX_PARAM_KEY_LENGTH = 64;
export const MAX_STRING_PARAM_LENGTH = 256;
export const MAX_PRESET_IMPORT_BYTES = 256 * 1024;

export function isSafeParamKey(key: string): boolean {
  return (
    key.length > 0 &&
    key.length <= MAX_PARAM_KEY_LENGTH &&
    !key.startsWith("__") &&
    key !== "constructor" &&
    key !== "prototype"
  );
}

export function isPrimitiveParamValue(value: unknown): boolean {
  if (value === null) return false;
  if (typeof value === "string") return value.length <= MAX_STRING_PARAM_LENGTH;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;
  return false;
}

export function sanitizeParamRecord(
  raw: unknown,
): Record<string, unknown> | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw))
    return null;

  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (
      typeof key === "string" &&
      isSafeParamKey(key) &&
      isPrimitiveParamValue(value)
    ) {
      safe[key] = value;
    }
  }
  return safe;
}
