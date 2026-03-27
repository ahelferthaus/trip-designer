import { supabase } from "./supabase";

// --- Data Model ---

export interface Postcard {
  id: string;
  trip_id: string | null;
  user_id: string;
  photo_url: string;
  message: string;
  template: "minimal" | "vintage" | "family";
  recipient_name: string;
  recipient_email: string | null;
  recipient_phone: string | null;
  recipient_address: {
    street1: string; street2?: string; city: string;
    state: string; postalCode: string; country: string;
  } | null;
  delivery_type: "email" | "sms" | "print";
  status: "draft" | "sent" | "delivered" | "failed";
  provider_id: string | null;
  created_at: string;
  sent_at: string | null;
}

// --- CRUD ---

export async function savePostcard(postcard: Omit<Postcard, "id" | "created_at" | "sent_at" | "provider_id" | "status">): Promise<Postcard | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("postcards")
    .insert({ ...postcard, status: "draft" })
    .select()
    .single();
  if (error) { console.error("Save postcard failed:", error); return null; }
  return data as Postcard;
}

export async function getUserPostcards(userId: string): Promise<Postcard[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("postcards")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as Postcard[];
}

// --- Send Providers ---

export async function sendPostcard(postcard: Postcard): Promise<{ success: boolean; error?: string }> {
  switch (postcard.delivery_type) {
    case "email":
      return sendEmailPostcard(postcard);
    case "sms":
      return sendSMSPostcard(postcard);
    case "print":
      return sendPrintPostcard(postcard);
    default:
      return { success: false, error: "Unknown delivery type" };
  }
}

// --- Email Provider (v1: mailto link, v2: SendGrid/Resend Edge Function) ---

async function sendEmailPostcard(postcard: Postcard): Promise<{ success: boolean; error?: string }> {
  if (!postcard.recipient_email) return { success: false, error: "No email address" };

  // Try Supabase Edge Function first (if deployed)
  if (supabase) {
    try {
      const { error } = await supabase.functions.invoke("send-postcard-email", {
        body: {
          to: postcard.recipient_email,
          recipientName: postcard.recipient_name,
          photoUrl: postcard.photo_url,
          message: postcard.message,
          template: postcard.template,
        },
      });
      if (!error) {
        await markSent(postcard.id, "email");
        return { success: true };
      }
    } catch { /* fall through to mailto */ }
  }

  // Fallback: open mailto with the message (photo as link)
  const subject = encodeURIComponent("A postcard from my trip!");
  const body = encodeURIComponent(
    `${postcard.message}\n\nSee the photo: ${postcard.photo_url}\n\nSent with VYBR`
  );
  window.open(`mailto:${postcard.recipient_email}?subject=${subject}&body=${body}`, "_blank");
  await markSent(postcard.id, "email-mailto");
  return { success: true };
}

// --- SMS Provider (v1: native sms: URI, v2: Twilio Edge Function) ---

async function sendSMSPostcard(postcard: Postcard): Promise<{ success: boolean; error?: string }> {
  if (!postcard.recipient_phone) return { success: false, error: "No phone number" };

  // Try Supabase Edge Function first
  if (supabase) {
    try {
      const { error } = await supabase.functions.invoke("send-postcard-sms", {
        body: {
          to: postcard.recipient_phone,
          photoUrl: postcard.photo_url,
          message: postcard.message,
        },
      });
      if (!error) {
        await markSent(postcard.id, "twilio");
        return { success: true };
      }
    } catch { /* fall through to native SMS */ }
  }

  // Fallback: open native SMS app
  const smsBody = encodeURIComponent(`${postcard.message}\n\n📸 ${postcard.photo_url}\n\nSent with VYBR`);
  const separator = /iPhone|iPad|iPod/i.test(navigator.userAgent) ? "&" : "?";
  window.open(`sms:${postcard.recipient_phone}${separator}body=${smsBody}`, "_blank");
  await markSent(postcard.id, "sms-native");
  return { success: true };
}

// --- Print Provider (Lob API) ---
// Docs: https://docs.lob.com/#tag/Postcards

async function sendPrintPostcard(postcard: Postcard): Promise<{ success: boolean; error?: string }> {
  if (!postcard.recipient_address) return { success: false, error: "No mailing address" };

  const lobKey = import.meta.env.VITE_LOB_API_KEY as string | undefined;
  if (!lobKey) {
    return { success: false, error: "Print postcard not configured. Set VITE_LOB_API_KEY." };
  }

  const lobBase = (import.meta.env.VITE_LOB_SANDBOX === "true")
    ? "https://api.lob.com/v1"
    : "https://api.lob.com/v1";

  try {
    const addr = postcard.recipient_address;
    const res = await fetch(`${lobBase}/postcards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(lobKey + ":")}`,
      },
      body: JSON.stringify({
        to: {
          name: postcard.recipient_name,
          address_line1: addr.street1,
          address_line2: addr.street2 || undefined,
          address_city: addr.city,
          address_state: addr.state,
          address_zip: addr.postalCode,
          address_country: addr.country,
        },
        front: postcard.photo_url, // Lob accepts a URL to an image
        back: `<html><body style="font-family:Georgia,serif;padding:40px;text-align:center"><p style="font-size:18px;line-height:1.6">${postcard.message}</p><p style="font-size:12px;color:#888;margin-top:20px">Sent with VYBR</p></body></html>`,
        size: "4x6",
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: `Print failed: ${err.error?.message || res.status}` };
    }

    const data = await res.json();
    await markSent(postcard.id, "lob", data.id);
    return { success: true };
  } catch (err) {
    return { success: false, error: `Print failed: ${err instanceof Error ? err.message : "Unknown"}` };
  }
}

// --- Helpers ---

async function markSent(postcardId: string, provider: string, providerId?: string): Promise<void> {
  if (!supabase) return;
  await supabase.from("postcards").update({
    status: "sent",
    provider_id: providerId ?? provider,
    provider_meta: { provider },
    sent_at: new Date().toISOString(),
  }).eq("id", postcardId);
}
