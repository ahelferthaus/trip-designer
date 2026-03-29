import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loadSavedTrips } from "../lib/tripStorage";
import type { SavedTrip } from "../lib/tripStorage";
import { ALL_SEED_TRIPS, seedTripToForm } from "../lib/seedTrips";
import type { SeedTrip } from "../lib/seedTrips";
import { getFavorites, toggleFavorite, isFavorite } from "../lib/favorites";
import { useTripStore } from "../store/tripStore";

const VIBE_EMOJIS: Record<string, string> = {
  relaxed: "🏖️", adventure: "🧗", culture: "🏛️", food: "🍷",
  nightlife: "🎵", nature: "🏔️", family: "👨‍👩‍👧", romance: "💑",
};

const BUDGET_EMOJI: Record<string, string> = {
  budget: "💰", mid: "💳", splurge: "💎",
};

const CATEGORY_GROUPS = [
  { label: "Europe", emoji: "🇪🇺", filter: (s: SeedTrip) => s.tags.includes("europe") },
  { label: "US Weekends", emoji: "🇺🇸", filter: (s: SeedTrip) => s.tags.includes("weekend") },
  { label: "Beach", emoji: "🏖️", filter: (s: SeedTrip) => s.tags.includes("beach") || s.tags.includes("spring-break") },
  { label: "Budget", emoji: "💰", filter: (s: SeedTrip) => s.tags.includes("budget-friendly") },
  { label: "Luxury", emoji: "✨", filter: (s: SeedTrip) => s.tags.includes("luxury") },
  { label: "Skiing", emoji: "⛷️", filter: (s: SeedTrip) => s.tags.includes("skiing") },
  { label: "Soccer", emoji: "⚽", filter: (s: SeedTrip) => s.tags.includes("soccer") },
];

// Photo URLs for seed trip cards
const SEED_PHOTOS: Record<string, string> = {
  "Paris, France": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&q=70",
  "Rome, Italy": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=300&q=70",
  "Barcelona, Spain": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=300&q=70",
  "London, England": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&q=70",
  "Santorini, Greece": "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=300&q=70",
  "Maldives": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&q=70",
  "Kyoto, Japan": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&q=70",
  "Cancun, Mexico": "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=300&q=70",
};

function getSeedPhoto(dest: string): string {
  return SEED_PHOTOS[dest] || `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&q=70`;
}

export default function TripSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useTripStore();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"browse" | "my" | "favs">("browse");
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedGroup, setExpandedGroup] = useState<string | null>("Europe");
  const [favRefresh, setFavRefresh] = useState(0);

  // Load data on open
  useEffect(() => {
    setSavedTrips(loadSavedTrips());
    setFavorites(getFavorites());
  }, [open, favRefresh]);

  // Hide on certain pages
  const hiddenPaths = ["/intake", "/auth", "/", "/onboarding"];
  if (location.pathname === "/") return null;
  if (hiddenPaths.some(p => location.pathname === p || location.pathname.startsWith(p + "/"))) return null;

  const handlePlanSeed = (seed: SeedTrip) => {
    const form = seedTripToForm(seed);
    store.loadForm(form);
    setOpen(false);
    navigate("/intake");
  };

  const handleToggleFav = (id: string) => {
    toggleFavorite(id);
    setFavRefresh(n => n + 1);
  };

  const favSeedTrips = ALL_SEED_TRIPS.filter(s => isFavorite(`seed-${s.destination}`));

  return (
    <>
      {/* Floating toggle — large, prominent */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed top-24 left-0 z-50 flex items-center gap-2 pl-3 pr-4 py-3 rounded-r-2xl shadow-xl active:opacity-70"
        style={{
          backgroundColor: "var(--td-accent)",
          color: "var(--td-accent-text)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        <span className="text-[18px]">{open ? "✕" : "🗺️"}</span>
        <span className="text-[13px] font-bold">{open ? "Close" : "Trips"}</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar panel */}
      <div
        className="fixed top-0 left-0 bottom-0 z-50 w-[320px] flex flex-col shadow-2xl transition-transform duration-250 ease-out"
        style={{
          backgroundColor: "var(--td-bg)",
          backdropFilter: "blur(20px)",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          borderRight: "1px solid var(--td-separator)",
        }}
      >
        {/* Header */}
        <div className="safe-top pt-5 pb-3 px-4 flex items-center justify-between">
          <h2 className="text-[20px] font-black" style={{ color: "var(--td-label)" }}>
            🗺️ Trip Browser
          </h2>
          <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center active:opacity-70"
            style={{ backgroundColor: "var(--td-fill)" }}>
            <span className="text-[14px]" style={{ color: "var(--td-label)" }}>✕</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-3 pb-3 gap-1.5">
          {([
            { id: "browse" as const, label: "Browse", emoji: "🌍" },
            { id: "my" as const, label: "My Trips", emoji: "✈️" },
            { id: "favs" as const, label: "Saved", emoji: "❤️" },
          ]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-bold active:opacity-70 flex items-center justify-center gap-1"
              style={{
                backgroundColor: tab === t.id ? "var(--td-accent)" : "var(--td-card)",
                color: tab === t.id ? "var(--td-accent-text)" : "var(--td-label)",
              }}
            >
              <span>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-3 pb-24">

          {/* ===== BROWSE TAB ===== */}
          {tab === "browse" && (
            <div className="flex flex-col gap-2">
              {CATEGORY_GROUPS.map(group => {
                const trips = ALL_SEED_TRIPS.filter(group.filter);
                if (trips.length === 0) return null;
                const isExpanded = expandedGroup === group.label;
                return (
                  <div key={group.label}>
                    <button
                      onClick={() => setExpandedGroup(isExpanded ? null : group.label)}
                      className="w-full flex items-center justify-between px-3 py-3 rounded-xl active:opacity-70"
                      style={{ backgroundColor: isExpanded ? "var(--td-card)" : "transparent" }}
                    >
                      <span className="text-[15px] font-bold flex items-center gap-2" style={{ color: "var(--td-label)" }}>
                        {group.emoji} {group.label}
                      </span>
                      <span className="text-[12px] font-semibold" style={{ color: "var(--td-secondary)" }}>
                        {trips.length} {isExpanded ? "▾" : "▸"}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="flex flex-col gap-2 mt-1 mb-3">
                        {trips.map(seed => {
                          const faved = isFavorite(`seed-${seed.destination}`);
                          return (
                            <div
                              key={seed.destination}
                              className="rounded-xl overflow-hidden shadow-md"
                              style={{ backgroundColor: "var(--td-card)" }}
                            >
                              {/* Photo card */}
                              <div
                                className="h-24 relative flex items-end px-3 pb-2"
                                style={{ background: `url(${getSeedPhoto(seed.destination)}) center/cover` }}
                              >
                                <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                                {/* Fav button */}
                                <button
                                  onClick={() => handleToggleFav(`seed-${seed.destination}`)}
                                  className="absolute top-2 right-2 text-[18px] active:scale-125 transition-transform"
                                >
                                  {faved ? "❤️" : "🤍"}
                                </button>
                                <span className="relative text-[14px] font-bold text-white drop-shadow-md truncate">
                                  {seed.destination}
                                </span>
                              </div>
                              {/* Info + Plan button */}
                              <div className="px-3 py-2.5 flex items-center justify-between">
                                <div>
                                  <div className="text-[11px] flex items-center gap-1.5" style={{ color: "var(--td-secondary)" }}>
                                    <span>{seed.days} days</span>
                                    <span>·</span>
                                    <span>{BUDGET_EMOJI[seed.budget] || ""} {seed.budget}</span>
                                  </div>
                                  <div className="text-[11px] mt-0.5" style={{ color: "var(--td-secondary)" }}>
                                    {seed.vibes.map(v => VIBE_EMOJIS[v] || v).join(" ")}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handlePlanSeed(seed)}
                                  className="px-3 py-1.5 rounded-lg text-[12px] font-bold whitespace-nowrap active:opacity-70"
                                  style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
                                >
                                  Plan it
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ===== MY TRIPS TAB ===== */}
          {tab === "my" && (
            <div className="flex flex-col gap-2">
              {savedTrips.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">✈️</div>
                  <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--td-label)" }}>No trips yet</p>
                  <p className="text-[13px] mb-4" style={{ color: "var(--td-secondary)" }}>Plan your first adventure!</p>
                  <button
                    onClick={() => { setOpen(false); navigate("/intake"); }}
                    className="px-5 py-2.5 rounded-xl text-[14px] font-bold active:opacity-70"
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
                    className="rounded-xl overflow-hidden shadow-md text-left active:opacity-70"
                    style={{ backgroundColor: "var(--td-card)" }}
                  >
                    <div className="h-20 flex items-end px-3 pb-2"
                      style={{ background: "linear-gradient(135deg, var(--td-accent), var(--td-nav-bg))" }}>
                      <span className="text-[14px] font-bold text-white drop-shadow-md truncate">{trip.title}</span>
                    </div>
                    <div className="px-3 py-2">
                      <div className="text-[12px]" style={{ color: "var(--td-secondary)" }}>
                        📍 {trip.destination} · {trip.form?.vibes?.slice(0, 2).join(", ") || ""}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* ===== FAVORITES TAB ===== */}
          {tab === "favs" && (
            <div className="flex flex-col gap-2">
              {favSeedTrips.length === 0 && savedTrips.filter(t => isFavorite(t.id)).length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">❤️</div>
                  <p className="text-[15px] font-semibold mb-1" style={{ color: "var(--td-label)" }}>No saved trips</p>
                  <p className="text-[13px]" style={{ color: "var(--td-secondary)" }}>
                    Browse trips and tap the heart to save them here.
                  </p>
                </div>
              ) : (
                <>
                  {favSeedTrips.map(seed => (
                    <div
                      key={seed.destination}
                      className="rounded-xl overflow-hidden shadow-md"
                      style={{ backgroundColor: "var(--td-card)" }}
                    >
                      <div
                        className="h-24 relative flex items-end px-3 pb-2"
                        style={{ background: `url(${getSeedPhoto(seed.destination)}) center/cover` }}
                      >
                        <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                        <span className="relative text-[14px] font-bold text-white drop-shadow-md truncate">
                          {seed.destination}
                        </span>
                      </div>
                      <div className="px-3 py-2.5 flex items-center justify-between">
                        <div className="text-[11px]" style={{ color: "var(--td-secondary)" }}>
                          {seed.days}d · {seed.vibes.map(v => VIBE_EMOJIS[v] || v).join(" ")}
                        </div>
                        <button
                          onClick={() => handlePlanSeed(seed)}
                          className="px-3 py-1.5 rounded-lg text-[12px] font-bold active:opacity-70"
                          style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
                        >
                          Plan it
                        </button>
                      </div>
                    </div>
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
