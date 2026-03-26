import { supabase } from "./supabase";
import type { TripInvitation } from "./types";

export async function sendTripInvite(
  tripId: string,
  invitedBy: string,
  invitedEmail: string
): Promise<TripInvitation | null> {
  if (!supabase) return null;

  // Insert the invitation row
  const { data, error } = await supabase
    .from("trip_invitations")
    .insert({ trip_id: tripId, invited_by: invitedBy, invited_email: invitedEmail })
    .select()
    .single();
  if (error) return null;
  const invitation = data as TripInvitation;

  // Try to call the Edge Function to send the email
  try {
    await supabase.functions.invoke("send-trip-invite", {
      body: {
        invitationId: invitation.id,
        tripId,
        invitedEmail,
        token: invitation.token,
      },
    });
  } catch {
    // Edge Function may not be deployed yet — invitation is still saved
  }

  return invitation;
}

export async function getInvitationsForTrip(tripId: string): Promise<TripInvitation[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("trip_invitations")
    .select()
    .eq("trip_id", tripId)
    .order("created_at", { ascending: false });
  return (data ?? []) as TripInvitation[];
}

export async function getInvitationByToken(token: string): Promise<TripInvitation | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("trip_invitations")
    .select()
    .eq("token", token)
    .single();
  if (error) return null;
  return data as TripInvitation;
}

export async function acceptInvitation(invitationId: string): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("trip_invitations")
    .update({ status: "accepted" })
    .eq("id", invitationId);
}
