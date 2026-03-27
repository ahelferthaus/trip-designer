import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { upsertProfile } from "../lib/userProfile";
import { supabase } from "../lib/supabase";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [homeLocation, setHomeLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!username.trim()) {
      setError("Pick a username");
      return;
    }
    setSaving(true);
    setError(null);

    let avatarUrl = "";

    // Upload avatar if selected
    if (avatarFile && supabase) {
      const path = `avatars/${user.id}.jpg`;
      // Resize before upload
      const resized = await resizeImage(avatarFile, 400, 0.85);
      const { error: uploadErr } = await supabase.storage
        .from("trip-photos")
        .upload(path, resized, { contentType: "image/jpeg", upsert: true });
      if (!uploadErr) {
        const { data } = supabase.storage.from("trip-photos").getPublicUrl(path);
        avatarUrl = data.publicUrl;
      }
    }

    const result = await upsertProfile(user.id, {
      display_name: username.trim(),
      username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ""),
      home_location: homeLocation.trim(),
      bio: bio.trim(),
      avatar_type: avatarUrl ? "upload" : "initials",
      avatar_value: avatarUrl ? "" : username.trim().slice(0, 2),
      avatar_url: avatarUrl,
      onboarded: true,
    });

    if (!result) {
      setError("Username may be taken. Try another.");
      setSaving(false);
      return;
    }

    await refreshProfile();
    setSaving(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Earth/satellite background */}
      <div
        className="h-[40vh] min-h-[280px]"
        style={{
          background: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80') center/cover, linear-gradient(180deg, #0a1628 0%, #1a3a5c 40%, #2d6a4f 70%, #0a1628 100%)",
        }}
      />

      {/* Floating card */}
      <div
        className="-mt-16 mx-4 rounded-3xl px-6 pt-8 pb-6 shadow-xl flex-1"
        style={{ backgroundColor: "var(--td-card, #fff)" }}
      >
        <h1 className="text-[28px] font-bold mb-6" style={{ color: "var(--td-label, #000)" }}>
          Fill in your profile
        </h1>

        {/* Avatar upload */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 active:opacity-70 overflow-hidden"
            style={{
              border: "2px solid var(--td-accent, #007AFF)",
              backgroundColor: avatarPreview ? "transparent" : "var(--td-bg, #f2f2f7)",
            }}
          >
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[24px]" style={{ color: "var(--td-accent, #007AFF)" }}>📷</span>
            )}
          </button>
          <span className="text-[15px] font-medium" style={{ color: "var(--td-label, #000)" }}>
            Pick your best selfie
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="text-[12px] block mb-1 px-1" style={{ color: "var(--td-secondary, #8e8e93)" }}>
            Pick a username
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="YourName"
            maxLength={30}
            className="w-full px-4 py-3.5 rounded-2xl text-[16px] bg-transparent focus:outline-none"
            style={{
              color: "var(--td-label, #000)",
              border: "1.5px solid var(--td-separator, #c6c6c8)",
            }}
            autoFocus
          />
        </div>

        {/* Home location */}
        <div className="mb-4">
          <label className="text-[12px] block mb-1 px-1" style={{ color: "var(--td-secondary, #8e8e93)" }}>
            Set your home location
          </label>
          <input
            type="text"
            value={homeLocation}
            onChange={e => setHomeLocation(e.target.value)}
            placeholder="e.g. New York, USA"
            maxLength={60}
            className="w-full px-4 py-3.5 rounded-2xl text-[16px] bg-transparent focus:outline-none"
            style={{
              color: "var(--td-label, #000)",
              border: "1.5px solid var(--td-separator, #c6c6c8)",
            }}
          />
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="text-[12px] block mb-1 px-1" style={{ color: "var(--td-secondary, #8e8e93)" }}>
            Write a short bio
          </label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Travel lover, food explorer..."
            maxLength={160}
            rows={3}
            className="w-full px-4 py-3.5 rounded-2xl text-[16px] bg-transparent focus:outline-none resize-none"
            style={{
              color: "var(--td-label, #000)",
              border: "1.5px solid var(--td-separator, #c6c6c8)",
            }}
          />
        </div>

        {error && (
          <p className="text-[13px] mb-3 px-1" style={{ color: "#FF3B30" }}>{error}</p>
        )}

        {/* Continue button */}
        <button
          onClick={handleSubmit}
          disabled={saving || !username.trim()}
          className="w-full py-4 rounded-2xl text-[17px] font-bold active:opacity-90 transition-all"
          style={{
            backgroundColor: username.trim()
              ? "var(--td-accent, #E63956)"
              : "var(--td-fill, #e5e5ea)",
            color: username.trim()
              ? "var(--td-accent-text, #fff)"
              : "var(--td-secondary, #8e8e93)",
          }}
        >
          {saving ? "Setting up..." : "Continue"}
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full py-3 mt-2 text-[15px] active:opacity-70"
          style={{ color: "var(--td-secondary, #8e8e93)" }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

function resizeImage(file: File, maxWidth: number, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("No canvas")); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(b => b ? resolve(b) : reject(new Error("Blob fail")), "image/jpeg", quality);
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = URL.createObjectURL(file);
  });
}
