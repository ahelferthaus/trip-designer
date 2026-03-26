import { useState, useRef } from "react";
import { uploadPhoto } from "../../lib/tripPhotos";
import type { TripPhoto } from "../../lib/tripPhotos";
import UserAvatar from "../UserAvatar";

interface SlotPhotosProps {
  tripId: string;
  slotId: string;
  userId: string | null;
  photos: TripPhoto[];
  onPhotoAdded: () => void;
}

export default function SlotPhotos({ tripId, slotId, userId, photos, onPhotoAdded }: SlotPhotosProps) {
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<TripPhoto | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const alreadyUploaded = userId ? photos.some(p => p.user_id === userId) : false;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    await uploadPhoto(tripId, slotId, userId, file);
    setUploading(false);
    onPhotoAdded();
    // Reset input
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <>
      {/* Photo strip + upload button */}
      <div className="flex items-center gap-2 mt-2">
        {photos.map(p => (
          <button
            key={p.id}
            onClick={() => setLightbox(p)}
            className="relative flex-shrink-0 active:opacity-70"
          >
            <img
              src={p.photo_url}
              alt={p.caption || "Trip photo"}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full text-[7px] font-bold flex items-center justify-center"
              style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
              title={p.uploader_name}
            >
              {(p.uploader_name ?? "?").slice(0, 1).toUpperCase()}
            </div>
          </button>
        ))}

        {/* Upload button (one per user per slot) */}
        {userId && !alreadyUploaded && (
          <label
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer active:opacity-70"
            style={{ backgroundColor: "var(--td-fill)", color: "var(--td-secondary)" }}
          >
            {uploading ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" style={{ color: "var(--td-accent)" }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <span className="text-[16px]">📷</span>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFile}
              disabled={uploading}
            />
          </label>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.photo_url}
              alt={lightbox.caption || "Trip photo"}
              className="w-full rounded-2xl"
            />
            <div className="flex items-center gap-2 mt-3 px-1">
              <UserAvatar name={lightbox.uploader_name ?? "?"} size="sm" showLabel={false} />
              <div>
                <p className="text-[13px] font-semibold text-white">{lightbox.uploader_name}</p>
                {lightbox.caption && (
                  <p className="text-[12px] text-white/70">{lightbox.caption}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="mt-4 w-full py-3 rounded-2xl text-[15px] font-semibold active:opacity-70"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
