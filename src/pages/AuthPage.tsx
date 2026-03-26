import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { migrateLocalTripsToCloud } from "../lib/tripStorage";
import { supabase } from "../lib/supabase";

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password) return;
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { confirmEmail } = await signUp(email, password);
        if (confirmEmail) {
          setConfirmationSent(true);
        } else {
          // New signup → onboarding
          const user = (await supabase?.auth.getUser())?.data?.user;
          if (user) {
            await migrateLocalTripsToCloud(user.id);
          }
          navigate("/onboarding");
        }
      } else {
        await signIn(email, password);
        // Migrate local trips on sign in
        const user = (await supabase?.auth.getUser())?.data?.user;
        if (user) {
          await migrateLocalTripsToCloud(user.id);
        }
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  if (confirmationSent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "var(--td-bg)" }}>
        <div className="w-full max-w-sm text-center">
          <div className="text-4xl mb-4">📧</div>
          <h2 className="text-[22px] font-bold mb-2" style={{ color: "var(--td-label)" }}>
            Check your email
          </h2>
          <p className="text-[15px] mb-6" style={{ color: "var(--td-secondary)" }}>
            We sent a confirmation link to <strong>{email}</strong>. Click it, then sign in.
          </p>
          <button
            onClick={() => { setConfirmationSent(false); setMode("signin"); }}
            className="w-full py-4 rounded-2xl text-[17px] font-semibold active:opacity-70"
            style={{ backgroundColor: "var(--td-accent)", color: "var(--td-accent-text)" }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "var(--td-bg)" }}>
      <div className="w-full max-w-sm">
        <button
          onClick={() => navigate("/")}
          className="text-[17px] mb-6"
          style={{ color: "var(--td-accent)" }}
        >
          ‹ Home
        </button>

        <h2 className="text-[28px] font-bold mb-1" style={{ color: "var(--td-label)" }}>
          {mode === "signin" ? "Welcome back" : "Create account"}
        </h2>
        <p className="text-[15px] mb-6" style={{ color: "var(--td-secondary)" }}>
          {mode === "signin"
            ? "Sign in to sync trips across devices."
            : "Sign up to save and share your trips."}
        </p>

        <div className="flex flex-col gap-3 mb-4">
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-4 text-[17px] bg-transparent focus:outline-none"
              style={{ color: "var(--td-label)" }}
              autoFocus
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: "var(--td-card)" }}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "Password (min 6 chars)" : "Password"}
              className="w-full px-4 py-4 text-[17px] bg-transparent focus:outline-none"
              style={{ color: "var(--td-label)" }}
              minLength={6}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        {error && (
          <p className="text-[13px] mb-4 px-1" style={{ color: "#FF3B30" }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !email.trim() || password.length < 6}
          className="w-full py-4 rounded-2xl text-[17px] font-semibold mb-3 active:opacity-70 transition-opacity"
          style={{
            backgroundColor: !loading && email.trim() && password.length >= 6 ? "var(--td-accent)" : "var(--td-fill)",
            color: !loading && email.trim() && password.length >= 6 ? "var(--td-accent-text)" : "var(--td-secondary)",
          }}
        >
          {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>

        <p className="text-center text-[15px]" style={{ color: "var(--td-secondary)" }}>
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(null); }}
            className="font-semibold"
            style={{ color: "var(--td-accent)" }}
          >
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
