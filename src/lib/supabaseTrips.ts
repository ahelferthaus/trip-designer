import { supabase } from "./supabase";
import type { GeneratedItinerary } from "./generateItinerary";
import type { IntakeFormData } from "./types";

export function isSupabaseConfigured(): boolean {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "";
  return url.length > 0;
}

export interface CloudTrip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  invite_code: string;
  passcode: string;
  form_data: IntakeFormData;
  itinerary_data: GeneratedItinerary;
  created_by: string;
  user_id: string | null;
  created_at: string;
}

interface CloudMember {
  id: string;
  trip_id: string;
  user_id: string | null;
  display_name: string;
  joined_at: string;
}

interface CloudSelection {
  id: string;
  trip_id: string;
  member_name: string;
  slot_id: string;
  option_id: string;
  updated_at: string;
}

export async function saveCloudTrip(
  form: IntakeFormData,
  itinerary: GeneratedItinerary,
  createdBy: string,
  passcode: string,
  userId?: string
): Promise<CloudTrip> {
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase
    .from("trips")
    .insert({
      title: itinerary.title,
      destination: form.destination?.name ?? "Unknown",
      start_date: form.start_date,
      end_date: form.end_date,
      passcode,
      form_data: form,
      itinerary_data: itinerary,
      created_by: createdBy,
      user_id: userId ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as CloudTrip;
}

export async function getTripsForUser(userId: string): Promise<CloudTrip[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("trips")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as CloudTrip[];
}

export async function getTripByInviteCode(code: string): Promise<CloudTrip | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("trips")
    .select()
    .eq("invite_code", code)
    .single();
  if (error) return null;
  return data as CloudTrip;
}

export async function joinTrip(tripId: string, memberName: string, userId?: string): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("trip_members")
    .upsert(
      { trip_id: tripId, display_name: memberName, user_id: userId ?? null },
      { onConflict: "trip_id,display_name" }
    );
}

export async function getTripMembers(tripId: string): Promise<CloudMember[]> {
  if (!supabase) return [];
  const { data } = await supabase.from("trip_members").select().eq("trip_id", tripId);
  return (data ?? []) as CloudMember[];
}

export async function saveCloudSelection(
  tripId: string,
  memberName: string,
  slotId: string,
  optionId: string
): Promise<void> {
  if (!supabase) return;
  await supabase.from("slot_selections").upsert(
    {
      trip_id: tripId,
      member_name: memberName,
      slot_id: slotId,
      option_id: optionId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "trip_id,member_name,slot_id" }
  );
}

export async function getAllCloudSelections(
  tripId: string
): Promise<Record<string, Record<string, string>>> {
  if (!supabase) return {};
  const { data } = await supabase.from("slot_selections").select().eq("trip_id", tripId);
  const result: Record<string, Record<string, string>> = {};
  for (const row of (data ?? []) as CloudSelection[]) {
    if (!result[row.member_name]) result[row.member_name] = {};
    result[row.member_name][row.slot_id] = row.option_id;
  }
  return result;
}

export function subscribeToSelections(
  tripId: string,
  callback: (selections: Record<string, Record<string, string>>) => void
): () => void {
  if (!supabase) return () => {};
  const channel = supabase
    .channel(`selections-${tripId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "slot_selections", filter: `trip_id=eq.${tripId}` },
      () => {
        getAllCloudSelections(tripId).then(callback);
      }
    )
    .subscribe();
  return () => {
    supabase?.removeChannel(channel);
  };
}

// --- Custom write-in options (dedicated table: trip_custom_options) ---

export async function saveCustomOption(
  tripId: string,
  slotId: string,
  option: { id: string; title: string; description: string; category: string; createdBy: string }
): Promise<void> {
  if (!supabase) return;
  await supabase.from("trip_custom_options").upsert(
    {
      id: option.id,
      trip_id: tripId,
      slot_id: slotId,
      title: option.title,
      description: option.description,
      category: option.category,
      created_by_name: option.createdBy,
    },
    { onConflict: "trip_id,id" }
  );
}

export async function getCustomOptions(
  tripId: string
): Promise<Record<string, Array<{ id: string; title: string; description: string; category: string; createdBy: string }>>> {
  if (!supabase) return {};
  const { data } = await supabase
    .from("trip_custom_options")
    .select()
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });
  const result: Record<string, Array<{ id: string; title: string; description: string; category: string; createdBy: string }>> = {};
  for (const row of data ?? []) {
    const slotId = row.slot_id as string;
    if (!result[slotId]) result[slotId] = [];
    result[slotId].push({
      id: row.id as string,
      title: row.title as string,
      description: row.description as string,
      category: row.category as string,
      createdBy: row.created_by_name as string,
    });
  }
  return result;
}

// --- Memorable moments (dedicated table: trip_moments) ---

export async function saveMemorableMoment(
  tripId: string,
  memberName: string,
  moment: string
): Promise<void> {
  if (!supabase) return;
  await supabase.from("trip_moments").upsert(
    {
      trip_id: tripId,
      member_name: memberName,
      moment,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "trip_id,member_name" }
  );
}

export async function getMemorableMoments(
  tripId: string
): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data } = await supabase
    .from("trip_moments")
    .select()
    .eq("trip_id", tripId);
  const result: Record<string, string> = {};
  for (const row of data ?? []) {
    result[row.member_name as string] = row.moment as string;
  }
  return result;
}

// --- Booked slots (dedicated table: trip_booked_slots) ---

export async function saveBookedSlot(
  tripId: string,
  slotId: string,
  optionId: string,
  bookedBy: string = ""
): Promise<void> {
  if (!supabase) return;
  await supabase.from("trip_booked_slots").upsert(
    {
      trip_id: tripId,
      slot_id: slotId,
      option_id: optionId,
      booked_by: bookedBy,
      booked_at: new Date().toISOString(),
    },
    { onConflict: "trip_id,slot_id" }
  );
}

export async function getBookedSlots(
  tripId: string
): Promise<Record<string, string>> {
  if (!supabase) return {};
  const { data } = await supabase
    .from("trip_booked_slots")
    .select()
    .eq("trip_id", tripId);
  const result: Record<string, string> = {};
  for (const row of data ?? []) {
    result[row.slot_id as string] = row.option_id as string;
  }
  return result;
}

// Subscribe to trip extras changes (custom options, moments, booked slots)
export function subscribeToTripExtras(
  tripId: string,
  callback: () => void
): () => void {
  if (!supabase) return () => {};
  const channel = supabase
    .channel(`trip-extras-${tripId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "trip_custom_options", filter: `trip_id=eq.${tripId}` },
      () => callback()
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "trip_moments", filter: `trip_id=eq.${tripId}` },
      () => callback()
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "trip_booked_slots", filter: `trip_id=eq.${tripId}` },
      () => callback()
    )
    .subscribe();
  return () => {
    supabase?.removeChannel(channel);
  };
}
