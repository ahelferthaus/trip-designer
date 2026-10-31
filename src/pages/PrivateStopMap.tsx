import { useId } from 'react';
import { buildStopMap, normalizeLongitude } from '../lib/privateStopMap';
import type { SharedMapStop } from '../lib/privateStopMap';
export default function PrivateStopMap({tripId,stops}:{tripId:string;stops:SharedMapStop[]}) {
  const id=useId(); const map=buildStopMap(tripId,stops);
  return <section aria-labelledby={`${id}-heading`} className="private-section">
    <h4 id={`${id}-heading`}>Planned stop coordinates</h4>
    <p>Local coordinate plot. No map provider, GPS or location lookup. Lines show planned stop order, not roads, distances or places visited. Some connections are omitted at projection boundaries. This projection distorts geography near the poles.</p>
    <p>{map.locatedCount} of {map.points.length} visible stops plotted. Repeated positions may overlap; the list includes every visible stop.</p>
    {!map.locatedCount ? <p role="status">No shared stop coordinates yet. Unknown locations remain unmapped.</p> : <svg viewBox="0 0 720 360" style={{width:'100%',height:'auto',maxHeight:360}} role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>Shared planned stops by latitude and longitude</title>
      <desc id={`${id}-description`}>North is up. There is no geographic basemap. Stop numbers match the coordinate list below. Gaps in known coordinates are not connected.</desc>
      <rect x="1" y="1" width="718" height="358" fill="#f0f7f5" stroke="#48645d"/>
      <text x="10" y="20" fill="#183c33">North {map.bounds.north.toFixed(2)}°</text>
      <text x="10" y="350" fill="#183c33">South {map.bounds.south.toFixed(2)}° · longitude {normalizeLongitude(map.bounds.west).toFixed(2)}° to {normalizeLongitude(map.bounds.east).toFixed(2)}°</text>
      {map.segments.map(segment=><line key={`${segment.from.id}:${segment.to.id}`} x1={segment.from.x!} y1={segment.from.y!} x2={segment.to.x!} y2={segment.to.y!} stroke="#356d5c" strokeWidth="2" strokeDasharray="5 5"/>)}
      {map.points.filter(point=>point.x!==null).map(point=><g key={point.id}><circle cx={point.x!} cy={point.y!} r="10" fill="#164e3d"/><text x={point.x!} y={point.y!+4} textAnchor="middle" fill="white" fontSize="12">{point.number}</text></g>)}
    </svg>}
    <ol>{map.points.map(point=><li key={point.id}>{point.label} — {point.coordinate ? `${point.coordinate.latitude.toFixed(4)}° latitude, ${point.coordinate.longitude.toFixed(4)}° longitude` : 'Unmapped: no valid shared coordinates'}</li>)}</ol>
  </section>;
}
