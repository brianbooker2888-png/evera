import { describe, expect, it } from 'vitest';
import { createWorld } from '../simulation/createWorld';
import { migrateWorld } from './migrate';
import type { WorldState } from '../types/game';

const draft={firstName:'Matrix',lastName:'Test',age:30,sex:'male' as const,orientation:'straight' as const,hometown:'Phoenix, Arizona',socioeconomicBackground:'stable' as const,ambition:71,discipline:69,empathy:66,athleticism:61,familyStructure:'two_parent' as const,siblingCount:1};

const phase4=['educationInstitutions','educationEnrollments','credentials','skills','employers','employments','jobOpenings','jobApplications','laborMarket'];
const finance=['financialAccounts','recurringObligations','budgetRules','householdFinancePlans','creditProfiles','liabilities','insurancePolicies','properties','vehicles','investmentPositions','bankruptcyRecords','market'];
const phase6=['sportsLeagues','sportsTeams','sportsParticipants','athleteProfiles','coachProfiles','sportsContracts','sportsFixtures','sportsSeasonStats','businesses','warehouseFacilities','businessEmployees','logisticsContracts','logisticsKpis','businessOpportunities'];
const narration=['narrationSettings','annualLifeChapters'];
const health=['healthProfiles','medicalConditions','medicalEncounters','medicalBills','medications'];
const legal=['deathRecords','funeralRecords','estatePlans','estateCases','ancestorArchives','controlTransitions','crimeIncidents','criminalCases','criminalRecords','incarcerationRecords','civilCases'];
const lifestyle=['lifestyleProfiles','homeLifestyles','homeUpgrades','vehicleUseProfiles','wardrobeItems','hobbies','pets','travelPlans','lifestyleOutings','householdServices','deviceAssets','calendarCommitments','lifestyleMilestones'];
const living=['countries','cities','neighborhoods','industries','worldInstitutions','companyWorldStates','policies','residencyRecords','regionalShocks','worldNews','worldHistory','migrationRecords','currentCityId','currentNeighborhoodId'];
const gameplay=['gameConfiguration'];

function without<T extends object>(value:T,keys:string[]){const clone=structuredClone(value) as Record<string,unknown>;for(const key of keys)delete clone[key];return clone;}
function legacyV1(current:WorldState){
  const character=without(current.character,['human','romantic']);
  const npcs=current.npcs.slice(0,8).map(n=>{const rel=current.relationships.find(r=>r.fromId=n.id&&r.toId===current.character.id);return{id:n.id,name:n.name,role:n.role,age:n.age,location:n.location,affection:Math.round(rel?.affection??50),trust:Math.round(rel?.trust.emotional??50),respect:Math.round(rel?.respect??50),resentment:Math.round(rel?.resentment??10),mood:n.human?.mood.label==='strained'?'strained':'steady',activeGoal:n.currentFocus};});
  return{version:1,seed:current.seed,date:current.date,character,npcs,ledger:structuredClone(current.ledger),events:structuredClone(current.events),memories:structuredClone(current.memories),economy:structuredClone(current.economy)};
}
function legacyV2(current:WorldState){
  const character=without(current.character,['romantic']);
  const npcs=current.npcs.map(n=>without(n,['birthDate','sex','romantic','childDevelopment']));
  return{version:2,seed:current.seed,date:current.date,character,npcs,relationships:structuredClone(current.relationships),knowledge:structuredClone(current.knowledge),secrets:structuredClone(current.secrets),npcActivity:structuredClone(current.npcActivity),ledger:structuredClone(current.ledger),events:structuredClone(current.events),memories:structuredClone(current.memories),economy:structuredClone(current.economy)};
}
function legacyShape(current:WorldState,version:number){
  if(version===1)return legacyV1(current);if(version===2)return legacyV2(current);
  const remove=version===3?[...phase4,...finance,...phase6,...narration,...health,...legal,...lifestyle,...living,...gameplay]
    :version===4?[...finance,...phase6,...narration,...health,...legal,...lifestyle,...living,...gameplay]
    :version===5?[...phase6,...narration,...health,...legal,...lifestyle,...living,...gameplay]
    :version===6?[...narration,...health,...legal,...lifestyle,...living,...gameplay]
    :version===7?[...health,...legal,...lifestyle,...living,...gameplay]
    :version===8?[...legal,...lifestyle,...living,...gameplay]
    :version===9?[...lifestyle,...living,...gameplay]
    :version===10?[...living,...gameplay]
    :version===11?[...gameplay]:[];
  return{...without(current,remove),version};
}

function expectCurrentWorld(migrated:WorldState|null,current:WorldState){
  expect(migrated).not.toBeNull();if(!migrated)return;
  expect(migrated.version).toBe(12);expect(migrated.seed).toBe(current.seed);expect(migrated.date).toBe(current.date);expect(migrated.character.id).toBe(current.character.id);
  expect(migrated.gameConfiguration.mode).toBe('life');expect(migrated.financialAccounts.length).toBeGreaterThan(0);expect(migrated.sportsLeagues.length).toBeGreaterThan(0);expect(migrated.businessOpportunities.length).toBeGreaterThan(0);expect(migrated.healthProfiles.length).toBeGreaterThan(0);expect(migrated.lifestyleProfiles.length).toBeGreaterThan(0);expect(migrated.countries.length).toBeGreaterThan(0);
}

describe('Phase 15 cumulative save migration matrix',()=>{
  const current=createWorld(draft,15001);
  for(let version=1;version<=12;version++)it(`migrates schema v${version} to the current v12 world`,()=>{expectCurrentWorld(migrateWorld(legacyShape(current,version)),current);});

  it('is deterministic when the same historical save is migrated repeatedly',()=>{
    const legacy=legacyShape(current,1),a=migrateWorld(legacy),b=migrateWorld(legacy);expect(a).toEqual(b);
  });

  it('rejects unknown future and malformed save versions instead of guessing',()=>{
    expect(migrateWorld({...current,version:99})).toBeNull();expect(migrateWorld({version:'12'})).toBeNull();expect(migrateWorld(null)).toBeNull();
  });
});
