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
  { id: "home", label: "Home", icon: "🏠", activeIcon: "🏠", path: "/" },
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
    if (path === "/") {
      return location.pathname === "/";
    }
    if (path === "/profile") {
      return location.pathname.startsWith("/profile");
    }
    return location.pathname.startsWith(path);
  };

  const handleTabClick = (tab: TabItem) => {
    if (tab.requiresAuth && !user) {
      navigate("/auth");
      return;
    }
    if (tab.path === "/profile" && user) {
      navigate(`/profile/${user.id}`);
      return;
    }
    navigate(tab.path);
  };

  // Don't show tab bar on intake flow or auth pages
  const hiddenPaths = ["/intake", "/auth", "/join/", "/onboarding", "/book/", "/postcard", "/movie"];
  const shouldHide = hiddenPaths.some(path => 
    location.pathname === path || location.pathname.startsWith(path)
  );
  
  if (shouldHide) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
      style={{ 
        backgroundColor: "var(--td-nav-bg, var(--td-card))",
        borderTop: "1px solid var(--td-separator)"
      }}
    >
      <div className="flex items-center justify-around px-2 pb-safe">
        {TABS.map((tab) => {
          const active = isActive(tab.path);
          const isPlan = tab.id === "plan";
          
          // For profile tab, show user avatar if available
          if (tab.id === "profile" && user) {
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                className="flex flex-col items-center justify-center py-2 px-3 min-w-[64px] active:opacity-70 transition-opacity"
              >
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-semibold overflow-hidden ${active ? "ring-2" : ""}`}
                  style={{
                    backgroundColor: active ? "var(--td-accent)" : "var(--td-fill)",
                    color: active ? "var(--td-accent-text)" : "var(--td-label)",
                  }}
                >
                  {profile?.avatar_type === "emoji" && profile.avatar_value ? (
                    <span className="text-[14px]">{profile.avatar_value}</span>
                  ) : (
                    <span className="text-[10px]">
                      {(profile?.display_name || user.email?.split("@")[0] || "U").slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <span 
                  className="text-[11px] mt-1 font-semibold"
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
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-[64px] active:opacity-70 transition-all ${isPlan ? "-mt-4" : ""}`}
            >
              {isPlan ? (
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style={{ 
                    backgroundColor: "var(--td-accent)",
                    color: "var(--td-accent-text)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }}
                >
                  <span className="text-[22px]">{tab.icon}</span>
                </div>
              ) : (
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: active ? "var(--td-accent)" : "transparent",
                    color: active ? "var(--td-accent-text)" : "var(--td-label)"
                  }}
                >
                  <span className="text-[16px]">{active ? tab.activeIcon : tab.icon}</span>
                </div>
              )}
              <span 
                className={`text-[10px] mt-1 font-medium ${isPlan ? "mt-2" : ""}`}
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
