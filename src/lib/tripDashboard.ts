import type { SupabaseClient } from '@supabase/supabase-js';
import { isVerifiedPrivateUser } from './privateTripAccess.ts';

export interface TripDraft { title: string; destination: string; start: string; end: string; timeZone: string; participantLimit: number; displayName: string }
export interface TripAttempt { userId: string; requestId: string; draft: TripDraft }
export class TripRejectedError extends Error { override name = 'TripRejectedError'; }
export function attemptForUser(attempt: TripAttempt | null, userId: string): TripAttempt | null { return attempt?.userId===userId ? attempt : null; }
export interface DashboardTrip { id: string; title: string; destination: string; start_date: string; end_date: string; time_zone: string; participant_limit: number | null; role: 'organizer' | 'traveler' }
export type DashboardResult = { status: 'ready'; userId: string; trips: DashboardTrip[] } | { status: 'disabled' | 'signed_out' | 'unverified' | 'unavailable' };
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export function validateTripDraft(draft: TripDraft): boolean {
  const date = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v;
  if (draft.timeZone!=='UTC' && (!draft.timeZone.includes('/') || /^(posix|right)\//.test(draft.timeZone))) return false;
  try { new Intl.DateTimeFormat('en', { timeZone: draft.timeZone }).format(); } catch { return false; }
  return [draft.title.trim(),draft.destination.trim()].every(v => v.length>=1 && v.length<=160) && draft.displayName.trim().length>=1 && draft.displayName.trim().length<=60 && date(draft.start) && date(draft.end) && draft.end>=draft.start && Number.isInteger(draft.participantLimit) && draft.participantLimit>=1 && draft.participantLimit<=100;
}
/** Both feature gating and verified identity are checked before querying new columns. RLS remains authoritative. */
export async function loadTripDashboard(client: SupabaseClient | null, enabled: boolean): Promise<DashboardResult> {
  if (!enabled || !client) return { status: 'disabled' };
  try {
    const first = await client.auth.getUser(); const user = first.data.user;
    if (!user && (!first.error || first.error.name === 'AuthSessionMissingError')) return { status: 'signed_out' };
    if (first.error) return { status: 'unavailable' };
    if (!isVerifiedPrivateUser(user)) return { status: 'unverified' };
    const membership = await client.from('palau_members').select('trip_id,role').eq('user_id',user!.id).is('revoked_at',null);
    if (membership.error) return { status: 'unavailable' };
    const members = membership.data ?? [];
    const ids = members.map(m => m.trip_id);
    if (ids.some(id => !uuid.test(id))) return { status: 'unavailable' };
    const result = ids.length ? await client.from('palau_trips').select('id,title,destination,start_date,end_date,time_zone,participant_limit').in('id',ids).order('start_date') : { data: [], error: null };
    if (result.error) return { status: 'unavailable' };
    const second = await client.auth.getUser();
    if (second.error || !isVerifiedPrivateUser(second.data.user) || second.data.user?.id!==user!.id) return { status: 'unavailable' };
    const current = await client.from('palau_members').select('trip_id,role').eq('user_id',user!.id).is('revoked_at',null);
    if (current.error) return { status: 'unavailable' };
    const trips: DashboardTrip[] = [];
    for (const trip of result.data ?? []) {
      const m = current.data?.find(m => m.trip_id===trip.id);
      if (m && (m.role==='organizer' || m.role==='traveler')) trips.push({...trip,role:m.role});
    }
    return { status:'ready',userId:user!.id,trips };
  } catch { return { status: 'unavailable' }; }
}
export async function createGeneralTrip(client: SupabaseClient | null, enabled: boolean, requestId: string, draft: TripDraft): Promise<string> {
  if (!enabled || !client) throw new Error('Trip creation is not available yet.');
  if (!uuid.test(requestId) || !validateTripDraft(draft)) throw new Error('Check the trip details, dates, time zone and participant limit.');
  const first = await client.auth.getUser();
  if (first.error || !isVerifiedPrivateUser(first.data.user)) throw new Error('Sign in with a confirmed account first.');
  const { data, error } = await client.rpc('vybr_create_trip', { p_request:requestId,p_title:draft.title.trim(),p_destination:draft.destination.trim(),p_start:draft.start,p_end:draft.end,p_zone:draft.timeZone,p_limit:draft.participantLimit,p_name:draft.displayName.trim(),p_expected_user:first.data.user!.id });
  if (error?.code==='22023') throw new TripRejectedError('The server rejected the trip details. Check the dates, timezone and group size, then submit again.');
  if (error || typeof data!=='string' || !uuid.test(data)) throw new Error('Creation could not be confirmed. Retry with the same details, or check My trips before starting another request.');
  const second = await client.auth.getUser();
  if (second.error || !isVerifiedPrivateUser(second.data.user) || second.data.user?.id!==first.data.user!.id) throw new Error('Your account changed. Sign in again and check My trips.');
  return data;
}
