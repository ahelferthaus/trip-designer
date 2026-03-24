import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useItineraryStore } from "../store/itineraryStore";
import { useTripStore } from "../store/tripStore";
import { getActivityLink } from "../lib/activityLinks";
import { getCurrentUser, setCurrentUser, getUserSelections, saveUserSelection, getAllUsersSelections, clearCurrentUser } from "../lib/userSession";
import { getTripById, loadSavedTrips } from "../lib/tripStorage";
import type { SavedTrip } from "../lib/tripStorage";
import type { ActivityOption } from "../lib/types";

const CATEGORY_ICONS: Record<string, string> = {
  food: "🍽️", attraction: "🏛️", adventure: "🧗", rest: "🛋️", transport: "🚌",
};
const SLOT_LABELS: Record<string, string> = {
  morning: "Morning", afternoon: "Afternoon", evening: "Evening", flex: "Flex",
};

const TRIP_PASSCODE = "1234"; // Simple shared passcode

function OptionCard({ option, selected, onSelect, link }: {
  option: ActivityOption;
  selected: boolean;
  onSelect: () => void;
  link: { url: string; label: string } | null;
}) {
  return (
    <div
      className="w-full text-left px-4 py-4 flex items-start gap-3"
      style={{ backgroundColor: selected ? "color-mix(in srgb, var(--td-accent) 8%, var(--td-card))" : "var(--td-card)" }}
    >
      <button
        onClick={onSelect}
        className="w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center active:opacity-70"
        style={{
          borderColor: selected ? "var(--td-accent)" : "var(--td-fill)",
          backgroundColor: selected ? "var(--td-accent)" : "transparent",
        }}
      >
        {selected && <span className="text-white text-xs font-bold">✓</span>}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-base">{CATEGORY_ICONS[option.category] ?? "📍"}</span>
          <span className="font-semibold text-[15px] truncate" style={{ color: "var(--td-label)" }}>
            {option.title}
          </span>
        </div>
        <p className="text-[13px] leading-snug mb-1" style={{ color: "var(--td-secondary)" }}>
          {option.description}
        </p>
        {link && (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12px] underline active:opacity-70"
            style={{ color: "var(--td-accent)" }}
          >
            {link.label} ↗
          </a>
        )}
        <div className="flex gap-3 mt-1 text-[12px]" style={{ color: "var(--td-secondary)" }}>
          {option.estimated_cost_per_person != null && (
            <span>~${option.estimated_cost_per_person}/person</span>
          )}
          {option.duration_minutes != null && (
            <span>
              {option.duration_minutes < 60
                ? `${option.duration_minutes}m`
                : `${(option.duration_minutes / 60).toFixed(1)}h`}
            </span>
          )}
          {option.location?.name && <span className="truncate">📍 {option.location.name}</span>}
        </div>
      </div>
    </div>
  );
}

function Avatar({ name, active, onClick }: { name: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 active:opacity-70 transition-opacity"
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-[15px] font-semibold"
        style={{
          backgroundColor: active ? "var(--td-accent)" : "var(--td-fill)",
          color: active ? "var(--td-accent-text)" : "var(--td-label)",
          border: active ? "2px solid var(--td-accent)" : "2px solid transparent",
        }}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
      <span className="text-[11px] truncate max-w-[60px]" style={{ color: "var(--td-secondary)" }}>
        {name}
      </span>
    </button>
  );
}

export default function ItineraryPage() {
  const { itinerary, loading, error } = useItineraryStore();
  const { form } = useTripStore();
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [savedTrip, setSavedTrip] = useState<SavedTrip | null>(null);
  
  // Login state
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [passcodeVerified, setPasscodeVerified] = useState(false);
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());
  const [userSelections, setUserSelections] = useState<Record<string, string>>({});
  
  // Load from URL param or current state
  useEffect(() => {
    if (tripId) {
      const trip = getTripById(tripId);
      if (trip) {
        setSavedTrip(trip);
      }
    }
    
    // Check if user is logged in for this trip
    const session = getCurrentUser();
    const activeTripId = tripId ?? savedTrip?.id ?? itinerary?.days[0]?.trip_id;
    if (session && activeTripId && session.tripId === activeTripId) {
      setCurrentUserState(session);
      setUserSelections(getUserSelections(activeTripId, session.name));
    } else if (activeTripId) {
      // Will show login modal by default
    }
  }, [tripId, itinerary, savedTrip?.id]);

  const handleLogin = () => {
    if (passcode === TRIP_PASSCODE) {
      setPasscodeError(false);
      setPasscode("");
      setPasscodeVerified(true);
    } else {
      setPasscodeError(true);
    }
  };

  const selectUser = (name: string) => {
    const activeTripId = tripId ?? savedTrip?.id ?? itinerary?.days[0]?.trip_id ?? "temp";
    setCurrentUser(name, activeTripId);
    setCurrentUserState({ name, tripId: activeTripId });
    setUserSelections(getUserSelections(activeTripId, name));
    setPasscodeVerified(false);
  };

  const selectOption = (slotId: string, optionId: string) => {
    const activeTripId = tripId ?? savedTrip?.id ?? itinerary?.days[0]?.trip_id ?? "temp";
    if (currentUser) {
      saveUserSelection(activeTripId, currentUser.name, slotId, optionId);
      setUserSelections(getUserSelections(activeTripId, currentUser.name));
    }
  };

  const getSlotSelection = (slotId: string, options: ActivityOption[]) => {
    // Return user's selection if exists, otherwise first option
    return userSelections[slotId] ?? options[0]?.id;
  };

  const allUsersSelections = getAllUsersSelections(tripId ?? savedTrip?.id ?? itinerary?.days[0]?.trip_id ?? "temp");
  const groupMembers = savedTrip?.form.group_members ?? form.group_members ?? [];
  const activeItinerary = savedTrip?.itinerary ?? itinerary;
  const activeForm = savedTrip?.form ?? form;

  // ... (loading, error, no-itinerary states unchanged)

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: "var(--td-bg)" }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full shadow-sm flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "var(--td-card)" }}>
            <svg className="animate-spin w-7 h-7" fill="none" viewBox="0 0 24 24"
              style={{ color: "var(--td-accent)" }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
          <h2 className="text-[22px] font-bold mb-1" style={{ color: "var(--td-label)" }}>
            Building your trip…
          </h2>
          <p className="text-[15px]" style={{ color: "var(--td-secondary)" }}>
            {activeForm.destination?.name}
          </p>
          <p className="text-[13px] mt-2" style={{ color: "var(--td-fill)" }}>
            Takes about 15 seconds
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: "var(--td-bg)" }}>
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-[22px] font-bold mb-2" style={{ color: "var(--td-label)" }}>
            Something went wrong
          </h2>
          <p className="text-[15px] mb-6" style={{ color: "var(--td-secondary)" }}>{error}</p>
          <button
            onClick={() => navigate("/intake")}
            className="px-6 py-3 rounded-2xl text-[17px] font-semibold active:opacity-70"
            style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!activeItinerary) {
    // Redirect to trips if any saved, otherwise home
    const saved = loadSavedTrips();
    navigate(saved.length > 0 ? "/trips" : "/", { replace: true });
    return null;
  }

  // Login modal
  if (!passcodeVerified && !currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: "var(--td-bg)" }}>
        <div className="w-full max-w-sm">
          <h2 className="text-[28px] font-bold mb-2 text-center" style={{ color: "var(--td-label)" }}>
            Who are you?
          </h2>
          <p className="text-[15px] text-center mb-8" style={{ color: "var(--td-secondary)" }}>
            Enter the trip passcode to join
          </p>
          
          <div className="rounded-2xl overflow-hidden shadow-sm mb-6" style={{ backgroundColor: "var(--td-card)" }}>
            <input
              type="password"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              placeholder="Passcode (try: 1234)"
              maxLength={4}
              className="w-full px-4 py-4 text-[17px] text-center bg-transparent focus:outline-none"
              style={{ color: "var(--td-label)" }}
              autoFocus
            />
          </div>
          
          {passcodeError && (
            <p className="text-[13px] text-center mb-4" style={{ color: "#FF3B30" }}>
              Wrong passcode. Try 1234.
            </p>
          )}
          
          <button
            onClick={handleLogin}
            disabled={passcode.length !== 4}
            className="w-full py-4 rounded-2xl text-[17px] font-semibold mb-4 active:opacity-70"
            style={{
              backgroundColor: passcode.length === 4 ? "var(--td-accent)" : "var(--td-fill)",
              color: passcode.length === 4 ? "var(--td-accent-text)" : "var(--td-secondary)",
              cursor: passcode.length === 4 ? "pointer" : "not-allowed",
            }}
          >
            Continue
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 text-[17px] active:opacity-70"
            style={{ color: "var(--td-secondary)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Member picker (after passcode)
  if (passcodeVerified && !currentUser) {
    return (
      <div className="min-h-screen flex flex-col px-6 pt-24" style={{ backgroundColor: "var(--td-bg)" }}>
        <h2 className="text-[28px] font-bold mb-2" style={{ color: "var(--td-label)" }}>
          Select your name
        </h2>
        <p className="text-[15px] mb-8" style={{ color: "var(--td-secondary)" }}>
          Tap your name from the group
        </p>
        
        <div className="flex flex-wrap gap-4">
          {groupMembers.map(member => (
            <Avatar
              key={member.name}
              name={member.name}
              onClick={() => selectUser(member.name)}
            />
          ))}
        </div>
        
        <button
          onClick={() => {
            setPasscodeVerified(false);
            setPasscode("");
          }}
          className="mt-8 text-[17px]"
          style={{ color: "var(--td-secondary)" }}
        >
          ← Back to passcode
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Sticky nav */}
      <div className="sticky top-0 z-10" style={{
        backgroundColor: "var(--td-nav-bg)",
        borderBottom: "1px solid var(--td-separator)"
      }}>
        <div className="px-4 safe-top pt-3 pb-3">
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={() => navigate("/")}
              className="text-[17px] active:opacity-70"
              style={{ color: "var(--td-accent-text)" }}
            >
              ‹ Home
            </button>
            <button
              onClick={() => {
                clearCurrentUser();
                setCurrentUserState(null);
              }}
              className="text-[13px] active:opacity-70"
              style={{ color: "var(--td-accent-text)", opacity: 0.75 }}
            >
              Logout
            </button>
          </div>
          <h1 className="text-[20px] font-bold" style={{ color: "var(--td-accent-text)" }}>
            {activeItinerary.title}
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-[13px]" style={{ color: "var(--td-accent-text)", opacity: 0.75 }}>
              {activeForm.destination?.name} · {activeItinerary.days.length} days
            </p>
            <p className="text-[13px] font-semibold" style={{ color: "var(--td-accent-text)" }}>
              {currentUser?.name} logged in
            </p>
          </div>
        </div>
      </div>

      {/* User avatars row */}
      <div className="px-4 py-3 border-b" style={{ borderColor: "var(--td-separator)" }}>
        <p className="text-[12px] uppercase tracking-wide mb-2" style={{ color: "var(--td-secondary)" }}>
          Trip members
        </p>
        <div className="flex gap-3 overflow-x-auto">
          {groupMembers.map(member => (
            <Avatar
              key={member.name}
              name={member.name}
              active={member.name === currentUser?.name}
              onClick={() => selectUser(member.name)}
            />
          ))}
        </div>
      </div>

      {/* Days */}
      <div className="py-6 flex flex-col gap-6">
        {activeItinerary.days.map(day => (
          <div key={day.id} className="px-4">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-7 h-7 rounded-full text-[13px] font-bold flex items-center justify-center"
                style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}>
                {day.day_number}
              </div>
              <div>
                <span className="font-semibold text-[17px]" style={{ color: "var(--td-label)" }}>
                  {day.title ?? `Day ${day.day_number}`}
                </span>
                <span className="text-[13px] ml-2" style={{ color: "var(--td-secondary)" }}>
                  {day.date}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {day.slots.map(slot => (
                <div key={slot.id}>
                  <div className="flex items-center justify-between px-1 mb-1.5">
                    <p className="text-[12px] uppercase tracking-wide" style={{ color: "var(--td-secondary)" }}>
                      {SLOT_LABELS[slot.slot_type]}
                    </p>
                    {(() => {
                      const allUsers = Object.keys(allUsersSelections);
                      const thisSlotVotes = allUsers.filter(u => allUsersSelections[u]?.[slot.id]).length;
                      if (thisSlotVotes > 0) {
                        return (
                          <span className="text-[11px] px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "var(--td-fill)", color: "var(--td-secondary)" }}
                          >
                            {thisSlotVotes} voted
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-sm divide-y"
                    style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}
                  >
                    {slot.options.map(opt => (
                      <OptionCard
                        key={opt.id}
                        option={opt}
                        selected={getSlotSelection(slot.id, slot.options) === opt.id}
                        onSelect={() => selectOption(slot.id, opt.id)}
                        link={getActivityLink(opt, activeForm.destination?.name)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center pb-8 safe-bottom">
          <button onClick={() => navigate("/")} className="text-[17px]"
            style={{ color: "var(--td-accent)" }}>
            Plan another trip
          </button>
        </div>
      </div>
    </div>
  );
}
