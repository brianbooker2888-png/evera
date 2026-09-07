import type { WorldState } from '../types/game';

export function initializeLegacyLegal(world:WorldState){
  world.deathRecords??=[];
  world.funeralRecords??=[];
  world.estatePlans??=[];
  world.estateCases??=[];
  world.ancestorArchives??=[];
  world.controlTransitions??=[];
  world.crimeIncidents??=[];
  world.criminalCases??=[];
  world.criminalRecords??=[];
  world.incarcerationRecords??=[];
  world.civilCases??=[];
  return world;
}

export function isDeceased(world:WorldState,personId:string){return world.deathRecords.some(d=>d.personId===personId);}
export function isIncarcerated(world:WorldState,personId:string){return world.incarcerationRecords.some(r=>r.personId===personId&&r.status==='incarcerated'&&r.endDate>=world.date);}
