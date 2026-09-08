import { describe, expect, it } from 'vitest';
import { createWorld } from './createWorld';
import { stepWorld } from './engine';
import { simulateConfiguredMortality } from './modeRuntime';
import { SeededRng } from './rng';
import { migrateWorld } from '../persistence/migrate';

const draft={firstName:'Mode',lastName:'Test',age:28,sex:'male' as const,orientation:'straight' as const,hometown:'Phoenix, Arizona',socioeconomicBackground:'stable' as const,ambition:70,discipline:68,empathy:64,athleticism:60};

describe('Phase 13 game modes, setup and preferences',()=>{
  it('creates true schema v12 worlds with Life Mode by default',()=>{
    const world=createWorld(draft,13001);
    expect(world.version).toBe(12);
    expect(world.gameConfiguration.mode).toBe('life');
    expect(world.gameConfiguration.rules.startingCashMultiplier).toBe(1);
    expect(world.gameConfiguration.onboarding.completed).toBe(false);
  });

  it('changes starting resources through actual mode rules',()=>{
    const life=createWorld({...draft,gameMode:'life' as const},13002);
    const hard=createWorld({...draft,gameMode:'hard' as const},13002);
    const sandbox=createWorld({...draft,gameMode:'sandbox' as const},13002);
    expect(life.character.cash).toBe(7500);
    expect(hard.character.cash).toBe(5400);
    expect(sandbox.character.cash).toBe(22500);
    expect(hard.gameConfiguration.rules.worldShockMultiplier).toBeGreaterThan(life.gameConfiguration.rules.worldShockMultiplier);
    expect(sandbox.gameConfiguration.rules.worldShockMultiplier).toBeLessThan(life.gameConfiguration.rules.worldShockMultiplier);
  });

  it('makes Sandbox block configured random mortality',()=>{
    const world=createWorld({...draft,age:85,gameMode:'sandbox' as const},13003);
    world.character.human.health.physicalCondition=2;world.character.human.health.mentalLoad=95;world.character.human.health.sleepDebt=95;
    const events=simulateConfiguredMortality(world,world.date,new SeededRng(77));
    expect(events).toEqual([]);
    expect(world.deathRecords).toEqual([]);
    expect(world.gameConfiguration.rules.allowPrematureDeath).toBe(false);
  });

  it('creates the configured persistent starting family for a minor',()=>{
    const world=createWorld({...draft,age:12,familyStructure:'two_parent' as const,siblingCount:2,parentCloseness:91},13004);
    expect(world.npcs.filter(n=>n.role==='Parent')).toHaveLength(2);
    expect(world.npcs.filter(n=>n.role==='Sibling')).toHaveLength(2);
    expect(world.familyLinks.filter(f=>f.fromId===world.character.id&&f.relation==='sibling')).toHaveLength(2);
    const home=world.households.find(h=>!h.endedDate&&h.memberIds.includes(world.character.id))!;
    expect(home.memberIds).toEqual(expect.arrayContaining(['npc-parent','npc-parent-2','npc-sibling-1','npc-sibling-2']));
    expect(home.responsibleAdultIds).not.toContain(world.character.id);
  });

  it('keeps adult family relationships without forcing co-residence',()=>{
    const world=createWorld({...draft,age:35,familyStructure:'two_parent' as const,siblingCount:1},13005);
    const home=world.households.find(h=>!h.endedDate&&h.memberIds.includes(world.character.id))!;
    expect(world.npcs.filter(n=>n.role==='Parent')).toHaveLength(2);
    expect(world.npcs.filter(n=>n.role==='Sibling')).toHaveLength(1);
    expect(home.memberIds).toEqual([world.character.id]);
  });

  it('applies deterministic scenario starting conditions',()=>{
    const rebuild=createWorld({...draft,gameMode:'scenario' as const,scenarioId:'career_rebuild' as const},13006);
    expect(rebuild.character.career).toBe('Unemployed');
    expect(rebuild.employments.some(e=>e.personId===rebuild.character.id&&e.status==='active')).toBe(false);
    expect(rebuild.events.some(e=>e.id.startsWith('evt-scenario-career-rebuild'))).toBe(true);
    const legacy=createWorld({...draft,gameMode:'legacy' as const},13007);
    expect(legacy.character.human.goals.some(g=>g.title==='Build a lasting family legacy')).toBe(true);
  });

  it('persists explicit accessibility and serious-content choices',()=>{
    const world=createWorld({...draft,accessibility:{textScale:'large' as const,highContrast:true,reducedMotion:true,strongerFocus:true},seriousContent:{allowPrematureDeath:false,allowPregnancyLoss:false,allowViolentCrime:false,allowAddiction:false,allowSevereIllness:false}},13008);
    expect(world.gameConfiguration.accessibility).toEqual({textScale:'large',highContrast:true,reducedMotion:true,strongerFocus:true});
    expect(world.gameConfiguration.seriousContent.allowPrematureDeath).toBe(false);
    expect(world.gameConfiguration.rules.allowPrematureDeath).toBe(false);
  });

  it('migrates a true v11 save to v12 and defaults it to Life Mode',()=>{
    const current=createWorld(draft,13009);
    const {gameConfiguration,...v11}=current;void gameConfiguration;
    const migrated=migrateWorld({...v11,version:11});
    expect(migrated?.version).toBe(12);
    expect(migrated?.gameConfiguration.mode).toBe('life');
    expect(migrated?.cities).toEqual(current.cities);
    expect(migrated?.worldHistory).toEqual(current.worldHistory);
    expect(migrated?.lifestyleProfiles).toEqual(current.lifestyleProfiles);
  });

  it('keeps each configured mode deterministic over time',()=>{
    const a=stepWorld(createWorld({...draft,gameMode:'hard' as const},13010),365);
    const b=stepWorld(createWorld({...draft,gameMode:'hard' as const},13010),365);
    expect(a).toEqual(b);
  });
});
