import type { WorldState } from '../types/game';
import { migrateWorld } from './migrate';

export interface PortableSaveEnvelope{
  format:'evera-portable-save';
  formatVersion:1;
  exportedAt:string;
  appSchema:number;
  world:WorldState;
}

export function serializePortableWorld(world:WorldState,exportedAt=new Date().toISOString()):string{
  const envelope:PortableSaveEnvelope={format:'evera-portable-save',formatVersion:1,exportedAt,appSchema:world.version,world};
  return JSON.stringify(envelope,null,2);
}

export function parsePortableWorld(text:string):WorldState|null{
  try{
    const parsed=JSON.parse(text) as unknown;
    if(typeof parsed==='object'&&parsed!==null&&(parsed as{format?:unknown}).format==='evera-portable-save'){
      const envelope=parsed as{formatVersion?:unknown;world?:unknown};
      if(envelope.formatVersion!==1)return null;
      return migrateWorld(envelope.world);
    }
    return migrateWorld(parsed);
  }catch{return null;}
}

export function portableSaveFilename(world:WorldState){return`evera-${world.character.firstName.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${world.date}.json`;}
