import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { loadSavedTrips } from "../lib/tripStorage";
import UserAvatar from "../components/UserAvatar";
import { useGamification, useDailyCheckIn } from "../store/gamificationStore";
import { StreakDisplay, XPProgressBar, BadgeShowcase } from "../components/gamification";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const savedCount = loadSavedTrips().length;
  const dailyCheckIn = useDailyCheckIn();
  const { enabled: gamificationEnabled, currentStreak, badges } = useGamification();
  const unlockedBadges = badges.filter(b => b.unlockedAt).length;

  useEffect(() => {
    if (user) dailyCheckIn();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Hero section */}
      <div
        className="relative px-6 pt-14 pb-10"
        style={{
          background: "linear-gradient(160deg, var(--td-accent), color-mix(in srgb, var(--td-accent) 60%, #000))",
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            {user ? (
              <div className="flex items-center gap-2.5">
                <UserAvatar
                  name={profile?.display_name || user.email?.split("@")[0] || "U"}
                  profile={profile}
                  size="sm"
                  showLabel={false}
                  onClick={() => navigate(`/profile/${user.id}`)}
                />
                <span className="text-[14px] font-medium text-white/90">
                  {profile?.display_name || user.email?.split("@")[0]}
                </span>
              </div>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="text-[14px] font-medium px-4 py-2 rounded-full active:opacity-70"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
              >
                Sign In
              </button>
            )}
          </div>
          <button
            onClick={() => navigate("/settings")}
            className="w-9 h-9 rounded-full flex items-center justify-center active:opacity-70"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            <span className="text-white text-[15px]">⚙️</span>
          </button>
        </div>

        {/* Hero text */}
        <h1 className="text-[42px] font-black tracking-tight leading-[1.05] text-white mb-3">
          VYBR
        </h1>
        <p className="text-[17px] leading-relaxed text-white/80 max-w-xs">
          Plan trips with AI. Vote with your group. Share the adventure.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/intake")}
          className="mt-6 w-full py-4 rounded-2xl text-[17px] font-bold active:opacity-90 transition-all"
          style={{
            backgroundColor: "white",
            color: "var(--td-accent)",
          }}
        >
          Plan a Trip
        </button>
      </div>

      {/* Stats row (logged-in only) */}
      {user && savedCount > 0 && (
        <div className="px-4 -mt-5">
          <div
            className="rounded-2xl px-5 py-4 flex items-center justify-around shadow-md"
            style={{ backgroundColor: "var(--td-card)" }}
          >
            <button onClick={() => navigate("/trips")} className="text-center active:opacity-70">
              <div className="text-[22px] font-bold" style={{ color: "var(--td-label)" }}>{savedCount}</div>
              <div className="text-[11px] font-medium" style={{ color: "var(--td-secondary)" }}>Trips</div>
            </button>
            <div className="w-px h-8" style={{ backgroundColor: "var(--td-separator)" }} />
            <button onClick={() => navigate("/explore")} className="text-center active:opacity-70">
              <div className="text-[22px] font-bold" style={{ color: "var(--td-label)" }}>🌍</div>
              <div className="text-[11px] font-medium" style={{ color: "var(--td-secondary)" }}>Explore</div>
            </button>
            <div className="w-px h-8" style={{ backgroundColor: "var(--td-separator)" }} />
            <button onClick={() => navigate("/feed")} className="text-center active:opacity-70">
              <div className="text-[22px] font-bold" style={{ color: "var(--td-label)" }}>📡</div>
              <div className="text-[11px] font-medium" style={{ color: "var(--td-secondary)" }}>Feed</div>
            </button>
          </div>
        </div>
      )}

      {/* Gamification (opt-in via Settings) */}
      {user && gamificationEnabled && (
        <div className="px-4 pt-4 flex flex-col gap-3">
          {currentStreak > 0 && <StreakDisplay />}
          <XPProgressBar />
          {unlockedBadges > 0 && <BadgeShowcase />}
        </div>
      )}

      {/* How it works */}
      <div className="px-4 pt-6 flex flex-col gap-3">
        <p className="text-[12px] uppercase tracking-widest px-1 font-semibold" style={{ color: "var(--td-secondary)" }}>
          How it works
        </p>
        {[
          { step: "1", title: "Describe your trip", desc: "Destination, dates, group, budget, and vibe" },
          { step: "2", title: "AI builds your itinerary", desc: "Morning, afternoon, and evening options for every day" },
          { step: "3", title: "Plan together", desc: "Your group votes, writes in ideas, and books what's confirmed" },
        ].map(({ step, title, desc }) => (
          <div key={step} className="rounded-2xl px-4 py-4 flex items-start gap-4"
            style={{ backgroundColor: "var(--td-card)" }}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold flex-shrink-0"
              style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
            >
              {step}
            </div>
            <div className="pt-0.5">
              <div className="font-semibold text-[15px]" style={{ color: "var(--td-label)" }}>{title}</div>
              <div className="text-[13px] leading-snug mt-0.5" style={{ color: "var(--td-secondary)" }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent trips preview */}
      {savedCount > 0 && (
        <div className="px-4 pt-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-[12px] uppercase tracking-widest font-semibold" style={{ color: "var(--td-secondary)" }}>
              Your trips
            </p>
            <button onClick={() => navigate("/trips")} className="text-[13px] font-medium active:opacity-70"
              style={{ color: "var(--td-accent)" }}>
              See all ›
            </button>
          </div>
          <button
            onClick={() => navigate("/trips")}
            className="w-full rounded-2xl px-4 py-4 text-left active:opacity-70"
            style={{ backgroundColor: "var(--td-card)" }}
          >
            <div className="text-[15px] font-semibold" style={{ color: "var(--td-label)" }}>
              {savedCount} trip{savedCount !== 1 ? "s" : ""} planned
            </div>
            <div className="text-[13px] mt-0.5" style={{ color: "var(--td-secondary)" }}>
              Tap to view and manage your trips
            </div>
          </button>
        </div>
      )}

      <div className="flex-1" />

      {/* Footer */}
      {!user && (
        <div className="px-4 pt-6 pb-24 safe-bottom">
          <button
            onClick={() => navigate("/explore")}
            className="w-full py-4 rounded-2xl text-[17px] font-semibold active:opacity-70"
            style={{ backgroundColor: "var(--td-card)", color: "var(--td-accent)" }}
          >
            Explore Public Trips
          </button>
          <p className="text-center text-[13px] mt-3" style={{ color: "var(--td-secondary)" }}>
            No account needed to get started
          </p>
        </div>
      )}
    </div>
  );
}
