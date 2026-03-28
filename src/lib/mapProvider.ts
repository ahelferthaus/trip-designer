/**
 * Map provider abstraction — enables instant failover via VITE_MAP_PROVIDER env var.
 *
 * Supported providers:
 *   "mapbox"   — Mapbox GL JS (current default)
 *   "maptiler" — MapTiler Cloud + MapLibre GL JS
 *   "google"   — Google Maps embed fallback
 */

export type MapProvider = "mapbox" | "maptiler" | "google";

export const MAP_PROVIDER: MapProvider =
  (import.meta.env.VITE_MAP_PROVIDER as MapProvider) || "mapbox";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY as string | undefined;
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined;

export function getMapToken(): string | undefined {
  switch (MAP_PROVIDER) {
    case "mapbox":
      return MAPBOX_TOKEN;
    case "maptiler":
      return MAPTILER_KEY;
    case "google":
      return GOOGLE_MAPS_KEY;
  }
}

export function isMapAvailable(): boolean {
  return !!getMapToken();
}

export function getSatelliteStyle(): string {
  switch (MAP_PROVIDER) {
    case "mapbox":
      return "mapbox://styles/mapbox/satellite-streets-v12";
    case "maptiler":
      return `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`;
    default:
      return "";
  }
}

export function getOutdoorStyle(): string {
  switch (MAP_PROVIDER) {
    case "mapbox":
      return "mapbox://styles/mapbox/outdoors-v12";
    case "maptiler":
      return `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${MAPTILER_KEY}`;
    default:
      return "";
  }
}

export function getGeocodingUrl(query: string, proximity?: [number, number]): string {
  const encoded = encodeURIComponent(query);
  const prox = proximity ? `&proximity=${proximity[0]},${proximity[1]}` : "";

  switch (MAP_PROVIDER) {
    case "mapbox":
      return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${MAPBOX_TOKEN}&limit=1${prox}`;
    case "maptiler":
      return `https://api.maptiler.com/geocoding/${encoded}.json?key=${MAPTILER_KEY}&limit=1${prox}`;
    default:
      return "";
  }
}

/**
 * Parse geocoding response for coordinates — handles both Mapbox and MapTiler formats.
 */
export function parseGeocodingResult(data: Record<string, unknown>): [number, number] | null {
  const features = data.features as Array<{ center?: [number, number]; geometry?: { coordinates?: [number, number] } }> | undefined;
  if (!features || features.length === 0) return null;

  // Mapbox format: features[0].center
  if (features[0].center) return features[0].center;

  // MapTiler/GeoJSON format: features[0].geometry.coordinates
  if (features[0].geometry?.coordinates) return features[0].geometry.coordinates;

  return null;
}
