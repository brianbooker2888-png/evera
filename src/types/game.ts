export type Sex = 'female' | 'male';
export type NavArea = 'life' | 'people' | 'world' | 'money' | 'timeline';
export type TimeSpeed = 0 | 1 | 5 | 20;
export type NpcTier = 1 | 2 | 3;

export interface TraitSet {
  analytical: number;
  emotional: number;
  creativity: number;
  discipline: number;
  ambition: number;
  empathy: number;
  confidence: number;
  patience: number;
  loyalty: number;
  impulsivity: number;
  riskTolerance: number;
  familyOrientation: number;
}

export interface ValueSet {
  family: number;
  career: number;
  money: number;
  freedom: number;
  friendship: number;
  stability: number;
  health: number;
  status: number;
  learning: number;
  adventure: number;
  service: number;
}

export interface AthleticSet {
  speed: number;
  strength: number;
  endurance: number;
  agility: number;
  coordination: number;
  reaction: number;
}

export interface NeedSet {
  physicalEnergy: number;
  socialConnection: number;
  autonomy: number;
  security: number;
  purpose: number;
  recreation: number;
}

export interface HealthState {
  physicalCondition: number;
  mentalLoad: number;
  sleepDebt: number;
  fitness: number;
  injuryBurden: number;
}

export type HabitDomain = 'sleep' | 'fitness' | 'finance' | 'social' | 'learning' | 'work';
export interface Habit {
  id: string;
  name: string;
  domain: HabitDomain;
  strength: number;
  consistency: number;
  valence: 'helpful' | 'neutral' | 'risky';
  lastPracticedDate: string | null;
}

export type GoalDomain = 'career' | 'financial' | 'relationship' | 'family' | 'health' | 'education' | 'social' | 'lifestyle' | 'security';
export interface Goal {
  id: string;
  ownerId: string;
  domain: GoalDomain;
  title: string;
  priority: number;
  progress: number;
  status: 'active' | 'completed' | 'abandoned' | 'blocked';
  createdDate: string;
  lastEvaluatedDate: string;
  private: boolean;
}

export type MemoryKind = 'relationship' | 'identity' | 'world' | 'semantic';
export interface HumanMemory {
  id: string;
  ownerId: string;
  date: string;
  kind: MemoryKind;
  summary: string;
  subjectIds: string[];
  significance: number;
  emotionalValence: number;
  strength: number;
  confidence: number;
  privacy: 'private' | 'shared' | 'public';
  sourceId?: string;
}

export interface HumanState {
  values: ValueSet;
  needs: NeedSet;
  health: HealthState;
  habits: Habit[];
  goals: Goal[];
  memories: HumanMemory[];
  mood: {
    label: string;
    valence: number;
    arousal: number;
  };
}

export interface Character {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  sex: Sex;
  hometown: string;
  socioeconomicBackground: 'struggling' | 'working' | 'stable' | 'affluent' | 'wealthy';
  traits: TraitSet;
  athleticism: AthleticSet;
  human: HumanState;
  cash: number;
  career: string;
  location: string;
  stress: number;
  energy: number;
}

export interface Npc {
  id: string;
  name: string;
  role: string;
  age: number;
  location: string;
  tier: NpcTier;
  traits: TraitSet;
  human: HumanState | null;
  currentFocus: string;
  lastSimulatedDate: string;
}

export interface TrustDomains {
  emotional: number;
  financial: number;
  professional: number;
  romantic: number;
}

export interface RelationshipState {
  id: string;
  fromId: string;
  toId: string;
  affection: number;
  respect: number;
  attraction: number;
  resentment: number;
  familiarity: number;
  dependency: number;
  trust: TrustDomains;
  lastMeaningfulContactDate: string;
}

export interface KnowledgeFact {
  id: string;
  holderId: string;
  subjectId: string;
  factKey: string;
  summary: string;
  confidence: number;
  privacy: 'public' | 'personal' | 'sensitive';
  sourceId: string;
  sourceType: 'direct' | 'told' | 'inferred' | 'rumor';
  acquiredDate: string;
  distortion: number;
}

export interface SecretKnowledge {
  personId: string;
  since: string;
  sourceId: string;
}

export interface Secret {
  id: string;
  subjectId: string;
  category: 'career' | 'relationship' | 'finance' | 'health' | 'family' | 'personal';
  summary: string;
  sensitivity: number;
  createdDate: string;
  knownBy: SecretKnowledge[];
  status: 'active' | 'resolved';
}

export interface NpcActivity {
  id: string;
  npcId: string;
  date: string;
  action: string;
  domain: GoalDomain;
  visibleToPlayer: boolean;
}

export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface LifeEvent {
  id: string;
  date: string;
  title: string;
  body: string;
  type: 'routine' | 'opportunity' | 'relationship' | 'finance' | 'world';
  priority: 'low' | 'medium' | 'major';
}

export interface Memory {
  id: string;
  date: string;
  title: string;
  summary: string;
  significance: number;
}

export interface WorldState {
  version: 2;
  seed: number;
  date: string;
  character: Character;
  npcs: Npc[];
  relationships: RelationshipState[];
  knowledge: KnowledgeFact[];
  secrets: Secret[];
  npcActivity: NpcActivity[];
  ledger: LedgerEntry[];
  events: LifeEvent[];
  memories: Memory[];
  economy: {
    unemploymentRate: number;
    inflationRate: number;
    baseInterestRate: number;
    housingIndex: number;
  };
}
