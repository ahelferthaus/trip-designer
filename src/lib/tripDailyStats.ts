import { supabase } from "./supabase";

export interface DailyStats {
  id: string;
  trip_id: string;
  user_id: string;
  date: string;
  step_count: number;
  distance_walked_m: number;
  distance_total_m: number;
  photos_taken: number;
}

/** Get today's date as YYYY-MM-DD */
function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

/** Upsert daily stats for current user */
export async function updateDailyStats(
  tripId: string,
  userId: string,
  updates: Partial<Pick<DailyStats, "step_count" | "distance_walked_m" | "distance_total_m" | "photos_taken">>
): Promise<void> {
  if (!supabase) return;
  const date = todayStr();

  await supabase
    .from("trip_daily_stats")
    .upsert(
      {
        trip_id: tripId,
        user_id: userId,
        date,
        ...updates,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "trip_id,user_id,date" }
    );
}

/** Increment a specific stat for today */
export async function incrementDailyStat(
  tripId: string,
  userId: string,
  field: "step_count" | "photos_taken",
  amount: number = 1
): Promise<void> {
  if (!supabase) return;
  const date = todayStr();

  // Read current value
  const { data } = await supabase
    .from("trip_daily_stats")
    .select("step_count, photos_taken")
    .eq("trip_id", tripId)
    .eq("user_id", userId)
    .eq("date", date)
    .single();

  const record = data as Record<string, number> | null;
  const current = record?.[field] ?? 0;

  await supabase
    .from("trip_daily_stats")
    .upsert(
      {
        trip_id: tripId,
        user_id: userId,
        date,
        [field]: current + amount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "trip_id,user_id,date" }
    );
}

/** Get all daily stats for a trip */
export async function getAllDailyStats(tripId: string): Promise<DailyStats[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("trip_daily_stats")
    .select("*")
    .eq("trip_id", tripId)
    .order("date");
  return (data ?? []) as DailyStats[];
}

/** Get stats for a specific user on a specific day */
export async function getDayStats(
  tripId: string,
  userId: string,
  date: string
): Promise<DailyStats | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("trip_daily_stats")
    .select("*")
    .eq("trip_id", tripId)
    .eq("user_id", userId)
    .eq("date", date)
    .single();
  return data as DailyStats | null;
}
