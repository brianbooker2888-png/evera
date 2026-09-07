export type GameMode='life'|'hard'|'sandbox'|'legacy'|'scenario';
export type ScenarioId='none'|'fresh_start'|'career_rebuild'|'legacy_seed';
export type TextScale='standard'|'large'|'extra_large';

export interface GameRules{
  startingCashMultiplier:number;
  mortalityMultiplier:number;
  worldShockMultiplier:number;
  economicPressureMultiplier:number;
  allowPrematureDeath:boolean;
  revealExtraDecisionContext:boolean;
  legacyFocus:boolean;
}

export interface SeriousContentSettings{
  allowPrematureDeath:boolean;
  allowPregnancyLoss:boolean;
  allowViolentCrime:boolean;
  allowAddiction:boolean;
  allowSevereIllness:boolean;
}

export interface AccessibilitySettings{
  textScale:TextScale;
  highContrast:boolean;
  reducedMotion:boolean;
  strongerFocus:boolean;
}

export interface OnboardingState{
  completed:boolean;
  dismissedHints:string[];
}

export interface GameConfiguration{
  mode:GameMode;
  scenarioId:ScenarioId;
  rules:GameRules;
  seriousContent:SeriousContentSettings;
  accessibility:AccessibilitySettings;
  onboarding:OnboardingState;
}

export interface GameplayWorldState{gameConfiguration:GameConfiguration;}
