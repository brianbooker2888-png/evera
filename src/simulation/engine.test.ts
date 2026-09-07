import { describe, expect, it } from 'vitest';
import { createWorld } from './createWorld';
import { setPlayerGoalFocus, stepWorld } from './engine';

const draft = { firstName: 'A', lastName: 'B', age: 25, sex: 'male' as const, hometown: 'Phoenix, Arizona', socioeconomicBackground: 'stable' as const, ambition: 70, discipline: 70, empathy: 60, athleticism: 60 };

describe('simulation determinism', () => {
  it('produces identical worlds from the same seed and steps', () => {
    const a = stepWorld(createWorld(draft, 12345), 365);
    const b = stepWorld(createWorld(draft, 12345), 365);
    expect(a).toEqual(b);
  });

  it('advances the world and maintains bounded human state', () => {
    const start = createWorld(draft, 42);
    const end = stepWorld(start, 365);
    expect(end.date).not.toBe(start.date);
    expect(end.character.energy).toBeGreaterThanOrEqual(0);
    expect(end.character.energy).toBeLessThanOrEqual(100);
    expect(end.character.stress).toBeGreaterThanOrEqual(0);
    expect(end.character.stress).toBeLessThanOrEqual(100);
    expect(end.character.human.needs.security).toBeGreaterThanOrEqual(0);
    expect(end.character.human.needs.security).toBeLessThanOrEqual(100);
  });
});

describe('Phase 2 human simulation', () => {
  it('creates tiered NPCs with deep state only where needed', () => {
    const world = createWorld(draft, 9876);
    expect(world.npcs.filter(n => n.tier === 1).length).toBe(2);
    expect(world.npcs.some(n => n.tier === 2)).toBe(true);
    expect(world.npcs.some(n => n.tier === 3)).toBe(true);
    expect(world.npcs.filter(n => n.tier === 1).every(n => n.human !== null)).toBe(true);
    expect(world.npcs.filter(n => n.tier === 3).every(n => n.human === null)).toBe(true);
  });

  it('lets Tier 1 NPCs pursue goals without player input', () => {
    const world = stepWorld(createWorld(draft, 12345), 120);
    expect(world.npcActivity.length).toBeGreaterThan(0);
    expect(world.npcs.filter(n => n.tier === 1).some(n => n.human?.goals.some(g => g.progress > 0))).toBe(true);
  });

  it('keeps the social truth graph separate from player knowledge', () => {
    const world = createWorld(draft, 12345);
    expect(world.secrets.length).toBeGreaterThan(0);
    expect(world.secrets.some(secret => !secret.knownBy.some(k => k.personId === world.character.id))).toBe(true);
  });

  it('changes player focus immutably', () => {
    const world = createWorld(draft, 12345);
    const target = world.character.human.goals[1]!;
    const oldPriority = target.priority;
    const focused = setPlayerGoalFocus(world, target.id);
    expect(focused.character.human.goals.find(g => g.id === target.id)?.priority).toBeGreaterThanOrEqual(oldPriority);
    expect(world.character.human.goals.find(g => g.id === target.id)?.priority).toBe(oldPriority);
  });
});
