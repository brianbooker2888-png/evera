import { describe, expect, it } from 'vitest';
import { createWorld } from './createWorld';
import { setPlayerGoalFocus, stepWorld } from './engine';
import { attemptRelationshipStep, haveConversation, setFamilyPlan } from './relationshipEngine';
import { activeHouseholdForPerson, reassignHouseholdLabor } from './householdEngine';
import { applyParentingAction, childrenOf } from './familyEngine';
import { activeEmployment, acceptJobOffer, applyForJob } from './careerEngine';
import { activeEnrollment, startEducation } from './educationEngine';
import { buyHome, buyVehicle, chargeCreditCard, fileBankruptcy, investAmount, netWorth, openCreditCard, payLiability } from './financeEngine';
import { startAthletePath, startCoachPath, trainSport } from './sportsEngine';
import { hireBusinessEmployee, playerBusiness, startLogisticsBusiness } from './businessEngine';
import { migrateWorld } from '../persistence/migrate';

const draft={firstName:'A',lastName:'B',age:25,sex:'male' as const,orientation:'straight' as const,hometown:'Phoenix, Arizona',socioeconomicBackground:'stable' as const,ambition:70,discipline:70,empathy:60,athleticism:60};

function boostRomance<T extends ReturnType<typeof createWorld>>(world:T,npcId='npc-friend'){
  for(const r of world.relationships.filter(x=>(x.fromId===world.character.id&&x.toId===npcId)||(x.fromId===npcId&&x.toId===world.character.id))){
    r.affection=90;r.respect=90;r.attraction=92;r.familiarity=88;r.resentment=0;r.trust.emotional=92;r.trust.romantic=92;
  }
  world.npcs.find(n=>n.id===npcId)!.romantic.orientation='straight';
  return world;
}
function marriedWorld(){
  let world=boostRomance(createWorld(draft,12345));
  world=attemptRelationshipStep(world,'npc-friend','ask_date');
  world=attemptRelationshipStep(world,'npc-friend','exclusive');
  world=attemptRelationshipStep(world,'npc-friend','move_in');
  world=attemptRelationshipStep(world,'npc-friend','engage');
  return attemptRelationshipStep(world,'npc-friend','marry');
}

describe('simulation determinism',()=>{
  it('produces identical worlds from the same seed and steps',()=>{
    expect(stepWorld(createWorld(draft,12345),365)).toEqual(stepWorld(createWorld(draft,12345),365));
  });
  it('keeps bounded human state',()=>{
    const end=stepWorld(createWorld(draft,42),365);
    expect(end.character.energy).toBeGreaterThanOrEqual(0);expect(end.character.energy).toBeLessThanOrEqual(100);
    expect(end.character.stress).toBeGreaterThanOrEqual(0);expect(end.character.stress).toBeLessThanOrEqual(100);
  });
});

describe('human simulation',()=>{
  it('uses three NPC fidelity tiers and autonomous goals',()=>{
    const world=createWorld(draft,9876);
    expect(world.npcs.filter(n=>n.tier===1)).toHaveLength(2);
    expect(world.npcs.some(n=>n.tier===2)).toBe(true);
    expect(world.npcs.filter(n=>n.tier===3).every(n=>n.human===null)).toBe(true);
    const end=stepWorld(world,120);
    expect(end.npcActivity.length).toBeGreaterThan(0);
  });
  it('keeps secrets separate from player knowledge and changes focus immutably',()=>{
    const world=createWorld(draft,12345);
    expect(world.secrets.some(s=>!s.knownBy.some(k=>k.personId===world.character.id))).toBe(true);
    const target=world.character.human.goals[1]!,old=target.priority,focused=setPlayerGoalFocus(world,target.id);
    expect(focused.character.human.goals.find(g=>g.id===target.id)?.priority).toBeGreaterThanOrEqual(old);
    expect(world.character.human.goals.find(g=>g.id===target.id)?.priority).toBe(old);
  });
});

describe('Phase 3 relationships and households',()=>{
  it('supports dating through marriage and one shared household',()=>{
    const world=marriedWorld(),p=world.partnerships.find(p=>p.personIds.includes(world.character.id)&&p.personIds.includes('npc-friend'));
    expect(p?.status).toBe('married');expect(p?.cohabitingHouseholdId).toBeTruthy();
    expect(world.households.filter(h=>!h.endedDate&&h.memberIds.includes(world.character.id))).toHaveLength(1);
  });
  it('parses offline conversation intent and supports household labor',()=>{
    let world=marriedWorld();
    world=haveConversation(world,'npc-friend','I am sorry. Can we talk about our budget?');
    expect(world.conversations[0]?.intent).toBe('apologize');
    const home=activeHouseholdForPerson(world,world.character.id)!,task=home.laborAssignments[0]!;
    world=reassignHouseholdLabor(world,home.id,task.id,'npc-friend');
    expect(world.households.find(h=>h.id===home.id)?.laborAssignments.find(t=>t.id===task.id)?.ownerId).toBe('npc-friend');
  });
  it('creates a child, parenting state, and custody after divorce',()=>{
    let world=marriedWorld();const p=world.partnerships.find(p=>p.status==='married')!;
    world=setFamilyPlan(world,p.id,'trying');
    world.pregnancies.push({id:'test-pregnancy',pregnantPersonId:'npc-friend',partnerId:world.character.id,conceptionDate:world.date,dueDate:world.date,status:'ongoing',planned:true,childIds:[],outcomeDate:null});
    world=stepWorld(world,1);const child=childrenOf(world,world.character.id)[0]!;
    world=applyParentingAction(world,child.id,'quality_time');
    expect(childrenOf(world,world.character.id)[0]!.childDevelopment?.lastParentingDate).toBe(world.date);
    world=attemptRelationshipStep(world,'npc-friend','divorce');
    expect(world.custodyPlans.some(c=>c.childId===child.id&&c.active)).toBe(true);
  });
  it('keeps minor starts out of the housing ledger',()=>{
    const end=stepWorld(createWorld({...draft,age:10},77),35);
    expect(end.ledger.some(l=>l.category==='Housing')).toBe(false);
    expect(activeHouseholdForPerson(end,end.character.id)?.responsibleAdultIds).not.toContain(end.character.id);
  });
});

describe('Phase 4 education and careers',()=>{
  it('initializes employment, employers, openings and skills',()=>{
    const world=createWorld(draft,321);
    expect(world.version).toBe(8);expect(activeEmployment(world)).toBeTruthy();
    expect(world.employers.length).toBeGreaterThan(2);expect(world.jobOpenings.some(j=>j.status==='open')).toBe(true);
  });
  it('pays from the employment contract and accepts a strong offer',()=>{
    let world=createWorld(draft,555);const employment=activeEmployment(world)!;
    world=stepWorld(world,15);
    expect(world.ledger.some(l=>l.id.includes(employment.id)&&l.description.startsWith('Payroll'))).toBe(true);
    for(const s of world.skills.filter(s=>s.personId===world.character.id))s.level=95;world.character.traits.confidence=95;
    world=applyForJob(world,'job-logistics-apprentice');world=stepWorld(world,8);
    const app=world.jobApplications.find(a=>a.openingId==='job-logistics-apprentice')!;
    expect(app.status).toBe('offer');world=acceptJobOffer(world,app.id);
    expect(activeEmployment(world)?.title).toBe('Logistics Systems Apprentice');
  });
  it('supports postsecondary progress and minor school enrollment',()=>{
    let world=createWorld(draft,666);world=startEducation(world,'edu-trade','Logistics');const enrollment=activeEnrollment(world)!;
    world=stepWorld(world,32);expect(world.educationEnrollments.find(e=>e.id===enrollment.id)!.creditsEarned).toBeGreaterThan(0);
    const child=createWorld({...draft,age:10},777);expect(activeEmployment(child)).toBeUndefined();expect(activeEnrollment(child)?.level).toBe('primary');
  });
});

describe('Phase 5 money, credit, housing and wealth',()=>{
  it('initializes canonical accounts, credit and obligations',()=>{
    const world=createWorld(draft,808);
    expect(world.financialAccounts.map(a=>a.type)).toEqual(expect.arrayContaining(['checking','savings','investment','retirement']));
    expect(world.creditProfiles[0]?.score).toBeGreaterThan(600);expect(world.recurringObligations.some(o=>o.category==='Housing')).toBe(true);
  });
  it('charges housing once and keeps unpaid obligations past due',()=>{
    const end=stepWorld(createWorld(draft,809),35);expect(end.ledger.filter(l=>l.description==='Housing')).toHaveLength(1);
    const broke=createWorld({...draft,socioeconomicBackground:'struggling'},810);broke.character.cash=0;broke.financialAccounts.find(a=>a.id==='account-checking-player')!.balance=0;
    const missed=stepWorld(broke,2),groceries=missed.recurringObligations.find(o=>o.category==='Groceries')!;
    expect(groceries.pastDueAmount).toBeGreaterThan(0);expect(groceries.missedPayments).toBeGreaterThan(0);
  });
  it('supports cards, investing, financed assets, mortgages and bankruptcy',()=>{
    let world=openCreditCard(createWorld({...draft,socioeconomicBackground:'affluent'},811),3000);const card=world.liabilities.find(l=>l.kind==='credit_card')!;
    world=chargeCreditCard(world,card.id,500,'Household purchase');world=payLiability(world,card.id,200);expect(world.liabilities.find(l=>l.id===card.id)?.principal).toBe(300);
    const before=netWorth(world);world=investAmount(world,'account-investment-player','us_equity',1000);expect(Math.abs(netWorth(world)-before)).toBeLessThan(2);
    world=buyVehicle(world,'suv',30000,3000);expect(world.liabilities.some(l=>l.kind==='auto')).toBe(true);
    world=buyHome(world,180000,18000);expect(world.properties.some(p=>p.status==='owned')).toBe(true);
    world=chargeCreditCard(world,card.id,800,'Emergency expense');world=fileBankruptcy(world);expect(world.bankruptcyRecords).toHaveLength(1);
  });
});

describe('Phase 6 sports and logistics business',()=>{
  it('seeds persistent soccer and American-football pathways and fixtures',()=>{
    const world=createWorld(draft,900);
    expect(world.sportsLeagues.some(l=>l.sport==='soccer'&&l.tier==='professional')).toBe(true);
    expect(world.sportsLeagues.some(l=>l.sport==='american_football'&&l.tier==='college')).toBe(true);
    expect(world.sportsFixtures.length).toBeGreaterThan(20);
  });
  it('runs an athlete career through the shared match engine with stored moments and stats',()=>{
    let world=startAthletePath(createWorld({...draft,athleticism:82},901),'soccer','ST');
    const athlete=world.athleteProfiles.find(p=>p.personId===world.character.id&&p.sport==='soccer')!;
    expect(athlete.teamId).toBeTruthy();world=trainSport(world,'soccer','skills');world=stepWorld(world,9);
    const played=world.sportsFixtures.find(f=>f.status==='complete'&&[f.homeTeamId,f.awayTeamId].includes(athlete.teamId!));
    expect(played?.moments.length).toBeGreaterThan(0);
    expect(world.sportsSeasonStats.find(s=>s.personId===world.character.id&&s.sport==='soccer')?.games).toBeGreaterThan(0);
  });
  it('runs a coach career through the same fixture engine',()=>{
    let world=startCoachPath(createWorld(draft,902),'american_football');const coach=world.coachProfiles.find(c=>c.personId===world.character.id)!;
    expect(coach.teamId).toBeTruthy();world=stepWorld(world,9);
    const stat=world.sportsSeasonStats.find(s=>s.personId===world.character.id&&s.sport==='american_football');
    expect((stat?.wins??0)+(stat?.losses??0)).toBeGreaterThan(0);
  });
  it('keeps logistics business cash separate and produces monthly operating KPIs',()=>{
    let world=startLogisticsBusiness(createWorld(draft,903),'Desert Flow Logistics');const business=playerBusiness(world)!;
    expect(business).toBeTruthy();const personalAfterStartup=world.financialAccounts.find(a=>a.id==='account-checking-player')!.balance;
    expect(business.cash).not.toBe(personalAfterStartup);world=hireBusinessEmployee(world,'associate');world=stepWorld(world,31);
    expect(world.logisticsKpis.some(k=>k.businessId===business.id)).toBe(true);
    expect(world.businesses.find(b=>b.id===business.id)?.valuation).toBeGreaterThanOrEqual(0);
  });
});

describe('save migration',()=>{
  it('upgrades a v5-shaped save into v8 without losing prior-system history',()=>{
    const current=createWorld(draft,99);
    const{sportsLeagues,sportsTeams,sportsParticipants,athleteProfiles,coachProfiles,sportsContracts,sportsFixtures,sportsSeasonStats,businesses,warehouseFacilities,businessEmployees,logisticsContracts,logisticsKpis,businessOpportunities,healthProfiles,medicalConditions,medicalEncounters,medicalBills,medications,...phase5Rest}=current;
    void sportsLeagues;void sportsTeams;void sportsParticipants;void athleteProfiles;void coachProfiles;void sportsContracts;void sportsFixtures;void sportsSeasonStats;void businesses;void warehouseFacilities;void businessEmployees;void logisticsContracts;void logisticsKpis;void businessOpportunities;void healthProfiles;void medicalConditions;void medicalEncounters;void medicalBills;void medications;
    const legacy={...phase5Rest,version:5};const migrated=migrateWorld(legacy);
    expect(migrated?.version).toBe(8);expect(migrated?.npcs.length).toBe(current.npcs.length);expect(migrated?.financialAccounts.length).toBeGreaterThan(0);
    expect(migrated?.sportsLeagues.length).toBeGreaterThan(0);expect(migrated?.businessOpportunities.length).toBeGreaterThan(0);
    expect(migrated?.narrationSettings.mode).toBe('offline');expect(migrated?.annualLifeChapters).toEqual([]);expect(migrated?.healthProfiles.length).toBeGreaterThan(0);
  });
});
