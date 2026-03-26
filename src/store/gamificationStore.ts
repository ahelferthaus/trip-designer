import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface DailyReward {
  day: number;
  reward: string;
  claimed: boolean;
}

interface GamificationState {
  // User preference
  enabled: boolean;
  setEnabled: (v: boolean) => void;

  // XP & Level
  xp: number;
  level: number;
  
  // Streak
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  
  // Badges
  badges: Badge[];
  
  // Daily rewards
  dailyRewards: DailyReward[];
  lastClaimedDate: string;
  
  // Stats
  tripsCreated: number;
  activitiesAdded: number;
  friendsInvited: number;
  daysPlanned: number;
  photosAdded: number;
  
  // Actions
  addXP: (amount: number) => void;
  checkIn: () => { isNewDay: boolean; streakContinued: boolean; streakBroken: boolean };
  unlockBadge: (badgeId: string) => void;
  updateBadgeProgress: (badgeId: string, progress: number) => void;
  claimDailyReward: (day: number) => boolean;
  incrementStat: (stat: "tripsCreated" | "activitiesAdded" | "friendsInvited" | "daysPlanned" | "photosAdded") => void;
  getXPToNextLevel: () => number;
  getProgressToNextLevel: () => number;
}

const INITIAL_BADGES: Badge[] = [
  {
    id: "first_steps",
    name: "First Steps",
    description: "Create your first trip",
    icon: "🗺️",
    progress: 0,
    maxProgress: 1,
    rarity: "common",
  },
  {
    id: "jetsetter",
    name: "Jetsetter",
    description: "Plan 3 trips",
    icon: "✈️",
    progress: 0,
    maxProgress: 3,
    rarity: "common",
  },
  {
    id: "globetrotter",
    name: "Globetrotter",
    description: "Plan trips to 5 different countries",
    icon: "🌍",
    progress: 0,
    maxProgress: 5,
    rarity: "rare",
  },
  {
    id: "planner_pro",
    name: "Planner Pro",
    description: "Plan a 30+ day itinerary",
    icon: "🎯",
    progress: 0,
    maxProgress: 30,
    rarity: "rare",
  },
  {
    id: "social_traveler",
    name: "Social Traveler",
    description: "Invite 3 friends to join trips",
    icon: "🤝",
    progress: 0,
    maxProgress: 3,
    rarity: "common",
  },
  {
    id: "memory_keeper",
    name: "Memory Keeper",
    description: "Add 50 photos to trips",
    icon: "📸",
    progress: 0,
    maxProgress: 50,
    rarity: "rare",
  },
  {
    id: "trip_architect",
    name: "Trip Architect",
    description: "Maintain a 7-day planning streak",
    icon: "⭐",
    progress: 0,
    maxProgress: 7,
    rarity: "epic",
  },
  {
    id: "master_explorer",
    name: "Master Explorer",
    description: "Unlock all other badges",
    icon: "🏆",
    progress: 0,
    maxProgress: 7,
    rarity: "legendary",
  },
];

const DAILY_REWARDS: DailyReward[] = [
  { day: 1, reward: "50 XP Boost", claimed: false },
  { day: 2, reward: "100 XP Boost", claimed: false },
  { day: 3, reward: "Travel Tip Unlocked", claimed: false },
  { day: 4, reward: "150 XP Boost", claimed: false },
  { day: 5, reward: "Mystery Destination", claimed: false },
  { day: 6, reward: "200 XP Boost", claimed: false },
  { day: 7, reward: "Legendary Badge Progress", claimed: false },
];

const XP_PER_LEVEL = [0, 100, 250, 500, 1000, 1750, 3000, 5000, 8000, 12000];

export const useGamification = create<GamificationState>()(
  persist(
    (set, get) => ({
      enabled: false,
      setEnabled: (v: boolean) => set({ enabled: v }),

      xp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: "",
      badges: INITIAL_BADGES,
      dailyRewards: DAILY_REWARDS,
      lastClaimedDate: "",
      tripsCreated: 0,
      activitiesAdded: 0,
      friendsInvited: 0,
      daysPlanned: 0,
      photosAdded: 0,

      addXP: (amount: number) => {
        set(state => {
          const newXP = state.xp + amount;
          let newLevel = state.level;
          
          // Check for level up
          while (newLevel < XP_PER_LEVEL.length && newXP >= XP_PER_LEVEL[newLevel]) {
            newLevel++;
          }
          
          return { xp: newXP, level: newLevel };
        });
      },

      checkIn: () => {
        const today = new Date().toISOString().split("T")[0];
        const state = get();
        
        if (state.lastActiveDate === today) {
          return { isNewDay: false, streakContinued: false, streakBroken: false };
        }
        
        const lastDate = state.lastActiveDate ? new Date(state.lastActiveDate) : null;
        const todayDate = new Date(today);
        
        let streakContinued = false;
        let streakBroken = false;
        
        if (lastDate) {
          const diffTime = todayDate.getTime() - lastDate.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            // Streak continued
            streakContinued = true;
            set(state => ({
              currentStreak: state.currentStreak + 1,
              longestStreak: Math.max(state.longestStreak, state.currentStreak + 1),
            }));
          } else if (diffDays > 1) {
            // Streak broken
            streakBroken = true;
            set({ currentStreak: 1 });
          }
        } else {
          set({ currentStreak: 1 });
        }
        
        set({ lastActiveDate: today });
        
        // Update Trip Architect badge progress
        const { badges, updateBadgeProgress } = get();
        const tripArchitectBadge = badges.find(b => b.id === "trip_architect");
        if (tripArchitectBadge && streakContinued) {
          updateBadgeProgress("trip_architect", Math.min(state.currentStreak + 1, 7));
        }
        
        return { isNewDay: true, streakContinued, streakBroken };
      },

      unlockBadge: (badgeId: string) => {
        set(state => ({
          badges: state.badges.map(badge =>
            badge.id === badgeId && !badge.unlockedAt
              ? { ...badge, unlockedAt: new Date().toISOString(), progress: badge.maxProgress }
              : badge
          ),
        }));
        
        // Check for Master Explorer badge
        const state = get();
        const unlockedCount = state.badges.filter(b => b.unlockedAt && b.id !== "master_explorer").length;
        if (unlockedCount >= 7) {
          set(state => ({
            badges: state.badges.map(badge =>
              badge.id === "master_explorer"
                ? { ...badge, unlockedAt: new Date().toISOString(), progress: 7 }
                : badge
            ),
          }));
        }
      },

      updateBadgeProgress: (badgeId: string, progress: number) => {
        set(state => ({
          badges: state.badges.map(badge => {
            if (badge.id === badgeId) {
              const newProgress = Math.min(progress, badge.maxProgress);
              const shouldUnlock = newProgress >= badge.maxProgress && !badge.unlockedAt;
              return {
                ...badge,
                progress: newProgress,
                unlockedAt: shouldUnlock ? new Date().toISOString() : badge.unlockedAt,
              };
            }
            return badge;
          }),
        }));
      },

      claimDailyReward: (day: number) => {
        const today = new Date().toISOString().split("T")[0];
        const state = get();
        
        if (state.lastClaimedDate === today) {
          return false;
        }
        
        const reward = state.dailyRewards.find(r => r.day === day);
        if (!reward || reward.claimed) {
          return false;
        }
        
        // Apply reward
        if (reward.reward.includes("XP")) {
          const xpAmount = parseInt(reward.reward.match(/\d+/)?.[0] || "0");
          get().addXP(xpAmount);
        }
        
        set(state => ({
          dailyRewards: state.dailyRewards.map(r =>
            r.day === day ? { ...r, claimed: true } : r
          ),
          lastClaimedDate: today,
        }));
        
        return true;
      },

      incrementStat: (stat) => {
        set(state => ({ [stat]: state[stat] + 1 }));
        
        // Update relevant badges
        const state = get();
        switch (stat) {
          case "tripsCreated":
            get().updateBadgeProgress("first_steps", state.tripsCreated);
            get().updateBadgeProgress("jetsetter", state.tripsCreated);
            break;
          case "activitiesAdded":
            get().updateBadgeProgress("planner_pro", state.activitiesAdded);
            break;
          case "friendsInvited":
            get().updateBadgeProgress("social_traveler", state.friendsInvited);
            break;
          case "photosAdded":
            get().updateBadgeProgress("memory_keeper", state.photosAdded);
            break;
        }
      },

      getXPToNextLevel: () => {
        const state = get();
        if (state.level >= XP_PER_LEVEL.length) {
          return Infinity;
        }
        return XP_PER_LEVEL[state.level];
      },

      getProgressToNextLevel: () => {
        const state = get();
        if (state.level >= XP_PER_LEVEL.length) {
          return 100;
        }
        const currentLevelXP = XP_PER_LEVEL[state.level - 1] || 0;
        const nextLevelXP = XP_PER_LEVEL[state.level];
        const xpInLevel = state.xp - currentLevelXP;
        const xpNeeded = nextLevelXP - currentLevelXP;
        return Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
      },
    }),
    {
      name: "vybr-gamification",
    }
  )
);

// Helper hook for checking in on app load
export function useDailyCheckIn() {
  const checkIn = useGamification(state => state.checkIn);
  const addXP = useGamification(state => state.addXP);
  
  return () => {
    const result = checkIn();
    if (result.isNewDay) {
      // Award daily check-in XP
      addXP(10);
    }
    return result;
  };
}
