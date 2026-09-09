import { describe, expect, it } from 'vitest';
import { createWorld } from './createWorld';
import { stepWorld } from './engine';
import { attemptRelationshipStep, setFamilyPlan } from './relationshipEngine';
import { childrenOf } from './familyEngine';
import { applyForJob, activeEmployment } from './careerEngine';
import { chooseCriminalResponse, commitOffense, fileCivilCase, respondCivilCase } from './legalEngine';
import { continueAsDescendant, eligibleDescendants, forceDeath, setEstatePlan } from './mortalityEstateEngine';
import { migrateWorld } from '../persistence/migrate';

const draft={firstName:'Legacy',lastName:'Test',age:35,sex:'male' as const,orientation:'straight' as const,hometown:'Phoenix, Arizona',socioeconomicBackground:'stable' as const,ambition:72,discipline:68,empathy:66,athleticism:62};
function familyWorld(){
  let world=createWorld(draft,10001);
  for(const r of world.relationships.filter(x=>(x.fromId===world.character.id&&x.toId==='npc-friend')||(x.fromId==='npc-friend'&&x.toId===world.character.id))){r.affection=94;r.respect=92;r.attraction=94;r.familiarity=92;r.resentment=0;r.trust.emotional=94;r.trust.romantic=94;}
  world.npcs.find(n=>n.id==='npc-friend')!.romantic.orientation='straight';
  world=attemptRelationshipStep(world,'npc-friend','ask_date');world=attemptRelationshipStep(world,'npc-friend','exclusive');world=attemptRelationshipStep(world,'npc-friend','move_in');world=attemptRelationshipStep(world,'npc-friend','engage');world=attemptRelationshipStep(world,'npc-friend','marry');
  const partnership=world.partnerships.find(p=>p.status==='married')!;world=setFamilyPlan(world,partnership.id,'trying');world.pregnancies.push({id:'phase10-pregnancy',pregnantPersonId:'npc-friend',partnerId:world.character.id,conceptionDate:world.date,dueDate:world.date,status:'ongoing',planned:true,childIds:[],outcomeDate:null});
  return stepWorld(world,1);
}

describe('Phase 10 mortality, law and legacy',()=>{
  it('keeps legal state inside current schema and migrates a true v8 shape into v12',()=>{
    const current=createWorld(draft,10002);expect(current.version).toBe(12);expect(current.deathRecords).toEqual([]);expect(current.civilCases).toEqual([]);
    const {deathRecords,funeralRecords,estatePlans,estateCases,ancestorArchives,controlTransitions,crimeIncidents,criminalCases,criminalRecords,incarcerationRecords,civilCases,lifestyleProfiles,homeLifestyles,homeUpgrades,vehicleUseProfiles,wardrobeItems,hobbies,pets,travelPlans,lifestyleOutings,householdServices,deviceAssets,calendarCommitments,lifestyleMilestones,countries,cities,neighborhoods,industries,worldInstitutions,companyWorldStates,policies,residencyRecords,regionalShocks,worldNews,worldHistory,migrationRecords,currentCityId,currentNeighborhoodId,...v8}=current;void deathRecords;void funeralRecords;void estatePlans;void estateCases;void ancestorArchives;void controlTransitions;void crimeIncidents;void criminalCases;void criminalRecords;void incarcerationRecords;void civilCases;void lifestyleProfiles;void homeLifestyles;void homeUpgrades;void vehicleUseProfiles;void wardrobeItems;void hobbies;void pets;void travelPlans;void lifestyleOutings;void householdServices;void deviceAssets;void calendarCommitments;void lifestyleMilestones;void countries;void cities;void neighborhoods;void industries;void worldInstitutions;void companyWorldStates;void policies;void residencyRecords;void regionalShocks;void worldNews;void worldHistory;void migrationRecords;void currentCityId;void currentNeighborhoodId;
    const migrated=migrateWorld({...v8,version:8});expect(migrated?.version).toBe(12);expect(migrated?.healthProfiles.length).toBe(current.healthProfiles.length);expect(migrated?.deathRecords).toEqual([]);expect(migrated?.lifestyleProfiles.length).toBeGreaterThan(0);expect(migrated?.countries.length).toBeGreaterThan(0);expect(migrated?.gameConfiguration.mode).toBe('life');
  });

  it('settles insurance and estate state before cleanup and freezes a deceased controlled life',()=>{
    let world=familyWorld(),child=childrenOf(world,world.character.id)[0]!;expect(child).toBeTruthy();world.insurancePolicies.push({id:'policy-life-test',ownerIds:[world.character.id],kind:'life',provider:'Test Life',premiumMonthly:40,deductible:0,coverageLimit:100000,active:true});world.financialAccounts.find(a=>a.id==='account-checking-player')!.balance=20000;world.character.cash=20000;world=setEstatePlan(world,[child.id]);const date=world.date;world=forceDeath(world,world.character.id,'illness');const estate=world.estateCases.find(e=>e.decedentId===world.character.id)!;expect(estate.lifeInsuranceProceeds).toBe(100000);expect(estate.distributions.find(d=>d.personId===child.id)?.amount).toBeGreaterThan(0);expect(world.funeralRecords.some(f=>f.decedentId===world.character.id)).toBe(true);expect(world.ancestorArchives.some(a=>a.personId===world.character.id)).toBe(true);expect(stepWorld(world,30).date).toBe(date);
  });

  it('continues as the existing descendant identity with exactly that heir cash distribution',()=>{
    let world=familyWorld(),child=childrenOf(world,world.character.id)[0]!;world.financialAccounts.find(a=>a.id==='account-checking-player')!.balance=30000;world.character.cash=30000;world=setEstatePlan(world,[child.id]);const decedentId=world.character.id,childId=child.id;world=forceDeath(world,decedentId,'other');const inherited=world.estateCases.find(e=>e.decedentId===decedentId)!.distributions.find(d=>d.personId===childId)!.amount;expect(eligibleDescendants(world,decedentId).some(d=>d.id===childId)).toBe(true);world=continueAsDescendant(world,childId);expect(world.character.id).toBe(childId);expect(world.npcs.some(n=>n.id===childId)).toBe(false);expect(world.controlTransitions.at(-1)?.fromPersonId).toBe(decedentId);expect(world.controlTransitions.at(-1)?.toPersonId).toBe(childId);expect(world.financialAccounts.find(a=>a.id==='account-checking-player')?.balance).toBe(inherited);expect(world.financialAccounts.find(a=>a.id==='account-checking-player')?.ownerIds).toEqual([childId]);
  });

  it('keeps offense creation deterministic and separates discovery from charging',()=>{
    const base=createWorld(draft,10003),a=commitOffense(base,'fraud'),b=commitOffense(base,'fraud');expect(a.crimeIncidents[0]).toEqual(b.crimeIncidents[0]);let world=a,incident=world.crimeIncidents[0]!;incident.discovered=true;incident.discoveredDate=world.date;incident.status='investigating';incident.evidenceStrength=100;incident.severity=100;world=stepWorld(world,8);const legalCase=world.criminalCases.find(c=>c.incidentId===incident.id);expect(legalCase?.status).toBe('charged');
  });

  it('allows a plea to create a persistent conviction and incarceration consequence',()=>{
    let world=commitOffense(createWorld(draft,10004),'assault'),incident=world.crimeIncidents[0]!;incident.discovered=true;incident.discoveredDate=world.date;incident.status='investigating';incident.evidenceStrength=100;incident.severity=100;world=stepWorld(world,8);const legalCase=world.criminalCases.find(c=>c.incidentId===incident.id)!;world=chooseCriminalResponse(world,legalCase.id,'plead');world=stepWorld(world,7);expect(world.criminalRecords.some(r=>r.caseId===legalCase.id&&r.active)).toBe(true);expect(world.incarcerationRecords.some(r=>r.caseId===legalCase.id&&r.status==='incarcerated')).toBe(true);expect(activeEmployment(world)).toBeUndefined();
  });

  it('makes an active conviction reduce hiring competitiveness',()=>{
    const clean=createWorld(draft,10005),opening=clean.jobOpenings.find(o=>o.status==='open')!,cleanApplied=applyForJob(clean,opening.id),cleanScore=cleanApplied.jobApplications.find(a=>a.openingId===opening.id)!.score;const recorded=createWorld(draft,10005);recorded.criminalRecords.push({id:'record-test',personId:recorded.character.id,caseId:'case-test',offense:'fraud',convictionDate:recorded.date,severity:90,active:true});const recordedApplied=applyForJob(recorded,opening.id),recordedScore=recordedApplied.jobApplications.find(a=>a.openingId===opening.id)!.score;expect(recordedScore).toBeLessThan(cleanScore);
  });

  it('resolves the same civil settlement identically from the same world state',()=>{
    const base=createWorld(draft,10006),filed=fileCivilCase(base,'npc-friend','contract',12000),caseId=filed.civilCases[0]!.id,a=respondCivilCase(filed,caseId,'settle'),b=respondCivilCase(filed,caseId,'settle');expect(a.civilCases.find(c=>c.id===caseId)?.status).toBe('settled');expect(a.civilCases.find(c=>c.id===caseId)?.amountAwarded).toBe(b.civilCases.find(c=>c.id===caseId)?.amountAwarded);
  });
});