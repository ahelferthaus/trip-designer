import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useItineraryStore } from "../store/itineraryStore";
import { TripDetailSkeleton } from "../components/Skeletons";
import { useTripStore } from "../store/tripStore";
import { getPublicTrip, cloneTrip, getReviews, submitReview } from "../lib/publicTrips";
import { updateTripCloudData, saveTrip } from "../lib/tripStorage";
import { getComments, addComment, hasLiked, likeTrip, unlikeTrip, getLikeCount } from "../lib/social";
import type { Comment } from "../lib/social";
import MapHero3D from "../components/itinerary/MapHero3D";
import UserAvatar from "../components/UserAvatar";
import type { PublicTrip, TripReview } from "../lib/publicTrips";

const SLOT_LABELS: Record<string, string> = { morning: "Morning", afternoon: "Afternoon", evening: "Evening", flex: "Flex" };
const CAT_ICONS: Record<string, string> = { food: "🍽️", attraction: "🏛️", adventure: "🧗", rest: "🛋️", transport: "🚌" };

function daysBetween(start: string, end: string) {
  return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000));
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? "#F5A623" : "var(--td-fill)" }}>★</span>
      ))}
    </span>
  );
}

export default function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const itineraryStore = useItineraryStore();
  const tripStore = useTripStore();

  const [trip, setTrip] = useState<PublicTrip | null>(null);
  const [reviews, setReviews] = useState<TripReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);

  // Review form
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Like + Comment state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;
    getPublicTrip(tripId).then(t => {
      setTrip(t);
      setLoading(false);
    });
    getReviews(tripId).then(setReviews);
    getComments(tripId).then(setComments);
    getLikeCount(tripId).then(setLikeCount);
    hasLiked(tripId).then(setLiked);
  }, [tripId]);

  const handleClone = async () => {
    if (!user || !trip) return;
    setCloning(true);
    const displayName = profile?.display_name || user.email?.split("@")[0] || "Me";
    const cloned = await cloneTrip(trip.id, user.id, displayName);
    if (cloned) {
      const saved = saveTrip(cloned.form_data, cloned.itinerary_data, displayName);
      updateTripCloudData(saved.id, cloned.id, cloned.invite_code);
      itineraryStore.setItinerary(cloned.itinerary_data, cloned.form_data);
      itineraryStore.setCloudTripInfo(cloned.id, cloned.invite_code);
      tripStore.loadForm(cloned.form_data);
      navigate("/itinerary");
    }
    setCloning(false);
  };

  const handleSubmitReview = async () => {
    if (!user || !tripId || myRating === 0) return;
    setSubmittingReview(true);
    await submitReview(tripId, user.id, myRating, myReview);
    const updated = await getReviews(tripId);
    setReviews(updated);
    setSubmittingReview(false);
    setMyReview("");
  };

  const handleLike = async () => {
    if (!tripId) return;
    if (liked) {
      await unlikeTrip(tripId);
      setLiked(false);
      setLikeCount(c => Math.max(0, c - 1));
    } else {
      await likeTrip(tripId);
      setLiked(true);
      setLikeCount(c => c + 1);
    }
  };

  const handleComment = async () => {
    if (!tripId || !commentText.trim()) return;
    await addComment(tripId, commentText.trim(), replyTo ?? undefined);
    setCommentText("");
    setReplyTo(null);
    getComments(tripId).then(setComments);
  };

  if (loading) {
    return <TripDetailSkeleton />;
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "var(--td-bg)" }}>
        <div className="text-4xl mb-4">🔗</div>
        <h2 className="text-[22px] font-bold mb-2" style={{ color: "var(--td-label)" }}>Trip not found</h2>
        <button onClick={() => navigate("/explore")} className="mt-4 px-6 py-3 rounded-2xl text-[17px] font-semibold"
          style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}>
          Browse Trips
        </button>
      </div>
    );
  }

  const days = daysBetween(trip.start_date, trip.end_date);
  const itinerary = trip.itinerary_data;
  const avgRating = reviews.length > 0
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10
    : 0;

  return (
    <div className="min-h-screen pb-20 page-enter" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* === 3D MAP HERO === */}
      <MapHero3D
        destination={trip.destination}
        height={320}
        title={trip.title}
        subtitle={`${trip.destination} · ${days} day${days !== 1 ? "s" : ""}`}
        showPhoto
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 safe-top z-10 w-9 h-9 rounded-full flex items-center justify-center active:opacity-70"
          style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
        >
          <span className="text-white text-[17px] font-semibold">‹</span>
        </button>
        {/* Customize button */}
        {trip.form_data && (
          <button
            onClick={() => {
              tripStore.loadForm(trip.form_data);
              navigate("/intake?step=review");
            }}
            className="absolute top-4 right-4 safe-top z-10 px-3.5 py-2 rounded-full text-[13px] font-bold active:opacity-70"
            style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", color: "white" }}
          >
            Customize & Rerun
          </button>
        )}
      </MapHero3D>

      {/* === TRIP ACTION BUTTONS === */}
      <div className="px-4 -mt-5 mb-3 flex gap-2">
        <button
          onClick={() => navigate(`/trip/${trip.id}/live`)}
          className="flex-1 py-4 rounded-2xl text-[15px] font-bold active:opacity-70 flex items-center justify-center gap-2 shadow-lg"
          style={{ backgroundColor: "#34C759", color: "white", boxShadow: "0 4px 16px rgba(52,199,89,0.4)" }}
        >
          <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
          Go Live
        </button>
        <button
          onClick={() => navigate(`/trip/${trip.id}/playback`)}
          className="flex-1 py-4 rounded-2xl text-[15px] font-bold active:opacity-70 flex items-center justify-center gap-2 shadow-lg"
          style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
        >
          🎬 Playback
        </button>
      </div>

      {/* === FLOATING SOCIAL BAR === */}
      <div className="px-4">
        <div
          className="rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-lg"
          style={{ backgroundColor: "var(--td-card)" }}
        >
          {/* Author */}
          <button onClick={() => navigate(`/profile/${trip.user_id}`)}
            className="flex items-center gap-2 active:opacity-70">
            <UserAvatar name={trip.created_by} size="sm" showLabel={false} />
            <div className="text-left">
              <p className="text-[13px] font-semibold" style={{ color: "var(--td-label)" }}>{trip.created_by}</p>
              <p className="text-[11px]" style={{ color: "var(--td-secondary)" }}>Trip creator</p>
            </div>
          </button>

          {/* Social actions */}
          <div className="flex items-center gap-4">
            <button onClick={handleLike} disabled={!user}
              className="flex flex-col items-center active:opacity-70">
              <span className="text-[18px]">{liked ? "❤️" : "🤍"}</span>
              <span className="text-[10px] font-semibold" style={{ color: "var(--td-secondary)" }}>{likeCount}</span>
            </button>
            {avgRating > 0 && (
              <div className="flex flex-col items-center">
                <Stars rating={Math.round(avgRating)} size={14} />
                <span className="text-[10px] font-semibold" style={{ color: "var(--td-secondary)" }}>{avgRating}</span>
              </div>
            )}
            <div className="flex flex-col items-center">
              <span className="text-[14px] font-bold" style={{ color: "var(--td-label)" }}>{trip.clone_count || 0}</span>
              <span className="text-[10px]" style={{ color: "var(--td-secondary)" }}>clones</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-5">
        {/* Description */}
        {trip.description && (
          <p className="text-[15px] leading-relaxed" style={{ color: "var(--td-label)" }}>
            {trip.description}
          </p>
        )}

        {/* Tags */}
        {trip.tags?.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {trip.tags.map(t => (
              <span key={t} className="text-[12px] px-3 py-1.5 rounded-full font-medium"
                style={{ backgroundColor: "var(--td-fill)", color: "var(--td-secondary)" }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Clone CTA */}
        <button
          onClick={handleClone}
          disabled={!user || cloning}
          className="w-full py-4 rounded-2xl text-[17px] font-bold btn-spring reveal"
          style={{
            backgroundColor: user ? "var(--td-accent)" : "var(--td-fill)",
            color: user ? "var(--td-accent-text)" : "var(--td-secondary)",
            boxShadow: user ? "0 4px 16px rgba(0,0,0,0.12)" : "none",
          }}
        >
          {cloning ? "Cloning..." : !user ? "Sign in to clone this trip" : "Clone this trip"}
        </button>

        {/* === TIMELINE ITINERARY === */}
        <div>
          <p className="text-[12px] uppercase tracking-widest font-semibold mb-4" style={{ color: "var(--td-secondary)" }}>
            Itinerary
          </p>
          <div className="flex flex-col gap-0">
            {itinerary.days.map((day, dayIdx) => (
              <div key={day.id} className="flex gap-3">
                {/* Timeline rail */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full text-[12px] font-bold flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}>
                    {day.day_number}
                  </div>
                  {dayIdx < itinerary.days.length - 1 && (
                    <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: "var(--td-separator)" }} />
                  )}
                </div>

                {/* Day content */}
                <div className="flex-1 pb-5">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-semibold text-[15px]" style={{ color: "var(--td-label)" }}>
                      {day.title ?? `Day ${day.day_number}`}
                    </span>
                    <span className="text-[11px]" style={{ color: "var(--td-secondary)" }}>{day.date}</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-sm divide-y"
                    style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}>
                    {day.slots.map(slot => {
                      const opt = slot.options[0];
                      if (!opt) return null;
                      return (
                        <div key={slot.id} className="px-4 py-3">
                          <p className="text-[10px] uppercase tracking-widest mb-0.5 font-semibold" style={{ color: "var(--td-secondary)" }}>
                            {SLOT_LABELS[slot.slot_type]}
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{CAT_ICONS[opt.category] ?? "📍"}</span>
                            <span className="text-[14px] font-semibold" style={{ color: "var(--td-label)" }}>{opt.title}</span>
                          </div>
                          <p className="text-[12px] mt-0.5 leading-snug" style={{ color: "var(--td-secondary)" }}>{opt.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="flex flex-col gap-3">
          <p className="text-[12px] uppercase tracking-wide" style={{ color: "var(--td-secondary)" }}>
            Reviews ({reviews.length})
          </p>

          {/* Write review */}
          {user && (
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
              <div className="px-4 py-3 flex flex-col gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <button key={i} onClick={() => setMyRating(i)} className="text-[22px] active:opacity-70"
                      style={{ color: i <= myRating ? "#F5A623" : "var(--td-fill)" }}>
                      ★
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={myReview}
                  onChange={e => setMyReview(e.target.value)}
                  placeholder="Write a review (optional)"
                  className="px-3 py-2 rounded-xl text-[14px] bg-transparent border focus:outline-none"
                  style={{ borderColor: "var(--td-separator)", color: "var(--td-label)" }}
                  onKeyDown={e => { if (e.key === "Enter") handleSubmitReview(); }}
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={myRating === 0 || submittingReview}
                  className="self-end px-4 py-2 rounded-xl text-[13px] font-semibold active:opacity-70"
                  style={{
                    backgroundColor: myRating > 0 ? "var(--td-accent)" : "var(--td-fill)",
                    color: myRating > 0 ? "var(--td-accent-text)" : "var(--td-secondary)",
                  }}
                >
                  {submittingReview ? "..." : "Submit"}
                </button>
              </div>
            </div>
          )}

          {/* Review list */}
          {reviews.length > 0 && (
            <div className="rounded-2xl overflow-hidden shadow-sm divide-y"
              style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}>
              {reviews.map(r => (
                <div key={r.id} className="px-4 py-3 flex items-start gap-3">
                  <UserAvatar name={r.reviewer_name ?? "?"} size="sm" showLabel={false} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold" style={{ color: "var(--td-label)" }}>{r.reviewer_name}</span>
                      <Stars rating={r.rating} size={11} />
                    </div>
                    {r.body && <p className="text-[13px] mt-0.5" style={{ color: "var(--td-secondary)" }}>{r.body}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="flex flex-col gap-3">
          <p className="text-[12px] uppercase tracking-wide" style={{ color: "var(--td-secondary)" }}>
            Comments ({comments.reduce((n, c) => n + 1 + (c.replies?.length ?? 0), 0)})
          </p>

          {/* Comment input */}
          {user && (
            <div className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
                className="flex-1 px-4 py-2.5 rounded-2xl text-[14px] bg-transparent focus:outline-none"
                style={{ backgroundColor: "var(--td-card)", color: "var(--td-label)", border: "1px solid var(--td-separator)" }}
                onKeyDown={e => { if (e.key === "Enter") handleComment(); }}
              />
              <button onClick={handleComment} disabled={!commentText.trim()}
                className="px-4 py-2.5 rounded-2xl text-[13px] font-semibold active:opacity-70"
                style={{
                  backgroundColor: commentText.trim() ? "var(--td-accent)" : "var(--td-fill)",
                  color: commentText.trim() ? "var(--td-accent-text)" : "var(--td-secondary)",
                }}>
                Post
              </button>
            </div>
          )}
          {replyTo && (
            <button onClick={() => setReplyTo(null)} className="text-[12px]" style={{ color: "var(--td-secondary)" }}>
              Cancel reply
            </button>
          )}

          {/* Comment list */}
          {comments.length > 0 && (
            <div className="flex flex-col gap-2">
              {comments.map(c => (
                <div key={c.id}>
                  <div className="rounded-2xl px-4 py-3 shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
                    <div className="flex items-start gap-2.5">
                      <UserAvatar name={c.author_name} size="sm" showLabel={false}
                        onClick={() => navigate(`/profile/${c.user_id}`)} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold" style={{ color: "var(--td-label)" }}>{c.author_name}</span>
                          <span className="text-[11px]" style={{ color: "var(--td-secondary)" }}>
                            {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <p className="text-[14px] mt-0.5" style={{ color: "var(--td-label)" }}>{c.body}</p>
                        {user && (
                          <button onClick={() => setReplyTo(c.id)}
                            className="text-[12px] mt-1 active:opacity-70" style={{ color: "var(--td-accent)" }}>
                            Reply
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Replies */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="ml-8 mt-1 flex flex-col gap-1">
                      {c.replies.map(r => (
                        <div key={r.id} className="rounded-xl px-3 py-2" style={{ backgroundColor: "var(--td-fill)" }}>
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] font-semibold" style={{ color: "var(--td-label)" }}>{r.author_name}</span>
                            <span className="text-[10px]" style={{ color: "var(--td-secondary)" }}>
                              {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          </div>
                          <p className="text-[13px]" style={{ color: "var(--td-label)" }}>{r.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
