import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { generateItinerary } from "../lib/generateItinerary";
import { saveCloudTrip } from "../lib/supabaseTrips";
import { publishTrip } from "../lib/publicTrips";
import { ALL_SEED_TRIPS, seedTripToForm } from "../lib/seedTrips";
import type { SeedTrip } from "../lib/seedTrips";

export default function SeedTripsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState("");
  const [done, setDone] = useState(0);
  const [failed, setFailed] = useState(0);
  const [total, setTotal] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [...prev.slice(-50), msg]);

  const runSeed = async (trips: SeedTrip[]) => {
    if (!user) return;
    setRunning(true);
    setDone(0);
    setFailed(0);
    setTotal(trips.length);
    setLog([]);

    for (let i = 0; i < trips.length; i++) {
      const seed = trips[i];
      setCurrent(`${seed.destination} (${i + 1}/${trips.length})`);
      addLog(`Generating: ${seed.destination}...`);

      try {
        const form = seedTripToForm(seed);
        const itinerary = await generateItinerary(form);
        addLog(`  AI returned: "${itinerary.title}" — ${itinerary.days.length} days`);

        const cloud = await saveCloudTrip(form, itinerary, "VYBR", "1234", user.id);
        addLog(`  Saved to cloud: ${cloud.id}`);

        await publishTrip(cloud.id, {
          description: `${seed.days}-day ${seed.destination} trip. ${seed.vibes.join(", ")}.`,
          tags: seed.tags,
          visibility: "public",
        });
        addLog(`  Published with tags: ${seed.tags.join(", ")}`);

        setDone(d => d + 1);
      } catch (err) {
        addLog(`  FAILED: ${err instanceof Error ? err.message : "Unknown error"}`);
        setFailed(f => f + 1);
      }

      // Rate limit: wait 2s between trips to avoid API throttling
      if (i < trips.length - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    setCurrent("");
    setRunning(false);
    addLog(`Done! ${done + 1} generated, ${failed} failed.`);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--td-bg)" }}>
        <p style={{ color: "var(--td-label)" }}>Sign in first</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ backgroundColor: "var(--td-bg)" }}>
      <div className="px-4 pt-4 pb-2 safe-top flex items-center gap-3">
        <button onClick={() => navigate("/home")} className="text-[17px]" style={{ color: "var(--td-accent)" }}>‹ Home</button>
        <h1 className="text-[17px] font-semibold" style={{ color: "var(--td-label)" }}>Seed Trips (Admin)</h1>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        <p className="text-[13px]" style={{ color: "var(--td-secondary)" }}>
          Generate and publish pre-loaded trip itineraries. Each trip calls the AI, so this takes ~30s per trip.
          Total: {ALL_SEED_TRIPS.length} trips defined.
        </p>

        {/* Category buttons */}
        <div className="flex flex-col gap-2">
          {[
            { label: `Europe Week Trips (${30})`, trips: ALL_SEED_TRIPS.filter(t => t.tags.includes("europe") && t.days === 7) },
            { label: `US Weekends (${20})`, trips: ALL_SEED_TRIPS.filter(t => t.tags.includes("weekend")) },
            { label: `Ski Resorts (${10})`, trips: ALL_SEED_TRIPS.filter(t => t.tags.includes("skiing")) },
            { label: `Soccer Trips (${8})`, trips: ALL_SEED_TRIPS.filter(t => t.tags.includes("soccer")) },
            { label: `ALL (${ALL_SEED_TRIPS.length})`, trips: ALL_SEED_TRIPS },
          ].map(({ label, trips }) => (
            <button
              key={label}
              onClick={() => runSeed(trips)}
              disabled={running}
              className="w-full py-3.5 rounded-2xl text-[15px] font-semibold active:opacity-70"
              style={{
                backgroundColor: running ? "var(--td-fill)" : "var(--td-accent)",
                color: running ? "var(--td-secondary)" : "var(--td-accent-text)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Progress */}
        {running && (
          <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: "var(--td-card)" }}>
            <div className="flex justify-between text-[13px] mb-2">
              <span style={{ color: "var(--td-label)" }}>{current}</span>
              <span style={{ color: "var(--td-secondary)" }}>{done + failed}/{total}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--td-fill)" }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${((done + failed) / Math.max(total, 1)) * 100}%`, backgroundColor: "var(--td-accent)" }} />
            </div>
            {failed > 0 && <p className="text-[12px] mt-1" style={{ color: "#FF3B30" }}>{failed} failed</p>}
          </div>
        )}

        {/* Log */}
        {log.length > 0 && (
          <div className="rounded-2xl px-4 py-3 max-h-64 overflow-y-auto" style={{ backgroundColor: "var(--td-card)" }}>
            {log.map((l, i) => (
              <p key={i} className="text-[11px] font-mono leading-relaxed"
                style={{ color: l.includes("FAILED") ? "#FF3B30" : l.includes("Published") ? "#34C759" : "var(--td-secondary)" }}>
                {l}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
