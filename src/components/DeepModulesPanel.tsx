import { useState } from 'react';
import { Activity, BriefcaseBusiness, Building2, Dumbbell, Goal, Shield, Trophy, Users, Warehouse } from 'lucide-react';
import type { WorldState } from '../types/game';
import type { SportKind } from '../types/sports';
import { setCoachStyle, startAthletePath, startCoachPath, trainSport } from '../simulation/sportsEngine';
import { acceptBusinessOpportunity, hireBusinessEmployee, playerBusiness, setBusinessPricing, setStaffingTarget, startLogisticsBusiness } from '../simulation/businessEngine';
import { ageAt } from '../simulation/familyEngine';

const money=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
const dateFmt=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
const fmtDate=(d:string)=>dateFmt.format(new Date(`${d}T12:00:00Z`));
const soccerPositions=['ST','CM','CB','GK'];
const footballPositions=['QB','RB','WR','LB'];

export function DeepModulesPanel({world,onChange}:{world:WorldState;onChange:(world:WorldState)=>void}){
  return <>
    <SportsPanel world={world} onChange={onChange}/>
    <BusinessPanel world={world} onChange={onChange}/>
  </>;
}

function SportsPanel({world,onChange}:{world:WorldState;onChange:(world:WorldState)=>void}){
  const[chosenSport,setChosenSport]=useState<SportKind>('soccer');
  const[position,setPosition]=useState('ST');
  const age=ageAt(world.character.birthDate,world.date);
  const athlete=world.athleteProfiles.find(p=>p.personId===world.character.id&&p.careerStatus!=='retired');
  const coach=world.coachProfiles.find(p=>p.personId===world.character.id);
  const profile=athlete??coach;
  const team=profile?.teamId?world.sportsTeams.find(t=>t.id===profile.teamId):undefined;
  const stat=profile?world.sportsSeasonStats.find(s=>s.personId===world.character.id&&s.sport===profile.sport):undefined;
  const relevantFixtures=team?world.sportsFixtures.filter(f=>[f.homeTeamId,f.awayTeamId].includes(team.id)).sort((a,b)=>a.date.localeCompare(b.date)):[];
  const lastMatch=[...relevantFixtures].reverse().find(f=>f.status==='complete');
  const nextMatch=relevantFixtures.find(f=>f.status==='scheduled'&&f.date>=world.date);
  const positions=chosenSport==='soccer'?soccerPositions:footballPositions;
  return <Section title="Sports world" subtitle="Soccer and American football use one deterministic match engine. Athlete and coach careers share the same teams, fixtures, standings and history.">
    {!profile?<>
      <div className="module-toggle"><button className={chosenSport==='soccer'?'active':''} onClick={()=>{setChosenSport('soccer');setPosition('ST');}}>Soccer</button><button className={chosenSport==='american_football'?'active':''} onClick={()=>{setChosenSport('american_football');setPosition('QB');}}>American football</button></div>
      <div className="module-grid">
        <article className="module-card"><Goal size={22}/><span className="eyebrow">ATHLETE PATH</span><h3>Enter the player pathway</h3><p>{chosenSport==='soccer'?'Academy or professional placement depends on age.':'Prep, college or professional placement depends on age.'}</p><label className="module-field"><span>Position</span><select value={position} onChange={e=>setPosition(e.target.value)}>{positions.map(p=><option key={p}>{p}</option>)}</select></label><button className="primary" disabled={age<14} onClick={()=>onChange(startAthletePath(world,chosenSport,position))}>Start athlete path</button></article>
        <article className="module-card"><Trophy size={22}/><span className="eyebrow">COACH PATH</span><h3>Lead a team</h3><p>Coaching uses tactics, development and leadership rather than athlete ratings.</p><button className="secondary-btn" disabled={age<22} onClick={()=>onChange(startCoachPath(world,chosenSport))}>{age<22?'Available at age 22':'Start coaching career'}</button></article>
      </div>
    </>:<>
      <article className="module-hero"><div><span className="eyebrow">{athlete?'ATHLETE':'HEAD COACH'} · {profile.sport==='soccer'?'SOCCER':'AMERICAN FOOTBALL'}</span><h3>{team?.name??'Team'}</h3><p>{athlete?`${athlete.position} · rating ${Math.round(athlete.rating)} · potential ${Math.round(athlete.potential)}`:`Reputation ${Math.round(coach!.reputation)} · ${coach!.style} approach`}</p></div><Trophy size={28}/></article>
      {athlete&&<div className="module-stats"><Stat label="Fitness" value={Math.round(athlete.fitness)}/><Stat label="Fatigue" value={Math.round(athlete.fatigue)}/><Stat label="Morale" value={Math.round(athlete.morale)}/><Stat label="Injury" value={athlete.injuryStatus}/></div>}
      {coach&&<div className="module-stats"><Stat label="Tactical" value={Math.round(coach.tactical)}/><Stat label="Development" value={Math.round(coach.development)}/><Stat label="Leadership" value={Math.round(coach.leadership)}/><Stat label="Reputation" value={Math.round(coach.reputation)}/></div>}
      {athlete&&<div className="module-actions"><button className="secondary-btn" onClick={()=>onChange(trainSport(world,athlete.sport,'skills'))}><Dumbbell size={15}/>Skills</button><button className="secondary-btn" onClick={()=>onChange(trainSport(world,athlete.sport,'fitness'))}><Activity size={15}/>Fitness</button><button className="secondary-btn" onClick={()=>onChange(trainSport(world,athlete.sport,'recovery'))}>Recovery</button></div>}
      {coach&&<div className="module-actions"><button className="secondary-btn" onClick={()=>onChange(setCoachStyle(world,coach.sport,'aggressive'))}>Aggressive</button><button className="secondary-btn" onClick={()=>onChange(setCoachStyle(world,coach.sport,'balanced'))}>Balanced</button><button className="secondary-btn" onClick={()=>onChange(setCoachStyle(world,coach.sport,'conservative'))}>Conservative</button></div>}
      {stat&&<article className="module-card"><span className="eyebrow">SEASON {stat.seasonYear}</span><h3>{stat.games} games · {stat.wins}-{stat.losses}</h3><p>{profile.sport==='soccer'?`${stat.goals} goals · ${stat.assists} assists · ${stat.saves} saves`:`${stat.passingYards} pass yds · ${stat.rushingYards} rush yds · ${stat.receivingYards} rec yds · ${stat.touchdowns} TD`}</p></article>}
      {nextMatch&&<article className="fixture-card"><span className="eyebrow">NEXT MATCH · {fmtDate(nextMatch.date)}</span><h3>{teamName(world,nextMatch.homeTeamId)} vs {teamName(world,nextMatch.awayTeamId)}</h3></article>}
      {lastMatch&&<article className="fixture-card"><span className="eyebrow">LAST MATCH</span><h3>{teamName(world,lastMatch.homeTeamId)} {lastMatch.homeScore} – {lastMatch.awayScore} {teamName(world,lastMatch.awayTeamId)}</h3><div className="moment-list">{lastMatch.moments.filter(m=>m.importance>=60).slice(-5).map(m=><small key={m.id}>{m.description}</small>)}</div></article>}
    </>}
    <div className="league-grid">{world.sportsLeagues.filter(l=>l.tier==='professional').map(l=><article className="league-card" key={l.id}><span className="eyebrow">{l.sport==='soccer'?'SOCCER':'FOOTBALL'}</span><h3>{l.name}</h3>{l.teamIds.map(id=>world.sportsTeams.find(t=>t.id===id)).filter(Boolean).sort((a,b)=>(b!.wins*3+b!.draws)-(a!.wins*3+a!.draws)).map(t=><div className="standing" key={t!.id}><span>{t!.name}</span><b>{t!.wins}-{t!.losses}{t!.sport==='soccer'?`-${t!.draws}`:''}</b></div>)}</article>)}</div>
  </Section>;
}

function BusinessPanel({world,onChange}:{world:WorldState;onChange:(world:WorldState)=>void}){
  const business=playerBusiness(world),checking=world.financialAccounts.find(a=>a.id==='account-checking-player');
  if(!business)return <Section title="Logistics & warehousing business" subtitle="The first deep entrepreneurship module uses separate business finances and operating KPIs."><article className="module-card"><Warehouse size={24}/><span className="eyebrow">START A COMPANY</span><h3>Build a logistics operation</h3><p>Start with a small warehouse, two employees and a pilot customer. Startup capital required: {money.format(5000)}.</p><button className="primary" disabled={(checking?.balance??0)<5000} onClick={()=>onChange(startLogisticsBusiness(world,'Desert Flow Logistics'))}>Start logistics business</button></article></Section>;
  const latest=world.logisticsKpis.find(k=>k.businessId===business.id),employees=world.businessEmployees.filter(e=>e.businessId===business.id&&e.active),facilities=world.warehouseFacilities.filter(f=>f.businessId===business.id),contracts=world.logisticsContracts.filter(c=>c.businessId===business.id&&c.status==='active'),ops=world.businessOpportunities.filter(o=>!o.accepted&&o.expiresDate>=world.date);
  return <Section title={business.name} subtitle="Business cash and debt are separate from household money.">
    <div className="module-stats"><Stat label="Business cash" value={money.format(business.cash)}/><Stat label="Valuation" value={money.format(business.valuation)}/><Stat label="Debt" value={money.format(business.debt)}/><Stat label="Reputation" value={Math.round(business.reputation)}/></div>
    {latest&&<div className="kpi-grid"><Stat label="Service" value={`${latest.serviceLevel.toFixed(1)}%`}/><Stat label="Productivity" value={latest.productivity.toFixed(1)}/><Stat label="Inventory" value={`${latest.inventoryAccuracy.toFixed(1)}%`}/><Stat label="Safety" value={latest.safety.toFixed(1)}/><Stat label="Utilization" value={`${latest.facilityUtilization.toFixed(1)}%`}/><Stat label="Op profit" value={money.format(latest.operatingProfit)}/></div>}
    <div className="module-grid"><article className="module-card"><Users size={20}/><span className="eyebrow">WORKFORCE</span><h3>{employees.length} employees</h3><p>Staffing target: {business.staffingTarget}</p><div className="module-actions"><button className="secondary-btn" onClick={()=>onChange(hireBusinessEmployee(world,'associate'))}>Hire associate</button><button className="secondary-btn" onClick={()=>onChange(hireBusinessEmployee(world,'supervisor'))}>Hire supervisor</button><button className="secondary-btn" onClick={()=>onChange(setStaffingTarget(world,business.staffingTarget+1))}>Target +1</button></div></article>
      <article className="module-card"><Building2 size={20}/><span className="eyebrow">NETWORK</span><h3>{facilities.length} facilities · {contracts.length} contracts</h3><p>Pricing index: {business.pricingIndex.toFixed(2)}×</p><div className="module-actions"><button className="secondary-btn" onClick={()=>onChange(setBusinessPricing(world,business.pricingIndex-.05))}>Price -</button><button className="secondary-btn" onClick={()=>onChange(setBusinessPricing(world,business.pricingIndex+.05))}>Price +</button></div></article></div>
    {facilities.map(f=><article className="facility-card" key={f.id}><Warehouse size={19}/><div><b>{f.squareFeet.toLocaleString()} sq ft warehouse</b><small>{f.palletCapacity.toLocaleString()} pallet capacity · {money.format(f.monthlyRent)}/mo · {f.utilization.toFixed(1)}% utilized</small></div></article>)}
    {ops.length>0&&<div className="opportunity-grid">{ops.map(op=><article className="module-card" key={op.id}><BriefcaseBusiness size={19}/><span className="eyebrow">OPPORTUNITY</span><h3>{op.title}</h3><p>{op.description}</p><button className="secondary-btn" disabled={business.cash<op.requiredCash} onClick={()=>onChange(acceptBusinessOpportunity(world,op.id))}>Commit {money.format(op.requiredCash)}</button></article>)}</div>}
    {business.status!=='active'&&<article className="module-card danger-card"><Shield size={20}/><h3>Business closed</h3><p>The company’s operating history remains in the world even though it is no longer active.</p></article>}
  </Section>;
}

function teamName(world:WorldState,id:string){return world.sportsTeams.find(t=>t.id===id)?.name??'Team';}
function Stat({label,value}:{label:string;value:string|number}){return <div className="module-stat"><small>{label}</small><strong>{value}</strong></div>;}
function Section({title,subtitle,children}:{title:string;subtitle?:string;children:React.ReactNode}){return <section className="section"><header><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</header><div className="section-body">{children}</div></section>;}
