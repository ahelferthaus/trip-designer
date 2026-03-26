import { supabase } from "./supabase";
import type { UserProfile } from "./types";

export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("user_profiles")
    .select()
    .eq("id", userId)
    .single();
  if (error) return null;
  return data as UserProfile;
}

export async function upsertProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, "id">>
): Promise<UserProfile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      { id: userId, ...updates, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    )
    .select()
    .single();
  if (error) return null;
  return data as UserProfile;
}
