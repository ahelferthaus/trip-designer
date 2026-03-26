import type { GeneratedItinerary } from "./generateItinerary";
import type { IntakeFormData, ActivityOption } from "./types";
import { isSupabaseConfigured, saveCloudTrip, getTripsForUser } from "./supabaseTrips";
import type { CloudTrip } from "./supabaseTrips";

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
  // New fields for custom options and booking
  customOptions?: { [slotId: string]: ActivityOption[] };
  bookedOptions?: string[];
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

/**
 * Migrate orphaned local trips (without cloudTripId) to the cloud
 * and tag them with the user's id. Called on first login.
 */
export async function migrateLocalTripsToCloud(userId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const local = loadSavedTrips();
  const orphaned = local.filter(t => !t.cloudTripId);
  for (const trip of orphaned) {
    try {
      const passcode = localStorage.getItem("td-passcode") ?? "1234";
      const cloud = await saveCloudTrip(trip.form, trip.itinerary, trip.created_by, passcode, userId);
      updateTripCloudData(trip.id, cloud.id, cloud.invite_code);
    } catch {
      // Non-fatal — trip stays local-only
    }
  }
}

/**
 * Load trips from cloud + localStorage, merging and deduplicating.
 * Cloud trips that aren't in localStorage are added as SavedTrip entries.
 */
export async function loadMergedTrips(userId: string): Promise<SavedTrip[]> {
  const local = loadSavedTrips();
  if (!isSupabaseConfigured()) return local;

  const cloudTrips = await getTripsForUser(userId);
  const localCloudIds = new Set(local.map(t => t.cloudTripId).filter(Boolean));
  const newFromCloud: SavedTrip[] = [];

  for (const ct of cloudTrips) {
    if (!localCloudIds.has(ct.id)) {
      newFromCloud.push(cloudTripToSaved(ct));
    }
  }

  if (newFromCloud.length > 0) {
    const merged = [...newFromCloud, ...local];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }

  return local;
}

function cloudTripToSaved(ct: CloudTrip): SavedTrip {
  return {
    id: `cloud-${ct.id}`,
    title: ct.title,
    destination: ct.destination,
    start_date: ct.start_date,
    end_date: ct.end_date,
    created_at: ct.created_at,
    created_by: ct.created_by,
    form: ct.form_data,
    itinerary: ct.itinerary_data,
    cloudTripId: ct.id,
    inviteCode: ct.invite_code,
  };
}
