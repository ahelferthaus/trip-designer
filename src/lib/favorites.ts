const FAVORITES_KEY = "vybr-favorites";

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(tripId: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(tripId);
  if (idx >= 0) {
    favs.splice(idx, 1);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    return false; // removed
  } else {
    favs.unshift(tripId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    return true; // added
  }
}

export function isFavorite(tripId: string): boolean {
  return getFavorites().includes(tripId);
}
