import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TrackingPoint } from "../lib/tripTracking";

interface ActiveTripState {
  // Current active trip
  activeTripId: string | null;
  activeSessionId: string | null;
  isRecording: boolean;
  recordingStartedAt: string | null;

  // Current position
  currentLat: number | null;
  currentLng: number | null;
  currentAccuracy: number | null;

  // Today's stats
  todaySteps: number;
  todayDistanceM: number;

  // Route buffer (recent points for live map display, last ~200)
  recentPoints: TrackingPoint[];

  // Actions
  startTrip: (tripId: string) => void;
  endTrip: () => void;
  setRecording: (recording: boolean, sessionId?: string | null) => void;
  updatePosition: (lat: number, lng: number, accuracy: number) => void;
  addRoutePoint: (point: TrackingPoint) => void;
  updateTodayStats: (steps: number, distanceM: number) => void;
  clearRoute: () => void;
}

export const useActiveTrip = create<ActiveTripState>()(
  persist(
    (set) => ({
      activeTripId: null,
      activeSessionId: null,
      isRecording: false,
      recordingStartedAt: null,
      currentLat: null,
      currentLng: null,
      currentAccuracy: null,
      todaySteps: 0,
      todayDistanceM: 0,
      recentPoints: [],

      startTrip: (tripId) => set({
        activeTripId: tripId,
        recentPoints: [],
        todaySteps: 0,
        todayDistanceM: 0,
      }),

      endTrip: () => set({
        activeTripId: null,
        activeSessionId: null,
        isRecording: false,
        recordingStartedAt: null,
        currentLat: null,
        currentLng: null,
        currentAccuracy: null,
        recentPoints: [],
      }),

      setRecording: (recording, sessionId) => set({
        isRecording: recording,
        activeSessionId: sessionId ?? null,
        recordingStartedAt: recording ? new Date().toISOString() : null,
      }),

      updatePosition: (lat, lng, accuracy) => set({
        currentLat: lat,
        currentLng: lng,
        currentAccuracy: accuracy,
      }),

      addRoutePoint: (point) => set((state) => ({
        recentPoints: [...state.recentPoints.slice(-199), point],
      })),

      updateTodayStats: (steps, distanceM) => set({
        todaySteps: steps,
        todayDistanceM: distanceM,
      }),

      clearRoute: () => set({ recentPoints: [] }),
    }),
    {
      name: "vybr-active-trip",
    }
  )
);
