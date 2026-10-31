import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { buildPrivateJourney } from '../lib/privateJourney';
import { getPrivateJournalMediaUrl } from '../lib/privateTripWorkspace';
import type { PrivateTripWorkspace } from '../lib/privateTripWorkspace';

function JourneyPhoto({ client, path }: { client: SupabaseClient; path: string }) {
  const [attempt, setAttempt] = useState(0);
  const [photo, setPhoto] = useState<{ url: string; failed: boolean }>({ url: '', failed: false });
  useEffect(() => {
    let active = true;
    void getPrivateJournalMediaUrl(client, path).then(url => {
      if (active) setPhoto({ url, failed: false });
    }).catch(() => { if (active) setPhoto({ url: '', failed: true }); });
    return () => { active = false; };
  }, [client, path, attempt]);
  if (photo.failed) return <div><p role="status">Photo unavailable. Check your connection and trip access.</p><button type="button" onClick={() => { setPhoto({ url: '', failed: false }); setAttempt(value => value+1); }}>Retry photo</button></div>;
  return photo.url ? <img className="private-media" src={photo.url} alt="Shared trip memory" referrerPolicy="no-referrer" onError={() => setPhoto({ url: '', failed: true })} /> : <p role="status">Loading private photo…</p>;
}

export default function PrivateJourney({ client, workspace }: { client: SupabaseClient; workspace: PrivateTripWorkspace }) {
  let days;
  try { days = buildPrivateJourney(workspace); }
  catch { return <p role="alert">The journey cannot be displayed because the trip time zone is unavailable.</p>; }
  return <section className="private-section" aria-labelledby="journey-heading">
    <h3 id="journey-heading">Our journey</h3>
    <p>Plans and shared memories, shown in {workspace.trip.time_zone}. Planned stops are not a record of places visited.</p>
    {!days.length && <p>No activities or memories yet. Add a journal entry to start your shared story.</p>}
    {days.map(day => <section key={day.day} aria-label={day.day}>
      <h4>{day.day}</h4><ol className="private-list">{day.items.map(item => <li className="private-card" key={item.key}>
        <p className="private-muted">{item.kind === 'activity' ? 'Planned activity' : `Memory · ${item.author}`} · <time dateTime={item.at}>{new Intl.DateTimeFormat('en-US', { timeZone: workspace.trip.time_zone, hour: 'numeric', minute: '2-digit' }).format(new Date(item.at))}</time></p>
        <p>{item.text}</p>{item.location && <p>{item.location}</p>}
        {item.mediaPath && <JourneyPhoto key={`${workspace.currentUserId}:${item.mediaPath}`} client={client} path={item.mediaPath} />}
      </li>)}</ol>
    </section>)}
  </section>;
}
