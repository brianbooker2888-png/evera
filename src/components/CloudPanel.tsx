import { useEffect, useState } from 'react';
import { Cloud, CloudOff, RefreshCw, Smartphone, TriangleAlert } from 'lucide-react';
import type { WorldState } from '../types/game';
import type { CloudConnectionState, CloudSession, SyncConflict, SyncMetadata, SyncResult } from '../cloud/types';
import { loadSyncMetadata } from '../persistence/store';
import { supabaseCloudProvider } from '../cloud/supabaseProvider';
import { resolveConflictKeepLocal, resolveConflictUseRemote, syncWorld } from '../cloud/syncEngine';

function applyResultMessage(result:SyncResult,setConflict:(value:SyncConflict|null)=>void,setMessage:(value:string)=>void){
  if(result.kind==='conflict'){setConflict(result.conflict);setMessage(result.conflict.reason);}
  else if(result.kind==='unavailable'||result.kind==='error')setMessage(result.reason);
}

export function CloudPanel({world,onChange}:{world:WorldState;onChange:(world:WorldState)=>void}){
  const[state,setState]=useState<CloudConnectionState>('unconfigured'),[session,setSession]=useState<CloudSession|null>(null),[meta,setMeta]=useState<SyncMetadata|null>(null),[email,setEmail]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[conflict,setConflict]=useState<SyncConflict|null>(null);
  const refresh=async()=>{setState(await supabaseCloudProvider.connectionState());setSession(await supabaseCloudProvider.session().catch(()=>null));setMeta(await loadSyncMetadata());};
  useEffect(()=>{void refresh();},[]);
  const sendLink=async()=>{if(!email.trim())return;setBusy(true);try{await supabaseCloudProvider.requestSignIn(email.trim());setMessage('Sign-in link sent. Open it on this device, then return to EVERA.');}catch(e){setMessage(e instanceof Error?e.message:'Could not send sign-in link.');}finally{setBusy(false);}};
  const sync=async()=>{setBusy(true);setMessage('');try{const result=await syncWorld(world,supabaseCloudProvider);setMeta(result.metadata);if(result.kind==='synced'){setConflict(null);onChange(result.world);setMessage(result.direction==='upload'?'Saved to cloud.':result.direction==='download'?'Cloud save restored to this device.':'This device and cloud are already in sync.');}else applyResultMessage(result,setConflict,setMessage);}finally{setBusy(false);}};
  const keepLocal=async()=>{if(!conflict)return;setBusy(true);const result=await resolveConflictKeepLocal(world,conflict.remote.revision,supabaseCloudProvider);setMeta(result.metadata);if(result.kind==='synced'){setConflict(null);onChange(result.world);setMessage('This device’s life is now the cloud version.');}else applyResultMessage(result,setConflict,setMessage);setBusy(false);};
  const useCloud=async()=>{if(!conflict)return;setBusy(true);const result=await resolveConflictUseRemote(conflict.remote);setMeta(result.metadata);if(result.kind==='synced'){setConflict(null);onChange(result.world);setMessage('The cloud version is now active on this device.');}else applyResultMessage(result,setConflict,setMessage);setBusy(false);};
  const signOut=async()=>{setBusy(true);try{await supabaseCloudProvider.signOut();setMessage('Signed out. Your local life remains on this device.');await refresh();}finally{setBusy(false);}};

  return <section className="section"><header><h2>Cloud & device</h2><p>Cloud saves are optional. Local play never requires an account or network connection.</p></header><div className="section-body">
    <article className="cloud-card"><div className="cloud-heading">{state==='signed_in'?<Cloud size={22}/>:<CloudOff size={22}/>}<div><b>{state==='unconfigured'?'Local-only build':state==='signed_in'?'Cloud connected':'Cloud saves available'}</b><small>{session?.user.email??(state==='unconfigured'?'Add Supabase environment variables to enable account sync.':'Sign in to sync this life across devices.')}</small></div></div><div className="device-row"><Smartphone size={17}/><span>Device <code>{meta?.deviceId.slice(0,12)??'loading'}</code></span><small>{meta?.lastSyncAt?`Last sync ${new Date(meta.lastSyncAt).toLocaleString()}`:'Never synced'}</small></div>
      {state==='signed_out'&&<div className="cloud-actions"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email for sign-in link"/><button className="primary" disabled={busy} onClick={sendLink}>Send sign-in link</button><button className="secondary-btn" disabled={busy} onClick={()=>void refresh()}>I signed in</button></div>}
      {state==='signed_in'&&<div className="cloud-actions"><button className="primary" disabled={busy} onClick={sync}><RefreshCw size={16}/>Sync now</button><button className="secondary-btn" disabled={busy} onClick={signOut}>Sign out</button></div>}
      {message&&<p className="cloud-message">{message}</p>}
    </article>
    {conflict&&<article className="sync-conflict"><TriangleAlert size={22}/><div><h3>Two versions of this life exist</h3><p>Both versions changed after the last common sync. EVERA will not combine two different simulation histories automatically.</p><small>This device: revision {conflict.local.revision} · Cloud: revision {conflict.remote.revision}</small><div className="cloud-actions"><button className="primary" disabled={busy} onClick={keepLocal}>Keep this device</button><button className="secondary-btn" disabled={busy} onClick={useCloud}>Use cloud version</button></div></div></article>}
  </div></section>;
}
