import { useEffect, useState, useRef } from "react";

/**
 * Renders animated space effects over the background:
 * - Twinkling stars (CSS-only, always visible)
 * - Shooting stars every 3-5 seconds
 * - Comet every 2 minutes
 */
export default function SpaceEffects() {
  const [shootingStars, setShootingStars] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [comet, setComet] = useState<{ id: number; y: number } | null>(null);
  const nextId = useRef(0);

  // Generate twinkling stars (static, CSS animated) — 80 stars for dense field
  const stars = useRef(
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    }))
  );

  // Shooting stars every 3-5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const id = nextId.current++;
      const star = {
        id,
        x: Math.random() * 60 + 10, // start position (% from left)
        y: Math.random() * 40 + 5,  // start position (% from top)
        delay: 0,
      };
      setShootingStars(prev => [...prev.slice(-3), star]); // keep max 4
      // Remove after animation
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== id));
      }, 1500);
    }, Math.random() * 10000 + 25000); // 25-35 seconds

    return () => clearInterval(interval);
  }, []);

  // Comet every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const id = nextId.current++;
      setComet({ id, y: Math.random() * 40 + 10 });
      setTimeout(() => setComet(null), 8000);
    }, 60000); // 1 minute — more frequent comets

    // First comet after 10 seconds
    const initial = setTimeout(() => {
      const id = nextId.current++;
      setComet({ id, y: Math.random() * 40 + 10 });
      setTimeout(() => setComet(null), 8000);
    }, 10000);

    return () => { clearInterval(interval); clearTimeout(initial); };
  }, []);

  return (
    <>
      {/* Twinkling star field */}
      <div className="star-field">
        {stars.current.map(s => (
          <div
            key={s.id}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              "--twinkle-duration": `${s.duration}s`,
              "--twinkle-delay": `${s.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Shooting stars */}
      {shootingStars.map(s => (
        <div
          key={s.id}
          className="shooting-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animation: `shooting-star 1.2s ease-out forwards`,
          }}
        />
      ))}

      {/* Comet — bright and dramatic */}
      {comet && (
        <div
          key={comet.id}
          className="comet"
          style={{
            top: `${comet.y}%`,
            left: "-250px",
            animation: `comet 4s ease-in-out forwards`,
          }}
        />
      )}
    </>
  );
}
