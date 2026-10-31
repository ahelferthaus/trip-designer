/** Inputs must come from a membership-authorized shared projection, never GPS/EXIF inference. */
export interface SharedMapStop {
  id: string;
  tripId: string;
  label: string;
  shared: boolean;
  coordinates?: { latitude: number; longitude: number } | null;
}
export function validCoordinates(value: SharedMapStop['coordinates']): value is NonNullable<SharedMapStop['coordinates']> {
  return !!value && typeof value.latitude === 'number' && Number.isFinite(value.latitude) && Math.abs(value.latitude) <= 90 &&
    typeof value.longitude === 'number' && Number.isFinite(value.longitude) && Math.abs(value.longitude) <= 180;
}
export function normalizeLongitude(value: number): number { return ((value + 180) % 360 + 360) % 360 - 180; }

/** Equirectangular coordinate plot, not a basemap, road route or distance calculation. */
export function buildStopMap(tripId: string, stops: SharedMapStop[]) {
  const seen = new Set<string>();
  const shared = stops.filter(stop => {
    if (stop.tripId !== tripId || stop.shared !== true || !stop.id || seen.has(stop.id)) return false;
    seen.add(stop.id); return true;
  });
  const located = shared.filter(stop => validCoordinates(stop.coordinates));
  // Choose the shortest longitude interval, including trips across the dateline.
  const longs = located.map(stop => (stop.coordinates!.longitude + 360) % 360).sort((a,b) => a-b);
  let origin = longs[0] ?? 0; let largestGap = -1;
  for (let i=0;i<longs.length;i++) {
    const next = longs[(i+1)%longs.length] + (i===longs.length-1 ? 360 : 0);
    if (next-longs[i] > largestGap) { largestGap=next-longs[i]; origin=next%360; }
  }
  const unwrap = (lng:number) => ((lng+360)%360-origin+360)%360+origin;
  const xs = located.map(stop=>unwrap(stop.coordinates!.longitude));
  const ys = located.map(stop=>stop.coordinates!.latitude);
  const west=xs.length ? Math.min(...xs)-0.5 : -180;
  const east=xs.length ? Math.max(...xs)+0.5 : 180;
  const south=ys.length ? Math.max(-90,Math.min(...ys)-0.5) : -90;
  const north=ys.length ? Math.min(90,Math.max(...ys)+0.5) : 90;
  // One uniform scale in angular degrees; no independent-axis stretching.
  const scale=Math.min(640/(east-west),280/(north-south));
  const centerX=(west+east)/2; const centerY=(north+south)/2;
  const points=shared.map((stop,index)=>({
    id:stop.id, label:stop.label, number:index+1,
    coordinate:validCoordinates(stop.coordinates) ? {latitude:stop.coordinates.latitude,longitude:stop.coordinates.longitude} : null,
    x:validCoordinates(stop.coordinates) ? 360+(unwrap(stop.coordinates.longitude)-centerX)*scale : null,
    y:validCoordinates(stop.coordinates) ? 180-(stop.coordinates.latitude-centerY)*scale : null,
  }));
  // Never bridge a missing coordinate: it would imply a known route through an unknown stop.
  const segments=points.slice(1).flatMap((point,i)=> {
    const previous=points[i];
    if (shared.length !== stops.length || previous.x === null || point.x === null) return [];
    const delta = Math.abs(unwrap(previous.coordinate!.longitude)-unwrap(point.coordinate!.longitude));
    // Do not imply a path across the projection cut, or hide an excluded stop by joining its neighbors.
    if (delta >= 180 || (previous.x === point.x && previous.y === point.y)) return [];
    return [{from:previous,to:point}];
  });
  return {points,segments,locatedCount:located.length,bounds:{west,east,south,north}};
}
