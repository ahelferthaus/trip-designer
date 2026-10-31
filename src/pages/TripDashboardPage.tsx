import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/pilotSupabase';
import { attemptForUser, createGeneralTrip, loadTripDashboard, TripRejectedError, validateTripDraft } from '../lib/tripDashboard';
import type { DashboardResult, TripAttempt, TripDraft } from '../lib/tripDashboard';
import './PilotSignInPage.css';
import './TripDashboardPage.css';
const enabled = import.meta.env.VITE_VYBR_TRIP_FOUNDATION_ENABLED === 'true';

export default function TripDashboardPage() {
  const [state,setState] = useState<DashboardResult | {status:'loading'}>({status:'loading'});
  const [revision,setRevision] = useState(0);
  const identity=useRef<string|null>(null);
  const requestGeneration=useRef(0);
  const [attempt,setAttempt]=useState<TripAttempt|null>(null);
  useEffect(() => {
    let alive=true;
    const refresh=async()=> { const current=++requestGeneration.current; const next=await loadTripDashboard(supabase,enabled); if(alive && requestGeneration.current===current) { if(next.status==='ready') { if(identity.current && identity.current!==next.userId) setAttempt(null); identity.current=next.userId; }
      else if(next.status==='signed_out' || next.status==='unverified') { identity.current=null; setAttempt(null); }
      setState(next); } };
    void refresh();
    const subscription=enabled ? supabase?.auth.onAuthStateChange((_event,session)=> { requestGeneration.current++; if(identity.current!==(session?.user.id??null)) {identity.current=session?.user.id??null;setAttempt(null);setState({status:'loading'});} window.setTimeout(()=> { if(alive) void refresh(); },0); }).data.subscription : undefined;
    window.addEventListener('focus',refresh);
    return ()=> { alive=false; subscription?.unsubscribe(); window.removeEventListener('focus',refresh); };
  },[revision]);
  return <main className="pilot-sign-in"><section className="pilot-sign-in__card trip-dashboard" aria-labelledby="dashboard-title">
    <Link to="/pilot/palau">VYBR / Sample trip</Link><h1 id="dashboard-title">Your trips, anywhere</h1>
    <p>Create a trip as its organizer, or join a trip with an invitation. Your role belongs to each trip.</p>
    {state.status==='loading' && <p role="status">Checking your account and trips.</p>}
    {state.status==='disabled' && <p role="status">General trip creation is not enabled yet. Existing private trip links still work.</p>}
    {state.status==='signed_out' && <p><Link to="/pilot/sign-in?next=%2Fpilot%2Ftrips">Sign in or create an account</Link></p>}
    {state.status==='unverified' && <p role="alert">Confirm your email, then <Link to="/pilot/sign-in?next=%2Fpilot%2Ftrips">sign in</Link> to organize or join a trip.</p>}
    {state.status==='unavailable' && <><p role="alert">Your trips could not be loaded. No private details are displayed. Try again later.</p><button onClick={()=>setRevision(n=>n+1)}>Retry</button></>}
    {state.status==='ready' && <>
      <button type="button" onClick={async()=>{requestGeneration.current++;identity.current=null;setAttempt(null);setState({status:'signed_out'});try {const result=await supabase?.auth.signOut({scope:'local'});if(result?.error)setState({status:'unavailable'});}catch{setState({status:'unavailable'});}}}>Sign out</button>
      <nav aria-label="Trip journeys"><a href="#create-trip">Create a trip</a> · <Link to="/pilot/invite">Join an invited trip</Link></nav>
      <p>To join, open the original private link from your organizer using the email they invited. Signing up alone does not join a trip.</p>
      <h2>My trips</h2>{state.trips.length ? <ul>{state.trips.map(trip=><li key={trip.id}><Link to={`/pilot/private/${trip.id}`}>{trip.title}</Link><p>{trip.destination || 'Existing private trip'} · {trip.role}<br />{trip.start_date} – {trip.end_date} · {trip.time_zone}{trip.participant_limit ? ` · Up to ${trip.participant_limit} participants, including organizer` : ''}</p></li>)}</ul> : <p>No active trips yet. Create one below or open your invitation.</p>}
      <CreateTripForm key={state.userId} attempt={attemptForUser(attempt,state.userId)} onAttempt={(requestId,draft)=>setAttempt({userId:state.userId,requestId,draft})} onRejected={()=>setAttempt(null)} />
    </>}
  </section></main>;
}
function CreateTripForm({attempt,onAttempt,onRejected}:{attempt:TripAttempt|null;onAttempt:(requestId:string,draft:TripDraft)=>void;onRejected:()=>void}) {
  const navigate=useNavigate(); const request=useRef(attempt?.requestId ?? crypto.randomUUID()); const alive=useRef(true); const pending=useRef(false);
  const [busy,setBusy]=useState(false); const [attempted,setAttempted]=useState(Boolean(attempt)); const [error,setError]=useState(''); const feedback=useRef<HTMLParagraphElement>(null);
  useEffect(()=> { alive.current=true; return ()=>{alive.current=false;}; },[]);
  useEffect(()=>{if(error) feedback.current?.focus();},[error]);
  const submit=async(event:React.FormEvent<HTMLFormElement>)=> {
    event.preventDefault(); if(pending.current) return;
    const data=new FormData(event.currentTarget);
    // Frozen inputs stay in FormData via readOnly, preserving an uncertain request for retry.
    const draft:TripDraft={ title:String(data.get('title')??''),destination:String(data.get('destination')??''),start:String(data.get('start')??''),end:String(data.get('end')??''),timeZone:String(data.get('zone')??''),participantLimit:Number(data.get('limit')),displayName:String(data.get('name')??'') };
    if(!validateTripDraft(draft)){setError('Check the dates, destination, IANA time zone and group size.');return;}
    pending.current=true; onAttempt(request.current,draft); setBusy(true);setAttempted(true);setError('');
    try { const trip=await createGeneralTrip(supabase,enabled,request.current,draft); if(alive.current) navigate(`/pilot/private/${trip}`); }
    catch(caught){if(alive.current) { if(caught instanceof TripRejectedError) {setAttempted(false);request.current=crypto.randomUUID();onRejected();} setError(caught instanceof Error?caught.message:'Creation could not be confirmed. Check My trips before retrying.'); }}
    finally{pending.current=false;if(alive.current)setBusy(false);}
  };
  return <section id="create-trip"><h2>Create a trip</h2><p>You become this trip’s organizer. No invitations are sent automatically.</p>
    <p ref={feedback} tabIndex={-1} role="alert">{error}</p>
    <form onSubmit={submit} aria-busy={busy}>
      <label>Trip title<input name="title" defaultValue={attempt?.draft.title ?? ''} required maxLength={160} readOnly={attempted} /></label>
      <label>Destination<input name="destination" defaultValue={attempt?.draft.destination ?? ''} required maxLength={160} placeholder="City, region or route" readOnly={attempted} /></label>
      <label>Start date<input name="start" defaultValue={attempt?.draft.start ?? ''} type="date" required readOnly={attempted} /></label>
      <label>End date<input name="end" defaultValue={attempt?.draft.end ?? ''} type="date" required readOnly={attempted} /></label>
      <label>Trip time zone<input name="zone" required defaultValue={attempt?.draft.timeZone ?? 'UTC'} placeholder="e.g. Europe/London" readOnly={attempted} aria-describedby="zone-help" /></label>
      <p id="zone-help">Use an IANA time zone such as Europe/London, Asia/Tokyo or Pacific/Palau. Displayed trip times use this zone; travel-detail editing explicitly labels its input zone.</p>
      <label>Total participants, including you<input name="limit" type="number" min={1} max={100} step={1} defaultValue={attempt?.draft.participantLimit ?? 8} required readOnly={attempted} /></label>
      <label>Your display name<input name="name" defaultValue={attempt?.draft.displayName ?? ''} required maxLength={60} autoComplete="nickname" readOnly={attempted} /></label>
      {attempted && <p>These details are kept fixed so retrying cannot create a second trip. Check My trips before starting a different request.</p>}
      <button disabled={busy}>{busy?'Creating trip…':attempted?'Retry same request':'Create private trip'}</button>
    </form>
  </section>;
}
