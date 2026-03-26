import { createContext, useContext, useState, useEffect, createElement } from "react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { getProfile, upsertProfile } from "../lib/userProfile";
import type { UserProfile } from "../lib/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ confirmEmail: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (u: User | null) => {
    if (!u) {
      setProfile(null);
      return;
    }
    const p = await getProfile(u.id);
    if (p) {
      setProfile(p);
    } else {
      // Auto-create profile on first login
      const displayName = u.user_metadata?.full_name || u.email?.split("@")[0] || "";
      const created = await upsertProfile(u.id, { display_name: displayName });
      setProfile(created);
    }
  };

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getUser().then(async ({ data: { user: u } }) => {
      setUser(u);
      await fetchProfile(u);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      fetchProfile(u);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // If no session returned, email confirmation is required
    return { confirmEmail: !!data.user && !data.session };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    await fetchProfile(user);
  };

  return createElement(AuthContext.Provider, {
    value: { user, profile, loading, signIn, signUp, signOut, refreshProfile },
    children,
  });
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
