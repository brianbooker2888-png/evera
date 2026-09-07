import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { CloudConnectionState, CloudSaveEnvelope, CloudSaveProvider, CloudSession } from './types';

const url=import.meta.env.VITE_SUPABASE_URL as string|undefined;
const anonKey=import.meta.env.VITE_SUPABASE_ANON_KEY as string|undefined;
let client:SupabaseClient|null=null;

function configured(){return Boolean(url&&anonKey);}
function getClient(){if(!configured())throw new Error('Cloud saves are not configured for this build.');return client??=createClient(url!,anonKey!,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});}
function envelope(row:Record<string,unknown>):CloudSaveEnvelope{return{saveId:String(row.save_id),revision:Number(row.revision),worldVersion:Number(row.world_version),checksum:String(row.checksum),updatedAt:String(row.updated_at),deviceId:String(row.device_id),payload:row.payload as CloudSaveEnvelope['payload']};}
async function user(){const{data,error}=await getClient().auth.getUser();if(error)throw error;return data.user;}

export const supabaseCloudProvider:CloudSaveProvider={
  id:'supabase',
  isConfigured:configured,
  async connectionState():Promise<CloudConnectionState>{if(!configured())return'unconfigured';try{return(await user())?'signed_in':'signed_out';}catch{return'error';}},
  async session():Promise<CloudSession|null>{if(!configured())return null;const current=await user();return current?{user:{id:current.id,email:current.email??null}}:null;},
  async requestSignIn(email:string){const{error}=await getClient().auth.signInWithOtp({email,options:{emailRedirectTo:globalThis.location?.origin}});if(error)throw error;},
  async signOut(){const{error}=await getClient().auth.signOut();if(error)throw error;},
  async pull(saveId:string){const current=await user();if(!current)throw new Error('Sign in before syncing.');const{data,error}=await getClient().from('evera_saves').select('save_id,revision,world_version,checksum,updated_at,device_id,payload').eq('user_id',current.id).eq('save_id',saveId).maybeSingle();if(error)throw error;return data?envelope(data):null;},
  async push(next:CloudSaveEnvelope,expectedRevision:number){
    const current=await user();if(!current)throw new Error('Sign in before syncing.');
    const row={user_id:current.id,save_id:next.saveId,revision:next.revision,world_version:next.worldVersion,checksum:next.checksum,device_id:next.deviceId,payload:next.payload,updated_at:new Date().toISOString()};
    if(expectedRevision===0){const{data,error}=await getClient().from('evera_saves').insert(row).select('save_id,revision,world_version,checksum,updated_at,device_id,payload').single();if(error)throw error;return envelope(data);}
    const{data,error}=await getClient().from('evera_saves').update(row).eq('user_id',current.id).eq('save_id',next.saveId).eq('revision',expectedRevision).select('save_id,revision,world_version,checksum,updated_at,device_id,payload').maybeSingle();
    if(error)throw error;if(!data)throw new Error('Cloud save changed on another device. Sync again to review the conflict.');return envelope(data);
  }
};
