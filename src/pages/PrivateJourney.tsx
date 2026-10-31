import { lazy, Suspense, useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { buildPrivateJourney, selectJourney } from '../lib/privateJourney';
import type { JourneyView } from '../lib/privateJourney';
import { requestJourneyPhoto } from '../lib/journeyPhotoRequest';
import type { JourneyPhotoState } from '../lib/journeyPhotoRequest';
import { getPrivateJournalMediaUrl } from '../lib/privateTripWorkspace';
import type { PrivateTripWorkspace } from '../lib/privateTripWorkspace';

const stopMapEnabled = import.meta.env.VITE_VYBR_STOP_MAP_ENABLED === 'true';
const StopMap = stopMapEnabled ? lazy(() => import('./PrivateStopMap')) : null;

function JourneyPhoto({ client, path }: { client: SupabaseClient; path: string }) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ client: SupabaseClient; path: string; photo: JourneyPhotoState }>();
  const photo: JourneyPhotoState = result?.client === client && result.path === path ? result.photo : { kind: 'loading' };
  const setPhoto = (value: JourneyPhotoState) => setResult({ client, path, photo: value });
  useEffect(() => requestJourneyPhoto(() => getPrivateJournalMediaUrl(client, path), photo => setResult({ client, path, photo })), [client, path, attempt]);
  if (photo.kind === 'unavailable' || photo.kind === 'expired') return <div><p role="status">{photo.kind === 'expired' ? 'Photo preview expired. Reload to check your current access.' : 'Photo unavailable. Check your connection and trip access.'}</p><button type="button" onClick={() => { setPhoto({ kind: 'loading' }); setAttempt(value => value+1); }}>Reload private photo</button></div>;
  return photo.kind === 'ready' ? <img className="private-media" src={photo.url} alt="Shared trip memory" referrerPolicy="no-referrer" onError={() => setPhoto({ kind: 'unavailable' })} /> : <p role="status">Loading private photo.</p>;
}

export default function PrivateJourney({ client, workspace }: { client: SupabaseClient; workspace: PrivateTripWorkspace }) {
  return <JourneyContent key={`${workspace.trip.id}:${workspace.currentUserId}`} client={client} workspace={workspace} />;
}

function JourneyContent({ client, workspace }: { client: SupabaseClient; workspace: PrivateTripWorkspace }) {
  const [view, setView] = useState<JourneyView>('all');
  let days;
  try { days = buildPrivateJourney(workspace); }
  catch { return <p role="alert">The journey cannot be displayed because the trip time zone is unavailable.</p>; }
  const visibleDays = selectJourney(days, view);
  return <section className="private-section" aria-labelledby="journey-heading">
    <h3 id="journey-heading">Our journey</h3>
    <p>Plans and shared memories, shown in {workspace.trip.time_zone}. Planned stops are not a record of places visited.</p>
    <label>Show journey<select value={view} onChange={event => setView(event.target.value as JourneyView)}><option value="all">Plans and memories</option><option value="memories">Memories</option><option value="photos">Photos</option><option value="stops">Planned stops</option></select></label>
    {view === 'stops' && StopMap && <Suspense fallback={<p role="status">Loading coordinate plot.</p>}><StopMap tripId={workspace.trip.id} stops={selectJourney(days, 'stops').flatMap(day => day.items).map(item => ({ id: item.key, tripId: workspace.trip.id, label: item.location!, shared: true, coordinates: null }))} /></Suspense>}
    {view === 'stops' && <p>Route outline in planned order, not a geographic map. Locations are shown exactly as entered; no GPS or external map service is used.</p>}
    {!days.length ? <p>No activities or memories yet. Add a journal entry to start your shared story.</p> : !visibleDays.length && <p role="status">No {view === 'photos' ? 'shared photos' : view === 'stops' ? 'planned stops with a location' : 'memories'} yet.</p>}
    {visibleDays.map(day => <section key={day.day} aria-label={day.day}>
      <h4>{day.day}</h4><ol className="private-list">{day.items.map(item => <li className="private-card" key={item.key}>
        <p className="private-muted">{item.kind === 'activity' ? 'Planned activity' : `Memory by ${item.author}`} — <time dateTime={item.at}>{new Intl.DateTimeFormat('en-US', { timeZone: workspace.trip.time_zone, hour: 'numeric', minute: '2-digit' }).format(new Date(item.at))}</time></p>
        <p>{item.text}</p>{item.location && <p>{item.location}</p>}
        {item.mediaPath && <JourneyPhoto key={`${workspace.currentUserId}:${item.mediaPath}`} client={client} path={item.mediaPath} />}
      </li>)}</ol>
    </section>)}
  </section>;
}
