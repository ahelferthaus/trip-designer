import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTripStore } from "../store/tripStore";
import { useItineraryStore } from "../store/itineraryStore";
import { useAuth } from "../store/authStore";
import { generateItinerary } from "../lib/generateItinerary";
import { isSupabaseConfigured, saveCloudTrip } from "../lib/supabaseTrips";
import { updateTripCloudData } from "../lib/tripStorage";
import CalendarPicker from "../components/intake/CalendarPicker";
import GroupPresetPicker from "../components/intake/GroupPresetPicker";
import type { BudgetLevel, TripVibe, GroupMember, Currency } from "../lib/types";

const CURRENCIES: { id: Currency; label: string; symbol: string }[] = [
  { id: "USD", label: "USD", symbol: "$" },
  { id: "EUR", label: "EUR", symbol: "€" },
  { id: "GBP", label: "GBP", symbol: "£" },
  { id: "JPY", label: "JPY", symbol: "¥" },
  { id: "CAD", label: "CAD", symbol: "CA$" },
  { id: "AUD", label: "AUD", symbol: "A$" },
];

const TOTAL_STEPS = 7;

const VIBES: { id: TripVibe; label: string; emoji: string }[] = [
  { id: "relaxed", label: "Relaxed", emoji: "🏖️" },
  { id: "adventure", label: "Adventure", emoji: "🧗" },
  { id: "culture", label: "Culture", emoji: "🏛️" },
  { id: "food", label: "Food & Drink", emoji: "🍷" },
  { id: "nightlife", label: "Nightlife", emoji: "🎵" },
  { id: "nature", label: "Nature", emoji: "🏔️" },
  { id: "family", label: "Family-friendly", emoji: "👨‍👩‍👧" },
  { id: "romance", label: "Romance", emoji: "💑" },
];

const BUDGETS: { id: BudgetLevel; label: string; emoji: string; desc: string }[] = [
  { id: "budget", label: "Budget", emoji: "🎒", desc: "Hostels, street food, free activities" },
  { id: "mid", label: "Mid-range", emoji: "✈️", desc: "Hotels, sit-down meals, paid tours" },
  { id: "splurge", label: "Splurge", emoji: "🥂", desc: "Luxury stays, fine dining, private guides" },
];

const STEP_TITLES = [
  "Where to?",
  "When?",
  "Who's coming?",
  "Budget",
  "Vibe",
  "Anything else?",
  "Review",
];

function daysBetween(start: string, end: string) {
  if (!start || !end) return 0;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export default function IntakePage() {
  const navigate = useNavigate();
  const store = useTripStore();
  const { form } = store;
  const itineraryStore = useItineraryStore();
  const { user: authUser } = useAuth();

  const [step, setStep] = useState(1);
  const [destinationText, setDestinationText] = useState(form.destination?.name ?? "");
  const [members, setMembers] = useState<GroupMember[]>(form.group_members);

  const days = daysBetween(form.start_date, form.end_date);

  const canNext = () => {
    if (step === 1) return destinationText.trim().length > 0;
    if (step === 2) return !!form.start_date && !!form.end_date && days > 0;
    if (step === 3) return members.length > 0;
    if (step === 4) return !!form.budget_level;
    if (step === 5) return form.vibes.length > 0;
    return true;
  };

  const handleNext = () => {
    if (step === 1) store.setDestination({ name: destinationText.trim() });
    if (step === 3) store.setGroupMembers(members);
    if (step < TOTAL_STEPS) setStep(s => s + 1);
    else handleSubmit();
  };

  const handleSubmit = async () => {
    store.setGroupMembers(members);
    itineraryStore.setLoading(true);
    itineraryStore.setError(null);
    navigate("/itinerary");
    try {
      const finalForm = { ...form, group_members: members };
      const result = await generateItinerary(finalForm);
      const saved = itineraryStore.setItinerary(result, finalForm);
      // Cloud-save if Supabase is configured
      if (isSupabaseConfigured()) {
        const createdBy = members[0]?.name ?? "anonymous";
        const passcode = localStorage.getItem("td-passcode") ?? "1234";
        try {
          const cloud = await saveCloudTrip(finalForm, result, createdBy, passcode, authUser?.id);
          updateTripCloudData(saved.id, cloud.id, cloud.invite_code);
          itineraryStore.setCloudTripInfo(cloud.id, cloud.invite_code);
        } catch {
          // Cloud save failure is non-fatal
        }
      }
    } catch (err) {
      console.error("Trip generation failed:", err);
      itineraryStore.setError(
        err instanceof Error ? err.message : "Couldn't generate your itinerary. Please try again."
      );
    } finally {
      itineraryStore.setLoading(false);
    }
  };

  const toggleVibe = (v: TripVibe) => {
    const current = form.vibes;
    if (current.includes(v)) store.setVibes(current.filter(x => x !== v));
    else if (current.length < 3) store.setVibes([...current, v]);
  };

  const addMember = () => setMembers(m => [...m, { name: "", type: "adult" }]);
  const removeMember = (i: number) => setMembers(m => m.filter((_, idx) => idx !== i));
  const updateMember = (i: number, patch: Partial<GroupMember>) =>
    setMembers(m => m.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Nav bar */}
      <div className="px-4 safe-top pt-3 pb-2 flex items-center justify-between"
        style={{ backgroundColor: "var(--td-bg)" }}>
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate("/")}
          className="text-[17px]"
          style={{ color: "var(--td-accent)" }}
        >
          ‹ {step > 1 ? "Back" : "Home"}
        </button>
        <span className="text-[13px]" style={{ color: "var(--td-secondary)" }}>
          {step} of {TOTAL_STEPS}
        </span>
        <div className="w-16" />
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-6">
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: "var(--td-fill)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%`, backgroundColor: "var(--td-accent)" }}
          />
        </div>
      </div>

      {/* Title */}
      <div className="px-6 mb-6">
        <h2 className="text-[34px] font-bold tracking-tight leading-tight"
          style={{ color: "var(--td-label)" }}>
          {STEP_TITLES[step - 1]}
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 px-4">

        {/* Step 1: Destination */}
        {step === 1 && (
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
            <input
              type="text"
              value={destinationText}
              onChange={e => setDestinationText(e.target.value)}
              placeholder="e.g. Florence, Italy"
              className="w-full px-4 py-4 text-[17px] focus:outline-none bg-transparent"
              style={{ color: "var(--td-label)" }}
              autoFocus
              onKeyDown={e => e.key === "Enter" && canNext() && handleNext()}
            />
          </div>
        )}

        {/* Step 2: Dates */}
        {step === 2 && (
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
            <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--td-separator)" }}>
              <span className="text-[15px] block mb-2" style={{ color: "var(--td-secondary)" }}>Start date</span>
              <CalendarPicker
                value={form.start_date}
                onChange={(date) => store.setDates(date, form.end_date)}
                label="Select start date"
              />
            </div>
            <div className="px-4 py-4" style={{ borderBottom: days > 0 ? "1px solid var(--td-separator)" : "none" }}>
              <span className="text-[15px] block mb-2" style={{ color: "var(--td-secondary)" }}>End date</span>
              <CalendarPicker
                value={form.end_date}
                onChange={(date) => store.setDates(form.start_date, date)}
                label="Select end date"
              />
            </div>
            {days > 0 && (
              <div className="px-4 py-3">
                <span className="text-[15px] font-medium" style={{ color: "var(--td-accent)" }}>
                  {days}-day trip
                </span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Group */}
        {step === 3 && (
          <div>
            {authUser && (
              <GroupPresetPicker
                userId={authUser.id}
                onLoadGroup={(loaded) => setMembers(loaded)}
              />
            )}
            <div className="rounded-2xl overflow-hidden shadow-sm mb-3" style={{ backgroundColor: "var(--td-card)" }}>
              {members.map((m, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: i < members.length - 1 ? "1px solid var(--td-separator)" : "none" }}>
                  <input
                    type="text"
                    value={m.name}
                    onChange={e => updateMember(i, { name: e.target.value })}
                    placeholder="Name"
                    className="flex-1 text-[17px] focus:outline-none bg-transparent"
                    style={{ color: "var(--td-label)" }}
                  />
                  <select
                    value={m.type}
                    onChange={e => updateMember(i, { type: e.target.value as "adult" | "child", age: undefined })}
                    className="text-[15px] bg-transparent focus:outline-none"
                    style={{ color: "var(--td-accent)" }}
                  >
                    <option value="adult">Adult</option>
                    <option value="child">Child</option>
                  </select>
                  {m.type === "child" && (
                    <input
                      type="number"
                      value={m.age ?? ""}
                      onChange={e => updateMember(i, { age: parseInt(e.target.value) })}
                      placeholder="Age"
                      min={1} max={17}
                      className="w-14 text-[15px] text-right focus:outline-none bg-transparent"
                      style={{ color: "var(--td-label)" }}
                    />
                  )}
                  {members.length > 1 && (
                    <button onClick={() => removeMember(i)} className="text-xl leading-none ml-1"
                      style={{ color: "#FF3B30" }}>−</button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addMember} className="text-[17px] px-4 py-2"
              style={{ color: "var(--td-accent)" }}>
              + Add person
            </button>
          </div>
        )}

        {/* Step 4: Budget */}
        {step === 4 && (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
              {BUDGETS.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => store.setBudget(b.id, form.budget_amount, form.budget_currency, form.budget_per_person)}
                  className="w-full flex items-center gap-4 px-4 py-4 transition-colors active:opacity-70"
                  style={{ borderBottom: i < BUDGETS.length - 1 ? "1px solid var(--td-separator)" : "none" }}
                >
                  <span className="text-2xl w-8">{b.emoji}</span>
                  <div className="flex-1 text-left">
                    <div className="text-[17px] font-medium" style={{ color: "var(--td-label)" }}>{b.label}</div>
                    <div className="text-[13px]" style={{ color: "var(--td-secondary)" }}>{b.desc}</div>
                  </div>
                  {form.budget_level === b.id && (
                    <span className="text-xl" style={{ color: "var(--td-accent)" }}>✓</span>
                  )}
                </button>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
              <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid var(--td-separator)" }}>
                <input
                  type="number"
                  value={form.budget_amount ?? ""}
                  onChange={e => store.setBudget(form.budget_level!, parseInt(e.target.value) || undefined, form.budget_currency, form.budget_per_person)}
                  placeholder="Amount (optional)"
                  min={0}
                  className="flex-1 text-[17px] focus:outline-none bg-transparent"
                  style={{ color: "var(--td-label)" }}
                />
                <select
                  value={form.budget_currency ?? "USD"}
                  onChange={e => store.setBudget(form.budget_level!, form.budget_amount, e.target.value as Currency, form.budget_per_person)}
                  className="text-[15px] bg-transparent focus:outline-none"
                  style={{ color: "var(--td-accent)" }}
                >
                  {CURRENCIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => store.setBudget(form.budget_level!, form.budget_amount, form.budget_currency, !form.budget_per_person)}
                className="w-full flex items-center justify-between px-4 py-3 active:opacity-70"
              >
                <span className="text-[15px]" style={{ color: "var(--td-label)" }}>Per person</span>
                <span className="text-xl" style={{ color: form.budget_per_person ? "var(--td-accent)" : "var(--td-fill)" }}>
                  {form.budget_per_person ? "✓" : "○"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Vibe */}
        {step === 5 && (
          <div>
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
              {VIBES.map((v, i) => {
                const selected = form.vibes.includes(v.id);
                const disabled = !selected && form.vibes.length >= 3;
                return (
                  <button
                    key={v.id}
                    onClick={() => !disabled && toggleVibe(v.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 transition-colors ${disabled ? "opacity-40" : "active:opacity-70"}`}
                    style={{ borderBottom: i < VIBES.length - 1 ? "1px solid var(--td-separator)" : "none" }}
                  >
                    <span className="text-xl w-8">{v.emoji}</span>
                    <span className="flex-1 text-left text-[17px]" style={{ color: "var(--td-label)" }}>{v.label}</span>
                    {selected && <span className="text-xl" style={{ color: "var(--td-accent)" }}>✓</span>}
                  </button>
                );
              })}
            </div>
            <p className="text-[13px] px-4 mt-2" style={{ color: "var(--td-secondary)" }}>
              {form.vibes.length}/3 selected
            </p>
          </div>
        )}

        {/* Step 6: Notes */}
        {step === 6 && (
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[13px] uppercase tracking-wide px-4 mb-1" style={{ color: "var(--td-secondary)" }}>
                Must-haves
              </p>
              <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--td-card)" }}>
                <textarea
                  value={form.must_haves ?? ""}
                  onChange={e => store.setNotes(e.target.value, form.avoid ?? "", form.dietary, form.mobility)}
                  placeholder="e.g. Must do the Uffizi. Need a beach day."
                  rows={3}
                  className="w-full px-4 py-4 text-[17px] focus:outline-none resize-none bg-transparent"
                  style={{ color: "var(--td-label)" }}
                />
              </div>
            </div>
            <div>
              <p className="text-[13px] uppercase tracking-wide px-4 mb-1" style={{ color: "var(--td-secondary)" }}>
                Avoid
              </p>
              <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--td-card)" }}>
                <textarea
                  value={form.avoid ?? ""}
                  onChange={e => store.setNotes(form.must_haves ?? "", e.target.value, form.dietary, form.mobility)}
                  placeholder="e.g. No overly touristy spots."
                  rows={3}
                  className="w-full px-4 py-4 text-[17px] focus:outline-none resize-none bg-transparent"
                  style={{ color: "var(--td-label)" }}
                />
              </div>
            </div>
            <div>
              <p className="text-[13px] uppercase tracking-wide px-4 mb-1" style={{ color: "var(--td-secondary)" }}>
                Dietary restrictions
              </p>
              <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--td-card)" }}>
                <textarea
                  value={form.dietary ?? ""}
                  onChange={e => store.setNotes(form.must_haves ?? "", form.avoid ?? "", e.target.value, form.mobility)}
                  placeholder="e.g. Vegetarian, nut allergy, halal"
                  rows={2}
                  className="w-full px-4 py-4 text-[17px] focus:outline-none resize-none bg-transparent"
                  style={{ color: "var(--td-label)" }}
                />
              </div>
            </div>
            <div>
              <p className="text-[13px] uppercase tracking-wide px-4 mb-1" style={{ color: "var(--td-secondary)" }}>
                Mobility / accessibility
              </p>
              <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--td-card)" }}>
                <textarea
                  value={form.mobility ?? ""}
                  onChange={e => store.setNotes(form.must_haves ?? "", form.avoid ?? "", form.dietary, e.target.value)}
                  placeholder="e.g. Wheelchair accessible, limited walking"
                  rows={2}
                  className="w-full px-4 py-4 text-[17px] focus:outline-none resize-none bg-transparent"
                  style={{ color: "var(--td-label)" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Review */}
        {step === 7 && (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: "var(--td-card)" }}>
              {[
                { label: "Destination", value: destinationText },
                { label: "Dates", value: `${form.start_date} — ${form.end_date} (${days} days)` },
                { label: "Group", value: members.filter(m => m.name.trim()).map(m => m.name).join(", ") || "—" },
                { label: "Budget", value: [
                  BUDGETS.find(b => b.id === form.budget_level)?.label,
                  form.budget_amount ? `${form.budget_currency ?? "USD"} ${form.budget_amount.toLocaleString()}` : null,
                  form.budget_per_person ? "per person" : null,
                ].filter(Boolean).join(" · ") || "—" },
                { label: "Vibe", value: form.vibes.map(v => VIBES.find(x => x.id === v)?.label).filter(Boolean).join(", ") || "—" },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center px-4 py-3.5"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--td-separator)" : "none" }}
                >
                  <span className="text-[15px]" style={{ color: "var(--td-secondary)" }}>{row.label}</span>
                  <span className="text-[15px] font-medium text-right max-w-[60%]" style={{ color: "var(--td-label)" }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            {(form.must_haves || form.avoid || form.dietary || form.mobility) && (
              <div className="rounded-2xl shadow-sm overflow-hidden px-4 py-3" style={{ backgroundColor: "var(--td-card)" }}>
                {form.must_haves && (
                  <div className="mb-2">
                    <span className="text-[12px] uppercase tracking-wide" style={{ color: "var(--td-secondary)" }}>Must-haves: </span>
                    <span className="text-[14px]" style={{ color: "var(--td-label)" }}>{form.must_haves}</span>
                  </div>
                )}
                {form.avoid && (
                  <div className="mb-2">
                    <span className="text-[12px] uppercase tracking-wide" style={{ color: "var(--td-secondary)" }}>Avoid: </span>
                    <span className="text-[14px]" style={{ color: "var(--td-label)" }}>{form.avoid}</span>
                  </div>
                )}
                {form.dietary && (
                  <div className="mb-2">
                    <span className="text-[12px] uppercase tracking-wide" style={{ color: "var(--td-secondary)" }}>Dietary: </span>
                    <span className="text-[14px]" style={{ color: "var(--td-label)" }}>{form.dietary}</span>
                  </div>
                )}
                {form.mobility && (
                  <div>
                    <span className="text-[12px] uppercase tracking-wide" style={{ color: "var(--td-secondary)" }}>Mobility: </span>
                    <span className="text-[14px]" style={{ color: "var(--td-label)" }}>{form.mobility}</span>
                  </div>
                )}
              </div>
            )}
            <p className="text-[13px] px-4" style={{ color: "var(--td-secondary)" }}>
              Look good? Hit "Build my trip" to generate your AI itinerary.
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-4 pt-6 pb-8 safe-bottom">
        <button
          onClick={handleNext}
          disabled={!canNext()}
          className="w-full py-4 rounded-2xl text-[17px] font-semibold transition-opacity active:opacity-70"
          style={{
            backgroundColor: canNext() ? "var(--td-accent)" : "var(--td-fill)",
            color: canNext() ? "var(--td-accent-text)" : "var(--td-secondary)",
            cursor: canNext() ? "pointer" : "not-allowed",
          }}
        >
          {step === TOTAL_STEPS ? "Build my trip 🚀" : "Continue"}
        </button>
      </div>
    </div>
  );
}
