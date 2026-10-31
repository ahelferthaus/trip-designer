import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPilotAuthAction, pilotCallback, pilotDestination, pilotReturnPath, pilotToken } from '../lib/pilotAuth';
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
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const feedback = useRef<HTMLDivElement>(null);
  const confirmationFeedback = useRef<HTMLDivElement>(null);
  const emailInput = useRef<HTMLInputElement>(null);
  const returnFocus = useRef(false);
  const [message, setMessage] = useState(() => pilotCallback(location.search, location.hash).failed ? 'That confirmation link is invalid or expired. Sign in if already confirmed, or contact your organizer for help.' : pilotCallback(location.search, location.hash).hadCode ? 'Confirmation link opened. Sign in to check your account. If it still needs confirmation, ask for help before requesting another email.' : '');
  const next = pilotReturnPath(new URLSearchParams(location.search).get('next'));
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
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || busy) return;
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
    <Link to="/pilot/palau">VYBR / Palau sample</Link>
    <h1 id="pilot-sign-in-title">{signup ? 'Create your pilot account' : 'Sign in to your private trip'}</h1>
    <p>Use the email your organizer invited. Trip access requires a confirmed account and an accepted invitation.</p>
    <div ref={feedback} tabIndex={-1} className="pilot-sign-in__feedback" role="alert">
      <PilotAuthFeedback confirmation={false} signup={signup} message={confirmation ? '' : message} onReturn={() => {}} />
    </div>
    <div ref={confirmationFeedback} tabIndex={-1} className="pilot-sign-in__feedback" role="status">
      {confirmation && <PilotAuthFeedback confirmation signup={signup} message="" onReturn={() => { returnFocus.current = true; setConfirmation(false); setSignup(false); setMessage(''); }} />}
    </div>
    {!supabase ? <p role="status">Private sign-in has not been enabled.</p> : !confirmation && <form onSubmit={submit} aria-busy={busy}>
      <label>Email <input ref={emailInput} name="email" type="email" required autoComplete="email" /></label>
      <label>Password <input name="password" type="password" required minLength={signup ? 8 : 1} autoComplete={signup ? 'new-password' : 'current-password'} /></label>
      <button disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account and send confirmation' : 'Sign in'}</button>
      <p><button type="button" disabled={busy} onClick={() => { setSignup(!signup); setMessage(''); }}>{signup ? 'Use an existing account' : 'Create an account'}</button></p>
    </form>}
    <p><Link to="/pilot/recover">Forgot your password?</Link></p>
    <p>If you leave or reload this page, reopen the original invitation after signing in. Invitation tokens are not stored here.</p>
  </section></main>;
}
