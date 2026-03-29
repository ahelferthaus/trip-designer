import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { searchPublicTrips } from "../lib/publicTrips";
import { ExploreGridSkeleton } from "../components/Skeletons";
import type { PublicTrip } from "../lib/publicTrips";
import type { BudgetLevel } from "../lib/types";
import { useReveal } from "../lib/useReveal";
import { isFavorite, toggleFavorite } from "../lib/favorites";
import { useTripStore } from "../store/tripStore";
import MapHero3D from "../components/itinerary/MapHero3D";

function daysBetween(start: string, end: string) {
  if (!start || !end) return 0;
  return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000));
}

const BUDGET_LABELS: Record<string, string> = { budget: "Budget", mid: "Mid-range", splurge: "Splurge" };

// Category filters
const CATEGORIES = [
  { id: "all", label: "All Trips", icon: "🌍" },
  { id: "weekend", label: "Weekends", icon: "🗓️" },
  { id: "family", label: "Family", icon: "👨‍👩‍👧" },
  { id: "college", label: "College Tours", icon: "🎓" },
  { id: "soccer", label: "Soccer", icon: "⚽" },
  { id: "skiing", label: "Skiing", icon: "⛷️" },
  { id: "spring-break", label: "Spring Break", icon: "🌴" },
  { id: "budget-friendly", label: "Budget", icon: "💰" },
  { id: "luxury", label: "Luxury", icon: "✨" },
  { id: "beach", label: "Beach", icon: "🏖️" },
  { id: "europe", label: "Europe", icon: "🇪🇺" },
  { id: "asia", label: "Asia", icon: "🌏" },
];

// Popular destinations for autofill
const DESTINATIONS = [
  "Paris", "Rome", "Barcelona", "London", "Amsterdam", "Tokyo", "Kyoto",
  "New York", "Los Angeles", "Chicago", "Miami", "Austin", "Nashville",
  "New Orleans", "Denver", "Seattle", "San Francisco", "San Diego",
  "Cancun", "Cabo", "Costa Rica", "Maldives", "Santorini", "Lisbon",
  "Bangkok", "Mexico City", "Vail", "Aspen", "Whistler", "Chamonix",
  "Zermatt", "Jackson Hole", "Park City", "Telluride", "Steamboat",
  "Big Sky", "Orlando", "Maui", "Budapest", "Prague", "Vienna",
  "Munich", "Berlin", "Dublin", "Edinburgh", "Milan", "Florence",
  "Manchester", "Liverpool", "Buenos Aires", "Bali",
  "Duke University", "University of Virginia", "USC", "Emory University",
  "University of Colorado", "Colgate University", "Carnegie Mellon",
  "Colorado School of Mines", "Harvard", "MIT", "Stanford", "Yale",
  "Princeton", "Columbia", "Georgetown", "UCLA", "Berkeley",
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const store = useTripStore();
  useReveal();
  const [query, setQuery] = useState("");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [budget, setBudget] = useState<BudgetLevel | "">("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "most_cloned" | "highest_rated">("newest");
  const [trips, setTrips] = useState<PublicTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Autofill suggestions
  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const q = query.toLowerCase();
    return DESTINATIONS.filter(d => d.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  const doSearch = async () => {
    setLoading(true);
    setShowSuggestions(false);

    const results = await searchPublicTrips({
      query: query.trim() || undefined,
      tag: category !== "all" ? category : undefined,
      budgetLevel: budget || undefined,
      sortBy,
      limit: 40,
    });

    setTrips(results);
    setLoading(false);
    setSearched(true);
  };

  useEffect(() => {
    doSearch();
  }, [sortBy, budget, category]);

  const handleSearch = () => doSearch();

  const handleSuggestionClick = (dest: string) => {
    setQuery(dest);
    setShowSuggestions(false);
    // Trigger search after setting
    setTimeout(() => doSearch(), 50);
  };

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* 3D Map Hero */}
      <MapHero3D
        destination={query.trim() || "World"}
        height={200}
        title="Explore Trips"
        subtitle="Discover destinations planned by travelers worldwide"
      >
        <button
          onClick={() => navigate("/home")}
          className="absolute top-4 left-4 safe-top z-10 w-9 h-9 rounded-full flex items-center justify-center active:opacity-70"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
        >
          <span className="text-white text-[17px] font-semibold">‹</span>
        </button>
      </MapHero3D>

      <div className="px-4 pt-4 flex flex-col gap-3">
        {/* Search bar with autofill */}
        <div className="relative">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search destinations, colleges, activities..."
              className="flex-1 px-4 py-3 rounded-2xl text-[15px] bg-transparent focus:outline-none"
              style={{ backgroundColor: "var(--td-card)", color: "var(--td-label)", border: "1px solid var(--td-separator)" }}
              onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
            />
            <button
              onClick={handleSearch}
              className="px-4 py-3 rounded-2xl text-[15px] font-semibold active:opacity-70"
              style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
            >
              Search
            </button>
          </div>

          {/* Autofill suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div
              className="absolute top-14 left-0 right-14 z-20 rounded-2xl overflow-hidden shadow-lg"
              style={{ backgroundColor: "var(--td-card)", border: "1px solid var(--td-separator)" }}
            >
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => handleSuggestionClick(s)}
                  className="w-full text-left px-4 py-3 text-[14px] active:opacity-70"
                  style={{ color: "var(--td-label)", borderBottom: "1px solid var(--td-separator)" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="px-3 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap active:opacity-70 flex items-center gap-1.5"
              style={{
                backgroundColor: category === cat.id ? "var(--td-accent)" : "var(--td-fill)",
                color: category === cat.id ? "var(--td-accent-text)" : "var(--td-label)",
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Budget + Sort row */}
        <div className="flex gap-2">
          {(["", "budget", "mid", "splurge"] as const).map(b => (
            <button
              key={b}
              onClick={() => setBudget(b as BudgetLevel | "")}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap active:opacity-70"
              style={{
                backgroundColor: budget === b ? "var(--td-accent)" : "var(--td-fill)",
                color: budget === b ? "var(--td-accent-text)" : "var(--td-label)",
              }}
            >
              {b === "" ? "Any $" : b === "budget" ? "💰 Budget" : b === "mid" ? "💳 Mid" : "💎 Splurge"}
            </button>
          ))}
          <div className="flex-1" />
          {(["newest", "most_cloned", "highest_rated"] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className="px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap active:opacity-70"
              style={{
                backgroundColor: sortBy === s ? "var(--td-accent)" : "var(--td-fill)",
                color: sortBy === s ? "var(--td-accent-text)" : "var(--td-label)",
              }}
            >
              {s === "newest" ? "New" : s === "most_cloned" ? "Popular" : "Views"}
            </button>
          ))}
        </div>
      </div>

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div className="fixed inset-0 z-10" onClick={() => setShowSuggestions(false)} />
      )}

      {/* Results */}
      <div className="flex-1 px-4 pt-4 pb-8">
        {loading ? (
          <ExploreGridSkeleton />
        ) : trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-[20px] font-semibold mb-2" style={{ color: "var(--td-label)" }}>
              {searched ? "No trips found" : "No public trips yet"}
            </h3>
            <p className="text-[15px]" style={{ color: "var(--td-secondary)" }}>
              {searched ? "Try different search terms or filters." : "Be the first to publish a trip!"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-[12px] font-semibold uppercase tracking-widest" style={{ color: "var(--td-secondary)" }}>
              {trips.length} trip{trips.length !== 1 ? "s" : ""}
              {category !== "all" ? ` in ${CATEGORIES.find(c => c.id === category)?.label}` : ""}
            </p>
            {trips.map(trip => {
              const days = daysBetween(trip.start_date, trip.end_date);
              const formData = trip.form_data;
              const faved = favs.has(trip.id) || isFavorite(trip.id);
              return (
                <div
                  key={trip.id}
                  className="rounded-2xl overflow-hidden shadow-sm"
                  style={{ backgroundColor: "var(--td-card)" }}
                >
                  {/* Cover — taller for emotional impact */}
                  <button
                    onClick={() => navigate(`/trip/${trip.id}`)}
                    className="w-full h-48 flex items-end px-4 pb-3 text-left relative"
                    style={{
                      background: trip.cover_photo_url
                        ? `url(${trip.cover_photo_url}) center/cover`
                        : `linear-gradient(135deg, var(--td-accent), var(--td-fill))`,
                    }}
                  >
                    {/* Favorite heart */}
                    <div
                      className="absolute top-3 right-3"
                      onClick={e => {
                        e.stopPropagation();
                        toggleFavorite(trip.id);
                        setFavs(prev => {
                          const next = new Set(prev);
                          if (next.has(trip.id)) next.delete(trip.id);
                          else next.add(trip.id);
                          return next;
                        });
                      }}
                    >
                      <span className="text-[22px] drop-shadow-lg cursor-pointer active:scale-125 transition-transform">
                        {faved ? "❤️" : "🤍"}
                      </span>
                    </div>
                    <h3 className="text-[17px] font-bold text-white drop-shadow-md truncate">
                      {trip.title}
                    </h3>
                  </button>

                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 text-[13px] mb-1.5" style={{ color: "var(--td-secondary)" }}>
                      <span>📍 {trip.destination}</span>
                      <span>·</span>
                      <span>{days} days</span>
                      {formData?.budget_level && (
                        <>
                          <span>·</span>
                          <span>{BUDGET_LABELS[formData.budget_level] ?? formData.budget_level}</span>
                        </>
                      )}
                    </div>

                    {trip.description && (
                      <p className="text-[13px] leading-snug mb-2 line-clamp-2" style={{ color: "var(--td-label)" }}>
                        {trip.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[12px]" style={{ color: "var(--td-secondary)" }}>
                      {trip.clone_count > 0 && <span>{trip.clone_count} cloned</span>}
                      {trip.view_count > 0 && <span>{trip.view_count} views</span>}
                      <span className="ml-auto">by {trip.created_by}</span>
                    </div>

                    {/* Tags */}
                    {trip.tags?.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {trip.tags.slice(0, 5).map((v: string) => (
                          <span key={v} className="text-[10px] px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "var(--td-fill)", color: "var(--td-secondary)" }}>
                            {v}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Plan this trip button */}
                    {formData && (
                      <button
                        onClick={() => {
                          store.loadForm(formData);
                          navigate("/intake");
                        }}
                        className="w-full mt-3 py-2.5 rounded-xl text-[13px] font-semibold active:opacity-70"
                        style={{ backgroundColor: "var(--td-fill)", color: "var(--td-accent)" }}
                      >
                        Plan this trip
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA for logged-in users */}
      {user && (
        <div className="px-4 pb-4">
          <button
            onClick={() => navigate("/trips")}
            className="w-full py-3 rounded-2xl text-[15px] font-semibold active:opacity-70"
            style={{ backgroundColor: "var(--td-fill)", color: "var(--td-accent)" }}
          >
            Publish one of your trips
          </button>
        </div>
      )}
    </div>
  );
}
