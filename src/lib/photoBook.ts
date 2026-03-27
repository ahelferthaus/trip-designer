import { supabase } from "./supabase";
import type { GeneratedItinerary } from "./generateItinerary";
import type { IntakeFormData } from "./types";
import { getAllTripPhotos } from "./tripPhotos";

// --- Data Model ---

export interface BookPage {
  id: string;
  type: "cover" | "title" | "overview" | "map" | "day" | "highlights" | "stats" | "ending";
  layout: "full-photo" | "photo-text" | "two-photo" | "text-only" | "map-spread";
  title?: string;
  subtitle?: string;
  caption?: string;
  photos: string[]; // URLs
  dayNumber?: number;
  stats?: Record<string, string>;
}

export interface PhotoBook {
  id: string;
  trip_id: string;
  user_id: string;
  title: string;
  subtitle: string;
  template: "minimal" | "scrapbook";
  cover_photo_url: string | null;
  pages: BookPage[];
  status: "draft" | "preview" | "ordered" | "shipped";
  order_id: string | null;
  order_provider: string | null;
  created_at: string;
  updated_at: string;
}

// --- Auto-generate book from trip data ---

export async function generateBookFromTrip(
  tripId: string,
  userId: string,
  itinerary: GeneratedItinerary,
  form: IntakeFormData,
  template: "minimal" | "scrapbook" = "minimal"
): Promise<PhotoBook | null> {
  if (!supabase) return null;

  // Fetch all trip photos
  const photos = await getAllTripPhotos(tripId);
  const destination = form.destination?.name || "Trip";
  const days = itinerary.days.length;

  const pages: BookPage[] = [];
  let pageIdx = 0;
  const pid = () => `page-${++pageIdx}`;

  // 1. Cover
  const coverPhoto = photos[0]?.photo_url || null;
  pages.push({
    id: pid(),
    type: "cover",
    layout: "full-photo",
    title: itinerary.title || `${destination} Trip`,
    subtitle: `${days} days of adventure`,
    photos: coverPhoto ? [coverPhoto] : [],
  });

  // 2. Title page
  pages.push({
    id: pid(),
    type: "title",
    layout: "text-only",
    title: itinerary.title || `${destination} Trip`,
    subtitle: `${form.start_date} — ${form.end_date}`,
    caption: form.vibes?.join(" · "),
    photos: [],
  });

  // 3. Overview spread
  pages.push({
    id: pid(),
    type: "overview",
    layout: "photo-text",
    title: destination,
    caption: `A ${days}-day journey through ${destination}. ${form.group_members.length} travelers. Budget: ${form.budget_level}.`,
    photos: photos.slice(0, 2).map(p => p.photo_url),
  });

  // 4. Map spread (placeholder — will use Mapbox static image when token available)
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
  const mapUrl = mapboxToken
    ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/auto/800x500@2x?access_token=${mapboxToken}&padding=50`
    : null;
  pages.push({
    id: pid(),
    type: "map",
    layout: "map-spread",
    title: "The Route",
    photos: mapUrl ? [mapUrl] : [],
  });

  // 5. Day-by-day spreads
  let photoIdx = 0;
  for (const day of itinerary.days) {
    const dayPhotos = photos.filter(p => {
      // Try to match photos to days by slot ID pattern
      return p.slot_id.startsWith(`slot-${day.day_number}-`);
    });

    // Use day photos or fallback to sequential photos
    const pagePhotos = dayPhotos.length > 0
      ? dayPhotos.map(p => p.photo_url).slice(0, 2)
      : photos.slice(photoIdx, photoIdx + 2).map(p => p.photo_url);
    photoIdx += 2;

    const activities = day.slots
      .map(s => s.options[0]?.title)
      .filter(Boolean)
      .join(" → ");

    pages.push({
      id: pid(),
      type: "day",
      layout: pagePhotos.length >= 2 ? "two-photo" : pagePhotos.length === 1 ? "photo-text" : "text-only",
      title: day.title || `Day ${day.day_number}`,
      subtitle: day.date,
      caption: activities,
      dayNumber: day.day_number,
      photos: pagePhotos,
    });
  }

  // 6. Highlights
  if (photos.length > 0) {
    pages.push({
      id: pid(),
      type: "highlights",
      layout: "two-photo",
      title: "Highlights",
      photos: photos.slice(0, 4).map(p => p.photo_url),
    });
  }

  // 7. Stats
  pages.push({
    id: pid(),
    type: "stats",
    layout: "text-only",
    title: "Trip Stats",
    photos: [],
    stats: {
      "Days": String(days),
      "Destinations": destination,
      "Travelers": String(form.group_members.length),
      "Photos": String(photos.length),
      "Vibes": form.vibes?.join(", ") || "—",
    },
  });

  // 8. Ending
  pages.push({
    id: pid(),
    type: "ending",
    layout: "text-only",
    title: "Until Next Time",
    caption: `Made with VYBR`,
    photos: [],
  });

  // Pad to minimum 20 pages if needed
  while (pages.length < 20) {
    pages.push({
      id: pid(),
      type: "day",
      layout: "text-only",
      title: "",
      caption: "",
      photos: [],
    });
  }

  // Save to Supabase
  const { data, error } = await supabase
    .from("photo_books")
    .insert({
      trip_id: tripId,
      user_id: userId,
      title: itinerary.title || `${destination} Trip`,
      subtitle: `${days} days of adventure`,
      template,
      cover_photo_url: coverPhoto,
      pages,
      status: "draft",
    })
    .select()
    .single();

  if (error) { console.error("Failed to create photo book:", error); return null; }
  return data as PhotoBook;
}

// --- CRUD ---

export async function getBookForTrip(tripId: string): Promise<PhotoBook | null> {
  if (!supabase) return null;
  const { data } = await supabase
    .from("photo_books")
    .select()
    .eq("trip_id", tripId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return data as PhotoBook | null;
}

export async function getUserBooks(userId: string): Promise<PhotoBook[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("photo_books")
    .select()
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as PhotoBook[];
}

export async function saveBook(bookId: string, updates: Partial<Pick<PhotoBook, "title" | "subtitle" | "template" | "cover_photo_url" | "pages" | "status">>): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("photo_books")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", bookId);
}

export async function deleteBook(bookId: string): Promise<void> {
  if (!supabase) return;
  await supabase.from("photo_books").delete().eq("id", bookId);
}
