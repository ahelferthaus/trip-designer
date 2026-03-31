import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { TrackingPoint } from "../../lib/tripTracking";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

interface LiveRouteMapProps {
  points: TrackingPoint[];
  currentLat?: number | null;
  currentLng?: number | null;
  height?: number | string;
}

export default function LiveRouteMap({ points, currentLat, currentLng, height = "100%" }: LiveRouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // Init map
  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainer.current || map.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: currentLng && currentLat ? [currentLng, currentLat] : [0, 20],
      zoom: currentLat ? 14 : 2,
      pitch: 45,
      bearing: 0,
      attributionControl: false,
    });

    m.on("style.load", () => {
      m.setFog({
        color: "rgb(20, 30, 60)",
        "high-color": "rgb(40, 60, 120)",
        "horizon-blend": 0.08,
        "space-color": "rgb(11, 29, 51)",
        "star-intensity": 0.4,
      });
    });

    m.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");
    map.current = m;

    return () => { m.remove(); map.current = null; };
  }, []);

  // Update route line
  useEffect(() => {
    const m = map.current;
    if (!m || points.length < 2) return;

    const coordinates = points.map(p => [p.lng, p.lat]);
    const routeData: GeoJSON.Feature = {
      type: "Feature",
      properties: {},
      geometry: { type: "LineString", coordinates },
    };

    if (m.getSource("live-route")) {
      (m.getSource("live-route") as mapboxgl.GeoJSONSource).setData(routeData);
    } else {
      m.on("load", () => {
        if (m.getSource("live-route")) return;
        m.addSource("live-route", { type: "geojson", data: routeData });
        // Glow
        m.addLayer({
          id: "live-route-glow",
          type: "line",
          source: "live-route",
          paint: { "line-color": "#007AFF", "line-width": 8, "line-opacity": 0.2, "line-blur": 6 },
        });
        // Main line
        m.addLayer({
          id: "live-route-line",
          type: "line",
          source: "live-route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#007AFF", "line-width": 3, "line-opacity": 0.9 },
        });
      });
      // If map already loaded
      if (m.isStyleLoaded()) {
        if (!m.getSource("live-route")) {
          m.addSource("live-route", { type: "geojson", data: routeData });
          m.addLayer({
            id: "live-route-glow",
            type: "line",
            source: "live-route",
            paint: { "line-color": "#007AFF", "line-width": 8, "line-opacity": 0.2, "line-blur": 6 },
          });
          m.addLayer({
            id: "live-route-line",
            type: "line",
            source: "live-route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: { "line-color": "#007AFF", "line-width": 3, "line-opacity": 0.9 },
          });
        }
      }
    }
  }, [points]);

  // Update current position marker + fly to
  useEffect(() => {
    const m = map.current;
    if (!m || !currentLat || !currentLng) return;

    if (!markerRef.current) {
      // Create pulsing dot marker
      const el = document.createElement("div");
      el.style.cssText = `
        width: 18px; height: 18px; border-radius: 50%;
        background: #007AFF; border: 3px solid white;
        box-shadow: 0 0 12px rgba(0,122,255,0.6), 0 0 24px rgba(0,122,255,0.3);
        animation: pulse-dot 2s ease-in-out infinite;
      `;
      markerRef.current = new mapboxgl.Marker({ element: el })
        .setLngLat([currentLng, currentLat])
        .addTo(m);
    } else {
      markerRef.current.setLngLat([currentLng, currentLat]);
    }

    // Gently follow the user
    m.easeTo({ center: [currentLng, currentLat], duration: 1000 });
  }, [currentLat, currentLng]);

  if (!MAPBOX_TOKEN) {
    return (
      <div style={{ height }} className="flex items-center justify-center" >
        <p className="text-[14px]" style={{ color: "var(--td-secondary)" }}>Map requires Mapbox token</p>
      </div>
    );
  }

  return <div ref={mapContainer} style={{ width: "100%", height }} />;
}
