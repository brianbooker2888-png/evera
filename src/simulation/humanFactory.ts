import type { Goal, HumanState, TraitSet, ValueSet } from '../types/game';
import { SeededRng } from './rng';

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const jitter = (rng: SeededRng, center: number, spread = 22) => clamp(center + (rng.next() - 0.5) * spread);

export function createValues(traits: TraitSet, rng: SeededRng): ValueSet {
  return {
    family: jitter(rng, 42 + traits.familyOrientation * 0.48, 18),
    career: jitter(rng, 36 + traits.ambition * 0.5, 20),
    money: jitter(rng, 42 + traits.riskTolerance * 0.18 + traits.ambition * 0.18, 22),
    freedom: jitter(rng, 48 + traits.riskTolerance * 0.22, 22),
    friendship: jitter(rng, 40 + traits.empathy * 0.35, 22),
    stability: jitter(rng, 76 - traits.riskTolerance * 0.3, 20),
    health: jitter(rng, 55 + traits.discipline * 0.18, 18),
    status: jitter(rng, 24 + traits.ambition * 0.36, 26),
    learning: jitter(rng, 35 + traits.analytical * 0.25 + traits.creativity * 0.12, 24),
    adventure: jitter(rng, 24 + traits.riskTolerance * 0.38, 24),
    service: jitter(rng, 22 + traits.empathy * 0.42, 24),
  };
}

function goal(id: string, ownerId: string, domain: Goal['domain'], title: string, priority: number, date: string, isPrivate: boolean): Goal {
  return {
    id,
    ownerId,
    domain,
    title,
    priority: clamp(priority),
    progress: 0,
    status: 'active',
    createdDate: date,
    lastEvaluatedDate: date,
    private: isPrivate,
  };
}

export function createInitialGoals(ownerId: string, traits: TraitSet, values: ValueSet, date: string, isNpc: boolean): Goal[] {
  const candidates = [
    goal(`${ownerId}-goal-career`, ownerId, 'career', 'Build a stronger career', values.career + traits.ambition * 0.2, date, isNpc),
    goal(`${ownerId}-goal-security`, ownerId, 'security', 'Strengthen financial security', values.stability + values.money * 0.2, date, isNpc),
    goal(`${ownerId}-goal-health`, ownerId, 'health', 'Protect long-term health', values.health + traits.discipline * 0.15, date, isNpc),
    goal(`${ownerId}-goal-relationships`, ownerId, 'relationship', 'Invest in close relationships', values.family * 0.55 + values.friendship * 0.45, date, isNpc),
    goal(`${ownerId}-goal-learning`, ownerId, 'education', 'Keep learning and developing', values.learning + traits.analytical * 0.12, date, isNpc),
    goal(`${ownerId}-goal-freedom`, ownerId, 'lifestyle', 'Create more control over daily life', values.freedom + traits.riskTolerance * 0.1, date, isNpc),
  ];
  return candidates.sort((a, b) => b.priority - a.priority).slice(0, 4);
}

export function createHumanState(ownerId: string, traits: TraitSet, date: string, rng: SeededRng, options?: { fitness?: number; stress?: number; energy?: number; npc?: boolean }): HumanState {
  const values = createValues(traits, rng);
  const energy = clamp(options?.energy ?? jitter(rng, 76, 18));
  const stress = clamp(options?.stress ?? jitter(rng, 26, 20));
  const fitness = clamp(options?.fitness ?? jitter(rng, 58, 24));
  const habits = [
    {
      id: `${ownerId}-habit-sleep`,
      name: 'Consistent sleep routine',
      domain: 'sleep' as const,
      strength: clamp(38 + traits.discipline * 0.44),
      consistency: clamp(34 + traits.discipline * 0.5),
      valence: 'helpful' as const,
      lastPracticedDate: date,
    },
    {
      id: `${ownerId}-habit-fitness`,
      name: 'Regular physical activity',
      domain: 'fitness' as const,
      strength: clamp(25 + traits.discipline * 0.25 + fitness * 0.3),
      consistency: clamp(28 + traits.discipline * 0.38),
      valence: 'helpful' as const,
      lastPracticedDate: date,
    },
    {
      id: `${ownerId}-habit-finance`,
      name: 'Intentional money management',
      domain: 'finance' as const,
      strength: clamp(30 + traits.discipline * 0.38 - traits.impulsivity * 0.12),
      consistency: clamp(26 + traits.discipline * 0.42),
      valence: 'helpful' as const,
      lastPracticedDate: date,
    },
    {
      id: `${ownerId}-habit-social`,
      name: 'Stay connected with people',
      domain: 'social' as const,
      strength: clamp(30 + traits.empathy * 0.32 + traits.familyOrientation * 0.16),
      consistency: clamp(32 + traits.empathy * 0.28),
      valence: 'helpful' as const,
      lastPracticedDate: date,
    },
  ];

  return {
    values,
    needs: {
      physicalEnergy: energy,
      socialConnection: jitter(rng, 68, 18),
      autonomy: jitter(rng, 70, 18),
      security: jitter(rng, 68, 22),
      purpose: jitter(rng, 66, 20),
      recreation: jitter(rng, 61, 22),
    },
    health: {
      physicalCondition: jitter(rng, 82, 14),
      mentalLoad: stress,
      sleepDebt: clamp(100 - energy + (rng.next() * 10)),
      fitness,
      injuryBurden: 0,
    },
    habits,
    goals: createInitialGoals(ownerId, traits, values, date, options?.npc ?? false),
    memories: [],
    mood: {
      label: stress > 65 ? 'strained' : energy > 75 ? 'steady' : 'tired',
      valence: clamp(62 - stress * 0.25),
      arousal: clamp(42 + stress * 0.35),
    },
  };
}

export function createNpcTraits(rng: SeededRng, bias?: Partial<TraitSet>): TraitSet {
  const base = (): number => jitter(rng, 56, 44);
  const traits: TraitSet = {
    analytical: base(),
    emotional: base(),
    creativity: base(),
    discipline: base(),
    ambition: base(),
    empathy: base(),
    confidence: base(),
    patience: base(),
    loyalty: base(),
    impulsivity: base(),
    riskTolerance: base(),
    familyOrientation: base(),
  };
  for (const [key, value] of Object.entries(bias ?? {})) {
    if (typeof value === 'number') traits[key as keyof TraitSet] = clamp(value);
  }
  return traits;
}
