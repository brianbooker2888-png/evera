const json=(statusCode,body)=>({statusCode,headers:{'content-type':'application/json','cache-control':'no-store'},body:JSON.stringify(body)});

function sanitize(input){
  if(!input||typeof input!=='object')throw new Error('Invalid narration request.');
  const facts=Array.isArray(input.facts)?input.facts.slice(0,100).map(f=>({id:String(f?.id??'').slice(0,160),text:String(f?.text??'').slice(0,1500),certainty:String(f?.certainty??'').slice(0,40),allowedToStateAsFact:Boolean(f?.allowedToStateAsFact)})).filter(f=>f.id&&f.text):[];
  return{purpose:String(input.purpose??'').slice(0,60),playerText:typeof input.playerText==='string'?input.playerText.slice(0,3000):undefined,facts,voice:input.voice&&typeof input.voice==='object'?input.voice:null,constraints:Array.isArray(input.constraints)?input.constraints.slice(0,20).map(x=>String(x).slice(0,500)):[],toneHint:String(input.toneHint??'').slice(0,500)};
}

export default async(request)=>{
  if(request.method!=='POST')return json(405,{error:'POST required.'});
  const providerUrl=Netlify.env.get('EVERA_NARRATION_PROVIDER_URL');
  const providerToken=Netlify.env.get('EVERA_NARRATION_PROVIDER_TOKEN');
  if(!providerUrl)return json(503,{error:'Enhanced narration is not configured.'});
  try{
    const body=sanitize(await request.json()),allowed=new Set(body.facts.map(f=>f.id));
    const response=await fetch(providerUrl,{method:'POST',headers:{'content-type':'application/json',...(providerToken?{authorization:`Bearer ${providerToken}`}:{})},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
    if(!response.ok)return json(502,{error:'Narration provider failed.'});
    const result=await response.json(),text=String(result?.text??'').trim(),usedFactIds=Array.isArray(result?.usedFactIds)?result.usedFactIds.map(String).filter(id=>allowed.has(id)):[];
    if(!text)return json(502,{error:'Narration provider returned no text.'});
    return json(200,{text:text.slice(0,12000),usedFactIds});
  }catch(error){return json(500,{error:error instanceof Error?error.message:'Narration gateway failed.'});}
};
