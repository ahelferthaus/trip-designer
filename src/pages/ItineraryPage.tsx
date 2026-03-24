import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItineraryStore } from "../store/itineraryStore";
import { useTripStore } from "../store/tripStore";
import type { ActivityOption } from "../lib/types";

const CATEGORY_ICONS: Record<string, string> = {
  food: "🍽️", attraction: "🏛️", adventure: "🧗", rest: "🛋️", transport: "🚌",
};
const SLOT_LABELS: Record<string, string> = {
  morning: "Morning", afternoon: "Afternoon", evening: "Evening", flex: "Flex",
};

function OptionCard({ option, selected, onSelect }: {
  option: ActivityOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left px-4 py-4 flex items-start gap-3 transition-opacity active:opacity-70"
      style={{ backgroundColor: selected ? "color-mix(in srgb, var(--td-accent) 8%, var(--td-card))" : "var(--td-card)" }}
    >
      <div
        className="w-6 h-6 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center"
        style={{
          borderColor: selected ? "var(--td-accent)" : "var(--td-fill)",
          backgroundColor: selected ? "var(--td-accent)" : "transparent",
        }}
      >
        {selected && <span className="text-white text-xs font-bold">✓</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-base">{CATEGORY_ICONS[option.category] ?? "📍"}</span>
          <span className="font-semibold text-[15px] truncate" style={{ color: "var(--td-label)" }}>
            {option.title}
          </span>
        </div>
        <p className="text-[13px] leading-snug" style={{ color: "var(--td-secondary)" }}>
          {option.description}
        </p>
        <div className="flex gap-3 mt-1.5 text-[12px]" style={{ color: "var(--td-secondary)" }}>
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
          {option.location?.name && (
            <span className="truncate">📍 {option.location.name}</span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function ItineraryPage() {
  const { itinerary, loading, error } = useItineraryStore();
  const { form } = useTripStore();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Record<string, string>>({});

  const select = (slotId: string, optionId: string) =>
    setSelected(s => ({ ...s, [slotId]: optionId }));

  const totalCost = () => {
    if (!itinerary) return 0;
    let total = 0;
    for (const day of itinerary.days) {
      for (const slot of day.slots) {
        const chosenId = selected[slot.id];
        const opt = slot.options.find(o => o.id === chosenId) ?? slot.options[0];
        if (opt?.estimated_cost_per_person) total += opt.estimated_cost_per_person;
      }
    }
    return total;
  };

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
            {form.destination?.name}
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

  if (!itinerary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: "var(--td-bg)" }}>
        <p className="mb-4 text-[15px]" style={{ color: "var(--td-secondary)" }}>No itinerary yet.</p>
        <button onClick={() => navigate("/intake")} className="text-[17px]"
          style={{ color: "var(--td-accent)" }}>
          Plan a trip →
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Sticky nav */}
      <div className="sticky top-0 z-10 border-b" style={{
        backgroundColor: "var(--td-nav-bg)",
        borderColor: "var(--td-separator)"
      }}>
        <div className="px-4 safe-top pt-3 pb-3">
          <h1 className="text-[20px] font-bold" style={{ color: "var(--td-accent-text)" }}>
            {itinerary.title}
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-[13px]" style={{ color: "var(--td-accent-text)", opacity: 0.75 }}>
              {form.destination?.name} · {itinerary.days.length} days
            </p>
            <p className="text-[13px] font-semibold" style={{ color: "var(--td-accent-text)" }}>
              ~${totalCost()}/person
            </p>
          </div>
        </div>
      </div>

      {/* Days */}
      <div className="py-6 flex flex-col gap-6">
        {itinerary.days.map(day => (
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
                  <p className="text-[12px] uppercase tracking-wide px-1 mb-1.5"
                    style={{ color: "var(--td-secondary)" }}>
                    {SLOT_LABELS[slot.slot_type]}
                  </p>
                  <div className="rounded-2xl overflow-hidden shadow-sm divide-y"
                    style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}>
                    {slot.options.map(opt => (
                      <OptionCard
                        key={opt.id}
                        option={opt}
                        selected={
                          selected[slot.id]
                            ? selected[slot.id] === opt.id
                            : slot.options[0]?.id === opt.id
                        }
                        onSelect={() => select(slot.id, opt.id)}
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
