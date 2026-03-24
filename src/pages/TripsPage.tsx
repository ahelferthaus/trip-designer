import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItineraryStore } from "../store/itineraryStore";
import { useTripStore } from "../store/tripStore";
import { loadSavedTrips, deleteTrip } from "../lib/tripStorage";
import type { SavedTrip } from "../lib/tripStorage";

function daysBetween(start: string, end: string) {
  if (!start || !end) return 0;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(iso: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TripsPage() {
  const navigate = useNavigate();
  const { setItinerary } = useItineraryStore();
  const store = useTripStore();
  const [trips, setTrips] = useState<SavedTrip[]>(loadSavedTrips);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const openTrip = (trip: SavedTrip) => {
    // Restore form + itinerary state then navigate
    store.setDestination(trip.form.destination ?? { name: trip.destination });
    store.setDates(trip.form.start_date, trip.form.end_date);
    store.setGroupMembers(trip.form.group_members);
    if (trip.form.budget_level) store.setBudget(trip.form.budget_level, trip.form.budget_amount);
    store.setVibes(trip.form.vibes);
    store.setNotes(trip.form.must_haves ?? "", trip.form.avoid ?? "");
    setItinerary(trip.itinerary, trip.form);
    navigate("/itinerary");
  };

  const handleDelete = (id: string) => {
    deleteTrip(id);
    setTrips(loadSavedTrips());
    setConfirmDelete(null);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Nav */}
      <div className="px-4 safe-top pt-3 pb-2 flex items-center justify-between"
        style={{ backgroundColor: "var(--td-bg)" }}>
        <button
          onClick={() => navigate("/")}
          className="text-[17px] active:opacity-70"
          style={{ color: "var(--td-accent)" }}
        >
          ‹ Home
        </button>
        <span className="text-[17px] font-semibold" style={{ color: "var(--td-label)" }}>
          My Trips
        </span>
        <div className="w-16" />
      </div>

      <div className="flex-1 px-4 pt-4">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center pt-24 text-center">
            <div className="text-5xl mb-4">🗺️</div>
            <h3 className="text-[20px] font-semibold mb-2" style={{ color: "var(--td-label)" }}>
              No saved trips yet
            </h3>
            <p className="text-[15px] mb-6" style={{ color: "var(--td-secondary)" }}>
              Plan your first trip and it'll appear here.
            </p>
            <button
              onClick={() => navigate("/intake")}
              className="px-6 py-3 rounded-2xl text-[17px] font-semibold active:opacity-70"
              style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
            >
              Plan a Trip
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {trips.map(trip => (
              <div key={trip.id}>
                <div
                  className="rounded-2xl overflow-hidden shadow-sm"
                  style={{ backgroundColor: "var(--td-card)" }}
                >
                  {/* Main tap area */}
                  <button
                    onClick={() => openTrip(trip)}
                    className="w-full text-left px-4 py-4 active:opacity-70"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[17px] truncate" style={{ color: "var(--td-label)" }}>
                          {trip.title}
                        </div>
                        <div className="text-[13px] mt-0.5" style={{ color: "var(--td-secondary)" }}>
                          📍 {trip.destination}
                        </div>
                        <div className="flex gap-3 mt-1.5 text-[13px]" style={{ color: "var(--td-secondary)" }}>
                          <span>📅 {formatDate(trip.start_date)} → {formatDate(trip.end_date)}</span>
                          <span>·</span>
                          <span>{daysBetween(trip.start_date, trip.end_date)} days</span>
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {trip.form.vibes.map(v => (
                            <span key={v} className="text-[11px] px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: "var(--td-fill)", color: "var(--td-secondary)" }}>
                              {v}
                            </span>
                          ))}
                          <span className="text-[11px] px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "var(--td-fill)", color: "var(--td-secondary)" }}>
                            {trip.form.budget_level}
                          </span>
                        </div>
                      </div>
                      <span className="text-[20px] mt-1">›</span>
                    </div>
                  </button>

                  {/* Delete row */}
                  <div style={{ borderTop: "1px solid var(--td-separator)" }}>
                    {confirmDelete === trip.id ? (
                      <div className="flex">
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="flex-1 py-3 text-[15px] active:opacity-70"
                          style={{ color: "var(--td-secondary)", borderRight: "1px solid var(--td-separator)" }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(trip.id)}
                          className="flex-1 py-3 text-[15px] font-medium active:opacity-70"
                          style={{ color: "#FF3B30" }}
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(trip.id)}
                        className="w-full py-3 text-[15px] active:opacity-70"
                        style={{ color: "#FF3B30" }}
                      >
                        Delete trip
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan new trip CTA */}
      {trips.length > 0 && (
        <div className="px-4 pt-6 pb-8 safe-bottom">
          <button
            onClick={() => navigate("/intake")}
            className="w-full py-4 rounded-2xl text-[17px] font-semibold active:opacity-70"
            style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
          >
            Plan a New Trip
          </button>
        </div>
      )}
    </div>
  );
}
