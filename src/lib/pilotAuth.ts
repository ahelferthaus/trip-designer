import type { SupabaseClient } from '@supabase/supabase-js';

export function pilotReturnPath(value: string | null): string {
  return value && (/^\/pilot\/private\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value) || value === '/pilot/invite' || value === '/pilot/trips') ? value : '/pilot/invite';
}
export function pilotToken(hash: string): string {
  const token = new URLSearchParams(hash.replace(/^#/, '')).get('token') ?? '';
  return /^[a-f0-9]{64}$/.test(token) ? token : '';
}
export function pilotDestination(path: string, token: string): string {
  const safe = pilotReturnPath(path);
  return safe === '/pilot/invite' && /^[a-f0-9]{64}$/.test(token) ? `${safe}#token=${token}` : safe;
}

export function pilotCallback(search: string, hash: string) {
  const fragment = new URLSearchParams(hash.replace(/^#/, ''));
  const query = new URLSearchParams(search);
  const failed = ['error','error_code','error_description'].some(key => fragment.has(key) || query.has(key));
  for (const key of ['code','error','error_code','error_description','type','access_token','refresh_token']) query.delete(key);
  const remaining = query.toString();
  return { hadCode: new URLSearchParams(search).has('code'), search: remaining ? `?${remaining}` : '', failed };
}

export class PilotCallbackCleanupError extends Error {
  constructor() { super('This sign-in could not be cleared. Retry before continuing.'); }
}

/** Only clear the exchanged session, never a different session that replaced it. */
export async function clearPilotCallbackSession(client: SupabaseClient, exchangedToken: string): Promise<void> {
  try {
    const current = await client.auth.getSession();
    if (current.error) throw new PilotCallbackCleanupError();
    if (current.data.session?.access_token !== exchangedToken) return;
    const cleared = await client.auth.signOut({ scope: 'local' });
    if (cleared.error) throw new PilotCallbackCleanupError();
    const remaining = await client.auth.getSession();
    if (remaining.error || remaining.data.session?.access_token === exchangedToken) throw new PilotCallbackCleanupError();
  } catch { throw new PilotCallbackCleanupError(); }
}

/** Exchange a one-use PKCE confirmation code through Auth, then recheck identity.
 * The caller keeps the promise in memory so StrictMode cannot exchange it twice.
 * Recovery codes belong exclusively to the password recovery route. */
export async function exchangePilotConfirmation(client: SupabaseClient, code: string): Promise<boolean> {
  if (!code || code.length > 2048) return false;
  let exchangedToken: string | undefined;
  try {
    const { data, error } = await client.auth.exchangeCodeForSession(code);
    exchangedToken = data.session?.access_token;
    if (error || !exchangedToken || !data.user?.id) {
      if (exchangedToken) await clearPilotCallbackSession(client, exchangedToken);
      return false;
    }
    if ('redirectType' in data && data.redirectType === 'PASSWORD_RECOVERY') {
      await clearPilotCallbackSession(client, data.session.access_token);
      return false;
    }
    let verified = await client.auth.getUser(data.session.access_token);
    if (verified.error) verified = await client.auth.getUser(data.session.access_token);
    const current = await client.auth.getSession();
    const valid = !verified.error && verified.data.user?.id === data.user.id &&
      Boolean(verified.data.user?.email_confirmed_at) && !verified.data.user?.is_anonymous;
    if (!valid || current.error) { await clearPilotCallbackSession(client, data.session.access_token); return false; }
    return !current.error && current.data.session?.access_token === data.session.access_token;
  } catch (error) {
    if (error instanceof PilotCallbackCleanupError) throw error;
    if (exchangedToken) await clearPilotCallbackSession(client, exchangedToken);
    return false;
  }
}

/** One request at a time; interrupted requests must never navigate a later screen. */
export function createPilotAuthAction() {
  let generation = 0;
  let pending = false;
  return {
    cancel() { generation++; pending = false; },
    async run(client: SupabaseClient, email: string, password: string, signup: boolean, redirect: string) {
      if (pending) return { status: 'ignored' as const };
      if (!email.trim() || !password || (signup && password.length < 8)) return { status: 'invalid' as const };
      pending = true;
      const request = ++generation;
      try {
        const result = signup
          ? await client.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: redirect } })
          : await client.auth.signInWithPassword({ email: email.trim(), password });
        if (request !== generation) return { status: 'ignored' as const };
        if (result.error) {
          const code = result.error.code;
          if (code === 'email_not_confirmed') return { status: 'confirm' as const };
          if (code === 'over_request_rate_limit' || code === 'over_email_send_rate_limit' || result.error.name === 'AuthRetryableFetchError') return { status: 'retry_later' as const };
          if (code === 'weak_password') return { status: 'weak_password' as const };
          return { status: 'error' as const };
        }
        const user = result.data.user;
        return { status: result.data.session && user?.email_confirmed_at && !user.is_anonymous ? 'ready' as const : 'confirm' as const };
      } catch { return { status: request === generation ? 'retry_later' as const : 'ignored' as const }; }
      finally { if (request === generation) pending = false; }
    },
  };
}
