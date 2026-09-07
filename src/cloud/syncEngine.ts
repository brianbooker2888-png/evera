import type { WorldState } from '../types/game';
import { migrateWorld } from '../persistence/migrate';
import { loadSyncMetadata, replaceWorldFromSync, saveSyncMetadata } from '../persistence/store';
import { checksum } from './checksum';
import type { CloudSaveEnvelope, CloudSaveProvider, SyncMetadata, SyncResult } from './types';

function now(){return new Date().toISOString();}
function localEnvelope(world:WorldState,meta:SyncMetadata,revision:number):CloudSaveEnvelope{return{saveId:meta.saveId,revision,worldVersion:world.version,checksum:checksum(world),updatedAt:now(),deviceId:meta.deviceId,payload:world};}
function syncedMeta(meta:SyncMetadata,remote:CloudSaveEnvelope):SyncMetadata{return{...meta,lastSyncedRevision:remote.revision,lastSyncedChecksum:remote.checksum,lastSyncAt:now(),status:'synced',lastError:null};}
function validRemote(remote:CloudSaveEnvelope){const migrated=migrateWorld(remote.payload);if(!migrated)throw new Error('Cloud save payload is not a supported EVERA save.');return migrated;}

export type SyncDecision='same'|'upload'|'download'|'conflict';
export function classifySync(localChecksum:string,lastSyncedChecksum:string|null,remoteChecksum:string):SyncDecision{
  if(localChecksum===remoteChecksum)return'same';
  const localChanged=lastSyncedChecksum===null||localChecksum!==lastSyncedChecksum;
  const remoteChanged=lastSyncedChecksum===null||remoteChecksum!==lastSyncedChecksum;
  if(!localChanged&&remoteChanged)return'download';
  if(localChanged&&!remoteChanged)return'upload';
  return'conflict';
}

export async function syncWorld(world:WorldState,provider:CloudSaveProvider):Promise<SyncResult>{
  let meta=await loadSyncMetadata();
  if(!provider.isConfigured())return{kind:'unavailable',world,metadata:meta,reason:'Cloud saves are not configured for this build.'};
  const session=await provider.session().catch(()=>null);if(!session)return{kind:'unavailable',world,metadata:meta,reason:'Sign in to use cloud saves.'};
  try{
    const localChecksum=checksum(world),remote=await provider.pull(meta.saveId);
    if(!remote){const pushed=await provider.push(localEnvelope(world,meta,1),0);meta=syncedMeta(meta,pushed);await saveSyncMetadata(meta);return{kind:'synced',world,metadata:meta,direction:'upload'};}
    const remoteWorld=validRemote(remote),decision=classifySync(localChecksum,meta.lastSyncedChecksum,remote.checksum);
    if(decision==='same'){meta=syncedMeta(meta,remote);await saveSyncMetadata(meta);return{kind:'synced',world,metadata:meta,direction:'none'};}
    if(decision==='download'){meta=syncedMeta(meta,remote);await replaceWorldFromSync(remoteWorld,meta);return{kind:'synced',world:remoteWorld,metadata:meta,direction:'download'};}
    if(decision==='upload'){const pushed=await provider.push(localEnvelope(world,meta,remote.revision+1),remote.revision);meta=syncedMeta(meta,pushed);await saveSyncMetadata(meta);return{kind:'synced',world,metadata:meta,direction:'upload'};}
    meta={...meta,status:'conflict',lastError:null};await saveSyncMetadata(meta);
    return{kind:'conflict',world,metadata:meta,conflict:{local:localEnvelope(world,meta,Math.max(meta.localRevision,remote.revision+1)),remote:{...remote,payload:remoteWorld},reason:'This save advanced independently on both devices. EVERA will not merge divergent simulation histories automatically.'}};
  }catch(error){const reason=error instanceof Error?error.message:'Cloud sync failed.';meta={...meta,status:'error',lastError:reason};await saveSyncMetadata(meta);return{kind:'error',world,metadata:meta,reason};}
}

export async function resolveConflictKeepLocal(world:WorldState,remoteRevision:number,provider:CloudSaveProvider):Promise<SyncResult>{
  let meta=await loadSyncMetadata();try{const pushed=await provider.push(localEnvelope(world,meta,remoteRevision+1),remoteRevision);meta=syncedMeta(meta,pushed);await saveSyncMetadata(meta);return{kind:'synced',world,metadata:meta,direction:'upload'};}catch(error){const reason=error instanceof Error?error.message:'Conflict resolution failed.';meta={...meta,status:'error',lastError:reason};await saveSyncMetadata(meta);return{kind:'error',world,metadata:meta,reason};}
}

export async function resolveConflictUseRemote(remote:CloudSaveEnvelope):Promise<SyncResult>{
  let meta=await loadSyncMetadata();try{const world=validRemote(remote);meta=syncedMeta(meta,remote);await replaceWorldFromSync(world,meta);return{kind:'synced',world,metadata:meta,direction:'download'};}catch(error){const reason=error instanceof Error?error.message:'Remote save could not be restored.';meta={...meta,status:'error',lastError:reason};await saveSyncMetadata(meta);return{kind:'error',world:remote.payload,metadata:meta,reason};}
}
