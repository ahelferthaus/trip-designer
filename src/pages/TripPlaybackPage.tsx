import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getTrackingPoints } from "../lib/tripTracking";
import { getJournalEntries } from "../lib/tripJournal";
import type { TrackingPoint } from "../lib/tripTracking";
import type { JournalEntry } from "../lib/tripJournal";
import { supabase } from "../lib/supabase";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

interface TripInfo { title: string; destination: string }

export default function TripPlaybackPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const animRef = useRef<number | null>(null);

  const [points, setPoints] = useState<TrackingPoint[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [tripInfo, setTripInfo] = useState<TripInfo | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-1
  const [speed, setSpeed] = useState(5); // multiplier
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activePhoto, setActivePhoto] = useState<JournalEntry | null>(null);

  // Load data
  useEffect(() => {
    if (!tripId) return;
    getTrackingPoints(tripId).then(setPoints);
    getJournalEntries(tripId).then(setJournal);
    if (supabase) {
      supabase.from("trips").select("title, destination").eq("id", tripId).single().then(({ data }) => {
        if (data) setTripInfo(data as TripInfo);
      });
    }
  }, [tripId]);

  // Init map
  useEffect(() => {
    if (!MAPBOX_TOKEN || !mapContainer.current || map.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const m = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [0, 20],
      zoom: 2,
      pitch: 60,
      bearing: 0,
      attributionControl: false,
    });

    m.on("style.load", () => {
      m.setFog({
        color: "rgb(20, 30, 60)",
        "high-color": "rgb(40, 60, 120)",
        "horizon-blend": 0.06,
        "space-color": "rgb(11, 29, 51)",
        "star-intensity": 0.5,
      });
    });

    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  // Draw full route when points load
  useEffect(() => {
    const m = map.current;
    if (!m || points.length < 2) return;

    const addRoute = () => {
      if (m.getSource("playback-route")) return;
      m.addSource("playback-route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: points.map(p => [p.lng, p.lat]) },
        },
      });
      m.addLayer({
        id: "playback-route-bg",
        type: "line",
        source: "playback-route",
        paint: { "line-color": "#FFFFFF", "line-width": 5, "line-opacity": 0.15, "line-blur": 4 },
      });
      m.addLayer({
        id: "playback-route-line",
        type: "line",
        source: "playback-route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#007AFF", "line-width": 3, "line-opacity": 0.5, "line-dasharray": [2, 2] },
      });
      // Animated progress line (solid, on top)
      m.addSource("playback-progress", {
        type: "geojson",
        data: { type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [] } },
      });
      m.addLayer({
        id: "playback-progress-line",
        type: "line",
        source: "playback-progress",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#007AFF", "line-width": 4, "line-opacity": 0.9 },
      });

      // Fit bounds
      const bounds = new mapboxgl.LngLatBounds();
      points.forEach(p => bounds.extend([p.lng, p.lat]));
      m.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 1500 });
    };

    if (m.isStyleLoaded()) addRoute();
    else m.on("load", addRoute);
  }, [points]);

  // Playback animation
  useEffect(() => {
    if (!playing || points.length < 2) return;

    let idx = currentIdx;
    const totalPoints = points.length;
    const msPerPoint = 100 / speed; // faster speed = less time per point

    const step = () => {
      if (idx >= totalPoints) {
        setPlaying(false);
        setProgress(1);
        return;
      }

      const point = points[idx];
      setCurrentIdx(idx);
      setProgress(idx / totalPoints);

      // Update progress line
      const m = map.current;
      if (m && m.getSource("playback-progress")) {
        (m.getSource("playback-progress") as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: points.slice(0, idx + 1).map(p => [p.lng, p.lat]) },
        });
      }

      // Move marker
      if (m) {
        if (!markerRef.current) {
          const el = document.createElement("div");
          el.style.cssText = `
            width: 20px; height: 20px; border-radius: 50%;
            background: #007AFF; border: 3px solid white;
            box-shadow: 0 0 16px rgba(0,122,255,0.7);
          `;
          markerRef.current = new mapboxgl.Marker({ element: el })
            .setLngLat([point.lng, point.lat])
            .addTo(m);
        } else {
          markerRef.current.setLngLat([point.lng, point.lat]);
        }

        // Camera follows with slight lag
        m.easeTo({
          center: [point.lng, point.lat],
          zoom: 14,
          pitch: 60,
          bearing: m.getBearing() + 0.3, // gentle rotation
          duration: msPerPoint,
        });
      }

      // Check for journal photos near this point in time
      const pointTime = new Date(point.recorded_at).getTime();
      const nearbyEntry = journal.find(j => {
        const jTime = new Date(j.recorded_at).getTime();
        return Math.abs(jTime - pointTime) < 30000 && j.photo_url; // within 30s
      });
      if (nearbyEntry && nearbyEntry.id !== activePhoto?.id) {
        setActivePhoto(nearbyEntry);
        // Auto-dismiss after 3 seconds
        setTimeout(() => setActivePhoto(prev => prev?.id === nearbyEntry.id ? null : prev), 3000);
      }

      idx++;
      animRef.current = window.setTimeout(step, msPerPoint);
    };

    step();
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  }, [playing, speed]);

  const handlePlayPause = () => {
    if (playing) {
      setPlaying(false);
      if (animRef.current) clearTimeout(animRef.current);
    } else {
      if (progress >= 1) { setCurrentIdx(0); setProgress(0); }
      setPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const idx = Math.floor(val * points.length);
    setProgress(val);
    setCurrentIdx(idx);
    setPlaying(false);
    if (animRef.current) clearTimeout(animRef.current);

    // Jump marker + camera
    if (points[idx] && map.current) {
      const p = points[idx];
      markerRef.current?.setLngLat([p.lng, p.lat]);
      map.current.easeTo({ center: [p.lng, p.lat], duration: 500 });

      // Update progress line
      if (map.current.getSource("playback-progress")) {
        (map.current.getSource("playback-progress") as mapboxgl.GeoJSONSource).setData({
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: points.slice(0, idx + 1).map(pp => [pp.lng, pp.lat]) },
        });
      }
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--td-bg)" }}>
        <p style={{ color: "var(--td-secondary)" }}>Trip playback requires Mapbox</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0B1D33" }}>
      {/* Full-screen map */}
      <div className="flex-1 relative">
        <div ref={mapContainer} className="absolute inset-0" />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 safe-top z-10 w-9 h-9 rounded-full flex items-center justify-center active:opacity-70"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
        >
          <span className="text-white text-[17px] font-semibold">‹</span>
        </button>

        {/* Trip title */}
        <div className="absolute top-4 right-4 safe-top z-10 px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
          <span className="text-white text-[13px] font-bold">{tripInfo?.title || "Trip Playback"}</span>
        </div>

        {/* Photo popup */}
        {activePhoto && (
          <div className="absolute top-20 left-4 right-4 z-20 rounded-2xl overflow-hidden shadow-2xl animate-fade-scale-in"
            style={{ backgroundColor: "var(--td-card)" }}>
            {activePhoto.photo_url && (
              <img src={activePhoto.thumbnail_url || activePhoto.photo_url} alt="" className="w-full h-40 object-cover" />
            )}
            {activePhoto.body && (
              <p className="px-3 py-2 text-[13px]" style={{ color: "var(--td-label)" }}>{activePhoto.body}</p>
            )}
          </div>
        )}

        {/* No data message */}
        {points.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center px-6">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="text-[16px] font-bold text-white mb-1">No tracking data yet</p>
              <p className="text-[13px] text-white/60">Start recording on your trip to see the playback here.</p>
            </div>
          </div>
        )}
      </div>

      {/* Playback controls */}
      {points.length > 0 && (
        <div
          className="px-4 py-4 safe-bottom"
          style={{
            backgroundColor: "rgba(11, 29, 51, 0.95)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Progress bar */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 mb-3 appearance-none rounded-full"
            style={{ background: `linear-gradient(to right, #007AFF ${progress * 100}%, rgba(255,255,255,0.2) ${progress * 100}%)` }}
          />

          <div className="flex items-center justify-between">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 rounded-full flex items-center justify-center active:opacity-70"
              style={{ backgroundColor: "#007AFF" }}
            >
              {playing ? (
                <div className="flex gap-1">
                  <div className="w-1.5 h-5 bg-white rounded-sm" />
                  <div className="w-1.5 h-5 bg-white rounded-sm" />
                </div>
              ) : (
                <div className="w-0 h-0 ml-1 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white" />
              )}
            </button>

            {/* Speed controls */}
            <div className="flex gap-1.5">
              {[1, 2, 5, 10, 20].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold active:opacity-70"
                  style={{
                    backgroundColor: speed === s ? "#007AFF" : "rgba(255,255,255,0.1)",
                    color: speed === s ? "white" : "rgba(255,255,255,0.6)",
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Point counter */}
            <div className="text-[12px] text-white/50">
              {Math.round(progress * points.length)} / {points.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
