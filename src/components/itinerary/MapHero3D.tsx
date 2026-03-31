import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { mapboxGeocode } from "../../lib/mapboxGeocode";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

interface MapHero3DProps {
  destination: string;
  title?: string;
  subtitle?: string;
  height?: number;
  /** Optional cover photo URL — shown as a blended overlay on the map */
  coverPhoto?: string;
  children?: React.ReactNode;
}

/** Map of known destination photos — reliable, fast, no API needed */
const DESTINATION_PHOTOS: Record<string, string> = {
  "Paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
  "Rome": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
  "Barcelona": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
  "Madrid": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80",
  "London": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  "Amsterdam": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80",
  "Berlin": "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80",
  "Munich": "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800&q=80",
  "Prague": "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80",
  "Santorini": "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=80",
  "Maldives": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "Kyoto": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
  "Tokyo": "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80",
  "New York": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
  "Cancun": "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
  "Miami": "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&q=80",
  "Lisbon": "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&q=80",
  "Bangkok": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
  "Bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  "Iceland": "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80",
  "Swiss Alps": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
  "Amalfi": "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800&q=80",
  "Europe": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
  "World": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
};

function getDestinationPhoto(destination: string): string {
  // Check exact match
  for (const [key, url] of Object.entries(DESTINATION_PHOTOS)) {
    if (destination.toLowerCase().includes(key.toLowerCase())) return url;
  }
  // Fallback — generic travel photo
  return "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80";
}

/**
 * 3D-looking Mapbox globe hero banner.
 * Flies to the trip destination with pitch/bearing for a cinematic 3D effect.
 */
export default function MapHero3D({ destination, title, subtitle, height = 340, coverPhoto, children }: MapHero3DProps) {
  const photoUrl = coverPhoto || getDestinationPhoto(destination);
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
      {/* Full-bleed destination photo — primary visual */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${photoUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* 3D Map — subtle layer underneath for depth */}
      <div ref={mapContainer} className="absolute inset-0" style={{ opacity: 0.3 }} />

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
