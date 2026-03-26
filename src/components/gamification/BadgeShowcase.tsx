import { useState } from "react";
import { useGamification } from "../../store/gamificationStore";
import type { Badge } from "../../store/gamificationStore";

const RARITY_COLORS = {
  common: { bg: "#95a5a6", glow: "rgba(149, 165, 166, 0.3)" },
  rare: { bg: "#3498db", glow: "rgba(52, 152, 219, 0.3)" },
  epic: { bg: "#9b59b6", glow: "rgba(155, 89, 182, 0.3)" },
  legendary: { bg: "#f39c12", glow: "rgba(243, 156, 18, 0.4)" },
};

function BadgeCard({ badge, onClick }: { badge: Badge; onClick: () => void }) {
  const isUnlocked = !!badge.unlockedAt;
  const rarityStyle = RARITY_COLORS[badge.rarity];
  const progressPercent = (badge.progress / badge.maxProgress) * 100;

  return (
    <button
      onClick={onClick}
      className={`
        relative rounded-2xl p-4 text-left transition-all duration-200
        ${isUnlocked ? 'hover:scale-105' : 'opacity-70'}
      `}
      style={{
        backgroundColor: isUnlocked ? "var(--td-card)" : "var(--td-fill)",
        border: `2px solid ${isUnlocked ? rarityStyle.bg : 'transparent'}`,
        boxShadow: isUnlocked ? `0 4px 16px ${rarityStyle.glow}` : 'none',
      }}
    >
      {/* Badge icon */}
      <div 
        className={`
          w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-3
          ${isUnlocked ? 'animate-float-slow' : 'grayscale'}
        `}
        style={{
          backgroundColor: isUnlocked ? rarityStyle.bg : "var(--td-fill)",
          boxShadow: isUnlocked ? `0 4px 12px ${rarityStyle.glow}` : 'none',
        }}
      >
        {badge.icon}
      </div>

      {/* Badge info */}
      <h4 
        className="font-bold text-sm mb-1"
        style={{ color: isUnlocked ? "var(--td-label)" : "var(--td-secondary)" }}
      >
        {badge.name}
      </h4>
      <p className="text-xs mb-2" style={{ color: "var(--td-secondary)" }}>
        {badge.description}
      </p>

      {/* Progress bar */}
      {!isUnlocked && (
        <div className="mt-2">
          <div className="flex justify-between text-[10px] mb-1" style={{ color: "var(--td-secondary)" }}>
            <span>Progress</span>
            <span>{badge.progress}/{badge.maxProgress}</span>
          </div>
          <div className="h-1.5 bg-gray-200/30 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${progressPercent}%`,
                backgroundColor: rarityStyle.bg
              }}
            />
          </div>
        </div>
      )}

      {/* Unlocked indicator */}
      {isUnlocked && (
        <div className="absolute top-2 right-2">
          <span className="text-lg">✨</span>
        </div>
      )}

      {/* Rarity badge */}
      <div 
        className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase"
        style={{
          backgroundColor: rarityStyle.bg,
          color: 'white',
        }}
      >
        {badge.rarity}
      </div>
    </button>
  );
}

export default function BadgeShowcase() {
  const { badges } = useGamification();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  
  const unlockedCount = badges.filter(b => b.unlockedAt).length;
  const totalCount = badges.length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-lg font-bold"
          style={{ color: "var(--td-label)" }}
        >
          Your Badges
        </h3>
        <div 
          className="px-3 py-1 rounded-full text-sm font-semibold"
          style={{ 
            backgroundColor: "var(--td-fill)",
            color: "var(--td-label)"
          }}
        >
          {unlockedCount}/{totalCount}
        </div>
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-2 gap-3">
        {badges.map(badge => (
          <BadgeCard 
            key={badge.id} 
            badge={badge} 
            onClick={() => setSelectedBadge(badge)}
          />
        ))}
      </div>

      {/* Badge detail modal */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="rounded-3xl p-6 max-w-sm w-full animate-modal-in"
            style={{ backgroundColor: "var(--td-card)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <div 
                className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-4"
                style={{
                  backgroundColor: selectedBadge.unlockedAt 
                    ? RARITY_COLORS[selectedBadge.rarity].bg 
                    : "var(--td-fill)",
                  boxShadow: selectedBadge.unlockedAt 
                    ? `0 8px 24px ${RARITY_COLORS[selectedBadge.rarity].glow}` 
                    : 'none',
                }}
              >
                {selectedBadge.icon}
              </div>
              
              <h3 
                className="text-xl font-bold mb-2"
                style={{ color: "var(--td-label)" }}
              >
                {selectedBadge.name}
              </h3>
              
              <p 
                className="text-sm mb-4"
                style={{ color: "var(--td-secondary)" }}
              >
                {selectedBadge.description}
              </p>

              {selectedBadge.unlockedAt ? (
                <div 
                  className="rounded-xl p-3 mb-4"
                  style={{ backgroundColor: "var(--td-bg)" }}
                >
                  <p className="text-xs" style={{ color: "var(--td-secondary)" }}>
                    Unlocked on
                  </p>
                  <p className="font-semibold" style={{ color: "var(--td-label)" }}>
                    {new Date(selectedBadge.unlockedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: "var(--td-secondary)" }}>Progress</span>
                    <span style={{ color: "var(--td-label)" }}>
                      {selectedBadge.progress}/{selectedBadge.maxProgress}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(selectedBadge.progress / selectedBadge.maxProgress) * 100}%`,
                        backgroundColor: RARITY_COLORS[selectedBadge.rarity].bg
                      }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-3 rounded-xl font-semibold active:scale-95 transition-transform"
                style={{
                  backgroundColor: "var(--td-accent)",
                  color: "var(--td-accent-text)"
                }}
              >
                Awesome!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
