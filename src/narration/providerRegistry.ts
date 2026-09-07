import type { NarrationRequest } from '../types/narration';
import { generateWithFallback, getNarrationProvider, listNarrationProviders, registerNarrationProvider, type NarrationProvider } from './provider';
import { offlineNarrationProvider } from './offlineProvider';

registerNarrationProvider(offlineNarrationProvider);

export function addNarrationProvider(provider:NarrationProvider){registerNarrationProvider(provider);}
export function availableNarrationProviders(){return listNarrationProviders();}
export async function narrate(request:NarrationRequest,preferredProvider='evera-offline'){return generateWithFallback(request,preferredProvider,offlineNarrationProvider);}
export function narrationProvider(id:string){return getNarrationProvider(id);}
