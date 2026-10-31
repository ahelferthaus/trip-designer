import type { SupabaseClient } from '@supabase/supabase-js';
import { getPrivateTripAccess, privateInviteLink } from './privateTripAccess.ts';

export async function createPilotInvitation(client: SupabaseClient, tripId: string, email: string, origin: string) {
  const recipient = email.trim().toLowerCase();
  if (recipient.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) throw new Error('Enter a valid recipient email.');
  const access = await getPrivateTripAccess(client, tripId);
  if (access.status !== 'member' || access.role !== 'organizer') throw new Error('Organizer access is required.');
  const { data, error } = await client.rpc('palau_create_invite', { p_trip: tripId, p_email: recipient });
  if (error || typeof data !== 'string' || !/^[a-f0-9]{64}$/.test(data)) throw new Error('Invitation could not be created. Try again later.');
  return { recipient, link: privateInviteLink(origin, data) };
}

export async function requestPilotRecovery(client: SupabaseClient, email: string, origin: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'invalid' as const;
  try {
    const { error } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo: new URL('/pilot/recover', origin).href });
    return error ? error.status === 429 ? 'limited' as const : 'error' as const : 'sent' as const;
  } catch { return 'error' as const; }
}

export async function exchangePilotRecovery(client: SupabaseClient, code: string) {
  if (!code || code.length > 2048) return null;
  try {
    const { data, error } = await client.auth.exchangeCodeForSession(code);
    // auth-js stores the PKCE verifier suffix as PASSWORD_RECOVERY, not the implicit-flow type.
    const valid = !error && 'redirectType' in data && data.redirectType === 'PASSWORD_RECOVERY' && data.session && data.user?.email_confirmed_at && !data.user?.is_anonymous;
    if (!valid && data.session) await client.auth.signOut({ scope: 'local' });
    return valid ? data.user.id : null;
  } catch { return null; }
}

export async function updatePilotRecoveredPassword(client: SupabaseClient, recoveredUserId: string | null, password: string, confirmation: string) {
  if (!recoveredUserId || password.length < 8 || password !== confirmation) return 'invalid' as const;
  try {
    const current = await client.auth.getUser();
    if (current.error || current.data.user?.id !== recoveredUserId || !current.data.user?.email_confirmed_at || current.data.user.is_anonymous) return 'invalid' as const;
    const { error } = await client.auth.updateUser({ password });
    return error ? error.status === 429 ? 'limited' as const : 'error' as const : 'updated' as const;
  } catch { return 'error' as const; }
}
