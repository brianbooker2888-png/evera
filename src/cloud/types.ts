import type { WorldState } from '../types/game';

export type CloudConnectionState='unconfigured'|'signed_out'|'signed_in'|'error';
export type SyncStatus='local_only'|'synced'|'dirty'|'conflict'|'error';

export interface CloudUser { id:string; email:string|null; }
export interface CloudSession { user:CloudUser; }

export interface CloudSaveEnvelope {
  saveId:string;
  revision:number;
  worldVersion:number;
  checksum:string;
  updatedAt:string;
  deviceId:string;
  payload:WorldState;
}

export interface SyncMetadata {
  saveId:string;
  deviceId:string;
  localRevision:number;
  lastSyncedRevision:number;
  lastSyncedChecksum:string|null;
  lastSyncAt:string|null;
  status:SyncStatus;
  lastError:string|null;
}

export interface SyncConflict {
  local:CloudSaveEnvelope;
  remote:CloudSaveEnvelope;
  reason:string;
}

export type SyncResult=
  |{kind:'synced';world:WorldState;metadata:SyncMetadata;direction:'none'|'upload'|'download'}
  |{kind:'conflict';world:WorldState;metadata:SyncMetadata;conflict:SyncConflict}
  |{kind:'unavailable';world:WorldState;metadata:SyncMetadata;reason:string}
  |{kind:'error';world:WorldState;metadata:SyncMetadata;reason:string};

export interface CloudSaveProvider {
  id:string;
  isConfigured():boolean;
  connectionState():Promise<CloudConnectionState>;
  session():Promise<CloudSession|null>;
  requestSignIn(email:string):Promise<void>;
  signOut():Promise<void>;
  pull(saveId:string):Promise<CloudSaveEnvelope|null>;
  push(envelope:CloudSaveEnvelope,expectedRevision:number):Promise<CloudSaveEnvelope>;
}
