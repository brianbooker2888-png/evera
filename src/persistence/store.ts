import type { WorldState } from '../types/game';
import type { SyncMetadata } from '../cloud/types';
import { checksum } from '../cloud/checksum';
import { migrateWorld } from './migrate';

const DB='evera-local';
const SAVE_STORE='saves';
const META_STORE='metadata';
const KEY='autosave';
const META_KEY='sync:autosave';

function randomId(){return globalThis.crypto?.randomUUID?.()??`device-${Date.now()}-${Math.random().toString(36).slice(2)}`;}

function openDb():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB,2);
    req.onupgradeneeded=()=>{
      if(!req.result.objectStoreNames.contains(SAVE_STORE))req.result.createObjectStore(SAVE_STORE);
      if(!req.result.objectStoreNames.contains(META_STORE))req.result.createObjectStore(META_STORE);
    };
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
  });
}
async function getRaw<T>(store:string,key:string):Promise<T|undefined>{const db=await openDb();const value=await new Promise<T|undefined>((resolve,reject)=>{const req=db.transaction(store,'readonly').objectStore(store).get(key);req.onsuccess=()=>resolve(req.result as T|undefined);req.onerror=()=>reject(req.error);});db.close();return value;}
async function putRaw(store:string,key:string,value:unknown):Promise<void>{const db=await openDb();await new Promise<void>((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(value,key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});db.close();}
async function deleteRaw(store:string,key:string):Promise<void>{const db=await openDb();await new Promise<void>((resolve,reject)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).delete(key);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});db.close();}
function hydrateWorld(raw:unknown):WorldState|null{return migrateWorld(raw);}

export async function loadSyncMetadata():Promise<SyncMetadata>{
  const existing=await getRaw<SyncMetadata>(META_STORE,META_KEY);if(existing)return existing;
  const created:SyncMetadata={saveId:KEY,deviceId:randomId(),localRevision:0,lastSyncedRevision:0,lastSyncedChecksum:null,lastSyncAt:null,status:'local_only',lastError:null};
  await putRaw(META_STORE,META_KEY,created);return created;
}
export async function saveSyncMetadata(meta:SyncMetadata){await putRaw(META_STORE,META_KEY,meta);}

export async function saveWorld(world:WorldState,options:{trackChange?:boolean}={}):Promise<void>{
  await putRaw(SAVE_STORE,KEY,world);
  if(options.trackChange===false)return;
  const meta=await loadSyncMetadata(),current=checksum(world);
  if(meta.lastSyncedChecksum!==current){meta.localRevision++;meta.status=meta.lastSyncedChecksum?'dirty':'local_only';}
  meta.lastError=null;await saveSyncMetadata(meta);
}

export async function loadWorld():Promise<WorldState|null>{
  const raw=await getRaw<unknown>(SAVE_STORE,KEY),migrated=hydrateWorld(raw);
  if(migrated&&raw&&typeof raw==='object'&&(raw as{version?:number}).version!==migrated.version)await saveWorld(migrated,{trackChange:false});
  return migrated;
}

export async function replaceWorldFromSync(world:WorldState,metadata:SyncMetadata):Promise<void>{
  const hydrated=hydrateWorld(world)??world;await putRaw(SAVE_STORE,KEY,hydrated);await saveSyncMetadata(metadata);
}

export async function deleteWorld():Promise<void>{
  await deleteRaw(SAVE_STORE,KEY);
  const meta=await loadSyncMetadata();
  await saveSyncMetadata({...meta,localRevision:meta.localRevision+1,status:'local_only',lastSyncedRevision:0,lastSyncedChecksum:null,lastSyncAt:null,lastError:null});
}
