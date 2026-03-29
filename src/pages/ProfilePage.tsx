import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useReveal } from "../lib/useReveal";
import { ProfileSkeleton } from "../components/Skeletons";
import {
  getPublicProfile,
  getFollowCounts,
  getFollowStatus,
  followUser,
  unfollowUser,
  getPublishedTripsForUser,
} from "../lib/social";
import UserAvatar from "../components/UserAvatar";
import type { UserProfile } from "../lib/types";

function daysBetween(start: string, end: string) {
  return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000));
}

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [followStatus, setFollowStatus] = useState<"none" | "pending" | "accepted">("none");
  const [trips, setTrips] = useState<Array<{ id: string; title: string; destination: string; start_date: string; end_date: string; likes_count: number; clone_count: number }>>([]);
  const [loading, setLoading] = useState(true);

  useReveal();
  const isOwnProfile = authUser?.id === userId;

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      getPublicProfile(userId),
      getFollowCounts(userId),
      getFollowStatus(userId),
      getPublishedTripsForUser(userId),
    ]).then(([p, c, fs, t]) => {
      setProfile(p);
      setCounts(c);
      setFollowStatus(fs);
      setTrips(t);
      setLoading(false);
    });
  }, [userId]);

  const handleFollow = async () => {
    if (!userId) return;
    if (followStatus === "none") {
      await followUser(userId);
      setFollowStatus(profile?.is_public === false ? "pending" : "accepted");
      setCounts(prev => ({ ...prev, followers: prev.followers + 1 }));
    } else {
      await unfollowUser(userId);
      setFollowStatus("none");
      setCounts(prev => ({ ...prev, followers: Math.max(0, prev.followers - 1) }));
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "var(--td-bg)" }}>
        <div className="text-4xl mb-4">👤</div>
        <h2 className="text-[22px] font-bold mb-2" style={{ color: "var(--td-label)" }}>User not found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-[17px]" style={{ color: "var(--td-accent)" }}>Go back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Nav */}
      <div className="sticky top-0 z-10 px-4 safe-top pt-3 pb-3"
        style={{ backgroundColor: "var(--td-nav-bg, var(--td-bg))", borderBottom: "1px solid var(--td-separator)" }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[17px] active:opacity-70" style={{ color: "var(--td-accent)" }}>
            ‹ Back
          </button>
          <h1 className="text-[17px] font-semibold flex-1 text-center" style={{ color: "var(--td-label)" }}>
            Profile
          </h1>
          <div className="w-12" />
        </div>
      </div>

      {/* Profile header */}
      <div className="px-4 pt-6 pb-4 flex flex-col items-center text-center">
        <UserAvatar name={profile.display_name || "?"} profile={profile} size="lg" showLabel={false} />
        <h2 className="text-[22px] font-bold mt-3" style={{ color: "var(--td-label)" }}>
          {profile.display_name || "Anonymous"}
        </h2>
        {(profile as UserProfile & { bio?: string }).bio && (
          <p className="text-[14px] mt-1 max-w-xs" style={{ color: "var(--td-secondary)" }}>
            {(profile as UserProfile & { bio?: string }).bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex gap-8 mt-4">
          <div className="text-center">
            <div className="text-[18px] font-bold" style={{ color: "var(--td-label)" }}>{trips.length}</div>
            <div className="text-[12px]" style={{ color: "var(--td-secondary)" }}>Trips</div>
          </div>
          <div className="text-center">
            <div className="text-[18px] font-bold" style={{ color: "var(--td-label)" }}>{counts.followers}</div>
            <div className="text-[12px]" style={{ color: "var(--td-secondary)" }}>Followers</div>
          </div>
          <div className="text-center">
            <div className="text-[18px] font-bold" style={{ color: "var(--td-label)" }}>{counts.following}</div>
            <div className="text-[12px]" style={{ color: "var(--td-secondary)" }}>Following</div>
          </div>
        </div>

        {/* Follow button */}
        {authUser && !isOwnProfile && (
          <button
            onClick={handleFollow}
            className="mt-4 px-8 py-2.5 rounded-2xl text-[15px] font-semibold active:opacity-70"
            style={{
              backgroundColor: followStatus === "accepted" ? "var(--td-fill)" : "var(--td-accent)",
              color: followStatus === "accepted" ? "var(--td-label)" : "var(--td-accent-text)",
            }}
          >
            {followStatus === "accepted" ? "Following" : followStatus === "pending" ? "Requested" : "Follow"}
          </button>
        )}

        {isOwnProfile && (
          <button
            onClick={() => navigate("/settings")}
            className="mt-4 px-6 py-2.5 rounded-2xl text-[15px] font-semibold active:opacity-70"
            style={{ backgroundColor: "var(--td-fill)", color: "var(--td-label)" }}
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Published trips */}
      <div className="px-4 pt-2 pb-8">
        <p className="text-[12px] uppercase tracking-wide mb-3" style={{ color: "var(--td-secondary)" }}>
          Published Trips
        </p>
        {trips.length === 0 ? (
          <p className="text-[14px] text-center py-8" style={{ color: "var(--td-secondary)" }}>
            No published trips yet
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {trips.map(trip => (
              <button
                key={trip.id}
                onClick={() => navigate(`/trip/${trip.id}`)}
                className="rounded-2xl overflow-hidden text-left active:opacity-70 shadow-sm"
                style={{ backgroundColor: "var(--td-card)" }}
              >
                <div
                  className="h-28 flex items-end px-3 pb-2"
                  style={{ background: "linear-gradient(135deg, var(--td-accent), var(--td-fill))" }}
                >
                  <span className="text-[13px] font-bold text-white drop-shadow-md line-clamp-2">
                    {trip.title}
                  </span>
                </div>
                <div className="px-3 py-2">
                  <div className="text-[11px] truncate" style={{ color: "var(--td-secondary)" }}>
                    📍 {trip.destination} · {daysBetween(trip.start_date, trip.end_date)}d
                  </div>
                  <div className="flex gap-2 mt-1 text-[10px]" style={{ color: "var(--td-secondary)" }}>
                    {trip.likes_count > 0 && <span>❤️ {trip.likes_count}</span>}
                    {trip.clone_count > 0 && <span>📋 {trip.clone_count}</span>}
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
