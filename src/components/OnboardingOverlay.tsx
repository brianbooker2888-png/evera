import { CalendarDays, Globe2, ShieldCheck, Sparkles } from 'lucide-react';
import type { WorldState } from '../types/game';
import { completeOnboarding } from '../simulation/gameConfig';

function modeLabel(world:WorldState){
  const mode=world.gameConfiguration.mode;
  if(mode==='hard')return'Hard Life';
  if(mode==='sandbox')return'Sandbox';
  if(mode==='legacy')return'Legacy';
  if(mode==='scenario')return'Scenario';
  return'Life Mode';
}

export function OnboardingOverlay({world,onChange}:{world:WorldState;onChange:(world:WorldState)=>void}){
  if(world.gameConfiguration.onboarding.completed)return null;
  return <div className="onboarding-backdrop" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
    <section className="onboarding-card">
      <div className="onboarding-mark"><Sparkles size={22}/></div>
      <span className="eyebrow">{modeLabel(world).toUpperCase()}</span>
      <h1 id="onboarding-title">Your life has started. The world already has too.</h1>
      <p className="onboarding-lede">EVERA is not built around perfect choices. People, jobs, money, health and the wider world keep moving, and outcomes can stay uncertain even when you prepare well.</p>
      <div className="onboarding-grid">
        <article><CalendarDays size={20}/><div><b>Control time, not outcomes</b><p>Pause whenever you want. Advance a day or run faster through routine periods. Major events automatically stop the clock.</p></div></article>
        <article><Globe2 size={20}/><div><b>The world does not wait for you</b><p>NPCs, companies, relationships and local conditions can change while you focus somewhere else.</p></div></article>
        <article><ShieldCheck size={20}/><div><b>Your settings travel with this save</b><p>Accessibility and serious-content preferences can be changed later from Timeline without restarting the life.</p></div></article>
      </div>
      <div className="onboarding-actions"><button className="primary big" autoFocus onClick={()=>onChange(completeOnboarding(world))}>Begin living</button></div>
    </section>
  </div>;
}
