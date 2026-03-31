import { useState, useEffect } from "react";
import { useActiveTrip } from "../../store/activeTripStore";
import { startTracking, stopTracking, setTrackingCallbacks, getTotalDistance } from "../../lib/tripTracking";
import { useAuth } from "../../store/authStore";

function formatDuration(startIso: string): string {
  const ms = Date.now() - new Date(startIso).getTime();
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export default function TripRecordingControls() {
  const { user } = useAuth();
  const {
    activeTripId, activeSessionId, isRecording, recordingStartedAt,
    todayDistanceM, setRecording, updatePosition, addRoutePoint, updateTodayStats,
  } = useActiveTrip();

  const [elapsed, setElapsed] = useState("");

  // Update elapsed time every second
  useEffect(() => {
    if (!isRecording || !recordingStartedAt) return;
    const timer = setInterval(() => {
      setElapsed(formatDuration(recordingStartedAt));
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording, recordingStartedAt]);

  // Set up tracking callbacks
  useEffect(() => {
    setTrackingCallbacks({
      onPosition: (lat, lng, acc) => updatePosition(lat, lng, acc),
      onPoint: (point) => {
        addRoutePoint(point);
        updateTodayStats(0, getTotalDistance());
      },
    });
  }, []);

  const handleStart = async () => {
    if (!activeTripId || !user) return;
    const sessionId = await startTracking(activeTripId, user.id);
    if (sessionId) {
      setRecording(true, sessionId);
    }
  };

  const handleStop = async () => {
    if (!activeSessionId) return;
    const distance = await stopTracking(activeSessionId);
    setRecording(false);
    updateTodayStats(0, distance);
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg"
      style={{
        backgroundColor: "rgba(11, 29, 51, 0.9)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* Record button */}
      <button
        onClick={isRecording ? handleStop : handleStart}
        className="w-12 h-12 rounded-full flex items-center justify-center active:opacity-70 flex-shrink-0"
        style={{
          backgroundColor: isRecording ? "#FF3B30" : "#007AFF",
          boxShadow: isRecording ? "0 0 16px rgba(255,59,48,0.5)" : "0 0 16px rgba(0,122,255,0.4)",
        }}
      >
        {isRecording ? (
          <div className="w-5 h-5 rounded-sm bg-white" />
        ) : (
          <div className="w-0 h-0 ml-1 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white" />
        )}
      </button>

      {/* Stats */}
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-bold" style={{ color: "white" }}>
          {isRecording ? (
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Recording — {elapsed}
            </span>
          ) : (
            "Tap to start recording"
          )}
        </div>
        <div className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
          {formatDistance(todayDistanceM)} traveled today
        </div>
      </div>

      {/* GPS indicator */}
      <div className="flex-shrink-0">
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: isRecording ? "#34C759" : "rgba(255,255,255,0.3)",
            boxShadow: isRecording ? "0 0 8px rgba(52,199,89,0.6)" : "none",
          }}
        />
      </div>
    </div>
  );
}
