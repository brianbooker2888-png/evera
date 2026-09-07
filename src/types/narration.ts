export type NarrationProviderKind='offline'|'remote'|'local_model';
export type NarrationPurpose='dialogue'|'annual_chapter'|'event_summary'|'match_recap'|'business_recap';

export interface VoiceProfile {
  personId:string;
  ageBand:'child'|'teen'|'young_adult'|'adult'|'older_adult';
  warmth:'reserved'|'balanced'|'warm';
  directness:'soft'|'balanced'|'direct';
  expressiveness:'low'|'medium'|'high';
  vocabulary:'simple'|'everyday'|'polished';
  humor:'dry'|'light'|'rare';
  relationshipRegister:'stranger'|'acquaintance'|'friend'|'family'|'partner'|'professional';
}

export interface NarrativeFact {
  id:string;
  category:'identity'|'relationship'|'memory'|'belief'|'career'|'education'|'finance'|'family'|'health'|'sports'|'business'|'world';
  text:string;
  certainty:'canonical'|'believed'|'rumor';
  sourceId:string;
  allowedToStateAsFact:boolean;
}

export interface SceneContextPacket {
  id:string;
  purpose:NarrationPurpose;
  date:string;
  speakerId:string|null;
  listenerId:string|null;
  voice:VoiceProfile|null;
  facts:NarrativeFact[];
  recentEventIds:string[];
  memoryIds:string[];
  constraints:string[];
  toneHint:string;
}

export interface NarrationRequest {
  id:string;
  purpose:NarrationPurpose;
  context:SceneContextPacket;
  playerText?:string;
  deterministicSeed:number;
}

export interface NarrationResponse {
  requestId:string;
  providerId:string;
  providerKind:NarrationProviderKind;
  text:string;
  usedFactIds:string[];
  generatedAt:string;
}

export interface AnnualLifeChapter {
  id:string;
  year:number;
  generatedDate:string;
  providerId:string;
  title:string;
  text:string;
  sourceEventIds:string[];
  sourceMemoryIds:string[];
  sourceFactIds:string[];
  enhanced:boolean;
}

export interface NarrationSettings {
  mode:'offline'|'enhanced_when_available';
  preferredProvider:string;
  allowRemoteNarration:boolean;
}

export interface NarrationWorldState {
  narrationSettings:NarrationSettings;
  annualLifeChapters:AnnualLifeChapter[];
}
