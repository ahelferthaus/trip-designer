import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    navigate("/home", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FFFFFF" }}>

      {/* === HERO — clean, white, centered === */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 pt-16 pb-8">

        {/* Logo */}
        <img src="/vybr-icon.png" alt="VYBR" className="h-20 w-20 rounded-2xl shadow-lg mb-6" />

        {/* Brand */}
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1A1A1A", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          VYBR
        </h1>
        <p style={{ fontSize: 17, fontWeight: 400, color: "#8E8E93", marginTop: 6, letterSpacing: "0.01em" }}>
          Plan | Travel | Remember
        </p>

        {/* Feature list — AretaCare style */}
        <div className="w-full max-w-sm mt-10 rounded-2xl px-6 py-6 text-left"
          style={{ backgroundColor: "#F8F8FA", border: "1px solid #F0F0F2" }}>

          {[
            {
              title: "AI-Powered Itineraries",
              desc: "Tell us your destination, dates, and vibe. AI builds a day-by-day plan with options.",
            },
            {
              title: "Group Collaboration",
              desc: "Share a link with your group. Everyone votes on activities in real time.",
            },
            {
              title: "Trip Tracking & Journal",
              desc: "Record your route on a 3D map. Snap geotagged photos. Keep a travel diary.",
            },
            {
              title: "Photo Books & Postcards",
              desc: "Auto-generate a photo book, create trip movies, and send postcards home.",
            },
          ].map(({ title, desc }) => (
            <div key={title} className="flex items-start gap-3 mb-5 last:mb-0">
              <div className="flex-shrink-0 mt-0.5">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="11" fill="#007AFF" fillOpacity="0.1" />
                  <path d="M7 11.5L9.5 14L15 8.5" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3 }}>{title}</p>
                <p style={{ fontSize: 14, fontWeight: 400, color: "#8E8E93", lineHeight: 1.5, marginTop: 2 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === BOTTOM CTA — sticky feel === */}
      <div className="px-6 pb-8 pt-4 flex flex-col gap-3 max-w-sm mx-auto w-full">
        <button
          onClick={() => navigate("/intake")}
          className="w-full py-4 rounded-2xl text-[17px] font-bold active:scale-[0.98] transition-transform"
          style={{
            backgroundColor: "#007AFF",
            color: "white",
            boxShadow: "0 4px 16px rgba(0,122,255,0.3)",
          }}
        >
          Plan a Trip — Free
        </button>

        <button
          onClick={() => navigate("/explore")}
          className="w-full py-4 rounded-2xl text-[17px] font-semibold active:opacity-70"
          style={{ backgroundColor: "#F2F2F7", color: "#1A1A1A" }}
        >
          Explore Trips
        </button>

        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={() => navigate("/auth")}
            className="text-[15px] font-semibold active:opacity-70"
            style={{ color: "#007AFF" }}
          >
            Sign In
          </button>
          <span style={{ color: "#D1D1D6" }}>|</span>
          <button
            onClick={() => navigate("/auth")}
            className="text-[15px] font-semibold active:opacity-70"
            style={{ color: "#007AFF" }}
          >
            Create Account
          </button>
        </div>

        <p className="text-center mt-2" style={{ fontSize: 13, color: "#C7C7CC" }}>
          No credit card needed. No account required to start.
        </p>
      </div>
    </div>
  );
}
