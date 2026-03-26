import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../store/themeStore";
import { useAuth } from "../store/authStore";
import { loadSavedTrips } from "../lib/tripStorage";
import UserAvatar from "../components/UserAvatar";
import PlanTripButton from "../components/PlanTripButton";
import { StreakDisplay, XPProgressBar, BadgeShowcase, DailyRewardModal } from "../components/gamification";
import { useGamification, useDailyCheckIn } from "../store/gamificationStore";

export default function HomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const savedCount = loadSavedTrips().length;
  const dailyCheckIn = useDailyCheckIn();
  const { currentStreak, badges } = useGamification();
  const unlockedBadges = badges.filter(b => b.unlockedAt).length;

  // Daily check-in on mount
  useEffect(() => {
    if (user) dailyCheckIn();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col pb-20" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Daily reward modal */}
      {user && <DailyRewardModal />}

      <div className="h-10" />

      {/* Top-right buttons */}
      <div className="px-6 flex justify-end gap-2 items-center">
        {user ? (
          <div className="flex items-center gap-2">
            <UserAvatar
              name={profile?.display_name || user.email?.split("@")[0] || "U"}
              profile={profile}
              size="sm"
              showLabel={false}
              onClick={() => navigate(`/profile/${user.id}`)}
            />
            <button
              onClick={() => signOut()}
              className="text-[13px] px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "var(--td-card)", color: "var(--td-secondary)" }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="text-[13px] px-3 py-1.5 rounded-full"
            style={{ backgroundColor: "var(--td-card)", color: "var(--td-accent)" }}
          >
            Sign In
          </button>
        )}
        <button
          onClick={() => navigate("/theme")}
          className="text-[13px] px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "var(--td-card)", color: "var(--td-secondary)" }}
        >
          🎨 {theme.film === "Default" ? "Theme" : theme.film.split(" ").slice(0, 2).join(" ")}
        </button>
        <button
          onClick={() => navigate("/settings")}
          className="text-[13px] px-3 py-1.5 rounded-full"
          style={{ backgroundColor: "var(--td-card)", color: "var(--td-secondary)" }}
        >
          ⚙️
        </button>
      </div>

      <div className="px-6 pt-4 pb-4">
        <p className="text-base mb-1" style={{ color: "var(--td-secondary)" }}>Welcome to</p>
        <h1 className="text-4xl font-black tracking-tight" style={{ color: "var(--td-label)" }}>
          VYBR
        </h1>
        <p className="text-base mt-2 leading-relaxed" style={{ color: "var(--td-secondary)" }}>
          AI-powered itineraries. Plan together.
        </p>
      </div>

      {/* Gamification section (logged-in users only) */}
      {user && (
        <div className="px-4 flex flex-col gap-3 mb-4 stagger-children">
          {/* Streak */}
          {currentStreak > 0 && <StreakDisplay />}

          {/* XP Progress */}
          <XPProgressBar />

          {/* Quick stats */}
          <div className="flex gap-3">
            <div className="flex-1 rounded-2xl px-4 py-3 text-center"
              style={{ backgroundColor: "var(--td-card)" }}>
              <div className="text-[20px] font-bold" style={{ color: "var(--td-label)" }}>{savedCount}</div>
              <div className="text-[11px]" style={{ color: "var(--td-secondary)" }}>Trips</div>
            </div>
            <div className="flex-1 rounded-2xl px-4 py-3 text-center"
              style={{ backgroundColor: "var(--td-card)" }}>
              <div className="text-[20px] font-bold" style={{ color: "var(--td-label)" }}>{unlockedBadges}</div>
              <div className="text-[11px]" style={{ color: "var(--td-secondary)" }}>Badges</div>
            </div>
            <div className="flex-1 rounded-2xl px-4 py-3 text-center"
              style={{ backgroundColor: "var(--td-card)" }}>
              <div className="text-[20px] font-bold" style={{ color: "var(--td-label)" }}>{currentStreak}</div>
              <div className="text-[11px]" style={{ color: "var(--td-secondary)" }}>Streak</div>
            </div>
          </div>
        </div>
      )}

      {/* Feature cards */}
      <div className="px-4 flex flex-col gap-3 mb-4 stagger-children">
        {[
          { icon: "🤖", title: "AI Itinerary", desc: "Day-by-day plans with real options for your group" },
          { icon: "🗳️", title: "Vote Together", desc: "Everyone picks their favorite activities" },
          { icon: "📸", title: "Trip Photos", desc: "Capture moments at every stop, share with your group" },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="rounded-2xl px-4 py-4 flex items-center gap-4 shadow-sm card-hover"
            style={{ backgroundColor: "var(--td-card)" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: "var(--td-bg)" }}>
              {icon}
            </div>
            <div>
              <div className="font-semibold text-[15px]" style={{ color: "var(--td-label)" }}>{title}</div>
              <div className="text-[13px] leading-snug mt-0.5" style={{ color: "var(--td-secondary)" }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Badge showcase (if any unlocked) */}
      {user && unlockedBadges > 0 && (
        <div className="px-4 mb-4">
          <BadgeShowcase />
        </div>
      )}

      <div className="flex-1" />

      {/* CTAs */}
      <div className="px-4 pb-24 safe-bottom flex flex-col gap-3">
        <PlanTripButton onClick={() => navigate("/intake")} size="large" />
        {savedCount > 0 && (
          <button
            onClick={() => navigate("/trips")}
            className="w-full py-4 rounded-2xl text-[17px] font-semibold active:opacity-70 transition-opacity"
            style={{ backgroundColor: "var(--td-card)", color: "var(--td-accent)" }}
          >
            My Trips ({savedCount})
          </button>
        )}
        <p className="text-center text-[13px]" style={{ color: "var(--td-secondary)" }}>
          {user ? user.email : "No account needed to get started"}
        </p>
      </div>
    </div>
  );
}
