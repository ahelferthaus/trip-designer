import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { generateItinerary } from "../lib/generateItinerary";
import { saveCloudTrip } from "../lib/supabaseTrips";
import { publishTrip } from "../lib/publicTrips";
import { ALL_SEED_TRIPS, seedTripToForm } from "../lib/seedTrips";
import type { SeedTrip } from "../lib/seedTrips";
import { supabase } from "../lib/supabase";

interface TruncatedTrip {
  id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  actual_days: number;
  expected_days: number;
  form_data: unknown;
  tags: string[];
}

export default function SeedTripsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState("");
  const [done, setDone] = useState(0);
  const [failed, setFailed] = useState(0);
  const [total, setTotal] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  // Fix truncated trips state
  const [scanning, setScanning] = useState(false);
  const [truncated, setTruncated] = useState<TruncatedTrip[]>([]);
  const [fixing, setFixing] = useState(false);
  const [fixLog, setFixLog] = useState<string[]>([]);
  const [fixDone, setFixDone] = useState(0);

  const addLog = (msg: string) => setLog(prev => [...prev.slice(-50), msg]);
  const addFixLog = (msg: string) => setFixLog(prev => [...prev.slice(-50), msg]);

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

      if (i < trips.length - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    setCurrent("");
    setRunning(false);
    addLog(`Done!`);
  };

  // --- SCAN FOR TRUNCATED TRIPS ---
  const scanTruncated = async () => {
    if (!supabase) return;
    setScanning(true);
    setTruncated([]);

    const { data } = await supabase
      .from("trips")
      .select("id, title, destination, start_date, end_date, itinerary_data, form_data, tags")
      .eq("is_published", true);

    const found: TruncatedTrip[] = [];
    for (const t of data ?? []) {
      const itin = t.itinerary_data as { days?: unknown[] } | null;
      const actualDays = itin?.days?.length ?? 0;
      const expectedDays = Math.max(1, Math.round(
        (new Date(t.end_date as string).getTime() - new Date(t.start_date as string).getTime()) / 86400000
      ));
      if (actualDays < expectedDays) {
        found.push({
          id: t.id as string,
          title: t.title as string,
          destination: t.destination as string,
          start_date: t.start_date as string,
          end_date: t.end_date as string,
          actual_days: actualDays,
          expected_days: expectedDays,
          form_data: t.form_data,
          tags: (t.tags as string[]) ?? [],
        });
      }
    }

    setTruncated(found);
    setScanning(false);
  };

  // --- FIX ALL TRUNCATED TRIPS ---
  const fixAll = async () => {
    if (!user || !supabase) return;
    setFixing(true);
    setFixLog([]);
    setFixDone(0);

    for (let i = 0; i < truncated.length; i++) {
      const trip = truncated[i];
      addFixLog(`[${i + 1}/${truncated.length}] Regenerating: ${trip.destination} (${trip.actual_days}→${trip.expected_days} days)...`);

      try {
        const form = trip.form_data as Parameters<typeof generateItinerary>[0];
        const itinerary = await generateItinerary(form);

        if (itinerary.days.length >= trip.expected_days) {
          // Update the existing trip with the complete itinerary
          await supabase
            .from("trips")
            .update({ itinerary_data: itinerary, title: itinerary.title })
            .eq("id", trip.id);

          addFixLog(`  ✓ Fixed: "${itinerary.title}" — ${itinerary.days.length} days`);
          setFixDone(d => d + 1);
        } else {
          // Still truncated — AI returned fewer days than expected
          addFixLog(`  ⚠ Partial: got ${itinerary.days.length}/${trip.expected_days} days. Saving anyway.`);
          await supabase
            .from("trips")
            .update({ itinerary_data: itinerary, title: itinerary.title })
            .eq("id", trip.id);
          setFixDone(d => d + 1);
        }
      } catch (err) {
        addFixLog(`  ✗ FAILED: ${err instanceof Error ? err.message : "Unknown error"}`);
      }

      // Rate limit
      if (i < truncated.length - 1) {
        await new Promise(r => setTimeout(r, 3000));
      }
    }

    setFixing(false);
    addFixLog(`Done! ${fixDone + 1} trips fixed.`);
  };

  // --- FIX SINGLE TRIP ---
  const fixOne = async (trip: TruncatedTrip) => {
    if (!user || !supabase) return;
    setFixing(true);
    addFixLog(`Regenerating: ${trip.destination}...`);

    try {
      const form = trip.form_data as Parameters<typeof generateItinerary>[0];
      const itinerary = await generateItinerary(form);

      await supabase
        .from("trips")
        .update({ itinerary_data: itinerary, title: itinerary.title })
        .eq("id", trip.id);

      addFixLog(`✓ Fixed: "${itinerary.title}" — ${itinerary.days.length} days`);
      setTruncated(prev => prev.filter(t => t.id !== trip.id));
    } catch (err) {
      addFixLog(`✗ FAILED: ${err instanceof Error ? err.message : "Unknown error"}`);
    }

    setFixing(false);
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

        {/* ===== FIX TRUNCATED TRIPS (top priority) ===== */}
        <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: "var(--td-card)", border: "2px solid #FF9500" }}>
          <h2 className="text-[16px] font-bold mb-2" style={{ color: "var(--td-label)" }}>
            🔧 Fix Truncated Trips
          </h2>
          <p className="text-[12px] mb-3" style={{ color: "var(--td-secondary)" }}>
            Some trips have fewer days than expected (AI ran out of tokens). Scan to find them, then regenerate.
          </p>

          {/* Scan button */}
          <button
            onClick={scanTruncated}
            disabled={scanning || fixing}
            className="w-full py-3 rounded-xl text-[14px] font-bold active:opacity-70 mb-3"
            style={{ backgroundColor: "#FF9500", color: "white" }}
          >
            {scanning ? "Scanning..." : "Scan for Truncated Trips"}
          </button>

          {/* Results */}
          {truncated.length > 0 && (
            <>
              <p className="text-[13px] font-semibold mb-2" style={{ color: "#FF3B30" }}>
                Found {truncated.length} truncated trips:
              </p>
              <div className="flex flex-col gap-1.5 mb-3 max-h-48 overflow-y-auto">
                {truncated.map(t => (
                  <div key={t.id} className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ backgroundColor: "var(--td-fill)" }}>
                    <div>
                      <span className="text-[13px] font-medium" style={{ color: "var(--td-label)" }}>
                        {t.destination}
                      </span>
                      <span className="text-[11px] ml-2" style={{ color: "#FF3B30" }}>
                        {t.actual_days}/{t.expected_days} days
                      </span>
                    </div>
                    <button
                      onClick={() => fixOne(t)}
                      disabled={fixing}
                      className="px-3 py-1 rounded-lg text-[11px] font-bold active:opacity-70"
                      style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
                    >
                      Fix
                    </button>
                  </div>
                ))}
              </div>

              {/* Fix All button */}
              <button
                onClick={fixAll}
                disabled={fixing}
                className="w-full py-3 rounded-xl text-[14px] font-bold active:opacity-70"
                style={{ backgroundColor: "#FF3B30", color: "white" }}
              >
                {fixing ? `Fixing... (${fixDone}/${truncated.length})` : `Fix All ${truncated.length} Trips`}
              </button>
            </>
          )}

          {truncated.length === 0 && !scanning && fixLog.length === 0 && (
            <p className="text-[12px] text-center" style={{ color: "var(--td-secondary)" }}>
              Tap "Scan" to check for incomplete trips.
            </p>
          )}

          {/* Fix log */}
          {fixLog.length > 0 && (
            <div className="mt-3 rounded-lg px-3 py-2 max-h-40 overflow-y-auto" style={{ backgroundColor: "var(--td-bg)" }}>
              {fixLog.map((l, i) => (
                <p key={i} className="text-[11px] font-mono leading-relaxed"
                  style={{ color: l.includes("✗") ? "#FF3B30" : l.includes("✓") ? "#34C759" : "var(--td-secondary)" }}>
                  {l}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* ===== GENERATE NEW TRIPS ===== */}
        <div className="rounded-2xl px-4 py-4" style={{ backgroundColor: "var(--td-card)" }}>
          <h2 className="text-[16px] font-bold mb-2" style={{ color: "var(--td-label)" }}>
            ➕ Generate New Trips
          </h2>
          <p className="text-[12px] mb-3" style={{ color: "var(--td-secondary)" }}>
            Each trip calls the AI (~30s per trip). Total: {ALL_SEED_TRIPS.length} trips defined.
          </p>

          <div className="flex flex-col gap-2">
            {[
              { label: `Europe (${ALL_SEED_TRIPS.filter(t => t.tags.includes("europe") && t.days === 7).length})`, trips: ALL_SEED_TRIPS.filter(t => t.tags.includes("europe") && t.days === 7) },
              { label: `US Weekends (${ALL_SEED_TRIPS.filter(t => t.tags.includes("weekend")).length})`, trips: ALL_SEED_TRIPS.filter(t => t.tags.includes("weekend")) },
              { label: `Ski (${ALL_SEED_TRIPS.filter(t => t.tags.includes("skiing")).length})`, trips: ALL_SEED_TRIPS.filter(t => t.tags.includes("skiing")) },
              { label: `Soccer (${ALL_SEED_TRIPS.filter(t => t.tags.includes("soccer")).length})`, trips: ALL_SEED_TRIPS.filter(t => t.tags.includes("soccer")) },
              { label: `ALL (${ALL_SEED_TRIPS.length})`, trips: ALL_SEED_TRIPS },
            ].map(({ label, trips }) => (
              <button
                key={label}
                onClick={() => runSeed(trips)}
                disabled={running || fixing}
                className="w-full py-3 rounded-xl text-[14px] font-semibold active:opacity-70"
                style={{
                  backgroundColor: running ? "var(--td-fill)" : "var(--td-accent)",
                  color: running ? "var(--td-secondary)" : "var(--td-accent-text)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate progress */}
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

        {/* Generate log */}
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
