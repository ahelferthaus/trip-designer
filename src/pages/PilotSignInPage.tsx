import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { createPilotAuthAction, pilotDestination, pilotReturnPath, pilotToken } from '../lib/pilotAuth';
import { supabase } from '../lib/pilotSupabase';

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
  const [message, setMessage] = useState('');
  const next = pilotReturnPath(new URLSearchParams(location.search).get('next'));
  useEffect(() => {
    const current = action.current;
    token.current = pilotToken(location.hash);
    if (location.hash) window.history.replaceState(window.history.state, '', location.pathname + location.search);
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
    form.reset(); setBusy(false);
    if (result.status === 'ready') navigate(pilotDestination(next, token.current), { replace: true });
    else setMessage(result.status === 'confirm' ? 'Check your email to confirm your account, then sign in here and reopen your original invitation. Creating an account does not grant trip access.' : result.status === 'invalid' ? 'Enter an email and password. New accounts require at least 8 characters.' : 'Sign-in or account creation could not be completed. Check your details and try again.');
  };
  return <main style={{ maxWidth: 620, margin: '48px auto', padding: 24, fontFamily: 'system-ui', color: '#183e38' }}>
    <Link to="/pilot/palau">VYBR / Palau sample</Link>
    <h1>{signup ? 'Create your pilot account' : 'Sign in to your private trip'}</h1>
    <p>Use the email your organizer invited. Trip access requires a confirmed account and an accepted invitation.</p>
    {!supabase ? <p role="status">Private sign-in has not been enabled.</p> : <form onSubmit={submit}>
      <label>Email <input name="email" type="email" required autoComplete="email" style={{ display: 'block', width: '100%', margin: '8px 0 20px', padding: 12 }} /></label>
      <label>Password <input name="password" type="password" required minLength={signup ? 8 : 1} autoComplete={signup ? 'new-password' : 'current-password'} style={{ display: 'block', width: '100%', margin: '8px 0 20px', padding: 12 }} /></label>
      <button disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account and send confirmation' : 'Sign in'}</button>
      <p><button type="button" disabled={busy} onClick={() => { setSignup(!signup); setMessage(''); }}>{signup ? 'Use an existing account' : 'Create an account'}</button></p>
    </form>}
    <p role="status">{message}</p>
    <p>If you leave or reload this page, reopen the original invitation after signing in. Invitation tokens are not stored here.</p>
  </main>;
}
