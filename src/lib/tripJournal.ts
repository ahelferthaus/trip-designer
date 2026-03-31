import { supabase } from "./supabase";
import { resizeImage, createThumbnail } from "./imageUtils";

export interface JournalEntry {
  id: string;
  trip_id: string;
  user_id: string;
  entry_type: "text" | "photo" | "photo_text";
  body: string | null;
  photo_url: string | null;
  thumbnail_url: string | null;
  lat: number | null;
  lng: number | null;
  recorded_at: string;
  created_at: string;
  author_name?: string;
}

/** Get current GPS position (one-shot) */
function getCurrentPosition(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  });
}

/** Create a new journal entry (photo, text, or both) */
export async function createJournalEntry(
  tripId: string,
  userId: string,
  opts: {
    body?: string;
    photo?: File;
    lat?: number;
    lng?: number;
  }
): Promise<JournalEntry | null> {
  if (!supabase) return null;

  let photo_url: string | null = null;
  let thumbnail_url: string | null = null;
  let lat = opts.lat ?? null;
  let lng = opts.lng ?? null;

  // Get GPS if not provided
  if (lat === null || lng === null) {
    const pos = await getCurrentPosition();
    if (pos) { lat = pos.lat; lng = pos.lng; }
  }

  // Upload photo if provided
  if (opts.photo) {
    const timestamp = Date.now();
    const mainPath = `journal/${tripId}/${userId}/${timestamp}.jpg`;
    const thumbPath = `journal/${tripId}/${userId}/${timestamp}_thumb.jpg`;

    // Resize main + thumbnail
    const [mainBlob, thumbBlob] = await Promise.all([
      resizeImage(opts.photo, 1200, 0.8),
      createThumbnail(opts.photo),
    ]);

    // Upload both
    const [mainUpload, thumbUpload] = await Promise.all([
      supabase.storage.from("trip-photos").upload(mainPath, mainBlob, { contentType: "image/jpeg", upsert: true }),
      supabase.storage.from("trip-photos").upload(thumbPath, thumbBlob, { contentType: "image/jpeg", upsert: true }),
    ]);

    if (!mainUpload.error) {
      photo_url = supabase.storage.from("trip-photos").getPublicUrl(mainPath).data.publicUrl;
    }
    if (!thumbUpload.error) {
      thumbnail_url = supabase.storage.from("trip-photos").getPublicUrl(thumbPath).data.publicUrl;
    }
  }

  const entry_type = opts.photo && opts.body ? "photo_text" : opts.photo ? "photo" : "text";

  const { data, error } = await supabase
    .from("trip_journal_entries")
    .insert({
      trip_id: tripId,
      user_id: userId,
      entry_type,
      body: opts.body || null,
      photo_url,
      thumbnail_url,
      lat,
      lng,
      recorded_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Journal entry save failed:", error);
    return null;
  }

  return data as JournalEntry;
}

/** Get all journal entries for a trip (chronological) */
export async function getJournalEntries(tripId: string): Promise<JournalEntry[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("trip_journal_entries")
    .select("*, user_profiles(display_name)")
    .eq("trip_id", tripId)
    .order("recorded_at", { ascending: true });

  return (data ?? []).map((row: Record<string, unknown>) => {
    const p = row.user_profiles as Record<string, string> | null;
    return {
      ...row,
      author_name: p?.display_name ?? "Traveler",
    } as JournalEntry;
  });
}

/** Delete a journal entry */
export async function deleteJournalEntry(entryId: string): Promise<void> {
  if (!supabase) return;
  // Get entry to delete storage files
  const { data } = await supabase
    .from("trip_journal_entries")
    .select("photo_url, thumbnail_url")
    .eq("id", entryId)
    .single();

  if (data?.photo_url) {
    const path = new URL(data.photo_url).pathname.split("/trip-photos/")[1];
    if (path) await supabase.storage.from("trip-photos").remove([path]);
  }
  if (data?.thumbnail_url) {
    const path = new URL(data.thumbnail_url).pathname.split("/trip-photos/")[1];
    if (path) await supabase.storage.from("trip-photos").remove([path]);
  }

  await supabase.from("trip_journal_entries").delete().eq("id", entryId);
}

/** Subscribe to new journal entries (real-time) */
export function subscribeToJournal(tripId: string, onUpdate: () => void): () => void {
  if (!supabase) return () => {};
  const channel = supabase
    .channel(`journal-${tripId}`)
    .on("postgres_changes", {
      event: "*",
      schema: "public",
      table: "trip_journal_entries",
      filter: `trip_id=eq.${tripId}`,
    }, onUpdate)
    .subscribe();
  return () => { supabase?.removeChannel(channel); };
}
