import { useState, useEffect } from "react";

interface PlanTripButtonProps {
  onClick: () => void;
  size?: "default" | "large";
}

export default function PlanTripButton({ onClick, size = "default" }: PlanTripButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
    
    onClick();
  };

  // Pulse animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      const btn = document.querySelector('.island-btn');
      if (btn) {
        btn.classList.add('pulse-glow');
        setTimeout(() => btn.classList.remove('pulse-glow'), 1000);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const isLarge = size === "large";

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`
        island-btn relative overflow-hidden
        ${isLarge ? 'w-full py-5' : 'px-8 py-4'}
        rounded-[2rem] 
        font-bold tracking-wide
        transition-all duration-200 ease-out
        active:scale-95
        ${isPressed ? 'translate-y-1 shadow-sm' : 'hover:-translate-y-1'}
      `}
      style={{
        background: 'linear-gradient(135deg, #00D4AA 0%, #00B894 25%, #F4D03F 60%, #E17055 100%)',
        boxShadow: isPressed 
          ? '0 2px 8px rgba(0, 180, 148, 0.4), inset 0 2px 4px rgba(0,0,0,0.1)'
          : '0 8px 24px rgba(0, 180, 148, 0.35), 0 4px 12px rgba(225, 112, 85, 0.2)',
        border: '3px solid rgba(255,255,255,0.3)',
      }}
    >
      {/* Island shape overlay */}
      <div className="absolute inset-0 rounded-[2rem] overflow-hidden">
        {/* Palm tree silhouettes */}
        <svg 
          className="absolute right-2 top-1 w-12 h-12 opacity-30"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path 
            d="M50 90 Q50 60 50 50 Q30 40 20 45 Q35 35 50 40 Q65 35 80 45 Q70 40 50 50" 
            stroke="rgba(0,0,0,0.4)" 
            strokeWidth="3"
            fill="none"
          />
          <ellipse cx="50" cy="35" rx="25" ry="8" fill="rgba(0,100,80,0.3)" />
          <ellipse cx="35" cy="40" rx="15" ry="5" fill="rgba(0,100,80,0.25)" transform="rotate(-30 35 40)" />
          <ellipse cx="65" cy="40" rx="15" ry="5" fill="rgba(0,100,80,0.25)" transform="rotate(30 65 40)" />
        </svg>
        
        {/* Sun */}
        <div 
          className="absolute left-3 top-2 w-8 h-8 rounded-full"
          style={{ 
            background: 'radial-gradient(circle, #FFD93D 0%, #FFA502 70%)',
            boxShadow: '0 0 20px rgba(255, 217, 61, 0.5)'
          }}
        />
        
        {/* Waves at bottom */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-6 opacity-40"
          viewBox="0 0 200 24"
          preserveAspectRatio="none"
        >
          <path 
            d="M0 12 Q25 6 50 12 T100 12 T150 12 T200 12 V24 H0 Z" 
            fill="rgba(255,255,255,0.4)"
          />
          <path 
            d="M0 16 Q25 10 50 16 T100 16 T150 16 T200 16 V24 H0 Z" 
            fill="rgba(255,255,255,0.2)"
          />
        </svg>
      </div>

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/40 animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
          }}
        />
      ))}

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center gap-3">
        <span className="text-2xl">🏝️</span>
        <span 
          className={`${isLarge ? 'text-xl' : 'text-lg'} font-black text-white drop-shadow-lg`}
          style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        >
          Plan Your Adventure
        </span>
        <span className="text-xl">✈️</span>
      </div>

      {/* Shine effect */}
      <div 
        className="absolute inset-0 rounded-[2rem] pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
        }}
      />
    </button>
  );
}
