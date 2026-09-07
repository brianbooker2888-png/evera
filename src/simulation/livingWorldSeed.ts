import type { WorldState } from '../types/game';
import type { CityProfile, CountryProfile, IndustryState, LivingWorldState, NeighborhoodProfile, ResidencyRecord, WorldInstitution } from '../types/livingWorld';

const norm=(s:string)=>s.trim().toLowerCase();
const slug=(s:string)=>norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

const countries:CountryProfile[]=[
  {id:'country-us',name:'United States',currency:'USD',taxRate:22,healthcareModel:'private_insurance',educationIndex:78,laborProtection:54,benefitGenerosity:46,retirementAge:67,immigrationOpenness:55,costIndex:100},
  {id:'country-ca',name:'Canada',currency:'CAD',taxRate:27,healthcareModel:'universal',educationIndex:84,laborProtection:72,benefitGenerosity:68,retirementAge:65,immigrationOpenness:72,costIndex:106},
  {id:'country-uk',name:'United Kingdom',currency:'GBP',taxRate:25,healthcareModel:'universal',educationIndex:82,laborProtection:74,benefitGenerosity:66,retirementAge:66,immigrationOpenness:58,costIndex:108},
  {id:'country-mx',name:'Mexico',currency:'MXN',taxRate:20,healthcareModel:'mixed_public',educationIndex:63,laborProtection:61,benefitGenerosity:42,retirementAge:65,immigrationOpenness:67,costIndex:64}
];

const citySeed:CityProfile[]=[
  {id:'city-phoenix',countryId:'country-us',name:'Phoenix',region:'Arizona',population:1650000,wageIndex:1,housingIndex:1,unemploymentRate:4.2,transit:42,safety:62,schoolQuality:67,healthcareAccess:72,nightlife:68,culture:66,industryIds:['industry-logistics','industry-healthcare','industry-tech'],growthRate:1.6},
  {id:'city-seattle',countryId:'country-us',name:'Seattle',region:'Washington',population:790000,wageIndex:1.34,housingIndex:1.58,unemploymentRate:4.6,transit:73,safety:66,schoolQuality:80,healthcareAccess:85,nightlife:74,culture:84,industryIds:['industry-tech','industry-healthcare','industry-logistics'],growthRate:1.1},
  {id:'city-atlanta',countryId:'country-us',name:'Atlanta',region:'Georgia',population:520000,wageIndex:1.08,housingIndex:1.08,unemploymentRate:4.1,transit:60,safety:58,schoolQuality:65,healthcareAccess:79,nightlife:83,culture:86,industryIds:['industry-logistics','industry-healthcare','industry-media'],growthRate:1.4},
  {id:'city-toronto',countryId:'country-ca',name:'Toronto',region:'Ontario',population:3000000,wageIndex:1.18,housingIndex:1.65,unemploymentRate:6.5,transit:82,safety:81,schoolQuality:84,healthcareAccess:86,nightlife:82,culture:91,industryIds:['industry-finance','industry-tech','industry-media'],growthRate:1.7},
  {id:'city-vancouver',countryId:'country-ca',name:'Vancouver',region:'British Columbia',population:700000,wageIndex:1.12,housingIndex:1.82,unemploymentRate:5.7,transit:84,safety:78,schoolQuality:82,healthcareAccess:84,nightlife:76,culture:88,industryIds:['industry-tech','industry-logistics','industry-media'],growthRate:1.3},
  {id:'city-london',countryId:'country-uk',name:'London',region:'England',population:8900000,wageIndex:1.28,housingIndex:1.78,unemploymentRate:5.1,transit:95,safety:72,schoolQuality:84,healthcareAccess:88,nightlife:94,culture:97,industryIds:['industry-finance','industry-tech','industry-media'],growthRate:.8},
  {id:'city-manchester',countryId:'country-uk',name:'Manchester',region:'England',population:570000,wageIndex:1.02,housingIndex:1.08,unemploymentRate:5.5,transit:79,safety:67,schoolQuality:74,healthcareAccess:82,nightlife:86,culture:88,industryIds:['industry-logistics','industry-tech','industry-media'],growthRate:1.1},
  {id:'city-mexico-city',countryId:'country-mx',name:'Mexico City',region:'CDMX',population:9200000,wageIndex:.58,housingIndex:.68,unemploymentRate:3.7,transit:86,safety:48,schoolQuality:68,healthcareAccess:72,nightlife:91,culture:98,industryIds:['industry-finance','industry-media','industry-logistics'],growthRate:.7},
  {id:'city-monterrey',countryId:'country-mx',name:'Monterrey',region:'Nuevo Leon',population:1140000,wageIndex:.67,housingIndex:.64,unemploymentRate:3.5,transit:64,safety:54,schoolQuality:72,healthcareAccess:76,nightlife:78,culture:82,industryIds:['industry-logistics','industry-manufacturing','industry-tech'],growthRate:1.5}
];

const industries=(date:string):IndustryState[]=>[
  {id:'industry-logistics',name:'Logistics & Supply Chain',demandIndex:72,wageIndex:1.02,automationPressure:48,growth:1.7,cityIds:['city-phoenix','city-seattle','city-atlanta','city-vancouver','city-manchester','city-mexico-city','city-monterrey'],lastUpdatedDate:date},
  {id:'industry-healthcare',name:'Healthcare',demandIndex:81,wageIndex:1.08,automationPressure:24,growth:2.2,cityIds:['city-phoenix','city-seattle','city-atlanta'],lastUpdatedDate:date},
  {id:'industry-tech',name:'Technology',demandIndex:76,wageIndex:1.24,automationPressure:67,growth:2.5,cityIds:['city-phoenix','city-seattle','city-toronto','city-vancouver','city-london','city-manchester','city-monterrey'],lastUpdatedDate:date},
  {id:'industry-finance',name:'Finance',demandIndex:69,wageIndex:1.2,automationPressure:58,growth:1.1,cityIds:['city-toronto','city-london','city-mexico-city'],lastUpdatedDate:date},
  {id:'industry-media',name:'Media & Entertainment',demandIndex:61,wageIndex:1.03,automationPressure:52,growth:.8,cityIds:['city-atlanta','city-toronto','city-vancouver','city-london','city-manchester','city-mexico-city'],lastUpdatedDate:date},
  {id:'industry-manufacturing',name:'Manufacturing',demandIndex:66,wageIndex:.9,automationPressure:72,growth:1.3,cityIds:['city-monterrey'],lastUpdatedDate:date}
];

function findSeedCity(location:string){const q=norm(location);return citySeed.find(c=>q.includes(norm(c.name))||q.includes(norm(c.region)));}
function customCity(location:string):CityProfile{const name=location.split(',')[0]?.trim()||'Home City';return{id:`city-${slug(name)||'home'}`,countryId:'country-us',name,region:location.split(',')[1]?.trim()||'Region',population:350000,wageIndex:1,housingIndex:1,unemploymentRate:4.5,transit:52,safety:64,schoolQuality:68,healthcareAccess:72,nightlife:61,culture:67,industryIds:['industry-logistics','industry-healthcare'],growthRate:1};}
function neighborhoodsFor(city:CityProfile):NeighborhoodProfile[]{return[
  {id:`neighborhood-${city.id}-central`,cityId:city.id,name:'Central District',housingCostIndex:city.housingIndex*1.12,safety:Math.max(20,city.safety-4),schoolQuality:city.schoolQuality,transit:Math.min(100,city.transit+12),prestige:68,density:82},
  {id:`neighborhood-${city.id}-family`,cityId:city.id,name:'Family District',housingCostIndex:city.housingIndex*.98,safety:Math.min(100,city.safety+8),schoolQuality:Math.min(100,city.schoolQuality+8),transit:Math.max(20,city.transit-8),prestige:62,density:54},
  {id:`neighborhood-${city.id}-value`,cityId:city.id,name:'Value District',housingCostIndex:city.housingIndex*.78,safety:Math.max(20,city.safety-10),schoolQuality:Math.max(25,city.schoolQuality-9),transit:Math.max(20,city.transit-4),prestige:38,density:66}
];}
function institutionsFor(cities:CityProfile[],date:string):WorldInstitution[]{return cities.flatMap(city=>[
  {id:`institution-${city.id}-hospital`,cityId:city.id,kind:'hospital' as const,name:`${city.name} Regional Medical Center`,quality:city.healthcareAccess,capacity:Math.round(city.population/18000),reputation:city.healthcareAccess,status:'open' as const,lastUpdatedDate:date},
  {id:`institution-${city.id}-university`,cityId:city.id,kind:'university' as const,name:`${city.name} Metropolitan University`,quality:city.schoolQuality,capacity:Math.round(city.population/90),reputation:Math.round((city.schoolQuality+city.culture)/2),status:'open' as const,lastUpdatedDate:date},
  {id:`institution-${city.id}-transit`,cityId:city.id,kind:'transit' as const,name:`${city.name} Transit Authority`,quality:city.transit,capacity:Math.round(city.population*.35),reputation:city.transit,status:'open' as const,lastUpdatedDate:date},
  {id:`institution-${city.id}-community`,cityId:city.id,kind:'community' as const,name:`${city.name} Community Network`,quality:Math.round((city.culture+city.safety)/2),capacity:Math.round(city.population*.03),reputation:city.culture,status:'open' as const,lastUpdatedDate:date}
]);}

export function emptyLivingWorldState():LivingWorldState{return{countries:[],cities:[],neighborhoods:[],industries:[],worldInstitutions:[],companyWorldStates:[],policies:[],residencyRecords:[],regionalShocks:[],worldNews:[],worldHistory:[],migrationRecords:[],currentCityId:'',currentNeighborhoodId:null};}
export function initializeLivingWorld(world:WorldState):WorldState{
  world.countries??=[];world.cities??=[];world.neighborhoods??=[];world.industries??=[];world.worldInstitutions??=[];world.companyWorldStates??=[];world.policies??=[];world.residencyRecords??=[];world.regionalShocks??=[];world.worldNews??=[];world.worldHistory??=[];world.migrationRecords??=[];
  if(world.countries.length===0)world.countries.push(...structuredClone(countries));
  if(world.cities.length===0){world.cities.push(...structuredClone(citySeed));const start=findSeedCity(world.character.location)??customCity(world.character.location);if(!world.cities.some(c=>c.id===start.id))world.cities.push(start);world.currentCityId=start.id;}
  if(!world.currentCityId||!world.cities.some(c=>c.id===world.currentCityId)){const start=findSeedCity(world.character.location)??world.cities[0]!;world.currentCityId=start.id;}
  if(world.neighborhoods.length===0)world.neighborhoods.push(...world.cities.flatMap(neighborhoodsFor));
  if(!world.currentNeighborhoodId||!world.neighborhoods.some(n=>n.id===world.currentNeighborhoodId&&n.cityId===world.currentCityId))world.currentNeighborhoodId=world.neighborhoods.find(n=>n.cityId===world.currentCityId&&n.id.endsWith('-family'))?.id??world.neighborhoods.find(n=>n.cityId===world.currentCityId)?.id??null;
  if(world.industries.length===0)world.industries.push(...industries(world.date));
  if(world.worldInstitutions.length===0)world.worldInstitutions.push(...institutionsFor(world.cities,world.date));
  if(world.companyWorldStates.length===0)world.companyWorldStates.push(...world.employers.map(e=>({id:`company-world-${e.id}`,employerId:e.id,cityIds:[world.currentCityId],health:e.stability,growth:(e.wageIndex-1)*10,headcountIndex:e.size==='large'?100:e.size==='mid'?55:22,status:'stable' as const,lastUpdatedDate:world.date})));
  const current=world.cities.find(c=>c.id===world.currentCityId)!;const country=world.countries.find(c=>c.id===current.countryId)!;
  if(!world.residencyRecords.some(r=>r.personId===world.character.id&&r.countryId===country.id&&r.endDate===null)){const record:ResidencyRecord={id:`residency-${world.character.id}-${country.id}`,personId:world.character.id,countryId:country.id,kind:country.id==='country-us'?'citizen':'permanent_resident',startDate:world.date,endDate:null};world.residencyRecords.push(record);}
  world.character.location=`${current.name}, ${current.region}`;for(const h of world.households.filter(h=>!h.endedDate&&h.memberIds.includes(world.character.id)))h.location=world.character.location;
  return world;
}
