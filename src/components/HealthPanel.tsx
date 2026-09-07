import { HeartPulse, Pill, ReceiptText, ShieldCheck, Stethoscope } from 'lucide-react';
import type { WorldState } from '../types/game';
import type { EncounterKind, MedicalCondition } from '../types/health';
import { getPreventiveCare, seekMedicalCare } from '../simulation/healthEngine';
import { isDeceased } from '../simulation/legacyLegalSeed';
import { LegacyLegalPanel } from './LegacyLegalPanel';
import { LifestylePanel } from './LifestylePanel';

const money=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0});
const dateFmt=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
const fmtDate=(d:string)=>dateFmt.format(new Date(`${d}T12:00:00Z`));
function conditionLabel(c:MedicalCondition){if(c.diagnosisStatus==='suspected')return'Symptoms under observation';if(c.status==='managed')return'Managed';if(c.status==='resolved')return'Resolved';return'Active';}
function careOptions(c:MedicalCondition):{kind:Exclude<EncounterKind,'preventive'>;label:string}[]{if(c.kind==='mental')return[{kind:'therapy',label:'Seek therapy'},{kind:'primary_care',label:'Primary care'}];if(c.kind==='injury')return[{kind:'primary_care',label:'Primary care'},{kind:'urgent_care',label:'Urgent care'},{kind:'emergency',label:'Emergency care'}];return[{kind:'primary_care',label:'Primary care'},{kind:'urgent_care',label:'Urgent care'}];}

export function HealthPanel({world,onChange}:{world:WorldState;onChange:(world:WorldState)=>void}){
  if(isDeceased(world,world.character.id))return <LegacyLegalPanel world={world} onChange={onChange}/>;
  const player=world.character.id,profile=world.healthProfiles.find(p=>p.personId===player),policy=world.insurancePolicies.find(p=>p.kind==='health'&&p.active&&p.ownerIds.includes(player)),conditions=world.medicalConditions.filter(c=>c.personId===player&&c.status!=='resolved'),history=world.medicalEncounters.filter(e=>e.personId===player).slice(0,6),bills=world.medicalBills.filter(b=>b.personId===player&&b.status!=='paid'),meds=world.medications.filter(m=>m.personId===player&&m.active);
  return <><LegacyLegalPanel world={world} onChange={onChange}/><section className="section"><header><h2>Health & healthcare</h2><p>Your underlying risks stay hidden. This view shows what your character could realistically know: symptoms, diagnoses, care, coverage and bills.</p></header><div className="section-body">
    <div className="health-overview"><article><HeartPulse size={20}/><span><b>{conditions.length?`${conditions.length} active health ${conditions.length===1?'issue':'issues'}`:'No active diagnosed or suspected issues'}</b><small>{profile?.lastPreventiveDate?`Last preventive visit ${fmtDate(profile.lastPreventiveDate)}`:'No preventive visit recorded yet'}</small></span></article><article><ShieldCheck size={20}/><span><b>{policy?policy.provider:'No active health coverage'}</b><small>{policy?`${money.format(profile?.deductibleSpentYear??0)} of ${money.format(policy.deductible)} deductible used this year`:'Care is currently paid without an active health policy'}</small></span></article></div>
    <div className="health-actions"><button className="primary" onClick={()=>onChange(getPreventiveCare(world))}><Stethoscope size={16}/>Get preventive care</button></div>
    {conditions.length>0&&<div className="condition-list">{conditions.map(c=><article className="condition-card" key={c.id}><div><span className="eyebrow">{c.kind.toUpperCase()} · {conditionLabel(c).toUpperCase()}</span><h3>{c.diagnosisStatus==='suspected'?'Something feels wrong':c.name}</h3><p>{c.symptomSummary}</p>{c.diagnosisStatus==='diagnosed'&&c.treatmentSummary&&<small>{c.treatmentSummary}</small>}</div><div className="action-row">{careOptions(c).map(option=><button className="secondary-btn" key={option.kind} onClick={()=>onChange(seekMedicalCare(world,c.id,option.kind))}>{option.label}</button>)}</div></article>)}</div>}
    {meds.length>0&&<div className="health-subsection"><h3><Pill size={18}/>Active medications</h3>{meds.map(m=><div className="medical-row" key={m.id}><span><b>{m.name}</b><small>{money.format(m.monthlyCost)}/mo · started {fmtDate(m.startDate)}</small></span><small>{m.adherence>=80?'Taking consistently':m.adherence>=55?'Some doses are being missed':'Adherence has become inconsistent'}</small></div>)}</div>}
    {bills.length>0&&<div className="health-subsection"><h3><ReceiptText size={18}/>Medical bills</h3>{bills.map(b=><div className="medical-row" key={b.id}><span><b>{money.format(b.balance)} remaining</b><small>Opened {fmtDate(b.openedDate)}</small></span><small>{b.status==='past_due'?'Past due':'Current'}</small></div>)}</div>}
    {history.length>0&&<div className="health-subsection"><h3><Stethoscope size={18}/>Recent care</h3>{history.map(e=><div className="medical-row" key={e.id}><span><b>{e.kind.replaceAll('_',' ')}</b><small>{fmtDate(e.date)} · {e.provider}</small></span><small>{money.format(e.patientResponsibility)} patient responsibility</small></div>)}</div>}
  </div></section><LifestylePanel world={world} onChange={onChange}/></>;
}
