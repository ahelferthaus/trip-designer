import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useActiveTrip } from "../store/activeTripStore";
import LiveRouteMap from "../components/activetrip/LiveRouteMap";
import type { UserRoute } from "../components/activetrip/LiveRouteMap";
import TripRecordingControls from "../components/activetrip/TripRecordingControls";
import { getTrackingPointsByUser, subscribeToTrackingPoints, getTripMemberNames } from "../lib/tripTracking";
import { getAllDailyStats, updateDailyStats } from "../lib/tripDailyStats";
import { startStepCounter, stopStepCounter, isStepCounterAvailable, getStepCount } from "../lib/stepCounter";
import type { DailyStats } from "../lib/tripDailyStats";
import DailyStatsCard from "../components/activetrip/DailyStatsCard";
import TripTimeline from "../components/activetrip/TripTimeline";
import JournalEntryForm from "../components/activetrip/JournalEntryForm";

export default function ActiveTripPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const activeTrip = useActiveTrip();
  const [tab, setTab] = useState<"map" | "timeline" | "stats">("map");
  const [userRoutes, setUserRoutes] = useState<UserRoute[]>([]);
  const [memberNames, setMemberNames] = useState<Map<string, string>>(new Map());
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [stepCounterActive, setStepCounterActive] = useState(false);
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

  // Load daily stats
  useEffect(() => {
    if (!tripId) return;
    getAllDailyStats(tripId).then(setDailyStats);
  }, [tripId]);

  // Start step counter when recording
  useEffect(() => {
    if (!activeTrip.isRecording || !tripId || !user) return;
    if (!isStepCounterAvailable()) return;

    startStepCounter((count) => {
      activeTrip.updateTodayStats(count, activeTrip.todayDistanceM);
    }).then(ok => setStepCounterActive(ok));

    // Save stats every 60 seconds
    const saveInterval = setInterval(() => {
      if (!tripId || !user) return;
      updateDailyStats(tripId, user.id, {
        step_count: getStepCount(),
        distance_total_m: activeTrip.todayDistanceM,
      });
    }, 60_000);

    return () => {
      stopStepCounter();
      setStepCounterActive(false);
      clearInterval(saveInterval);
      // Final save
      if (tripId && user) {
        updateDailyStats(tripId, user.id, {
          step_count: getStepCount(),
          distance_total_m: activeTrip.todayDistanceM,
        });
      }
    };
  }, [activeTrip.isRecording, tripId, user?.id]);

  // Load member names
  useEffect(() => {
    if (!tripId) return;
    getTripMemberNames(tripId).then(setMemberNames);
  }, [tripId]);

  // Load tracking points grouped by user
  const loadRoutes = () => {
    if (!tripId) return;
    getTrackingPointsByUser(tripId).then(pointsByUser => {
      const routes: UserRoute[] = [];
      for (const [userId, points] of pointsByUser) {
        const isMe = userId === user?.id;
        routes.push({
          userId,
          displayName: memberNames.get(userId) || (isMe ? "You" : "Traveler"),
          points,
          isCurrentUser: isMe,
          currentLat: isMe ? activeTrip.currentLat ?? undefined : points[points.length - 1]?.lat,
          currentLng: isMe ? activeTrip.currentLng ?? undefined : points[points.length - 1]?.lng,
        });
      }
      // Sort: current user first
      routes.sort((a, b) => (b.isCurrentUser ? 1 : 0) - (a.isCurrentUser ? 1 : 0));
      setUserRoutes(routes);
    });
  };

  useEffect(() => { loadRoutes(); }, [tripId, memberNames, activeTrip.currentLat]);

  // Subscribe to new points from group members
  useEffect(() => {
    if (!tripId) return;
    const unsub = subscribeToTrackingPoints(tripId, loadRoutes);
    return unsub;
  }, [tripId, memberNames]);

  // Merge live buffer into current user's route
  const displayRoutes = userRoutes.map(route => {
    if (route.isCurrentUser && activeTrip.recentPoints.length > 0) {
      const merged = [
        ...route.points,
        ...activeTrip.recentPoints.filter(p =>
          !route.points.some(rp => rp.recorded_at === p.recorded_at)
        ),
      ].sort((a, b) => a.recorded_at.localeCompare(b.recorded_at));
      return { ...route, points: merged, currentLat: activeTrip.currentLat ?? undefined, currentLng: activeTrip.currentLng ?? undefined };
    }
    return route;
  });

  // If current user has live points but isn't in the DB routes yet
  if (user && activeTrip.recentPoints.length > 0 && !displayRoutes.some(r => r.isCurrentUser)) {
    displayRoutes.unshift({
      userId: user.id,
      displayName: "You",
      points: activeTrip.recentPoints,
      isCurrentUser: true,
      currentLat: activeTrip.currentLat ?? undefined,
      currentLng: activeTrip.currentLng ?? undefined,
    });
  }

  const totalPoints = displayRoutes.reduce((sum, r) => sum + r.points.length, 0);

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
              routes={displayRoutes}
              followLat={activeTrip.currentLat}
              followLng={activeTrip.currentLng}
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
          <div className="px-4 py-4 pb-32 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
            {/* Live stats row */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="rounded-xl px-2 py-3 text-center" style={{ backgroundColor: "var(--td-card)" }}>
                <div className="text-[20px] font-black" style={{ color: "var(--td-label)" }}>{totalPoints}</div>
                <div className="text-[9px] font-medium" style={{ color: "var(--td-secondary)" }}>GPS Pts</div>
              </div>
              <div className="rounded-xl px-2 py-3 text-center" style={{ backgroundColor: "var(--td-card)" }}>
                <div className="text-[20px] font-black" style={{ color: "var(--td-label)" }}>
                  {activeTrip.todayDistanceM < 1000 ? `${Math.round(activeTrip.todayDistanceM)}m` : `${(activeTrip.todayDistanceM / 1000).toFixed(1)}km`}
                </div>
                <div className="text-[9px] font-medium" style={{ color: "var(--td-secondary)" }}>Distance</div>
              </div>
              <div className="rounded-xl px-2 py-3 text-center" style={{ backgroundColor: "var(--td-card)" }}>
                <div className="text-[20px] font-black" style={{ color: "var(--td-label)" }}>
                  {activeTrip.todaySteps.toLocaleString()}
                </div>
                <div className="text-[9px] font-medium" style={{ color: "var(--td-secondary)" }}>
                  Steps {stepCounterActive ? "🟢" : ""}
                </div>
              </div>
              <div className="rounded-xl px-2 py-3 text-center" style={{ backgroundColor: "var(--td-card)" }}>
                <div className="text-[20px] font-black" style={{ color: "var(--td-label)" }}>{displayRoutes.length}</div>
                <div className="text-[9px] font-medium" style={{ color: "var(--td-secondary)" }}>Trackers</div>
              </div>
            </div>

            {/* Daily stats cards */}
            {dailyStats.length > 0 && (
              <>
                <h3 className="text-[13px] font-bold uppercase tracking-wide mb-3" style={{ color: "var(--td-secondary)" }}>
                  Daily Breakdown
                </h3>
                <div className="flex flex-col gap-2.5">
                  {[...dailyStats].reverse().map(s => (
                    <DailyStatsCard
                      key={s.id}
                      stats={s}
                      isToday={s.date === new Date().toISOString().split("T")[0]}
                    />
                  ))}
                </div>
              </>
            )}

            {dailyStats.length === 0 && (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-[13px]" style={{ color: "var(--td-secondary)" }}>
                  Daily stats will appear here as you record your trip.
                </p>
              </div>
            )}
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
