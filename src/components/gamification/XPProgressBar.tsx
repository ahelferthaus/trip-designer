import { useGamification } from "../../store/gamificationStore";

const LEVEL_TITLES: Record<number, string> = {
  1: "Wanderer",
  2: "Wanderer",
  3: "Wanderer",
  4: "Wanderer",
  5: "Wanderer",
  6: "Explorer",
  7: "Explorer",
  8: "Explorer",
  9: "Explorer",
  10: "Explorer",
  11: "Adventurer",
  12: "Adventurer",
  13: "Adventurer",
  14: "Adventurer",
  15: "Adventurer",
  16: "Voyager",
  17: "Voyager",
  18: "Voyager",
  19: "Voyager",
  20: "Voyager",
};

export default function XPProgressBar() {
  const { xp, level, getProgressToNextLevel, getXPToNextLevel } = useGamification();
  const progress = getProgressToNextLevel();
  const xpToNext = getXPToNextLevel();
  
  const title = LEVEL_TITLES[level] || "Legend";

  return (
    <div 
      className="rounded-2xl p-4"
      style={{ 
        backgroundColor: "var(--td-card)",
        border: "1px solid var(--td-separator)"
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            {level}
          </div>
          <div>
            <p className="font-bold text-[15px]" style={{ color: "var(--td-label)" }}>
              {title}
            </p>
            <p className="text-xs" style={{ color: "var(--td-secondary)" }}>
              {xp.toLocaleString()} XP
            </p>
          </div>
        </div>
        
        {xpToNext !== Infinity && (
          <div className="text-right">
            <p className="text-xs" style={{ color: "var(--td-secondary)" }}>
              {xpToNext - xp} XP to Level {level + 1}
            </p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-gray-200/30 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
          style={{ 
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
          }}
        />
        
        {/* Shimmer effect */}
        <div 
          className="absolute inset-y-0 w-20 animate-shimmer"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            left: `${progress - 20}%`,
          }}
        />
      </div>

      {/* Level markers */}
      <div className="flex justify-between mt-1">
        <span className="text-[10px]" style={{ color: "var(--td-fill)" }}>
          Level {level}
        </span>
        {xpToNext !== Infinity && (
          <span className="text-[10px]" style={{ color: "var(--td-fill)" }}>
            Level {level + 1}
          </span>
        )}
      </div>
    </div>
  );
}
