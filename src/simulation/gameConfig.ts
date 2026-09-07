import type { WorldState } from '../types/game';
import type { AccessibilitySettings, GameConfiguration, GameMode, GameplayWorldState, ScenarioId, SeriousContentSettings } from '../types/gameplay';

export const defaultAccessibility:AccessibilitySettings={textScale:'standard',highContrast:false,reducedMotion:false,strongerFocus:false};
export const defaultSeriousContent:SeriousContentSettings={allowPrematureDeath:true,allowPregnancyLoss:true,allowViolentCrime:true,allowAddiction:true,allowSevereIllness:true};

export function configurationForMode(mode:GameMode='life',scenarioId:ScenarioId='none',accessibility?:AccessibilitySettings,seriousContent?:SeriousContentSettings):GameConfiguration{
  const resolvedAccessibility={...defaultAccessibility,...accessibility},resolvedSeriousContent={...defaultSeriousContent,...seriousContent};
  const rules=mode==='hard'
    ?{startingCashMultiplier:.72,mortalityMultiplier:1.3,worldShockMultiplier:1.45,economicPressureMultiplier:1.2,allowPrematureDeath:true,revealExtraDecisionContext:false,legacyFocus:false}
    :mode==='sandbox'
      ?{startingCashMultiplier:3,mortalityMultiplier:0,worldShockMultiplier:.65,economicPressureMultiplier:.65,allowPrematureDeath:false,revealExtraDecisionContext:true,legacyFocus:false}
      :mode==='legacy'
        ?{startingCashMultiplier:1,mortalityMultiplier:1,worldShockMultiplier:1.05,economicPressureMultiplier:1,allowPrematureDeath:true,revealExtraDecisionContext:false,legacyFocus:true}
        :mode==='scenario'
          ?scenarioId==='fresh_start'
            ?{startingCashMultiplier:.2,mortalityMultiplier:1,worldShockMultiplier:1.1,economicPressureMultiplier:1.15,allowPrematureDeath:true,revealExtraDecisionContext:false,legacyFocus:false}
            :scenarioId==='career_rebuild'
              ?{startingCashMultiplier:.6,mortalityMultiplier:1,worldShockMultiplier:1,economicPressureMultiplier:1.1,allowPrematureDeath:true,revealExtraDecisionContext:false,legacyFocus:false}
              :scenarioId==='legacy_seed'
                ?{startingCashMultiplier:1.25,mortalityMultiplier:1.05,worldShockMultiplier:1,economicPressureMultiplier:1,allowPrematureDeath:true,revealExtraDecisionContext:false,legacyFocus:true}
                :{startingCashMultiplier:1,mortalityMultiplier:1,worldShockMultiplier:1,economicPressureMultiplier:1,allowPrematureDeath:true,revealExtraDecisionContext:false,legacyFocus:false}
          :{startingCashMultiplier:1,mortalityMultiplier:1,worldShockMultiplier:1,economicPressureMultiplier:1,allowPrematureDeath:true,revealExtraDecisionContext:false,legacyFocus:false};
  return{mode,scenarioId,rules:{...rules,allowPrematureDeath:rules.allowPrematureDeath&&resolvedSeriousContent.allowPrematureDeath},seriousContent:resolvedSeriousContent,accessibility:resolvedAccessibility,onboarding:{completed:false,dismissedHints:[]}};
}

export function emptyGameplayState():GameplayWorldState{return{gameConfiguration:configurationForMode()};}

export function initializeGameConfiguration(world:WorldState):WorldState{
  world.gameConfiguration??=configurationForMode();
  world.gameConfiguration.accessibility={...defaultAccessibility,...world.gameConfiguration.accessibility};
  world.gameConfiguration.seriousContent={...defaultSeriousContent,...world.gameConfiguration.seriousContent};
  world.gameConfiguration.onboarding??={completed:false,dismissedHints:[]};
  world.gameConfiguration.mode??='life';world.gameConfiguration.scenarioId??='none';
  world.gameConfiguration.rules??=configurationForMode(world.gameConfiguration.mode,world.gameConfiguration.scenarioId,world.gameConfiguration.accessibility,world.gameConfiguration.seriousContent).rules;
  world.gameConfiguration.rules.allowPrematureDeath=world.gameConfiguration.rules.allowPrematureDeath&&world.gameConfiguration.seriousContent.allowPrematureDeath;
  return world;
}

export function applyAccessibilityPreferences(config:GameConfiguration){
  if(typeof document==='undefined')return;
  const root=document.documentElement;
  root.dataset.textScale=config.accessibility.textScale;
  root.dataset.highContrast=String(config.accessibility.highContrast);
  root.dataset.reducedMotion=String(config.accessibility.reducedMotion);
  root.dataset.strongerFocus=String(config.accessibility.strongerFocus);
}
