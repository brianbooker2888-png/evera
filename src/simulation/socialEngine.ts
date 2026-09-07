import type { KnowledgeFact, LifeEvent, RelationshipState, Secret, WorldState } from '../types/game';
import { SeededRng } from './rng';
import { addHumanMemory } from './humanEngine';

const clamp = (value: number) => Math.max(0, Math.min(100, value));

function knowsSecret(secret: Secret, personId: string): boolean {
  return secret.knownBy.some(k => k.personId === personId);
}

function addKnowledge(world: WorldState, fact: KnowledgeFact): void {
  const duplicate = world.knowledge.some(k => k.holderId === fact.holderId && k.factKey === fact.factKey && k.subjectId === fact.subjectId);
  if (!duplicate) world.knowledge.push(fact);
  if (world.knowledge.length > 500) world.knowledge = world.knowledge.slice(-500);
}

function relationshipBetween(world: WorldState, fromId: string, toId: string): RelationshipState | undefined {
  return world.relationships.find(r => r.fromId === fromId && r.toId === toId);
}

function disclosureChance(world: WorldState, secret: Secret, npcId: string): number {
  const npc = world.npcs.find(n => n.id === npcId);
  const rel = relationshipBetween(world, npcId, world.character.id);
  if (!npc || !rel) return 0;
  const emotionalTrust = rel.trust.emotional / 100;
  const honesty = npc.traits.loyalty * 0.003 + npc.traits.empathy * 0.002;
  const sensitivityPenalty = secret.sensitivity * 0.0045;
  return Math.max(0.005, Math.min(0.22, 0.02 + emotionalTrust * 0.09 + honesty - sensitivityPenalty));
}

export function simulateSecretsAndKnowledge(world: WorldState, date: string, rng: SeededRng): LifeEvent[] {
  const events: LifeEvent[] = [];
  const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
  if (weekday !== 0) return events;

  for (const secret of world.secrets) {
    if (secret.status !== 'active' || knowsSecret(secret, world.character.id)) continue;
    const subject = world.npcs.find(n => n.id === secret.subjectId);
    if (!subject || subject.tier !== 1 || !knowsSecret(secret, subject.id)) continue;
    if (!rng.chance(disclosureChance(world, secret, subject.id))) continue;

    secret.knownBy.push({ personId: world.character.id, since: date, sourceId: subject.id });
    addKnowledge(world, {
      id: `know-${secret.id}-${world.character.id}`,
      holderId: world.character.id,
      subjectId: secret.subjectId,
      factKey: `secret:${secret.id}`,
      summary: secret.summary,
      confidence: 96,
      privacy: 'sensitive',
      sourceId: subject.id,
      sourceType: 'told',
      acquiredDate: date,
      distortion: 0,
    });

    const rel = relationshipBetween(world, subject.id, world.character.id);
    if (rel) rel.trust.emotional = clamp(rel.trust.emotional + 2.5);

    if (subject.human) {
      addHumanMemory(subject.human, {
        id: `humanmem-disclose-${secret.id}`,
        ownerId: subject.id,
        date,
        kind: 'relationship',
        summary: `${subject.name} chose to trust ${world.character.firstName} with something private.`,
        subjectIds: [world.character.id],
        significance: 58,
        emotionalValence: 18,
        strength: 76,
        confidence: 100,
        privacy: 'private',
        sourceId: secret.id,
      });
    }

    events.push({
      id: `evt-disclose-${secret.id}-${date}`,
      date,
      title: `${subject.name.split(' ')[0]} told you something privately`,
      body: secret.summary,
      type: 'relationship',
      priority: secret.sensitivity >= 75 ? 'major' : 'medium',
    });
  }

  return events;
}

export function createInitialSecrets(world: WorldState): Secret[] {
  const friend = world.npcs.find(n => n.role === 'Friend' && n.tier === 1);
  if (!friend) return [];
  return [{
    id: `secret-${friend.id}-career-move`,
    subjectId: friend.id,
    category: 'career',
    summary: `${friend.name} has quietly been considering an opportunity that could eventually take them to another city.`,
    sensitivity: 44,
    createdDate: world.date,
    knownBy: [{ personId: friend.id, since: world.date, sourceId: friend.id }],
    status: 'active',
  }];
}

export function visibleKnowledge(world: WorldState): KnowledgeFact[] {
  return world.knowledge.filter(k => k.holderId === world.character.id).sort((a, b) => b.acquiredDate.localeCompare(a.acquiredDate));
}
