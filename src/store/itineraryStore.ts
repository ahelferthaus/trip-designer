import { createContext, useContext, useState, createElement } from "react";
import type { ReactNode } from "react";
import type { GeneratedItinerary } from "../lib/generateItinerary";
import type { IntakeFormData } from "../lib/types";
import { saveTrip } from "../lib/tripStorage";

interface ItineraryStoreContextType {
  itinerary: GeneratedItinerary | null;
  loading: boolean;
  error: string | null;
  setItinerary: (i: GeneratedItinerary, form: IntakeFormData) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  clearItinerary: () => void;
}

const ItineraryStoreContext = createContext<ItineraryStoreContextType | null>(null);

export function ItineraryStoreProvider({ children }: { children: ReactNode }) {
  const [itinerary, setItineraryState] = useState<GeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setItinerary = (i: GeneratedItinerary, form: IntakeFormData) => {
    setItineraryState(i);
    saveTrip(form, i); // auto-persist
  };

  const clearItinerary = () => setItineraryState(null);

  return createElement(ItineraryStoreContext.Provider, {
    value: { itinerary, loading, error, setItinerary, setLoading, setError, clearItinerary },
    children,
  });
}

export function useItineraryStore() {
  const ctx = useContext(ItineraryStoreContext);
  if (!ctx) throw new Error("useItineraryStore must be used within ItineraryStoreProvider");
  return ctx;
}
