import {useState} from 'react';
import GroupTripOverview from './GroupTripOverview';
import type {GroupOverviewData} from '../lib/groupOverview';
import {withSampleFriends} from '../lib/groupOverviewPreview';
/** Isolated preview; callers must provide the verified first traveler's shared DTO. */
export default function GroupOverviewPreview({data,firstTravelerId}:{data:GroupOverviewData;firstTravelerId:string}) {
 return <PreviewContent key={`${data.tripId}:${firstTravelerId}`} data={data} firstTravelerId={firstTravelerId}/>;
}
function PreviewContent({data,firstTravelerId}:{data:GroupOverviewData;firstTravelerId:string}) {
 const [samples,setSamples]=useState(false);
 const permitted=import.meta.env.VITE_VYBR_GROUP_OVERVIEW_PREVIEW==='true';
 const preview=permitted?withSampleFriends(data,firstTravelerId):null;
 const active=samples&&!!preview;
 return <div className={active?'go-sample-overlay':undefined}><aside className="group-overview go-preview-controls" aria-label="Sample preview controls">
 <strong role="status" aria-live="polite">{active?'SAMPLE PREVIEW · seven fictional friends':'Preview your group layout'}</strong>
 <p>{active?'Only your first traveler plan is real. Sample friends do not create accounts, occupy membership seats, send notifications or receive invitations.':'Once the first traveler has shared their plan, you can add seven fictional friends to this view.'}</p>
 {permitted&&<button type="button" disabled={!preview} onClick={()=>setSamples(v=>!v)}>{active?'Remove all sample friends':'Preview with seven sample friends'}</button>}
 {!preview&&<p>No samples added. This preview requires exactly one shared traveler plan and a valid trip window.</p>}
 <small>People shown here and account memberships are different counts. An organizer and a traveler login may belong to the same person; that relationship must be explicitly assigned, never inferred from email.</small>
 </aside><GroupTripOverview data={active?preview!:data}/></div>;
}
