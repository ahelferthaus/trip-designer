/** Sample-only pilot domain. These checks model UX; database RLS is the real authorization boundary. */
export type PilotRole = 'organizer' | 'member' | 'nonmember' | 'logged-out';
export type Rsvp = 'going' | 'maybe' | 'not-going';
export type PilotTab = 'home' | 'plan' | 'checklist' | 'journal' | 'essentials';
export interface PilotTraveler { id: string; name: string; initials: string; role: PilotRole }
export interface PilotTask { id: string; title: string; detail: string; ownerId: string; scope: 'personal' | 'shared'; done: boolean; due: string }
export interface PilotActivity { id: string; title: string; detail: string; date: string; time: string; category: string; status: 'proposed' | 'confirmed'; capacity: number; cost: number; responses: Record<string, Rsvp> }
export interface Coordination { id: string; label: string; detail: string; time: string; ownerId: string; status: 'ready' | 'pending' }

export const PILOT_TIME_ZONE = 'Pacific/Palau';
/** Clearly fictional sample window: 7–19 March 2030, Palau local time. */
export const PILOT_SAMPLE_YEAR = 2030;
export const PILOT_SAMPLE_MONTH_LABEL = 'March';
/** The pilot group is exactly eight people in total: one organizer plus seven travelers. */
export const PILOT_EXPECTED_GROUP_SIZE = 8;
/** First four entries keep their historical order (A, B, C, Organizer); tests destructure them. */
export const PILOT_TRAVELERS: PilotTraveler[] = [
  { id: 'traveler-a', name: 'Traveler A', initials: 'A', role: 'member' },
  { id: 'traveler-b', name: 'Traveler B', initials: 'B', role: 'member' },
  { id: 'traveler-c', name: 'Traveler C', initials: 'C', role: 'member' },
  { id: 'organizer', name: 'Organizer', initials: 'O', role: 'organizer' },
  { id: 'traveler-d', name: 'Traveler D', initials: 'D', role: 'member' },
  { id: 'traveler-e', name: 'Traveler E', initials: 'E', role: 'member' },
  { id: 'traveler-f', name: 'Traveler F', initials: 'F', role: 'member' },
  { id: 'traveler-g', name: 'Traveler G', initials: 'G', role: 'member' },
];
export const PILOT_ACCESS_PREVIEWS: PilotTraveler[] = [
  { id: 'nonmember', name: 'Nonmember preview', initials: '–', role: 'nonmember' },
  { id: 'logged-out', name: 'Logged-out preview', initials: '–', role: 'logged-out' },
];
export const INITIAL_TASKS: PilotTask[] = [
  { id: 'a1', title: 'Check passport validity', detail: 'Use official travel guidance for your nationality.', ownerId: 'traveler-a', scope: 'personal', done: true, due: 'Before departure' },
  { id: 'a2', title: 'Pack reef-friendly essentials', detail: 'Reusable bottle, sun protection, dry bag.', ownerId: 'traveler-a', scope: 'personal', done: false, due: 'Before departure' },
  { id: 'a3', title: 'Save offline travel documents', detail: 'Keep your documents in your own secure storage, not here.', ownerId: 'traveler-a', scope: 'personal', done: false, due: 'Before departure' },
  { id: 'b1', title: 'Pack reef-friendly essentials', detail: 'Reusable bottle, sun protection, dry bag.', ownerId: 'traveler-b', scope: 'personal', done: false, due: 'Before departure' },
  { id: 'b2', title: 'Pack your boat-week dry bag', detail: 'Your own list: chargers, a spare swimsuit, a small torch.', ownerId: 'traveler-b', scope: 'personal', done: false, due: 'By 10 Mar' },
  { id: 'c1', title: 'Check passport validity', detail: 'Use official travel guidance for your nationality.', ownerId: 'traveler-c', scope: 'personal', done: false, due: 'Before departure' },
  { id: 'c2', title: 'Set an out-of-office reply', detail: 'Expect little signal on the water from 11 Mar.', ownerId: 'traveler-c', scope: 'personal', done: true, due: 'By 6 Mar' },
  { id: 'o1', title: 'Save offline travel documents', detail: 'Keep personal records outside the group space.', ownerId: 'organizer', scope: 'personal', done: false, due: 'Before departure' },
  { id: 'o2', title: 'Print the group essentials for the boat', detail: 'One paper copy of the sample outline; no one else’s private details.', ownerId: 'organizer', scope: 'personal', done: false, due: 'By 10 Mar' },
  { id: 'd1', title: 'Arrange your own airport transfer', detail: 'Wave three arrives separately. Share only your arrival window with the group.', ownerId: 'traveler-d', scope: 'personal', done: false, due: 'By 5 Mar' },
  { id: 'd2', title: 'Confirm your travel insurance privately', detail: 'Keep the policy details in your own records, not in the group space.', ownerId: 'traveler-d', scope: 'personal', done: true, due: 'Before departure' },
  { id: 'e1', title: 'Download offline maps of Koror', detail: 'Hotel days only; the boat week follows operator guidance.', ownerId: 'traveler-e', scope: 'personal', done: false, due: 'Before departure' },
  { id: 'e2', title: 'Tell your bank about the travel dates', detail: 'Avoid blocked cards on arrival. Do this directly with your bank.', ownerId: 'traveler-e', scope: 'personal', done: false, due: 'By 4 Mar' },
  { id: 'f1', title: 'Charge camera batteries and spare cards', detail: 'There is no charging plan on the water yet.', ownerId: 'traveler-f', scope: 'personal', done: false, due: 'By 10 Mar' },
  { id: 'f2', title: 'Pack reef-safe sun protection', detail: 'Mineral sunscreen, a hat and a long-sleeve rash guard.', ownerId: 'traveler-f', scope: 'personal', done: true, due: 'Before departure' },
  { id: 'g1', title: 'Arrange a house sitter for the trip dates', detail: 'Personal errand; nothing the group needs to see.', ownerId: 'traveler-g', scope: 'personal', done: false, due: 'By 3 Mar' },
  { id: 'g2', title: 'Pack motion-sickness remedies you trust', detail: 'Your own choice for the boat week. Keep anything personal off the shared list.', ownerId: 'traveler-g', scope: 'personal', done: false, due: 'Before departure' },
  { id: 's1', title: 'Confirm airport pickup window', detail: 'Match the sample arrival waves with the transfer plan.', ownerId: 'organizer', scope: 'shared', done: false, due: 'By 5 Mar' },
  { id: 's2', title: 'Check boat meeting point', detail: 'Add operator-confirmed instructions before anyone travels.', ownerId: 'traveler-b', scope: 'shared', done: false, due: 'By 9 Mar' },
  { id: 's3', title: 'Coordinate the first group dinner', detail: 'Gather preferences; no reservation has been made.', ownerId: 'traveler-a', scope: 'shared', done: true, due: 'By 7 Mar' },
  { id: 's4', title: 'Confirm the final hotel night', detail: 'Check the sample 18–19 Mar stay and onward transfer.', ownerId: 'traveler-c', scope: 'shared', done: false, due: 'By 10 Mar' },
];
export const INITIAL_ACTIVITIES: PilotActivity[] = [
  // Capacity is activity-specific coordination, not group size. A four-seat table stays four seats
  // even though the sample group has eight people; the remaining travelers choose Maybe or Not going.
  { id: 'rock-islands', title: 'Rock Islands by kayak', detail: 'A slow morning on the water. Route and operator still to be agreed.', date: '9 Mar', time: '09:00–13:00', category: 'On the water', status: 'proposed', capacity: 3, cost: 85, responses: { 'traveler-a': 'maybe', 'traveler-b': 'going', 'traveler-c': 'going', 'traveler-d': 'maybe', 'traveler-e': 'not-going' } },
  { id: 'sunset', title: 'A table at sunset', detail: 'A four-seat sample table before the boat days. Sample group plan confirmed; no restaurant booked. Others can join a second table later.', date: '10 Mar', time: '18:00–20:00', category: 'Around the table', status: 'confirmed', capacity: 4, cost: 35, responses: { 'traveler-a': 'going', 'traveler-b': 'going', 'traveler-c': 'maybe', organizer: 'going', 'traveler-f': 'maybe', 'traveler-g': 'not-going' } },
  { id: 'snorkel', title: 'Small-group reef morning', detail: 'Example of a full activity. Choose Maybe to keep it on your radar; this is not a waitlist.', date: '8 Mar', time: '08:30–12:00', category: 'Below the surface', status: 'proposed', capacity: 2, cost: 70, responses: { 'traveler-b': 'going', 'traveler-c': 'going', 'traveler-a': 'not-going', 'traveler-d': 'maybe' } },
];
export const COORDINATION: Coordination[] = [
  { id: 'arrival-a', label: 'Arrival wave one', detail: 'Traveler A + Traveler B · airport → hotel', time: '7 Mar · afternoon', ownerId: 'traveler-a', status: 'ready' },
  { id: 'arrival-b', label: 'Arrival wave two', detail: 'Traveler C + Organizer · pickup window needed', time: '7 Mar · evening', ownerId: 'organizer', status: 'pending' },
  { id: 'arrival-c', label: 'Arrival wave three', detail: 'Travelers D, E, F + G · self-arranged transfers, windows to share', time: '7 Mar · late evening', ownerId: 'traveler-d', status: 'pending' },
  { id: 'hotel', label: 'Hotel base in Koror', detail: '7–11 Mar · 4 nights before the boat', time: 'Check-in · 7 Mar', ownerId: 'organizer', status: 'pending' },
  { id: 'boat', label: 'Hotel → boat meeting point', detail: 'Shared transfer · operator instructions needed', time: '11 Mar · time TBD', ownerId: 'traveler-b', status: 'pending' },
  { id: 'return', label: 'Back on land', detail: '18–19 Mar · 1 hotel night, then airport transfer', time: 'Departure · 19 Mar', ownerId: 'traveler-c', status: 'pending' },
];
export function canViewPilot(actor: PilotTraveler): boolean { return actor.role === 'member' || actor.role === 'organizer'; }
export function canEditTask(actor: PilotTraveler, task: PilotTask): boolean {
  if (!canViewPilot(actor)) return false;
  if (task.scope === 'personal') return task.ownerId === actor.id;
  return task.ownerId === actor.id || actor.role === 'organizer';
}
export function visibleTasks(actor: PilotTraveler, tasks: PilotTask[]): PilotTask[] {
  if (!canViewPilot(actor)) return [];
  return tasks.filter(task => task.scope === 'shared' || task.ownerId === actor.id);
}
export function toggleTask(actor: PilotTraveler, tasks: PilotTask[], taskId: string): PilotTask[] {
  return tasks.map(task => task.id === taskId && canEditTask(actor, task) ? { ...task, done: !task.done } : task);
}
export function goingCount(activity: PilotActivity): number { return Object.values(activity.responses).filter(response => response === 'going').length; }
export function updateRsvp(actor: PilotTraveler, activities: PilotActivity[], activityId: string, response: Rsvp): { activities: PilotActivity[]; error: string | null } {
  const activity = activities.find(item => item.id === activityId);
  if (!canViewPilot(actor) || !activity) return { activities, error: 'Only sample trip members can respond.' };
  if (response === 'going' && activity.responses[actor.id] !== 'going' && goingCount(activity) >= activity.capacity) {
    return { activities, error: 'This activity is full. You can choose Maybe or Not going.' };
  }
  return { activities: activities.map(item => item.id === activityId ? { ...item, responses: { ...item.responses, [actor.id]: response } } : item), error: null };
}
export function updateActivityStatus(actor: PilotTraveler, activities: PilotActivity[], activityId: string): PilotActivity[] {
  if (actor.role !== 'organizer') return activities;
  return activities.map(activity => activity.id === activityId ? { ...activity, status: activity.status === 'proposed' ? 'confirmed' : 'proposed' } : activity);
}
export function buildEssentials(): string {
  return [
    'VYBR / PALAU — SAMPLE ESSENTIALS',
    'Demo only. Fictional itinerary; not a booking or travel confirmation.',
    'All dates: March 2030 (fictional). All times: Palau local (UTC+9 / Pacific/Palau).',
    '',
    '7 MAR: Arrive in Palau. Transfer to a hotel base in Koror.',
    '7–11 MAR: Hotel days — four nights. Optional activities are proposals.',
    '11 MAR: Transfer to the boat. Meeting point and time to be confirmed.',
    '11–18 MAR: Boat days — seven nights. Follow confirmed operator instructions.',
    '18 MAR: Return to Koror. Final hotel night.',
    '19 MAR: Onward travel. Reconfirm airport transfer and flight independently.',
    '',
    'BEFORE YOU GO',
    'Verify entry requirements and passport validity with official sources.',
    'Confirm hotel, operator, pickup points and times directly.',
    'Keep tickets, passports and personal contacts in your own secure storage.',
    'Pack sun protection, a refillable bottle and a dry bag.',
    '',
    'NO SENSITIVE DATA INCLUDED',
    'This download intentionally excludes names, room numbers, flight references,',
    'contact details, personal checklists and journal entries.',
    'Attendance is interest only. It does not reserve a place or take payment.',
  ].join('\n');
}
