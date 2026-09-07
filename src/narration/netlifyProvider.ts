import { addNarrationProvider } from './providerRegistry';
import { createRemoteNarrationProvider } from './remoteProvider';

const enabled=()=>import.meta.env.VITE_REMOTE_NARRATION_ENABLED==='true'&&typeof navigator!=='undefined'&&navigator.onLine;

export const netlifyNarrationProvider=createRemoteNarrationProvider('evera-netlify',{
  available:enabled,
  async generate(input){
    const response=await fetch('/api/narrate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(input)});
    if(!response.ok)throw new Error('Enhanced narration is unavailable.');
    const result=await response.json() as {text?:unknown;usedFactIds?:unknown};
    return{text:String(result.text??''),usedFactIds:Array.isArray(result.usedFactIds)?result.usedFactIds.map(String):[]};
  }
});

addNarrationProvider(netlifyNarrationProvider);
