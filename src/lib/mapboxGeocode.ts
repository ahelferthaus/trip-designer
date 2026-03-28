const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

// Shared in-memory cache — survives across component mounts within the same session
const cache = new Map<string, [number, number] | null>();

export async function mapboxGeocode(
  query: string,
  proximity?: [number, number]
): Promise<[number, number] | null> {
  if (!MAPBOX_TOKEN) return null;

  const cacheKey = `${query}|${proximity?.join(",") ?? ""}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=1${proximity ? `&proximity=${proximity[0]},${proximity[1]}` : ""}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.features?.length > 0) {
      const coords = data.features[0].center as [number, number];
      cache.set(cacheKey, coords);
      return coords;
    }
  } catch { /* skip */ }

  cache.set(cacheKey, null);
  return null;
}
