import { useState, useEffect, useCallback, lazy, Suspense } from "react";
const ItineraryMap = lazy(() => import("../components/itinerary/ItineraryMap"));
const TripHeroMap = lazy(() => import("../components/itinerary/TripHeroMap"));
import { useNavigate, useParams } from "react-router-dom";
import { useItineraryStore } from "../store/itineraryStore";
import { useTripStore } from "../store/tripStore";
import { useAuth } from "../store/authStore";
import { getActivityLink, getPhotosLink } from "../lib/activityLinks";
import { getLodgingLinks, getFlightsLink } from "../lib/lodgingLinks";
import { refineItinerary } from "../lib/refineItinerary";
import {
  saveCloudSelection,
  getAllCloudSelections,
  subscribeToSelections,
  saveCustomOption,
  getCustomOptions,
  saveMemorableMoment,
  getMemorableMoments,
  saveBookedSlot,
  getBookedSlots,
  subscribeToTripExtras,
} from "../lib/supabaseTrips";
import {
  getCurrentUser,
  setCurrentUser,
  getUserSelections,
  saveUserSelection,
  getAllUsersSelections,
} from "../lib/userSession";
import { getTripById, loadSavedTrips } from "../lib/tripStorage";
import UserAvatar from "../components/UserAvatar";
import InviteModal from "../components/itinerary/InviteModal";
import SlotPhotos from "../components/itinerary/SlotPhotos";
import { publishTrip, unpublishTrip } from "../lib/publicTrips";
import { supabase } from "../lib/supabase";
import { getPhotosForTrip } from "../lib/tripPhotos";
import type { TripPhoto } from "../lib/tripPhotos";
import type { SavedTrip } from "../lib/tripStorage";
import type { ActivityOption } from "../lib/types";

const CATEGORY_ICONS: Record<string, string> = {
  food: "🍽️", attraction: "🏛️", adventure: "🧗", rest: "🛋️", transport: "🚌",
};
const SLOT_LABELS: Record<string, string> = {
  morning: "Morning", afternoon: "Afternoon", evening: "Evening", flex: "Flex",
};

type ViewTab = "all" | "food" | "attraction" | "adventure" | "rest" | "transport";
const VIEW_TABS: { id: ViewTab; label: string; icon: string }[] = [
  { id: "all", label: "Full Trip", icon: "📋" },
  { id: "food", label: "Food", icon: "🍽️" },
  { id: "attraction", label: "Sights", icon: "🏛️" },
  { id: "adventure", label: "Adventure", icon: "🧗" },
  { id: "rest", label: "Lodging", icon: "🛋️" },
  { id: "transport", label: "Travel", icon: "🚌" },
];

const TRIP_PASSCODE = localStorage.getItem("td-passcode") ?? "1234";

const REFINE_CHIPS = [
  "Make Day 2 more relaxed",
  "Add more food options",
  "Make it more budget-friendly",
];

function OptionCard({
  option,
  selected,
  onSelect,
  link,
  photosLink,
  voters,
  booked,
  onBook,
  onUnbook,
}: {
  option: ActivityOption;
  selected: boolean;
  onSelect: () => void;
  link: { url: string; label: string } | null;
  photosLink: { url: string; label: string };
  voters: string[];
  booked?: boolean;
  onBook?: () => void;
  onUnbook?: () => void;
}) {
  return (
    <div
      className="w-full text-left px-4 py-4 flex items-start gap-3"
      style={{
        backgroundColor: booked
          ? "color-mix(in srgb, #34C759 10%, var(--td-card))"
          : selected
            ? "color-mix(in srgb, var(--td-accent) 8%, var(--td-card))"
            : "var(--td-card)",
      }}
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
          {booked && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "#34C75930", color: "#34C759" }}>
              Booked
            </span>
          )}
          {option.isCustom && !booked && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--td-fill)", color: "var(--td-secondary)" }}>
              write-in
            </span>
          )}
        </div>
        <p className="text-[13px] leading-snug mb-1" style={{ color: "var(--td-secondary)" }}>
          {option.description}
        </p>
        {!option.isCustom && (
          <div className="flex flex-wrap gap-3 mb-1">
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
            <a
              href={photosLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[12px] underline active:opacity-70"
              style={{ color: "var(--td-accent)" }}
            >
              {photosLink.label} ↗
            </a>
          </div>
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
        {option.why_this_fits && (
          <p className="text-[12px] italic mt-1" style={{ color: "var(--td-accent)", opacity: 0.8 }}>
            {option.why_this_fits}
          </p>
        )}
        {option.createdBy && (
          <p className="text-[11px] mt-0.5" style={{ color: "var(--td-secondary)" }}>
            Added by {option.createdBy}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          {voters.length > 0 && (
            <div className="flex gap-1.5 flex-wrap items-center">
              {voters.map(v => (
                <UserAvatar key={v} name={v} size="sm" showLabel={false} />
              ))}
            </div>
          )}
          {onBook && !booked && (
            <button
              onClick={e => { e.stopPropagation(); onBook(); }}
              className="ml-auto text-[11px] px-2.5 py-1 rounded-full font-semibold active:opacity-70"
              style={{ backgroundColor: "var(--td-fill)", color: "var(--td-label)" }}
            >
              Book this
            </button>
          )}
          {onUnbook && booked && (
            <button
              onClick={e => { e.stopPropagation(); onUnbook(); }}
              className="ml-auto text-[11px] px-2.5 py-1 rounded-full font-semibold active:opacity-70"
              style={{ backgroundColor: "#FF3B3020", color: "#FF3B30" }}
            >
              Unbook
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Write-in form inline within a slot
function WriteInForm({
  slotId,
  slotCategory,
  onAdd,
}: {
  slotId: string;
  slotCategory: string;
  onAdd: (title: string, description: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), desc.trim() || "Custom activity");
    setTitle("");
    setDesc("");
  };

  void slotId;
  void slotCategory;

  return (
    <div className="px-4 py-3 border-t" style={{ borderColor: "var(--td-separator)" }}>
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Write in your own option..."
          className="flex-1 px-3 py-2 rounded-xl text-[14px] border bg-transparent"
          style={{ borderColor: "var(--td-separator)", color: "var(--td-label)" }}
          onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
        />
        <button
          onClick={handleAdd}
          disabled={!title.trim()}
          className="px-3 py-2 rounded-xl text-[13px] font-semibold active:opacity-70"
          style={{
            backgroundColor: title.trim() ? "var(--td-accent)" : "var(--td-fill)",
            color: title.trim() ? "var(--td-accent-text)" : "var(--td-secondary)",
          }}
        >
          Add
        </button>
      </div>
      {title.trim() && (
        <input
          type="text"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Short description (optional)"
          className="w-full mt-2 px-3 py-2 rounded-xl text-[13px] border bg-transparent"
          style={{ borderColor: "var(--td-separator)", color: "var(--td-label)" }}
          onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
        />
      )}
    </div>
  );
}

export default function ItineraryPage() {
  const itineraryStore = useItineraryStore();
  const { itinerary, loading, error, cloudTripId: storeCloudTripId, cloudInviteCode: storeCloudInviteCode, setItinerary: storeSetItinerary, setCloudTripInfo } = itineraryStore;
  const { form } = useTripStore();
  const { user: authUser, profile: authProfile } = useAuth();
  const navigate = useNavigate();
  const { tripId } = useParams();
  const [savedTrip, setSavedTrip] = useState<SavedTrip | null>(null);

  // Login state
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [passcodeVerified, setPasscodeVerified] = useState(false);
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());
  const [userSelections, setUserSelections] = useState<Record<string, string>>({});

  // View tab state
  const [activeTab, setActiveTab] = useState<ViewTab>("all");

  // Map section state
  const [mapOpen, setMapOpen] = useState(false);

  // Lodging card state
  const [lodgingOpen, setLodgingOpen] = useState(false);

  // Refinement state
  const [refineOpen, setRefineOpen] = useState(false);
  const [refineText, setRefineText] = useState("");
  const [refining, setRefining] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Invite modal
  const [inviteOpen, setInviteOpen] = useState(false);

  // Cloud / real-time state
  const [cloudSelections, setCloudSelections] = useState<Record<string, Record<string, string>>>({});

  // Custom write-in options from cloud
  const [cloudCustomOptions, setCloudCustomOptions] = useState<Record<string, Array<{ id: string; title: string; description: string; category: string; createdBy: string }>>>({});

  // Memorable moments
  const [moments, setMoments] = useState<Record<string, string>>({});
  const [myMoment, setMyMoment] = useState("");
  const [momentsOpen, setMomentsOpen] = useState(false);
  const [momentSaving, setMomentSaving] = useState(false);

  // Booked options: slotId -> optionId
  const [bookedSlots, setBookedSlots] = useState<Record<string, string>>({});

  // Publish state
  const [isPublished, setIsPublished] = useState(false);

  // Photos per slot
  const [slotPhotos, setSlotPhotos] = useState<Record<string, TripPhoto[]>>({});

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  // Load from URL param or current state
  useEffect(() => {
    if (tripId) {
      const trip = getTripById(tripId);
      if (trip) setSavedTrip(trip);
    }

    const session = getCurrentUser();
    const activeTripId = tripId ?? savedTrip?.id ?? itinerary?.days[0]?.trip_id;
    if (session && activeTripId && session.tripId === activeTripId) {
      setCurrentUserState(session);
      setUserSelections(getUserSelections(activeTripId, session.name));
    }
  }, [tripId, itinerary, savedTrip?.id]);

  // Determine the active cloud trip id
  const activeCloudTripId = savedTrip?.cloudTripId ?? storeCloudTripId;
  const activeInviteCode = savedTrip?.inviteCode ?? storeCloudInviteCode;

  // Real-time cloud selections
  useEffect(() => {
    if (!activeCloudTripId) return;
    getAllCloudSelections(activeCloudTripId).then(setCloudSelections);
    const unsub = subscribeToSelections(activeCloudTripId, setCloudSelections);
    return unsub;
  }, [activeCloudTripId]);

  // Load custom options + moments + booked slots + photos from cloud
  const refreshCloudData = useCallback(() => {
    if (!activeCloudTripId) return;
    getCustomOptions(activeCloudTripId).then(setCloudCustomOptions);
    getBookedSlots(activeCloudTripId).then(setBookedSlots);
    getPhotosForTrip(activeCloudTripId).then(setSlotPhotos);
    getMemorableMoments(activeCloudTripId).then(m => {
      setMoments(m);
      if (currentUser) setMyMoment(m[currentUser.name] ?? "");
    });
  }, [activeCloudTripId, currentUser]);

  useEffect(() => {
    refreshCloudData();
  }, [refreshCloudData]);

  // Subscribe to trip extras (custom options, moments, booked slots) real-time
  useEffect(() => {
    if (!activeCloudTripId) return;
    const unsub = subscribeToTripExtras(activeCloudTripId, refreshCloudData);
    return unsub;
  }, [activeCloudTripId, refreshCloudData]);

  // Suppress unused warning for setCloudTripInfo (used in JoinPage via store)
  void setCloudTripInfo;

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
      if (activeCloudTripId) {
        saveCloudSelection(activeCloudTripId, currentUser.name, slotId, optionId);
      }
    }
  };

  const getSlotSelection = (slotId: string, options: ActivityOption[]) => {
    return userSelections[slotId] ?? options[0]?.id;
  };

  const handleAddWriteIn = async (slotId: string, slotCategory: string, title: string, description: string) => {
    if (!currentUser) return;
    const optionId = `custom-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const option = {
      id: optionId,
      title,
      description,
      category: slotCategory,
      createdBy: currentUser.name,
    };

    // Optimistic local update
    setCloudCustomOptions(prev => ({
      ...prev,
      [slotId]: [...(prev[slotId] ?? []), option],
    }));

    // Persist to cloud
    if (activeCloudTripId) {
      await saveCustomOption(activeCloudTripId, slotId, option);
    }

    showToast("Option added!");
  };

  const handleSaveMoment = async () => {
    if (!currentUser || !activeCloudTripId) return;
    setMomentSaving(true);
    await saveMemorableMoment(activeCloudTripId, currentUser.name, myMoment);
    setMoments(prev => ({ ...prev, [currentUser.name]: myMoment }));
    setMomentSaving(false);
    showToast("Moment saved!");
  };

  const handleBookSlot = async (slotId: string, optionId: string, category: string) => {
    const key = `${slotId}:${category}`;
    setBookedSlots(prev => ({ ...prev, [key]: optionId }));
    if (activeCloudTripId) {
      await saveBookedSlot(activeCloudTripId, key, optionId, currentUser?.name ?? "");
    }
    showToast("Booked!");
  };

  const handleUnbook = async (slotId: string, category: string) => {
    const key = `${slotId}:${category}`;
    setBookedSlots(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    if (activeCloudTripId && supabase) {
      await supabase.from("trip_booked_slots").delete()
        .eq("trip_id", activeCloudTripId)
        .eq("slot_id", key);
    }
    showToast("Unbooked");
  };

  const handlePublish = async () => {
    if (!activeCloudTripId) return;
    if (isPublished) {
      await unpublishTrip(activeCloudTripId);
      setIsPublished(false);
      showToast("Trip unpublished");
    } else {
      await publishTrip(activeCloudTripId, {
        description: `${activeForm.destination?.name} — ${activeItinerary?.days.length} day trip`,
        tags: activeForm.vibes ?? [],
        visibility: "public",
      });
      setIsPublished(true);
      showToast("Trip published! Visible on Explore.");
    }
  };

  const handleRefine = async () => {
    if (!refineText.trim() || !activeItinerary) return;
    setRefining(true);
    try {
      const refined = await refineItinerary(activeItinerary, activeForm, refineText.trim());
      storeSetItinerary(refined, activeForm);
      if (savedTrip) setSavedTrip(prev => prev ? { ...prev, itinerary: refined } : null);
      setRefineOpen(false);
      setRefineText("");
      showToast("Trip updated!");
    } catch {
      showToast("Refinement failed. Try again.");
    } finally {
      setRefining(false);
    }
  };

  const handleShare = () => {
    if (!activeInviteCode) return;
    const url = `${window.location.origin}/join/${activeInviteCode}`;
    navigator.clipboard.writeText(url);
    showToast("Link copied!");
  };

  const localSelections = getAllUsersSelections(tripId ?? savedTrip?.id ?? itinerary?.days[0]?.trip_id ?? "temp");
  // Merge current user's local selections into the active set so their votes appear immediately
  const baseSelections = activeCloudTripId ? cloudSelections : localSelections;
  const activeSelections = currentUser
    ? { ...baseSelections, [currentUser.name]: { ...(baseSelections[currentUser.name] ?? {}), ...userSelections } }
    : baseSelections;
  const groupMembers = savedTrip?.form.group_members ?? form.group_members ?? [];
  const activeItinerary = savedTrip?.itinerary ?? itinerary;
  const activeForm = savedTrip?.form ?? form;

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
    // If not loading and no error, redirect to trips/home
    if (!loading && !error) {
      const saved = loadSavedTrips();
      navigate(saved.length > 0 ? "/trips" : "/", { replace: true });
      return null;
    }
    // Otherwise show spinner (loading or brief transition state)
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
            This can take up to 30 seconds
          </p>
        </div>
      </div>
    );
  }

  // Auto-login for Supabase-authenticated users: skip passcode, use email-derived name
  useEffect(() => {
    if (authUser && !currentUser) {
      const displayName = authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User";
      const activeTripId = tripId ?? savedTrip?.id ?? itinerary?.days[0]?.trip_id ?? "temp";
      setCurrentUser(displayName, activeTripId);
      setCurrentUserState({ name: displayName, tripId: activeTripId });
      setUserSelections(getUserSelections(activeTripId, displayName));
    }
  }, [authUser, currentUser, tripId, savedTrip?.id, itinerary]);

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
            <UserAvatar
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

  // Build merged options per slot: AI options + cloud custom options
  const getMergedOptions = (slot: { id: string; options: ActivityOption[] }): ActivityOption[] => {
    const customs = (cloudCustomOptions[slot.id] ?? []).map(c => ({
      id: c.id,
      slot_id: slot.id,
      title: c.title,
      description: c.description,
      category: c.category as ActivityOption["category"],
      weather_sensitivity: "either" as const,
      ai_generated: false,
      isCustom: true,
      createdBy: c.createdBy,
    }));
    return [...slot.options, ...customs];
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Refinement spinner overlay */}
      {refining && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        >
          <div className="rounded-3xl px-8 py-6 text-center shadow-xl" style={{ backgroundColor: "var(--td-card)" }}>
            <svg className="animate-spin w-8 h-8 mx-auto mb-3" fill="none" viewBox="0 0 24 24"
              style={{ color: "var(--td-accent)" }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <p className="text-[15px] font-medium" style={{ color: "var(--td-label)" }}>
              Refining your trip…
            </p>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-[13px] font-semibold z-50 whitespace-nowrap"
          style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
        >
          {toast}
        </div>
      )}

      {/* Invite modal */}
      {inviteOpen && activeCloudTripId && activeInviteCode && authUser && (
        <InviteModal
          tripId={activeCloudTripId}
          invitedBy={authUser.id}
          inviteCode={activeInviteCode}
          onClose={() => setInviteOpen(false)}
        />
      )}

      {/* === HERO MAP === */}
      <div className="relative">
        <Suspense fallback={
          <div style={{ height: 380, backgroundColor: "#0B1D33" }} className="flex items-center justify-center">
            <svg className="animate-spin w-7 h-7" fill="none" viewBox="0 0 24 24" style={{ color: "white" }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        }>
          <TripHeroMap
            itinerary={activeItinerary}
            form={activeForm}
            profile={authProfile}
            userName={currentUser?.name}
          />
        </Suspense>

        {/* Floating nav buttons over the map */}
        <div className="absolute top-0 left-0 right-0 z-10 safe-top">
          <div className="flex items-center justify-between px-4 pt-3">
            <button
              onClick={() => navigate("/")}
              className="w-9 h-9 rounded-full flex items-center justify-center active:opacity-70"
              style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
            >
              <span className="text-white text-[17px] font-semibold">‹</span>
            </button>
            <div className="flex items-center gap-2">
              {activeCloudTripId && authUser && (
                <button
                  onClick={handlePublish}
                  className="px-3 py-1.5 rounded-full text-[12px] font-semibold active:opacity-70"
                  style={{
                    backgroundColor: isPublished ? "rgba(52,199,89,0.8)" : "rgba(0,0,0,0.4)",
                    backdropFilter: "blur(8px)",
                    color: "white",
                  }}
                >
                  {isPublished ? "Published" : "Publish"}
                </button>
              )}
              {activeInviteCode && (
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 rounded-full text-[12px] font-semibold active:opacity-70"
                  style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)", color: "white" }}
                >
                  Share
                </button>
              )}
              {activeInviteCode && authUser && activeCloudTripId && (
                <button
                  onClick={() => setInviteOpen(true)}
                  className="w-9 h-9 rounded-full flex items-center justify-center active:opacity-70"
                  style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
                >
                  <span className="text-white text-[14px]">+</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trip members row */}
      <div className="px-4 py-3 border-b" style={{ borderColor: "var(--td-separator)" }}>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar">
          {groupMembers.map(member => (
            <UserAvatar
              key={member.name}
              name={member.name}
              profile={member.name === currentUser?.name ? authProfile : undefined}
              active={member.name === currentUser?.name}
            />
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div className="px-4 py-2 border-b overflow-x-auto" style={{ borderColor: "var(--td-separator)" }}>
        <div className="flex gap-2 min-w-max">
          {VIEW_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap active:opacity-70 transition-colors"
              style={{
                backgroundColor: activeTab === tab.id ? "var(--td-accent)" : "var(--td-fill)",
                color: activeTab === tab.id ? "var(--td-accent-text)" : "var(--td-label)",
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed map (collapsible, for deeper exploration) */}
      <div className="px-4 mb-2">
        <button
          onClick={() => setMapOpen(o => !o)}
          className="w-full flex items-center justify-between py-3 active:opacity-70"
        >
          <span className="text-[15px] font-semibold" style={{ color: "var(--td-label)" }}>
            Detailed Map & Directions
          </span>
          <span className="text-[13px]" style={{ color: "var(--td-secondary)" }}>{mapOpen ? "▲" : "▼"}</span>
        </button>
        {mapOpen && (
          <Suspense fallback={
            <div className="rounded-2xl flex items-center justify-center"
              style={{ height: 220, backgroundColor: "var(--td-fill)" }}>
              <p className="text-[13px]" style={{ color: "var(--td-secondary)" }}>Loading map…</p>
            </div>
          }>
            <ItineraryMap
              itinerary={activeItinerary}
              destination={activeForm.destination?.name}
              accentColor="var(--td-accent)"
            />
          </Suspense>
        )}
      </div>

      {/* Lodging & Flights */}
      <div className="border-b" style={{ borderColor: "var(--td-separator)" }}>
        <button
          className="w-full px-4 py-3 flex items-center justify-between active:opacity-70"
          onClick={() => setLodgingOpen(o => !o)}
        >
          <span className="text-[15px] font-semibold" style={{ color: "var(--td-label)" }}>
            ✈️ Lodging &amp; Flights
          </span>
          <span className="text-[13px]" style={{ color: "var(--td-secondary)" }}>
            {lodgingOpen ? "▲" : "▼"}
          </span>
        </button>
        {lodgingOpen && (
          <div className="px-4 pb-4 flex flex-col gap-3">
            {/* Flights */}
            <div className="rounded-2xl px-4 py-3 shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
              <a
                href={getFlightsLink(activeForm.destination?.name ?? "", activeForm.start_date, activeForm.end_date)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between active:opacity-70"
              >
                <span className="text-[15px] font-medium" style={{ color: "var(--td-label)" }}>
                  ✈️ Flights to {activeForm.destination?.name}
                </span>
                <span className="text-[13px]" style={{ color: "var(--td-accent)" }}>Google Flights ↗</span>
              </a>
            </div>
            {/* Lodging */}
            <div className="rounded-2xl px-4 py-3 shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
              <p className="text-[13px] font-semibold mb-2" style={{ color: "var(--td-secondary)" }}>
                🏨 Where to stay
              </p>
              <div className="flex flex-wrap gap-3">
                {getLodgingLinks(
                  activeForm.destination?.name ?? "",
                  activeForm.start_date,
                  activeForm.end_date
                ).map(link => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] font-medium underline active:opacity-70"
                    style={{ color: "var(--td-accent)" }}
                  >
                    {link.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Refine this trip */}
      <div className="border-b" style={{ borderColor: "var(--td-separator)" }}>
        <button
          className="w-full px-4 py-3 flex items-center justify-between active:opacity-70"
          onClick={() => setRefineOpen(o => !o)}
        >
          <span className="text-[15px] font-semibold" style={{ color: "var(--td-label)" }}>
            ✨ Refine this trip
          </span>
          <span className="text-[13px]" style={{ color: "var(--td-secondary)" }}>
            {refineOpen ? "▲" : "▼"}
          </span>
        </button>
        {refineOpen && (
          <div className="px-4 pb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {REFINE_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => setRefineText(chip)}
                  className="px-3 py-1.5 rounded-full text-[12px] font-medium active:opacity-70"
                  style={{ backgroundColor: "var(--td-fill)", color: "var(--td-label)" }}
                >
                  {chip}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={refineText}
                onChange={e => setRefineText(e.target.value)}
                placeholder="What would you like to change?"
                className="flex-1 px-4 py-3 rounded-2xl text-[15px] bg-transparent focus:outline-none"
                style={{
                  backgroundColor: "var(--td-card)",
                  color: "var(--td-label)",
                  border: "1px solid var(--td-separator)",
                }}
                onKeyDown={e => { if (e.key === "Enter") handleRefine(); }}
              />
              <button
                onClick={handleRefine}
                disabled={!refineText.trim()}
                className="px-4 py-3 rounded-2xl text-[15px] font-semibold active:opacity-70"
                style={{
                  backgroundColor: refineText.trim() ? "var(--td-accent)" : "var(--td-fill)",
                  color: refineText.trim() ? "var(--td-accent-text)" : "var(--td-secondary)",
                }}
              >
                Refine
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Most Memorable Moment */}
      {activeCloudTripId && (
        <div className="border-b" style={{ borderColor: "var(--td-separator)" }}>
          <button
            className="w-full px-4 py-3 flex items-center justify-between active:opacity-70"
            onClick={() => setMomentsOpen(o => !o)}
          >
            <span className="text-[15px] font-semibold" style={{ color: "var(--td-label)" }}>
              ⭐ Most Memorable Moment
            </span>
            <span className="text-[13px]" style={{ color: "var(--td-secondary)" }}>
              {momentsOpen ? "▲" : "▼"}
            </span>
          </button>
          {momentsOpen && (
            <div className="px-4 pb-4">
              <p className="text-[13px] mb-3" style={{ color: "var(--td-secondary)" }}>
                Share your favorite moment from the trip — everyone can see it!
              </p>

              {/* My moment input */}
              {currentUser && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={myMoment}
                    onChange={e => setMyMoment(e.target.value)}
                    placeholder="What was your most memorable moment?"
                    className="flex-1 px-4 py-3 rounded-2xl text-[14px] bg-transparent focus:outline-none"
                    style={{
                      backgroundColor: "var(--td-card)",
                      color: "var(--td-label)",
                      border: "1px solid var(--td-separator)",
                    }}
                    onKeyDown={e => { if (e.key === "Enter") handleSaveMoment(); }}
                  />
                  <button
                    onClick={handleSaveMoment}
                    disabled={momentSaving || !myMoment.trim()}
                    className="px-4 py-3 rounded-2xl text-[13px] font-semibold active:opacity-70"
                    style={{
                      backgroundColor: myMoment.trim() ? "var(--td-accent)" : "var(--td-fill)",
                      color: myMoment.trim() ? "var(--td-accent-text)" : "var(--td-secondary)",
                    }}
                  >
                    {momentSaving ? "..." : "Save"}
                  </button>
                </div>
              )}

              {/* Everyone's moments */}
              {Object.entries(moments).filter(([, m]) => m.trim()).length > 0 && (
                <div className="rounded-2xl overflow-hidden shadow-sm divide-y"
                  style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}>
                  {Object.entries(moments).filter(([, m]) => m.trim()).map(([name, moment]) => (
                    <div key={name} className="px-4 py-3 flex items-start gap-3">
                      <UserAvatar name={name} size="sm" showLabel={false} />
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] font-semibold" style={{ color: "var(--td-label)" }}>
                          {name}
                        </span>
                        <p className="text-[14px] mt-0.5" style={{ color: "var(--td-secondary)" }}>
                          "{moment}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Days */}
      <div className="py-6 flex flex-col gap-6">
        {activeItinerary.days.map(day => {
          // For category tabs: show all time slots but filter options within each slot
          // For Lodging and Travel tabs: only show slots that have matching options
          const isTimeBased = activeTab === "all" || activeTab === "food" || activeTab === "attraction" || activeTab === "adventure";

          const slotsToRender = isTimeBased
            ? day.slots.map(slot => {
                const merged = getMergedOptions(slot);
                const filtered = activeTab === "all"
                  ? merged
                  : merged.filter(opt => opt.category === activeTab);
                return { ...slot, options: filtered, _allOptions: merged };
              }).filter(slot => activeTab === "all" || slot.options.length > 0)
            : day.slots
                .map(slot => {
                  const merged = getMergedOptions(slot);
                  const filtered = merged.filter(opt => opt.category === activeTab);
                  return { ...slot, options: filtered, _allOptions: merged };
                })
                .filter(slot => slot.options.length > 0);

          if (slotsToRender.length === 0) return null;

          return (
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
              {slotsToRender.map(slot => {
                const allMerged = slot.options;
                // Per-category booking: check each option's category
                // On Full Trip, hide unbooked options only for categories that have a booking
                const displayOpts = activeTab === "all"
                  ? allMerged.filter(opt => {
                      const catKey = `${slot.id}:${opt.category}`;
                      const bookedId = bookedSlots[catKey];
                      // If this category is booked in this slot, only show the booked option
                      return !bookedId || bookedId === opt.id;
                    })
                  : allMerged;
                const allUsers = Object.keys(activeSelections);
                const thisSlotVotes = allUsers.filter(u => activeSelections[u]?.[slot.id]).length;
                const fullSlotOpts = getMergedOptions(slot);
                const primaryCategory = fullSlotOpts[0]?.category ?? "attraction";
                // Check if ANY category in this slot has a booking
                const hasAnyBooking = allMerged.some(opt => bookedSlots[`${slot.id}:${opt.category}`]);
                const showWriteIn = ["food", "attraction", "adventure"].includes(primaryCategory);
                return (
                  <div key={slot.id}>
                    <div className="flex items-center justify-between px-1 mb-1.5">
                      <p className="text-[12px] uppercase tracking-wide" style={{ color: "var(--td-secondary)" }}>
                        {SLOT_LABELS[slot.slot_type]}
                      </p>
                      <div className="flex items-center gap-2">
                        {hasAnyBooking && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ backgroundColor: "#34C75930", color: "#34C759" }}>
                            Booked
                          </span>
                        )}
                        {thisSlotVotes > 0 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: "var(--td-fill)", color: "var(--td-secondary)" }}>
                            {thisSlotVotes} voted
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-sm divide-y"
                      style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}>
                      {displayOpts.map(opt => {
                        const voters = Object.entries(activeSelections)
                          .filter(([, slotSels]) => slotSels[slot.id] === opt.id)
                          .map(([name]) => name);
                        const catKey = `${slot.id}:${opt.category}`;
                        const isBooked = bookedSlots[catKey] === opt.id;
                        const catHasBooking = !!bookedSlots[catKey];
                        return (
                          <OptionCard
                            key={opt.id}
                            option={opt}
                            selected={getSlotSelection(slot.id, allMerged) === opt.id}
                            onSelect={() => selectOption(slot.id, opt.id)}
                            link={opt.isCustom ? null : getActivityLink(opt, activeForm.destination?.name)}
                            photosLink={getPhotosLink(opt, activeForm.destination?.name)}
                            voters={voters}
                            booked={isBooked}
                            onBook={!catHasBooking ? () => handleBookSlot(slot.id, opt.id, opt.category) : undefined}
                            onUnbook={isBooked ? () => handleUnbook(slot.id, opt.category) : undefined}
                          />
                        );
                      })}
                      {/* Write-in forms */}
                      {showWriteIn && (
                        <WriteInForm
                          slotId={slot.id}
                          slotCategory={primaryCategory}
                          onAdd={(title, description) => handleAddWriteIn(slot.id, primaryCategory, title, description)}
                        />
                      )}
                    </div>
                    {/* Slot photos */}
                    {activeCloudTripId && (
                      <SlotPhotos
                        tripId={activeCloudTripId}
                        slotId={slot.id}
                        userId={authUser?.id ?? null}
                        photos={slotPhotos[slot.id] ?? []}
                        onPhotoAdded={refreshCloudData}
                      />
                    )}
                  </div>
                );
              })}
              {/* Hidden Gem */}
              {(() => {
                const gem = activeItinerary.hiddenGems?.find(g => g.day_number === day.day_number);
                if (!gem) return null;
                return (
                  <div
                    className="rounded-2xl px-4 py-3 shadow-sm"
                    style={{ backgroundColor: "color-mix(in srgb, var(--td-accent) 10%, var(--td-card))" }}
                  >
                    <p className="text-[12px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--td-accent)" }}>
                      🪄 Hidden Gem
                    </p>
                    <p className="text-[14px] leading-snug" style={{ color: "var(--td-label)" }}>
                      {gem.tip}
                    </p>
                    {gem.location && (
                      <p className="text-[12px] mt-1" style={{ color: "var(--td-secondary)" }}>
                        📍 {gem.location}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
          );
        })}

        <div className="flex flex-col items-center gap-3 pb-8 safe-bottom px-4">
          {activeCloudTripId && authUser && (
            <>
              <button
                onClick={() => navigate(`/book/${activeCloudTripId}`)}
                className="w-full py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98] transition-transform"
                style={{
                  background: "linear-gradient(135deg, #C8A97E, #8B6914)",
                  color: "white",
                  boxShadow: "0 4px 16px rgba(200,169,126,0.3)",
                }}
              >
                Create Photo Book
              </button>
              <button
                onClick={() => navigate(`/postcard?tripId=${activeCloudTripId}`)}
                className="w-full py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98] transition-transform"
                style={{
                  background: "linear-gradient(135deg, #E63956, #B82E44)",
                  color: "white",
                  boxShadow: "0 4px 16px rgba(230,57,86,0.3)",
                }}
              >
                Send a Postcard
              </button>
            </>
          )}
          <button onClick={() => navigate("/")} className="text-[15px]"
            style={{ color: "var(--td-accent)" }}>
            Plan another trip
          </button>
        </div>
      </div>
    </div>
  );
}
