import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { mapboxGeocode } from "../../lib/mapboxGeocode";
import { getDestinationPhoto } from "../../lib/destinationPhotos";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

interface MapHero3DProps {
  destination: string;
  title?: string;
  subtitle?: string;
  height?: number;
  /** Optional cover photo URL — overrides auto-detected photo */
  coverPhoto?: string;
  /** Show destination photo as the hero visual (true for trip pages, false for general pages) */
  showPhoto?: boolean;
  children?: React.ReactNode;
}

/**
 * 3D-looking Mapbox globe hero banner.
 * Flies to the trip destination with pitch/bearing for a cinematic 3D effect.
 */
export default function MapHero3D({ destination, title, subtitle, height = 340, coverPhoto, showPhoto = false, children }: MapHero3DProps) {
  const photoUrl = coverPhoto || getDestinationPhoto(destination, 800);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [ready, setReady] = useState(false);

  // Init map
  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainer.current || map.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [0, 20],
      zoom: 1.5,
      pitch: 55,
      bearing: -20,
      attributionControl: false,
      interactive: false,
      projection: "globe",
    });

    // Globe atmosphere
    m.on("style.load", () => {
      m.setFog({
        color: "rgb(20, 30, 60)",
        "high-color": "rgb(40, 60, 120)",
        "horizon-blend": 0.08,
        "space-color": "rgb(11, 29, 51)",
        "star-intensity": 0.6,
      });
    });

    m.on("load", () => setReady(true));
    map.current = m;

    return () => { m.remove(); map.current = null; };
  }, []);

  // Fly to destination
  useEffect(() => {
    if (!ready || !map.current || !destination) return;

    (async () => {
      const coords = await mapboxGeocode(destination);
      if (coords && map.current) {
        map.current.flyTo({
          center: coords,
          zoom: 10,
          pitch: 60,
          bearing: Math.random() * 40 - 20, // slight random bearing for variety
          duration: 2500,
          essential: true,
        });
      }
    })();
  }, [ready, destination]);

  // Fallback if no Mapbox token — show destination photo
  if (!MAPBOX_TOKEN) {
    return (
      <div className="relative overflow-hidden" style={{ height, background: `url(${photoUrl}) center/cover` }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.4) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
          {title && <h1 className="text-[26px] font-black text-white leading-tight drop-shadow-lg">{title}</h1>}
          {subtitle && <p className="text-[14px] text-white/70 mt-1 drop-shadow">{subtitle}</p>}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ height }}>
      {/* 3D Map — full when no photo, hidden when photo is shown */}
      {!showPhoto && <div ref={mapContainer} className="absolute inset-0" />}

      {/* Destination photo — full-bleed <img> for reliable rendering */}
      {showPhoto && (
        <img
          src={photoUrl}
          alt={destination}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Top gradient */}
      <div className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)" }} />

      {/* Bottom gradient for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-44 pointer-events-none"
        style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)" }} />

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pointer-events-none">
        {title && <h1 className="text-[26px] font-black text-white leading-tight drop-shadow-lg">{title}</h1>}
        {subtitle && <p className="text-[14px] text-white/70 mt-1 drop-shadow">{subtitle}</p>}
      </div>

      {children}
    </div>
  );
}
