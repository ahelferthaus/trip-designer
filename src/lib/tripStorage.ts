import type { GeneratedItinerary } from "./generateItinerary";
import type { IntakeFormData } from "./types";

export interface SavedTrip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  created_at: string;
  form: IntakeFormData;
  itinerary: GeneratedItinerary;
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

export function saveTrip(form: IntakeFormData, itinerary: GeneratedItinerary): SavedTrip {
  const trips = loadSavedTrips();
  const trip: SavedTrip = {
    id: `trip-${Date.now()}`,
    title: itinerary.title,
    destination: form.destination?.name ?? "Unknown",
    start_date: form.start_date,
    end_date: form.end_date,
    created_at: new Date().toISOString(),
    form,
    itinerary,
  };
  // Replace if same destination + dates already exists, otherwise prepend
  const existing = trips.findIndex(
    t => t.destination === trip.destination && t.start_date === trip.start_date && t.end_date === trip.end_date
  );
  if (existing >= 0) trips[existing] = trip;
  else trips.unshift(trip);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  return trip;
}

export function deleteTrip(id: string): void {
  const trips = loadSavedTrips().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

export function getTripById(id: string): SavedTrip | null {
  return loadSavedTrips().find(t => t.id === id) ?? null;
}
