import type { DailyStats } from "../../lib/tripDailyStats";

function formatDistance(m: number): string {
  if (m < 1000) return `${Math.round(m)}m`;
  return `${(m / 1000).toFixed(1)}km`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

interface DailyStatsCardProps {
  stats: DailyStats;
  isToday?: boolean;
}

export default function DailyStatsCard({ stats, isToday }: DailyStatsCardProps) {
  return (
    <div
      className="rounded-2xl px-4 py-4 shadow-sm"
      style={{
        backgroundColor: "var(--td-card)",
        border: isToday ? "2px solid var(--td-accent)" : "none",
      }}
    >
      {/* Date header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px] font-bold" style={{ color: "var(--td-label)" }}>
          {formatDate(stats.date)}
        </span>
        {isToday && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}>
            Today
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center">
          <div className="text-[18px] font-black" style={{ color: "var(--td-label)" }}>
            {stats.step_count.toLocaleString()}
          </div>
          <div className="text-[10px] font-medium" style={{ color: "var(--td-secondary)" }}>Steps</div>
        </div>
        <div className="text-center">
          <div className="text-[18px] font-black" style={{ color: "var(--td-label)" }}>
            {formatDistance(stats.distance_walked_m)}
          </div>
          <div className="text-[10px] font-medium" style={{ color: "var(--td-secondary)" }}>Walked</div>
        </div>
        <div className="text-center">
          <div className="text-[18px] font-black" style={{ color: "var(--td-label)" }}>
            {formatDistance(stats.distance_total_m)}
          </div>
          <div className="text-[10px] font-medium" style={{ color: "var(--td-secondary)" }}>Total</div>
        </div>
        <div className="text-center">
          <div className="text-[18px] font-black" style={{ color: "var(--td-label)" }}>
            {stats.photos_taken}
          </div>
          <div className="text-[10px] font-medium" style={{ color: "var(--td-secondary)" }}>Photos</div>
        </div>
      </div>
    </div>
  );
}
