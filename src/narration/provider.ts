import type { NarrationProviderKind, NarrationRequest, NarrationResponse } from '../types/narration';

export interface NarrationProvider {
  id:string;
  kind:NarrationProviderKind;
  isAvailable():boolean|Promise<boolean>;
  generate(request:NarrationRequest):Promise<NarrationResponse>;
}

const providers=new Map<string,NarrationProvider>();
export function registerNarrationProvider(provider:NarrationProvider){providers.set(provider.id,provider);}
export function getNarrationProvider(id:string){return providers.get(id);}
export function listNarrationProviders(){return[...providers.values()];}

export async function generateWithFallback(request:NarrationRequest,preferredId:string,offlineProvider:NarrationProvider):Promise<NarrationResponse>{
  const preferred=providers.get(preferredId);
  if(preferred&&preferred.id!==offlineProvider.id){
    try{if(await preferred.isAvailable())return await preferred.generate(request);}catch{/** Remote/local enhancement is optional; fall through to deterministic offline narration. */}
  }
  return offlineProvider.generate(request);
}
