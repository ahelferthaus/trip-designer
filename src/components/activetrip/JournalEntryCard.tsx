import type { JournalEntry } from "../../lib/tripJournal";

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

interface JournalEntryCardProps {
  entry: JournalEntry;
  onDelete?: () => void;
  isOwn?: boolean;
}

export default function JournalEntryCard({ entry, onDelete, isOwn }: JournalEntryCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md" style={{ backgroundColor: "var(--td-card)" }}>
      {/* Photo */}
      {entry.photo_url && (
        <img
          src={entry.thumbnail_url || entry.photo_url}
          alt=""
          className="w-full h-52 object-cover"
          loading="lazy"
          onClick={() => {
            // Open full-size in new tab
            if (entry.photo_url) window.open(entry.photo_url, "_blank");
          }}
          style={{ cursor: "pointer" }}
        />
      )}

      <div className="px-4 py-3">
        {/* Author + time */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
            >
              {(entry.author_name || "?")[0].toUpperCase()}
            </div>
            <span className="text-[13px] font-semibold" style={{ color: "var(--td-label)" }}>
              {entry.author_name || "Traveler"}
            </span>
          </div>
          <div className="text-[11px]" style={{ color: "var(--td-secondary)" }}>
            {formatDate(entry.recorded_at)} · {formatTime(entry.recorded_at)}
          </div>
        </div>

        {/* Body text */}
        {entry.body && (
          <p className="text-[14px] leading-relaxed" style={{ color: "var(--td-label)" }}>
            {entry.body}
          </p>
        )}

        {/* Location */}
        {entry.lat && entry.lng && (
          <div className="flex items-center gap-1 mt-2 text-[11px]" style={{ color: "var(--td-secondary)" }}>
            <span>📍</span>
            <span>{entry.lat.toFixed(4)}, {entry.lng.toFixed(4)}</span>
          </div>
        )}

        {/* Delete button (own entries only) */}
        {isOwn && onDelete && (
          <button
            onClick={onDelete}
            className="mt-2 text-[12px] active:opacity-70"
            style={{ color: "#FF3B30" }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
