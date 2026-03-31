import { useState, useRef } from "react";
import { useAuth } from "../../store/authStore";
import { useActiveTrip } from "../../store/activeTripStore";
import { createJournalEntry } from "../../lib/tripJournal";

interface JournalEntryFormProps {
  tripId: string;
  onCreated: () => void;
  onClose: () => void;
}

export default function JournalEntryForm({ tripId, onCreated, onClose }: JournalEntryFormProps) {
  const { user } = useAuth();
  const { currentLat, currentLng } = useActiveTrip();
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!user || (!body.trim() && !photo)) return;
    setSaving(true);
    await createJournalEntry(tripId, user.id, {
      body: body.trim() || undefined,
      photo: photo || undefined,
      lat: currentLat ?? undefined,
      lng: currentLng ?? undefined,
    });
    setSaving(false);
    setBody("");
    setPhoto(null);
    setPreview(null);
    onCreated();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/60" onClick={onClose} />

      {/* Bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-4 pt-4 pb-8 safe-bottom"
        style={{
          backgroundColor: "var(--td-card)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.3)",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ backgroundColor: "var(--td-separator)" }} />

        <h3 className="text-[18px] font-bold mb-3" style={{ color: "var(--td-label)" }}>
          Add to Journal
        </h3>

        {/* Photo preview */}
        {preview && (
          <div className="relative mb-3">
            <img src={preview} alt="" className="w-full h-48 object-cover rounded-2xl" />
            <button
              onClick={() => { setPhoto(null); setPreview(null); }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "white" }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Text input */}
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="What's happening? Write about this moment..."
          rows={3}
          className="w-full px-4 py-3 rounded-2xl text-[15px] bg-transparent focus:outline-none resize-none"
          style={{ backgroundColor: "var(--td-fill)", color: "var(--td-label)" }}
        />

        {/* Location indicator */}
        {currentLat && currentLng && (
          <div className="flex items-center gap-1.5 px-2 mt-2 text-[12px]" style={{ color: "var(--td-secondary)" }}>
            <span className="w-2 h-2 rounded-full bg-green-500" />
            GPS location attached
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhoto}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-12 h-12 rounded-full flex items-center justify-center active:opacity-70"
            style={{ backgroundColor: "var(--td-fill)" }}
          >
            <span className="text-[22px]">📷</span>
          </button>

          <div className="flex-1" />

          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl text-[15px] font-semibold active:opacity-70"
            style={{ backgroundColor: "var(--td-fill)", color: "var(--td-label)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || (!body.trim() && !photo)}
            className="px-5 py-3 rounded-2xl text-[15px] font-bold active:opacity-70"
            style={{
              backgroundColor: saving || (!body.trim() && !photo) ? "var(--td-fill)" : "var(--td-accent)",
              color: saving || (!body.trim() && !photo) ? "var(--td-secondary)" : "var(--td-accent-text)",
            }}
          >
            {saving ? "Saving..." : "Post"}
          </button>
        </div>
      </div>
    </>
  );
}
