/** Entirely fictional presentation fixture. Never import this into a real trip. */
export const groupOverviewFixture = {
 tripId:'synthetic-overview',title:'Island & ocean week',zone:'Pacific/Palau',start:'2030-11-01T00:00:00+09:00',end:'2030-11-08T00:00:00+09:00',
 phases:[{label:'Harbor stay',kind:'land',start:'2030-11-01T00:00:00+09:00',end:'2030-11-03T09:00:00+09:00',status:'confirmed'},{label:'Liveaboard',kind:'boat',start:'2030-11-03T09:00:00+09:00',end:'2030-11-07T08:00:00+09:00',status:'confirmed'},{label:'Final night',kind:'land',start:'2030-11-07T08:00:00+09:00',end:'2030-11-08T00:00:00+09:00',status:'tentative'}],
 travelers:Array.from({length:8},(_,i)=>({tripId:'synthetic-overview',id:`sample-${i}`,name:`Traveler ${String.fromCharCode(65+i)}`,visibility:'group',
 arrival:i===7?undefined:{at:`2030-11-0${i<4?1:2}T${i<4?'14':'18'}:30:00+09:00`,zone:'Pacific/Palau',status:i===6?'tentative':'confirmed'},
 departure:i===7?undefined:{at:'2030-11-07T21:15:00+09:00',zone:'Pacific/Palau',status:i>5?'tentative':'confirmed'},
 transfer:i===7?undefined:{label:i<4?'Harbor shuttle · Group 1':'Evening shuttle · Group 2',status:i===6?'tentative':'confirmed'},
 rooms:i===7?[]:[{kind:'land',label:'Sample Harbor Hotel',start:i<4?'2030-11-01':'2030-11-02',end:'2030-11-03',sharing:i===4?'solo':i===6?'unassigned':'shared',roommates:i===4||i===6?[]:[`Traveler ${String.fromCharCode(65+(i%2===0?i+1:i-1))}`],status:i===6?'tentative':'confirmed'},
 {kind:'boat',label:i===6?'Cabin not assigned':`Cabin ${Math.floor(i/2)+1}`,start:'2030-11-03',end:'2030-11-07',sharing:i===6?'unassigned':'shared',roommates:i===6?[]:[`Traveler ${String.fromCharCode(65+(i%2===0?i+1:i-1))}`],status:i===6?'tentative':'confirmed'}],
 activities:[{label:'Reef excursion',response:i===7?'not_provided':i===6?'maybe':'going'},{label:'Land walk',response:i<3?'going':i===7?'not_provided':'not_going'}]
 }))
};
