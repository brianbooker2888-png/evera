import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Brain, CalendarDays, CircleDollarSign, Clock3, HeartHandshake, History, Landmark, Pause, Play, RotateCcw, Sparkles, Target, Users, WalletCards } from 'lucide-react';
import type { NavArea, WorldState } from '../types/game';
import { ageOn, setPlayerGoalFocus, stepWorld } from '../simulation/engine';
import { habitSignal, needSignal, relationshipSignal } from '../simulation/humanEngine';
import { visibleKnowledge } from '../simulation/socialEngine';
import { saveWorld } from '../persistence/store';
import { Logo } from './Logo';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const fmtDate = (d: string) => dateFmt.format(new Date(`${d}T12:00:00Z`));

export function AppShell({ initial, onReset }: { initial: WorldState; onReset: () => void }) {
  const [world, setWorld] = useState(initial);
  const [nav, setNav] = useState<NavArea>('life');
  const [speed, setSpeed] = useState<0 | 1 | 5 | 20>(0);
  const lastPausedMajorId = useRef<string | null>(null);

  useEffect(() => { saveWorld(world).catch(console.error); }, [world]);
  useEffect(() => {
    if (speed === 0) return;
    const timer = window.setInterval(() => setWorld(w => stepWorld(w, speed)), 1100);
    return () => window.clearInterval(timer);
  }, [speed]);

  const age = ageOn(world.character.birthDate, world.date);
  const major = world.events.find(e => e.priority === 'major' && e.id !== 'evt-start');
  useEffect(() => {
    if (major && major.id !== lastPausedMajorId.current) {
      lastPausedMajorId.current = major.id;
      setSpeed(0);
    }
  }, [major?.id]);

  const content = useMemo(() => {
    if (nav === 'life') return <Life world={world} age={age} onFocus={goalId => setWorld(w => setPlayerGoalFocus(w, goalId))} />;
    if (nav === 'people') return <People world={world} />;
    if (nav === 'money') return <Money world={world} />;
    if (nav === 'world') return <World world={world} />;
    return <Timeline world={world} />;
  }, [nav, world, age]);

  return <div className="app-shell">
    <header className="topbar">
      <Logo />
      <div className="top-date"><span>{fmtDate(world.date)}</span><small>Age {age} · {world.character.location}</small></div>
      <button className="icon-btn" onClick={() => { setSpeed(0); onReset(); }} title="Start a new world"><RotateCcw size={18} /></button>
    </header>
    <section className="timebar">
      <button className={speed === 0 ? 'active' : ''} onClick={() => setSpeed(0)}><Pause size={16}/>Pause</button>
      {([1,5,20] as const).map(s => <button key={s} className={speed === s ? 'active' : ''} onClick={() => setSpeed(s)}><Play size={15}/>{s}×</button>)}
      <button onClick={() => setWorld(w => stepWorld(w, 1))}><Clock3 size={16}/>Next day</button>
    </section>
    <div className="main-content">{content}</div>
    <nav className="bottom-nav" aria-label="Primary">
      <NavButton icon={<CalendarDays/>} label="Life" active={nav==='life'} onClick={() => setNav('life')} />
      <NavButton icon={<Users/>} label="People" active={nav==='people'} onClick={() => setNav('people')} />
      <NavButton icon={<Landmark/>} label="World" active={nav==='world'} onClick={() => setNav('world')} />
      <NavButton icon={<WalletCards/>} label="Money" active={nav==='money'} onClick={() => setNav('money')} />
      <NavButton icon={<History/>} label="Timeline" active={nav==='timeline'} onClick={() => setNav('timeline')} />
    </nav>
  </div>;
}

function NavButton({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <button className={active ? 'active' : ''} onClick={onClick}>{icon}<span>{label}</span></button>;
}

function Life({ world, age, onFocus }: { world: WorldState; age: number; onFocus: (goalId: string) => void }) {
  const c = world.character;
  const signals = needSignal(c.human);
  const habits = habitSignal(c.human);
  const goals = c.human.goals.filter(g => g.status === 'active').sort((a,b) => b.priority - a.priority);
  return <>
    <section className="identity-card">
      <div className="avatar">{c.firstName[0]}{c.lastName[0]}</div>
      <div><span className="eyebrow">YOUR LIFE</span><h1>{c.firstName} {c.lastName}</h1><p>{age} · {c.career}</p></div>
    </section>
    <div className="metric-grid">
      <Metric label="Cash" value={money.format(c.cash)} detail="Available now" />
      <Metric label="Energy" value={energyLabel(c.energy)} detail="How you seem to be holding up" />
      <Metric label="Pressure" value={stressLabel(c.stress)} detail="Not a diagnosis or score" />
      <Metric label="Mood" value={titleCase(c.human.mood.label)} detail="Current emotional weather" />
    </div>
    <Section title="What you are noticing" subtitle="EVERA keeps the underlying human-state math hidden and surfaces clues instead.">
      {signals.length ? <div className="signal-list">{signals.map(signal => <div className="signal" key={signal}><Brain size={18}/><span>{signal}</span></div>)}</div> : <div className="signal"><Sparkles size={18}/><span>Nothing feels especially out of balance right now.</span></div>}
    </Section>
    <Section title="Your direction" subtitle="These are priorities, not quests. You can lean into one without guaranteeing the outcome.">
      <div className="goal-grid">{goals.map((goal, index) => <article className={`goal-card ${index === 0 ? 'focused' : ''}`} key={goal.id}>
        <div><span className="eyebrow">{goal.domain.toUpperCase()}</span><h3>{goal.title}</h3><p>{goalProgressText(goal.progress)}</p></div>
        <button className="secondary-btn" onClick={() => onFocus(goal.id)}>{index === 0 ? 'Current focus' : 'Prioritize'}</button>
      </article>)}</div>
    </Section>
    <Section title="Habits taking shape" subtitle="Repeated behavior strengthens patterns over time.">
      <div className="habit-list">{habits.map(h => <div className="habit-row" key={h.name}><span>{h.name}</span><small>{h.signal}</small></div>)}</div>
    </Section>
    <Section title="What needs your attention">
      {world.events.slice(0,4).map(e => <article className={`event ${e.priority}`} key={e.id}><span className="eyebrow">{e.type.toUpperCase()} · {fmtDate(e.date)}</span><h3>{e.title}</h3><p>{e.body}</p></article>)}
    </Section>
  </>;
}

function People({ world }: { world: WorldState }) {
  const deep = world.npcs.filter(n => n.tier === 1);
  const active = world.npcs.filter(n => n.tier === 2);
  const background = world.npcs.filter(n => n.tier === 3).length;
  const knowledge = visibleKnowledge(world).slice(0, 8);
  return <>
    <Section title="People in your orbit" subtitle="NPC motives stay private. You see what your character could reasonably observe.">
      {deep.map(n => {
        const rel = world.relationships.find(r => r.fromId === world.character.id && r.toId === n.id);
        const recent = world.npcActivity.find(a => a.npcId === n.id && a.visibleToPlayer);
        return <article className="person-row person-deep" key={n.id}>
          <div className="avatar small">{initials(n.name)}</div>
          <div className="person-copy"><h3>{n.name}</h3><p>{n.role} · {n.location}</p><small>{relationshipSignal(rel)}</small>{n.human && <small>Seems {n.human.mood.label} lately.</small>}{recent && <small className="observed">Recently: {recent.action}</small>}</div>
          <HeartHandshake size={20}/>
        </article>;
      })}
    </Section>
    <Section title="Wider social world" subtitle="People move between simulation tiers as they become more or less relevant to your life.">
      <div className="metric-grid compact"><Metric label="Deeply simulated" value={String(deep.length)} detail="Closest people" /><Metric label="Actively simulated" value={String(active.length)} detail="Your wider orbit" /><Metric label="Background" value={String(background)} detail="Statistical until relevant" /><Metric label="Known facts" value={String(knowledge.length)} detail="Information you actually know" /></div>
      <div className="active-people">{active.slice(0,6).map(n => <div className="active-person" key={n.id}><div className="avatar tiny">{initials(n.name)}</div><span><b>{n.name}</b><small>{n.role}</small></span></div>)}</div>
    </Section>
    <Section title="What you know" subtitle="Information has a source, confidence and privacy level. Unknown facts remain unknown.">
      {knowledge.length ? knowledge.map(k => <article className="knowledge-row" key={k.id}><div><span className="eyebrow">{k.sourceType.toUpperCase()} · {k.privacy.toUpperCase()}</span><p>{k.summary}</p></div></article>) : <Empty text="You have not learned much beyond your immediate relationships yet."/>}
    </Section>
  </>;
}

function Money({ world }: { world: WorldState }) {
  const income = world.ledger.filter(x=>x.amount>0).reduce((a,b)=>a+b.amount,0);
  const out = world.ledger.filter(x=>x.amount<0).reduce((a,b)=>a-b.amount,0);
  return <>
    <div className="metric-grid"><Metric label="Available cash" value={money.format(world.character.cash)} detail="Liquid" /><Metric label="Recorded income" value={money.format(income)} detail="This save history" /><Metric label="Recorded outflow" value={money.format(out)} detail="This save history" /><Metric label="Base rate" value={`${world.economy.baseInterestRate.toFixed(1)}%`} detail="World environment" /></div>
    <Section title="Recent transactions">{world.ledger.length === 0 ? <Empty text="No transactions yet. Time progression will create real ledger entries."/> : world.ledger.slice(0,10).map(t => <div className="transaction" key={t.id}><div><b>{t.description}</b><small>{fmtDate(t.date)} · {t.category}</small></div><strong className={t.amount>=0?'positive':''}>{t.amount>=0?'+':''}{money.format(t.amount)}</strong></div>)}</Section>
  </>;
}

function World({ world }: { world: WorldState }) {
  const privateSecrets = world.secrets.filter(s => !s.knownBy.some(k => k.personId === world.character.id)).length;
  return <>
    <div className="metric-grid"><Metric label="Inflation" value={`${world.economy.inflationRate.toFixed(1)}%`} detail="Annualized environment" /><Metric label="Unemployment" value={`${world.economy.unemploymentRate.toFixed(1)}%`} detail="Labor market" /><Metric label="Housing index" value={world.economy.housingIndex.toFixed(3)} detail="Starting world = 1.000" /><Metric label="Location" value={world.character.location} detail="Current city" /></div>
    <Section title="Living-world engine" subtitle="Human lives continue off-screen without requiring AI calls.">
      <div className="world-engine"><div><Target size={20}/><span><b>{world.npcActivity.length}</b><small>NPC decisions remembered by this save</small></span></div><div><Users size={20}/><span><b>{world.npcs.length}</b><small>People currently represented</small></span></div><div><Brain size={20}/><span><b>Hidden</b><small>{privateSecrets} private truths exist outside your knowledge</small></span></div></div>
    </Section>
    <Section title="World principle"><article className="manifesto"><span className="eyebrow">EVERA RULE 01</span><h2>The world does not exist for you.</h2><p>You exist inside it. Companies, households, economies, relationships and opportunities continue changing whether they help you or not.</p></article></Section>
  </>;
}

function Timeline({ world }: { world: WorldState }) {
  const personalMemories = world.character.human.memories.slice().sort((a,b) => b.date.localeCompare(a.date)).slice(0,10);
  return <>
    <Section title="Life timeline" subtitle="Major events become permanent historical memory.">{world.memories.map(m => <article className="memory" key={m.id}><time>{fmtDate(m.date)}</time><div><h3>{m.title}</h3><p>{m.summary}</p></div></article>)}</Section>
    <Section title="Personal memory" subtitle="Important experiences persist while weaker memories can fade.">{personalMemories.length ? personalMemories.map(m => <article className="memory subtle" key={m.id}><time>{fmtDate(m.date)}</time><div><span className="eyebrow">{m.kind.toUpperCase()}</span><p>{m.summary}</p></div></article>) : <Empty text="No additional long-term memories have formed yet."/>}</Section>
  </>;
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) { return <article className="metric"><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>; }
function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) { return <section className="section"><header><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</header><div className="section-body">{children}</div></section>; }
function Empty({ text }: { text: string }) { return <div className="empty"><CircleDollarSign size={26}/><p>{text}</p></div>; }
function initials(name: string) { return name.split(' ').map(x=>x[0]).join('').slice(0,2); }
function titleCase(value: string) { return value.charAt(0).toUpperCase() + value.slice(1); }
function energyLabel(value: number) { return value >= 78 ? 'Strong' : value >= 58 ? 'Steady' : value >= 38 ? 'Low' : 'Drained'; }
function stressLabel(value: number) { return value >= 76 ? 'Heavy' : value >= 56 ? 'Building' : value >= 34 ? 'Manageable' : 'Light'; }
function goalProgressText(value: number) { return value >= 78 ? 'You have made substantial progress.' : value >= 48 ? 'This has real momentum.' : value >= 18 ? 'You have started moving this forward.' : 'This is still mostly an intention.'; }
