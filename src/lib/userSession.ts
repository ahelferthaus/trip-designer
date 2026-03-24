const SESSION_KEY = "td-current-user";

export interface UserSession {
  name: string;
  tripId: string;
}

export function getCurrentUser(): UserSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as UserSession) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(name: string, tripId: string): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ name, tripId }));
}

export function clearCurrentUser(): void {
  localStorage.removeItem(SESSION_KEY);
}

// Per-user selections storage
const SELECTIONS_KEY = "td-user-selections";

interface AllSelections {
  [tripId: string]: {
    [userName: string]: {
      [slotId: string]: string; // optionId
    };
  };
}

function loadAllSelections(): AllSelections {
  try {
    const raw = localStorage.getItem(SELECTIONS_KEY);
    return raw ? (JSON.parse(raw) as AllSelections) : {};
  } catch {
    return {};
  }
}

export function getUserSelections(tripId: string, userName: string): Record<string, string> {
  const all = loadAllSelections();
  return all[tripId]?.[userName] ?? {};
}

export function saveUserSelection(tripId: string, userName: string, slotId: string, optionId: string): void {
  const all = loadAllSelections();
  if (!all[tripId]) all[tripId] = {};
  if (!all[tripId][userName]) all[tripId][userName] = {};
  all[tripId][userName][slotId] = optionId;
  localStorage.setItem(SELECTIONS_KEY, JSON.stringify(all));
}

export function getAllUsersSelections(tripId: string): Record<string, Record<string, string>> {
  const all = loadAllSelections();
  return all[tripId] ?? {};
}
