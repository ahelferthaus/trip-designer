import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadSavedTrips } from "../lib/tripStorage";
import type { SavedTrip } from "../lib/tripStorage";
import { ALL_SEED_TRIPS, seedTripToForm } from "../lib/seedTrips";
import type { SeedTrip } from "../lib/seedTrips";
import { getFavorites } from "../lib/favorites";
import { useTripStore } from "../store/tripStore";

const VIBE_EMOJIS: Record<string, string> = {
  relaxed: "🏖️", adventure: "🧗", culture: "🏛️", food: "🍷",
  nightlife: "🎵", nature: "🏔️", family: "👨‍👩‍👧", romance: "💑",
};

const CATEGORY_GROUPS = [
  { label: "Europe", filter: (s: SeedTrip) => s.tags.includes("europe") },
  { label: "US Weekends", filter: (s: SeedTrip) => s.tags.includes("weekend") },
  { label: "Beach & Resort", filter: (s: SeedTrip) => s.tags.includes("beach") || s.tags.includes("spring-break") },
  { label: "Budget", filter: (s: SeedTrip) => s.tags.includes("budget-friendly") },
  { label: "Luxury", filter: (s: SeedTrip) => s.tags.includes("luxury") },
  { label: "Skiing", filter: (s: SeedTrip) => s.tags.includes("skiing") },
  { label: "Soccer", filter: (s: SeedTrip) => s.tags.includes("soccer") },
];

export default function TripSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useTripStore();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"my" | "browse" | "favs">("browse");
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSavedTrips(loadSavedTrips());
      setFavorites(getFavorites());
    }
  }, [open]);

  // Hide on intake/auth
  const hiddenPaths = ["/intake", "/auth", "/", "/onboarding"];
  if (hiddenPaths.some(p => location.pathname === p || location.pathname.startsWith(p + "/"))) {
    if (location.pathname !== "/") return null;
  }
  if (location.pathname === "/") return null;

  const handlePlanSeed = (seed: SeedTrip) => {
    const form = seedTripToForm(seed);
    store.loadForm(form);
    setOpen(false);
    navigate("/intake");
  };

  const favSeedTrips = ALL_SEED_TRIPS.filter(s => favorites.includes(`seed-${s.destination}`));

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed top-20 left-0 z-50 w-10 h-10 flex items-center justify-center rounded-r-xl shadow-lg active:opacity-70"
        style={{
          backgroundColor: "var(--td-accent)",
          color: "var(--td-accent-text)",
        }}
      >
        <span className="text-[16px]">{open ? "✕" : "☰"}</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar panel */}
      <div
        className="fixed top-0 left-0 bottom-0 z-50 w-[300px] flex flex-col shadow-2xl transition-transform duration-200"
        style={{
          backgroundColor: "var(--td-card)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* Header */}
        <div className="safe-top pt-4 pb-3 px-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--td-separator)" }}>
          <h2 className="text-[17px] font-bold" style={{ color: "var(--td-label)" }}>Trips</h2>
          <button onClick={() => setOpen(false)} className="text-[20px] active:opacity-70" style={{ color: "var(--td-secondary)" }}>✕</button>
        </div>

        {/* Tabs */}
        <div className="flex px-2 pt-2 gap-1">
          {([
            { id: "browse" as const, label: "Browse" },
            { id: "my" as const, label: "My Trips" },
            { id: "favs" as const, label: "Favorites" },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-2 rounded-xl text-[12px] font-semibold active:opacity-70"
              style={{
                backgroundColor: tab === t.id ? "var(--td-accent)" : "var(--td-fill)",
                color: tab === t.id ? "var(--td-accent-text)" : "var(--td-label)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 pt-3 pb-6">
          {/* Browse tab — seed trips by category */}
          {tab === "browse" && (
            <div className="flex flex-col gap-1">
              {CATEGORY_GROUPS.map(group => {
                const trips = ALL_SEED_TRIPS.filter(group.filter);
                if (trips.length === 0) return null;
                const isExpanded = expandedGroup === group.label;
                return (
                  <div key={group.label}>
                    <button
                      onClick={() => setExpandedGroup(isExpanded ? null : group.label)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl active:opacity-70"
                      style={{ backgroundColor: isExpanded ? "var(--td-fill)" : "transparent" }}
                    >
                      <span className="text-[14px] font-semibold" style={{ color: "var(--td-label)" }}>
                        {group.label}
                      </span>
                      <span className="text-[12px]" style={{ color: "var(--td-secondary)" }}>
                        {trips.length} · {isExpanded ? "▾" : "▸"}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="flex flex-col gap-0.5 ml-2 mt-1 mb-2">
                        {trips.map(seed => (
                          <div
                            key={seed.destination}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg"
                            style={{ backgroundColor: "var(--td-bg)" }}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-medium truncate" style={{ color: "var(--td-label)" }}>
                                {seed.destination}
                              </div>
                              <div className="text-[11px] flex gap-1" style={{ color: "var(--td-secondary)" }}>
                                {seed.days}d · {seed.vibes.map(v => VIBE_EMOJIS[v] || v).join("")}
                              </div>
                            </div>
                            <button
                              onClick={() => handlePlanSeed(seed)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap active:opacity-70"
                              style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
                            >
                              Plan
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* My Trips tab */}
          {tab === "my" && (
            <div className="flex flex-col gap-2">
              {savedTrips.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">🗺️</div>
                  <p className="text-[13px]" style={{ color: "var(--td-secondary)" }}>No trips yet</p>
                  <button
                    onClick={() => { setOpen(false); navigate("/intake"); }}
                    className="mt-3 px-4 py-2 rounded-xl text-[13px] font-semibold active:opacity-70"
                    style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
                  >
                    Plan a trip
                  </button>
                </div>
              ) : (
                savedTrips.map(trip => (
                  <button
                    key={trip.id}
                    onClick={() => { setOpen(false); navigate(trip.cloudTripId ? `/trip/${trip.cloudTripId}` : "/trips"); }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left active:opacity-70"
                    style={{ backgroundColor: "var(--td-bg)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold truncate" style={{ color: "var(--td-label)" }}>
                        {trip.title}
                      </div>
                      <div className="text-[11px]" style={{ color: "var(--td-secondary)" }}>
                        📍 {trip.destination}
                      </div>
                    </div>
                    <span className="text-[12px]" style={{ color: "var(--td-secondary)" }}>▸</span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Favorites tab */}
          {tab === "favs" && (
            <div className="flex flex-col gap-2">
              {favSeedTrips.length === 0 && savedTrips.filter(t => favorites.includes(t.id)).length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">❤️</div>
                  <p className="text-[13px]" style={{ color: "var(--td-secondary)" }}>
                    No favorites yet. Browse trips and tap the heart to save them here.
                  </p>
                </div>
              ) : (
                <>
                  {favSeedTrips.map(seed => (
                    <div
                      key={seed.destination}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                      style={{ backgroundColor: "var(--td-bg)" }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium truncate" style={{ color: "var(--td-label)" }}>
                          {seed.destination}
                        </div>
                        <div className="text-[11px]" style={{ color: "var(--td-secondary)" }}>
                          {seed.days}d · {seed.vibes.map(v => VIBE_EMOJIS[v] || v).join("")}
                        </div>
                      </div>
                      <button
                        onClick={() => handlePlanSeed(seed)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap active:opacity-70"
                        style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
                      >
                        Plan
                      </button>
                    </div>
                  ))}
                  {savedTrips.filter(t => favorites.includes(t.id)).map(trip => (
                    <button
                      key={trip.id}
                      onClick={() => { setOpen(false); navigate(trip.cloudTripId ? `/trip/${trip.cloudTripId}` : "/trips"); }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-left active:opacity-70"
                      style={{ backgroundColor: "var(--td-bg)" }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold truncate" style={{ color: "var(--td-label)" }}>
                          {trip.title}
                        </div>
                        <div className="text-[11px]" style={{ color: "var(--td-secondary)" }}>
                          📍 {trip.destination}
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
