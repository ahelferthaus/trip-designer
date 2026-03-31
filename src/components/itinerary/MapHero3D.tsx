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
  /** Optional cover photo URL — overrides auto-detected photo */
  coverPhoto?: string;
  /** Show destination photo as the hero visual (true for trip pages, false for general pages) */
  showPhoto?: boolean;
  children?: React.ReactNode;
}

/** Map of known destination photos — reliable Unsplash direct URLs */
const DESTINATION_PHOTOS: Record<string, string> = {
  // Europe
  "Paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
  "Rome": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
  "Barcelona": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
  "Madrid": "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80",
  "London": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  "Amsterdam": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80",
  "Berlin": "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80",
  "Munich": "https://images.unsplash.com/photo-1595867818082-083862f3d630?w=800&q=80",
  "Prague": "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80",
  "Vienna": "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80",
  "Lisbon": "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&q=80",
  "Athens": "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80",
  "Santorini": "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&q=80",
  "Dubrovnik": "https://images.unsplash.com/photo-1555990538-1e15a77c0c3b?w=800&q=80",
  "Split": "https://images.unsplash.com/photo-1558271736-cd043ef2e855?w=800&q=80",
  "Edinburgh": "https://images.unsplash.com/photo-1506377585622-bedcbb5f8c4d?w=800&q=80",
  "Dublin": "https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800&q=80",
  "Copenhagen": "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&q=80",
  "Stockholm": "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=800&q=80",
  "Reykjavik": "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80",
  "Budapest": "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80",
  "Florence": "https://images.unsplash.com/photo-1543429258-390404e4e493?w=800&q=80",
  "Venice": "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
  "Amalfi": "https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=800&q=80",
  "Swiss Alps": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
  "Bruges": "https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=800&q=80",
  "Seville": "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&q=80",
  "Istanbul": "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
  "Cinque Terre": "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
  "Nice": "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=800&q=80",
  // US Cities
  "New York": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
  "Los Angeles": "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&q=80",
  "San Francisco": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
  "Chicago": "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80",
  "Miami": "https://images.unsplash.com/photo-1535498730771-e735b998cd64?w=800&q=80",
  "Austin": "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&q=80",
  "Nashville": "https://images.unsplash.com/photo-1545419913-775e2e285ed6?w=800&q=80",
  "New Orleans": "https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=800&q=80",
  "Denver": "https://images.unsplash.com/photo-1619856699906-09e1f4ef578c?w=800&q=80",
  "Seattle": "https://images.unsplash.com/photo-1502175353174-a7a70e73b4c3?w=800&q=80",
  "Portland": "https://images.unsplash.com/photo-1507245338956-23ef13afb115?w=800&q=80",
  "San Diego": "https://images.unsplash.com/photo-1538097304804-2a1b932466a9?w=800&q=80",
  "Washington DC": "https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=800&q=80",
  "Boston": "https://images.unsplash.com/photo-1501979376754-2ff867a4f659?w=800&q=80",
  "Charleston": "https://images.unsplash.com/photo-1587578932405-7c740a762f7f?w=800&q=80",
  "Savannah": "https://images.unsplash.com/photo-1597525191656-1883ad4ab1b2?w=800&q=80",
  "Las Vegas": "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?w=800&q=80",
  "Scottsdale": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  "Maui": "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800&q=80",
  "Hawaii": "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=800&q=80",
  "Key West": "https://images.unsplash.com/photo-1580192985016-7e15ef081dd8?w=800&q=80",
  "Orlando": "https://images.unsplash.com/photo-1575089976121-8ed7b2a54265?w=800&q=80",
  // Ski
  "Vail": "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
  "Aspen": "https://images.unsplash.com/photo-1548587591-18a4e1d09c79?w=800&q=80",
  "Park City": "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80",
  "Jackson Hole": "https://images.unsplash.com/photo-1548587591-18a4e1d09c79?w=800&q=80",
  "Whistler": "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
  "Chamonix": "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=800&q=80",
  "Zermatt": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
  "Steamboat": "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
  "Big Sky": "https://images.unsplash.com/photo-1548587591-18a4e1d09c79?w=800&q=80",
  "Telluride": "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
  // Soccer
  "Manchester": "https://images.unsplash.com/photo-1515876305430-f06edab8282a?w=800&q=80",
  "Liverpool": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
  "Milan": "https://images.unsplash.com/photo-1520440229-6469d149e6e0?w=800&q=80",
  "Buenos Aires": "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80",
  // Beach/Tropical
  "Cancun": "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80",
  "Cabo": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80",
  "Puerto Vallarta": "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&q=80",
  "Nassau": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80",
  "Bahamas": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80",
  "South Padre": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "Panama City Beach": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "Punta Cana": "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&q=80",
  "Costa Rica": "https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=800&q=80",
  "Riviera Maya": "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=80",
  "Hilton Head": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "Yellowstone": "https://images.unsplash.com/photo-1533419675321-6e69e6fa2e1b?w=800&q=80",
  // Budget/Asia
  "Bangkok": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80",
  "Mexico City": "https://images.unsplash.com/photo-1518659526054-e25e58c0aa40?w=800&q=80",
  "Krakow": "https://images.unsplash.com/photo-1558271736-cd043ef2e855?w=800&q=80",
  "Bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  "Marrakech": "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&q=80",
  "Bogota": "https://images.unsplash.com/photo-1536875898976-6cf0547b1824?w=800&q=80",
  // Luxury
  "Maldives": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
  "Bora Bora": "https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=800&q=80",
  "Kyoto": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
  "Tokyo": "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80",
  "Serengeti": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
  "Safari": "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
  "Patagonia": "https://images.unsplash.com/photo-1531794460340-838462014bf4?w=800&q=80",
  // College campuses
  "Duke": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  "University": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  "Harvard": "https://images.unsplash.com/photo-1559135197-8a45ea74d367?w=800&q=80",
  "MIT": "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800&q=80",
  "Stanford": "https://images.unsplash.com/photo-1580982324076-d95cb3e02477?w=800&q=80",
  "Yale": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  "Princeton": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  "Columbia": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
  "Georgetown": "https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=800&q=80",
  "UCLA": "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&q=80",
  "Berkeley": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
  "USC": "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&q=80",
  "Emory": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  "Colgate": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  "Carnegie Mellon": "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
  "Colorado School of Mines": "https://images.unsplash.com/photo-1619856699906-09e1f4ef578c?w=800&q=80",
  // General
  "Europe": "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80",
  "World": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
};

function getDestinationPhoto(destination: string): string {
  const lower = destination.toLowerCase();
  for (const [key, url] of Object.entries(DESTINATION_PHOTOS)) {
    if (lower.includes(key.toLowerCase())) return url;
  }
  // Fallback — generic travel/adventure photo
  return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80";
}

/**
 * 3D-looking Mapbox globe hero banner.
 * Flies to the trip destination with pitch/bearing for a cinematic 3D effect.
 */
export default function MapHero3D({ destination, title, subtitle, height = 340, coverPhoto, showPhoto = false, children }: MapHero3DProps) {
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
      {/* 3D Map — full when no photo, hidden when photo is shown */}
      {!showPhoto && <div ref={mapContainer} className="absolute inset-0" />}

      {/* Destination photo — full-bleed on trip-specific pages */}
      {showPhoto && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${photoUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
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
