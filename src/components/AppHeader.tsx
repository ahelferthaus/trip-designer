import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/authStore";

/**
 * Compact app header with VYBR logo and logout.
 * Shows on all app pages (not landing, intake, auth, etc.)
 */
export default function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  // Hide on these paths
  const hidden = ["/", "/intake", "/auth", "/join/", "/onboarding", "/book/", "/postcard", "/movie"];
  if (hidden.some(p => location.pathname === p || location.pathname.startsWith(p + "/"))) return null;
  // Also hide on admin pages
  if (location.pathname.startsWith("/admin")) return null;

  return (
    <div
      className="flex items-center justify-between px-4 pt-2 pb-1 safe-top"
      style={{ backgroundColor: "transparent" }}
    >
      <button onClick={() => navigate("/home")} className="flex items-center gap-2 active:opacity-70">
        <img src="/vybr-icon.png" alt="VYBR" className="h-7 w-7 rounded-md" />
        <span className="text-[14px] font-black text-white/80 tracking-tight">VYBR</span>
      </button>

      {user ? (
        <button
          onClick={async () => { await signOut(); navigate("/"); }}
          className="text-[12px] font-medium px-3 py-1.5 rounded-full active:opacity-70"
          style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => navigate("/auth")}
          className="text-[12px] font-medium px-3 py-1.5 rounded-full active:opacity-70"
          style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
        >
          Sign In
        </button>
      )}
    </div>
  );
}
