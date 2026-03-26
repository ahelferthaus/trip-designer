import { useState } from "react";
import type { ActivityOption } from "../../lib/types";

interface WriteInOptionProps {
  onAdd: (option: Omit<ActivityOption, "id" | "slot_id" | "ai_generated">) => void;
  onCancel: () => void;
}

export default function WriteInOption({ onAdd, onCancel }: WriteInOptionProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd({
      title: title.trim(),
      description: description.trim() || "Custom activity",
      category: "attraction",
      estimated_cost_per_person: cost ? parseInt(cost) : undefined,
      weather_sensitivity: "either",
      isCustom: true,
    });

    setTitle("");
    setDescription("");
    setCost("");
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3 border-t" style={{ borderColor: "var(--td-separator)" }}>
      <p className="text-[13px] font-medium mb-3" style={{ color: "var(--td-label)" }}>Add your own option</p>
      
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Activity name"
        className="w-full px-3 py-2 rounded-xl text-[15px] mb-2 border bg-transparent"
        style={{ borderColor: "var(--td-separator)", color: "var(--td-label)" }}
        autoFocus
      />
      
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full px-3 py-2 rounded-xl text-[15px] mb-2 border bg-transparent resize-none"
        style={{ borderColor: "var(--td-separator)", color: "var(--td-label)" }}
      />
      
      <input
        type="number"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        placeholder="Cost per person (optional)"
        className="w-full px-3 py-2 rounded-xl text-[15px] mb-3 border bg-transparent"
        style={{ borderColor: "var(--td-separator)", color: "var(--td-label)" }}
      />
      
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="flex-1 py-2 rounded-xl text-[15px] font-semibold active:opacity-70"
          style={{
            backgroundColor: title.trim() ? "var(--td-accent)" : "var(--td-fill)",
            color: title.trim() ? "var(--td-accent-text)" : "var(--td-secondary)",
            cursor: title.trim() ? "pointer" : "not-allowed",
          }}
        >
          Add Option
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 rounded-xl text-[15px] active:opacity-70"
          style={{ backgroundColor: "var(--td-fill)", color: "var(--td-label)" }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
