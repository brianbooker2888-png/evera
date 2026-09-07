import type { LifeEvent, LedgerEntry, Memory, WorldState } from '../types/game';
import { SeededRng } from './rng';
import { addHumanMemory, decayHumanMemories, deriveSeed, reconcileNpcTiers, simulateNpcs, simulatePlayerHumanState } from './humanEngine';
import { simulateSecretsAndKnowledge } from './socialEngine';

const DAY_MS = 86_400_000;
const clamp = (value: number) => Math.max(0, Math.min(100, value));

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function id(prefix: string, date: string, n: number) { return `${prefix}-${date}-${n}`; }

export function ageOn(birthDate: string, date: string): number {
  const birth = new Date(`${birthDate}T00:00:00Z`);
  const current = new Date(`${date}T00:00:00Z`);
  let age = current.getUTCFullYear() - birth.getUTCFullYear();
  const md = current.getUTCMonth() - birth.getUTCMonth();
  if (md < 0 || (md === 0 && current.getUTCDate() < birth.getUTCDate())) age--;
  return age;
}

function applyVisibleEventConsequences(state: WorldState, evt: LifeEvent, date: string): void {
  const human = state.character.human;
  if (evt.type === 'finance') {
    human.needs.security = clamp(human.needs.security - 8);
    human.health.mentalLoad = clamp(human.health.mentalLoad + 6);
  } else if (evt.type === 'opportunity') {
    human.needs.purpose = clamp(human.needs.purpose + 3);
    human.health.mentalLoad = clamp(human.health.mentalLoad + 2);
  } else if (evt.type === 'relationship') {
    human.needs.socialConnection = clamp(human.needs.socialConnection + 5);
  } else if (evt.type === 'world') {
    human.needs.security = clamp(human.needs.security - (evt.priority === 'major' ? 4 : 1));
  }

  if (evt.priority === 'major') {
    addHumanMemory(human, {
      id: `humanmem-player-${evt.id}`,
      ownerId: state.character.id,
      date,
      kind: evt.type === 'world' ? 'world' : evt.type === 'relationship' ? 'relationship' : 'identity',
      summary: evt.body,
      subjectIds: [],
      significance: 78,
      emotionalValence: evt.type === 'opportunity' ? 35 : evt.type === 'relationship' ? 20 : -24,
      strength: 88,
      confidence: 100,
      privacy: 'private',
      sourceId: evt.id,
    });
  }
}

function updateRelationshipFromContact(state: WorldState, npcId: string, date: string, positive: boolean): void {
  const edges = state.relationships.filter(r => (r.fromId === npcId && r.toId === state.character.id) || (r.fromId === state.character.id && r.toId === npcId));
  for (const edge of edges) {
    edge.lastMeaningfulContactDate = date;
    edge.familiarity = clamp(edge.familiarity + 1.3);
    edge.affection = clamp(edge.affection + (positive ? 1.2 : -1.5));
    edge.respect = clamp(edge.respect + (positive ? 0.6 : -0.8));
    edge.resentment = clamp(edge.resentment + (positive ? -0.5 : 1.8));
    edge.trust.emotional = clamp(edge.trust.emotional + (positive ? 0.8 : -1.2));
  }
}

export function stepWorld(input: WorldState, days = 1): WorldState {
  let state: WorldState = structuredClone(input);
  const boundedDays = Math.max(1, Math.min(days, 365));

  for (let i = 0; i < boundedDays; i++) {
    const nextDate = addDays(state.date, 1);
    const rng = new SeededRng(deriveSeed(state.seed, `day:${nextDate}`));
    const newEvents: LifeEvent[] = [];
    const newLedger: LedgerEntry[] = [];
    const newMemories: Memory[] = [];

    simulatePlayerHumanState(state, nextDate, rng);
    const npcActivity = simulateNpcs(state, nextDate, rng);
    state.npcActivity = [...npcActivity, ...state.npcActivity].slice(0, 300);

    const day = Number(nextDate.slice(-2));
    if (day === 1) {
      const rent = Math.round(1450 * state.economy.housingIndex);
      state.character.cash -= rent;
      state.character.human.needs.security = clamp(state.character.human.needs.security - Math.min(8, rent / Math.max(500, state.character.cash + rent) * 4));
      newLedger.push({ id: id('txn', nextDate, 1), date: nextDate, description: 'Housing payment', amount: -rent, category: 'Housing' });
    }

    const weekday = new Date(`${nextDate}T12:00:00Z`).getUTCDay();
    if (weekday === 5) {
      const pay = 2140;
      state.character.cash += pay;
      state.character.human.needs.security = clamp(state.character.human.needs.security + 1.6);
      newLedger.push({ id: id('txn', nextDate, 2), date: nextDate, description: 'Employer payroll', amount: pay, category: 'Income' });
    }

    // Visible NPC activity is only surfaced sometimes. The rest remains part of their life without becoming player content.
    for (const activity of npcActivity.filter(a => a.visibleToPlayer).slice(0, 1)) {
      const npc = state.npcs.find(n => n.id === activity.npcId);
      if (!npc || !rng.chance(0.22)) continue;
      newEvents.push({
        id: `evt-observe-${activity.id}`,
        date: nextDate,
        title: `You noticed something about ${npc.name.split(' ')[0]}`,
        body: activity.action,
        type: 'relationship',
        priority: 'low',
      });
    }

    if (rng.chance(0.025)) {
      const options = [
        ['An old friend reached out', 'Someone from your past sent a message after years of silence.', 'relationship'],
        ['A role opened internally', 'A higher-responsibility position appeared at your employer. You may be competitive for it.', 'opportunity'],
        ['Unexpected expense', 'Your household needs a repair that was not in this month’s plan.', 'finance'],
        ['A local employer is expanding', 'A major employer announced a local expansion that may affect jobs and housing demand.', 'world'],
      ] as const;
      const chosen = rng.pick(options);
      const evt: LifeEvent = {
        id: id('evt', nextDate, Math.floor(rng.next() * 99999)),
        date: nextDate,
        title: chosen[0],
        body: chosen[1],
        type: chosen[2],
        priority: rng.chance(0.12) ? 'major' : 'medium',
      };
      newEvents.push(evt);
      applyVisibleEventConsequences(state, evt, nextDate);
      if (evt.type === 'relationship') updateRelationshipFromContact(state, 'npc-friend', nextDate, true);
      if (evt.priority === 'major') newMemories.push({ id: `mem-${evt.id}`, date: nextDate, title: evt.title, summary: evt.body, significance: 75 });
    }

    const socialEvents = simulateSecretsAndKnowledge(state, nextDate, rng);
    for (const evt of socialEvents) {
      newEvents.push(evt);
      applyVisibleEventConsequences(state, evt, nextDate);
      const subject = state.secrets.find(s => evt.id.includes(s.id))?.subjectId;
      if (subject) updateRelationshipFromContact(state, subject, nextDate, true);
      if (evt.priority === 'major') newMemories.push({ id: `mem-${evt.id}`, date: nextDate, title: evt.title, summary: evt.body, significance: 82 });
    }

    if (weekday === 0) decayHumanMemories(state, nextDate);
    if (day === 1) reconcileNpcTiers(state, nextDate);

    // Slow macro drift. Never exposed as prophecy.
    state.economy.inflationRate = Math.max(0.5, Math.min(12, state.economy.inflationRate + (rng.next() - 0.5) * 0.02));
    state.economy.unemploymentRate = Math.max(2, Math.min(18, state.economy.unemploymentRate + (rng.next() - 0.5) * 0.01));
    state.economy.housingIndex = Math.max(0.6, state.economy.housingIndex * (1 + state.economy.inflationRate / 100 / 365 * 0.35));

    state.date = nextDate;
    state.events = [...newEvents, ...state.events].slice(0, 120);
    state.ledger = [...newLedger, ...state.ledger].slice(0, 700);
    state.memories = [...newMemories, ...state.memories].slice(0, 400);
  }
  return state;
}

export function setPlayerGoalFocus(input: WorldState, goalId: string): WorldState {
  const state = structuredClone(input);
  const goals = state.character.human.goals;
  const chosen = goals.find(g => g.id === goalId && g.status === 'active');
  if (!chosen) return state;
  for (const goal of goals) goal.priority = clamp(goal.priority - (goal.id === goalId ? 0 : 5));
  chosen.priority = clamp(Math.max(chosen.priority + 12, 82));
  chosen.lastEvaluatedDate = state.date;
  const focusEvent: LifeEvent = {
    id: `evt-focus-${goalId}-${state.date}`,
    date: state.date,
    title: 'You changed what you are prioritizing',
    body: `For now, you are putting more of your attention toward: ${chosen.title}.`,
    type: 'routine',
    priority: 'low',
  };
  state.events = [focusEvent, ...state.events].slice(0, 120);
  return state;
}

export function daysBetween(from: string, to: string): number {
  return Math.round((new Date(`${to}T00:00:00Z`).getTime() - new Date(`${from}T00:00:00Z`).getTime()) / DAY_MS);
}
