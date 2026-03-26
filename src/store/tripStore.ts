import { createContext, useContext, useState, createElement } from "react";
import type { ReactNode } from "react";
import type { IntakeFormData, BudgetLevel, TripVibe, GroupMember, Location, Currency } from "../lib/types";

const defaultForm: IntakeFormData = {
  destination: null,
  start_date: "",
  end_date: "",
  group_members: [{ name: "Me", type: "adult" }],
  budget_level: null,
  budget_currency: "USD",
  budget_per_person: false,
  vibes: [],
  must_haves: "",
  avoid: "",
  dietary: "",
  mobility: "",
};

interface TripStoreContextType {
  form: IntakeFormData;
  setDestination: (d: Location) => void;
  setDates: (start: string, end: string) => void;
  setGroupMembers: (members: GroupMember[]) => void;
  setBudget: (level: BudgetLevel, amount?: number, currency?: Currency, perPerson?: boolean) => void;
  setVibes: (vibes: TripVibe[]) => void;
  setNotes: (must_haves: string, avoid: string, dietary?: string, mobility?: string) => void;
  resetForm: () => void;
  loadForm: (form: IntakeFormData) => void;
}

const TripStoreContext = createContext<TripStoreContextType | null>(null);

export function TripStoreProvider({ children }: { children: ReactNode }) {
  const [form, setFormState] = useState<IntakeFormData>(defaultForm);

  const setDestination = (d: Location) => setFormState(f => ({ ...f, destination: d }));
  const setDates = (start: string, end: string) => setFormState(f => ({ ...f, start_date: start, end_date: end }));
  const setGroupMembers = (members: GroupMember[]) => setFormState(f => ({ ...f, group_members: members }));
  const setBudget = (level: BudgetLevel, amount?: number, currency?: Currency, perPerson?: boolean) =>
    setFormState(f => ({ ...f, budget_level: level, budget_amount: amount, budget_currency: currency ?? f.budget_currency, budget_per_person: perPerson ?? f.budget_per_person }));
  const setVibes = (vibes: TripVibe[]) => setFormState(f => ({ ...f, vibes }));
  const setNotes = (must_haves: string, avoid: string, dietary?: string, mobility?: string) =>
    setFormState(f => ({ ...f, must_haves, avoid, dietary: dietary ?? f.dietary, mobility: mobility ?? f.mobility }));
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
