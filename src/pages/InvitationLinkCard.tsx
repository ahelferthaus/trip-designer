import {useEffect,useId,useRef,useState} from 'react';
import {tryCopyInvitation} from '../lib/invitationClipboard';
export default function InvitationLinkCard({recipient,link,onHide}:{recipient:string;link:string;onHide:()=>void}) {
  const id=useId(); const input=useRef<HTMLTextAreaElement>(null);
  const mounted=useRef(true); const pending=useRef(false);
  const [copying,setCopying]=useState(false); const [feedback,setFeedback]=useState(''); const [manual,setManual]=useState(false);
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  const copy=async()=>{
    if(pending.current)return;
    pending.current=true;setCopying(true);setManual(false);setFeedback('Copying link…');
    const outcome=await tryCopyInvitation(async()=>{
      if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(link);
    });
    if(!mounted.current)return;
    pending.current=false;setCopying(false);
    if(outcome==='copied')setFeedback('Invitation link copied. Share it only with the named recipient.');
    else {setManual(true);setFeedback('Automatic copy is unavailable. Choose Select link, then use Copy from your device menu or keyboard.');}
  };
  return <div className="private-card private-invitation-card">
    <p className="private-invitation-recipient">For <strong>{recipient}</strong></p>
    <label htmlFor={`${id}-link`}>Private invitation link</label>
    <textarea id={`${id}-link`} ref={input} readOnly value={link} rows={3} spellCheck={false} autoComplete="off" autoCapitalize="off" autoCorrect="off" aria-describedby={`${id}-help`} />
    <p id={`${id}-help`} className="private-invitation-help">This private link is intended for the recipient above. Creating or copying it does not send an email. Keep a copy before hiding it. Hiding does not cancel the invitation.</p>
    <div className="private-invitation-actions"><button className="private-invitation-copy" type="button" aria-disabled={copying} aria-busy={copying} onClick={()=>void copy()}>Copy invitation link</button><button className="private-invitation-hide" type="button" onClick={onHide}>Hide link</button>{manual&&<button className="private-invitation-hide" type="button" onClick={()=>{input.current?.focus();input.current?.select();input.current?.setSelectionRange(0,link.length);}}>Select link</button>}</div>
    <p className="private-invitation-feedback" role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
  </div>;
}
