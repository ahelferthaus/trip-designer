import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useActiveTrip } from "../store/activeTripStore";
import LiveRouteMap from "../components/activetrip/LiveRouteMap";
import TripRecordingControls from "../components/activetrip/TripRecordingControls";
import { getTrackingPoints, subscribeToTrackingPoints } from "../lib/tripTracking";
import type { TrackingPoint } from "../lib/tripTracking";
import { getDestinationPhoto } from "../lib/destinationPhotos";
import TripTimeline from "../components/activetrip/TripTimeline";
import JournalEntryForm from "../components/activetrip/JournalEntryForm";

export default function ActiveTripPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  useAuth();
  const activeTrip = useActiveTrip();
  const [tab, setTab] = useState<"map" | "timeline" | "stats">("map");
  const [allPoints, setAllPoints] = useState<TrackingPoint[]>([]);
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [journalRefresh, setJournalRefresh] = useState(0);
  const [tripTitle, setTripTitle] = useState("");
  const [tripDest, setTripDest] = useState("");

  // Activate trip in store if not already
  useEffect(() => {
    if (tripId && activeTrip.activeTripId !== tripId) {
      activeTrip.startTrip(tripId);
    }
  }, [tripId]);

  // Load trip info
  useEffect(() => {
    if (!tripId) return;
    import("../lib/supabaseTrips").then(() => {
      import("../lib/supabase").then(({ supabase }) => {
        if (!supabase) return;
        supabase.from("trips").select("title, destination").eq("id", tripId).single().then(({ data }) => {
          if (data) {
            setTripTitle(data.title);
            setTripDest(data.destination);
          }
        });
      });
    });
  }, [tripId]);

  // Load existing tracking points
  useEffect(() => {
    if (!tripId) return;
    getTrackingPoints(tripId).then(setAllPoints);
  }, [tripId]);

  // Subscribe to new points from group members
  useEffect(() => {
    if (!tripId) return;
    const unsub = subscribeToTrackingPoints(tripId, () => {
      getTrackingPoints(tripId).then(setAllPoints);
    });
    return unsub;
  }, [tripId]);

  // Combine stored points with live buffer
  const displayPoints = [
    ...allPoints,
    ...activeTrip.recentPoints.filter(p =>
      !allPoints.some(ap => ap.recorded_at === p.recorded_at)
    ),
  ].sort((a, b) => a.recorded_at.localeCompare(b.recorded_at));

  // Photo available for future use
  const _photoUrl = tripDest ? getDestinationPhoto(tripDest, 400) : null;
  void _photoUrl;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Header with destination photo */}
      <div className="relative h-16 flex items-center px-4 safe-top" style={{
        backgroundColor: "rgba(11, 29, 51, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <button onClick={() => navigate(-1)} className="text-[17px] text-white active:opacity-70">‹ Back</button>
        <div className="flex-1 text-center">
          <div className="text-[15px] font-bold text-white truncate">{tripTitle || "Active Trip"}</div>
          {tripDest && <div className="text-[11px] text-white/60">{tripDest}</div>}
        </div>
        <div className="w-12" />
      </div>

      {/* Tab bar */}
      <div className="flex px-3 py-2 gap-1.5" style={{ backgroundColor: "var(--td-bg)" }}>
        {(["map", "timeline", "stats"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold active:opacity-70 text-center"
            style={{
              backgroundColor: tab === t ? "var(--td-accent)" : "var(--td-card)",
              color: tab === t ? "var(--td-accent-text)" : "var(--td-label)",
            }}
          >
            {t === "map" ? "🗺️ Map" : t === "timeline" ? "📸 Timeline" : "📊 Stats"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 relative">
        {/* Map tab */}
        {tab === "map" && (
          <div className="absolute inset-0">
            <LiveRouteMap
              points={displayPoints}
              currentLat={activeTrip.currentLat}
              currentLng={activeTrip.currentLng}
            />
          </div>
        )}

        {/* Timeline tab — photo journal */}
        {tab === "timeline" && (
          <div className="pb-32 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
            <TripTimeline tripId={tripId!} refreshTrigger={journalRefresh} />
          </div>
        )}

        {/* Stats tab */}
        {tab === "stats" && (
          <div className="px-4 py-6 pb-32">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl px-4 py-5 text-center" style={{ backgroundColor: "var(--td-card)" }}>
                <div className="text-3xl mb-1">📍</div>
                <div className="text-[24px] font-black" style={{ color: "var(--td-label)" }}>
                  {displayPoints.length}
                </div>
                <div className="text-[12px]" style={{ color: "var(--td-secondary)" }}>GPS Points</div>
              </div>
              <div className="rounded-2xl px-4 py-5 text-center" style={{ backgroundColor: "var(--td-card)" }}>
                <div className="text-3xl mb-1">🚶</div>
                <div className="text-[24px] font-black" style={{ color: "var(--td-label)" }}>
                  {activeTrip.todayDistanceM < 1000
                    ? `${Math.round(activeTrip.todayDistanceM)}m`
                    : `${(activeTrip.todayDistanceM / 1000).toFixed(1)}km`}
                </div>
                <div className="text-[12px]" style={{ color: "var(--td-secondary)" }}>Distance Today</div>
              </div>
              <div className="rounded-2xl px-4 py-5 text-center" style={{ backgroundColor: "var(--td-card)" }}>
                <div className="text-3xl mb-1">🎯</div>
                <div className="text-[24px] font-black" style={{ color: "var(--td-label)" }}>
                  {activeTrip.currentAccuracy ? `${Math.round(activeTrip.currentAccuracy)}m` : "—"}
                </div>
                <div className="text-[12px]" style={{ color: "var(--td-secondary)" }}>GPS Accuracy</div>
              </div>
              <div className="rounded-2xl px-4 py-5 text-center" style={{ backgroundColor: "var(--td-card)" }}>
                <div className="text-3xl mb-1">⏱️</div>
                <div className="text-[24px] font-black" style={{ color: "var(--td-label)" }}>
                  {activeTrip.isRecording ? "Live" : "Paused"}
                </div>
                <div className="text-[12px]" style={{ color: "var(--td-secondary)" }}>Status</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating add journal button */}
      {tab === "timeline" && (
        <button
          onClick={() => setShowJournalForm(true)}
          className="fixed bottom-36 right-5 z-30 w-14 h-14 rounded-full flex items-center justify-center shadow-xl active:opacity-70"
          style={{
            backgroundColor: "var(--td-accent)",
            color: "var(--td-accent-text)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <span className="text-[26px]">+</span>
        </button>
      )}

      {/* Journal entry form (bottom sheet) */}
      {showJournalForm && tripId && (
        <JournalEntryForm
          tripId={tripId}
          onCreated={() => {
            setShowJournalForm(false);
            setJournalRefresh(n => n + 1);
          }}
          onClose={() => setShowJournalForm(false)}
        />
      )}

      {/* Recording controls — fixed at bottom */}
      <div className="fixed bottom-20 left-4 right-4 z-30">
        <TripRecordingControls />
      </div>
    </div>
  );
}
