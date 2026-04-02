import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableProviders } from "../lib/llmClient";
import { useAuth } from "../store/authStore";
import { upsertProfile } from "../lib/userProfile";
import TravelPartnersSection from "../components/settings/TravelPartnersSection";
import { useGamification } from "../store/gamificationStore";

const ALL_PROVIDERS = [
  { name: "GPT-4o" },
  { name: "Claude" },
  { name: "Gemini" },
];

const EMOJI_OPTIONS = ["😎", "🧳", "🌍", "🏖️", "🎒", "✈️", "🗺️", "🧭", "🌸", "🐾", "🎵", "🔥"];

export default function SettingsPage() {
  const navigate = useNavigate();
  const configured = getAvailableProviders();
  const { user, profile, refreshProfile } = useAuth();

  const [passcode, setPasscode] = useState(localStorage.getItem("td-passcode") ?? "1234");
  const [passcodeInput, setPasscodeInput] = useState(passcode);
  const [saved, setSaved] = useState(false);

  // Profile state
  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [avatarType, setAvatarType] = useState(profile?.avatar_type ?? "initials");
  const [avatarValue, setAvatarValue] = useState(profile?.avatar_value ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [isPublic, setIsPublic] = useState(profile?.is_public ?? true);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSavePasscode = () => {
    localStorage.setItem("td-passcode", passcodeInput);
    setPasscode(passcodeInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    await upsertProfile(user.id, {
      display_name: displayName,
      avatar_type: avatarType as "initials" | "emoji" | "upload",
      avatar_value: avatarValue,
      bio,
      is_public: isPublic,
    });
    await refreshProfile();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
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
        {/* Profile (auth only) */}
        {user && (
          <section>
            <p className="text-[12px] uppercase tracking-wide mb-2 px-1" style={{ color: "var(--td-secondary)" }}>
              Profile
            </p>
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
              {/* Display name */}
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--td-separator)" }}>
                <span className="text-[12px] block mb-1" style={{ color: "var(--td-secondary)" }}>Display Name</span>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="w-full text-[15px] bg-transparent focus:outline-none"
                  style={{ color: "var(--td-label)" }}
                />
              </div>

              {/* Avatar type */}
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--td-separator)" }}>
                <span className="text-[12px] block mb-2" style={{ color: "var(--td-secondary)" }}>Avatar</span>
                <div className="flex gap-2 mb-2">
                  {(["initials", "emoji"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => { setAvatarType(t); setAvatarValue(""); }}
                      className="px-3 py-1.5 rounded-full text-[13px] font-medium"
                      style={{
                        backgroundColor: avatarType === t ? "var(--td-accent)" : "var(--td-fill)",
                        color: avatarType === t ? "var(--td-accent-text)" : "var(--td-label)",
                      }}
                    >
                      {t === "initials" ? "Initials" : "Emoji"}
                    </button>
                  ))}
                </div>
                {avatarType === "emoji" && (
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map(e => (
                      <button
                        key={e}
                        onClick={() => setAvatarValue(e)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{
                          backgroundColor: avatarValue === e ? "var(--td-accent)" : "var(--td-fill)",
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
                {avatarType === "initials" && (
                  <p className="text-[13px]" style={{ color: "var(--td-secondary)" }}>
                    Uses first 2 letters of your name
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--td-separator)" }}>
                <span className="text-[12px] block mb-1" style={{ color: "var(--td-secondary)" }}>Bio</span>
                <input
                  type="text"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell others about yourself"
                  maxLength={160}
                  className="w-full text-[15px] bg-transparent focus:outline-none"
                  style={{ color: "var(--td-label)" }}
                />
              </div>

              {/* Public profile toggle */}
              <button
                onClick={() => setIsPublic(!isPublic)}
                className="w-full px-4 py-3 flex items-center justify-between active:opacity-70"
                style={{ borderBottom: "1px solid var(--td-separator)" }}
              >
                <span className="text-[15px]" style={{ color: "var(--td-label)" }}>Public profile</span>
                <span className="text-xl" style={{ color: isPublic ? "var(--td-accent)" : "var(--td-fill)" }}>
                  {isPublic ? "✓" : "○"}
                </span>
              </button>

              {/* View profile link */}
              <button
                onClick={() => navigate(`/profile/${user.id}`)}
                className="w-full px-4 py-3 flex items-center justify-between active:opacity-70"
                style={{ borderBottom: "1px solid var(--td-separator)" }}
              >
                <span className="text-[15px]" style={{ color: "var(--td-accent)" }}>View my profile</span>
                <span className="text-[13px]" style={{ color: "var(--td-secondary)" }}>›</span>
              </button>

              {/* Save */}
              <div className="px-4 py-3 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 rounded-xl text-[13px] font-semibold active:opacity-70"
                  style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
                >
                  {profileSaved ? "Saved!" : "Save Profile"}
                </button>
              </div>
            </div>
            <p className="text-[12px] mt-2 px-1" style={{ color: "var(--td-secondary)" }}>
              {user.email}
            </p>
          </section>
        )}

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
              <span className="text-[15px]" style={{ color: "var(--td-label)" }}>Theme</span>
              <span className="text-[13px]" style={{ color: "var(--td-secondary)" }}>›</span>
            </button>
          </div>
        </section>

        {/* Gamification toggle */}
        {user && (
          <section>
            <p className="text-[12px] uppercase tracking-wide mb-2 px-1" style={{ color: "var(--td-secondary)" }}>
              Achievements & Rewards
            </p>
            <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
              <button
                onClick={() => useGamification.getState().setEnabled(!useGamification.getState().enabled)}
                className="w-full px-4 py-3 flex items-center justify-between active:opacity-70"
              >
                <div>
                  <span className="text-[15px] block" style={{ color: "var(--td-label)" }}>Show achievements</span>
                  <span className="text-[12px]" style={{ color: "var(--td-secondary)" }}>XP, badges, streaks on your home screen</span>
                </div>
                <span className="text-xl" style={{ color: useGamification.getState().enabled ? "var(--td-accent)" : "var(--td-fill)" }}>
                  {useGamification.getState().enabled ? "✓" : "○"}
                </span>
              </button>
            </div>
          </section>
        )}

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

        {/* Travel Partners (auth only) */}
        {user && <TravelPartnersSection userId={user.id} />}
      </div>
    </div>
  );
}
