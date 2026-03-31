import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/authStore";

export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Hide on these paths
  const hidden = ["/", "/intake", "/auth", "/join/", "/onboarding", "/book/", "/postcard", "/movie"];
  if (hidden.some(p => location.pathname === p || location.pathname.startsWith(p + "/"))) return null;
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-2.5 safe-top"
      style={{
        backgroundColor: "rgba(11, 29, 51, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <button onClick={() => navigate("/home")} className="flex items-center gap-2 active:opacity-70">
        <img src="/vybr-icon.png" alt="VYBR" className="h-7 w-7 rounded-md" />
        <span className="text-[15px] font-black text-white tracking-tight">VYBR</span>
      </button>

      {user ? (
        <button
          onClick={async () => { await signOut(); navigate("/"); }}
          className="text-[13px] font-semibold px-4 py-2 rounded-full active:opacity-70"
          style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => navigate("/auth")}
          className="text-[13px] font-semibold px-4 py-2 rounded-full active:opacity-70"
          style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
        >
          Sign In
        </button>
      )}
    </div>
  );
}
