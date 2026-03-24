import { createContext, useContext, useState, createElement } from "react";
import type { ReactNode } from "react";
import type { IntakeFormData, BudgetLevel, TripVibe, GroupMember, Location } from "../lib/types";

const defaultForm: IntakeFormData = {
  destination: null,
  start_date: "",
  end_date: "",
  group_members: [{ name: "Me", type: "adult" }],
  budget_level: null,
  vibes: [],
  must_haves: "",
  avoid: "",
};

interface TripStoreContextType {
  form: IntakeFormData;
  setDestination: (d: Location) => void;
  setDates: (start: string, end: string) => void;
  setGroupMembers: (members: GroupMember[]) => void;
  setBudget: (level: BudgetLevel, amount?: number) => void;
  setVibes: (vibes: TripVibe[]) => void;
  setNotes: (must_haves: string, avoid: string) => void;
  resetForm: () => void;
  loadForm: (form: IntakeFormData) => void;
}

const TripStoreContext = createContext<TripStoreContextType | null>(null);

export function TripStoreProvider({ children }: { children: ReactNode }) {
  const [form, setFormState] = useState<IntakeFormData>(defaultForm);

  const setDestination = (d: Location) => setFormState(f => ({ ...f, destination: d }));
  const setDates = (start: string, end: string) => setFormState(f => ({ ...f, start_date: start, end_date: end }));
  const setGroupMembers = (members: GroupMember[]) => setFormState(f => ({ ...f, group_members: members }));
  const setBudget = (level: BudgetLevel, amount?: number) => setFormState(f => ({ ...f, budget_level: level, budget_amount: amount }));
  const setVibes = (vibes: TripVibe[]) => setFormState(f => ({ ...f, vibes }));
  const setNotes = (must_haves: string, avoid: string) => setFormState(f => ({ ...f, must_haves, avoid }));
  const resetForm = () => setFormState(defaultForm);
  const loadForm = (f: IntakeFormData) => setFormState(f);

  return createElement(TripStoreContext.Provider, {
    value: { form, setDestination, setDates, setGroupMembers, setBudget, setVibes, setNotes, resetForm, loadForm },
    children,
  });
}

export function useTripStore() {
  const ctx = useContext(TripStoreContext);
  if (!ctx) throw new Error("useTripStore must be used within TripStoreProvider");
  return ctx;
}
