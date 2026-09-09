import type { Memory, WorldState } from '../types/game';
import type { MatchMoment, SportsFixture } from '../types/sports';
import type { LifestyleMilestone, WardrobeItem } from '../types/lifestyle';

export type MatchViewMode='full'|'extended'|'key_moments'|'result';
export type VisualSceneKind='birth'|'graduation'|'proposal'|'wedding'|'home'|'promotion'|'hospital'|'divorce'|'funeral'|'retirement'|'sports'|'travel'|'family'|'career'|'finance'|'life';
export type VisualContext='casual'|'work'|'formal'|'athletic'|'nightlife'|'travel'|'home';
export type AgeBand='child'|'teen'|'young_adult'|'adult'|'older_adult';

export interface VisualPersonDescriptor{
  personId:string;
  name:string;
  initials:string;
  age:number;
  ageBand:AgeBand;
  familyKey:string;
  palette:number;
  faceShape:number;
  hairShape:number;
  outfit:WardrobeItem['category'];
  outfitQuality:number;
  archived:boolean;
}

export interface VisualMemoryCard{
  id:string;
  date:string;
  title:string;
  summary:string;
  significance:number;
  scene:VisualSceneKind;
  age:number;
  source:'memory'|'lifestyle';
}

const hash=(value:string)=>{let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;};
export const ageAtDate=(birthDate:string,date:string)=>{const b=new Date(`${birthDate}T12:00:00Z`),d=new Date(`${date}T12:00:00Z`);let age=d.getUTCFullYear()-b.getUTCFullYear();const md=d.getUTCMonth()-b.getUTCMonth();if(md<0||(md===0&&d.getUTCDate()<b.getUTCDate()))age--;return Math.max(0,age);};
export const ageBandFor=(age:number):AgeBand=>age<13?'child':age<18?'teen':age<30?'young_adult':age<60?'adult':'older_adult';

function familyKey(world:WorldState,personId:string){
  if(personId===world.character.id)return world.character.lastName.toLowerCase();
  const linked=world.familyLinks.some(f=>!f.endedDate&&((f.fromId===world.character.id&&f.toId===personId)||(f.toId===world.character.id&&f.fromId===personId))&&!['spouse','ex_spouse'].includes(f.relation));
  if(linked)return world.character.lastName.toLowerCase();
  const archive=world.ancestorArchives.find(a=>a.personId===personId);
  if(archive)return archive.name.split(' ').slice(-1)[0]?.toLowerCase()??personId;
  return personId;
}

function contextCategory(context:VisualContext):WardrobeItem['category']{
  if(context==='work')return'work';if(context==='formal')return'formal';if(context==='athletic')return'athletic';if(context==='nightlife')return'nightlife';return'casual';
}
function bestWardrobe(world:WorldState,personId:string,context:VisualContext){
  const target=contextCategory(context),items=world.wardrobeItems.filter(w=>w.ownerId===personId&&w.category===target);
  return items.sort((a,b)=>(b.quality+b.condition)-(a.quality+a.condition))[0];
}

export function visualPerson(world:WorldState,personId:string,date=world.date,context:VisualContext='casual'):VisualPersonDescriptor|null{
  const isPlayer=personId===world.character.id,npc=isPlayer?undefined:world.npcs.find(n=>n.id===personId),archive=world.ancestorArchives.find(a=>a.personId===personId);
  if(!isPlayer&&!npc&&!archive)return null;
  const name:string=isPlayer?`${world.character.firstName} ${world.character.lastName}`:npc?.name??archive!.name;
  const birthDate=isPlayer?world.character.birthDate:npc?.birthDate??archive!.birthDate,age=archive&&!isPlayer&&!npc?archive.ageAtDeath:ageAtDate(birthDate,date),key=familyKey(world,personId),familyHash=hash(key),personHash=hash(personId),wardrobe=bestWardrobe(world,personId,context),profile=world.lifestyleProfiles.find(p=>p.personId===personId);
  return{personId,name,initials:name.split(/\s+/).filter(Boolean).slice(0,2).map((part:string)=>part[0]?.toUpperCase()).join(''),age,ageBand:ageBandFor(age),familyKey:key,palette:familyHash%6,faceShape:(familyHash+personHash)%4,hairShape:(familyHash+Math.floor(personHash/7))%5,outfit:wardrobe?.category??contextCategory(context),outfitQuality:wardrobe?Math.round((wardrobe.quality+wardrobe.condition)/2):Math.round(profile?.wardrobeQuality??55),archived:Boolean(archive&&!isPlayer&&!npc)};
}

export function matchMomentsForView(fixture:SportsFixture,mode:MatchViewMode):MatchMoment[]{
  if(mode==='result')return[];
  if(mode==='key_moments')return fixture.moments.filter(m=>m.importance>=60);
  if(mode==='extended')return fixture.moments.filter(m=>m.importance>=35);
  return fixture.moments;
}

export function matchMomentProgress(fixture:SportsFixture,moment:MatchMoment){
  if(fixture.sport==='soccer')return Math.max(0,Math.min(1,moment.clock/90));
  return Math.max(0,Math.min(1,(60-moment.clock)/60));
}

export function matchMomentLane(moment:MatchMoment){return 18+(hash(moment.id)%65);}

export function sceneKind(title:string,summary=''):VisualSceneKind{
  const t=`${title} ${summary}`.toLowerCase();
  if(/born|birth|baby/.test(t))return'birth';
  if(/graduat|degree|credential/.test(t))return'graduation';
  if(/engag|proposal|proposed/.test(t))return'proposal';
  if(/wedding|married|marriage/.test(t))return'wedding';
  if(/bought a home|home purchase|moved to|new home|house/.test(t))return'home';
  if(/promot|new role|career chapter|job offer/.test(t))return'promotion';
  if(/hospital|emergency|diagnos|medical|health/.test(t))return'hospital';
  if(/divorc|separat|breakup/.test(t))return'divorce';
  if(/funeral|died|death|passed away/.test(t))return'funeral';
  if(/retir/.test(t))return'retirement';
  if(/match|game|season|scored|touchdown|soccer|football/.test(t))return'sports';
  if(/travel|trip|vacation|visited/.test(t))return'travel';
  if(/family|child|parent|sibling/.test(t))return'family';
  if(/career|work|employ|job/.test(t))return'career';
  if(/money|debt|bank|financial|mortgage|business/.test(t))return'finance';
  return'life';
}

function memoryCard(world:WorldState,memory:Memory):VisualMemoryCard{return{id:memory.id,date:memory.date,title:memory.title,summary:memory.summary,significance:memory.significance,scene:sceneKind(memory.title,memory.summary),age:ageAtDate(world.character.birthDate,memory.date),source:'memory'};}
function milestoneCard(world:WorldState,milestone:LifestyleMilestone):VisualMemoryCard{return{id:milestone.id,date:milestone.date,title:milestone.title,summary:milestone.summary,significance:milestone.significance,scene:sceneKind(milestone.title,milestone.summary),age:ageAtDate(world.character.birthDate,milestone.date),source:'lifestyle'};}

export function visualMemories(world:WorldState,limit=16):VisualMemoryCard[]{
  const cards=[...world.memories.map(m=>memoryCard(world,m)),...world.lifestyleMilestones.filter(m=>m.personId===world.character.id).map(m=>milestoneCard(world,m))];
  const seen=new Set<string>();
  return cards.sort((a,b)=>b.date.localeCompare(a.date)||b.significance-a.significance).filter(card=>{const key=`${card.date}:${card.title.toLowerCase()}`;if(seen.has(key))return false;seen.add(key);return true;}).slice(0,limit);
}

export function currentFamilyIds(world:WorldState){
  const ids=new Set<string>([world.character.id]);
  for(const link of world.familyLinks){if(link.endedDate)continue;if(link.fromId===world.character.id)ids.add(link.toId);if(link.toId===world.character.id)ids.add(link.fromId);}
  return [...ids];
}
