import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import type { Subscription, SupabaseClient } from '@supabase/supabase-js';
import { acceptPrivateTripInvite, getPrivateTripAccess, isVerifiedPrivateUser } from '../lib/privateTripAccess';
import type { PrivateTripAccess } from '../lib/privateTripAccess';
import PrivateTripWorkspace from './PrivateTripWorkspace';
import { pilotToken, pilotDestination } from '../lib/pilotAuth';

const enabled = import.meta.env.VITE_PALAU_PRIVATE_ENABLED === 'true';
const message: Record<string, string> = {
  unconfigured: 'The private backend has not been enabled. The sample pilot works without an account or backend.',
  signed_out: 'Sign in with your invited account, then reopen this private link. No trip details are available before authorization.',
  unverified: 'Use a verified, non-anonymous account. Confirm your email before opening this private trip.',
  unavailable: 'This private trip is unavailable to this account. Check your invitation with the organizer.',
  error: 'Access could not be verified. No private trip data is displayed. Please try again later.',
};

export default function PrivateTripAccessPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const clientRef = useRef<SupabaseClient | null>(null);
  const [access, setAccess] = useState<PrivateTripAccess | { status: 'loading' }>({ status: 'loading' });
  const [token, setToken] = useState(() => pilotToken(window.location.hash));
  const [name, setName] = useState('');
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const generation = useRef(0);
  const acceptanceGeneration = useRef(0);
  const identity = useRef<string | null>(null);

  useEffect(() => {
    acceptanceGeneration.current += 1;
    setBusy(false);
    setError('');
    const incoming = pilotToken(location.hash);
    if (incoming) setToken(incoming);
    else setToken('');
    // Preserve React Router's history state. A second invite updates in-memory token.
    if (window.location.hash) window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
  }, [location.key, location.hash, tripId]);

  useEffect(() => {
    let alive = true;
    let subscription: Subscription | undefined;
    setAccess({ status: 'loading' });
    setVerified(false);
    const updateIdentity = (userId: string | null) => {
      if (identity.current !== userId) {
        identity.current = userId;
        acceptanceGeneration.current += 1;
        setBusy(false);
        setError('');
        setAccess({ status: 'loading' });
        setVerified(false);
      }
    };
    const refresh = async () => {
      const request = ++generation.current;
      // Same-identity rechecks preserve the mounted editor and its unsaved inputs.
      // Identity changes clear the view immediately; failed rechecks still fail closed.
      if (!enabled) { setAccess({ status: 'unconfigured' }); return; }
      try {
        // Disabled routes do not even initialize a Supabase client/session refresh.
        const client = clientRef.current ?? (await import('../lib/pilotSupabase')).supabase;
        if (!alive || request !== generation.current) return;
        clientRef.current = client;
        if (!client) { setAccess({ status: 'unconfigured' }); return; }
        if (!subscription) subscription = client.auth.onAuthStateChange((_event, session) => {
          generation.current += 1;
          updateIdentity(session?.user.id ?? null);
          if (!session) { setAccess({ status: 'signed_out' }); setVerified(false); }
          // Defer client calls outside the Auth event lock.
          window.setTimeout(() => { if (alive) void refresh(); }, 0);
        }).data.subscription;
        if (tripId) {
          const result = await getPrivateTripAccess(client, tripId);
          if (alive && request === generation.current) {
            if (result.status === 'member') identity.current = result.userId;
            setAccess(result);
          }
        } else {
          const { data: { user }, error: authError } = await client.auth.getUser();
          if (!alive || request !== generation.current) return;
          updateIdentity(user?.id ?? null);
          setVerified(!authError && isVerifiedPrivateUser(user));
          setAccess({ status: !user && (!authError || authError.name === 'AuthSessionMissingError') ? 'signed_out' : authError ? 'error' : isVerifiedPrivateUser(user) ? 'unavailable' : 'unverified' });
        }
      } catch {
        if (alive && request === generation.current) { setAccess({ status: 'error' }); setVerified(false); }
      }
    };
    void refresh();
    const invalidate = () => { generation.current += 1; acceptanceGeneration.current += 1; };
    const onVisible = () => { if (document.visibilityState === 'visible') void refresh(); };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', onVisible);
    return () => { alive = false; invalidate(); subscription?.unsubscribe(); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', onVisible); };
  }, [tripId, location.hash]);

  const accept = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !enabled) return;
    setBusy(true);
    setError('');
    const request = acceptanceGeneration.current;
    try {
      const acceptedTrip = await acceptPrivateTripInvite(clientRef.current, token, name);
      if (request !== acceptanceGeneration.current) return;
      setToken('');
      navigate(`/pilot/private/${acceptedTrip}`, { replace: true });
    } catch (caught) {
      if (request === acceptanceGeneration.current) setError(caught instanceof Error ? caught.message : 'Invitation unavailable.');
    } finally {
      if (request === acceptanceGeneration.current) setBusy(false);
    }
  };

  return <main style={{ minHeight: '100vh', background: '#f4f4ee', color: '#183e38', padding: 'clamp(24px,6vw,72px)', fontFamily: 'system-ui, sans-serif' }}>
    <div style={{ maxWidth: access.status === 'member' ? 1180 : 620, margin: '0 auto' }}>
      <Link to="/pilot/palau" style={{ color: '#2e6253' }}>VYBR / Palau sample pilot</Link>
      <p style={{ marginTop: 48, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>Private access • setup preview</p>
      <h1 style={{ fontSize: 'clamp(32px,5vw,48px)', margin: '12px 0 24px', lineHeight: 1.1 }}>{tripId ? 'Your trip, by invitation.' : 'Accept a private invitation.'}</h1>
      <section style={{ background: '#fff', padding: 28, borderRadius: 20, border: '1px solid #d9e4dd' }} aria-live="polite">
        {clientRef.current && !['loading', 'unconfigured', 'signed_out'].includes(access.status) && <p><button type="button" disabled={busy} onClick={async () => {
          generation.current++; acceptanceGeneration.current++;
          setAccess({ status: 'signed_out' }); setVerified(false); setBusy(true); setError('');
          try { const result = await clientRef.current?.auth.signOut({ scope: 'local' }); if (result?.error) { setAccess({ status: 'error' }); setError('Sign-out could not be completed. Please retry.'); } }
          catch { setAccess({ status: 'error' }); setError('Sign-out could not be completed. Please retry.'); }
          finally { setBusy(false); }
        }}>Sign out of the pilot</button></p>}
        {access.status === 'loading' ? <p>Checking access…</p> : access.status === 'member' && clientRef.current ? <PrivateTripWorkspace key={`${access.userId}:${access.trip.id}:${access.role}`} client={clientRef.current} access={access} /> : access.status === 'member' ? <>
          <h2>{access.trip.title}</h2>
          <p>{access.trip.start_date} – {access.trip.end_date} · {access.trip.time_zone}</p>
          <p>Verified role: <strong>{access.role}</strong></p>
          <p>The database access check passed. The persistent workspace is not yet connected to the sample UI.</p>
        </> : <p>{!tripId && verified ? 'You are signed in with a verified account. Acceptance is checked on the server against the invited email and token expiry.' : message[access.status]}</p>}
        {!tripId && enabled && verified && <form onSubmit={accept}>
          {!token && <p>The invitation token is missing. Reopen the original invitation link after signing in.</p>}
          <label htmlFor="private-name">Display name</label>
          <input id="private-name" value={name} onChange={event => setName(event.target.value)} maxLength={60} required autoComplete="nickname" style={{ display: 'block', width: '100%', margin: '8px 0 16px', border: '1px solid #91aaa0', borderRadius: 8, padding: 12 }} />
          <button disabled={busy || !token || !name.trim()} style={{ background: '#194b3e', color: 'white', padding: '13px 18px', borderRadius: 10, opacity: busy || !token || !name.trim() ? 0.5 : 1 }}>{busy ? 'Checking invitation…' : 'Accept invitation'}</button>
        </form>}
        {error && <p role="alert">{error}</p>}
        {enabled && (access.status === 'signed_out' || access.status === 'unverified') && <p><Link to={`/pilot/sign-in?next=${encodeURIComponent(tripId ? `/pilot/private/${tripId}` : '/pilot/invite')}${!tripId ? pilotDestination('/pilot/invite', token).replace('/pilot/invite', '') : ''}`}>Go to VYBR sign-in</Link> · Then reopen your invitation link.</p>}
      </section>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: '#52685f', marginTop: 24 }}>This route is configuration-gated and fail-closed. Do not enter real traveler information until the migration, Auth, Storage, sessions, advisors and cross-user tests have passed in approved staging. The sample demo remains separate and does not save to this backend.</p>
      <p><Link to="/pilot/palau">Return to the sample pilot →</Link></p>
    </div>
  </main>;
}
