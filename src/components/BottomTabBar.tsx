import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/authStore";

interface TabItem {
  id: string;
  label: string;
  icon: string;
  activeIcon: string;
  path: string;
  requiresAuth?: boolean;
}

const TABS: TabItem[] = [
  { id: "home", label: "Home", icon: "🏠", activeIcon: "🏠", path: "/home" },
  { id: "explore", label: "Explore", icon: "🔍", activeIcon: "🔍", path: "/explore" },
  { id: "plan", label: "Plan", icon: "➕", activeIcon: "➕", path: "/intake" },
  { id: "feed", label: "Feed", icon: "🔔", activeIcon: "🔔", path: "/feed", requiresAuth: true },
  { id: "profile", label: "Profile", icon: "👤", activeIcon: "👤", path: "/profile", requiresAuth: true },
];

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuth();

  const isActive = (path: string) => {
    if (path === "/home") return location.pathname === "/home";
    if (path === "/profile") return location.pathname.startsWith("/profile");
    return location.pathname.startsWith(path);
  };

  const handleTabClick = (tab: TabItem) => {
    if (tab.requiresAuth && !user) { navigate("/auth"); return; }
    if (tab.path === "/profile" && user) { navigate(`/profile/${user.id}`); return; }
    navigate(tab.path);
  };

  const hiddenPaths = ["/intake", "/auth", "/join/", "/onboarding", "/book/", "/postcard", "/movie"];
  if (location.pathname === "/") return null;
  if (hiddenPaths.some(path => location.pathname === path || location.pathname.startsWith(path))) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "var(--td-nav-bg, var(--td-card))",
        borderTop: "1px solid var(--td-separator)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center justify-around px-1">
        {TABS.map((tab) => {
          const active = isActive(tab.path);
          const isPlan = tab.id === "plan";

          // Profile tab with avatar
          if (tab.id === "profile" && user) {
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className="flex flex-col items-center justify-center py-3 px-2 flex-1 active:opacity-70"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-[15px] font-semibold overflow-hidden ${active ? "ring-2 ring-offset-1" : ""}`}
                  style={{
                    backgroundColor: active ? "var(--td-accent)" : "var(--td-fill)",
                    color: active ? "var(--td-accent-text)" : "var(--td-label)",
                  }}
                >
                  {profile?.avatar_type === "emoji" && profile.avatar_value ? (
                    <span className="text-[18px]">{profile.avatar_value}</span>
                  ) : (
                    <span className="text-[12px]">
                      {(profile?.display_name || user.email?.split("@")[0] || "U").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <span
                  className="text-[12px] mt-1.5 font-semibold"
                  style={{ color: active ? "var(--td-accent)" : "var(--td-secondary)" }}
                >
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex flex-col items-center justify-center py-3 px-2 flex-1 active:opacity-70 ${isPlan ? "-mt-5" : ""}`}
            >
              {isPlan ? (
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    backgroundColor: "var(--td-accent)",
                    color: "var(--td-accent-text)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                  }}
                >
                  <span className="text-[26px]">{tab.icon}</span>
                </div>
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: active ? "var(--td-accent)" : "transparent",
                    color: active ? "var(--td-accent-text)" : "var(--td-label)",
                  }}
                >
                  <span className="text-[22px]">{active ? tab.activeIcon : tab.icon}</span>
                </div>
              )}
              <span
                className={`text-[12px] font-semibold ${isPlan ? "mt-2" : "mt-1.5"}`}
                style={{ color: active ? "var(--td-accent)" : "var(--td-secondary)" }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
