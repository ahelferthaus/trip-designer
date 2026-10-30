import type { SupabaseClient, User } from '@supabase/supabase-js';

export type PrivateTripRole = 'organizer' | 'traveler';
export interface PrivateTripCoordination {
  base?: { name?: string; status?: string };
  cruise?: { name?: string; dates?: string; status?: string };
  timeline?: Array<{
    date: string;
    title: string;
    status: string;
    time?: string;
    location?: string;
    details?: string[];
    source_label?: string;
  }>;
  public_contacts?: Array<{ name: string; purpose?: string; phone?: string; email?: string; url?: string }>;
  warnings?: string[];
}
export interface PrivateTripSummary {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  time_zone: 'Pacific/Palau';
  coordination: PrivateTripCoordination;
}
export type PrivateTripAccess =
  | { status: 'unconfigured' | 'signed_out' | 'unverified' | 'unavailable' | 'error' }
  | { status: 'member'; userId: string; role: PrivateTripRole; trip: PrivateTripSummary };

export const isVerifiedPrivateUser = (user: Pick<User, 'id' | 'is_anonymous' | 'email_confirmed_at'> | null): boolean =>
  Boolean(user?.id && !user.is_anonymous && user.email_confirmed_at);

/** The server/RLS is authoritative. This UI check is not an authorization boundary. */
export async function getPrivateTripAccess(
  client: SupabaseClient | null,
  tripId: string,
): Promise<PrivateTripAccess> {
  if (!client) return { status: 'unconfigured' };
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(tripId)) {
    return { status: 'unavailable' };
  }
  try {
    const { data: { user }, error: userError } = await client.auth.getUser();
    if (!user && (!userError || userError.name === 'AuthSessionMissingError')) return { status: 'signed_out' };
    if (userError) return { status: 'error' };
    if (!user) return { status: 'signed_out' };
    if (!isVerifiedPrivateUser(user)) return { status: 'unverified' };
    const { data: membership, error: membershipError } = await client.from('palau_members')
      .select('role,revoked_at').eq('trip_id', tripId).eq('user_id', user.id).maybeSingle();
    if (membershipError) return { status: 'error' };
    if (!membership || membership.revoked_at || !['organizer', 'traveler'].includes(membership.role)) {
      return { status: 'unavailable' };
    }
    const { data: trip, error: tripError } = await client.from('palau_trips')
      .select('id,title,start_date,end_date,time_zone,coordination').eq('id', tripId).maybeSingle();
    if (tripError) return { status: 'error' };
    if (!trip) return { status: 'unavailable' };
    return { status: 'member', userId: user.id, role: membership.role, trip: trip as PrivateTripSummary };
  } catch {
    return { status: 'error' };
  }
}

/** No invitation metadata is downloaded before the atomic server-side acceptance. */
export async function acceptPrivateTripInvite(client: SupabaseClient | null, token: string, displayName: string): Promise<string> {
  if (!client) throw new Error('Private pilot backend is not configured.');
  if (!/^[a-f0-9]{64}$/.test(token) || !displayName.trim() || displayName.trim().length > 60) {
    throw new Error('Use a valid invitation and a display name of 1–60 characters.');
  }
  const { data: { user }, error: authError } = await client.auth.getUser();
  if (authError || !isVerifiedPrivateUser(user)) throw new Error('Sign in with your verified invited account first.');
  const { data, error } = await client.rpc('palau_accept_invite', { p_token: token, p_name: displayName.trim() });
  if (error || typeof data !== 'string') throw new Error('Invitation unavailable. Check the account, expiry, or ask the organizer.');
  return data;
}

/** Token stays in URL fragment, never query string; share only with the intended recipient. */
export function privateInviteLink(origin: string, token: string): string {
  if (!/^[a-f0-9]{64}$/.test(token)) throw new Error('Invalid invitation token.');
  const url = new URL('/pilot/invite', origin);
  url.hash = `token=${token}`;
  return url.toString();
}

/** Private media uses short-lived URLs, never public URLs. Do not store signed URLs. */
export async function getPrivateMediaUrl(client: SupabaseClient | null, path: string): Promise<string> {
  if (!client) throw new Error('Private pilot backend is not configured.');
  const { data, error } = await client.storage.from('palau-private').createSignedUrl(path, 60);
  if (error || !data?.signedUrl) throw new Error('Media unavailable.');
  return data.signedUrl;
}
