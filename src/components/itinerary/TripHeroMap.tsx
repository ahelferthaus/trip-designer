import { useEffect, useRef, useState, useMemo } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { GeneratedItinerary } from "../../lib/generateItinerary";
import type { IntakeFormData } from "../../lib/types";
import UserAvatar from "../UserAvatar";
import type { UserProfile } from "../../lib/types";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

const DAY_COLORS = [
  "#007AFF", "#E63956", "#2D6A4F", "#C93312", "#DD8D29",
  "#3B9AB2", "#E27505", "#5F7470", "#D93954", "#A42820",
];

interface GeoPoint {
  lng: number;
  lat: number;
  title: string;
  day: number;
  slotType: string;
  color: string;
}

interface TripHeroMapProps {
  itinerary: GeneratedItinerary;
  form: IntakeFormData;
  profile?: UserProfile | null;
  userName?: string;
}

async function geocode(query: string, proximity?: [number, number]): Promise<[number, number] | null> {
  if (!MAPBOX_TOKEN) return null;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=1${proximity ? `&proximity=${proximity[0]},${proximity[1]}` : ""}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.features?.length > 0) return data.features[0].center as [number, number];
  } catch { /* skip */ }
  return null;
}

export default function TripHeroMap({ itinerary, form, profile, userName }: TripHeroMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [points, setPoints] = useState<GeoPoint[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const destination = form.destination?.name || itinerary.title;
  const days = itinerary.days.length;

  // Extract first option per slot
  const activities = useMemo(() => {
    const acts: { title: string; location: string; day: number; slotType: string; color: string }[] = [];
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

  // Geocode
  useEffect(() => {
    if (!MAPBOX_TOKEN) return;
    let cancelled = false;
    (async () => {
      const destCoords = await geocode(destination);
      const results: GeoPoint[] = [];
      for (const act of activities) {
        if (cancelled) return;
        const coords = await geocode(`${act.location}, ${destination}`, destCoords ?? undefined);
        if (coords) results.push({ lng: coords[0], lat: coords[1], ...act });
      }
      if (!cancelled) setPoints(results);
    })();
    return () => { cancelled = true; };
  }, [activities, destination]);

  // Init map — dark satellite style for premium feel
  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainer.current || map.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [0, 20],
      zoom: 1.5,
      pitch: 30,
      attributionControl: false,
      interactive: true,
    });
    m.addControl(new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: true }), "top-right");
    m.on("load", () => setMapReady(true));
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  const filtered = selectedDay ? points.filter(p => p.day === selectedDay) : points;

  // Render markers + route
  useEffect(() => {
    const m = map.current;
    if (!m || !mapReady || filtered.length === 0) return;

    // Clear old
    markersRef.current.forEach(mk => mk.remove());
    markersRef.current = [];

    // Markers — larger, premium style
    filtered.forEach((pt, i) => {
      const el = document.createElement("div");
      el.className = "trip-hero-marker";
      el.innerHTML = `<span>${i + 1}</span>`;
      el.style.cssText = `
        width: 36px; height: 36px; border-radius: 50%;
        background: ${pt.color};
        color: white; display: flex; align-items: center; justify-content: center;
        font-size: 14px; font-weight: 800; font-family: -apple-system, sans-serif;
        border: 3px solid rgba(255,255,255,0.9);
        box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.1);
        cursor: pointer; transition: transform 0.15s;
      `;
      el.onmouseenter = () => { el.style.transform = "scale(1.2)"; };
      el.onmouseleave = () => { el.style.transform = "scale(1)"; };

      const popup = new mapboxgl.Popup({ offset: 20, closeButton: false, className: "trip-hero-popup" })
        .setHTML(`
          <div style="font-family:-apple-system,sans-serif;padding:4px 0">
            <div style="font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px">Day ${pt.day} · ${pt.slotType}</div>
            <div style="font-size:15px;font-weight:700;margin-top:2px">${pt.title}</div>
          </div>
        `);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([pt.lng, pt.lat])
        .setPopup(popup)
        .addTo(m);
      markersRef.current.push(marker);
    });

    // Animated route line
    const routeId = "hero-route";
    const routeData: GeoJSON.Feature = {
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates: filtered.map(p => [p.lng, p.lat]) },
    };

    if (m.getSource(routeId)) {
      (m.getSource(routeId) as mapboxgl.GeoJSONSource).setData(routeData);
    } else {
      m.addSource(routeId, { type: "geojson", data: routeData });
      // Glow layer
      m.addLayer({
        id: `${routeId}-glow`,
        type: "line",
        source: routeId,
        paint: {
          "line-color": "#ffffff",
          "line-width": 6,
          "line-opacity": 0.15,
          "line-blur": 4,
        },
      });
      // Main route
      m.addLayer({
        id: routeId,
        type: "line",
        source: routeId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#ffffff",
          "line-width": 2.5,
          "line-opacity": 0.7,
          "line-dasharray": [3, 2],
        },
      });
    }

    // Fit bounds with cinematic animation
    const bounds = new mapboxgl.LngLatBounds();
    filtered.forEach(p => bounds.extend([p.lng, p.lat]));
    m.fitBounds(bounds, { padding: { top: 100, bottom: 200, left: 50, right: 50 }, maxZoom: 13, duration: 1200 });
  }, [filtered, mapReady]);

  if (!MAPBOX_TOKEN) return null;

  return (
    <div className="relative" style={{ height: 380 }}>
      {/* Map canvas */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Top gradient overlay */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)" }}
      />

      {/* Bottom gradient overlay */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 100%)" }}
      />

      {/* Trip title overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pointer-events-none">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[26px] font-black text-white leading-tight drop-shadow-lg">
              {itinerary.title || `${destination} Trip`}
            </h1>
            <p className="text-[14px] text-white/70 mt-0.5 drop-shadow">
              {destination} · {days} day{days !== 1 ? "s" : ""}
              {form.start_date && ` · ${new Date(form.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
            </p>
          </div>
          {userName && (
            <div className="flex items-center gap-2 pointer-events-auto">
              <UserAvatar name={userName} profile={profile} size="sm" showLabel={false} />
            </div>
          )}
        </div>
      </div>

      {/* Day filter pills — floating */}
      <div className="absolute bottom-16 left-0 right-0 px-4 pointer-events-auto">
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setSelectedDay(null)}
            className="px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap active:opacity-70"
            style={{
              backgroundColor: selectedDay === null ? "white" : "rgba(255,255,255,0.2)",
              color: selectedDay === null ? "#000" : "white",
            }}
          >
            All
          </button>
          {itinerary.days.map(day => (
            <button
              key={day.day_number}
              onClick={() => setSelectedDay(day.day_number)}
              className="px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap active:opacity-70"
              style={{
                backgroundColor: selectedDay === day.day_number
                  ? DAY_COLORS[(day.day_number - 1) % DAY_COLORS.length]
                  : "rgba(255,255,255,0.2)",
                color: "white",
              }}
            >
              Day {day.day_number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
