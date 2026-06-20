import type { ApiResponse } from "@kirakira/contracts";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.success || payload.data === undefined) {
    throw new Error(payload.error ?? "API response missing data");
  }
  return payload.data;
}
