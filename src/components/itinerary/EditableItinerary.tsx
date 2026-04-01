import { useState } from "react";
import type { GeneratedItinerary } from "../../lib/generateItinerary";

const SLOT_LABELS: Record<string, string> = { morning: "Morning", afternoon: "Afternoon", evening: "Evening", flex: "Flex" };
const CAT_ICONS: Record<string, string> = { food: "🍽️", attraction: "🏛️", adventure: "🧗", rest: "🛋️", transport: "🚌" };

interface EditableItineraryProps {
  itinerary: GeneratedItinerary;
  editable?: boolean;
  onUpdate?: (itinerary: GeneratedItinerary) => void;
}

/**
 * Displays an itinerary with all options per slot.
 * In editable mode: users can select preferred option, edit text, remove activities.
 */
export default function EditableItinerary({ itinerary, editable = false, onUpdate }: EditableItineraryProps) {
  // Track which option is selected per slot (default: first option)
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [expandedSlot, setExpandedSlot] = useState<string | null>(null);
  const [editingOpt, setEditingOpt] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const getSelection = (slotId: string) => selections[slotId] ?? 0;

  const selectOption = (slotId: string, optIdx: number) => {
    setSelections(prev => ({ ...prev, [slotId]: optIdx }));
  };

  const handleEditSave = (dayIdx: number, slotIdx: number, optIdx: number) => {
    if (!onUpdate || !editText.trim()) return;
    const updated = { ...itinerary };
    const newDays = [...updated.days];
    const day = { ...newDays[dayIdx] };
    const slots = [...day.slots];
    const slot = { ...slots[slotIdx] };
    const options = [...slot.options];
    options[optIdx] = { ...options[optIdx], description: editText };
    slot.options = options;
    slots[slotIdx] = slot;
    day.slots = slots;
    newDays[dayIdx] = day;
    onUpdate({ ...updated, days: newDays });
    setEditingOpt(null);
  };

  const removeOption = (dayIdx: number, slotIdx: number, optIdx: number) => {
    if (!onUpdate) return;
    const updated = { ...itinerary };
    const newDays = [...updated.days];
    const day = { ...newDays[dayIdx] };
    const slots = [...day.slots];
    const slot = { ...slots[slotIdx] };
    slot.options = slot.options.filter((_, i) => i !== optIdx);
    slots[slotIdx] = slot;
    day.slots = slots;
    newDays[dayIdx] = day;
    onUpdate({ ...updated, days: newDays });
  };

  return (
    <div className="flex flex-col gap-0">
      {itinerary.days.map((day, dayIdx) => (
        <div key={day.id} className="flex gap-3">
          {/* Timeline rail */}
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full text-[12px] font-bold flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}>
              {day.day_number}
            </div>
            {dayIdx < itinerary.days.length - 1 && (
              <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: "var(--td-separator)" }} />
            )}
          </div>

          {/* Day content */}
          <div className="flex-1 pb-5">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-semibold text-[15px]" style={{ color: "var(--td-label)" }}>
                {day.title ?? `Day ${day.day_number}`}
              </span>
              {day.date && (
                <span className="text-[11px]" style={{ color: "var(--td-secondary)" }}>{day.date}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {day.slots.map((slot, slotIdx) => {
                const selectedIdx = getSelection(slot.id);
                const isExpanded = expandedSlot === slot.id;
                const selectedOpt = slot.options[selectedIdx] || slot.options[0];
                if (!selectedOpt) return null;

                return (
                  <div key={slot.id} className="rounded-2xl overflow-hidden shadow-sm"
                    style={{ backgroundColor: "var(--td-card)" }}>
                    {/* Slot header */}
                    <button
                      onClick={() => setExpandedSlot(isExpanded ? null : slot.id)}
                      className="w-full px-4 py-2.5 flex items-center justify-between active:opacity-70"
                      style={{ borderBottom: isExpanded ? "1px solid var(--td-separator)" : "none" }}
                    >
                      <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--td-secondary)" }}>
                        {SLOT_LABELS[slot.slot_type] || slot.slot_type}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--td-secondary)" }}>
                        {slot.options.length > 1 ? `${slot.options.length} options ${isExpanded ? "▾" : "▸"}` : ""}
                      </span>
                    </button>

                    {/* Selected option (always visible) */}
                    <div className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <span className="text-sm mt-0.5">{CAT_ICONS[selectedOpt.category] ?? "📍"}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[14px] font-semibold" style={{ color: "var(--td-label)" }}>
                            {selectedOpt.title}
                          </span>
                          {editingOpt === `${slot.id}-${selectedIdx}` ? (
                            <div className="mt-1 flex gap-2">
                              <input
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                className="flex-1 text-[12px] px-2 py-1 rounded-lg bg-transparent border focus:outline-none"
                                style={{ borderColor: "var(--td-separator)", color: "var(--td-label)" }}
                                autoFocus
                              />
                              <button
                                onClick={() => handleEditSave(dayIdx, slotIdx, selectedIdx)}
                                className="text-[11px] font-bold px-2 py-1 rounded-lg"
                                style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <p className="text-[12px] mt-0.5 leading-snug" style={{ color: "var(--td-secondary)" }}>
                              {selectedOpt.description}
                            </p>
                          )}
                          {/* Meta row */}
                          <div className="flex items-center gap-3 mt-1.5 text-[11px]" style={{ color: "var(--td-secondary)" }}>
                            {selectedOpt.estimated_cost_per_person != null && (
                              <span>${selectedOpt.estimated_cost_per_person}/person</span>
                            )}
                            {selectedOpt.duration_minutes && (
                              <span>{selectedOpt.duration_minutes}min</span>
                            )}
                            {selectedOpt.location?.name && (
                              <span>📍 {selectedOpt.location.name}</span>
                            )}
                          </div>
                          {selectedOpt.why_this_fits && (
                            <p className="text-[11px] mt-1 italic" style={{ color: "var(--td-accent)" }}>
                              {selectedOpt.why_this_fits}
                            </p>
                          )}
                          {/* Edit/remove buttons */}
                          {editable && (
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => { setEditingOpt(`${slot.id}-${selectedIdx}`); setEditText(selectedOpt.description); }}
                                className="text-[11px] font-semibold active:opacity-70"
                                style={{ color: "var(--td-accent)" }}
                              >
                                Edit
                              </button>
                              {slot.options.length > 1 && (
                                <button
                                  onClick={() => removeOption(dayIdx, slotIdx, selectedIdx)}
                                  className="text-[11px] font-semibold active:opacity-70"
                                  style={{ color: "#FF3B30" }}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* All options (expanded) */}
                    {isExpanded && slot.options.length > 1 && (
                      <div style={{ borderTop: "1px solid var(--td-separator)" }}>
                        {slot.options.map((opt, optIdx) => (
                          <button
                            key={opt.id}
                            onClick={() => { selectOption(slot.id, optIdx); setExpandedSlot(null); }}
                            className={`w-full px-4 py-3 text-left active:opacity-70 flex items-start gap-2 ${optIdx === selectedIdx ? "opacity-50" : ""}`}
                            style={{ borderBottom: optIdx < slot.options.length - 1 ? "1px solid var(--td-separator)" : "none" }}
                          >
                            <span className="text-sm mt-0.5">{CAT_ICONS[opt.category] ?? "📍"}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-semibold" style={{ color: "var(--td-label)" }}>
                                  {opt.title}
                                </span>
                                {optIdx === selectedIdx && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                                    style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}>
                                    Selected
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] mt-0.5" style={{ color: "var(--td-secondary)" }}>{opt.description}</p>
                              <div className="flex gap-2 mt-1 text-[10px]" style={{ color: "var(--td-secondary)" }}>
                                {opt.estimated_cost_per_person != null && <span>${opt.estimated_cost_per_person}</span>}
                                {opt.duration_minutes && <span>{opt.duration_minutes}min</span>}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Hidden gems */}
      {itinerary.hiddenGems && itinerary.hiddenGems.length > 0 && (
        <div className="mt-4">
          <p className="text-[12px] uppercase tracking-widest font-semibold mb-2" style={{ color: "var(--td-secondary)" }}>
            Hidden Gems
          </p>
          <div className="flex flex-col gap-2">
            {itinerary.hiddenGems.map((gem, i) => (
              <div key={i} className="rounded-2xl px-4 py-3" style={{ backgroundColor: "var(--td-card)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[14px]">💎</span>
                  <span className="text-[12px] font-bold" style={{ color: "var(--td-accent)" }}>Day {gem.day_number}</span>
                  {gem.location && <span className="text-[11px]" style={{ color: "var(--td-secondary)" }}>📍 {gem.location}</span>}
                </div>
                <p className="text-[13px]" style={{ color: "var(--td-label)" }}>{gem.tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
