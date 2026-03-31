import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchPublicTrips } from "../lib/publicTrips";
import type { PublicTrip } from "../lib/publicTrips";
import { toggleFavorite, isFavorite } from "../lib/favorites";
import { useTripStore } from "../store/tripStore";
import { getDestinationPhoto } from "../lib/destinationPhotos";

const BUDGET_EMOJI: Record<string, string> = { budget: "💰", mid: "💳", splurge: "💎" };

function daysBetween(s: string, e: string) {
  return Math.max(0, Math.round((new Date(e).getTime() - new Date(s).getTime()) / 86400000));
}

export default function TripSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useTripStore();
  const [open, setOpen] = useState(false);
  const [trips, setTrips] = useState<PublicTrip[]>([]);
  const [loading, setLoading] = useState(false);
  const [favRefresh, setFavRefresh] = useState(0);

  // Fetch published trips from database when opened
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    searchPublicTrips({ sortBy: "newest", limit: 30 }).then(data => {
      setTrips(data);
      setLoading(false);
    });
  }, [open, favRefresh]);

  // Hide on certain pages
  const hiddenPaths = ["/intake", "/auth", "/", "/onboarding"];
  if (location.pathname === "/") return null;
  if (hiddenPaths.some(p => location.pathname === p || location.pathname.startsWith(p + "/"))) return null;

  const handleViewTrip = (trip: PublicTrip) => {
    setOpen(false);
    navigate(`/trip/${trip.id}`);
  };

  const handlePlanTrip = (trip: PublicTrip) => {
    if (trip.form_data) {
      store.loadForm(trip.form_data);
      setOpen(false);
      navigate("/intake?step=review");
    }
  };

  const handleToggleFav = (id: string) => {
    toggleFavorite(id);
    setFavRefresh(n => n + 1);
  };

  return (
    <>
      {/* Toggle button — RIGHT side */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed top-24 right-0 z-50 flex items-center gap-2 pr-3 pl-4 py-3 rounded-l-2xl shadow-xl active:opacity-70"
        style={{
          backgroundColor: "var(--td-accent)",
          color: "var(--td-accent-text)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        <span className="text-[13px] font-bold">{open ? "Close" : "Trips"}</span>
        <span className="text-[18px]">{open ? "✕" : "🗺️"}</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setOpen(false)} />
      )}

      {/* RIGHT-side panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-[330px] flex flex-col shadow-2xl transition-transform duration-250 ease-out"
        style={{
          backgroundColor: "var(--td-bg)",
          backdropFilter: "blur(20px)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          borderLeft: "1px solid var(--td-separator)",
        }}
      >
        {/* Header */}
        <div className="safe-top pt-5 pb-3 px-4 flex items-center justify-between">
          <h2 className="text-[20px] font-black" style={{ color: "var(--td-label)" }}>
            🗺️ Pre-Built Trips
          </h2>
          <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center active:opacity-70"
            style={{ backgroundColor: "var(--td-fill)" }}>
            <span className="text-[14px]" style={{ color: "var(--td-label)" }}>✕</span>
          </button>
        </div>

        <p className="px-4 pb-3 text-[12px]" style={{ color: "var(--td-secondary)" }}>
          AI-generated itineraries ready to explore. Tap to view, customize dates & preferences, then make it yours.
        </p>

        {/* Trip list */}
        <div className="flex-1 overflow-y-auto px-3 pb-24">
          {loading ? (
            <div className="flex flex-col gap-3 pt-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ backgroundColor: "var(--td-card)" }}>
                  <div className="skeleton h-24 w-full" />
                  <div className="p-3 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🌍</div>
              <p className="text-[14px] font-semibold" style={{ color: "var(--td-label)" }}>No trips yet</p>
              <p className="text-[12px] mt-1" style={{ color: "var(--td-secondary)" }}>
                Seed trips will appear here once generated.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pt-1">
              {trips.map(trip => {
                const faved = isFavorite(trip.id);
                const days = daysBetween(trip.start_date, trip.end_date);
                const formData = trip.form_data;
                return (
                  <div
                    key={trip.id}
                    className="rounded-xl overflow-hidden shadow-md"
                    style={{ backgroundColor: "var(--td-card)" }}
                  >
                    {/* Photo card — click to view full trip */}
                    <button
                      onClick={() => handleViewTrip(trip)}
                      className="w-full h-28 relative flex items-end px-3 pb-2 text-left active:opacity-90"
                      style={{
                        background: trip.cover_photo_url
                          ? `url(${trip.cover_photo_url}) center/cover`
                          : `url(${getDestinationPhoto(trip.destination, 300)}) center/cover`,
                      }}
                    >
                      <div className="absolute inset-0" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.65) 0%, transparent 55%)" }} />
                      {/* Favorite */}
                      <div
                        className="absolute top-2 right-2"
                        onClick={e => { e.stopPropagation(); handleToggleFav(trip.id); }}
                      >
                        <span className="text-[18px] drop-shadow-lg cursor-pointer">{faved ? "❤️" : "🤍"}</span>
                      </div>
                      <span className="relative text-[14px] font-bold text-white drop-shadow-md truncate">
                        {trip.title}
                      </span>
                    </button>

                    {/* Info + actions */}
                    <div className="px-3 py-2.5">
                      <div className="text-[12px] flex items-center gap-1.5" style={{ color: "var(--td-secondary)" }}>
                        <span>📍 {trip.destination}</span>
                        <span>·</span>
                        <span>{days}d</span>
                        {formData?.budget_level && (
                          <>
                            <span>·</span>
                            <span>{BUDGET_EMOJI[formData.budget_level] || ""} {formData.budget_level}</span>
                          </>
                        )}
                      </div>
                      {trip.description && (
                        <p className="text-[11px] mt-1 line-clamp-2" style={{ color: "var(--td-secondary)" }}>
                          {trip.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleViewTrip(trip)}
                          className="flex-1 py-2 rounded-lg text-[12px] font-bold active:opacity-70 text-center"
                          style={{ backgroundColor: "var(--td-fill)", color: "var(--td-label)" }}
                        >
                          View Itinerary
                        </button>
                        <button
                          onClick={() => handlePlanTrip(trip)}
                          className="flex-1 py-2 rounded-lg text-[12px] font-bold active:opacity-70 text-center"
                          style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
                        >
                          Customize
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
