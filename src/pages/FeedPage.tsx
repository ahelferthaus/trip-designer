import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { getFeed } from "../lib/social";
import type { FeedItem } from "../lib/social";
import UserAvatar from "../components/UserAvatar";
import { useReveal } from "../lib/useReveal";

const ACTION_LABELS: Record<string, string> = {
  published: "published a trip",
  cloned: "cloned a trip",
  commented: "commented on",
  liked: "liked",
  followed: "started following someone",
};

const ACTION_ICONS: Record<string, string> = {
  published: "🌍",
  cloned: "📋",
  commented: "💬",
  liked: "❤️",
  followed: "👤",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function FeedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  useReveal();
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    getFeed(user.id).then(items => {
      setFeed(items);
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Nav */}
      <div className="sticky top-0 z-10 px-4 safe-top pt-3 pb-3"
        style={{ backgroundColor: "var(--td-nav-bg, var(--td-bg))", borderBottom: "1px solid var(--td-separator)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-[17px] active:opacity-70" style={{ color: "var(--td-accent)" }}>
            ‹ Home
          </button>
          <h1 className="text-[17px] font-semibold flex-1 text-center" style={{ color: "var(--td-label)" }}>
            Feed
          </h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="flex-1 px-4 pt-4 pb-8">
        {!user ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-[20px] font-semibold mb-2" style={{ color: "var(--td-label)" }}>
              Sign in to see your feed
            </h3>
            <p className="text-[15px] mb-6" style={{ color: "var(--td-secondary)" }}>
              Follow other travelers to see their trips.
            </p>
            <button onClick={() => navigate("/auth")}
              className="px-6 py-3 rounded-2xl text-[17px] font-semibold active:opacity-70"
              style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}>
              Sign In
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center pt-16">
            <svg className="animate-spin w-7 h-7" fill="none" viewBox="0 0 24 24" style={{ color: "var(--td-accent)" }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : feed.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-[20px] font-semibold mb-2" style={{ color: "var(--td-label)" }}>
              Your feed is empty
            </h3>
            <p className="text-[15px] mb-6" style={{ color: "var(--td-secondary)" }}>
              Follow travelers on the Explore page to see their activity here.
            </p>
            <button onClick={() => navigate("/explore")}
              className="px-6 py-3 rounded-2xl text-[17px] font-semibold active:opacity-70"
              style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}>
              Explore Trips
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {feed.map(item => (
              <button
                key={item.id}
                onClick={() => item.trip_id ? navigate(`/trip/${item.trip_id}`) : undefined}
                className="rounded-2xl px-4 py-3 text-left active:opacity-70 shadow-sm reveal"
                style={{ backgroundColor: "var(--td-card)" }}
              >
                <div className="flex items-start gap-3">
                  <UserAvatar
                    name={item.actor_name}
                    size="sm"
                    showLabel={false}
                    onClick={() => navigate(`/profile/${item.actor_id}`)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px]" style={{ color: "var(--td-label)" }}>
                      <span className="font-semibold">{item.actor_name}</span>
                      {" "}{ACTION_LABELS[item.action_type] ?? item.action_type}
                    </p>
                    {item.trip_title && (
                      <p className="text-[13px] mt-0.5 truncate" style={{ color: "var(--td-accent)" }}>
                        {ACTION_ICONS[item.action_type]} {item.trip_title}
                        {item.trip_destination ? ` — ${item.trip_destination}` : ""}
                      </p>
                    )}
                    {item.action_type === "commented" && typeof item.metadata.body === "string" && item.metadata.body && (
                      <p className="text-[13px] mt-0.5 italic" style={{ color: "var(--td-secondary)" }}>
                        "{item.metadata.body}"
                      </p>
                    )}
                    <p className="text-[11px] mt-1" style={{ color: "var(--td-secondary)" }}>
                      {timeAgo(item.created_at)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
