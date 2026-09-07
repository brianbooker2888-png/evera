import type { WorldState } from '../types/game';
import type { HealthProfile } from '../types/health';
import { ageAt } from './familyEngine';

const clamp=(v:number)=>Math.max(0,Math.min(100,Math.round(v)));
function humanFor(world:WorldState,personId:string){if(personId===world.character.id)return world.character.human;return world.npcs.find(n=>n.id===personId)?.human??null;}
function traitsFor(world:WorldState,personId:string){if(personId===world.character.id)return world.character.traits;return world.npcs.find(n=>n.id===personId)?.traits??null;}
function ageFor(world:WorldState,personId:string,date:string){if(personId===world.character.id)return ageAt(world.character.birthDate,date);const npc=world.npcs.find(n=>n.id===personId);return npc?ageAt(npc.birthDate,date):30;}
function socioeconomicModifier(world:WorldState,personId:string){if(personId!==world.character.id)return 0;return{struggling:-14,working:-7,stable:2,affluent:9,wealthy:14}[world.character.socioeconomicBackground];}
function hasHealthCoverage(world:WorldState,personId:string){return world.insurancePolicies.some(p=>p.kind==='health'&&p.active&&p.ownerIds.includes(personId));}
function reconcileEmployerCoverage(world:WorldState){const employment=world.employments.find(e=>e.personId===world.character.id&&e.status==='active'),existing=world.insurancePolicies.find(p=>p.id==='policy-health-player');if(employment?.benefits.healthInsurance){if(existing)existing.active=true;else world.insurancePolicies.push({id:'policy-health-player',ownerIds:[world.character.id],kind:'health',provider:'Employer Health Plan',premiumMonthly:145,deductible:1750,coverageLimit:500000,active:true});}else if(existing)existing.active=false;}
function accessTarget(world:WorldState,personId:string){const socio=socioeconomicModifier(world,personId);return clamp(45+socio*2+(hasHealthCoverage(world,personId)?28:0));}
function profileFor(world:WorldState,personId:string,date:string):HealthProfile|null{const human=humanFor(world,personId),traits=traitsFor(world,personId);if(!human||!traits)return null;const age=ageFor(world,personId,date),socio=socioeconomicModifier(world,personId),healthValue=human.values.health;return{personId,preventiveAdherence:clamp(28+traits.discipline*.38+healthValue*.3+socio*.25),nutritionQuality:clamp(42+traits.discipline*.28+healthValue*.2+socio),sleepQuality:clamp(88-human.health.sleepDebt*.65+traits.discipline*.08),substanceRisk:clamp(8+traits.impulsivity*.35+traits.riskTolerance*.22-traits.discipline*.18),chronicRisk:clamp(Math.max(0,age-30)*1.15+(100-human.health.fitness)*.28+(100-human.health.physicalCondition)*.18-socio*.25),accidentRisk:clamp(10+traits.riskTolerance*.35+traits.impulsivity*.18+(100-human.health.fitness)*.08),careAccess:accessTarget(world,personId),deductibleSpentYear:0,deductibleYear:Number(date.slice(0,4)),lastPreventiveDate:null,lastUpdatedDate:date};}

export function initializeHealth(world:WorldState,date=world.date){
  world.healthProfiles??=[];world.medicalConditions??=[];world.medicalEncounters??=[];world.medicalBills??=[];world.medications??=[];reconcileEmployerCoverage(world);
  const represented=[world.character.id,...world.npcs.filter(n=>n.tier<=2&&n.human).map(n=>n.id)];
  for(const personId of represented)if(!world.healthProfiles.some(p=>p.personId===personId)){const p=profileFor(world,personId,date);if(p)world.healthProfiles.push(p);}
  const year=Number(date.slice(0,4));for(const p of world.healthProfiles){if(p.deductibleYear!==year){p.deductibleYear=year;p.deductibleSpentYear=0;}if(p.personId===world.character.id){const target=accessTarget(world,p.personId);p.careAccess=clamp(p.careAccess+(target-p.careAccess)*.08);}p.lastUpdatedDate=date;}
  return world;
}
