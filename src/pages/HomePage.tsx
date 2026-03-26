import { useNavigate } from "react-router-dom";
import { useTheme } from "../store/themeStore";
import { useAuth } from "../store/authStore";
import { loadSavedTrips } from "../lib/tripStorage";
import UserAvatar from "../components/UserAvatar";

export default function HomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, profile, signOut } = useAuth();
  const savedCount = loadSavedTrips().length;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--td-bg)" }}>
      <div className="h-14" />

      {/* Top-right buttons */}
      <div className="px-6 flex justify-end gap-2 items-center">
        {user ? (
          <div className="flex items-center gap-2">
            <UserAvatar
              name={profile?.display_name || user.email?.split("@")[0] || "U"}
              profile={profile}
              size="sm"
              showLabel={false}
              onClick={() => navigate("/settings")}
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

      <div className="px-6 pt-6 pb-6">
        <p className="text-base mb-1" style={{ color: "var(--td-secondary)" }}>Welcome to</p>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: "var(--td-label)" }}>
          VYBR
        </h1>
        <p className="text-base mt-2 leading-relaxed" style={{ color: "var(--td-secondary)" }}>
          AI-powered itineraries. Plan together.
        </p>
      </div>

      <div className="px-4 flex flex-col gap-3 mb-6">
        {[
          { icon: "🤖", title: "AI Itinerary", desc: "Day-by-day plans with real options for your group" },
          { icon: "🗳️", title: "Vote Together", desc: "Everyone picks their favorite activities" },
          { icon: "✂️", title: "Split Days", desc: "Different plans for different people, reunite for dinner" },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="rounded-2xl px-4 py-4 flex items-center gap-4 shadow-sm"
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

      <div className="flex-1" />

      <div className="px-4 pb-8 safe-bottom flex flex-col gap-3">
        <button
          onClick={() => navigate("/intake")}
          className="w-full py-4 rounded-2xl text-[17px] font-semibold active:opacity-70 transition-opacity"
          style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
        >
          Plan a Trip
        </button>
        <button
          onClick={() => navigate("/explore")}
          className="w-full py-4 rounded-2xl text-[17px] font-semibold active:opacity-70 transition-opacity"
          style={{ backgroundColor: "var(--td-card)", color: "var(--td-accent)" }}
        >
          Explore Public Trips
        </button>
        {user && (
          <button
            onClick={() => navigate("/feed")}
            className="w-full py-4 rounded-2xl text-[17px] font-semibold active:opacity-70 transition-opacity"
            style={{ backgroundColor: "var(--td-card)", color: "var(--td-accent)" }}
          >
            My Feed
          </button>
        )}
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
