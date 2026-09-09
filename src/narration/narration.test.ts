import { describe, expect, it } from 'vitest';
import { createWorld } from '../simulation/createWorld';
import { stepWorld } from '../simulation/engine';
import { haveConversation } from '../simulation/relationshipEngine';
import { migrateWorld } from '../persistence/migrate';
import { compileAnnualChapterContext, compileSceneContext } from './contextCompiler';
import { buildAnnualLifeChapter, generateOfflineDialogue } from './narrationEngine';

const draft={firstName:'Narration',lastName:'Test',age:28,sex:'male' as const,orientation:'straight' as const,hometown:'Phoenix, Arizona',socioeconomicBackground:'stable' as const,ambition:70,discipline:68,empathy:64,athleticism:58};

describe('Phase 7 grounded narration',()=>{
  it('never gives a speaker secrets they do not know',()=>{
    const world=createWorld(draft,7001);
    const hidden=world.secrets.find(s=>!s.knownBy.some(k=>k.personId==='npc-active-1'))!;
    const context=compileSceneContext(world,'dialogue','npc-active-1',world.character.id);
    expect(context.facts.some(f=>f.sourceId===hidden.id)).toBe(false);
  });

  it('marks beliefs and rumors as non-canonical',()=>{
    const world=createWorld(draft,7002);
    world.knowledge.push({id:'test-rumor',holderId:'npc-friend',subjectId:'npc-active-1',factKey:'job-rumor',summary:'A rumor says a job change might happen.',confidence:40,privacy:'personal',sourceId:'npc-active-2',sourceType:'rumor',acquiredDate:world.date,distortion:20});
    const context=compileSceneContext(world,'dialogue','npc-friend',world.character.id);
    const rumor=context.facts.find(f=>f.sourceId==='test-rumor')!;
    expect(rumor.certainty).toBe('rumor');
    expect(rumor.allowedToStateAsFact).toBe(false);
  });

  it('generates deterministic offline dialogue without mutating the world',()=>{
    const world=createWorld(draft,7003),before=structuredClone(world);
    const a=generateOfflineDialogue(world,'npc-friend','Can we talk about the future?');
    const b=generateOfflineDialogue(world,'npc-friend','Can we talk about the future?');
    expect(a.text).toBe(b.text);expect(a.providerId).toBe('evera-offline');
    expect(world).toEqual(before);
  });

  it('keeps simulation consequences separate from narration text',()=>{
    const base=createWorld(draft,7004);
    const simulated=haveConversation(base,'npc-friend','I am sorry. Can we talk?');
    const narrated=generateOfflineDialogue(simulated,'npc-friend','I am sorry. Can we talk?');
    expect(simulated.conversations[0]?.intent).toBe('apologize');
    expect(narrated.text.length).toBeGreaterThan(0);
    expect(simulated.relationships).not.toEqual(base.relationships);
  });

  it('builds deterministic annual chapters from recorded facts',()=>{
    let world=createWorld(draft,7005);
    world.events.unshift({id:'chapter-event',date:world.date,title:'A meaningful change',body:'A recorded change happened in the character’s life.',type:'world',priority:'major'});
    const year=Number(world.date.slice(0,4));
    const a=buildAnnualLifeChapter(world,year),b=buildAnnualLifeChapter(world,year);
    expect(a.text).toBe(b.text);expect(a.sourceFactIds.length).toBeGreaterThan(0);
  });

  it('allows only recorded diagnosed health facts into annual narration',()=>{
    const world=createWorld(draft,7008),year=Number(world.date.slice(0,4));
    world.medicalConditions.unshift({id:'diagnosed-health-fact',personId:world.character.id,name:'Recorded condition',kind:'chronic',severity:40,diagnosisStatus:'diagnosed',status:'managed',onsetDate:world.date,diagnosedDate:world.date,resolvedDate:null,recurrenceRisk:20,symptomSummary:'Recorded symptoms',treatmentSummary:'Recorded treatment'});
    const context=compileAnnualChapterContext(world,year);
    expect(context.facts.some(f=>f.sourceId==='diagnosed-health-fact'&&f.category==='health'&&f.certainty==='canonical')).toBe(true);
  });

  it('creates the completed prior-year chapter at a January boundary',()=>{
    const world=createWorld(draft,7006);world.date='2026-12-31';
    const next=stepWorld(world,1);
    expect(next.date).toBe('2027-01-01');
    expect(next.annualLifeChapters.some(c=>c.year===2026)).toBe(true);
  });

  it('migrates a v6 save through v12 without losing prior systems',()=>{
    const current=createWorld(draft,7007);
    const {narrationSettings,annualLifeChapters,healthProfiles,medicalConditions,medicalEncounters,medicalBills,medications,deathRecords,funeralRecords,estatePlans,estateCases,ancestorArchives,controlTransitions,crimeIncidents,criminalCases,criminalRecords,incarcerationRecords,civilCases,lifestyleProfiles,homeLifestyles,homeUpgrades,vehicleUseProfiles,wardrobeItems,hobbies,pets,travelPlans,lifestyleOutings,householdServices,deviceAssets,calendarCommitments,lifestyleMilestones,countries,cities,neighborhoods,industries,worldInstitutions,companyWorldStates,policies,residencyRecords,regionalShocks,worldNews,worldHistory,migrationRecords,currentCityId,currentNeighborhoodId,...rest}=current;void narrationSettings;void annualLifeChapters;void healthProfiles;void medicalConditions;void medicalEncounters;void medicalBills;void medications;void deathRecords;void funeralRecords;void estatePlans;void estateCases;void ancestorArchives;void controlTransitions;void crimeIncidents;void criminalCases;void criminalRecords;void incarcerationRecords;void civilCases;void lifestyleProfiles;void homeLifestyles;void homeUpgrades;void vehicleUseProfiles;void wardrobeItems;void hobbies;void pets;void travelPlans;void lifestyleOutings;void householdServices;void deviceAssets;void calendarCommitments;void lifestyleMilestones;void countries;void cities;void neighborhoods;void industries;void worldInstitutions;void companyWorldStates;void policies;void residencyRecords;void regionalShocks;void worldNews;void worldHistory;void migrationRecords;void currentCityId;void currentNeighborhoodId;
    const migrated=migrateWorld({...rest,version:6});
    expect(migrated?.version).toBe(12);
    expect(migrated?.npcs.length).toBe(current.npcs.length);
    expect(migrated?.sportsLeagues.length).toBe(current.sportsLeagues.length);
    expect(migrated?.financialAccounts.length).toBe(current.financialAccounts.length);
    expect(migrated?.narrationSettings.mode).toBe('offline');
    expect(migrated?.healthProfiles.length).toBeGreaterThan(0);
    expect(migrated?.criminalCases).toEqual([]);
    expect(migrated?.lifestyleProfiles.length).toBeGreaterThan(0);
    expect(migrated?.countries.length).toBeGreaterThan(0);
    expect(migrated?.gameConfiguration.mode).toBe('life');
  });
});