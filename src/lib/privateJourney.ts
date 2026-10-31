import type { PrivateTripWorkspace } from './privateTripWorkspace';

export interface JourneyItem {
  key: string;
  kind: 'activity' | 'memory';
  at: string;
  text: string;
  location?: string;
  author?: string;
  mediaPath?: string;
}
export interface JourneyDay { day: string; items: JourneyItem[] }
export type JourneyView = 'all' | 'memories' | 'photos' | 'stops';
export function selectJourney(days: JourneyDay[], view: JourneyView): JourneyDay[] {
  return days.map(day => ({ ...day, items: day.items.filter(item =>
    view === 'all' || (view === 'memories' && item.kind === 'memory') ||
    (view === 'photos' && item.kind === 'memory' && Boolean(item.mediaPath)) ||
    (view === 'stops' && item.kind === 'activity' && Boolean(item.location?.trim()))
  ) })).filter(day => day.items.length > 0);
}

function validInstant(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!match || !Number.isFinite(Date.parse(value))) return false;
  const [, y, m, d] = match;
  const date = new Date(`${y}-${m}-${d}T00:00:00Z`);
  return date.getUTCFullYear() === Number(y) && date.getUTCMonth()+1 === Number(m) && date.getUTCDate() === Number(d);
}

/** Presentation only: callers must first load the membership-gated workspace.
 * Explicit projections keep private arrival records and personal tasks out of a shared journey.
 * No geocoding, location collection, legacy storage or signed URL persistence here.
 */
export function buildPrivateJourney(workspace: Pick<PrivateTripWorkspace, 'trip' | 'activities' | 'journal' | 'members'>): JourneyDay[] {
  const { id, time_zone: zone } = workspace.trip;
  if (typeof zone !== 'string' || !zone.trim()) throw new RangeError('Trip time zone unavailable');
  // A bad zone must not silently move memories onto a different local date.
  const format = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit' });
  const authors = new Map(workspace.members.filter(m => m.trip_id === id).map(m => [m.user_id, m.display_name]));
  const items: JourneyItem[] = [];
  for (const activity of workspace.activities) {
    if (activity.trip_id !== id || !validInstant(activity.starts_at)) continue;
    items.push({ key: `activity:${activity.id}`, kind: 'activity', at: activity.starts_at, text: activity.title, location: activity.location });
  }
  for (const entry of workspace.journal) {
    if (entry.trip_id !== id || !validInstant(entry.recorded_at)) continue;
    const path = entry.media_path;
    const parts = path?.split('/');
    // Do not send malformed paths or external URLs to Storage, even if data is corrupt.
    const mediaPath = parts?.length === 3 && parts[0] === id && parts[1] === entry.user_id && /^[a-zA-Z0-9-]+\.(jpg|jpeg|png|webp)$/.test(parts[2]) ? path! : undefined;
    items.push({ key: `memory:${entry.id}`, kind: 'memory', at: entry.recorded_at, text: entry.body, author: authors.get(entry.user_id) ?? 'Trip member', ...(mediaPath ? { mediaPath } : {}) });
  }
  items.sort((a,b) => Date.parse(a.at)-Date.parse(b.at) || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
  const days = new Map<string, JourneyItem[]>();
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.key)) continue;
    seen.add(item.key);
    const parts = format.formatToParts(new Date(item.at));
    const part = (type: string) => parts.find(p => p.type === type)?.value;
    const day = `${part('year')}-${part('month')}-${part('day')}`;
    if (!days.has(day)) days.set(day, []);
    days.get(day)!.push(item);
  }
  return [...days].map(([day, entries]) => ({ day, items: entries }));
}
