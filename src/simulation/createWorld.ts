import type { AthleticSet, Character, Npc, RelationshipState, TraitSet, WorldState } from '../types/game';
import { SeededRng } from './rng';
import { createHumanState, createNpcTraits } from './humanFactory';
import { createInitialSecrets } from './socialEngine';

export interface CharacterDraft {
  firstName: string;
  lastName: string;
  age: number;
  sex: 'female' | 'male';
  hometown: string;
  socioeconomicBackground: Character['socioeconomicBackground'];
  ambition: number;
  discipline: number;
  empathy: number;
  athleticism: number;
}

const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
const rolePool = ['Coworker', 'Neighbor', 'Classmate', 'Acquaintance', 'Community contact'] as const;
const firstNames = ['Avery', 'Cameron', 'Darius', 'Elena', 'Imani', 'Jonah', 'Leah', 'Maya', 'Noah', 'Riley', 'Sofia', 'Theo', 'Zoe', 'Andre', 'Nina', 'Malik'];
const lastNames = ['Reed', 'Torres', 'Nguyen', 'Jackson', 'Patel', 'Miller', 'Brooks', 'Kim', 'Bennett', 'Flores', 'Hayes', 'Coleman', 'Price', 'Diaz', 'Foster', 'Wright'];

function makeRelationship(fromId: string, toId: string, date: string, rng: SeededRng, closeness: number): RelationshipState {
  const centered = (spread: number) => clamp(closeness + (rng.next() - 0.5) * spread);
  return {
    id: `rel-${fromId}-${toId}`,
    fromId,
    toId,
    affection: centered(18),
    respect: centered(16),
    attraction: 0,
    resentment: clamp((rng.next() * 18) * (1 - closeness / 120)),
    familiarity: centered(14),
    dependency: clamp(closeness * 0.32 + rng.next() * 12),
    trust: {
      emotional: centered(18),
      financial: centered(22),
      professional: centered(20),
      romantic: 0,
    },
    lastMeaningfulContactDate: date,
  };
}

function createNpc(id: string, name: string, role: string, age: number, location: string, tier: 1 | 2 | 3, date: string, rng: SeededRng, traitBias?: Partial<TraitSet>): Npc {
  const traits = createNpcTraits(rng, traitBias);
  return {
    id,
    name,
    role,
    age,
    location,
    tier,
    traits,
    human: tier === 3 ? null : createHumanState(id, traits, date, rng, { npc: true, fitness: clamp(45 + rng.next() * 30) }),
    currentFocus: tier === 3 ? 'background life' : 'settling into current priorities',
    lastSimulatedDate: date,
  };
}

export function createWorld(draft: CharacterDraft, seed = Math.floor(Math.random() * 2_147_483_647)): WorldState {
  const now = new Date();
  const date = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
  const birthYear = now.getUTCFullYear() - draft.age;
  const birthDate = `${birthYear}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
  const rng = new SeededRng(seed);

  const traits: TraitSet = {
    analytical: clamp(45 + rng.next() * 40),
    emotional: clamp(45 + rng.next() * 40),
    creativity: clamp(40 + rng.next() * 45),
    discipline: clamp(draft.discipline),
    ambition: clamp(draft.ambition),
    empathy: clamp(draft.empathy),
    confidence: clamp(45 + rng.next() * 40),
    patience: clamp(40 + rng.next() * 45),
    loyalty: clamp(50 + rng.next() * 40),
    impulsivity: clamp(25 + rng.next() * 50),
    riskTolerance: clamp(30 + rng.next() * 55),
    familyOrientation: clamp(45 + rng.next() * 45),
  };
  const a = clamp(draft.athleticism);
  const athleticism: AthleticSet = {
    speed: clamp(a + (rng.next() - 0.5) * 18),
    strength: clamp(a + (rng.next() - 0.5) * 18),
    endurance: clamp(a + (rng.next() - 0.5) * 18),
    agility: clamp(a + (rng.next() - 0.5) * 18),
    coordination: clamp(a + (rng.next() - 0.5) * 18),
    reaction: clamp(a + (rng.next() - 0.5) * 18),
  };
  const startingCash = { struggling: 250, working: 1800, stable: 7500, affluent: 35000, wealthy: 150000 }[draft.socioeconomicBackground];
  const playerHuman = createHumanState('player-1', traits, date, rng, { fitness: a, stress: 25, energy: 82 });
  playerHuman.memories.push({
    id: 'humanmem-player-beginning', ownerId: 'player-1', date, kind: 'identity',
    summary: `${draft.firstName.trim()} remembers this as the beginning of a new chapter in ${draft.hometown.trim()}.`,
    subjectIds: [], significance: 92, emotionalValence: 24, strength: 100, confidence: 100, privacy: 'private',
  });
  const character: Character = {
    id: 'player-1',
    firstName: draft.firstName.trim(),
    lastName: draft.lastName.trim(),
    birthDate,
    sex: draft.sex,
    hometown: draft.hometown.trim(),
    socioeconomicBackground: draft.socioeconomicBackground,
    traits,
    athleticism,
    human: playerHuman,
    cash: startingCash,
    career: draft.age < 18 ? 'Student' : 'Entry-level worker',
    location: draft.hometown.trim(),
    stress: 25,
    energy: 82,
  };

  const npcs: Npc[] = [
    createNpc('npc-parent', `Jordan ${draft.lastName.trim()}`, 'Parent', draft.age + 27, draft.hometown.trim(), 1, date, rng, { familyOrientation: 86, loyalty: 82, empathy: 76 }),
    createNpc('npc-friend', 'Marcus Reed', 'Friend', draft.age, draft.hometown.trim(), 1, date, rng, { ambition: 74, loyalty: 70, empathy: 65 }),
  ];

  for (let i = 0; i < 6; i++) {
    npcs.push(createNpc(`npc-active-${i + 1}`, `${rng.pick(firstNames)} ${rng.pick(lastNames)}`, rng.pick(rolePool), Math.max(16, draft.age + Math.floor((rng.next() - 0.5) * 14)), draft.hometown.trim(), 2, date, rng));
  }
  for (let i = 0; i < 24; i++) {
    npcs.push(createNpc(`npc-background-${i + 1}`, `${rng.pick(firstNames)} ${rng.pick(lastNames)}`, 'Acquaintance', Math.max(16, draft.age + Math.floor((rng.next() - 0.5) * 26)), draft.hometown.trim(), 3, date, rng));
  }

  const relationships: RelationshipState[] = [];
  for (const npc of npcs) {
    const closeness = npc.role === 'Parent' ? 82 : npc.role === 'Friend' ? 68 : npc.tier === 2 ? 26 + rng.next() * 20 : 4 + rng.next() * 15;
    relationships.push(makeRelationship(npc.id, character.id, date, rng, closeness));
    relationships.push(makeRelationship(character.id, npc.id, date, rng, closeness - 2 + rng.next() * 4));
  }

  // A few NPC-to-NPC links create a real social graph before the player touches it.
  for (let i = 2; i < Math.min(8, npcs.length - 1); i += 2) {
    relationships.push(makeRelationship(npcs[i]!.id, npcs[i + 1]!.id, date, rng, 38 + rng.next() * 18));
    relationships.push(makeRelationship(npcs[i + 1]!.id, npcs[i]!.id, date, rng, 36 + rng.next() * 18));
  }

  const world: WorldState = {
    version: 2,
    seed,
    date,
    character,
    npcs,
    relationships,
    knowledge: [
      {
        id: 'know-parent-location', holderId: character.id, subjectId: 'npc-parent', factKey: 'location',
        summary: `Jordan lives in ${draft.hometown.trim()}.`, confidence: 100, privacy: 'personal', sourceId: 'npc-parent', sourceType: 'direct', acquiredDate: date, distortion: 0,
      },
      {
        id: 'know-friend-career', holderId: character.id, subjectId: 'npc-friend', factKey: 'career-focus',
        summary: 'Marcus has been focused on building his career.', confidence: 92, privacy: 'personal', sourceId: 'npc-friend', sourceType: 'told', acquiredDate: date, distortion: 0,
      },
    ],
    secrets: [],
    npcActivity: [],
    ledger: [],
    events: [{
      id: 'evt-start', date, title: 'A new life begins',
      body: 'The world was generated from your starting circumstances. From here, it will continue moving whether or not events go your way.',
      type: 'world', priority: 'major',
    }],
    memories: [{
      id: 'mem-start', date, title: 'The beginning',
      summary: `At age ${draft.age}, ${draft.firstName} begins this chapter of life in ${draft.hometown}.`, significance: 100,
    }],
    economy: { unemploymentRate: 4.4, inflationRate: 2.7, baseInterestRate: 4.5, housingIndex: 1 },
  };
  world.secrets = createInitialSecrets(world);
  return world;
}
