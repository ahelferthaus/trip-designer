import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import MapHero3D from "../components/itinerary/MapHero3D";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, go straight to the app
  if (user) {
    navigate("/home", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "rgba(11,29,51,0.85)" }}>
      {/* Hero with 3D Globe */}
      <div className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-16" style={{ minHeight: "85vh" }}>
        {/* 3D Globe background — full bleed */}
        <div className="absolute inset-0">
          <MapHero3D destination="Europe" height={900}>
            <div />
          </MapHero3D>
        </div>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%)",
        }} />

        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 pt-6 safe-top">
          <img src="/vybr-icon.png" alt="VYBR" className="h-8 w-8 rounded-lg" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/auth")}
              className="text-[14px] font-medium text-white/80 active:opacity-70"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="text-[14px] font-semibold px-4 py-2 rounded-full active:opacity-70"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white", backdropFilter: "blur(8px)" }}
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-lg">
          <img src="/vybr-logo.png" alt="VYBR" className="h-24 md:h-32 mx-auto mb-6" />
          <h1 className="text-[36px] md:text-[48px] font-black text-white leading-[1.1] tracking-tight mb-4">
            Your trips,<br />beautifully planned.
          </h1>
          <p className="text-[18px] md:text-[20px] text-white/75 leading-relaxed mb-8 max-w-md mx-auto">
            AI builds your itinerary. Your group votes on activities. Everyone shares the adventure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/intake")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98] transition-transform"
              style={{
                background: "linear-gradient(135deg, #E63956, #D42E4A)",
                color: "white",
                boxShadow: "0 4px 20px rgba(230, 57, 86, 0.4)",
              }}
            >
              Plan a Trip — Free
            </button>
            <button
              onClick={() => navigate("/explore")}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-[17px] font-semibold active:opacity-70"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "white", backdropFilter: "blur(8px)" }}
            >
              Explore Trips
            </button>
          </div>

          <p className="text-[13px] text-white/40 mt-4">
            No credit card needed. No account required to start.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-float">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-[32px] font-black text-white text-center mb-12">
          How VYBR works
        </h2>
        <div className="flex flex-col gap-8">
          {[
            {
              step: "1",
              title: "Describe your trip",
              desc: "Tell us where, when, who's coming, your budget, and what vibe you're after. Takes 60 seconds.",
              icon: "✦",
            },
            {
              step: "2",
              title: "AI builds your itinerary",
              desc: "GPT-4o generates a day-by-day plan with morning, afternoon, and evening options — restaurants, activities, hidden gems.",
              icon: "✦",
            },
            {
              step: "3",
              title: "Your group plans together",
              desc: "Share a link. Everyone votes on activities, writes in their own ideas, and books what's confirmed. Real-time.",
              icon: "✦",
            },
            {
              step: "4",
              title: "Capture & share",
              desc: "Add photos at every stop. Create a trip movie. Send postcards. Order a photo book. Keep the memories forever.",
              icon: "✦",
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-5">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-[16px] font-bold flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #E63956, #D42E4A)", color: "white" }}
              >
                {step}
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-white mb-1">{title}</h3>
                <p className="text-[15px] text-white/60 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features grid */}
      <div className="px-6 py-16" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-[32px] font-black text-white text-center mb-12">
            Everything you need
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: "🤖", title: "AI Itineraries", desc: "GPT-4o, Claude, Gemini" },
              { icon: "🗳️", title: "Group Voting", desc: "Real-time collaboration" },
              { icon: "📸", title: "Trip Photos", desc: "Per-activity captures" },
              { icon: "🎬", title: "Trip Movies", desc: "Auto-generated videos" },
              { icon: "📖", title: "Photo Books", desc: "Print & ship" },
              { icon: "💌", title: "Postcards", desc: "Email, text, or mail" },
              { icon: "🗺️", title: "Mapbox Maps", desc: "Satellite route views" },
              { icon: "⚽", title: "Travel Themes", desc: "Soccer, skiing, food..." },
              { icon: "🎓", title: "College Tours", desc: "Campus visit planner" },
              { icon: "🌍", title: "Explore", desc: "Browse 50+ seed trips" },
              { icon: "👥", title: "Social", desc: "Follow, comment, like" },
              { icon: "🎨", title: "10 Themes", desc: "Wes Anderson palettes" },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl px-4 py-4 text-center"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-[28px]">{icon}</span>
                <h4 className="text-[14px] font-bold text-white mt-2">{title}</h4>
                <p className="text-[12px] text-white/50 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social proof / stats */}
      <div className="px-6 py-16 max-w-3xl mx-auto">
        <div className="flex items-center justify-around">
          {[
            { value: "50+", label: "Pre-built trips" },
            { value: "12", label: "Travel themes" },
            { value: "3", label: "AI models" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-[36px] font-black text-white">{value}</div>
              <div className="text-[13px] text-white/50">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-6 py-16 text-center">
        <h2 className="text-[36px] font-black text-white mb-4">
          Ready to plan?
        </h2>
        <p className="text-[16px] text-white/60 mb-8 max-w-md mx-auto">
          No account needed. Start planning your next adventure in 60 seconds.
        </p>
        <button
          onClick={() => navigate("/intake")}
          className="px-10 py-4 rounded-2xl text-[18px] font-bold active:scale-[0.98] transition-transform"
          style={{
            background: "linear-gradient(135deg, #E63956, #D42E4A)",
            color: "white",
            boxShadow: "0 4px 20px rgba(230, 57, 86, 0.4)",
          }}
        >
          Plan a Trip — Free
        </button>
      </div>

      {/* Footer */}
      <div className="px-6 py-8 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <p className="text-[13px] text-white/30">
          © 2026 VYBR Travel. Built with AI.
        </p>
      </div>
    </div>
  );
}
