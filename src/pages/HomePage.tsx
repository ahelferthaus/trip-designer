import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { loadSavedTrips } from "../lib/tripStorage";
import type { SavedTrip } from "../lib/tripStorage";
import UserAvatar from "../components/UserAvatar";
import { useGamification, useDailyCheckIn } from "../store/gamificationStore";
import { StreakDisplay, XPProgressBar, BadgeShowcase } from "../components/gamification";
import { useReveal } from "../lib/useReveal";
import MapHero3D from "../components/itinerary/MapHero3D";

const FEATURED_PHOTOS = [
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80", // Paris
  "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=600&q=80", // Santorini
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80", // Mountains
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80", // Beach
  "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", // Kyoto
  "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80", // Rome
];

const INSPIRATION = [
  { title: "Weekend in Paris", dest: "Paris", img: FEATURED_PHOTOS[0], days: 3, vibe: "Culture & Romance" },
  { title: "Santorini Escape", dest: "Santorini", img: FEATURED_PHOTOS[1], days: 5, vibe: "Beach & Food" },
  { title: "Alpine Adventure", dest: "Swiss Alps", img: FEATURED_PHOTOS[2], days: 7, vibe: "Adventure & Nature" },
  { title: "Tropical Paradise", dest: "Maldives", img: FEATURED_PHOTOS[3], days: 5, vibe: "Relaxation" },
  { title: "Kyoto Culture", dest: "Kyoto", img: FEATURED_PHOTOS[4], days: 7, vibe: "Culture & Food" },
  { title: "Roman Holiday", dest: "Rome", img: FEATURED_PHOTOS[5], days: 5, vibe: "Culture & History" },
];

function daysBetween(start: string, end: string) {
  return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000));
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const savedTrips = loadSavedTrips();
  const dailyCheckIn = useDailyCheckIn();
  const { enabled: gamificationEnabled, currentStreak, badges } = useGamification();
  const unlockedBadges = badges.filter(b => b.unlockedAt).length;

  useReveal();

  useEffect(() => {
    if (user) dailyCheckIn();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col pb-28 page-enter" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* === 3D MAP HERO === */}
      <MapHero3D
        destination={savedTrips.length > 0 ? savedTrips[0].destination : "Europe"}
        height={360}
        title={user ? `Welcome back${profile?.display_name ? `, ${profile.display_name.split(" ")[0]}` : ""}` : "Plan your next adventure"}
        subtitle={user && savedTrips.length > 0
          ? `${savedTrips.length} trip${savedTrips.length !== 1 ? "s" : ""} planned`
          : "AI-powered itineraries for every kind of traveler"}
      >
        {/* Top bar — overlaid on the map */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 pt-14 pb-2">
          <div>
            {user ? (
              <button onClick={() => navigate(`/profile/${user.id}`)} className="flex items-center gap-2.5 active:opacity-70">
                <UserAvatar name={profile?.display_name || user.email?.split("@")[0] || "U"} profile={profile} size="sm" showLabel={false} />
                <span className="text-[14px] font-medium text-white/80">
                  {profile?.display_name || user.email?.split("@")[0]}
                </span>
              </button>
            ) : (
              <button onClick={() => navigate("/auth")} className="text-[14px] font-medium px-4 py-2 rounded-full active:opacity-70"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}>
                Sign In
              </button>
            )}
          </div>
          <button onClick={() => navigate("/settings")} className="w-9 h-9 rounded-full flex items-center justify-center active:opacity-70"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          </button>
        </div>
      </MapHero3D>

      {/* CTA — just below the map */}
      <div className="px-5 -mt-6 relative z-10">
        <button
          onClick={() => navigate("/intake")}
          className="w-full py-4 rounded-2xl text-[17px] font-bold btn-spring shadow-lg"
          style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
        >
          {user && savedTrips.length > 0 ? "Plan another trip" : "Plan my first trip"}
        </button>
      </div>

      {/* === GAMIFICATION (opt-in) === */}
      {user && gamificationEnabled && (
        <div className="px-4 pt-4 flex flex-col gap-3">
          {currentStreak > 0 && <StreakDisplay />}
          <XPProgressBar />
          {unlockedBadges > 0 && <BadgeShowcase />}
        </div>
      )}

      {/* === YOUR TRIPS — Polarsteps-style horizontal scroll === */}
      {user && savedTrips.length > 0 && (
        <div className="pt-5">
          <div className="flex items-center justify-between px-5 mb-3">
            <h2 className="text-[18px] font-bold" style={{ color: "var(--td-label)" }}>Your Trips</h2>
            <button onClick={() => navigate("/trips")} className="text-[14px] font-semibold active:opacity-70" style={{ color: "var(--td-accent)" }}>
              See all
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar px-5">
            {savedTrips.slice(0, 8).map((trip: SavedTrip) => (
              <button
                key={trip.id}
                onClick={() => navigate(trip.cloudTripId ? `/trip/${trip.cloudTripId}` : "/trips")}
                className="flex-shrink-0 w-[200px] rounded-2xl overflow-hidden shadow-md active:opacity-70"
                style={{ backgroundColor: "var(--td-card)" }}
              >
                <div className="h-28 flex items-end px-3 pb-2"
                  style={{ background: "linear-gradient(135deg, var(--td-accent), var(--td-nav-bg))" }}>
                  <span className="text-[14px] font-bold text-white drop-shadow-md line-clamp-2">{trip.title}</span>
                </div>
                <div className="px-3 py-2.5">
                  <div className="text-[12px] font-medium" style={{ color: "var(--td-secondary)" }}>
                    📍 {trip.destination}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: "var(--td-secondary)" }}>
                    {daysBetween(trip.start_date, trip.end_date)} days · {trip.form?.vibes?.slice(0, 2).join(", ") || ""}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* === INSPIRATION — full-bleed photo grid, no empty space === */}
      <div className="pt-5">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="text-[18px] font-bold" style={{ color: "var(--td-label)" }}>Get Inspired</h2>
          <button onClick={() => navigate("/explore")} className="text-[14px] font-semibold active:opacity-70" style={{ color: "var(--td-accent)" }}>
            Explore all
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 px-4">
          {INSPIRATION.map((item, i) => (
            <button
              key={item.dest}
              onClick={() => navigate("/explore")}
              className={`rounded-2xl overflow-hidden relative active:opacity-70 ${i === 0 ? "col-span-2 h-48" : "h-36"}`}
            >
              <img src={item.img} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
              <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
                <div className="text-[15px] font-bold text-white drop-shadow-md">{item.title}</div>
                <div className="text-[11px] text-white/70">{item.days} days · {item.vibe}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* === HOW IT WORKS (logged-out only) === */}
      {!user && (
        <div className="px-5 pt-6">
          <h2 className="text-[18px] font-bold mb-3" style={{ color: "var(--td-label)" }}>How it works</h2>
          <div className="flex flex-col gap-2.5">
            {[
              { icon: "🗺️", title: "Describe your trip", desc: "Destination, dates, group, budget, and vibe" },
              { icon: "🤖", title: "AI builds your itinerary", desc: "Morning, afternoon, and evening options for every day" },
              { icon: "🗳️", title: "Plan together", desc: "Your group votes, writes in ideas, and books what's confirmed" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl px-4 py-3.5 flex items-start gap-3.5" style={{ backgroundColor: "var(--td-card)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[20px] flex-shrink-0" style={{ backgroundColor: "var(--td-fill)" }}>
                  {icon}
                </div>
                <div>
                  <div className="font-semibold text-[15px]" style={{ color: "var(--td-label)" }}>{title}</div>
                  <div className="text-[13px] leading-snug mt-0.5" style={{ color: "var(--td-secondary)" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === QUICK ACTIONS — no dead space === */}
      <div className="px-4 pt-5 flex flex-col gap-2.5">
        <button onClick={() => navigate("/explore")} className="w-full py-4 rounded-2xl text-[15px] font-semibold active:opacity-70 flex items-center justify-center gap-2"
          style={{ backgroundColor: "var(--td-card)", color: "var(--td-accent)" }}>
          🌍 Explore Public Trips
        </button>
        {user && (
          <button onClick={() => navigate("/unpacked")} className="w-full py-4 rounded-2xl text-[15px] font-semibold active:opacity-70 flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--td-card)", color: "var(--td-accent)" }}>
            📦 VYBR Unpacked — Year in Review
          </button>
        )}
        {!user && (
          <button onClick={() => navigate("/auth")} className="w-full py-4 rounded-2xl text-[17px] font-bold active:opacity-70"
            style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}>
            Create Account
          </button>
        )}
      </div>
    </div>
  );
}
