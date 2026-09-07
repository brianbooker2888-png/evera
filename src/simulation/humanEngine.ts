import type { Goal, HumanMemory, HumanState, Npc, NpcActivity, RelationshipState, WorldState } from '../types/game';
import { SeededRng } from './rng';
import { createHumanState } from './humanFactory';

const clamp = (value: number) => Math.max(0, Math.min(100, value));

export function deriveSeed(seed: number, key: string): number {
  let h = seed >>> 0 || 1;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 2654435761) >>> 0;
  return h || 1;
}

function needPressure(human: HumanState, domain: Goal['domain']): number {
  const n = human.needs;
  switch (domain) {
    case 'career': return (100 - n.purpose) * 0.55 + (100 - n.security) * 0.25;
    case 'financial':
    case 'security': return 100 - n.security;
    case 'relationship':
    case 'family':
    case 'social': return 100 - n.socialConnection;
    case 'health': return (100 - n.physicalEnergy) * 0.5 + human.health.mentalLoad * 0.35 + human.health.injuryBurden * 0.4;
    case 'education': return (100 - n.purpose) * 0.35;
    case 'lifestyle': return (100 - n.autonomy) * 0.55 + (100 - n.recreation) * 0.35;
  }
}

function traitFit(npc: Npc, domain: Goal['domain']): number {
  const t = npc.traits;
  switch (domain) {
    case 'career': return t.ambition * 0.65 + t.discipline * 0.35;
    case 'financial':
    case 'security': return t.discipline * 0.55 + (100 - t.impulsivity) * 0.25 + t.analytical * 0.2;
    case 'relationship':
    case 'family':
    case 'social': return t.empathy * 0.45 + t.familyOrientation * 0.35 + t.loyalty * 0.2;
    case 'health': return t.discipline * 0.7 + t.patience * 0.3;
    case 'education': return t.analytical * 0.45 + t.creativity * 0.25 + t.discipline * 0.3;
    case 'lifestyle': return t.riskTolerance * 0.4 + t.confidence * 0.25 + t.creativity * 0.2;
  }
}

function goalUtility(npc: Npc, goal: Goal): number {
  if (!npc.human) return -Infinity;
  return goal.priority * 0.58 + needPressure(npc.human, goal.domain) * 0.27 + traitFit(npc, goal.domain) * 0.15;
}

function chooseGoal(npc: Npc): Goal | null {
  if (!npc.human) return null;
  const active = npc.human.goals.filter(g => g.status === 'active');
  if (!active.length) return null;
  return active.reduce((best, goal) => goalUtility(npc, goal) > goalUtility(npc, best) ? goal : best);
}

function actionFor(goal: Goal, npc: Npc, rng: SeededRng): string {
  const options: Record<Goal['domain'], readonly string[]> = {
    career: ['worked toward a stronger role', 'took on visible responsibility', 'looked for a better career opportunity'],
    financial: ['reviewed spending and savings', 'made a deliberate money decision', 'worked on improving financial stability'],
    security: ['put more attention on long-term security', 'avoided an unnecessary risk', 'worked on strengthening their financial cushion'],
    relationship: ['made time for someone important', 'checked in with a close relationship', 'tried to repair a strained connection'],
    family: ['made family time a priority', 'handled a family responsibility', 'showed up for someone in the family'],
    health: ['made time for recovery and health', 'followed through on a healthier routine', 'pulled back from avoidable stress'],
    education: ['spent time learning something useful', 'worked on a skill that could open future options', 'studied toward a longer-term goal'],
    social: ['reconnected with someone', 'accepted a social opportunity', 'made time for friendship'],
    lifestyle: ['protected some personal time', 'made space for recreation', 'changed part of their routine to regain autonomy'],
  };
  const prefix = npc.name.split(' ')[0];
  return `${prefix} ${rng.pick(options[goal.domain])}.`;
}

function applyGoalAction(npc: Npc, goal: Goal, rng: SeededRng, date: string): void {
  if (!npc.human) return;
  const human = npc.human;
  const progressGain = 1.5 + rng.next() * 4 + npc.traits.discipline * 0.018;
  goal.progress = clamp(goal.progress + progressGain);
  goal.lastEvaluatedDate = date;
  if (goal.progress >= 100) goal.status = 'completed';

  switch (goal.domain) {
    case 'career':
    case 'education':
      human.needs.purpose = clamp(human.needs.purpose + 2.8);
      human.needs.recreation = clamp(human.needs.recreation - 1.8);
      human.health.mentalLoad = clamp(human.health.mentalLoad + 1.1);
      break;
    case 'financial':
    case 'security':
      human.needs.security = clamp(human.needs.security + 3.4);
      human.needs.recreation = clamp(human.needs.recreation - 0.8);
      break;
    case 'relationship':
    case 'family':
    case 'social':
      human.needs.socialConnection = clamp(human.needs.socialConnection + 4.2);
      human.needs.autonomy = clamp(human.needs.autonomy - 0.8);
      break;
    case 'health':
      human.needs.physicalEnergy = clamp(human.needs.physicalEnergy + 4.5);
      human.health.mentalLoad = clamp(human.health.mentalLoad - 3.2);
      human.health.fitness = clamp(human.health.fitness + 0.6);
      break;
    case 'lifestyle':
      human.needs.autonomy = clamp(human.needs.autonomy + 3.4);
      human.needs.recreation = clamp(human.needs.recreation + 4.2);
      break;
  }
}

function updateMood(human: HumanState): void {
  const pressure = human.health.mentalLoad + human.health.sleepDebt * 0.35 + (100 - human.needs.security) * 0.2;
  const support = human.needs.socialConnection * 0.25 + human.needs.purpose * 0.2 + human.needs.recreation * 0.12;
  const valence = clamp(48 + support * 0.35 - pressure * 0.28);
  const arousal = clamp(30 + human.health.mentalLoad * 0.55 + (100 - human.needs.physicalEnergy) * 0.18);
  let label = 'steady';
  if (human.health.mentalLoad > 72) label = 'strained';
  else if (human.needs.physicalEnergy < 35) label = 'drained';
  else if (valence > 68) label = 'upbeat';
  else if (human.needs.socialConnection < 38) label = 'withdrawn';
  else if (human.needs.purpose < 38) label = 'restless';
  human.mood = { label, valence, arousal };
}

function practiceHabits(human: HumanState, traitsDiscipline: number, rng: SeededRng, date: string): void {
  for (const habit of human.habits) {
    const chance = clamp((habit.consistency * 0.62 + traitsDiscipline * 0.28 + habit.strength * 0.1)) / 100;
    if (rng.chance(chance)) {
      habit.lastPracticedDate = date;
      habit.strength = clamp(habit.strength + 0.08 + traitsDiscipline / 1800);
      habit.consistency = clamp(habit.consistency + 0.05);
      if (habit.domain === 'sleep') {
        human.needs.physicalEnergy = clamp(human.needs.physicalEnergy + 1.4);
        human.health.sleepDebt = clamp(human.health.sleepDebt - 1.5);
      } else if (habit.domain === 'fitness') {
        human.health.fitness = clamp(human.health.fitness + 0.08);
        human.health.mentalLoad = clamp(human.health.mentalLoad - 0.35);
      } else if (habit.domain === 'social') {
        human.needs.socialConnection = clamp(human.needs.socialConnection + 0.6);
      } else if (habit.domain === 'finance') {
        human.needs.security = clamp(human.needs.security + 0.3);
      }
    } else {
      habit.consistency = clamp(habit.consistency - 0.035);
    }
  }
}

function passiveDailyDrift(human: HumanState, rng: SeededRng): void {
  human.needs.physicalEnergy = clamp(human.needs.physicalEnergy - 0.8 + rng.next() * 1.1);
  human.needs.socialConnection = clamp(human.needs.socialConnection - 0.18);
  human.needs.autonomy = clamp(human.needs.autonomy - 0.12);
  human.needs.security = clamp(human.needs.security - 0.06);
  human.needs.purpose = clamp(human.needs.purpose - 0.08);
  human.needs.recreation = clamp(human.needs.recreation - 0.22);
  human.health.sleepDebt = clamp(human.health.sleepDebt + 0.35 + rng.next() * 0.25);
  human.health.mentalLoad = clamp(human.health.mentalLoad + (rng.next() - 0.48) * 0.6);
}

export function simulatePlayerHumanState(world: WorldState, date: string, rng: SeededRng): void {
  const human = world.character.human;
  passiveDailyDrift(human, rng);
  practiceHabits(human, world.character.traits.discipline, rng, date);
  updateMood(human);
  world.character.energy = human.needs.physicalEnergy;
  world.character.stress = human.health.mentalLoad;
}

export function simulateNpcs(world: WorldState, date: string, rng: SeededRng): NpcActivity[] {
  const activities: NpcActivity[] = [];
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();

  for (const npc of world.npcs) {
    if (npc.tier === 3 || !npc.human) continue;
    passiveDailyDrift(npc.human, rng);
    practiceHabits(npc.human, npc.traits.discipline, rng, date);
    updateMood(npc.human);
    npc.lastSimulatedDate = date;

    // Tier 1 characters make a deliberate goal-directed decision weekly.
    // Tier 2 characters do it every other week on average, preserving depth where it matters most.
    const decisionDay = weekday === 0 && (npc.tier === 1 || rng.chance(0.5));
    if (!decisionDay) continue;

    const chosen = chooseGoal(npc);
    if (!chosen) continue;
    const action = actionFor(chosen, npc, rng);
    applyGoalAction(npc, chosen, rng, date);
    npc.currentFocus = chosen.domain;
    activities.push({
      id: `act-${npc.id}-${date}-${chosen.domain}`,
      npcId: npc.id,
      date,
      action,
      domain: chosen.domain,
      visibleToPlayer: npc.tier === 1 && rng.chance(0.42),
    });
  }

  return activities;
}

export function decayHumanMemories(world: WorldState, date: string): void {
  const people: Array<{ human: HumanState | null }> = [{ human: world.character.human }, ...world.npcs.map(n => ({ human: n.human }))];
  for (const person of people) {
    if (!person.human) continue;
    person.human.memories = person.human.memories
      .map(memory => ({
        ...memory,
        strength: clamp(memory.strength - Math.max(0.05, (100 - memory.significance) / 900)),
      }))
      .filter(memory => memory.strength >= 8 || memory.significance >= 70)
      .slice(-250);
  }
}

export function addHumanMemory(human: HumanState, memory: HumanMemory): void {
  const existing = human.memories.find(m => m.id === memory.id);
  if (existing) {
    existing.strength = clamp(existing.strength + 12);
    existing.significance = Math.max(existing.significance, memory.significance);
    return;
  }
  human.memories.push(memory);
  if (human.memories.length > 250) human.memories.splice(0, human.memories.length - 250);
}

export function hydrateNpcIfNeeded(world: WorldState, npc: Npc, date: string): void {
  if (npc.human) return;
  const rng = new SeededRng(deriveSeed(world.seed, `hydrate:${npc.id}:${date}`));
  npc.human = createHumanState(npc.id, npc.traits, date, rng, { npc: true, fitness: 54 });
}

export function reconcileNpcTiers(world: WorldState, date: string): void {
  for (const npc of world.npcs) {
    const toPlayer = world.relationships.find(r => r.fromId === npc.id && r.toId === world.character.id);
    const relevance = toPlayer ? toPlayer.familiarity * 0.55 + toPlayer.affection * 0.25 + toPlayer.respect * 0.2 : 0;
    if (npc.tier === 3 && relevance >= 42) {
      npc.tier = 2;
      hydrateNpcIfNeeded(world, npc, date);
    } else if (npc.tier === 2 && relevance >= 72) {
      npc.tier = 1;
      hydrateNpcIfNeeded(world, npc, date);
    } else if (npc.tier === 2 && relevance < 18 && npc.role === 'Acquaintance') {
      npc.tier = 3;
      npc.human = null;
      npc.currentFocus = 'background life';
    }
  }
}

export function relationshipSignal(relationship: RelationshipState | undefined): string {
  if (!relationship) return 'You do not know each other well.';
  const trust = (relationship.trust.emotional + relationship.trust.financial + relationship.trust.professional + relationship.trust.romantic) / 4;
  const warmth = relationship.affection * 0.4 + relationship.respect * 0.25 + trust * 0.2 + relationship.familiarity * 0.15 - relationship.resentment * 0.35;
  if (warmth >= 78) return 'The relationship feels deeply secure.';
  if (warmth >= 62) return relationship.resentment > 30 ? 'There is real warmth, but some tension has built.' : 'The relationship feels warm and dependable.';
  if (warmth >= 45) return relationship.resentment > 42 ? 'Things feel strained beneath the surface.' : 'The relationship feels familiar and steady.';
  if (warmth >= 28) return 'There is noticeable distance between you.';
  return 'The relationship feels seriously strained.';
}

export function needSignal(human: HumanState): string[] {
  const signals: Array<[number, string]> = [
    [100 - human.needs.physicalEnergy, 'You have been running low on energy.'],
    [100 - human.needs.socialConnection, 'You have been feeling less connected to people lately.'],
    [100 - human.needs.autonomy, 'Your schedule has started to feel restrictive.'],
    [100 - human.needs.security, 'Financial or personal security has been weighing on you.'],
    [100 - human.needs.purpose, 'You have been questioning whether your routine is moving you forward.'],
    [100 - human.needs.recreation, 'You have not made much room for yourself lately.'],
    [human.health.mentalLoad, 'The pressure you are carrying has been building.'],
    [human.health.sleepDebt, 'Your sleep has not been fully restorative.'],
  ];
  return signals.sort((a, b) => b[0] - a[0]).filter(([score]) => score >= 42).slice(0, 3).map(([, text]) => text);
}

export function habitSignal(human: HumanState): Array<{ name: string; signal: string }> {
  return human.habits.map(habit => ({
    name: habit.name,
    signal: habit.consistency >= 74 ? 'well established' : habit.consistency >= 48 ? 'fairly consistent' : habit.consistency >= 28 ? 'inconsistent' : 'struggling to stick',
  }));
}
