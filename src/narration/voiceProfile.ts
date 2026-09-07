import type { WorldState } from '../types/game';
import type { VoiceProfile } from '../types/narration';
import { ageAt } from '../simulation/familyEngine';

function person(world:WorldState,id:string){return id===world.character.id?world.character:world.npcs.find(n=>n.id===id);}
function relationshipRegister(world:WorldState,speakerId:string,listenerId:string|null):VoiceProfile['relationshipRegister']{
  if(!listenerId)return'professional';
  const partnership=world.partnerships.find(p=>p.personIds.includes(speakerId)&&p.personIds.includes(listenerId)&&!['ended','divorced'].includes(p.status));
  if(partnership)return'partner';
  const family=world.familyLinks.find(f=>!f.endedDate&&((f.fromId===speakerId&&f.toId===listenerId)||(f.fromId===listenerId&&f.toId===speakerId)));
  if(family)return'family';
  const edge=world.relationships.find(r=>r.fromId===speakerId&&r.toId===listenerId);
  if((edge?.familiarity??0)>=65)return'friend';
  if((edge?.familiarity??0)>=25)return'acquaintance';
  return'stranger';
}
export function voiceProfileForPerson(world:WorldState,personId:string,listenerId:string|null=null):VoiceProfile|null{
  const p=person(world,personId);if(!p)return null;
  const age=ageAt(p.birthDate,world.date),traits=p.traits;
  const ageBand:VoiceProfile['ageBand']=age<13?'child':age<18?'teen':age<25?'young_adult':age<60?'adult':'older_adult';
  const warmth:VoiceProfile['warmth']=traits.empathy>=72?'warm':traits.empathy<=42?'reserved':'balanced';
  const directness:VoiceProfile['directness']=traits.confidence>=72&&traits.patience<65?'direct':traits.empathy>=72&&traits.confidence<65?'soft':'balanced';
  const expressiveness:VoiceProfile['expressiveness']=traits.emotional>=75||traits.creativity>=80?'high':traits.emotional<42&&traits.creativity<50?'low':'medium';
  const analytical=traits.analytical;const vocabulary:VoiceProfile['vocabulary']=age<13?'simple':analytical>=78?'polished':'everyday';
  const humor:VoiceProfile['humor']=traits.creativity>=72&&traits.emotional>=55?'light':traits.creativity>=62&&traits.emotional<55?'dry':'rare';
  return{personId,ageBand,warmth,directness,expressiveness,vocabulary,humor,relationshipRegister:relationshipRegister(world,personId,listenerId)};
}
