import { useState, useEffect, useRef, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { GeneratedItinerary } from "../../lib/generateItinerary";
import { mapboxGeocode } from "../../lib/mapboxGeocode";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

interface ItineraryMapProps {
  itinerary: GeneratedItinerary;
  destination?: string;
  accentColor?: string;
}

const DAY_COLORS = [
  "#007AFF", "#D9381E", "#6B8E23", "#C93312", "#DD8D29",
  "#3B9AB2", "#E27505", "#5F7470", "#D93954", "#A42820",
];

interface MapActivity {
  title: string;
  location: string;
  day: number;
  slotType: string;
  color: string;
}

interface GeocodedPoint {
  activity: MapActivity;
  lng: number;
  lat: number;
}

export default function ItineraryMap({ itinerary, destination }: ItineraryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [points, setPoints] = useState<GeocodedPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);

  // Extract activities
  const activities = useMemo(() => {
    const acts: MapActivity[] = [];
    for (const day of itinerary.days) {
      const color = DAY_COLORS[(day.day_number - 1) % DAY_COLORS.length];
      for (const slot of day.slots) {
        const opt = slot.options[0];
        if (opt) {
          acts.push({
            title: opt.title,
            location: opt.location?.name || opt.title,
            day: day.day_number,
            slotType: slot.slot_type,
            color,
          });
        }
      }
    }
    return acts;
  }, [itinerary]);

  // Geocode all activities
  useEffect(() => {
    if (!MAPBOX_TOKEN) { setLoading(false); return; }

    let cancelled = false;
    (async () => {
      // First geocode the destination for proximity bias
      const destCoords = await mapboxGeocode(destination || itinerary.title);
      const results: GeocodedPoint[] = [];

      for (const act of activities) {
        if (cancelled) return;
        const query = `${act.location}, ${destination || ""}`;
        const coords = await mapboxGeocode(query, destCoords ?? undefined);
        if (coords) {
          results.push({ activity: act, lng: coords[0], lat: coords[1] });
        }
      }

      if (!cancelled) {
        setPoints(results);
        setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [activities, destination, itinerary.title]);

  // Initialize map
  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [0, 30],
      zoom: 2,
      attributionControl: false,
    });

    m.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    m.on("load", () => setMapReady(true));
    map.current = m;

    return () => { m.remove(); map.current = null; };
  }, []);

  // Filter points by day
  const filtered = selectedDay ? points.filter(p => p.activity.day === selectedDay) : points;

  // Update markers + route line when filtered points change
  useEffect(() => {
    const m = map.current;
    if (!m || !mapReady || filtered.length === 0) return;

    // Clear old markers
    markersRef.current.forEach(mk => mk.remove());
    markersRef.current = [];

    // Add numbered markers
    filtered.forEach((pt, i) => {
      const el = document.createElement("div");
      el.style.cssText = `
        width: 28px; height: 28px; border-radius: 50%;
        background: ${pt.activity.color}; color: white;
        display: flex; align-items: center; justify-content: center;
        font-size: 12px; font-weight: 700;
        border: 2.5px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-family: -apple-system, sans-serif;
        cursor: pointer;
      `;
      el.textContent = String(i + 1);

      const popup = new mapboxgl.Popup({ offset: 16, closeButton: false })
        .setHTML(`
          <div style="font-family:-apple-system,sans-serif;font-size:13px;max-width:180px">
            <strong>Day ${pt.activity.day}</strong> · ${pt.activity.slotType}<br/>
            ${pt.activity.title}
          </div>
        `);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([pt.lng, pt.lat])
        .setPopup(popup)
        .addTo(m);

      markersRef.current.push(marker);
    });

    // Route line
    const routeId = "trip-route";
    if (m.getSource(routeId)) {
      (m.getSource(routeId) as mapboxgl.GeoJSONSource).setData({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: filtered.map(p => [p.lng, p.lat]),
        },
      });
    } else {
      m.addSource(routeId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: filtered.map(p => [p.lng, p.lat]),
          },
        },
      });
      m.addLayer({
        id: routeId,
        type: "line",
        source: routeId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "var(--td-accent)" in document.documentElement.style ? "#007AFF" : "#007AFF",
          "line-width": 3,
          "line-opacity": 0.6,
          "line-dasharray": [2, 2],
        },
      });
    }

    // Fit bounds
    const bounds = new mapboxgl.LngLatBounds();
    filtered.forEach(p => bounds.extend([p.lng, p.lat]));
    m.fitBounds(bounds, { padding: 50, maxZoom: 14, duration: 500 });
  }, [filtered, mapReady]);

  // Google Maps directions URL for "Open in Maps"
  const mapsDirectionsUrl = useMemo(() => {
    const waypoints = filtered.map(p => `${p.activity.location}, ${destination || ""}`).slice(0, 10);
    if (waypoints.length === 0) return null;
    if (waypoints.length === 1) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(waypoints[0])}`;
    }
    const origin = encodeURIComponent(waypoints[0]);
    const dest = encodeURIComponent(waypoints[waypoints.length - 1]);
    const middle = waypoints.slice(1, -1).map(w => encodeURIComponent(w)).join("|");
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${middle ? `&waypoints=${middle}` : ""}&travelmode=walking`;
  }, [filtered, destination]);

  // Fallback if no Mapbox token
  if (!MAPBOX_TOKEN) {
    const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(destination || itinerary.title || "trip")}&output=embed&z=12`;
    return (
      <div className="rounded-2xl overflow-hidden shadow-sm">
        <div style={{ height: 250 }}>
          <iframe title="Trip Map" src={embedUrl} style={{ width: "100%", height: "100%", border: "none" }} loading="lazy" allowFullScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm">
      {/* Map */}
      <div style={{ height: 280, position: "relative" }}>
        <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "var(--td-fill)" }}>
            <div className="text-center">
              <svg className="animate-spin w-6 h-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" style={{ color: "var(--td-accent)" }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-[12px]" style={{ color: "var(--td-secondary)" }}>Mapping your trip…</p>
            </div>
          </div>
        )}
      </div>

      {/* Day filter pills */}
      <div className="px-3 py-2 flex gap-1.5 overflow-x-auto hide-scrollbar" style={{ backgroundColor: "var(--td-card)" }}>
        <button
          onClick={() => setSelectedDay(null)}
          className="px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap active:opacity-70"
          style={{
            backgroundColor: selectedDay === null ? "var(--td-accent)" : "var(--td-fill)",
            color: selectedDay === null ? "var(--td-accent-text)" : "var(--td-label)",
          }}
        >
          All Days
        </button>
        {itinerary.days.map(day => (
          <button
            key={day.day_number}
            onClick={() => setSelectedDay(day.day_number)}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap active:opacity-70"
            style={{
              backgroundColor: selectedDay === day.day_number
                ? DAY_COLORS[(day.day_number - 1) % DAY_COLORS.length]
                : "var(--td-fill)",
              color: selectedDay === day.day_number ? "#fff" : "var(--td-label)",
            }}
          >
            Day {day.day_number}
          </button>
        ))}
      </div>

      {/* Activity list */}
      <div className="max-h-48 overflow-y-auto divide-y" style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}>
        {filtered.map((pt, i) => (
          <button
            key={`${pt.activity.day}-${pt.activity.slotType}-${i}`}
            onClick={() => {
              const m = map.current;
              if (m) {
                m.flyTo({ center: [pt.lng, pt.lat], zoom: 15, duration: 800 });
                markersRef.current[i]?.togglePopup();
              }
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left active:opacity-70"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
              style={{ backgroundColor: pt.activity.color, color: "#fff" }}
            >
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate" style={{ color: "var(--td-label)" }}>
                {pt.activity.title}
              </p>
              <p className="text-[11px] truncate" style={{ color: "var(--td-secondary)" }}>
                Day {pt.activity.day} · {pt.activity.slotType}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Open in Google Maps */}
      {mapsDirectionsUrl && (
        <a
          href={mapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-2.5 text-[13px] font-semibold active:opacity-70"
          style={{ backgroundColor: "var(--td-fill)", color: "var(--td-accent)" }}
        >
          Open full route in Google Maps ↗
        </a>
      )}
    </div>
  );
}
