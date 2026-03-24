import { useNavigate } from "react-router-dom";
import { useTheme } from "../store/themeStore";

export default function ThemePage() {
  const navigate = useNavigate();
  const { theme, setTheme, allThemes } = useTheme();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Nav */}
      <div className="px-4 safe-top pt-3 pb-2 flex items-center justify-between"
        style={{ backgroundColor: "var(--td-nav-bg)" }}>
        <button
          onClick={() => navigate("/")}
          className="text-[17px] font-medium"
          style={{ color: "var(--td-accent-text)" }}
        >
          ‹ Back
        </button>
        <span className="text-[17px] font-semibold" style={{ color: "var(--td-accent-text)" }}>
          Theme
        </span>
        <div className="w-16" />
      </div>

      <div className="px-4 pt-6 pb-4">
        <h2 className="text-[22px] font-bold mb-1" style={{ color: "var(--td-label)" }}>
          Choose your adventure color for this journey!
        </h2>
        <p className="text-[13px]" style={{ color: "var(--td-secondary)" }}>
          Each theme is pulled from a real film's color database.
        </p>
      </div>

      <div className="px-4 flex flex-col gap-3 pb-10">
        {allThemes.map(t => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl shadow-sm text-left transition-all active:scale-[0.98]"
            style={{
              backgroundColor: t.colors.card,
              border: theme.id === t.id ? `2px solid ${t.colors.accent}` : "2px solid transparent",
            }}
          >
            {/* Swatches */}
            <div className="flex gap-1 flex-shrink-0">
              {t.swatch.map((hex, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[15px] truncate" style={{ color: t.colors.label }}>
                {t.film}
              </div>
              {t.year && (
                <div className="text-[12px]" style={{ color: t.colors.secondary }}>
                  {t.year} · {t.description}
                </div>
              )}
            </div>
            {/* Check */}
            {theme.id === t.id && (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: t.colors.accent }}
              >
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
