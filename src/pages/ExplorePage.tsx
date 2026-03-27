import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { searchPublicTrips } from "../lib/publicTrips";
import type { PublicTrip } from "../lib/publicTrips";
import type { BudgetLevel } from "../lib/types";
import { useReveal } from "../lib/useReveal";

function daysBetween(start: string, end: string) {
  if (!start || !end) return 0;
  return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000));
}

const BUDGET_LABELS: Record<string, string> = { budget: "Budget", mid: "Mid-range", splurge: "Splurge" };

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  useReveal();
  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState<BudgetLevel | "">("");
  const [sortBy, setSortBy] = useState<"newest" | "most_cloned" | "highest_rated">("newest");
  const [trips, setTrips] = useState<PublicTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);

  const doSearch = async () => {
    setLoading(true);
    const results = await searchPublicTrips({
      query: query.trim() || undefined,
      budgetLevel: budget || undefined,
      sortBy,
      limit: 30,
    });
    setTrips(results);
    setLoading(false);
    setSearched(true);
  };

  // Load initial results
  useEffect(() => {
    doSearch();
  }, [sortBy, budget]);

  const handleSearch = () => doSearch();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Nav */}
      <div
        className="sticky top-0 z-10 px-4 safe-top pt-3 pb-3"
        style={{ backgroundColor: "var(--td-nav-bg, var(--td-bg))", borderBottom: "1px solid var(--td-separator)" }}
      >
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-[17px] active:opacity-70" style={{ color: "var(--td-accent)" }}>
            ‹ Home
          </button>
          <h1 className="text-[17px] font-semibold flex-1 text-center" style={{ color: "var(--td-label)" }}>
            Explore Trips
          </h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        {/* Search bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search destinations, activities..."
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

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto">
          <select
            value={budget}
            onChange={e => setBudget(e.target.value as BudgetLevel | "")}
            className="px-3 py-1.5 rounded-full text-[13px] bg-transparent focus:outline-none"
            style={{ backgroundColor: "var(--td-fill)", color: "var(--td-label)" }}
          >
            <option value="">All Budgets</option>
            <option value="budget">Budget</option>
            <option value="mid">Mid-range</option>
            <option value="splurge">Splurge</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1.5 rounded-full text-[13px] bg-transparent focus:outline-none"
            style={{ backgroundColor: "var(--td-fill)", color: "var(--td-label)" }}
          >
            <option value="newest">Newest</option>
            <option value="most_cloned">Most Cloned</option>
            <option value="highest_rated">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 px-4 pt-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center pt-16">
            <svg className="animate-spin w-7 h-7" fill="none" viewBox="0 0 24 24" style={{ color: "var(--td-accent)" }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
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
            {trips.map(trip => {
              const days = daysBetween(trip.start_date, trip.end_date);
              const formData = trip.form_data;
              return (
                <button
                  key={trip.id}
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  className="rounded-2xl overflow-hidden shadow-sm text-left active:opacity-70 reveal tilt-hover"
                  style={{ backgroundColor: "var(--td-card)" }}
                >
                  {/* Cover photo or gradient */}
                  <div
                    className="h-28 flex items-end px-4 pb-3"
                    style={{
                      background: trip.cover_photo_url
                        ? `url(${trip.cover_photo_url}) center/cover`
                        : `linear-gradient(135deg, var(--td-accent), var(--td-fill))`,
                    }}
                  >
                    <h3 className="text-[18px] font-bold text-white drop-shadow-md truncate">
                      {trip.title}
                    </h3>
                  </div>

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

                    {/* Vibes */}
                    {formData?.vibes?.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {formData.vibes.map((v: string) => (
                          <span key={v} className="text-[11px] px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "var(--td-fill)", color: "var(--td-secondary)" }}>
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA for logged-in users */}
      {user && (
        <div className="px-4 pb-8 safe-bottom">
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
