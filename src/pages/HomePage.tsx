import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { loadSavedTrips } from "../lib/tripStorage";
import UserAvatar from "../components/UserAvatar";
import { useGamification, useDailyCheckIn } from "../store/gamificationStore";
import { StreakDisplay, XPProgressBar, BadgeShowcase } from "../components/gamification";
import { useReveal } from "../lib/useReveal";

// Unsplash travel photos (free, no API key needed for static URLs)
const DEST_PHOTOS = [
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200&h=200&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&h=200&fit=crop&q=80",
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const savedCount = loadSavedTrips().length;
  const dailyCheckIn = useDailyCheckIn();
  const { enabled: gamificationEnabled, currentStreak, badges } = useGamification();
  const unlockedBadges = badges.filter(b => b.unlockedAt).length;

  useReveal();

  useEffect(() => {
    if (user) dailyCheckIn();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col pb-20 page-enter" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* === HERO === */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=70') center/cover",
          minHeight: 460,
        }}
      >
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-14 pb-2">
          <div>
            {user ? (
              <button
                onClick={() => navigate(`/profile/${user.id}`)}
                className="flex items-center gap-2.5 active:opacity-70"
              >
                <UserAvatar
                  name={profile?.display_name || user.email?.split("@")[0] || "U"}
                  profile={profile}
                  size="sm"
                  showLabel={false}
                />
                <span className="text-[14px] font-medium text-white/80">
                  {profile?.display_name || user.email?.split("@")[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="text-[14px] font-medium px-4 py-2 rounded-full active:opacity-70"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "white" }}
              >
                Sign In
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!user && (
              <button
                onClick={() => navigate("/auth")}
                className="text-[13px] font-medium text-white/60 active:opacity-70"
              >
                Skip
              </button>
            )}
            <button
              onClick={() => navigate("/settings")}
              className="w-8 h-8 rounded-full flex items-center justify-center active:opacity-70"
              style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </button>
          </div>
        </div>

        {/* Destination photo cards with route line */}
        <div className="relative z-10 flex items-center justify-center gap-3 px-6 mt-4 mb-2">
          {/* SVG route line behind the photos */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
            <path
              d="M 40 80 Q 100 20 150 60 Q 200 100 260 40"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            {/* Route dots */}
            <circle cx="40" cy="80" r="4" fill="rgba(255,255,255,0.5)" />
            <circle cx="150" cy="60" r="4" fill="rgba(255,255,255,0.5)" />
            <circle cx="260" cy="40" r="4" fill="rgba(255,255,255,0.5)" />
          </svg>

          {DEST_PHOTOS.map((url, i) => (
            <div
              key={i}
              className="relative z-10 w-24 h-24 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 breathe"
              style={{
                transform: `rotate(${(i - 1) * 5}deg) translateY(${i === 1 ? -8 : 4}px)`,
                border: "3px solid rgba(255,255,255,0.3)",
              }}
            >
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div
                className="absolute bottom-1 left-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "white" }}
              >
                {i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Headline */}
        <div className="relative z-10 px-6 mt-6">
          <h1 className="text-[32px] font-black leading-[1.1] text-white text-center">
            Every great trip{"\n"}starts with a plan
          </h1>
        </div>

        {/* Feature bullets */}
        <div className="relative z-10 px-8 mt-5 flex flex-col gap-3">
          {[
            { icon: "✦", text: "AI-powered day-by-day itineraries" },
            { icon: "✦", text: "Vote on activities with your group" },
            { icon: "✦", text: "Capture photos & share the journey" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="text-[12px] text-white/40">{icon}</span>
              <span className="text-[14px] text-white/75">{text}</span>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <div className="relative z-10 px-6 mt-6 pb-8">
          <button
            onClick={() => navigate("/intake")}
            className="w-full py-4 rounded-2xl text-[17px] font-bold btn-spring gradient-animate"
            style={{
              background: "linear-gradient(135deg, #E63956, #D42E4A, #E63956)",
              backgroundSize: "200% 200%",
              color: "white",
              boxShadow: "0 4px 20px rgba(230, 57, 86, 0.4)",
            }}
          >
            Plan my first trip
          </button>
        </div>
      </div>

      {/* === BELOW THE FOLD === */}

      {/* Stats row (logged-in only) */}
      {user && savedCount > 0 && (
        <div className="px-4 -mt-5 reveal">
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
              <div className="text-[16px] font-bold" style={{ color: "var(--td-label)" }}>Explore</div>
              <div className="text-[11px] font-medium" style={{ color: "var(--td-secondary)" }}>Discover</div>
            </button>
            <div className="w-px h-8" style={{ backgroundColor: "var(--td-separator)" }} />
            <button onClick={() => navigate("/feed")} className="text-center active:opacity-70">
              <div className="text-[16px] font-bold" style={{ color: "var(--td-label)" }}>Feed</div>
              <div className="text-[11px] font-medium" style={{ color: "var(--td-secondary)" }}>Friends</div>
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

      {/* How it works — only for new/logged-out users */}
      {!user && (
        <div className="px-4 pt-6 flex flex-col gap-2.5 reveal">
          <p className="text-[12px] uppercase tracking-widest px-1 font-semibold" style={{ color: "var(--td-secondary)" }}>
            How it works
          </p>
          {[
            { step: "1", title: "Describe your trip", desc: "Destination, dates, group, budget, and vibe" },
            { step: "2", title: "AI builds your itinerary", desc: "Morning, afternoon, and evening options for every day" },
            { step: "3", title: "Plan together", desc: "Your group votes, writes in ideas, and books what's confirmed" },
          ].map(({ step, title, desc }) => (
            <div key={step} className="rounded-2xl px-4 py-3.5 flex items-start gap-3.5"
              style={{ backgroundColor: "var(--td-card)" }}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
              >
                {step}
              </div>
              <div>
                <div className="font-semibold text-[15px]" style={{ color: "var(--td-label)" }}>{title}</div>
                <div className="text-[13px] leading-snug mt-0.5" style={{ color: "var(--td-secondary)" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent trips preview (logged-in) */}
      {user && savedCount > 0 && (
        <div className="px-4 pt-5">
          <div className="flex items-center justify-between mb-2.5 px-1">
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
              Tap to view and manage
            </div>
          </button>
        </div>
      )}

      <div className="flex-1" />

      {/* Footer actions */}
      <div className="px-4 pt-4 pb-24 safe-bottom flex flex-col gap-3">
        {!user && (
          <button
            onClick={() => navigate("/auth")}
            className="w-full py-4 rounded-2xl text-[17px] font-bold active:opacity-70"
            style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
          >
            Create Account
          </button>
        )}
        <button
          onClick={() => navigate("/explore")}
          className="w-full py-4 rounded-2xl text-[17px] font-semibold active:opacity-70"
          style={{ backgroundColor: "var(--td-card)", color: "var(--td-accent)" }}
        >
          Explore Public Trips
        </button>
        {!user && (
          <p className="text-center text-[13px] mt-1" style={{ color: "var(--td-secondary)" }}>
            No account needed to plan a trip
          </p>
        )}
      </div>
    </div>
  );
}
