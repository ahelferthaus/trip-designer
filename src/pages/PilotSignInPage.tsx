import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPilotAuthAction, exchangePilotConfirmation, pilotCallback, pilotDestination, pilotReturnPath, pilotToken } from '../lib/pilotAuth';
import { supabase } from '../lib/pilotSupabase';
import './PilotSignInPage.css';
import { PilotAuthFeedback } from './PilotAuthFeedback';

export default function PilotSignInPage() {
  const location = useLocation();
  return <PilotSignInForm key={location.key} />;
}

function PilotSignInForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const action = useRef(createPilotAuthAction());
  const token = useRef(pilotToken(location.hash));
  const [code] = useState(() => pilotCallback(location.search, location.hash).failed ? '' : new URLSearchParams(location.search).get('code') ?? '');
  const exchange = useRef<Promise<boolean> | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [slow, setSlow] = useState(false);
  const [checking, setChecking] = useState(Boolean(code));
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const feedback = useRef<HTMLDivElement>(null);
  const confirmationFeedback = useRef<HTMLDivElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const returnFocus = useRef(false);
  const [message, setMessage] = useState(() => pilotCallback(location.search, location.hash).failed ? 'This link is invalid or expired. If you already confirmed your email, sign in below.' : '');
  const requestedNext = new URLSearchParams(location.search).get('next');
  const next = !requestedNext && !pilotToken(location.hash) && import.meta.env.VITE_VYBR_TRIP_FOUNDATION_ENABLED === 'true' ? '/pilot/trips' : pilotReturnPath(requestedNext);
  useEffect(() => {
    if (confirmation) confirmationFeedback.current?.focus();
    else if (message) feedback.current?.focus();
    else if (returnFocus.current) { emailInput.current?.focus(); returnFocus.current = false; }
  }, [message, confirmation]);
  useEffect(() => {
    const current = action.current;
    token.current = pilotToken(location.hash);
    const callback = pilotCallback(location.search, location.hash);
    if (location.hash || callback.search !== location.search) window.history.replaceState(window.history.state, '', location.pathname + callback.search);
    return () => current.cancel();
  }, [location.key, location.hash, location.pathname, location.search]);
  useEffect(() => {
    let alive = true;
    const timer = window.setTimeout(() => { if (alive) setSlow(true); }, 15000);
    if (code && supabase) {
      exchange.current ??= exchangePilotConfirmation(supabase, code);
      void exchange.current.then(ready => {
        if (!alive) return;
        setChecking(false);
        if (ready) navigate(pilotDestination(next, token.current), { replace: true });
        else setMessage('We could not finish signing you in from this link. If your email is confirmed, sign in below. Use the same browser where you created your account.');
      }).catch(() => { if (alive) { setBlocked(true); setChecking(false); setMessage('We could not safely finish this sign-in. Clear it before continuing.'); } });
    }
    return () => { alive = false; window.clearTimeout(timer); };
  }, [code, navigate, next]);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || busy || checking || blocked) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true); setMessage('');
    const result = await action.current.run(supabase, String(values.get('email') ?? ''), String(values.get('password') ?? ''), signup, new URL('/pilot/sign-in', window.location.origin).href);
    if (result.status === 'ignored') return;
    setBusy(false);
    if (result.status === 'confirm') {
      form.reset(); setConfirmation(true); return;
    }
    if (result.status === 'ready') navigate(pilotDestination(next, token.current), { replace: true });
    else setMessage(result.status === 'retry_later' ? 'The service could not complete this request. Wait a few minutes before trying again. If you were signing up, check your inbox first; do not repeatedly submit.' : result.status === 'weak_password' ? 'Choose a stronger password that meets the account password policy, then try again.' : result.status === 'invalid' ? 'Enter an email and password. New accounts require at least 8 characters.' : 'Sign-in or account creation could not be completed. Check your details and try again.');
  };
  return <main className="pilot-sign-in"><section className="pilot-sign-in__card" aria-labelledby="pilot-sign-in-title">
    <Link to="/">VYBR</Link>
    <h1 id="pilot-sign-in-title">{signup ? 'Create your account' : 'Welcome to VYBR'}</h1>
    <p>{import.meta.env.VITE_VYBR_TRIP_FOUNDATION_ENABLED === 'true' ? 'Create an account to organize a trip, or use the email your organizer invited.' : 'Use the email your organizer invited.'} A confirmed account is required. Joining someone else’s trip also requires an accepted invitation.</p>
    <div ref={feedback} tabIndex={-1} className="pilot-sign-in__feedback" role="alert">
      <PilotAuthFeedback generalTrips={import.meta.env.VITE_VYBR_TRIP_FOUNDATION_ENABLED === 'true'} confirmation={false} signup={signup} message={confirmation ? '' : message} onReturn={() => {}} />
    </div>
    <div ref={confirmationFeedback} tabIndex={-1} className="pilot-sign-in__feedback" role="status">
      {confirmation && <PilotAuthFeedback generalTrips={import.meta.env.VITE_VYBR_TRIP_FOUNDATION_ENABLED === 'true'} confirmation signup={signup} message="" onReturn={() => { returnFocus.current = true; setConfirmation(false); setSignup(false); setMessage(''); }} />}
    </div>
    {!supabase ? <p role="status">Sign-in is temporarily unavailable. Please try again later.</p> : blocked ? <button disabled={busy} onClick={async () => {
      if (!supabase) return; setBusy(true);
      try { const result = await supabase.auth.signOut({ scope: 'local' }); const current = await supabase.auth.getSession();
        if (result.error || current.error || current.data.session) throw new Error('cleanup');
        window.location.reload();
      } catch { setMessage('Sign-in could not be cleared. Please try again.'); } finally { setBusy(false); }
    }}>Clear this sign-in and continue</button> : checking ? <p role="status">{slow ? 'This is taking longer than expected. You can reload this page and sign in with your password if your email is confirmed.' : 'Confirming your account and signing you in.'}</p> : !confirmation && <form onSubmit={submit} aria-busy={busy}>
      <label>Email <input ref={emailInput} name="email" type="email" required autoComplete="email" /></label>
      <label>Password <input name="password" type="password" required minLength={signup ? 8 : 1} autoComplete={signup ? 'new-password' : 'current-password'} /></label>
      <button disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account and send confirmation' : 'Sign in'}</button>
      <p><button type="button" disabled={busy} onClick={() => { setSignup(!signup); setMessage(''); }}>{signup ? 'Use an existing account' : 'Create an account'}</button></p>
    </form>}
    <p><Link to="/pilot/recover">Forgot your password?</Link></p>
    {token.current && <p>After signing in, you can accept your trip invitation. If you leave this page, reopen the original invitation link.</p>}
  </section></main>;
}
