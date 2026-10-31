import type {GroupOverviewData,OperationalTraveler} from './groupOverview.ts';
import {validOperationalInstant,visibleOperationalTravelers} from './groupOverview.ts';
/** Presentation overlay only. Never pass these rows to persistence, invitation or capacity APIs. */
export function withSampleFriends(data:GroupOverviewData,firstTravelerId:string):GroupOverviewData|null {
 const visible=visibleOperationalTravelers(data);
 if(visible.length!==1||visible[0].id!==firstTravelerId||!validOperationalInstant(data.start)||!validOperationalInstant(data.end)) return null;
 const start=Date.parse(data.start),end=Date.parse(data.end);if(end<=start)return null;
 let day:(at:number)=>string;
 try {const fmt=new Intl.DateTimeFormat('en-CA',{timeZone:data.zone,year:'numeric',month:'2-digit',day:'2-digit'});fmt.format(start);day=at=>{const parts=fmt.formatToParts(at);return ['year','month','day'].map(k=>parts.find(p=>p.type===k)!.value).join('-');};}catch{return null;}
 const instant=(fraction:number)=>new Date(start+(end-start)*fraction).toISOString();
 const friends:OperationalTraveler[]=Array.from({length:7},(_,i)=>({
  tripId:data.tripId,id:`sample-preview-${i}`,name:`Sample friend ${String.fromCharCode(65+i)}`,visibility:'group',
  arrival:i===6?undefined:{at:instant(0.03+(i%3)*0.04),zone:data.zone,status:i===5?'tentative':'confirmed'},
  departure:i===6?undefined:{at:instant(0.90+(i%2)*0.04),zone:data.zone,status:i===5?'tentative':'confirmed'},
  transfer:i===6?undefined:{label:`Sample shuttle ${i<3?'A':'B'}`,status:i===5?'tentative':'confirmed'},
  rooms:i===6?[]:[{kind:'land',label:'Sample harbor hotel',start:day(start),end:day(start+(end-start)*0.25),sharing:i===4?'solo':i===5?'unassigned':'shared',roommates:i<4?[`Sample friend ${String.fromCharCode(65+(i%2===0?i+1:i-1))}`]:[],status:i===5?'tentative':'confirmed'},
   {kind:'boat',label:`Sample cabin ${Math.floor(i/2)+1}`,start:day(start+(end-start)*0.25),end:day(start+(end-start)*0.85),sharing:i===4?'solo':i===5?'unassigned':'shared',roommates:i<4?[`Sample friend ${String.fromCharCode(65+(i%2===0?i+1:i-1))}`]:[],status:i===5?'tentative':'confirmed'}],
  activities:[{label:'Sample reef outing',response:i===6?'not_provided':i===5?'maybe':'going'},{label:'Sample land walk',response:i<3?'going':'not_going'}]
 }));
 return {...data,travelers:[visible[0],...friends]};
}
