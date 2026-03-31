import { useState } from "react";

interface CalendarPickerProps {
  value: string;
  onChange: (date: string) => void;
  label: string;
  /** If true, calendar is shown inline (always open) */
  inline?: boolean;
}

export default function CalendarPicker({ value, onChange, label, inline = false }: CalendarPickerProps) {
  const [open, setOpen] = useState(inline);

  const today = new Date();
  const selected = value ? new Date(value) : null;
  const [viewDate, setViewDate] = useState(selected || today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleSelect = (day: number) => {
    const date = new Date(year, month, day);
    const iso = date.toISOString().split("T")[0];
    onChange(iso);
    if (!inline) setOpen(false);
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const formatDisplay = (iso: string) => {
    if (!iso) return "Select date";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };

  const calendarContent = (
    <div className={inline ? "pt-2" : "fixed z-50 left-4 right-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto rounded-2xl shadow-xl p-4"}
      style={inline ? {} : { backgroundColor: "var(--td-card)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="w-9 h-9 rounded-full flex items-center justify-center text-[20px] active:opacity-70"
          style={{ color: "var(--td-accent)", backgroundColor: "var(--td-fill)" }}>
          ‹
        </button>
        <span className="text-[17px] font-semibold" style={{ color: "var(--td-label)" }}>
          {monthNames[month]} {year}
        </span>
        <button onClick={nextMonth} className="w-9 h-9 rounded-full flex items-center justify-center text-[20px] active:opacity-70"
          style={{ color: "var(--td-accent)", backgroundColor: "var(--td-fill)" }}>
          ›
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(d => (
          <div key={d} className="text-center text-[11px] font-bold py-1" style={{ color: "var(--td-secondary)" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const iso = new Date(year, month, day).toISOString().split("T")[0];
          const isSelected = value === iso;
          const isToday = new Date().toISOString().split("T")[0] === iso;
          const isPast = new Date(year, month, day) < new Date(new Date().toISOString().split("T")[0]);

          return (
            <button
              key={day}
              onClick={() => !isPast && handleSelect(day)}
              className="aspect-square flex items-center justify-center text-[15px] rounded-full active:scale-95 transition-transform"
              style={{
                backgroundColor: isSelected ? "var(--td-accent)" : "transparent",
                color: isSelected ? "var(--td-accent-text)" : isPast ? "var(--td-separator)" : isToday ? "var(--td-accent)" : "var(--td-label)",
                border: isToday && !isSelected ? "2px solid var(--td-accent)" : "none",
                opacity: isPast ? 0.4 : 1,
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Inline mode — always show calendar
  if (inline) {
    return (
      <div>
        {value && (
          <div className="text-[17px] font-semibold pb-1" style={{ color: "var(--td-accent)" }}>
            {formatDisplay(value)}
          </div>
        )}
        {calendarContent}
      </div>
    );
  }

  // Modal mode — click to open
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 text-right text-[17px] active:opacity-70"
        style={{ color: value ? "var(--td-label)" : "var(--td-secondary)" }}
      >
        {formatDisplay(value) || label}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            onClick={() => setOpen(false)}
          />
          {calendarContent}
        </>
      )}
    </div>
  );
}
