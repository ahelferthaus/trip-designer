import { useState } from "react";

interface CalendarPickerProps {
  value: string;
  onChange: (date: string) => void;
  label: string;
}

export default function CalendarPicker({ value, onChange, label }: CalendarPickerProps) {
  const [open, setOpen] = useState(false);
  
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
    setOpen(false);
  };
  
  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  
  const formatDisplay = (iso: string) => {
    if (!iso) return "Select date";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  
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
          <div 
            className="absolute z-50 left-4 right-4 mt-2 rounded-2xl shadow-xl p-4"
            style={{ backgroundColor: "var(--td-card)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-2 text-[20px] active:opacity-70" style={{ color: "var(--td-accent)" }}>
                ‹
              </button>
              <span className="text-[17px] font-semibold" style={{ color: "var(--td-label)" }}>
                {monthNames[month]} {year}
              </span>
              <button onClick={nextMonth} className="p-2 text-[20px] active:opacity-70" style={{ color: "var(--td-accent)" }}>
                ›
              </button>
            </div>
            
            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(d => (
                <div key={d} className="text-center text-[11px] font-medium py-1" style={{ color: "var(--td-secondary)" }}>
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
                
                return (
                  <button
                    key={day}
                    onClick={() => handleSelect(day)}
                    className="aspect-square flex items-center justify-center text-[15px] rounded-full active:scale-95 transition-transform"
                    style={{
                      backgroundColor: isSelected ? "var(--td-accent)" : "transparent",
                      color: isSelected ? "var(--td-accent-text)" : isToday ? "var(--td-accent)" : "var(--td-label)",
                      border: isToday && !isSelected ? "1px solid var(--td-accent)" : "none",
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
