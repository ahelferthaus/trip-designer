import { isMapAvailable, getGeocodingUrl, parseGeocodingResult } from "./mapProvider";

// Shared in-memory cache — survives across component mounts within the same session
const cache = new Map<string, [number, number] | null>();

export async function mapboxGeocode(
  query: string,
  proximity?: [number, number]
): Promise<[number, number] | null> {
  if (!isMapAvailable()) return null;

  const cacheKey = `${query}|${proximity?.join(",") ?? ""}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;

  const url = getGeocodingUrl(query, proximity);
  if (!url) return null;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const coords = parseGeocodingResult(data);
    if (coords) {
      cache.set(cacheKey, coords);
      return coords;
    }
  } catch { /* skip */ }

  cache.set(cacheKey, null);
  return null;
}
