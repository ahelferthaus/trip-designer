import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableProviders } from "../lib/llmClient";

const ALL_PROVIDERS = [
  { name: "GPT-4o", envKey: "VITE_OPENAI_API_KEY" },
  { name: "Claude", envKey: "VITE_ANTHROPIC_API_KEY" },
  { name: "Gemini", envKey: "VITE_GEMINI_API_KEY" },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const configured = getAvailableProviders();

  const [passcode, setPasscode] = useState(localStorage.getItem("td-passcode") ?? "1234");
  const [passcodeInput, setPasscodeInput] = useState(passcode);
  const [saved, setSaved] = useState(false);

  const handleSavePasscode = () => {
    localStorage.setItem("td-passcode", passcodeInput);
    setPasscode(passcodeInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--td-bg)" }}>
      {/* Nav */}
      <div
        className="sticky top-0 z-10 px-4 safe-top pt-3 pb-3"
        style={{ backgroundColor: "var(--td-nav-bg)", borderBottom: "1px solid var(--td-separator)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-[17px] active:opacity-70"
            style={{ color: "var(--td-accent)" }}
          >
            ‹ Back
          </button>
          <h1 className="text-[17px] font-semibold flex-1 text-center" style={{ color: "var(--td-label)" }}>
            Settings
          </h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="px-4 py-6 flex flex-col gap-6">
        {/* AI Providers */}
        <section>
          <p className="text-[12px] uppercase tracking-wide mb-2 px-1" style={{ color: "var(--td-secondary)" }}>
            AI Providers
          </p>
          <div className="rounded-2xl overflow-hidden shadow-sm divide-y" style={{ backgroundColor: "var(--td-card)", borderColor: "var(--td-separator)" }}>
            {ALL_PROVIDERS.map(provider => {
              const isConfigured = configured.includes(provider.name);
              return (
                <div key={provider.name} className="px-4 py-3 flex items-center justify-between">
                  <span className="text-[15px]" style={{ color: "var(--td-label)" }}>{provider.name}</span>
                  <span className="text-[13px] font-semibold" style={{ color: isConfigured ? "#34C759" : "var(--td-secondary)" }}>
                    {isConfigured ? "✓ Configured" : "✗ Not set"}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[12px] mt-2 px-1" style={{ color: "var(--td-secondary)" }}>
            On Vercel: keys are server-side (secure). For local dev: add VITE_ keys to .env. Priority: GPT-4o → Claude → Gemini
          </p>
        </section>

        {/* Appearance */}
        <section>
          <p className="text-[12px] uppercase tracking-wide mb-2 px-1" style={{ color: "var(--td-secondary)" }}>
            Appearance
          </p>
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
            <button
              onClick={() => navigate("/theme")}
              className="w-full px-4 py-3 flex items-center justify-between active:opacity-70"
            >
              <span className="text-[15px]" style={{ color: "var(--td-label)" }}>🎨 Theme</span>
              <span className="text-[13px]" style={{ color: "var(--td-secondary)" }}>›</span>
            </button>
          </div>
        </section>

        {/* Trip Passcode */}
        <section>
          <p className="text-[12px] uppercase tracking-wide mb-2 px-1" style={{ color: "var(--td-secondary)" }}>
            Trip Passcode
          </p>
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
            <div className="px-4 py-3 flex items-center gap-3">
              <input
                type="text"
                value={passcodeInput}
                onChange={e => setPasscodeInput(e.target.value.slice(0, 8))}
                placeholder="Current: 1234"
                className="flex-1 bg-transparent text-[15px] focus:outline-none"
                style={{ color: "var(--td-label)" }}
                maxLength={8}
              />
              <button
                onClick={handleSavePasscode}
                disabled={!passcodeInput || passcodeInput === passcode}
                className="px-3 py-1.5 rounded-xl text-[13px] font-semibold active:opacity-70"
                style={{
                  backgroundColor: passcodeInput && passcodeInput !== passcode ? "var(--td-accent)" : "var(--td-fill)",
                  color: passcodeInput && passcodeInput !== passcode ? "var(--td-accent-text)" : "var(--td-secondary)",
                }}
              >
                {saved ? "Saved!" : "Save"}
              </button>
            </div>
          </div>
          <p className="text-[12px] mt-2 px-1" style={{ color: "var(--td-secondary)" }}>
            Share this with your travel group
          </p>
        </section>
      </div>
    </div>
  );
}
