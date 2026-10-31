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
