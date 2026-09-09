import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CirclePause, CirclePlay, Flag, Goal, RotateCcw } from 'lucide-react';
import type { WorldState } from '../types/game';
import type { MatchMoment, SportsFixture } from '../types/sports';
import { matchMomentLane, matchMomentProgress, matchMomentsForView, type MatchViewMode } from '../presentation/visualPresentation';
import { VisualPerson } from './VisualPerson';

const modes:{id:MatchViewMode;label:string;description:string}[]=[
  {id:'full',label:'Full',description:'Every stored match moment'},
  {id:'extended',label:'Extended',description:'Chances, big plays and scoring'},
  {id:'key_moments',label:'Key moments',description:'Scores, turnovers and decisive events'},
  {id:'result',label:'Result',description:'Final score only'}
];
const dateFmt=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});

function teamName(world:WorldState,id:string){return world.sportsTeams.find(t=>t.id===id)?.name??'Team';}
function momentClock(fixture:SportsFixture,moment:MatchMoment){return fixture.sport==='soccer'?`${moment.clock}'`:`Q${moment.period} · ${Math.floor(moment.clock%15)}:${String(Math.round((moment.clock%1)*60)).padStart(2,'0')}`;}
function eventLabel(moment:MatchMoment){return moment.type.replace('_',' ');}

export function SportsMatchViewer({world,fixture,playerTeamId}:{world:WorldState;fixture:SportsFixture;playerTeamId?:string|null}){
  const[mode,setMode]=useState<MatchViewMode>('key_moments'),[cursor,setCursor]=useState(0),[playing,setPlaying]=useState(false);
  const moments=useMemo(()=>matchMomentsForView(fixture,mode),[fixture,mode]),current=moments[Math.min(cursor,Math.max(0,moments.length-1))]??null;
  useEffect(()=>{setCursor(0);setPlaying(false);},[fixture.id,mode]);
  useEffect(()=>{if(!playing||moments.length<2)return;const timer=window.setInterval(()=>setCursor(c=>{if(c>=moments.length-1){setPlaying(false);return c;}return c+1;}),1500);return()=>window.clearInterval(timer);},[playing,moments.length]);
  const home=teamName(world,fixture.homeTeamId),away=teamName(world,fixture.awayTeamId),playerInMatch=Boolean(playerTeamId&&[fixture.homeTeamId,fixture.awayTeamId].includes(playerTeamId)),progress=current?matchMomentProgress(fixture,current):.5,lane=current?matchMomentLane(current):50,playerMoment=current?.actorId===world.character.id;
  const fieldLabel=current?`${fixture.sport==='soccer'?'Soccer pitch':'American football field'} visualization. ${momentClock(fixture,current)}. ${current.description}`:`${fixture.sport==='soccer'?'Soccer pitch':'American football field'} visualization for ${home} versus ${away}.`;
  return <article className="match-room">
    <header className="match-scoreboard"><div className={fixture.homeTeamId===playerTeamId?'player-side':''}><small>HOME</small><b>{home}</b><strong>{fixture.homeScore}</strong></div><span><em>FINAL</em><small>{dateFmt.format(new Date(`${fixture.date}T12:00:00Z`))}</small></span><div className={fixture.awayTeamId===playerTeamId?'player-side':''}><small>AWAY</small><b>{away}</b><strong>{fixture.awayScore}</strong></div></header>
    <div className="match-view-tabs" role="group" aria-label="Match viewing mode">{modes.map(option=><button key={option.id} type="button" className={mode===option.id?'active':''} aria-pressed={mode===option.id} title={option.description} onClick={()=>setMode(option.id)}>{option.label}</button>)}</div>
    {mode==='result'?<div className="result-only"><Flag aria-hidden="true"/><h3>{fixture.homeScore===fixture.awayScore?'Draw':fixture.homeScore>fixture.awayScore?`${home} won`:`${away} won`}</h3><p>The result comes directly from the deterministic match engine. Switch viewing modes to replay stored moments.</p></div>:<>
      <div className={`match-surface ${fixture.sport==='soccer'?'soccer':'football'}`} role="img" aria-label={fieldLabel}>
        <div className="surface-midline"/>{fixture.sport==='soccer'?<><div className="surface-box left"/><div className="surface-box right"/><div className="center-circle"/></>:<>{Array.from({length:9},(_,i)=><span className="yard-line" style={{left:`${10+i*10}%`}} key={i}/>)}</>}
        <div className="team-shape home">{Array.from({length:fixture.sport==='soccer'?7:6},(_,i)=><i style={{left:`${12+(i%3)*11}%`,top:`${20+(i*17)%62}%`}} key={i}/>)}</div>
        <div className="team-shape away">{Array.from({length:fixture.sport==='soccer'?7:6},(_,i)=><i style={{left:`${64+(i%3)*10}%`,top:`${16+(i*19)%66}%`}} key={i}/>)}</div>
        {current&&<div className={`moment-marker ${current.teamId===fixture.homeTeamId?'home':'away'} ${playerMoment?'player':''}`} style={{left:`${8+progress*84}%`,top:`${lane}%`}}><span>{current.type==='score'?<Goal aria-hidden="true"/>:<Flag aria-hidden="true"/>}</span></div>}
      </div>
      <div className="moment-stage" aria-live={playing?'off':'polite'}>{current?<><div className="moment-meta"><span className="eyebrow">{momentClock(fixture,current)} · {eventLabel(current).toUpperCase()}</span><b>{current.teamId===fixture.homeTeamId?home:away}</b></div><h3>{current.description}</h3><div className="importance-track" aria-hidden="true"><span style={{width:`${current.importance}%`}}/></div><small>Importance {Math.round(current.importance)}/100 · moment {cursor+1} of {moments.length}</small>{playerMoment&&playerInMatch&&<div className="player-moment"><VisualPerson world={world} personId={world.character.id} date={fixture.date} context="athletic" compact caption="You were directly involved in this stored match moment."/></div>}</>:<p className="muted">No stored moments match this viewing mode.</p>}</div>
      <footer className="replay-controls" aria-label="Replay controls"><button type="button" className="secondary-btn" disabled={!moments.length||cursor===0} onClick={()=>setCursor(c=>Math.max(0,c-1))}><ChevronLeft aria-hidden="true"/>Previous</button><button type="button" className="primary mini" disabled={moments.length<2} onClick={()=>setPlaying(p=>!p)}>{playing?<><CirclePause aria-hidden="true"/>Pause</>:<><CirclePlay aria-hidden="true"/>Play</>}</button><button type="button" className="secondary-btn" disabled={!moments.length||cursor>=moments.length-1} onClick={()=>setCursor(c=>Math.min(moments.length-1,c+1))}>Next<ChevronRight aria-hidden="true"/></button><button type="button" className="icon-button" aria-label="Restart replay" disabled={!moments.length} onClick={()=>{setCursor(0);setPlaying(false);}}><RotateCcw aria-hidden="true"/></button></footer>
    </>}
  </article>;
}
