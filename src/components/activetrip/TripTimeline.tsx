import { useState, useEffect } from "react";
import { useAuth } from "../../store/authStore";
import { getJournalEntries, deleteJournalEntry, subscribeToJournal } from "../../lib/tripJournal";
import type { JournalEntry } from "../../lib/tripJournal";
import JournalEntryCard from "./JournalEntryCard";

interface TripTimelineProps {
  tripId: string;
  refreshTrigger?: number;
}

export default function TripTimeline({ tripId, refreshTrigger }: TripTimelineProps) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = () => {
    getJournalEntries(tripId).then(data => {
      setEntries(data);
      setLoading(false);
    });
  };

  useEffect(() => { loadEntries(); }, [tripId, refreshTrigger]);

  // Real-time updates from group members
  useEffect(() => {
    const unsub = subscribeToJournal(tripId, loadEntries);
    return unsub;
  }, [tripId]);

  const handleDelete = async (entryId: string) => {
    await deleteJournalEntry(entryId);
    setEntries(prev => prev.filter(e => e.id !== entryId));
  };

  // Group entries by date
  const grouped = new Map<string, JournalEntry[]>();
  for (const entry of entries) {
    const date = new Date(entry.recorded_at).toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric",
    });
    if (!grouped.has(date)) grouped.set(date, []);
    grouped.get(date)!.push(entry);
  }

  if (loading) {
    return (
      <div className="px-4 py-8 flex flex-col gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="text-5xl mb-4">📸</div>
        <h3 className="text-[18px] font-bold mb-2" style={{ color: "var(--td-label)" }}>
          Your trip journal
        </h3>
        <p className="text-[14px] leading-relaxed" style={{ color: "var(--td-secondary)" }}>
          Capture photos and write about your adventures.
          Tap the + button to add your first entry!
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 flex flex-col gap-5">
      {[...grouped.entries()].reverse().map(([date, dayEntries]) => (
        <div key={date}>
          {/* Date header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--td-separator)" }} />
            <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: "var(--td-secondary)" }}>
              {date}
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--td-separator)" }} />
          </div>

          {/* Entries for this date (newest first) */}
          <div className="flex flex-col gap-3">
            {[...dayEntries].reverse().map(entry => (
              <JournalEntryCard
                key={entry.id}
                entry={entry}
                isOwn={entry.user_id === user?.id}
                onDelete={() => handleDelete(entry.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
