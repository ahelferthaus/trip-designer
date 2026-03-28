import { supabase } from "./supabase";
import type { CloudTrip } from "./supabaseTrips";

export interface PublicTrip extends CloudTrip {
  is_published: boolean;
  visibility: string;
  description: string;
  tags: string[];
  cover_photo_url: string | null;
  view_count: number;
  clone_count: number;
  avg_rating?: number;
  review_count?: number;
}

export interface TripReview {
  id: string;
  trip_id: string;
  user_id: string;
  rating: number;
  body: string;
  created_at: string;
  reviewer_name?: string;
}

// --- Publishing ---

export async function publishTrip(
  tripId: string,
  details: { description?: string; tags?: string[]; visibility?: string }
): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("trips")
    .update({
      is_published: true,
      visibility: details.visibility ?? "public",
      description: details.description ?? "",
      tags: details.tags ?? [],
    })
    .eq("id", tripId);
}

export async function unpublishTrip(tripId: string): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("trips")
    .update({ is_published: false, visibility: "private" })
    .eq("id", tripId);
}

// --- Search & Browse ---

export async function searchPublicTrips(opts: {
  query?: string;
  tag?: string;
  budgetLevel?: string;
  vibes?: string[];
  minDays?: number;
  maxDays?: number;
  sortBy?: "newest" | "most_cloned" | "highest_rated";
  limit?: number;
  offset?: number;
}): Promise<PublicTrip[]> {
  if (!supabase) return [];

  let q = supabase
    .from("trips")
    .select("*")
    .eq("is_published", true)
    .eq("visibility", "public");

  if (opts.query) {
    q = q.textSearch("search_vector", opts.query, { type: "websearch" });
  }

  // Tag-based filter (for category pills)
  if (opts.tag) {
    q = q.contains("tags", [opts.tag]);
  }

  if (opts.budgetLevel) {
    q = q.filter("form_data->budget_level", "eq", opts.budgetLevel);
  }

  switch (opts.sortBy) {
    case "most_cloned":
      q = q.order("clone_count", { ascending: false });
      break;
    case "highest_rated":
      q = q.order("view_count", { ascending: false }); // proxy until we add avg_rating column
      break;
    default:
      q = q.order("created_at", { ascending: false });
  }

  q = q.range(opts.offset ?? 0, (opts.offset ?? 0) + (opts.limit ?? 20) - 1);

  const { data } = await q;
  return (data ?? []) as PublicTrip[];
}

export async function getPublicTrip(tripId: string): Promise<PublicTrip | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .eq("is_published", true)
    .single();
  if (error) return null;

  // Increment view count (fire and forget)
  supabase
    .from("trips")
    .update({ view_count: ((data as PublicTrip).view_count ?? 0) + 1 })
    .eq("id", tripId)
    .then(() => {});

  return data as PublicTrip;
}

// --- Clone ---

export async function cloneTrip(
  sourceTripId: string,
  userId: string,
  createdBy: string
): Promise<CloudTrip | null> {
  if (!supabase) return null;

  // Fetch source trip
  const { data: source } = await supabase
    .from("trips")
    .select("*")
    .eq("id", sourceTripId)
    .single();
  if (!source) return null;

  // Create new trip with same data
  const { data: newTrip, error } = await supabase
    .from("trips")
    .insert({
      title: source.title,
      destination: source.destination,
      start_date: source.start_date,
      end_date: source.end_date,
      passcode: "1234",
      form_data: source.form_data,
      itinerary_data: source.itinerary_data,
      created_by: createdBy,
      user_id: userId,
    })
    .select()
    .single();
  if (error) return null;

  // Increment clone count on source
  await supabase
    .from("trips")
    .update({ clone_count: ((source as PublicTrip).clone_count ?? 0) + 1 })
    .eq("id", sourceTripId);

  return newTrip as CloudTrip;
}

// --- Reviews ---

export async function getReviews(tripId: string): Promise<TripReview[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("trip_reviews")
    .select("*, user_profiles(display_name)")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    trip_id: r.trip_id as string,
    user_id: r.user_id as string,
    rating: r.rating as number,
    body: r.body as string,
    created_at: r.created_at as string,
    reviewer_name: (r.user_profiles as Record<string, string> | null)?.display_name ?? "Anonymous",
  }));
}

export async function submitReview(
  tripId: string,
  userId: string,
  rating: number,
  body: string
): Promise<void> {
  if (!supabase) return;
  await supabase.from("trip_reviews").upsert(
    { trip_id: tripId, user_id: userId, rating, body },
    { onConflict: "trip_id,user_id" }
  );
}
