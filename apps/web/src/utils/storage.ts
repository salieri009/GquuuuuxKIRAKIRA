const FAVORITES_KEY = "kirakira-favorites";
const EFFECT_ID_PATTERN = /^[a-z0-9-]+$/;

export function loadFavoritesFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (id): id is string =>
        typeof id === "string" && EFFECT_ID_PATTERN.test(id),
    );
  } catch {
    return [];
  }
}

export function saveFavoritesToStorage(favorites: string[]): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}
