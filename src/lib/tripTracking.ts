import { supabase } from "./supabase";

// --- Types ---

export interface TrackingPoint {
  lat: number;
  lng: number;
  altitude_m?: number;
  accuracy_m?: number;
  speed_mps?: number;
  heading?: number;
  recorded_at: string;
}

export interface TrackingSession {
  id: string;
  trip_id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  total_distance_m: number;
}

// --- Haversine distance ---

function toRad(deg: number) { return deg * Math.PI / 180; }

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// --- GPS Tracking Service ---

const MIN_DISTANCE_M = 15;      // minimum meters between accepted points
const MAX_TIME_MS = 60_000;     // always accept a point after 60s
const MAX_ACCURACY_M = 100;     // discard points with worse accuracy
const FLUSH_INTERVAL_MS = 30_000; // flush buffer every 30s
const FLUSH_SIZE = 20;           // or when buffer reaches 20 points

let watchId: number | null = null;
let flushTimer: ReturnType<typeof setInterval> | null = null;
let wakeLock: WakeLockSentinel | null = null;

let buffer: Array<TrackingPoint & { session_id: string; trip_id: string; user_id: string }> = [];
let lastAcceptedPoint: TrackingPoint | null = null;
let lastAcceptedTime = 0;
let totalDistanceM = 0;

// Callbacks for UI updates
let onPositionUpdate: ((lat: number, lng: number, accuracy: number) => void) | null = null;
let onPointAccepted: ((point: TrackingPoint) => void) | null = null;

export function setTrackingCallbacks(opts: {
  onPosition?: (lat: number, lng: number, accuracy: number) => void;
  onPoint?: (point: TrackingPoint) => void;
}) {
  onPositionUpdate = opts.onPosition ?? null;
  onPointAccepted = opts.onPoint ?? null;
}

async function flushBuffer() {
  if (!supabase || buffer.length === 0) return;
  const batch = [...buffer];
  buffer = [];
  try {
    await supabase.from("trip_tracking_points").insert(batch);
  } catch {
    // Re-queue on failure
    buffer = [...batch, ...buffer];
  }
}

function handlePosition(
  pos: GeolocationPosition,
  sessionId: string,
  tripId: string,
  userId: string,
) {
  const { latitude: lat, longitude: lng, altitude, accuracy, speed, heading } = pos.coords;
  const now = Date.now();

  // Notify UI of raw position
  onPositionUpdate?.(lat, lng, accuracy ?? 999);

  // Accuracy filter
  if (accuracy && accuracy > MAX_ACCURACY_M) return;

  // Distance filter
  if (lastAcceptedPoint) {
    const dist = haversineDistance(lastAcceptedPoint.lat, lastAcceptedPoint.lng, lat, lng);
    const timeSince = now - lastAcceptedTime;
    if (dist < MIN_DISTANCE_M && timeSince < MAX_TIME_MS) return;
    totalDistanceM += dist;
  }

  const point: TrackingPoint = {
    lat,
    lng,
    altitude_m: altitude ?? undefined,
    accuracy_m: accuracy ?? undefined,
    speed_mps: speed ?? undefined,
    heading: heading ?? undefined,
    recorded_at: new Date().toISOString(),
  };

  lastAcceptedPoint = point;
  lastAcceptedTime = now;

  // Notify UI
  onPointAccepted?.(point);

  // Add to buffer
  buffer.push({ ...point, session_id: sessionId, trip_id: tripId, user_id: userId });

  // Flush if buffer is large enough
  if (buffer.length >= FLUSH_SIZE) flushBuffer();
}

// --- Public API ---

export async function startTracking(tripId: string, userId: string): Promise<string | null> {
  if (!supabase) return null;
  if (watchId !== null) return null; // already tracking

  // Create session
  const { data, error } = await supabase
    .from("trip_tracking_sessions")
    .insert({ trip_id: tripId, user_id: userId })
    .select("id")
    .single();

  if (error || !data) return null;
  const sessionId = data.id;

  // Reset state
  buffer = [];
  lastAcceptedPoint = null;
  lastAcceptedTime = 0;
  totalDistanceM = 0;

  // Start GPS
  watchId = navigator.geolocation.watchPosition(
    (pos) => handlePosition(pos, sessionId, tripId, userId),
    (err) => console.warn("GPS error:", err.message),
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 30000,
    },
  );

  // Start flush timer
  flushTimer = setInterval(flushBuffer, FLUSH_INTERVAL_MS);

  // Request screen wake lock
  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
    }
  } catch {
    // Wake lock not supported or denied
  }

  return sessionId;
}

export async function stopTracking(sessionId: string): Promise<number> {
  // Stop GPS
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }

  // Stop flush timer
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }

  // Release wake lock
  if (wakeLock) {
    wakeLock.release();
    wakeLock = null;
  }

  // Final flush
  await flushBuffer();

  // Update session with end time and total distance
  if (supabase) {
    await supabase
      .from("trip_tracking_sessions")
      .update({ ended_at: new Date().toISOString(), total_distance_m: totalDistanceM })
      .eq("id", sessionId);
  }

  const distance = totalDistanceM;
  totalDistanceM = 0;
  return distance;
}

export function isTracking(): boolean {
  return watchId !== null;
}

export function getTotalDistance(): number {
  return totalDistanceM;
}

// --- Data Queries ---

export async function getTrackingPoints(
  tripId: string,
  userId?: string,
): Promise<TrackingPoint[]> {
  if (!supabase) return [];
  let q = supabase
    .from("trip_tracking_points")
    .select("lat, lng, altitude_m, accuracy_m, speed_mps, heading, recorded_at")
    .eq("trip_id", tripId)
    .order("recorded_at");
  if (userId) q = q.eq("user_id", userId);
  const { data } = await q;
  return (data ?? []) as TrackingPoint[];
}

export async function getTrackingSessions(tripId: string): Promise<TrackingSession[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("trip_tracking_sessions")
    .select("*")
    .eq("trip_id", tripId)
    .order("started_at");
  return (data ?? []) as TrackingSession[];
}

// --- Realtime subscription for group tracking ---

export function subscribeToTrackingPoints(
  tripId: string,
  onUpdate: () => void,
): () => void {
  if (!supabase) return () => {};
  const channel = supabase
    .channel(`tracking-${tripId}`)
    .on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "trip_tracking_points",
      filter: `trip_id=eq.${tripId}`,
    }, onUpdate)
    .subscribe();
  return () => { supabase?.removeChannel(channel); };
}
