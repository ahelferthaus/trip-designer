import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { geocodeAll } from "../../lib/geocode";
import type { GeneratedItinerary } from "../../lib/generateItinerary";

// Fix leaflet default marker icon broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function createNumberedIcon(number: number, color: string) {
  return L.divIcon({
    html: `<div style="
      background: ${color};
      color: white;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      font-family: -apple-system, sans-serif;
    ">${number}</div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(p => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, positions]);
  return null;
}

interface MapPoint {
  id: string;
  label: string;
  lat: number;
  lng: number;
  day: number;
  color: string;
}

interface ItineraryMapProps {
  itinerary: GeneratedItinerary;
  destination?: string;
  accentColor?: string;
}

const DAY_COLORS = [
  "#007AFF", "#D9381E", "#6B8E23", "#C93312", "#DD8D29",
  "#3B9AB2", "#E27505", "#5F7470", "#D93954", "#A42820",
];

export default function ItineraryMap({ itinerary, destination, accentColor }: ItineraryMapProps) {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const geocoded = useRef(false);

  useEffect(() => {
    if (geocoded.current) return;
    geocoded.current = true;

    const queries: { id: string; name: string; destination?: string }[] = [];

    for (const day of itinerary.days) {
      for (const slot of day.slots) {
        // Use the first option's location (default selection)
        const opt = slot.options[0];
        if (opt?.location?.name) {
          queries.push({
            id: `${day.day_number}-${slot.slot_type}`,
            name: opt.location.name,
            destination,
          });
        } else if (opt?.title) {
          queries.push({
            id: `${day.day_number}-${slot.slot_type}`,
            name: opt.title,
            destination,
          });
        }
      }
    }

    if (queries.length === 0) {
      setLoading(false);
      return;
    }

    geocodeAll(queries).then(results => {
      const pts: MapPoint[] = [];
      let idx = 1;

      for (const day of itinerary.days) {
        const color = DAY_COLORS[(day.day_number - 1) % DAY_COLORS.length];
        for (const slot of day.slots) {
          const key = `${day.day_number}-${slot.slot_type}`;
          const geo = results.get(key);
          const opt = slot.options[0];
          if (geo && opt) {
            pts.push({
              id: key,
              label: opt.title,
              lat: geo.lat,
              lng: geo.lng,
              day: day.day_number,
              color,
            });
            idx++;
          }
        }
      }

      setPoints(pts);
      setLoading(false);
    });
  }, [itinerary, destination]);

  const positions: [number, number][] = points.map(p => [p.lat, p.lng]);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{ height: 220, backgroundColor: "var(--td-fill)" }}
      >
        <div className="text-center">
          <svg className="animate-spin w-6 h-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24"
            style={{ color: "var(--td-accent)" }}>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-[13px]" style={{ color: "var(--td-secondary)" }}>Mapping your trip…</p>
        </div>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{ height: 120, backgroundColor: "var(--td-fill)" }}
      >
        <p className="text-[13px]" style={{ color: "var(--td-secondary)" }}>No mappable locations found</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ height: 300 }}>
      <MapContainer
        style={{ height: "100%", width: "100%" }}
        center={[points[0].lat, points[0].lng]}
        zoom={12}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds positions={positions} />
        {/* Route polyline */}
        <Polyline
          positions={positions}
          pathOptions={{ color: accentColor ?? "#007AFF", weight: 3, opacity: 0.7, dashArray: "6 4" }}
        />
        {/* Numbered markers */}
        {points.map((pt, i) => (
          <Marker
            key={pt.id}
            position={[pt.lat, pt.lng]}
            icon={createNumberedIcon(i + 1, pt.color)}
          >
            <Popup>
              <div style={{ fontFamily: "-apple-system, sans-serif", fontSize: 13 }}>
                <strong>Day {pt.day}</strong><br />
                {pt.label}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
