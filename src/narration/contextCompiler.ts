import type { WorldState } from '../types/game';
import type { NarrativeFact, NarrationPurpose, SceneContextPacket } from '../types/narration';
import { voiceProfileForPerson } from './voiceProfile';

function nameFor(world:WorldState,id:string){if(id===world.character.id)return`${world.character.firstName} ${world.character.lastName}`;return world.npcs.find(n=>n.id===id)?.name??'Unknown person';}
function pushUnique(facts:NarrativeFact[],fact:NarrativeFact){if(!facts.some(f=>f.id===fact.id))facts.push(fact);}
function canonical(id:string,category:NarrativeFact['category'],text:string,sourceId=id):NarrativeFact{return{id,category,text,certainty:'canonical',sourceId,allowedToStateAsFact:true};}

export function compileSceneContext(world:WorldState,purpose:NarrationPurpose,speakerId:string|null,listenerId:string|null=world.character.id):SceneContextPacket{
  const facts:NarrativeFact[]=[];
  if(speakerId){const speaker=speakerId===world.character.id?world.character:world.npcs.find(n=>n.id===speakerId);if(speaker)pushUnique(facts,canonical(`identity-${speakerId}`,'identity',`${nameFor(world,speakerId)} is ${speaker.age??''}${'age'in speaker?' years old':''} and lives in ${speaker.location}.`,speakerId));}
  if(speakerId&&listenerId){const edge=world.relationships.find(r=>r.fromId===speakerId&&r.toId===listenerId);if(edge)pushUnique(facts,canonical(`relationship-${edge.id}`,'relationship',`${nameFor(world,speakerId)} has an established relationship history with ${nameFor(world,listenerId)}.`,edge.id));const partnership=world.partnerships.find(p=>p.personIds.includes(speakerId)&&p.personIds.includes(listenerId)&&!['ended','divorced'].includes(p.status));if(partnership)pushUnique(facts,canonical(`partnership-${partnership.id}`,'relationship',`${nameFor(world,speakerId)} and ${nameFor(world,listenerId)} are ${partnership.status}.`,partnership.id));}
  if(speakerId){
    const directMemories=speakerId===world.character.id?world.character.human.memories:world.npcs.find(n=>n.id===speakerId)?.human?.memories??[];
    for(const memory of directMemories.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,6))pushUnique(facts,{id:`memory-${memory.id}`,category:'memory',text:memory.summary,certainty:memory.confidence>=90?'canonical':'believed',sourceId:memory.id,allowedToStateAsFact:memory.confidence>=90});
    const knowledge=world.knowledge.filter(k=>k.holderId===speakerId).sort((a,b)=>b.acquiredDate.localeCompare(a.acquiredDate)).slice(0,8);
    for(const k of knowledge)pushUnique(facts,{id:`belief-${k.id}`,category:'belief',text:k.summary,certainty:k.sourceType==='rumor'?'rumor':k.confidence>=90?'believed':'rumor',sourceId:k.id,allowedToStateAsFact:false});
    // Secrets are only available if this speaker actually knows them.
    for(const secret of world.secrets.filter(s=>s.knownBy.some(k=>k.personId===speakerId)).slice(0,4))pushUnique(facts,{id:`secret-${secret.id}`,category:secret.category==='career'?'career':secret.category==='finance'?'finance':secret.category==='family'?'family':secret.category==='relationship'?'relationship':secret.category==='health'?'health':'identity',text:secret.summary,certainty:'believed',sourceId:secret.id,allowedToStateAsFact:false});
  }
  const recent=world.events.slice(0,8);for(const evt of recent)pushUnique(facts,canonical(`event-${evt.id}`,evt.type==='finance'?'finance':evt.type==='relationship'?'relationship':evt.type==='world'?'world':'identity',evt.body,evt.id));
  const constraints=['Never invent canonical facts.','Do not reveal a secret or belief that is absent from this packet.','Treat believed or rumor facts as uncertain, not objective truth.','Do not change simulation state or imply an outcome that has not occurred.'];
  return{id:`scene-${purpose}-${world.date}-${speakerId??'narrator'}-${listenerId??'none'}`,purpose,date:world.date,speakerId,listenerId,voice:speakerId?voiceProfileForPerson(world,speakerId,listenerId):null,facts,recentEventIds:recent.map(e=>e.id),memoryIds:facts.filter(f=>f.category==='memory').map(f=>f.sourceId),constraints,toneHint:purpose==='dialogue'?'Natural, relationship-aware, concise spoken language.':purpose==='annual_chapter'?'Reflective autobiography grounded only in recorded events.':'Clear narrative prose grounded in simulation facts.'};
}

export function compileAnnualChapterContext(world:WorldState,year:number):SceneContextPacket{
  const facts:NarrativeFact[]=[],events=world.events.filter(e=>Number(e.date.slice(0,4))===year),memories=world.memories.filter(m=>Number(m.date.slice(0,4))===year),personal=world.character.human.memories.filter(m=>Number(m.date.slice(0,4))===year);
  for(const event of events)pushUnique(facts,canonical(`event-${event.id}`,event.type==='finance'?'finance':event.type==='relationship'?'relationship':event.type==='world'?'world':'identity',`${event.title}: ${event.body}`,event.id));
  for(const memory of memories)pushUnique(facts,canonical(`timeline-${memory.id}`,'memory',`${memory.title}: ${memory.summary}`,memory.id));
  for(const memory of personal)pushUnique(facts,{id:`personal-${memory.id}`,category:'memory',text:memory.summary,certainty:memory.confidence>=90?'canonical':'believed',sourceId:memory.id,allowedToStateAsFact:memory.confidence>=90});
  const employment=world.employments.find(e=>e.personId===world.character.id&&Number(e.startDate.slice(0,4))<=year&&(e.endDate===null||Number(e.endDate.slice(0,4))>=year));if(employment)facts.push(canonical(`employment-${employment.id}`,'career',`During ${year}, the character worked as ${employment.title}.`,employment.id));
  const sports=world.sportsSeasonStats.filter(s=>s.personId===world.character.id&&s.seasonYear===year);for(const stat of sports)facts.push(canonical(`sports-${stat.id}`,'sports',`${stat.sport==='soccer'?'Soccer':'American football'} season: ${stat.games} games, ${stat.wins} wins and ${stat.losses} losses.`,stat.id));
  const kpi=world.logisticsKpis.filter(k=>Number(k.date.slice(0,4))===year);if(kpi.length){const profit=kpi.reduce((s,k)=>s+k.operatingProfit,0);facts.push(canonical(`business-year-${year}`,'business',`The logistics business recorded ${kpi.length} monthly operating periods with combined operating profit of ${Math.round(profit)}.`,`business-year-${year}`));}
  return{id:`annual-${year}`,purpose:'annual_chapter',date:world.date,speakerId:null,listenerId:world.character.id,voice:null,facts,recentEventIds:events.map(e=>e.id),memoryIds:[...memories.map(m=>m.id),...personal.map(m=>m.id)],constraints:['Use only facts present in this packet.','Do not invent milestones, relationships, money, medical outcomes or achievements.','Do not score the life as good or bad.','Acknowledge uncertainty where a fact is marked believed or rumor.'],toneHint:'Warm, reflective autobiography. Emphasize tradeoffs, change and consequences without inventing details.'};
}
