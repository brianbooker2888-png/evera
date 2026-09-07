import type { NarrationRequest, NarrationResponse } from '../types/narration';
import type { NarrationProvider } from './provider';

export interface RemoteNarrationTransport {
  available():boolean|Promise<boolean>;
  generate(input:{purpose:NarrationRequest['purpose'];playerText?:string;facts:{id:string;text:string;certainty:string;allowedToStateAsFact:boolean}[];voice:NarrationRequest['context']['voice'];constraints:string[];toneHint:string;}):Promise<{text:string;usedFactIds:string[]}>;
}

export function createRemoteNarrationProvider(id:string,transport:RemoteNarrationTransport):NarrationProvider{
  return{id,kind:'remote',isAvailable:()=>transport.available(),generate:async(request):Promise<NarrationResponse>=>{
    const allowedIds=new Set(request.context.facts.map(f=>f.id));
    const result=await transport.generate({purpose:request.purpose,playerText:request.playerText,facts:request.context.facts.map(f=>({id:f.id,text:f.text,certainty:f.certainty,allowedToStateAsFact:f.allowedToStateAsFact})),voice:request.context.voice,constraints:request.context.constraints,toneHint:request.context.toneHint});
    if(!result.text.trim())throw new Error('Narration provider returned empty text.');
    if(result.usedFactIds.some(id=>!allowedIds.has(id)))throw new Error('Narration provider referenced facts outside the approved context packet.');
    return{requestId:request.id,providerId:id,providerKind:'remote',text:result.text.trim(),usedFactIds:result.usedFactIds,generatedAt:request.context.date};
  }};
}
