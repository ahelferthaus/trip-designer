import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { loadSavedTrips } from "../lib/tripStorage";
import type { SavedTrip } from "../lib/tripStorage";

interface YearStats {
  year: number;
  totalTrips: number;
  totalDays: number;
  destinations: string[];
  countries: string[];
  topVibes: { vibe: string; count: number }[];
  totalActivities: number;
  avgGroupSize: number;
  longestTrip: { destination: string; days: number } | null;
  monthsActive: number;
}

function computeYearStats(trips: SavedTrip[], year: number): YearStats {
  const yearTrips = trips.filter(t => {
    const tripYear = new Date(t.start_date).getFullYear();
    return tripYear === year;
  });

  const destinations = [...new Set(yearTrips.map(t => t.destination).filter(Boolean))];
  const countries = [...new Set(
    destinations.map(d => {
      const parts = d.split(",").map(p => p.trim());
      return parts[parts.length - 1];
    })
  )];

  // Count vibes
  const vibeCounts = new Map<string, number>();
  for (const trip of yearTrips) {
    for (const vibe of trip.form?.vibes ?? []) {
      vibeCounts.set(vibe, (vibeCounts.get(vibe) || 0) + 1);
    }
  }
  const topVibes = [...vibeCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([vibe, count]) => ({ vibe, count }));

  // Total days
  let totalDays = 0;
  let longestTrip: { destination: string; days: number } | null = null;
  for (const trip of yearTrips) {
    const days = Math.max(1, Math.round(
      (new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24)
    ));
    totalDays += days;
    if (!longestTrip || days > longestTrip.days) {
      longestTrip = { destination: trip.destination, days };
    }
  }

  // Total activities
  let totalActivities = 0;
  for (const trip of yearTrips) {
    for (const day of trip.itinerary?.days ?? []) {
      totalActivities += day.slots?.length ?? 0;
    }
  }

  // Avg group size
  const avgGroupSize = yearTrips.length > 0
    ? Math.round(yearTrips.reduce((sum, t) => sum + (t.form?.group_members?.length ?? 1), 0) / yearTrips.length)
    : 0;

  // Months active
  const activeMonths = new Set(yearTrips.map(t => new Date(t.start_date).getMonth()));

  return {
    year,
    totalTrips: yearTrips.length,
    totalDays,
    destinations,
    countries,
    topVibes,
    totalActivities,
    avgGroupSize,
    longestTrip,
    monthsActive: activeMonths.size,
  };
}

const VIBE_EMOJIS: Record<string, string> = {
  relaxed: "🏖️", adventure: "🧗", culture: "🏛️", food: "🍷",
  nightlife: "🎵", nature: "🏔️", family: "👨‍👩‍👧", romance: "💑",
};

export default function UnpackedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<YearStats | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trips = loadSavedTrips();
    setStats(computeYearStats(trips, selectedYear));
  }, [selectedYear]);

  const availableYears = (() => {
    const trips = loadSavedTrips();
    const years = [...new Set(trips.map(t => new Date(t.start_date).getFullYear()))];
    return years.sort((a, b) => b - a);
  })();

  if (!stats || stats.totalTrips === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 page-enter" style={{ backgroundColor: "var(--td-bg)" }}>
        <div className="text-5xl mb-4">📦</div>
        <h2 className="text-[22px] font-bold mb-2" style={{ color: "var(--td-label)" }}>
          Nothing to unpack yet
        </h2>
        <p className="text-[15px] text-center mb-6" style={{ color: "var(--td-secondary)" }}>
          Plan some trips and come back to see your year in review!
        </p>
        <button
          onClick={() => navigate("/intake")}
          className="px-6 py-3 rounded-2xl text-[17px] font-semibold active:opacity-70"
          style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
        >
          Plan a Trip
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 page-enter" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Header */}
      <div className="px-4 safe-top pt-3 pb-2 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-[17px]" style={{ color: "var(--td-accent)" }}>
          ‹ Back
        </button>
        {availableYears.length > 1 && (
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className="text-[15px] bg-transparent focus:outline-none"
            style={{ color: "var(--td-accent)" }}
          >
            {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        )}
      </div>

      {/* Shareable card */}
      <div ref={cardRef} className="mx-4 mt-4 rounded-3xl overflow-hidden shadow-lg" style={{ backgroundColor: "var(--td-card)" }}>
        {/* Hero section */}
        <div
          className="px-6 pt-8 pb-6 text-center"
          style={{ background: "linear-gradient(135deg, var(--td-accent), var(--td-nav-bg))" }}
        >
          <p className="text-[13px] uppercase tracking-widest font-bold mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>
            VYBR Unpacked
          </p>
          <h1 className="text-[40px] font-black text-white leading-tight">{selectedYear}</h1>
          {user && (
            <p className="text-[15px] mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
              {user.email?.split("@")[0]}'s year in travel
            </p>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-px" style={{ backgroundColor: "var(--td-separator)" }}>
          <StatBox number={stats.totalTrips} label="Trips" icon="✈️" />
          <StatBox number={stats.totalDays} label="Days traveled" icon="📅" />
          <StatBox number={stats.destinations.length} label="Destinations" icon="📍" />
          <StatBox number={stats.countries.length} label="Countries" icon="🌍" />
          <StatBox number={stats.totalActivities} label="Activities" icon="🎯" />
          <StatBox number={stats.avgGroupSize} label="Avg group size" icon="👥" />
        </div>

        {/* Longest trip */}
        {stats.longestTrip && (
          <div className="px-6 py-4" style={{ borderTop: "1px solid var(--td-separator)" }}>
            <p className="text-[11px] uppercase tracking-widest font-bold mb-1" style={{ color: "var(--td-secondary)" }}>
              Longest adventure
            </p>
            <p className="text-[17px] font-semibold" style={{ color: "var(--td-label)" }}>
              {stats.longestTrip.destination} — {stats.longestTrip.days} days
            </p>
          </div>
        )}

        {/* Top vibes */}
        {stats.topVibes.length > 0 && (
          <div className="px-6 py-4" style={{ borderTop: "1px solid var(--td-separator)" }}>
            <p className="text-[11px] uppercase tracking-widest font-bold mb-2" style={{ color: "var(--td-secondary)" }}>
              Your travel vibes
            </p>
            <div className="flex flex-wrap gap-2">
              {stats.topVibes.map(v => (
                <span
                  key={v.vibe}
                  className="px-3 py-1.5 rounded-full text-[13px] font-semibold"
                  style={{ backgroundColor: "var(--td-fill)", color: "var(--td-label)" }}
                >
                  {VIBE_EMOJIS[v.vibe] || "🌟"} {v.vibe} ({v.count})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Destinations list */}
        <div className="px-6 py-4" style={{ borderTop: "1px solid var(--td-separator)" }}>
          <p className="text-[11px] uppercase tracking-widest font-bold mb-2" style={{ color: "var(--td-secondary)" }}>
            Destinations visited
          </p>
          <p className="text-[15px]" style={{ color: "var(--td-label)" }}>
            {stats.destinations.join(" · ")}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 text-center" style={{ borderTop: "1px solid var(--td-separator)" }}>
          <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--td-secondary)" }}>
            Active {stats.monthsActive} month{stats.monthsActive !== 1 ? "s" : ""} out of 12
          </p>
        </div>
      </div>

      {/* Share button */}
      <div className="px-4 mt-6">
        <button
          onClick={async () => {
            if (!cardRef.current) return;
            try {
              const { default: html2canvas } = await import("html2canvas");
              const canvas = await html2canvas(cardRef.current, { scale: 2, useCORS: true });
              canvas.toBlob(blob => {
                if (!blob) return;
                if (navigator.share) {
                  const file = new File([blob], `vybr-unpacked-${selectedYear}.png`, { type: "image/png" });
                  navigator.share({ files: [file], title: `VYBR Unpacked ${selectedYear}` });
                } else {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `vybr-unpacked-${selectedYear}.png`;
                  a.click();
                  URL.revokeObjectURL(url);
                }
              });
            } catch {
              // Fallback: just download
            }
          }}
          className="w-full py-4 rounded-2xl text-[17px] font-semibold active:opacity-70"
          style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
        >
          Share Your Year
        </button>
      </div>
    </div>
  );
}

function StatBox({ number, label, icon }: { number: number; label: string; icon: string }) {
  return (
    <div className="px-4 py-4 text-center" style={{ backgroundColor: "var(--td-card)" }}>
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-[28px] font-black count-pop" style={{ color: "var(--td-label)" }}>
        {number}
      </div>
      <div className="text-[12px] font-medium" style={{ color: "var(--td-secondary)" }}>
        {label}
      </div>
    </div>
  );
}
