import { useEffect, useState } from "react";
import { useGamification } from "../../store/gamificationStore";

export default function StreakDisplay() {
  const { currentStreak, longestStreak } = useGamification();
  const [showAnimation, setShowAnimation] = useState(false);
  const [prevStreak, setPrevStreak] = useState(currentStreak);

  useEffect(() => {
    if (currentStreak > prevStreak) {
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2000);
    }
    setPrevStreak(currentStreak);
  }, [currentStreak, prevStreak]);

  if (currentStreak === 0) return null;

  const getStreakMessage = () => {
    if (currentStreak >= 7) return "You're on fire! 🔥🔥🔥";
    if (currentStreak >= 5) return "Incredible streak! 🚀";
    if (currentStreak >= 3) return "Keep it going! 💪";
    return "Building momentum! ✨";
  };

  return (
    <div 
      className={`
        relative rounded-2xl p-4 overflow-hidden
        transition-all duration-300
        ${showAnimation ? 'scale-105' : 'scale-100'}
      `}
      style={{ 
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
        boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)'
      }}
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className={`
              w-14 h-14 rounded-full flex items-center justify-center text-2xl
              ${showAnimation ? 'animate-bounce' : ''}
            `}
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            🔥
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">
                {currentStreak}
              </span>
              <span className="text-white/80 font-semibold">
                day{currentStreak !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-white/90 text-sm font-medium">
              {getStreakMessage()}
            </p>
          </div>
        </div>

        {longestStreak > currentStreak && (
          <div className="text-right">
            <p className="text-white/60 text-xs">Best</p>
            <p className="text-white font-bold">{longestStreak}</p>
          </div>
        )}
      </div>

      {/* Progress bar to next milestone */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-white/70 mb-1">
          <span>Next reward</span>
          <span>{7 - (currentStreak % 7)} days</span>
        </div>
        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white/80 rounded-full transition-all duration-500"
            style={{ width: `${((currentStreak % 7) / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Celebration animation */}
      {showAnimation && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: '50%',
                top: '50%',
                transform: `rotate(${i * 30}deg)`,
              }}
            >
              <span 
                className="inline-block text-lg"
                style={{
                  animation: `confetti-fly 1s ease-out forwards`,
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                {['✨', '🎉', '🔥', '⭐'][i % 4]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
