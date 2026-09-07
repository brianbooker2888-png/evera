import type { LifeEvent, WorldState } from '../types/game';
import { SeededRng } from './rng';
import { deriveSeed } from './humanEngine';
import { simulateMortality } from './mortalityEstateEngine';
import { isDeceased } from './legacyLegalSeed';

export function simulateConfiguredMortality(world:WorldState,date:string,rng:SeededRng):LifeEvent[]{
  const rules=world.gameConfiguration?.rules;
  if(!rules||rules.mortalityMultiplier<=0||!rules.allowPrematureDeath||!world.gameConfiguration.seriousContent.allowPrematureDeath)return[];
  const events=simulateMortality(world,date,rng);
  if(isDeceased(world,world.character.id))return events;
  const extra=Math.max(0,rules.mortalityMultiplier-1);
  if(extra>0&&rng.chance(Math.min(1,extra))){
    const extraRng=new SeededRng(deriveSeed(world.seed,`mode-mortality:${date}`));
    events.push(...simulateMortality(world,date,extraRng));
  }
  return events;
}
