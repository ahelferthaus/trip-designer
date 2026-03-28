import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useItineraryStore } from "../store/itineraryStore";
import { useTripStore } from "../store/tripStore";
import { useAuth } from "../store/authStore";
import { getTripByInviteCode, joinTrip } from "../lib/supabaseTrips";
import { getInvitationByToken, acceptInvitation } from "../lib/tripInvitations";
import { setCurrentUser } from "../lib/userSession";
import type { CloudTrip } from "../lib/supabaseTrips";

type Step = "loading" | "passcode" | "name" | "joining";

export default function JoinPage() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const itineraryStore = useItineraryStore();
  const tripStore = useTripStore();
  const { user: authUser } = useAuth();

  const [trip, setTrip] = useState<CloudTrip | null>(null);
  const [step, setStep] = useState<Step>("loading");
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!inviteCode) {
      navigate("/", { replace: true });
      return;
    }

    (async () => {
      const t = await getTripByInviteCode(inviteCode);
      if (!t) {
        setFetchError("Trip not found. Check the invite link.");
        setStep("passcode");
        return;
      }
      setTrip(t);

      // If there's a token and user is authenticated, try auto-accept
      if (token && authUser) {
        const invitation = await getInvitationByToken(token);
        if (invitation && invitation.invited_email === authUser.email) {
          await acceptInvitation(invitation.id);
          const displayName = authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User";
          setStep("joining");
          await joinTrip(t.id, displayName, authUser.id);
          setCurrentUser(displayName, t.id);
          itineraryStore.setItinerary(t.itinerary_data, t.form_data);
          itineraryStore.setCloudTripInfo(t.id, t.invite_code);
          tripStore.loadForm(t.form_data);
          navigate("/itinerary", { replace: true });
          return;
        }
      }

      setStep("passcode");
    })();
  }, [inviteCode, navigate, authUser, token]);

  const handlePasscode = () => {
    if (trip && passcode === trip.passcode) {
      setPasscodeError(false);
      setStep("name");
    } else {
      setPasscodeError(true);
    }
  };

  const handleJoin = async () => {
    if (!trip || !name.trim()) {
      setNameError(true);
      return;
    }
    setStep("joining");
    await joinTrip(trip.id, name.trim(), authUser?.id);
    setCurrentUser(name.trim(), trip.id);
    itineraryStore.setItinerary(trip.itinerary_data, trip.form_data);
    itineraryStore.setCloudTripInfo(trip.id, trip.invite_code);
    tripStore.loadForm(trip.form_data);
    navigate("/itinerary", { replace: true });
  };

  if (step === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--td-bg)" }}>
        <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24" style={{ color: "var(--td-accent)" }}>
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }

  if (step === "joining") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--td-bg)" }}>
        <div className="text-center">
          <svg className="animate-spin w-8 h-8 mx-auto mb-3" fill="none" viewBox="0 0 24 24" style={{ color: "var(--td-accent)" }}>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p style={{ color: "var(--td-label)" }}>Joining trip…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "var(--td-bg)" }}>
      <div className="w-full max-w-sm">
        {fetchError ? (
          <>
            <div className="text-4xl mb-4 text-center">🔗</div>
            <h2 className="text-[22px] font-bold mb-2 text-center" style={{ color: "var(--td-label)" }}>
              {fetchError}
            </h2>
            <button
              onClick={() => navigate("/home")}
              className="w-full py-4 rounded-2xl text-[17px] font-semibold mt-6 active:opacity-70"
              style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
            >
              Go Home
            </button>
          </>
        ) : step === "passcode" ? (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">✈️</div>
              <h2 className="text-[28px] font-bold mb-1" style={{ color: "var(--td-label)" }}>
                {trip?.title ?? "Join Trip"}
              </h2>
              {trip && (
                <p className="text-[15px]" style={{ color: "var(--td-secondary)" }}>
                  {trip.destination}
                </p>
              )}
            </div>

            <p className="text-[15px] mb-4 text-center" style={{ color: "var(--td-secondary)" }}>
              Enter the trip passcode
            </p>

            <div className="rounded-2xl overflow-hidden shadow-sm mb-4" style={{ backgroundColor: "var(--td-card)" }}>
              <input
                type="password"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Passcode"
                maxLength={8}
                className="w-full px-4 py-4 text-[17px] text-center bg-transparent focus:outline-none"
                style={{ color: "var(--td-label)" }}
                autoFocus
                onKeyDown={e => { if (e.key === "Enter") handlePasscode(); }}
              />
            </div>

            {passcodeError && (
              <p className="text-[13px] text-center mb-4" style={{ color: "#FF3B30" }}>
                Wrong passcode. Ask the trip organizer.
              </p>
            )}

            <button
              onClick={handlePasscode}
              disabled={passcode.length === 0}
              className="w-full py-4 rounded-2xl text-[17px] font-semibold mb-3 active:opacity-70"
              style={{
                backgroundColor: passcode.length > 0 ? "var(--td-accent)" : "var(--td-fill)",
                color: passcode.length > 0 ? "var(--td-accent-text)" : "var(--td-secondary)",
              }}
            >
              Continue
            </button>

            <button
              onClick={() => navigate("/home")}
              className="w-full py-3 text-[17px] active:opacity-70"
              style={{ color: "var(--td-secondary)" }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2 className="text-[28px] font-bold mb-2 text-center" style={{ color: "var(--td-label)" }}>
              What's your name?
            </h2>
            <p className="text-[15px] mb-6 text-center" style={{ color: "var(--td-secondary)" }}>
              This is how you'll appear to others on the trip
            </p>

            <div className="rounded-2xl overflow-hidden shadow-sm mb-4" style={{ backgroundColor: "var(--td-card)" }}>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setNameError(false); }}
                placeholder="Your name"
                maxLength={30}
                className="w-full px-4 py-4 text-[17px] text-center bg-transparent focus:outline-none"
                style={{ color: "var(--td-label)" }}
                autoFocus
                onKeyDown={e => { if (e.key === "Enter") handleJoin(); }}
              />
            </div>

            {nameError && (
              <p className="text-[13px] text-center mb-4" style={{ color: "#FF3B30" }}>
                Please enter your name.
              </p>
            )}

            <button
              onClick={handleJoin}
              disabled={!name.trim()}
              className="w-full py-4 rounded-2xl text-[17px] font-semibold mb-3 active:opacity-70"
              style={{
                backgroundColor: name.trim() ? "var(--td-accent)" : "var(--td-fill)",
                color: name.trim() ? "var(--td-accent-text)" : "var(--td-secondary)",
              }}
            >
              Join Trip
            </button>

            <button
              onClick={() => setStep("passcode")}
              className="w-full py-3 text-[17px] active:opacity-70"
              style={{ color: "var(--td-secondary)" }}
            >
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}
