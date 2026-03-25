import type { GeneratedItinerary } from "./generateItinerary";
import type { IntakeFormData } from "./types";

export interface SavedTrip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  created_at: string;
  created_by: string;
  form: IntakeFormData;
  itinerary: GeneratedItinerary;
  cloudTripId?: string;
  inviteCode?: string;
}

const STORAGE_KEY = "td-saved-trips";

export function loadSavedTrips(): SavedTrip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedTrip[]) : [];
  } catch {
    return [];
  }
}

export function saveTrip(form: IntakeFormData, itinerary: GeneratedItinerary, createdBy: string = "Me"): SavedTrip {
  const trips = loadSavedTrips();
  const existing = trips.findIndex(
    t =>
      t.destination === (form.destination?.name ?? "Unknown") &&
      t.start_date === form.start_date &&
      t.end_date === form.end_date
  );
  if (existing >= 0) {
    // Preserve cloud fields when updating
    const updated: SavedTrip = {
      ...trips[existing],
      title: itinerary.title,
      form,
      itinerary,
    };
    trips[existing] = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    return updated;
  }
  const trip: SavedTrip = {
    id: `trip-${Date.now()}`,
    title: itinerary.title,
    destination: form.destination?.name ?? "Unknown",
    start_date: form.start_date,
    end_date: form.end_date,
    created_at: new Date().toISOString(),
    created_by: createdBy,
    form,
    itinerary,
  };
  trips.unshift(trip);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  return trip;
}

export function updateTripCloudData(id: string, cloudTripId: string, inviteCode: string): void {
  const trips = loadSavedTrips();
  const idx = trips.findIndex(t => t.id === id);
  if (idx >= 0) {
    trips[idx] = { ...trips[idx], cloudTripId, inviteCode };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }
}

export function deleteTrip(id: string): void {
  const trips = loadSavedTrips().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

export function getTripById(id: string): SavedTrip | null {
  return loadSavedTrips().find(t => t.id === id) ?? null;
}
