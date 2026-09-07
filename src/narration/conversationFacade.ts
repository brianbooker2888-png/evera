import type { WorldState } from '../types/game';
import { haveConversation } from '../simulation/relationshipEngine';
import { generateOfflineDialogue } from './narrationEngine';

/**
 * Applies authoritative conversation consequences first, then rewrites only
 * the stored reply text through the narration layer. Narration never decides
 * relationship state, intent, tone, or any other canonical outcome.
 */
export function haveNarratedConversation(input:WorldState,npcId:string,text:string):WorldState{
  const world=haveConversation(input,npcId,text);
  const record=world.conversations.find(c=>c.personIds.includes(npcId)&&c.personIds.includes(world.character.id)&&c.playerText===text.trim());
  if(!record)return world;
  const narration=generateOfflineDialogue(world,npcId,text);
  record.response=narration.text;
  return world;
}
