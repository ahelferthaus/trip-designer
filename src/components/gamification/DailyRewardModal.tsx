import { useState, useEffect } from "react";
import { useGamification } from "../../store/gamificationStore";

const REWARD_ICONS: Record<string, string> = {
  "XP": "⚡",
  "Travel Tip": "💡",
  "Mystery Destination": "🎁",
  "Legendary Badge Progress": "🏆",
};

export default function DailyRewardModal() {
  const { dailyRewards, lastClaimedDate, claimDailyReward, currentStreak } = useGamification();
  const [isOpen, setIsOpen] = useState(false);
  const [revealedReward, setRevealedReward] = useState<number | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const canClaim = lastClaimedDate !== today;
  const currentDay = (currentStreak % 7) || 1;

  useEffect(() => {
    // Auto-open if user can claim and hasn't seen it today
    if (canClaim && currentStreak > 0) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [canClaim, currentStreak]);

  const handleReveal = async (day: number) => {
    if (isRevealing || revealedReward !== null) return;
    
    setIsRevealing(true);
    
    // Simulate suspense
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = claimDailyReward(day);
    if (success) {
      setRevealedReward(day);
    }
    
    setIsRevealing(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setRevealedReward(null);
  };

  if (!isOpen) return null;

  const getRewardIcon = (reward: string) => {
    for (const [key, icon] of Object.entries(REWARD_ICONS)) {
      if (reward.includes(key)) return icon;
    }
    return "🎁";
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
    >
      <div 
        className="rounded-3xl p-6 max-w-md w-full animate-modal-in"
        style={{ backgroundColor: "var(--td-card)" }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎁</div>
          <h2 
            className="text-2xl font-bold mb-1"
            style={{ color: "var(--td-label)" }}
          >
            Daily Reward
          </h2>
          <p style={{ color: "var(--td-secondary)" }}>
            {revealedReward 
              ? "Congratulations! Here's your reward:" 
              : "Tap to reveal your surprise!"}
          </p>
        </div>

        {/* Reward cards */}
        {!revealedReward ? (
          <div className="grid grid-cols-3 gap-3 mb-6">
            {dailyRewards.slice(0, 3).map((_, index) => {
              const day = index + 1;
              const isCurrentDay = day === currentDay;
              const isLocked = day > currentDay;
              
              return (
                <button
                  key={day}
                  onClick={() => isCurrentDay && handleReveal(day)}
                  disabled={!isCurrentDay || isRevealing}
                  className={`
                    aspect-square rounded-2xl flex flex-col items-center justify-center
                    transition-all duration-300
                    ${isCurrentDay ? 'animate-pulse-glow hover:scale-105' : ''}
                    ${isLocked ? 'opacity-50' : ''}
                  `}
                  style={{
                    backgroundColor: isCurrentDay 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                      : "var(--td-fill)",
                    border: isCurrentDay ? '2px solid #667eea' : 'none',
                  }}
                >
                  {isCurrentDay ? (
                    <>
                      <span className="text-3xl mb-1">❓</span>
                      <span className="text-xs font-bold text-white">Tap to Open</span>
                    </>
                  ) : isLocked ? (
                    <>
                      <span className="text-2xl mb-1">🔒</span>
                      <span className="text-[10px]" style={{ color: "var(--td-secondary)" }}>
                        Day {day}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl mb-1">✓</span>
                      <span className="text-[10px]" style={{ color: "var(--td-secondary)" }}>
                        Claimed
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center mb-6">
            <div 
              className="rounded-2xl p-6 animate-reveal"
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              }}
            >
              <div className="text-5xl mb-3">
                {getRewardIcon(dailyRewards[revealedReward - 1]?.reward || "")}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {dailyRewards[revealedReward - 1]?.reward}
              </h3>
              <p className="text-white/80 text-sm">
                Added to your account!
              </p>
            </div>
            
            {/* Confetti */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-confetti-fall"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                >
                  {['🎉', '✨', '🎊', '⭐'][Math.floor(Math.random() * 4)]}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Streak info */}
        <div 
          className="rounded-xl p-3 mb-4 text-center"
          style={{ backgroundColor: "var(--td-bg)" }}
        >
          <p className="text-sm" style={{ color: "var(--td-secondary)" }}>
            🔥 {currentStreak}-day streak! Keep it going!
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="w-full py-3 rounded-xl font-semibold active:scale-95 transition-transform"
          style={{
            backgroundColor: revealedReward ? "var(--td-accent)" : "var(--td-fill)",
            color: revealedReward ? "var(--td-accent-text)" : "var(--td-label)"
          }}
        >
          {revealedReward ? "Claim Reward" : "Come Back Tomorrow"}
        </button>
      </div>
    </div>
  );
}
