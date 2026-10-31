export type PlanStatus = 'confirmed' | 'tentative' | 'not_provided';
export interface SharedTime { at: string | null; zone: string; status: PlanStatus }
export interface SharedRoom {
  kind: 'land' | 'boat'; label: string; start: string; end: string;
  sharing: 'solo' | 'shared' | 'unassigned'; roommates: string[]; status: PlanStatus;
}
export interface OperationalTraveler {
  tripId: string; id: string; name: string; visibility: 'group' | 'private';
  arrival?: SharedTime; departure?: SharedTime;
  transfer?: { label: string; status: PlanStatus };
  rooms: SharedRoom[];
  activities: { label: string; response: 'going' | 'maybe' | 'not_going' | 'not_provided' }[];
}
export interface GroupOverviewData {
  tripId: string; title: string; zone: string; start: string; end: string;
  phases: { label: string; kind: 'land' | 'boat' | 'activity'; start: string; end: string; status: PlanStatus }[];
  travelers: OperationalTraveler[];
}
export function validOperationalInstant(value: string | null | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return false;
  const date=value.slice(0,10); const d=new Date(`${date}T00:00:00Z`);
  return Number.isFinite(Date.parse(value)) && Number.isFinite(d.getTime()) && d.toISOString().slice(0,10)===date;
}
export function operationalTime(value?: SharedTime): string {
  if (!value || value.status==='not_provided' || !validOperationalInstant(value.at)) return 'Not provided';
  try { return new Intl.DateTimeFormat('en-US',{timeZone:value.zone,month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(value.at)); }
  catch { return 'Time zone needs confirmation'; }
}
export function visibleOperationalTravelers(data: GroupOverviewData): OperationalTraveler[] {
  const seen=new Set<string>();
  // Defense in depth only. The server must authorize and project shared operational fields.
  return data.travelers.filter(t=>t.tripId===data.tripId && t.visibility==='group' && !seen.has(t.id) && !!seen.add(t.id));
}
export function timelineRange(start:string,end:string,from?:string|null,to?:string|null) {
  if (![start,end,from,to].every(validOperationalInstant)) return null;
  const a=Date.parse(start),b=Date.parse(end),c=Date.parse(from!),d=Date.parse(to!);
  if(b<=a || d<=c || d<=a || c>=b) return null;
  return {left:100*(Math.max(a,c)-a)/(b-a),width:100*(Math.min(b,d)-Math.max(a,c))/(b-a),clipped:c<a||d>b};
}
export function landNights(room:SharedRoom): string {
  if(room.kind!=='land' || !/^\d{4}-\d{2}-\d{2}$/.test(room.start) || !/^\d{4}-\d{2}-\d{2}$/.test(room.end)) return '';
  const a=`${room.start}T00:00:00Z`,b=`${room.end}T00:00:00Z`;
  if(!validOperationalInstant(a)||!validOperationalInstant(b)) return '';
  const days=(Date.parse(b)-Date.parse(a))/86400000;
  return days>0 ? `${days} ${days===1?'night':'nights'}` : '';
}
