import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PrivateTripAccess } from '../lib/privateTripAccess';
import {
  addPrivateChecklistItem,
  addPrivateJournalEntry,
  deletePrivateJournalEntry,
  getPrivateJournalMediaUrl,
  loadPrivateTripWorkspace,
  saveOwnGroupArrival,
  saveOwnPrivateTravelDetails,
  setPrivateChecklistDone,
  setPrivateRsvp,
  updatePrivateActivityStatus,
} from '../lib/privateTripWorkspace';
import type { BookingStatus, GroupArrival, PrivateJournalEntry, PrivateTripWorkspace as WorkspaceData, TransferStatus } from '../lib/privateTripWorkspace';
import './private-trip-workspace.css';
import { palauDateTimeInput, palauDateTimeToIso, safeExternalUrl } from '../lib/privateTripPresentation';

interface Props {
  client: SupabaseClient;
  access: Extract<PrivateTripAccess, { status: 'member' }>;
}

function displayDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: 'Pacific/Palau', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function MediaImage({ client, entry }: { client: SupabaseClient; entry: PrivateJournalEntry }) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let alive = true;
    if (!entry.media_path) return;
    void getPrivateJournalMediaUrl(client, entry.media_path).then(value => { if (alive) setUrl(value); }).catch(() => undefined);
    return () => { alive = false; setUrl(''); };
  }, [client, entry.media_path]);
  return url ? <img className="private-media" src={url} alt="Private trip journal upload" referrerPolicy="no-referrer" /> : entry.media_path ? <p className="private-muted">Private image unavailable.</p> : null;
}

export default function PrivateTripWorkspace({ client, access }: Props) {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [journalBody, setJournalBody] = useState('');
  const [journalFile, setJournalFile] = useState<File | undefined>();
  const [groupForm, setGroupForm] = useState<Omit<GroupArrival, 'trip_id' | 'user_id'>>({ arrival_window: '', departure_window: '', handoff_note: '', transfer_status: 'needed' });
  const [travelForm, setTravelForm] = useState({ arrival_at: '', departure_at: '', flight_reference: '', lodging_reference: '', private_note: '' });

  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try { setWorkspace(await loadPrivateTripWorkspace(client, access.trip.id)); }
    catch (caught) { setWorkspace(null); setError(caught instanceof Error ? caught.message : 'Private workspace unavailable.'); }
    finally { setLoading(false); }
  }, [client, access.trip.id]);
  useEffect(() => { void refresh(); }, [refresh, access.userId]);

  const members = useMemo(() => new Map((workspace?.members ?? []).map(member => [member.user_id, member.display_name])), [workspace?.members]);
  useEffect(() => {
    if (!workspace) return;
    const group = workspace.groupArrivals.find(item => item.user_id === workspace.currentUserId);
    if (group) setGroupForm({ arrival_window: group.arrival_window, departure_window: group.departure_window, handoff_note: group.handoff_note, transfer_status: group.transfer_status });
    const detail = workspace.privateTravelDetails.find(item => item.user_id === workspace.currentUserId);
    if (detail) setTravelForm({ arrival_at: palauDateTimeInput(detail.arrival_at), departure_at: palauDateTimeInput(detail.departure_at), flight_reference: detail.flight_reference, lodging_reference: detail.lodging_reference, private_note: detail.private_note });
  }, [workspace]);

  const mutate = async (action: () => Promise<void>, success: string) => {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try { await action(); setNotice(success); await refresh(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'The change could not be saved.'); }
    finally { setBusy(false); }
  };

  if (loading) return <p role="status">Loading the private workspace…</p>;
  if (!workspace) return <p role="alert">{error || 'Private workspace unavailable.'}</p>;

  const myChecklist = workspace.checklist.filter(item => item.visibility === 'personal');
  const sharedChecklist = workspace.checklist.filter(item => item.visibility === 'shared');
  const canEditTask = (ownerId: string, visibility: string) => ownerId === workspace.currentUserId || (visibility === 'shared' && workspace.role === 'organizer');

  return <div className="private-workspace">
    <div className="private-workspace-banner"><strong>PRIVATE WORKSPACE</strong><span>Verified membership required. Data persists only when the isolated backend is enabled.</span></div>
    <header className="private-workspace-header">
      <div><p className="private-eyebrow">PALAU · {workspace.role}</p><h2>{workspace.trip.title}</h2><p>{workspace.trip.start_date} – {workspace.trip.end_date} · Pacific/Palau</p></div>
      <div className="private-role">Signed in as <strong>{members.get(workspace.currentUserId) ?? 'Trip member'}</strong></div>
    </header>
    {(notice || error) && <p className={error ? 'private-alert is-error' : 'private-alert'} role={error ? 'alert' : 'status'}>{error || notice}</p>}

    <section className="private-section" aria-labelledby="itinerary-heading">
      <div className="private-section-heading"><div><p className="private-eyebrow">GROUP PLAN</p><h3 id="itinerary-heading">Palau timeline</h3></div><span>Operator-confirmed and awaiting-reconfirmation items are labelled separately.</span></div>
      <div className="private-activity-grid">
        {(workspace.trip.coordination?.timeline ?? []).map(item => <article className="private-card" key={`${item.date}-${item.title}`}>
          <div className="private-activity-top"><span>{item.date}</span><span>{item.status}</span></div>
          <h4>{item.title}</h4>
          {(item.time || item.location) && <p>{[item.time, item.location].filter(Boolean).join(' · ')}</p>}
          {item.details?.map(detail => <p key={detail}>{detail}</p>)}
          {item.source_label && <small>{item.source_label}</small>}
        </article>)}
      </div>
      {workspace.trip.coordination?.public_contacts?.length ? <div className="private-source-links private-contacts">
        {workspace.trip.coordination.public_contacts.map(contact => <a key={contact.name} href={safeExternalUrl(contact.url)} target="_blank" rel="noreferrer noopener">{contact.name}{contact.purpose ? ` · ${contact.purpose}` : ''}</a>)}
      </div> : null}
      {workspace.trip.coordination?.warnings?.length ? <ul className="private-warnings">{workspace.trip.coordination.warnings.map(warning => <li key={warning}>{warning}</li>)}</ul> : null}
    </section>

    <section className="private-section" aria-labelledby="group-logistics-heading">
      <div className="private-section-heading"><div><p className="private-eyebrow">GROUP VISIBLE</p><h3 id="group-logistics-heading">Arrival windows & handoffs</h3></div><span>Keep exact references in the restricted section.</span></div>
      <div className="private-grid">
        <div className="private-list">{workspace.groupArrivals.length ? workspace.groupArrivals.map(item => <article className="private-card" key={item.user_id}><strong>{members.get(item.user_id) ?? 'Trip member'}</strong><p>{item.arrival_window || 'Arrival window pending'} · {item.departure_window || 'Departure pending'}</p><p>{item.handoff_note || 'No handoff note yet.'}</p><span className="private-status">{item.transfer_status.replace('_', ' ')}</span></article>) : <p className="private-muted">No group arrival windows have been shared.</p>}</div>
        <form className="private-form" onSubmit={event => { event.preventDefault(); void mutate(() => saveOwnGroupArrival(client, workspace.trip.id, groupForm), 'Your group-visible logistics were saved.'); }}>
          <h4>Your group-visible update</h4>
          <label>Arrival window<input value={groupForm.arrival_window} maxLength={120} onChange={event => setGroupForm({ ...groupForm, arrival_window: event.target.value })} placeholder="Arrival day · afternoon" /></label>
          <label>Departure window<input value={groupForm.departure_window} maxLength={120} onChange={event => setGroupForm({ ...groupForm, departure_window: event.target.value })} placeholder="Departure day · morning" /></label>
          <label>Handoff note<textarea value={groupForm.handoff_note} maxLength={500} onChange={event => setGroupForm({ ...groupForm, handoff_note: event.target.value })} placeholder="Pickup coordination only—no booking codes." /></label>
          <label>Transfer status<select value={groupForm.transfer_status} onChange={event => setGroupForm({ ...groupForm, transfer_status: event.target.value as TransferStatus })}><option value="needed">Needed</option><option value="coordinating">Coordinating</option><option value="confirmed">Confirmed</option><option value="not_needed">Not needed</option></select></label>
          <button disabled={busy}>Save group logistics</button>
        </form>
      </div>
    </section>

    <section className="private-section" aria-labelledby="travel-details-heading">
      <div className="private-section-heading"><div><p className="private-eyebrow">RESTRICTED</p><h3 id="travel-details-heading">Private travel details</h3></div><span>Visible only to you and the organizer. Never enter passport, medical, payment, or access-code data.</span></div>
      <div className="private-grid">
        <form className="private-form" onSubmit={event => { event.preventDefault(); void mutate(() => saveOwnPrivateTravelDetails(client, workspace.trip.id, { ...travelForm, arrival_at: palauDateTimeToIso(travelForm.arrival_at), departure_at: palauDateTimeToIso(travelForm.departure_at) }), 'Your restricted travel details were saved.'); }}>
          <h4>Your restricted details</h4>
          <label>Arrival time (Palau local)<input type="datetime-local" value={travelForm.arrival_at} onChange={event => setTravelForm({ ...travelForm, arrival_at: event.target.value })} /></label>
          <label>Departure time (Palau local)<input type="datetime-local" value={travelForm.departure_at} onChange={event => setTravelForm({ ...travelForm, departure_at: event.target.value })} /></label>
          <label>Flight reference<input value={travelForm.flight_reference} maxLength={160} onChange={event => setTravelForm({ ...travelForm, flight_reference: event.target.value })} placeholder="Airline / flight number only" /></label>
          <label>Lodging reference<input value={travelForm.lodging_reference} maxLength={240} onChange={event => setTravelForm({ ...travelForm, lodging_reference: event.target.value })} placeholder="Property and dates—no door or booking codes" /></label>
          <label>Organizer note<textarea value={travelForm.private_note} maxLength={1000} onChange={event => setTravelForm({ ...travelForm, private_note: event.target.value })} /></label>
          <button disabled={busy}>Save restricted details</button>
        </form>
        {workspace.role === 'organizer' ? <div className="private-list"><h4>Organizer view</h4>{workspace.privateTravelDetails.map(detail => <article className="private-card" key={detail.user_id}><strong>{members.get(detail.user_id) ?? 'Trip member'}</strong><p>{detail.arrival_at ? displayDate(detail.arrival_at) : 'Arrival pending'} → {detail.departure_at ? displayDate(detail.departure_at) : 'Departure pending'}</p><p>{detail.flight_reference || 'No flight reference'} · {detail.lodging_reference || 'No lodging reference'}</p>{detail.private_note && <p>{detail.private_note}</p>}</article>)}</div> : <div className="private-card"><h4>Privacy boundary</h4><p>You cannot fetch another traveler’s restricted details. The organizer can review them for coordination; other members only see the group-visible arrival windows above.</p></div>}
      </div>
    </section>

    <section className="private-section" aria-labelledby="activities-heading">
      <div className="private-section-heading"><div><p className="private-eyebrow">INTEREST, NOT PAYMENT</p><h3 id="activities-heading">Activities</h3></div><span>Confirmed means group plan status—not a payment or supplier guarantee.</span></div>
      <div className="private-activity-grid">{workspace.activities.map(activity => {
        const responses = workspace.rsvps.filter(item => item.activity_id === activity.id);
        const mine = responses.find(item => item.user_id === workspace.currentUserId)?.response;
        const going = responses.filter(item => item.response === 'going').length;
        return <article className="private-card private-activity" key={activity.id}>
          <div className="private-activity-top"><span>{activity.booking_status}</span><span>{activity.metadata?.priority ?? (activity.date_flexible ? 'Flexible date' : '')}</span></div>
          <h4>{activity.title}</h4><p>{activity.metadata?.timing ?? displayDate(activity.starts_at)}{activity.location ? ` · ${activity.location}` : ''}</p>{activity.metadata?.why && <p><strong>Why it made the shortlist:</strong> {activity.metadata.why}</p>}<p>{activity.description}</p>
          <p><strong>{going}{activity.capacity ? `/${activity.capacity}` : ''}</strong> going · {activity.estimated_cost == null ? 'Cost pending' : `$${activity.estimated_cost} ${activity.currency}`}</p>{activity.cost_note && <p className="private-muted">{activity.cost_note}</p>}
          {activity.metadata?.caveat && <p className="private-muted">{activity.metadata.caveat}</p>}
          <div className="private-source-links">{activity.source_url && <a href={safeExternalUrl(activity.source_url)} target="_blank" rel="noreferrer noopener">Source: {activity.source_label || 'activity information'}</a>}{activity.metadata?.links?.slice(0, 3).map(link => <a key={link.url} href={safeExternalUrl(link.url)} target="_blank" rel="noreferrer noopener">{link.label}</a>)}</div>
          {activity.metadata?.checked_at && <small>Sources checked {activity.metadata.checked_at}</small>}
          <div className="private-rsvp" aria-label={`Your response for ${activity.title}`}>{(['going', 'maybe', 'not_going'] as const).map(response => <button key={response} type="button" aria-pressed={mine === response} disabled={busy || (response === 'going' && activity.capacity != null && going >= activity.capacity && mine !== 'going')} onClick={() => void mutate(() => setPrivateRsvp(client, activity.id, response), 'Your interest was saved.')}>{response.replace('_', ' ')}</button>)}</div>
          {workspace.role === 'organizer' && <label className="private-inline">Plan status<select value={activity.booking_status} disabled={busy} onChange={event => void mutate(() => updatePrivateActivityStatus(client, workspace.trip.id, activity.id, event.target.value as BookingStatus), 'The group plan status was saved.')}><option value="suggested">Suggested</option><option value="requested">Requested</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option></select></label>}
        </article>;
      })}</div>
    </section>

    <section className="private-section" aria-labelledby="checklist-heading">
      <div className="private-section-heading"><div><p className="private-eyebrow">OWNER CONTROLLED</p><h3 id="checklist-heading">Checklists</h3></div><span>Personal tasks stay owner-only; shared tasks retain an assigned owner.</span></div>
      <div className="private-grid"><div><h4>Your visible tasks</h4><ul className="private-checklist">{myChecklist.map(item => <li key={item.id}><label><input type="checkbox" checked={item.done} disabled={busy || !canEditTask(item.owner_id, item.visibility)} onChange={event => void mutate(() => setPrivateChecklistDone(client, workspace.trip.id, item.id, event.target.checked), 'Checklist saved.')} /> {item.title}</label><span>{item.visibility} · {members.get(item.owner_id) ?? 'Trip member'}</span></li>)}</ul></div><div><h4>Shared list</h4><ul className="private-checklist">{sharedChecklist.map(item => <li key={item.id}><label><input type="checkbox" checked={item.done} disabled={busy || !canEditTask(item.owner_id, item.visibility)} onChange={event => void mutate(() => setPrivateChecklistDone(client, workspace.trip.id, item.id, event.target.checked), 'Checklist saved.')} /> {item.title}</label><span>{members.get(item.owner_id) ?? 'Trip member'}</span></li>)}</ul><form className="private-inline-form" onSubmit={event => { event.preventDefault(); void mutate(async () => { await addPrivateChecklistItem(client, workspace.trip.id, taskTitle, workspace.role === 'organizer' ? 'shared' : 'personal'); setTaskTitle(''); }, 'Checklist item added.'); }}><input aria-label="New checklist item" value={taskTitle} maxLength={240} onChange={event => setTaskTitle(event.target.value)} /><button disabled={busy || !taskTitle.trim()}>Add {workspace.role === 'organizer' ? 'shared' : 'personal'} item</button></form></div></div>
    </section>

    <section className="private-section" aria-labelledby="journal-heading">
      <div className="private-section-heading"><div><p className="private-eyebrow">PRIVATE GROUP JOURNAL</p><h3 id="journal-heading">Journal</h3></div><span>Members read the group journal; authors own entries and media. Organizers may moderate entries.</span></div>
      <div className="private-grid"><div className="private-list">{workspace.journal.map(entry => <article className="private-card" key={entry.id}><div className="private-entry-top"><strong>{members.get(entry.user_id) ?? 'Trip member'}</strong><time>{displayDate(entry.recorded_at)}</time></div><p>{entry.body}</p><MediaImage client={client} entry={entry} />{(entry.user_id === workspace.currentUserId || workspace.role === 'organizer') && <button className="private-danger" disabled={busy} onClick={() => void mutate(() => deletePrivateJournalEntry(client, workspace.trip.id, entry.id, entry.media_path), 'Journal entry removed.')}>Delete entry</button>}</article>)}</div><form className="private-form" onSubmit={event => { event.preventDefault(); void mutate(async () => { await addPrivateJournalEntry(client, workspace.trip.id, journalBody, journalFile); setJournalBody(''); setJournalFile(undefined); }, 'Journal entry saved.'); }}><h4>Add a journal entry</h4><label>Memory<textarea value={journalBody} maxLength={4000} onChange={event => setJournalBody(event.target.value)} /></label><label>Optional private image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={event => setJournalFile(event.target.files?.[0])} /></label><small>JPEG, PNG or WebP up to 10 MB. No GPS is collected. Short-lived signed URLs are used for viewing.</small><button disabled={busy || !journalBody.trim()}>Save entry</button></form></div>
    </section>
  </div>;
}
