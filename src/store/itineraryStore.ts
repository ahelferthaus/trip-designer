import { createContext, useContext, useState, createElement } from "react";
import type { ReactNode } from "react";
import type { GeneratedItinerary } from "../lib/generateItinerary";

interface ItineraryStoreContextType {
  itinerary: GeneratedItinerary | null;
  loading: boolean;
  error: string | null;
  setItinerary: (i: GeneratedItinerary) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
}

const ItineraryStoreContext = createContext<ItineraryStoreContextType | null>(null);

export function ItineraryStoreProvider({ children }: { children: ReactNode }) {
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return createElement(ItineraryStoreContext.Provider, {
    value: { itinerary, loading, error, setItinerary, setLoading, setError },
    children,
  });
}

export function useItineraryStore() {
  const ctx = useContext(ItineraryStoreContext);
  if (!ctx) throw new Error("useItineraryStore must be used within ItineraryStoreProvider");
  return ctx;
}
