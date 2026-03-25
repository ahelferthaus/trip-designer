interface GeoResult {
  lat: number;
  lng: number;
  displayName: string;
}

// Cache geocoding results in memory to avoid duplicate requests
const cache = new Map<string, GeoResult | null>();

export async function geocodeLocation(name: string, destination?: string): Promise<GeoResult | null> {
  // Try specific location first
  const query = destination ? `${name}, ${destination}` : name;
  if (cache.has(query)) return cache.get(query) ?? null;

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { "User-Agent": "TripDesigner/1.0" } }
    );
    const data = await res.json();
    if (data.length > 0) {
      const result: GeoResult = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name,
      };
      cache.set(query, result);
      return result;
    }
  } catch {
    // Fall through to destination-only search
  }

  // Fallback: try just the destination city
  if (destination && destination !== name) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination)}&format=json&limit=1`,
        { headers: { "User-Agent": "TripDesigner/1.0" } }
      );
      const data = await res.json();
      if (data.length > 0) {
        const result: GeoResult = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          displayName: data[0].display_name,
        };
        cache.set(query, result);
        return result;
      }
    } catch {
      // Ignore
    }
  }

  cache.set(query, null);
  return null;
}

// Geocode multiple locations with 300ms delay between requests (Nominatim rate limit)
export async function geocodeAll(
  queries: { id: string; name: string; destination?: string }[]
): Promise<Map<string, GeoResult>> {
  const results = new Map<string, GeoResult>();
  for (const q of queries) {
    const result = await geocodeLocation(q.name, q.destination);
    if (result) results.set(q.id, result);
    await new Promise(r => setTimeout(r, 300)); // respect 1 req/sec limit
  }
  return results;
}
