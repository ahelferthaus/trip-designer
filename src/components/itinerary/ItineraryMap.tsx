import { useState, useMemo } from "react";
import type { GeneratedItinerary } from "../../lib/generateItinerary";

interface ItineraryMapProps {
  itinerary: GeneratedItinerary;
  destination?: string;
  accentColor?: string;
}

const DAY_COLORS = [
  "#007AFF", "#D9381E", "#6B8E23", "#C93312", "#DD8D29",
  "#3B9AB2", "#E27505", "#5F7470", "#D93954", "#A42820",
];

interface MapActivity {
  title: string;
  location: string;
  day: number;
  slotType: string;
  color: string;
}

export default function ItineraryMap({ itinerary, destination }: ItineraryMapProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Extract all activities with locations
  const activities = useMemo(() => {
    const acts: MapActivity[] = [];
    for (const day of itinerary.days) {
      const color = DAY_COLORS[(day.day_number - 1) % DAY_COLORS.length];
      for (const slot of day.slots) {
        const opt = slot.options[0];
        if (opt) {
          const loc = opt.location?.name || opt.title;
          acts.push({
            title: opt.title,
            location: loc,
            day: day.day_number,
            slotType: slot.slot_type,
            color,
          });
        }
      }
    }
    return acts;
  }, [itinerary]);

  // Filter by selected day
  const filtered = selectedDay
    ? activities.filter(a => a.day === selectedDay)
    : activities;

  // Build Google Maps embed URL — use a place search for the destination
  const embedUrl = useMemo(() => {
    const query = destination || itinerary.title || "trip";
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed&z=12`;
  }, [destination, itinerary.title]);

  // Build Google Maps directions URL with waypoints for "Open in Maps"
  const mapsDirectionsUrl = useMemo(() => {
    const waypoints = filtered
      .map(a => `${a.location}, ${destination || ""}`)
      .slice(0, 10); // Google Maps supports max ~10 waypoints in URL

    if (waypoints.length === 0) return null;
    if (waypoints.length === 1) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(waypoints[0])}`;
    }
    const origin = encodeURIComponent(waypoints[0]);
    const dest = encodeURIComponent(waypoints[waypoints.length - 1]);
    const middle = waypoints.slice(1, -1).map(w => encodeURIComponent(w)).join("|");
    return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${middle ? `&waypoints=${middle}` : ""}&travelmode=walking`;
  }, [filtered, destination]);

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm">
      {/* Embedded Google Map */}
      <div style={{ height: 220, position: "relative" }}>
        <iframe
          title="Trip Map"
          src={embedUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* Day filter pills */}
      <div className="px-3 py-2 flex gap-1.5 overflow-x-auto" style={{ backgroundColor: "var(--td-card)" }}>
        <button
          onClick={() => setSelectedDay(null)}
          className="px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap active:opacity-70"
          style={{
            backgroundColor: selectedDay === null ? "var(--td-accent)" : "var(--td-fill)",
            color: selectedDay === null ? "var(--td-accent-text)" : "var(--td-label)",
          }}
        >
          All Days
        </button>
        {itinerary.days.map(day => (
          <button
            key={day.day_number}
            onClick={() => setSelectedDay(day.day_number)}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap active:opacity-70"
            style={{
              backgroundColor: selectedDay === day.day_number
                ? DAY_COLORS[(day.day_number - 1) % DAY_COLORS.length]
                : "var(--td-fill)",
              color: selectedDay === day.day_number ? "#fff" : "var(--td-label)",
            }}
          >
            Day {day.day_number}
          </button>
        ))}
      </div>

      {/* Activity list with locations */}
      <div className="max-h-48 overflow-y-auto divide-y" style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}>
        {filtered.map((act, i) => (
          <a
            key={`${act.day}-${act.slotType}-${i}`}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${act.location}, ${destination || ""}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3 py-2 active:opacity-70"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
              style={{ backgroundColor: act.color, color: "#fff" }}
            >
              {act.day}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate" style={{ color: "var(--td-label)" }}>
                {act.title}
              </p>
              <p className="text-[11px] truncate" style={{ color: "var(--td-secondary)" }}>
                {act.location}
              </p>
            </div>
            <span className="text-[11px] flex-shrink-0" style={{ color: "var(--td-accent)" }}>Map ↗</span>
          </a>
        ))}
      </div>

      {/* Open full route in Google Maps */}
      {mapsDirectionsUrl && (
        <a
          href={mapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center py-2.5 text-[13px] font-semibold active:opacity-70"
          style={{ backgroundColor: "var(--td-fill)", color: "var(--td-accent)" }}
        >
          Open full route in Google Maps ↗
        </a>
      )}
    </div>
  );
}
