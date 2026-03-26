import { supabase } from "./supabase";

export interface TripPhoto {
  id: string;
  trip_id: string;
  slot_id: string;
  user_id: string;
  photo_url: string;
  caption: string;
  created_at: string;
  uploader_name?: string;
}

/**
 * Resize image client-side before upload (max 1200px wide, 80% JPEG quality)
 */
function resizeImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error("Blob conversion failed")),
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = URL.createObjectURL(file);
  });
}

export async function uploadPhoto(
  tripId: string,
  slotId: string,
  userId: string,
  file: File,
  caption = ""
): Promise<TripPhoto | null> {
  if (!supabase) return null;

  // Resize
  const resized = await resizeImage(file);
  const path = `${tripId}/${slotId}/${userId}.jpg`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from("trip-photos")
    .upload(path, resized, { contentType: "image/jpeg", upsert: true });

  if (uploadError) {
    console.error("Photo upload failed:", uploadError);
    return null;
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from("trip-photos").getPublicUrl(path);
  const photo_url = urlData.publicUrl;

  // Upsert metadata row
  const { data, error } = await supabase
    .from("trip_photos")
    .upsert(
      { trip_id: tripId, slot_id: slotId, user_id: userId, photo_url, caption },
      { onConflict: "trip_id,slot_id,user_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Photo metadata save failed:", error);
    return null;
  }

  return data as TripPhoto;
}

export async function getPhotosForTrip(
  tripId: string
): Promise<Record<string, TripPhoto[]>> {
  if (!supabase) return {};
  const { data } = await supabase
    .from("trip_photos")
    .select("*, user_profiles(display_name)")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  const result: Record<string, TripPhoto[]> = {};
  for (const row of data ?? []) {
    const slotId = row.slot_id as string;
    if (!result[slotId]) result[slotId] = [];
    const p = row.user_profiles as Record<string, string> | null;
    result[slotId].push({
      id: row.id as string,
      trip_id: row.trip_id as string,
      slot_id: slotId,
      user_id: row.user_id as string,
      photo_url: row.photo_url as string,
      caption: row.caption as string,
      created_at: row.created_at as string,
      uploader_name: p?.display_name ?? "Someone",
    });
  }
  return result;
}

export async function getPhotosForSlot(
  tripId: string,
  slotId: string
): Promise<TripPhoto[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("trip_photos")
    .select("*, user_profiles(display_name)")
    .eq("trip_id", tripId)
    .eq("slot_id", slotId)
    .order("created_at", { ascending: true });

  return (data ?? []).map((row: Record<string, unknown>) => {
    const p = row.user_profiles as Record<string, string> | null;
    return {
      id: row.id as string,
      trip_id: row.trip_id as string,
      slot_id: row.slot_id as string,
      user_id: row.user_id as string,
      photo_url: row.photo_url as string,
      caption: row.caption as string,
      created_at: row.created_at as string,
      uploader_name: p?.display_name ?? "Someone",
    };
  });
}

export async function deletePhoto(photoId: string): Promise<void> {
  if (!supabase) return;
  // Get the photo to find storage path
  const { data: photo } = await supabase
    .from("trip_photos")
    .select("trip_id, slot_id, user_id")
    .eq("id", photoId)
    .single();
  if (photo) {
    const path = `${photo.trip_id}/${photo.slot_id}/${photo.user_id}.jpg`;
    await supabase.storage.from("trip-photos").remove([path]);
  }
  await supabase.from("trip_photos").delete().eq("id", photoId);
}

export async function getAllTripPhotos(tripId: string): Promise<TripPhoto[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("trip_photos")
    .select("*, user_profiles(display_name)")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });

  return (data ?? []).map((row: Record<string, unknown>) => {
    const p = row.user_profiles as Record<string, string> | null;
    return {
      id: row.id as string,
      trip_id: row.trip_id as string,
      slot_id: row.slot_id as string,
      user_id: row.user_id as string,
      photo_url: row.photo_url as string,
      caption: row.caption as string,
      created_at: row.created_at as string,
      uploader_name: p?.display_name ?? "Someone",
    };
  });
}
