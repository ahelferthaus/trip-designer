import { supabase } from "./supabase";
import type { TravelPartner, PartnerGroup } from "./types";

// --- Travel Partners CRUD ---

export async function getPartners(userId: string): Promise<TravelPartner[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("travel_partners")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  return (data ?? []) as TravelPartner[];
}

export async function addPartner(
  userId: string,
  partner: { name: string; type: "adult" | "child"; age?: number }
): Promise<TravelPartner | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("travel_partners")
    .insert({ user_id: userId, ...partner })
    .select()
    .single();
  if (error) return null;
  return data as TravelPartner;
}

export async function updatePartner(
  id: string,
  updates: Partial<Pick<TravelPartner, "name" | "type" | "age">>
): Promise<void> {
  if (!supabase) return;
  await supabase.from("travel_partners").update(updates).eq("id", id);
}

export async function deletePartner(id: string): Promise<void> {
  if (!supabase) return;
  await supabase.from("travel_partners").delete().eq("id", id);
}

// --- Partner Groups CRUD ---

export async function getGroups(userId: string): Promise<PartnerGroup[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("partner_groups")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  return (data ?? []) as PartnerGroup[];
}

export async function addGroup(
  userId: string,
  name: string,
  partnerIds: string[]
): Promise<PartnerGroup | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("partner_groups")
    .insert({ user_id: userId, name, partner_ids: partnerIds })
    .select()
    .single();
  if (error) return null;
  return data as PartnerGroup;
}

export async function updateGroup(
  id: string,
  updates: Partial<Pick<PartnerGroup, "name" | "partner_ids">>
): Promise<void> {
  if (!supabase) return;
  await supabase.from("partner_groups").update(updates).eq("id", id);
}

export async function deleteGroup(id: string): Promise<void> {
  if (!supabase) return;
  await supabase.from("partner_groups").delete().eq("id", id);
}
