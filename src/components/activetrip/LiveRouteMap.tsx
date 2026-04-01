import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { TrackingPoint } from "../../lib/tripTracking";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

/** Colors for different group members' routes */
const MEMBER_COLORS = [
  "#007AFF", // blue (current user, always first)
  "#FF3B30", // red
  "#34C759", // green
  "#FF9500", // orange
  "#AF52DE", // purple
  "#FF2D55", // pink
  "#5AC8FA", // light blue
  "#FFCC00", // yellow
];

export interface UserRoute {
  userId: string;
  displayName: string;
  points: TrackingPoint[];
  /** Last known position for this user */
  currentLat?: number;
  currentLng?: number;
  /** Whether this is the current user */
  isCurrentUser?: boolean;
}

interface LiveRouteMapProps {
  /** Multiple users' routes */
  routes: UserRoute[];
  /** Camera follows this position */
  followLat?: number | null;
  followLng?: number | null;
  height?: number | string;
}

export default function LiveRouteMap({ routes, followLat, followLng, height = "100%" }: LiveRouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  // Init map
  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainer.current || map.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: followLng && followLat ? [followLng, followLat] : [0, 20],
      zoom: followLat ? 14 : 2,
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

  // Update routes for all users
  useEffect(() => {
    const m = map.current;
    if (!m || !m.isStyleLoaded()) {
      // Retry after map loads
      const handler = () => { if (map.current) updateRoutes(map.current, routes); };
      m?.on("load", handler);
      return;
    }
    updateRoutes(m, routes);
  }, [routes]);

  function updateRoutes(m: mapboxgl.Map, userRoutes: UserRoute[]) {
    userRoutes.forEach((route, idx) => {
      const color = MEMBER_COLORS[idx % MEMBER_COLORS.length];
      const sourceId = `route-${route.userId}`;
      const coordinates = route.points.map(p => [p.lng, p.lat]);

      if (coordinates.length < 2) return;

      const routeData: GeoJSON.Feature = {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates },
      };

      if (m.getSource(sourceId)) {
        (m.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(routeData);
      } else {
        m.addSource(sourceId, { type: "geojson", data: routeData });
        // Glow layer
        m.addLayer({
          id: `${sourceId}-glow`,
          type: "line",
          source: sourceId,
          paint: { "line-color": color, "line-width": 8, "line-opacity": 0.15, "line-blur": 6 },
        });
        // Main line
        m.addLayer({
          id: `${sourceId}-line`,
          type: "line",
          source: sourceId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": color, "line-width": 3, "line-opacity": 0.9 },
        });
      }

      // User position marker
      const lastPoint = route.currentLat && route.currentLng
        ? { lat: route.currentLat, lng: route.currentLng }
        : route.points[route.points.length - 1];

      if (lastPoint) {
        if (markersRef.current.has(route.userId)) {
          markersRef.current.get(route.userId)!.setLngLat([lastPoint.lng, lastPoint.lat]);
        } else {
          const el = document.createElement("div");
          if (route.isCurrentUser) {
            // Pulsing blue dot for current user
            el.style.cssText = `
              width: 18px; height: 18px; border-radius: 50%;
              background: ${color}; border: 3px solid white;
              box-shadow: 0 0 12px ${color}80, 0 0 24px ${color}40;
            `;
          } else {
            // Labeled dot for group members
            el.style.cssText = `
              width: 28px; height: 28px; border-radius: 50%;
              background: ${color}; border: 2px solid white;
              box-shadow: 0 0 8px rgba(0,0,0,0.4);
              display: flex; align-items: center; justify-content: center;
              font-size: 11px; font-weight: 800; color: white;
              font-family: -apple-system, sans-serif;
            `;
            el.textContent = (route.displayName || "?")[0].toUpperCase();
          }
          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([lastPoint.lng, lastPoint.lat])
            .addTo(m);

          // Popup with name
          if (!route.isCurrentUser) {
            marker.setPopup(
              new mapboxgl.Popup({ offset: 16, closeButton: false })
                .setHTML(`<div style="font-family:-apple-system,sans-serif;font-size:13px;font-weight:600">${route.displayName}</div>`)
            );
          }

          markersRef.current.set(route.userId, marker);
        }
      }
    });
  }

  // Camera follow
  useEffect(() => {
    const m = map.current;
    if (!m || !followLat || !followLng) return;
    m.easeTo({ center: [followLng, followLat], duration: 1000 });
  }, [followLat, followLng]);

  if (!MAPBOX_TOKEN) {
    return (
      <div style={{ height }} className="flex items-center justify-center">
        <p className="text-[14px]" style={{ color: "var(--td-secondary)" }}>Map requires Mapbox token</p>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height }}>
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Member legend */}
      {routes.length > 1 && (
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {routes.map((route, idx) => (
            <div
              key={route.userId}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-bold"
              style={{
                backgroundColor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                color: "white",
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: MEMBER_COLORS[idx % MEMBER_COLORS.length] }}
              />
              {route.displayName}
              {route.isCurrentUser && " (You)"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
