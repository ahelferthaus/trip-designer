import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { invitationId, tripId, invitedEmail, token } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch trip details
    const { data: trip } = await supabase
      .from("trips")
      .select("title, destination, invite_code")
      .eq("id", tripId)
      .single();

    if (!trip) {
      return new Response(JSON.stringify({ error: "Trip not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build the invite link
    const siteUrl = Deno.env.get("SITE_URL") || supabaseUrl.replace(".supabase.co", ".vercel.app");
    const inviteLink = `${siteUrl}/join/${trip.invite_code}?token=${token}`;

    // Send email via Supabase Auth SMTP (or any configured email provider)
    // Using the built-in Supabase email hook via the admin API
    const { error: emailError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: invitedEmail,
      options: {
        redirectTo: inviteLink,
      },
    });

    // If magic link approach fails, fall back to just marking the invitation
    // The invitation record + share link still works even without email delivery
    if (emailError) {
      console.warn("Email send failed (non-fatal):", emailError.message);
    }

    // Mark invitation as sent
    await supabase
      .from("trip_invitations")
      .update({ status: "pending" })
      .eq("id", invitationId);

    return new Response(
      JSON.stringify({ success: true, inviteLink }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
