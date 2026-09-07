import type { AthleticSet, Character, Npc, TraitSet, WorldState } from '../types/game';
import { SeededRng } from '../simulation/rng';
import { createHumanState, createNpcTraits } from '../simulation/humanFactory';
import { createInitialSecrets } from '../simulation/socialEngine';

interface LegacyNpc {
  id: string;
  name: string;
  role: string;
  age: number;
  location: string;
  affection: number;
  trust: number;
  respect: number;
  resentment: number;
  mood: string;
  activeGoal: string;
}

interface LegacyWorld {
  version: 1;
  seed: number;
  date: string;
  character: Omit<Character, 'human'>;
  npcs: LegacyNpc[];
  ledger: WorldState['ledger'];
  events: WorldState['events'];
  memories: WorldState['memories'];
  economy: WorldState['economy'];
}

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function isV2(value: unknown): value is WorldState {
  return typeof value === 'object' && value !== null && (value as { version?: unknown }).version === 2;
}

function isV1(value: unknown): value is LegacyWorld {
  return typeof value === 'object' && value !== null && (value as { version?: unknown }).version === 1;
}

export function migrateWorld(value: unknown): WorldState | null {
  if (isV2(value)) return value;
  if (!isV1(value)) return null;

  const legacy = value;
  const rng = new SeededRng(legacy.seed ^ 0x45564552);
  const characterHuman = createHumanState(legacy.character.id, legacy.character.traits as TraitSet, legacy.date, rng, {
    fitness: averageAthleticism(legacy.character.athleticism as AthleticSet),
    stress: legacy.character.stress,
    energy: legacy.character.energy,
  });
  const character: Character = { ...legacy.character, human: characterHuman };

  const npcs: Npc[] = legacy.npcs.map((oldNpc, index) => {
    const traits = createNpcTraits(rng, oldNpc.role === 'Parent' ? { familyOrientation: 84, empathy: 74 } : undefined);
    const human = createHumanState(oldNpc.id, traits, legacy.date, rng, { npc: true, stress: oldNpc.mood === 'strained' ? 68 : 28 });
    if (human.goals[0]) human.goals[0].title = oldNpc.activeGoal || human.goals[0].title;
    return {
      id: oldNpc.id,
      name: oldNpc.name,
      role: oldNpc.role,
      age: oldNpc.age,
      location: oldNpc.location,
      tier: index < 2 ? 1 : 2,
      traits,
      human,
      currentFocus: oldNpc.activeGoal || 'current priorities',
      lastSimulatedDate: legacy.date,
    };
  });

  const relationships = legacy.npcs.flatMap(oldNpc => {
    const shared = {
      attraction: 0,
      familiarity: clamp((oldNpc.affection + oldNpc.trust) / 2),
      dependency: clamp(oldNpc.affection * 0.25),
      lastMeaningfulContactDate: legacy.date,
    };
    return [
      {
        id: `rel-${oldNpc.id}-${character.id}`,
        fromId: oldNpc.id,
        toId: character.id,
        affection: oldNpc.affection,
        respect: oldNpc.respect,
        resentment: oldNpc.resentment,
        trust: { emotional: oldNpc.trust, financial: oldNpc.trust, professional: oldNpc.respect, romantic: 0 },
        ...shared,
      },
      {
        id: `rel-${character.id}-${oldNpc.id}`,
        fromId: character.id,
        toId: oldNpc.id,
        affection: oldNpc.affection,
        respect: oldNpc.respect,
        resentment: oldNpc.resentment,
        trust: { emotional: oldNpc.trust, financial: oldNpc.trust, professional: oldNpc.respect, romantic: 0 },
        ...shared,
      },
    ];
  });

  const migrated: WorldState = {
    version: 2,
    seed: legacy.seed,
    date: legacy.date,
    character,
    npcs,
    relationships,
    knowledge: [],
    secrets: [],
    npcActivity: [],
    ledger: legacy.ledger,
    events: legacy.events,
    memories: legacy.memories,
    economy: legacy.economy,
  };
  migrated.secrets = createInitialSecrets(migrated);
  return migrated;
}

function averageAthleticism(a: AthleticSet): number {
  return (a.speed + a.strength + a.endurance + a.agility + a.coordination + a.reaction) / 6;
}
