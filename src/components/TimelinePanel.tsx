import { BookOpen, History, Sparkles } from 'lucide-react';
import type { WorldState } from '../types/game';
import { setNarrationMode } from '../narration/narrationEngine';
import { CloudPanel } from './CloudPanel';

const dateFmt=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
const fmtDate=(d:string)=>dateFmt.format(new Date(`${d}T12:00:00Z`));

export function TimelinePanel({world,onChange}:{world:WorldState;onChange:(world:WorldState)=>void}){
  const personal=world.character.human.memories.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,10);
  return <>
    <section className="section"><header><h2>Your autobiography</h2><p>At each completed year boundary, EVERA turns recorded simulation facts into a grounded Life Chapter.</p></header><div className="section-body">
      <article className="narration-settings"><div><Sparkles size={20}/><span><b>Narration mode</b><small>The simulation is authoritative in both modes.</small></span></div><select value={world.narrationSettings.mode} onChange={e=>onChange(setNarrationMode(world,e.target.value as WorldState['narrationSettings']['mode']))}><option value="offline">Offline deterministic</option><option value="enhanced_when_available">Enhanced when available</option></select></article>
      {world.annualLifeChapters.length===0?<div className="chapter-empty"><BookOpen size={28}/><h3>Your first chapter is still being lived.</h3><p>A chapter is archived after a calendar year completes. Offline generation is always available.</p></div>:<div className="chapter-list">{world.annualLifeChapters.map(chapter=><article className="life-chapter" key={chapter.id}><span className="eyebrow">LIFE CHAPTER · {chapter.year}</span><h3>{chapter.title}</h3><p>{chapter.text}</p><small>{chapter.enhanced?'Enhanced narration':'Offline grounded narration'} · {chapter.sourceFactIds.length} recorded facts used</small></article>)}</div>}
    </div></section>
    <CloudPanel world={world} onChange={onChange}/>
    <section className="section"><header><h2>Life timeline</h2></header><div className="section-body">{world.memories.map(m=><article className="memory" key={m.id}><time>{fmtDate(m.date)}</time><div><h3>{m.title}</h3><p>{m.summary}</p></div></article>)}</div></section>
    <section className="section"><header><h2>Personal memory</h2></header><div className="section-body">{personal.length?personal.map(m=><article className="memory subtle" key={m.id}><time>{fmtDate(m.date)}</time><div><span className="eyebrow">{m.kind.toUpperCase()}</span><p>{m.summary}</p></div></article>):<div className="chapter-empty"><History size={24}/><p>No additional long-term memories have formed yet.</p></div>}</div></section>
  </>;
}
