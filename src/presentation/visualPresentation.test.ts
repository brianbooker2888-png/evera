import { describe, expect, it } from 'vitest';
import { createWorld } from '../simulation/createWorld';
import type { SportsFixture } from '../types/sports';
import { currentFamilyIds, matchMomentProgress, matchMomentsForView, sceneKind, visualMemories, visualPerson } from './visualPresentation';

const draft={firstName:'Visual',lastName:'Test',age:31,sex:'male' as const,orientation:'straight' as const,hometown:'Phoenix, Arizona',socioeconomicBackground:'stable' as const,ambition:70,discipline:68,empathy:64,athleticism:60,familyStructure:'two_parent' as const,siblingCount:2};

function fixture(sport:'soccer'|'american_football'):SportsFixture{return{id:`fixture-${sport}`,sport,leagueId:'league',seasonYear:2026,homeTeamId:'home',awayTeamId:'away',date:'2026-09-08',status:'complete',homeScore:2,awayScore:1,moments:[{id:'low',clock:sport==='soccer'?10:55,period:1,teamId:'home',actorId:null,type:'chance',description:'A chance',importance:20},{id:'mid',clock:sport==='soccer'?40:45,period:2,teamId:'away',actorId:null,type:'big_play',description:'A big play',importance:45},{id:'high',clock:sport==='soccer'?75:15,period:4,teamId:'home',actorId:'player-1',type:'score',description:'A score',importance:90}]};}

describe('Phase 14 deterministic presentation helpers',()=>{
  it('derives stable visual-person descriptors from canonical state',()=>{
    const world=createWorld(draft,14001),a=visualPerson(world,world.character.id,world.date,'formal'),b=visualPerson(world,world.character.id,world.date,'formal');
    expect(a).toEqual(b);expect(a?.name).toBe('Visual Test');expect(a?.age).toBe(31);expect(a?.outfit).toBe('formal');
  });

  it('shares a family resemblance key across the configured starting family',()=>{
    const world=createWorld(draft,14002),ids=currentFamilyIds(world),player=visualPerson(world,world.character.id)!;
    expect(ids).toContain('npc-parent');expect(ids).toContain('npc-sibling-1');
    expect(visualPerson(world,'npc-parent')?.familyKey).toBe(player.familyKey);
    expect(visualPerson(world,'npc-sibling-1')?.familyKey).toBe(player.familyKey);
    expect(visualPerson(world,'npc-friend')?.familyKey).not.toBe(player.familyKey);
  });

  it('filters stored match moments without changing the fixture result',()=>{
    const match=fixture('soccer'),score=[match.homeScore,match.awayScore];
    expect(matchMomentsForView(match,'full')).toHaveLength(3);
    expect(matchMomentsForView(match,'extended').map(m=>m.id)).toEqual(['mid','high']);
    expect(matchMomentsForView(match,'key_moments').map(m=>m.id)).toEqual(['high']);
    expect(matchMomentsForView(match,'result')).toEqual([]);
    expect([match.homeScore,match.awayScore]).toEqual(score);
  });

  it('maps soccer and football clocks into chronological field progress',()=>{
    const soccer=fixture('soccer'),football=fixture('american_football');
    expect(matchMomentProgress(soccer,soccer.moments[1]!)).toBeCloseTo(40/90,5);
    expect(matchMomentProgress(football,football.moments[1]!)).toBeCloseTo(.25,5);
  });

  it('classifies important life memories into major-scene presentation categories',()=>{
    expect(sceneKind('You got married')).toBe('wedding');
    expect(sceneKind('A new child was born')).toBe('birth');
    expect(sceneKind('You were promoted')).toBe('promotion');
    expect(sceneKind('Hospital stay')).toBe('hospital');
  });

  it('builds visual memory cards only from recorded memories and milestones',()=>{
    const world=createWorld(draft,14003);world.memories.unshift({id:'mem-wedding',date:world.date,title:'You got married',summary:'A marriage became part of your life history.',significance:96});
    const cards=visualMemories(world,4);expect(cards.some(c=>c.id==='mem-wedding'&&c.scene==='wedding')).toBe(true);expect(cards.every(c=>c.source==='memory'||c.source==='lifestyle')).toBe(true);
  });
});
