import type { WorldState } from '../types/game';

export function initializeLegacyLegal(world:WorldState,date=world.date){
  (world as unknown as {version:number}).version=9;
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
  for(const i of world.crimeIncidents)i.discoveredDate??=i.discovered?i.date:null;
  for(const r of world.incarcerationRecords)if(r.status==='incarcerated'&&r.endDate<date)r.status='released';
  return world;
}

export function isDeceased(world:WorldState,personId:string){return world.deathRecords.some(d=>d.personId===personId);}
export function isIncarcerated(world:WorldState,personId:string,date=world.date){return world.incarcerationRecords.some(r=>r.personId===personId&&r.status==='incarcerated'&&r.startDate<=date&&r.endDate>=date);}
