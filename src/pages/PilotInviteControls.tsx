import { useEffect, useRef, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createPilotInvitation } from '../lib/pilotRelease';
import InvitationLinkCard from './InvitationLinkCard';

export default function PilotInviteControls({ client, tripId }: { client: SupabaseClient; tripId: string }) {
  const [email, setEmail] = useState('');
  const [invitation, setInvitation] = useState<{ recipient: string; link: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [invitationVersion, setInvitationVersion] = useState(0);
  const [message, setMessage] = useState('');
  const pending = useRef(false);
  const createButton = useRef<HTMLButtonElement>(null);
  const generation = useRef(0);
  useEffect(() => () => { generation.current++; }, []);
  const create = async (event: React.FormEvent) => {
    event.preventDefault(); if (pending.current) return;
    const request = generation.current;
    pending.current = true; setBusy(true); setInvitation(null); setMessage('');
    try {
      const result = await createPilotInvitation(client, tripId, email, window.location.origin);
      if (request === generation.current) { setInvitationVersion(value => value + 1); setInvitation(result); setMessage('Link created. Send it privately to the named recipient.'); }
    } catch { if (request === generation.current) setMessage('Invitation unavailable. Check organizer access and the email, then try again.'); }
    finally { if (request === generation.current) { pending.current = false; setBusy(false); } }
  };
  return <section className="private-section" aria-labelledby="invite-heading">
    <h3 id="invite-heading">Invite a traveler</h3>
    <p>Each link is for one email address, can be accepted once, and expires after seven days. Creating a link sends no email.</p>
    <form className="private-form" onSubmit={create}><label>Recipient email<input type="email" required maxLength={254} value={email} disabled={busy} onChange={event => { setEmail(event.target.value); setInvitation(null); }} /></label><button ref={createButton} disabled={busy}>{busy ? 'Creating link…' : 'Create private invitation link'}</button></form>
    {invitation && <InvitationLinkCard key={invitationVersion} recipient={invitation.recipient} link={invitation.link} onHide={() => { setInvitation(null); setMessage('Link hidden. The invitation remains valid until accepted, revoked or expired.'); createButton.current?.focus(); }} />}
    <p role="status">{message}</p>
  </section>;
}
