import { supabase } from "./supabase";
import { useGamification } from "../store/gamificationStore";
import type { Badge } from "../store/gamificationStore";

interface GamificationData {
  badges: Badge[];
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  dailyRewards: unknown[];
  lastClaimedDate: string;
  tripsCreated: number;
  activitiesAdded: number;
  friendsInvited: number;
  daysPlanned: number;
  photosAdded: number;
}

function getStateSnapshot(): GamificationData {
  const state = useGamification.getState();
  return {
    xp: state.xp,
    level: state.level,
    currentStreak: state.currentStreak,
    longestStreak: state.longestStreak,
    lastActiveDate: state.lastActiveDate,
    badges: state.badges,
    dailyRewards: state.dailyRewards,
    lastClaimedDate: state.lastClaimedDate,
    tripsCreated: state.tripsCreated,
    activitiesAdded: state.activitiesAdded,
    friendsInvited: state.friendsInvited,
    daysPlanned: state.daysPlanned,
    photosAdded: state.photosAdded,
  };
}

/**
 * Save gamification state to Supabase user_profiles.gamification_data JSONB column.
 */
export async function saveGamificationToCloud(userId: string): Promise<void> {
  if (!supabase) return;
  const data = getStateSnapshot();
  try {
    await supabase
      .from("user_profiles")
      .update({ gamification_data: data })
      .eq("id", userId);
  } catch {
    // Non-fatal — data stays in localStorage
  }
}

/**
 * Load gamification state from Supabase and merge with local state.
 * Cloud data wins for XP/level/stats if it's higher (prevents data loss).
 */
export async function loadGamificationFromCloud(userId: string): Promise<void> {
  if (!supabase) return;
  try {
    const { data } = await supabase
      .from("user_profiles")
      .select("gamification_data")
      .eq("id", userId)
      .single();

    if (!data?.gamification_data) return;

    const cloud = data.gamification_data as GamificationData;
    const local = getStateSnapshot();

    // Merge: take the higher values to prevent data loss from device switching
    useGamification.setState({
      xp: Math.max(cloud.xp ?? 0, local.xp),
      level: Math.max(cloud.level ?? 1, local.level),
      currentStreak: Math.max(cloud.currentStreak ?? 0, local.currentStreak),
      longestStreak: Math.max(cloud.longestStreak ?? 0, local.longestStreak),
      lastActiveDate: cloud.lastActiveDate > local.lastActiveDate ? cloud.lastActiveDate : local.lastActiveDate,
      tripsCreated: Math.max(cloud.tripsCreated ?? 0, local.tripsCreated),
      activitiesAdded: Math.max(cloud.activitiesAdded ?? 0, local.activitiesAdded),
      friendsInvited: Math.max(cloud.friendsInvited ?? 0, local.friendsInvited),
      daysPlanned: Math.max(cloud.daysPlanned ?? 0, local.daysPlanned),
      photosAdded: Math.max(cloud.photosAdded ?? 0, local.photosAdded),
      badges: cloud.badges?.length ? (cloud.badges as Badge[]) : local.badges,
    });
  } catch {
    // Non-fatal
  }
}
