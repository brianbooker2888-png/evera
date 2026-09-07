import type { WorldState } from '../types/game';
import type { LifestyleProfile, LifestyleWorldState, HomeLifestyle, WardrobeItem, DeviceAsset, HobbyRecord, VehicleUseProfile } from '../types/lifestyle';
import { activeHouseholdForPerson } from './householdEngine';

const clamp=(v:number)=>Math.max(0,Math.min(100,Math.round(v)));
const profileFor=(world:WorldState):LifestyleProfile=>{
  const c=world.character,t=c.traits,v=c.human.values,bg=c.socioeconomicBackground;
  const quality={struggling:38,working:48,stable:62,affluent:76,wealthy:90}[bg];
  return{personId:c.id,foodStrategy:bg==='struggling'?'budget':bg==='wealthy'?'premium':'standard',cookingSkill:clamp(42+t.discipline*.24+t.creativity*.18),familyMealFrequency:clamp(45+t.familyOrientation*.4),styleIdentity:bg==='wealthy'?'luxury':t.creativity>72?'fashion_forward':t.discipline>70?'classic':'practical',grooming:clamp(quality*.75+t.discipline*.25),wardrobeQuality:quality,socialSpending:clamp(30+t.riskTolerance*.25+t.confidence*.25),conveniencePreference:clamp(35+(100-t.discipline)*.35+t.ambition*.2),travelInterest:clamp(t.riskTolerance*.3+t.creativity*.2+v.adventure*.5),homePride:clamp(45+t.discipline*.25+t.familyOrientation*.25),timePressure:28,lastUpdatedDate:world.date};
};
function homeFor(world:WorldState,householdId:string):HomeLifestyle{
  const h=world.households.find(x=>x.id===householdId),type=h?.homeType??'apartment',members=h?.memberIds.length??1;
  const dims={apartment:[1,1],townhome:[2,2],house:[3,2],shared:[1,1],temporary:[1,1]}[type]??[1,1],bedrooms=dims[0]!,bathrooms=dims[1]!;
  const property=world.properties.find(p=>p.status==='owned'&&p.ownerIds.some(id=>h?.responsibleAdultIds.includes(id)));
  const base=property?Math.round(property.condition):type==='house'?68:type==='townhome'?64:type==='apartment'?58:48;
  return{householdId,bedrooms,bathrooms,comfort:clamp(base),organization:58,furnishingQuality:clamp(base-4),maintenance:clamp(property?.condition??72),privacy:clamp(55+bedrooms*12-members*4),spacePressure:clamp(Math.max(0,(members-bedrooms*1.5)*24)),upgradeIds:[],lastMaintenanceDate:world.date};
}
function wardrobe(world:WorldState):WardrobeItem[]{const q=profileFor(world).wardrobeQuality,c=world.character.id;return(['casual','work','formal','athletic','seasonal'] as const).map((category,i)=>({id:`wardrobe-${c}-${category}`,ownerId:c,category,quality:clamp(q+(i===2?3:0)),condition:88,purchaseDate:world.date,cost:Math.round(60+q*1.6)}));}
function devices(world:WorldState):DeviceAsset[]{const q={struggling:48,working:58,stable:72,affluent:84,wealthy:94}[world.character.socioeconomicBackground];return[{id:`device-${world.character.id}-phone`,ownerId:world.character.id,kind:'phone',name:q>82?'Premium smartphone':'Smartphone',purchaseDate:world.date,purchasePrice:Math.round(350+q*6),condition:82,capability:q,status:'active'},{id:`device-${world.character.id}-computer`,ownerId:world.character.id,kind:'computer',name:q>80?'Performance laptop':'Everyday laptop',purchaseDate:world.date,purchasePrice:Math.round(450+q*7),condition:84,capability:q,status:'active'}];}
function startingHobbies(world:WorldState):HobbyRecord[]{const c=world.character,t=c.traits,out:HobbyRecord[]=[];if(c.athleticism.endurance>62)out.push({id:`hobby-${c.id}-fitness`,personId:c.id,kind:'fitness',name:'Fitness training',skill:Math.round(c.athleticism.endurance*.65),enjoyment:68,socialPotential:35,monthlyCost:35,lastPracticedDate:null,active:true});if(t.creativity>64)out.push({id:`hobby-${c.id}-creative`,personId:c.id,kind:'photography',name:'Photography',skill:38,enjoyment:72,socialPotential:42,monthlyCost:18,lastPracticedDate:null,active:true});if(!out.length)out.push({id:`hobby-${c.id}-reading`,personId:c.id,kind:'reading',name:'Reading',skill:42,enjoyment:65,socialPotential:20,monthlyCost:12,lastPracticedDate:null,active:true});return out;}
function vehicleProfiles(world:WorldState):VehicleUseProfile[]{return world.vehicles.filter(v=>v.status==='owned').map(v=>({vehicleId:v.id,practicality:v.kind==='suv'||v.kind==='van'?88:v.kind==='truck'?78:v.kind==='sports'?38:68,reliability:clamp(v.condition),customization:0,commuteFit:v.fuelType==='electric'?75:72,chargingOrFuelConvenience:v.fuelType==='electric'?62:82,lastServiceDate:v.purchaseDate,nextServiceMileage:v.mileage+5000,breakdowns:0}));}
export function emptyLifestyleState():LifestyleWorldState{return{lifestyleProfiles:[],homeLifestyles:[],homeUpgrades:[],vehicleUseProfiles:[],wardrobeItems:[],hobbies:[],pets:[],travelPlans:[],lifestyleOutings:[],householdServices:[],deviceAssets:[],calendarCommitments:[],lifestyleMilestones:[]};}
export function initializeLifestyle(world:WorldState):WorldState{
  world.lifestyleProfiles??=[];world.homeLifestyles??=[];world.homeUpgrades??=[];world.vehicleUseProfiles??=[];world.wardrobeItems??=[];world.hobbies??=[];world.pets??=[];world.travelPlans??=[];world.lifestyleOutings??=[];world.householdServices??=[];world.deviceAssets??=[];world.calendarCommitments??=[];world.lifestyleMilestones??=[];
  if(!world.lifestyleProfiles.some(p=>p.personId===world.character.id))world.lifestyleProfiles.push(profileFor(world));
  for(const h of world.households.filter(h=>!h.endedDate))if(!world.homeLifestyles.some(x=>x.householdId===h.id))world.homeLifestyles.push(homeFor(world,h.id));
  if(!world.wardrobeItems.some(x=>x.ownerId===world.character.id))world.wardrobeItems.push(...wardrobe(world));
  if(!world.deviceAssets.some(x=>x.ownerId===world.character.id))world.deviceAssets.push(...devices(world));
  if(!world.hobbies.some(x=>x.personId===world.character.id))world.hobbies.push(...startingHobbies(world));
  for(const p of vehicleProfiles(world))if(!world.vehicleUseProfiles.some(x=>x.vehicleId===p.vehicleId))world.vehicleUseProfiles.push(p);
  const home=activeHouseholdForPerson(world,world.character.id);if(home&&!world.homeLifestyles.some(x=>x.householdId===home.id))world.homeLifestyles.push(homeFor(world,home.id));
  return world;
}
