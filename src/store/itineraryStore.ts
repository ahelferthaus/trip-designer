import { createContext, useContext, useState, createElement } from "react";
import type { ReactNode } from "react";
import type { GeneratedItinerary } from "../lib/generateItinerary";
import type { IntakeFormData } from "../lib/types";
import { saveTrip } from "../lib/tripStorage";
import type { SavedTrip } from "../lib/tripStorage";

interface ItineraryStoreContextType {
  itinerary: GeneratedItinerary | null;
  loading: boolean;
  error: string | null;
  cloudTripId: string | null;
  cloudInviteCode: string | null;
  setItinerary: (i: GeneratedItinerary, form: IntakeFormData) => SavedTrip;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  clearItinerary: () => void;
  setCloudTripInfo: (cloudTripId: string, inviteCode: string) => void;
}

const ItineraryStoreContext = createContext<ItineraryStoreContextType | null>(null);

export function ItineraryStoreProvider({ children }: { children: ReactNode }) {
  const [itinerary, setItineraryState] = useState<GeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cloudTripId, setCloudTripId] = useState<string | null>(null);
  const [cloudInviteCode, setCloudInviteCode] = useState<string | null>(null);

  const setItinerary = (i: GeneratedItinerary, form: IntakeFormData): SavedTrip => {
    setItineraryState(i);
    return saveTrip(form, i); // auto-persist, return saved trip
  };

  const clearItinerary = () => {
    setItineraryState(null);
    setCloudTripId(null);
    setCloudInviteCode(null);
  };

  const setCloudTripInfo = (id: string, inviteCode: string) => {
    setCloudTripId(id);
    setCloudInviteCode(inviteCode);
  };

  return createElement(ItineraryStoreContext.Provider, {
    value: {
      itinerary,
      loading,
      error,
      cloudTripId,
      cloudInviteCode,
      setItinerary,
      setLoading,
      setError,
      clearItinerary,
      setCloudTripInfo,
    },
    children,
  });
}

export function useItineraryStore() {
  const ctx = useContext(ItineraryStoreContext);
  if (!ctx) throw new Error("useItineraryStore must be used within ItineraryStoreProvider");
  return ctx;
}
