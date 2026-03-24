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
  created_at: string;
}

interface CloudMember {
  id: string;
  trip_id: string;
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
  passcode: string
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
    })
    .select()
    .single();
  if (error) throw error;
  return data as CloudTrip;
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

export async function joinTrip(tripId: string, memberName: string): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("trip_members")
    .upsert({ trip_id: tripId, display_name: memberName }, { onConflict: "trip_id,display_name" });
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
