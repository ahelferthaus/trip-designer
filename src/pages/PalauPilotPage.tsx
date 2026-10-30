import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import JournalEntryCard from '../components/activetrip/JournalEntryCard';
import type { JournalEntry } from '../lib/tripJournal';
import { buildEssentials, canEditTask, canViewPilot, COORDINATION, goingCount, INITIAL_ACTIVITIES, INITIAL_TASKS, PILOT_ACCESS_PREVIEWS, PILOT_TIME_ZONE, PILOT_TRAVELERS, toggleTask, updateActivityStatus, updateRsvp, visibleTasks } from '../lib/palauPilot';
import type { PilotTab, PilotTask, Rsvp } from '../lib/palauPilot';
import './palau-pilot.css';

type IconName = 'arrow' | 'check' | 'plane' | 'boat' | 'sun' | 'lock' | 'download' | 'journal' | 'pin' | 'close';
function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    check: <path d="m5 12 4 4L19 6" />,
    plane: <><path d="m21 3-7 18-3-8-8-3L21 3Z" /><path d="m11 13 5-5" /></>,
    boat: <><path d="m3 13 9-3 9 3-3 6H6l-3-6Zm5-2V5h8v6M12 5V2M2 22c2 0 3-2 5-2s3 2 5 2 3-2 5-2 3 2 5 2" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>,
    journal: <><path d="M5 3h13a2 2 0 0 1 2 2v16H6a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2Zm-2 15a3 3 0 0 1 3-3h14M8 7h7m-7 4h5" /></>,
    pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
    close: <path d="m6 6 12 12M6 18 18 6" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function IslandArtwork() {
  return <svg className="palau-island-art" viewBox="0 0 640 480" aria-hidden="true">
    <defs>
      <linearGradient id="palau-sea" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#0a5863" /><stop offset=".55" stopColor="#158c91" /><stop offset="1" stopColor="#79c9bc" /></linearGradient>
      <linearGradient id="palau-land" x1="0" y1="0" x2=".6" y2="1"><stop stopColor="#4d8667" /><stop offset="1" stopColor="#103e36" /></linearGradient>
      <filter id="palau-shadow"><feDropShadow dx="0" dy="9" stdDeviation="12" floodColor="#06383b" floodOpacity=".35" /></filter>
    </defs>
    <rect width="640" height="480" fill="url(#palau-sea)" />
    <g fill="none" stroke="#b5e5d3" strokeWidth="1" opacity=".15">
      <path d="M-20 402C160 295 163 459 344 337S510 288 680 172M-20 372C160 265 163 429 344 307S510 258 680 142M-20 342C160 235 163 399 344 277S510 228 680 112M-20 312C160 205 163 369 344 247S510 198 680 82M-20 282C160 175 163 339 344 217S510 168 680 52" />
    </g>
    <g fill="#9ed1a9" opacity=".45" stroke="#b5e5c5" strokeWidth="22" strokeLinejoin="round">
      <path d="M362 35c45-25 57 5 62 28s41 22 41 49-32 33-22 57-26 55-55 44-13-42-43-42-66-28-57-55 39-15 41-37 6-29 33-44Z" />
      <path d="M165 207c27-30 66-19 75 8s33 24 32 51-35 38-45 73-51 57-72 29-5-49-18-69-2-51 28-92Z" />
      <path d="M422 292c35-13 47 21 72 22s37 41 14 54-27-15-48-8-56-21-38-68Z" />
    </g>
    <g fill="url(#palau-land)" filter="url(#palau-shadow)">
      <path d="M362 35c45-25 57 5 62 28s41 22 41 49-32 33-22 57-26 55-55 44-13-42-43-42-66-28-57-55 39-15 41-37 6-29 33-44Z" />
      <path d="M165 207c27-30 66-19 75 8s33 24 32 51-35 38-45 73-51 57-72 29-5-49-18-69-2-51 28-92Z" />
      <path d="M422 292c35-13 47 21 72 22s37 41 14 54-27-15-48-8-56-21-38-68Z" />
      <ellipse cx="310" cy="351" rx="17" ry="29" transform="rotate(-35 310 351)" /><ellipse cx="515" cy="222" rx="12" ry="19" transform="rotate(35 515 222)" />
    </g>
    <g stroke="#80aa7c" fill="none" opacity=".38"><path d="M366 55c25-15 44 9 38 35s48 15 36 44-31 25-30 51M182 223c25-13 51 5 36 34s19 27-4 54-24 39-39 37M436 309c14-8 24 24 48 22" /><path d="M375 70c14 1 4 24 15 34s35 24 18 43M186 244c-14 31 18 27 0 60" /></g>
    <path d="M91 396c49-11 184 54 224-25s-70-134 4-169 142 43 218-29" fill="none" stroke="#f5ebd5" strokeWidth="2" strokeDasharray="5 8" opacity=".65" />
    <g transform="translate(307 255) rotate(20)"><path d="m0-16 9 25-9 7-9-7Z" fill="#fff8e7" /><path d="M0-7V10" stroke="#173f43" strokeWidth="2" /></g>
    <circle cx="92" cy="396" r="6" fill="#f6bf85" stroke="#fff7e7" strokeWidth="3" />
    <text x="112" y="400" fill="#e9f4e8" fontSize="12" letterSpacing="2" fontFamily="sans-serif">THE SLOW WAY</text>
  </svg>;
}

const initialJournal: JournalEntry[] = [{ id: 'sample-entry', trip_id: 'sample-palau', user_id: 'traveler-b', entry_type: 'text', body: 'First morning on island time. Coffee, a quiet walk, and absolutely no rush. A sample memory for our shared journal.', photo_url: null, thumbnail_url: null, lat: null, lng: null, recorded_at: '2030-03-08T08:20:00+09:00', created_at: '2030-03-08T08:20:00+09:00', author_name: 'Traveler B' }];
const tabs: { id: PilotTab; label: string }[] = [{ id: 'home', label: 'Overview' }, { id: 'plan', label: 'The plan' }, { id: 'checklist', label: 'Checklists' }, { id: 'journal', label: 'Journal' }, { id: 'essentials', label: 'Essentials' }];
const nameFor = (id: string) => PILOT_TRAVELERS.find(traveler => traveler.id === id)?.name ?? 'Unassigned';

export default function PalauPilotPage() {
  const [actorId, setActorId] = useState('traveler-a');
  const [searchParams, setSearchParams] = useSearchParams();
  const candidate = searchParams.get('section');
  const tab: PilotTab = tabs.some(item => item.id === candidate) ? candidate as PilotTab : 'home';
  function setTab(next: PilotTab) {
    if (next !== tab) {
      const params = new URLSearchParams(searchParams);
      params.set('section', next);
      setSearchParams(params);
    }
    document.getElementById('palau-main')?.focus({ preventScroll: true });
  }
  const [tasks, setTasks] = useState(() => structuredClone(INITIAL_TASKS));
  const [activities, setActivities] = useState(() => structuredClone(INITIAL_ACTIVITIES));
  const [journal, setJournal] = useState<JournalEntry[]>(() => structuredClone(initialJournal));
  const [draft, setDraft] = useState('');
  const [message, setMessage] = useState('');
  const actor = [...PILOT_TRAVELERS, ...PILOT_ACCESS_PREVIEWS].find(person => person.id === actorId) ?? PILOT_TRAVELERS[0];
  const personalTasks = visibleTasks(actor, tasks).filter(task => task.scope === 'personal');
  const sharedTasks = visibleTasks(actor, tasks).filter(task => task.scope === 'shared');
  const completed = personalTasks.filter(task => task.done).length;

  function resetDemo() {
    setTasks(structuredClone(INITIAL_TASKS)); setActivities(structuredClone(INITIAL_ACTIVITIES));
    setJournal(structuredClone(initialJournal)); setDraft(''); setMessage('Sample data reset. Nothing was saved to an account.');
  }
  function respond(activityId: string, response: Rsvp) {
    const result = updateRsvp(actor, activities, activityId, response);
    setActivities(result.activities);
    setMessage(result.error ?? `Sample response changed to ${response.replace('-', ' ')}. This is not a booking.`);
  }
  function downloadEssentials() {
    const url = URL.createObjectURL(new Blob([buildEssentials()], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'palau-sample-essentials.txt'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage('Downloaded sample essentials. No personal information is included.');
  }
  function addJournalEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim() || !canViewPilot(actor)) return;
    const recordedAt = '2030-03-08T17:00:00+09:00';
    setJournal([...journal, { id: crypto.randomUUID(), trip_id: 'sample-palau', user_id: actor.id, entry_type: 'text', body: draft.trim(), photo_url: null, thumbnail_url: null, lat: null, lng: null, recorded_at: recordedAt, created_at: recordedAt, author_name: actor.name }]);
    setDraft(''); setMessage('Sample memory added for 8 Mar. It disappears on refresh; no location was collected.');
  }
  function taskList(items: PilotTask[]) {
    return <ul className="palau-task-list">{items.map(task => <li key={task.id} className={task.done ? 'is-done' : ''}>
      <button className="palau-check" role="checkbox" aria-checked={task.done} aria-label={`${task.done ? 'Uncheck' : 'Complete'} ${task.title}`} disabled={!canEditTask(actor, task)} onClick={() => { setTasks(toggleTask(actor, tasks, task.id)); setMessage('Sample checklist updated for this session only.'); }}>{task.done && <Icon name="check" size={15} />}</button>
      <div><span className="palau-task-title">{task.title}</span><p>{task.detail}</p><div className="palau-task-meta"><span>{task.scope === 'personal' ? 'Only you' : nameFor(task.ownerId)}</span><span>{task.due}</span>{!canEditTask(actor, task) && <span>Owner / organizer can edit</span>}</div></div>
    </li>)}</ul>;
  }

  return <div className="palau-pilot">
    <a className="palau-skip" href="#palau-main">Skip to trip content</a>
    <div className="palau-demo-bar"><span><strong>SAMPLE PILOT</strong><span className="palau-demo-long"> Fictional travelers. Session-only changes; refresh resets.</span><span className="palau-demo-short"> Not connected. Refresh resets.</span></span><button onClick={resetDemo}>Reset demo <span aria-hidden="true">↺</span></button></div>
    <header className="palau-header">
      <a href="/" className="palau-wordmark" aria-label="VYBR home">VYBR<span>TRAVEL</span></a>
      <div className="palau-trip-label"><span className="palau-tiny-dot" /> THE PALAU EDITION</div>
      <div className="palau-view-select"><label htmlFor="palau-actor">Sample view</label><select id="palau-actor" value={actorId} onChange={event => { setActorId(event.target.value); setDraft(''); setMessage('Preview changed. This selector simulates roles; it is not authentication.'); }}>
        <optgroup label="Fictional trip members">{PILOT_TRAVELERS.map(person => <option key={person.id} value={person.id}>{person.name}{person.role === 'organizer' ? ' (organizer)' : ''}</option>)}</optgroup>
        <optgroup label="Access previews">{PILOT_ACCESS_PREVIEWS.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}</optgroup>
      </select></div>
    </header>
    <div className="palau-status" role="status" aria-live="polite">{message}</div>
    {!canViewPilot(actor) ? <main id="palau-main" tabIndex={-1} className="palau-access-preview">
      <div className="palau-section-icon"><Icon name="lock" size={28} /></div><p className="palau-eyebrow">ACCESS PREVIEW · NO REAL AUTHENTICATION</p>
      <h1>{actor.role === 'logged-out' ? 'Your trip stays with your group.' : 'This one is members only.'}</h1>
      <p>{actor.role === 'logged-out' ? 'A connected private trip will require sign-in before showing trip details.' : 'Signing in alone does not grant access. A connected trip will require an accepted invitation or existing membership.'}</p>
      <p className="palau-muted">This is a UI simulation using fictional data, not proof of backend security. The private backend must be provisioned and tested separately.</p>
      <button className="palau-primary" onClick={() => { setActorId('traveler-a'); setMessage('Returned to the sample member view.'); }}>Explore the sample as Traveler A <Icon name="arrow" /></button>
    </main> : <>
      <section className="palau-hero" aria-label="Palau sample trip introduction">
        <div className="palau-hero-copy"><p className="palau-eyebrow">A LITTLE FURTHER. A LITTLE SLOWER.</p><h1>Palau,<br /><em>together.</em></h1><p className="palau-hero-description">A few days on land. A week on the water.<br />One place to bring the whole trip together.</p><div className="palau-hero-details"><span>7—19 MAR 2030 · FICTIONAL</span><span>4 SAMPLE TRAVELERS</span></div><div className="palau-hero-footer"><div className="palau-avatar-stack" aria-hidden="true">{PILOT_TRAVELERS.map(person => <span key={person.id}>{person.initials}</span>)}</div><span>Small group. Big blue.</span></div></div>
        <div className="palau-hero-visual"><IslandArtwork /><div className="palau-art-label"><span>07°30′ N / 134°30′ E</span><span>PALAU / WESTERN PACIFIC</span></div><span className="palau-art-note">Illustrated island study · not a navigation map</span></div>
      </section>
      <nav className="palau-tabs" aria-label="Sample trip sections">{tabs.map(item => <button key={item.id} aria-current={tab === item.id ? 'page' : undefined} onClick={() => { setTab(item.id); setMessage(''); }}>{item.label}{item.id === 'checklist' && <span>{personalTasks.filter(task => !task.done).length + sharedTasks.filter(task => !task.done).length}</span>}</button>)}<div className="palau-zone"><Icon name="sun" size={16} /> Palau local · UTC+9</div></nav>
      <main id="palau-main" tabIndex={-1} className="palau-content">
        {tab === 'home' && <>
          <div className="palau-section-heading"><div><p className="palau-eyebrow">THE BIG PICTURE</p><h2>Less coordinating.<br className="palau-mobile-break" /> More being there.</h2></div><span className="palau-note-tag">All details below are samples</span></div>
          <div className="palau-trip-phases"><article><div className="palau-phase-top"><span>01 / SETTLE IN</span><Icon name="sun" /></div><h3>Island days</h3><p>7–11 Mar · 4 hotel nights</p><span>Koror base, easy starts, optional adventures.</span></article><article className="palau-boat-phase"><div className="palau-phase-top"><span>02 / CAST OFF</span><Icon name="boat" /></div><h3>Out on the blue</h3><p>11–18 Mar · 7 boat nights</p><span>Sample boat block. Operator details not loaded.</span></article><article><div className="palau-phase-top"><span>03 / ONE LAST SUNSET</span><Icon name="plane" /></div><h3>Back to shore</h3><p>18–19 Mar · 1 hotel night</p><span>Return to Koror, regroup, then head home.</span></article></div>
          <div className="palau-overview-grid">
            <section className="palau-card palau-coordination"><div className="palau-card-heading"><div><p className="palau-eyebrow">GETTING EVERYONE THERE</p><h3>Arrivals & handoffs</h3></div><Icon name="plane" size={24} /></div><p className="palau-card-intro">Sample coordination, not confirmed transport or lodging.</p><div className="palau-handoffs">{COORDINATION.map((item, index) => <article key={item.id}><div className="palau-handoff-number">{String(index + 1).padStart(2, '0')}</div><div className="palau-handoff-info"><span className="palau-small-caps">{item.time}</span><h4>{item.label}</h4><p>{item.detail}</p><span className="palau-handoff-owner">Owner: {nameFor(item.ownerId)}</span></div><span className={`palau-badge ${item.status === 'ready' ? 'palau-badge-green' : 'palau-badge-sand'}`}>{item.status === 'ready' ? 'Sample ready' : 'To confirm'}</span></article>)}</div></section>
            <aside className="palau-overview-side"><section className="palau-card palau-ready-card"><p className="palau-eyebrow">A LITTLE PREP, A LOT OF PEACE</p><h3>Your getting-ready list</h3><div className="palau-progress-label"><span>{completed} of {personalTasks.length} personal items done</span><strong>{personalTasks.length ? Math.round(completed / personalTasks.length * 100) : 0}%</strong></div><progress value={completed} max={personalTasks.length || 1} aria-label="Personal checklist completion" />{personalTasks.find(task => !task.done) ? <div className="palau-next-task"><span>UP NEXT</span><p>{personalTasks.find(task => !task.done)?.title}</p></div> : <div className="palau-next-task"><span>ALL SET FOR NOW</span><p>Your sample personal list is complete.</p></div>}<button className="palau-text-button" onClick={() => setTab('checklist')}>Open checklists <Icon name="arrow" size={18} /></button></section><section className="palau-essentials-card"><Icon name="download" size={26} /><h3>A small offline backup.</h3><p>The outline of the trip, without anyone’s private details.</p><button onClick={downloadEssentials}>Download essentials <Icon name="arrow" size={18} /></button></section><div className="palau-quiet-note"><Icon name="lock" size={17} /><p>Sample sandbox only. No accounts, uploads, live tracking, bookings or payments.</p></div></aside>
          </div>
        </>}
        {tab === 'plan' && <>
          <div className="palau-section-heading"><div><p className="palau-eyebrow">MAKE ROOM FOR A LITTLE ADVENTURE</p><h2>What sounds like you?</h2></div><span className="palau-note-tag">Sample prices · USD / person</span></div>
          <div className="palau-info-strip"><Icon name="sun" /><p><strong>Interest, not a booking.</strong> Going / Maybe / Not going is separate from the group plan status. No places are reserved and no payments are taken.</p></div>
          <div className="palau-activities">{activities.map((activity, index) => {
            const going = goingCount(activity); const full = going >= activity.capacity;
            return <article className="palau-card palau-activity" key={activity.id}><div className={`palau-activity-art palau-activity-art-${index}`}><Icon name={index === 1 ? 'sun' : 'boat'} size={44} /><span>{activity.category}</span></div><div className="palau-activity-body"><div className="palau-activity-top"><span className="palau-small-caps">{activity.date} · {activity.time}</span><span className={`palau-badge ${activity.status === 'confirmed' ? 'palau-badge-green' : 'palau-badge-sand'}`}>{activity.status === 'confirmed' ? 'Plan confirmed' : 'Proposed'}</span></div><h3>{activity.title}</h3><p className="palau-activity-detail">{activity.detail}</p><div className="palau-activity-facts"><span><strong>${activity.cost}</strong> sample estimate</span><span className={full ? 'palau-full' : ''}><strong>{going}/{activity.capacity}</strong> going{full ? ' · Full' : ` · ${activity.capacity - going} open`}</span></div><div className="palau-capacity-track" aria-hidden="true"><span style={{ width: `${Math.min(100, going / activity.capacity * 100)}%` }} /></div><fieldset className="palau-rsvp"><legend>Your response · {actor.name}</legend>{(['going', 'maybe', 'not-going'] as Rsvp[]).map(response => <button key={response} type="button" aria-pressed={activity.responses[actor.id] === response} disabled={response === 'going' && full && activity.responses[actor.id] !== 'going'} onClick={() => respond(activity.id, response)}>{response === 'going' && <Icon name="check" size={14} />}{response === 'not-going' ? 'Not going' : response[0].toUpperCase() + response.slice(1)}</button>)}</fieldset>{actor.role === 'organizer' && <button className="palau-organizer-action" onClick={() => { setActivities(updateActivityStatus(actor, activities, activity.id)); setMessage('Sample group plan status changed. This does not confirm a booking.'); }}>{activity.status === 'proposed' ? 'Organizer: confirm group plan' : 'Organizer: return to proposed'}</button>}</div></article>;
          })}</div><p className="palau-bottom-note">Capacity is a sample coordination limit, not operator inventory. “Maybe” is not a waitlist. Boat-day activities will follow operator-confirmed plans, not this demo.</p>
        </>}
        {tab === 'checklist' && <>
          <div className="palau-section-heading"><div><p className="palau-eyebrow">A PLACE FOR THE LITTLE THINGS</p><h2>Ready, without the rush.</h2></div><span className="palau-note-tag">Viewing as {actor.name}</span></div>
          <div className="palau-checklist-grid"><section className="palau-card"><div className="palau-card-heading"><div><p className="palau-eyebrow">FOR YOUR EYES ONLY IN A CONNECTED TRIP</p><h3>Your personal list</h3></div><Icon name="lock" /></div><p className="palau-card-intro">Only this sample traveler’s items appear here. Even the organizer cannot edit another traveler’s personal list.</p>{taskList(personalTasks)}</section><section className="palau-card"><div className="palau-card-heading"><div><p className="palau-eyebrow">A SMALL TEAM EFFORT</p><h3>The shared list</h3></div><span className="palau-count-pill">{sharedTasks.filter(task => task.done).length}/{sharedTasks.length}</span></div><p className="palau-card-intro">Everyone can see the plan. Only the assigned owner or organizer can check off a shared item.</p>{taskList(sharedTasks)}</section></div><p className="palau-bottom-note">These permissions are simulated in the browser. Real private data must wait for verified database authorization. Never enter passport numbers or sensitive records in this demo.</p>
        </>}
        {tab === 'journal' && <>
          <div className="palau-section-heading"><div><p className="palau-eyebrow">KEEP THE FEELING</p><h2>The things we’ll remember.</h2></div><span className="palau-note-tag">Sample day · 8 Mar 2030</span></div>
          <div className="palau-journal-grid"><section><div className="palau-journal-day"><span>08</span><div><strong>MARCH</strong><p>Island days · Palau local time</p></div></div><div className="palau-journal-entries">{journal.length === 0 ? <div className="palau-card palau-empty"><Icon name="journal" size={32} /><h3>A blank page, for now.</h3><p>Add a sample memory to try the journal.</p></div> : journal.slice().reverse().map(entry => <JournalEntryCard key={entry.id} entry={entry} timeZone={PILOT_TIME_ZONE} isOwn={entry.user_id === actor.id} onDelete={() => { if (entry.user_id === actor.id) { setJournal(journal.filter(item => item.id !== entry.id)); setMessage('Your sample memory was removed.'); } }} />)}</div></section><form className="palau-card palau-journal-form" onSubmit={addJournalEntry}><Icon name="journal" size={25} /><h3>A note from {actor.name}</h3><p>Try the existing VYBR journal with a fictional memory. Text only; no uploads or location access.</p><label htmlFor="palau-memory">A sample memory</label><textarea id="palau-memory" value={draft} onChange={event => setDraft(event.target.value)} maxLength={1000} rows={5} placeholder="That first glimpse of the water…" /><div className="palau-character-count">{draft.length}/1,000</div><button className="palau-primary" type="submit" disabled={!draft.trim()}>Add sample memory <Icon name="arrow" /></button><small>Session only. Refresh removes new entries. Each traveler can remove only their own memories.</small></form></div>
        </>}
        {tab === 'essentials' && <>
          <div className="palau-section-heading"><div><p className="palau-eyebrow">TAKE THE BASICS WITH YOU</p><h2>Less signal. Still a plan.</h2></div></div>
          <div className="palau-essentials-layout"><section className="palau-paper"><div className="palau-paper-top"><strong>VYBR</strong><span>SAMPLE TRIP NOTES / 001</span></div><p className="palau-eyebrow">PALAU · 7–19 MARCH 2030 · FICTIONAL</p><h3>Land. Sea. Together.</h3><p className="palau-paper-subtitle">Palau local time · UTC+9</p><ol><li><span>07–11 MAR</span><div><strong>Settle into Koror</strong><p>Four hotel nights and easy island days.</p></div></li><li><span>11–18 MAR</span><div><strong>A week on the water</strong><p>Seven sample boat nights. Confirm instructions with the operator.</p></div></li><li><span>18–19 MAR</span><div><strong>One last night on land</strong><p>Hotel, then onward travel. Transfer details to be confirmed.</p></div></li></ol><div className="palau-paper-stamp">FICTIONAL ITINERARY<br />NOT A BOOKING CONFIRMATION</div></section><aside><div className="palau-section-icon"><Icon name="download" size={28} /></div><h3>A useful backup.<br />Nothing private.</h3><p>Download a small text file or print the essentials. Both work without an account and contain only the sample trip outline and general preparation reminders.</p><ul className="palau-safe-list"><li><Icon name="check" size={17} /> Trip phases and sample dates</li><li><Icon name="check" size={17} /> General preparation reminders</li><li><Icon name="close" size={17} /> No traveler names or contact details</li><li><Icon name="close" size={17} /> No personal lists, journal or booking references</li></ul><button className="palau-primary" onClick={downloadEssentials}>Download sample essentials <Icon name="download" size={18} /></button><button className="palau-secondary" onClick={() => window.print()}>Print essentials</button><p className="palau-muted">Verify real travel requirements and all reservations independently. This demo is not travel advice or a confirmed itinerary.</p></aside></div>
        </>}
      </main>
      <footer className="palau-footer"><div><strong>VYBR</strong><span>Good trips start together.</span></div><p>Private-trip concept · sample data only<br />No information is saved to an account.</p></footer>
    </>}
    <section className="palau-print-only" aria-hidden="true"><pre>{buildEssentials()}</pre></section>
  </div>;
}
