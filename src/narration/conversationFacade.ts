import type { WorldState } from '../types/game';
import { haveConversation } from '../simulation/relationshipEngine';
import { createDialogueNarrationRequest, generateOfflineDialogue } from './narrationEngine';
import { narrate } from './providerRegistry';
import './netlifyProvider';

function recordFor(world:WorldState,npcId:string,text:string){return world.conversations.find(c=>c.personIds.includes(npcId)&&c.personIds.includes(world.character.id)&&c.date===world.date&&c.playerText===text.trim());}

/** Apply canonical consequences first, then narrate only the reply text. */
export function haveNarratedConversation(input:WorldState,npcId:string,text:string):WorldState{
  const world=haveConversation(input,npcId,text),record=recordFor(world,npcId,text);if(!record)return world;record.response=generateOfflineDialogue(world,npcId,text).text;return world;
}

export async function haveNarratedConversationAsync(input:WorldState,npcId:string,text:string):Promise<WorldState>{
  const world=haveConversation(input,npcId,text),record=recordFor(world,npcId,text);if(!record)return world;
  if(world.narrationSettings.mode!=='enhanced_when_available'){record.response=generateOfflineDialogue(world,npcId,text).text;return world;}
  const result=await narrate(createDialogueNarrationRequest(world,npcId,text),world.narrationSettings.preferredProvider);
  record.response=result.text;return world;
}
