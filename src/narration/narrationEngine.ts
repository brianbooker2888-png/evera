import type { WorldState } from '../types/game';
import type { AnnualLifeChapter, NarrationRequest } from '../types/narration';
import { compileAnnualChapterContext, compileSceneContext } from './contextCompiler';
import { generateOfflineNarration } from './offlineProvider';

function hash(text:string,seed:number){let h=seed>>>0;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
export function initializeNarration(world:WorldState){
  world.narrationSettings??={mode:'offline',preferredProvider:'evera-offline',allowRemoteNarration:false};
  world.annualLifeChapters??=[];
  return world;
}
export function annualChapterForYear(world:WorldState,year:number){return world.annualLifeChapters.find(c=>c.year===year);}
export function buildAnnualLifeChapter(world:WorldState,year:number):AnnualLifeChapter{
  const context=compileAnnualChapterContext(world,year),request:NarrationRequest={id:`narration-annual-${year}`,purpose:'annual_chapter',context,deterministicSeed:hash(`annual:${year}`,world.seed)};
  const result=generateOfflineNarration(request);
  const canonical=context.facts.filter(f=>f.certainty==='canonical'&&f.allowedToStateAsFact);
  const title=canonical.some(f=>f.category==='family'||f.category==='relationship')?`${year}: Life in motion`:canonical.some(f=>f.category==='career'||f.category==='business')?`${year}: Work and change`:canonical.some(f=>f.category==='sports')?`${year}: A season of competition`:`${year}: The year in your life`;
  return{id:`chapter-${year}`,year,generatedDate:world.date,providerId:result.providerId,title,text:result.text,sourceEventIds:context.recentEventIds,sourceMemoryIds:context.memoryIds,sourceFactIds:result.usedFactIds,enhanced:false};
}
export function ensureAnnualLifeChapter(world:WorldState,year:number){initializeNarration(world);if(world.annualLifeChapters.some(c=>c.year===year))return world;world.annualLifeChapters.push(buildAnnualLifeChapter(world,year));world.annualLifeChapters.sort((a,b)=>b.year-a.year);return world;}
export function generateOfflineDialogue(world:WorldState,npcId:string,playerText:string){
  const context=compileSceneContext(world,'dialogue',npcId,world.character.id),request:NarrationRequest={id:`narration-dialogue-${npcId}-${world.date}`,purpose:'dialogue',context,playerText,deterministicSeed:hash(`${npcId}:${world.date}:${playerText}`,world.seed)};
  return generateOfflineNarration(request);
}
export function setNarrationMode(input:WorldState,mode:WorldState['narrationSettings']['mode']):WorldState{const world=structuredClone(input);initializeNarration(world);world.narrationSettings.mode=mode;world.narrationSettings.allowRemoteNarration=mode==='enhanced_when_available';return world;}
