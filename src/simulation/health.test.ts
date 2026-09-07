import { describe, expect, it } from 'vitest';
import { createWorld } from './createWorld';
import { stepWorld } from './engine';
import { getPreventiveCare, seekMedicalCare } from './healthEngine';
import { migrateWorld } from '../persistence/migrate';

const draft={firstName:'Health',lastName:'Test',age:38,sex:'male' as const,orientation:'straight' as const,hometown:'Phoenix, Arizona',socioeconomicBackground:'stable' as const,ambition:68,discipline:72,empathy:64,athleticism:58};

describe('Phase 9 health and healthcare',()=>{
  it('initializes health profiles for the player and instantiated nearby people',()=>{
    const world=createWorld(draft,9001);
    expect(world.version).toBe(10);
    expect(world.healthProfiles.some(p=>p.personId===world.character.id)).toBe(true);
    expect(world.healthProfiles.some(p=>p.personId==='npc-friend')).toBe(true);
    expect(world.healthProfiles.every(p=>p.deductibleYear===Number(world.date.slice(0,4)))).toBe(true);
  });

  it('records preventive care and applies active health coverage',()=>{
    const base=createWorld(draft,9002),after=getPreventiveCare(base),encounter=after.medicalEncounters[0]!;
    expect(encounter.kind).toBe('preventive');
    expect(encounter.patientResponsibility).toBe(0);
    expect(after.healthProfiles.find(p=>p.personId===after.character.id)?.lastPreventiveDate).toBe(after.date);
    expect(base.medicalEncounters).toHaveLength(0);
  });

  it('diagnoses a suspected condition and preserves unpaid medical cost as debt-like bills',()=>{
    let world=createWorld(draft,9003);
    world.medicalConditions.unshift({id:'condition-test',personId:world.character.id,name:'Test injury',kind:'injury',severity:72,diagnosisStatus:'suspected',status:'active',onsetDate:world.date,diagnosedDate:null,resolvedDate:null,recurrenceRisk:15,symptomSummary:'Pain after an injury',treatmentSummary:null});
    world.financialAccounts.find(a=>a.id==='account-checking-player')!.balance=0;world.character.cash=0;
    world=seekMedicalCare(world,'condition-test','emergency');
    const condition=world.medicalConditions.find(c=>c.id==='condition-test')!,encounter=world.medicalEncounters[0]!;
    expect(condition.diagnosisStatus).toBe('diagnosed');expect(condition.severity).toBeLessThan(72);
    expect(encounter.grossCost).toBeGreaterThan(1000);expect(world.medicalBills[0]?.balance).toBeGreaterThan(0);
  });

  it('keeps long-horizon health simulation deterministic',()=>{
    const a=stepWorld(createWorld(draft,9004),365),b=stepWorld(createWorld(draft,9004),365);
    expect(a.medicalConditions).toEqual(b.medicalConditions);
    expect(a.medicalEncounters).toEqual(b.medicalEncounters);
    expect(a.medicalBills).toEqual(b.medicalBills);
    expect(a.character.human.health).toEqual(b.character.human.health);
  });

  it('migrates a v7 save through v10 without losing existing systems',()=>{
    const current=createWorld(draft,9005);
    const {healthProfiles,medicalConditions,medicalEncounters,medicalBills,medications,deathRecords,funeralRecords,estatePlans,estateCases,ancestorArchives,controlTransitions,crimeIncidents,criminalCases,criminalRecords,incarcerationRecords,civilCases,lifestyleProfiles,homeLifestyles,homeUpgrades,vehicleUseProfiles,wardrobeItems,hobbies,pets,travelPlans,lifestyleOutings,householdServices,deviceAssets,calendarCommitments,lifestyleMilestones,...rest}=current;void healthProfiles;void medicalConditions;void medicalEncounters;void medicalBills;void medications;void deathRecords;void funeralRecords;void estatePlans;void estateCases;void ancestorArchives;void controlTransitions;void crimeIncidents;void criminalCases;void criminalRecords;void incarcerationRecords;void civilCases;void lifestyleProfiles;void homeLifestyles;void homeUpgrades;void vehicleUseProfiles;void wardrobeItems;void hobbies;void pets;void travelPlans;void lifestyleOutings;void householdServices;void deviceAssets;void calendarCommitments;void lifestyleMilestones;
    const migrated=migrateWorld({...rest,version:7});
    expect(migrated?.version).toBe(10);
    expect(migrated?.npcs.length).toBe(current.npcs.length);
    expect(migrated?.sportsLeagues.length).toBe(current.sportsLeagues.length);
    expect(migrated?.annualLifeChapters).toEqual(current.annualLifeChapters);
    expect(migrated?.healthProfiles.some(p=>p.personId===current.character.id)).toBe(true);
    expect(migrated?.deathRecords).toEqual([]);
    expect(migrated?.lifestyleProfiles.length).toBeGreaterThan(0);
  });
});
