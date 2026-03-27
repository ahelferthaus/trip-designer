import { supabase } from "./supabase";

// --- Provider Abstraction ---
// Supports: 'lulu' (recommended), 'blurb' (future), 'pdf' (digital only)

export interface ShippingAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string; // ISO 2-letter (US, GB, etc.)
}

export interface PrintOrder {
  bookId: string;
  provider: "lulu" | "blurb" | "pdf";
  productType: "hardcover-photo" | "softcover-photo";
  pageCount: number;
  shipping: ShippingAddress;
  pdfUrl?: string; // URL to the uploaded PDF
}

export interface OrderResult {
  success: boolean;
  orderId?: string;
  trackingUrl?: string;
  error?: string;
  estimatedDelivery?: string;
  price?: { amount: number; currency: string };
}

// --- Lulu API Integration ---
// Docs: https://developers.lulu.com/
// Requires: VITE_LULU_API_KEY env var
// Free sandbox available for testing

const LULU_API_BASE = "https://api.lulu.com";
const LULU_SANDBOX_BASE = "https://api.sandbox.lulu.com";

function getLuluBase(): string {
  const sandbox = import.meta.env.VITE_LULU_SANDBOX === "true";
  return sandbox ? LULU_SANDBOX_BASE : LULU_API_BASE;
}

function getLuluKey(): string | null {
  return (import.meta.env.VITE_LULU_API_KEY as string) || null;
}

export async function submitPrintOrder(order: PrintOrder): Promise<OrderResult> {
  const key = getLuluKey();

  if (order.provider === "pdf") {
    // Digital only — no print provider needed
    return {
      success: true,
      orderId: `pdf-${Date.now()}`,
      price: { amount: 0, currency: "USD" },
    };
  }

  if (order.provider === "lulu") {
    if (!key) {
      return { success: false, error: "Lulu API key not configured. Set VITE_LULU_API_KEY." };
    }

    try {
      const base = getLuluBase();

      // Step 1: Create print job
      const res = await fetch(`${base}/print-jobs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          line_items: [
            {
              title: "VYBR Travel Photo Book",
              cover: {
                source_url: order.pdfUrl, // Cover PDF
              },
              interior: {
                source_url: order.pdfUrl, // Interior PDF
              },
              pod_package_id: order.productType === "hardcover-photo"
                ? "0850X1100FCPERFCW" // 8.5x11 hardcover, premium color
                : "0850X1100BWPERFPW", // 8.5x11 softcover
              quantity: 1,
            },
          ],
          shipping_address: {
            name: order.shipping.name,
            street1: order.shipping.street1,
            street2: order.shipping.street2 || undefined,
            city: order.shipping.city,
            state_code: order.shipping.state,
            postal_code: order.shipping.postalCode,
            country_code: order.shipping.country,
          },
          shipping_level: "MAIL",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: `Lulu API error: ${err.message || res.status}` };
      }

      const data = await res.json();
      return {
        success: true,
        orderId: data.id,
        trackingUrl: data.status?.tracking_urls?.[0],
        price: data.costs?.total_cost_incl_tax
          ? { amount: parseFloat(data.costs.total_cost_incl_tax), currency: data.costs.currency || "USD" }
          : undefined,
      };
    } catch (err) {
      return { success: false, error: `Print order failed: ${err instanceof Error ? err.message : "Unknown error"}` };
    }
  }

  return { success: false, error: `Unsupported provider: ${order.provider}` };
}

// --- Order persistence ---

export async function saveOrderToBook(
  bookId: string,
  orderId: string,
  provider: string,
  meta: Record<string, unknown>
): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("photo_books")
    .update({
      status: "ordered",
      order_id: orderId,
      order_provider: provider,
      order_meta: meta,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookId);
}
