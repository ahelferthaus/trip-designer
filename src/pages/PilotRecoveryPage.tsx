import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/pilotSupabase';
import { exchangePilotRecovery, requestPilotRecovery, updatePilotRecoveredPassword } from '../lib/pilotRelease';
import './PilotSignInPage.css';

export default function PilotRecoveryPage() {
  const location = useLocation();
  return <RecoveryForm key={location.key} />;
}
function RecoveryForm() {
  const [code] = useState(() => new URLSearchParams(window.location.search).get('code') ?? '');
  const [mode, setMode] = useState<'request' | 'checking' | 'update' | 'done'>(code ? 'checking' : 'request');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const alive = useRef(false);
  const exchange = useRef<Promise<string | null> | null>(null);
  const recoveredUser = useRef<string | null>(null);
  useEffect(() => {
    alive.current = true;
    // The code is consumed once in memory; never copy it to logs, storage or links.
    window.history.replaceState(window.history.state, '', '/pilot/recover');
    if (code && supabase) {
      exchange.current ??= exchangePilotRecovery(supabase, code);
      void exchange.current.then(userId => { if (alive.current) { recoveredUser.current = userId; setMode(userId ? 'update' : 'request'); setMessage(userId ? 'Choose a new password.' : 'This recovery link is invalid or expired. Request another in this browser.'); } });
    }
    return () => { alive.current = false; };
  }, [code]);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!supabase || pending.current) return;
    const form = event.currentTarget; const values = new FormData(form);
    pending.current = true; setBusy(true); setMessage('');
    const result = mode === 'update'
      ? await updatePilotRecoveredPassword(supabase, recoveredUser.current, String(values.get('password') ?? ''), String(values.get('confirmation') ?? ''))
      : await requestPilotRecovery(supabase, String(values.get('email') ?? ''), window.location.origin);
    form.reset();
    if (!alive.current) return;
    pending.current = false; setBusy(false);
    if (result === 'updated') { recoveredUser.current = null; setMode('done'); setMessage('Password updated. Reopen your original trip invitation or trip link.'); }
    else setMessage(result === 'sent' ? 'If this address has an account, a recovery email will arrive. Open it in this same browser. Check spam too.' : result === 'limited' ? 'Too many requests. Wait before trying again.' : result === 'invalid' ? 'Check the email, or use matching passwords of at least eight characters.' : 'Request could not be completed. Try again later.');
  };
  return <main className="pilot-sign-in"><section className="pilot-sign-in__card"><Link to="/pilot/sign-in">Back to sign in</Link><h1>Password recovery</h1>
    {!supabase ? <p>Private sign-in has not been enabled.</p> : mode === 'checking' ? <p role="status">Checking recovery link…</p> : mode !== 'done' && <form onSubmit={submit}>
      {mode === 'update' ? <><label>New password<input name="password" type="password" minLength={8} required autoComplete="new-password" /></label><label>Confirm new password<input name="confirmation" type="password" minLength={8} required autoComplete="new-password" /></label></> : <label>Email<input name="email" type="email" required autoComplete="email" /></label>}
      <button disabled={busy}>{busy ? 'Please wait…' : mode === 'update' ? 'Update password' : 'Send recovery email'}</button>
    </form>}<p role="status">{message}</p><p>Recovery does not grant trip membership. Use your invited email and original invitation.</p>
  </section></main>;
}
