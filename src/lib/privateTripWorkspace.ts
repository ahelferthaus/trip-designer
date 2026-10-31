import type { SupabaseClient, User } from '@supabase/supabase-js';
import { getPrivateMediaUrl, getPrivateTripAccess, isVerifiedPrivateUser } from './privateTripAccess.ts';
import type { PrivateTripAccess, PrivateTripRole, PrivateTripSummary } from './privateTripAccess.ts';

export type TransferStatus = 'needed' | 'coordinating' | 'confirmed' | 'not_needed';
export type ChecklistVisibility = 'personal' | 'shared';
export type PrivateRsvpResponse = 'going' | 'maybe' | 'not_going';
export type BookingStatus = 'suggested' | 'requested' | 'confirmed' | 'cancelled';

export interface PrivateMember {
  trip_id: string;
  user_id: string;
  display_name: string;
  role: PrivateTripRole;
}
export interface GroupArrival {
  trip_id: string;
  user_id: string;
  arrival_window: string;
  departure_window: string;
  handoff_note: string;
  transfer_status: TransferStatus;
}
export interface PrivateTravelDetail {
  trip_id: string;
  user_id: string;
  arrival_at: string | null;
  departure_at: string | null;
  flight_reference: string;
  lodging_reference: string;
  private_note: string;
  updated_at: string;
}
export interface PrivateChecklistItem {
  id: string;
  trip_id: string;
  owner_id: string;
  visibility: ChecklistVisibility;
  title: string;
  done: boolean;
}
export interface PrivateActivity {
  id: string;
  trip_id: string;
  title: string;
  starts_at: string;
  description: string;
  location: string;
  capacity: number | null;
  estimated_cost: number | null;
  cost_note: string;
  currency: 'USD';
  source_label: string;
  source_url: string | null;
  date_flexible: boolean;
  metadata: {
    priority?: string;
    why?: string;
    timing?: string;
    evidence?: string;
    caveat?: string;
    checked_at?: string;
    links?: Array<{ label: string; url: string }>;
  };
  booking_status: BookingStatus;
}
export interface PrivateRsvp {
  trip_id: string;
  activity_id: string;
  user_id: string;
  response: PrivateRsvpResponse;
  updated_at: string;
}
export interface PrivateJournalEntry {
  id: string;
  trip_id: string;
  user_id: string;
  body: string;
  media_path: string | null;
  recorded_at: string;
}
export interface PrivateTripWorkspace {
  trip: PrivateTripSummary;
  currentUserId: string;
  role: PrivateTripRole;
  members: PrivateMember[];
  groupArrivals: GroupArrival[];
  privateTravelDetails: PrivateTravelDetail[];
  checklist: PrivateChecklistItem[];
  activities: PrivateActivity[];
  rsvps: PrivateRsvp[];
  journal: PrivateJournalEntry[];
}

const workspaceSelects = {
  members: 'trip_id,user_id,display_name,role',
  arrivals: 'trip_id,user_id,arrival_window,departure_window,handoff_note,transfer_status',
  travel: 'trip_id,user_id,arrival_at,departure_at,flight_reference,lodging_reference,private_note,updated_at',
  checklist: 'id,trip_id,owner_id,visibility,title,done',
  activities: 'id,trip_id,title,starts_at,description,location,capacity,estimated_cost,cost_note,currency,source_label,source_url,date_flexible,metadata,booking_status',
  rsvps: 'trip_id,activity_id,user_id,response,updated_at',
  journal: 'id,trip_id,user_id,body,media_path,recorded_at',
} as const;

function unavailable(): Error {
  return new Error('The private trip workspace is unavailable. Recheck your session and membership.');
}

async function verifiedUser(client: SupabaseClient | null): Promise<User> {
  if (!client) throw unavailable();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user || !isVerifiedPrivateUser(user)) throw unavailable();
  return user;
}

export async function loadPrivateTripWorkspace(client: SupabaseClient | null, tripId: string): Promise<PrivateTripWorkspace> {
  const access: PrivateTripAccess = await getPrivateTripAccess(client, tripId);
  if (!client || access.status !== 'member') throw unavailable();
  const queries = await Promise.all([
    client.from('palau_members').select(workspaceSelects.members).eq('trip_id', tripId).is('revoked_at', null).order('display_name'),
    client.from('palau_arrivals').select(workspaceSelects.arrivals).eq('trip_id', tripId).order('user_id'),
    client.from('palau_travel_details').select(workspaceSelects.travel).eq('trip_id', tripId).order('user_id'),
    client.from('palau_checklist').select(workspaceSelects.checklist).eq('trip_id', tripId).order('visibility').order('title'),
    client.from('palau_activities').select(workspaceSelects.activities).eq('trip_id', tripId).order('starts_at'),
    client.from('palau_rsvps').select(workspaceSelects.rsvps).eq('trip_id', tripId).order('updated_at'),
    client.from('palau_journal').select(workspaceSelects.journal).eq('trip_id', tripId).order('recorded_at', { ascending: false }),
  ]);
  if (queries.some(result => result.error)) throw unavailable();
  // Discard results if sign-in, role or membership changed during the parallel fetch.
  const currentAccess = await getPrivateTripAccess(client, tripId);
  if (currentAccess.status !== 'member' || currentAccess.userId !== access.userId || currentAccess.role !== access.role) throw unavailable();
  const members = (queries[0].data ?? []) as PrivateMember[];
  const activeMemberIds = new Set(members.map(member => member.user_id));
  if (!activeMemberIds.has(access.userId)) throw unavailable();
  return {
    trip: currentAccess.trip,
    currentUserId: access.userId,
    role: access.role,
    members,
    groupArrivals: (queries[1].data ?? []) as GroupArrival[],
    privateTravelDetails: (queries[2].data ?? []) as PrivateTravelDetail[],
    checklist: (queries[3].data ?? []) as PrivateChecklistItem[],
    activities: (queries[4].data ?? []) as PrivateActivity[],
    rsvps: ((queries[5].data ?? []) as PrivateRsvp[]).filter(rsvp => activeMemberIds.has(rsvp.user_id)),
    journal: (queries[6].data ?? []) as PrivateJournalEntry[],
  };
}

export async function setPrivateChecklistDone(client: SupabaseClient | null, tripId: string, itemId: string, done: boolean): Promise<void> {
  await verifiedUser(client);
  const { data, error } = await client!.from('palau_checklist').update({ done }).eq('trip_id', tripId).eq('id', itemId).select('id');
  if (error || data?.length !== 1) throw unavailable();
}

export async function addPrivateChecklistItem(client: SupabaseClient | null, tripId: string, title: string, visibility: ChecklistVisibility, ownerId?: string): Promise<void> {
  const user = await verifiedUser(client);
  const cleanTitle = title.trim();
  if (!cleanTitle || cleanTitle.length > 240) throw new Error('Checklist items must be 1-240 characters.');
  const { error } = await client!.from('palau_checklist').insert({ trip_id: tripId, owner_id: ownerId ?? user.id, visibility, title: cleanTitle });
  if (error) throw unavailable();
}

export async function setPrivateRsvp(client: SupabaseClient | null, activityId: string, response: PrivateRsvpResponse): Promise<void> {
  await verifiedUser(client);
  const { error } = await client!.rpc('palau_set_rsvp', { p_activity: activityId, p_response: response });
  if (error) throw new Error(error.message.includes('full') ? 'That activity is full; choose Maybe or Not going.' : 'The RSVP could not be saved.');
}

export async function updatePrivateActivityStatus(client: SupabaseClient | null, tripId: string, activityId: string, bookingStatus: BookingStatus): Promise<void> {
  await verifiedUser(client);
  const { data, error } = await client!.from('palau_activities').update({ booking_status: bookingStatus }).eq('trip_id', tripId).eq('id', activityId).select('id');
  if (error || data?.length !== 1) throw unavailable();
}

export async function saveOwnGroupArrival(client: SupabaseClient | null, tripId: string, arrival: Omit<GroupArrival, 'trip_id' | 'user_id'>): Promise<void> {
  const user = await verifiedUser(client);
  await saveOwnRow(client!, 'palau_arrivals', tripId, user.id, arrival);
}

export async function saveOwnPrivateTravelDetails(client: SupabaseClient | null, tripId: string, details: Pick<PrivateTravelDetail, 'arrival_at' | 'departure_at' | 'flight_reference' | 'lodging_reference' | 'private_note'>): Promise<void> {
  const user = await verifiedUser(client);
  await saveOwnRow(client!, 'palau_travel_details', tripId, user.id, { ...details, updated_at: new Date().toISOString() });
}

/** Keep identity columns insert-only; PostgREST upsert also tries to UPDATE them. */
async function saveOwnRow(client: SupabaseClient, table: 'palau_arrivals' | 'palau_travel_details', tripId: string, userId: string, fields: object): Promise<void> {
  const inserted = await client.from(table).insert({ ...fields, trip_id: tripId, user_id: userId });
  if (!inserted.error) return;
  if (inserted.error.code !== '23505') throw unavailable();
  const updated = await client.from(table).update(fields).eq('trip_id', tripId).eq('user_id', userId).select('user_id');
  if (updated.error || updated.data?.length !== 1) throw unavailable();
}

const mediaTypes: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
async function uploadPrivateJournalMedia(client: SupabaseClient, tripId: string, userId: string, file: File): Promise<string> {
  const extension = mediaTypes[file.type];
  if (!extension || file.size <= 0 || file.size > 10 * 1024 * 1024) throw new Error('Use a JPEG, PNG, or WebP image up to 10 MB.');
  const path = `${tripId}/${userId}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage.from('palau-private').upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw new Error('The private image could not be uploaded.');
  return path;
}

export async function addPrivateJournalEntry(client: SupabaseClient | null, tripId: string, body: string, media?: File): Promise<void> {
  const user = await verifiedUser(client);
  const cleanBody = body.trim();
  if (!cleanBody || cleanBody.length > 4000) throw new Error('Journal entries must be 1-4,000 characters.');
  let mediaPath: string | null = null;
  let rejectedInsert = false;
  try {
    if (media) mediaPath = await uploadPrivateJournalMedia(client!, tripId, user.id, media);
    const { error } = await client!.from('palau_journal').insert({ trip_id: tripId, user_id: user.id, body: cleanBody, media_path: mediaPath });
    if (error) {
      // Only a definite PostgreSQL rejection proves no row committed. A network
      // failure may occur after commit; never delete that possibly linked image.
      rejectedInsert = /^(22|23|42)[A-Z0-9]{3}$/.test(error.code ?? '');
      throw unavailable();
    }
  } catch (error) {
    if (mediaPath) {
      if (!rejectedInsert) throw new Error('The save outcome could not be confirmed. The image was retained; refresh and check the journal before retrying.');
      const cleanup = await client!.storage.from('palau-private').remove([mediaPath]).catch(() => null);
      if (!cleanup || cleanup.error || !cleanup.data?.some(object => object.name === mediaPath)) throw new Error('The journal entry was not saved. Image cleanup could not be confirmed; ask the organizer to reconcile the upload.');
    }
    throw error;
  }
}

export async function deletePrivateJournalEntry(client: SupabaseClient | null, tripId: string, entryId: string, mediaPath: string | null): Promise<void> {
  await verifiedUser(client);
  // Keep the journal link in place until Storage authorizes/removes its attachment.
  // If cleanup fails, the entry remains visible and can be retried.
  if (mediaPath) {
    const { data: removed, error: mediaError } = await client!.storage.from('palau-private').remove([mediaPath]);
    let confirmed = !mediaError && Boolean(removed?.some(object => object.name === mediaPath));
    if (!mediaError && Array.isArray(removed) && removed.length === 0) {
      // The reviewed forward RPC checks current authority and exact linkage,
      // then reads Storage metadata with trusted visibility. RLS-filtered empty
      // listings are never evidence of absence. Missing RPC fails closed.
      try {
        const proof = await client!.rpc('palau_journal_media_absent', { p_trip: tripId, p_entry: entryId, p_path: mediaPath });
        confirmed = !proof.error && proof.data === true;
      } catch { confirmed = false; }
    }
    if (!confirmed) {
      throw new Error('The private image removal could not be confirmed. The journal entry was kept; ask the organizer to reconcile the attachment before retrying.');
    }
  }
  const deletion = client!.from('palau_journal').delete().eq('trip_id', tripId).eq('id', entryId);
  // Do not remove a row whose attachment changed during the Storage request.
  const { data, error } = await (mediaPath === null ? deletion.is('media_path', null) : deletion.eq('media_path', mediaPath)).select('id');
  if (error || data?.length !== 1) throw unavailable();
}

export async function getPrivateJournalMediaUrl(client: SupabaseClient | null, path: string): Promise<string> {
  await verifiedUser(client);
  return getPrivateMediaUrl(client, path);
}
