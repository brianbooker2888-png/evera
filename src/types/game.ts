export type Sex = 'female' | 'male';
export type Orientation = 'straight' | 'gay' | 'bisexual';
export type NavArea = 'life' | 'people' | 'world' | 'money' | 'timeline';
export type TimeSpeed = 0 | 1 | 5 | 20;
export type NpcTier = 1 | 2 | 3;

export interface TraitSet {
  analytical: number; emotional: number; creativity: number; discipline: number; ambition: number; empathy: number;
  confidence: number; patience: number; loyalty: number; impulsivity: number; riskTolerance: number; familyOrientation: number;
}
export interface ValueSet { family:number; career:number; money:number; freedom:number; friendship:number; stability:number; health:number; status:number; learning:number; adventure:number; service:number; }
export interface AthleticSet { speed:number; strength:number; endurance:number; agility:number; coordination:number; reaction:number; }
export interface NeedSet { physicalEnergy:number; socialConnection:number; autonomy:number; security:number; purpose:number; recreation:number; }
export interface HealthState { physicalCondition:number; mentalLoad:number; sleepDebt:number; fitness:number; injuryBurden:number; }

export type HabitDomain = 'sleep'|'fitness'|'finance'|'social'|'learning'|'work';
export interface Habit { id:string; name:string; domain:HabitDomain; strength:number; consistency:number; valence:'helpful'|'neutral'|'risky'; lastPracticedDate:string|null; }
export type GoalDomain = 'career'|'financial'|'relationship'|'family'|'health'|'education'|'social'|'lifestyle'|'security';
export interface Goal { id:string; ownerId:string; domain:GoalDomain; title:string; priority:number; progress:number; status:'active'|'completed'|'abandoned'|'blocked'; createdDate:string; lastEvaluatedDate:string; private:boolean; }
export type MemoryKind = 'relationship'|'identity'|'world'|'semantic';
export interface HumanMemory { id:string; ownerId:string; date:string; kind:MemoryKind; summary:string; subjectIds:string[]; significance:number; emotionalValence:number; strength:number; confidence:number; privacy:'private'|'shared'|'public'; sourceId?:string; }
export interface HumanState { values:ValueSet; needs:NeedSet; health:HealthState; habits:Habit[]; goals:Goal[]; memories:HumanMemory[]; mood:{label:string; valence:number; arousal:number}; }

export interface RomanticProfile {
  orientation: Orientation;
  relationshipStyle: 'monogamous';
  wantsChildren: 'no'|'not_now'|'maybe'|'yes';
}

export interface Character {
  id:string; firstName:string; lastName:string; birthDate:string; sex:Sex; hometown:string;
  socioeconomicBackground:'struggling'|'working'|'stable'|'affluent'|'wealthy';
  traits:TraitSet; athleticism:AthleticSet; human:HumanState; romantic:RomanticProfile;
  cash:number; career:string; location:string; stress:number; energy:number;
}

export type ChildStage = 'infant'|'toddler'|'child'|'preteen'|'teen'|'young_adult';
export interface ChildDevelopmentState {
  stage: ChildStage;
  attachmentSecurity:number;
  independence:number;
  schoolEngagement:number;
  confidence:number;
  behaviorRegulation:number;
  lastParentingDate:string|null;
}

export interface Npc {
  id:string; name:string; role:string; age:number; birthDate:string; sex:Sex; location:string; tier:NpcTier;
  traits:TraitSet; human:HumanState|null; romantic:RomanticProfile; childDevelopment:ChildDevelopmentState|null;
  currentFocus:string; lastSimulatedDate:string;
}

export interface TrustDomains { emotional:number; financial:number; professional:number; romantic:number; }
export interface RelationshipState {
  id:string; fromId:string; toId:string; affection:number; respect:number; attraction:number; resentment:number;
  familiarity:number; dependency:number; trust:TrustDomains; lastMeaningfulContactDate:string;
}

export type PartnershipStatus = 'dating'|'exclusive'|'engaged'|'married'|'separated'|'divorced'|'ended';
export type FamilyPlan = 'avoid'|'not_now'|'open'|'trying';
export interface PartnershipHistoryEntry { id:string; date:string; kind:'started'|'exclusive'|'moved_in'|'engaged'|'married'|'family_plan'|'child_born'|'separated'|'divorced'|'ended'; summary:string; }
export interface Partnership {
  id:string; personIds:[string,string]; status:PartnershipStatus; startedDate:string; statusSince:string;
  cohabitingHouseholdId:string|null; financeStyle:'separate'|'hybrid'|'joint'; exclusivityExpected:boolean;
  familyPlan:FamilyPlan; history:PartnershipHistoryEntry[];
}

export interface HouseholdLaborAssignment { id:string; task:string; ownerId:string; cadence:'daily'|'weekly'|'monthly'; burden:number; }
export interface HouseholdScheduleEntry { id:string; personId:string; label:string; dayOfWeek:number; startHour:number; endHour:number; }
export interface Household {
  id:string; name:string; memberIds:string[]; location:string; homeType:'apartment'|'townhome'|'house'|'shared'|'temporary';
  monthlyHousingCost:number; responsibleAdultIds:string[]; financeStyle:'separate'|'hybrid'|'joint'; laborAssignments:HouseholdLaborAssignment[];
  schedule:HouseholdScheduleEntry[]; createdDate:string; endedDate:string|null;
}

export interface Pregnancy {
  id:string; pregnantPersonId:string; partnerId:string|null; conceptionDate:string; dueDate:string;
  status:'ongoing'|'birth'|'loss'; planned:boolean; childIds:string[]; outcomeDate:string|null;
}

export type FamilyRelation = 'biological_parent'|'biological_child'|'adoptive_parent'|'adoptive_child'|'step_parent'|'step_child'|'sibling'|'spouse'|'ex_spouse';
export interface FamilyLink { id:string; fromId:string; toId:string; relation:FamilyRelation; establishedDate:string; endedDate:string|null; }

export interface CustodyPlan {
  id:string; childId:string; parentIds:[string,string]; householdIds:[string,string]; arrangement:'shared'|'primary_first'|'primary_second';
  currentHouseholdId:string; monthlySupport:number; supportPayerId:string|null; startDate:string; active:boolean;
}

export type ConversationIntent = 'connect'|'apologize'|'support'|'boundary'|'conflict'|'family'|'money'|'future'|'neutral';
export type ConversationTone = 'warm'|'calm'|'direct'|'defensive'|'hostile'|'uncertain';
export interface ConversationRecord {
  id:string; date:string; personIds:[string,string]; playerText:string; intent:ConversationIntent; tone:ConversationTone; response:string;
}

export interface KnowledgeFact { id:string; holderId:string; subjectId:string; factKey:string; summary:string; confidence:number; privacy:'public'|'personal'|'sensitive'; sourceId:string; sourceType:'direct'|'told'|'inferred'|'rumor'; acquiredDate:string; distortion:number; }
export interface SecretKnowledge { personId:string; since:string; sourceId:string; }
export interface Secret { id:string; subjectId:string; category:'career'|'relationship'|'finance'|'health'|'family'|'personal'; summary:string; sensitivity:number; createdDate:string; knownBy:SecretKnowledge[]; status:'active'|'resolved'; }
export interface NpcActivity { id:string; npcId:string; date:string; action:string; domain:GoalDomain; visibleToPlayer:boolean; }
export interface LedgerEntry { id:string; date:string; description:string; amount:number; category:string; }
export interface LifeEvent { id:string; date:string; title:string; body:string; type:'routine'|'opportunity'|'relationship'|'finance'|'world'; priority:'low'|'medium'|'major'; }
export interface Memory { id:string; date:string; title:string; summary:string; significance:number; }

export interface WorldState {
  version:3; seed:number; date:string; character:Character; npcs:Npc[]; relationships:RelationshipState[];
  partnerships:Partnership[]; households:Household[]; pregnancies:Pregnancy[]; familyLinks:FamilyLink[]; custodyPlans:CustodyPlan[]; conversations:ConversationRecord[];
  knowledge:KnowledgeFact[]; secrets:Secret[]; npcActivity:NpcActivity[]; ledger:LedgerEntry[]; events:LifeEvent[]; memories:Memory[];
  economy:{unemploymentRate:number; inflationRate:number; baseInterestRate:number; housingIndex:number};
}
